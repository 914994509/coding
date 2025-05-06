import React from 'react';

interface IconButtonProps {
  className?: string;
  onClick?: () => void;
  title?: string;
  isActive?: boolean;
  width?: number;
  height?: number;
}

// 网格视图图标按钮
export const GridViewButton: React.FC<IconButtonProps> = ({
  className = "",
  onClick,
  title = "网格视图",
  isActive = false,
  width = 20,
  height = 20
}) => {
  return (
    <button
      className={`view-mode-btn ${isActive ? "active" : ""} ${className}`}
      onClick={onClick}
      title={title}
    >
      <svg className="view-mode-icon" width={width} height={height} viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <title>大卡</title>
        <g id="最终稿" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
          <g id="编组-6备份">
            <g>
              <g>
                <g>
                  <rect id="矩形" x="0" y="0" width="6.22222222" height="6.22222222" rx="1"></rect>
                  <rect id="矩形备份-7" x="0" y="7.77777778" width="6.22222222" height="6.22222222" rx="1"></rect>
                  <path d="M8.55555556,0.777777778 L13.2222222,0.777777778 C13.651777,0.777777778 14,1.12600075 14,1.55555556 C14,1.98511036 13.651777,2.33333333 13.2222222,2.33333333 L8.55555556,2.33333333 C8.12600075,2.33333333 7.77777778,1.98511036 7.77777778,1.55555556 C7.77777778,1.12600075 8.12600075,0.777777778 8.55555556,0.777777778 Z" id="矩形"></path>
                  <path d="M8.55555556,8.55555556 L13.2222222,8.55555556 C13.651777,8.55555556 14,8.90377853 14,9.33333333 C14,9.76288814 13.651777,10.1111111 13.2222222,10.1111111 L8.55555556,10.1111111 C8.12600075,10.1111111 7.77777778,9.76288814 7.77777778,9.33333333 C7.77777778,8.90377853 8.12600075,8.55555556 8.55555556,8.55555556 Z" id="矩形备份-9"></path>
                  <path d="M8.55555556,3.88888889 L13.2222222,3.88888889 C13.651777,3.88888889 14,4.23711186 14,4.66666667 C14,5.09622147 13.651777,5.44444444 13.2222222,5.44444444 L8.55555556,5.44444444 C8.12600075,5.44444444 7.77777778,5.09622147 7.77777778,4.66666667 C7.77777778,4.23711186 8.12600075,3.88888889 8.55555556,3.88888889 Z" id="矩形备份-8"></path>
                  <path d="M8.55555556,11.6666667 L13.2222222,11.6666667 C13.651777,11.6666667 14,12.0148896 14,12.4444444 C14,12.8739992 13.651777,13.2222222 13.2222222,13.2222222 L8.55555556,13.2222222 C8.12600075,13.2222222 7.77777778,12.8739992 7.77777778,12.4444444 C7.77777778,12.0148896 8.12600075,11.6666667 8.55555556,11.6666667 Z" id="矩形备份-10"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </button>
  );
};

// 通用图标按钮
export const IconButton: React.FC<IconButtonProps & { children: React.ReactNode }> = ({
  className = "",
  onClick,
  title,
  isActive = false,
  children,
  width,
  height
}) => {
  return (
    <button
      className={`view-mode-btn ${isActive ? "active" : ""} ${className}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
};

// 默认导出所有按钮组件
const ViewButtons = {
  GridViewButton,
  IconButton
};

export default ViewButtons;
