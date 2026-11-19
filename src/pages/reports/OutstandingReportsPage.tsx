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
  InputNumber,
} from 'antd';
import {
  FileText,
  Clock,
  AlertCircle,
  Users,
  Search,
  Download,
  Printer,
  Calendar,
  Layers,
  BarChart3,
  Eye,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useReportsDatabase } from './reportsStore';
import { OutstandingReceivableItem, OutstandingPayableItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const OutstandingReportsPage: React.FC = () => {
  const { receivables, payables, recordCustomerPayment, recordSupplierPayment } = useReportsDatabase();
  const [activeTab, setActiveTab] = useState<'receivables' | 'payables' | 'aging'>('receivables');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [agingFilter, setAgingFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');

  // Payment Recording Modals
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<OutstandingReceivableItem | null>(null);
  const [selectedPayable, setSelectedPayable] = useState<OutstandingPayableItem | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Filters
  const filteredReceivables = useMemo(() => {
    return receivables.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.collectionStatus === statusFilter;
      const matchAging = agingFilter === 'ALL' || item.agingCategory === agingFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;

      return matchSearch && matchStatus && matchAging && matchBranch;
    });
  }, [receivables, searchText, statusFilter, agingFilter, branchFilter]);

  const filteredPayables = useMemo(() => {
    return payables.filter((item) => {
      const matchSearch =
        item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplierCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.paymentStatus === statusFilter;
      const matchAging = agingFilter === 'ALL' || item.agingCategory === agingFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;

      return matchSearch && matchStatus && matchAging && matchBranch;
    });
  }, [payables, searchText, statusFilter, agingFilter, branchFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalReceivables = receivables.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const totalPayables = payables.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const overdueReceivables = receivables
      .filter((i) => i.daysOverdue > 0)
      .reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const overduePayables = payables
      .filter((i) => i.daysOverdue > 0)
      .reduce((acc, curr) => acc + curr.outstandingAmount, 0);
    const totalOverdue = overdueReceivables + overduePayables;

    const uniqueParties = new Set([
      ...receivables.filter((i) => i.outstandingAmount > 0).map((i) => i.customerCode),
      ...payables.filter((i) => i.outstandingAmount > 0).map((i) => i.supplierCode),
    ]).size;

    return {
      totalReceivables,
      totalPayables,
      totalOverdue,
      overdueReceivables,
      overduePayables,
      totalParties: uniqueParties,
    };
  }, [receivables, payables]);

  const handleExport = (type: string) => {
    message.success(`Exporting Outstanding Aging & Settlement Report to ${type.toUpperCase()}...`);
  };

  const handleSettleCustomer = () => {
    if (!selectedReceivable || payAmount <= 0) {
      message.error('Please enter a valid received amount');
      return;
    }
    recordCustomerPayment(selectedReceivable.id, payAmount);
    message.success(`Recorded ₹${payAmount.toLocaleString('en-IN')} payment from ${selectedReceivable.customerName}!`);
    setPayModalOpen(false);
    setSelectedReceivable(null);
  };

  const handleSettleSupplier = () => {
    if (!selectedPayable || payAmount <= 0) {
      message.error('Please enter a valid disbursement amount');
      return;
    }
    recordSupplierPayment(selectedPayable.id, payAmount);
    message.success(`Disbursed ₹${payAmount.toLocaleString('en-IN')} payment to ${selectedPayable.supplierName}!`);
    setPayModalOpen(false);
    setSelectedPayable(null);
  };

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
      title: 'Invoice Ref',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Inv Date / Due Date',
      key: 'dates',
      width: 160,
      render: (_: any, r: OutstandingReceivableItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Inv: {r.invoiceDate}</div>
          <div style={{ color: r.daysOverdue > 0 ? '#EF4444' : '#64748B', fontWeight: 600 }}>
            Due: {r.dueDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Invoice Amt (₹)',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Received (₹)',
      dataIndex: 'amountReceived',
      key: 'amountReceived',
      align: 'right' as const,
      render: (v: number) => <span style={{ color: '#10B981', fontWeight: 600 }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Outstanding (₹)',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: v > 0 ? '#EF4444' : '#10B981', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
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
    {
      title: 'Aging Bucket',
      dataIndex: 'agingCategory',
      key: 'agingCategory',
      width: 140,
      render: (v: string) => {
        const color = v === 'Current / Not Due' ? 'green' : v === 'Above 90 Days Overdue' ? 'red' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'collectionStatus',
      key: 'collectionStatus',
      width: 110,
      render: (v: string) => {
        const color = v === 'Paid' ? 'green' : v === 'Overdue' ? 'red' : v === 'Disputed' ? 'purple' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: OutstandingReceivableItem) => (
        <Button
          size="small"
          type="primary"
          style={{ background: '#1E3A8A', border: 'none', fontSize: 11 }}
          disabled={r.outstandingAmount === 0}
          onClick={() => {
            setSelectedReceivable(r);
            setSelectedPayable(null);
            setPayAmount(r.outstandingAmount);
            setPayModalOpen(true);
          }}
        >
          Collect Pay
        </Button>
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
      title: 'Bill Number',
      dataIndex: 'billNumber',
      key: 'billNumber',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Bill Date / Due Date',
      key: 'dates',
      width: 160,
      render: (_: any, r: OutstandingPayableItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Bill: {r.billDate}</div>
          <div style={{ color: r.daysOverdue > 0 ? '#EF4444' : '#64748B', fontWeight: 600 }}>
            Due: {r.dueDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Bill Amount (₹)',
      dataIndex: 'billAmount',
      key: 'billAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Paid (₹)',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      align: 'right' as const,
      render: (v: number) => <span style={{ color: '#10B981', fontWeight: 600 }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Outstanding (₹)',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: v > 0 ? '#EF4444' : '#10B981', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
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
    {
      title: 'Aging Bucket',
      dataIndex: 'agingCategory',
      key: 'agingCategory',
      width: 140,
      render: (v: string) => {
        const color = v === 'Current / Not Due' ? 'green' : v === 'Above 90 Days Overdue' ? 'red' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 110,
      render: (v: string) => {
        const color = v === 'Paid' ? 'green' : v === 'Overdue' ? 'red' : 'gold';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: OutstandingPayableItem) => (
        <Button
          size="small"
          type="primary"
          style={{ background: '#0D9488', border: 'none', fontSize: 11 }}
          disabled={r.outstandingAmount === 0}
          onClick={() => {
            setSelectedPayable(r);
            setSelectedReceivable(null);
            setPayAmount(r.outstandingAmount);
            setPayModalOpen(true);
          }}
        >
          Disburse Pay
        </Button>
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
            Outstanding Receivables & Payables Reports
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Rigorous aging analysis, collection follow-ups, overdue debtor tracking, and creditor payment schedules.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Debtors Aging Alert
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
          title="Total Pending Receivables"
          value={`₹${summaryMetrics.totalReceivables.toLocaleString('en-IN')}`}
          subtitle="Uncollected customer balances"
          trend={{ value: 'From 5 customer invoices', isPositive: false }}
          icon={<FileText size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Pending Payables"
          value={`₹${summaryMetrics.totalPayables.toLocaleString('en-IN')}`}
          subtitle="Outstanding vendor bills payable"
          trend={{ value: 'Across 4 supplier bills', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Total Overdue Exposure"
          value={`₹${summaryMetrics.totalOverdue.toLocaleString('en-IN')}`}
          subtitle={`₹${summaryMetrics.overdueReceivables.toLocaleString('en-IN')} debtor overdue`}
          trend={{ value: 'Critical cashflow action', isPositive: false }}
          icon={<AlertCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
        <KpiCard
          title="Total Outstanding Parties"
          value={summaryMetrics.totalParties}
          subtitle="Customers & vendors with balances"
          trend={{ value: 'Separately audited records', isPositive: true }}
          icon={<Users size={20} color="#7C3AED" />}
          iconBgColor="#F5F3FF"
        />
      </div>

      {/* Tabs for Strict Separation */}
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
                  Customer Receivables (₹{summaryMetrics.totalReceivables.toLocaleString('en-IN')})
                </span>
              ),
            },
            {
              key: 'payables',
              label: (
                <span style={{ fontWeight: 700, color: '#0D9488' }}>
                  Supplier Payables (₹{summaryMetrics.totalPayables.toLocaleString('en-IN')})
                </span>
              ),
            },
            {
              key: 'aging',
              label: <span style={{ fontWeight: 700 }}>Aging Bucket Distribution (0 to 90+ Days)</span>,
            },
          ]}
        />
      </Card>

      {/* Aging Analysis Tab */}
      {activeTab === 'aging' && (
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
          <Title level={4} style={{ color: '#1E3A8A', margin: 0, marginBottom: 16 }}>
            Consolidated Aging Analysis (Receivables vs Payables)
          </Title>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div style={{ background: '#F0FDF4', padding: 14, borderRadius: 10, border: '1px solid #BBF7D0' }}>
              <div style={{ color: '#166534', fontWeight: 700 }}>Current (Not Due)</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#15803D', marginTop: 4 }}>
                Rec: ₹4,37,190 | Pay: ₹4,11,830
              </div>
              <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>Terms not yet matured</div>
            </div>

            <div style={{ background: '#FFFBEB', padding: 14, borderRadius: 10, border: '1px solid #FDE68A' }}>
              <div style={{ color: '#92400E', fontWeight: 700 }}>1–30 Days Overdue</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#B45309', marginTop: 4 }}>
                Rec: ₹3,50,000 | Pay: ₹3,20,000
              </div>
              <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>Payment reminder automated</div>
            </div>

            <div style={{ background: '#FFF7ED', padding: 14, borderRadius: 10, border: '1px solid #FED7AA' }}>
              <div style={{ color: '#9A3412', fontWeight: 700 }}>31–60 Days Overdue</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#EA580C', marginTop: 4 }}>
                Rec: ₹2,00,000 | Pay: ₹1,90,280
              </div>
              <div style={{ fontSize: 11, color: '#9A3412', marginTop: 2 }}>Priority follow-up required</div>
            </div>

            <div style={{ background: '#FEF2F2', padding: 14, borderRadius: 10, border: '1px solid #FECACA' }}>
              <div style={{ color: '#991B1B', fontWeight: 700 }}>Above 90 Days Overdue</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
                Rec: ₹2,80,000 | Pay: ₹0
              </div>
              <div style={{ fontSize: 11, color: '#991B1B', marginTop: 2 }}>Disputed or legal escalations</div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Toolbar */}
      {activeTab !== 'aging' && (
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
              placeholder="Search code, party name, doc #..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            <Select value={statusFilter} onChange={setStatusFilter}>
              <Select.Option value="ALL">All Statuses</Select.Option>
              <Select.Option value="Unpaid">Unpaid</Select.Option>
              <Select.Option value="Partially Paid">Partially Paid</Select.Option>
              <Select.Option value="Overdue">Overdue</Select.Option>
              <Select.Option value="Disputed">Disputed</Select.Option>
            </Select>

            <Select value={agingFilter} onChange={setAgingFilter}>
              <Select.Option value="ALL">All Aging Buckets</Select.Option>
              <Select.Option value="Current / Not Due">Current / Not Due</Select.Option>
              <Select.Option value="1–30 Days Overdue">1–30 Days Overdue</Select.Option>
              <Select.Option value="31–60 Days Overdue">31–60 Days Overdue</Select.Option>
              <Select.Option value="Above 90 Days Overdue">Above 90 Days Overdue</Select.Option>
            </Select>

            <Select value={branchFilter} onChange={setBranchFilter}>
              <Select.Option value="ALL">All Branches</Select.Option>
              <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
              <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
              <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
            </Select>
          </div>
        </Card>
      )}

      {/* Tables */}
      {activeTab === 'receivables' && (
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
            dataSource={filteredReceivables}
            columns={receivableColumns}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} receivables` }}
            scroll={{ x: 1250 }}
            size="middle"
          />
        </Card>
      )}

      {activeTab === 'payables' && (
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
            dataSource={filteredPayables}
            columns={payableColumns}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} payables` }}
            scroll={{ x: 1250 }}
            size="middle"
          />
        </Card>
      )}

      {/* Record Payment / Collection Modal */}
      <Modal
        open={payModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <CheckCircle size={18} />
            <span>
              {selectedReceivable
                ? `Record Customer Collection - ${selectedReceivable.customerName}`
                : `Disburse Supplier Payment - ${selectedPayable?.supplierName}`}
            </span>
          </div>
        }
        onCancel={() => setPayModalOpen(false)}
        onOk={selectedReceivable ? handleSettleCustomer : handleSettleSupplier}
        okText="Record Payment Entry"
        cancelText="Cancel"
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>Target Reference Document</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
              {selectedReceivable ? `Invoice #${selectedReceivable.invoiceNumber}` : `Bill #${selectedPayable?.billNumber}`}
            </div>
            <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 700, marginTop: 4 }}>
              Current Outstanding: ₹
              {(selectedReceivable
                ? selectedReceivable.outstandingAmount
                : selectedPayable?.outstandingAmount || 0
              ).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Payment Amount (INR):</div>
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              value={payAmount}
              onChange={(val) => setPayAmount(val || 0)}
              prefix="₹"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Payment Method & Bank Account:</div>
            <Select defaultValue="HDFC Current A/C #5020" style={{ width: '100%' }}>
              <Select.Option value="HDFC Current A/C #5020">HDFC Corporate Current A/C #5020</Select.Option>
              <Select.Option value="ICICI Operational A/C #9914">ICICI Operational A/C #9914</Select.Option>
              <Select.Option value="Petty Cash Office">Petty Cash Office Safe</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Outstanding Aging & Debtor Exposure Report"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
