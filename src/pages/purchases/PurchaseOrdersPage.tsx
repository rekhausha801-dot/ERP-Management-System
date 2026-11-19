import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Tabs,
  Drawer,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Divider,
  Dropdown,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ShoppingCart,
  Plus,
  FileSpreadsheet,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Download,
  CreditCard,
  FileCheck,
  Building,
  User,
  Calendar,
  Layers,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export interface PurchaseOrderItem {
  id: string;
  brand: string;
  product: string;
  sku: string;
  category: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  pendingQty: number;
  originalPrice: number;
  negotiatedPrice: number;
  finalUnitPrice: number;
  discount: number;
  gstPercent: number;
  freight: number;
  effectiveUnitCost: number;
  totalProductAmount: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierCompany: string;
  supplierBranch: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  gstin: string;
  department: string;
  departmentHead: string;
  purchasedBy: string;
  requestedBy: string;
  negotiatedBy: string;
  approvedBy: string;
  purchaseDate: string;
  expectedDeliveryDate: string;
  brand: string;
  product: string;
  quantity: number;
  unitPurchasePrice: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  approvalStatus: 'Draft' | 'Pending Approval' | 'Approved' | 'Completed' | 'Cancelled / Rejected';
  grnStatus: 'Pending' | 'Partial' | 'Complete';
  items: PurchaseOrderItem[];
}

const INITIAL_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-101',
    supplierName: 'Lakshmi Precision Castings',
    supplierCompany: 'Lakshmi Precision Castings Private Limited',
    supplierBranch: 'Peenya Industrial Unit',
    contactPerson: 'M. S. Lakshmanan',
    phone: '+91 98450 11223',
    email: 'orders@lakshmicastings.com',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    gstin: '29AABCL9981K1Z3',
    department: 'Manufacturing & Production',
    departmentHead: 'Rajesh Khanna',
    purchasedBy: 'Suresh Varma',
    requestedBy: 'Plant Supervisor Ramesh',
    negotiatedBy: 'Suresh Varma',
    approvedBy: 'Rajesh Khanna',
    purchaseDate: '2026-11-12',
    expectedDeliveryDate: '2026-11-22',
    brand: 'Lakshmi Pro',
    product: 'Ductile Iron Pump Housing Casings',
    quantity: 40,
    unitPurchasePrice: 12500,
    totalAmount: 590000,
    amountPaid: 300000,
    balanceDue: 290000,
    approvalStatus: 'Approved',
    grnStatus: 'Partial',
    items: [
      {
        id: 'poi-1',
        brand: 'Lakshmi Pro',
        product: 'Ductile Iron Pump Housing Casings',
        sku: 'CAS-DIP-84',
        category: 'Raw Castings',
        unit: 'Pcs',
        orderedQty: 40,
        receivedQty: 25,
        pendingQty: 15,
        originalPrice: 14000,
        negotiatedPrice: 12500,
        finalUnitPrice: 12500,
        discount: 60000,
        gstPercent: 18,
        freight: 15000,
        effectiveUnitCost: 14750,
        totalProductAmount: 590000,
      },
    ],
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-102',
    supplierName: 'Bharat Hydraulic Drives',
    supplierCompany: 'Bharat Hydraulic Components Ltd',
    supplierBranch: 'Ambattur Works',
    contactPerson: 'K. Parthasarathy',
    phone: '+91 94440 22334',
    email: 'sales@bharathydraulics.in',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    gstin: '33AABCB5512L1Z9',
    department: 'R&D and Engineering',
    departmentHead: 'Dr. S. Ramanathan',
    purchasedBy: 'Karthik Raja',
    requestedBy: 'Senior Design Engineer Anita',
    negotiatedBy: 'Karthik Raja',
    approvedBy: 'Dr. S. Ramanathan',
    purchaseDate: '2026-11-14',
    expectedDeliveryDate: '2026-11-25',
    brand: 'BharatDrive',
    product: 'High Pressure Variable Piston Pump 75kW',
    quantity: 4,
    unitPurchasePrice: 180000,
    totalAmount: 849600,
    amountPaid: 849600,
    balanceDue: 0,
    approvalStatus: 'Approved',
    grnStatus: 'Pending',
    items: [
      {
        id: 'poi-2',
        brand: 'BharatDrive',
        product: 'High Pressure Variable Piston Pump 75kW',
        sku: 'PMP-PST-75K',
        category: 'Hydraulic Drives',
        unit: 'Sets',
        orderedQty: 4,
        receivedQty: 0,
        pendingQty: 4,
        originalPrice: 195000,
        negotiatedPrice: 180000,
        finalUnitPrice: 180000,
        discount: 60000,
        gstPercent: 18,
        freight: 20000,
        effectiveUnitCost: 212400,
        totalProductAmount: 849600,
      },
    ],
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-103',
    supplierName: 'Delta Pneumatics India',
    supplierCompany: 'Delta Pneumatic Systems Ltd',
    supplierBranch: 'Pimpri Industrial Hub',
    contactPerson: 'Nitin Deshmukh',
    phone: '+91 98220 77881',
    email: 'info@deltapneumatics.com',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    gstin: '27AABCD3311P1Z1',
    department: 'Operations & Maintenance',
    departmentHead: 'Gokul Chandran',
    purchasedBy: 'Deepa Natarajan',
    requestedBy: 'Facility Lead Mohan',
    negotiatedBy: 'Deepa Natarajan',
    approvedBy: 'Gokul Chandran',
    purchaseDate: '2026-11-08',
    expectedDeliveryDate: '2026-11-16',
    brand: 'DeltaPure',
    product: 'Solenoid Directional Air Valves (1/2 Inch)',
    quantity: 60,
    unitPurchasePrice: 4500,
    totalAmount: 318600,
    amountPaid: 318600,
    balanceDue: 0,
    approvalStatus: 'Completed',
    grnStatus: 'Complete',
    items: [
      {
        id: 'poi-3',
        brand: 'DeltaPure',
        product: 'Solenoid Directional Air Valves (1/2 Inch)',
        sku: 'VLV-SLN-050',
        category: 'Pneumatics',
        unit: 'Pcs',
        orderedQty: 60,
        receivedQty: 60,
        pendingQty: 0,
        originalPrice: 5000,
        negotiatedPrice: 4500,
        finalUnitPrice: 4500,
        discount: 30000,
        gstPercent: 18,
        freight: 5000,
        effectiveUnitCost: 5310,
        totalProductAmount: 318600,
      },
    ],
  },
  {
    id: 'po-4',
    poNumber: 'PO-2026-104',
    supplierName: 'Apex Raw Steel Tubes',
    supplierCompany: 'Apex Industrial Steels Pvt Ltd',
    supplierBranch: 'Coimbatore Foundry Unit',
    contactPerson: 'S. Shanmugam',
    phone: '+91 97880 11990',
    email: 'sales@apexsteels.com',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    gstin: '33AABCA9911N1Z0',
    department: 'Manufacturing & Production',
    departmentHead: 'Rajesh Khanna',
    purchasedBy: 'Meenakshi Iyer',
    requestedBy: 'Production Supervisor Vijay',
    negotiatedBy: 'Meenakshi Iyer',
    approvedBy: 'Pending Department Review',
    purchaseDate: '2026-11-18',
    expectedDeliveryDate: '2026-11-30',
    brand: 'ApexSteel',
    product: 'Seamless Carbon Steel Hydraulic Pipes 32mm',
    quantity: 120,
    unitPurchasePrice: 2800,
    totalAmount: 396480,
    amountPaid: 0,
    balanceDue: 396480,
    approvalStatus: 'Pending Approval',
    grnStatus: 'Pending',
    items: [
      {
        id: 'poi-4',
        brand: 'ApexSteel',
        product: 'Seamless Carbon Steel Hydraulic Pipes 32mm',
        sku: 'PIP-STM-32M',
        category: 'Steel Tubes',
        unit: 'Mtrs',
        orderedQty: 120,
        receivedQty: 0,
        pendingQty: 120,
        originalPrice: 3100,
        negotiatedPrice: 2800,
        finalUnitPrice: 2800,
        discount: 36000,
        gstPercent: 18,
        freight: 8000,
        effectiveUnitCost: 3304,
        totalProductAmount: 396480,
      },
    ],
  },
];

export const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Drawer & Modal States
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'ALL' || o.approvalStatus === activeTab;
    const matchesSearch =
      o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.purchasedBy.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || o.department === selectedDept;
    return matchesTab && matchesSearch && matchesDept;
  });

  const handleOpenDrawer = (record: PurchaseOrderRecord) => {
    setSelectedOrder(record);
    setIsDrawerOpen(true);
  };

  const handleCreatePO = (values: any) => {
    const qty = Number(values.quantity || 10);
    const unitPrice = Number(values.unitPrice || 5000);
    const subtotal = qty * unitPrice;
    const totalAmount = Math.round(subtotal * 1.18);

    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${100 + orders.length + 1}`,
      supplierName: values.supplierName,
      supplierCompany: `${values.supplierName} Private Limited`,
      supplierBranch: 'Primary Dispatch Hub',
      contactPerson: values.contactPerson || 'Vendor Lead',
      phone: values.phone || '+91 98000 00000',
      email: values.email || 'orders@vendor.com',
      city: values.city || 'Chennai',
      state: values.state || 'Tamil Nadu',
      country: 'India',
      gstin: '33AABCX9999M1Z5',
      department: values.department || 'Manufacturing & Production',
      departmentHead: values.department === 'R&D and Engineering' ? 'Dr. S. Ramanathan' : 'Rajesh Khanna',
      purchasedBy: 'Suresh Varma',
      requestedBy: 'Internal Requisition',
      negotiatedBy: 'Suresh Varma',
      approvedBy: 'Pending Department Review',
      purchaseDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: values.expectedDeliveryDate || '2026-12-05',
      brand: values.brand || 'Industrial Std',
      product: values.product,
      quantity: qty,
      unitPurchasePrice: unitPrice,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      approvalStatus: 'Pending Approval',
      grnStatus: 'Pending',
      items: [
        {
          id: `poi-${Date.now()}`,
          brand: values.brand || 'Industrial Std',
          product: values.product,
          sku: 'SKU-PO-GEN',
          category: 'Procurement Package',
          unit: 'Pcs',
          orderedQty: qty,
          receivedQty: 0,
          pendingQty: qty,
          originalPrice: unitPrice * 1.1,
          negotiatedPrice: unitPrice,
          finalUnitPrice: unitPrice,
          discount: 0,
          gstPercent: 18,
          freight: 5000,
          effectiveUnitCost: unitPrice * 1.18,
          totalProductAmount: totalAmount,
        },
      ],
    };

    setOrders([newPO, ...orders]);
    message.success(`Purchase Order ${newPO.poNumber} generated successfully!`);
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: 130,
      render: (text: string, record: PurchaseOrderRecord) => (
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
      ),
    },
    {
      title: 'Supplier & Location',
      key: 'supplier',
      width: 220,
      render: (_: any, r: PurchaseOrderRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{r.supplierName}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <MapPin size={11} color="#7544D6" />
            <span>{r.city}, {r.state}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Department & Head',
      key: 'dept',
      width: 200,
      render: (_: any, r: PurchaseOrderRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#334155', fontSize: 12.5 }}>{r.department}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
            Head: <strong>{r.departmentHead}</strong> &bull; By: {r.purchasedBy}
          </div>
        </div>
      ),
    },
    {
      title: 'Brand & Product',
      key: 'product',
      width: 220,
      render: (_: any, r: PurchaseOrderRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 12.5 }}>{r.product}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
            Brand: <strong style={{ color: '#5421A8' }}>{r.brand}</strong> &bull; Qty: <strong>{r.quantity}</strong>
          </div>
        </div>
      ),
    },
    {
      title: 'Schedule (PO / Due)',
      key: 'dates',
      width: 160,
      render: (_: any, r: PurchaseOrderRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>PO: {r.purchaseDate}</div>
          <div style={{ color: '#0284C7', fontWeight: 700 }}>Due: {r.expectedDeliveryDate}</div>
        </div>
      ),
    },
    {
      title: 'Amount (Gross)',
      key: 'amount',
      width: 150,
      render: (_: any, r: PurchaseOrderRecord) => (
        <div>
          <strong style={{ color: '#1E1B4B', fontSize: 13.5 }}>₹{r.totalAmount.toLocaleString()}</strong>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>@ ₹{r.unitPurchasePrice.toLocaleString()}/unit</div>
        </div>
      ),
    },
    {
      title: 'Approval Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 140,
      render: (st: PurchaseOrderRecord['approvalStatus']) => {
        const color =
          st === 'Approved' ? 'success' : st === 'Completed' ? 'purple' : st === 'Pending Approval' ? 'warning' : 'default';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 8 }}>{st}</Tag>;
      },
    },
    {
      title: 'GRN Status',
      dataIndex: 'grnStatus',
      key: 'grnStatus',
      width: 110,
      render: (grn: PurchaseOrderRecord['grnStatus']) => {
        const color = grn === 'Complete' ? 'green' : grn === 'Partial' ? 'cyan' : 'orange';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 6 }}>{grn}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      align: 'right' as const,
      render: (_: any, record: PurchaseOrderRecord) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Order Details',
            icon: <Eye size={14} />,
            onClick: () => handleOpenDrawer(record),
          },
          {
            key: 'grn',
            label: 'Generate GRN Intake',
            icon: <FileCheck size={14} />,
            onClick: () => message.info(`Navigating to Goods Receipt for ${record.poNumber}`),
          },
          {
            key: 'payment',
            label: 'Record Vendor Payment',
            icon: <CreditCard size={14} />,
            disabled: record.balanceDue === 0,
            onClick: () => message.info(`Recording payment towards ${record.poNumber}`),
          },
          {
            key: 'pdf',
            label: 'Download PO PDF',
            icon: <Download size={14} />,
            onClick: () => message.success(`Downloading Purchase Order ${record.poNumber} PDF...`),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" size="small" icon={<MoreVertical size={16} />} style={{ color: '#5421A8' }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Purchase Orders Directory"
        subtitle="Manage and track company purchase commitments, supplier quotations, negotiations, and multi-department approvals."
        icon={<ShoppingCart size={20} />}
        searchPlaceholder="Search PO #, supplier, product..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Create Purchase Order"
        onPrimaryAction={() => {
          form.resetFields();
          setIsCreateModalOpen(true);
        }}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting PO Ledger...')}
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

      {/* 2. Top 4 KPI Metrics */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Purchase Orders',
            value: `${orders.length} Active`,
            growth: 'PO Ledger',
            isDark: true,
            icon: <ShoppingCart size={20} color="#5421A8" />,
          },
          {
            title: 'Approved Orders',
            value: `${orders.filter((o) => o.approvalStatus === 'Approved').length} POs`,
            growth: 'Ready for Intake',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
          },
          {
            title: 'Pending Department Head',
            value: `${orders.filter((o) => o.approvalStatus === 'Pending Approval').length} POs`,
            growth: 'Action Required',
            isPositive: false,
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Outstanding Payable',
            value: `₹${(orders.reduce((s, o) => s + o.balanceDue, 0) / 100000).toFixed(1)}L`,
            growth: 'Vendor Accounts',
            isPositive: true,
            isDark: false,
            icon: <CreditCard size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Status Tabs Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '12px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 2px 10px rgba(84, 33, 168, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {['ALL', 'Pending Approval', 'Approved', 'Completed', 'Draft', 'Cancelled / Rejected'].map((tab) => (
            <Button
              key={tab}
              size="small"
              onClick={() => setActiveTab(tab)}
              style={{
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 11,
                height: 28,
                padding: '0 12px',
                borderColor: activeTab === tab ? '#5421A8' : '#E2E8F0',
                background: activeTab === tab ? '#5421A8' : '#F8FAFC',
                color: activeTab === tab ? '#FFFFFF' : '#64748B',
              }}
            >
              {tab === 'ALL' ? 'All Orders' : tab}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Select
            value={selectedDept}
            onChange={setSelectedDept}
            style={{ width: 200, height: 30 }}
            options={[
              { label: 'All Departments', value: 'ALL' },
              { label: 'Manufacturing & Production', value: 'Manufacturing & Production' },
              { label: 'R&D and Engineering', value: 'R&D and Engineering' },
              { label: 'Operations & Maintenance', value: 'Operations & Maintenance' },
            ]}
          />
        </div>
      </div>

      {/* 4. Main Purchase Order Table */}
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

      {/* 5. Comprehensive Purchase Order Details Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#5421A8' }}>{selectedOrder.poNumber}</span>
                <Tag color="purple" style={{ fontWeight: 700 }}>{selectedOrder.approvalStatus}</Tag>
                <Tag color={selectedOrder.balanceDue === 0 ? 'green' : 'gold'}>
                  {selectedOrder.balanceDue === 0 ? 'Paid' : 'Unpaid Balance'}
                </Tag>
              </div>
            </div>
          ) : (
            'Purchase Order Details'
          )
        }
        placement="right"
        width={750}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* A. Purchase & Approval Hierarchy */}
            <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 14, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', marginBottom: 10 }}>
                A. Purchase Governance & Stakeholders
              </div>
              <Row gutter={[16, 10]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Operating Division:</div>
                  <strong style={{ color: '#1E1B4B' }}>{selectedOrder.department}</strong>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Department Head:</div>
                  <strong style={{ color: '#1E1B4B' }}>{selectedOrder.departmentHead}</strong>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Requested By:</div>
                  <span style={{ color: '#334155' }}>{selectedOrder.requestedBy}</span>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Negotiated By:</div>
                  <span style={{ color: '#334155' }}>{selectedOrder.negotiatedBy}</span>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Approved By:</div>
                  <span style={{ color: '#16A34A', fontWeight: 700 }}>{selectedOrder.approvedBy}</span>
                </Col>
              </Row>
            </div>

            {/* B. Supplier Information */}
            <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 14, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', marginBottom: 10 }}>
                B. Vendor & Supplier Profile
              </div>
              <Row gutter={[16, 10]}>
                <Col span={14}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>{selectedOrder.supplierCompany}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Branch: {selectedOrder.supplierBranch}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>GSTIN: <strong style={{ color: '#5421A8' }}>{selectedOrder.gstin}</strong></div>
                </Col>
                <Col span={10}>
                  <div style={{ fontSize: 12, color: '#334155' }}>Contact: <strong>{selectedOrder.contactPerson}</strong></div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedOrder.phone}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedOrder.email}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedOrder.city}, {selectedOrder.state}, {selectedOrder.country}</div>
                </Col>
              </Row>
            </div>

            {/* C & D. Brand, Product & Pricing Breakdown */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B', textTransform: 'uppercase', marginBottom: 8 }}>
                C & D. Ordered Line Items & Price Structure
              </div>
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Brand & Product',
                    key: 'prod',
                    render: (_, r) => (
                      <div>
                        <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{r.product}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>Brand: {r.brand} &bull; SKU: {r.sku}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Quantities',
                    key: 'qty',
                    align: 'center',
                    render: (_, r) => (
                      <div style={{ fontSize: 11 }}>
                        <div>Ord: <strong>{r.orderedQty}</strong> {r.unit}</div>
                        <div style={{ color: '#16A34A' }}>Rec: {r.receivedQty}</div>
                        <div style={{ color: '#EF4444' }}>Pend: {r.pendingQty}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Negotiated Price',
                    key: 'price',
                    align: 'right',
                    render: (_, r) => (
                      <div style={{ fontSize: 11.5 }}>
                        <div style={{ color: '#94A3B8', textDecoration: 'line-through' }}>₹{r.originalPrice.toLocaleString()}</div>
                        <div style={{ color: '#16A34A', fontWeight: 700 }}>₹{r.negotiatedPrice.toLocaleString()}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Total (inc. GST)',
                    dataIndex: 'totalProductAmount',
                    key: 'totalProductAmount',
                    align: 'right',
                    render: (t) => <strong style={{ color: '#5421A8', fontSize: 13 }}>₹{t.toLocaleString()}</strong>,
                  },
                ]}
              />
            </div>

            {/* E. Financial Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 340, background: '#FAF9FE', padding: 14, borderRadius: 12, border: '1px solid #ECE8F6', fontSize: 12.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <span>₹{Math.round(selectedOrder.totalAmount / 1.18).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span style={{ color: '#64748B' }}>GST (18%):</span>
                  <span>₹{Math.round(selectedOrder.totalAmount - selectedOrder.totalAmount / 1.18).toLocaleString()}</span>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, color: '#1E1B4B' }}>
                  <span>Grand Total PO Value:</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 700, padding: '3px 0' }}>
                  <span>Vendor Disbursed Paid:</span>
                  <span>₹{selectedOrder.amountPaid.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: selectedOrder.balanceDue > 0 ? '#EF4444' : '#16A34A', fontWeight: 800, padding: '3px 0' }}>
                  <span>Vendor Balance Due:</span>
                  <span>₹{selectedOrder.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <Button icon={<Download size={14} />} onClick={() => message.success('Exporting Official PO PDF')}>
                Download PO Document
              </Button>
              <Button type="primary" style={{ background: '#5421A8', borderColor: '#5421A8' }} onClick={() => message.info('Generating GRN Intake Screen')}>
                Create GRN for this PO
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* 6. CREATE PURCHASE ORDER MODAL */}
      <Modal
        title="Create Company Purchase Order"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleCreatePO} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="supplierName" label="Supplier / Vendor" rules={[{ required: true }]}>
                <Input placeholder="e.g. Lakshmi Precision Castings" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Procuring Department" rules={[{ required: true }]}>
                <Select
                  size="large"
                  defaultValue="Manufacturing & Production"
                  options={[
                    { value: 'Manufacturing & Production', label: 'Manufacturing & Production' },
                    { value: 'R&D and Engineering', label: 'R&D and Engineering' },
                    { value: 'Operations & Maintenance', label: 'Operations & Maintenance' },
                    { value: 'IT & Infrastructure', label: 'IT & Infrastructure' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brand" label="Brand Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Siemens, Bosch, Delta" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product" label="Product / Raw Material" rules={[{ required: true }]}>
                <Input placeholder="e.g. High Pressure Hydraulic Pump Unit" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Ordered Quantity" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" placeholder="10" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unitPrice" label="Negotiated Unit Price (₹)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" placeholder="12500" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedDeliveryDate" label="Promised Delivery Date">
                <Input type="date" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="Vendor City">
                <Input placeholder="e.g. Chennai, Bangalore" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm & Issue PO
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
