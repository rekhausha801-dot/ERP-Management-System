import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Typography, message, Tabs, Upload } from 'antd';
import { Landmark, CheckCircle2, AlertCircle, RefreshCw, UploadCloud, Search, Printer, Download, Eye, FileText } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface BankReconTransaction {
  id: string;
  transactionDate: string;
  description: string;
  referenceNumber: string;
  erpAmount: number;
  bankAmount: number;
  difference: number;
  reconStatus: 'Matched' | 'Unmatched' | 'Manual Review';
  bankAccount: string;
}

export const INITIAL_RECON_ITEMS: BankReconTransaction[] = [
  {
    id: 'TXN-01',
    transactionDate: '2026-11-18',
    description: 'Tata Steel SO-1048 RTGS Inward Remittance',
    referenceNumber: 'UTR-HDFC-9948201',
    erpAmount: 358720,
    bankAmount: 358720,
    difference: 0,
    reconStatus: 'Matched',
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'TXN-02',
    transactionDate: '2026-11-17',
    description: 'Ashok Leyland Foundry Div NEFT Receipt',
    referenceNumber: 'UTR-SBI-4418290',
    erpAmount: 201780,
    bankAmount: 201780,
    difference: 0,
    reconStatus: 'Matched',
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'TXN-03',
    transactionDate: '2026-11-16',
    description: 'BHEL Siemens Motors Vendor Outward NEFT',
    referenceNumber: 'NEFT-HDFC-889104',
    erpAmount: -293600,
    bankAmount: -293600,
    difference: 0,
    reconStatus: 'Matched',
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'TXN-04',
    transactionDate: '2026-11-15',
    description: 'Bank Monthly Current Account Service Charges & GST',
    referenceNumber: 'BNK-CHG-NOV26',
    erpAmount: 0,
    bankAmount: -1450,
    difference: 1450,
    reconStatus: 'Unmatched',
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'TXN-05',
    transactionDate: '2026-11-14',
    description: 'Apex Precision Advance Token UPI',
    referenceNumber: 'UPI-AXIS-331089',
    erpAmount: 50000,
    bankAmount: 50000,
    difference: 0,
    reconStatus: 'Matched',
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
];

export const BankReconciliationPage: React.FC = () => {
  const [transactions, setTransactions] = useState<BankReconTransaction[]>(() => {
    const raw = localStorage.getItem('erp_bank_recon_items');
    return raw ? JSON.parse(raw) : INITIAL_RECON_ITEMS;
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Corporate Current A/C #5020');
  const [activeTab, setActiveTab] = useState<'all' | 'Matched' | 'Unmatched'>('all');
  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      const matchSearch =
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchBank = item.bankAccount === selectedBank;
      const matchTab = activeTab === 'all' || item.reconStatus === activeTab;

      return matchSearch && matchBank && matchTab;
    });
  }, [transactions, selectedBank, activeTab, searchText]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const matchedCount = transactions.filter((t) => t.reconStatus === 'Matched').length;
    const unmatchedCount = transactions.filter((t) => t.reconStatus === 'Unmatched').length;
    const erpBookBalance = 5820400;
    const bankPassbookBalance = erpBookBalance - 1450; // Bank fee pending posting

    return {
      erpBookBalance,
      bankPassbookBalance,
      matchedCount,
      unmatchedCount,
    };
  }, [transactions]);

  const handleAutoMatch = () => {
    message.loading('Matching bank statement line items with ERP general ledger...');
    setTimeout(() => {
      message.success('Auto-matching completed! 4 matched, 1 unmatched bank fee detected.');
    }, 800);
  };

  const handleResolveUnmatched = (id: string) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, reconStatus: 'Matched' as const, erpAmount: t.bankAmount, difference: 0 } : t
    );
    setTransactions(updated);
    localStorage.setItem('erp_bank_recon_items', JSON.stringify(updated));
    message.success('Bank charge auto-posted to Ledger and reconciled!');
  };

  const columns = [
    {
      title: 'Txn Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 110,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#334155' }}>{v}</span>,
    },
    {
      title: 'Description & Bank Ref',
      key: 'descRef',
      render: (_: any, r: BankReconTransaction) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.description}</div>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>Ref: {r.referenceNumber}</div>
        </div>
      ),
    },
    {
      title: 'ERP Ledger (₹)',
      dataIndex: 'erpAmount',
      key: 'erpAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v < 0 ? '#DC2626' : '#0F172A' }}>
          {v < 0 ? `-₹${Math.abs(v).toLocaleString('en-IN')}` : `+₹${v.toLocaleString('en-IN')}`}
        </span>
      ),
    },
    {
      title: 'Bank Statement (₹)',
      dataIndex: 'bankAmount',
      key: 'bankAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v < 0 ? '#DC2626' : '#10B981' }}>
          {v < 0 ? `-₹${Math.abs(v).toLocaleString('en-IN')}` : `+₹${v.toLocaleString('en-IN')}`}
        </span>
      ),
    },
    {
      title: 'Variance (₹)',
      dataIndex: 'difference',
      key: 'difference',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: v === 0 ? '#10B981' : '#EF4444' }}>
          {v === 0 ? '₹0.00' : `₹${v.toLocaleString('en-IN')}`}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'reconStatus',
      key: 'reconStatus',
      width: 120,
      render: (status: string) => {
        const color = status === 'Matched' ? 'success' : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 110,
      align: 'center' as const,
      render: (_: any, r: BankReconTransaction) => (
        r.reconStatus === 'Unmatched' ? (
          <Button
            size="small"
            type="primary"
            style={{ background: '#1E3A8A', border: 'none', fontSize: 11 }}
            onClick={() => handleResolveUnmatched(r.id)}
          >
            Post & Match
          </Button>
        ) : (
          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Reconciled</span>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Title & Actions */}
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
            Bank Reconciliation Statement
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Reconcile enterprise bank passbook statements with general ledger cash books and auto-match cleared remittances.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<RefreshCw size={14} />} onClick={handleAutoMatch}>
            Auto Match Transactions
          </Button>
          <Button
            type="primary"
            icon={<UploadCloud size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => message.info('Import Bank MT940 / CSV Statement dialog opened.')}
          >
            Import Bank Statement
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
          title="ERP Ledger Cashbook Balance"
          value={`₹${summaryMetrics.erpBookBalance.toLocaleString('en-IN')}`}
          subtitle="System recorded bank assets"
          trend={{ value: 'Per general ledger books', isPositive: true }}
          icon={<Landmark size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Bank Passbook Balance"
          value={`₹${summaryMetrics.bankPassbookBalance.toLocaleString('en-IN')}`}
          subtitle="Actual bank confirmed funds"
          trend={{ value: 'Live corporate API linked', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Matched Transactions"
          value={summaryMetrics.matchedCount}
          subtitle="100% verified clearing items"
          trend={{ value: 'Zero variance clearing', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Unmatched Discrepancies"
          value={summaryMetrics.unmatchedCount}
          subtitle="Bank charges or unposted checks"
          trend={{ value: 'Requires manual match', isPositive: false }}
          icon={<AlertCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
      </div>

      {/* Account Selector & Tabs */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: '14px 18px 0' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>Reconciling Account:</span>
            <Select value={selectedBank} onChange={setSelectedBank} style={{ minWidth: 320 }}>
              <Select.Option value="HDFC Corporate Current A/C #5020">HDFC Corporate Current A/C #5020</Select.Option>
              <Select.Option value="ICICI Operational A/C #9914">ICICI Operational A/C #9914</Select.Option>
            </Select>
          </div>

          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search description, UTR ref..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(k: any) => setActiveTab(k)}
          items={[
            { key: 'all', label: <span style={{ fontWeight: 700 }}>All Statement Lines ({transactions.length})</span> },
            { key: 'Matched', label: <span style={{ fontWeight: 700, color: '#10B981' }}>Matched & Cleared</span> },
            { key: 'Unmatched', label: <span style={{ fontWeight: 700, color: '#DC2626' }}>Unmatched Variance</span> },
          ]}
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
    </div>
  );
};
