import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip } from 'antd';
import { Receipt, CreditCard, Truck, CheckCircle, Clock, AlertTriangle, Download, Plus } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface ExpenseItem {
  key: string;
  claimId: string;
  empName: string;
  category: 'Travel Allowance' | 'Fuel & Conveyance' | 'Client Entertainment' | 'Tools & Consumables' | 'Lodging';
  amount: number;
  date: string;
  receiptNumber: string;
  status: 'Approved' | 'Pending Approval' | 'Reimbursed';
  remarks: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  { key: '1', claimId: 'EXP-801', empName: 'Murugan K.', category: 'Fuel & Conveyance', amount: 3450, date: '2026-11-15', receiptNumber: 'HP-PET-90412', status: 'Reimbursed', remarks: 'Client emergency visit to Coimbatore industrial cluster' },
  { key: '2', claimId: 'EXP-802', empName: 'Vikram Seth', category: 'Client Entertainment', amount: 4800, date: '2026-11-14', receiptNumber: 'REST-CH-1102', status: 'Approved', remarks: 'Dinner meeting with Apex Precision Works directors' },
  { key: '3', claimId: 'EXP-803', empName: 'Dinesh V.', category: 'Travel Allowance', amount: 2200, date: '2026-11-16', receiptNumber: 'BUS-TN-4890', status: 'Pending Approval', remarks: 'Inter-city bus transit for site maintenance' },
  { key: '4', claimId: 'EXP-804', empName: 'Ananya Sharma', category: 'Tools & Consumables', amount: 1650, date: '2026-11-10', receiptNumber: 'STAT-00918', status: 'Reimbursed', remarks: 'Office stationeries & induction badge printings' },
];

export const ExpenseManagementPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activeTab, setActiveTab] = useState('all');
  const [isClaimModal, setIsClaimModal] = useState(false);
  const [form] = Form.useForm();

  const handleCreateClaim = (values: any) => {
    const newClaim: ExpenseItem = {
      key: String(Date.now()),
      claimId: `EXP-${800 + expenses.length + 1}`,
      empName: values.empName || 'Janani Ramesh',
      category: values.category,
      amount: Number(values.amount) || 1000,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: values.receiptNumber || 'RCP-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Pending Approval',
      remarks: values.remarks || 'Standard field expenditure',
    };
    setExpenses([newClaim, ...expenses]);
    message.success('Expense claim filed successfully!');
    setIsClaimModal(false);
    form.resetFields();
  };

  const handleStatusChange = (claimId: string, newStatus: ExpenseItem['status']) => {
    setExpenses(expenses.map(e => e.claimId === claimId ? { ...e, status: newStatus } : e));
    message.success(`Expense ${claimId} marked as ${newStatus}!`);
  };

  const columns = [
    { title: 'Claim ID', dataIndex: 'claimId', key: 'claimId', render: (t: string) => <Text strong style={{ color: '#4C1D95' }}>{t}</Text> },
    { title: 'Employee', dataIndex: 'empName', key: 'empName', render: (n: string) => <strong>{n}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (c: string) => <Tag color="blue">{c}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a: number) => <span style={{ fontWeight: 700, color: '#19153B' }}>₹{a.toLocaleString()}</span> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Bill / Receipt #', dataIndex: 'receiptNumber', key: 'receiptNumber' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color = st === 'Reimbursed' ? 'green' : st === 'Approved' ? 'purple' : 'gold';
        return <Tag color={color}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: ExpenseItem) => r.status === 'Pending Approval' ? (
        <Space>
          <Button size="small" type="primary" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }} onClick={() => handleStatusChange(r.claimId, 'Approved')}>
            Approve
          </Button>
          <Button size="small" danger onClick={() => handleStatusChange(r.claimId, 'Reimbursed')}>
            Direct Pay
          </Button>
        </Space>
      ) : r.status === 'Approved' ? (
        <Button size="small" type="primary" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }} onClick={() => handleStatusChange(r.claimId, 'Reimbursed')}>
          Mark Paid
        </Button>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Settled</Text>,
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Expense & Reimbursement"
        subtitle="Employee travel allowances, fuel vouchers, incidentals, and direct bank reimbursements."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Expense register exported')}>
              Export
            </Button>
            <Button type="primary" icon={<Plus size={15} />} style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }} onClick={() => setIsClaimModal(true)}>
              File Expense Claim
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Total Claims (MTD)" value="₹12,100" prefix={<Receipt size={16} color="#4C1D95" />} valueStyle={{ color: '#19153B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Pending Approvals" value={expenses.filter(e => e.status === 'Pending Approval').length} prefix={<Clock size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Approved to Disburse" value={expenses.filter(e => e.status === 'Approved').length} prefix={<CheckCircle size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Reimbursed (Settled)" value="₹5,100" prefix={<CreditCard size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Claims (${expenses.length})` },
            { key: 'travel', label: 'Travel & Conveyance' },
            { key: 'fuel', label: 'Fuel & Fleet Vouchers' },
            { key: 'settled', label: 'Reimbursed Ledger' },
          ]}
        />

        <Table dataSource={expenses} columns={columns} pagination={{ pageSize: 8 }} />
      </Card>

      {/* Claim Modal */}
      <Modal title="File Official Expense Claim" open={isClaimModal} onCancel={() => setIsClaimModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreateClaim}>
          <Form.Item label="Employee Name" name="empName" initialValue="Janani Ramesh" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Expense Category" name="category" initialValue="Fuel & Conveyance" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Fuel & Conveyance', label: 'Fuel & Conveyance' },
              { value: 'Travel Allowance', label: 'Travel Allowance' },
              { value: 'Client Entertainment', label: 'Client Entertainment' },
              { value: 'Tools & Consumables', label: 'Tools & Consumables' },
              { value: 'Lodging', label: 'Lodging' },
            ]} />
          </Form.Item>
          <Form.Item label="Claim Amount (INR)" name="amount" initialValue={1500} rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Bill / Voucher / Receipt Number" name="receiptNumber">
            <Input placeholder="e.g. BILL-99201" />
          </Form.Item>
          <Form.Item label="Description & Purpose" name="remarks">
            <Input.TextArea rows={3} placeholder="Provide visit purpose or business justification..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsClaimModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }}>Submit Claim</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
