import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Switch, Transfer, message, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';

// 权限类型定义
interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'menu' | 'operation' | 'data';
  status: 'active' | 'inactive';
}

// 角色类型定义
interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  status: boolean;
  permissions: string[]; // 存储权限ID
}

// 模拟权限数据
const allPermissions: Permission[] = [
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
  },
  {
    id: '6',
    name: '角色管理页面',
    code: 'role:view',
    description: '访问角色管理页面',
    type: 'menu',
    status: 'active',
  },
  {
    id: '7',
    name: '创建角色',
    code: 'role:create',
    description: '创建新角色',
    type: 'operation',
    status: 'active',
  },
  {
    id: '8',
    name: '编辑角色',
    code: 'role:edit',
    description: '编辑现有角色',
    type: 'operation',
    status: 'active',
  },
  {
    id: '9',
    name: '删除角色',
    code: 'role:delete',
    description: '删除角色',
    type: 'operation',
    status: 'active',
  }
];

// 模拟角色数据
const initialRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    status: true,
    permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  {
    id: '2',
    name: '系统管理员',
    code: 'system_admin',
    description: '管理用户和角色',
    status: true,
    permissions: ['1', '2', '3', '4', '6', '7', '8', '9']
  },
  {
    id: '3',
    name: '只读用户',
    code: 'read_only',
    description: '只有查看权限',
    status: true,
    permissions: ['1', '6']
  }
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 权限分配模态框数据
  const permissionData = allPermissions.map(item => ({
    key: item.id,
    title: item.name,
    description: item.description,
    disabled: false,
  }));

  // 打开创建角色模态框
  const showCreateModal = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑角色模态框
  const showEditModal = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description,
      status: role.status,
    });
    setIsModalVisible(true);
  };

  // 打开权限分配模态框
  const showPermissionModal = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions);
    setPermissionModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 关闭权限分配模态框
  const handlePermissionModalCancel = () => {
    setPermissionModalVisible(false);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        // 更新现有角色
        const updatedRoles = roles.map(r =>
          r.id === editingRole.id ? { ...r, ...values } : r
        );
        setRoles(updatedRoles);
        message.success('角色已更新');
      } else {
        // 创建新角色
        const newRole: Role = {
          id: `${roles.length + 1}`,
          ...values,
          permissions: []
        };
        setRoles([...roles, newRole]);
        message.success('角色已创建');
      }
      setIsModalVisible(false);
    });
  };

  // 处理权限分配
  const handlePermissionSubmit = () => {
    if (editingRole) {
      const updatedRoles = roles.map(r =>
        r.id === editingRole.id ? { ...r, permissions: selectedPermissions } : r
      );
      setRoles(updatedRoles);
      message.success('权限已分配');
      setPermissionModalVisible(false);
    }
  };

  // 处理删除角色
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？删除角色将影响具有该角色的所有用户。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updatedRoles = roles.filter(r => r.id !== id);
        setRoles(updatedRoles);
        message.success('角色已删除');
      },
    });
  };

  // 处理权限变更
  const handlePermissionChange = (targetKeys: React.Key[], direction: 'left' | 'right', moveKeys: React.Key[]) => {
    setSelectedPermissions(targetKeys as string[]);
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        status
          ? <Tag color="success">启用</Tag>
          : <Tag color="error">禁用</Tag>
      )
    },
    {
      title: '已分配权限数',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Tooltip title={`已分配 ${permissions.length} 个权限`}>
          <Tag color="blue">{permissions.length}</Tag>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => showPermissionModal(record)}
          >
            权限
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
            disabled={record.code === 'super_admin'} // 禁止删除超级管理员
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
        <h2 className="text-2xl font-bold">角色管理</h2>
        <p className="text-gray-500">管理系统角色并分配权限</p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建角色
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        {/* 角色编辑/创建模态框 */}
        <Modal
          title={editingRole ? '编辑角色' : '新建角色'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            name="roleForm"
          >
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="例如：系统管理员" />
            </Form.Item>
            <Form.Item
              name="code"
              label="角色代码"
              rules={[{ required: true, message: '请输入角色代码' }]}
            >
              <Input placeholder="例如：system_admin" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="描述该角色的职责和权限范围" />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              valuePropName="checked"
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
            </Form.Item>
          </Form>
        </Modal>

        {/* 权限分配模态框 */}
        <Modal
          title={`分配权限 - ${editingRole?.name}`}
          open={permissionModalVisible}
          onOk={handlePermissionSubmit}
          onCancel={handlePermissionModalCancel}
          width={800}
          okText="保存"
          cancelText="取消"
        >
          <p className="mb-4">从左侧选择权限并添加到右侧来分配给角色</p>
          <Transfer
            dataSource={permissionData}
            titles={['可用权限', '已分配权限']}
            targetKeys={selectedPermissions}
            onChange={handlePermissionChange}
            render={item => item.title}
            listStyle={{
              width: 340,
              height: 400,
            }}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default RoleManagement; 