import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, Typography, message, Tabs } from 'antd';
import { CheckSquare, MessageSquare, Mail, Send, Plus, Search, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface EnterpriseTask {
  id: string;
  taskId: string;
  taskTitle: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Deferred';
  linkedModule?: string;
  linkedRef?: string;
}

export interface EnterpriseMessage {
  id: string;
  sender: string;
  channel: 'Internal Broadcast' | 'WhatsApp Client Alert' | 'SMS Dispatch' | 'Email Notice';
  recipient: string;
  subject: string;
  sentDate: string;
  deliveryStatus: 'Delivered' | 'Read' | 'Sent' | 'Failed';
}

export const INITIAL_TASKS: EnterpriseTask[] = [
  {
    id: 'TSK-01',
    taskId: 'TSK-2026-101',
    taskTitle: 'Verify Tata Steel Dispatch Gate Pass & E-Way Bill',
    assignedTo: 'Muruganandham V',
    assignedBy: 'Priya Sharma',
    department: 'Warehouse & Logistics',
    priority: 'Critical',
    dueDate: '2026-11-19',
    status: 'In Progress',
    linkedModule: 'Delivery',
    linkedRef: 'DO-2026-081',
  },
  {
    id: 'TSK-02',
    taskId: 'TSK-2026-102',
    taskTitle: 'Conduct CNC Milling Machine Quarterly Spindle Tolerance Check',
    assignedTo: 'Karthik Raja',
    assignedBy: 'Operations Director',
    department: 'Production & Manufacturing',
    priority: 'High',
    dueDate: '2026-11-20',
    status: 'Pending',
    linkedModule: 'Assets',
    linkedRef: 'AST-2026-001',
  },
  {
    id: 'TSK-03',
    taskId: 'TSK-2026-103',
    taskTitle: 'Overdue Debtor Follow-up Call with Dynamic Motors accounts',
    assignedTo: 'Ramesh Sundaram',
    assignedBy: 'CFO',
    department: 'Finance',
    priority: 'Medium',
    dueDate: '2026-11-21',
    status: 'Pending',
    linkedModule: 'Finance',
    linkedRef: 'INV-2026-041',
  },
];

export const INITIAL_MESSAGES: EnterpriseMessage[] = [
  {
    id: 'MSG-01',
    sender: 'ERP System Bot',
    channel: 'WhatsApp Client Alert',
    recipient: 'Tata Steel Procurement Desk (+91 98401 22841)',
    subject: 'Your shipment DO-2026-081 is out for delivery with Driver Muruganandham',
    sentDate: '2026-11-19 09:30 AM',
    deliveryStatus: 'Read',
  },
  {
    id: 'MSG-02',
    sender: 'Finance Desk',
    channel: 'Email Notice',
    recipient: 'Lucas TVS Stores (stores.south@lucastvs.co.in)',
    subject: 'Statement of Account & Upcoming Due Date for INV-2026-087',
    sentDate: '2026-11-18 04:15 PM',
    deliveryStatus: 'Delivered',
  },
  {
    id: 'MSG-03',
    sender: 'Operations Head',
    channel: 'Internal Broadcast',
    recipient: 'All Engineering & Plant Staff',
    subject: 'Quarterly Safety Audit & Machinery Lock-out Tag-out Compliance Protocol',
    sentDate: '2026-11-17 10:00 AM',
    deliveryStatus: 'Delivered',
  },
];

export const CommunicationTaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<EnterpriseTask[]>(() => {
    const raw = localStorage.getItem('erp_enterprise_tasks');
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  });
  const [messages, setMessages] = useState<EnterpriseMessage[]>(() => {
    const raw = localStorage.getItem('erp_enterprise_messages');
    return raw ? JSON.parse(raw) : INITIAL_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<'tasks' | 'messages'>('tasks');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [taskForm] = Form.useForm();
  const [msgForm] = Form.useForm();

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const pendingTasks = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const totalOutboundMessages = messages.length;
    const criticalTasks = tasks.filter((t) => t.priority === 'Critical').length;

    return {
      pendingTasks,
      completedTasks,
      totalOutboundMessages,
      criticalTasks,
    };
  }, [tasks, messages]);

  const handleSaveTask = (values: any) => {
    const newTask: EnterpriseTask = {
      id: 'TSK-' + Date.now(),
      taskId: 'TSK-2026-' + Math.floor(100 + Math.random() * 900),
      taskTitle: values.taskTitle,
      assignedTo: values.assignedTo,
      assignedBy: 'Administrator',
      department: values.department || 'Operations',
      priority: values.priority || 'Medium',
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : dayjs().add(2, 'day').format('YYYY-MM-DD'),
      status: 'Pending',
      linkedModule: values.linkedModule || 'General',
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('erp_enterprise_tasks', JSON.stringify(updated));
    message.success(`Task "${newTask.taskTitle}" assigned to ${newTask.assignedTo}!`);
    taskForm.resetFields();
    setTaskModalOpen(false);
  };

  const handleSendMessage = (values: any) => {
    const newMsg: EnterpriseMessage = {
      id: 'MSG-' + Date.now(),
      sender: 'Administrator Desk',
      channel: values.channel,
      recipient: values.recipient,
      subject: values.subject,
      sentDate: dayjs().format('YYYY-MM-DD hh:mm A'),
      deliveryStatus: 'Sent',
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('erp_enterprise_messages', JSON.stringify(updated));
    message.success(`Broadcast message dispatched via ${values.channel}!`);
    msgForm.resetFields();
    setMsgModalOpen(false);
  };

  const taskColumns = [
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Task Title & Scope',
      key: 'titleScope',
      render: (_: any, r: EnterpriseTask) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.taskTitle}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            Module: {r.linkedModule} &bull; Ref: {r.linkedRef || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: 'Assignee & Dept',
      key: 'assignee',
      render: (_: any, r: EnterpriseTask) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.assignedTo}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.department}</div>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 115,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: string) => {
        const color = p === 'Critical' ? 'red' : p === 'High' ? 'volcano' : p === 'Medium' ? 'gold' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'In Progress' ? 'processing' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, r: EnterpriseTask) => (
        <Button
          size="small"
          type="primary"
          style={{ background: '#10B981', border: 'none', fontSize: 11 }}
          disabled={r.status === 'Completed'}
          onClick={() => {
            const updated = tasks.map((t) => (t.id === r.id ? { ...t, status: 'Completed' as const } : t));
            setTasks(updated);
            localStorage.setItem('erp_enterprise_tasks', JSON.stringify(updated));
            message.success(`Task ${r.taskId} closed as Completed!`);
          }}
        >
          {r.status === 'Completed' ? 'Closed' : 'Done'}
        </Button>
      ),
    },
  ];

  const msgColumns = [
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      width: 180,
      render: (v: string) => {
        const color = v.includes('WhatsApp') ? 'green' : v.includes('Email') ? 'blue' : 'purple';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Recipient Party',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (v: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{v}</span>,
    },
    {
      title: 'Message Content / Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (v: string) => <span style={{ fontSize: 12.5, color: '#334155' }}>{v}</span>,
    },
    {
      title: 'Sent Timestamp',
      dataIndex: 'sentDate',
      key: 'sentDate',
      width: 170,
      render: (v: string) => <span style={{ fontSize: 12, color: '#64748B' }}>{v}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 110,
      render: (v: string) => <Tag color={v === 'Read' ? 'green' : 'blue'}>{v}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Title & Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#1E3A8A', fontWeight: 800 }}>
            Communication & Operational Task Desk
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Internal employee assignments, cross-department task tracking, automated WhatsApp customer notifications, and email logs.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Send size={14} />}
            onClick={() => setMsgModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Dispatch Notification
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setTaskModalOpen(true)}
          >
            Create Task
          </Button>
        </Space>
      </div>

      {/* Exactly 4 Meaningful Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Pending Action Tasks"
          value={summaryMetrics.pendingTasks}
          subtitle="Assigned to department roster"
          trend={{ value: 'Real-time task board', isPositive: true }}
          icon={<CheckSquare size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Tasks Completed on Time"
          value={summaryMetrics.completedTasks}
          subtitle="Resolved & signed off"
          trend={{ value: '100% completion SLA', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Critical Urgent Tasks"
          value={summaryMetrics.criticalTasks}
          subtitle="High priority dispatch / client items"
          trend={{ value: 'Immediate attention', isPositive: false }}
          icon={<AlertTriangle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
        <KpiCard
          title="Outbound Client Alerts"
          value={summaryMetrics.totalOutboundMessages}
          subtitle="WhatsApp, SMS & email updates"
          trend={{ value: 'Active gateway webhook', isPositive: true }}
          icon={<MessageSquare size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
      </div>

      {/* Tabs */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: '8px 18px 0' } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(k: any) => setActiveTab(k)}
          items={[
            {
              key: 'tasks',
              label: <span style={{ fontWeight: 700 }}>Operational Tasks ({tasks.length})</span>,
            },
            {
              key: 'messages',
              label: <span style={{ fontWeight: 700 }}>Communication & Alerts Log ({messages.length})</span>,
            },
          ]}
        />
      </Card>

      {/* Table Content */}
      {activeTab === 'tasks' ? (
        <Card
          bordered
          style={{
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            dataSource={tasks}
            columns={taskColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1050 }}
            size="middle"
          />
        </Card>
      ) : (
        <Card
          bordered
          style={{
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            dataSource={messages}
            columns={msgColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1050 }}
            size="middle"
          />
        </Card>
      )}

      {/* Create Task Modal */}
      <Modal
        open={taskModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create New Operational Task</span>
          </div>
        }
        onCancel={() => setTaskModalOpen(false)}
        onOk={() => taskForm.submit()}
        okText="Assign Task"
        cancelText="Cancel"
      >
        <Form form={taskForm} layout="vertical" onFinish={handleSaveTask}>
          <Form.Item name="taskTitle" label="Task Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Inspect hydraulic test bench prior to customer visit" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="assignedTo" label="Assignee Employee" rules={[{ required: true }]}>
              <Select placeholder="Select staff">
                <Select.Option value="Karthik Raja">Karthik Raja (Field Eng)</Select.Option>
                <Select.Option value="Muruganandham V">Muruganandham V (Logistics)</Select.Option>
                <Select.Option value="Priya Sharma">Priya Sharma (Sales)</Select.Option>
                <Select.Option value="Ananya Roy">Ananya Roy (QA)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Priority Level" initialValue="Medium">
              <Select>
                <Select.Option value="Critical">Critical</Select.Option>
                <Select.Option value="High">High</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="Low">Low</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="department" label="Department" initialValue="Operations">
              <Select>
                <Select.Option value="Operations">Operations</Select.Option>
                <Select.Option value="Logistics">Logistics</Select.Option>
                <Select.Option value="Finance">Finance</Select.Option>
                <Select.Option value="Sales">Sales</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="dueDate" label="Due Date" initialValue={dayjs().add(2, 'day')}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Dispatch Communication Modal */}
      <Modal
        open={msgModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Send size={18} />
            <span>Dispatch Automated Client / Staff Alert</span>
          </div>
        }
        onCancel={() => setMsgModalOpen(false)}
        onOk={() => msgForm.submit()}
        okText="Dispatch Now"
        cancelText="Cancel"
      >
        <Form form={msgForm} layout="vertical" onFinish={handleSendMessage}>
          <Form.Item name="channel" label="Communication Channel" initialValue="WhatsApp Client Alert" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="WhatsApp Client Alert">WhatsApp Business API</Select.Option>
              <Select.Option value="SMS Dispatch">Transactional SMS</Select.Option>
              <Select.Option value="Email Notice">Corporate Email (SMTP)</Select.Option>
              <Select.Option value="Internal Broadcast">ERP Internal Push Announcement</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="recipient" label="Target Recipient / Contact Number" rules={[{ required: true }]}>
            <Input placeholder="e.g. procurement@tatasteel.com or +91 98401 22841" />
          </Form.Item>

          <Form.Item name="subject" label="Message Content / Notification Text" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Write message body or select dynamic ERP template variables..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
