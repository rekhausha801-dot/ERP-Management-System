import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip, Divider } from 'antd';
import { History, CheckCircle, Clock, AlertTriangle, Download, Plus, FileText, UserMinus } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface ExitItem {
  key: string;
  exitId: string;
  empId: string;
  empName: string;
  department: string;
  resignationDate: string;
  lastWorkingDay: string;
  noticePeriod: string;
  clearanceStatus: 'Pending IT/Assets' | 'Accounts Clear' | 'Fully Cleared';
  settlementStatus: 'Under Computation' | 'Ready for Payout' | 'Settled';
  fnfAmount: string;
  status: 'In Notice' | 'Approved' | 'Exited';
}

const INITIAL_EXITS: ExitItem[] = [
  { key: '1', exitId: 'EXT-301', empId: 'EMP-006', empName: 'Karthik Raja', department: 'Accounts', resignationDate: '2026-10-15', lastWorkingDay: '2026-11-30', noticePeriod: '45 Days', clearanceStatus: 'Fully Cleared', settlementStatus: 'Ready for Payout', fnfAmount: '₹1,42,800', status: 'In Notice' },
  { key: '2', exitId: 'EXT-302', empId: 'EMP-014', empName: 'Ramesh Selvan', department: 'Field Services', resignationDate: '2026-11-01', lastWorkingDay: '2026-12-15', noticePeriod: '45 Days', clearanceStatus: 'Pending IT/Assets', settlementStatus: 'Under Computation', fnfAmount: '₹84,500', status: 'In Notice' },
  { key: '3', exitId: 'EXT-300', empId: 'EMP-009', empName: 'Priya Mani', department: 'Enterprise Sales', resignationDate: '2026-08-10', lastWorkingDay: '2026-09-25', noticePeriod: '45 Days', clearanceStatus: 'Fully Cleared', settlementStatus: 'Settled', fnfAmount: '₹1,95,000', status: 'Exited' },
];

export const ExitManagementPage: React.FC = () => {
  const [exits, setExits] = useState<ExitItem[]>(INITIAL_EXITS);
  const [activeTab, setActiveTab] = useState('all');
  const [isResignModal, setIsResignModal] = useState(false);
  const [form] = Form.useForm();

  const handleApplyResignation = (values: any) => {
    const newExit: ExitItem = {
      key: String(Date.now()),
      exitId: `EXT-${300 + exits.length + 1}`,
      empId: 'EMP-0' + Math.floor(10 + Math.random() * 80),
      empName: values.empName,
      department: values.department || 'Operations',
      resignationDate: new Date().toISOString().split('T')[0],
      lastWorkingDay: '2026-12-31',
      noticePeriod: '30 Days',
      clearanceStatus: 'Pending IT/Assets',
      settlementStatus: 'Under Computation',
      fnfAmount: 'Calculating...',
      status: 'In Notice',
    };
    setExits([newExit, ...exits]);
    message.success(`Resignation workflow initialized for ${values.empName}!`);
    setIsResignModal(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Exit ID', dataIndex: 'exitId', key: 'exitId', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Employee', dataIndex: 'empName', key: 'empName', render: (n: string) => <strong>{n}</strong> },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (d: string) => <Tag color="blue">{d}</Tag> },
    { title: 'Resigned On', dataIndex: 'resignationDate', key: 'resignationDate' },
    { title: 'Last Working Day', dataIndex: 'lastWorkingDay', key: 'lastWorkingDay', render: (d: string) => <Tag color="orange">{d}</Tag> },
    {
      title: 'Department Clearance',
      dataIndex: 'clearanceStatus',
      key: 'clearanceStatus',
      render: (c: string) => <Tag color={c === 'Fully Cleared' ? 'green' : 'gold'}>{c}</Tag>,
    },
    {
      title: 'F&F Settlement',
      dataIndex: 'settlementStatus',
      key: 'settlementStatus',
      render: (s: string, r: ExitItem) => (
        <div>
          <Tag color={s === 'Settled' ? 'green' : s === 'Ready for Payout' ? 'purple' : 'default'}>{s}</Tag>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#19153B', marginTop: 2 }}>{r.fnfAmount}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <Tag color={st === 'Exited' ? 'default' : 'processing'}>{st}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, r: ExitItem) => r.clearanceStatus !== 'Fully Cleared' ? (
        <Button size="small" type="primary" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => {
          setExits(exits.map(e => e.exitId === r.exitId ? { ...e, clearanceStatus: 'Fully Cleared', settlementStatus: 'Ready for Payout' } : e));
          message.success(`Clearance checklist signed off for ${r.empName}!`);
        }}>
          Signoff
        </Button>
      ) : r.settlementStatus === 'Ready for Payout' ? (
        <Button size="small" type="primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }} onClick={() => {
          setExits(exits.map(e => e.exitId === r.exitId ? { ...e, settlementStatus: 'Settled', status: 'Exited' } : e));
          message.success(`F&F Settlement disbursed for ${r.empName}!`);
        }}>
          Disburse F&F
        </Button>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Archived</Text>,
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Employee Exit Management"
        subtitle="Resignation requests, asset recovery signoffs, notice period tracking, and Full & Final (F&F) settlements."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Exit records exported')}>
              Export
            </Button>
            <Button type="primary" icon={<UserMinus size={15} />} danger onClick={() => setIsResignModal(true)}>
              Initiate Resignation
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="In Notice Period" value={exits.filter(e => e.status === 'In Notice').length} prefix={<Clock size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Pending Clearances" value={exits.filter(e => e.clearanceStatus.includes('Pending')).length} prefix={<AlertTriangle size={16} color="#EF4444" />} valueStyle={{ color: '#EF4444', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Ready for Settlement" value={exits.filter(e => e.settlementStatus === 'Ready for Payout').length} prefix={<CheckCircle size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Exited Alumni Total" value={exits.filter(e => e.status === 'Exited').length} prefix={<History size={16} color="#6E56CF" />} valueStyle={{ color: '#6E56CF', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Exit Cases (${exits.length})` },
            { key: 'notice', label: 'Active Notice Period' },
            { key: 'clearance', label: 'Asset & IT Clearance' },
            { key: 'settlement', label: 'F&F Final Settlements' },
          ]}
        />

        <Table dataSource={exits} columns={columns} pagination={{ pageSize: 8 }} />
      </Card>

      {/* Resignation Modal */}
      <Modal title="Initiate Resignation Workflow" open={isResignModal} onCancel={() => setIsResignModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleApplyResignation}>
          <Form.Item label="Employee Name" name="empName" rules={[{ required: true, message: 'Please enter employee name' }]}>
            <Input placeholder="e.g. Ramesh Selvan" />
          </Form.Item>
          <Form.Item label="Department" name="department" initialValue="Field Services">
            <Select options={[
              { value: 'Field Services', label: 'Field Services' },
              { value: 'Enterprise Sales', label: 'Enterprise Sales' },
              { value: 'Accounts', label: 'Accounts' },
              { value: 'Operations', label: 'Operations' },
            ]} />
          </Form.Item>
          <Form.Item label="Reason for Separation" name="reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Better opportunity / Personal relocation / Career progression" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsResignModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" danger>Initiate Exit</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
