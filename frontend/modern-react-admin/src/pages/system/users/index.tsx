import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Tag, message, Tooltip, Switch, Tabs, List, Timeline } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  status: 'active' | 'inactive' | 'locked';
  lastLoginTime?: string;
  lastLoginIp?: string;
  isSecondFactorEnabled: boolean;
  createdAt: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  ip: string;
  userAgent: string;
  time: string;
  details?: string;
}

interface Role {
  id: string;
  name: string;
  code: string;
}

const roleOptions: Role[] = [
  { id: '1', name: '超级管理员', code: 'super_admin' },
  { id: '2', name: '系统管理员', code: 'system_admin' },
  { id: '3', name: '只读用户', code: 'read_only' },
  { id: '4', name: '运营人员', code: 'operator' },
  { id: '5', name: '审计员', code: 'auditor' },
];

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    roleId: '1',
    status: 'active',
    lastLoginTime: '2023-06-10 14:30:45',
    lastLoginIp: '192.168.1.1',
    isSecondFactorEnabled: true,
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    username: 'operator',
    name: '运营人员',
    email: 'operator@example.com',
    phone: '13800138001',
    roleId: '4',
    status: 'active',
    lastLoginTime: '2023-06-09 09:15:22',
    lastLoginIp: '192.168.1.2',
    isSecondFactorEnabled: false,
    createdAt: '2023-01-15',
  },
  {
    id: '3',
    username: 'auditor',
    name: '审计员',
    email: 'auditor@example.com',
    phone: '13800138002',
    roleId: '5',
    status: 'inactive',
    isSecondFactorEnabled: false,
    createdAt: '2023-02-01',
  },
  {
    id: '4',
    username: 'reader',
    name: '只读用户',
    email: 'reader@example.com',
    roleId: '3',
    status: 'locked',
    lastLoginTime: '2023-05-20 16:45:12',
    lastLoginIp: '192.168.1.4',
    isSecondFactorEnabled: false,
    createdAt: '2023-03-01',
  },
];

const generateUserActivities = (userId: string, count: number = 10): UserActivity[] => {
  const activities: UserActivity[] = [];
  const actions = [
    '登录系统', '修改个人信息', '查看用户列表', '导出报表',
    '创建新用户', '修改角色权限', '重置密码', '导入数据'
  ];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const oses = ['Windows 10', 'macOS', 'Ubuntu Linux', 'iOS'];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    activities.push({
      id: `${userId}-${i}`,
      userId,
      action: actions[Math.floor(Math.random() * actions.length)],
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: `${browsers[Math.floor(Math.random() * browsers.length)]} / ${oses[Math.floor(Math.random() * oses.length)]}`,
      time: date.toLocaleString(),
      details: Math.random() > 0.5 ? `操作ID: ${Math.floor(Math.random() * 10000)}` : undefined,
    });
  }

  return activities;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.includes(searchText) ||
    user.name.includes(searchText) ||
    user.email.includes(searchText)
  );

  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      isSecondFactorEnabled: false,
    });
    setIsModalVisible(true);
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      status: user.status,
      isSecondFactorEnabled: user.isSecondFactorEnabled,
    });
    setIsModalVisible(true);
  };

  const showActivityModal = (user: User) => {
    setEditingUser(user);
    setUserActivities(generateUserActivities(user.id, 15));
    setActivityModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleActivityModalCancel = () => {
    setActivityModalVisible(false);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const currentTime = new Date().toISOString().split('T')[0];

      if (editingUser) {
        const updatedUsers = users.map(u =>
          u.id === editingUser.id ? { ...u, ...values } : u
        );
        setUsers(updatedUsers);
        message.success('用户已更新');
      } else {
        const newUser: User = {
          id: `${users.length + 1}`,
          ...values,
          createdAt: currentTime,
        };
        setUsers([...users, newUser]);
        message.success('用户已创建');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可逆。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
        message.success('用户已删除');
      },
    });
  };

  const handleLockUser = (user: User) => {
    Modal.confirm({
      title: user.status === 'locked' ? '解锁用户' : '锁定用户',
      content: user.status === 'locked'
        ? '确定要解锁该用户吗？解锁后用户将能够登录系统。'
        : '确定要锁定该用户吗？锁定后用户将无法登录系统。',
      okText: user.status === 'locked' ? '解锁' : '锁定',
      okType: user.status === 'locked' ? 'primary' : 'danger',
      cancelText: '取消',
      onOk: () => {
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return {
              ...u,
              status: u.status === 'locked' ? 'active' as const : 'locked' as const,
            };
          }
          return u;
        });
        setUsers(updatedUsers);
        message.success(user.status === 'locked' ? '用户已解锁' : '用户已锁定');
      },
    });
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: string) => {
        const role = roleOptions.find(r => r.id === roleId);
        return role ? <Tag color="blue">{role.name}</Tag> : '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'active') {
          return <Tag color="success">激活</Tag>;
        } else if (status === 'inactive') {
          return <Tag color="warning">未激活</Tag>;
        } else {
          return <Tag color="error">锁定</Tag>;
        }
      }
    },
    {
      title: '双因素认证',
      dataIndex: 'isSecondFactorEnabled',
      key: 'isSecondFactorEnabled',
      render: (enabled: boolean) => (
        enabled
          ? <Tag color="green">已启用</Tag>
          : <Tag color="gray">未启用</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<HistoryOutlined />}
            onClick={() => showActivityModal(record)}
          >
            活动
          </Button>
          <Button
            type="text"
            icon={record.status === 'locked' ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => handleLockUser(record)}
          >
            {record.status === 'locked' ? '解锁' : '锁定'}
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.username === 'admin'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="用户管理"
        breadcrumbs={[{ title: '系统管理' }, { title: '用户管理' }]}
      />

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Input.Search
              placeholder="搜索用户名、姓名或邮箱"
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
              allowClear
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建用户
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingUser ? '编辑用户' : '新建用户'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            name="userForm"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户登录名" />
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="用户真实姓名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="用户邮箱" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="手机号"
            >
              <Input placeholder="可选，用于双因素认证" />
            </Form.Item>
            {!editingUser && (
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码至少8位' }
                ]}
              >
                <Input.Password placeholder="用户登录密码" />
              </Form.Item>
            )}
            <Form.Item
              name="roleId"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="选择用户角色">
                {roleOptions.map(role => (
                  <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="active">激活</Select.Option>
                <Select.Option value="inactive">未激活</Select.Option>
                <Select.Option value="locked">锁定</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="isSecondFactorEnabled"
              label="双因素认证"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`用户活动记录 - ${editingUser?.name}`}
          open={activityModalVisible}
          onCancel={handleActivityModalCancel}
          footer={[
            <Button key="close" onClick={handleActivityModalCancel}>
              关闭
            </Button>
          ]}
          width={800}
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="登录历史" key="1">
              <div className="mb-4">
                <p><strong>最近登录时间：</strong> {editingUser?.lastLoginTime || '暂无记录'}</p>
                <p><strong>最近登录IP：</strong> {editingUser?.lastLoginIp || '暂无记录'}</p>
              </div>

              <List
                dataSource={userActivities.filter(a => a.action === '登录系统')}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.time} - ${item.action}`}
                      description={`IP: ${item.ip} | 设备: ${item.userAgent}`}
                    />
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="操作记录" key="2">
              <Timeline mode="left">
                {userActivities.map(item => (
                  <Timeline.Item key={item.id} label={item.time}>
                    <p><strong>{item.action}</strong></p>
                    <p>IP: {item.ip}</p>
                    <p>设备: {item.userAgent}</p>
                    {item.details && <p>详情: {item.details}</p>}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Tabs.TabPane>
            <Tabs.TabPane tab="安全设置" key="3">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">安全策略配置</h3>

                <div className="mb-4">
                  <Form layout="vertical">
                    <Form.Item
                      label="双因素认证"
                      extra="启用后，用户登录时将需要验证码进行二次验证"
                    >
                      <Switch
                        checked={editingUser?.isSecondFactorEnabled}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label="登录失败锁定策略"
                      extra="连续5次登录失败将锁定账户30分钟"
                    >
                      <Switch defaultChecked disabled />
                    </Form.Item>
                    <Form.Item
                      label="密码强度要求"
                      extra="密码必须包含字母、数字和特殊字符"
                    >
                      <Switch defaultChecked disabled />
                    </Form.Item>
                    <Form.Item
                      label="密码过期策略"
                      extra="密码90天后过期，需要重新设置"
                    >
                      <Switch defaultChecked disabled />
                    </Form.Item>
                  </Form>
                </div>

                <div className="mt-6">
                  <Button type="primary" disabled>修改密码</Button>
                  <Button className="ml-2" disabled>重置安全设置</Button>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </Card>
    </div>
  );
};

export default UserManagement; 