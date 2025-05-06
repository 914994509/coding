# React Ant Admin 现代版

这是对原始 React Ant Admin 项目的现代化重构版本，采用了最新的前端技术栈和最佳实践。

## 技术栈

- **React 18** - 使用最新的React特性
- **TypeScript 5** - 提供类型安全和开发体验
- **Ant Design 5** - 优雅美观的UI组件库
- **Vite** - 快速的构建工具和开发服务器
- **React Router 6** - 声明式路由管理
- **Zustand** - 简单高效的状态管理
- **Tailwind CSS** - 实用性优先的CSS框架
- **Axios** - HTTP客户端

## 改进内容

相比原项目，本次重构做了以下改进：

1. **构建工具** - 从webpack迁移到了更快的Vite
2. **状态管理** - 从Redux迁移到更简洁的Zustand
3. **路由系统** - 升级到React Router v6
4. **类型系统** - 更严格的TypeScript配置
5. **样式方案** - 引入Tailwind CSS提高开发效率
6. **代码组织** - 更合理的目录结构和代码分层
7. **组件设计** - 更现代化的UI设计和用户体验

## 项目结构

```
src/
  ├── assets/       # 静态资源
  ├── components/   # 可复用组件
  ├── hooks/        # 自定义Hooks
  ├── layouts/      # 布局组件
  ├── pages/        # 页面组件
  ├── services/     # API服务
  ├── stores/       # 状态管理
  ├── types/        # 类型定义
  └── utils/        # 工具函数
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 认证信息

默认登录凭据：

- 用户名: admin
- 密码: admin123

## 主要功能

- 用户管理
- 角色管理
- 菜单管理
- 权限控制
- 系统设置

## 贡献

欢迎提交Issue或Pull Request来完善这个项目。 