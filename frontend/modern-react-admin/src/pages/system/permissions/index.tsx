import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// 权限类型定义
interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'menu' | 'operation' | 'data';
  status: 'active' | 'inactive';
}

// 模拟权限数据
const initialPermissions: Permission[] = [
  {
    id: '1',
    name: '用户管理页面',
    code: 'user:view',
    description: '访问用户管理页面',
    type: 'menu',
    status: 'active',
  },
  {
    id: '2',
    name: '创建用户',
    code: 'user:create',
    description: '创建新用户',
    type: 'operation',
    status: 'active',
  },
  {
    id: '3',
    name: '编辑用户',
    code: 'user:edit',
    description: '编辑现有用户',
    type: 'operation',
    status: 'active',
  },
  {
    id: '4',
    name: '删除用户',
    code: 'user:delete',
    description: '删除用户',
    type: 'operation',
    status: 'active',
  },
  {
    id: '5',
    name: '查看敏感数据',
    code: 'data:sensitive:view',
    description: '查看用户敏感数据',
    type: 'data',
    status: 'active',
  }
];

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [form] = Form.useForm();

  // 打开创建权限模态框
  const showCreateModal = () => {
    setEditingPermission(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑权限模态框
  const showEditModal = (permission: Permission) => {
    setEditingPermission(permission);
    form.setFieldsValue({
      name: permission.name,
      code: permission.code,
      description: permission.description,
      type: permission.type,
      status: permission.status,
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingPermission) {
        // 更新现有权限
        const updatedPermissions = permissions.map(p =>
          p.id === editingPermission.id ? { ...p, ...values } : p
        );
        setPermissions(updatedPermissions);
        message.success('权限已更新');
      } else {
        // 创建新权限
        const newPermission: Permission = {
          id: `${permissions.length + 1}`,
          ...values,
        };
        setPermissions([...permissions, newPermission]);
        message.success('权限已创建');
      }
      setIsModalVisible(false);
    });
  };

  // 处理删除权限
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该权限吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updatedPermissions = permissions.filter(p => p.id !== id);
        setPermissions(updatedPermissions);
        message.success('权限已删除');
      },
    });
  };

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          menu: 'blue',
          operation: 'green',
          data: 'purple',
        };
        const typeText = {
          menu: '菜单权限',
          operation: '操作权限',
          data: '数据权限',
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {typeText[type as keyof typeof typeText]}
          </Tag>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'active'
          ? <Tag color="success">启用</Tag>
          : <Tag color="error">禁用</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Permission) => (
        <Space size="middle">
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
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">权限管理</h2>
        <p className="text-gray-500">管理系统权限并分配给角色</p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建权限
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingPermission ? '编辑权限' : '新建权限'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            name="permissionForm"
          >
            <Form.Item
              name="name"
              label="权限名称"
              rules={[{ required: true, message: '请输入权限名称' }]}
            >
              <Input placeholder="例如：用户管理页面" />
            </Form.Item>
            <Form.Item
              name="code"
              label="权限代码"
              rules={[{ required: true, message: '请输入权限代码' }]}
            >
              <Input placeholder="例如：user:view" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="描述该权限的用途" />
            </Form.Item>
            <Form.Item
              name="type"
              label="权限类型"
              rules={[{ required: true, message: '请选择权限类型' }]}
            >
              <Select>
                <Select.Option value="menu">菜单权限</Select.Option>
                <Select.Option value="operation">操作权限</Select.Option>
                <Select.Option value="data">数据权限</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Select.Option value="active">启用</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PermissionManagement; 