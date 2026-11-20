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
  Dropdown,
  MenuProps,
  Tabs,
  Badge,
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
  IndianRupee,
  RotateCcw,
  MoreVertical,
  Edit,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Hash,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { CustomerInvoice } from './billingData';
import { INITIAL_INVOICES } from './billingMockData';

// Premium Purple Enterprise Color Palette
const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#E9D5FF';
const TEXT_DARK = '#0F172A';

export const AllInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(() => {
    const raw = localStorage.getItem('erp_invoices_list_v2');
    return raw ? JSON.parse(raw) : INITIAL_INVOICES;
  });

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Active Tab for Sections: All Invoices | Credit & Debit Notes | Reports
  const [activeTab, setActiveTab] = useState<'invoices' | 'notes' | 'reports'>('invoices');

  // Drawer & Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<CustomerInvoice | null>(null);
  const [paymentForm] = Form.useForm();

  // Credit / Debit Notes state
  const [notes, setNotes] = useState([
    {
      id: 'CN-001',
      noteNumber: 'CN-2026-012',
      type: 'Credit Note',
      originalInvoiceNumber: 'INV-2026-0081',
      customerName: 'Apex Precision Tools Ltd',
      amount: 15000,
      reason: 'Defective Sensor Return during delivery inspection',
      issueDate: '2026-11-19',
      status: 'Applied to Balance',
    },
    {
      id: 'DN-001',
      noteNumber: 'DN-2026-004',
      type: 'Debit Note',
      originalInvoiceNumber: 'INV-2026-0082',
      customerName: 'Omni Infra Ventures Ltd',
      amount: 4500,
      reason: 'Freight & Express Crane Unloading Charge Adjustment',
      issueDate: '2026-11-18',
      status: 'Pending Collection',
    },
  ]);

  // Dynamic Calculation of exactly 7 required KPI cards from actual records
  const kpis = useMemo(() => {
    // 1. Total Invoices
    const totalCount = invoices.length;
    const totalValue = invoices.reduce((acc, i) => acc + i.grandTotal, 0);

    // 2. Draft Invoices
    const draftInvoices = invoices.filter((i) => i.status === 'Draft');
    const draftCount = draftInvoices.length;

    // 3. Sent Invoices
    const sentInvoices = invoices.filter((i) => i.status === 'Sent');
    const sentCount = sentInvoices.length;

    // 4. Paid Invoices (Fully settled invoices only)
    const paidInvoices = invoices.filter((i) => i.paymentStatus === 'Paid');
    const paidCount = paidInvoices.length;
    const paidValue = paidInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
    const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);

    // 5. Partially Paid Invoices
    const partialInvoices = invoices.filter((i) => i.paymentStatus === 'Partially Paid');
    const partialCount = partialInvoices.length;
    const partialAmount = partialInvoices.reduce((acc, i) => acc + i.paidAmount, 0);

    // 6. Overdue Invoices
    const overdueInvoices = invoices.filter((i) => i.paymentStatus === 'Overdue');
    const overdueCount = overdueInvoices.length;
    const overdueAmount = overdueInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

    // 7. Outstanding Amount (sum of all unpaid balances)
    const outstandingAmount = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

    return {
      totalCount,
      totalValue,
      draftCount,
      sentCount,
      paidCount,
      paidValue,
      totalCollected,
      partialCount,
      partialAmount,
      overdueCount,
      overdueAmount,
      outstandingAmount,
    };
  }, [invoices]);

  // Unique filter sets
  const uniqueBranches = useMemo(() => Array.from(new Set(invoices.map((i) => i.branch).filter(Boolean))), [invoices]);
  const uniqueCustomers = useMemo(() => Array.from(new Set(invoices.map((i) => i.customerName))), [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.salesOrderRef && inv.salesOrderRef.toLowerCase().includes(q));

      const matchType = typeFilter === 'ALL' || inv.invoiceType === typeFilter;
      const matchPayment = paymentFilter === 'ALL' || inv.paymentStatus === paymentFilter;
      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchBranch = branchFilter === 'ALL' || inv.branch === branchFilter;
      const matchCustomer = customerFilter === 'ALL' || inv.customerName === customerFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const invDate = dayjs(inv.invoiceDate);
        matchDate =
          (invDate.isAfter(dateRange[0], 'day') || invDate.isSame(dateRange[0], 'day')) &&
          (invDate.isBefore(dateRange[1], 'day') || invDate.isSame(dateRange[1], 'day'));
      }

      return matchSearch && matchType && matchPayment && matchStatus && matchBranch && matchCustomer && matchDate;
    });
  }, [invoices, searchTerm, typeFilter, paymentFilter, statusFilter, branchFilter, customerFilter, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setPaymentFilter('ALL');
    setStatusFilter('ALL');
    setBranchFilter('ALL');
    setCustomerFilter('ALL');
    setDateRange(null);
  };

  // Actions
  const handleRecordPayment = (invoice: CustomerInvoice) => {
    setPaymentInvoice(invoice);
    paymentForm.setFieldsValue({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      balanceDue: invoice.balanceDue,
      amountToPay: invoice.balanceDue,
      paymentMethod: 'NEFT / RTGS Transfer',
      paymentDate: dayjs(),
      referenceNo: `CMS-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Payment received against tax invoice.',
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
    const newBalanceDue = Math.max(0, paymentInvoice.grandTotal - newPaidAmount);
    const newPaymentStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';
    const newStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';

    const updated = invoices.map((inv) =>
      inv.id === paymentInvoice.id
        ? {
            ...inv,
            paidAmount: newPaidAmount,
            balanceDue: newBalanceDue,
            paymentStatus: newPaymentStatus as any,
            status: newStatus as any,
          }
        : inv
    );

    setInvoices(updated);
    localStorage.setItem('erp_invoices_list_v2', JSON.stringify(updated));
    message.success(`Payment of ₹${payAmt.toLocaleString('en-IN')} recorded successfully for ${paymentInvoice.invoiceNumber}`);
    setIsPaymentModalOpen(false);
    if (selectedInvoice && selectedInvoice.id === paymentInvoice.id) {
      setSelectedInvoice(updated.find((i) => i.id === selectedInvoice.id) || null);
    }
  };

  // Status Badges (Clean Minimalist SaaS Dot Style)
  const getPaymentStatusTag = (st: string) => {
    switch (st) {
      case 'Paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Partially Paid
          </span>
        );
      case 'Unpaid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Unpaid
          </span>
        );
      case 'Overdue':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#FFF1F2', color: '#BE123C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDA4AF' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E11D48' }} /> Overdue
          </span>
        );
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const getInvoiceStatusTag = (st: string) => {
    switch (st) {
      case 'Draft':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#F8FAFC', color: '#475569', fontSize: 11.5, fontWeight: 600, border: '1px solid #E2E8F0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8' }} /> Draft
          </span>
        );
      case 'Sent':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#EFF6FF', color: '#1D4ED8', fontSize: 11.5, fontWeight: 600, border: '1px solid #BFDBFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Sent to Client
          </span>
        );
      case 'Approved':
      case 'Paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D', fontSize: 11.5, fontWeight: 600, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Approved
          </span>
        );
      case 'Cancelled':
      case 'Void':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 600, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Cancelled
          </span>
        );
      default:
        return <Tag>{st}</Tag>;
    }
  };

  // Minimalist SaaS Columns matching user guidelines
  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 155,
      render: (val: string, record: CustomerInvoice) => (
        <div>
          <span
            onClick={() => {
              setSelectedInvoice(record);
              setIsDetailDrawerOpen(true);
            }}
            style={{
              fontWeight: 800,
              color: ROYAL_PURPLE,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-block',
              letterSpacing: '-0.01em',
            }}
          >
            {val}
          </span>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Issued {record.invoiceDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Customer & Contact',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: CustomerInvoice) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span>{record.contactPerson || record.customerCode}</span>
            <span style={{ color: '#CBD5E1' }}>&bull;</span>
            <span style={{ color: '#64748B' }}>{record.customerPhone || record.customerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'salesOrderRef',
      key: 'salesOrderRef',
      width: 140,
      render: (ref: string, record: CustomerInvoice) => (
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
            {ref || record.serviceOrderRef || 'Direct Sale'}
          </span>
          <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{record.invoiceType}</div>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (d: string, record: CustomerInvoice) => (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: record.paymentStatus === 'Overdue' ? '#DC2626' : '#334155',
            }}
          >
            {d}
          </div>
          <div style={{ fontSize: 10.5, color: record.paymentStatus === 'Overdue' ? '#EF4444' : '#16A34A' }}>
            {record.paymentStatus === 'Overdue' ? 'Past Due' : 'Active'}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount (INR)',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 145,
      align: 'right' as const,
      render: (amt: number, record: CustomerInvoice) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
            {record.balanceDue > 0 ? (
              <span style={{ color: '#DC2626', fontWeight: 600 }}>Due: ₹{Number(record.balanceDue).toLocaleString('en-IN')}</span>
            ) : (
              'Incl. GST'
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 140,
      align: 'center' as const,
      render: (st: string) => getPaymentStatusTag(st),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, record: CustomerInvoice) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Invoice Details',
            icon: <Eye size={13} />,
            onClick: () => {
              setSelectedInvoice(record);
              setIsDetailDrawerOpen(true);
            },
          },
          {
            key: 'payment',
            label: 'Record Payment',
            icon: <CreditCard size={13} />,
            disabled: record.balanceDue === 0,
            onClick: () => handleRecordPayment(record),
          },
          {
            key: 'send',
            label: 'Send Invoice to Client',
            icon: <Send size={13} />,
            onClick: () => message.success(`Invoice ${record.invoiceNumber} emailed to ${record.customerEmail}`),
          },
          {
            key: 'pdf',
            label: 'Download PDF',
            icon: <Download size={13} />,
            onClick: () => message.info(`Downloading PDF for ${record.invoiceNumber}...`),
          },
          {
            key: 'print',
            label: 'Print Invoice',
            icon: <Printer size={13} />,
            onClick: () => window.print(),
          },
          { type: 'divider' },
          {
            key: 'cancel',
            label: 'Cancel Invoice',
            icon: <XCircle size={13} />,
            danger: true,
            disabled: record.status === 'Cancelled' || record.paidAmount > 0,
            onClick: () => {
              Modal.confirm({
                title: 'Confirm Invoice Cancellation',
                content: `Are you sure you want to cancel ${record.invoiceNumber}? This action cannot be reversed.`,
                okText: 'Yes, Cancel Invoice',
                okType: 'danger',
                onOk: () => {
                  setInvoices((prev) =>
                    prev.map((i) => (i.id === record.id ? { ...i, status: 'Cancelled' as any } : i))
                  );
                  message.warning(`Invoice ${record.invoiceNumber} has been Cancelled.`);
                },
              });
            },
          },
        ];

        return (
          <Space size={4} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => {
                setSelectedInvoice(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{
                borderRadius: 6,
                borderColor: '#E2E8F0',
                color: '#334155',
                fontSize: 11.5,
                fontWeight: 600,
                height: 28,
                padding: '0 8px',
              }}
            >
              View
            </Button>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <Button
                size="small"
                type="text"
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: '#64748B',
                }}
              >
                <MoreVertical size={14} />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. TOP HEADER BANNER (Single Row Layout matching user guidelines) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '12px 20px',
          backgroundColor: PURPLE_LIGHT_BG,
          borderRadius: 16,
          border: `1px solid ${PURPLE_BORDER}`,
          flexWrap: 'nowrap',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: '#EDE7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ROYAL_PURPLE,
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
              flexShrink: 0,
            }}
          >
            <FileSpreadsheet size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              All Invoices & Billing Management
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage customer invoices, sales billing, service invoices, GST tax invoices, and payment collections.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting All Invoices registry to Excel...')}
            style={{
              borderRadius: 10,
              height: 38,
              fontWeight: 600,
              borderColor: '#CBD5E1',
              color: '#334155',
              padding: '0 14px',
              whiteSpace: 'nowrap',
            }}
          >
            Export Invoices
          </Button>

          <Button
            type="primary"
            onClick={() => navigate('/app/finance/create-invoice')}
            icon={<Plus size={15} />}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 16px',
              whiteSpace: 'nowrap',
            }}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* 2. FOUR ESSENTIAL HERO CARDS (Each with its own distinct vibrant gradient theme matching Delivery & Quotations ERP style) */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Total Invoices (Deep Royal Purple Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => clearFilters()}
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(68, 26, 135, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(68, 26, 135, 0.28)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <FileText size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Total Invoices
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpis.totalCount}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4ADE80', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  ₹{(kpis.totalValue / 100000).toFixed(2)}L Value
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
          </div>
        </Col>

        {/* Card 2: Active / Sent Invoices (Clean Ice-Blue Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => {
              clearFilters();
              setStatusFilter('Sent');
            }}
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(2, 132, 199, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(2, 132, 199, 0.28)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <Send size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#BAE6FD', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Awaiting Payment
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpis.sentCount + kpis.draftCount}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0F2FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {kpis.sentCount} Sent &bull; {kpis.draftCount} Drafts
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#BAE6FD',
                flexShrink: 0,
              }}
            >
              <Clock size={20} />
            </div>
          </div>
        </Col>

        {/* Card 3: Payments Collected (Vibrant Emerald Green Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => {
              clearFilters();
              setPaymentFilter('Paid');
            }}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(5, 150, 105, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.28)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <IndianRupee size={24} strokeWidth={2.6} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Payments Collected
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  ₹{(kpis.totalCollected / 100000).toFixed(2)}L
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1FAE5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {kpis.paidCount} Fully Paid &bull; {kpis.partialCount} Partial
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A7F3D0',
                flexShrink: 0,
              }}
            >
              <CheckCircle size={20} />
            </div>
          </div>
        </Col>

        {/* Card 4: Outstanding & Overdue (High-Notice Crimson Red Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => {
              clearFilters();
              setPaymentFilter('Overdue');
            }}
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(220, 38, 38, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.28)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FECDD3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Outstanding Balance
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  ₹{(kpis.outstandingAmount / 100000).toFixed(2)}L
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FEE2E2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {kpis.overdueCount} Overdue (₹{(kpis.overdueAmount / 100000).toFixed(2)}L)
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FECDD3',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={20} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Navigation Sub-Tabs: All Invoices | Credit & Debit Notes | Billing Reports */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
        <Button
          type={activeTab === 'invoices' ? 'primary' : 'text'}
          onClick={() => setActiveTab('invoices')}
          style={{
            backgroundColor: activeTab === 'invoices' ? ROYAL_PURPLE : 'transparent',
            borderColor: activeTab === 'invoices' ? ROYAL_PURPLE : 'transparent',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          All Invoices ({invoices.length})
        </Button>
        <Button
          type={activeTab === 'notes' ? 'primary' : 'text'}
          onClick={() => setActiveTab('notes')}
          style={{
            backgroundColor: activeTab === 'notes' ? ROYAL_PURPLE : 'transparent',
            borderColor: activeTab === 'notes' ? ROYAL_PURPLE : 'transparent',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
            color: activeTab === 'notes' ? '#FFFFFF' : '#64748B',
          }}
        >
          Credit & Debit Notes ({notes.length})
        </Button>
        <Button
          type={activeTab === 'reports' ? 'primary' : 'text'}
          onClick={() => setActiveTab('reports')}
          style={{
            backgroundColor: activeTab === 'reports' ? ROYAL_PURPLE : 'transparent',
            borderColor: activeTab === 'reports' ? ROYAL_PURPLE : 'transparent',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
            color: activeTab === 'reports' ? '#FFFFFF' : '#64748B',
          }}
        >
          Billing & GST Reports
        </Button>
      </div>

      {activeTab === 'invoices' && (
        /* 3. CLEAN MINIMALIST SAAS DATA TABLE WITH INTEGRATED TOOLBAR */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Sleek Minimalist Toolbar */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              backgroundColor: '#FAFAFA',
            }}
          >
            {/* Left: Title & Count Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                All Invoices
              </span>
              <span
                style={{
                  backgroundColor: '#EDE7F6',
                  color: ROYAL_PURPLE,
                  padding: '1px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {filteredInvoices.length}
              </span>
            </div>

            {/* Right: Clean Filters in Single Row */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Input
                prefix={<Search size={14} color="#94A3B8" />}
                placeholder="Filter by customer, inv #, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 220, borderRadius: 8, height: 34, fontSize: 12 }}
                allowClear
              />
              <Select
                size="small"
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 130, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Types' },
                  { value: 'Sales Invoice', label: 'Sales Invoice' },
                  { value: 'Service Invoice', label: 'Service Invoice' },
                  { value: 'Tax Invoice', label: 'Tax Invoice' },
                  { value: 'Proforma Invoice', label: 'Proforma Invoice' },
                ]}
              />
              <Select
                size="small"
                value={paymentFilter}
                onChange={setPaymentFilter}
                style={{ width: 135, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Payments' },
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Partially Paid', label: 'Partially Paid' },
                  { value: 'Unpaid', label: 'Unpaid' },
                  { value: 'Overdue', label: 'Overdue' },
                ]}
              />
              <Select
                size="small"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Sent', label: 'Sent' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
              />
              <Select
                size="small"
                value={branchFilter}
                onChange={setBranchFilter}
                style={{ width: 130, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Branches' },
                  ...uniqueBranches.map((b) => ({ value: b, label: b })),
                ]}
              />
              <Button
                size="small"
                icon={<Download size={13} />}
                onClick={() => message.success('Exporting invoices to CSV...')}
                style={{ borderRadius: 8, height: 34, fontWeight: 600, fontSize: 12, borderColor: '#CBD5E1' }}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Minimalist SaaS Table */}
          <Table
            columns={columns}
            dataSource={filteredInvoices}
            rowKey="id"
            pagination={{
              pageSize: 8,
              showTotal: (total, range) => (
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Showing {range[0]}-{range[1]} of {total} customer invoices
                </span>
              ),
            }}
            size="middle"
          />
        </div>
      )}

      {/* PART 5: CREDIT & DEBIT NOTES VIEW */}
      {activeTab === 'notes' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFAFA',
            }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                Credit & Debit Notes Adjustments
              </span>
              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                Manage invoice corrections, customer returns, price discrepancies, and debit adjustments
              </div>
            </div>
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<Plus size={13} />}
                style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, borderRadius: 6 }}
                onClick={() => message.info('Open new Credit Note modal')}
              >
                Issue Credit Note
              </Button>
              <Button
                size="small"
                icon={<Plus size={13} />}
                style={{ borderRadius: 6, borderColor: '#CBD5E1' }}
                onClick={() => message.info('Open new Debit Note modal')}
              >
                Issue Debit Note
              </Button>
            </Space>
          </div>

          <Table
            dataSource={notes}
            rowKey="id"
            pagination={false}
            size="middle"
            columns={[
              {
                title: 'Note Number',
                dataIndex: 'noteNumber',
                key: 'noteNumber',
                render: (v: string, r: any) => (
                  <div>
                    <span style={{ fontWeight: 800, color: ROYAL_PURPLE, fontSize: 13 }}>{v}</span>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Ref: {r.originalInvoiceNumber}</div>
                  </div>
                ),
              },
              {
                title: 'Note Type',
                dataIndex: 'type',
                key: 'type',
                render: (v: string) => (
                  <Tag color={v === 'Credit Note' ? 'purple' : 'orange'}>{v}</Tag>
                ),
              },
              {
                title: 'Customer Name',
                dataIndex: 'customerName',
                key: 'customerName',
                render: (v: string) => <span style={{ fontWeight: 600, color: '#1E293B' }}>{v}</span>,
              },
              {
                title: 'Adjustment Amount',
                dataIndex: 'amount',
                key: 'amount',
                align: 'right',
                render: (v: number) => (
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>
                    ₹{v.toLocaleString('en-IN')}
                  </span>
                ),
              },
              {
                title: 'Reason for Adjustment',
                dataIndex: 'reason',
                key: 'reason',
                render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
              },
              {
                title: 'Issue Date',
                dataIndex: 'issueDate',
                key: 'issueDate',
                render: (v: string) => <span style={{ fontSize: 12, color: '#64748B' }}>{v}</span>,
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (v: string) => (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> {v}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* PART 6: INVOICE & GST REPORTS VIEW */}
      {activeTab === 'reports' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: TEXT_DARK, fontSize: 16 }}>
              Essential Billing & GST Reports
            </h3>
            <p style={{ margin: 0, color: '#64748B', fontSize: 12.5 }}>
              Export compliant financial and statutory billing reports in Excel and PDF formats
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {[
              { title: 'Invoice Summary Report', desc: 'Aggregated view of all sales & tax invoices by period', icon: <FileSpreadsheet size={20} /> },
              { title: 'Customer-Wise Billing Report', desc: 'Breakdown of billings, receipts and balances by client', icon: <Building size={20} /> },
              { title: 'Monthly Sales Billing Report', desc: 'Monthly turnover analysis and revenue recognition', icon: <Calendar size={20} /> },
              { title: 'GST Summary Report (GSTR-1)', desc: 'HSN-wise taxable values, CGST, SGST, IGST totals', icon: <ShieldCheck size={20} /> },
              { title: 'Outstanding Receivables Report', desc: 'Aging report of unpaid customer balances (30/60/90 days)', icon: <IndianRupee size={20} /> },
              { title: 'Overdue Invoice Escalation', desc: 'High-priority overdue accounts requiring collections', icon: <AlertCircle size={20} /> },
            ].map((rep, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <div
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: 16,
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EDE7F6', color: ROYAL_PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {rep.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: TEXT_DARK }}>{rep.title}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{rep.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                    <Button size="small" onClick={() => message.info(`Generating PDF for ${rep.title}`)}>
                      PDF
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}
                      onClick={() => message.success(`Exporting ${rep.title} to Excel...`)}
                    >
                      Export Excel
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* PART 3: INVOICE DETAILS RIGHT DRAWER (7 Comprehensive Sections) */}
      <Drawer
        title={
          selectedInvoice ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#EDE7F6', color: ROYAL_PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: TEXT_DARK }}>{selectedInvoice.invoiceNumber}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    Type: <b style={{ color: ROYAL_PURPLE }}>{selectedInvoice.invoiceType}</b>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {getPaymentStatusTag(selectedInvoice.paymentStatus)}
                {getInvoiceStatusTag(selectedInvoice.status)}
              </div>
            </div>
          ) : (
            'Invoice Details'
          )
        }
        placement="right"
        width={740}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        styles={{ body: { padding: '20px 24px', background: '#F8FAFC' } }}
        footer={
          selectedInvoice && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Button onClick={() => setIsDetailDrawerOpen(false)}>Close</Button>
              <Space>
                <Button
                  icon={<Printer size={14} />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
                <Button
                  icon={<Download size={14} />}
                  onClick={() => message.success(`Downloading PDF for ${selectedInvoice.invoiceNumber}...`)}
                >
                  Download PDF
                </Button>
                {selectedInvoice.balanceDue > 0 && (
                  <Button
                    type="primary"
                    icon={<CreditCard size={14} />}
                    style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      handleRecordPayment(selectedInvoice);
                    }}
                  >
                    Record Payment
                  </Button>
                )}
              </Space>
            </div>
          )
        }
      >
        {selectedInvoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 1. Customer & Supplier Information */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building size={15} />
                <span>Customer & Billing Details</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12.5 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Customer Legal Name</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedInvoice.customerName}</span>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>GSTIN: {selectedInvoice.gstin}</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Contact Information</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.contactPerson}</span>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{selectedInvoice.customerPhone} &bull; {selectedInvoice.customerEmail}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, fontSize: 11.5, color: '#334155' }}>
                <b>Billing Address:</b> {selectedInvoice.billingAddress}
              </div>
            </div>

            {/* 2. Invoice Schedule & References */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} />
                <span>Invoice Schedule & References</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Invoice Date</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.invoiceDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Payment Due Date</span>
                  <span style={{ fontWeight: 700, color: selectedInvoice.paymentStatus === 'Overdue' ? '#DC2626' : '#0284C7' }}>
                    {selectedInvoice.dueDate}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Sales Order Ref</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.salesOrderRef || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Billing Depot / Hub</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.branch}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Payment Terms</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.paymentTerms}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Assigned Salesperson</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.salesperson}</span>
                </div>
              </div>
            </div>

            {/* 3. Product & Service Line Items */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={15} />
                <span>Line Items Specification</span>
              </div>
              <Table
                dataSource={selectedInvoice.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Item / Description',
                    key: 'name',
                    render: (_: any, it: any) => (
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{it.name}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>HSN: {it.hsnSac} &bull; SKU: {it.sku}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Qty',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center',
                    width: 70,
                    render: (q: number, it: any) => `${q} ${it.unit}`,
                  },
                  {
                    title: 'Rate',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    align: 'right',
                    width: 90,
                    render: (p: number) => `₹${p.toLocaleString('en-IN')}`,
                  },
                  {
                    title: 'GST',
                    dataIndex: 'taxRate',
                    key: 'taxRate',
                    align: 'center',
                    width: 60,
                    render: (t: number) => `${t}%`,
                  },
                  {
                    title: 'Total',
                    dataIndex: 'lineTotal',
                    key: 'lineTotal',
                    align: 'right',
                    width: 100,
                    render: (tot: number) => (
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        ₹{tot.toLocaleString('en-IN')}
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            {/* 4. Tax Summary & Grand Total Calculation */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} />
                <span>Tax Breakdown & Pricing Summary</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Gross Item Subtotal:</span>
                  <span>₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                  <span>Total Discount:</span>
                  <span>- ₹{selectedInvoice.itemDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#0F172A' }}>
                  <span>Taxable Amount:</span>
                  <span>₹{selectedInvoice.taxableAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>CGST (9%):</span>
                  <span>₹{selectedInvoice.cgst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>SGST (9%):</span>
                  <span>₹{selectedInvoice.sgst.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoice.shippingCharges > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>Shipping & Freight:</span>
                    <span>₹{selectedInvoice.shippingCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: ROYAL_PURPLE }}>
                  <span>Grand Total:</span>
                  <span>₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                  <span>Total Amount Paid:</span>
                  <span>₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: selectedInvoice.balanceDue > 0 ? '#DC2626' : '#64748B', fontWeight: 700 }}>
                  <span>Outstanding Balance Due:</span>
                  <span>₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* PART 4: PAYMENT TRACKING MODAL */}
      <Modal
        open={isPaymentModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontWeight: 800 }}>
            <CreditCard size={18} />
            <span>Record Payment — {paymentInvoice?.invoiceNumber}</span>
          </div>
        }
        onCancel={() => setIsPaymentModalOpen(false)}
        onOk={() => paymentForm.submit()}
        okText="Record Payment Receipt"
        cancelText="Cancel"
        width={560}
      >
        <Form form={paymentForm} layout="vertical" onFinish={submitRecordPayment}>
          <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#64748B' }}>Client Account:</span>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>{paymentInvoice?.customerName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
              <span style={{ color: '#64748B' }}>Outstanding Balance:</span>
              <span style={{ fontWeight: 800, color: '#DC2626' }}>
                ₹{paymentInvoice?.balanceDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="amountToPay" label="Receipt Amount (₹)" rules={[{ required: true }]}>
              <Input type="number" min={1} style={{ height: 38, borderRadius: 8 }} />
            </Form.Item>

            <Form.Item name="paymentMethod" label="Payment Method" initialValue="NEFT / RTGS Transfer">
              <Select style={{ height: 38 }}>
                <Select.Option value="NEFT / RTGS Transfer">NEFT / RTGS Transfer</Select.Option>
                <Select.Option value="UPI / Online QR">UPI / Online QR</Select.Option>
                <Select.Option value="Cheque / DD Deposit">Cheque / DD Deposit</Select.Option>
                <Select.Option value="Cash Receipt">Cash Receipt</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="paymentDate" label="Payment Receipt Date">
              <DatePicker style={{ width: '100%', height: 38, borderRadius: 8 }} />
            </Form.Item>

            <Form.Item name="referenceNo" label="Bank UTR / Reference No">
              <Input placeholder="e.g. UTR-ICICI-992103" style={{ height: 38, borderRadius: 8 }} />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Payment Remarks / Notes">
            <Input.TextArea rows={2} placeholder="Optional notes on clearance or deduction..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllInvoicesPage;
