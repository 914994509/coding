import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { fetchCourses, Course, SearchParams, SearchResult } from '../util/api';

interface SearchContextType {
  keyword: string;
  category: string;
  sortType: string;
  viewMode: 'grid' | 'list';
  page: number;
  pageSize: number;
  loading: boolean;
  courses: Course[];
  extraCourses: Course[];
  totalPages: number;
  searchHistory: string[];
  setKeyword: (keyword: string) => void;
  setCategory: (category: string) => void;
  setSortType: (sortType: string) => void;
  setViewMode: (viewMode: 'grid' | 'list') => void;
  setPage: (page: number) => void;
  searchCourses: () => Promise<void>;
  searchWithKeyword: (keyword: string) => Promise<void>;
  addToHistory: (keyword: string) => void;
  clearHistory: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

// 生成模拟课程数据
const mockCourses = (count: number, keyword: string = '', isExtra: boolean = false): Course[] => {
  return Array(count).fill(0).map((_, i) => ({
    id: isExtra ? 1000 + i : i + 1,
    title: `${keyword ? keyword + ' - ' : ''}${isExtra ? '推荐课程' : '主要课程'} ${i + 1}`,
    brief: `这是一个关于${keyword || '技能提升'}的精彩课程，让你快速掌握核心要点。`,
    cover: `https://via.placeholder.com/236x133.png?text=${isExtra ? '推荐' : '主要'}${i + 1}`,
    price: Math.floor(Math.random() * 200) + 50,
    originalPrice: Math.floor(Math.random() * 300) + 150,
    teacherName: `讲师${i + 1}`,
    teacherAvatar: `https://via.placeholder.com/48x48.png?text=讲师`,
    totalTime: `${Math.floor(Math.random() * 50) + 10}课时`,
    studentCount: Math.floor(Math.random() * 10000) + 100,
    chapterCount: Math.floor(Math.random() * 20) + 5,
    tags: ['入门', '进阶', '实战'].slice(0, Math.floor(Math.random() * 3) + 1),
    isExtra: isExtra
  }));
};

// 获取排序类型
const getSortType = (sortType: string): string => {
  switch (sortType) {
    case '1': return 'sales';
    case '2': return 'latest';
    case '3': return 'price_asc';
    case '4': return 'price_desc';
    default: return '';
  }
};

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [keyword, setKeyword] = useState<string>('跑步');
  const [category, setCategory] = useState<string>('-1');
  const [sortType, setSortType] = useState<string>('-1');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [extraCourses, setExtraCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState<number>(5); // 默认设置为5页以确保分页组件始终显示
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // 使用ref保存最新的状态
  const pageRef = useRef(page);
  const keywordRef = useRef(keyword);
  const categoryRef = useRef(category);
  const sortTypeRef = useRef(sortType);

  // 当状态变化时更新ref
  useEffect(() => {
    pageRef.current = page;
    keywordRef.current = keyword;
    categoryRef.current = category;
    sortTypeRef.current = sortType;
  }, [page, keyword, category, sortType]);

  // 添加搜索历史
  const addToHistory = useCallback((kw: string) => {
    if (kw.trim() === '') return;

    setSearchHistory(prev => {
      // 去重并将新关键词添加到最前面
      const newHistory = [kw, ...prev.filter(item => item !== kw)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 清空搜索历史
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  // 搜索课程函数，不依赖于状态变量
  const doSearch = useCallback(async (
    searchKeyword: string,
    searchCategory: string,
    searchSortType: string,
    searchPage: number
  ) => {
    setLoading(true);
    console.log(`执行搜索: 关键词=${searchKeyword}, 分类=${searchCategory}, 排序=${searchSortType}, 页码=${searchPage}`);

    try {
      // 构建搜索参数
      const params: SearchParams = {
        word: searchKeyword,
        classification_id: searchCategory,
        sort_type: getSortType(searchSortType),
        page: searchPage,
        page_size: pageSize
      };

      // 调用API获取课程数据
      const result: SearchResult = await fetchCourses(params);

      // 更新课程数据
      setCourses(result.courses);
      setExtraCourses(result.extraCourses);

      // 更新总页数
      // 我们总是相信API返回的页数，如果API返回的页数合理
      if (result.totalPages > 0) {
        setTotalPages(result.totalPages);
        console.log(`更新总页数: API返回 ${result.totalPages} 页`);
      } else {
        // API没有返回有效的页数，保持当前页数
        console.log(`保持当前总页数: ${totalPages} 页`);
      }

      console.log(`搜索成功: 获取到${result.courses.length}条课程, 当前页 ${searchPage}/${totalPages}`);

      // 添加关键词到搜索历史
      if (searchKeyword) {
        addToHistory(searchKeyword);
      }

    } catch (error) {
      console.error('搜索课程失败:', error);

      // 使用模拟数据作为备用
      const mockMainCourses = mockCourses(15, searchKeyword);
      const mockExtraCourses = mockCourses(12, searchKeyword, true);

      setCourses(mockMainCourses);
      setExtraCourses(mockExtraCourses);

      // 确保模拟数据有足够的页数
      if (totalPages < 5) {
        setTotalPages(5);
        console.log(`设置模拟总页数: 5页`);
      } else {
        console.log(`保持当前总页数: ${totalPages}页`);
      }
    } finally {
      setLoading(false);
    }
  }, [pageSize, addToHistory, totalPages]);

  // 搜索课程 - 使用当前状态
  const searchCourses = useCallback(async () => {
    await doSearch(keywordRef.current, categoryRef.current, sortTypeRef.current, pageRef.current);
  }, [doSearch]);

  // 修改setKeyword，只更新关键词不触发搜索
  const handleSetKeyword = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    // 不再自动触发搜索
  }, []);

  // 修改setCategory，重置页码并触发搜索
  const handleSetCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1); // 重置页码
    doSearch(keywordRef.current, newCategory, sortTypeRef.current, 1);
  }, [doSearch]);

  // 修改setSortType，重置页码并触发搜索
  const handleSetSortType = useCallback((newSortType: string) => {
    setSortType(newSortType);
    setPage(1); // 重置页码
    doSearch(keywordRef.current, categoryRef.current, newSortType, 1);
  }, [doSearch]);

  // 修改setPage，直接触发搜索
  const handleSetPage = useCallback((newPage: number) => {
    console.log(`切换到第${newPage}页`);
    setPage(newPage);
    doSearch(keywordRef.current, categoryRef.current, sortTypeRef.current, newPage);
  }, [doSearch]);

  // 直接使用指定关键词搜索
  const searchWithKeyword = useCallback(async (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setPage(1); // 重置页码
    await doSearch(searchKeyword, categoryRef.current, sortTypeRef.current, 1);
    if (searchKeyword.trim() !== '') {
      addToHistory(searchKeyword);
    }
  }, [doSearch, addToHistory]);

  // 组件挂载后自动搜索
  useEffect(() => {
    searchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: SearchContextType = {
    keyword,
    category,
    sortType,
    viewMode,
    page,
    pageSize,
    loading,
    courses,
    extraCourses,
    totalPages,
    searchHistory,
    setKeyword: handleSetKeyword,
    setCategory: handleSetCategory,
    setSortType: handleSetSortType,
    setViewMode,
    setPage: handleSetPage,
    searchCourses,
    searchWithKeyword,
    addToHistory,
    clearHistory
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
