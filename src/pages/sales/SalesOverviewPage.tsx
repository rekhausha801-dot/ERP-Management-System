import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Progress,
  message,
  Dropdown,
} from 'antd';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Search,
  Eye,
  FileText,
  Calendar,
  Building,
  CreditCard,
  Truck,
  Undo2,
  Download,
  Edit,
  ArrowUp,
  ArrowDown,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart2,
  Award,
  Layers,
  ArrowUpRight,
  IndianRupee,
  Users,
  Package,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Line,
} from 'recharts';
import { INITIAL_DETAILED_ORDERS } from '../../mock/salesManagementStore';

// Exact Palette from user reference screenshot
const ROYAL_PURPLE = '#441A87';
const PURPLE_ACCENT = '#5421A8';
const LIGHT_PURPLE_BG = '#F6F3FC';
const CARD_BORDER = '#E7E0F5';
const TEXT_DARK = '#150A33';
const TEXT_MUTED = '#6B7280';

// 1. Monthly Revenue & Target Trends
const MONTHLY_REVENUE_TREND = [
  { month: 'Jan', revenue: 1900000, target: 1800000 },
  { month: 'Feb', revenue: 2600000, target: 2500000 },
  { month: 'Mar', revenue: 3200000, target: 3100000 },
  { month: 'Apr', revenue: 3700000, target: 3600000 },
  { month: 'May', revenue: 4300000, target: 4100000 },
  { month: 'Jun', revenue: 5250000, target: 4800000 },
];

// 2. Weekly Performance
const WEEKLY_PERFORMANCE = [
  { week: 'Week 1', sales: 980000, label: '₹9.8L' },
  { week: 'Week 2', sales: 1240000, label: '₹12.4L' },
  { week: 'Week 3', sales: 1190000, label: '₹11.9L' },
  { week: 'Week 4', sales: 1320000, label: '₹13.2L' },
];

// 3. Product / Service Distribution
const CATEGORY_PERFORMANCE = [
  { name: 'Industrial Electronics', value: 42, amount: '₹22,47,000', color: '#441A87' },
  { name: 'Hydraulic Components', value: 25, amount: '₹13,37,500', color: '#6B35C2' },
  { name: 'Pneumatics & Drives', value: 18, amount: '₹9,63,000', color: '#9761EA' },
  { name: 'Accessories & Spares', value: 15, amount: '₹8,02,500', color: '#D5C4F7' },
];

// 4. Top Selling Products & Brands
const TOP_BRANDS = [
  { rank: 1, name: 'Siemens Industrial', orders: 34, revenue: '₹18.50L', growth: '+14%', isPos: true },
  { rank: 2, name: 'Schneider Electric', orders: 28, revenue: '₹14.20L', growth: '+9%', isPos: true },
  { rank: 3, name: 'ABB Power Systems', orders: 22, revenue: '₹11.80L', growth: '+12%', isPos: true },
  { rank: 4, name: 'Bosch Rexroth', orders: 19, revenue: '₹9.00L', growth: '+6%', isPos: true },
  { rank: 5, name: 'Others', orders: 15, revenue: '₹7.50L', growth: '+4%', isPos: true },
];

// 5. Branch Performance
const BRANCH_PERFORMANCE = [
  { branch: 'Chennai HQ & Hub', achieved: '₹22.50L', target: '₹20.00L', rate: 112 },
  { branch: 'Coimbatore Industrial', achieved: '₹16.20L', target: '₹15.00L', rate: 108 },
  { branch: 'Bengaluru Tech Branch', achieved: '₹9.80L', target: '₹10.00L', rate: 98 },
  { branch: 'Madurai Regional Center', achieved: '₹5.00L', target: '₹5.00L', rate: 100 },
];

// Mini sparkline mock points
const SPARKLINE_UP = [
  { x: 1, y: 10 }, { x: 2, y: 14 }, { x: 3, y: 12 }, { x: 4, y: 18 }, { x: 5, y: 16 }, { x: 6, y: 24 }
];
const SPARKLINE_DOWN = [
  { x: 1, y: 22 }, { x: 2, y: 19 }, { x: 3, y: 20 }, { x: 4, y: 15 }, { x: 5, y: 14 }, { x: 6, y: 10 }
];

export const SalesOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters
  const [dateRange, setDateRange] = useState('This Month');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [salespersonFilter, setSalespersonFilter] = useState('ALL');

  // Filtered recent orders
  const filteredOrders = useMemo(() => {
    return INITIAL_DETAILED_ORDERS.filter((order) => {
      const matchSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.salesExecutive && order.salesExecutive.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter.toUpperCase();
      const matchSalesperson = salespersonFilter === 'ALL' || order.salesExecutive === salespersonFilter;
      return matchSearch && matchStatus && matchSalesperson;
    });
  }, [searchTerm, statusFilter, salespersonFilter]);

  // Order Table Columns matching Clean Minimalist SaaS Style (from user screenshot)
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (val: string, r: any) => (
        <div>
          <span
            onClick={() => navigate('/app/sales/orders')}
            style={{ fontWeight: 800, color: '#441A87', fontSize: 13, cursor: 'pointer', letterSpacing: '-0.2px' }}
          >
            {val}
          </span>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Issued {r.orderDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Customer & Contact',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, r: any) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span>{r.customerEmail || 'billing@client.com'}</span>
            <span>&bull;</span>
            <span style={{ color: '#475569' }}>{r.customerPhone || '+91 98412 11002'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Salesperson',
      dataIndex: 'salesExecutive',
      key: 'salesExecutive',
      width: 170,
      render: (rep: string) => {
        const val = rep || 'Vikram Seth';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#EDE7F6',
                color: ROYAL_PURPLE,
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {val.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{val}</span>
          </div>
        );
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
      render: (d: string) => (
        <div>
          <div style={{ color: '#334155', fontSize: 12.5, fontWeight: 500 }}>{d}</div>
          <div style={{ fontSize: 10.5, color: '#16A34A', fontWeight: 600 }}>Active</div>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 140,
      align: 'right' as const,
      render: (amt: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
            ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>Incl. GST</div>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 135,
      align: 'center' as const,
      render: (st: string) => {
        const upper = (st || '').toUpperCase();
        if (upper === 'PAID') {
          return (
            <span
              style={{
                backgroundColor: '#F0FDF4',
                color: '#166534',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                border: '1px solid #BBF7D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Paid
            </span>
          );
        }
        if (upper.includes('PARTIAL')) {
          return (
            <span
              style={{
                backgroundColor: '#FFFBEB',
                color: '#B45309',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                border: '1px solid #FDE68A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Partially Paid
            </span>
          );
        }
        return (
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              padding: '4px 10px',
              borderRadius: 16,
              fontSize: 11.5,
              fontWeight: 700,
              border: '1px solid #FECACA',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Unpaid
          </span>
        );
      },
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 135,
      align: 'center' as const,
      render: (st: string) => {
        const upper = (st || '').toUpperCase();
        if (upper === 'DELIVERED') {
          return (
            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                border: '1px solid #BBF7D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <CheckCircle size={12} /> Delivered
            </span>
          );
        }
        if (upper.includes('SHIPPED') || upper.includes('TRANSIT')) {
          return (
            <span
              style={{
                backgroundColor: '#E0F2FE',
                color: '#0369A1',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                border: '1px solid #BAE6FD',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Truck size={12} /> Shipped
            </span>
          );
        }
        return (
          <span
            style={{
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              padding: '4px 10px',
              borderRadius: 16,
              fontSize: 11.5,
              fontWeight: 700,
              border: '1px solid #BFDBFE',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Clock size={12} /> Processing
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, r: any) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            size="small"
            onClick={() => navigate('/app/sales/orders')}
            style={{
              borderRadius: 6,
              borderColor: '#E2E8F0',
              color: '#334155',
              fontSize: 11.5,
              fontWeight: 600,
              height: 28,
              padding: '0 10px',
            }}
          >
            View
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit Order',
                  icon: <Edit size={13} />,
                  onClick: () => navigate('/app/sales/orders'),
                },
                {
                  key: 'download',
                  label: 'Download Invoice',
                  icon: <Download size={13} />,
                  onClick: () => message.success(`Downloading order ${r.orderNumber}...`),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
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
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 0 32px 0', backgroundColor: '#FBF9FE', minHeight: '100%' }}>
      {/* 1. TOP HEADER BANNER (Single Straight Line Layout) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 16,
          padding: '14px 22px',
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          border: `1px solid ${CARD_BORDER}`,
          marginBottom: 18,
          boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: '#EDE7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ROYAL_PURPLE,
              flexShrink: 0,
            }}
          >
            <LineChartIcon size={24} strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'serif, "Playfair Display", Georgia',
                fontSize: 22,
                fontWeight: 800,
                color: TEXT_DARK,
                margin: 0,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              Sales Overview
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Unified real-time dashboard of revenue targets, sales pipeline, order execution, and team performance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 130, height: 38 }}
            prefix={<Calendar size={14} color="#6B7280" style={{ marginRight: 6 }} />}
            options={[
              { value: 'This Month', label: 'This Month' },
              { value: 'Today', label: 'Today' },
              { value: 'This Week', label: 'This Week' },
              { value: 'This Quarter', label: 'This Quarter' },
              { value: 'FY 2026', label: 'FY 2026' },
            ]}
          />
          <Select
            value={selectedBranch}
            onChange={setSelectedBranch}
            style={{ width: 140, height: 38 }}
            prefix={<Building size={14} color="#6B7280" style={{ marginRight: 6 }} />}
            options={[
              { value: 'All Branches', label: 'All Branches' },
              { value: 'Chennai HQ', label: 'Chennai HQ' },
              { value: 'Coimbatore', label: 'Coimbatore' },
              { value: 'Bengaluru', label: 'Bengaluru' },
            ]}
          />
          <Button
            type="primary"
            onClick={() => navigate('/app/sales/orders')}
            icon={<ShoppingBag size={15} />}
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

      {/* 2. EXECUTIVE KPI CARDS (Matches Second Image Exactly: Row 1 Gradient Hero Cards + Row 2 Compact KPI Pills) */}
      {/* Top Row: 4 Main Hero Cards with Deep Purple Gradient, Soft Purple Glow, and Colorful Illustration Badges */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Card 1: Total Revenue (Hero Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '20px 22px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
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
                <IndianRupee size={26} strokeWidth={2.6} />
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', marginBottom: 2 }}>
                  Total Revenue
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  ₹2.45 Cr
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +14.2%
                </div>
              </div>
            </div>

            {/* Coin Stack Illustration / Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
              }}
            >
              <IndianRupee size={22} />
            </div>
          </div>
        </Col>

        {/* Card 2: Total Sales Orders (White Card with Purple Ring) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 22px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 4px 16px rgba(68, 26, 135, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: '#EDE7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  flexShrink: 0,
                }}
              >
                <ShoppingBag size={24} />
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', marginBottom: 2 }}>
                  Total Sales Orders
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: TEXT_DARK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  142
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +12.5%
                </div>
              </div>
            </div>

            {/* Shopping Cart / Product Basket Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <ShoppingBag size={22} />
            </div>
          </div>
        </Col>

        {/* Card 3: Pending Orders (Hero Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '20px 22px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
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
                <Clock size={26} strokeWidth={2.6} />
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', marginBottom: 2 }}>
                  Pending Orders
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  18
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +2.3%
                </div>
              </div>
            </div>

            {/* Stopwatch Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
              }}
            >
              <Clock size={22} />
            </div>
          </div>
        </Col>

        {/* Card 4: Win Conversion Rate (White Card with Growth Graph) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 22px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 4px 16px rgba(68, 26, 135, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: '#EDE7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  flexShrink: 0,
                }}
              >
                <TrendingUp size={24} />
              </div>

              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B', marginBottom: 2 }}>
                  Win Conversion Rate
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: TEXT_DARK, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  28.4%
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <ArrowUp size={13} strokeWidth={3} /> +3.1%
                </div>
              </div>
            </div>

            {/* Growth Bar Chart Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#EDE7F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <BarChart2 size={24} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Bottom Row: 4 Clean White Pill Cards (Quotations Pending, Outstanding Receivables, Active Customers, Low Stock Products) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        {/* Pill 1: Quotations Pending */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 20px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#EDE7F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#441A87',
                flexShrink: 0,
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Quotations Pending</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: TEXT_DARK, marginTop: 2 }}>32</div>
            </div>
          </div>
        </Col>

        {/* Pill 2: Outstanding Receivables */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 20px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#EDE7F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#441A87',
                flexShrink: 0,
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Outstanding Receivables</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: TEXT_DARK, marginTop: 2 }}>₹1.28 Cr</div>
            </div>
          </div>
        </Col>

        {/* Pill 3: Active Customers */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 20px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#EDE7F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#441A87',
                flexShrink: 0,
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Active Customers</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: TEXT_DARK, marginTop: 2 }}>1,250</div>
            </div>
          </div>
        </Col>

        {/* Pill 4: Low Stock Products */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 20px',
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#EDE7F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#441A87',
                flexShrink: 0,
              }}
            >
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Low Stock Products</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: TEXT_DARK, marginTop: 2 }}>12</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. MIDDLE CHARTS SECTION (Monthly Sales Revenue vs Target & Sales by Product/Service) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        {/* Left: Monthly Sales Revenue vs Target */}
        <Col xs={24} lg={14}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Dark Purple Ribbon Header */}
            <div
              style={{
                backgroundColor: ROYAL_PURPLE,
                color: '#FFFFFF',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <BarChart2 size={18} />
                <span>Monthly Sales Revenue vs Target</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11.5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  Actual Revenue
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C084FC' }} />
                  Sales Target
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div style={{ padding: '20px 20px 14px', flex: 1, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 36,
                  backgroundColor: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  fontWeight: 800,
                  fontSize: 12,
                  color: ROYAL_PURPLE,
                  zIndex: 2,
                }}
              >
                ₹52.5L
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_REVENUE_TREND} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11.5} tickLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    />
                    <RechartsTooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#441A87"
                      strokeWidth={2.8}
                      fillOpacity={1}
                      fill="url(#mainAreaGrad)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#94A3B8"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Col>

        {/* Right: Sales by Product / Service */}
        <Col xs={24} lg={10}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Dark Purple Ribbon Header */}
            <div
              style={{
                backgroundColor: ROYAL_PURPLE,
                color: '#FFFFFF',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <PieChartIcon size={18} />
              <span>Sales by Product / Service</span>
            </div>

            {/* Donut Chart & Legend */}
            <div
              style={{
                padding: '24px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 16,
                flex: 1,
              }}
            >
              {/* Donut with centered text */}
              <div style={{ position: 'relative', width: 170, height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_PERFORMANCE}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={54}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {CATEGORY_PERFORMANCE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 900, color: TEXT_DARK }}>₹45.05L</div>
                  <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Total Sales</div>
                </div>
              </div>

              {/* Legends list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 230 }}>
                {CATEGORY_PERFORMANCE.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ color: '#334155', fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.amount}</span>
                      <span style={{ color: '#64748B', fontWeight: 700, width: 28, textAlign: 'right' }}>{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* 4. THREE SECTION GRID (Weekly Sales Performance, Top Selling Products & Brands, Branch Performance) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        {/* Box 1: Weekly Sales Performance */}
        <Col xs={24} lg={8}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                backgroundColor: ROYAL_PURPLE,
                color: '#FFFFFF',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <BarChart2 size={16} />
                <span>Weekly Sales Performance</span>
              </div>
              <Select
                size="small"
                defaultValue="Current Month"
                style={{ width: 120 }}
                options={[{ value: 'Current Month', label: 'Current Month' }]}
              />
            </div>

            <div style={{ padding: '20px 14px 10px', flex: 1, position: 'relative' }}>
              <div style={{ width: '100%', height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_PERFORMANCE} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={10.5}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    />
                    <RechartsTooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales']} />
                    <Bar dataKey="sales" fill="#5421A8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Col>

        {/* Box 2: Top Selling Products & Brands */}
        <Col xs={24} lg={9}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                backgroundColor: ROYAL_PURPLE,
                color: '#FFFFFF',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <Award size={16} />
                <span>Top Selling Products & Brands</span>
              </div>
              <Button
                type="link"
                size="small"
                onClick={() => navigate('/app/sales/price-lists')}
                style={{ color: '#E9D5FF', padding: 0, fontSize: 11, fontWeight: 600 }}
              >
                View Price Lists &rarr;
              </Button>
            </div>

            <div style={{ padding: '12px 14px', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ color: '#64748B', borderBottom: '1px solid #F1F5F9', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '6px 8px', fontWeight: 600 }}>Product / Brand</th>
                    <th style={{ padding: '6px 8px', fontWeight: 600 }}>Orders Booked</th>
                    <th style={{ padding: '6px 8px', fontWeight: 600 }}>Revenue</th>
                    <th style={{ padding: '6px 8px', fontWeight: 600 }}>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_BRANDS.map((item, index) => (
                    <tr key={index} style={{ borderBottom: index < 4 ? '1px solid #F8FAFC' : 'none' }}>
                      <td style={{ padding: '8px 8px', color: '#64748B', fontWeight: 600 }}>{item.rank}</td>
                      <td style={{ padding: '8px 8px', color: '#0F172A', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '8px 8px', color: '#475569' }}>{item.orders}</td>
                      <td style={{ padding: '8px 8px', color: '#0F172A', fontWeight: 700 }}>{item.revenue}</td>
                      <td style={{ padding: '8px 8px', color: '#16A34A', fontWeight: 700 }}>
                        <ArrowUp size={11} style={{ display: 'inline', marginRight: 2 }} />
                        {item.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>

        {/* Box 3: Branch-Wise Sales Performance */}
        <Col xs={24} lg={7}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: '0 2px 10px rgba(68, 26, 135, 0.03)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                backgroundColor: ROYAL_PURPLE,
                color: '#FFFFFF',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <Building size={16} />
                <span>Branch-Wise Sales Performance</span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                4 Hubs
              </span>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              {BRANCH_PERFORMANCE.map((b, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{b.branch}</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>
                      {b.achieved} / {b.target} ({b.rate}%)
                    </span>
                  </div>
                  <Progress
                    percent={b.rate}
                    showInfo={false}
                    strokeColor={ROYAL_PURPLE}
                    railColor="#EDE7F6"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* 5. BOTTOM RECENT SALES ORDERS TABLE SECTION (Clean Minimalist SaaS Table Style matching user screenshot) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Minimalist Toolbar matching user screenshot */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
              Recent Sales Orders
            </span>
            <span
              style={{
                backgroundColor: '#EDE7F6',
                color: ROYAL_PURPLE,
                padding: '1px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {filteredOrders.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Filter by customer, order #, rep..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'IN PROGRESS', label: 'Processing' },
                { value: 'SHIPPED', label: 'Shipped' },
                { value: 'FULFILLED', label: 'Delivered' },
              ]}
            />
            <Select
              size="small"
              value={salespersonFilter}
              onChange={setSalespersonFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Reps' },
                { value: 'Vikram Seth', label: 'Vikram Seth' },
                { value: 'Ananya Sharma', label: 'Ananya Sharma' },
              ]}
            />
            <Button
              size="small"
              icon={<Download size={13} />}
              onClick={() => message.success('Exporting orders to Excel...')}
              style={{ borderRadius: 8, height: 34, fontWeight: 600, fontSize: 12, borderColor: '#CBD5E1' }}
            >
              Export
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => navigate('/app/sales/orders')}
              style={{ color: ROYAL_PURPLE, fontWeight: 700, fontSize: 12, padding: '0 4px' }}
            >
              View All &rarr;
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default SalesOverviewPage;
