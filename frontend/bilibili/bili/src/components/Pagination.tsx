import { useState, useEffect } from "react";
import '../styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  console.log('Pagination组件渲染 - 当前页:', currentPage, '总页数:', totalPages);

  const [inputPage, setInputPage] = useState<string>(currentPage.toString());

  // 更新输入框的值当页码变化时
  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  // 强制至少显示2页，确保分页组件显示
  const effectiveTotalPages = Math.max(totalPages, 2);

  // 页码计算 - 简化逻辑，只显示首页、末页和当前页面的上下页码
  const getPageNumbers = () => {
    // 添加页码
    const pageNumbers = new Set<number>(); // 使用Set来避免重复添加页码

    // 总是添加首页
    pageNumbers.add(1);

    // 当前页是第1页时，特殊处理，添加前3页
    if (currentPage === 1) {
      if (effectiveTotalPages >= 2) pageNumbers.add(2);
      if (effectiveTotalPages >= 3) pageNumbers.add(3);
    }
    // 当前页是最后一页时，特殊处理，添加倒数三页
    else if (currentPage === effectiveTotalPages) {
      if (effectiveTotalPages >= 3) pageNumbers.add(effectiveTotalPages - 2);
      if (effectiveTotalPages >= 2) pageNumbers.add(effectiveTotalPages - 1);
      pageNumbers.add(effectiveTotalPages);
    }
    else {
      // 正常情况下，添加当前页
      pageNumbers.add(currentPage);

      // 添加当前页的上一页（如果不是首页）
      if (currentPage > 2) {
        pageNumbers.add(currentPage - 1);
      }

      // 添加当前页的下一页（如果不是末页）
      if (currentPage < effectiveTotalPages) {
        pageNumbers.add(currentPage + 1);
      }
    }

    // 总是添加末页（如果页数大于3）
    if (effectiveTotalPages > 3) {
      pageNumbers.add(effectiveTotalPages);
    }

    // 将Set转换为数组并排序
    const sortedPageNumbers = Array.from(pageNumbers).sort((a: number, b: number) => a - b);

    // 添加省略号
    const result: (number | string)[] = [];
    for (let i = 0; i < sortedPageNumbers.length; i++) {
      const current = sortedPageNumbers[i];

      // 添加当前页码
      result.push(current);

      // 检查是否需要添加省略号
      if (i < sortedPageNumbers.length - 1) {
        const next = sortedPageNumbers[i + 1];
        if (next - current > 1) {
          result.push("...");
        }
      }
    }

    // 在最终数组前后添加上一页和下一页按钮
    const finalResult: (number | string)[] = [];

    // 添加上一页按钮（只在非第一页时显示）
    if (currentPage > 1) {
      finalResult.push("prev");
    }

    // 添加所有页码和省略号
    finalResult.push(...result);

    // 添加下一页按钮（只在非最后一页时显示）
    if (currentPage < effectiveTotalPages) {
      finalResult.push("next");
    }

    return finalResult;
  };

  // 处理页码输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setInputPage(value);
  };

  // 跳转到指定页
  const handleJump = () => {
    const pageNum = parseInt(inputPage, 10);
    if (pageNum >= 1 && pageNum <= effectiveTotalPages && pageNum !== currentPage) {
      onPageChange(pageNum);
    } else {
      setInputPage(currentPage.toString()); // 输入无效或未改变，重置输入框
    }
  };

  // 回车跳转
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // 如果总页数小于等于1，不渲染分页组件
  }

  const renderPageButton = (pageNum: number | string, index: number) => {
    const isCurrent = typeof pageNum === 'number' && pageNum === currentPage;
    const isEllipsis = pageNum === "...";
    const isPrev = pageNum === "prev";
    const isNext = pageNum === "next";

    if (isEllipsis) {
      return <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>;
    }

    let buttonClass = "page-button";
    let clickHandler = () => { };
    let buttonText: number | string = '';

    if (isPrev) {
      clickHandler = () => onPageChange(currentPage - 1);
      buttonText = "上一页";
    } else if (isNext) {
      clickHandler = () => onPageChange(currentPage + 1);
      buttonText = "下一页";
    } else { // Page number
      buttonClass += isCurrent ? " active" : "";
      clickHandler = () => !isCurrent && typeof pageNum === 'number' && onPageChange(pageNum);
      buttonText = pageNum;
    }

    return (
      <button
        key={isPrev ? 'prev' : isNext ? 'next' : `page-${pageNum}`}
        className={buttonClass}
        onClick={clickHandler}
        disabled={isCurrent}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className="pagination-container">
      <nav className="pagination-nav">
        {pageNumbers.map((pageNum, index) => renderPageButton(pageNum, index))}
      </nav>

      <div className="pagination-jump">
        <span className="pagination-jump-text total">共{effectiveTotalPages}页</span>
        <span className="pagination-jump-text">跳至</span>
        <input
          type="text"
          className="pagination-jump-input"
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleJump}
        />
        <span className="pagination-jump-text">页</span>
      </div>
    </div>
  );
};

export default Pagination;
