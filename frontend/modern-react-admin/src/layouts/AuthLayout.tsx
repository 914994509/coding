import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Spin } from 'antd';

const { Content } = Layout;

const AuthLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Content className="flex justify-center items-center">
        <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">React Ant Admin</h1>
            <p className="text-gray-500">现代化的管理系统</p>
          </div>
          <Suspense fallback={<div className="flex justify-center"><Spin /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout; 