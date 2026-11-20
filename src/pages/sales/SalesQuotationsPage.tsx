import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Space,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Divider,
  Dropdown,
  MenuProps,
} from 'antd';
import {
  Plus,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Trash2,
  TrendingUp,
  RefreshCw,
  Download,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowUp,
  X,
  IndianRupee,
  Building2,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import {
  INITIAL_QUOTATIONS,
  DetailedQuotation,
  QuotationItem,
} from '../../mock/salesManagementStore';

const ROYAL_PURPLE = '#441A87';
const CARD_BORDER = '#E2E8F0';
const TEXT_DARK = '#0F172A';

export const SalesQuotationsPage: React.FC = () => {
  const [data, setData] = useState<DetailedQuotation[]>(INITIAL_QUOTATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [executiveFilter, setExecutiveFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('This Month');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<DetailedQuotation | null>(null);
  const [form] = Form.useForm();

  // Metrics
  const totalCount = data.length;
  const totalValue = data.reduce((acc, q) => acc + q.grandTotal, 0);
  const sentCount = data.filter((q) => q.status === 'Sent').length;
  const approvedCount = data.filter((q) => q.status === 'Approved' || q.status === 'Converted to Order').length;
  const winRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : '0';

  const filtered = data.filter((d) => {
    const matchSearch =
      d.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.salesExecutive.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchExecutive = executiveFilter === 'ALL' || d.salesExecutive === executiveFilter;
    return matchSearch && matchStatus && matchExecutive;
  });

  const handleCreateQuotation = (values: any) => {
    const subtotal = Number(values.subtotal) || 100000;
    const discount = Number(values.discountAmount) || 0;
    const tax = Math.round((subtotal - discount) * 0.18);
    const grandTotal = subtotal - discount + tax;

    const newQuote: DetailedQuotation = {
      id: 'qt-' + Date.now(),
      quoteNumber: 'QT-2026-' + (880 + data.length + 1),
      revision: 1,
      customerName: values.customerName,
      customerEmail: values.customerEmail || 'billing@customer.com',
      customerPhone: values.customerPhone || '+91 90000 00000',
      issueDate: values.issueDate || new Date().toISOString().slice(0, 10),
      validUntil: values.validUntil || '2026-12-31',
      salesExecutive: values.salesExecutive || 'Vikram Seth',
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      grandTotal,
      status: 'Draft',
      notes: values.notes || 'Commercial proposal prepared as per client requirements.',
      termsAndConditions: '1. Net 30 days from dispatch date.\n2. Goods delivery within 2 weeks of PO confirmation.\n3. 18% GST applicable.',
      items: [
        {
          id: 'item-' + Date.now(),
          itemName: values.itemName || 'Industrial Automation Component Kit',
          sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
          quantity: Number(values.quantity) || 1,
          unitPrice: subtotal,
          discountPercent: discount > 0 ? Math.round((discount / subtotal) * 100) : 0,
          taxRatePercent: 18,
          totalAmount: grandTotal,
        },
      ],
    };

    setData([newQuote, ...data]);
    message.success(`Quotation ${newQuote.quoteNumber} created as Draft`);
    setModalOpen(false);
    form.resetFields();
  };

  const handleStatusChange = (id: string, newStatus: DetailedQuotation['status']) => {
    setData((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (newStatus === 'Converted to Order') {
            return {
              ...q,
              status: newStatus,
              convertedOrderNumber: 'SO-2026-' + Math.floor(400 + Math.random() * 50),
            };
          }
          return { ...q, status: newStatus };
        }
        return q;
      })
    );
    message.success(`Quotation status updated to ${newStatus}`);
  };

  const handleRevise = (quote: DetailedQuotation) => {
    const revisedQuote: DetailedQuotation = {
      ...quote,
      id: 'qt-' + Date.now(),
      quoteNumber: `${quote.quoteNumber.split('-R')[0]}-R${quote.revision + 1}`,
      revision: quote.revision + 1,
      status: 'Draft',
      issueDate: new Date().toISOString().slice(0, 10),
    };
    setData([revisedQuote, ...data]);
    message.success(`Quotation revision ${revisedQuote.quoteNumber} created`);
  };

  // Modern Minimalist Pill Badges (Stripe / Linear Inspired)
  const getStatusBadge = (status: DetailedQuotation['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #DCFCE7' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Approved
          </span>
        );
      case 'Converted to Order':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#EEF2FF', color: '#3730A3', fontSize: 11.5, fontWeight: 700, border: '1px solid #E0E7FF' }}>
            <Sparkles size={11} color="#4F46E5" /> Converted
          </span>
        );
      case 'Sent':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#EFF6FF', color: '#1E40AF', fontSize: 11.5, fontWeight: 700, border: '1px solid #DBEAFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Sent to Client
          </span>
        );
      case 'Draft':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#F8FAFC', color: '#475569', fontSize: 11.5, fontWeight: 700, border: '1px solid #E2E8F0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8' }} /> Draft
          </span>
        );
      case 'Rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#FEF2F2', color: '#991B1B', fontSize: 11.5, fontWeight: 700, border: '1px solid #FEE2E2' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Rejected
          </span>
        );
      case 'Expired':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 16, background: '#FFFBEB', color: '#92400E', fontSize: 11.5, fontWeight: 700, border: '1px solid #FEF3C7' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Expired
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Clean Minimalist SaaS Columns (Linear / Stripe style)
  const columns = [
    {
      title: 'Quotation',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
      width: 170,
      render: (t: string, r: DetailedQuotation) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              onClick={() => {
                setSelectedQuote(r);
                setViewModalOpen(true);
              }}
              style={{
                fontWeight: 700,
                color: '#441A87',
                fontSize: 13,
                cursor: 'pointer',
                letterSpacing: '-0.2px',
              }}
            >
              {t}
            </span>
            {r.revision > 1 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9', background: '#EDE9FE', padding: '1px 5px', borderRadius: 4 }}>
                v{r.revision}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Issued {r.issueDate}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer & Contact',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string, r: DetailedQuotation) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{t}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{r.customerEmail}</span>
            <span>&bull;</span>
            <span>{r.customerPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Salesperson',
      dataIndex: 'salesExecutive',
      key: 'salesExecutive',
      width: 170,
      render: (v: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#EDE7F6',
              color: '#441A87',
              fontSize: 10.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {v.split(' ').map((n) => n[0]).join('')}
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: '#334155' }}>{v}</span>
        </div>
      ),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 130,
      render: (v: string) => {
        const isExp = new Date(v) < new Date();
        return (
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: isExp ? '#DC2626' : '#334155' }}>
              {v}
            </div>
            <div style={{ fontSize: 10.5, color: isExp ? '#EF4444' : '#94A3B8' }}>
              {isExp ? 'Past due' : 'Active'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Amount (INR)',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 150,
      align: 'right' as const,
      render: (v: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{v.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>Incl. GST</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center' as const,
      render: (st: DetailedQuotation['status']) => getStatusBadge(st),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, r: DetailedQuotation) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Proposal Document',
            icon: <ExternalLink size={13} />,
            onClick: () => {
              setSelectedQuote(r);
              setViewModalOpen(true);
            },
          },
          {
            key: 'revise',
            label: 'Create Revision',
            icon: <RefreshCw size={13} />,
            onClick: () => handleRevise(r),
          },
          ...(r.status === 'Draft'
            ? [
                {
                  key: 'send',
                  label: 'Mark as Sent',
                  icon: <Send size={13} />,
                  onClick: () => handleStatusChange(r.id, 'Sent'),
                },
              ]
            : []),
          ...(r.status === 'Sent'
            ? [
                {
                  key: 'approve',
                  label: 'Client Accepted / Approve',
                  icon: <CheckCircle size={13} />,
                  onClick: () => handleStatusChange(r.id, 'Approved'),
                },
                {
                  key: 'reject',
                  label: 'Mark as Rejected',
                  icon: <X size={13} />,
                  onClick: () => handleStatusChange(r.id, 'Rejected'),
                },
              ]
            : []),
          ...(r.status === 'Approved' && !r.convertedOrderNumber
            ? [
                {
                  key: 'convert',
                  label: 'Convert into Sales Order',
                  icon: <Sparkles size={13} />,
                  onClick: () => handleStatusChange(r.id, 'Converted to Order'),
                },
              ]
            : []),
          { type: 'divider' },
          {
            key: 'pdf',
            label: 'Download PDF Proposal',
            icon: <Download size={13} />,
            onClick: () => message.info(`Downloading ${r.quoteNumber}...`),
          },
        ];

        return (
          <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => {
                setSelectedQuote(r);
                setViewModalOpen(true);
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
      {/* 1. TOP HEADER BANNER (SalesOverview Match) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          padding: '12px 18px',
          backgroundColor: '#FAF5FF',
          borderRadius: 16,
          border: '1px solid #E9D5FF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#EDE7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ROYAL_PURPLE,
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
            }}
          >
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em' }}>
                Quotations
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: '#6B7280', fontWeight: 500 }}>
              Manage commercial quotations, pricing proposals, approvals, revisions, and order conversions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 135, height: 38 }}
            prefix={<Calendar size={14} color="#6B7280" style={{ marginRight: 6 }} />}
            options={[
              { value: 'This Month', label: 'This Month' },
              { value: 'Today', label: 'Today' },
              { value: 'This Week', label: 'This Week' },
              { value: 'This Quarter', label: 'This Quarter' },
              { value: 'FY 2026', label: 'FY 2026' },
            ]}
          />
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setModalOpen(true);
            }}
            icon={<Plus size={15} />}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 16px',
            }}
          >
            Create Quotation
          </Button>
        </div>
      </div>

      {/* 2. EXACT 4 HERO METRIC CARDS */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Total Pipeline Value */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '20px 22px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
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
                <IndianRupee size={26} strokeWidth={2.6} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', marginBottom: 2 }}>
                  Pipeline Value
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  ₹{(totalValue / 100000).toFixed(2)} L
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +14.2%
                </div>
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
              }}
            >
              <IndianRupee size={22} />
            </div>
          </div>
        </Col>

        {/* Card 2: Total Quotations */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 22px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 4px 16px rgba(68, 26, 135, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: '#EDE7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  flexShrink: 0,
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', marginBottom: 2 }}>
                  Total Quotations
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: TEXT_DARK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {totalCount}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +12.5%
                </div>
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <FileSpreadsheet size={22} />
            </div>
          </div>
        </Col>

        {/* Card 3: Pending Approvals */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '20px 22px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
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
                <Clock size={26} strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', marginBottom: 2 }}>
                  Pending Reviews
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {sentCount}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +2.3%
                </div>
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
              }}
            >
              <Clock size={22} />
            </div>
          </div>
        </Col>

        {/* Card 4: Win Conversion Rate */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 22px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 4px 16px rgba(68, 26, 135, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: '#EDE7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  flexShrink: 0,
                }}
              >
                <TrendingUp size={24} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', marginBottom: 2 }}>
                  Win Conversion Rate
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: TEXT_DARK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {winRate}%
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +3.1%
                </div>
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <TrendingUp size={22} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. CLEAN MINIMALIST SAAS DATA TABLE (Stripe / Linear Inspired Style) */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
              All Proposals
            </span>
            <span
              style={{
                backgroundColor: '#EDE7F6',
                color: '#441A87',
                padding: '1px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {filtered.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Filter by customer, quote #, rep..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 230, borderRadius: 8, height: 34, fontSize: 12 }}
              allowClear
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Sent', label: 'Sent to Client' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Converted to Order', label: 'Converted' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Expired', label: 'Expired' },
              ]}
            />
            <Select
              size="small"
              value={executiveFilter}
              onChange={setExecutiveFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Reps' },
                { value: 'Vikram Seth', label: 'Vikram Seth' },
                { value: 'Ananya Sharma', label: 'Ananya Sharma' },
                { value: 'Kavitha Ramachandran', label: 'Kavitha Ramachandran' },
              ]}
            />
            <Button
              size="small"
              icon={<Download size={13} />}
              onClick={() => message.success('Exporting quotes to CSV...')}
              style={{ borderRadius: 8, height: 34, fontWeight: 600, fontSize: 12, borderColor: '#CBD5E1' }}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Minimalist SaaS Table */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: '#64748B' }}>
                {range[0]}-{range[1]} of {total} quotations
              </span>
            ),
          }}
          rowClassName={(_, index) => (index % 2 === 0 ? 'saas-row-even' : 'saas-row-odd')}
        />
      </div>

      {/* CREATE QUOTATION MODAL */}
      <Modal
        title="Generate New Commercial Quotation"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateQuotation} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item label="Customer / Organization" name="customerName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Sales Executive" name="salesExecutive" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma', value: 'Ananya Sharma' },
                    { label: 'Kavitha Ramachandran', value: 'Kavitha Ramachandran' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Customer Email" name="customerEmail">
                <Input placeholder="contact@customer.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customer Phone" name="customerPhone">
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '10px 0 16px', fontSize: 12.5, color: '#6B7280' }}>
            Line Item Details
          </Divider>

          <Form.Item label="Primary Item Description" name="itemName" rules={[{ required: true }]}>
            <Input placeholder="e.g. 15kW Variable Frequency Drive (VFD) with EMC Filter" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Quantity" name="quantity" initialValue={1}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Subtotal (INR)" name="subtotal" rules={[{ required: true }]}>
                <InputNumber min={1000} style={{ width: '100%' }} placeholder="350000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Discount (INR)" name="discountAmount" initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Commercial Notes & Terms" name="notes">
            <Input.TextArea rows={2} placeholder="Payment schedule, delivery warranty terms..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}
            >
              Save as Draft Quote
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW QUOTATION MODAL */}
      <Modal
        title={selectedQuote ? `Quotation Detail: ${selectedQuote.quoteNumber}` : 'Quotation Details'}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedQuote && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, color: '#1F2937' }}>{selectedQuote.customerName}</h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  {selectedQuote.customerEmail} &bull; {selectedQuote.customerPhone}
                </span>
              </div>
              <div>{getStatusBadge(selectedQuote.status)}</div>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 12 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ color: '#6B7280' }}>Issued Date</div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{selectedQuote.issueDate}</div>
                </Col>
                <Col span={6}>
                  <div style={{ color: '#6B7280' }}>Valid Until</div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{selectedQuote.validUntil}</div>
                </Col>
                <Col span={6}>
                  <div style={{ color: '#6B7280' }}>Sales Rep</div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{selectedQuote.salesExecutive}</div>
                </Col>
                <Col span={6}>
                  <div style={{ color: '#6B7280' }}>Revision</div>
                  <div style={{ fontWeight: 700, color: '#7544D6' }}>Rev {selectedQuote.revision}</div>
                </Col>
              </Row>
            </div>

            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13, color: '#374151' }}>Quotation Items</div>
            <Table
              size="small"
              pagination={false}
              dataSource={selectedQuote.items}
              rowKey="id"
              columns={[
                { title: 'Item', dataIndex: 'itemName', key: 'itemName' },
                { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (t: string) => <Tag>{t}</Tag> },
                { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
                { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `₹${v.toLocaleString()}` },
                { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
              ]}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <div style={{ width: 240, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#6B7280' }}>Subtotal:</span>
                  <span>₹{selectedQuote.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#6B7280' }}>Discount:</span>
                  <span style={{ color: '#EF4444' }}>-₹{selectedQuote.discountAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#6B7280' }}>GST (18%):</span>
                  <span>₹{selectedQuote.taxAmount.toLocaleString()}</span>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 14, fontWeight: 800 }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#10B981' }}>₹{selectedQuote.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {selectedQuote.termsAndConditions && (
              <div style={{ marginTop: 14, backgroundColor: '#FAF9FE', padding: 12, borderRadius: 8, fontSize: 11.5 }}>
                <strong style={{ color: ROYAL_PURPLE }}>Terms & Conditions:</strong>
                <pre style={{ margin: '6px 0 0', fontFamily: 'inherit', color: '#4B5563', whiteSpace: 'pre-wrap' }}>
                  {selectedQuote.termsAndConditions}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
