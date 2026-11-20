import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Typography,
  message,
} from 'antd';
import {
  UserCheck,
  CheckCircle2,
  Wallet,
  Clock,
  Search,
  Download,
  Printer,
  Calendar,
  Layers,
  BarChart3,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useReportsDatabase } from './reportsStore';
import { HrReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const HrReportsPage: React.FC = () => {
  const { hrReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [empStatusFilter, setEmpStatusFilter] = useState('ALL');
  const [payStatusFilter, setPayStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HrReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Filters
  const filteredData = useMemo(() => {
    return hrReports.filter((item) => {
      const matchSearch =
        item.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchText.toLowerCase());

      const matchDept = deptFilter === 'ALL' || item.department === deptFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      const matchEmpStatus = empStatusFilter === 'ALL' || item.employeeStatus === empStatusFilter;
      const matchPayStatus = payStatusFilter === 'ALL' || item.paymentStatus === payStatusFilter;

      return matchSearch && matchDept && matchBranch && matchEmpStatus && matchPayStatus;
    });
  }, [hrReports, searchText, deptFilter, branchFilter, empStatusFilter, payStatusFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalEmployees = filteredData.length;
    const presentToday = filteredData.filter((i) => i.attendancePercentage >= 90).length;
    const totalPayrollExpense = filteredData.reduce((acc, curr) => acc + curr.netSalary, 0);
    const pendingSalaryCount = filteredData.filter((i) => i.paymentStatus === 'Pending').length;

    return {
      totalEmployees,
      presentToday,
      totalPayrollExpense,
      pendingSalaryCount,
    };
  }, [filteredData]);

  const handleExport = (type: string) => {
    message.success(`Exporting HR & Payroll Performance Report to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      title: 'Emp ID & Code',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 120,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Employee Name & Role',
      key: 'empRole',
      render: (_: any, r: HrReportItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.employeeName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.designation} &bull; {r.department}
          </div>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Attendance %',
      dataIndex: 'attendancePercentage',
      key: 'attendancePercentage',
      width: 120,
      align: 'center' as const,
      render: (v: number) => {
        const color = v >= 95 ? '#10B981' : v >= 90 ? '#3B82F6' : '#EF4444';
        return <span style={{ fontWeight: 800, color }}>{v}%</span>;
      },
    },
    {
      title: 'Present / Absent',
      key: 'days',
      width: 130,
      align: 'center' as const,
      render: (_: any, r: HrReportItem) => (
        <span style={{ fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: '#10B981' }}>{r.presentDays}</span> pres /{' '}
          <span style={{ fontWeight: 700, color: r.absentDays > 0 ? '#EF4444' : '#64748B' }}>{r.absentDays}</span> abs
        </span>
      ),
    },
    {
      title: 'Leave Bal',
      dataIndex: 'leaveBalance',
      key: 'leaveBalance',
      width: 90,
      align: 'center' as const,
      render: (v: number) => <span style={{ color: '#475569', fontWeight: 600 }}>{v} d</span>,
    },
    {
      title: 'Gross Salary (₹)',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Net Salary (₹)',
      dataIndex: 'netSalary',
      key: 'netSalary',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹${v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Disbursement',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (status: string) => {
        const color = status === 'Paid' ? 'green' : 'gold';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: HrReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Audit Employee Dossier"
          onClick={() => {
            setSelectedRecord(r);
            setDetailModalOpen(true);
          }}
        />
      ),
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
            HR & Workforce Analytics Reports
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Monitor headcount strength, daily attendance percentage, leave balances, payroll cost liabilities, and technician overtime.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Payroll & Attendance Alert
          </Button>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print HR Report
          </Button>
          <Button icon={<Download size={14} />} onClick={() => handleExport('excel')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<FileSpreadsheet size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => handleExport('pdf')}
          >
            Download PDF
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
          title="Total Active Employees"
          value={summaryMetrics.totalEmployees}
          subtitle="Staff on payroll roster"
          trend={{ value: 'Multi-branch deployment', isPositive: true }}
          icon={<UserCheck size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="High Attendance Today (90%+)"
          value={summaryMetrics.presentToday}
          subtitle="Employees on active shift"
          trend={{ value: '94% average workforce punctuality', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Total Monthly Payroll Liability"
          value={`₹${summaryMetrics.totalPayrollExpense.toLocaleString('en-IN')}`}
          subtitle="Net salaries after statutory tax"
          trend={{ value: 'Bank batch NEFT ready', isPositive: true }}
          icon={<Wallet size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Pending Salary Payments"
          value={summaryMetrics.pendingSalaryCount}
          subtitle="Pending HR approval or disbursement"
          trend={{ value: 'Warehouse & field staff', isPositive: false }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Department Breakdown */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BarChart3 size={18} color="#1E3A8A" />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
            Department Workforce & Payroll Distribution
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Sales & Business Dev</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A', marginTop: 4 }}>₹1,13,160 / mo</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>2 Senior executives &bull; 94% Avg Attendance</div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Field Engineering & Service</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0D9488', marginTop: 4 }}>₹47,840 / mo</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Lead automation specialist &bull; 98% Attendance</div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Quality & Metrology</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#7C3AED', marginTop: 4 }}>₹44,160 / mo</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>1 Metrology engineer &bull; 88% Attendance</div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Warehouse & Logistics</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#EA580C', marginTop: 4 }}>₹32,200 / mo</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>1 Depot supervisor &bull; 20 Overtime hrs</div>
          </div>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
        styles={{ body: { padding: '14px 18px' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search emp ID, name, role..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={deptFilter} onChange={setDeptFilter}>
            <Select.Option value="ALL">All Departments</Select.Option>
            <Select.Option value="Sales & Business Dev">Sales & Business Dev</Select.Option>
            <Select.Option value="Field Engineering & Service">Field Engineering & Service</Select.Option>
            <Select.Option value="Quality & Metrology">Quality & Metrology</Select.Option>
            <Select.Option value="Warehouse & Logistics">Warehouse & Logistics</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
          </Select>

          <Select value={payStatusFilter} onChange={setPayStatusFilter}>
            <Select.Option value="ALL">All Salary Statuses</Select.Option>
            <Select.Option value="Paid">Disbursed (Paid)</Select.Option>
            <Select.Option value="Pending">Pending Payment</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
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
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} employees` }}
          scroll={{ x: 1250 }}
          size="middle"
        />
      </Card>

      {/* Drill-down Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Employee Service & Compensation Profile - {selectedRecord?.employeeName}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="payslip"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Generating official payslip PDF for ${selectedRecord?.employeeName}...`);
              setDetailModalOpen(false);
            }}
          >
            Download Official Payslip
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Employee Info</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.employeeName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  ID: {selectedRecord.employeeId} &bull; Joined: {selectedRecord.joiningDate}
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Department & Role</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.designation}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  {selectedRecord.department} &bull; {selectedRecord.branch}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Monthly Payroll Breakdown</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Gross Salary:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRecord.grossSalary.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Statutory Deductions (PF / ESI / PT):</span>
                <span style={{ fontWeight: 600, color: '#EF4444' }}>
                  -₹{(selectedRecord.grossSalary - selectedRecord.netSalary).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Overtime Recorded:</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>{selectedRecord.overtimeHours} hours approved</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Net Payable Amount:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedRecord.netSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="green" style={{ padding: '4px 10px', fontSize: 12 }}>Attendance: {selectedRecord.attendancePercentage}%</Tag>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>Status: {selectedRecord.paymentStatus}</Tag>
              <Tag color="purple" style={{ padding: '4px 10px', fontSize: 12 }}>Leave Bal: {selectedRecord.leaveBalance} days</Tag>
            </div>
          </div>
        )}
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Workforce Attendance & Payroll Report"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
