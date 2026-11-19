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
  CheckCircle2,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { SalesModuleHeader } from './SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

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
  salesRepresentative: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue' | 'Refunded';
  orderStatus: 'Confirmed' | 'Processing' | 'Partially Shipped' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';
  fulfillmentProgress: number; // 0 to 100
  // Drawer specifics
  billingAddress: string;
  shippingAddress: string;
  warehouse: string;
  deliveryMethod: string;
  trackingNumber: string;
  paymentMethod: string;
  transactionRef: string;
  paymentDate: string;
  notes: string;
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
    salesRepresentative: 'Vikram Seth',
    orderDate: '2026-11-14',
    expectedDeliveryDate: '2026-11-22',
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
    paymentMethod: 'NEFT / RTGS Transfer',
    transactionRef: 'CMS-ICICI-8812903',
    paymentDate: '2026-11-14',
    notes: 'Priority industrial supply for plant expansion project.',
    customerInstructions: 'Unload at Gate 2 with forklift assistance required.',
    items: [
      {
        id: 'item-1',
        productName: '3-Phase Frequency Inverter 15kW with Filter',
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
    salesRepresentative: 'Ananya Sharma',
    orderDate: '2026-11-15',
    expectedDeliveryDate: '2026-11-26',
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
    paymentMethod: 'Corporate Corporate Card',
    transactionRef: 'CC-HDFC-0019283',
    paymentDate: '2026-11-15',
    notes: 'Full payment received before dispatch approval.',
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
    salesRepresentative: 'Vikram Seth',
    orderDate: '2026-11-10',
    expectedDeliveryDate: '2026-11-18',
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
    paymentMethod: 'Net Banking (IMPS)',
    transactionRef: 'IMPS-SBI-9920112',
    paymentDate: '2026-11-10',
    notes: 'Order fulfilled and signed delivery acknowledgement filed.',
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
    salesRepresentative: 'Ananya Sharma',
    orderDate: '2026-11-16',
    expectedDeliveryDate: '2026-11-28',
    totalAmount: 380000,
    paidAmount: 0,
    balanceDue: 380000,
    paymentStatus: 'Unpaid',
    orderStatus: 'Confirmed',
    fulfillmentProgress: 15,
    billingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    shippingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    warehouse: 'Bangalore Regional Hub (WH-02)',
    deliveryMethod: 'Pending Dispatch Partner Assignment',
    trackingNumber: 'Awaiting Fulfillment',
    paymentMethod: 'Cheque on Delivery (Pending)',
    transactionRef: 'Unpaid',
    paymentDate: 'Pending',
    notes: 'Payment clearance expected upon delivery schedule confirmation.',
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
];

export const ConfirmedSalesOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ConfirmedSalesOrder[]>(INITIAL_CONFIRMED_ORDERS);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [salesRepFilter, setSalesRepFilter] = useState('ALL');

  // Drawer & Modal States
  const [selectedOrder, setSelectedOrder] = useState<ConfirmedSalesOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [createForm] = Form.useForm();

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerCompany.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentFilter === 'ALL' || o.paymentStatus === paymentFilter;
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const matchesRep = salesRepFilter === 'ALL' || o.salesRepresentative === salesRepFilter;
    return matchesSearch && matchesPayment && matchesStatus && matchesRep;
  });

  // KPI Calculations
  const totalOrdersCount = orders.length;
  const totalOrdersValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const inFulfillmentOrders = orders.filter(
    (o) => o.orderStatus === 'Processing' || o.orderStatus === 'Partially Shipped' || o.orderStatus === 'Shipped'
  );

  const fullyPaidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
  const totalCollectedAmount = orders.reduce((sum, o) => sum + o.paidAmount, 0);

  const pendingDeliveryOrders = orders.filter(
    (o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing'
  );

  const getOrderStatusTag = (status: ConfirmedSalesOrder['orderStatus']) => {
    switch (status) {
      case 'Confirmed':
        return <Tag color="purple" style={{ fontWeight: 700, borderRadius: 8 }}>Confirmed</Tag>;
      case 'Processing':
        return <Tag color="processing" style={{ fontWeight: 700, borderRadius: 8 }}>Processing</Tag>;
      case 'Partially Shipped':
        return <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 8 }}>Partially Shipped</Tag>;
      case 'Shipped':
        return <Tag color="blue" style={{ fontWeight: 700, borderRadius: 8 }}>Shipped</Tag>;
      case 'Delivered':
        return <Tag color="success" style={{ fontWeight: 700, borderRadius: 8 }}>Delivered</Tag>;
      case 'Cancelled':
        return <Tag color="error" style={{ fontWeight: 700, borderRadius: 8 }}>Cancelled</Tag>;
      case 'On Hold':
        return <Tag color="warning" style={{ fontWeight: 700, borderRadius: 8 }}>On Hold</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: ConfirmedSalesOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return <Tag color="success" style={{ fontWeight: 700, borderRadius: 8 }}>Paid</Tag>;
      case 'Partially Paid':
        return <Tag color="warning" style={{ fontWeight: 700, borderRadius: 8 }}>Partially Paid</Tag>;
      case 'Unpaid':
        return <Tag color="error" style={{ fontWeight: 700, borderRadius: 8 }}>Unpaid</Tag>;
      case 'Overdue':
        return <Tag color="volcano" style={{ fontWeight: 700, borderRadius: 8 }}>Overdue</Tag>;
      case 'Refunded':
        return <Tag color="default" style={{ fontWeight: 700, borderRadius: 8 }}>Refunded</Tag>;
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
    message.success(`Payment of ₹${paymentAmount.toLocaleString()} recorded for ${selectedOrder.orderNumber}!`);
    setIsPaymentModalOpen(false);
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
      referenceQuote: values.referenceQuote || 'DIRECT-PO',
      salesRepresentative: values.salesRepresentative || 'Vikram Seth',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: values.expectedDeliveryDate || '2026-12-05',
      totalAmount: total,
      paidAmount: 0,
      balanceDue: total,
      paymentStatus: 'Unpaid',
      orderStatus: 'Confirmed',
      fulfillmentProgress: 10,
      billingAddress: values.shippingAddress || 'Client Registered Address',
      shippingAddress: values.shippingAddress || 'Client Site Logistics Address',
      warehouse: 'Chennai Central Depot (WH-01)',
      deliveryMethod: 'Surface Freight Logistics',
      trackingNumber: 'Awaiting Dispatch',
      paymentMethod: 'NEFT / Invoice Billing',
      transactionRef: 'Pending',
      paymentDate: 'Pending',
      notes: 'New sales order confirmed through ERP.',
      customerInstructions: 'Call before dispatch.',
      items: [
        {
          id: 'item-new',
          productName: values.productName || 'Industrial Supply Package',
          brand: 'Standard Industrial',
          sku: 'IND-SKU-01',
          quantity: 1,
          unitPrice: total,
          discount: 0,
          taxPercent: 18,
          lineTotal: total,
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    message.success(`Confirmed Sales Order ${newOrder.orderNumber} created!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 140,
      render: (text: string, record: ConfirmedSalesOrder) => (
        <div>
          <span
            onClick={() => handleOpenDrawer(record)}
            style={{
              fontWeight: 800,
              color: '#5421A8',
              backgroundColor: '#F3EEFF',
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            {text}
          </span>
          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 3 }}>
            Ref: <strong style={{ color: '#475569' }}>{record.referenceQuote}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer Details',
      key: 'customer',
      width: 220,
      render: (_: any, record: ConfirmedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{record.customerCompany}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <User size={11} color="#7544D6" />
            <span>{record.customerName}</span> &bull; <span>{record.customerPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Sales Rep',
      dataIndex: 'salesRepresentative',
      key: 'salesRepresentative',
      width: 140,
      render: (rep: string) => (
        <span style={{ fontWeight: 600, color: '#334155', fontSize: 12 }}>{rep}</span>
      ),
    },
    {
      title: 'Schedule (Order / Due)',
      key: 'dates',
      width: 160,
      render: (_: any, record: ConfirmedSalesOrder) => (
        <div style={{ fontSize: 11.5 }}>
          <div style={{ color: '#475569' }}>Ord: {record.orderDate}</div>
          <div style={{ color: '#0284C7', fontWeight: 700, marginTop: 2 }}>Due: {record.expectedDeliveryDate}</div>
        </div>
      ),
    },
    {
      title: 'Amount & Balance',
      key: 'financials',
      width: 170,
      render: (_: any, record: ConfirmedSalesOrder) => (
        <div>
          <div style={{ fontWeight: 900, color: '#1E1B4B', fontSize: 13.5 }}>
            ₹{record.totalAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: record.balanceDue > 0 ? '#EF4444' : '#16A34A', fontWeight: 600, marginTop: 1 }}>
            {record.balanceDue > 0 ? `Due: ₹${record.balanceDue.toLocaleString()}` : 'Fully Cleared'}
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (st: ConfirmedSalesOrder['paymentStatus']) => getPaymentStatusTag(st),
    },
    {
      title: 'Fulfillment Progress',
      key: 'fulfillmentProgress',
      width: 170,
      render: (_: any, record: ConfirmedSalesOrder) => (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
            <span>{record.orderStatus}</span>
            <span>{record.fulfillmentProgress}%</span>
          </div>
          <Progress percent={record.fulfillmentProgress} size="small" strokeColor="#7544D6" showInfo={false} />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      align: 'right' as const,
      render: (_: any, record: ConfirmedSalesOrder) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Order Details',
            icon: <Eye size={14} />,
            onClick: () => handleOpenDrawer(record),
          },
          {
            key: 'payment',
            label: 'Record Payment',
            icon: <CreditCard size={14} />,
            disabled: record.balanceDue === 0,
            onClick: () => handleOpenPayment(record),
          },
          {
            key: 'invoice',
            label: 'Generate Invoice',
            icon: <FileText size={14} />,
            onClick: () => message.success(`Invoice generated for ${record.orderNumber}`),
          },
          {
            key: 'track',
            label: 'Track Delivery',
            icon: <Truck size={14} />,
            onClick: () => message.info(`Carrier: ${record.deliveryMethod} • Tracking: ${record.trackingNumber}`),
          },
          {
            key: 'pdf',
            label: 'Download Order PDF',
            icon: <Download size={14} />,
            onClick: () => message.success(`Downloading PDF for ${record.orderNumber}...`),
          },
          {
            type: 'divider',
          },
          {
            key: 'cancel',
            label: 'Cancel Order',
            icon: <XCircle size={14} />,
            danger: true,
            disabled: record.orderStatus === 'Delivered',
            onClick: () => {
              setOrders((prev) =>
                prev.map((o) => (o.id === record.id ? { ...o, orderStatus: 'Cancelled' } : o))
              );
              message.warning(`Order ${record.orderNumber} marked as Cancelled`);
            },
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button
              type="text"
              size="small"
              icon={<MoreVertical size={16} />}
              style={{ color: '#5421A8' }}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Page Header */}
      <SalesModuleHeader
        title="Confirmed Sales Orders"
        subtitle="Manage confirmed client orders, pricing, payments, delivery schedules, and order fulfillment."
        icon={<ShoppingBag size={20} />}
        searchPlaceholder="Search by Order # or Customer..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Create Sales Order"
        onPrimaryAction={() => {
          createForm.resetFields();
          setIsCreateModalOpen(true);
        }}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Confirmed Sales Orders to Excel...')}
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
            Export Orders
          </Button>
        }
      />

      {/* 2. Top 4 KPI Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Confirmed Orders',
            value: `${totalOrdersCount} Orders`,
            growth: `₹${(totalOrdersValue / 100000).toFixed(1)}L Gross`,
            isDark: true,
            icon: <ShoppingBag size={20} color="#5421A8" />,
          },
          {
            title: 'In Fulfillment',
            value: `${inFulfillmentOrders.length} Active`,
            growth: 'Processing / Transit',
            isDark: false,
            icon: <Truck size={20} color="#10B981" />,
          },
          {
            title: 'Fully Paid Orders',
            value: `${fullyPaidOrders.length} Paid`,
            growth: `₹${(totalCollectedAmount / 100000).toFixed(1)}L Collected`,
            isDark: true,
            icon: <CheckCircle size={20} color="#F59E0B" />,
          },
          {
            title: 'Pending Delivery',
            value: `${pendingDeliveryOrders.length} Pending`,
            growth: 'Warehouse Packing',
            isPositive: false,
            isDark: false,
            icon: <Clock size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Search & Filter Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '14px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 2px 10px rgba(84, 33, 168, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Filter Orders:
          </span>
          <Select
            value={paymentFilter}
            onChange={setPaymentFilter}
            style={{ width: 140, height: 32 }}
            options={[
              { label: 'All Payments', value: 'ALL' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Partially Paid', value: 'Partially Paid' },
              { label: 'Unpaid', value: 'Unpaid' },
              { label: 'Overdue', value: 'Overdue' },
            ]}
          />
          <Select
            value={orderStatusFilter}
            onChange={setOrderStatusFilter}
            style={{ width: 140, height: 32 }}
            options={[
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Processing', value: 'Processing' },
              { label: 'Shipped', value: 'Shipped' },
              { label: 'Delivered', value: 'Delivered' },
              { label: 'Cancelled', value: 'Cancelled' },
            ]}
          />
          <Select
            value={salesRepFilter}
            onChange={setSalesRepFilter}
            style={{ width: 150, height: 32 }}
            options={[
              { label: 'All Representatives', value: 'ALL' },
              { label: 'Vikram Seth', value: 'Vikram Seth' },
              { label: 'Ananya Sharma', value: 'Ananya Sharma' },
            ]}
          />
        </div>

        <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
          Showing <strong>{filteredOrders.length}</strong> of {orders.length} orders
        </div>
      </div>

      {/* 4. Sales Orders Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #ECE8F6',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
          overflow: 'hidden',
        }}
      >
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          size="middle"
        />
      </div>

      {/* 5. ORDER DETAILS DRAWER */}
      <Drawer
        title={
          selectedOrder ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#5421A8' }}>{selectedOrder.orderNumber}</span>
                {getOrderStatusTag(selectedOrder.orderStatus)}
                {getPaymentStatusTag(selectedOrder.paymentStatus)}
              </div>
              <span style={{ fontSize: 12, color: '#64748B' }}>Ref: {selectedOrder.referenceQuote}</span>
            </div>
          ) : (
            'Order Details'
          )
        }
        placement="right"
        width={720}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* A. Customer & Sales Info */}
            <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 14, border: '1px solid #ECE8F6' }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Customer Account</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B', marginTop: 2 }}>{selectedOrder.customerCompany}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>Contact: {selectedOrder.customerName} &bull; {selectedOrder.customerPhone}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedOrder.customerEmail}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Order Scheduling</div>
                  <div style={{ fontSize: 12, color: '#1E1B4B', marginTop: 2 }}>Order Date: <strong>{selectedOrder.orderDate}</strong></div>
                  <div style={{ fontSize: 12, color: '#0284C7', fontWeight: 700 }}>Expected Delivery: {selectedOrder.expectedDeliveryDate}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Sales Rep: <strong>{selectedOrder.salesRepresentative}</strong></div>
                </Col>
              </Row>
            </div>

            {/* B. Product Details */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', marginBottom: 8 }}>
                B. Ordered Line Items
              </div>
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Product Details',
                    dataIndex: 'productName',
                    key: 'productName',
                    render: (text: string, r: ConfirmedOrderItem) => (
                      <div>
                        <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{text}</div>
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
                    align: 'center',
                    width: 60,
                    render: (q) => <span style={{ fontWeight: 800 }}>{q}</span>,
                  },
                  {
                    title: 'Rate (₹)',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    align: 'right',
                    width: 100,
                    render: (p) => `₹${p.toLocaleString()}`,
                  },
                  {
                    title: 'GST',
                    dataIndex: 'taxPercent',
                    key: 'taxPercent',
                    align: 'center',
                    width: 70,
                    render: (t) => `${t}%`,
                  },
                  {
                    title: 'Line Total',
                    dataIndex: 'lineTotal',
                    key: 'lineTotal',
                    align: 'right',
                    width: 110,
                    render: (tot) => <strong style={{ color: '#5421A8' }}>₹{tot.toLocaleString()}</strong>,
                  },
                ]}
              />
            </div>

            {/* C. Financial Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 320, background: '#FAF9FE', padding: 14, borderRadius: 12, border: '1px solid #ECE8F6', fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <span>₹{Math.round(selectedOrder.totalAmount / 1.18).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#64748B' }}>Estimated GST (18%):</span>
                  <span>₹{Math.round(selectedOrder.totalAmount - selectedOrder.totalAmount / 1.18).toLocaleString()}</span>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, color: '#1E1B4B' }}>
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700, padding: '3px 0' }}>
                  <span>Amount Paid:</span>
                  <span>₹{selectedOrder.paidAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: selectedOrder.balanceDue > 0 ? '#EF4444' : '#16A34A', fontWeight: 800, padding: '3px 0' }}>
                  <span>Balance Due:</span>
                  <span>₹{selectedOrder.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* D. Delivery Information */}
            <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 14, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', marginBottom: 10 }}>
                D. Logistics & Delivery Execution
              </div>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Shipping Destination</div>
                  <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>{selectedOrder.shippingAddress}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 6, fontWeight: 700 }}>Dispatching Warehouse</div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{selectedOrder.warehouse}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>Carrier & Tracking</div>
                  <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>{selectedOrder.deliveryMethod}</div>
                  <div style={{ fontSize: 12, color: '#7544D6', fontWeight: 700, marginTop: 4 }}>
                    AWB Tracking: {selectedOrder.trackingNumber}
                  </div>
                </Col>
              </Row>
            </div>

            {/* E. Notes & Instructions */}
            <div style={{ background: '#FAF8FE', padding: 14, borderRadius: 12, border: '1px solid #ECE8F6', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: '#1E1B4B', marginBottom: 4 }}>Client Instructions & Internal Notes:</div>
              <div style={{ color: '#475569' }}>&bull; {selectedOrder.customerInstructions}</div>
              <div style={{ color: '#64748B', marginTop: 4 }}>&bull; Internal Note: {selectedOrder.notes}</div>
            </div>

            {/* Action Buttons in Drawer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button icon={<Download size={14} />} onClick={() => message.success('Downloading Order Acknowledgement PDF')}>
                Download PDF
              </Button>
              {selectedOrder.balanceDue > 0 && (
                <Button
                  type="primary"
                  icon={<CreditCard size={14} />}
                  style={{ background: '#5421A8', borderColor: '#5421A8' }}
                  onClick={() => handleOpenPayment(selectedOrder)}
                >
                  Record Payment
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* 6. RECORD PAYMENT MODAL */}
      <Modal
        title={selectedOrder ? `Record Payment for ${selectedOrder.orderNumber}` : 'Record Payment'}
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        onOk={submitPayment}
        okText="Confirm Payment Receipt"
        okButtonProps={{ style: { backgroundColor: '#5421A8', borderColor: '#5421A8' } }}
      >
        {selectedOrder && (
          <div style={{ marginTop: 14 }}>
            <div style={{ background: '#FAF8FE', padding: 12, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Total Order Value:</span>
                <strong>₹{selectedOrder.totalAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                <span>Current Outstanding Due:</span>
                <strong>₹{selectedOrder.balanceDue.toLocaleString()}</strong>
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

      {/* 7. CREATE SALES ORDER MODAL */}
      <Modal
        title="Create Confirmed Sales Order"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={620}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSalesOrder} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerCompany" label="Customer Enterprise" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerName" label="Contact Person" rules={[{ required: true }]}>
                <Input placeholder="e.g. Ramesh Sundaram" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="referenceQuote" label="Reference Quotation #">
                <Input placeholder="e.g. QT-2026-881" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salesRepresentative" label="Sales Representative">
                <Select
                  size="large"
                  defaultValue="Vikram Seth"
                  options={[
                    { value: 'Vikram Seth', label: 'Vikram Seth' },
                    { value: 'Ananya Sharma', label: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalAmount" label="Order Total Amount (₹)" rules={[{ required: true }]}>
                <InputNumber min={1000} style={{ width: '100%' }} size="large" placeholder="450000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date">
                <Input type="date" size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="shippingAddress" label="Delivery & Shipping Address">
                <Input.TextArea rows={2} placeholder="Industrial estate address for transport dispatch" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Sales Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
