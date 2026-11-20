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
  Tabs,
  Space,
  Row,
  Col,
  Progress,
  Tooltip,
  InputNumber,
  Divider,
} from 'antd';
import {
  Plus,
  Target,
  UserCheck,
  HelpCircle,
  FileSpreadsheet,
  ShoppingBag,
  Receipt,
  CreditCard,
  Users,
  Package,
  Boxes,
  Undo2,
  Briefcase,
  BarChart3,
  Search,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Trash2,
  TrendingUp,
  Truck,
  FileText,
  DollarSign,
  Award,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import {
  INITIAL_QUOTATIONS,
  INITIAL_QUOTATION_TEMPLATES,
  INITIAL_DETAILED_ORDERS,
  INITIAL_PROFORMA_INVOICES,
  INITIAL_SALES_TARGETS,
  INITIAL_COMMISSION_RULES,
  INITIAL_DETAILED_RETURNS,
  DetailedQuotation,
  QuotationTemplate,
  DetailedSalesOrder,
  ProformaInvoice,
  SalesTargetRecord,
  SalesCommissionRule,
  DetailedSalesReturn,
} from '../../mock/salesManagementStore';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import {
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
} from '../../mock/salesServiceData';
import type { Invoice, Payment, Customer, Product } from '../../types';

// ============================================================================
// REUSABLE PREMIUM SINGLE-LINE HEADER
// ============================================================================
interface SalesModuleHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  primaryActionLabel?: string;
  primaryActionIcon?: React.ReactNode;
  onPrimaryAction?: () => void;
  extraActions?: React.ReactNode;
}

export const SalesModuleHeader: React.FC<SalesModuleHeaderProps> = ({
  title,
  subtitle,
  icon,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  primaryActionLabel,
  primaryActionIcon,
  onPrimaryAction,
  extraActions,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: 14,
        columnGap: 20,
        padding: '14px 20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
        borderRadius: 18,
        border: '1px solid #EAE4F5',
        boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
        backdropFilter: 'blur(8px)',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, flex: '1 1 auto' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(84, 33, 168, 0.28)',
            flexShrink: 0,
            color: '#FFFFFF',
          }}
        >
          {icon}
        </div>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#211044',
              margin: 0,
              letterSpacing: '-0.3px',
              lineHeight: 1.25,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: '#6B7280',
              margin: '3px 0 0 0',
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {onSearchChange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #ECE8F6',
              borderRadius: 30,
              padding: '6px 14px',
              width: 220,
              boxShadow: '0 2px 6px rgba(84, 33, 168, 0.04)',
            }}
          >
            <Search size={14} color="#7544D6" style={{ marginRight: 8, flexShrink: 0 }} />
            <input
              placeholder={searchPlaceholder}
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 12.5,
                color: '#1F2937',
                width: '100%',
              }}
            />
          </div>
        )}

        {extraActions}

        {primaryActionLabel && onPrimaryAction && (
          <Button
            type="primary"
            icon={primaryActionIcon || <Plus size={15} />}
            onClick={onPrimaryAction}
            style={{
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              borderColor: '#5421A8',
              borderRadius: 24,
              fontWeight: 700,
              height: 36,
              padding: '0 18px',
              boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
            }}
          >
            {primaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 1. QUOTATIONS & PROPOSALS
// ============================================================================
export const SalesQuotationsPage: React.FC = () => {
  const [data, setData] = useState<DetailedQuotation[]>(INITIAL_QUOTATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<DetailedQuotation | null>(null);
  const [form] = Form.useForm();

  const filtered = data.filter((d) => {
    const matchSearch =
      d.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.salesExecutive.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchSearch && matchStatus;
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
      issueDate: new Date().toISOString().slice(0, 10),
      validUntil: values.validUntil || '2026-12-31',
      salesExecutive: values.salesExecutive || 'Vikram Seth',
      subtotal,
      discountAmount: discount,
      taxAmount: tax,
      grandTotal,
      status: 'Draft',
      notes: values.notes || 'Commercial proposal prepared as per client requirements.',
      termsAndConditions: '1. Net 30 payment terms.\n2. Goods delivery within 2 weeks of PO confirmation.',
      items: [
        {
          id: 'item-new',
          itemName: values.itemName || 'Industrial Automation Component Kit',
          sku: 'SKU-NEW-01',
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
      quoteNumber: `${quote.quoteNumber}-R${quote.revision + 1}`,
      revision: quote.revision + 1,
      status: 'Draft',
      issueDate: new Date().toISOString().slice(0, 10),
    };
    setData([revisedQuote, ...data]);
    message.success(`Quotation revision ${revisedQuote.quoteNumber} created`);
  };

  const getStatusBadge = (status: DetailedQuotation['status']) => {
    switch (status) {
      case 'Approved':
      case 'Converted to Order':
        return <Tag color="green">{status}</Tag>;
      case 'Sent':
        return <Tag color="blue">Sent to Client</Tag>;
      case 'Draft':
        return <Tag color="default">Draft</Tag>;
      case 'Rejected':
        return <Tag color="red">Rejected</Tag>;
      case 'Expired':
        return <Tag color="orange">Expired</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Quote #',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
      render: (t: string, r: DetailedQuotation) => (
        <div>
          <span style={{ fontWeight: 800, color: '#5421A8', backgroundColor: '#F3EEFF', padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
            {t}
          </span>
          {r.revision > 1 && (
            <Tag color="purple" style={{ marginLeft: 6, fontSize: 10 }}>
              Rev {r.revision}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Customer & Contact',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string, r: DetailedQuotation) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 13 }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
            {r.customerEmail} &bull; {r.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Executive',
      dataIndex: 'salesExecutive',
      key: 'salesExecutive',
      render: (v: string) => <Tag color="geekblue">{v}</Tag>,
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_: any, r: DetailedQuotation) => (
        <div style={{ fontSize: 11.5, color: '#4B5563' }}>
          <div>Issued: {r.issueDate}</div>
          <div style={{ color: '#9CA3AF' }}>Valid: {r.validUntil}</div>
        </div>
      ),
    },
    {
      title: 'Grand Total (inc. Tax)',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>
          ₹{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: DetailedQuotation['status']) => getStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: DetailedQuotation) => (
        <Space size={4}>
          <Tooltip title="View Details">
            <Button
              size="small"
              type="text"
              icon={<Eye size={14} color="#5421A8" />}
              onClick={() => {
                setSelectedQuote(r);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          {r.status === 'Draft' && (
            <Tooltip title="Send to Client">
              <Button
                size="small"
                type="text"
                icon={<Send size={14} color="#2563EB" />}
                onClick={() => handleStatusChange(r.id, 'Sent')}
              />
            </Tooltip>
          )}
          {r.status === 'Sent' && (
            <Tooltip title="Mark as Client Accepted">
              <Button
                size="small"
                type="text"
                icon={<CheckCircle size={14} color="#10B981" />}
                onClick={() => handleStatusChange(r.id, 'Approved')}
              />
            </Tooltip>
          )}
          {r.status === 'Approved' && !r.convertedOrderNumber && (
            <Button
              size="small"
              type="primary"
              style={{
                background: '#10B981',
                borderColor: '#10B981',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 700,
                height: 26,
              }}
              onClick={() => handleStatusChange(r.id, 'Converted to Order')}
            >
              Convert Order
            </Button>
          )}
          {r.convertedOrderNumber && (
            <Tag color="cyan" style={{ fontSize: 11, fontWeight: 700 }}>
              {r.convertedOrderNumber}
            </Tag>
          )}
          <Tooltip title="Create Revision">
            <Button
              size="small"
              type="text"
              icon={<RefreshCw size={13} color="#7544D6" />}
              onClick={() => handleRevise(r)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Quotations & Proposals"
        subtitle="Create, edit, approve, revise, and convert commercial sales proposals into confirmed client orders."
        icon={<FileSpreadsheet size={20} />}
        searchPlaceholder="Search quote #, customer, rep..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Quotation"
        onPrimaryAction={() => {
          form.resetFields();
          setModalOpen(true);
        }}
        extraActions={
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140, height: 36 }}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Draft', value: 'Draft' },
              { label: 'Sent', value: 'Sent' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Converted', value: 'Converted to Order' },
              { label: 'Rejected', value: 'Rejected' },
            ]}
          />
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Quotations',
            value: data.length.toString(),
            growth: '+18.5%',
            isDark: true,
            icon: <FileSpreadsheet size={20} color="#5421A8" />,
            pillExtra: `₹${(data.reduce((acc, q) => acc + q.grandTotal, 0) / 100000).toFixed(1)}L Total`,
          },
          {
            title: 'Draft Quotations',
            value: data.filter((q) => q.status === 'Draft').length.toString(),
            growth: 'In Prep',
            isDark: false,
            icon: <FileText size={20} color="#7544D6" />,
            pillExtra: 'Unsent',
          },
          {
            title: 'Sent Quotations',
            value: data.filter((q) => q.status === 'Sent').length.toString(),
            growth: 'Active Review',
            isDark: true,
            icon: <Send size={20} color="#3B82F6" />,
            pillExtra: 'Awaiting Client',
          },
          {
            title: 'Accepted Quotations',
            value: data.filter((q) => q.status === 'Approved' || q.status === 'Converted to Order').length.toString(),
            growth: 'Won Deals',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: '67% Won',
          },
          {
            title: 'Rejected Quotations',
            value: data.filter((q) => q.status === 'Rejected').length.toString(),
            growth: 'Price/Lead Time',
            isPositive: false,
            isDark: true,
            icon: <Trash2 size={20} color="#EF4444" />,
            pillExtra: 'Lost',
          },
          {
            title: 'Expired Quotations',
            value: data.filter((q) => q.status === 'Expired').length.toString(),
            growth: 'Needs Follow-up',
            isPositive: false,
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Validity Passed',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </div>

      {/* CREATE MODAL */}
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
            Quotation Line Item Details
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

          <Form.Item label="Terms & Commercial Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Payment schedule, delivery warranty terms..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#5421A8', borderColor: '#5421A8' }}
            >
              Save as Draft Quote
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW MODAL */}
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
                <strong style={{ color: '#5421A8' }}>Terms & Conditions:</strong>
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

// ============================================================================
// 2. QUOTATION TEMPLATES
// ============================================================================
export const SalesQuotationTemplatesPage: React.FC = () => {
  const [data, setData] = useState<QuotationTemplate[]>(INITIAL_QUOTATION_TEMPLATES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter(
    (d) =>
      d.templateName.toLowerCase().includes(search.toLowerCase()) ||
      d.templateCode.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (values: any) => {
    const newTmpl: QuotationTemplate = {
      id: 'tmpl-' + Date.now(),
      templateCode: 'TMP-' + values.category.substring(0, 3).toUpperCase() + '-' + (data.length + 1),
      templateName: values.templateName,
      category: values.category || 'Standard Goods',
      currency: 'INR (₹)',
      defaultValidityDays: Number(values.defaultValidityDays) || 30,
      defaultDiscountPercent: Number(values.defaultDiscountPercent) || 0,
      defaultTaxPercent: 18,
      termsAndConditions: values.termsAndConditions || 'Standard payment terms apply.',
      companyBranding: {
        headerColor: '#5421A8',
        showLogo: true,
        footerText: values.footerText || 'Authorized Sales ERP Partner',
      },
      isActive: true,
      usageCount: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setData([newTmpl, ...data]);
    message.success('Quotation template created successfully!');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Template Code',
      dataIndex: 'templateCode',
      key: 'templateCode',
      render: (t: string) => <Tag color="purple">{t}</Tag>,
    },
    {
      title: 'Template Name & Category',
      dataIndex: 'templateName',
      key: 'templateName',
      render: (t: string, r: QuotationTemplate) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 13 }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{r.category}</div>
        </div>
      ),
    },
    {
      title: 'Validity Days',
      dataIndex: 'defaultValidityDays',
      key: 'defaultValidityDays',
      render: (v: number) => <span>{v} Days</span>,
    },
    {
      title: 'Default Discount',
      dataIndex: 'defaultDiscountPercent',
      key: 'defaultDiscountPercent',
      render: (v: number) => <Tag color="orange">{v}%</Tag>,
    },
    {
      title: 'Usage Count',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (c: number) => <span style={{ fontWeight: 600 }}>{c} quotes</span>,
    },
    {
      title: 'Branding Footer',
      key: 'branding',
      render: (_: any, r: QuotationTemplate) => (
        <span style={{ fontSize: 11, color: '#6B7280' }}>{r.companyBranding.footerText}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag color="default">Inactive</Tag>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Quotation Templates"
        subtitle="Manage reusable quotation templates, pre-defined terms and conditions, and corporate branding themes."
        icon={<FileSpreadsheet size={20} />}
        searchPlaceholder="Search templates..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Template"
        onPrimaryAction={() => {
          form.resetFields();
          setModalOpen(true);
        }}
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Templates',
            value: data.filter((t) => t.isActive).length.toString(),
            growth: '+100%',
            isDark: true,
            icon: <FileSpreadsheet size={20} color="#5421A8" />,
            pillExtra: 'Verified Branding',
          },
          {
            title: 'Total Template Usage',
            value: data.reduce((acc, t) => acc + t.usageCount, 0).toString(),
            growth: '+24.5%',
            isDark: false,
            icon: <Sparkles size={20} color="#7544D6" />,
            pillExtra: 'Quotations Created',
          },
          {
            title: 'Average Validity',
            value: `${Math.round(data.reduce((acc, t) => acc + t.defaultValidityDays, 0) / (data.length || 1))} Days`,
            growth: 'Standard',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Offer Terms',
          },
          {
            title: 'Template Categories',
            value: '4 Segments',
            growth: 'Modular',
            isDark: false,
            icon: <Boxes size={20} color="#0284C7" />,
            pillExtra: 'Enterprise Scope',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </div>

      <Modal
        title="Create Reusable Quotation Template"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 14 }}>
          <Form.Item label="Template Name" name="templateName" rules={[{ required: true }]}>
            <Input placeholder="e.g. Turnkey Electrical Installation Template" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Industry / Category" name="category" initialValue="Standard Goods">
                <Select
                  options={[
                    { label: 'Standard Goods', value: 'Standard Goods' },
                    { label: 'Equipment Supply', value: 'Equipment Supply' },
                    { label: 'Annual Maintenance', value: 'Annual Maintenance' },
                    { label: 'Custom Project', value: 'Custom Project' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Default Validity (Days)" name="defaultValidityDays" initialValue={30}>
                <InputNumber min={7} max={180} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Standard Terms and Conditions" name="termsAndConditions">
            <Input.TextArea rows={3} placeholder="1. Payment terms: 50% advance...\n2. Standard 1-year warranty..." />
          </Form.Item>

          <Form.Item label="Company Branding Footer" name="footerText">
            <Input placeholder="e.g. Multi-Tenant Sales ERP Platform • Certified Quality" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Template
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 3. SALES ORDERS
// ============================================================================
export const SalesOrdersPage: React.FC = () => {
  const [data, setData] = useState<DetailedSalesOrder[]>(INITIAL_DETAILED_ORDERS);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter((d) => {
    const matchSearch =
      d.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.salesExecutive.toLowerCase().includes(search.toLowerCase());
    const matchPay = paymentFilter === 'ALL' || d.paymentStatus === paymentFilter;
    return matchSearch && matchPay;
  });

  const handleCreateOrder = (values: any) => {
    const grandTotal = Number(values.totalAmount) || 250000;
    const newOrder: DetailedSalesOrder = {
      id: 'so-' + Date.now(),
      orderNumber: 'SO-2026-' + (400 + data.length + 1),
      quoteReference: values.quoteReference || 'DIRECT-PO',
      customerName: values.customerName,
      customerEmail: values.customerEmail || 'billing@customer.com',
      customerPhone: values.customerPhone || '+91 90000 00000',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDelivery: values.expectedDelivery || '2026-12-10',
      salesExecutive: values.salesExecutive || 'Vikram Seth',
      subtotal: Math.round(grandTotal / 1.18),
      taxAmount: Math.round(grandTotal - grandTotal / 1.18),
      grandTotal,
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Pending',
      shippingAddress: values.shippingAddress || 'Client Site Logistics Address',
      billingAddress: values.shippingAddress || 'Client Registered Address',
      carrierName: values.carrierName || 'Direct Transport',
      trackingNumber: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
      fulfilmentProgress: 10,
      status: 'Confirmed',
      items: [
        {
          id: 'item-so',
          itemName: values.itemName || 'Confirmed Order Item Details',
          sku: 'SKU-SO-01',
          quantity: 1,
          unitPrice: grandTotal,
          discountPercent: 0,
          taxRatePercent: 18,
          totalAmount: grandTotal,
        },
      ],
    };
    setData([newOrder, ...data]);
    message.success(`Sales Order ${newOrder.orderNumber} confirmed!`);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (t: string, r: DetailedSalesOrder) => (
        <div>
          <span style={{ fontWeight: 800, color: '#5421A8', backgroundColor: '#F3EEFF', padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
            {t}
          </span>
          {r.quoteReference && (
            <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3 }}>
              Ref: {r.quoteReference}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string, r: DetailedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 13 }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
            Rep: {r.salesExecutive} &bull; {r.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Order Date & Due',
      key: 'dates',
      render: (_: any, r: DetailedSalesOrder) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Ordered: {r.orderDate}</div>
          <div style={{ color: '#0284C7' }}>Due: {r.expectedDelivery}</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (v: number) => <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>₹{v.toLocaleString()}</span>,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (s: string) => {
        const color = s === 'Paid' ? 'green' : s === 'Partially Paid' ? 'gold' : 'red';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Fulfillment',
      dataIndex: 'fulfilmentProgress',
      key: 'fulfilmentProgress',
      render: (p: number, r: DetailedSalesOrder) => (
        <div style={{ width: 110 }}>
          <Progress percent={p} size="small" strokeColor="#7544D6" />
          <span style={{ fontSize: 10, color: '#6B7280' }}>{r.deliveryStatus}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: DetailedSalesOrder) => (
        <Space size={4}>
          <Tooltip title="View Tracking & Logistics">
            <Button
              size="small"
              type="text"
              icon={<Truck size={14} color="#5421A8" />}
              onClick={() => message.info(`Carrier: ${r.carrierName || 'Logistics Partner'} • Tracking: ${r.trackingNumber || 'Pending'}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Confirmed Sales Orders"
        subtitle="Manage confirmed client orders, line item pricing, taxes, fulfillment schedules, and order execution."
        icon={<ShoppingBag size={20} />}
        searchPlaceholder="Search order #, customer..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Order"
        onPrimaryAction={() => {
          form.resetFields();
          setModalOpen(true);
        }}
        extraActions={
          <Select
            value={paymentFilter}
            onChange={setPaymentFilter}
            style={{ width: 140, height: 36 }}
            options={[
              { label: 'All Payments', value: 'ALL' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Partially Paid', value: 'Partially Paid' },
              { label: 'Unpaid', value: 'Unpaid' },
            ]}
          />
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Confirmed Orders',
            value: data.length.toString(),
            growth: '+14.2%',
            isDark: true,
            icon: <ShoppingBag size={20} color="#5421A8" />,
            pillExtra: `Gross: ₹${(data.reduce((acc, o) => acc + o.grandTotal, 0) / 100000).toFixed(1)}L`,
          },
          {
            title: 'In Fulfilment / Transit',
            value: data.filter((o) => o.deliveryStatus === 'Processing' || o.deliveryStatus === 'Shipped').length.toString(),
            growth: '+8.0%',
            isDark: false,
            icon: <Truck size={20} color="#7544D6" />,
            pillExtra: 'Active Dispatch',
          },
          {
            title: 'Fully Paid Orders',
            value: data.filter((o) => o.paymentStatus === 'Paid').length.toString(),
            growth: '+19.3%',
            isDark: true,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Clear Receivables',
          },
          {
            title: 'Pending Delivery',
            value: data.filter((o) => o.deliveryStatus === 'Pending').length.toString(),
            growth: '+2.4%',
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Warehouse Packing',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </div>

      <Modal
        title="Confirm New Sales Order"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrder} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]}>
                <Input placeholder="Client company name" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Quotation Ref (Optional)" name="quoteReference">
                <Input placeholder="e.g. QT-2026-881" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Total Order Value (INR)" name="totalAmount" rules={[{ required: true }]}>
                <InputNumber min={1000} style={{ width: '100%' }} placeholder="450000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Expected Delivery Date" name="expectedDelivery" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Order Item Summary" name="itemName" rules={[{ required: true }]}>
            <Input placeholder="e.g. Heavy Duty Hydraulic Pump Units - 3 Units" />
          </Form.Item>

          <Form.Item label="Shipping / Site Address" name="shippingAddress">
            <Input.TextArea rows={2} placeholder="Warehouse / client delivery location..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 4. SALES ORDER TRACKING
// ============================================================================
export const SalesOrderTrackingPage: React.FC = () => {
  const [data] = useState<DetailedSalesOrder[]>(INITIAL_DETAILED_ORDERS);
  const [search, setSearch] = useState('');

  const filtered = data.filter(
    (d) =>
      d.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (d.trackingNumber && d.trackingNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (t: string) => <span style={{ fontWeight: 800, color: '#5421A8' }}>{t}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string, r: DetailedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 700 }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>Ship to: {r.shippingAddress}</div>
        </div>
      ),
    },
    {
      title: 'Carrier & Waybill Tracking',
      key: 'carrier',
      render: (_: any, r: DetailedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1F2937' }}>{r.carrierName || 'Direct Logistics'}</div>
          <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>
            {r.trackingNumber ? `AWB: ${r.trackingNumber}` : 'AWB Pending Dispatch'}
          </div>
        </div>
      ),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDelivery',
      key: 'expectedDelivery',
    },
    {
      title: 'Fulfilment Progress',
      dataIndex: 'fulfilmentProgress',
      key: 'fulfilmentProgress',
      render: (p: number, r: DetailedSalesOrder) => (
        <div style={{ width: 140 }}>
          <Progress
            percent={p}
            status={p === 100 ? 'success' : 'active'}
            strokeColor={p === 100 ? '#10B981' : '#7544D6'}
          />
          <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, marginTop: 2 }}>
            Stage: {r.deliveryStatus}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color = st === 'Fulfilled' ? 'green' : st === 'Shipped' ? 'blue' : 'gold';
        return <Tag color={color}>{st}</Tag>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Order Tracking"
        subtitle="Real-time order fulfilment monitoring, logistics dispatch, carrier waybills, and milestone delivery progress."
        icon={<Truck size={20} />}
        searchPlaceholder="Search order #, customer, tracking AWB..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Dispatches',
            value: data.length.toString(),
            growth: '+12.5%',
            isDark: true,
            icon: <Truck size={20} color="#5421A8" />,
            pillExtra: 'Waybills Active',
          },
          {
            title: 'Avg Fulfilment Rate',
            value: `${Math.round(data.reduce((acc, o) => acc + o.fulfilmentProgress, 0) / (data.length || 1))}%`,
            growth: '+7.4%',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Progress Milestone',
          },
          {
            title: 'In Freight Transit',
            value: data.filter((o) => o.deliveryStatus === 'Shipped').length.toString(),
            growth: 'On Schedule',
            isDark: true,
            icon: <Clock size={20} color="#0284C7" />,
            pillExtra: 'Carrier En Route',
          },
          {
            title: 'Fulfilled Deliveries',
            value: data.filter((o) => o.deliveryStatus === 'Delivered').length.toString(),
            growth: '100% SLA',
            isDark: false,
            icon: <Award size={20} color="#F59E0B" />,
            pillExtra: 'Customer Sign-off',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

// ============================================================================
// 5. PROFORMA INVOICES
// ============================================================================
export const SalesProformaInvoicesPage: React.FC = () => {
  const [data, setData] = useState<ProformaInvoice[]>(INITIAL_PROFORMA_INVOICES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter(
    (d) =>
      d.proformaNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.orderReference.toLowerCase().includes(search.toLowerCase())
  );

  const handleConvertToTaxInvoice = (record: ProformaInvoice) => {
    const taxInvNumber = 'INV-2026-' + (1050 + data.length + 1);
    setData((prev) =>
      prev.map((pi) =>
        pi.id === record.id
          ? { ...pi, status: 'Converted to Tax Invoice', convertedInvoiceNumber: taxInvNumber }
          : pi
      )
    );
    message.success(`Proforma ${record.proformaNumber} converted to Final Sales Invoice: ${taxInvNumber}`);
  };

  const handleCreate = (values: any) => {
    const total = Number(values.totalAmount) || 200000;
    const tax = Math.round(total * 0.18);
    const newPI: ProformaInvoice = {
      id: 'pi-' + Date.now(),
      proformaNumber: 'PI-2026-' + (300 + data.length + 1),
      orderReference: values.orderReference || 'SO-2026-DIRECT',
      customerName: values.customerName,
      customerGst: values.customerGst || '33AABCT0000K1ZP',
      issueDate: new Date().toISOString().slice(0, 10),
      validUntil: values.validUntil || '2026-12-15',
      totalAmount: total,
      taxAmount: tax,
      grandTotal: total + tax,
      paymentTerms: values.paymentTerms || '100% advance clearance against PI',
      salesExecutive: values.salesExecutive || 'Vikram Seth',
      status: 'Issued',
    };
    setData([newPI, ...data]);
    message.success(`Proforma Invoice ${newPI.proformaNumber} generated!`);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Proforma #',
      dataIndex: 'proformaNumber',
      key: 'proformaNumber',
      render: (t: string) => (
        <span style={{ fontWeight: 800, color: '#5421A8', backgroundColor: '#F3EEFF', padding: '3px 8px', borderRadius: 6 }}>
          {t}
        </span>
      ),
    },
    {
      title: 'Against Order',
      dataIndex: 'orderReference',
      key: 'orderReference',
      render: (r: string) => <Tag color="geekblue">{r}</Tag>,
    },
    {
      title: 'Customer Name & GSTIN',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string, r: ProformaInvoice) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937' }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>GSTIN: {r.customerGst || 'Unregistered'}</div>
        </div>
      ),
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      render: (t: string) => <span style={{ fontSize: 11.5, color: '#4B5563' }}>{t}</span>,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (v: number) => <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>₹{v.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color = st === 'Converted to Tax Invoice' ? 'green' : 'blue';
        return <Tag color={color}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: ProformaInvoice) => (
        <Space size={4}>
          {r.status === 'Issued' ? (
            <Button
              size="small"
              type="primary"
              style={{
                background: '#5421A8',
                borderColor: '#5421A8',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 700,
                height: 26,
              }}
              onClick={() => handleConvertToTaxInvoice(r)}
            >
              Convert to Invoice
            </Button>
          ) : (
            <Tag color="cyan" style={{ fontSize: 11, fontWeight: 700 }}>
              {r.convertedInvoiceNumber}
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Proforma Invoices"
        subtitle="Preliminary billing, advance payment requests, GST estimation, and one-click conversion to final sales invoices."
        icon={<FileText size={20} />}
        searchPlaceholder="Search PI #, customer, order..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Issue Proforma"
        onPrimaryAction={() => {
          form.resetFields();
          setModalOpen(true);
        }}
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Proformas Issued',
            value: data.length.toString(),
            growth: '+15.8%',
            isDark: true,
            icon: <FileText size={20} color="#5421A8" />,
            pillExtra: `Gross: ₹${(data.reduce((acc, pi) => acc + pi.grandTotal, 0) / 100000).toFixed(1)}L`,
          },
          {
            title: 'Converted to Tax Invoice',
            value: data.filter((pi) => pi.status === 'Converted to Tax Invoice').length.toString(),
            growth: '+28.0%',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Advance Collected',
          },
          {
            title: 'Pending Advance Clearance',
            value: data.filter((pi) => pi.status === 'Issued').length.toString(),
            growth: 'Active PI',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Bank Transfer Awaiting',
          },
          {
            title: 'GST Tax Component',
            value: `₹${(data.reduce((acc, pi) => acc + pi.taxAmount, 0) / 100000).toFixed(2)}L`,
            growth: '18% Standard',
            isDark: false,
            icon: <DollarSign size={20} color="#7544D6" />,
            pillExtra: 'Tax Liability Ledger',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </div>

      <Modal
        title="Generate Preliminary Proforma Invoice"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]}>
                <Input placeholder="Client company name" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Order Reference" name="orderReference">
                <Input placeholder="e.g. SO-2026-403" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Base Taxable Amount (INR)" name="totalAmount" rules={[{ required: true }]}>
                <InputNumber min={1000} style={{ width: '100%' }} placeholder="250000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Valid Until Date" name="validUntil" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Payment Terms" name="paymentTerms" initialValue="100% advance clearance against PI">
            <Input placeholder="e.g. 50% mobilization advance" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Issue Proforma
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 6. SALES TARGETS & COMMISSIONS
// ============================================================================
export const SalesTargetsPage: React.FC = () => {
  const [data, setData] = useState<SalesTargetRecord[]>(INITIAL_SALES_TARGETS);
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('ALL');

  const filtered = data.filter((d) => {
    const matchSearch =
      d.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      d.designation.toLowerCase().includes(search.toLowerCase());
    const matchPeriod = periodFilter === 'ALL' || d.targetPeriod === periodFilter;
    return matchSearch && matchPeriod;
  });

  const columns = [
    {
      title: 'Sales Representative',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (t: string, r: SalesTargetRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937' }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>
            {r.employeeId} &bull; {r.designation}
          </div>
        </div>
      ),
    },
    {
      title: 'Target Horizon',
      dataIndex: 'targetPeriod',
      key: 'targetPeriod',
      render: (p: string, r: SalesTargetRecord) => (
        <div>
          <Tag color="purple">{p}</Tag>
          <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 2 }}>{r.periodLabel}</div>
        </div>
      ),
    },
    {
      title: 'Target Revenue',
      dataIndex: 'targetRevenue',
      key: 'targetRevenue',
      render: (v: number) => `₹${(v / 100000).toFixed(1)}L`,
    },
    {
      title: 'Achieved Revenue',
      dataIndex: 'achievedRevenue',
      key: 'achievedRevenue',
      render: (v: number, r: SalesTargetRecord) => {
        const percent = Math.round((v / r.targetRevenue) * 100);
        return (
          <div style={{ width: 140 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#10B981' }}>₹{(v / 100000).toFixed(1)}L</span>
              <span>{percent}%</span>
            </div>
            <Progress percent={percent} size="small" strokeColor={percent >= 80 ? '#10B981' : '#7544D6'} />
          </div>
        );
      },
    },
    {
      title: 'Deals Closed',
      key: 'deals',
      render: (_: any, r: SalesTargetRecord) => (
        <span>
          <strong>{r.achievedDeals}</strong> / {r.targetDeals} deals
        </span>
      ),
    },
    {
      title: 'Commission Eligibility',
      dataIndex: 'commissionEligible',
      key: 'commissionEligible',
      render: (e: boolean) =>
        e ? <Tag color="green">Eligible</Tag> : <Tag color="default">In Review</Tag>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Targets & Quotas"
        subtitle="Manage monthly, quarterly, and annual commercial sales quotas, deal milestones, and rep performance tracking."
        icon={<Target size={20} />}
        searchPlaceholder="Search rep name, designation..."
        searchValue={search}
        onSearchChange={setSearch}
        extraActions={
          <Select
            value={periodFilter}
            onChange={setPeriodFilter}
            style={{ width: 140, height: 36 }}
            options={[
              { label: 'All Horizons', value: 'ALL' },
              { label: 'Monthly', value: 'Monthly' },
              { label: 'Quarterly', value: 'Quarterly' },
              { label: 'Annual', value: 'Annual' },
            ]}
          />
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Overall Sales Target',
            value: `₹${(data.reduce((acc, t) => acc + t.targetRevenue, 0) / 10000000).toFixed(2)} Cr`,
            growth: '+14.5%',
            isDark: true,
            icon: <Target size={20} color="#5421A8" />,
            pillExtra: 'Combined Goals',
          },
          {
            title: 'Achieved Revenue',
            value: `₹${(data.reduce((acc, t) => acc + t.achievedRevenue, 0) / 10000000).toFixed(2)} Cr`,
            growth: '+12.1%',
            isDark: false,
            icon: <TrendingUp size={20} color="#10B981" />,
            pillExtra: 'Run-rate 83%',
          },
          {
            title: 'Remaining Target',
            value: `₹${((data.reduce((acc, t) => acc + t.targetRevenue, 0) - data.reduce((acc, t) => acc + t.achievedRevenue, 0)) / 10000000).toFixed(2)} Cr`,
            growth: 'Target Gap',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Q4 Focus',
          },
          {
            title: 'Target Achievement',
            value: `${Math.round((data.reduce((acc, t) => acc + t.achievedRevenue, 0) / (data.reduce((acc, t) => acc + t.targetRevenue, 0) || 1)) * 100)}%`,
            growth: 'On Track',
            isDark: false,
            icon: <Award size={20} color="#10B981" />,
            pillExtra: 'Team Pacing',
          },
          {
            title: 'Total Salespersons',
            value: `${data.length} Executives`,
            growth: 'Full Quota',
            isDark: true,
            icon: <Users size={20} color="#3B82F6" />,
            pillExtra: 'Active Team',
          },
          {
            title: 'Top Performer',
            value: data.slice().sort((a, b) => (b.achievedRevenue / b.targetRevenue) - (a.achievedRevenue / a.targetRevenue))[0]?.employeeName || 'Priya Sharma',
            growth: '118% Quota',
            isDark: false,
            icon: <Sparkles size={20} color="#7544D6" />,
            pillExtra: 'Leader',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export const SalesCommissionsPage: React.FC = () => {
  const [rules, setRules] = useState<SalesCommissionRule[]>(INITIAL_COMMISSION_RULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateRule = (values: any) => {
    const newRule: SalesCommissionRule = {
      id: 'com-' + Date.now(),
      ruleCode: 'COMM-' + Math.floor(100 + Math.random() * 900),
      ruleName: values.ruleName,
      appliesTo: values.appliesTo || 'All Executives',
      thresholdRevenue: Number(values.thresholdRevenue) || 1000000,
      baseCommissionPercent: Number(values.baseCommissionPercent) || 2.5,
      acceleratorPercent: Number(values.acceleratorPercent) || 4.0,
      calculatedThisMonth: 0,
      status: 'Active',
    };
    setRules([...rules, newRule]);
    message.success('New commission rule established!');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Rule Code',
      dataIndex: 'ruleCode',
      key: 'ruleCode',
      render: (c: string) => <Tag color="purple">{c}</Tag>,
    },
    {
      title: 'Commission Scheme & Scope',
      dataIndex: 'ruleName',
      key: 'ruleName',
      render: (t: string, r: SalesCommissionRule) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937' }}>{t}</div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>Applies to: {r.appliesTo}</div>
        </div>
      ),
    },
    {
      title: 'Threshold Ceiling',
      dataIndex: 'thresholdRevenue',
      key: 'thresholdRevenue',
      render: (v: number) => `₹${(v / 100000).toFixed(1)} Lakhs`,
    },
    {
      title: 'Base Rate',
      dataIndex: 'baseCommissionPercent',
      key: 'baseCommissionPercent',
      render: (v: number) => <Tag color="blue">{v}%</Tag>,
    },
    {
      title: 'Accelerator Rate',
      dataIndex: 'acceleratorPercent',
      key: 'acceleratorPercent',
      render: (v: number) => <Tag color="gold">{v}%</Tag>,
    },
    {
      title: 'Calculated This Month',
      dataIndex: 'calculatedThisMonth',
      key: 'calculatedThisMonth',
      render: (v: number) => <span style={{ fontWeight: 800, color: '#10B981' }}>₹{v.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <Tag color={st === 'Active' ? 'green' : 'default'}>{st}</Tag>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Commissions & Incentives"
        subtitle="Configurable tiered commission matrices, revenue thresholds, payout accelerators, and rep incentives."
        icon={<CreditCard size={20} />}
        primaryActionLabel="New Commission Rule"
        onPrimaryAction={() => {
          form.resetFields();
          setModalOpen(true);
        }}
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Schemes',
            value: rules.filter((r) => r.status === 'Active').length.toString(),
            growth: 'Active Plans',
            isDark: true,
            icon: <CreditCard size={20} color="#5421A8" />,
            pillExtra: 'Tier Matrix',
          },
          {
            title: 'Accrued This Month',
            value: `₹${(rules.reduce((acc, r) => acc + r.calculatedThisMonth, 0) / 1000).toFixed(1)}k`,
            growth: '+18.2%',
            isDark: false,
            icon: <DollarSign size={20} color="#10B981" />,
            pillExtra: 'Rep Incentives',
          },
          {
            title: 'Top Accelerator Rate',
            value: `${Math.max(...rules.map((r) => r.acceleratorPercent))}%`,
            growth: 'Performance',
            isDark: true,
            icon: <Award size={20} color="#F59E0B" />,
            pillExtra: 'Over-achievement Tier',
          },
          {
            title: 'Coverage Scope',
            value: 'All Reps',
            growth: '100% Reps',
            isDark: false,
            icon: <Users size={20} color="#7544D6" />,
            pillExtra: 'Field & Channel',
          },
        ]}
      />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Table dataSource={rules} columns={columns} rowKey="id" />
      </div>

      <Modal
        title="Add Configurable Commission Matrix Rule"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRule} style={{ marginTop: 14 }}>
          <Form.Item label="Rule / Scheme Name" name="ruleName" rules={[{ required: true }]}>
            <Input placeholder="e.g. Q4 Peak Season High-Value Bonus" />
          </Form.Item>

          <Form.Item label="Applies To Hierarchy" name="appliesTo" initialValue="Enterprise Sales Executives">
            <Select
              options={[
                { label: 'Enterprise Sales Executives', value: 'Enterprise Sales Executives' },
                { label: 'Channel Sales Managers', value: 'Channel Sales Managers' },
                { label: 'Business Development Executives', value: 'Business Development Executives' },
                { label: 'Inside Sales Executives', value: 'Inside Sales Executives' },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Min Threshold (INR)" name="thresholdRevenue" rules={[{ required: true }]}>
                <InputNumber min={100000} style={{ width: '100%' }} placeholder="1500000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Base Rate (%)" name="baseCommissionPercent" rules={[{ required: true }]}>
                <InputNumber min={0.5} max={25} step={0.5} style={{ width: '100%' }} placeholder="3.0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Accelerator (%)" name="acceleratorPercent" rules={[{ required: true }]}>
                <InputNumber min={0.5} max={30} step={0.5} style={{ width: '100%' }} placeholder="5.0" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Rule
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 7. SALES TEAM & TERRITORIES
// ============================================================================
export const SalesTeamPage: React.FC = () => {
  const teamMembers = [
    {
      id: 'tm-1',
      name: 'Vikram Seth',
      role: 'Senior Enterprise Account Executive',
      region: 'Tamil Nadu & Kerala',
      activeDeals: 14,
      mtdSales: '₹48.2 Lakhs',
      quotaAttainment: 92,
      email: 'vikram@enterprise-erp.com',
      phone: '+91 98412 88990',
      status: 'Active',
    },
    {
      id: 'tm-2',
      name: 'Ananya Sharma',
      role: 'Lead Business Development Manager',
      region: 'Karnataka & Andhra Pradesh',
      activeDeals: 11,
      mtdSales: '₹36.5 Lakhs',
      quotaAttainment: 88,
      email: 'ananya@enterprise-erp.com',
      phone: '+91 97890 11223',
      status: 'Active',
    },
    {
      id: 'tm-3',
      name: 'Kavitha Ramachandran',
      role: 'Regional Channel Sales Specialist',
      region: 'Maharashtra & Gujarat',
      activeDeals: 18,
      mtdSales: '₹62.0 Lakhs',
      quotaAttainment: 104,
      email: 'kavitha@enterprise-erp.com',
      phone: '+91 98210 44556',
      status: 'Active',
    },
    {
      id: 'tm-4',
      name: 'Arjun Menon',
      role: 'Inside Sales Executive',
      region: 'Pan-India Inbound RFQs',
      activeDeals: 22,
      mtdSales: '₹24.8 Lakhs',
      quotaAttainment: 85,
      email: 'arjun@enterprise-erp.com',
      phone: '+91 98455 77889',
      status: 'Active',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Team & Hierarchy"
        subtitle="Manage employee assignments, territory allocations, reporting hierarchies, and representative quota monitoring."
        icon={<Users size={20} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {teamMembers.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #ECE8F6',
              boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1F2937' }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: '#7544D6', fontWeight: 600 }}>{m.role}</div>
              </div>
              <Tag color="green">{m.status}</Tag>
            </div>

            <div style={{ fontSize: 11.5, color: '#6B7280', marginBottom: 14 }}>
              <div>Territory: <strong style={{ color: '#111827' }}>{m.region}</strong></div>
              <div>Email: {m.email}</div>
              <div>Phone: {m.phone}</div>
            </div>

            <div style={{ backgroundColor: '#FAF9FE', padding: 12, borderRadius: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#6B7280' }}>MTD Revenue:</span>
                <strong style={{ color: '#10B981' }}>{m.mtdSales}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: '#6B7280' }}>Active Deals:</span>
                <strong>{m.activeDeals} deals</strong>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 2 }}>
                  <span>Quota Attainment</span>
                  <span>{m.quotaAttainment}%</span>
                </div>
                <Progress percent={m.quotaAttainment} size="small" strokeColor={m.quotaAttainment >= 100 ? '#10B981' : '#7544D6'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 8. SALES RETURNS & RMA (Redesigned with Premium ERP Style & Action Controls)
// ============================================================================
export const SalesReturnsPage: React.FC = () => {
  const [data, setData] = useState<DetailedSalesReturn[]>(INITIAL_DETAILED_RETURNS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<DetailedSalesReturn | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter((d) => {
    const matchSearch =
      !search ||
      d.returnNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchReason = reasonFilter === 'ALL' || d.reason === reasonFilter;
    return matchSearch && matchStatus && matchReason;
  });

  // Dynamic KPI Metrics
  const totalReturns = data.length;
  const pendingReview = data.filter((r) => r.status === 'Requested' || r.status === 'Inspecting').length;
  const approvedReturns = data.filter((r) => r.status === 'Approved' || r.status === 'Refunded').length;
  const totalClaimAmount = data.reduce((acc, r) => acc + r.claimAmount, 0);

  const handleCreate = (values: any) => {
    const newReturn: DetailedSalesReturn = {
      id: 'ret-' + Date.now(),
      returnNumber: 'RET-2026-' + (80 + data.length + 1),
      orderNumber: values.orderNumber,
      customerName: values.customerName,
      returnDate: new Date().toISOString().slice(0, 10),
      reason: values.reason || 'Defective',
      returnedQuantity: Number(values.returnedQuantity) || 1,
      claimAmount: Number(values.claimAmount) || 25000,
      refundMethod: values.refundMethod || 'Credit Note',
      inspectionNotes: values.inspectionNotes || 'Return requested under standard warranty policy.',
      status: 'Requested',
    };
    setData([newReturn, ...data]);
    message.success(`Sales Return ${newReturn.returnNumber} filed for inspection!`);
    setModalOpen(false);
    form.resetFields();
  };

  const handleApprove = (record: DetailedSalesReturn) => {
    const creditNoteNum = 'CN-2026-0' + Math.floor(10 + Math.random() * 40);
    setData((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, status: 'Approved', creditNoteNumber: creditNoteNum }
          : r
      )
    );
    message.success(`Return approved. Credit note ${creditNoteNum} generated for ₹${record.claimAmount.toLocaleString()}`);
  };

  const handleMarkInspected = (record: DetailedSalesReturn) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, status: 'Inspecting' }
          : r
      )
    );
    message.info(`Return ${record.returnNumber} moved to Lab Inspection.`);
  };

  const handleReject = (record: DetailedSalesReturn) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, status: 'Rejected' }
          : r
      )
    );
    message.warning(`Return ${record.returnNumber} has been rejected.`);
  };

  const columns = [
    {
      title: 'Return #',
      dataIndex: 'returnNumber',
      key: 'returnNumber',
      render: (t: string, r: DetailedSalesReturn) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span
            onClick={() => {
              setViewRecord(r);
              setViewModalOpen(true);
            }}
            style={{ fontWeight: 800, color: '#441A87', cursor: 'pointer', fontSize: 13 }}
          >
            {t}
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>(Filed {r.returnDate})</span>
        </div>
      ),
    },
    {
      title: 'Against Order',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 130,
      render: (t: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 6,
            background: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid #BFDBFE',
            whiteSpace: 'nowrap',
          }}
        >
          {t}
        </span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (t: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{t}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>• Commercial Client</span>
        </div>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 155,
      render: (r: string) => {
        let bg = '#FFFBEB';
        let color = '#B45309';
        let border = '#FDE68A';
        if (r === 'Defective') {
          bg = '#FEF2F2';
          color = '#B91C1C';
          border = '#FECACA';
        } else if (r === 'Damaged in Transit') {
          bg = '#FFF1F2';
          color = '#BE123C';
          border = '#FDA4AF';
        } else if (r === 'Wrong Item') {
          bg = '#F3E8FF';
          color = '#7E22CE';
          border = '#E9D5FF';
        }
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: 20,
              background: bg,
              color: color,
              fontSize: 11.5,
              fontWeight: 700,
              border: `1px solid ${border}`,
            }}
          >
            {r}
          </span>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'returnedQuantity',
      key: 'returnedQuantity',
      width: 95,
      render: (q: number) => <span style={{ fontWeight: 600, color: '#334155' }}>{q} Units</span>,
    },
    {
      title: 'Claim Amount',
      dataIndex: 'claimAmount',
      key: 'claimAmount',
      width: 130,
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#DC2626', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Refund / Credit Note',
      key: 'refund',
      width: 165,
      render: (_: any, r: DetailedSalesReturn) => (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{r.refundMethod}</div>
          {r.creditNoteNumber ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '1px 7px',
                borderRadius: 4,
                background: '#ECFDF5',
                color: '#047857',
                fontSize: 10.5,
                fontWeight: 700,
                border: '1px solid #A7F3D0',
                marginTop: 2,
              }}
            >
              CN: {r.creditNoteNumber}
            </span>
          ) : (
            <span style={{ fontSize: 10.5, color: '#94A3B8' }}>Awaiting Approval</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 125,
      align: 'center' as const,
      render: (st: string) => {
        let bg = '#F1F5F9';
        let color = '#475569';
        let border = '#E2E8F0';
        let dot = '#94A3B8';

        if (st === 'Approved' || st === 'Refunded') {
          bg = '#F0FDF4';
          color = '#15803D';
          border = '#BBF7D0';
          dot = '#16A34A';
        } else if (st === 'Inspecting') {
          bg = '#FFFBEB';
          color = '#B45309';
          border = '#FDE68A';
          dot = '#D97706';
        } else if (st === 'Requested') {
          bg = '#EFF6FF';
          color = '#1D4ED8';
          border = '#BFDBFE';
          dot = '#2563EB';
        } else if (st === 'Rejected') {
          bg = '#FEF2F2';
          color = '#B91C1C';
          border = '#FECACA';
          dot = '#DC2626';
        }

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 20,
              background: bg,
              color: color,
              fontSize: 11.5,
              fontWeight: 700,
              border: `1px solid ${border}`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} /> {st}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 155,
      align: 'right' as const,
      render: (_: any, r: DetailedSalesReturn) => {
        return (
          <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => {
                setViewRecord(r);
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
            {r.status === 'Requested' && (
              <Button
                size="small"
                type="primary"
                onClick={() => handleApprove(r)}
                style={{
                  backgroundColor: '#441A87',
                  borderColor: '#441A87',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 700,
                  height: 28,
                  padding: '0 8px',
                }}
              >
                Approve
              </Button>
            )}
            {r.status === 'Inspecting' && (
              <Button
                size="small"
                type="primary"
                onClick={() => handleApprove(r)}
                style={{
                  backgroundColor: '#059669',
                  borderColor: '#059669',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 700,
                  height: 28,
                  padding: '0 8px',
                }}
              >
                Pass QA
              </Button>
            )}
            {r.status === 'Approved' && (
              <Button
                size="small"
                onClick={() => message.info(`Downloading Credit Note ${r.creditNoteNumber || 'Slip'}...`)}
                style={{
                  borderRadius: 6,
                  borderColor: '#CBD5E1',
                  color: '#441A87',
                  fontSize: 11,
                  fontWeight: 700,
                  height: 28,
                  padding: '0 8px',
                }}
              >
                Print CN
              </Button>
            )}
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
          backgroundColor: '#FAF5FF',
          borderRadius: 16,
          border: '1px solid #E9D5FF',
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
              color: '#441A87',
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
              flexShrink: 0,
            }}
          >
            <Undo2 size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Sales Returns & RMA Management
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage client return authorisations, defective inspections, returned quantities, and automated credit note integration.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setModalOpen(true);
            }}
            icon={<Plus size={15} />}
            style={{
              backgroundColor: '#441A87',
              borderColor: '#441A87',
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 16px',
              whiteSpace: 'nowrap',
            }}
          >
            Initiate Return
          </Button>
        </div>
      </div>

      {/* 2. FOUR ESSENTIAL HERO CARDS (Each with vibrant gradient theme matching Delivery & Quotations ERP style) */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Total Returns (Deep Royal Purple Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
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
                <Undo2 size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Total Returns
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {totalReturns}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4ADE80', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Active RMA Registry
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
              <Package size={20} />
            </div>
          </div>
        </Col>

        {/* Card 2: Pending Approval / In Inspection (Clean Ice-Blue Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
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
                <Clock size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#BAE6FD', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Pending Review
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {pendingReview}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0F2FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  QA Lab Inspection
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
              <HelpCircle size={20} />
            </div>
          </div>
        </Col>

        {/* Card 3: Approved & Settled (Vibrant Emerald Green Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
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
                <CheckCircle size={24} strokeWidth={2.6} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Approved Returns
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {approvedReturns}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1FAE5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  CN Issued / Replaced
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

        {/* Card 4: Total Refund Value (High-Notice Crimson Red Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
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
                <DollarSign size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FECDD3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Total Refund Claim
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  ₹{(totalClaimAmount / 1000).toFixed(1)}k
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FEE2E2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Settled & Outstanding
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
              <DollarSign size={20} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. CLEAN MINIMALIST SAAS DATA TABLE WITH INTEGRATED TOOLBAR */}
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
              All Sales Returns
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

          {/* Right: Clean Filters in Single Row */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Filter by return #, order, client..."
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
                { value: 'Requested', label: 'Requested' },
                { value: 'Inspecting', label: 'Inspecting' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Refunded', label: 'Refunded' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
            />
            <Select
              size="small"
              value={reasonFilter}
              onChange={setReasonFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Reasons' },
                { value: 'Defective', label: 'Defective' },
                { value: 'Wrong Item', label: 'Wrong Item' },
                { value: 'Damaged in Transit', label: 'Damaged in Transit' },
              ]}
            />
            <Button
              size="small"
              icon={<Download size={13} />}
              onClick={() => message.success('Exporting returns log to CSV...')}
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
                Showing {range[0]}-{range[1]} of {total} returns records
              </span>
            ),
          }}
          size="middle"
        />
      </div>

      {/* Details View Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#441A87', fontWeight: 800 }}>
            <Undo2 size={18} />
            <span>RMA Return Details - {viewRecord?.returnNumber}</span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
          viewRecord?.status === 'Requested' && (
            <Button
              key="approve"
              type="primary"
              style={{ backgroundColor: '#441A87', borderColor: '#441A87' }}
              onClick={() => {
                if (viewRecord) handleApprove(viewRecord);
                setViewModalOpen(false);
              }}
            >
              Approve Return
            </Button>
          ),
        ]}
        width={580}
      >
        {viewRecord && (
          <div style={{ padding: '8px 0', fontSize: 13 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: '#FAF5FF', padding: 14, borderRadius: 10, border: '1px solid #E9D5FF' }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Return Reference:</span>
                <div style={{ fontWeight: 800, color: '#441A87' }}>{viewRecord.returnNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Linked Sales Order:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{viewRecord.orderNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Customer Name:</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{viewRecord.customerName}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Return Date:</span>
                <div style={{ fontWeight: 600, color: '#334155' }}>{viewRecord.returnDate}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, margin: '14px 0' }}>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>Reason:</span>
                <div style={{ fontWeight: 700, color: '#B45309' }}>{viewRecord.reason}</div>
              </div>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>Quantity:</span>
                <div style={{ fontWeight: 700, color: '#334155' }}>{viewRecord.returnedQuantity} Units</div>
              </div>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>Claim Value:</span>
                <div style={{ fontWeight: 800, color: '#DC2626' }}>₹{viewRecord.claimAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Inspection Notes:</span>
              <div style={{ marginTop: 4, color: '#334155', lineHeight: 1.4 }}>
                {viewRecord.inspectionNotes || 'Standard physical condition check performed.'}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#441A87', fontWeight: 800 }}>
            <Undo2 size={18} />
            <span>Initiate Sales Return / RMA Workflow</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Customer Name</span>} name="customerName" rules={[{ required: true }]}>
                <Input placeholder="Client company name" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Original Order Number</span>} name="orderNumber" rules={[{ required: true }]}>
                <Input placeholder="e.g. SO-2026-401" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Reason for Return</span>} name="reason" initialValue="Defective">
                <Select
                  style={{ height: 38 }}
                  options={[
                    { label: 'Defective Equipment', value: 'Defective' },
                    { label: 'Wrong Item Shipped', value: 'Wrong Item' },
                    { label: 'Damaged in Transit', value: 'Damaged in Transit' },
                    { label: 'Customer Cancelled', value: 'Customer Cancel' },
                    { label: 'Replacement Exchange', value: 'Exchange' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Refund / Settlement</span>} name="refundMethod" initialValue="Credit Note">
                <Select
                  style={{ height: 38 }}
                  options={[
                    { label: 'Credit Note', value: 'Credit Note' },
                    { label: 'Direct Bank Refund', value: 'Bank Refund' },
                    { label: 'Product Replacement', value: 'Replacement' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Returned Quantity</span>} name="returnedQuantity" initialValue={1}>
                <InputNumber min={1} style={{ width: '100%', height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Claim Amount (INR)</span>} name="claimAmount" rules={[{ required: true }]}>
                <InputNumber min={100} style={{ width: '100%', height: 38, borderRadius: 8 }} placeholder="42000" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Inspection Lab / Defect Notes</span>} name="inspectionNotes">
            <Input.TextArea rows={2} style={{ borderRadius: 8 }} placeholder="Observed physical damage, error code..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)} style={{ borderRadius: 8, height: 36 }}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#441A87', borderColor: '#441A87', borderRadius: 8, height: 36, fontWeight: 700 }}>
              Submit RMA Request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// ============================================================================
// 9. INVOICES & PAYMENTS (Pre-existing Clean Modules)
// ============================================================================
export const SalesInvoicesPage: React.FC = () => {
  const [data] = useState<Invoice[]>(MOCK_INVOICES);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (t: string) => <span style={{ fontWeight: 800, color: '#5421A8' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName', render: (t: string) => <span style={{ fontWeight: 700 }}>{t}</span> },
    { title: 'Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Total Invoiced', dataIndex: 'amount', key: 'amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Balance Due', dataIndex: 'balanceDue', key: 'balanceDue', render: (v: number) => <span style={{ fontWeight: 800, color: v > 0 ? '#EF4444' : '#10B981' }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color={st === 'Paid' ? 'green' : 'gold'}>{st}</Tag> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Invoices & Billing"
        subtitle="GST-compliant billing, accounts receivable, and aging schedules."
        icon={<Receipt size={20} />}
        searchPlaceholder="Search invoices..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '18px 20px', border: '1px solid #ECE8F6' }}>
        <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export const SalesPaymentsPage: React.FC = () => {
  const [data] = useState<Payment[]>(MOCK_PAYMENTS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Receipt #', dataIndex: 'receiptNumber', key: 'receiptNumber', render: (t: string) => <span style={{ fontWeight: 800, color: '#5421A8' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName', render: (t: string) => <span style={{ fontWeight: 700 }}>{t}</span> },
    { title: 'Against Invoice', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Date', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: 'Method', dataIndex: 'paymentMethod', key: 'paymentMethod', render: (m: string) => <Tag color="blue">{m}</Tag> },
    { title: 'Amount Received', dataIndex: 'amount', key: 'amount', render: (v: number) => <span style={{ fontWeight: 800, color: '#10B981' }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color="green">{st}</Tag> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Payments & Receipts"
        subtitle="Record bank transfers, UPI transactions, credit collections, and reconciliation."
        icon={<CreditCard size={20} />}
        searchPlaceholder="Search receipts..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '18px 20px', border: '1px solid #ECE8F6' }}>
        <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export const SalesCustomersPage: React.FC = () => {
  const [data] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Customer Code', dataIndex: 'code', key: 'code', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Company Name', dataIndex: 'name', key: 'name', render: (t: string, r: Customer) => <div><div style={{ fontWeight: 700 }}>{t}</div><div style={{ fontSize: 11, color: '#6B7280' }}>Contact: {r.contactPerson}</div></div> },
    { title: 'Email & Phone', key: 'contact', render: (_: any, r: Customer) => <div><div>{r.email}</div><div style={{ fontSize: 11, color: '#6B7280' }}>{r.phone}</div></div> },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Credit Limit', dataIndex: 'creditLimit', key: 'creditLimit', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Current Balance', dataIndex: 'currentBalance', key: 'currentBalance', render: (v: number) => <span style={{ fontWeight: 600 }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color="green">{st}</Tag> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Customer Directory"
        subtitle="Comprehensive customer accounts, credit ceilings, and historical transaction logs."
        icon={<Users size={20} />}
        searchPlaceholder="Search customers..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '18px 20px', border: '1px solid #ECE8F6' }}>
        <Table dataSource={data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export const SalesProductsPage: React.FC = () => {
  const [data] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'SKU Code', dataIndex: 'sku', key: 'sku', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Product Name', dataIndex: 'name', key: 'name', render: (t: string, r: Product) => <div><div style={{ fontWeight: 700 }}>{t}</div><div style={{ fontSize: 11, color: '#6B7280' }}>{r.brand} &bull; {r.category}</div></div> },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
    { title: 'Stock Available', dataIndex: 'stockQty', key: 'stockQty', render: (q: number) => <span style={{ fontWeight: 600 }}>{q} Units</span> },
    { title: 'Inventory State', dataIndex: 'status', key: 'status', render: (st: string) => <Tag color={st === 'In Stock' ? 'green' : 'orange'}>{st}</Tag> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Product Catalog & SKUs"
        subtitle="Commercial product catalog, cost margins, and selling price lists."
        icon={<Package size={20} />}
        searchPlaceholder="Search products by name or SKU..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '18px 20px', border: '1px solid #ECE8F6' }}>
        <Table dataSource={data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export const SalesReportsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Sales Analytics & Revenue Reports"
        subtitle="Monthly recurring revenue, deal velocity, pipeline health, and customer churn."
        icon={<BarChart3 size={20} />}
      />
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, border: '1px solid #ECE8F6' }}>
        <p style={{ margin: 0, color: '#5C526A' }}>Monthly sales forecast at ₹48.5L with 28.4% pipeline win conversion.</p>
      </div>
    </div>
  );
};
