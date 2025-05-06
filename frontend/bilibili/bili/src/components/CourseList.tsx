import { useSearch } from "../context/SearchContext";
import { Course } from "../util/api";
import React from "react";
// import { useCallback } from "react";
import "../styles/CourseList.css";

// 格式化价格：显示小数点后一位，但整数不补0
const formatPrice = (price: number): string => {
  // 四舍五入到一位小数
  const rounded = Math.round(price * 10) / 10;
  // 检查是否为整数
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
};

// 格式化学生数量：超过10000显示为x万
const formatStudentCount = (count: number = 0): string => {
  if (count >= 10000) {
    // 转换为万为单位
    const wan = count / 10000;
    // 四舍五入到一位小数
    const rounded = Math.round(wan * 10) / 10;
    // 检查是否为整数
    return (rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1)) + "万";
  }
  // 小于1万，直接显示数字
  return count.toString();
};
// 标题格式化

// 网格样式卡片
const GridCard = ({ course }: { course: Course }) => {
  // 使用useCallback避免每次重渲染时创建新函数
  // const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
  //   if (e.currentTarget.src !== 'https://via.placeholder.com/236x133.png?text=暂无封面') {
  //     console.error(`图片加载失败: ${course.cover}`);
  //     e.currentTarget.src = 'https://via.placeholder.com/236x133.png?text=暂无封面';
  //   }
  // }, [course.cover]);

  // const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
  //   if (e.currentTarget.src !== 'https://via.placeholder.com/50x50.png?text=讲师') {
  //     console.error(`头像加载失败: ${course.teacherAvatar}`);
  //     e.currentTarget.src = 'https://via.placeholder.com/50x50.png?text=讲师';
  //   }
  // }, [course.teacherAvatar]);
  const markup = { __html: course.title };
  return (
    <div className="course-card">
      <div className="thumbnail-wrapper">
        <img
          src={
            course.cover ||
            "https://via.placeholder.com/236x133.png?text=暂无封面"
          }
          alt={course.title}
          className="thumbnail"
          referrerPolicy="no-referrer"
          // onError={handleImageError}
          loading="lazy"
        />
        <div className="course-stats">
          <img
            className="course-img"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUxpcf///////////////////////////////////////////////9z4L/oAAAAMdFJOUwDmF/hBtHJNf74rm+L4x9YAAABtSURBVCjPY2CgCnCVOQMFB0NAfI4zSKABKOBjpgBTy5R8BEjGJCB0sx0FEjIKCAGmg0DiDLIFZ3AKlKML2EgooAqcOWO9AE3gzMkCNIEzJwkJoGtBMxTD2nKCTkcWwPA+RgBhBCFGIGNEA+UAACoDWLdHxJueAAAAAElFTkSuQmCC"
          ></img>
          <span className="student-count">
            {formatStudentCount(course.studentCount)}
          </span>
          <span className="chapter-count">
            共{course.chapterCount || 0}课时
          </span>
        </div>
      </div>
      <div className="card-content">
        <h3 className="course-title" title={course.title}>
          <div dangerouslySetInnerHTML={markup} />
        </h3>
        <div className="course-info">
          <p className="course-brief">{course.subtitle || "暂无简介"}</p>
          <div className="price-info">
            <span className="price">{formatPrice(course.price)}元</span>
            {course.originalPrice !== undefined &&
              course.originalPrice > course.price && (
                <span className="original-price">
                  {formatPrice(course.originalPrice)}元
                </span>
              )}
          </div>
        </div>
        {course.tags && course.tags.length > 0 && (
          <div className="course-tag-container">
            <span className="course-tag">{course.tags[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 列表样式卡片
const ListCard = ({ course }: { course: Course }) => {
  const markup = { __html: course.title };
  return (
    <div className="course-list-card">
      <div className="list-content-wrapper">
        <div className="list-thumbnail-wrapper">
          <img
            src={
              course.cover ||
              "https://via.placeholder.com/236x133.png?text=暂无封面"
            }
            alt={course.title}
            className="list-thumbnail"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="list-stats">
            <img
              className="course-img"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUxpcf///////////////////////////////////////////////9z4L/oAAAAMdFJOUwDmF/hBtHJNf74rm+L4x9YAAABtSURBVCjPY2CgCnCVOQMFB0NAfI4zSKABKOBjpgBTy5R8BEjGJCB0sx0FEjIKCAGmg0DiDLIFZ3AKlKML2EgooAqcOWO9AE3gzMkCNIEzJwkJoGtBMxTD2nKCTkcWwPA+RgBhBCFGIGNEA+UAACoDWLdHxJueAAAAAElFTkSuQmCC"
            ></img>
            <span className="list-student-count">
              {formatStudentCount(course.studentCount)}
            </span>
            <span className="list-chapter-count">
              共{course.chapterCount || 0}课时
            </span>
          </div>
        </div>
        <div className="list-content">
          <h3 className="list-title">
            <div dangerouslySetInnerHTML={markup} />
          </h3>
          <p className="list-brief">{course.subtitle || "暂无简介"}</p>
          <div className="list-price-container">
            <span className="list-price">{formatPrice(course.price)}元</span>
            {course.originalPrice !== undefined &&
              course.originalPrice > course.price && (
                <span className="list-original-price">
                  {formatPrice(course.originalPrice)}元
                </span>
              )}
          </div>
          {course.firstEpTitle && (
            <div className="list-ep-info">
              <span className="list-ep-play-icon"></span>
              {course.firstEpLabel && (
                <span className="list-ep-label">{course.firstEpLabel}</span>
              )}
              <span className="list-ep-title">{course.firstEpTitle}</span>
            </div>
          )}
        </div>
        {course.tags && course.tags.length > 0 && (
          <div className="list-tag-container">
            <span className="list-highlight-tag">{course.tags[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 课程列表组件
interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  // 使用默认值防止viewMode为undefined
  const { viewMode = "grid", loading = false } = useSearch() || {};

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return <div className="courses-empty"></div>;
  }

  return (
    <div className={`courses-container ${viewMode}`}>
      {courses.map((course) =>
        viewMode === "grid" ? (
          <GridCard key={course.id} course={course} />
        ) : (
          <ListCard key={course.id} course={course} />
        )
      )}
    </div>
  );
};

export default CourseList;
