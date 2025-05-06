import React, { useState } from 'react';
import { Table, Card, DatePicker, Select, Input, Button, Space, Tag, Tooltip, Modal, Descriptions } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, FilterOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';

// 用户活动记录类型
interface ActivityRecord {
  id: string;
  username: string;
  userId: string;
  action: string;
  module: string;
  ip: string;
  userAgent: string;
  time: string;
  status: 'success' | 'failure' | 'warning';
  details?: string;
}

// 生成模拟数据
const generateActivityData = (count: number = 100): ActivityRecord[] => {
  const records: ActivityRecord[] = [];
  const actions = [
    '登录系统', '登出系统', '创建用户', '编辑用户', '删除用户',
    '修改权限', '查看数据', '导出数据', '导入数据', '重置密码',
    '修改设置', '启用双因素认证', '禁用账户', '解锁账户'
  ];
  const modules = ['用户管理', '权限管理', '系统设置', '数据管理', '报表管理', '审计日志'];
  const usernames = ['admin', 'operator', 'manager', 'auditor', 'guest'];
  const statuses = ['success', 'failure', 'warning'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const oses = ['Windows 10', 'macOS', 'Ubuntu Linux', 'iOS'];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 30);

    const action = actions[Math.floor(Math.random() * actions.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as 'success' | 'failure' | 'warning';
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    records.push({
      id: `${i}`,
      username,
      userId: `user-${i % 5 + 1}`,
      action,
      module,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: `${browsers[Math.floor(Math.random() * browsers.length)]} / ${oses[Math.floor(Math.random() * oses.length)]}`,
      time: date.toLocaleString(),
      status,
      details: Math.random() > 0.7 ? `操作详情: ${action}操作由${username}在${module}模块中执行` : undefined,
    });
  }

  return records;
};

const UserActivityPage: React.FC = () => {
  const [activityData] = useState<ActivityRecord[]>(generateActivityData(100));
  const [filteredData, setFilteredData] = useState<ActivityRecord[]>(activityData);
  const [searchText, setSearchText] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(null);

  // 查看详情
  const showDetailModal = (record: ActivityRecord) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  // 处理搜索和筛选
  const handleSearch = () => {
    let result = activityData;

    // 按关键词搜索
    if (searchText) {
      result = result.filter(record =>
        record.username.includes(searchText) ||
        record.action.includes(searchText) ||
        record.ip.includes(searchText) ||
        (record.details && record.details.includes(searchText))
      );
    }

    // 按模块筛选
    if (selectedModule) {
      result = result.filter(record => record.module === selectedModule);
    }

    // 按状态筛选
    if (selectedStatus) {
      result = result.filter(record => record.status === selectedStatus);
    }

    // 按日期筛选
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      result = result.filter(record => {
        const recordDate = new Date(record.time);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    setFilteredData(result);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedModule('');
    setSelectedStatus('');
    setDateRange([null, null]);
    setFilteredData(activityData);
  };

  // 导出数据
  const handleExport = () => {
    // 模拟导出功能
    setTimeout(() => {
      const fileName = `用户活动记录_${new Date().toISOString().split('T')[0]}.csv`;
      // 实际项目中会实现真正的导出逻辑
      console.log(`导出数据到 ${fileName}`);
    }, 1000);
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 180,
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        let text = '未知';

        if (status === 'success') {
          color = 'success';
          text = '成功';
        } else if (status === 'failure') {
          color = 'error';
          text = '失败';
        } else if (status === 'warning') {
          color = 'warning';
          text = '警告';
        }

        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '设备',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
      render: (userAgent: string) => (
        <Tooltip title={userAgent}>
          {userAgent}
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (_, record: ActivityRecord) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  // 模块选项
  const moduleOptions = [
    { value: '', label: '全部模块' },
    { value: '用户管理', label: '用户管理' },
    { value: '权限管理', label: '权限管理' },
    { value: '系统设置', label: '系统设置' },
    { value: '数据管理', label: '数据管理' },
    { value: '报表管理', label: '报表管理' },
    { value: '审计日志', label: '审计日志' },
  ];

  // 状态选项
  const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'success', label: '成功' },
    { value: 'failure', label: '失败' },
    { value: 'warning', label: '警告' },
  ];

  return (
    <div>
      <PageHeader
        title="用户活动追踪"
        breadcrumbs={[{ title: '系统管理' }, { title: '操作追踪' }]}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Input
            placeholder="搜索用户、操作或IP"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />

          <Select
            placeholder="选择模块"
            value={selectedModule}
            onChange={setSelectedModule}
            style={{ width: 150 }}
            options={moduleOptions}
          />

          <Select
            placeholder="选择状态"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
            options={statusOptions}
          />

          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [any, any])}
            placeholder={['开始日期', '结束日期']}
          />

          <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch}>
            筛选
          </Button>

          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>

          <div className="flex-grow"></div>

          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出记录
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
        />

        {/* 详情模态框 */}
        <Modal
          title="操作详情"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              关闭
            </Button>
          ]}
          width={700}
        >
          {selectedRecord && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="操作时间" span={2}>{selectedRecord.time}</Descriptions.Item>
              <Descriptions.Item label="用户名">{selectedRecord.username}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{selectedRecord.userId}</Descriptions.Item>
              <Descriptions.Item label="操作">{selectedRecord.action}</Descriptions.Item>
              <Descriptions.Item label="所属模块">{selectedRecord.module}</Descriptions.Item>
              <Descriptions.Item label="IP地址">{selectedRecord.ip}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  if (selectedRecord.status === 'success') return <Tag color="success">成功</Tag>;
                  if (selectedRecord.status === 'failure') return <Tag color="error">失败</Tag>;
                  if (selectedRecord.status === 'warning') return <Tag color="warning">警告</Tag>;
                  return <Tag color="default">未知</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="设备信息" span={2}>{selectedRecord.userAgent}</Descriptions.Item>
              <Descriptions.Item label="详细信息" span={2}>{selectedRecord.details || '无详细信息'}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default UserActivityPage; 