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
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  Divider,
  message,
  Space,
  Tooltip,
} from 'antd';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Printer,
  CreditCard,
  ChevronRight,
  Send,
  XCircle,
  FileCheck,
  Building,
  User,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { CustomerInvoice } from './billingData';
import { INITIAL_INVOICES } from './billingMockData';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const AllInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(INITIAL_INVOICES);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Drawer / Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<CustomerInvoice | null>(null);
  const [paymentForm] = Form.useForm();

  // Summary Card Metrics
  const metrics = useMemo(() => {
    const totalCount = invoices.length;
    const totalAmount = invoices.reduce((acc, i) => acc + i.grandTotal, 0);

    const paidInvoices = invoices.filter((i) => i.paymentStatus === 'Paid');
    const paidCount = paidInvoices.length;
    const paidAmount = invoices.reduce((acc, i) => acc + i.paidAmount, 0);

    const unpaidInvoices = invoices.filter((i) => i.paymentStatus === 'Unpaid');
    const unpaidCount = unpaidInvoices.length;
    const unpaidAmount = unpaidInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

    const overdueInvoices = invoices.filter((i) => i.paymentStatus === 'Overdue');
    const overdueCount = overdueInvoices.length;
    const overdueAmount = overdueInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

    return {
      totalCount,
      totalAmount,
      paidCount,
      paidAmount,
      unpaidCount,
      unpaidAmount,
      overdueCount,
      overdueAmount,
    };
  }, [invoices]);

  // Filtered List
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.salesOrderRef && inv.salesOrderRef.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchType = typeFilter === 'ALL' || inv.invoiceType === typeFilter;
      const matchPayment = paymentFilter === 'ALL' || inv.paymentStatus === paymentFilter;

      return matchSearch && matchStatus && matchType && matchPayment;
    });
  }, [invoices, searchTerm, statusFilter, typeFilter, paymentFilter]);

  // Actions
  const handleRecordPayment = (invoice: CustomerInvoice) => {
    setPaymentInvoice(invoice);
    paymentForm.setFieldsValue({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      balanceDue: invoice.balanceDue,
      amountToPay: invoice.balanceDue,
      paymentMethod: 'Bank Transfer',
      paymentDate: dayjs(),
      referenceNo: '',
      notes: '',
    });
    setIsPaymentModalOpen(true);
  };

  const submitRecordPayment = (values: any) => {
    if (!paymentInvoice) return;
    const payAmt = Number(values.amountToPay);
    if (payAmt <= 0 || payAmt > paymentInvoice.balanceDue) {
      message.error('Payment amount must be greater than 0 and less than or equal to balance due.');
      return;
    }

    const newPaidAmount = paymentInvoice.paidAmount + payAmt;
    const newBalanceDue = paymentInvoice.grandTotal - newPaidAmount;
    const newPaymentStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';
    const newStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === paymentInvoice.id
          ? {
              ...inv,
              paidAmount: newPaidAmount,
              balanceDue: newBalanceDue,
              paymentStatus: newPaymentStatus,
              status: newStatus,
            }
          : inv
      )
    );

    message.success(`Payment of ₹${payAmt.toLocaleString('en-IN')} recorded successfully for ${paymentInvoice.invoiceNumber}`);
    setIsPaymentModalOpen(false);
  };

  // Columns
  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val: string, record: CustomerInvoice) => (
        <div>
          <a
            onClick={() => {
              setSelectedInvoice(record);
              setIsDetailDrawerOpen(true);
            }}
            style={{ fontWeight: 700, color: BRAND_PURPLE }}
          >
            {val}
          </a>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.invoiceType}</div>
        </div>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: CustomerInvoice) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.customerCode} • {record.branch}</div>
        </div>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'salesOrderRef',
      key: 'salesOrderRef',
      render: (ref: string, record: CustomerInvoice) => (
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
          {ref || record.serviceOrderRef || '-'}
        </span>
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
      render: (d: string, record: CustomerInvoice) => (
        <span
          style={{
            fontSize: 12,
            fontWeight: record.paymentStatus === 'Overdue' ? 700 : 500,
            color: record.paymentStatus === 'Overdue' ? '#DC2626' : '#334155',
          }}
        >
          {d}
        </span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#0F172A' }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 700, color: '#16A34A' }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Balance Due',
      dataIndex: 'balanceDue',
      key: 'balanceDue',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: amt > 0 ? '#DC2626' : '#64748B' }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (st: string) => {
        let color = '#E2E8F0';
        let textColor = '#475569';
        if (st === 'Paid') {
          color = '#DCFCE7';
          textColor = '#166534';
        } else if (st === 'Partially Paid') {
          color = '#FEF3C7';
          textColor = '#92400E';
        } else if (st === 'Overdue') {
          color = '#FEE2E2';
          textColor = '#991B1B';
        } else {
          color = '#F1F5F9';
          textColor = '#475569';
        }
        return (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              backgroundColor: color,
              color: textColor,
              fontWeight: 700,
              fontSize: 11,
              display: 'inline-block',
            }}
          >
            {st}
          </span>
        );
      },
    },
    {
      title: 'Invoice Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        let tagColor = 'blue';
        if (st === 'Paid' || st === 'Approved') tagColor = 'green';
        if (st === 'Cancelled') tagColor = 'red';
        if (st === 'Overdue') tagColor = 'volcano';
        return (
          <Tag color={tagColor} style={{ borderRadius: 10, fontWeight: 700, fontSize: 11 }}>
            {st}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CustomerInvoice) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<Eye size={15} color={BRAND_PURPLE} />}
              onClick={() => {
                setSelectedInvoice(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{ backgroundColor: '#F3E8FF', borderRadius: 6 }}
            />
          </Tooltip>
          {record.balanceDue > 0 && (
            <Tooltip title="Record Payment">
              <Button
                type="text"
                size="small"
                icon={<CreditCard size={15} color="#16A34A" />}
                onClick={() => handleRecordPayment(record)}
                style={{ backgroundColor: '#DCFCE7', borderRadius: 6 }}
              />
            </Tooltip>
          )}
          <Tooltip title="Download PDF">
            <Button
              type="text"
              size="small"
              icon={<Download size={15} color="#2563EB" />}
              onClick={() => message.success(`Downloading PDF for ${record.invoiceNumber}`)}
              style={{ backgroundColor: '#DBEAFE', borderRadius: 6 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* 1. Page Header */}
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
            <span>Invoice & Billing</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>All Invoices</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Customer Invoices & Billing Management
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Monitor and record all sales orders, services, progress billing, and tax invoices
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            type="primary"
            onClick={() => navigate('/app/finance/create-invoice')}
            style={{
              backgroundColor: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 12,
              fontWeight: 700,
              height: 38,
              boxShadow: '0 4px 14px rgba(84, 33, 168, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={16} /> Create Invoice
          </Button>
        </div>
      </div>

      {/* 2. Exactly 4 Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Invoices */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
                }}
              >
                <FileText size={22} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: 8 }}>
                All Records
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
              Total Invoices
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
              {metrics.totalCount} Invoices
            </div>
            <div style={{ fontSize: 12, color: '#5421A8', fontWeight: 700, marginTop: 4 }}>
              ₹{(metrics.totalAmount / 100000).toFixed(2)} Lakhs Total
            </div>
          </div>
        </Col>

        {/* Card 2: Paid Invoices */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                <CheckCircle2 size={22} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 8 }}>
                Settled
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
              Paid Invoices
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
              {metrics.paidCount} Paid
            </div>
            <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 700, marginTop: 4 }}>
              ₹{(metrics.paidAmount / 100000).toFixed(2)} Lakhs Collected
            </div>
          </div>
        </Col>

        {/* Card 3: Unpaid Invoices */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                }}
              >
                <Clock size={22} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 8 }}>
                Active Terms
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
              Unpaid Invoices
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>
              {metrics.unpaidCount} Pending
            </div>
            <div style={{ fontSize: 12, color: '#D97706', fontWeight: 700, marginTop: 4 }}>
              ₹{(metrics.unpaidAmount / 100000).toFixed(2)} Lakhs Outstanding
            </div>
          </div>
        </Col>

        {/* Card 4: Overdue Invoices */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                }}
              >
                <AlertCircle size={22} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: 8 }}>
                Requires Follow-up
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
              Overdue Invoices
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626', lineHeight: 1.2 }}>
              {metrics.overdueCount} Overdue
            </div>
            <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 700, marginTop: 4 }}>
              ₹{(metrics.overdueAmount / 100000).toFixed(2)} Lakhs Past Due
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Filters & Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '22px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              prefix={<Search size={15} color="#94A3B8" />}
              placeholder="Search invoice number, customer, order ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 280, borderRadius: 10 }}
              allowClear
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
              options={[
                { value: 'ALL', label: 'All Types' },
                { value: 'Sales Invoice', label: 'Sales Invoice' },
                { value: 'Service Invoice', label: 'Service Invoice' },
                { value: 'Tax Invoice', label: 'Tax Invoice' },
              ]}
            />
            <Select
              value={paymentFilter}
              onChange={setPaymentFilter}
              style={{ width: 150 }}
              options={[
                { value: 'ALL', label: 'All Payments' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Partially Paid', label: 'Partially Paid' },
                { value: 'Unpaid', label: 'Unpaid' },
                { value: 'Overdue', label: 'Overdue' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              icon={<Printer size={15} />}
              onClick={() => message.info('Printing batch report...')}
              style={{ borderRadius: 10 }}
            >
              Print Batch
            </Button>
            <Button
              icon={<Download size={15} />}
              onClick={() => message.success('Exported invoices to Excel!')}
              style={{ borderRadius: 10 }}
            >
              Export
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} invoices` }}
          size="middle"
        />
      </div>

      {/* 4. Invoice Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color={BRAND_PURPLE} />
            <span>Invoice Details — {selectedInvoice?.invoiceNumber}</span>
          </div>
        }
        width={680}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        extra={
          <Space>
            <Button
              icon={<Download size={14} />}
              onClick={() => message.success(`Downloading PDF for ${selectedInvoice?.invoiceNumber}`)}
            >
              Download PDF
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
              onClick={() => {
                if (selectedInvoice && selectedInvoice.balanceDue > 0) {
                  setIsDetailDrawerOpen(false);
                  handleRecordPayment(selectedInvoice);
                } else {
                  message.info('Invoice is already fully settled.');
                }
              }}
            >
              Record Payment
            </Button>
          </Space>
        }
      >
        {selectedInvoice && (
          <div>
            {/* Header Status Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Tag color="purple" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 8 }}>
                  {selectedInvoice.invoiceType}
                </Tag>
                <Tag
                  color={selectedInvoice.paymentStatus === 'Paid' ? 'green' : 'gold'}
                  style={{ fontSize: 13, padding: '4px 12px', borderRadius: 8 }}
                >
                  {selectedInvoice.paymentStatus}
                </Tag>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Invoice Date</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{selectedInvoice.invoiceDate}</div>
              </div>
            </div>

            {/* Customer & Branch Information */}
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 14,
                padding: '16px 18px',
                marginBottom: 20,
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                Customer & Billing Details
              </div>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{selectedInvoice.customerName}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>GSTIN: {selectedInvoice.gstin}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>Contact: {selectedInvoice.contactPerson} ({selectedInvoice.customerPhone})</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Billing Address:</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedInvoice.billingAddress}</div>
                </Col>
              </Row>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
                Billed Items & Services
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Item Description</th>
                    <th style={{ padding: '8px 10px' }}>HSN</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Tax</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 10px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '10px 10px', color: '#64748B' }}>{item.hsnSac}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right' }}>₹{item.unitPrice.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right' }}>₹{item.taxAmount.toLocaleString('en-IN')} ({item.taxRate}%)</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700 }}>₹{item.lineTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Totals */}
            <div
              style={{
                background: '#FAF5FF',
                borderRadius: 14,
                padding: '16px 20px',
                border: '1px solid #E9D5FF',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Taxable Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedInvoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>CGST + SGST / IGST:</span>
                <span style={{ fontWeight: 600 }}>₹{(selectedInvoice.cgst + selectedInvoice.sgst + selectedInvoice.igst).toLocaleString('en-IN')}</span>
              </div>
              {selectedInvoice.shippingCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Shipping & Handling:</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedInvoice.shippingCharges.toLocaleString('en-IN')}</span>
                </div>
              )}
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900 }}>
                <span>Grand Total:</span>
                <span style={{ color: BRAND_PURPLE }}>₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13, color: '#16A34A', fontWeight: 700 }}>
                <span>Paid Amount:</span>
                <span>₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 14, color: '#DC2626', fontWeight: 800 }}>
                <span>Balance Due:</span>
                <span>₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Notes */}
            {selectedInvoice.notes && (
              <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                Note: {selectedInvoice.notes}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 5. Record Payment Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} color="#16A34A" />
            <span>Record Customer Payment</span>
          </div>
        }
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
      >
        <Form form={paymentForm} layout="vertical" onFinish={submitRecordPayment}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Invoice Number" name="invoiceNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customer Name" name="customerName">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Balance Due (₹)" name="balanceDue">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Payment Amount (₹)"
                name="amountToPay"
                rules={[{ required: true, message: 'Please enter payment amount' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Payment Method"
                name="paymentMethod"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Bank Transfer', label: 'NEFT / RTGS' },
                    { value: 'UPI / QR', label: 'UPI' },
                    { value: 'Cheque', label: 'Cheque' },
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'Cash', label: 'Cash' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Reference / UTR Number" name="referenceNo">
            <Input placeholder="e.g. UTR-HDFC948194" />
          </Form.Item>

          <Form.Item label="Payment Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Optional payment receipt notes..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Save Payment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AllInvoicesPage;
