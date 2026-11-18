import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip, Progress } from 'antd';
import { CheckSquare, Clock, AlertTriangle, Download, Plus, Users, Calendar, Flag, MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface TaskItem {
  key: string;
  id: string;
  title: string;
  assignedTo: string;
  category: 'Sales' | 'Field Service' | 'Finance' | 'Operations' | 'HR';
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  deadline: string;
  progress: number;
  status: 'In Progress' | 'Completed' | 'Pending Review' | 'Blocked';
}

const INITIAL_TASKS: TaskItem[] = [
  { key: '1', id: 'TSK-501', title: 'Prepare Q4 Commercial Proposal for Apex Precision Works', assignedTo: 'Vikram Seth', category: 'Sales', priority: 'High', deadline: '2026-11-18', progress: 75, status: 'In Progress' },
  { key: '2', id: 'TSK-502', title: 'Emergency Hydraulic Pump Replacement at Tambaram Hub', assignedTo: 'Murugan K.', category: 'Field Service', priority: 'Urgent', deadline: '2026-11-16', progress: 90, status: 'In Progress' },
  { key: '3', id: 'TSK-503', title: 'Compile Monthly GST-3B Tax Filing Summary', assignedTo: 'Karthik Raja', category: 'Finance', priority: 'High', deadline: '2026-11-20', progress: 40, status: 'In Progress' },
  { key: '4', id: 'TSK-504', title: 'Conduct Semi-Annual Engineering Staff Appraisals', assignedTo: 'Ananya Sharma', category: 'HR', priority: 'Medium', deadline: '2026-11-25', progress: 100, status: 'Completed' },
  { key: '5', id: 'TSK-505', title: 'Stock Reconciliation across Chennai & Coimbatore Depots', assignedTo: 'Dinesh V.', category: 'Operations', priority: 'Medium', deadline: '2026-11-22', progress: 20, status: 'In Progress' },
];

export const TaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [form] = Form.useForm();

  const handleCreateTask = (values: any) => {
    const newTask: TaskItem = {
      key: String(Date.now()),
      id: `TSK-${500 + tasks.length + 1}`,
      title: values.title,
      assignedTo: values.assignedTo,
      category: values.category || 'Operations',
      priority: values.priority || 'Medium',
      deadline: '2026-11-28',
      progress: 0,
      status: 'In Progress',
    };
    setTasks([newTask, ...tasks]);
    message.success('New operational task assigned successfully!');
    setIsCreateModal(false);
    form.resetFields();
  };

  const handleStatusChange = (id: string, newStatus: TaskItem['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t));
    message.success(`Task ${id} marked as ${newStatus}!`);
  };

  const filtered = tasks.filter(t => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my') return t.assignedTo.includes('Janani') || t.assignedTo.includes('Vikram');
    if (activeTab === 'completed') return t.status === 'Completed';
    if (activeTab === 'urgent') return t.priority === 'Urgent' || t.priority === 'High';
    return true;
  });

  const columns = [
    { title: 'Task ID', dataIndex: 'id', key: 'id', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Task Title', dataIndex: 'title', key: 'title', render: (t: string) => <strong style={{ color: '#19153B' }}>{t}</strong> },
    { title: 'Assignee', dataIndex: 'assignedTo', key: 'assignedTo', render: (a: string) => <Tag color="geekblue">{a}</Tag> },
    { title: 'Department', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: string) => {
        const color = p === 'Urgent' ? 'magenta' : p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'default';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (prog: number) => <Progress percent={prog} size="small" strokeColor="#6E56CF" style={{ width: 110 }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <Tag color={st === 'Completed' ? 'green' : st === 'In Progress' ? 'processing' : 'warning'}>{st}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: TaskItem) => r.status !== 'Completed' ? (
        <Button size="small" type="primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }} onClick={() => handleStatusChange(r.id, 'Completed')}>
          Done
        </Button>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Verified</Text>,
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Task & Work Assignment"
        subtitle="Cross-functional ERP work delegation, milestone priorities, progress tracking, and deliverables."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Task roster downloaded')}>
              Export
            </Button>
            <Button type="primary" icon={<Plus size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsCreateModal(true)}>
              Create Task
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Total Work Orders" value={tasks.length} prefix={<CheckSquare size={16} color="#6E56CF" />} valueStyle={{ color: '#19153B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="In Progress" value={tasks.filter(t => t.status === 'In Progress').length} prefix={<Clock size={16} color="#3B82F6" />} valueStyle={{ color: '#3B82F6', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="High / Urgent Priority" value={tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length} prefix={<AlertTriangle size={16} color="#EF4444" />} valueStyle={{ color: '#EF4444', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Completed Tasks" value={tasks.filter(t => t.status === 'Completed').length} prefix={<CheckSquare size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Tasks (${tasks.length})` },
            { key: 'my', label: 'My Assigned Tasks' },
            { key: 'urgent', label: 'Urgent & High Priority' },
            { key: 'completed', label: 'Completed Deliverables' },
            { key: 'kanban', label: 'Kanban Board View' },
          ]}
        />

        {activeTab !== 'kanban' ? (
          <Table dataSource={filtered} columns={columns} pagination={{ pageSize: 8 }} />
        ) : (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={16}>
              {['To Do / Assigned', 'In Progress', 'Completed'].map((stage, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <div style={{ backgroundColor: '#F8F7FC', padding: 14, borderRadius: 12, minHeight: 300 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#19153B', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{stage}</span>
                      <Tag color="purple">{idx === 1 ? tasks.filter(t => t.status === 'In Progress').length : idx === 2 ? tasks.filter(t => t.status === 'Completed').length : 1}</Tag>
                    </div>
                    {tasks.filter(t => idx === 1 ? t.status === 'In Progress' : idx === 2 ? t.status === 'Completed' : t.progress < 30).slice(0, 3).map((item, i) => (
                      <Card key={i} size="small" style={{ marginBottom: 10, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <Tag color="blue">{item.assignedTo.split(' ')[0]}</Tag>
                          <Text type="secondary" style={{ fontSize: 11 }}>{item.deadline}</Text>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Card>

      {/* Create Task Modal */}
      <Modal title="Create & Assign New Task" open={isCreateModal} onCancel={() => setIsCreateModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item label="Task Title / Objective" name="title" rules={[{ required: true, message: 'Please enter task title' }]}>
            <Input placeholder="e.g. Conduct preventive check on Compressor 1" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Assign To" name="assignedTo" initialValue="Vikram Seth" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Vikram Seth', label: 'Vikram Seth (Sales)' },
                  { value: 'Murugan K.', label: 'Murugan K. (Service)' },
                  { value: 'Ananya Sharma', label: 'Ananya Sharma (HR)' },
                  { value: 'Karthik Raja', label: 'Karthik Raja (Finance)' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Priority" name="priority" initialValue="Medium">
                <Select options={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                  { value: 'Urgent', label: 'Urgent' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Department Category" name="category" initialValue="Operations">
            <Select options={[
              { value: 'Sales', label: 'Sales' },
              { value: 'Field Service', label: 'Field Service' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Finance', label: 'Finance' },
              { value: 'HR', label: 'HR' },
            ]} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCreateModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Assign Task</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
