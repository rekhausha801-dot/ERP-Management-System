import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  InputNumber,
  Divider,
  message,
  Space,
} from 'antd';
import {
  Plus,
  Trash2,
  FileText,
  Save,
  Send,
  Printer,
  ChevronRight,
  ArrowLeft,
  Building,
  User,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { InvoiceLineItem, CustomerInvoice } from './billingData';

const BRAND_PURPLE = '#5421A8';

interface ProductPreset {
  id: string;
  name: string;
  sku: string;
  hsn: string;
  price: number;
  tax: number;
  unit: string;
}

const AVAILABLE_PRODUCTS: ProductPreset[] = [
  { id: 'P1', name: 'Siemens 3-Phase Induction Motor 15HP', sku: 'MTR-SIEM-15HP', hsn: '850152', price: 38500, tax: 18, unit: 'Units' },
  { id: 'P2', name: 'ABB Variable Frequency Drive 11kW', sku: 'DRV-ABB-11KW', hsn: '850440', price: 52000, tax: 18, unit: 'Units' },
  { id: 'P3', name: 'Schneider Modicon PLC Controller', sku: 'PLC-SCH-M221', hsn: '853710', price: 28000, tax: 18, unit: 'Units' },
  { id: 'P4', name: 'Rexroth Hydraulic Valve proportional 24V', sku: 'VLV-REX-PROP24', hsn: '848120', price: 19500, tax: 18, unit: 'Units' },
  { id: 'P5', name: 'Castrol Industrial Synthetic Lubricant 200L', sku: 'LUB-CAS-200L', hsn: '271019', price: 48000, tax: 18, unit: 'Barrels' },
  { id: 'P6', name: 'Annual Hydraulic AMC Service Pack', sku: 'SRV-HYD-AMC', hsn: '998719', price: 125000, tax: 18, unit: 'Service' },
];

const CUSTOMER_OPTIONS = [
  {
    code: 'CUST-1001',
    name: 'Apex Industrial Dynamics Ltd',
    gstin: '33AABCA1234F1Z8',
    person: 'Karthik Raja',
    email: 'finance@apexind.com',
    phone: '+91 98401 23456',
    address: '42 Ambattur Industrial Estate, Chennai 600058',
    state: 'Tamil Nadu',
  },
  {
    code: 'CUST-1002',
    name: 'TechVanguard Engineering Solutions',
    gstin: '33AABCT9876C1Z4',
    person: 'Suresh Menon',
    email: 'procure@techvanguard.in',
    phone: '+91 94440 98765',
    address: '15 Guindy Industrial Area, Chennai 600032',
    state: 'Tamil Nadu',
  },
  {
    code: 'CUST-1003',
    name: 'Kovai Precision Castings Pvt Ltd',
    gstin: '33AAACK4455B1Z9',
    person: 'Natarajan S',
    email: 'accounts@kovaicast.com',
    phone: '+91 97890 11223',
    address: '78 Foundry Road, Peelamedu, Coimbatore 641004',
    state: 'Tamil Nadu',
  },
  {
    code: 'CUST-1004',
    name: 'Delta Robotics & Automations',
    gstin: '29AABCD1122E1Z2',
    person: 'Gautam Rao',
    email: 'billing@deltarobotics.io',
    phone: '+91 98840 55443',
    address: 'Plot 22 Whitefield Tech Zone, Bengaluru 560066',
    state: 'Karnataka',
  },
];

export const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Line items state
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'ITM-INIT-1',
      name: 'Siemens 3-Phase Induction Motor 15HP',
      sku: 'MTR-SIEM-15HP',
      hsnSac: '850152',
      quantity: 2,
      unit: 'Units',
      unitPrice: 38500,
      discountPercent: 0,
      taxRate: 18,
      taxAmount: 13860,
      lineTotal: 90860,
    },
  ]);

  const [shippingCharges, setShippingCharges] = useState<number>(1500);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0);
  const [selectedCustomerState, setSelectedCustomerState] = useState<string>('Tamil Nadu');

  // Customer Selection Handler
  const handleCustomerSelect = (customerCode: string) => {
    const cust = CUSTOMER_OPTIONS.find((c) => c.code === customerCode);
    if (cust) {
      setSelectedCustomerState(cust.state);
      form.setFieldsValue({
        customerName: cust.name,
        contactPerson: cust.person,
        customerEmail: cust.email,
        customerPhone: cust.phone,
        gstin: cust.gstin,
        billingAddress: cust.address,
        shippingAddress: cust.address,
      });
    }
  };

  // Add Item
  const handleAddItem = (productId: string) => {
    const p = AVAILABLE_PRODUCTS.find((prod) => prod.id === productId);
    if (!p) return;

    const qty = 1;
    const base = p.price * qty;
    const taxAmt = (base * p.tax) / 100;
    const total = base + taxAmt;

    const newItem: InvoiceLineItem = {
      id: `ITM-${Date.now()}`,
      name: p.name,
      sku: p.sku,
      hsnSac: p.hsn,
      quantity: qty,
      unit: p.unit,
      unitPrice: p.price,
      discountPercent: 0,
      taxRate: p.tax,
      taxAmount: taxAmt,
      lineTotal: total,
    };

    setItems([...items, newItem]);
  };

  // Update item field
  const updateItem = (id: string, field: keyof InvoiceLineItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          const base = updated.quantity * updated.unitPrice;
          const disc = (base * (updated.discountPercent || 0)) / 100;
          const taxable = base - disc;
          const taxAmt = (taxable * (updated.taxRate || 0)) / 100;
          updated.taxAmount = taxAmt;
          updated.lineTotal = taxable + taxAmt;
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  const itemDiscounts = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice * i.discountPercent) / 100, 0);
  const taxableAmount = Math.max(0, subtotal - itemDiscounts - additionalDiscount);

  // Intra-state (CGST + SGST) vs Inter-state (IGST)
  const isInterState = selectedCustomerState !== 'Tamil Nadu';
  const totalTax = items.reduce((acc, i) => acc + i.taxAmount, 0);
  const cgst = isInterState ? 0 : totalTax / 2;
  const sgst = isInterState ? 0 : totalTax / 2;
  const igst = isInterState ? totalTax : 0;

  const rawGrandTotal = taxableAmount + totalTax + shippingCharges;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  const handleSaveInvoice = (status: 'Draft' | 'Sent') => {
    if (items.length === 0) {
      message.error('Please add at least one line item to generate invoice.');
      return;
    }

    form.validateFields().then((vals) => {
      message.success(`Invoice ${status === 'Draft' ? 'saved as Draft' : 'Generated & Sent'} successfully!`);
      navigate('/app/finance/invoices');
    });
  };

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* 1. Header with Breadcrumb */}
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
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/app/finance/invoices')}>
              Invoice & Billing
            </span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Create Invoice</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            New Tax & Commercial Invoice
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Generate compliant GST invoices for products, deliveries, and service maintenance contracts
          </p>
        </div>

        <Space>
          <Button icon={<ArrowLeft size={15} />} onClick={() => navigate('/app/finance/invoices')}>
            Back to Invoices
          </Button>
          <Button icon={<Save size={15} />} onClick={() => handleSaveInvoice('Draft')}>
            Save as Draft
          </Button>
          <Button
            type="primary"
            icon={<Send size={15} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => handleSaveInvoice('Sent')}
          >
            Generate & Issue Invoice
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceType: 'Sales Invoice',
          invoiceDate: dayjs(),
          dueDate: dayjs().add(15, 'day'),
          branch: 'Chennai HQ',
          salesperson: 'Priya Sharma',
          customerCode: 'CUST-1001',
          customerName: 'Apex Industrial Dynamics Ltd',
          gstin: '33AABCA1234F1Z8',
          contactPerson: 'Karthik Raja',
          customerEmail: 'finance@apexind.com',
          customerPhone: '+91 98401 23456',
          billingAddress: '42 Ambattur Industrial Estate, Chennai 600058',
          shippingAddress: '42 Ambattur Industrial Estate, Chennai 600058',
          paymentTerms: 'Net 15 Days',
          salesOrderRef: 'SO-2026-105',
          termsConditions: '1. Goods once sold will not be accepted without inspection. 2. Interest @ 18% p.a. charged after due date.',
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Section A: Invoice Information */}
          <Col xs={24} lg={12}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 22px',
                border: '1px solid #ECE6F8',
                boxShadow: '0 4px 16px rgba(84, 33, 168, 0.03)',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <FileText size={18} color={BRAND_PURPLE} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  A. Invoice Information
                </h3>
              </div>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Invoice Number" name="invoiceNumber" rules={[{ required: true }]}>
                    <Input style={{ fontWeight: 700 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Invoice Type" name="invoiceType" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { value: 'Sales Invoice', label: 'Sales Invoice' },
                        { value: 'Service Invoice', label: 'Service Invoice' },
                        { value: 'Tax Invoice', label: 'Tax Invoice' },
                        { value: 'Proforma Invoice', label: 'Proforma Invoice' },
                        { value: 'Recurring Invoice', label: 'Recurring Invoice' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Invoice Date" name="invoiceDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Branch Location" name="branch" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { value: 'Chennai HQ', label: 'Chennai HQ' },
                        { value: 'Coimbatore Hub', label: 'Coimbatore Hub' },
                        { value: 'Bengaluru Hub', label: 'Bengaluru Hub' },
                        { value: 'Madurai Hub', label: 'Madurai Hub' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Related Sales Order" name="salesOrderRef">
                    <Input placeholder="e.g. SO-2026-105" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Section B: Customer Information */}
          <Col xs={24} lg={12}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 22px',
                border: '1px solid #ECE6F8',
                boxShadow: '0 4px 16px rgba(84, 33, 168, 0.03)',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Building size={18} color={BRAND_PURPLE} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  B. Customer & Billing Entity
                </h3>
              </div>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Select Customer" name="customerCode" rules={[{ required: true }]}>
                    <Select
                      onChange={handleCustomerSelect}
                      options={CUSTOMER_OPTIONS.map((c) => ({
                        value: c.code,
                        label: `${c.name} (${c.code})`,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Customer GSTIN" name="gstin">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Contact Person" name="contactPerson">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone Number" name="customerPhone">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Billing Address" name="billingAddress">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Shipping Address" name="shippingAddress">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Section C: Product / Service Line Items */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '22px 24px',
            border: '1px solid #ECE6F8',
            boxShadow: '0 4px 16px rgba(84, 33, 168, 0.03)',
            marginTop: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              C. Product & Service Line Items
            </h3>

            <Space>
              <Select
                placeholder="Add Catalog Product..."
                style={{ width: 280 }}
                onChange={handleAddItem}
                options={AVAILABLE_PRODUCTS.map((p) => ({
                  value: p.id,
                  label: `${p.name} (₹${p.price.toLocaleString('en-IN')})`,
                }))}
              />
            </Space>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Product / Description</th>
                <th style={{ padding: '10px 12px', width: 110 }}>HSN/SAC</th>
                <th style={{ padding: '10px 12px', width: 90, textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '10px 12px', width: 130, textAlign: 'right' }}>Unit Price (₹)</th>
                <th style={{ padding: '10px 12px', width: 90, textAlign: 'right' }}>Disc %</th>
                <th style={{ padding: '10px 12px', width: 90, textAlign: 'right' }}>GST %</th>
                <th style={{ padding: '10px 12px', width: 130, textAlign: 'right' }}>Tax (₹)</th>
                <th style={{ padding: '10px 12px', width: 140, textAlign: 'right' }}>Total (₹)</th>
                <th style={{ padding: '10px 12px', width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>SKU: {item.sku}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Input
                      size="small"
                      value={item.hsnSac}
                      onChange={(e) => updateItem(item.id, 'hsnSac', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <InputNumber
                      size="small"
                      min={1}
                      value={item.quantity}
                      onChange={(v) => updateItem(item.id, 'quantity', v || 1)}
                      style={{ width: 70 }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <InputNumber
                      size="small"
                      min={0}
                      value={item.unitPrice}
                      onChange={(v) => updateItem(item.id, 'unitPrice', v || 0)}
                      style={{ width: 110 }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <InputNumber
                      size="small"
                      min={0}
                      max={100}
                      value={item.discountPercent}
                      onChange={(v) => updateItem(item.id, 'discountPercent', v || 0)}
                      style={{ width: 65 }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <Select
                      size="small"
                      value={item.taxRate}
                      onChange={(v) => updateItem(item.id, 'taxRate', v)}
                      options={[
                        { value: 0, label: '0%' },
                        { value: 5, label: '5%' },
                        { value: 12, label: '12%' },
                        { value: 18, label: '18%' },
                        { value: 28, label: '28%' },
                      ]}
                      style={{ width: 75 }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                    ₹{item.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                    ₹{item.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<Trash2 size={14} />}
                      onClick={() => removeItem(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section D: Invoice Calculation & Terms */}
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={14}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: '20px 22px',
                border: '1px solid #ECE6F8',
                height: '100%',
              }}
            >
              <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                E. Terms & Payment Instructions
              </h3>

              <Form.Item label="Payment Terms & Mode" name="paymentTerms">
                <Select
                  options={[
                    { value: 'Net 15 Days', label: 'Net 15 Days' },
                    { value: 'Net 30 Days', label: 'Net 30 Days' },
                    { value: 'Immediate Payment', label: 'Immediate Payment' },
                    { value: '50% Advance, 50% on Delivery', label: '50% Advance, 50% on Delivery' },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Terms & Conditions" name="termsConditions">
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div
              style={{
                background: '#FAF8FF',
                borderRadius: 20,
                padding: '22px 24px',
                border: '1px solid #E9D5FF',
              }}
            >
              <h3 style={{ margin: '0 0 14px 0', fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                Invoice Total Summary
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Gross Item Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {itemDiscounts > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#16A34A' }}>
                  <span>Line Item Discounts:</span>
                  <span>- ₹{itemDiscounts.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Taxable Amount:</span>
                <span style={{ fontWeight: 700 }}>₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {isInterState ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>IGST (Integrated Tax):</span>
                  <span style={{ fontWeight: 600 }}>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#64748B' }}>CGST (Central Tax 9%):</span>
                    <span style={{ fontWeight: 600 }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#64748B' }}>SGST (State Tax 9%):</span>
                    <span style={{ fontWeight: 600 }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Shipping & Freight (₹):</span>
                <InputNumber
                  size="small"
                  min={0}
                  value={shippingCharges}
                  onChange={(v) => setShippingCharges(v || 0)}
                  style={{ width: 110 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Round Off:</span>
                <span style={{ fontWeight: 600 }}>₹{roundOff}</span>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Grand Total (INR):</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: BRAND_PURPLE }}>
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateInvoicePage;
