import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Select,
  Progress,
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Drawer,
  Divider,
  Dropdown,
  message,
  Tooltip,
  DatePicker,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ShoppingBag,
  Plus,
  FileSpreadsheet,
  Search,
  Truck,
  CheckCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Download,
  CreditCard,
  FileText,
  XCircle,
  Building,
  User,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowUp,
  PackageCheck,
  Boxes,
  IndianRupee,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const ROYAL_PURPLE = '#441A87';
const CARD_BORDER = '#E2E8F0';
const TEXT_DARK = '#0F172A';

export interface ConfirmedOrderItem {
  id: string;
  productName: string;
  brand: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  lineTotal: number;
}

export interface ConfirmedSalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  referenceQuote: string;
  customerPO: string;
  salesRepresentative: string;
  orderDate: string;
  expectedDeliveryDate: string;
  orderType: 'Standard Supply' | 'Project Order' | 'AMC Contract' | 'Urgent Dispatch';
  orderPriority: 'Normal' | 'High' | 'Urgent';
  approvalStatus: 'Approved' | 'Pending Review' | 'Awaiting Credit Clearance';
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  orderStatus: 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  fulfillmentProgress: number; // 0 to 100
  // Details
  billingAddress: string;
  shippingAddress: string;
  warehouse: string;
  deliveryMethod: string;
  trackingNumber: string;
  dispatchDate?: string;
  deliveryConfirmation?: string;
  paymentTerms: string;
  paymentDueDate: string;
  paymentMethod: string;
  transactionRef: string;
  paymentDate: string;
  internalNotes: string;
  customerInstructions: string;
  items: ConfirmedOrderItem[];
}

const INITIAL_CONFIRMED_ORDERS: ConfirmedSalesOrder[] = [
  {
    id: 'so-01',
    orderNumber: 'SO-2026-901',
    customerName: 'Ramesh Sundaram',
    customerCompany: 'Apex Precision Tools Ltd',
    customerEmail: 'ramesh@apexprecision.com',
    customerPhone: '+91 98412 11002',
    referenceQuote: 'QT-2026-881',
    customerPO: 'PO-APX-8821',
    salesRepresentative: 'Vikram Seth',
    orderDate: '2026-11-14',
    expectedDeliveryDate: '2026-11-24',
    orderType: 'Project Order',
    orderPriority: 'Urgent',
    approvalStatus: 'Approved',
    totalAmount: 450000,
    paidAmount: 250000,
    balanceDue: 200000,
    paymentStatus: 'Partially Paid',
    orderStatus: 'Processing',
    fulfillmentProgress: 45,
    billingAddress: 'Plot 45, Ambattur Industrial Estate, Chennai, TN 600058',
    shippingAddress: 'Plot 45, Ambattur Industrial Estate, Chennai, TN 600058',
    warehouse: 'Chennai Central Depot (WH-01)',
    deliveryMethod: 'VRL Logistics Surface Express',
    trackingNumber: 'VRL-992104-CHE',
    dispatchDate: '2026-11-20',
    deliveryConfirmation: 'Pending transit delivery',
    paymentTerms: 'Net 30 Days (50% Advance Received)',
    paymentDueDate: '2026-12-14',
    paymentMethod: 'NEFT / RTGS Transfer',
    transactionRef: 'CMS-ICICI-8812903',
    paymentDate: '2026-11-14',
    internalNotes: 'Client expanding production line 2. High priority account.',
    customerInstructions: 'Unload at Gate 2 with forklift assistance required.',
    items: [
      {
        id: 'item-1',
        productName: '3-Phase Frequency Inverter 15kW with EMC Filter',
        brand: 'Siemens Precision',
        sku: 'VFD-15KW-EMC',
        quantity: 8,
        unitPrice: 50000,
        discount: 25000,
        taxPercent: 18,
        lineTotal: 442500,
      },
    ],
  },
  {
    id: 'so-02',
    orderNumber: 'SO-2026-902',
    customerName: 'Priya Narayanan',
    customerCompany: 'Omni Infra Ventures Ltd',
    customerEmail: 'priya@omniinfra.in',
    customerPhone: '+91 97890 33441',
    referenceQuote: 'QT-2026-882',
    customerPO: 'PO-OMN-4412',
    salesRepresentative: 'Ananya Sharma',
    orderDate: '2026-11-15',
    expectedDeliveryDate: '2026-11-26',
    orderType: 'Standard Supply',
    orderPriority: 'High',
    approvalStatus: 'Approved',
    totalAmount: 1200000,
    paidAmount: 1200000,
    balanceDue: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    fulfillmentProgress: 85,
    billingAddress: 'Tower 4, Electronic City Phase 1, Bangalore, KA 560100',
    shippingAddress: 'Site Yard 7, Metro Rail Corridor, Bangalore, KA 560099',
    warehouse: 'Bangalore Regional Hub (WH-02)',
    deliveryMethod: 'BlueDart Dedicated Freight',
    trackingNumber: 'BLU-881290-BLR',
    dispatchDate: '2026-11-18',
    deliveryConfirmation: 'In transit - Out for destination delivery',
    paymentTerms: '100% Advance Payment Completed',
    paymentDueDate: '2026-11-15',
    paymentMethod: 'Corporate Card / Wire',
    transactionRef: 'CC-HDFC-0019283',
    paymentDate: '2026-11-15',
    internalNotes: 'Full payment received upfront prior to dispatch approval.',
    customerInstructions: 'Deliver during standard business hours only (9 AM - 6 PM).',
    items: [
      {
        id: 'item-2',
        productName: 'Heavy Duty Hydraulic Pump Unit',
        brand: 'Bosch Rexroth',
        sku: 'HYD-PMP-75B',
        quantity: 3,
        unitPrice: 350000,
        discount: 30000,
        taxPercent: 18,
        lineTotal: 1200000,
      },
    ],
  },
  {
    id: 'so-03',
    orderNumber: 'SO-2026-903',
    customerName: 'Karthik Raja',
    customerCompany: 'Southern Automation Works',
    customerEmail: 'karthik@southauto.com',
    customerPhone: '+91 94441 55667',
    referenceQuote: 'QT-2026-879',
    customerPO: 'PO-SAW-9901',
    salesRepresentative: 'Vikram Seth',
    orderDate: '2026-11-10',
    expectedDeliveryDate: '2026-11-18',
    orderType: 'Standard Supply',
    orderPriority: 'Normal',
    approvalStatus: 'Approved',
    totalAmount: 850000,
    paidAmount: 850000,
    balanceDue: 0,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    fulfillmentProgress: 100,
    billingAddress: 'SIDCO Industrial Complex, Coimbatore, TN 641021',
    shippingAddress: 'SIDCO Industrial Complex, Coimbatore, TN 641021',
    warehouse: 'Chennai Central Depot (WH-01)',
    deliveryMethod: 'SafeXpress Surface Logistics',
    trackingNumber: 'SFX-990123-CBE',
    dispatchDate: '2026-11-12',
    deliveryConfirmation: 'Signed POD received on 2026-11-18 by Security Gate',
    paymentTerms: 'Immediate Clearance',
    paymentDueDate: '2026-11-10',
    paymentMethod: 'Net Banking (IMPS)',
    transactionRef: 'IMPS-SBI-9920112',
    paymentDate: '2026-11-10',
    internalNotes: 'Order completed and digitally archived.',
    customerInstructions: 'Direct handover to plant manager Mr. Sridhar.',
    items: [
      {
        id: 'item-3',
        productName: 'PLC Automation Central Rack 800',
        brand: 'Schneider Electric',
        sku: 'PLC-CPU-800',
        quantity: 5,
        unitPrice: 150000,
        discount: 25000,
        taxPercent: 18,
        lineTotal: 850000,
      },
    ],
  },
  {
    id: 'so-04',
    orderNumber: 'SO-2026-904',
    customerName: 'Deepak Varma',
    customerCompany: 'Kaveri Engineering Works',
    customerEmail: 'purchase@kaverieng.com',
    customerPhone: '+91 98401 22334',
    referenceQuote: 'QT-2026-875',
    customerPO: 'PO-KEW-1092',
    salesRepresentative: 'Ananya Sharma',
    orderDate: '2026-11-16',
    expectedDeliveryDate: '2026-11-28',
    orderType: 'Standard Supply',
    orderPriority: 'Normal',
    approvalStatus: 'Awaiting Credit Clearance',
    totalAmount: 380000,
    paidAmount: 0,
    balanceDue: 380000,
    paymentStatus: 'Unpaid',
    orderStatus: 'Confirmed',
    fulfillmentProgress: 10,
    billingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    shippingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    warehouse: 'Bangalore Regional Hub (WH-02)',
    deliveryMethod: 'Pending Dispatch Partner Assignment',
    trackingNumber: 'Awaiting Fulfillment',
    dispatchDate: 'Pending',
    deliveryConfirmation: 'Pending dispatch',
    paymentTerms: 'Net 15 Days after GRN',
    paymentDueDate: '2026-12-01',
    paymentMethod: 'Pending Cheque / NEFT',
    transactionRef: 'None',
    paymentDate: 'Pending',
    internalNotes: 'Waiting for finance team approval on credit limit.',
    customerInstructions: 'Call 2 hours prior to arrival for gate pass clearance.',
    items: [
      {
        id: 'item-4',
        productName: 'Digital Sensor Interface Module',
        brand: 'Honeywell',
        sku: 'SNS-INT-DIG',
        quantity: 20,
        unitPrice: 17000,
        discount: 10000,
        taxPercent: 18,
        lineTotal: 380000,
      },
    ],
  },
  {
    id: 'so-05',
    orderNumber: 'SO-2026-905',
    customerName: 'Suresh Kumar',
    customerCompany: 'Delta Heavy Machineries',
    customerEmail: 'suresh@deltamach.com',
    customerPhone: '+91 99402 77881',
    referenceQuote: 'QT-2026-868',
    customerPO: 'PO-DEL-771',
    salesRepresentative: 'Vikram Seth',
    orderDate: '2026-11-08',
    expectedDeliveryDate: '2026-11-15',
    orderType: 'Project Order',
    orderPriority: 'Urgent',
    approvalStatus: 'Approved',
    totalAmount: 620000,
    paidAmount: 150000,
    balanceDue: 470000,
    paymentStatus: 'Overdue',
    orderStatus: 'Packed',
    fulfillmentProgress: 60,
    billingAddress: 'Industrial Corridor, Madurai, TN 625020',
    shippingAddress: 'Industrial Corridor, Madurai, TN 625020',
    warehouse: 'Chennai Central Depot (WH-01)',
    deliveryMethod: 'Surface Freight Carrier',
    trackingNumber: 'SFX-998811-MDU',
    dispatchDate: '2026-11-19',
    deliveryConfirmation: 'Packed at warehouse, awaiting full advance clearance',
    paymentTerms: 'Part-Payment Overdue (Due 15th Nov)',
    paymentDueDate: '2026-11-15',
    paymentMethod: 'NEFT Transfer',
    transactionRef: 'NEFT-AXIS-77192',
    paymentDate: '2026-11-08',
    internalNotes: 'Follow-up sent for overdue balance payment before release.',
    customerInstructions: 'Warehouse loading dock 3.',
    items: [
      {
        id: 'item-5',
        productName: 'Heavy Duty Pneumatic Actuator 200mm',
        brand: 'Festo',
        sku: 'PNEU-ACT-200',
        quantity: 10,
        unitPrice: 55000,
        discount: 20000,
        taxPercent: 18,
        lineTotal: 620000,
      },
    ],
  },
];

export const ConfirmedSalesOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ConfirmedSalesOrder[]>(INITIAL_CONFIRMED_ORDERS);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [salesRepFilter, setSalesRepFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('This Month');

  // Drawer & Modals
  const [selectedOrder, setSelectedOrder] = useState<ConfirmedSalesOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerCompany.toLowerCase().includes(search.toLowerCase()) ||
      o.referenceQuote.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPO.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentFilter === 'ALL' || o.paymentStatus === paymentFilter;
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const matchesRep = salesRepFilter === 'ALL' || o.salesRepresentative === salesRepFilter;
    return matchesSearch && matchesPayment && matchesStatus && matchesRep;
  });

  // Dynamic Calculation of 6 Required KPIs
  // 1. Total Orders & Gross Value
  const totalOrdersCount = orders.length;
  const totalOrdersValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 2. Awaiting Approval (Pending approval / Review)
  const awaitingApprovalOrders = orders.filter((o) => o.approvalStatus !== 'Approved');
  const awaitingApprovalCount = awaitingApprovalOrders.length;

  // 3. Active Fulfillment (Processing, Packed, Shipped)
  const activeFulfillmentOrders = orders.filter(
    (o) => o.orderStatus === 'Processing' || o.orderStatus === 'Packed' || o.orderStatus === 'Shipped'
  );
  const activeFulfillmentCount = activeFulfillmentOrders.length;

  // 4. Delivered Orders & Value
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const deliveredCount = deliveredOrders.length;
  const deliveredValue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 5. Amount Collected
  const totalCollectedAmount = orders.reduce((sum, o) => sum + o.paidAmount, 0);

  // 6. Outstanding Amount
  const totalOutstandingAmount = orders.reduce((sum, o) => sum + o.balanceDue, 0);

  const clearFilters = () => {
    setSearch('');
    setPaymentFilter('ALL');
    setOrderStatusFilter('ALL');
    setSalesRepFilter('ALL');
  };

  const getOrderStatusTag = (status: ConfirmedSalesOrder['orderStatus']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F5F3FF', color: '#6D28D9', fontSize: 11.5, fontWeight: 700, border: '1px solid #E9D5FF' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} /> Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#1D4ED8', fontSize: 11.5, fontWeight: 700, border: '1px solid #BFDBFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Processing
          </span>
        );
      case 'Packed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Packed
          </span>
        );
      case 'Shipped':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0F9FF', color: '#0369A1', fontSize: 11.5, fontWeight: 700, border: '1px solid #BAE6FD' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284C7' }} /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Cancelled
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: ConfirmedSalesOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Partially Paid
          </span>
        );
      case 'Unpaid':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Unpaid
          </span>
        );
      case 'Overdue':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFF1F2', color: '#BE123C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDA4AF' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E11D48' }} /> Overdue
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleOpenDrawer = (record: ConfirmedSalesOrder) => {
    setSelectedOrder(record);
    setIsDrawerOpen(true);
  };

  const handleOpenPayment = (record: ConfirmedSalesOrder) => {
    setSelectedOrder(record);
    setPaymentAmount(record.balanceDue);
    setIsPaymentModalOpen(true);
  };

  const submitPayment = () => {
    if (!selectedOrder) return;
    const paid = selectedOrder.paidAmount + paymentAmount;
    const balance = Math.max(0, selectedOrder.totalAmount - paid);
    const newStatus: ConfirmedSalesOrder['paymentStatus'] = balance === 0 ? 'Paid' : 'Partially Paid';

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, paidAmount: paid, balanceDue: balance, paymentStatus: newStatus }
          : o
      )
    );
    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        paidAmount: paid,
        balanceDue: balance,
        paymentStatus: newStatus,
      });
    }
    message.success(`Payment of ₹${paymentAmount.toLocaleString('en-IN')} recorded for ${selectedOrder.orderNumber}!`);
    setIsPaymentModalOpen(false);
  };

  const handleUpdateStatus = (
    orderId: string,
    field: 'orderStatus' | 'paymentStatus',
    newVal: any
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, [field]: newVal };
          if (field === 'orderStatus') {
            if (newVal === 'Confirmed') updated.fulfillmentProgress = 15;
            if (newVal === 'Processing') updated.fulfillmentProgress = 45;
            if (newVal === 'Packed') updated.fulfillmentProgress = 65;
            if (newVal === 'Shipped') updated.fulfillmentProgress = 85;
            if (newVal === 'Delivered') updated.fulfillmentProgress = 100;
          }
          return updated;
        }
        return o;
      })
    );
    message.success(`Order ${field} updated successfully`);
  };

  const handleCancelOrderWithConfirm = (record: ConfirmedSalesOrder) => {
    Modal.confirm({
      title: 'Confirm Order Cancellation',
      content: `Are you sure you want to cancel ${record.orderNumber} for ${record.customerCompany}? This action will stop fulfillment activities.`,
      okText: 'Yes, Cancel Order',
      okType: 'danger',
      cancelText: 'Keep Active',
      onOk: () => {
        setOrders((prev) =>
          prev.map((o) => (o.id === record.id ? { ...o, orderStatus: 'Cancelled', fulfillmentProgress: 0 } : o))
        );
        message.warning(`Order ${record.orderNumber} has been Cancelled.`);
      },
    });
  };

  const handleCreateSalesOrder = (values: any) => {
    const total = Number(values.totalAmount || 300000);
    const newOrder: ConfirmedSalesOrder = {
      id: `so-${Date.now()}`,
      orderNumber: `SO-2026-${900 + orders.length + 1}`,
      customerName: values.customerName,
      customerCompany: values.customerCompany || values.customerName,
      customerEmail: values.customerEmail || 'billing@client.com',
      customerPhone: values.customerPhone || '+91 90000 00000',
      referenceQuote: values.referenceQuote || 'QT-2026-DIRECT',
      customerPO: values.customerPO || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      salesRepresentative: values.salesRepresentative || 'Vikram Seth',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: values.expectedDeliveryDate || '2026-12-05',
      orderType: values.orderType || 'Standard Supply',
      orderPriority: values.orderPriority || 'Normal',
      approvalStatus: 'Approved',
      totalAmount: total,
      paidAmount: 0,
      balanceDue: total,
      paymentStatus: 'Unpaid',
      orderStatus: 'Confirmed',
      fulfillmentProgress: 15,
      billingAddress: values.shippingAddress || 'Client Registered Office Address',
      shippingAddress: values.shippingAddress || 'Client Site Logistics Depot Address',
      warehouse: 'Chennai Central Depot (WH-01)',
      deliveryMethod: 'Surface Freight Logistics',
      trackingNumber: 'Awaiting Fulfillment Booking',
      paymentTerms: 'Net 30 Days Standard',
      paymentDueDate: '2026-12-20',
      paymentMethod: 'NEFT / Invoice Billing',
      transactionRef: 'Pending Receipt',
      paymentDate: 'Pending',
      internalNotes: 'Created manually through Sales ERP.',
      customerInstructions: 'Deliver during working hours.',
      items: [
        {
          id: `item-${Date.now()}`,
          productName: values.productName || 'Industrial Supply Package Item',
          brand: 'Standard Industrial',
          sku: 'IND-SKU-01',
          quantity: 1,
          unitPrice: Math.round(total / 1.18),
          discount: 0,
          taxPercent: 18,
          lineTotal: total,
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    message.success(`Confirmed Sales Order ${newOrder.orderNumber} successfully booked!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  // Compact, Professional Sales Orders Table Columns (Clean Minimalist Stripe/Linear style)
  const columns = [
    {
      title: 'Order Number',
      key: 'orderNumber',
      width: 155,
      render: (_: any, r: ConfirmedSalesOrder) => (
        <div>
          <span
            onClick={() => handleOpenDrawer(r)}
            style={{
              fontWeight: 800,
              color: '#441A87',
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-block',
              letterSpacing: '-0.01em',
            }}
          >
            {r.orderNumber}
          </span>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Ref: <span style={{ color: '#64748B', fontWeight: 600 }}>{r.referenceQuote}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer Details',
      key: 'customer',
      render: (_: any, r: ConfirmedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.customerCompany}</div>
          <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span>{r.customerName}</span>
            <span style={{ color: '#CBD5E1' }}>&bull;</span>
            <span style={{ color: '#475569' }}>{r.customerPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Sales Rep',
      dataIndex: 'salesRepresentative',
      key: 'salesRepresentative',
      width: 145,
      render: (v: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#EDE7F6',
              color: ROYAL_PURPLE,
              fontSize: 10.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {v.split(' ').map((n) => n[0]).join('')}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{v}</span>
        </div>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 105,
      render: (v: string) => <span style={{ fontSize: 12, color: '#64748B' }}>{v}</span>,
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 130,
      render: (v: string) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#0284C7' }}>{v}</span>
      ),
    },
    {
      title: 'Order Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right' as const,
      render: (v: number) => (
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{v.toLocaleString('en-IN')}
          </span>
        </div>
      ),
    },
    {
      title: 'Payment Summary',
      key: 'paymentSummary',
      width: 150,
      render: (_: any, r: ConfirmedSalesOrder) => (
        <div style={{ fontSize: 11.5 }}>
          <div style={{ color: '#16A34A', fontWeight: 600 }}>Paid: ₹{r.paidAmount.toLocaleString('en-IN')}</div>
          <div style={{ color: r.balanceDue > 0 ? '#DC2626' : '#94A3B8', fontWeight: r.balanceDue > 0 ? 700 : 500, marginTop: 1 }}>
            {r.balanceDue > 0 ? `Bal: ₹${r.balanceDue.toLocaleString('en-IN')}` : 'Cleared'}
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      align: 'center' as const,
      render: (st: ConfirmedSalesOrder['paymentStatus']) => getPaymentStatusTag(st),
    },
    {
      title: 'Fulfillment Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 135,
      align: 'center' as const,
      render: (st: ConfirmedSalesOrder['orderStatus']) => getOrderStatusTag(st),
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 110,
      render: (_: any, r: ConfirmedSalesOrder) => (
        <div style={{ minWidth: 85 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
            <span>{r.fulfillmentProgress}%</span>
          </div>
          <Progress percent={r.fulfillmentProgress} size="small" strokeColor={ROYAL_PURPLE} showInfo={false} />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, r: ConfirmedSalesOrder) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Order Details',
            icon: <Eye size={13} />,
            onClick: () => handleOpenDrawer(r),
          },
          {
            key: 'payment',
            label: 'Record Payment',
            icon: <CreditCard size={13} />,
            disabled: r.balanceDue === 0,
            onClick: () => handleOpenPayment(r),
          },
          {
            key: 'invoice',
            label: 'Generate Sales Invoice',
            icon: <FileText size={13} />,
            onClick: () => message.success(`Sales invoice drafted for ${r.orderNumber}`),
          },
          {
            key: 'dispatch',
            label: 'Create Delivery Challan',
            icon: <Truck size={13} />,
            onClick: () => message.info(`Navigating to Delivery Challan dispatch for ${r.orderNumber}`),
          },
          {
            key: 'pdf',
            label: 'Download Order PDF',
            icon: <Download size={13} />,
            onClick: () => message.success(`Downloading PDF for ${r.orderNumber}...`),
          },
          { type: 'divider' },
          {
            key: 'cancel',
            label: 'Cancel Sales Order',
            icon: <XCircle size={13} />,
            danger: true,
            disabled: r.orderStatus === 'Delivered' || r.orderStatus === 'Cancelled',
            onClick: () => handleCancelOrderWithConfirm(r),
          },
        ];

        return (
          <Space size={4} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => handleOpenDrawer(r)}
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
      {/* 2. PAGE HEADER BANNER (Single Row Layout matching user request) */}
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
              color: ROYAL_PURPLE,
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Confirmed Sales Orders
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage confirmed client orders, pricing, payments, delivery schedules, and order fulfillment.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting Confirmed Orders list to Excel...')}
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
            Export Orders
          </Button>

          <Button
            type="primary"
            onClick={() => {
              createForm.resetFields();
              setIsCreateModalOpen(true);
            }}
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
            Create Sales Order
          </Button>
        </div>
      </div>

      {/* 3. FOUR ESSENTIAL HERO CARDS (Each with its own distinct vibrant theme) */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Total Confirmed Orders (Deep Royal Purple Gradient) */}
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
                <ShoppingBag size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Total Confirmed Orders
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {totalOrdersCount}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4ADE80', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  ₹{(totalOrdersValue / 100000).toFixed(2)}L Gross
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
              <ShoppingBag size={20} />
            </div>
          </div>
        </Col>

        {/* Card 2: Active Fulfillment (Clean Ice-Blue Theme) */}
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
                <Truck size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#BAE6FD', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Active Fulfillment
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {activeFulfillmentCount}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0F2FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  In processing / transit
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
              <Truck size={20} />
            </div>
          </div>
        </Col>

        {/* Card 3: Payments Collected (Vibrant Emerald Green Theme) */}
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
                <IndianRupee size={24} strokeWidth={2.6} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Payments Collected
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  ₹{(totalCollectedAmount / 100000).toFixed(2)}L
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1FAE5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Received to date
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

        {/* Card 4: Pending / Outstanding Due (High-Notice Crimson Theme) */}
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
                <AlertTriangle size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FECDD3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Outstanding Balance
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  ₹{(totalOutstandingAmount / 100000).toFixed(2)}L
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FFE4E6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {awaitingApprovalCount > 0 ? `${awaitingApprovalCount} need clearance` : 'Pending collection'}
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
              <AlertTriangle size={20} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 4. SEARCH & FILTER TOOLBAR (Refined SaaS Toolbar) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '14px 20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8F6FC',
              border: '1px solid #EAE4F5',
              borderRadius: 24,
              padding: '6px 14px',
              width: 250,
            }}
          >
            <Search size={14} color="#7C3AED" style={{ marginRight: 8, flexShrink: 0 }} />
            <input
              placeholder="Search Order #, Customer, PO..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Payment Status Filter */}
          <Select
            value={paymentFilter}
            onChange={setPaymentFilter}
            style={{ width: 145, height: 36 }}
            options={[
              { value: 'ALL', label: 'Payment: All' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Partially Paid', label: 'Partially Paid' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />

          {/* Order Status Filter */}
          <Select
            value={orderStatusFilter}
            onChange={setOrderStatusFilter}
            style={{ width: 155, height: 36 }}
            options={[
              { value: 'ALL', label: 'Order Status: All' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Processing', label: 'Processing' },
              { value: 'Packed', label: 'Packed' },
              { value: 'Shipped', label: 'Shipped' },
              { value: 'Delivered', label: 'Delivered' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />

          {/* Sales Representative Filter */}
          <Select
            value={salesRepFilter}
            onChange={setSalesRepFilter}
            style={{ width: 165, height: 36 }}
            options={[
              { value: 'ALL', label: 'All Representatives' },
              { value: 'Vikram Seth', label: 'Vikram Seth' },
              { value: 'Ananya Sharma', label: 'Ananya Sharma' },
            ]}
          />

          {/* Clear Filters Button */}
          {(search || paymentFilter !== 'ALL' || orderStatusFilter !== 'ALL' || salesRepFilter !== 'ALL') && (
            <Button
              type="text"
              icon={<RotateCcw size={13} />}
              onClick={clearFilters}
              style={{ fontSize: 12, color: '#64748B', padding: '0 10px', height: 36, borderRadius: 8 }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>
          Showing <b>{filteredOrders.length}</b> of <b>{orders.length}</b> orders
        </div>
      </div>

      {/* 5. SALES ORDERS TABLE (Crisp Linear/Stripe SaaS Quality Table) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: '#64748B' }}>
                Showing {range[0]}-{range[1]} of {total} sales orders
              </span>
            ),
          }}
          size="middle"
        />
      </div>

      {/* 6. COMPREHENSIVE SALES ORDER DETAILS DRAWER */}
      <Drawer
        title={
          selectedOrder ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: ROYAL_PURPLE }}>{selectedOrder.orderNumber}</span>
                {getOrderStatusTag(selectedOrder.orderStatus)}
                {getPaymentStatusTag(selectedOrder.paymentStatus)}
              </div>
              <span style={{ fontSize: 12, color: '#64748B' }}>PO Ref: <strong>{selectedOrder.customerPO}</strong></span>
            </div>
          ) : (
            'Sales Order Details'
          )
        }
        placement="right"
        width={760}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Status Control Strip for Authorized Users */}
            <div
              style={{
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#6D28D9', fontWeight: 700, display: 'block' }}>Update Fulfillment:</span>
                  <Select
                    size="small"
                    value={selectedOrder.orderStatus}
                    onChange={(val) => {
                      handleUpdateStatus(selectedOrder.id, 'orderStatus', val);
                      setSelectedOrder({ ...selectedOrder, orderStatus: val });
                    }}
                    style={{ width: 140, marginTop: 2 }}
                    options={[
                      { value: 'Confirmed', label: 'Confirmed' },
                      { value: 'Processing', label: 'Processing' },
                      { value: 'Packed', label: 'Packed' },
                      { value: 'Shipped', label: 'Shipped' },
                      { value: 'Delivered', label: 'Delivered' },
                      { value: 'Cancelled', label: 'Cancelled' },
                    ]}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#6D28D9', fontWeight: 700, display: 'block' }}>Payment Status:</span>
                  <Select
                    size="small"
                    value={selectedOrder.paymentStatus}
                    onChange={(val) => {
                      handleUpdateStatus(selectedOrder.id, 'paymentStatus', val);
                      setSelectedOrder({ ...selectedOrder, paymentStatus: val });
                    }}
                    style={{ width: 140, marginTop: 2 }}
                    options={[
                      { value: 'Paid', label: 'Paid' },
                      { value: 'Partially Paid', label: 'Partially Paid' },
                      { value: 'Unpaid', label: 'Unpaid' },
                      { value: 'Overdue', label: 'Overdue' },
                    ]}
                  />
                </div>
              </div>

              {selectedOrder.balanceDue > 0 && (
                <Button
                  type="primary"
                  icon={<CreditCard size={13} />}
                  onClick={() => handleOpenPayment(selectedOrder)}
                  style={{ background: '#16A34A', borderColor: '#16A34A', borderRadius: 8, height: 32, fontSize: 12 }}
                >
                  Record Payment
                </Button>
              )}
            </div>

            {/* A. Order Information */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.4px' }}>
                A. Order Information
              </div>
              <Row gutter={[16, 10]}>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Order Number</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{selectedOrder.orderNumber}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Reference Quotation</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{selectedOrder.referenceQuote}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Customer PO #</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{selectedOrder.customerPO}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Order Creation Date</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{selectedOrder.orderDate}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Expected Delivery</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0284C7' }}>{selectedOrder.expectedDeliveryDate}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Order Type & Priority</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
                    {selectedOrder.orderType} &bull; <Tag color={selectedOrder.orderPriority === 'Urgent' ? 'red' : 'blue'}>{selectedOrder.orderPriority}</Tag>
                  </div>
                </Col>
              </Row>
            </div>

            {/* B. Customer Information */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.4px' }}>
                B. Customer Information
              </div>
              <Row gutter={[16, 10]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Enterprise Client</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{selectedOrder.customerCompany}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                    Attn: {selectedOrder.customerName} &bull; {selectedOrder.customerPhone}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedOrder.customerEmail}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Sales Representative</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{selectedOrder.salesRepresentative}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Internal Approval</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#16A34A' }}>{selectedOrder.approvalStatus}</div>
                </Col>
                <Col span={12} style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Billing Address</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.billingAddress}</div>
                </Col>
                <Col span={12} style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Shipping Address</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.shippingAddress}</div>
                </Col>
              </Row>
            </div>

            {/* C. Order Items */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.4px' }}>
                C. Order Items & Pricing Breakdown
              </div>
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Product Name / Description',
                    dataIndex: 'productName',
                    key: 'productName',
                    render: (t: string, r: ConfirmedOrderItem) => (
                      <div>
                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{t}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          SKU: {r.sku} &bull; Brand: {r.brand}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Qty',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: 60,
                    align: 'center',
                    render: (q) => <span style={{ fontWeight: 700 }}>{q}</span>,
                  },
                  {
                    title: 'Unit Price',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: 100,
                    align: 'right',
                    render: (p) => `₹${p.toLocaleString('en-IN')}`,
                  },
                  {
                    title: 'Discount',
                    dataIndex: 'discount',
                    key: 'discount',
                    width: 80,
                    align: 'right',
                    render: (d) => `₹${d.toLocaleString('en-IN')}`,
                  },
                  {
                    title: 'GST',
                    dataIndex: 'taxPercent',
                    key: 'taxPercent',
                    width: 60,
                    align: 'center',
                    render: (g) => `${g}%`,
                  },
                  {
                    title: 'Line Total',
                    dataIndex: 'lineTotal',
                    key: 'lineTotal',
                    width: 110,
                    align: 'right',
                    render: (tot) => <strong style={{ color: ROYAL_PURPLE }}>₹{tot.toLocaleString('en-IN')}</strong>,
                  },
                ]}
              />

              {/* D. Pricing Summary */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <div style={{ width: 300, background: '#FAFAFA', padding: '12px 16px', borderRadius: 8, border: '1px solid #F1F5F9', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748B' }}>
                    <span>Subtotal:</span>
                    <span>₹{Math.round(selectedOrder.totalAmount / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748B' }}>
                    <span>Discount:</span>
                    <span>₹0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748B' }}>
                    <span>GST (18%):</span>
                    <span>₹{Math.round(selectedOrder.totalAmount - selectedOrder.totalAmount / 1.18).toLocaleString('en-IN')}</span>
                  </div>
                  <Divider style={{ margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
                    <span>Grand Total:</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* E. Payment Information */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.4px' }}>
                E. Payment Information
              </div>
              <Row gutter={[16, 10]}>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Total Amount</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Amount Paid</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#16A34A' }}>₹{selectedOrder.paidAmount.toLocaleString('en-IN')}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Outstanding Balance</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: selectedOrder.balanceDue > 0 ? '#DC2626' : '#16A34A' }}>
                    ₹{selectedOrder.balanceDue.toLocaleString('en-IN')}
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Payment Terms</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.paymentTerms}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Payment Due Date</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>{selectedOrder.paymentDueDate}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Payment Reference</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.transactionRef}</div>
                </Col>
              </Row>
            </div>

            {/* F. Delivery & Fulfillment */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.4px' }}>
                F. Delivery & Fulfillment
              </div>
              <Row gutter={[16, 10]}>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Dispatching Warehouse</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{selectedOrder.warehouse}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Expected Delivery Date</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0284C7' }}>{selectedOrder.expectedDeliveryDate}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Fulfillment Method</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.deliveryMethod}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Dispatch Date</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.dispatchDate || 'Pending'}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Tracking Number</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ROYAL_PURPLE }}>{selectedOrder.trackingNumber}</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Delivery Confirmation</div>
                  <div style={{ fontSize: 12, color: '#16A34A', fontWeight: 600 }}>{selectedOrder.deliveryConfirmation || 'Pending delivery'}</div>
                </Col>
              </Row>
            </div>

            {/* G. Documents & Activity Timeline */}
            <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: `1px solid ${CARD_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.4px' }}>
                G. Documents & Activity Timeline
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <Button size="small" icon={<FileText size={12} />} onClick={() => message.info(`Customer PO: ${selectedOrder.customerPO}`)}>
                  Customer PO
                </Button>
                <Button size="small" icon={<FileSpreadsheet size={12} />} onClick={() => message.info(`Linked Quotation: ${selectedOrder.referenceQuote}`)}>
                  Quotation Doc
                </Button>
                <Button size="small" icon={<Download size={12} />} onClick={() => message.success(`Downloading Invoice for ${selectedOrder.orderNumber}`)}>
                  Invoice PDF
                </Button>
              </div>

              <div style={{ background: '#FAF9FE', padding: '10px 14px', borderRadius: 8, fontSize: 11.5, color: '#475569' }}>
                <div><strong>Client Note:</strong> {selectedOrder.customerInstructions}</div>
                <div style={{ marginTop: 4 }}><strong>Internal Note:</strong> {selectedOrder.internalNotes}</div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
              <Button icon={<Download size={14} />} onClick={() => message.success(`Downloading Sales Order Acknowledgement PDF`)}>
                Download PDF
              </Button>
              {selectedOrder.orderStatus !== 'Cancelled' && selectedOrder.orderStatus !== 'Delivered' && (
                <Button danger onClick={() => handleCancelOrderWithConfirm(selectedOrder)}>
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* 7. RECORD PAYMENT MODAL */}
      <Modal
        title={selectedOrder ? `Record Payment Receipt for ${selectedOrder.orderNumber}` : 'Record Payment'}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        onOk={submitPayment}
        okText="Confirm Payment Receipt"
        okButtonProps={{ style: { backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE } }}
      >
        {selectedOrder && (
          <div style={{ marginTop: 14 }}>
            <div style={{ background: '#FAF8FE', padding: 12, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Total Order Value:</span>
                <strong>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                <span>Current Outstanding Due:</span>
                <strong>₹{selectedOrder.balanceDue.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Payment Receipt Amount (₹)
            </div>
            <InputNumber
              value={paymentAmount}
              onChange={(val) => setPaymentAmount(val || 0)}
              min={1}
              max={selectedOrder.balanceDue}
              style={{ width: '100%', marginBottom: 14 }}
              size="large"
            />

            <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Payment Mode
            </div>
            <Select
              defaultValue="NEFT"
              style={{ width: '100%' }}
              options={[
                { value: 'NEFT', label: 'NEFT / RTGS Bank Transfer' },
                { value: 'IMPS', label: 'Immediate Payment (IMPS)' },
                { value: 'UPI', label: 'UPI QR Business Transfer' },
                { value: 'Cheque', label: 'Cheque Clearance' },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* 8. CREATE SALES ORDER MODAL */}
      <Modal
        title="Create Confirmed Sales Order"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={640}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSalesOrder} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerCompany" label="Enterprise Client" rules={[{ required: true, message: 'Client name is required' }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerName" label="Contact Person" rules={[{ required: true }]}>
                <Input placeholder="e.g. Ramesh Sundaram" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerPO" label="Customer PO Number">
                <Input placeholder="e.g. PO-APX-8821" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="referenceQuote" label="Reference Quotation #">
                <Input placeholder="e.g. QT-2026-881" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salesRepresentative" label="Sales Representative" initialValue="Vikram Seth">
                <Select
                  options={[
                    { value: 'Vikram Seth', label: 'Vikram Seth' },
                    { value: 'Ananya Sharma', label: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalAmount" label="Order Total Amount (₹)" rules={[{ required: true }]}>
                <InputNumber min={1000} style={{ width: '100%' }} placeholder="450000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date" initialValue="2026-12-05">
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orderPriority" label="Order Priority" initialValue="Normal">
                <Select
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'High', label: 'High Priority' },
                    { value: 'Urgent', label: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="shippingAddress" label="Delivery & Shipping Address">
                <Input.TextArea rows={2} placeholder="Industrial estate address for transport dispatch" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}>
              Confirm Sales Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
