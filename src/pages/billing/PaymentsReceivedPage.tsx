import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, InputNumber, Typography, message, Tabs } from 'antd';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Plus, Search, Printer, Download, Eye, Layers, DollarSign } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface PaymentReceivedRecord {
  id: string;
  receiptNumber: string;
  paymentDate: string;
  customerName: string;
  customerCode: string;
  invoiceNumber: string;
  amountReceived: number;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Cheque' | 'Credit Card' | 'Cash';
  referenceTransactionId: string;
  status: 'Completed' | 'Pending' | 'Partially Allocated' | 'Unallocated' | 'Refunded';
  allocatedAmount: number;
  unallocatedAmount: number;
  bankAccount: string;
  notes?: string;
}

export const INITIAL_PAYMENTS: PaymentReceivedRecord[] = [
  {
    id: 'PAY-REC-01',
    receiptNumber: 'RCP-2026-101',
    paymentDate: '2026-11-18',
    customerName: 'Tata Steel Processing Ltd',
    customerCode: 'CUST-1001',
    invoiceNumber: 'INV-2026-089',
    amountReceived: 358720,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    referenceTransactionId: 'UTR-HDFC-9948201',
    status: 'Completed',
    allocatedAmount: 358720,
    unallocatedAmount: 0,
    bankAccount: 'HDFC Corporate Current A/C #5020',
    notes: 'Full payment cleared against SO-1048 machinery delivery.',
  },
  {
    id: 'PAY-REC-02',
    receiptNumber: 'RCP-2026-102',
    paymentDate: '2026-11-17',
    customerName: 'Ashok Leyland Foundry Div',
    customerCode: 'CUST-1002',
    invoiceNumber: 'INV-2026-088',
    amountReceived: 201780,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    referenceTransactionId: 'UTR-SBI-4418290',
    status: 'Completed',
    allocatedAmount: 201780,
    unallocatedAmount: 0,
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'PAY-REC-03',
    receiptNumber: 'RCP-2026-103',
    paymentDate: '2026-11-16',
    customerName: 'Lucas TVS Components Ltd',
    customerCode: 'CUST-1003',
    invoiceNumber: 'INV-2026-087',
    amountReceived: 150000,
    paymentMode: 'Cheque',
    referenceTransactionId: 'CHQ-882104 (ICICI)',
    status: 'Partially Allocated',
    allocatedAmount: 150000,
    unallocatedAmount: 0,
    bankAccount: 'ICICI Operational A/C #9914',
    notes: 'Part-settlement for PLC controllers (Inv balance: ₹158,275).',
  },
  {
    id: 'PAY-REC-04',
    receiptNumber: 'RCP-2026-104',
    paymentDate: '2026-11-15',
    customerName: 'Apex Precision Engineering',
    customerCode: 'CUST-1005',
    invoiceNumber: 'Advance Deposit',
    amountReceived: 50000,
    paymentMode: 'UPI',
    referenceTransactionId: 'UPI-AXIS-331089',
    status: 'Unallocated',
    allocatedAmount: 0,
    unallocatedAmount: 50000,
    bankAccount: 'HDFC Corporate Current A/C #5020',
    notes: 'Advance booking token for high-precision tooling.',
  },
];

export const PaymentsReceivedPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentReceivedRecord[]>(() => {
    const raw = localStorage.getItem('erp_payments_received_list');
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS;
  });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'Completed' | 'Pending' | 'Partially Allocated' | 'Unallocated'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentReceivedRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [form] = Form.useForm();

  // Filters
  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchSearch =
        item.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceTransactionId.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus =
        activeTab === 'all' ? statusFilter === 'ALL' || item.status === statusFilter : item.status === activeTab;
      const matchMode = modeFilter === 'ALL' || item.paymentMode === modeFilter;

      return matchSearch && matchStatus && matchMode;
    });
  }, [payments, searchText, statusFilter, modeFilter, activeTab]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amountReceived, 0);
    const completedCount = payments.filter((p) => p.status === 'Completed').length;
    const unallocatedAmount = payments.reduce((acc, curr) => acc + curr.unallocatedAmount, 0);
    const totalReceipts = payments.length;

    return {
      totalCollected,
      completedCount,
      unallocatedAmount,
      totalReceipts,
    };
  }, [payments]);

  const handleSavePayment = (values: any) => {
    const amountReceived = values.amountReceived || 0;
    const isAdvance = values.isAdvance;
    const newRecord: PaymentReceivedRecord = {
      id: 'PAY-REC-' + Date.now(),
      receiptNumber: 'RCP-2026-' + Math.floor(100 + Math.random() * 900),
      paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      customerName: values.customerName,
      customerCode: 'CUST-AUTO',
      invoiceNumber: isAdvance ? 'Advance Deposit' : values.invoiceNumber || 'INV-MANUAL',
      amountReceived,
      paymentMode: values.paymentMode || 'Bank Transfer (NEFT/RTGS)',
      referenceTransactionId: values.referenceTransactionId || 'UTR-TXN-' + Math.floor(1000 + Math.random() * 9000),
      status: isAdvance ? 'Unallocated' : 'Completed',
      allocatedAmount: isAdvance ? 0 : amountReceived,
      unallocatedAmount: isAdvance ? amountReceived : 0,
      bankAccount: values.bankAccount || 'HDFC Corporate Current A/C #5020',
      notes: values.notes,
    };

    const updated = [newRecord, ...payments];
    setPayments(updated);
    localStorage.setItem('erp_payments_received_list', JSON.stringify(updated));
    message.success(`Receipt ${newRecord.receiptNumber} for ₹${amountReceived.toLocaleString('en-IN')} recorded successfully!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Receipt # & Date',
      key: 'rcpDate',
      width: 150,
      render: (_: any, r: PaymentReceivedRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.receiptNumber}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.paymentDate}</div>
        </div>
      ),
    },
    {
      title: 'Customer Name & Code',
      key: 'cust',
      render: (_: any, r: PaymentReceivedRecord) => (
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
      render: (v: string) => <Tag color={v === 'Advance Deposit' ? 'gold' : 'blue'}>{v}</Tag>,
    },
    {
      title: 'Amount Received (₹)',
      dataIndex: 'amountReceived',
      key: 'amountReceived',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Payment Mode & Ref',
      key: 'modeRef',
      render: (_: any, r: PaymentReceivedRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.paymentMode}</div>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{r.referenceTransactionId}</div>
        </div>
      ),
    },
    {
      title: 'Bank Account',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      render: (v: string) => <span style={{ fontSize: 11.5, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        const color =
          status === 'Completed'
            ? 'success'
            : status === 'Partially Allocated'
            ? 'gold'
            : status === 'Unallocated'
            ? 'purple'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: any, r: PaymentReceivedRecord) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={15} color="#4F46E5" />}
            title="View Receipt Voucher"
            onClick={() => {
              setSelectedRecord(r);
              setDetailModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<Printer size={15} color="#0D9488" />}
            title="Print Official Receipt"
            onClick={() => message.success(`Printing Receipt Voucher ${r.receiptNumber}...`)}
          />
        </Space>
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
            Payments Received (Collections)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Track customer incoming collections, bank remittances, advance deposits, and invoice-wise settlement allocations.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Receipts Log
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting collections log...')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Record Payment Receipt
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
          title="Total Collections Received"
          value={`₹${summaryMetrics.totalCollected.toLocaleString('en-IN')}`}
          subtitle="Direct bank remittances & UPI"
          trend={{ value: '18.2% vs previous period', isPositive: true }}
          icon={<CreditCard size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Fully Allocated Receipts"
          value={summaryMetrics.completedCount}
          subtitle="Matched against sales invoices"
          trend={{ value: '100% reconciled', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Unallocated Advances"
          value={`₹${summaryMetrics.unallocatedAmount.toLocaleString('en-IN')}`}
          subtitle="Held on account for future billing"
          trend={{ value: 'Ready for invoice assignment', isPositive: true }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Total Payment Transactions"
          value={summaryMetrics.totalReceipts}
          subtitle="Signed payment vouchers logged"
          trend={{ value: 'Audit trails synchronized', isPositive: true }}
          icon={<DollarSign size={20} color="#0D9488" />}
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
            { key: 'all', label: <span style={{ fontWeight: 700 }}>All Collections ({payments.length})</span> },
            { key: 'Completed', label: <span style={{ fontWeight: 700, color: '#10B981' }}>Completed Payments</span> },
            { key: 'Partially Allocated', label: <span style={{ fontWeight: 700, color: '#D97706' }}>Partially Allocated</span> },
            { key: 'Unallocated', label: <span style={{ fontWeight: 700, color: '#7C3AED' }}>Unallocated Advances</span> },
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
            placeholder="Search receipt #, customer, UTR, inv..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={modeFilter} onChange={setModeFilter}>
            <Select.Option value="ALL">All Payment Modes</Select.Option>
            <Select.Option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</Select.Option>
            <Select.Option value="UPI">UPI Remittance</Select.Option>
            <Select.Option value="Cheque">Bank Cheque</Select.Option>
            <Select.Option value="Cash">Cash Counter</Select.Option>
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} collections` }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* Record Payment Receipt Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Record Customer Payment Collection Receipt</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Post Payment Voucher"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSavePayment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
              <Select placeholder="Select transacting customer">
                <Select.Option value="Tata Steel Processing Ltd">Tata Steel Processing Ltd</Select.Option>
                <Select.Option value="Ashok Leyland Foundry Div">Ashok Leyland Foundry Div</Select.Option>
                <Select.Option value="Lucas TVS Components Ltd">Lucas TVS Components Ltd</Select.Option>
                <Select.Option value="Sundaram Fasteners Ltd">Sundaram Fasteners Ltd</Select.Option>
                <Select.Option value="Apex Precision Engineering">Apex Precision Engineering</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="invoiceNumber" label="Target Invoice Number" initialValue="INV-2026-090">
              <Input placeholder="e.g. INV-2026-090" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="amountReceived" label="Amount Received (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="INR Amount" />
            </Form.Item>

            <Form.Item name="paymentDate" label="Remittance Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="paymentMode" label="Payment Channel" initialValue="Bank Transfer (NEFT/RTGS)">
              <Select>
                <Select.Option value="Bank Transfer (NEFT/RTGS)">NEFT / RTGS</Select.Option>
                <Select.Option value="UPI">Instant UPI</Select.Option>
                <Select.Option value="Cheque">Cheque Clearing</Select.Option>
                <Select.Option value="Cash">Cash</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="referenceTransactionId" label="UTR / Cheque / Transaction Ref #" rules={[{ required: true }]}>
              <Input placeholder="e.g. UTR-HDFC-99214" />
            </Form.Item>

            <Form.Item name="bankAccount" label="Deposited Bank Account" initialValue="HDFC Corporate Current A/C #5020">
              <Select>
                <Select.Option value="HDFC Corporate Current A/C #5020">HDFC Corporate Current A/C #5020</Select.Option>
                <Select.Option value="ICICI Operational A/C #9914">ICICI Operational A/C #9914</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Receipt Voucher Notes">
            <Input.TextArea rows={2} placeholder="Add payment notes, TDS deductions, rebate remarks..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Receipt Voucher Detail Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Official Receipt Voucher - {selectedRecord?.receiptNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.success(`Printing Receipt Voucher ${selectedRecord?.receiptNumber}...`);
              setDetailModalOpen(false);
            }}
          >
            Print Receipt Voucher
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{selectedRecord.customerName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Customer Code: {selectedRecord.customerCode} &bull; Date: {selectedRecord.paymentDate}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Collected Amount:</span>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: 16 }}>
                  ₹{selectedRecord.amountReceived.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Allocated to Invoice:</span>
                <span style={{ fontWeight: 700 }}>{selectedRecord.invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Payment Method:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Bank Reference (UTR):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedRecord.referenceTransactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748B' }}>Deposited Account:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.bankAccount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
