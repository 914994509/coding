import React, { Suspense, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  HistoryOutlined,
  AlertOutlined,
  DiffOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

// 菜单项配置函数
const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

// 菜单项定义
const menuItems: MenuItem[] = [
  getMenuItem('控制台', '/dashboard', <DashboardOutlined />),
  getMenuItem('用户与权限', 'user-auth', <SafetyOutlined />, [
    getMenuItem('用户管理', '/system/users', <UserOutlined />),
    getMenuItem('角色管理', '/system/roles', <TeamOutlined />),
    getMenuItem('权限管理', '/system/permissions', <KeyOutlined />),
    getMenuItem('登录安全', '/system/login-security', <SafetyOutlined />),
    getMenuItem('操作追踪', '/system/user-activity', <HistoryOutlined />),
  ]),
  getMenuItem('数据管理', 'data-management', <DatabaseOutlined />, [
    getMenuItem('数据表管理', '/data/tables', <DatabaseOutlined />),
    getMenuItem('批量操作', '/data/batch-operations', <FileTextOutlined />),
    getMenuItem('版本控制', '/data/version-control', <HistoryOutlined />),
    getMenuItem('数据脱敏', '/data/data-masking', <SafetyOutlined />),
  ]),
  getMenuItem('审计与风控', 'audit', <AlertOutlined />, [
    getMenuItem('操作日志', '/audit/operation-logs', <FileTextOutlined />),
    getMenuItem('安全看板', '/audit/security-dashboard', <AlertOutlined />),
    getMenuItem('变更对比', '/audit/change-diff', <DiffOutlined />),
  ]),
  getMenuItem('服务集成', 'service-integration', <ApiOutlined />, [
    getMenuItem('API管理', '/integration/api-management', <ApiOutlined />),
    getMenuItem('Webhook管理', '/integration/webhooks', <ApiOutlined />),
    getMenuItem('定时任务', '/integration/scheduled-tasks', <ClockCircleOutlined />),
  ]),
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // 计算默认选中的菜单项
  const getSelectedKeys = () => {
    const { pathname } = location;
    return [pathname];
  };

  // 计算默认展开的子菜单
  const getOpenKeys = () => {
    const { pathname } = location;
    const openKeys = [];

    if (pathname.startsWith('/system')) {
      openKeys.push('user-auth');
    } else if (pathname.startsWith('/data')) {
      openKeys.push('data-management');
    } else if (pathname.startsWith('/audit')) {
      openKeys.push('audit');
    } else if (pathname.startsWith('/integration')) {
      openKeys.push('service-integration');
    }

    return openKeys;
  };

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md flex items-center">
        <div className="text-xl font-bold">企业级管理平台</div>
      </Header>
      <Layout>
        <Sider
          width={220}
          className="bg-white"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Content className="p-6 m-6 bg-white">
          <Suspense fallback={<div className="flex justify-center items-center h-full"><Spin size="large" /></div>}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 