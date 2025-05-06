import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Divider, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [form] = Form.useForm();
  const [requireMfa, setRequireMfa] = useState(false);
  const [step, setStep] = useState<'password' | 'mfa'>('password');
  // 获取用户尝试访问的原始页面
  const from = (location.state as any)?.from || '/dashboard';

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      // 添加延迟确保状态完全更新
      console.log('用户已经登录，准备重定向到', from);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, navigate, from]);

  // 密码登录处理
  const handlePasswordLogin = async (values: any) => {
    const { username, password, remember } = values;

    try {
      console.log('尝试登录:', username);
      // 调用登录方法
      const result = await login(username, password);
      console.log('登录结果:', result ? '成功' : '失败');

      // 检查是否需要双因素认证
      const user = result?.user;
      if (user && user.isSecondFactorEnabled) {
        setRequireMfa(true);
        setStep('mfa');
        message.info('请输入验证码完成二次验证');
      } else if (result) {
        message.success('登录成功');
        // 使用setTimeout确保状态更新后再导航
        setTimeout(() => {
          console.log('登录成功后导航到:', from);
          navigate(from, { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('登录失败:', err);
    }
  };

  // 双因素认证处理
  const handleMfaVerification = (values: any) => {
    const { verificationCode } = values;
    // 这里应该有一个验证MFA的API调用
    // 为了演示，我们直接假设验证码为123456
    if (verificationCode === '123456') {
      message.success('验证成功，登录成功');
      // 重定向到用户原来想访问的页面
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } else {
      message.error('验证码错误');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">企业级管理平台</h1>
          <p className="text-gray-500">安全可靠的企业管理解决方案</p>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            className="mb-4"
          />
        )}

        {step === 'password' ? (
          <Form
            form={form}
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={handlePasswordLogin}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link to="/auth/forgot-password" className="text-primary">
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                登录
              </Button>
            </Form.Item>

            <div className="text-center">
              <span className="text-gray-500">还没有账号？</span>
              <Link to="/auth/register" className="text-primary ml-1">
                立即注册
              </Link>
            </div>
          </Form>
        ) : (
          <Form
            name="mfa_form"
            onFinish={handleMfaVerification}
            layout="vertical"
          >
            <div className="mb-4 text-center">
              <SafetyOutlined className="text-4xl text-primary" />
              <h3 className="mt-2 font-medium">双因素认证</h3>
              <p className="text-gray-500">请输入您收到的6位验证码</p>
            </div>

            <Form.Item
              name="verificationCode"
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '验证码必须是6位数字' }
              ]}
            >
              <Input
                prefix={<MobileOutlined />}
                placeholder="6位验证码"
                size="large"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
              <Space className="w-full">
                <Button
                  onClick={() => setStep('password')}
                  size="large"
                  style={{ flex: 1 }}
                >
                  返回
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ flex: 1 }}
                >
                  验证
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        <Divider>安全提示</Divider>
        <p className="text-xs text-gray-500 text-center">
          请确保您的登录环境安全，不要在公共设备上保存登录状态。
          系统将记录所有登录活动以保障账户安全。
        </p>
      </Card>
    </div>
  );
};

export default LoginPage; 