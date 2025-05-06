import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Array<{
    path?: string;
    title: string;
    icon?: React.ReactNode;
  }>;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs = [], extra }) => {
  return (
    <div className="py-4 mb-6 flex justify-between items-center">
      <div>
        <Breadcrumb className="mb-2">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {item.path ? (
                <Link to={item.path}>
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.title}
                </Link>
              ) : (
                <span>
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.title}
                </span>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Title level={4} className="m-0">{title}</Title>
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
};

export default PageHeader; 