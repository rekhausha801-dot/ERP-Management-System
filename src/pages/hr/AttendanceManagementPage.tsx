import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip } from 'antd';
import { Clock, CheckCircle, AlertTriangle, Download, Calendar, Filter, UserCheck, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface AttendanceRecord {
  key: string;
  empId: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
  overtime: string;
  source: 'Biometric' | 'Web Portal' | 'Manual Regularized';
}

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { key: '1', empId: 'EMP-001', name: 'Janani Ramesh', date: '2026-11-16', checkIn: '09:05 AM', checkOut: '--:--', totalHours: '7.5 hrs', status: 'Present', overtime: '0 hrs', source: 'Biometric' },
  { key: '2', empId: 'EMP-002', name: 'Vikram Seth', date: '2026-11-16', checkIn: '09:42 AM', checkOut: '--:--', totalHours: '6.8 hrs', status: 'Late', overtime: '0 hrs', source: 'Biometric' },
  { key: '3', empId: 'EMP-003', name: 'Murugan K.', date: '2026-11-16', checkIn: '08:50 AM', checkOut: '--:--', totalHours: '8.1 hrs', status: 'Present', overtime: '1.5 hrs', source: 'Web Portal' },
  { key: '4', empId: 'EMP-004', name: 'Ananya Sharma', date: '2026-11-16', checkIn: '09:10 AM', checkOut: '--:--', totalHours: '7.4 hrs', status: 'Present', overtime: '0 hrs', source: 'Biometric' },
  { key: '5', empId: 'EMP-005', name: 'Dinesh V.', date: '2026-11-16', checkIn: '--:--', checkOut: '--:--', totalHours: '0 hrs', status: 'On Leave', overtime: '0 hrs', source: 'Web Portal' },
  { key: '6', empId: 'EMP-006', name: 'Karthik Raja', date: '2026-11-16', checkIn: '--:--', checkOut: '--:--', totalHours: '0 hrs', status: 'Absent', overtime: '0 hrs', source: 'Biometric' },
];

export const AttendanceManagementPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [activeTab, setActiveTab] = useState('daily');
  const [isCheckInModal, setIsCheckInModal] = useState(false);
  const [isRegularizeModal, setIsRegularizeModal] = useState(false);
  const [form] = Form.useForm();
  const [regForm] = Form.useForm();

  const handleManualCheckIn = (values: any) => {
    const newRecord: AttendanceRecord = {
      key: String(Date.now()),
      empId: values.empId,
      name: values.name,
      date: new Date().toISOString().split('T')[0],
      checkIn: values.checkIn || '09:00 AM',
      checkOut: values.checkOut || '--:--',
      totalHours: '8.0 hrs',
      status: values.status || 'Present',
      overtime: values.overtime || '0 hrs',
      source: 'Manual Regularized',
    };
    setRecords([newRecord, ...records]);
    message.success(`Attendance logged for ${values.name}!`);
    setIsCheckInModal(false);
    form.resetFields();
  };

  const filtered = records.filter(r => {
    if (activeTab === 'daily') return true;
    if (activeTab === 'late') return r.status === 'Late';
    if (activeTab === 'absent') return r.status === 'Absent';
    if (activeTab === 'overtime') return r.overtime !== '0 hrs';
    return true;
  });

  const columns = [
    { title: 'Emp ID', dataIndex: 'empId', key: 'empId', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Employee Name', dataIndex: 'name', key: 'name', render: (n: string) => <strong>{n}</strong> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Punch In', dataIndex: 'checkIn', key: 'checkIn' },
    { title: 'Punch Out', dataIndex: 'checkOut', key: 'checkOut' },
    { title: 'Total Hours', dataIndex: 'totalHours', key: 'totalHours' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color = st === 'Present' ? 'success' : st === 'Late' ? 'warning' : st === 'Absent' ? 'error' : 'default';
        return <Tag color={color}>{st}</Tag>;
      },
    },
    { title: 'Overtime', dataIndex: 'overtime', key: 'overtime', render: (ot: string) => ot !== '0 hrs' ? <Tag color="purple">{ot}</Tag> : <Text type="secondary">-</Text> },
    { title: 'Capture Mode', dataIndex: 'source', key: 'source', render: (s: string) => <Tag>{s}</Tag> },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Attendance Management"
        subtitle="Daily biometric logs, shift punches, overtime computation, and regularization requests."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Attendance report downloaded')}>
              Export Report
            </Button>
            <Button onClick={() => setIsRegularizeModal(true)}>
              Regularize Punch
            </Button>
            <Button type="primary" icon={<Clock size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsCheckInModal(true)}>
              Manual Punch In
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Present Today" value={records.filter(r => r.status === 'Present').length} prefix={<CheckCircle size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Late Arrivals" value={records.filter(r => r.status === 'Late').length} prefix={<AlertTriangle size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Absentees" value={records.filter(r => r.status === 'Absent').length} prefix={<ShieldAlert size={16} color="#EF4444" />} valueStyle={{ color: '#EF4444', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="On Overtime" value={records.filter(r => r.overtime !== '0 hrs').length} prefix={<Clock size={16} color="#6E56CF" />} valueStyle={{ color: '#6E56CF', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'daily', label: 'Daily Attendance' },
            { key: 'late', label: 'Late Arrivals' },
            { key: 'absent', label: 'Absentees' },
            { key: 'overtime', label: 'Overtime Tracking' },
            { key: 'regularization', label: 'Regularization Requests' },
            { key: 'shifts', label: 'Shift & Attendance Policies' },
          ]}
        />

        {activeTab !== 'shifts' && activeTab !== 'regularization' ? (
          <Table dataSource={filtered} columns={columns} pagination={{ pageSize: 8 }} />
        ) : activeTab === 'shifts' ? (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', shiftName: 'General Morning Shift', timings: '09:00 AM - 06:00 PM', gracePeriod: '15 Mins', halfDayCutoff: '01:30 PM', applicableStaff: 'HQ & Admin Staff' },
                { key: '2', shiftName: 'Field Service Early Shift', timings: '08:00 AM - 05:00 PM', gracePeriod: '10 Mins', halfDayCutoff: '12:30 PM', applicableStaff: 'Service Engineers' },
                { key: '3', shiftName: 'Night Breakdown Support', timings: '06:00 PM - 02:00 AM', gracePeriod: '20 Mins', halfDayCutoff: '10:00 PM', applicableStaff: 'Emergency On-Call' },
              ]}
              columns={[
                { title: 'Shift Name', dataIndex: 'shiftName', key: 'shiftName', render: (t: string) => <strong>{t}</strong> },
                { title: 'Shift Timings', dataIndex: 'timings', key: 'timings' },
                { title: 'Grace Period', dataIndex: 'gracePeriod', key: 'gracePeriod' },
                { title: 'Half-Day Cutoff', dataIndex: 'halfDayCutoff', key: 'halfDayCutoff' },
                { title: 'Target Department', dataIndex: 'applicableStaff', key: 'applicableStaff', render: (t: string) => <Tag color="purple">{t}</Tag> },
              ]}
              pagination={false}
            />
          </div>
        ) : (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', emp: 'Vikram Seth', date: '2026-11-15', reason: 'Biometric Scanner Glitch at Gate 2', requestedTime: '09:00 AM', status: 'Pending Review' },
                { key: '2', emp: 'Murugan K.', date: '2026-11-14', reason: 'Client Emergency Breakdown on site', requestedTime: '08:30 AM', status: 'Approved' },
              ]}
              columns={[
                { title: 'Employee', dataIndex: 'emp', key: 'emp', render: (t: string) => <strong>{t}</strong> },
                { title: 'Incident Date', dataIndex: 'date', key: 'date' },
                { title: 'Reason Description', dataIndex: 'reason', key: 'reason' },
                { title: 'Proposed Punch', dataIndex: 'requestedTime', key: 'requestedTime' },
                { title: 'Approval Status', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color={st === 'Approved' ? 'green' : 'gold'}>{st}</Tag> },
                { title: 'Actions', render: () => <Space><Button size="small" type="primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }} onClick={() => message.success('Punch approved')}>Approve</Button><Button size="small" danger onClick={() => message.info('Punch rejected')}>Reject</Button></Space> },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Card>

      {/* Manual CheckIn Modal */}
      <Modal title="Manual Punch-In Record" open={isCheckInModal} onCancel={() => setIsCheckInModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleManualCheckIn}>
          <Form.Item label="Employee ID" name="empId" initialValue="EMP-001" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Employee Name" name="name" initialValue="Janani Ramesh" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Punch In Time" name="checkIn" initialValue="09:00 AM" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Attendance Status" name="status" initialValue="Present">
            <Select options={[{ value: 'Present', label: 'Present' }, { value: 'Late', label: 'Late' }, { value: 'Half Day', label: 'Half Day' }]} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCheckInModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Submit Punch</Button>
          </div>
        </Form>
      </Modal>

      {/* Regularize Modal */}
      <Modal title="Submit Attendance Regularization" open={isRegularizeModal} onCancel={() => setIsRegularizeModal(false)} footer={null}>
        <Form form={regForm} layout="vertical" onFinish={() => { message.success('Regularization request submitted to HR!'); setIsRegularizeModal(false); }}>
          <Form.Item label="Select Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Reason for Missing/Incorrect Punch" name="reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Provide details e.g., On-site visit, hardware sensor fault" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsRegularizeModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Submit Request</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
