import React from "react";
import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import FilterSection from "./FilterSection";
import CourseList from "./CourseList";
import Pagination from "./Pagination";
import { Category, fetchCategories, SORT_OPTIONS } from "../util/api";

const CourseContent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "-1", name: "全部分类" },
  ]);
  const [sortoptions, setSortOptions] = useState<SORT_OPTIONS[]>([
    { id: "-1", title: "综合排序" },
  ]);

  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const { keyword, loading, courses, extraCourses, totalPages, page, setPage } =
    useSearch();

  // 获取分类数据
  useEffect(() => {
    const getCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoryError(null);
        const result = await fetchCategories();
        // 处理分类数据
        console.log(result);
        if (result && result.sortoptions) {
          setSortOptions(result.sortoptions);
          console.log("获取到排序数据:", result.sortoptions);
        } else {
          setSortOptions([
            { id: "-1", title: "综合排序" },
            { id: "1", title: "销量最高" },
            { id: "2", title: "最新上架" },
            { id: "3", title: "价格最低" },
            { id: "4", title: "价格最高" },
          ]);
        }

        // 处理分类数据
        if (result && result.categories) {
          setCategories(result.categories);
          console.log("获取到分类数据:", result.categories);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
        setCategoryError("获取分类数据失败，使用默认分类");
        // 如果API请求失败，使用备用的硬编码数据
        setCategories([
          { id: "-1", name: "全部分类" },
          { id: "1", name: "通识科普" },
          { id: "2", name: "兴趣生活" },
          { id: "3", name: "语言学习" },
          { id: "4", name: "考研" },
          { id: "5", name: "考试·考证" },
          { id: "6", name: "影视·创作" },
          { id: "7", name: "职业职场" },
          { id: "8", name: "个人成长" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    getCategories();
  }, []);

  console.log(
    "CourseContent - 总页数:",
    totalPages,
    "课程数量:",
    courses.length,
    "当前页码:",
    page
  );

  return (
    <div className="course-content bg-[#f6f7f8] pb-6">
      <div
        className="container mx-auto"
        style={{ width: "1248px", boxSizing: "border-box", padding: "0 16px" }}
      >
        {/* 分类错误提示 */}
        {categoryError && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <p>{categoryError}</p>
          </div>
        )}

        {/* 筛选栏 */}
        {categoriesLoading ? (
          <div
            className="filter_cond_box"
            style={{ width: "1248px", margin: "0 auto" }}
          >
            <div className="cond_wrapper">
              <div className="radio-button-box-wrap nav">
                <div className="category-placeholder"></div>
              </div>
              <div className="radio-button-box-wrap normal">
                <div className="category-placeholder"></div>
              </div>
            </div>
          </div>
        ) : (
          <FilterSection categories={categories} sortoptions={sortoptions} />
        )}

        {/* 主要课程区域 */}
        <div className="mb-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00a1d6]"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <>
              {courses.length > 0 ? (
                <>
                  <CourseList courses={courses} />
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-md shadow-sm">
                  {/* <div className="text-5xl mb-4">😢</div>
                  <p className="text-gray-600">没有找到相关课程，请尝试其他关键词</p> */}
                </div>
              )}
            </>
          )}
        </div>

        {/* 额外推荐课程区域 */}
        {extraCourses && extraCourses.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-md shadow-sm p-4 mb-4">
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                推荐课程
              </h2>
              <CourseList courses={extraCourses} />
            </div>
          </div>
        )}

        {/* 分页组件 - 无论如何都显示，只要总页数>1 */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
