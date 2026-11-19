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
  Form,
  InputNumber,
  DatePicker,
  Space,
  Tooltip,
  message,
  Divider,
} from 'antd';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  CreditCard,
  Download,
  Mail,
  ChevronRight,
  Eye,
  FileText,
  User,
} from 'lucide-react';
import dayjs from 'dayjs';
import { ReceivableInvoiceRecord } from './billingData';
import { INITIAL_RECEIVABLES } from './billingMockData';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const OutstandingReceivablesPage: React.FC = () => {
  const [receivables, setReceivables] = useState<ReceivableInvoiceRecord[]>(INITIAL_RECEIVABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Record Collection Modal
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReceivableInvoiceRecord | null>(null);
  const [form] = Form.useForm();

  // 1. Summary Cards Metrics (Exactly 4 meaningful summary cards)
  const metrics = useMemo(() => {
    const totalOutstanding = receivables.reduce((acc, r) => acc + r.outstandingBalance, 0);
    const dueThisWeek = receivables.filter((r) => r.daysOverdue <= 0 && r.outstandingBalance > 0).length;
    const overdueAmount = receivables.filter((r) => r.daysOverdue > 0).reduce((acc, r) => acc + r.outstandingBalance, 0);
    const collectedThisMonth = receivables.reduce((acc, r) => acc + r.amountReceived, 0);

    return { totalOutstanding, dueThisWeek, overdueAmount, collectedThisMonth };
  }, [receivables]);

  // 2. Separate Aging Analysis Table (Aging Period, Number of Invoices, Outstanding Amount, Percentage)
  const agingData = useMemo(() => {
    let currentInvoices = 0, currentAmt = 0;
    let d1_30_Invoices = 0, d1_30_Amt = 0;
    let d31_60_Invoices = 0, d31_60_Amt = 0;
    let d61_90_Invoices = 0, d61_90_Amt = 0;
    let dAbove90_Invoices = 0, dAbove90_Amt = 0;

    const totalBal = metrics.totalOutstanding || 1;

    receivables.forEach((r) => {
      if (r.outstandingBalance > 0) {
        if (r.daysOverdue <= 0) {
          currentInvoices++;
          currentAmt += r.outstandingBalance;
        } else if (r.daysOverdue <= 30) {
          d1_30_Invoices++;
          d1_30_Amt += r.outstandingBalance;
        } else if (r.daysOverdue <= 60) {
          d31_60_Invoices++;
          d31_60_Amt += r.outstandingBalance;
        } else if (r.daysOverdue <= 90) {
          d61_90_Invoices++;
          d61_90_Amt += r.outstandingBalance;
        } else {
          dAbove90_Invoices++;
          dAbove90_Amt += r.outstandingBalance;
        }
      }
    });

    return [
      { key: '1', period: 'Current / Not Due', count: currentInvoices, amount: currentAmt, percent: ((currentAmt / totalBal) * 100).toFixed(1), color: '#16A34A' },
      { key: '2', period: '1–30 Days Overdue', count: d1_30_Invoices, amount: d1_30_Amt, percent: ((d1_30_Amt / totalBal) * 100).toFixed(1), color: '#D97706' },
      { key: '3', period: '31–60 Days Overdue', count: d31_60_Invoices, amount: d31_60_Amt, percent: ((d31_60_Amt / totalBal) * 100).toFixed(1), color: '#EA580C' },
      { key: '4', period: '61–90 Days Overdue', count: d61_90_Invoices, amount: d61_90_Amt, percent: ((d61_90_Amt / totalBal) * 100).toFixed(1), color: '#DC2626' },
      { key: '5', period: 'Above 90 Days Overdue', count: dAbove90_Invoices, amount: dAbove90_Amt, percent: ((dAbove90_Amt / totalBal) * 100).toFixed(1), color: '#991B1B' },
    ];
  }, [receivables, metrics.totalOutstanding]);

  // 3. Filtered List
  const filteredList = useMemo(() => {
    return receivables.filter((r) => {
      const matchSearch =
        r.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.salesOrderRef.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBranch = branchFilter === 'ALL' || r.branch === branchFilter;
      const matchStatus = statusFilter === 'ALL' || r.collectionStatus === statusFilter;

      return matchSearch && matchBranch && matchStatus;
    });
  }, [receivables, searchTerm, branchFilter, statusFilter]);

  const handleOpenCollect = (rec: ReceivableInvoiceRecord) => {
    setSelectedRecord(rec);
    form.setFieldsValue({
      invoiceNumber: rec.invoiceNumber,
      customerName: rec.customerName,
      invoiceAmount: rec.invoiceAmount,
      previouslyReceived: rec.amountReceived,
      outstandingAmount: rec.outstandingBalance,
      currentReceived: rec.outstandingBalance,
      paymentMethod: 'Bank Transfer (NEFT/RTGS)',
      collectionDate: dayjs(),
      referenceNo: `REC-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: '',
    });
    setIsCollectModalOpen(true);
  };

  const handleCollectSubmit = (values: any) => {
    if (!selectedRecord) return;
    const colAmt = Number(values.currentReceived);
    if (colAmt <= 0 || colAmt > selectedRecord.outstandingBalance) {
      message.error('Collection amount must be valid and within outstanding balance.');
      return;
    }

    const newRec = selectedRecord.amountReceived + colAmt;
    const newBal = selectedRecord.invoiceAmount - newRec;
    const newStatus = newBal === 0 ? 'Paid' : 'Partially Paid';

    setReceivables((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              amountReceived: newRec,
              outstandingBalance: newBal,
              collectionStatus: newStatus,
            }
          : r
      )
    );

    message.success(`Customer payment of ₹${colAmt.toLocaleString('en-IN')} banked and credited successfully!`);
    setIsCollectModalOpen(false);
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val: string) => <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{val}</span>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: ReceivableInvoiceRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Order: {record.salesOrderRef} • {record.branch}</div>
        </div>
      ),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (d: string) => <span style={{ fontSize: 12 }}>{d}</span>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (d: string, record: ReceivableInvoiceRecord) => (
        <span
          style={{
            fontSize: 12,
            fontWeight: record.daysOverdue > 0 ? 700 : 500,
            color: record.daysOverdue > 0 ? '#DC2626' : '#334155',
          }}
        >
          {d}
        </span>
      ),
    },
    {
      title: 'Invoice Total',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Amount Received',
      dataIndex: 'amountReceived',
      key: 'amountReceived',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ color: '#16A34A', fontWeight: 600 }}>₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Outstanding Balance',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: amt > 0 ? '#DC2626' : '#64748B' }}>
          ₹{Number(amt).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      align: 'center' as const,
      render: (days: number) => {
        if (days <= 0) return <Tag color="green" style={{ borderRadius: 6 }}>Current</Tag>;
        return <Tag color="red" style={{ borderRadius: 6, fontWeight: 700 }}>{days} Days</Tag>;
      },
    },
    {
      title: 'Collection Status',
      dataIndex: 'collectionStatus',
      key: 'collectionStatus',
      render: (st: string) => {
        let col = 'default';
        if (st === 'Paid') col = 'green';
        if (st === 'Partially Paid') col = 'gold';
        if (st === 'Overdue') col = 'red';
        if (st === 'Unpaid') col = 'blue';
        return <Tag color={col} style={{ borderRadius: 8, fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ReceivableInvoiceRecord) => (
        <Space size="small">
          {record.outstandingBalance > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CreditCard size={15} color="#16A34A" />}
              onClick={() => handleOpenCollect(record)}
              style={{ backgroundColor: '#DCFCE7', borderRadius: 6 }}
            >
              Collect
            </Button>
          )}
          {record.daysOverdue > 0 && (
            <Tooltip title="Send Payment Reminder">
              <Button
                type="text"
                size="small"
                icon={<Mail size={14} color="#D97706" />}
                onClick={() => message.success(`Payment collection reminder dispatched for ${record.invoiceNumber}`)}
                style={{ backgroundColor: '#FEF3C7', borderRadius: 6 }}
              />
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
            <span>Creditors & Debtors</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Outstanding Receivables</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Outstanding Customer Invoices & Receivables Aging
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Monitor uncollected customer invoices, collection workflows, aging tiers, and payment allocations
          </p>
        </div>

        <Space>
          <Button
            icon={<Download size={15} />}
            onClick={() => message.success('Exporting Receivables Aging Report to Excel...')}
            style={{ borderRadius: 10 }}
          >
            Export Receivables
          </Button>
        </Space>
      </div>

      {/* 2. Exactly 4 Meaningful Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Outstanding */}
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
                <TrendingUp size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Outstanding</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(metrics.totalOutstanding / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Total customer credit unpaid</div>
          </div>
        </Col>

        {/* Card 2: Due This Week */}
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Due This Week</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>
              {metrics.dueThisWeek} Invoices Due
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Due in the next 7 days</div>
          </div>
        </Col>

        {/* Card 3: Overdue Amount */}
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
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <AlertTriangle size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Overdue Amount</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626' }}>
              ₹{(metrics.overdueAmount / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4, fontWeight: 700 }}>
              Payment reminder required
            </div>
          </div>
        </Col>

        {/* Card 4: Collected This Month */}
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Collected This Month</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>
              ₹{(metrics.collectedThisMonth / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Customer payments banked</div>
          </div>
        </Col>
      </Row>

      {/* 3. Receivable Aging Analysis Clean Dedicated Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              Receivable Aging Analysis Report
            </h3>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Customer invoice maturity breakdown across standard credit intervals
            </span>
          </div>

          <div style={{ display: 'flex', gap: 14, fontSize: 13, fontWeight: 700 }}>
            <span>Total Invoices: <strong style={{ color: BRAND_PURPLE }}>{receivables.length}</strong></span>
            <span>Total Overdue: <strong style={{ color: '#DC2626' }}>₹{(metrics.overdueAmount / 100000).toFixed(2)}L</strong></span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px' }}>Aging Period</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>Number of Invoices</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Outstanding Amount (INR)</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            {agingData.map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: row.color }}>
                  {row.period}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600 }}>
                  {row.count} Invoices
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                  ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#64748B' }}>
                  {row.percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Table Section */}
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
            placeholder="Search invoice number, customer, SO ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partially Paid', label: 'Partially Paid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredList}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} invoices` }}
          size="middle"
        />
      </div>

      {/* 5. Record Customer Payment Form Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} color="#16A34A" />
            <span>Record Customer Payment Collection & Ledger Credit</span>
          </div>
        }
        open={isCollectModalOpen}
        onCancel={() => setIsCollectModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleCollectSubmit}>
          {/* Section A: Customer Details */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            A. Customer & Invoice Details
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Customer Name" name="customerName">
                <Input disabled style={{ fontWeight: 700 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Invoice Number" name="invoiceNumber">
                <Input disabled style={{ fontWeight: 700 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Invoice Amount (₹)" name="invoiceAmount">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Previously Received (₹)" name="previouslyReceived">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Outstanding Balance (₹)" name="outstandingAmount">
                <InputNumber disabled style={{ width: '100%', color: '#DC2626', fontWeight: 800 }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          {/* Section B: Payment Details */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            B. Payment Collection Details
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Current Received Amount (₹)"
                name="currentReceived"
                rules={[{ required: true, message: 'Please enter collected amount' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Collection Date" name="collectionDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                    { value: 'UPI / Direct Bank QR', label: 'UPI' },
                    { value: 'Customer Cheque', label: 'Cheque' },
                    { value: 'Cash', label: 'Cash' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bank UTR / Transaction Reference" name="referenceNo" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Collection Notes & Remarks" name="notes">
            <Input.TextArea rows={2} placeholder="Optional deposit remarks or receipt references..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsCollectModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Save Collection & Update Ledger
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OutstandingReceivablesPage;
