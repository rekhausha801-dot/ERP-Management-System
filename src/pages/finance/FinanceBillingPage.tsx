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
  DatePicker,
  Divider,
  Typography,
  message,
  Tabs,
  Badge,
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
} from 'lucide-react';
import { PageHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';
import type { ErpPackageId } from '../../config/erpPackageConfig';

const { Title, Text } = Typography;

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Line items for creation
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      key: '1',
      description: '3-Phase Frequency Inverter 15kW',
      type: 'Product',
      hsnCode: '85044090',
      qty: 2,
      rate: 45000,
      gstRate: 18,
      amount: 90000,
    },
  ]);

  const [customer, setCustomer] = useState('Apex Precision Tools Ltd');
  const [gstType, setGstType] = useState<'INTRA' | 'INTER'>('INTRA'); // INTRA: CGST+SGST, INTER: IGST
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  // Calculation formulas
  const subtotal = items.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const totalGst = items.reduce((acc, curr) => {
    const itemNet = (curr.qty * curr.rate) * (1 - discountPercent / 100);
    return acc + (itemNet * curr.gstRate) / 100;
  }, 0);
  const cgst = gstType === 'INTRA' ? totalGst / 2 : 0;
  const sgst = gstType === 'INTRA' ? totalGst / 2 : 0;
  const igst = gstType === 'INTER' ? totalGst : 0;
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
      billingType: 'Sales GST Invoice',
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
      billingType: 'Service & Labour Billing',
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
      billingType: 'Sales GST Invoice (Interstate)',
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
      billingType: 'Comprehensive AMC Renewal',
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
      billingType: 'Proforma Quotation Bill',
      subtotal: 95000,
      gst: 17100,
      grandTotal: 112100,
      paidAmount: 0,
      status: 'Draft',
      category: 'Sales',
    },
  ]);

  // Package Filter for billing
  const filteredInvoices = invoices.filter((inv) => {
    if (currentPkg === 'SALES' && inv.category === 'Service') return false;
    if (currentPkg === 'SERVICE' && inv.category === 'Sales') return false;
    if (activeTab === 'sales') return inv.category === 'Sales';
    if (activeTab === 'service') return inv.category === 'Service';
    if (activeTab === 'unpaid') return inv.status === 'Partially Paid' || inv.status === 'Overdue';
    return true;
  });

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
      billingType: 'Sales GST Tax Invoice',
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
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Finance & Billing Management"
        subtitle="End-to-end GST tax invoicing, payment reconciliation, recurring billings, and accounts receivable."
        actions={
          <Space>
            <Button icon={<FileText size={14} />} onClick={() => message.info('Exporting Tax Ledger...')}>
              GST Report (GSTR-1)
            </Button>
            <Button
              type="primary"
              icon={<Plus size={14} />}
              style={{ backgroundColor: '#6E56CF', borderRadius: 10, fontWeight: 700 }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Invoice
            </Button>
          </Space>
        }
      />

      {/* 4 Primary Billing KPI Metric Cards */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Total Invoiced Amount</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>₹9,20,700</div>
            <Tag color="purple" style={{ marginTop: 6, borderRadius: 8 }}>This Month</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Realized / Paid Amount</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', marginTop: 4 }}>₹3,62,700</div>
            <Tag color="green" style={{ marginTop: 6, borderRadius: 8 }}>39.4% Collected</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Pending Receivables</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>₹5,58,000</div>
            <Tag color="gold" style={{ marginTop: 6, borderRadius: 8 }}>Under 30 Days Credit</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Overdue Invoices</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#EF4444', marginTop: 4 }}>₹4,95,600</div>
            <Tag color="error" style={{ marginTop: 6, borderRadius: 8 }}>1 Actionable Alert</Tag>
          </Card>
        </Col>
      </Row>

      {/* Main Billing Table & Filters */}
      <Card
        bordered={false}
        style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
        styles={{ body: { padding: '16px 20px 24px' } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Invoices (${filteredInvoices.length})` },
            ...(currentPkg !== 'SERVICE' ? [{ key: 'sales', label: 'Commercial Sales Invoices' }] : []),
            ...(currentPkg !== 'SALES' ? [{ key: 'service', label: 'Service & AMC Billings' }] : []),
            { key: 'unpaid', label: 'Unpaid & Overdue' },
          ]}
        />

        <Table
          dataSource={filteredInvoices}
          pagination={{ pageSize: 6 }}
          columns={[
            {
              title: 'Invoice #',
              dataIndex: 'invoiceNumber',
              key: 'invoiceNumber',
              render: (inv, r) => (
                <div>
                  <span style={{ fontWeight: 800, color: '#6E56CF', cursor: 'pointer' }} onClick={() => { setSelectedInvoice(r); setIsPreviewModalOpen(true); }}>
                    {inv}
                  </span>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>{r.billingType}</div>
                </div>
              ),
            },
            {
              title: 'Customer & GSTIN',
              dataIndex: 'customer',
              key: 'customer',
              render: (c, r) => (
                <div>
                  <div style={{ fontWeight: 700, color: '#181433' }}>{c}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>GSTIN: {r.gstin}</div>
                </div>
              ),
            },
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
            {
              title: 'Total Amount (inc. GST)',
              dataIndex: 'grandTotal',
              key: 'grandTotal',
              render: (v, r) => (
                <div>
                  <div style={{ fontWeight: 800, color: '#181433' }}>₹{v.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: '#10B981' }}>Paid: ₹{r.paidAmount.toLocaleString()}</div>
                </div>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (st) => (
                <Tag
                  color={st === 'Paid' ? 'green' : st === 'Partially Paid' ? 'blue' : st === 'Overdue' ? 'red' : 'default'}
                  style={{ borderRadius: 10, fontWeight: 700 }}
                >
                  {st}
                </Tag>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, r) => (
                <Space size="small">
                  <Tooltip title="Preview & Print">
                    <Button
                      size="small"
                      icon={<Printer size={13} color="#6E56CF" />}
                      onClick={() => { setSelectedInvoice(r); setIsPreviewModalOpen(true); }}
                    />
                  </Tooltip>
                  <Tooltip title="Send via Email">
                    <Button size="small" icon={<Mail size={13} color="#10B981" />} onClick={() => message.success(`Invoice ${r.invoiceNumber} emailed to client!`)} />
                  </Tooltip>
                  <Tooltip title="Record Payment">
                    <Button
                      size="small"
                      type="primary"
                      style={{ backgroundColor: '#6E56CF', borderRadius: 8, fontSize: 11 }}
                      onClick={() => message.success(`Payment recorded for ${r.invoiceNumber}`)}
                    >
                      Receive
                    </Button>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* CREATE INVOICE MODAL */}
      <Modal
        title="Create Official GST Tax Invoice"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        width={850}
        onOk={handleCreateInvoice}
        okText="Generate & Finalize Invoice"
        okButtonProps={{ style: { backgroundColor: '#6E56CF', borderRadius: 10 } }}
      >
        <div style={{ maxHeight: '68vh', overflowY: 'auto', paddingRight: 6 }}>
          {/* Header Customer Info */}
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 4 }}>Select Customer</div>
              <Select
                value={customer}
                onChange={setCustomer}
                style={{ width: '100%', marginBottom: 12 }}
                options={[
                  { value: 'Apex Precision Tools Ltd', label: 'Apex Precision Tools Ltd (GSTIN: 33AABCA1234F1Z6)' },
                  { value: 'Metro Rail Consortium', label: 'Metro Rail Consortium (GSTIN: 33AAACM5541L1Z9)' },
                  { value: 'Southern Automation Works', label: 'Southern Automation Works (GSTIN: 33AAECS4412M1Z0)' },
                ]}
              />
            </Col>
            <Col span={6}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 4 }}>GST Type</div>
              <Select
                value={gstType}
                onChange={setGstType}
                style={{ width: '100%', marginBottom: 12 }}
                options={[
                  { value: 'INTRA', label: 'Intrastate (CGST 9% + SGST 9%)' },
                  { value: 'INTER', label: 'Interstate (IGST 18%)' },
                ]}
              />
            </Col>
            <Col span={6}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 4 }}>Invoice Date</div>
              <DatePicker style={{ width: '100%', marginBottom: 12 }} defaultValue={undefined} />
            </Col>
          </Row>

          <Divider style={{ margin: '10px 0 16px' }} />

          {/* Line Items Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 800, color: '#181433' }}>Billed Line Items (Products, Labour & Spares)</span>
            <Button size="small" icon={<Plus size={12} />} onClick={addItemRow} style={{ borderRadius: 8 }}>
              Add Line Item
            </Button>
          </div>

          <Table
            dataSource={items}
            pagination={false}
            size="small"
            columns={[
              { title: 'Item Description', dataIndex: 'description', key: 'desc', render: (t) => <span style={{ fontWeight: 600 }}>{t}</span> },
              { title: 'Type', dataIndex: 'type', key: 'type', render: (tp) => <Tag color="blue">{tp}</Tag> },
              { title: 'HSN/SAC', dataIndex: 'hsnCode', key: 'hsn' },
              { title: 'Qty', dataIndex: 'qty', key: 'qty' },
              { title: 'Rate (₹)', dataIndex: 'rate', key: 'rate', render: (r) => `₹${r.toLocaleString()}` },
              { title: 'GST %', dataIndex: 'gstRate', key: 'gst', render: (g) => `${g}%` },
              { title: 'Total (₹)', dataIndex: 'amount', key: 'amt', render: (a) => <strong>₹{a.toLocaleString()}</strong> },
            ]}
          />

          <Divider style={{ margin: '16px 0 12px' }} />

          {/* Tax Summary Calculation Grid */}
          <Row justify="end">
            <Col span={10}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#7E7A9B' }}>Subtotal:</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#7E7A9B' }}>Discount ({discountPercent}%):</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>-₹{discountAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                <span style={{ color: '#7E7A9B' }}>Taxable Value:</span>
                <span style={{ fontWeight: 700 }}>₹{taxableAmount.toLocaleString()}</span>
              </div>

              {gstType === 'INTRA' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                    <span style={{ color: '#7E7A9B' }}>CGST (9%):</span>
                    <span style={{ fontWeight: 700 }}>₹{cgst.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                    <span style={{ color: '#7E7A9B' }}>SGST (9%):</span>
                    <span style={{ fontWeight: 700 }}>₹{sgst.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                  <span style={{ color: '#7E7A9B' }}>IGST (18%):</span>
                  <span style={{ fontWeight: 700 }}>₹{igst.toLocaleString()}</span>
                </div>
              )}

              <Divider style={{ margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 16 }}>
                <span style={{ fontWeight: 800, color: '#181433' }}>Grand Total:</span>
                <span style={{ fontWeight: 800, color: '#6E56CF' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* PREVIEW & PRINT INVOICE MODAL */}
      <Modal
        title={`Tax Invoice Preview: ${selectedInvoice?.invoiceNumber || ''}`}
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        width={750}
        footer={[
          <Button key="close" onClick={() => setIsPreviewModalOpen(false)}>Close</Button>,
          <Button key="pdf" icon={<Download size={13} />} onClick={() => message.success('Exported to Official PDF')}>Download PDF</Button>,
          <Button key="print" type="primary" icon={<Printer size={13} />} style={{ backgroundColor: '#6E56CF' }} onClick={() => message.success('Printing Invoice...')}>Print</Button>,
        ]}
      >
        {selectedInvoice && (
          <div style={{ padding: '16px', border: '1px solid #EAE6F4', borderRadius: 12, backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6E56CF', paddingBottom: 14 }}>
              <div>
                <Title level={4} style={{ margin: 0, color: '#181433', fontWeight: 800 }}>{selectedCompany?.name || 'ABC Traders Ltd'}</Title>
                <div style={{ fontSize: 12, color: '#7E7A9B' }}>Universal Multi-Tenant Industrial Solutions</div>
                <div style={{ fontSize: 11, color: '#181433', marginTop: 4 }}>GSTIN: 33AAACG9014K1Z2 &bull; State: Tamil Nadu (33)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Tag color="purple" style={{ fontSize: 12, fontWeight: 800, padding: '3px 10px' }}>TAX INVOICE</Tag>
                <div style={{ fontWeight: 800, color: '#6E56CF', fontSize: 14, marginTop: 4 }}>{selectedInvoice.invoiceNumber}</div>
                <div style={{ fontSize: 11, color: '#7E7A9B' }}>Date: {selectedInvoice.date}</div>
              </div>
            </div>

            <Row gutter={16} style={{ marginTop: 14, marginBottom: 14 }}>
              <Col span={12}>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 700, textTransform: 'uppercase' }}>Billed To:</div>
                <div style={{ fontWeight: 700, color: '#181433', marginTop: 2 }}>{selectedInvoice.customer}</div>
                <div style={{ fontSize: 11, color: '#7E7A9B' }}>GSTIN: {selectedInvoice.gstin}</div>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 700, textTransform: 'uppercase' }}>Payment Status:</div>
                <div style={{ fontWeight: 800, color: selectedInvoice.status === 'Paid' ? '#10B981' : '#EF4444', marginTop: 2 }}>
                  {selectedInvoice.status.toUpperCase()}
                </div>
              </Col>
            </Row>

            <div style={{ padding: '12px', backgroundColor: '#FAF8FC', borderRadius: 8, textAlign: 'right', marginTop: 14 }}>
              <span style={{ fontSize: 13, color: '#7E7A9B', marginRight: 12 }}>Invoice Total Amount:</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#6E56CF' }}>₹{selectedInvoice.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
