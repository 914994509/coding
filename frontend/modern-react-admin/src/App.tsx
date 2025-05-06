import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/router';
import { ConfigProvider, Spin } from 'antd';
import useAuthStore from '@/stores/useAuthStore';
import LoginSecurityCheck from '@/components/LoginSecurityCheck';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const element = useRoutes(routes);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 监控认证状态变化
  useEffect(() => {
    console.log('App组件 - 认证状态变化:', isAuthenticated);
    console.log('App组件 - 用户信息:', user);
  }, [isAuthenticated, user]);

  // 验证登录状态
  useEffect(() => {
    // 模拟验证token有效性的过程
    // 在实际应用中，这里应该调用API验证token
    const checkAuthStatus = async () => {
      console.log('开始检查认证状态');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('认证状态检查完成');
      setIsCheckingAuth(false);
    };

    checkAuthStatus();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spin size="large" />
        <div className="mt-3">加载中...</div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <div className="app">
        {element}
        {isAuthenticated && user && <LoginSecurityCheck />}
      </div>
    </ConfigProvider>
  );
};

export default App; 