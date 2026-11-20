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
  Modal,
  Tag,
  Switch,
  Upload,
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
  ShieldCheck,
  Package,
  Layers,
  Percent,
  FileCheck,
  AlertCircle,
  Truck,
  UploadCloud,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { InvoiceLineItem, CustomerInvoice } from './billingData';

// Premium Purple ERP Theme
const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#E9D5FF';
const TEXT_DARK = '#0F172A';

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
    stateCode: '33',
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
    stateCode: '33',
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
    stateCode: '33',
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
    stateCode: '29',
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
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(0);
  const [selectedCustomerState, setSelectedCustomerState] = useState<string>('Tamil Nadu');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

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
        placeOfSupply: `${cust.state} (${cust.stateCode})`,
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

  // Dynamic GST & Totals Calculations
  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
  const itemDiscounts = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice * i.discountPercent) / 100, 0);
  const taxableAmount = Math.max(0, subtotal - itemDiscounts - additionalDiscount);

  // Intra-state (CGST + SGST) vs Inter-state (IGST)
  const isInterState = selectedCustomerState !== 'Tamil Nadu';
  const totalTax = items.reduce((acc, i) => acc + i.taxAmount, 0);
  const cgst = isInterState ? 0 : totalTax / 2;
  const sgst = isInterState ? 0 : totalTax / 2;
  const igst = isInterState ? totalTax : 0;

  const rawGrandTotal = taxableAmount + totalTax + shippingCharges + otherCharges;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  const handleSaveInvoice = (status: 'Draft' | 'Sent') => {
    if (items.length === 0) {
      message.error('Please add at least one line item to generate invoice.');
      return;
    }

    form.validateFields().then((vals) => {
      const generatedInvoice: CustomerInvoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: vals.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceType: vals.invoiceType || 'Sales Invoice',
        customerCode: vals.customerCode || 'CUST-1001',
        customerName: vals.customerName || 'Apex Industrial Dynamics Ltd',
        contactPerson: vals.contactPerson || 'Karthik Raja',
        customerEmail: vals.customerEmail || 'finance@apexind.com',
        customerPhone: vals.customerPhone || '+91 98401 23456',
        gstin: vals.gstin || '33AABCA1234F1Z8',
        billingAddress: vals.billingAddress || '42 Ambattur Industrial Estate, Chennai 600058',
        shippingAddress: vals.shippingAddress || vals.billingAddress || '42 Ambattur Industrial Estate, Chennai 600058',
        salesOrderRef: vals.salesOrderRef || 'SO-2026-105',
        branch: vals.branch || 'Chennai HQ',
        salesperson: vals.salesperson || 'Priya Sharma',
        invoiceDate: vals.invoiceDate ? vals.invoiceDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        dueDate: vals.dueDate ? vals.dueDate.format('YYYY-MM-DD') : dayjs().add(15, 'day').format('YYYY-MM-DD'),
        items: items,
        subtotal: subtotal,
        itemDiscount: itemDiscounts,
        additionalDiscount: additionalDiscount,
        taxableAmount: taxableAmount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        cess: 0,
        shippingCharges: shippingCharges,
        additionalCharges: otherCharges,
        roundOff: roundOff,
        grandTotal: grandTotal,
        paidAmount: 0,
        balanceDue: grandTotal,
        paymentStatus: 'Unpaid',
        status: status,
        paymentTerms: vals.paymentTerms || 'Net 15 Days',
        notes: vals.customerNotes || 'Goods delivered with standard manufacturer warranty.',
        termsConditions: vals.termsConditions,
      };

      // Save to localStorage
      const existingRaw = localStorage.getItem('erp_invoices_list_v2');
      const existing: CustomerInvoice[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('erp_invoices_list_v2', JSON.stringify([generatedInvoice, ...existing]));

      message.success(`Invoice ${generatedInvoice.invoiceNumber} ${status === 'Draft' ? 'saved as Draft' : 'Generated & Sent'} successfully!`);
      navigate('/app/sales/invoices');
    });
  };

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header with Breadcrumb and Action Buttons */}
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
            <FileText size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Create Customer Invoice
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Generate compliant GST tax invoices, billing manifests, line items, and payment instructions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate('/app/sales/invoices')}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#475569' }}
          >
            Back
          </Button>
          <Button
            icon={<FileCheck size={14} />}
            onClick={() => setIsPreviewOpen(true)}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
          >
            Preview Invoice
          </Button>
          <Button
            icon={<Save size={14} />}
            onClick={() => handleSaveInvoice('Draft')}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            icon={<Send size={15} />}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 18px',
            }}
            onClick={() => handleSaveInvoice('Sent')}
          >
            Generate & Send
          </Button>
        </div>
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
          placeOfSupply: 'Tamil Nadu (33)',
          reverseCharge: false,
          paymentTerms: 'Net 15 Days',
          salesOrderRef: 'SO-2026-901',
          deliveryChallanRef: 'DC-2026-901',
          termsConditions: '1. Goods once inspected and sold will not be accepted back without clearance. 2. Overdue payments attract 18% p.a. interest.',
          bankDetails: 'HDFC Bank Ltd, Account: 50200088192031, IFSC: HDFC0000128, Branch: Anna Nagar, Chennai',
        }}
      >
        {/* Row 1: Section A (Invoice Information) & Section B (Customer & Billing) */}
        <Row gutter={[16, 16]}>
          {/* Section A: Invoice Information */}
          <Col xs={24} lg={12}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '22px 24px',
                border: '1px solid #EDE9FE',
                boxShadow: '0 4px 16px rgba(68, 26, 135, 0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBottom: 14,
                  marginBottom: 18,
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FAF5FF',
                    border: '1px solid #E9D5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ROYAL_PURPLE,
                  }}
                >
                  <FileText size={17} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                    A. Invoice Information
                  </h3>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>Primary reference numbers, dates, and billing depot</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Invoice Number</span>} name="invoiceNumber" rules={[{ required: true }]}>
                  <Input style={{ height: 40, borderRadius: 10, fontWeight: 800, color: ROYAL_PURPLE, backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }} />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Invoice Type</span>} name="invoiceType" rules={[{ required: true }]}>
                  <Select
                    style={{ height: 40 }}
                    options={[
                      { value: 'Sales Invoice', label: 'Sales Invoice' },
                      { value: 'Service Invoice', label: 'Service Invoice' },
                      { value: 'Tax Invoice', label: 'Tax Invoice' },
                      { value: 'Proforma Invoice', label: 'Proforma Invoice' },
                    ]}
                  />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Invoice Date</span>} name="invoiceDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%', height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Payment Due Date</span>} name="dueDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%', height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Branch / Billing Depot</span>} name="branch" rules={[{ required: true }]}>
                  <Select
                    style={{ height: 40 }}
                    options={[
                      { value: 'Chennai HQ', label: 'Chennai HQ' },
                      { value: 'Coimbatore Hub', label: 'Coimbatore Hub' },
                      { value: 'Bengaluru Tech Hub', label: 'Bengaluru Tech Hub' },
                      { value: 'Madurai Hub', label: 'Madurai Hub' },
                    ]}
                  />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Related Sales Order</span>} name="salesOrderRef">
                  <Input placeholder="e.g. SO-2026-901" style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Related Delivery Challan</span>} name="deliveryChallanRef">
                  <Input placeholder="e.g. DC-2026-901" style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Place of Supply</span>} name="placeOfSupply">
                  <Input placeholder="e.g. Tamil Nadu (33)" style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>
              </div>
            </div>
          </Col>

          {/* Section B: Supplier & Customer Information */}
          <Col xs={24} lg={12}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '22px 24px',
                border: '1px solid #EDE9FE',
                boxShadow: '0 4px 16px rgba(68, 26, 135, 0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBottom: 14,
                  marginBottom: 18,
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FAF5FF',
                    border: '1px solid #E9D5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ROYAL_PURPLE,
                  }}
                >
                  <Building size={17} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                    B. Customer & Billing Entity
                  </h3>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>Client identity, GSTIN registration, contact & destinations</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Select Registered Customer</span>} name="customerCode" rules={[{ required: true }]}>
                  <Select
                    style={{ height: 40 }}
                    onChange={handleCustomerSelect}
                    options={CUSTOMER_OPTIONS.map((c) => ({
                      value: c.code,
                      label: `${c.name} (${c.code})`,
                    }))}
                  />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Customer GSTIN / UIN</span>} name="gstin">
                  <Input style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1', fontWeight: 600, letterSpacing: '0.04em' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Contact Person</span>} name="contactPerson">
                  <Input style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Mobile / Phone</span>} name="customerPhone">
                  <Input style={{ height: 40, borderRadius: 10, borderColor: '#CBD5E1' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Billing Address</span>} name="billingAddress">
                  <Input.TextArea rows={2} style={{ borderRadius: 10, borderColor: '#CBD5E1', resize: 'none' }} />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Shipping Address</span>} name="shippingAddress">
                  <Input.TextArea rows={2} style={{ borderRadius: 10, borderColor: '#CBD5E1', resize: 'none' }} />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>

        {/* Section C: Product & Service Line Items */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '22px 24px',
            border: '1px solid #EDE9FE',
            boxShadow: '0 4px 16px rgba(68, 26, 135, 0.04)',
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 14,
              marginBottom: 16,
              borderBottom: '1px solid #F1F5F9',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ROYAL_PURPLE,
                }}
              >
                <Package size={17} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                    C. Product & Service Line Items
                  </h3>
                  <span
                    style={{
                      backgroundColor: '#FAF5FF',
                      color: ROYAL_PURPLE,
                      border: '1px solid #E9D5FF',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '1px 8px',
                      borderRadius: 12,
                    }}
                  >
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Add items, edit quantities, custom discounts and GST rates</div>
              </div>
            </div>

            <Select
              placeholder="+ Add Catalog Product / Service..."
              style={{ width: 340, height: 40 }}
              onChange={handleAddItem}
              options={AVAILABLE_PRODUCTS.map((p) => ({
                value: p.id,
                label: `${p.name} (₹${p.price.toLocaleString('en-IN')})`,
              }))}
            />
          </div>

          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, tableLayout: 'auto' }}>
              <thead>
                <tr style={{ background: '#FAF5FF', color: ROYAL_PURPLE, textAlign: 'left', borderBottom: '1px solid #EDE9FE' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800, fontSize: 12, borderRadius: '10px 0 0 10px', whiteSpace: 'nowrap' }}>Product / Service Name</th>
                  <th style={{ padding: '12px 10px', width: 95, fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>HSN/SAC</th>
                  <th style={{ padding: '12px 10px', width: 65, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>Qty</th>
                  <th style={{ padding: '12px 10px', width: 105, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>Unit Price (₹)</th>
                  <th style={{ padding: '12px 8px', width: 65, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>Disc %</th>
                  <th style={{ padding: '12px 8px', width: 75, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>GST %</th>
                  <th style={{ padding: '12px 10px', width: 100, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>Tax (₹)</th>
                  <th style={{ padding: '12px 12px', width: 110, textAlign: 'right', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>Total (₹)</th>
                  <th style={{ padding: '12px 10px', width: 44, textAlign: 'center', borderRadius: '0 10px 10px 0' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <td style={{ padding: '14px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13, lineHeight: 1.3 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ color: ROYAL_PURPLE, fontWeight: 700, backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', padding: '1px 6px', borderRadius: 4, fontSize: 10.5 }}>
                          SKU: {item.sku}
                        </span>
                        <span style={{ color: '#CBD5E1' }}>&bull;</span>
                        <span style={{ color: '#64748B', fontWeight: 500 }}>{item.unit}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', verticalAlign: 'middle' }}>
                      <Input
                        size="small"
                        value={item.hsnSac}
                        onChange={(e) => updateItem(item.id, 'hsnSac', e.target.value)}
                        style={{ borderRadius: 6, borderColor: '#CBD5E1', fontWeight: 600, width: 85, height: 32 }}
                      />
                    </td>
                    <td style={{ padding: '14px 10px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <InputNumber
                        size="small"
                        min={1}
                        value={item.quantity}
                        onChange={(v) => updateItem(item.id, 'quantity', v || 1)}
                        style={{ width: 60, borderRadius: 6, borderColor: '#CBD5E1', fontWeight: 700, height: 32 }}
                      />
                    </td>
                    <td style={{ padding: '14px 10px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <InputNumber
                        size="small"
                        min={0}
                        value={item.unitPrice}
                        onChange={(v) => updateItem(item.id, 'unitPrice', v || 0)}
                        style={{ width: 95, borderRadius: 6, borderColor: '#CBD5E1', fontWeight: 600, height: 32 }}
                      />
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <InputNumber
                        size="small"
                        min={0}
                        max={100}
                        value={item.discountPercent}
                        onChange={(v) => updateItem(item.id, 'discountPercent', v || 0)}
                        style={{ width: 55, borderRadius: 6, borderColor: item.discountPercent > 0 ? '#86EFAC' : '#CBD5E1', color: item.discountPercent > 0 ? '#16A34A' : 'inherit', fontWeight: 700, height: 32 }}
                      />
                    </td>
                    <td style={{ padding: '14px 8px', verticalAlign: 'middle', textAlign: 'right' }}>
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
                        style={{ width: 70, height: 32 }}
                      />
                    </td>
                    <td style={{ padding: '14px 10px', verticalAlign: 'middle', textAlign: 'right', fontWeight: 700, color: '#0284C7', fontVariantNumeric: 'tabular-nums', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                      ₹{item.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 12px', verticalAlign: 'middle', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: 13.5, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      ₹{item.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 10px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<Trash2 size={14} />}
                        onClick={() => removeItem(item.id)}
                        style={{
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#FEF2F2',
                          borderColor: '#FECACA',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D & E: Taxes, Charges Calculation, Terms & Payment Instructions */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {/* Terms & Payment Instructions */}
          <Col xs={24} lg={13}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '22px 24px',
                border: '1px solid #EDE9FE',
                boxShadow: '0 4px 16px rgba(68, 26, 135, 0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBottom: 14,
                  marginBottom: 18,
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FAF5FF',
                    border: '1px solid #E9D5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ROYAL_PURPLE,
                  }}
                >
                  <CreditCard size={17} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                    E. Terms & Payment Instructions
                  </h3>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>Settlement credit terms, banking details, and clauses</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Payment Terms</span>} name="paymentTerms">
                  <Select
                    style={{ height: 40 }}
                    options={[
                      { value: 'Net 15 Days', label: 'Net 15 Days' },
                      { value: 'Net 30 Days', label: 'Net 30 Days' },
                      { value: 'Immediate Payment', label: 'Immediate Payment' },
                      { value: '50% Advance, 50% on Delivery', label: '50% Advance, 50% on Delivery' },
                    ]}
                  />
                </Form.Item>

                <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Payment Method</span>} initialValue="NEFT / RTGS Transfer">
                  <Select
                    style={{ height: 40 }}
                    options={[
                      { value: 'NEFT / RTGS Transfer', label: 'NEFT / RTGS Transfer' },
                      { value: 'Direct Bank Clearance', label: 'Direct Bank Clearance' },
                      { value: 'Cheque Deposit', label: 'Cheque Deposit' },
                    ]}
                  />
                </Form.Item>
              </div>

              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Bank Remittance Account Details</span>} name="bankDetails">
                <Input.TextArea rows={2} style={{ borderRadius: 10, borderColor: '#CBD5E1', resize: 'none' }} />
              </Form.Item>

              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Terms & Conditions</span>} name="termsConditions">
                <Input.TextArea rows={2} style={{ borderRadius: 10, borderColor: '#CBD5E1', resize: 'none' }} />
              </Form.Item>
            </div>
          </Col>

          {/* D. Tax & Charges Calculation Summary Card */}
          <Col xs={24} lg={11}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '22px 24px',
                border: '1px solid #EDE9FE',
                boxShadow: '0 4px 16px rgba(68, 26, 135, 0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingBottom: 14,
                    marginBottom: 16,
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      backgroundColor: '#FAF5FF',
                      border: '1px solid #E9D5FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ROYAL_PURPLE,
                    }}
                  >
                    <ShieldCheck size={17} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                      D. Tax & Charges Summary
                    </h3>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>Automated GST calculation breakdown & invoice total</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Gross Item Subtotal:</span>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                    <span>Item Discounts:</span>
                    <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>- ₹{itemDiscounts.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0F172A' }}>
                    <span>Taxable Amount:</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div style={{ margin: '4px 0', borderBottom: '1px dashed #E2E8F0' }} />

                  {isInterState ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>IGST (Inter-State 18%):</span>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                        <span>CGST (Intra-State 9%):</span>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                        <span>SGST (Intra-State 9%):</span>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 500 }}>Shipping & Freight:</span>
                    <InputNumber
                      size="middle"
                      min={0}
                      value={shippingCharges}
                      onChange={(v) => setShippingCharges(v || 0)}
                      style={{ width: 120, borderRadius: 8, borderColor: '#CBD5E1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#475569', fontWeight: 500 }}>Other Charges:</span>
                    <InputNumber
                      size="middle"
                      min={0}
                      value={otherCharges}
                      onChange={(v) => setOtherCharges(v || 0)}
                      style={{ width: 120, borderRadius: 8, borderColor: '#CBD5E1' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: 12 }}>
                    <span>Round Off:</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>₹{roundOff}</span>
                  </div>
                </div>
              </div>

              {/* Grand Total Hero Gradient Card */}
              <div
                style={{
                  marginTop: 18,
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
                  borderRadius: 14,
                  boxShadow: '0 6px 18px rgba(68, 26, 135, 0.28)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#D8B4FE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Grand Total
                  </span>
                  <div style={{ fontSize: 11, color: '#E9D5FF' }}>Inclusive of applicable GST</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Invoice Preview Modal - Luxury Corporate Redesign */}
      <Modal
        open={isPreviewOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <FileText size={20} />
            <span style={{ fontSize: 16 }}>Tax Invoice Preview (GST Compliant)</span>
          </div>
        }
        onCancel={() => setIsPreviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)} style={{ borderRadius: 8, height: 38, fontWeight: 600 }}>
            Close Preview
          </Button>,
          <Button
            key="print"
            type="primary"
            style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, borderRadius: 8, height: 38, fontWeight: 700 }}
            onClick={() => {
              window.print();
              setIsPreviewOpen(false);
            }}
          >
            Print Tax Invoice
          </Button>,
        ]}
        width={820}
      >
        <div style={{ padding: '28px 32px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px solid ${ROYAL_PURPLE}`, paddingBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, color: ROYAL_PURPLE, fontWeight: 900, fontSize: 19, letterSpacing: '-0.02em' }}>
                BHARAT INDUSTRIAL DYNAMICS LTD
              </h2>
              <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                Anna Salai, Guindy Industrial Estate, Chennai, TN 600032<br />
                <span style={{ fontWeight: 700, color: '#1E293B' }}>GSTIN:</span> 33AAAAA0000A1Z5 &bull; <span style={{ fontWeight: 700, color: '#1E293B' }}>PAN:</span> AAAAA0000A<br />
                billing@bharatdynamics.com &bull; +91 44 2234 5678
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#0F172A', letterSpacing: '0.04em' }}>TAX INVOICE</div>
              <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4, lineHeight: 1.6 }}>
                <div>Invoice #: <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{form.getFieldValue('invoiceNumber') || 'INV-2026-1049'}</strong></div>
                <div>Date: <strong style={{ color: '#0F172A' }}>{dayjs().format('DD-MMM-YYYY')}</strong></div>
                <div>Place of Supply: <strong style={{ color: '#0F172A' }}>{form.getFieldValue('placeOfSupply') || 'Tamil Nadu (33)'}</strong></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, margin: '18px 0', fontSize: 12 }}>
            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
              <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em' }}>
                Billed To (Customer):
              </div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5, marginTop: 4 }}>
                {form.getFieldValue('customerName') || 'Apex Precision Tools Ltd'}
              </div>
              <div style={{ color: '#475569', marginTop: 2, lineHeight: 1.45 }}>
                {form.getFieldValue('billingAddress') || 'SIDCO Industrial Estate, Coimbatore, TN 641021'}
              </div>
              <div style={{ color: '#334155', marginTop: 4 }}>
                GSTIN: <strong style={{ fontFamily: 'monospace', color: '#0F172A' }}>{form.getFieldValue('gstin') || '33AAICA9012B1Z1'}</strong>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
              <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em' }}>
                Order & Dispatch Details:
              </div>
              <div style={{ color: '#334155', marginTop: 4, lineHeight: 1.6, fontSize: 12 }}>
                <div>Sales Order: <strong style={{ color: '#0F172A' }}>{form.getFieldValue('salesOrderRef') || 'SO-2026-088'}</strong></div>
                <div>Payment Terms: <strong style={{ color: '#0F172A' }}>Net 30 Days</strong></div>
                <div>Due Date: <strong style={{ color: '#0F172A' }}>{dayjs().add(30, 'day').format('DD-MMM-YYYY')}</strong></div>
              </div>
            </div>
          </div>

          <Table
            dataSource={items}
            rowKey="id"
            pagination={false}
            size="middle"
            columns={[
              {
                title: 'Item & Description',
                dataIndex: 'name',
                key: 'name',
                render: (text) => <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{text}</span>,
              },
              {
                title: 'Qty',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
                render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
              },
              {
                title: 'Rate (₹)',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                align: 'right',
                render: (v) => <span style={{ fontFamily: 'monospace' }}>{v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
              },
              {
                title: 'Total (₹)',
                dataIndex: 'lineTotal',
                key: 'lineTotal',
                align: 'right',
                render: (v) => <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
              },
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <div style={{ width: 280, background: '#F8FAFC', padding: '14px 18px', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Taxable Amount:</span>
                <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Total GST:</span>
                <span style={{ fontFamily: 'monospace' }}>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 15,
                  fontWeight: 900,
                  color: ROYAL_PURPLE,
                  borderTop: `2px solid ${ROYAL_PURPLE}`,
                  paddingTop: 8,
                  marginTop: 4,
                }}
              >
                <span>Grand Total:</span>
                <span style={{ fontFamily: 'monospace' }}>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateInvoicePage;
