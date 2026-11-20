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
  Tabs,
} from 'antd';
import {
  Landmark,
  Receipt,
  TrendingUp,
  Wallet,
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
import { FinancialReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const FinancialReportsPage: React.FC = () => {
  const { financialReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'ledger' | 'pnl' | 'balanceSheet' | 'cashflow'>('ledger');
  const [selectedRecord, setSelectedRecord] = useState<FinancialReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Filter Logic
  const filteredData = useMemo(() => {
    return financialReports.filter((item) => {
      const matchSearch =
        item.accountCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());

      const matchGroup = groupFilter === 'ALL' || item.accountGroup === groupFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;

      return matchSearch && matchGroup && matchBranch;
    });
  }, [financialReports, searchText, groupFilter, branchFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = 12480000;
    const totalExpenses = 7850000 + 485000 + 125000;
    const netProfit = totalRevenue - totalExpenses;
    const cashBankBalance = 5820400;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      cashBankBalance,
    };
  }, []);

  const handleExport = (type: string) => {
    message.success(`Exporting Financial Statements (${activeTab.toUpperCase()}) to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      title: 'Txn Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 105,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#334155' }}>{v}</span>,
    },
    {
      title: 'Ref Number',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Account Code & Title',
      key: 'accTitle',
      render: (_: any, r: FinancialReportItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.accountName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.accountCode} &bull; {r.accountGroup}
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Debit (Dr) ₹',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      align: 'right' as const,
      render: (v: number) =>
        v > 0 ? (
          <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{v.toLocaleString('en-IN')}</span>
        ) : (
          <span style={{ color: '#CBD5E1' }}>-</span>
        ),
    },
    {
      title: 'Credit (Cr) ₹',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      align: 'right' as const,
      render: (v: number) =>
        v > 0 ? (
          <span style={{ fontWeight: 700, color: '#10B981' }}>₹{v.toLocaleString('en-IN')}</span>
        ) : (
          <span style={{ color: '#CBD5E1' }}>-</span>
        ),
    },
    {
      title: 'Closing Balance (₹)',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 120,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: FinancialReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Drill-down Ledger Account"
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
            Financial Reports & Statements
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Statutory financial reporting, Profit & Loss Statement, Balance Sheet, Cash Flow, and General Ledger audit trails.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule P&L / Balance Sheet Digest
          </Button>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Statement
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
          title="Total Operating Revenue"
          value={`₹${summaryMetrics.totalRevenue.toLocaleString('en-IN')}`}
          subtitle="Cumulative sales & automation billings"
          trend={{ value: '18.4% YoY Growth', isPositive: true }}
          icon={<TrendingUp size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Operating Expenses"
          value={`₹${summaryMetrics.totalExpenses.toLocaleString('en-IN')}`}
          subtitle="Procurement, payroll, rentals"
          trend={{ value: 'Within budget targets', isPositive: true }}
          icon={<Receipt size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Net Operating Profit"
          value={`₹${summaryMetrics.netProfit.toLocaleString('en-IN')}`}
          subtitle="Revenue minus total operating costs"
          trend={{ value: '32.2% Net Margin', isPositive: true }}
          icon={<Landmark size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Cash & Bank Balance"
          value={`₹${summaryMetrics.cashBankBalance.toLocaleString('en-IN')}`}
          subtitle="Current bank liquid assets"
          trend={{ value: 'Reconciled with HDFC/ICICI', isPositive: true }}
          icon={<Wallet size={20} color="#7C3AED" />}
          iconBgColor="#F5F3FF"
        />
      </div>

      {/* Statement Tabs */}
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
            { key: 'ledger', label: <span style={{ fontWeight: 700 }}>General Ledger Audit Trail</span> },
            { key: 'pnl', label: <span style={{ fontWeight: 700 }}>Profit & Loss (P&L) Statement</span> },
            { key: 'balanceSheet', label: <span style={{ fontWeight: 700 }}>Balance Sheet (Assets & Liabilities)</span> },
            { key: 'cashflow', label: <span style={{ fontWeight: 700 }}>Cash Flow Statement</span> },
          ]}
        />
      </Card>

      {/* P&L Statement View */}
      {activeTab === 'pnl' && (
        <Card
          bordered
          style={{
            borderRadius: 14,
            marginBottom: 20,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, color: '#1E3A8A' }}>STATEMENT OF PROFIT & LOSS</Title>
            <Text style={{ color: '#64748B' }}>For the Financial Period Ended 31st March 2027 (in INR)</Text>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#F8FAFC', padding: '10px 16px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
              I. REVENUE FROM OPERATIONS
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Gross Sales & Automation Revenue</span>
              <span style={{ fontWeight: 700 }}>₹1,24,80,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Other Operating Income & AMC Contracts</span>
              <span style={{ fontWeight: 700 }}>₹6,20,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#F0FDF4', fontWeight: 800, color: '#166534' }}>
              <span>TOTAL REVENUE (A)</span>
              <span>₹1,31,00,000</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '10px 16px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #E2E8F0', borderTop: '2px solid #E2E8F0' }}>
              II. EXPENSES
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Cost of Materials Consumed & Procurement</span>
              <span style={{ fontWeight: 700 }}>₹78,50,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Employee Benefits & Payroll Compensation</span>
              <span style={{ fontWeight: 700 }}>₹4,85,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Depot & Warehouse Facility Rentals</span>
              <span style={{ fontWeight: 700 }}>₹1,25,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#FEF2F2', fontWeight: 800, color: '#991B1B' }}>
              <span>TOTAL OPERATING EXPENSES (B)</span>
              <span>₹84,60,000</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#EEF2FF', fontWeight: 900, fontSize: 16, color: '#1E3A8A', borderTop: '2px solid #C7D2FE' }}>
              <span>NET PROFIT BEFORE TAX (A - B)</span>
              <span>₹46,40,000</span>
            </div>
          </div>
        </Card>
      )}

      {/* Balance Sheet View */}
      {activeTab === 'balanceSheet' && (
        <Card
          bordered
          style={{
            borderRadius: 14,
            marginBottom: 20,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, color: '#1E3A8A' }}>BALANCE SHEET POSITION</Title>
            <Text style={{ color: '#64748B' }}>As of Current Reporting Period (in INR)</Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900, margin: '0 auto' }}>
            {/* Assets */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#F0FDFA', padding: '10px 16px', fontWeight: 800, color: '#0F766E' }}>
                ASSETS
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginBottom: 6 }}>Current Assets</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Cash & Bank Balances</span>
                  <span style={{ fontWeight: 700 }}>₹58,20,400</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Inventory Valuation</span>
                  <span style={{ fontWeight: 700 }}>₹28,67,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Trade Receivables</span>
                  <span style={{ fontWeight: 700 }}>₹10,67,190</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginTop: 12, marginBottom: 6 }}>Non-Current Assets</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Testing Machinery & Plant</span>
                  <span style={{ fontWeight: 700 }}>₹45,00,000</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', fontWeight: 900, color: '#1E3A8A', borderTop: '1px solid #E2E8F0' }}>
                <span>TOTAL ASSETS</span>
                <span>₹1,42,54,590</span>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ background: '#FFF7ED', padding: '10px 16px', fontWeight: 800, color: '#C2410C' }}>
                EQUITY & LIABILITIES
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginBottom: 6 }}>Current Liabilities</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Trade Payables (Suppliers)</span>
                  <span style={{ fontWeight: 700 }}>₹9,22,110</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Statutory GST / Tax Payable</span>
                  <span style={{ fontWeight: 700 }}>₹6,92,480</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#64748B', marginTop: 12, marginBottom: 6 }}>Shareholder Equity</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Paid-up Capital</span>
                  <span style={{ fontWeight: 700 }}>₹80,00,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Retained Earnings & Reserves</span>
                  <span style={{ fontWeight: 700 }}>₹46,40,000</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', fontWeight: 900, color: '#1E3A8A', borderTop: '1px solid #E2E8F0' }}>
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span>₹1,42,54,590</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Cash Flow View */}
      {activeTab === 'cashflow' && (
        <Card
          bordered
          style={{
            borderRadius: 14,
            marginBottom: 20,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, color: '#1E3A8A' }}>CASH FLOW STATEMENT</Title>
            <Text style={{ color: '#64748B' }}>Direct Method Inflow / Outflow Summary</Text>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#F8FAFC', padding: '10px 16px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
              CASH FLOWS FROM OPERATING ACTIVITIES
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Cash Receipts from Customers (Sales & Service)</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>+₹1,18,00,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Cash Paid to Suppliers & Vendors</span>
              <span style={{ fontWeight: 700, color: '#EF4444' }}>-₹68,20,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <span>Cash Paid to and on Behalf of Employees</span>
              <span style={{ fontWeight: 700, color: '#EF4444' }}>-₹4,85,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#ECFDF5', fontWeight: 900, fontSize: 15, color: '#065F46' }}>
              <span>NET CASH FLOW FROM OPERATING ACTIVITIES</span>
              <span>+₹44,95,000</span>
            </div>
          </div>
        </Card>
      )}

      {/* Ledger Table View */}
      {activeTab === 'ledger' && (
        <>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <Input
                prefix={<Search size={14} color="#64748B" />}
                placeholder="Search account code, name, ref..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />

              <Select value={groupFilter} onChange={setGroupFilter}>
                <Select.Option value="ALL">All Account Groups</Select.Option>
                <Select.Option value="Operating Income">Operating Income</Select.Option>
                <Select.Option value="Operating Expenses">Operating Expenses</Select.Option>
                <Select.Option value="Assets">Assets</Select.Option>
                <Select.Option value="Liabilities">Liabilities</Select.Option>
              </Select>

              <Select value={branchFilter} onChange={setBranchFilter}>
                <Select.Option value="ALL">All Branches</Select.Option>
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
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
              pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} ledger postings` }}
              scroll={{ x: 1250 }}
              size="middle"
            />
          </Card>
        </>
      )}

      {/* Drill-down Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>General Ledger Voucher Posting - {selectedRecord?.referenceNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="journal"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Drilling into complete journal entry voucher for ${selectedRecord?.referenceNumber}...`);
              setDetailModalOpen(false);
            }}
          >
            View Complete Journal Voucher
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Account Head</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.accountName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  Code: {selectedRecord.accountCode} &bull; Group: {selectedRecord.accountGroup}
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Accounting Period & Branch</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>FY {selectedRecord.financialYear}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Branch: {selectedRecord.branch} &bull; Dept: {selectedRecord.department}</div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Voucher Posting Details</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Transaction Description:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Posting Type:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.transactionType} Entry</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Debit (Dr) / Credit (Cr):</span>
                <span style={{ fontWeight: 700, color: selectedRecord.creditAmount > 0 ? '#10B981' : '#0F172A' }}>
                  {selectedRecord.creditAmount > 0 ? `Cr ₹${selectedRecord.creditAmount.toLocaleString('en-IN')}` : `Dr ₹${selectedRecord.debitAmount.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Post-Transaction Account Balance:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedRecord.accountBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Statutory Financial Statements (P&L & Balance Sheet)"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
