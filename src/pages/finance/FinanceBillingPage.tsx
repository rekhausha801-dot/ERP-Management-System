import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Row,
  Col,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Divider,
  Typography,
  message,
  Tabs,
  Tooltip,
} from 'antd';
import {
  Plus,
  Search,
  Download,
  Printer,
  Mail,
  Receipt,
  CreditCard,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Trash2,
  Eye,
  RefreshCw,
  Building,
  CheckCircle,
  TrendingUp,
  FileSpreadsheet,
  IndianRupee,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useAuth } from '../../context/AuthContext';
import type { ErpPackageId } from '../../config/erpPackageConfig';

export interface InvoiceItem {
  key: string;
  description: string;
  type: 'Product' | 'Labour' | 'Spare Part' | 'AMC';
  hsnCode: string;
  qty: number;
  rate: number;
  gstRate: number; // e.g. 18%
  amount: number;
}

export const FinanceBillingPage: React.FC = () => {
  const { selectedCompany } = useAuth();
  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Line items for creation
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      key: '1',
      description: '3-Phase Frequency Inverter 15kW with Filter',
      type: 'Product',
      hsnCode: '85044090',
      qty: 2,
      rate: 45000,
      gstRate: 18,
      amount: 90000,
    },
  ]);

  const [customer, setCustomer] = useState('Apex Precision Tools Ltd');
  const [gstType, setGstType] = useState<'INTRA' | 'INTER'>('INTRA');
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  // Calculation formulas
  const subtotal = items.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const totalGst = items.reduce((acc, curr) => {
    const itemNet = curr.qty * curr.rate * (1 - discountPercent / 100);
    return acc + (itemNet * curr.gstRate) / 100;
  }, 0);
  const grandTotal = taxableAmount + totalGst;

  // Mock Invoice Database
  const [invoices, setInvoices] = useState([
    {
      key: '1',
      invoiceNumber: 'INV-2026-0941',
      date: '2026-11-16',
      dueDate: '2026-11-30',
      customer: 'Apex Precision Tools Ltd',
      gstin: '33AABCA1234F1Z6',
      billingType: 'Commercial GST Sales Invoice',
      subtotal: 145000,
      gst: 26100,
      grandTotal: 171100,
      paidAmount: 171100,
      status: 'Paid',
      category: 'Sales',
    },
    {
      key: '2',
      invoiceNumber: 'SRV-2026-0418',
      date: '2026-11-15',
      dueDate: '2026-11-25',
      customer: 'Metro Rail Consortium',
      gstin: '33AAACM5541L1Z9',
      billingType: 'Technical Service & Labour Billing',
      subtotal: 85000,
      gst: 15300,
      grandTotal: 100300,
      paidAmount: 50000,
      status: 'Partially Paid',
      category: 'Service',
    },
    {
      key: '3',
      invoiceNumber: 'INV-2026-0940',
      date: '2026-11-12',
      dueDate: '2026-11-20',
      customer: 'Omni Infra Ventures Ltd',
      gstin: '29AABCO9922K1Z4',
      billingType: 'Interstate GST Tax Invoice',
      subtotal: 420000,
      gst: 75600,
      grandTotal: 495600,
      paidAmount: 0,
      status: 'Overdue',
      category: 'Sales',
    },
    {
      key: '4',
      invoiceNumber: 'AMC-2026-0082',
      date: '2026-11-10',
      dueDate: '2026-11-24',
      customer: 'Southern Automation Works',
      gstin: '33AAECS4412M1Z0',
      billingType: 'Annual Maintenance Contract Renewal',
      subtotal: 120000,
      gst: 21600,
      grandTotal: 141600,
      paidAmount: 141600,
      status: 'Paid',
      category: 'Service',
    },
    {
      key: '5',
      invoiceNumber: 'PRF-2026-0129',
      date: '2026-11-16',
      dueDate: '2026-12-01',
      customer: 'Dynamic Motors Corp',
      gstin: '33AABCD7781N1ZX',
      billingType: 'Preliminary Proforma Invoice',
      subtotal: 95000,
      gst: 17100,
      grandTotal: 112100,
      paidAmount: 0,
      status: 'Draft',
      category: 'Sales',
    },
  ]);

  // Package & Search Filter for billing
  const filteredInvoices = invoices.filter((inv) => {
    if (currentPkg === 'SALES' && inv.category === 'Service') return false;
    if (currentPkg === 'SERVICE' && inv.category === 'Sales') return false;
    if (activeTab === 'sales' && inv.category !== 'Sales') return false;
    if (activeTab === 'service' && inv.category !== 'Service') return false;
    if (activeTab === 'unpaid' && inv.status !== 'Partially Paid' && inv.status !== 'Overdue') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.gstin.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalPending = totalInvoiced - totalPaid;
  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  const addItemRow = () => {
    const newItem: InvoiceItem = {
      key: `${items.length + 1}`,
      description: 'High Pressure Hydraulic Seal Kit',
      type: 'Spare Part',
      hsnCode: '84841000',
      qty: 1,
      rate: 8500,
      gstRate: 18,
      amount: 8500,
    };
    setItems([...items, newItem]);
  };

  const handleCreateInvoice = () => {
    const newInv = {
      key: `${invoices.length + 1}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: '2026-12-05',
      customer,
      gstin: '33AABCA1234F1Z6',
      billingType: 'Commercial GST Sales Invoice',
      subtotal,
      gst: totalGst,
      grandTotal,
      paidAmount: 0,
      status: 'Pending',
      category: 'Sales',
    };
    setInvoices([newInv, ...invoices]);
    setIsCreateModalOpen(false);
    message.success(`Official GST Tax Invoice ${newInv.invoiceNumber} generated!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Cohesive Header Bar with exact Sales Dashboard Purple UI Styling */}
      <SalesModuleHeader
        title="Finance & Accounts Management"
        subtitle="End-to-end GST tax invoicing, payment reconciliation, recurring billings, and accounts receivable."
        icon={<Receipt size={20} />}
        searchPlaceholder="Search invoice #, customer, GSTIN..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Invoice"
        onPrimaryAction={() => setIsCreateModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting GST Compliant GSTR-1 Ledger...')}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 12,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 36,
              padding: '0 14px',
              backgroundColor: '#FFFFFF',
            }}
          >
            Export GSTR-1
          </Button>
        }
      />

      {/* 2. Top 4 High-Impact Metric Cards matching Sales Dashboard Exactly */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Invoiced',
            value: `₹${(totalInvoiced / 100000).toFixed(2)}L`,
            growth: '+16.4%',
            isDark: true,
            icon: <Receipt size={20} color="#5421A8" />,
            pillExtra: `${invoices.length} Invoices`,
          },
          {
            title: 'Paid Collections',
            value: `₹${(totalPaid / 100000).toFixed(2)}L`,
            growth: `${Math.round((totalPaid / (totalInvoiced || 1)) * 100)}%`,
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Cleared',
          },
          {
            title: 'Receivables',
            value: `₹${(totalPending / 100000).toFixed(2)}L`,
            growth: '<30 Days',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Active Due',
          },
          {
            title: 'Overdue Dues',
            value: `${overdueCount} Critical`,
            growth: '-5.2%',
            isPositive: false,
            isDark: false,
            icon: <AlertCircle size={20} color="#DC2626" />,
            pillExtra: 'Immediate Action',
          },
        ]}
      />

      {/* 3. Main Billing Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 12 }}
          items={[
            { key: 'all', label: `All Invoices (${filteredInvoices.length})` },
            ...(currentPkg !== 'SERVICE' ? [{ key: 'sales', label: 'Commercial Sales Invoices' }] : []),
            ...(currentPkg !== 'SALES' ? [{ key: 'service', label: 'Service & AMC Billings' }] : []),
            { key: 'unpaid', label: 'Unpaid & Overdue' },
          ]}
        />

        <Table
          dataSource={filteredInvoices}
          pagination={{ pageSize: 8 }}
          columns={[
            {
              title: 'Invoice #',
              dataIndex: 'invoiceNumber',
              key: 'invoiceNumber',
              render: (inv, r) => (
                <div>
                  <span
                    style={{
                      fontWeight: 800,
                      color: '#5421A8',
                      backgroundColor: '#F3EEFF',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedInvoice(r);
                      setIsPreviewModalOpen(true);
                    }}
                  >
                    {inv}
                  </span>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{r.billingType}</div>
                </div>
              ),
            },
            {
              title: 'Customer & GSTIN',
              dataIndex: 'customer',
              key: 'customer',
              render: (c, r) => (
                <div>
                  <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 13 }}>{c}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>GSTIN: {r.gstin}</div>
                </div>
              ),
            },
            {
              title: 'Invoice Date',
              dataIndex: 'date',
              key: 'date',
              render: (d) => <span style={{ fontSize: 12, color: '#4B5563' }}>{d}</span>,
            },
            {
              title: 'Due Date',
              dataIndex: 'dueDate',
              key: 'dueDate',
              render: (d) => <span style={{ fontSize: 12, color: '#0284C7', fontWeight: 600 }}>{d}</span>,
            },
            {
              title: 'Grand Total (inc. GST)',
              dataIndex: 'grandTotal',
              key: 'grandTotal',
              render: (v, r) => (
                <div>
                  <div style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>₹{v.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>Paid: ₹{r.paidAmount.toLocaleString()}</div>
                </div>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (st) => {
                const isPaid = st === 'Paid';
                const isPartiallyPaid = st === 'Partially Paid';
                const isOverdue = st === 'Overdue';
                const bg = isPaid ? '#DCFCE7' : isPartiallyPaid ? '#FEF3C7' : isOverdue ? '#FEE2E2' : '#F3F4F6';
                const color = isPaid ? '#15803D' : isPartiallyPaid ? '#B45309' : isOverdue ? '#DC2626' : '#6B7280';
                return (
                  <span
                    style={{
                      background: bg,
                      color: color,
                      padding: '3px 10px',
                      borderRadius: 14,
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
              title: 'Actions',
              key: 'actions',
              render: (_, r) => (
                <Space size={4}>
                  <Tooltip title="Preview & Print">
                    <Button
                      size="small"
                      type="text"
                      icon={<Printer size={14} color="#5421A8" />}
                      onClick={() => {
                        setSelectedInvoice(r);
                        setIsPreviewModalOpen(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Send via Email">
                    <Button
                      size="small"
                      type="text"
                      icon={<Mail size={14} color="#10B981" />}
                      onClick={() => message.success(`Invoice ${r.invoiceNumber} emailed to client billing contact!`)}
                    />
                  </Tooltip>
                  <Tooltip title="Record Payment">
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
                        padding: '0 8px',
                      }}
                      onClick={() => message.success(`Payment collection receipt generated for ${r.invoiceNumber}`)}
                    >
                      Receive
                    </Button>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </div>

      {/* CREATE INVOICE MODAL - PREMIUM REDESIGN */}
      <Modal
        title={null}
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        width={920}
        footer={null}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#FFFFFF' }}>
          {/* Modal Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2D1065 0%, #4C1D95 60%, #6D28D9 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Receipt size={22} color="#FFFFFF" strokeWidth={2.4} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Create Official GST Tax Invoice
                </h3>
                <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 }}>
                  GST Compliant Invoicing • Auto HSN/SAC Tax Computations • Universal Multi-Tenant Billing
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', padding: '24px' }}>
            {/* Top Config Cards */}
            <div
              style={{
                background: '#F9F8FD',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid #ECE8F6',
                marginBottom: 20,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.4px' }}>
                    Select Customer / Client
                  </div>
                  <Select
                    value={customer}
                    onChange={setCustomer}
                    style={{ width: '100%' }}
                    size="large"
                    options={[
                      { value: 'Apex Precision Tools Ltd', label: 'Apex Precision Tools Ltd (GSTIN: 33AABCA1234F1Z6)' },
                      { value: 'Metro Rail Consortium', label: 'Metro Rail Consortium (GSTIN: 33AAACM5541L1Z9)' },
                      { value: 'Omni Infra Ventures Ltd', label: 'Omni Infra Ventures Ltd (GSTIN: 29AABCO9922K1Z4)' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.4px' }}>
                    GST Jurisdiction
                  </div>
                  <Select
                    value={gstType}
                    onChange={setGstType}
                    style={{ width: '100%' }}
                    size="large"
                    options={[
                      { value: 'INTRA', label: 'Intra-State (CGST + SGST)' },
                      { value: 'INTER', label: 'Inter-State (IGST 18%)' },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.4px' }}>
                    Trade Discount (%)
                  </div>
                  <InputNumber
                    min={0}
                    max={50}
                    value={discountPercent}
                    onChange={(val) => setDiscountPercent(val || 0)}
                    style={{ width: '100%', borderRadius: 8 }}
                    size="large"
                    prefix={<span style={{ color: '#9CA3AF', fontSize: 12 }}>%</span>}
                  />
                </Col>
              </Row>
            </div>

            {/* Billed Items Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 16, background: '#7544D6', borderRadius: 2, display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Billed Products & Services
                </span>
                <Tag color="#7544D6" style={{ borderRadius: 12, fontSize: 10.5, fontWeight: 700, margin: 0, padding: '0 8px' }}>
                  {items.length} Items
                </Tag>
              </div>

              <Button
                type="dashed"
                icon={<Plus size={13} strokeWidth={2.5} />}
                onClick={addItemRow}
                style={{
                  borderColor: '#7544D6',
                  color: '#5421A8',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: 11.5,
                  padding: '0 14px',
                  height: 32,
                  background: '#F9F8FD',
                }}
              >
                Add Item Row
              </Button>
            </div>

            {/* Item Table */}
            <div
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid #ECE8F6',
                background: '#FFFFFF',
              }}
            >
              <Table
                size="middle"
                pagination={false}
                dataSource={items}
                columns={[
                  {
                    title: 'Item Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (text) => (
                      <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 13 }}>{text}</div>
                    ),
                  },
                  {
                    title: 'HSN / SAC',
                    dataIndex: 'hsnCode',
                    key: 'hsnCode',
                    width: 110,
                    render: (code) => (
                      <Tag style={{ background: '#F3F0F9', color: '#5421A8', border: '1px solid #ECE8F6', borderRadius: 6, fontWeight: 700, fontSize: 11 }}>
                        {code}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Qty',
                    dataIndex: 'qty',
                    key: 'qty',
                    width: 80,
                    align: 'center',
                    render: (qty) => <span style={{ fontWeight: 800, color: '#334155' }}>{qty}</span>,
                  },
                  {
                    title: 'Rate (₹)',
                    dataIndex: 'rate',
                    key: 'rate',
                    width: 120,
                    align: 'right',
                    render: (v) => <span style={{ fontWeight: 600, color: '#334155' }}>₹{v.toLocaleString()}</span>,
                  },
                  {
                    title: 'GST %',
                    dataIndex: 'gstRate',
                    key: 'gstRate',
                    width: 90,
                    align: 'center',
                    render: (v) => (
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6D28D9', background: '#F5F3FF', padding: '2px 8px', borderRadius: 10 }}>
                        {v}%
                      </span>
                    ),
                  },
                  {
                    title: 'Amount (₹)',
                    dataIndex: 'amount',
                    key: 'amount',
                    width: 140,
                    align: 'right',
                    render: (v) => (
                      <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 14 }}>
                        ₹{v.toLocaleString()}
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            {/* Calculations Breakdown Card & Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, gap: 20 }}>
              {/* Payment Terms Note */}
              <div
                style={{
                  flex: 1,
                  background: '#F9F8FD',
                  borderRadius: 14,
                  padding: '14px 18px',
                  border: '1px solid #ECE8F6',
                  fontSize: 11.5,
                  color: '#64748B',
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 700, color: '#1E1B4B', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} color="#16A34A" /> Statutory Invoicing Notes
                </div>
                Amounts calculated according to Central Goods and Services Tax Act 2017. Trade discount applies to base taxable value prior to SGST/CGST/IGST assessment.
              </div>

              {/* Total Calculation Capsule */}
              <div
                style={{
                  width: 340,
                  fontSize: 12.5,
                  background: 'linear-gradient(180deg, #FAF8FE 0%, #F5F1FD 100%)',
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: '1px solid #ECE8F6',
                  boxShadow: '0 6px 18px rgba(109, 40, 217, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Subtotal:</span>
                  <span style={{ fontWeight: 700, color: '#1E1B4B' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Trade Discount ({discountPercent}%):</span>
                  <span style={{ color: '#EF4444', fontWeight: 700 }}>-₹{discountAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Taxable Value:</span>
                  <span style={{ fontWeight: 700, color: '#1E1B4B' }}>₹{taxableAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>GST ({gstType === 'INTRA' ? 'CGST 9% + SGST 9%' : 'IGST 18%'}):</span>
                  <span style={{ color: '#6D28D9', fontWeight: 800 }}>₹{totalGst.toLocaleString()}</span>
                </div>
                <Divider style={{ margin: '10px 0', borderColor: '#E5E7EB' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B' }}>Grand Total Due:</span>
                  <span style={{ color: '#16A34A', fontSize: 18, fontWeight: 900 }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 12,
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid #ECE8F6',
              }}
            >
              <Button
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  borderRadius: 22,
                  height: 40,
                  padding: '0 22px',
                  fontWeight: 600,
                  fontSize: 13,
                  borderColor: '#E2E8F0',
                  color: '#475569',
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleCreateInvoice}
                icon={<Receipt size={16} />}
                style={{
                  background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
                  border: 'none',
                  borderRadius: 22,
                  height: 40,
                  padding: '0 26px',
                  fontWeight: 800,
                  fontSize: 13.5,
                  boxShadow: '0 6px 18px rgba(88, 28, 135, 0.35)',
                }}
              >
                Generate & Finalize Invoice
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* PREVIEW INVOICE MODAL */}
      <Modal
        title={selectedInvoice ? `Invoice Document: ${selectedInvoice.invoiceNumber}` : 'Invoice Preview'}
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        footer={null}
        width={650}
      >
        {selectedInvoice && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ECE8F6', paddingBottom: 14, marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, color: '#5421A8', fontWeight: 800 }}>{selectedCompany?.name || 'Enterprise Sales ERP'}</h3>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Tax Invoice & Accounts Ledger</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, color: '#1F2937', fontSize: 14 }}>{selectedInvoice.invoiceNumber}</span>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Date: {selectedInvoice.date}</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FAF9FE', padding: 14, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1F2937' }}>Billed To:</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#5421A8' }}>{selectedInvoice.customer}</div>
              <div style={{ fontSize: 11.5, color: '#6B7280' }}>GSTIN: {selectedInvoice.gstin}</div>
              <div style={{ fontSize: 11.5, color: '#0284C7', marginTop: 4 }}>Due Date: {selectedInvoice.dueDate}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0' }}>
              <span>Invoice Subtotal:</span>
              <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0' }}>
              <span>Total GST:</span>
              <span>₹{selectedInvoice.gst.toLocaleString()}</span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, padding: '8px 0' }}>
              <span>Grand Total:</span>
              <span style={{ color: '#10B981' }}>₹{selectedInvoice.grandTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <Button icon={<Printer size={14} />} onClick={() => message.success('Printing Tax Invoice...')}>
                Print Invoice
              </Button>
              <Button type="primary" icon={<Download size={14} />} style={{ background: '#5421A8', borderColor: '#5421A8' }} onClick={() => message.success('Downloading Official PDF...')}>
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
