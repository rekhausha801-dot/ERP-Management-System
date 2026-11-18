import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip } from 'antd';
import { Calendar, CheckCircle, Clock, AlertTriangle, Download, Plus, FileText, UserCheck } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface LeaveRequestItem {
  key: string;
  id: string;
  empName: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity / Paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

const INITIAL_REQUESTS: LeaveRequestItem[] = [
  { key: '1', id: 'LR-101', empName: 'Dinesh V.', leaveType: 'Casual Leave', startDate: '2026-11-16', endDate: '2026-11-17', days: 2, reason: 'Family emergency / personal commitment', status: 'Approved', appliedOn: '2026-11-14' },
  { key: '2', id: 'LR-102', empName: 'Vikram Seth', leaveType: 'Earned Leave', startDate: '2026-11-20', endDate: '2026-11-24', days: 5, reason: 'Annual travel vacation', status: 'Pending', appliedOn: '2026-11-15' },
  { key: '3', id: 'LR-103', empName: 'Murugan K.', leaveType: 'Sick Leave', startDate: '2026-11-12', endDate: '2026-11-13', days: 2, reason: 'Seasonal fever / medical rest', status: 'Approved', appliedOn: '2026-11-12' },
  { key: '4', id: 'LR-104', empName: 'Ananya Sharma', leaveType: 'Casual Leave', startDate: '2026-11-28', endDate: '2026-11-28', days: 1, reason: 'Bank work & official document renewal', status: 'Pending', appliedOn: '2026-11-16' },
];

export const LeaveManagementPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState('requests');
  const [isApplyModal, setIsApplyModal] = useState(false);
  const [form] = Form.useForm();

  const handleApplyLeave = (values: any) => {
    const newReq: LeaveRequestItem = {
      key: String(Date.now()),
      id: `LR-${100 + requests.length + 1}`,
      empName: values.empName || 'Janani Ramesh',
      leaveType: values.leaveType,
      startDate: '2026-11-22',
      endDate: '2026-11-23',
      days: Number(values.days) || 1,
      reason: values.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setRequests([newReq, ...requests]);
    message.success('Leave application submitted for approval!');
    setIsApplyModal(false);
    form.resetFields();
  };

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    message.success(`Leave request ${id} marked as ${newStatus}!`);
  };

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Employee', dataIndex: 'empName', key: 'empName', render: (n: string) => <strong>{n}</strong> },
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType', render: (lt: string) => <Tag color="blue">{lt}</Tag> },
    { title: 'Dates', render: (_: any, r: LeaveRequestItem) => `${r.startDate} to ${r.endDate}` },
    { title: 'Days', dataIndex: 'days', key: 'days', render: (d: number) => <Tag color="purple">{d} Day(s)</Tag> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <Tag color={st === 'Approved' ? 'green' : st === 'Pending' ? 'gold' : 'red'}>{st}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: LeaveRequestItem) => r.status === 'Pending' ? (
        <Space>
          <Button size="small" type="primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }} onClick={() => handleStatusChange(r.id, 'Approved')}>
            Approve
          </Button>
          <Button size="small" danger onClick={() => handleStatusChange(r.id, 'Rejected')}>
            Reject
          </Button>
        </Space>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>Completed</Text>,
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Leave Management"
        subtitle="Employee leave requests, approvals workflow, vacation balances, and company holiday calendar."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Leave ledger exported')}>
              Export Report
            </Button>
            <Button type="primary" icon={<Plus size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsApplyModal(true)}>
              Apply Leave
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Pending Approvals" value={requests.filter(r => r.status === 'Pending').length} prefix={<Clock size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Approved Leaves" value={requests.filter(r => r.status === 'Approved').length} prefix={<CheckCircle size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Casual Leave Pool" value="12 Days" valueStyle={{ color: '#19153B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Upcoming Holidays" value="2 Days" prefix={<Calendar size={16} color="#6E56CF" />} valueStyle={{ color: '#6E56CF', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'requests', label: 'Leave Requests & Approvals' },
            { key: 'balances', label: 'Leave Balances by Staff' },
            { key: 'holidays', label: 'Company Holiday Calendar' },
            { key: 'policies', label: 'Leave Policies & Types' },
          ]}
        />

        {activeTab === 'requests' ? (
          <Table dataSource={requests} columns={columns} pagination={{ pageSize: 8 }} />
        ) : activeTab === 'balances' ? (
          <Table
            dataSource={[
              { key: '1', emp: 'Janani Ramesh', casual: '8 / 12', sick: '6 / 8', earned: '15 / 18', totalAvail: '29 Days' },
              { key: '2', emp: 'Vikram Seth', casual: '4 / 12', sick: '5 / 8', earned: '10 / 18', totalAvail: '19 Days' },
              { key: '3', emp: 'Murugan K.', casual: '6 / 12', sick: '3 / 8', earned: '12 / 18', totalAvail: '21 Days' },
              { key: '4', emp: 'Ananya Sharma', casual: '9 / 12', sick: '7 / 8', earned: '16 / 18', totalAvail: '32 Days' },
            ]}
            columns={[
              { title: 'Employee', dataIndex: 'emp', key: 'emp', render: (t: string) => <strong>{t}</strong> },
              { title: 'Casual Leave (CL)', dataIndex: 'casual', key: 'casual' },
              { title: 'Sick Leave (SL)', dataIndex: 'sick', key: 'sick' },
              { title: 'Earned Leave (EL)', dataIndex: 'earned', key: 'earned' },
              { title: 'Total Available Balance', dataIndex: 'totalAvail', key: 'totalAvail', render: (t: string) => <Tag color="green">{t}</Tag> },
            ]}
            pagination={false}
          />
        ) : activeTab === 'holidays' ? (
          <Table
            dataSource={[
              { key: '1', date: '2026-01-26', holiday: 'Republic Day', day: 'Monday', type: 'National Public Holiday' },
              { key: '2', date: '2026-04-14', holiday: 'Tamil New Year & Ambedkar Jayanti', day: 'Tuesday', type: 'Regional State Holiday' },
              { key: '3', date: '2026-05-01', holiday: 'May Day', day: 'Friday', type: 'Commercial Holiday' },
              { key: '4', date: '2026-08-15', holiday: 'Independence Day', day: 'Saturday', type: 'National Public Holiday' },
              { key: '5', date: '2026-10-20', holiday: 'Ayudha Pooja & Vijayadashami', day: 'Tuesday', type: 'Festive Holiday' },
              { key: '6', date: '2026-11-08', holiday: 'Deepavali', day: 'Sunday', type: 'Festive Holiday' },
              { key: '7', date: '2026-12-25', holiday: 'Christmas', day: 'Friday', type: 'National Public Holiday' },
            ]}
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date', render: (d: string) => <strong>{d}</strong> },
              { title: 'Holiday Occasion', dataIndex: 'holiday', key: 'holiday' },
              { title: 'Day', dataIndex: 'day', key: 'day' },
              { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="purple">{t}</Tag> },
            ]}
            pagination={false}
          />
        ) : (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', type: 'Casual Leave (CL)', maxDays: '12 Days / Yr', carryForward: 'No', encashable: 'No', description: 'Urgent personal work, doctor appointments' },
                { key: '2', type: 'Sick / Medical Leave (SL)', maxDays: '8 Days / Yr', carryForward: 'Yes (Up to 15)', encashable: 'No', description: 'Medical recovery, doctor certificate needed for > 2 days' },
                { key: '3', type: 'Earned / Privilege Leave (EL)', maxDays: '18 Days / Yr', carryForward: 'Yes (Up to 45)', encashable: 'Yes (At exit)', description: 'Planned vacations, requires 7 days advance notice' },
                { key: '4', type: 'Maternity Leave', maxDays: '26 Weeks', carryForward: 'No', encashable: 'No', description: 'Statutory maternity support as per maternity benefit act' },
              ]}
              columns={[
                { title: 'Leave Type', dataIndex: 'type', key: 'type', render: (t: string) => <strong>{t}</strong> },
                { title: 'Annual Quota', dataIndex: 'maxDays', key: 'maxDays' },
                { title: 'Carry Forward', dataIndex: 'carryForward', key: 'carryForward' },
                { title: 'Encashable', dataIndex: 'encashable', key: 'encashable' },
                { title: 'Policy Notes', dataIndex: 'description', key: 'description' },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Card>

      {/* Apply Leave Modal */}
      <Modal title="Apply For Leave" open={isApplyModal} onCancel={() => setIsApplyModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleApplyLeave}>
          <Form.Item label="Employee Name" name="empName" initialValue="Janani Ramesh" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Leave Type" name="leaveType" initialValue="Casual Leave" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Casual Leave', label: 'Casual Leave' },
              { value: 'Sick Leave', label: 'Sick Leave' },
              { value: 'Earned Leave', label: 'Earned Leave' },
            ]} />
          </Form.Item>
          <Form.Item label="Number of Days" name="days" initialValue={1} rules={[{ required: true }]}>
            <Input type="number" min={1} max={30} />
          </Form.Item>
          <Form.Item label="Reason for Leave" name="reason" rules={[{ required: true, message: 'Please specify the reason' }]}>
            <Input.TextArea rows={3} placeholder="Provide brief reason for request..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsApplyModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Submit Application</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
