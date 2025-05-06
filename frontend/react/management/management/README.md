# 后台管理系统

基于 Vite + React + TypeScript 构建的综合后台管理平台，实现一套高扩展性的通用后台管理系统。

## 技术栈

- React 18
- TypeScript 5
- Ant Design 5
- Redux Toolkit
- React Router 6
- SCSS 模块化

## 功能特性

- 用户认证与授权
- 用户管理
- 角色管理
- 权限管理
- 数据可视化
- 响应式布局

## 开发环境

- Node.js >= 16
- npm >= 8

## 快速开始

1. 克隆项目

```bash
git clone <repository-url>
cd management
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
  ├── components/     # 可复用组件
  ├── views/         # 页面组件
  ├── router/        # 路由配置
  ├── store/         # 状态管理
  ├── service/       # API 服务
  ├── utils/         # 工具函数
  ├── hooks/         # 自定义 Hooks
  ├── styles/        # 样式文件
  ├── config/        # 配置文件
  ├── enums/         # 枚举定义
  └── typings/       # 类型定义
```

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 Husky 进行 Git 提交检查
- 使用 TypeScript 进行类型检查

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT
