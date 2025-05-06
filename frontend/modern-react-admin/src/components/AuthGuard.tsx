import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import { Spin } from 'antd';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthGuard渲染 - 认证状态:', isAuthenticated);
    console.log('当前路径:', location.pathname);
    console.log('用户信息:', user);
  }, [isAuthenticated, location.pathname, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spin size="large" />
        <div className="mt-3">验证登录状态...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('未认证，重定向到登录页面');
    // 将用户重定向到登录页面，但保存他们尝试访问的URL
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  console.log('已认证，显示受保护内容');
  return <>{children}</>;
};

export default AuthGuard; 