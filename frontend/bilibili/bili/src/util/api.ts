import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.bilibili.com', // 直接使用B站API，Whistle已配置好CORS
  timeout: 10000,
  headers: {
    'accept': 'application/json, text/plain, */*'
  }
});

export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  cover?: string;
  price: number;
  originalPrice?: number;
  teacherName?: string;
  teacherAvatar?: string;
  totalTime?: string; // 总时长
  studentCount?: number; // 学习人数
  chapterCount?: number; // 章节数量
  tags?: string[]; // 课程标签
  rating?: number; // 评分
  link?: string; // 课程链接
  firstEpLabel?: string; // 第一集标签
  firstEpTitle?: string; // 第一集标题
  statusLabel?: string; // 状态标签
  isExtra?: boolean; // 是否是额外推荐项目
}

export interface SearchParams {
  word?: string;
  classification_id?: string;
  sort_type?: string;
  page?: number;
  page_size?: number;
}

export interface Category {
  id: string;
  name: string;
}
export interface SORT_OPTIONS {
  id: string;
  title: string;
}
export interface SearchResult {
  courses: Course[];
  extraCourses: Course[];
  totalPages: number;
}

// 处理B站图片URL，确保能正确显示
function processImageUrl(url?: string): string {
  if (!url) return 'https://via.placeholder.com/236x133.png?text=暂无图片';

  // 记录原始URL
  console.log('处理前图片URL:', url);

  // 移除URL中可能的@前缀参数（B站有时会添加@前缀参数）
  let processedUrl = url.split('@')[0];

  // 确保使用HTTPS
  if (processedUrl.startsWith('http:')) {
    processedUrl = processedUrl.replace('http:', 'https:');
  }

  // 如果URL不以http开头，添加https前缀
  if (!processedUrl.startsWith('http')) {
    processedUrl = `https:${processedUrl}`;
  }

  console.log('处理后图片URL:', processedUrl);
  return processedUrl;
}

// 将API返回的数据转换为Course对象
function convertToCourse(item: any, isExtra: boolean = false): Course {
  // 解析价格字符串，移除单位（元或B币）
  let price = 0;
  let originalPrice = undefined;

  if (item.price_format) {
    price = parseFloat(item.price_format);
  }

  // 处理优惠券价格
  if (item.coupon_price_format) {
    originalPrice = price;
    price = parseFloat(item.coupon_price_format);
  }

  // 提取学习人数（观看次数）
  const studentCount = item.stat?.view || 0;

  return {
    id: item.seasonId,
    title: item.title,
    subtitle: item.subtitle,
    cover: processImageUrl(item.cover),
    price: price,
    originalPrice: originalPrice,
    teacherName: item.up_name,
    teacherAvatar: processImageUrl(item.up_icon),
    totalTime: item.ep_count_show?.replace('共', '') || `${item.ep_count || 0}课时`,
    studentCount: studentCount,
    chapterCount: item.ep_count || 0,
    tags: item.tags || [],
    link: item.link,
    firstEpLabel: item.first_ep_label,
    firstEpTitle: item.first_ep_title,
    statusLabel: item.status_label,
    isExtra: isExtra
  };
}

export async function fetchCourses(params: SearchParams): Promise<SearchResult> {
  try {
    // 使用seasonSeek接口
    const apiParams = {
      classification_id: params.classification_id || '-1',
      sort_type: getSortTypeForBili(params.sort_type),
      page_size: params.page_size || 30,
      page: params.page || 1,
      word: params.word || ''
    };

    // 请求B站课堂API
    const response = await api.get('/pugv/app/web/seasonSeek', {
      params: apiParams
    });

    console.log('API响应状态:', response.status);

    if (response.data && response.data.code === 0 && response.data.data) {
      const responseData = response.data.data;

      // 打印第一个课程项，查看图片URL结构
      if (responseData.items && responseData.items.length > 0) {
        console.log('样本课程项:', {
          cover: responseData.items[0].cover,
          up_icon: responseData.items[0].up_icon
        });
      }

      // 打印分页信息
      if (responseData.page) {
        console.log('API返回的分页信息:', responseData.page);
      }

      // 处理返回数据中的主要课程列表
      const mainCourses: Course[] = (responseData.items || []).map((item: any) =>
        convertToCourse(item, false)
      );

      // 处理返回数据中的额外课程列表
      const extraCourses: Course[] = (responseData.extra_data?.extra_items || []).map((item: any) =>
        convertToCourse(item, true)
      );

      // 计算总页数
      // 如果API提供了total和size，则用它们计算总页数
      let totalPages = 1;
      if (responseData.page?.total && responseData.page?.size) {
        totalPages = Math.ceil(responseData.page.total / responseData.page.size);
        console.log(`计算总页数: ${responseData.page.total}(总条目) / ${responseData.page.size}(每页条数) = ${totalPages}页`);
      }

      // 返回处理好的数据
      return {
        courses: mainCourses,
        extraCourses: extraCourses,
        totalPages: totalPages
      };
    } else {
      console.error('获取课程失败: 无效响应', response.data);
      throw new Error(`API返回错误: ${response.data?.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('获取课程失败: 网络错误', error);
    throw error;
  }
}

// 将排序类型转换为B站API需要的格式
function getSortTypeForBili(sortType?: string): string {
  switch (sortType) {
    case 'sales': return '1'; // 销量最高
    case 'latest': return '2'; // 最新上架
    case 'price_asc': return '3'; // 价格最低
    case 'price_desc': return '4'; // 价格最高
    default: return '0'; // 综合排序
  }
}


export const fetchCategories = async (): Promise<{ categories: Category[];sortoptions:SORT_OPTIONS[] }> => {
  try {
    // 获取分类数据
    const response = await api.get('/pugv/app/web/classifications/new');

    if (response.data && response.data.code === 0 && response.data.data && response.data.data.classification_list) {
      // 从 classification_list 中提取分类数据
      const categories: Category[] = response.data.data.classification_list.map((cat: any) => ({
        id: cat.id.toString(),
        name: cat.name,
      }));
      const sortoptions:SORT_OPTIONS[] = response.data.data.season_search_sort_type_list.map((cat: any) => ({
        id: cat.id.toString(),
        title: cat.title,
      }));

      
      console.log('获取到分类数据:', categories , sortoptions);
      return { categories, sortoptions };
    } else {
      console.error('获取分类失败: 无效响应', response.data);
      throw new Error(`获取分类失败: ${response.data?.message || '未知错误'}`);
    }
  } catch (error) {
    console.error('获取分类失败: 网络错误', error);
    throw error;
  }
};
// export const SORT_OPTIONS = [
//   { id: '-1', name: '综合排序' },
//   { id: '1', name: '销量最高' },
//   { id: '2', name: '最新上架' },
//   { id: '3', name: '价格最低' },
//   { id: '4', name: '价格最高' }
// ];