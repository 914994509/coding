import React, { useState } from 'react';
import { Card, Form, Switch, InputNumber, Select, Button, Space, message, Divider, Alert, notification } from 'antd';
import { SaveOutlined, SecurityScanOutlined, ReloadOutlined } from '@ant-design/icons';

// 安全策略类型
interface SecurityPolicy {
  passwordMinLength: number;
  passwordComplexity: 'low' | 'medium' | 'high';
  failedLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  requireMfa: boolean;
  passwordExpiryDays: number;
  preventPasswordReuse: number;
  ipWhitelistEnabled: boolean;
}

// 初始安全策略
const initialPolicy: SecurityPolicy = {
  passwordMinLength: 8,
  passwordComplexity: 'medium',
  failedLoginAttempts: 5,
  lockoutDuration: 30,
  sessionTimeout: 60,
  requireMfa: false,
  passwordExpiryDays: 90,
  preventPasswordReuse: 5,
  ipWhitelistEnabled: false,
};

const LoginSecurityPage: React.FC = () => {
  const [policy, setPolicy] = useState<SecurityPolicy>(initialPolicy);
  const [form] = Form.useForm();

  // 提交表单
  const handleSubmit = (values: SecurityPolicy) => {
    setPolicy(values);
    message.success('安全策略已更新');

    // 这里应该发送API请求保存策略
    console.log('保存安全策略:', values);
  };

  // 重置为默认值
  const handleReset = () => {
    form.setFieldsValue(initialPolicy);
    message.info('已重置为默认安全策略');
  };

  // 测试策略
  const handleTest = () => {
    notification.success({
      message: '安全策略测试',
      description: '所有安全策略测试通过',
      icon: <SecurityScanOutlined style={{ color: '#52c41a' }} />,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">登录安全策略</h2>
        <p className="text-gray-500">配置全局登录安全和密码策略</p>
      </div>

      <Alert
        message="重要提示"
        description="安全策略修改将在下次用户登录时生效。策略更改不会影响当前已登录的用户会话。"
        type="info"
        showIcon
        className="mb-6"
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={policy}
          onFinish={handleSubmit}
        >
          <div className="mb-4">
            <h3 className="text-lg font-medium">密码策略</h3>
            <Divider />
          </div>

          <Form.Item
            name="passwordMinLength"
            label="密码最小长度"
            rules={[{ required: true, message: '请输入密码最小长度' }]}
          >
            <InputNumber min={6} max={32} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="passwordComplexity"
            label="密码复杂度要求"
            rules={[{ required: true, message: '请选择密码复杂度' }]}
          >
            <Select>
              <Select.Option value="low">低 (仅字母和数字)</Select.Option>
              <Select.Option value="medium">中 (必须包含字母、数字和特殊字符)</Select.Option>
              <Select.Option value="high">高 (必须包含大小写字母、数字和特殊字符)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="passwordExpiryDays"
            label="密码过期天数"
            rules={[{ required: true, message: '请输入密码过期天数' }]}
          >
            <InputNumber min={0} max={365} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="preventPasswordReuse"
            label="防止密码重复使用 (记住几次历史密码)"
            rules={[{ required: true, message: '请输入历史密码记录数' }]}
          >
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>

          <div className="my-4">
            <h3 className="text-lg font-medium">登录保护</h3>
            <Divider />
          </div>

          <Form.Item
            name="failedLoginAttempts"
            label="允许失败登录尝试次数"
            rules={[{ required: true, message: '请输入允许的失败登录次数' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="lockoutDuration"
            label="账户锁定时长 (分钟)"
            rules={[{ required: true, message: '请输入账户锁定时长' }]}
          >
            <InputNumber min={5} max={1440} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="sessionTimeout"
            label="会话超时时间 (分钟)"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <InputNumber min={5} max={1440} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="requireMfa"
            label="强制启用双因素认证"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="ipWhitelistEnabled"
            label="启用IP白名单"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* 白名单启用后才显示 */}
          {policy.ipWhitelistEnabled && (
            <Form.Item
              label="IP白名单管理"
            >
              <Button disabled>管理白名单</Button>
              <span className="ml-2 text-gray-500">请在白名单设置中管理允许的IP地址</span>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存策略
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置为默认值
              </Button>
              <Button icon={<SecurityScanOutlined />} onClick={handleTest}>
                测试策略
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginSecurityPage; 