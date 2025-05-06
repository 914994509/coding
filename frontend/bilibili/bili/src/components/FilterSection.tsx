import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { Category, SORT_OPTIONS } from "../util/api";
import { Bars3Icon } from "@heroicons/react/24/outline";
import "../styles/CategoryNav.css";

interface FilterSectionProps {
  categories: Category[];
  sortoptions: SORT_OPTIONS[];
}

const FilterSection = ({ categories, sortoptions }: FilterSectionProps) => {
  const {
    category,
    sortType,
    viewMode,
    setCategory,
    setSortType,
    setViewMode,
  } = useSearch();
  console.log("FilterSection - 传入的分类数据adad:", categories);
  console.log("FilterSection - 传入的排序选项dadad:", sortoptions);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 显示的分类数量
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 8); // 只显示前8个

  // 切换视图模式
  const setListView = () => {
    setViewMode("list");
  };

  const setGridView = () => {
    setViewMode("grid");
  };

  // 添加组件挂载后的效果，确保过渡平滑
  useEffect(() => {
    // 使用短时延迟确保DOM已完全渲染
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="filter_cond_box">
      <div className="cond_wrapper">
        <div className="radio-button-box-wrap nav">
          <div
            className="radio-button-box"
            style={{
              display: "flex",
              opacity: isLoaded ? 1 : 0.8,
              transition: "opacity 0.3s ease",
            }}
          >
            {/* ssssssssssssssssssssasssss */}
            {categories.map((cat, index) => (
              <div className="item" key={cat.id}>
                <input
                  type="radio"
                  hidden
                  id={cat.id.toString()}
                  value={cat.id.toString()}
                />
                <button
                  id={category === cat.id ? "selected" : ""}
                  className={`btn ${category === cat.id ? "selected" : ""} ${index === 0 ? "no-left-padding" : ""}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="raido-text">{cat.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="radio-button-box-wrap normal">
          <div
            className="radio-button-box"
            style={{
              display: "flex",
              opacity: isLoaded ? 1 : 0.8,
              transition: "opacity 0.3s ease",
            }}
          >
            {sortoptions.map((cat, index) => (
              <div className="item" key={cat.id}>
                <input
                  type="radio"
                  hidden
                  id={cat.id.toString()}
                  value={cat.id.toString()}
                />
                <button
                  id={sortType === cat.id ? "selected" : ""}
                  className={`btn ${sortType === cat.id ? "selected" : ""} ${index === 0 ? "no-left-padding" : ""}`}
                  onClick={() => setSortType(cat.id)}
                >
                  <span className="raido-text">{cat.title}</span>
                </button>
              </div>
            ))}
            {/* 
            <div className="item">
              <input type="radio" hidden id="-1" value="-1" />
              <button
                id={sortType === "-1" ? "selected" : ""}
                className={`btn ${sortType === "-1" ? "selected" : ""} no-left-padding`}
                onClick={() => setSortType("-1")}
              >
                <span className="raido-text">综合排序</span>
              </button>
            </div>
            <div className="item">
              <input type="radio" hidden id="1" value="1" />
              <button
                id={sortType === "1" ? "selected" : ""}
                className={`btn ${sortType === "1" ? "selected" : ""}`}
                onClick={() => setSortType("1")}
              >
                <span className="raido-text">销量最高</span>
              </button>
            </div>
            <div className="item">
              <input type="radio" hidden id="2" value="2" />
              <button
                id={sortType === "2" ? "selected" : ""}
                className={`btn ${sortType === "2" ? "selected" : ""}`}
                onClick={() => setSortType("2")}
              >
                <span className="raido-text">最新上架</span>
              </button>
            </div>
            <div className="item">
              <input type="radio" hidden id="3" value="3" />
              <button
                id={sortType === "3" ? "selected" : ""}
                className={`btn ${sortType === "3" ? "selected" : ""}`}
                onClick={() => setSortType("3")}
              >
                <span className="raido-text">售价最低</span>
              </button>
            </div> */}
          </div>

          {/* 添加视图模式切换按钮 */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={setListView}
              title="列表视图"
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <title>大卡</title>
                <g
                  id="最终稿"
                  stroke="none"
                  strokeWidth="1"
                  fill="currentColor"
                  fillRule="evenodd"
                >
                  <g id="编组-6备份">
                    <g>
                      <g>
                        <g>
                          <rect
                            id="矩形"
                            x="0"
                            y="0"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                          <rect
                            id="矩形备份-7"
                            x="0"
                            y="7.77777778"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                          <path
                            d="M8.55555556,0.777777778 L13.2222222,0.777777778 C13.651777,0.777777778 14,1.12600075 14,1.55555556 C14,1.98511036 13.651777,2.33333333 13.2222222,2.33333333 L8.55555556,2.33333333 C8.12600075,2.33333333 7.77777778,1.98511036 7.77777778,1.55555556 C7.77777778,1.12600075 8.12600075,0.777777778 8.55555556,0.777777778 Z"
                            id="矩形"
                          ></path>
                          <path
                            d="M8.55555556,8.55555556 L13.2222222,8.55555556 C13.651777,8.55555556 14,8.90377853 14,9.33333333 C14,9.76288814 13.651777,10.1111111 13.2222222,10.1111111 L8.55555556,10.1111111 C8.12600075,10.1111111 7.77777778,9.76288814 7.77777778,9.33333333 C7.77777778,8.90377853 8.12600075,8.55555556 8.55555556,8.55555556 Z"
                            id="矩形备份-9"
                          ></path>
                          <path
                            d="M8.55555556,3.88888889 L13.2222222,3.88888889 C13.651777,3.88888889 14,4.23711186 14,4.66666667 C14,5.09622147 13.651777,5.44444444 13.2222222,5.44444444 L8.55555556,5.44444444 C8.12600075,5.44444444 7.77777778,5.09622147 7.77777778,4.66666667 C7.77777778,4.23711186 8.12600075,3.88888889 8.55555556,3.88888889 Z"
                            id="矩形备份-8"
                          ></path>
                          <path
                            d="M8.55555556,11.6666667 L13.2222222,11.6666667 C13.651777,11.6666667 14,12.0148896 14,12.4444444 C14,12.8739992 13.651777,13.2222222 13.2222222,13.2222222 L8.55555556,13.2222222 C8.12600075,13.2222222 7.77777778,12.8739992 7.77777778,12.4444444 C7.77777778,12.0148896 8.12600075,11.6666667 8.55555556,11.6666667 Z"
                            id="矩形备份-10"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
            <button
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={setGridView}
              title="网格视图"
            >
              <svg
                width="14px"
                height="14px"
                viewBox="0 0 14 14"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <title>小卡</title>
                <g
                  id="最终稿"
                  stroke="none"
                  strokeWidth="1"
                  fill="currentColor"
                  fillRule="evenodd"
                >
                  <g
                    id="编组-6备份"
                    transform="translate(-34.000000, 0.000000)"
                  >
                    <g id="编组-7">
                      <g transform="translate(34.000000, 0.000000)">
                        <g id="编组备份">
                          <rect
                            id="矩形"
                            x="0"
                            y="0"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                          <rect
                            id="矩形备份-11"
                            x="7.77777778"
                            y="0"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                          <rect
                            id="矩形备份-7"
                            x="0"
                            y="7.77777778"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                          <rect
                            id="矩形备份-12"
                            x="7.77777778"
                            y="7.77777778"
                            width="6.22222222"
                            height="6.22222222"
                            rx="1"
                          ></rect>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
