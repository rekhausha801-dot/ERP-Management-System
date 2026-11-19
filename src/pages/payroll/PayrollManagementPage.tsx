import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  Tabs,
  Space,
  Tooltip,
  message,
  Divider,
} from 'antd';
import {
  CreditCard,
  CheckCircle,
  Clock,
  IndianRupee,
  Search,
  Plus,
  Eye,
  Download,
  Printer,
  ChevronRight,
  FileText,
  Calculator,
  Calendar,
  Users,
  Building,
  TrendingUp,
  AlertCircle,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import dayjs from 'dayjs';
import {
  PayrollTransactionRecord,
  SalaryStructureItem,
  WeeklyPayrollRecord,
  DailyWageRecord,
  SalaryAdvanceRecord,
  EmployeeLoanRecord,
  OvertimeRecord,
  BonusIncentiveRecord,
} from './payrollData';
import {
  INITIAL_PAYROLL_TRANSACTIONS,
  INITIAL_SALARY_STRUCTURES,
  INITIAL_WEEKLY_PAYROLL,
  INITIAL_DAILY_WAGES,
  INITIAL_SALARY_ADVANCES,
  INITIAL_EMPLOYEE_LOANS,
  INITIAL_OVERTIME,
  INITIAL_BONUS,
} from './payrollMockData';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const PayrollManagementPage: React.FC = () => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [transactions, setTransactions] = useState<PayrollTransactionRecord[]>(INITIAL_PAYROLL_TRANSACTIONS);
  const [structures, setStructures] = useState<SalaryStructureItem[]>(INITIAL_SALARY_STRUCTURES);
  const [weeklyPayroll, setWeeklyPayroll] = useState<WeeklyPayrollRecord[]>(INITIAL_WEEKLY_PAYROLL);
  const [dailyWages, setDailyWages] = useState<DailyWageRecord[]>(INITIAL_DAILY_WAGES);
  const [advances, setAdvances] = useState<SalaryAdvanceRecord[]>(INITIAL_SALARY_ADVANCES);
  const [loans, setLoans] = useState<EmployeeLoanRecord[]>(INITIAL_EMPLOYEE_LOANS);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState('November 2026');

  // Modal / Drawer state
  const [selectedTx, setSelectedTx] = useState<PayrollTransactionRecord | null>(null);
  const [isPayslipDrawerOpen, setIsPayslipDrawerOpen] = useState(false);
  const [isRunMonthlyModalOpen, setIsRunMonthlyModalOpen] = useState(false);
  const [isAddAdvanceModalOpen, setIsAddAdvanceModalOpen] = useState(false);
  const [isAddStructureModalOpen, setIsAddStructureModalOpen] = useState(false);

  const [monthlyForm] = Form.useForm();
  const [advanceForm] = Form.useForm();
  const [structureForm] = Form.useForm();

  // 1. KPI Metrics (Overview)
  const overviewMetrics = useMemo(() => {
    const totalEmployees = 8;
    const totalExpense = transactions.reduce((acc, t) => acc + t.grossSalary, 0);
    const pendingCount = transactions.filter((t) => t.paymentStatus === 'Pending').length;
    const pendingAmount = transactions
      .filter((t) => t.paymentStatus === 'Pending')
      .reduce((acc, t) => acc + t.netSalary, 0);

    const paidCount = transactions.filter((t) => t.paymentStatus === 'Paid').length;
    const paidAmount = transactions
      .filter((t) => t.paymentStatus === 'Paid')
      .reduce((acc, t) => acc + t.netSalary, 0);

    return {
      totalEmployees,
      totalExpense,
      pendingCount,
      pendingAmount,
      paidCount,
      paidAmount,
    };
  }, [transactions]);

  // Analytics Chart Data
  const departmentExpenseData = [
    { department: 'Executive', amount: 140000 },
    { department: 'Service Engg', amount: 86500 },
    { department: 'HR', amount: 60000 },
    { department: 'Tech Dispatch', amount: 59800 },
    { department: 'Field Ops', amount: 48000 },
  ];

  const salaryTypeDonut = [
    { name: 'Monthly Salary', value: 65, color: '#5421A8' },
    { name: 'Weekly Salary', value: 20, color: '#7544D6' },
    { name: 'Daily & Hourly Wage', value: 15, color: '#9333EA' },
  ];

  // Table Filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.payrollId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = deptFilter === 'ALL' || t.department === deptFilter;
      const matchStatus = statusFilter === 'ALL' || t.paymentStatus === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [transactions, searchTerm, deptFilter, statusFilter]);

  // Actions
  const handleDisbursePayment = (record: PayrollTransactionRecord) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === record.id
          ? {
              ...t,
              paymentStatus: 'Paid',
              approvalStatus: 'Approved',
              paymentDate: dayjs().format('YYYY-MM-DD'),
              transactionRef: `NEFT-HDFC-${Math.floor(100000000 + Math.random() * 900000000)}`,
            }
          : t
      )
    );
    message.success(`Salary payment of ₹${record.netSalary.toLocaleString('en-IN')} disbursed to ${record.employeeName}`);
  };

  const handleRunMonthlySubmit = (values: any) => {
    const basic = Number(values.basicSalary) || 30000;
    const allowances = Number(values.allowances) || 12000;
    const gross = basic + allowances;
    const pf = Math.round(basic * 0.12);
    const esi = Math.round(gross * 0.0075);
    const pt = 200;
    const tds = Number(values.tds) || 0;
    const advanceRec = Number(values.advanceRecovery) || 0;
    const loanRec = Number(values.loanRecovery) || 0;
    const totalDeductions = pf + esi + pt + tds + advanceRec + loanRec;
    const net = gross - totalDeductions;

    const newTx: PayrollTransactionRecord = {
      id: `PAY-TX-${Date.now()}`,
      payrollId: `PR-2026-${Math.floor(10 + Math.random() * 90)}-0${transactions.length + 1}`,
      employeeId: values.employeeId,
      employeeName: values.employeeName,
      department: values.department,
      designation: values.designation || 'Specialist',
      branch: values.branch || 'Chennai HQ',
      salaryType: 'Monthly Salary',
      payrollPeriod: values.payrollPeriod || 'November 2026',
      workingDays: 30,
      presentDays: Number(values.presentDays) || 30,
      absentDays: 30 - (Number(values.presentDays) || 30),
      overtimeHours: Number(values.overtimeHours) || 0,
      overtimeAmount: (Number(values.overtimeHours) || 0) * 350,
      basicSalary: basic,
      allowances: allowances,
      bonusIncentives: Number(values.bonus) || 0,
      grossSalary: gross,
      pfDeduction: pf,
      esiDeduction: esi,
      professionalTax: pt,
      tdsDeduction: tds,
      advanceRecovery: advanceRec,
      loanRecovery: loanRec,
      totalDeductions: totalDeductions,
      netSalary: net,
      paymentMethod: 'Bank Transfer',
      bankAccount: 'HDFC Bank - Primary Account',
      approvalStatus: 'Submitted',
      paymentStatus: 'Pending',
    };

    setTransactions([newTx, ...transactions]);
    message.success(`Monthly payroll generated and calculated for ${newTx.employeeName}!`);
    setIsRunMonthlyModalOpen(false);
    monthlyForm.resetFields();
  };

  const handleAdvanceSubmit = (values: any) => {
    const reqAmt = Number(values.requestedAmount);
    const instAmt = Number(values.installmentAmount) || reqAmt;

    const newAdv: SalaryAdvanceRecord = {
      id: `ADV-${Date.now()}`,
      advanceId: `ADV-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: values.employeeId,
      employeeName: values.employeeName,
      department: values.department,
      requestDate: dayjs().format('YYYY-MM-DD'),
      requestedAmount: reqAmt,
      approvedAmount: reqAmt,
      recoveryMethod: values.recoveryMethod,
      installmentAmount: instAmt,
      recoveredAmount: 0,
      remainingBalance: reqAmt,
      status: 'Approved',
      reason: values.reason,
    };

    setAdvances([newAdv, ...advances]);
    message.success(`Salary advance of ₹${reqAmt.toLocaleString('en-IN')} approved for ${newAdv.employeeName}!`);
    setIsAddAdvanceModalOpen(false);
    advanceForm.resetFields();
  };

  // Transaction Table Columns
  const transactionColumns = [
    {
      title: 'Payroll ID',
      dataIndex: 'payrollId',
      key: 'payrollId',
      render: (val: string, r: PayrollTransactionRecord) => (
        <div>
          <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{val}</span>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.payrollPeriod}</div>
        </div>
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (name: string, r: PayrollTransactionRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.employeeId} • {r.department}</div>
        </div>
      ),
    },
    {
      title: 'Salary Type',
      dataIndex: 'salaryType',
      key: 'salaryType',
      render: (st: string) => <Tag color="purple" style={{ borderRadius: 6 }}>{st}</Tag>,
    },
    {
      title: 'Gross Salary',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Deductions',
      dataIndex: 'totalDeductions',
      key: 'totalDeductions',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ color: '#DC2626', fontWeight: 600 }}>-₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Net In-Hand Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#16A34A', fontSize: 13.5 }}>
          ₹{Number(amt).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (st: string) => {
        let col = 'default';
        if (st === 'Paid') col = 'green';
        if (st === 'Pending') col = 'orange';
        if (st === 'Processing') col = 'blue';
        return <Tag color={col} style={{ borderRadius: 8, fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PayrollTransactionRecord) => (
        <Space size="small">
          <Tooltip title="View Payslip">
            <Button
              type="text"
              size="small"
              icon={<FileText size={15} color={BRAND_PURPLE} />}
              onClick={() => {
                setSelectedTx(record);
                setIsPayslipDrawerOpen(true);
              }}
              style={{ backgroundColor: '#F3E8FF', borderRadius: 6 }}
            />
          </Tooltip>
          {record.paymentStatus === 'Pending' && (
            <Tooltip title="Disburse Salary">
              <Button
                type="text"
                size="small"
                icon={<CreditCard size={15} color="#16A34A" />}
                onClick={() => handleDisbursePayment(record)}
                style={{ backgroundColor: '#DCFCE7', borderRadius: 6 }}
              >
                Pay
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* 1. Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 4 }}>
            <span>HR & Employee Management</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Payroll Management</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Enterprise Payroll & Compensation Management
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Unified processing for monthly salaries, weekly wages, daily wages, statutory deductions, loans, and advances
          </p>
        </div>

        <Space>
          <Button
            icon={<Download size={15} />}
            onClick={() => message.success('Exporting bank transfer NEFT batch file...')}
            style={{ borderRadius: 10 }}
          >
            Bank Payout File
          </Button>
          <Button
            icon={<Plus size={15} />}
            onClick={() => {
              advanceForm.resetFields();
              setIsAddAdvanceModalOpen(true);
            }}
            style={{ borderRadius: 10 }}
          >
            Request Advance
          </Button>
          <Button
            type="primary"
            icon={<Calculator size={15} />}
            onClick={() => {
              monthlyForm.resetFields();
              setIsRunMonthlyModalOpen(true);
            }}
            style={{
              backgroundColor: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 12,
              fontWeight: 700,
              height: 38,
              boxShadow: '0 4px 14px rgba(84, 33, 168, 0.25)',
            }}
          >
            Run Payroll Cycle
          </Button>
        </Space>
      </div>

      {/* 2. Exactly 4 Meaningful Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Employees on Payroll */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Users size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total on Payroll</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              {overviewMetrics.totalEmployees} Employees
            </div>
            <div style={{ fontSize: 11, color: '#5421A8', marginTop: 4, fontWeight: 700 }}>
              Across monthly, weekly & wage tiers
            </div>
          </div>
        </Col>

        {/* Card 2: Total Salary Expense */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <IndianRupee size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Salary Expense</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(overviewMetrics.totalExpense / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 4, fontWeight: 700 }}>
              Gross cost to company (CTC)
            </div>
          </div>
        </Col>

        {/* Card 3: Pending Salary Payments */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Clock size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Pending Salary Payout</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>
              ₹{(overviewMetrics.pendingAmount / 1000).toFixed(0)}k ({overviewMetrics.pendingCount} staff)
            </div>
            <div style={{ fontSize: 11, color: '#D97706', marginTop: 4, fontWeight: 700 }}>
              Awaiting batch bank authorization
            </div>
          </div>
        </Col>

        {/* Card 4: Salary Paid */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <CheckCircle size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Salary Disbursed</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>
              ₹{(overviewMetrics.paidAmount / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#16A34A', marginTop: 4, fontWeight: 700 }}>
              {overviewMetrics.paidCount} salaries settled to accounts
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Navigation Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '1. Payroll Overview & Analytics',
            children: (
              <div>
                {/* Analytics Row */}
                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                  <Col xs={24} lg={15}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 20,
                        padding: '20px 22px',
                        border: '1px solid #ECE6F8',
                        boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
                        height: '100%',
                      }}
                    >
                      <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                        Department-Wise Salary Expense (INR)
                      </h3>
                      <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={departmentExpenseData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="department" stroke="#94A3B8" fontSize={11} />
                            <YAxis
                              stroke="#94A3B8"
                              fontSize={11}
                              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                            />
                            <RechartsTooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Expense']} />
                            <Bar dataKey="amount" fill={BRAND_PURPLE} radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} lg={9}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 20,
                        padding: '20px 22px',
                        border: '1px solid #ECE6F8',
                        boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
                        height: '100%',
                      }}
                    >
                      <h3 style={{ margin: '0 0 10px 0', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                        Salary Structure Distribution
                      </h3>
                      <div style={{ width: '100%', height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={salaryTypeDonut}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={46}
                              outerRadius={68}
                              paddingAngle={4}
                            >
                              {salaryTypeDonut.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, fontSize: 12 }}>
                        {salaryTypeDonut.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span style={{ fontWeight: 700 }}>{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Table of Transactions */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    padding: '22px 24px',
                    border: '1px solid #ECE6F8',
                    boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Input
                      prefix={<Search size={15} color="#94A3B8" />}
                      placeholder="Search employee, ID, payroll..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 280, borderRadius: 10 }}
                      allowClear
                    />
                    <Select
                      value={deptFilter}
                      onChange={setDeptFilter}
                      style={{ width: 170 }}
                      options={[
                        { value: 'ALL', label: 'All Departments' },
                        { value: 'Executive Management', label: 'Executive' },
                        { value: 'Service Engineering', label: 'Service Engg' },
                        { value: 'Human Resources', label: 'Human Resources' },
                        { value: 'Technical Dispatch', label: 'Technical Dispatch' },
                      ]}
                    />
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 140 }}
                      options={[
                        { value: 'ALL', label: 'All Status' },
                        { value: 'Paid', label: 'Paid' },
                        { value: 'Pending', label: 'Pending' },
                      ]}
                    />
                  </div>

                  <Table
                    columns={transactionColumns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} payroll slips` }}
                    size="middle"
                  />
                </div>
              </div>
            ),
          },
          {
            key: 'structures',
            label: '2. Salary Structures',
            children: (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '22px 24px',
                  border: '1px solid #ECE6F8',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Employee Salary Structures</h3>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Configured base rates, statutory PF/ESI, and allowances</span>
                  </div>
                </div>

                <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Structure ID</th>
                      <th style={{ padding: '10px 12px' }}>Employee</th>
                      <th style={{ padding: '10px 12px' }}>Salary Type</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Basic Salary</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Allowances</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>PF / ESI</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {structures.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: BRAND_PURPLE }}>{s.structureId}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700 }}>{s.employeeName}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{s.designation} • {s.department}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Tag color="purple">{s.salaryType}</Tag>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                          ₹{s.basicSalary.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16A34A', fontWeight: 600 }}>
                          +₹{(s.hra + s.da + s.travelAllowance + s.specialAllowance).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <Tag color="blue">{s.pfRate}% PF</Tag>
                          {s.esiRate > 0 && <Tag color="cyan">{s.esiRate}% ESI</Tag>}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Tag color="green">{s.status}</Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            key: 'weekly',
            label: '3. Weekly Payroll',
            children: (
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '22px 24px', border: '1px solid #ECE6F8' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 800 }}>Weekly Field & Site Technician Payroll</h3>
                <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Employee</th>
                      <th style={{ padding: '10px 12px' }}>Week Period</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Attendance</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Weekly Rate</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Overtime</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Net Weekly Wage</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyPayroll.map((w) => (
                      <tr key={w.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{w.employeeName}</td>
                        <td style={{ padding: '10px 12px' }}>{w.weekStartDate} to {w.weekEndDate}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{w.presentDays} / {w.workingDays} Days</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{w.weeklyBasicSalary.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{w.overtimeAmount.toLocaleString('en-IN')} ({w.overtimeHours} hrs)</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#16A34A' }}>
                          ₹{w.netSalary.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Tag color={w.paymentStatus === 'Paid' ? 'green' : 'orange'}>{w.paymentStatus}</Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            key: 'daily',
            label: '4. Daily & Hourly Wages',
            children: (
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '22px 24px', border: '1px solid #ECE6F8' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 800 }}>Daily & Hourly Contract Labor Compensation</h3>
                <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px' }}>Employee</th>
                      <th style={{ padding: '10px 12px' }}>Wage Model</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Standard Rate</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Units Billed</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Gross Wage</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Advance Recovery</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Net Payable</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyWages.map((d) => (
                      <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{d.employeeName}</td>
                        <td style={{ padding: '10px 12px' }}><Tag color="blue">{d.wageType}</Tag></td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{d.rate}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{d.workingDays} Days ({d.workingHours} hrs)</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{d.grossWage.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#DC2626' }}>-₹{d.advanceRecovery.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#16A34A' }}>
                          ₹{d.netWage.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <Tag color={d.paymentStatus === 'Paid' ? 'green' : 'orange'}>{d.paymentStatus}</Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            key: 'advances',
            label: '5. Salary Advances & Loans',
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '20px 22px', border: '1px solid #ECE6F8' }}>
                      <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 800 }}>Salary Advances Ledger</h3>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                            <th style={{ padding: '8px 10px' }}>Employee</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Requested</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Recovery/Mo</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Balance</th>
                            <th style={{ padding: '8px 10px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {advances.map((a) => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: 700 }}>{a.employeeName}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{a.requestedAmount.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{a.installmentAmount.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                                ₹{a.remainingBalance.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <Tag color="blue">{a.status}</Tag>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>

                  <Col xs={24} lg={12}>
                    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '20px 22px', border: '1px solid #ECE6F8' }}>
                      <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 800 }}>Employee Loan Accounts</h3>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                            <th style={{ padding: '8px 10px' }}>Employee</th>
                            <th style={{ padding: '8px 10px' }}>Loan Type</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Loan</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Remaining</th>
                            <th style={{ padding: '8px 10px' }}>Next Due</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loans.map((l) => (
                            <tr key={l.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: 700 }}>{l.employeeName}</td>
                              <td style={{ padding: '8px 10px' }}><Tag color="cyan">{l.loanType}</Tag></td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{l.loanAmount.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#DC2626' }}>
                                ₹{l.outstandingBalance.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>{l.nextDueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />

      {/* 4. Payslip View Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color={BRAND_PURPLE} />
            <span>Salary Payslip — {selectedTx?.employeeName} ({selectedTx?.payrollPeriod})</span>
          </div>
        }
        width={680}
        open={isPayslipDrawerOpen}
        onClose={() => setIsPayslipDrawerOpen(false)}
        extra={
          <Button
            type="primary"
            icon={<Download size={14} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => message.success(`Downloaded official payslip for ${selectedTx?.employeeName}`)}
          >
            Download Payslip PDF
          </Button>
        }
      >
        {selectedTx && (
          <div>
            <div style={{ background: '#FAF5FF', padding: '18px 20px', borderRadius: 16, marginBottom: 20 }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Employee ID & Name</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                    {selectedTx.employeeName} ({selectedTx.employeeId})
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedTx.designation} • {selectedTx.department}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Payment Method & Bank</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{selectedTx.paymentMethod}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedTx.bankAccount}</div>
                </Col>
              </Row>
            </div>

            <Row gutter={16}>
              {/* Earnings Table */}
              <Col span={12}>
                <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#16A34A', marginBottom: 10 }}>
                    Earnings
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>Basic Salary:</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>Allowances:</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.allowances.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedTx.overtimeAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                      <span>Overtime ({selectedTx.overtimeHours} hrs):</span>
                      <span style={{ fontWeight: 600 }}>₹{selectedTx.overtimeAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedTx.bonusIncentives > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                      <span>Bonus & Incentives:</span>
                      <span style={{ fontWeight: 600 }}>₹{selectedTx.bonusIncentives.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800 }}>
                    <span>Gross Earnings:</span>
                    <span style={{ color: '#16A34A' }}>₹{selectedTx.grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Col>

              {/* Deductions Table */}
              <Col span={12}>
                <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#DC2626', marginBottom: 10 }}>
                    Deductions
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>Provident Fund (12%):</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.pfDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>ESI Health Scheme:</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.esiDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>Professional Tax:</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.professionalTax}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span>TDS / Income Tax:</span>
                    <span style={{ fontWeight: 600 }}>₹{selectedTx.tdsDeduction.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedTx.advanceRecovery > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#DC2626' }}>
                      <span>Advance Recovery:</span>
                      <span style={{ fontWeight: 600 }}>₹{selectedTx.advanceRecovery.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800 }}>
                    <span>Total Deductions:</span>
                    <span style={{ color: '#DC2626' }}>₹{selectedTx.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Net Salary Banner */}
            <div
              style={{
                background: '#ECFDF5',
                borderRadius: 14,
                padding: '16px 20px',
                border: '1px solid #A7F3D0',
                marginTop: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>
                  Net Take-Home Salary
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#065F46' }}>
                  ₹{selectedTx.netSalary.toLocaleString('en-IN')}
                </div>
              </div>
              <Tag color="green" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 8, fontWeight: 700 }}>
                {selectedTx.paymentStatus}
              </Tag>
            </div>
          </div>
        )}
      </Drawer>

      {/* 5. Run Monthly Payroll Modal */}
      <Modal
        title="Process & Calculate Monthly Salary"
        open={isRunMonthlyModalOpen}
        onCancel={() => setIsRunMonthlyModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form
          form={monthlyForm}
          layout="vertical"
          onFinish={handleRunMonthlySubmit}
          initialValues={{
            payrollPeriod: 'November 2026',
            presentDays: 30,
            department: 'Service Engineering',
            basicSalary: 38000,
            allowances: 15000,
            bonus: 2000,
            tds: 1500,
            advanceRecovery: 0,
            loanRecovery: 0,
            overtimeHours: 0,
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Employee ID" name="employeeId" rules={[{ required: true }]}>
                <Input placeholder="e.g. EMP-009" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee Full Name" name="employeeName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Karthik Venkat" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Service Engineering', label: 'Service Engineering' },
                    { value: 'Field Operations', label: 'Field Operations' },
                    { value: 'Warehouse & Logistics', label: 'Warehouse & Logistics' },
                    { value: 'Human Resources', label: 'Human Resources' },
                    { value: 'Executive Management', label: 'Executive Management' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payroll Cycle Month" name="payrollPeriod" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Basic Salary (₹)" name="basicSalary" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Allowances (₹)" name="allowances">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Present Days / 30" name="presentDays">
                <InputNumber min={0} max={31} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Overtime Hours" name="overtimeHours">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bonus & Incentives (₹)" name="bonus">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="TDS Monthly (₹)" name="tds">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Advance Recovery (₹)" name="advanceRecovery">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loan Deduction (₹)" name="loanRecovery">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsRunMonthlyModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Auto Calculate & Generate Payroll
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Request Salary Advance Modal */}
      <Modal
        title="Request Employee Salary Advance"
        open={isAddAdvanceModalOpen}
        onCancel={() => setIsAddAdvanceModalOpen(false)}
        footer={null}
        width={580}
      >
        <Form
          form={advanceForm}
          layout="vertical"
          onFinish={handleAdvanceSubmit}
          initialValues={{
            recoveryMethod: 'Monthly Installments',
            installmentAmount: 5000,
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Employee ID" name="employeeId" rules={[{ required: true }]}>
                <Input placeholder="e.g. EMP-002" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employee Name" name="employeeName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Suresh Kumar" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Input placeholder="Service Engineering" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Requested Amount (₹)" name="requestedAmount" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1000} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Recovery Method" name="recoveryMethod" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Monthly Installments', label: 'Monthly Installments' },
                    { value: 'Single Deduction', label: 'Single Deduction Next Month' },
                    { value: 'Weekly Installments', label: 'Weekly Installments' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Installment Amount (₹)" name="installmentAmount" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={500} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Advance Reason / Purpose" name="reason" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Explain reason for advance request..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsAddAdvanceModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Submit Advance
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PayrollManagementPage;
