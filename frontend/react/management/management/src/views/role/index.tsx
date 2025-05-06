import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.scss';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createTime: string;
}

const RoleManagement = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const columns: ColumnsType<Role> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const treeData = [
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '用户管理',
          key: 'user',
          children: [
            { title: '查看用户', key: 'user:view' },
            { title: '创建用户', key: 'user:create' },
            { title: '编辑用户', key: 'user:edit' },
            { title: '删除用户', key: 'user:delete' },
          ],
        },
        {
          title: '角色管理',
          key: 'role',
          children: [
            { title: '查看角色', key: 'role:view' },
            { title: '创建角色', key: 'role:create' },
            { title: '编辑角色', key: 'role:edit' },
            { title: '删除角色', key: 'role:delete' },
          ],
        },
      ],
    },
  ];

  const handleAdd = () => {
    setEditingRole(null);
    setSelectedPermissions([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions || []);
    form.setFieldsValue(role);
    setModalVisible(true);
  };

  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 ${role.name} 吗？`,
      onOk: async () => {
        try {
          // TODO: 实现删除逻辑
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        // 编辑角色
        const updatedRoles = roles.map(role =>
          role.id === editingRole.id ? { ...role, ...values, permissions: selectedPermissions } : role
        );
        setRoles(updatedRoles);
        message.success('编辑成功');
      } else {
        // 添加新角色
        const newRole: Role = {
          id: roles.length + 1, // 临时ID，实际应该由后端生成
          ...values,
          permissions: selectedPermissions,
          createTime: new Date().toLocaleString(),
        };
        setRoles([...roles, newRole]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加角色
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{
          total: roles.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ permissions: [] }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="权限"
            required
            tooltip="请选择至少一个权限"
          >
            <Tree
              checkable
              defaultExpandAll
              treeData={treeData}
              fieldNames={{ title: 'title', key: 'key', children: 'children' }}
              checkedKeys={selectedPermissions}
              onCheck={(checkedKeys) => {
                const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
                setSelectedPermissions(keys as string[]);
                if (keys.length > 0) {
                  form.setFieldsValue({ permissions: keys });
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement; 