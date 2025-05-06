import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  FileOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss';

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="角色总数"
              value={8}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="权限总数"
              value={24}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文件总数"
              value={93}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.charts}>
        <Col xs={24} lg={12}>
          <Card title="用户增长趋势">
            {/* TODO: 添加用户增长趋势图表 */}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统访问统计">
            {/* TODO: 添加系统访问统计图表 */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 