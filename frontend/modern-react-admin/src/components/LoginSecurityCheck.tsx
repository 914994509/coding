import React, { useEffect, useState } from 'react';
import { Modal, Timeline, Alert, Button, Space } from 'antd';
import { SecurityScanOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useAuthStore, { getLoginActivities } from '@/stores/useAuthStore';

const LoginSecurityCheck: React.FC = () => {
  const { user } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [hasWarning, setHasWarning] = useState(false);

  useEffect(() => {
    if (user) {
      // 获取该用户最近的登录活动
      const activities = getLoginActivities(user.id).slice(0, 5);
      setRecentActivities(activities);

      // 检查是否有可疑登录
      const suspiciousActivities = activities.filter(
        activity => activity.status === 'failure' ||
          (activity.status === 'success' && activity.ip !== activities[0].ip)
      );

      setHasWarning(suspiciousActivities.length > 0);

      // 如果有可疑登录，自动显示模态框
      if (suspiciousActivities.length > 0) {
        setVisible(true);
      }
    }
  }, [user]);

  return (
    <>
      {hasWarning && (
        <Alert
          message="检测到安全风险"
          description="我们检测到您的账户有可疑登录活动，请检查您的账户安全。"
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => setVisible(true)}>
              查看详情
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      <Modal
        title={
          <div className="flex items-center">
            <SecurityScanOutlined className="mr-2" />
            <span>账户安全检查</span>
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            我知道了
          </Button>,
          <Button
            key="security"
            type="primary"
            onClick={() => {
              setVisible(false);
              // 这里可以导航到安全设置页面
            }}
          >
            前往安全设置
          </Button>
        ]}
        width={640}
      >
        <div className="my-4">
          <h3 className="text-lg font-medium">最近登录活动</h3>
          {recentActivities.length > 0 ? (
            <Timeline className="mt-4">
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={activity.id}
                  color={activity.status === 'success' ? 'green' : 'red'}
                  dot={activity.status === 'failure' && <ExclamationCircleOutlined style={{ fontSize: '16px' }} />}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {activity.status === 'success' ? '成功登录' : '登录失败'}
                        {index === 0 && ' (当前会话)'}
                      </p>
                      <p className="text-sm text-gray-500">IP: {activity.ip}</p>
                      <p className="text-sm text-gray-500">设备: {activity.userAgent.substring(0, 50)}...</p>
                      {activity.reason && <p className="text-sm text-gray-500">原因: {activity.reason}</p>}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.time).toLocaleString()}
                    </span>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <p className="text-gray-500">没有最近的登录记录</p>
          )}
        </div>

        <Alert
          message="安全提示"
          description="如果您发现任何可疑登录活动，请立即修改密码并启用双因素认证以保护您的账户。"
          type="info"
          showIcon
        />
      </Modal>
    </>
  );
};

export default LoginSecurityCheck; 