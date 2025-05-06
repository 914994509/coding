import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, FileOutlined, ShoppingOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">控制台</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="用户总数"
              value={1256}
              prefix={<UserOutlined />}
              className="text-primary"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="团队数量"
              value={18}
              prefix={<TeamOutlined />}
              className="text-success"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="文件数量"
              value={324}
              prefix={<FileOutlined />}
              className="text-warning"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="交易总数"
              value={856}
              prefix={<ShoppingOutlined />}
              className="text-error"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="系统介绍" className="hover:shadow-md transition-shadow">
            <p>React Ant Admin 现代版是基于 React 18、TypeScript、Ant Design 5、Vite 和 Zustand 开发的后台管理系统。</p>
            <p>主要特点：</p>
            <ul className="list-disc pl-6 mt-2">
              <li>使用 React 18 和 TypeScript 5</li>
              <li>Vite 快速构建和热重载</li>
              <li>Ant Design 5 美观的UI组件</li>
              <li>Zustand 简洁的状态管理</li>
              <li>Tailwind CSS 实用的样式工具</li>
              <li>React Router 6 现代化路由</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 