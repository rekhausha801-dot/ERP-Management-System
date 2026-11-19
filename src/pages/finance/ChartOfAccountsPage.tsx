import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, InputNumber, Typography, message, Tabs } from 'antd';
import { BookOpen, CheckCircle2, Coins, Plus, Search, Printer, Download, Eye, Layers } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface ChartOfAccountItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses';
  subCategory: string;
  balance: number;
  drCr: 'Debit' | 'Credit';
  status: 'Active' | 'Inactive';
  description?: string;
}

export const INITIAL_ACCOUNTS: ChartOfAccountItem[] = [
  // Assets
  { id: 'COA-01', accountCode: '1010', accountName: 'Cash on Hand & Petty Cash', accountType: 'Assets', subCategory: 'Current Assets', balance: 145000, drCr: 'Debit', status: 'Active' },
  { id: 'COA-02', accountCode: '1020', accountName: 'HDFC Corporate Current A/C #5020', accountType: 'Assets', subCategory: 'Bank Accounts', balance: 5820400, drCr: 'Debit', status: 'Active' },
  { id: 'COA-03', accountCode: '1030', accountName: 'ICICI Operational A/C #9914', accountType: 'Assets', subCategory: 'Bank Accounts', balance: 1845000, drCr: 'Debit', status: 'Active' },
  { id: 'COA-04', accountCode: '1200', accountName: 'Accounts Receivable (Trade Debtors)', accountType: 'Assets', subCategory: 'Current Assets', balance: 1067190, drCr: 'Debit', status: 'Active' },
  { id: 'COA-05', accountCode: '1400', accountName: 'Merchandise Inventory Stock', accountType: 'Assets', subCategory: 'Current Assets', balance: 2867000, drCr: 'Debit', status: 'Active' },
  { id: 'COA-06', accountCode: '1500', accountName: 'Plant & Industrial Machinery', accountType: 'Assets', subCategory: 'Fixed Assets', balance: 8800000, drCr: 'Debit', status: 'Active' },
  // Liabilities
  { id: 'COA-07', accountCode: '2010', accountName: 'Accounts Payable (Trade Creditors)', accountType: 'Liabilities', subCategory: 'Current Liabilities', balance: 922110, drCr: 'Credit', status: 'Active' },
  { id: 'COA-08', accountCode: '2050', accountName: 'GST Output Liability (IGST/CGST/SGST)', accountType: 'Liabilities', subCategory: 'Statutory Liabilities', balance: 692480, drCr: 'Credit', status: 'Active' },
  // Equity
  { id: 'COA-09', accountCode: '3010', accountName: 'Shareholder Capital', accountType: 'Equity', subCategory: 'Equity Capital', balance: 8000000, drCr: 'Credit', status: 'Active' },
  { id: 'COA-10', accountCode: '3020', accountName: 'Retained Earnings', accountType: 'Equity', subCategory: 'Reserves', balance: 4640000, drCr: 'Credit', status: 'Active' },
  // Income
  { id: 'COA-11', accountCode: '4010', accountName: 'Sales & Automation Machinery Revenue', accountType: 'Income', subCategory: 'Operating Revenue', balance: 12480000, drCr: 'Credit', status: 'Active' },
  { id: 'COA-12', accountCode: '4050', accountName: 'Service AMC & Maintenance Income', accountType: 'Income', subCategory: 'Service Revenue', balance: 620000, drCr: 'Credit', status: 'Active' },
  // Expenses
  { id: 'COA-13', accountCode: '5010', accountName: 'Cost of Goods Sold & Hardware Procurement', accountType: 'Expenses', subCategory: 'Direct Expenses', balance: 7850000, drCr: 'Debit', status: 'Active' },
  { id: 'COA-14', accountCode: '5020', accountName: 'Salaries & Staff Compensation', accountType: 'Expenses', subCategory: 'Payroll Costs', balance: 485000, drCr: 'Debit', status: 'Active' },
];

export const ChartOfAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccountItem[]>(() => {
    const raw = localStorage.getItem('erp_chart_of_accounts');
    return raw ? JSON.parse(raw) : INITIAL_ACCOUNTS;
  });
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Assets' | 'Liabilities' | 'Equity' | 'Income' | 'Expenses'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredData = useMemo(() => {
    return accounts.filter((item) => {
      const matchSearch =
        item.accountCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchText.toLowerCase());

      const matchTab = activeTab === 'all' || item.accountType === activeTab;
      return matchSearch && matchTab;
    });
  }, [accounts, searchText, activeTab]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalAssetsVal = accounts.filter((a) => a.accountType === 'Assets').reduce((acc, curr) => acc + curr.balance, 0);
    const totalLiabVal = accounts.filter((a) => a.accountType === 'Liabilities').reduce((acc, curr) => acc + curr.balance, 0);
    const totalIncomeVal = accounts.filter((a) => a.accountType === 'Income').reduce((acc, curr) => acc + curr.balance, 0);
    const totalExpenseVal = accounts.filter((a) => a.accountType === 'Expenses').reduce((acc, curr) => acc + curr.balance, 0);

    return {
      totalAssetsVal,
      totalLiabVal,
      totalIncomeVal,
      totalExpenseVal,
    };
  }, [accounts]);

  const handleSaveAccount = (values: any) => {
    const newAcc: ChartOfAccountItem = {
      id: 'COA-' + Date.now(),
      accountCode: values.accountCode,
      accountName: values.accountName,
      accountType: values.accountType,
      subCategory: values.subCategory || 'General Ledger Head',
      balance: values.balance || 0,
      drCr: values.accountType === 'Assets' || values.accountType === 'Expenses' ? 'Debit' : 'Credit',
      status: 'Active',
      description: values.description,
    };

    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('erp_chart_of_accounts', JSON.stringify(updated));
    message.success(`Account [${newAcc.accountCode}] ${newAcc.accountName} added to Chart of Accounts!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Account Title & Sub-Classification',
      key: 'titleSub',
      render: (_: any, r: ChartOfAccountItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{r.accountName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.subCategory}</div>
        </div>
      ),
    },
    {
      title: 'Classification',
      dataIndex: 'accountType',
      key: 'accountType',
      width: 130,
      render: (v: string) => {
        const color = v === 'Assets' ? 'cyan' : v === 'Liabilities' ? 'volcano' : v === 'Income' ? 'green' : v === 'Expenses' ? 'orange' : 'purple';
        return <Tag color={color} style={{ fontWeight: 600 }}>{v}</Tag>;
      },
    },
    {
      title: 'Normal Balance',
      dataIndex: 'drCr',
      key: 'drCr',
      width: 120,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Current Ledger Balance (₹)',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: string) => <Tag color={v === 'Active' ? 'green' : 'default'}>{v}</Tag>,
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
            Chart of Accounts (COA)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Standardized general ledger account classifications across Assets, Liabilities, Equity, Operating Income, and Expenses.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Chart
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting COA list...')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Add General Ledger Account
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
          title="Total Capital & Current Assets"
          value={`₹${summaryMetrics.totalAssetsVal.toLocaleString('en-IN')}`}
          subtitle="Cash, banks, stock & machinery"
          trend={{ value: 'Full balance sheet match', isPositive: true }}
          icon={<BookOpen size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Recorded Liabilities"
          value={`₹${summaryMetrics.totalLiabVal.toLocaleString('en-IN')}`}
          subtitle="Creditors & GST liabilities"
          trend={{ value: 'Audited statutory obligations', isPositive: true }}
          icon={<Coins size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Operating Revenue Heads"
          value={`₹${summaryMetrics.totalIncomeVal.toLocaleString('en-IN')}`}
          subtitle="Sales, service & AMC contracts"
          trend={{ value: 'Recognized revenue accounts', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Operating Expense Heads"
          value={`₹${summaryMetrics.totalExpenseVal.toLocaleString('en-IN')}`}
          subtitle="COGS, payroll & facilities"
          trend={{ value: 'Budget control active', isPositive: true }}
          icon={<Coins size={20} color="#0D9488" />}
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
            { key: 'all', label: <span style={{ fontWeight: 700 }}>All Accounts ({accounts.length})</span> },
            { key: 'Assets', label: <span style={{ fontWeight: 700, color: '#0F766E' }}>Assets</span> },
            { key: 'Liabilities', label: <span style={{ fontWeight: 700, color: '#C2410C' }}>Liabilities</span> },
            { key: 'Equity', label: <span style={{ fontWeight: 700, color: '#7C3AED' }}>Equity</span> },
            { key: 'Income', label: <span style={{ fontWeight: 700, color: '#166534' }}>Income</span> },
            { key: 'Expenses', label: <span style={{ fontWeight: 700, color: '#DC2626' }}>Expenses</span> },
          ]}
        />
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
        <Input
          prefix={<Search size={14} color="#64748B" />}
          placeholder="Search account code, name, category..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 350 }}
        />
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
          pagination={false}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create General Ledger Account</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save Account"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAccount}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="accountCode" label="Account Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. 1040" />
            </Form.Item>

            <Form.Item name="accountType" label="Classification" rules={[{ required: true }]} initialValue="Assets">
              <Select>
                <Select.Option value="Assets">Assets</Select.Option>
                <Select.Option value="Liabilities">Liabilities</Select.Option>
                <Select.Option value="Equity">Equity</Select.Option>
                <Select.Option value="Income">Income</Select.Option>
                <Select.Option value="Expenses">Expenses</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="accountName" label="Account Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. State Bank of India Operational A/C" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="subCategory" label="Sub-Category Group" initialValue="Current Assets">
              <Input placeholder="e.g. Bank Accounts, Fixed Assets" />
            </Form.Item>

            <Form.Item name="balance" label="Opening Balance (₹)" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
