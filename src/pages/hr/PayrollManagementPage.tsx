import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, DatePicker, message, Tooltip, Divider } from 'antd';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Download, Plus, FileText, DollarSign, Calculator, Printer } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface PayrollItem {
  key: string;
  empId: string;
  name: string;
  department: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  pfDeduction: number;
  taxDeduction: number;
  netPayable: number;
  status: 'Processed' | 'Pending Approval' | 'Disbursed';
  month: string;
}

const INITIAL_PAYROLL: PayrollItem[] = [
  { key: '1', empId: 'EMP-001', name: 'Janani Ramesh', department: 'Executive Management', basicSalary: 70000, hra: 30000, allowances: 20000, pfDeduction: 8400, taxDeduction: 12000, netPayable: 99600, status: 'Disbursed', month: 'October 2026' },
  { key: '2', empId: 'EMP-002', name: 'Suresh Kumar', department: 'Service Contracts', basicSalary: 50000, hra: 20000, allowances: 15000, pfDeduction: 6000, taxDeduction: 7500, netPayable: 71500, status: 'Disbursed', month: 'October 2026' },
  { key: '3', empId: 'EMP-003', name: 'Murugan K.', department: 'Field Services', basicSalary: 45000, hra: 18000, allowances: 12000, pfDeduction: 5400, taxDeduction: 5000, netPayable: 64600, status: 'Disbursed', month: 'October 2026' },
  { key: '4', empId: 'EMP-004', name: 'Ananya Sharma', department: 'Human Resources', basicSalary: 35000, hra: 15000, allowances: 10000, pfDeduction: 4200, taxDeduction: 3500, netPayable: 52300, status: 'Pending Approval', month: 'November 2026' },
  { key: '5', empId: 'EMP-005', name: 'Dinesh V.', department: 'Technical Dispatch', basicSalary: 32000, hra: 13000, allowances: 10000, pfDeduction: 3840, taxDeduction: 2800, netPayable: 48360, status: 'Pending Approval', month: 'November 2026' },
];

export const PayrollManagementPage: React.FC = () => {
  const [payrollList, setPayrollList] = useState<PayrollItem[]>(INITIAL_PAYROLL);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItem | null>(null);
  const [isProcessModal, setIsProcessModal] = useState(false);
  const [form] = Form.useForm();

  const handleProcessPayroll = (values: any) => {
    message.success(`Payroll successfully queued for ${values.month}!`);
    setIsProcessModal(false);
  };

  const handleApproveBatch = () => {
    setPayrollList(payrollList.map(p => ({ ...p, status: 'Disbursed' })));
    message.success('All pending salary batches approved and disbursed!');
  };

  const columns = [
    { title: 'Emp ID', dataIndex: 'empId', key: 'empId', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Employee', dataIndex: 'name', key: 'name', render: (n: string) => <strong>{n}</strong> },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Gross Earnings', render: (_: any, r: PayrollItem) => `₹${(r.basicSalary + r.hra + r.allowances).toLocaleString()}` },
    { title: 'Total Deductions', render: (_: any, r: PayrollItem) => <span style={{ color: '#EF4444' }}>-₹{(r.pfDeduction + r.taxDeduction).toLocaleString()}</span> },
    { title: 'Net In-Hand Salary', dataIndex: 'netPayable', key: 'netPayable', render: (v: number) => <span style={{ fontWeight: 700, color: '#10B981' }}>₹{v.toLocaleString()}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <Tag color={st === 'Disbursed' ? 'green' : st === 'Pending Approval' ? 'gold' : 'blue'}>{st}</Tag>,
    },
    {
      title: 'Payslip',
      key: 'action',
      render: (_: any, r: PayrollItem) => (
        <Button size="small" icon={<FileText size={13} />} onClick={() => setSelectedPayslip(r)}>
          Payslip
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Salary & Payroll Management"
        subtitle="Automated salary generation, allowances, PF/ESI statutory tax deductions, and bank payouts."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Payroll summary exported')}>
              Bank Transfer File
            </Button>
            <Button onClick={handleApproveBatch}>
              Approve Batches
            </Button>
            <Button type="primary" icon={<Calculator size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsProcessModal(true)}>
              Run Monthly Payroll
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Total Monthly Payroll" value="₹3,36,360" prefix={<CreditCard size={16} color="#6E56CF" />} valueStyle={{ color: '#19153B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Disbursed Accounts" value="3 Accounts" prefix={<CheckCircle size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Awaiting Approval" value="2 Accounts" prefix={<Clock size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Statutory PF/Tax" value="₹47,340" valueStyle={{ color: '#EF4444', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'overview', label: 'Monthly Payroll Roster' },
            { key: 'components', label: 'Salary Components & Allowances' },
            { key: 'loans', label: 'Advances & Loans' },
            { key: 'statutory', label: 'Tax & Statutory PF/ESI' },
          ]}
        />

        {activeTab === 'overview' ? (
          <Table dataSource={payrollList} columns={columns} pagination={{ pageSize: 8 }} />
        ) : activeTab === 'components' ? (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', component: 'Basic Salary', type: 'Earning', calcRule: '50% of CTC', taxable: 'Yes' },
                { key: '2', component: 'House Rent Allowance (HRA)', type: 'Earning', calcRule: '40% of Basic', taxable: 'Exemption eligible' },
                { key: '3', component: 'Special & Travel Allowance', type: 'Earning', calcRule: 'Fixed Monthly Allowance', taxable: 'Yes' },
                { key: '4', component: 'Provident Fund (Employee PF)', type: 'Deduction', calcRule: '12% of Basic Salary', taxable: 'Deductible' },
                { key: '5', component: 'Professional Tax (PT)', type: 'Deduction', calcRule: 'Slab-based state statutory', taxable: 'State Deductible' },
              ]}
              columns={[
                { title: 'Salary Component', dataIndex: 'component', key: 'component', render: (t: string) => <strong>{t}</strong> },
                { title: 'Component Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Earning' ? 'green' : 'red'}>{t}</Tag> },
                { title: 'Computation Rule', dataIndex: 'calcRule', key: 'calcRule' },
                { title: 'Tax Impact', dataIndex: 'taxable', key: 'taxable' },
              ]}
              pagination={false}
            />
          </div>
        ) : activeTab === 'loans' ? (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', emp: 'Murugan K.', loanType: 'Festival Advance', amount: '₹25,000', emi: '₹5,000 / mo', balance: '₹10,000', status: 'Active EMI' },
                { key: '2', emp: 'Vikram Seth', loanType: 'Emergency Relocation Loan', amount: '₹50,000', emi: '₹10,000 / mo', balance: '₹0 (Closed)', status: 'Closed' },
              ]}
              columns={[
                { title: 'Employee', dataIndex: 'emp', key: 'emp', render: (t: string) => <strong>{t}</strong> },
                { title: 'Loan Category', dataIndex: 'loanType', key: 'loanType' },
                { title: 'Sanctioned Amount', dataIndex: 'amount', key: 'amount' },
                { title: 'Monthly Deduction (EMI)', dataIndex: 'emi', key: 'emi' },
                { title: 'Remaining Balance', dataIndex: 'balance', key: 'balance' },
                { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color={st.includes('Active') ? 'processing' : 'default'}>{st}</Tag> },
              ]}
              pagination={false}
            />
          </div>
        ) : (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', authority: 'EPFO (Provident Fund)', filingFreq: 'Monthly on 15th', totalStaff: '38 Employees', lastFiling: 'Paid (Oct 2026)', challanId: 'EPFO-TN-992144' },
                { key: '2', authority: 'ESIC (Employee State Insurance)', filingFreq: 'Monthly on 15th', totalStaff: '16 Eligible Employees', lastFiling: 'Paid (Oct 2026)', challanId: 'ESI-CH-481902' },
                { key: '3', authority: 'TDS Salary (Form 24Q)', filingFreq: 'Quarterly', totalStaff: '22 Taxable Employees', lastFiling: 'Filed (Q2 2026)', challanId: 'TDS-2026-Q2-019' },
              ]}
              columns={[
                { title: 'Statutory Body', dataIndex: 'authority', key: 'authority', render: (t: string) => <strong>{t}</strong> },
                { title: 'Filing Frequency', dataIndex: 'filingFreq', key: 'filingFreq' },
                { title: 'Enrolled Coverage', dataIndex: 'totalStaff', key: 'totalStaff' },
                { title: 'Filing Status', dataIndex: 'lastFiling', key: 'lastFiling', render: (s: string) => <Tag color="green">{s}</Tag> },
                { title: 'Reference Challan #', dataIndex: 'challanId', key: 'challanId' },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Card>

      {/* Process Payroll Modal */}
      <Modal title="Execute Monthly Payroll Cycle" open={isProcessModal} onCancel={() => setIsProcessModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleProcessPayroll}>
          <Form.Item label="Payroll Cycle Month" name="month" initialValue="November 2026" rules={[{ required: true }]}>
            <Select options={[
              { value: 'November 2026', label: 'November 2026' },
              { value: 'December 2026', label: 'December 2026' },
            ]} />
          </Form.Item>
          <Form.Item label="Branch Coverage" name="branch" initialValue="All Branches">
            <Select options={[
              { value: 'All Branches', label: 'All Branches (Consolidated)' },
              { value: 'Chennai HQ', label: 'Chennai HQ only' },
            ]} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsProcessModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Initiate Computation</Button>
          </div>
        </Form>
      </Modal>

      {/* Payslip View Modal */}
      <Modal
        title="Employee Official Payslip"
        open={!!selectedPayslip}
        onCancel={() => setSelectedPayslip(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedPayslip(null)}>Close</Button>,
          <Button key="print" type="primary" icon={<Printer size={14} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => message.success('Payslip PDF downloaded')}>Print / Download PDF</Button>,
        ]}
        width={580}
      >
        {selectedPayslip && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#19153B' }}>ABC TRADERS LTD</h3>
              <Text type="secondary">42 Commercial Axis, Mount Road, Chennai - 600002</Text>
              <div style={{ fontWeight: 600, marginTop: 6, color: '#6E56CF' }}>PAYSLIP FOR {selectedPayslip.month.toUpperCase()}</div>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}><Text type="secondary">Employee ID:</Text> <strong>{selectedPayslip.empId}</strong></Col>
              <Col span={12}><Text type="secondary">Employee Name:</Text> <strong>{selectedPayslip.name}</strong></Col>
              <Col span={12}><Text type="secondary">Department:</Text> <span>{selectedPayslip.department}</span></Col>
              <Col span={12}><Text type="secondary">Payment Mode:</Text> <span>NEFT Bank Transfer</span></Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#10B981' }}>EARNINGS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Basic:</span> <strong>₹{selectedPayslip.basicSalary.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>HRA:</span> <strong>₹{selectedPayslip.hra.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Allowances:</span> <strong>₹{selectedPayslip.allowances.toLocaleString()}</strong></div>
              </Col>
              <Col span={12}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: '#EF4444' }}>DEDUCTIONS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Provident Fund:</span> <strong>₹{selectedPayslip.pfDeduction.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Income Tax (TDS):</span> <strong>₹{selectedPayslip.taxDeduction.toLocaleString()}</strong></div>
              </Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, padding: '8px 12px', backgroundColor: '#F8F7FC', borderRadius: 8 }}>
              <span>NET PAYABLE SALARY:</span>
              <span style={{ color: '#10B981' }}>₹{selectedPayslip.netPayable.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
