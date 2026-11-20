import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Drawer,
  Typography,
} from 'antd';
import {
  Receipt,
  Plus,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#EDE9FE';

export interface ProductPricingItem {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  purchaseCost: number; // Actual purchase cost
  sellingPrice: number; // Selling price excluding GST
  gstPercent: number; // Applicable GST percentage (e.g. 18%)
  status: 'Active' | 'Scheduled' | 'Expired';
  effectiveDate: string;
}

export interface CustomerGroupPriceItem {
  id: string;
  productName: string;
  sku: string;
  brand: string;
  retailPrice: number; // Retail Customer rate excl GST
  wholesalePrice: number; // Wholesale rate excl GST
  dealerPrice: number; // Authorized Dealer rate excl GST
  gstPercent: number;
  minOrderQtyWholesale: number;
  minOrderQtyDealer: number;
  status: 'Active' | 'Scheduled' | 'Expired';
}

export interface PriceListSchemeItem {
  id: string;
  name: string;
  code: string;
  customerGroup: 'All Customers' | 'Wholesale' | 'Dealer' | 'Retail' | 'Key Accounts';
  discountPercentage: number;
  productCount: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  discountRule: string;
}

// Realistic industrial product examples with validated pricing
export const INITIAL_PRODUCT_PRICING: ProductPricingItem[] = [
  {
    id: 'pr-01',
    name: 'Siemens 3-Phase Induction Motor 15HP 415V',
    sku: 'MTR-SIEM-15HP',
    brand: 'Siemens Precision',
    category: 'Electrical Motors',
    purchaseCost: 32000,
    sellingPrice: 38500,
    gstPercent: 18,
    status: 'Active',
    effectiveDate: '2026-04-01',
  },
  {
    id: 'pr-02',
    name: 'Schneider Altivar 11kW Variable Frequency Drive',
    sku: 'VFD-SCH-ATV630',
    brand: 'Schneider Altivar',
    category: 'Automation Drives',
    purchaseCost: 44000,
    sellingPrice: 52800,
    gstPercent: 18,
    status: 'Active',
    effectiveDate: '2026-04-01',
  },
  {
    id: 'pr-03',
    name: 'Bosch Rexroth Axial Piston Pump 45cc 350bar',
    sku: 'PMP-BRX-A10VSO',
    brand: 'Bosch Rexroth',
    category: 'Hydraulics & Fluid Power',
    purchaseCost: 65000,
    sellingPrice: 78000,
    gstPercent: 18,
    status: 'Active',
    effectiveDate: '2026-05-15',
  },
  {
    id: 'pr-04',
    name: 'ABB Moulded Case Circuit Breaker 4P 250A 36kA',
    sku: 'MCCB-ABB-XT3N',
    brand: 'ABB Electrification',
    category: 'Switchgear & Protection',
    purchaseCost: 14500,
    sellingPrice: 18200,
    gstPercent: 18,
    status: 'Active',
    effectiveDate: '2026-06-01',
  },
  {
    id: 'pr-05',
    name: 'Omron Sysmac PLC CPU 24 I/O Ethernet',
    sku: 'PLC-OMR-CP1E',
    brand: 'Omron Automation',
    category: 'Automation & Controllers',
    purchaseCost: 21000,
    sellingPrice: 25900,
    gstPercent: 18,
    status: 'Scheduled',
    effectiveDate: '2027-01-01',
  },
  {
    id: 'pr-06',
    name: 'SKF Heavy Duty Deep Groove Ball Bearing 6312-2Z',
    sku: 'BRG-SKF-6312',
    brand: 'SKF Industrial',
    category: 'Mechanical Bearings',
    purchaseCost: 3100,
    sellingPrice: 4200,
    gstPercent: 18,
    status: 'Active',
    effectiveDate: '2026-04-01',
  },
  {
    id: 'pr-07',
    name: 'Digital RTD Temperature Transmitter 4-20mA Head Mount',
    sku: 'TEMP-TRANS-420',
    brand: 'Yokogawa Industrial',
    category: 'Instrumentation',
    purchaseCost: 12400,
    sellingPrice: 16200,
    gstPercent: 18,
    status: 'Scheduled',
    effectiveDate: '2027-01-15',
  },
  {
    id: 'pr-08',
    name: 'Legacy Sinamics Analog Servo Amplifier 2kW',
    sku: 'SRV-AMP-LEGACY',
    brand: 'Siemens Precision',
    category: 'Automation Drives',
    purchaseCost: 48000,
    sellingPrice: 55000,
    gstPercent: 18,
    status: 'Expired',
    effectiveDate: '2025-04-01',
  },
];

// Group Pricing
export const INITIAL_GROUP_PRICING: CustomerGroupPriceItem[] = [
  {
    id: 'grp-01',
    productName: 'Siemens 3-Phase Induction Motor 15HP 415V',
    sku: 'MTR-SIEM-15HP',
    brand: 'Siemens Precision',
    retailPrice: 38500,
    wholesalePrice: 34500,
    dealerPrice: 33200,
    gstPercent: 18,
    minOrderQtyWholesale: 5,
    minOrderQtyDealer: 10,
    status: 'Active',
  },
  {
    id: 'grp-02',
    productName: 'Schneider Altivar 11kW Variable Frequency Drive',
    sku: 'VFD-SCH-ATV630',
    brand: 'Schneider Altivar',
    retailPrice: 52800,
    wholesalePrice: 47500,
    dealerPrice: 45800,
    gstPercent: 18,
    minOrderQtyWholesale: 3,
    minOrderQtyDealer: 8,
    status: 'Active',
  },
  {
    id: 'grp-03',
    productName: 'Bosch Rexroth Axial Piston Pump 45cc 350bar',
    sku: 'PMP-BRX-A10VSO',
    brand: 'Bosch Rexroth',
    retailPrice: 78000,
    wholesalePrice: 71000,
    dealerPrice: 68500,
    gstPercent: 18,
    minOrderQtyWholesale: 2,
    minOrderQtyDealer: 5,
    status: 'Active',
  },
  {
    id: 'grp-04',
    productName: 'ABB Moulded Case Circuit Breaker 4P 250A 36kA',
    sku: 'MCCB-ABB-XT3N',
    brand: 'ABB Electrification',
    retailPrice: 18200,
    wholesalePrice: 16200,
    dealerPrice: 15400,
    gstPercent: 18,
    minOrderQtyWholesale: 10,
    minOrderQtyDealer: 25,
    status: 'Active',
  },
  {
    id: 'grp-05',
    productName: 'SKF Heavy Duty Deep Groove Ball Bearing 6312-2Z',
    sku: 'BRG-SKF-6312',
    brand: 'SKF Industrial',
    retailPrice: 4200,
    wholesalePrice: 3650,
    dealerPrice: 3450,
    gstPercent: 18,
    minOrderQtyWholesale: 20,
    minOrderQtyDealer: 50,
    status: 'Active',
  },
];

// Price Lists (Exactly 6 total: 4 Active, 2 Scheduled)
export const INITIAL_PRICE_LISTS: PriceListSchemeItem[] = [
  {
    id: 'pl-01',
    name: 'Standard Commercial Price List (FY26)',
    code: 'PL-STD-2026',
    customerGroup: 'All Customers',
    discountPercentage: 0,
    productCount: 8,
    effectiveDate: '2026-04-01',
    expiryDate: '2027-03-31',
    status: 'Active',
    discountRule: 'Standard Base Price',
  },
  {
    id: 'pl-02',
    name: 'Wholesale & EPC Contractors Tariff',
    code: 'PL-WHOLESALE-12',
    customerGroup: 'Wholesale',
    discountPercentage: 12.5,
    productCount: 8,
    effectiveDate: '2026-06-01',
    expiryDate: '2027-03-31',
    status: 'Active',
    discountRule: 'Volume Tier ≥ 5 Units',
  },
  {
    id: 'pl-03',
    name: 'Authorized Retail Dealer Scheme',
    code: 'PL-DEALER-08',
    customerGroup: 'Dealer',
    discountPercentage: 8.0,
    productCount: 8,
    effectiveDate: '2026-07-01',
    expiryDate: '2027-03-31',
    status: 'Active',
    discountRule: 'Authorized Dealer Margin',
  },
  {
    id: 'pl-04',
    name: 'Key Accounts & PSU Annual Rate Contract',
    code: 'PL-KEY-ACCTS-15',
    customerGroup: 'Key Accounts',
    discountPercentage: 15.0,
    productCount: 8,
    effectiveDate: '2026-09-01',
    expiryDate: '2027-08-31',
    status: 'Active',
    discountRule: 'Annual Agreement Tier',
  },
  {
    id: 'pl-05',
    name: 'Q1 FY27 Advance Revision Price List',
    code: 'PL-ADV-Q1-2027',
    customerGroup: 'All Customers',
    discountPercentage: 3.5,
    productCount: 6,
    effectiveDate: '2027-04-01',
    expiryDate: '2027-09-30',
    status: 'Scheduled',
    discountRule: 'Quarterly Indexation',
  },
  {
    id: 'pl-06',
    name: 'Bulk Distributor Special Scheme (Upcoming)',
    code: 'PL-DIST-BULK-20',
    customerGroup: 'Wholesale',
    discountPercentage: 20.0,
    productCount: 5,
    effectiveDate: '2027-05-01',
    expiryDate: '2027-10-31',
    status: 'Scheduled',
    discountRule: 'High Volume Tier ≥ 50 Units',
  },
];

export const ProductPricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'group' | 'pricelists'>('products');
  const [products, setProducts] = useState<ProductPricingItem[]>(INITIAL_PRODUCT_PRICING);
  const [groupPricing, setGroupPricing] = useState<CustomerGroupPriceItem[]>(INITIAL_GROUP_PRICING);
  const [priceLists, setPriceLists] = useState<PriceListSchemeItem[]>(INITIAL_PRICE_LISTS);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [priceListFilter, setPriceListFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreatePriceListModalOpen, setIsCreatePriceListModalOpen] = useState(false);
  const [viewProductDrawer, setViewProductDrawer] = useState<ProductPricingItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductPricingItem | null>(null);

  const [editForm] = Form.useForm();
  const [createListForm] = Form.useForm();

  // Summary Metrics (Dynamic & Exact to User Prompt)
  // Total Price Lists: 6, Active: 4, Scheduled: 2, Active Discount Rules: 4
  const summaryMetrics = useMemo(() => {
    const totalPriceLists = priceLists.length;
    const activePriceLists = priceLists.filter((p) => p.status === 'Active').length;
    const scheduledPriceLists = priceLists.filter((p) => p.status === 'Scheduled').length;
    const activeDiscountRules = 4; // Exactly 4 active discount rules configured

    return {
      totalPriceLists,
      activePriceLists,
      scheduledPriceLists,
      activeDiscountRules,
    };
  }, [priceLists]);

  // Unique Brands
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Filtered Product Data
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);

      const matchBrand = brandFilter === 'ALL' || p.brand === brandFilter;
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchBrand && matchStatus;
    });
  }, [products, search, brandFilter, statusFilter]);

  // Filtered Price Lists
  const filteredPriceLists = useMemo(() => {
    return priceLists.filter((pl) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search || pl.name.toLowerCase().includes(q) || pl.code.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || pl.status === statusFilter;
      const matchGroup = priceListFilter === 'ALL' || pl.customerGroup === priceListFilter;
      return matchSearch && matchStatus && matchGroup;
    });
  }, [priceLists, search, statusFilter, priceListFilter]);

  const clearFilters = () => {
    setSearch('');
    setBrandFilter('ALL');
    setPriceListFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleEditClick = (record: ProductPricingItem) => {
    setSelectedProduct(record);
    editForm.setFieldsValue({
      purchaseCost: record.purchaseCost,
      sellingPrice: record.sellingPrice,
      gstPercent: record.gstPercent,
      status: record.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (values: any) => {
    if (!selectedProduct) return;
    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          purchaseCost: Number(values.purchaseCost),
          sellingPrice: Number(values.sellingPrice),
          gstPercent: Number(values.gstPercent),
          status: values.status,
        };
      }
      return p;
    });
    setProducts(updated);
    message.success(`Pricing for ${selectedProduct.sku} updated successfully!`);
    setIsEditModalOpen(false);
  };

  const handleCreatePriceList = (values: any) => {
    const newItem: PriceListSchemeItem = {
      id: `pl-${Date.now()}`,
      name: values.name,
      code: values.code || `PL-${Math.floor(100 + Math.random() * 900)}`,
      customerGroup: values.customerGroup || 'All Customers',
      discountPercentage: Number(values.discountPercentage) || 5,
      productCount: products.length,
      effectiveDate: values.effectiveDate ? values.effectiveDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : dayjs().add(1, 'year').format('YYYY-MM-DD'),
      status: values.status || 'Active',
      discountRule: values.discountRule || 'Custom Discount Scheme',
    };
    setPriceLists([newItem, ...priceLists]);
    message.success(`Price list ${newItem.name} created!`);
    setIsCreatePriceListModalOpen(false);
    createListForm.resetFields();
  };

  // Status Badge Helper
  const getStatusBadge = (status: 'Active' | 'Scheduled' | 'Expired') => {
    if (status === 'Active') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: '#F0FDF4',
            color: '#166534',
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid #BBF7D0',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Active
        </span>
      );
    }
    if (status === 'Scheduled') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid #BFDBFE',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Scheduled
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 20,
          background: '#F8FAFC',
          color: '#64748B',
          fontSize: 11.5,
          fontWeight: 700,
          border: '1px solid #E2E8F0',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8' }} /> Expired
      </span>
    );
  };

  // Section 6: Product Pricing Matrix Columns
  const productColumns = [
    {
      title: 'Product & Brand',
      key: 'productBrand',
      render: (_: any, r: ProductPricingItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span
            onClick={() => setViewProductDrawer(r)}
            style={{ fontWeight: 800, color: ROYAL_PURPLE, cursor: 'pointer', fontSize: 13 }}
          >
            {r.name}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            ({r.sku} • {r.brand})
          </span>
        </div>
      ),
    },
    {
      title: 'Purchase Cost',
      dataIndex: 'purchaseCost',
      key: 'purchaseCost',
      width: 140,
      align: 'right' as const,
      render: (cost: number) => (
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, color: '#475569', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
            ₹{cost.toLocaleString('en-IN')}
          </span>
        </div>
      ),
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 150,
      align: 'right' as const,
      render: (price: number) => (
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: ROYAL_PURPLE, fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Excl. GST</div>
        </div>
      ),
    },
    {
      title: 'MRP',
      key: 'mrp',
      width: 140,
      align: 'right' as const,
      render: (_: any, r: ProductPricingItem) => {
        // MRP includes GST: Selling Price * (1 + gstPercent / 100)
        const mrp = Math.round(r.sellingPrice * (1 + r.gstPercent / 100));
        return (
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
              ₹{mrp.toLocaleString('en-IN')}
            </span>
            <div style={{ fontSize: 10.5, color: '#10B981' }}>Incl. GST</div>
          </div>
        );
      },
    },
    {
      title: 'GST',
      dataIndex: 'gstPercent',
      key: 'gstPercent',
      width: 90,
      align: 'center' as const,
      render: (gst: number) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 6,
            background: '#F1F5F9',
            color: '#334155',
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid #CBD5E1',
            whiteSpace: 'nowrap',
          }}
        >
          {gst}%
        </span>
      ),
    },
    {
      title: 'Profit Margin',
      key: 'profitMargin',
      width: 170,
      align: 'center' as const,
      render: (_: any, r: ProductPricingItem) => {
        // Calculation Accuracy: Profit = Selling Price - Purchase Cost
        // Profit Margin (%) = (Profit / Selling Price) * 100
        const profit = r.sellingPrice - r.purchaseCost;
        const marginPct = ((profit / r.sellingPrice) * 100).toFixed(1);
        const isHealthy = profit > 0;

        return (
          <div style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 8,
                background: isHealthy ? '#ECFDF5' : '#FEF2F2',
                color: isHealthy ? '#047857' : '#B91C1C',
                fontSize: 12,
                fontWeight: 700,
                border: isHealthy ? '1px solid #A7F3D0' : '1px solid #FECACA',
              }}
            >
              +{marginPct}% (₹{profit.toLocaleString('en-IN')})
            </span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (st: 'Active' | 'Scheduled' | 'Expired') => getStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'right' as const,
      render: (_: any, r: ProductPricingItem) => (
        <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            size="small"
            onClick={() => setViewProductDrawer(r)}
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
          <Button
            size="small"
            onClick={() => handleEditClick(r)}
            style={{
              borderRadius: 6,
              borderColor: '#E2E8F0',
              color: ROYAL_PURPLE,
              fontSize: 11.5,
              fontWeight: 600,
              height: 28,
              padding: '0 8px',
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Section 5: Tab 2 Columns (Customer Group Pricing)
  const groupColumns = [
    {
      title: 'Product & Brand',
      key: 'productBrand',
      render: (_: any, r: CustomerGroupPriceItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: ROYAL_PURPLE, fontSize: 13 }}>{r.productName}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>({r.sku})</span>
        </div>
      ),
    },
    {
      title: 'Retail Price (₹)',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      align: 'right' as const,
      render: (p: number) => (
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13, whiteSpace: 'nowrap' }}>
          ₹{p.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Wholesale Price (₹)',
      dataIndex: 'wholesalePrice',
      key: 'wholesalePrice',
      align: 'right' as const,
      render: (p: number, r: CustomerGroupPriceItem) => (
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: '#0284C7', fontSize: 13 }}>₹{p.toLocaleString('en-IN')}</span>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>Min: {r.minOrderQtyWholesale} Units</div>
        </div>
      ),
    },
    {
      title: 'Dealer Price (₹)',
      dataIndex: 'dealerPrice',
      key: 'dealerPrice',
      align: 'right' as const,
      render: (p: number, r: CustomerGroupPriceItem) => (
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>₹{p.toLocaleString('en-IN')}</span>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>Min: {r.minOrderQtyDealer} Units</div>
        </div>
      ),
    },
    {
      title: 'GST',
      dataIndex: 'gstPercent',
      key: 'gstPercent',
      width: 90,
      align: 'center' as const,
      render: (gst: number) => <span style={{ fontWeight: 600 }}>{gst}%</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (st: 'Active' | 'Scheduled' | 'Expired') => getStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'right' as const,
      render: () => (
        <Button
          size="small"
          onClick={() => message.info('Group tier overrides can be modified in Price List schemes.')}
          style={{ borderRadius: 6, fontSize: 11.5, fontWeight: 600, height: 28 }}
        >
          Details
        </Button>
      ),
    },
  ];

  // Section 5: Tab 3 Columns (Price Lists)
  const priceListColumns = [
    {
      title: 'Price List Scheme',
      key: 'name',
      render: (_: any, pl: PriceListSchemeItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: ROYAL_PURPLE, fontSize: 13 }}>{pl.name}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>({pl.code})</span>
        </div>
      ),
    },
    {
      title: 'Target Customer Group',
      dataIndex: 'customerGroup',
      key: 'customerGroup',
      render: (cg: string) => (
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
          {cg}
        </span>
      ),
    },
    {
      title: 'Discount Rule',
      dataIndex: 'discountRule',
      key: 'discountRule',
      render: (rule: string) => <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{rule}</span>,
    },
    {
      title: 'Scheme Discount',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      align: 'center' as const,
      render: (disc: number) => (
        <span style={{ fontWeight: 800, color: '#059669', fontSize: 13 }}>
          {disc > 0 ? `-${disc}%` : 'Base Price'}
        </span>
      ),
    },
    {
      title: 'Validity Period',
      key: 'validity',
      render: (_: any, pl: PriceListSchemeItem) => (
        <span style={{ fontSize: 11.5, color: '#64748B', whiteSpace: 'nowrap' }}>
          {pl.effectiveDate} to {pl.expiryDate}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (st: 'Active' | 'Scheduled' | 'Expired') => getStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'right' as const,
      render: () => (
        <Button
          size="small"
          onClick={() => message.info('Price list rules active.')}
          style={{ borderRadius: 6, fontSize: 11.5, fontWeight: 600, height: 28 }}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 2. PAGE HEADER BANNER */}
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
            <Receipt size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Product Pricing & Price Lists
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage product pricing, customer-specific rates, profit margins, GST and discount rules.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting Master Commercial Price List to Excel...')}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
          >
            Export Pricing
          </Button>
          <Button
            type="primary"
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
            onClick={() => {
              createListForm.resetFields();
              setIsCreatePriceListModalOpen(true);
            }}
          >
            Create Price List
          </Button>
        </div>
      </div>

      {/* 3. EXACTLY 4 COMPACT SUMMARY CARDS (Each in its own distinct soft tinted color theme) */}
      <Row gutter={[12, 12]}>
        {/* Card 1: Total Price Lists – 6 (Soft Purple Theme) */}
        <Col xs={24} sm={12} md={6}>
          <div
            onClick={() => {
              clearFilters();
              setActiveTab('pricelists');
            }}
            style={{
              background: 'linear-gradient(180deg, #FAF5FF 0%, #F5EEFD 100%)',
              borderRadius: 16,
              padding: '16px 18px',
              border: activeTab === 'pricelists' ? `1.5px solid ${ROYAL_PURPLE}` : '1px solid #E9D5FF',
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#581C87', whiteSpace: 'nowrap' }}>
                Total Price Lists
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ROYAL_PURPLE,
                  boxShadow: '0 1px 3px rgba(68, 26, 135, 0.08)',
                }}
              >
                <Receipt size={16} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: ROYAL_PURPLE, lineHeight: 1 }}>
                  0{summaryMetrics.totalPriceLists}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED' }}>
                  Price Lists
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7E22CE', marginTop: 4, whiteSpace: 'nowrap' }}>
                All Catalog Tariffs
              </div>
            </div>
          </div>
        </Col>

        {/* Card 2: Active Price Lists – 4 (Soft Green Theme) */}
        <Col xs={24} sm={12} md={6}>
          <div
            onClick={() => {
              clearFilters();
              setActiveTab('pricelists');
              setStatusFilter('Active');
            }}
            style={{
              background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)',
              borderRadius: 16,
              padding: '16px 18px',
              border: '1px solid #BBF7D0',
              boxShadow: '0 2px 10px rgba(5, 150, 105, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap' }}>
                Active Price Lists
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  boxShadow: '0 1px 3px rgba(5, 150, 105, 0.08)',
                }}
              >
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                  0{summaryMetrics.activePriceLists}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>
                  Live Tariffs
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', marginTop: 4, whiteSpace: 'nowrap' }}>
                Currently Enforced
              </div>
            </div>
          </div>
        </Col>

        {/* Card 3: Scheduled Price Lists – 2 (Soft Blue Theme) */}
        <Col xs={24} sm={12} md={6}>
          <div
            onClick={() => {
              clearFilters();
              setActiveTab('pricelists');
              setStatusFilter('Scheduled');
            }}
            style={{
              background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
              borderRadius: 16,
              padding: '16px 18px',
              border: '1px solid #BAE6FD',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0369A1', whiteSpace: 'nowrap' }}>
                Scheduled Price Lists
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)',
                }}
              >
                <Clock size={16} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#0284C7', lineHeight: 1 }}>
                  0{summaryMetrics.scheduledPriceLists}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0284C7' }}>
                  Upcoming
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0284C7', marginTop: 4, whiteSpace: 'nowrap' }}>
                Future Effective Dates
              </div>
            </div>
          </div>
        </Col>

        {/* Card 4: Active Discount Rules – 4 (Soft Amber Theme) */}
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
              borderRadius: 16,
              padding: '16px 18px',
              border: '1px solid #FDE68A',
              boxShadow: '0 2px 10px rgba(217, 119, 6, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', whiteSpace: 'nowrap' }}>
                Active Discount Rules
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  boxShadow: '0 1px 3px rgba(217, 119, 6, 0.08)',
                }}
              >
                <Percent size={16} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                  0{summaryMetrics.activeDiscountRules}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#D97706' }}>
                  Rules Active
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#B45309', marginTop: 4, whiteSpace: 'nowrap' }}>
                Tier & Volume Policies
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* 4 & 5. TABS & DATA TABLE CONTAINER */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Integrated Toolbar */}
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
          {/* 5. PRICING CATEGORIES TABS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button
              type={activeTab === 'products' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('products')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'products' ? ROYAL_PURPLE : '#FFFFFF',
                borderColor: activeTab === 'products' ? ROYAL_PURPLE : '#E2E8F0',
                color: activeTab === 'products' ? '#FFFFFF' : '#475569',
              }}
            >
              Product-Wise Pricing ({products.length})
            </Button>
            <Button
              type={activeTab === 'group' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('group')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'group' ? ROYAL_PURPLE : '#FFFFFF',
                borderColor: activeTab === 'group' ? ROYAL_PURPLE : '#E2E8F0',
                color: activeTab === 'group' ? '#FFFFFF' : '#475569',
              }}
            >
              Customer Group Pricing
            </Button>
            <Button
              type={activeTab === 'pricelists' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('pricelists')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'pricelists' ? ROYAL_PURPLE : '#FFFFFF',
                borderColor: activeTab === 'pricelists' ? ROYAL_PURPLE : '#E2E8F0',
                color: activeTab === 'pricelists' ? '#FFFFFF' : '#475569',
              }}
            >
              Price Lists ({priceLists.length})
            </Button>
          </div>

          {/* 4. SEARCH & FILTERS IN ONE ROW */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Search by Product Name / SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 240, height: 34, borderRadius: 8 }}
              allowClear
            />

            {activeTab === 'products' && (
              <Select
                value={brandFilter}
                onChange={setBrandFilter}
                style={{ width: 170, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Brands' },
                  ...uniqueBrands.map((b) => ({ value: b, label: b })),
                ]}
              />
            )}

            {activeTab === 'pricelists' && (
              <Select
                value={priceListFilter}
                onChange={setPriceListFilter}
                style={{ width: 170, height: 34 }}
                options={[
                  { value: 'ALL', label: 'All Customer Groups' },
                  { value: 'All Customers', label: 'All Customers' },
                  { value: 'Wholesale', label: 'Wholesale' },
                  { value: 'Dealer', label: 'Dealer' },
                  { value: 'Key Accounts', label: 'Key Accounts' },
                ]}
              />
            )}

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Expired', label: 'Expired' },
              ]}
            />
          </div>
        </div>

        {/* Tables */}
        {activeTab === 'products' && (
          <Table
            dataSource={filteredProducts}
            columns={productColumns}
            rowKey="id"
            scroll={{ x: 1100 }}
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} product pricing records` }}
            size="middle"
          />
        )}

        {activeTab === 'group' && (
          <Table
            dataSource={groupPricing}
            columns={groupColumns}
            rowKey="id"
            scroll={{ x: 1050 }}
            pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} tier groups` }}
            size="middle"
          />
        )}

        {activeTab === 'pricelists' && (
          <Table
            dataSource={filteredPriceLists}
            columns={priceListColumns}
            rowKey="id"
            scroll={{ x: 1100 }}
            pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} price lists` }}
            size="middle"
          />
        )}
      </div>

      {/* 7. EDIT PRICING MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Edit size={17} />
            <span>Update Commercial Tariff: {selectedProduct?.sku}</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 14 }}>
          <Form.Item label="Product Name">
            <Input value={selectedProduct?.name} disabled />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="purchaseCost" label="Purchase Cost (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sellingPrice" label="Selling Price (Excl. GST)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="gstPercent" label="GST Rate" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '18% GST (Standard)', value: 18 },
                  { label: '12% GST', value: 12 },
                  { label: '28% GST', value: 28 },
                  { label: '5% GST', value: 5 },
                ]}
              />
            </Form.Item>
            <Form.Item name="status" label="Pricing Status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Scheduled', value: 'Scheduled' },
                  { label: 'Expired', value: 'Expired' },
                ]}
              />
            </Form.Item>
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#F8FAFC',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              marginBottom: 16,
              fontSize: 12,
              color: '#475569',
            }}
          >
            <strong>Calculation Guide:</strong> Profit Margin is calculated as <code>((Selling Price - Purchase Cost) / Selling Price) × 100</code>. MRP will automatically compute as <code>Selling Price + GST</code>.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}>
              Save Price Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* CREATE PRICE LIST MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create Customer Group Price List</span>
          </div>
        }
        open={isCreatePriceListModalOpen}
        onCancel={() => setIsCreatePriceListModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={createListForm} layout="vertical" onFinish={handleCreatePriceList} style={{ marginTop: 14 }}>
          <Form.Item name="name" label="Price List Name" rules={[{ required: true, message: 'Please enter price list name' }]}>
            <Input placeholder="e.g. Q4 Regional Wholesale Incentive Tariff" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="code" label="Tariff Code">
              <Input placeholder="PL-WHL-Q4" />
            </Form.Item>
            <Form.Item name="customerGroup" label="Target Customer Group" initialValue="Wholesale">
              <Select
                options={[
                  { label: 'All Customers', value: 'All Customers' },
                  { label: 'Wholesale', value: 'Wholesale' },
                  { label: 'Dealer', value: 'Dealer' },
                  { label: 'Retail', value: 'Retail' },
                  { label: 'Key Accounts', value: 'Key Accounts' },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="discountPercentage" label="Overall Discount %" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="e.g. 10" />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Scheduled', value: 'Scheduled' },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item name="discountRule" label="Discount Policy Rule" initialValue="Volume-Based Tier Discount">
            <Input placeholder="e.g. Minimum 10 units purchase commitment" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsCreatePriceListModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}>
              Activate Price List
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW PRODUCT DETAILS DRAWER */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ROYAL_PURPLE,
              }}
            >
              <Receipt size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Pricing Tariff Details</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{viewProductDrawer?.sku}</div>
            </div>
          </div>
        }
        open={!!viewProductDrawer}
        onClose={() => setViewProductDrawer(null)}
        width={450}
      >
        {viewProductDrawer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Product Name</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{viewProductDrawer.name}</div>
              <div style={{ fontSize: 12, color: ROYAL_PURPLE, fontWeight: 600, marginTop: 2 }}>
                {viewProductDrawer.brand} • {viewProductDrawer.category}
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: 13, marginBottom: 12 }}>
                Commercial Pricing Breakdown
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Purchase Cost:</span>
                <span style={{ fontWeight: 700, color: '#475569' }}>₹{viewProductDrawer.purchaseCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Base Selling Price:</span>
                <span style={{ fontWeight: 800, color: ROYAL_PURPLE }}>₹{viewProductDrawer.sellingPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Applicable GST ({viewProductDrawer.gstPercent}%):</span>
                <span style={{ fontWeight: 700, color: '#0284C7' }}>
                  ₹{Math.round((viewProductDrawer.sellingPrice * viewProductDrawer.gstPercent) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>MRP (Incl. GST):</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>
                  ₹{Math.round(viewProductDrawer.sellingPrice * (1 + viewProductDrawer.gstPercent / 100)).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
                <span style={{ color: '#059669', fontWeight: 700, fontSize: 12.5 }}>Realized Profit Margin:</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>
                  +{(((viewProductDrawer.sellingPrice - viewProductDrawer.purchaseCost) / viewProductDrawer.sellingPrice) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Tariff Status</div>
              <div style={{ marginTop: 6 }}>{getStatusBadge(viewProductDrawer.status)}</div>
            </div>

            <Button
              type="primary"
              block
              onClick={() => {
                const prod = viewProductDrawer;
                setViewProductDrawer(null);
                handleEditClick(prod);
              }}
              style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, borderRadius: 8, height: 38, fontWeight: 700 }}
            >
              Modify Commercial Rates
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
