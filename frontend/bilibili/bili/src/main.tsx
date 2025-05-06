import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// whistle配置说明：
// 1. 安装whistle: npm install -g whistle
// 2. 启动whistle: w2 start
// 3. 配置代理规则，将API请求转发到实际服务或模拟数据

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
