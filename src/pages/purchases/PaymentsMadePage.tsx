import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, InputNumber, Typography, message, Tabs } from 'antd';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Plus, Search, Printer, Download, Eye, Layers } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface PaymentMadeRecord {
  id: string;
  voucherNumber: string;
  paymentDate: string;
  supplierName: string;
  billNumber: string;
  amountPaid: number;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'Cheque' | 'Corporate Card' | 'Cash';
  bankTransactionRef: string;
  bankAccount: string;
  status: 'Completed' | 'Pending' | 'Scheduled' | 'Failed';
  notes?: string;
}

export const INITIAL_PAYMENTS_MADE: PaymentMadeRecord[] = [
  {
    id: 'PM-01',
    voucherNumber: 'PV-2026-081',
    paymentDate: '2026-11-16',
    supplierName: 'Bharat Heavy Electricals & Drives',
    billNumber: 'BILL-BHEL-882',
    amountPaid: 293600,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankTransactionRef: 'NEFT-HDFC-889104',
    bankAccount: 'HDFC Corporate Current A/C #5020',
    status: 'Completed',
    notes: 'Part payment cleared for Siemens Servo Motors delivery.',
  },
  {
    id: 'PM-02',
    voucherNumber: 'PV-2026-082',
    paymentDate: '2026-11-14',
    supplierName: 'Rexroth Bosch India Distributors',
    billNumber: 'BILL-REX-904',
    amountPaid: 200000,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankTransactionRef: 'RTGS-ICICI-441092',
    bankAccount: 'ICICI Operational A/C #9914',
    status: 'Completed',
  },
  {
    id: 'PM-03',
    voucherNumber: 'PV-2026-083',
    paymentDate: '2026-11-12',
    supplierName: 'Schneider Electric Components',
    billNumber: 'BILL-SCH-331',
    amountPaid: 398250,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankTransactionRef: 'NEFT-HDFC-332014',
    bankAccount: 'HDFC Corporate Current A/C #5020',
    status: 'Completed',
    notes: 'Full bill clearance against PO-2026-059.',
  },
  {
    id: 'PM-04',
    voucherNumber: 'PV-2026-084',
    paymentDate: '2026-11-25',
    supplierName: 'Festo India Automation Ltd',
    billNumber: 'BILL-FES-441',
    amountPaid: 190280,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    bankTransactionRef: 'Awaiting Scheduled Run',
    bankAccount: 'HDFC Corporate Current A/C #5020',
    status: 'Scheduled',
    notes: 'Scheduled for end-of-month batch disbursement.',
  },
];

export const PaymentsMadePage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentMadeRecord[]>(() => {
    const raw = localStorage.getItem('erp_payments_made_list');
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS_MADE;
  });
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Completed' | 'Pending' | 'Scheduled'>('all');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentMadeRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [form] = Form.useForm();

  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchSearch =
        item.voucherNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.bankTransactionRef.toLowerCase().includes(searchText.toLowerCase());

      const matchTab = activeTab === 'all' || item.status === activeTab;
      const matchSup = supplierFilter === 'ALL' || item.supplierName === supplierFilter;

      return matchSearch && matchTab && matchSup;
    });
  }, [payments, searchText, activeTab, supplierFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalDisbursed = payments.filter((p) => p.status === 'Completed').reduce((acc, curr) => acc + curr.amountPaid, 0);
    const completedCount = payments.filter((p) => p.status === 'Completed').length;
    const scheduledDisbursements = payments
      .filter((p) => p.status === 'Scheduled')
      .reduce((acc, curr) => acc + curr.amountPaid, 0);
    const totalVouchers = payments.length;

    return {
      totalDisbursed,
      completedCount,
      scheduledDisbursements,
      totalVouchers,
    };
  }, [payments]);

  const handleSavePayment = (values: any) => {
    const amount = values.amountPaid || 0;
    const newRecord: PaymentMadeRecord = {
      id: 'PM-' + Date.now(),
      voucherNumber: 'PV-2026-' + Math.floor(100 + Math.random() * 900),
      paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      supplierName: values.supplierName,
      billNumber: values.billNumber || 'BILL-SUP-MANUAL',
      amountPaid: amount,
      paymentMode: values.paymentMode || 'Bank Transfer (NEFT/RTGS)',
      bankTransactionRef: values.bankTransactionRef || 'NEFT-TXN-' + Math.floor(1000 + Math.random() * 9000),
      bankAccount: values.bankAccount || 'HDFC Corporate Current A/C #5020',
      status: values.status || 'Completed',
      notes: values.notes,
    };

    const updated = [newRecord, ...payments];
    setPayments(updated);
    localStorage.setItem('erp_payments_made_list', JSON.stringify(updated));
    message.success(`Disbursement Voucher ${newRecord.voucherNumber} for ₹${amount.toLocaleString('en-IN')} posted!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Voucher # & Date',
      key: 'vchDate',
      width: 150,
      render: (_: any, r: PaymentMadeRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.voucherNumber}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.paymentDate}</div>
        </div>
      ),
    },
    {
      title: 'Supplier & Bill Number',
      key: 'supBill',
      render: (_: any, r: PaymentMadeRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.supplierName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Bill: {r.billNumber}</div>
        </div>
      ),
    },
    {
      title: 'Amount Disbursed (₹)',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#0F766E', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Payment Mode & Ref',
      key: 'modeRef',
      render: (_: any, r: PaymentMadeRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.paymentMode}</div>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{r.bankTransactionRef}</div>
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
      width: 120,
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'Scheduled' ? 'blue' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      align: 'center' as const,
      render: (_: any, r: PaymentMadeRecord) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="View Payment Voucher Dossier"
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
            Payments Made (Vendor Disbursements)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Manage supplier payment vouchers, bank clearing UTR records, bill allocations, and scheduled batch runs.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Vouchers
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting payment vouchers...')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Payment Voucher
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
          title="Total Vendor Disbursements"
          value={`₹${summaryMetrics.totalDisbursed.toLocaleString('en-IN')}`}
          subtitle="Cleared bank disbursements"
          trend={{ value: '100% matched with bills', isPositive: true }}
          icon={<CreditCard size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Completed Payment Vouchers"
          value={summaryMetrics.completedCount}
          subtitle="Supplier bills settled"
          trend={{ value: 'NEFT & RTGS cleared', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Scheduled Future Outflows"
          value={`₹${summaryMetrics.scheduledDisbursements.toLocaleString('en-IN')}`}
          subtitle="Batch runs queued for release"
          trend={{ value: 'Cash flow pre-allocated', isPositive: true }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Total Payment Transactions"
          value={summaryMetrics.totalVouchers}
          subtitle="Signed payment orders"
          trend={{ value: 'Full bank reconciliation', isPositive: true }}
          icon={<AlertCircle size={20} color="#0D9488" />}
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
            { key: 'all', label: <span style={{ fontWeight: 700 }}>All Vouchers ({payments.length})</span> },
            { key: 'Completed', label: <span style={{ fontWeight: 700, color: '#10B981' }}>Cleared Disbursements</span> },
            { key: 'Scheduled', label: <span style={{ fontWeight: 700, color: '#2563EB' }}>Scheduled Batches</span> },
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
            placeholder="Search voucher #, supplier, UTR, bill..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={supplierFilter} onChange={setSupplierFilter}>
            <Select.Option value="ALL">All Suppliers</Select.Option>
            <Select.Option value="Bharat Heavy Electricals & Drives">BHEL Drives</Select.Option>
            <Select.Option value="Rexroth Bosch India Distributors">Rexroth Bosch</Select.Option>
            <Select.Option value="Schneider Electric Components">Schneider Electric</Select.Option>
            <Select.Option value="Festo India Automation Ltd">Festo India</Select.Option>
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} vouchers` }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Generate Supplier Payment Disbursement Voucher</span>
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
            <Form.Item name="supplierName" label="Payee Supplier" rules={[{ required: true }]}>
              <Select placeholder="Select supplier">
                <Select.Option value="Bharat Heavy Electricals & Drives">Bharat Heavy Electricals & Drives</Select.Option>
                <Select.Option value="Rexroth Bosch India Distributors">Rexroth Bosch India Distributors</Select.Option>
                <Select.Option value="Schneider Electric Components">Schneider Electric Components</Select.Option>
                <Select.Option value="Festo India Automation Ltd">Festo India Automation Ltd</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="billNumber" label="Target Supplier Bill #" rules={[{ required: true }]} initialValue="BILL-BHEL-882">
              <Input placeholder="e.g. BILL-BHEL-882" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="amountPaid" label="Payment Amount (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="INR Amount" />
            </Form.Item>

            <Form.Item name="paymentDate" label="Disbursement Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="paymentMode" label="Payment Mode" initialValue="Bank Transfer (NEFT/RTGS)">
              <Select>
                <Select.Option value="Bank Transfer (NEFT/RTGS)">NEFT / RTGS</Select.Option>
                <Select.Option value="Cheque">Corporate Cheque</Select.Option>
                <Select.Option value="Corporate Card">Corporate Card</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="bankTransactionRef" label="Bank UTR / Cheque #" initialValue="UTR-HDFC-99120">
              <Input />
            </Form.Item>

            <Form.Item name="bankAccount" label="Source Bank Account" initialValue="HDFC Corporate Current A/C #5020">
              <Select>
                <Select.Option value="HDFC Corporate Current A/C #5020">HDFC Corporate Current A/C #5020</Select.Option>
                <Select.Option value="ICICI Operational A/C #9914">ICICI Operational A/C #9914</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Disbursement Voucher - {selectedRecord?.voucherNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{selectedRecord.supplierName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Bill Ref: {selectedRecord.billNumber} &bull; Date: {selectedRecord.paymentDate}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Disbursed:</span>
                <span style={{ fontWeight: 800, color: '#0F766E', fontSize: 16 }}>
                  ₹{selectedRecord.amountPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Bank Reference (UTR):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedRecord.bankTransactionRef}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748B' }}>Disbursed From:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.bankAccount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
