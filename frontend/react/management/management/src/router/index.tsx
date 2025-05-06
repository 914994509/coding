import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import Layout from '@/components/Layout';

// 懒加载路由组件
const Login = lazy(() => import('@/views/login'));
const Dashboard = lazy(() => import('@/views/dashboard'));
const UserManagement = lazy(() => import('@/views/user'));
const RoleManagement = lazy(() => import('@/views/role'));
const PermissionManagement = lazy(() => import('@/views/permission'));
const NotFound = lazy(() => import('@/views/errPage/404'));

// 加载状态组件
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Spin size="large" />
  </div>
);

// 路由配置
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'user',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: 'role',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RoleManagement />
          </Suspense>
        ),
      },
      {
        path: 'permission',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PermissionManagement />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router; 