import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Typography, Tabs, message } from 'antd';
import { FileText, Clock, AlertCircle, Users, Search, Printer, Download, Eye } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useReportsDatabase } from '../reports/reportsStore';
import { OutstandingReceivableItem, OutstandingPayableItem } from '../reports/reportsData';

const { Text, Title } = Typography;

export const AccountsReceivablePayablePage: React.FC = () => {
  const { receivables, payables } = useReportsDatabase();
  const [activeTab, setActiveTab] = useState<'receivables' | 'payables'>('receivables');
  const [searchText, setSearchText] = useState('');
  const [agingFilter, setAgingFilter] = useState('ALL');

  const filteredReceivables = useMemo(() => {
    return receivables.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchText.toLowerCase());

      const matchAging = agingFilter === 'ALL' || item.agingCategory === agingFilter;
      return matchSearch && matchAging;
    });
  }, [receivables, searchText, agingFilter]);

  const filteredPayables = useMemo(() => {
    return payables.filter((item) => {
      const matchSearch =
        item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplierCode.toLowerCase().includes(searchText.toLowerCase());

      const matchAging = agingFilter === 'ALL' || item.agingCategory === agingFilter;
      return matchSearch && matchAging;
    });
  }, [payables, searchText, agingFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalReceivables = receivables.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const totalPayables = payables.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const overdueReceivables = receivables.filter((r) => r.daysOverdue > 0).reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const overduePayables = payables.filter((p) => p.daysOverdue > 0).reduce((acc, curr) => acc + curr.outstandingAmount, 0);

    return {
      totalReceivables,
      totalPayables,
      overdueReceivables,
      overduePayables,
    };
  }, [receivables, payables]);

  const receivableColumns = [
    {
      title: 'Customer Name & Code',
      key: 'cust',
      render: (_: any, r: OutstandingReceivableItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.customerName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.customerCode}</div>
        </div>
      ),
    },
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Invoice / Due Date',
      key: 'dates',
      width: 160,
      render: (_: any, r: OutstandingReceivableItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Inv: {r.invoiceDate}</div>
          <div style={{ color: r.daysOverdue > 0 ? '#EF4444' : '#64748B', fontWeight: 600 }}>Due: {r.dueDate}</div>
        </div>
      ),
    },
    {
      title: 'Total Invoiced (₹)',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Outstanding Amount (₹)',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#EF4444', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingCategory',
      key: 'agingCategory',
      width: 150,
      render: (v: string) => {
        const color = v === 'Current / Not Due' ? 'green' : v === 'Above 90 Days Overdue' ? 'red' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      width: 110,
      align: 'center' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v > 0 ? '#DC2626' : '#16A34A' }}>
          {v > 0 ? `${v} days` : 'Current'}
        </span>
      ),
    },
  ];

  const payableColumns = [
    {
      title: 'Supplier Name & Code',
      key: 'sup',
      render: (_: any, r: OutstandingPayableItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.supplierName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.supplierCode}</div>
        </div>
      ),
    },
    {
      title: 'Bill #',
      dataIndex: 'billNumber',
      key: 'billNumber',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#0D9488' }}>{v}</span>,
    },
    {
      title: 'Bill / Due Date',
      key: 'dates',
      width: 160,
      render: (_: any, r: OutstandingPayableItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Bill: {r.billDate}</div>
          <div style={{ color: r.daysOverdue > 0 ? '#EF4444' : '#64748B', fontWeight: 600 }}>Due: {r.dueDate}</div>
        </div>
      ),
    },
    {
      title: 'Total Bill Amount (₹)',
      dataIndex: 'billAmount',
      key: 'billAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Outstanding Payable (₹)',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#EF4444', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingCategory',
      key: 'agingCategory',
      width: 150,
      render: (v: string) => {
        const color = v === 'Current / Not Due' ? 'green' : v === 'Above 90 Days Overdue' ? 'red' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      width: 110,
      align: 'center' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v > 0 ? '#DC2626' : '#16A34A' }}>
          {v > 0 ? `${v} days` : 'Current'}
        </span>
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
            Accounts Receivable & Accounts Payable (AR / AP)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Unified outstanding balances, credit aging buckets (Current to 90+ days), and payment schedules without account offsetting.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Statement
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting aging analysis...')}>
            Export Excel
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
          title="Total Accounts Receivable (AR)"
          value={`₹${summaryMetrics.totalReceivables.toLocaleString('en-IN')}`}
          subtitle="Pending customer collections"
          trend={{ value: 'From 5 customer accounts', isPositive: false }}
          icon={<FileText size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Accounts Payable (AP)"
          value={`₹${summaryMetrics.totalPayables.toLocaleString('en-IN')}`}
          subtitle="Pending vendor disbursements"
          trend={{ value: 'Across 4 supplier bills', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Overdue Receivables"
          value={`₹${summaryMetrics.overdueReceivables.toLocaleString('en-IN')}`}
          subtitle="Customer invoices overdue"
          trend={{ value: 'Requires payment follow-up', isPositive: false }}
          icon={<AlertCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
        <KpiCard
          title="Overdue Payables"
          value={`₹${summaryMetrics.overduePayables.toLocaleString('en-IN')}`}
          subtitle="Supplier bills overdue"
          trend={{ value: 'Scheduled for clearance', isPositive: false }}
          icon={<AlertCircle size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Aging Distribution Visual */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 14, marginBottom: 12 }}>
          Standard Financial Aging Buckets (Current vs Overdue Aging)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div style={{ background: '#F0FDF4', padding: 12, borderRadius: 8, border: '1px solid #BBF7D0' }}>
            <div style={{ color: '#166534', fontWeight: 700, fontSize: 12 }}>Current / Not Due</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#15803D', marginTop: 4 }}>Rec: ₹4.37L | Pay: ₹4.11L</div>
          </div>
          <div style={{ background: '#FFFBEB', padding: 12, borderRadius: 8, border: '1px solid #FDE68A' }}>
            <div style={{ color: '#92400E', fontWeight: 700, fontSize: 12 }}>1–30 Days Overdue</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#B45309', marginTop: 4 }}>Rec: ₹3.50L | Pay: ₹3.20L</div>
          </div>
          <div style={{ background: '#FFF7ED', padding: 12, borderRadius: 8, border: '1px solid #FED7AA' }}>
            <div style={{ color: '#9A3412', fontWeight: 700, fontSize: 12 }}>31–60 Days Overdue</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#EA580C', marginTop: 4 }}>Rec: ₹2.00L | Pay: ₹1.90L</div>
          </div>
          <div style={{ background: '#FEF2F2', padding: 12, borderRadius: 8, border: '1px solid #FECACA' }}>
            <div style={{ color: '#991B1B', fontWeight: 700, fontSize: 12 }}>Above 90 Days Overdue</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>Rec: ₹2.80L | Pay: ₹0.00</div>
          </div>
        </div>
      </Card>

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
            {
              key: 'receivables',
              label: (
                <span style={{ fontWeight: 700, color: '#1E3A8A' }}>
                  Accounts Receivable (₹{summaryMetrics.totalReceivables.toLocaleString('en-IN')})
                </span>
              ),
            },
            {
              key: 'payables',
              label: (
                <span style={{ fontWeight: 700, color: '#0D9488' }}>
                  Accounts Payable (₹{summaryMetrics.totalPayables.toLocaleString('en-IN')})
                </span>
              ),
            },
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search party name, code, invoice #..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={agingFilter} onChange={setAgingFilter}>
            <Select.Option value="ALL">All Aging Buckets</Select.Option>
            <Select.Option value="Current / Not Due">Current / Not Due</Select.Option>
            <Select.Option value="1–30 Days Overdue">1–30 Days Overdue</Select.Option>
            <Select.Option value="31–60 Days Overdue">31–60 Days Overdue</Select.Option>
            <Select.Option value="Above 90 Days Overdue">Above 90 Days Overdue</Select.Option>
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
        {activeTab === 'receivables' ? (
          <Table<OutstandingReceivableItem>
            dataSource={filteredReceivables}
            columns={receivableColumns}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            scroll={{ x: 1100 }}
            size="middle"
          />
        ) : (
          <Table<OutstandingPayableItem>
            dataSource={filteredPayables}
            columns={payableColumns}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            scroll={{ x: 1100 }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};
