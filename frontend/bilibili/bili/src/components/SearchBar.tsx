import { useState, useRef, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import "../styles/SearchBar.css";

export const SearchBar = () => {
  const {
    keyword,
    searchHistory,
    setKeyword,
    searchCourses,
    searchWithKeyword,
    addToHistory,
    clearHistory: clearSearchHistory,
    setPage,
  } = useSearch();

  // 添加本地状态以便在删除历史记录后更新UI
  const [localSearchHistory, setLocalSearchHistory] =
    useState<string[]>(searchHistory);

  // 同步外部searchHistory和本地状态
  useEffect(() => {
    setLocalSearchHistory(searchHistory);
  }, [searchHistory]);

  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setKeyword("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 如果搜索框内容为空，则不进行搜索
    if (keyword.trim() === "") return;

    // 使用新方法直接搜索
    searchWithKeyword(keyword);
    // 隐藏历史记录
    setShowHistory(false);
  };

  const selectHistory = (item: string) => {
    // 使用新方法直接搜索历史记录项
    searchWithKeyword(item);
    // 隐藏历史记录
    setShowHistory(false);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
    setLocalSearchHistory([]); // 更新本地状态
  };

  const handleRemoveHistoryItem = (
    e: React.MouseEvent,
    itemToRemove: string
  ) => {
    e.stopPropagation();

    // 获取当前历史记录并更新
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      const historyArray = JSON.parse(savedHistory);
      const updatedHistory = historyArray.filter(
        (item: string) => item !== itemToRemove
      );

      // 更新localStorage
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      // 更新本地状态而不是刷新页面
      setLocalSearchHistory(updatedHistory);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <div className={`search__bar ${isFocused ? "isfocus" : ""}`}>
        <form id="nav-searchform" onSubmit={handleSearch}>
          <div className={`search-content ${isFocused ? "isfocus" : ""}`}>
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              maxLength={100}
              placeholder="搜索课程"
              title="搜索课程"
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (localSearchHistory.length > 0) {
                  setShowHistory(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
            />

            {keyword && (
              <div className="nav-search-clean" onClick={handleClear}>
                {/* <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 14.75C11.7279 14.75 14.75 11.7279 14.75 8C14.75 4.27208 11.7279 1.25 8 1.25C4.27208 1.25 1.25 4.27208 1.25 8C1.25 11.7279 4.27208 14.75 8 14.75ZM9.64999 5.64303C9.84525 5.44777 10.1618 5.44777 10.3571 5.64303C10.5524 5.83829 10.5524 6.15487 10.3571 6.35014L8.70718 8.00005L10.3571 9.64997C10.5524 9.84523 10.5524 10.1618 10.3571 10.3571C10.1618 10.5523 9.84525 10.5523 9.64999 10.3571L8.00007 8.70716L6.35016 10.3571C6.15489 10.5523 5.83831 10.5523 5.64305 10.3571C5.44779 10.1618 5.44779 9.84523 5.64305 9.64997L7.29296 8.00005L5.64305 6.35014C5.44779 6.15487 5.44779 5.83829 5.64305 5.64303C5.83831 5.44777 6.15489 5.44777 6.35016 5.64303L8.00007 7.29294L9.64999 5.64303Z"></path>
                </svg> */}
              </div>
            )}
          </div>
          <div className="search-btn" onClick={handleSearch}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </form>
      </div>

      {/* 搜索历史 */}
      {showHistory && localSearchHistory.length > 0 && (
        <div className="search-history" ref={historyRef}>
          <div className="history-header">
            <h3 className="history-title">搜索历史</h3>
            <button className="clear-history" onClick={handleClearHistory}>
              清空
            </button>
          </div>
          <div className="history-list">
            {localSearchHistory.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => selectHistory(item)}
              >
                {item}
                <div
                  className="history-item-close"
                  onClick={(e) => handleRemoveHistoryItem(e, item)}
                >
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
