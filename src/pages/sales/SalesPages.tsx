import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
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
  Tag as TagIcon,
  Building2,
  Mail,
  MapPin,
  Scale,
  Settings,
  Phone,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, StatusBadge, GenericCrudToolbar } from '../../components';
import {
  MOCK_LEADS,
  MOCK_ENQUIRIES,
  MOCK_QUOTATIONS,
  MOCK_SALES_ORDERS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  MOCK_RETURNS,
} from '../../mock/salesServiceData';
import type { Lead, Enquiry, Quotation, SalesOrder, Invoice, Payment, Customer, Product, ReturnItem } from '../../types';

// 1. CRM & Leads
export const SalesCrmPage: React.FC = () => {
  const [data, setData] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter((d) => d.companyName.toLowerCase().includes(search.toLowerCase()) || d.contactName.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (values: any) => {
    const newRecord: Lead = {
      id: 'lead-' + Date.now(),
      leadNumber: 'LD-2026-0' + (data.length + 1),
      contactName: values.contactName,
      companyName: values.companyName,
      email: values.email,
      phone: values.phone,
      source: values.source || 'Website',
      status: 'New',
      estimatedValue: Number(values.estimatedValue) || 100000,
      assignedTo: values.assignedTo || 'Unassigned',
      createdAt: '2026-11-16',
    };
    setData([newRecord, ...data]);
    message.success('New lead captured successfully!');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Lead ID', dataIndex: 'leadNumber', key: 'leadNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Contact Person', dataIndex: 'contactName', key: 'contactName', render: (t: string, r: Lead) => <div><div style={{ fontWeight: 600 }}>{t}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{r.email}</div></div> },
    { title: 'Organization', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Est. Deal Value', dataIndex: 'estimatedValue', key: 'estimatedValue', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
    { title: 'Lead Source', dataIndex: 'source', key: 'source', render: (s: string) => <Tag color="geekblue">{s}</Tag> },
    { title: 'Assigned Executive', dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: 'Pipeline Stage', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];

  return (
    <div>
      <PageHeader title="CRM & Pipeline Management" subtitle="Drive commercial opportunities, stage transitions, and deal forecasting." />
      <GenericCrudToolbar searchPlaceholder="Search by contact or company..." onSearch={setSearchTerm => setSearch(setSearchTerm)} onCreateNew={() => setModalOpen(true)} createButtonText="Capture New Lead" />
      <Table dataSource={filtered} columns={columns} rowKey="id" bordered />
      <Modal title="Capture New Commercial Lead" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Contact Name" name="contactName" rules={[{ required: true }]}><Input placeholder="Client contact name" /></Form.Item>
          <Form.Item label="Organization / Company" name="companyName" rules={[{ required: true }]}><Input placeholder="Client company name" /></Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input placeholder="contact@client.com" /></Form.Item>
          <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}><Input placeholder="+91 90000 00000" /></Form.Item>
          <Form.Item label="Estimated Value (INR)" name="estimatedValue" rules={[{ required: true }]}><Input type="number" placeholder="500000" /></Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}>Save Lead</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// 2. Enquiries
export const SalesEnquiriesPage: React.FC = () => {
  const [data] = useState<Enquiry[]>(MOCK_ENQUIRIES);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Enquiry #', dataIndex: 'enquiryNumber', key: 'enquiryNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Client Name', dataIndex: 'clientName', key: 'clientName' },
    { title: 'Subject Description', dataIndex: 'subject', key: 'subject' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <StatusBadge status={p} /> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
    { title: 'Received Date', dataIndex: 'date', key: 'date' },
  ];
  return (
    <div>
      <PageHeader title="Customer Enquiries" subtitle="Log and qualify incoming Request For Quotations (RFQs)." />
      <GenericCrudToolbar searchPlaceholder="Search enquiries..." onSearch={setSearch} />
      <Table dataSource={data.filter(d => d.clientName.toLowerCase().includes(search.toLowerCase()) || d.subject.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 3. Quotations
export const SalesQuotationsPage: React.FC = () => {
  const [data] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Quote #', dataIndex: 'quoteNumber', key: 'quoteNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate' },
    { title: 'Valid Until', dataIndex: 'validUntil', key: 'validUntil' },
    { title: 'Subtotal', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Grand Total (inc. Tax)', dataIndex: 'grandTotal', key: 'grandTotal', render: (v: number) => <span style={{ fontWeight: 700, color: '#51258C' }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Quotations & Proposals" subtitle="Generate commercial proposals, apply discounts, and track client approvals." />
      <GenericCrudToolbar searchPlaceholder="Search quotations..." onSearch={setSearch} createButtonText="Create Quotation" onCreateNew={() => message.info('Quotation draft creator opened')} />
      <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 4. Sales Orders
export const SalesOrdersPage: React.FC = () => {
  const [data] = useState<SalesOrder[]>(MOCK_SALES_ORDERS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Expected Delivery', dataIndex: 'expectedDelivery', key: 'expectedDelivery' },
    { title: 'Order Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (s: string) => <StatusBadge status={s} /> },
    { title: 'Fulfillment', dataIndex: 'deliveryStatus', key: 'deliveryStatus', render: (s: string) => <StatusBadge status={s} /> },
  ];
  return (
    <div>
      <PageHeader title="Confirmed Sales Orders" subtitle="Track approved client contracts and fulfillment progress." />
      <GenericCrudToolbar searchPlaceholder="Search sales orders..." onSearch={setSearch} />
      <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 5. Invoices
export const SalesInvoicesPage: React.FC = () => {
  const [data] = useState<Invoice[]>(MOCK_INVOICES);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Total Invoiced', dataIndex: 'amount', key: 'amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Balance Due', dataIndex: 'balanceDue', key: 'balanceDue', render: (v: number) => <span style={{ fontWeight: 700, color: v > 0 ? '#EF4444' : '#10B981' }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Sales Invoices & Billing" subtitle="GST-compliant billing, accounts receivable, and aging schedules." />
      <GenericCrudToolbar searchPlaceholder="Search invoices..." onSearch={setSearch} />
      <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 6. Payments
export const SalesPaymentsPage: React.FC = () => {
  const [data] = useState<Payment[]>(MOCK_PAYMENTS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Receipt #', dataIndex: 'receiptNumber', key: 'receiptNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Against Invoice', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Date', dataIndex: 'paymentDate', key: 'paymentDate' },
    { title: 'Method', dataIndex: 'paymentMethod', key: 'paymentMethod', render: (m: string) => <Tag color="blue">{m}</Tag> },
    { title: 'Amount Received', dataIndex: 'amount', key: 'amount', render: (v: number) => <span style={{ fontWeight: 700, color: '#10B981' }}>₹{v.toLocaleString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Payments & Receipts" subtitle="Record bank transfers, UPI transactions, credit collections, and reconciliation." />
      <GenericCrudToolbar searchPlaceholder="Search receipts..." onSearch={setSearch} />
      <Table dataSource={data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 7. Customers
export const SalesCustomersPage: React.FC = () => {
  const [data] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');

  const columns = [
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <TagIcon size={15} color="#3B0764" />
          Customer Code
        </span>
      ),
      dataIndex: 'code',
      key: 'code',
      render: (t: string) => (
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#F3E8FF',
            color: '#6D28D9',
            padding: '3px 12px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          {t}
        </span>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Building2 size={15} color="#3B0764" />
          Company Name
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (t: string, r: Customer) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{t}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Contact: {r.contactPerson}</div>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Mail size={15} color="#3B0764" />
          Email & Phone
        </span>
      ),
      key: 'contact',
      render: (_: any, r: Customer) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1E293B' }}>
            <Mail size={13} color="#6D28D9" />
            <span>{r.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#64748B', marginTop: 3 }}>
            <Phone size={13} color="#6D28D9" />
            <span style={{ fontFamily: 'monospace' }}>{r.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <MapPin size={15} color="#3B0764" />
          City
        </span>
      ),
      dataIndex: 'city',
      key: 'city',
      render: (city: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1E293B', fontWeight: 500 }}>
          <MapPin size={14} color="#6D28D9" />
          <span>{city}</span>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <CreditCard size={15} color="#3B0764" />
          Credit Limit
        </span>
      ),
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>
          ₹{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Scale size={15} color="#3B0764" />
          Current Balance
        </span>
      ),
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: '#6D28D9', fontSize: 13.5 }}>
          ₹{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Settings size={15} color="#3B0764" />
          Status
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            padding: '4px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              display: 'inline-block',
            }}
          />
          {st}
        </span>
      ),
    },
  ];

  const filteredData = data.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Customer Directory"
        subtitle="Comprehensive customer accounts, credit ceilings, and historical transaction logs."
      />
      <div style={{ marginBottom: 16 }}>
        <GenericCrudToolbar searchPlaceholder="Search customers..." onSearch={setSearch} />
      </div>

      <div
        style={{
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
          padding: '4px 8px 16px 8px',
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="customer-management-table"
        />

        {/* Bottom Pagination Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px 4px 20px',
            borderTop: '1px solid #F1F5F9',
            marginTop: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            <BarChart3 size={16} color="#6D28D9" />
            <span>Showing 1 – {filteredData.length} of {filteredData.length} customers</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94A3B8',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94A3B8',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Products & Inventory
export const SalesProductsPage: React.FC = () => {
  const [data] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'SKU Code', dataIndex: 'sku', key: 'sku', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Product Name', dataIndex: 'name', key: 'name', render: (t: string, r: Product) => <div><div style={{ fontWeight: 600 }}>{t}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{r.brand} &bull; {r.category}</div></div> },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
    { title: 'Stock Available', dataIndex: 'stockQty', key: 'stockQty', render: (q: number) => <span style={{ fontWeight: 600 }}>{q} Units</span> },
    { title: 'Inventory State', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Product Catalog & SKUs" subtitle="Commercial product catalog, cost margins, and selling price lists." />
      <GenericCrudToolbar searchPlaceholder="Search products by name or SKU..." onSearch={setSearch} />
      <Table dataSource={data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 9. Returns
export const SalesReturnsPage: React.FC = () => {
  const [data] = useState<ReturnItem[]>(MOCK_RETURNS);
  const columns = [
    { title: 'Return #', dataIndex: 'returnNumber', key: 'returnNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
    { title: 'Against Order', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', render: (r: string) => <Tag color="orange">{r}</Tag> },
    { title: 'Claim Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Sales Returns & RMA" subtitle="Manage defective product returns, credit notes, and inspection workflows." />
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 10. Team & Reports
export const SalesTeamPage: React.FC = () => {
  return (
    <div>
      <PageHeader title="Sales Team & Territories" subtitle="Territory allocation, quotas, and sales representative performance." />
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 8, border: '1px solid #E8E0F0' }}>
        <p style={{ margin: 0, color: '#5C526A' }}>Sales reps assigned: 12 executives active in Tamil Nadu, Karnataka, and Maharashtra regions.</p>
      </div>
    </div>
  );
};

export const SalesReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader title="Sales Analytics & Revenue Reports" subtitle="Monthly recurring revenue, deal velocity, pipeline health, and customer churn." />
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 8, border: '1px solid #E8E0F0' }}>
        <p style={{ margin: 0, color: '#5C526A' }}>Monthly sales forecast at ₹48.5L with 28.4% pipeline win conversion.</p>
      </div>
    </div>
  );
};
