import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, InputNumber, Typography, message, Tabs } from 'antd';
import { ShoppingCart, CheckCircle2, Clock, AlertCircle, Plus, Search, Printer, Download, Eye, Layers, FileCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface PurchaseInvoiceBill {
  id: string;
  billNumber: string;
  poNumber: string;
  grnNumber: string;
  supplierName: string;
  supplierGstin: string;
  billDate: string;
  dueDate: string;
  taxableAmount: number;
  gstAmount: number;
  totalBillAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  paymentTerms: string;
  branch: string;
}

export const INITIAL_PURCHASE_BILLS: PurchaseInvoiceBill[] = [
  {
    id: 'PB-01',
    billNumber: 'BILL-BHEL-882',
    poNumber: 'PO-2026-061',
    grnNumber: 'GRN-2026-041',
    supplierName: 'Bharat Heavy Electricals & Drives',
    supplierGstin: '33AAACB1209Q1Z4',
    billDate: '2026-10-15',
    dueDate: '2026-11-14',
    taxableAmount: 520000,
    gstAmount: 93600,
    totalBillAmount: 613600,
    amountPaid: 293600,
    outstandingBalance: 320000,
    status: 'Overdue',
    paymentTerms: 'Net 30 Days',
    branch: 'Chennai HQ',
  },
  {
    id: 'PB-02',
    billNumber: 'BILL-REX-904',
    poNumber: 'PO-2026-060',
    grnNumber: 'GRN-2026-042',
    supplierName: 'Rexroth Bosch India Distributors',
    supplierGstin: '29AABCR8810K1ZX',
    billDate: '2026-11-14',
    dueDate: '2026-12-14',
    taxableAmount: 362500,
    gstAmount: 65250,
    totalBillAmount: 427750,
    amountPaid: 200000,
    outstandingBalance: 227750,
    status: 'Partially Paid',
    paymentTerms: 'Net 30 Days',
    branch: 'Chennai HQ',
  },
  {
    id: 'PB-03',
    billNumber: 'BILL-SCH-331',
    poNumber: 'PO-2026-059',
    grnNumber: 'GRN-2026-043',
    supplierName: 'Schneider Electric Components',
    supplierGstin: '33AABCS4412M1Z0',
    billDate: '2026-11-12',
    dueDate: '2026-12-12',
    taxableAmount: 337500,
    gstAmount: 60750,
    totalBillAmount: 398250,
    amountPaid: 398250,
    outstandingBalance: 0,
    status: 'Paid',
    paymentTerms: 'Net 30 Days',
    branch: 'Bengaluru Tech Park',
  },
  {
    id: 'PB-04',
    billNumber: 'BILL-FES-441',
    poNumber: 'PO-2026-058',
    grnNumber: 'GRN-2026-044',
    supplierName: 'Festo India Automation Ltd',
    supplierGstin: '33AABCF5519L1ZP',
    billDate: '2026-11-10',
    dueDate: '2026-12-10',
    taxableAmount: 246000,
    gstAmount: 44280,
    totalBillAmount: 290280,
    amountPaid: 100000,
    outstandingBalance: 190280,
    status: 'Partially Paid',
    paymentTerms: 'Net 30 Days',
    branch: 'Chennai HQ',
  },
];

export const PurchaseInvoicesBillsPage: React.FC = () => {
  const [bills, setBills] = useState<PurchaseInvoiceBill[]>(() => {
    const raw = localStorage.getItem('erp_purchase_bills_list');
    return raw ? JSON.parse(raw) : INITIAL_PURCHASE_BILLS;
  });
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue'>('all');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<PurchaseInvoiceBill | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [form] = Form.useForm();

  const filteredBills = useMemo(() => {
    return bills.filter((item) => {
      const matchSearch =
        item.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.poNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.grnNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchText.toLowerCase());

      const matchTab = activeTab === 'all' || item.status === activeTab;
      const matchSup = supplierFilter === 'ALL' || item.supplierName === supplierFilter;

      return matchSearch && matchTab && matchSup;
    });
  }, [bills, searchText, activeTab, supplierFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalBilled = bills.reduce((acc, curr) => acc + curr.totalBillAmount, 0);
    const totalOutstanding = bills.reduce((acc, curr) => acc + curr.outstandingBalance, 0);
    const overdueBillsCount = bills.filter((b) => b.status === 'Overdue').length;
    const totalBillsCount = bills.length;

    return {
      totalBilled,
      totalOutstanding,
      overdueBillsCount,
      totalBillsCount,
    };
  }, [bills]);

  const handleSaveBill = (values: any) => {
    const taxable = values.taxableAmount || 0;
    const gst = Math.round(taxable * 0.18);
    const total = taxable + gst;

    const newBill: PurchaseInvoiceBill = {
      id: 'PB-' + Date.now(),
      billNumber: values.billNumber || 'BILL-SUP-' + Math.floor(100 + Math.random() * 900),
      poNumber: values.poNumber || 'PO-2026-063',
      grnNumber: values.grnNumber || 'GRN-2026-045',
      supplierName: values.supplierName,
      supplierGstin: '33AABCS8891Q1Z8',
      billDate: values.billDate ? values.billDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : dayjs().add(30, 'day').format('YYYY-MM-DD'),
      taxableAmount: taxable,
      gstAmount: gst,
      totalBillAmount: total,
      amountPaid: 0,
      outstandingBalance: total,
      status: 'Unpaid',
      paymentTerms: values.paymentTerms || 'Net 30 Days',
      branch: values.branch || 'Chennai HQ',
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    localStorage.setItem('erp_purchase_bills_list', JSON.stringify(updated));
    message.success(`Supplier Bill ${newBill.billNumber} logged for ₹${total.toLocaleString('en-IN')}!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Bill # & Date',
      key: 'billDate',
      width: 150,
      render: (_: any, r: PurchaseInvoiceBill) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.billNumber}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Bill: {r.billDate}</div>
        </div>
      ),
    },
    {
      title: 'Supplier Name & GSTIN',
      key: 'sup',
      render: (_: any, r: PurchaseInvoiceBill) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.supplierName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>GSTIN: {r.supplierGstin}</div>
        </div>
      ),
    },
    {
      title: 'PO & GRN Matching',
      key: 'matching',
      render: (_: any, r: PurchaseInvoiceBill) => (
        <div style={{ fontSize: 11.5 }}>
          <Tag color="cyan">PO: {r.poNumber}</Tag>
          <Tag color="blue">GRN: {r.grnNumber}</Tag>
        </div>
      ),
    },
    {
      title: 'Total Bill Amount (₹)',
      dataIndex: 'totalBillAmount',
      key: 'totalBillAmount',
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
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: v > 0 ? '#EF4444' : '#10B981', fontSize: 13.5 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const color =
          status === 'Paid'
            ? 'success'
            : status === 'Partially Paid'
            ? 'gold'
            : status === 'Overdue'
            ? 'error'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (_: any, r: PurchaseInvoiceBill) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={15} color="#4F46E5" />}
            title="View Bill Dossier & Matching"
            onClick={() => {
              setSelectedBill(r);
              setDetailModalOpen(true);
            }}
          />
        </Space>
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
            Purchase Invoices & Supplier Bills
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Manage supplier purchase bills, 3-way matching with Purchase Orders (PO) and Goods Receipt Notes (GRN), and payment terms.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Bills Log
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting Supplier Bills...')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Purchase Bill
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
          title="Total Billed Invoices"
          value={`₹${summaryMetrics.totalBilled.toLocaleString('en-IN')}`}
          subtitle="Cumulative procurement billed"
          trend={{ value: 'Across 4 major OEM suppliers', isPositive: true }}
          icon={<ShoppingCart size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Outstanding Payable Balance"
          value={`₹${summaryMetrics.totalOutstanding.toLocaleString('en-IN')}`}
          subtitle="Pending vendor disbursements"
          trend={{ value: 'Scheduled within terms', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Overdue Bills"
          value={summaryMetrics.overdueBillsCount}
          subtitle="Passed credit due date"
          trend={{ value: 'High priority payment required', isPositive: false }}
          icon={<AlertCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
        <KpiCard
          title="Total Recorded Bills"
          value={summaryMetrics.totalBillsCount}
          subtitle="PO & GRN 3-way verified"
          trend={{ value: '100% ITC tax match', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
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
            { key: 'all', label: <span style={{ fontWeight: 700 }}>All Purchase Bills ({bills.length})</span> },
            { key: 'Unpaid', label: <span style={{ fontWeight: 700, color: '#2563EB' }}>Unpaid Bills</span> },
            { key: 'Partially Paid', label: <span style={{ fontWeight: 700, color: '#D97706' }}>Partially Paid</span> },
            { key: 'Paid', label: <span style={{ fontWeight: 700, color: '#10B981' }}>Fully Settled</span> },
            { key: 'Overdue', label: <span style={{ fontWeight: 700, color: '#DC2626' }}>Overdue Bills</span> },
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
            placeholder="Search bill #, PO #, GRN #, supplier..."
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
          dataSource={filteredBills}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} bills` }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Create Purchase Bill Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create Supplier Purchase Bill (3-Way Matching)</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Record Purchase Bill"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveBill}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="supplierName" label="Supplier / Vendor" rules={[{ required: true }]}>
              <Select placeholder="Select supplier">
                <Select.Option value="Bharat Heavy Electricals & Drives">Bharat Heavy Electricals & Drives</Select.Option>
                <Select.Option value="Rexroth Bosch India Distributors">Rexroth Bosch India Distributors</Select.Option>
                <Select.Option value="Schneider Electric Components">Schneider Electric Components</Select.Option>
                <Select.Option value="Festo India Automation Ltd">Festo India Automation Ltd</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="billNumber" label="Supplier Invoice / Bill #" rules={[{ required: true }]}>
              <Input placeholder="e.g. BILL-SUP-2026-99" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="poNumber" label="Linked Purchase Order (PO)" rules={[{ required: true }]} initialValue="PO-2026-063">
              <Input placeholder="e.g. PO-2026-063" />
            </Form.Item>

            <Form.Item name="grnNumber" label="Goods Receipt Note (GRN)" rules={[{ required: true }]} initialValue="GRN-2026-045">
              <Input placeholder="e.g. GRN-2026-045" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="taxableAmount" label="Taxable Amount (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="Taxable base value" />
            </Form.Item>

            <Form.Item name="billDate" label="Bill Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="dueDate" label="Payment Due Date" initialValue={dayjs().add(30, 'day')}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="paymentTerms" label="Credit Terms" initialValue="Net 30 Days">
              <Select>
                <Select.Option value="Net 15 Days">Net 15 Days</Select.Option>
                <Select.Option value="Net 30 Days">Net 30 Days</Select.Option>
                <Select.Option value="Net 45 Days">Net 45 Days</Select.Option>
                <Select.Option value="Immediate">Immediate on Presentation</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="branch" label="Receiving Branch Depot" initialValue="Chennai HQ">
              <Select>
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Bill Dossier Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Supplier Bill Dossier - {selectedBill?.billNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={650}
      >
        {selectedBill && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{selectedBill.supplierName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                GSTIN: {selectedBill.supplierGstin} &bull; Terms: {selectedBill.paymentTerms}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>3-Way Match References:</span>
                <span style={{ fontWeight: 700 }}>PO: {selectedBill.poNumber} &bull; GRN: {selectedBill.grnNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Taxable Amount:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedBill.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>GST ITC Eligible (18%):</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>+₹{selectedBill.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Invoiced Payable:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A' }}>₹{selectedBill.totalBillAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>Current Outstanding Balance:</span>
                <span style={{ fontWeight: 800, color: selectedBill.outstandingBalance > 0 ? '#EF4444' : '#10B981', fontSize: 16 }}>
                  ₹{selectedBill.outstandingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue">Bill Date: {selectedBill.billDate}</Tag>
              <Tag color="red">Due Date: {selectedBill.dueDate}</Tag>
              <Tag color="purple">Branch: {selectedBill.branch}</Tag>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
