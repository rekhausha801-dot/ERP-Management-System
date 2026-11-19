import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Progress, Avatar, Typography, Tabs, DatePicker, message, Modal, Form, Input, Select } from 'antd';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  CreditCard,
  Briefcase,
  TrendingUp,
  Award,
  AlertCircle,
  FileText,
  Plus,
  CheckCircle2,
  PieChart as PieIcon,
  DollarSign,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../../components';
import { KPICard } from '../../components/dashboard/KPICard';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ATTENDANCE_TREND_DATA = [
  { day: 'Mon', present: 142, absent: 6, leave: 4 },
  { day: 'Tue', present: 145, absent: 4, leave: 3 },
  { day: 'Wed', present: 141, absent: 7, leave: 4 },
  { day: 'Thu', present: 144, absent: 5, leave: 3 },
  { day: 'Fri', present: 146, absent: 3, leave: 3 },
  { day: 'Sat', present: 98, absent: 2, leave: 4 },
];

const DEPT_DISTRIBUTION = [
  { name: 'Field Services', value: 48, color: '#6E56CF' },
  { name: 'Service Contracts', value: 38, color: '#3A2E78' },
  { name: 'Customer Support Desk', value: 24, color: '#8874E8' },
  { name: 'Finance & Accounts', value: 16, color: '#10B981' },
  { name: 'Operations & HR', value: 12, color: '#F59E0B' },
];

export const HrDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Human Resources & Workforce Management"
        subtitle="Centralized personnel management, biometric attendance synchronization, statutory payroll, and workforce productivity."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              icon={<Calendar size={14} />}
              onClick={() => navigate('/app/hr/holiday-calendar')}
            >
              Holiday Calendar
            </Button>
            <Button
              type="primary"
              icon={<Plus size={14} />}
              style={{ backgroundColor: '#6E56CF', borderRadius: 10, fontWeight: 700 }}
              onClick={() => setIsLeaveModalOpen(true)}
            >
              Apply Leave Request
            </Button>
          </div>
        }
      />

      {/* Top 8 Primary HR KPI Metrics */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Employees"
            value="152"
            trend={{ value: '+4 Joined this Month', isPositive: true }}
            icon={<Users size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/hr/all-employees')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Workforce"
            value="148"
            trend={{ value: '97.4% Active Retention', isPositive: true }}
            icon={<UserCheck size={20} color="#10B981" />}
            iconBgColor="#E6FDF4"
            onClick={() => navigate('/app/hr/all-employees')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Present Today"
            value="141"
            trend={{ value: '94.2% Attendance Rate', isPositive: true }}
            icon={<Clock size={20} color="#10B981" />}
            iconBgColor="#E6FDF4"
            onClick={() => navigate('/app/hr/daily-attendance')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Absent Today"
            value="4"
            trend={{ value: 'Unplanned Leave', isPositive: false }}
            icon={<AlertCircle size={20} color="#EF4444" />}
            iconBgColor="#FEE2E2"
            onClick={() => navigate('/app/hr/absentees')}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="On Approved Leave"
            value="7"
            trend={{ value: '4 Planned CL | 3 Sick', isPositive: true }}
            icon={<Calendar size={20} color="#F59E0B" />}
            iconBgColor="#FEF3C7"
            onClick={() => navigate('/app/hr/leave-requests')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Pending Leave Approvals"
            value="3 Requests"
            trend={{ value: 'Requires Manager Action', isPositive: false }}
            icon={<Clock size={20} color="#8B5CF6" />}
            iconBgColor="#EDE9FE"
            onClick={() => navigate('/app/hr/leave-approval')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Monthly Net Payroll"
            value="₹42.80 L"
            trend={{ value: 'TDS & PF Reconciled', isPositive: true }}
            icon={<DollarSign size={20} color="#10B981" />}
            iconBgColor="#E6FDF4"
            onClick={() => navigate('/app/hr/payroll-processing')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Assigned Tasks"
            value="84"
            trend={{ value: '72 On Track | 12 Due', isPositive: true }}
            icon={<Briefcase size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/hr/task-dashboard')}
          />
        </Col>
      </Row>

      {/* Middle Row: Attendance Trend & Department Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        <Col xs={24} lg={15}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Weekly Workforce Attendance Trends</span>}
            extra={<span style={{ fontSize: 11, color: '#7E7A9B' }}>Biometric Sync (Current Week)</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '10px 22px 20px' } }}
          >
            <div style={{ height: 260, width: '100%', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, backgroundColor: '#1E1938', border: 'none', color: '#FFF' }} />
                  <Bar dataKey="present" name="Present Staff" fill="#6E56CF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leave" name="Approved Leave" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Unexcused Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Department Distribution */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Department Headcount</span>}
            extra={<span style={{ fontSize: 11, color: '#7E7A9B' }}>152 Total</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 20px 20px' } }}
          >
            <div style={{ height: 140, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DEPT_DISTRIBUTION} innerRadius={42} outerRadius={60} paddingAngle={4} dataKey="value">
                    {DEPT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {DEPT_DISTRIBUTION.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: d.color }} />
                    <span style={{ color: '#181433', fontWeight: 600 }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#6E56CF' }}>{d.value} Staff</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row: Pending Leave Approvals & Recent HR Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Pending Leave Requests (Awaiting Action)</span>}
            extra={<Button type="link" size="small" onClick={() => navigate('/app/hr/leave-approval')} style={{ color: '#6E56CF', fontWeight: 700 }}>Leave Desk &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '10px 22px 20px' } }}
          >
            <Table
              dataSource={[
                { key: '1', emp: 'Dinesh V.', dept: 'Field Services', type: 'Annual Earned Leave', dates: 'Nov 18 - Nov 20 (3 Days)', reason: 'Family Function in native', status: 'Pending Manager' },
                { key: '2', emp: 'Priya Narayanan', dept: 'Service Contracts', type: 'Casual Leave', dates: 'Nov 19 (1 Day)', reason: 'Personal work', status: 'Pending HR' },
                { key: '3', emp: 'Karthik Raja', dept: 'Warehouse Ops', type: 'Sick Leave', dates: 'Nov 17 - Nov 18 (2 Days)', reason: 'Medical appointment', status: 'Pending Manager' },
              ]}
              pagination={false}
              size="small"
              columns={[
                { title: 'Employee', dataIndex: 'emp', key: 'emp', render: (t, r) => <div><div style={{ fontWeight: 700 }}>{t}</div><div style={{ fontSize: 11, color: '#7E7A9B' }}>{r.dept}</div></div> },
                { title: 'Leave Type', dataIndex: 'type', key: 'type', render: (tp) => <Tag color="purple">{tp}</Tag> },
                { title: 'Duration', dataIndex: 'dates', key: 'dates', render: (d) => <span style={{ fontWeight: 600 }}>{d}</span> },
                { title: 'Reason', dataIndex: 'reason', key: 'reason' },
                {
                  title: 'Actions',
                  key: 'act',
                  render: () => (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button size="small" type="primary" style={{ backgroundColor: '#10B981', borderRadius: 8, fontSize: 11 }} onClick={() => message.success('Leave Request Approved!')}>
                        Approve
                      </Button>
                      <Button size="small" danger style={{ borderRadius: 8, fontSize: 11 }} onClick={() => message.info('Leave Request Rejected')}>
                        Reject
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Upcoming Work Anniversaries & Birthdays */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Upcoming Events & Milestones</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 22px 20px' } }}
          >
            {[
              { name: 'Murugan K.', event: 'Work Anniversary (3 Years)', date: 'Nov 18, 2026', tag: '3 Years Service' },
              { name: 'Vikram Seth', event: 'Birthday Celebration 🎂', date: 'Nov 21, 2026', tag: 'Birthday' },
              { name: 'Ananya Sharma', event: 'Work Anniversary (2 Years)', date: 'Nov 25, 2026', tag: '2 Years Service' },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #FAF7FC' : 'none', fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#181433' }}>{ev.name}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>{ev.event}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color="cyan" style={{ borderRadius: 8, fontSize: 10 }}>{ev.tag}</Tag>
                  <div style={{ fontSize: 10, color: '#A5A1BE', marginTop: 2 }}>{ev.date}</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Leave Application Modal */}
      <Modal
        title="Apply for Employee Leave Request"
        open={isLeaveModalOpen}
        onCancel={() => setIsLeaveModalOpen(false)}
        onOk={() => {
          message.success('Leave Request successfully submitted for Manager Approval!');
          setIsLeaveModalOpen(false);
        }}
        okText="Submit Leave Request"
        okButtonProps={{ style: { backgroundColor: '#6E56CF', borderRadius: 10 } }}
      >
        <Form layout="vertical" style={{ marginTop: 14 }}>
          <Form.Item label="Select Employee" required>
            <Select placeholder="Choose employee">
              <Select.Option value="vikram">Vikram Seth (EMP-1001)</Select.Option>
              <Select.Option value="murugan">Murugan K. (EMP-1002)</Select.Option>
              <Select.Option value="ananya">Ananya Sharma (EMP-1003)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Leave Type" required>
            <Select placeholder="Choose leave category">
              <Select.Option value="cl">Casual Leave (CL) - 8 Days Available</Select.Option>
              <Select.Option value="sl">Sick Leave (SL) - 6 Days Available</Select.Option>
              <Select.Option value="el">Earned / Privilege Leave (EL) - 14 Days Available</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Leave Duration Dates" required>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Reason for Absence" required>
            <Input.TextArea rows={3} placeholder="Please provide official justification..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
