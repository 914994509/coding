import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Divider, Alert, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';

// 假设角色选项（通常这些会从API获取）
const roleOptions = [
  { label: '普通用户', value: '3' },
  { label: '运营人员', value: '4' },
  { label: '审计员', value: '5' }
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, error, clearError } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 密码强度检查
  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }

    if (value.length < 8) {
      return Promise.reject(new Error('密码长度至少为8位'));
    }

    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!(hasNumber && hasLetter && hasSpecial)) {
      return Promise.reject(new Error('密码必须包含数字、字母和特殊字符'));
    }

    return Promise.resolve();
  };

  // 处理注册提交
  const handleRegister = async (values: any) => {
    setLoading(true);

    try {
      // 这里应该调用实际的注册API
      console.log('注册信息:', values);

      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API延迟

      message.success('注册成功！请登录您的账号');

      // 注册成功后跳转到登录页
      navigate('/auth/login');
    } catch (error) {
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">创建新账户</h1>
          <p className="text-gray-500">加入我们的企业管理平台</p>
        </div>

        {error && (
          <Alert
            message="注册失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            className="mb-4"
          />
        )}

        <Form
          form={form}
          name="register_form"
          onFinish={handleRegister}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少4个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input
              placeholder="请输入您的真实姓名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="电子邮箱"
            rules={[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入电子邮箱"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ validator: validatePassword }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请设置密码"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请确认密码"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="申请角色"
            rules={[{ required: true, message: '请选择申请角色' }]}
          >
            <Select
              placeholder="请选择角色"
              size="large"
              options={roleOptions}
            />
          </Form.Item>

          <Form.Item
            name="enableMfa"
            valuePropName="checked"
          >
            <Checkbox>
              <span className="flex items-center">
                <SafetyOutlined className="mr-1" /> 启用双因素认证（推荐）
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议'))
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              注册
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-500">已有账号？</span>
            <Link to="/auth/login" className="text-primary ml-1">
              立即登录
            </Link>
          </div>
        </Form>

        <Divider>安全提示</Divider>
        <p className="text-xs text-gray-500 text-center">
          请使用强密码并定期更换，设置双因素认证可以进一步提高账户安全性。
          注册信息将用于系统内部身份识别，我们将严格保护您的个人信息。
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage; 