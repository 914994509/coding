import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// 使用懒加载组件
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));

// 用户与权限管理
const Users = lazy(() => import('@/pages/system/users'));
const Roles = lazy(() => import('@/pages/system/roles'));
const Permissions = lazy(() => import('@/pages/system/permissions'));
const LoginSecurity = lazy(() => import('@/pages/system/login-security'));
const UserActivity = lazy(() => import('@/pages/system/user-activity'));

// 数据管理
const DataTables = lazy(() => import('@/pages/data/tables'));
const BatchOperations = lazy(() => import('@/pages/data/batch-operations'));
const VersionControl = lazy(() => import('@/pages/data/version-control'));
const DataMasking = lazy(() => import('@/pages/data/data-masking'));

// 审计与风控
const OperationLogs = lazy(() => import('@/pages/audit/operation-logs'));
const SecurityDashboard = lazy(() => import('@/pages/audit/security-dashboard'));
const ChangeDiff = lazy(() => import('@/pages/audit/change-diff'));

// 服务集成
const ApiManagement = lazy(() => import('@/pages/integration/api-management'));
const Webhooks = lazy(() => import('@/pages/integration/webhooks'));
const ScheduledTasks = lazy(() => import('@/pages/integration/scheduled-tasks'));

// 错误页面
const NotFound = lazy(() => import('@/pages/error/NotFound'));
const Forbidden = lazy(() => import('@/pages/error/Forbidden'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // 用户与权限管理
      {
        path: 'system',
        children: [
          {
            path: 'users',
            element: <Users />,
          },
          {
            path: 'roles',
            element: <Roles />,
          },
          {
            path: 'permissions',
            element: <Permissions />,
          },
          {
            path: 'login-security',
            element: <LoginSecurity />,
          },
          {
            path: 'user-activity',
            element: <UserActivity />,
          },
        ],
      },
      // 数据管理
      {
        path: 'data',
        children: [
          {
            path: 'tables',
            element: <DataTables />,
          },
          {
            path: 'batch-operations',
            element: <BatchOperations />,
          },
          {
            path: 'version-control',
            element: <VersionControl />,
          },
          {
            path: 'data-masking',
            element: <DataMasking />,
          },
        ],
      },
      // 审计与风控
      {
        path: 'audit',
        children: [
          {
            path: 'operation-logs',
            element: <OperationLogs />,
          },
          {
            path: 'security-dashboard',
            element: <SecurityDashboard />,
          },
          {
            path: 'change-diff',
            element: <ChangeDiff />,
          },
        ],
      },
      // 服务集成
      {
        path: 'integration',
        children: [
          {
            path: 'api-management',
            element: <ApiManagement />,
          },
          {
            path: 'webhooks',
            element: <Webhooks />,
          },
          {
            path: 'scheduled-tasks',
            element: <ScheduledTasks />,
          },
        ],
      },
      // 错误页面
      {
        path: '403',
        element: <Forbidden />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
];

export default routes; 