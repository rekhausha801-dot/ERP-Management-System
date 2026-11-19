import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Card,
  Progress,
  Avatar,
  Badge,
  Tooltip,
} from 'antd';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  RefreshCw,
  Building,
  Target,
  Sparkles,
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
  Legend,
} from 'recharts';
import { INITIAL_DETAILED_ORDERS, INITIAL_QUOTATIONS } from '../../mock/salesManagementStore';

// Color Constants
const BRAND_PURPLE = '#5421A8';
const BRAND_PURPLE_LIGHT = '#7544D6';

// 1. Analytics Mock Data
const MONTHLY_REVENUE_TREND = [
  { month: 'Jan', target: 3500000, revenue: 3820000, orders: 42 },
  { month: 'Feb', target: 3800000, revenue: 4150000, orders: 48 },
  { month: 'Mar', target: 4000000, revenue: 4380000, orders: 53 },
  { month: 'Apr', target: 4200000, revenue: 4620000, orders: 58 },
  { month: 'May', target: 4500000, revenue: 4900000, orders: 64 },
  { month: 'Jun', target: 5000000, revenue: 5350000, orders: 71 },
];

const CATEGORY_PERFORMANCE = [
  { name: 'Industrial Electronics', value: 42, amount: '₹22,47,000', color: '#5421A8' },
  { name: 'Hydraulic Components', value: 25, amount: '₹13,37,500', color: '#7544D6' },
  { name: 'Pneumatics & Drives', value: 18, amount: '₹9,63,000', color: '#9333EA' },
  { name: 'Accessories & Spares', value: 15, amount: '₹8,02,500', color: '#C084FC' },
];

const BRAND_PERFORMANCE = [
  { brand: 'Siemens Industrial', revenue: 1850000, orders: 34, growth: '+14%' },
  { brand: 'Schneider Electric', revenue: 1420000, orders: 28, growth: '+9%' },
  { brand: 'ABB Power Systems', revenue: 1180000, orders: 22, growth: '+12%' },
  { brand: 'Bosch Rexroth', revenue: 900000, orders: 19, growth: '+6%' },
];

const BRANCH_SALES = [
  { branch: 'Chennai HQ & Hub', target: 2000000, achieved: 2250000, rate: 112 },
  { branch: 'Coimbatore Industrial', target: 1500000, achieved: 1620000, rate: 108 },
  { branch: 'Bengaluru Tech Branch', target: 1000000, achieved: 980000, rate: 98 },
  { branch: 'Madurai Regional Center', target: 500000, achieved: 500000, rate: 100 },
];

const TOP_SALES_REPS = [
  { name: 'Priya Sharma', role: 'Enterprise Lead', target: '₹15,00,000', achieved: '₹17,80,000', rate: 118, avatar: 'PS' },
  { name: 'Arun Kumar', role: 'Key Account Exec', target: '₹12,00,000', achieved: '₹13,50,000', rate: 112, avatar: 'AK' },
  { name: 'Vignesh Raman', role: 'B2B Sales Specialist', target: '₹10,00,000', achieved: '₹10,80,000', rate: 108, avatar: 'VR' },
  { name: 'Meera Nair', role: 'Commercial Associate', target: '₹8,00,000', achieved: '₹7,90,000', rate: 98, avatar: 'MN' },
];

export const SalesOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('THIS_MONTH');

  // Summary Metrics
  const totalSalesRevenue = '₹53,50,000';
  const totalOrdersCount = INITIAL_DETAILED_ORDERS.length;
  const pendingOrdersCount = INITIAL_DETAILED_ORDERS.filter(o => o.status === 'Confirmed' || o.status === 'In Progress').length;
  const totalCustomersCount = 142;

  // Filtered recent orders
  const filteredOrders = useMemo(() => {
    return INITIAL_DETAILED_ORDERS.filter(order => {
      const matchSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.salesExecutive && order.salesExecutive.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  // Order Table Columns
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (val: string) => (
        <span style={{ fontWeight: 700, color: BRAND_PURPLE, letterSpacing: '0.02em' }}>{val}</span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.shippingAddress || 'Commercial Client'}</div>
        </div>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => (
        <div style={{ fontSize: 12.5, color: '#334155' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={13} color="#94A3B8" /> {date}
          </span>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (st: string) => {
        let color = '#E2E8F0';
        let textColor = '#475569';
        const upper = (st || '').toUpperCase();
        if (upper === 'PAID') {
          color = '#DCFCE7';
          textColor = '#166534';
        } else if (upper.includes('PARTIAL')) {
          color = '#FEF3C7';
          textColor = '#92400E';
        } else {
          color = '#FEE2E2';
          textColor = '#991B1B';
        }
        return (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              backgroundColor: color,
              color: textColor,
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
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      render: (st: string) => {
        const upper = (st || '').toUpperCase();
        const isDelivered = upper === 'DELIVERED';
        const isTransit = upper.includes('SHIPPED') || upper.includes('TRANSIT');
        return (
          <Tag
            color={isDelivered ? 'green' : isTransit ? 'cyan' : 'orange'}
            style={{ borderRadius: 10, fontWeight: 700, fontSize: 11 }}
          >
            {st || 'PENDING'}
          </Tag>
        );
      },
    },
    {
      title: 'Salesperson',
      dataIndex: 'salesExecutive',
      key: 'salesExecutive',
      render: (rep: string) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569' }}>{rep}</span>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const upper = (st || '').toUpperCase();
        let tagColor = 'blue';
        if (upper === 'FULFILLED' || upper === 'CONFIRMED') tagColor = 'green';
        if (upper === 'CANCELLED') tagColor = 'red';
        if (upper.includes('PROGRESS')) tagColor = 'purple';
        return (
          <Tag color={tagColor} style={{ borderRadius: 10, fontWeight: 700, fontSize: 11 }}>
            {st}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="text"
          size="small"
          icon={<Eye size={15} color={BRAND_PURPLE} />}
          onClick={() => navigate('/app/sales/orders')}
          style={{
            borderRadius: 8,
            backgroundColor: '#F3E8FF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* 1. Header with Breadcrumb & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 4 }}>
            <span>Sales Management</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Sales Overview</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Sales Overview & Executive Analytics
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Unified real-time dashboard of revenue targets, sales pipeline, order executions, and team performance
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 150 }}
            options={[
              { value: 'TODAY', label: 'Today' },
              { value: 'THIS_WEEK', label: 'This Week' },
              { value: 'THIS_MONTH', label: 'This Month' },
              { value: 'THIS_QUARTER', label: 'This Quarter' },
              { value: 'THIS_YEAR', label: 'Fiscal Year 2026' },
            ]}
          />
          <Button
            type="primary"
            onClick={() => navigate('/app/sales/quotations')}
            style={{
              backgroundColor: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 12,
              fontWeight: 700,
              height: 38,
              boxShadow: '0 4px 14px rgba(84, 33, 168, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <FileText size={16} /> Create Quotation
          </Button>
          <Button
            onClick={() => navigate('/app/sales/orders')}
            style={{
              borderRadius: 12,
              fontWeight: 700,
              height: 38,
              borderColor: '#E2E8F0',
              color: '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShoppingBag size={16} /> All Sales Orders
          </Button>
        </div>
      </div>

      {/* 2. Exactly 4 Executive Summary KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* KPI 1: Total Sales */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
                }}
              >
                <TrendingUp size={22} color="#FFFFFF" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 9px',
                  borderRadius: 20,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                <ArrowUpRight size={13} /> +12.4%
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
              Total Sales
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {totalSalesRevenue}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
              vs ₹47.6L previous period
            </div>
          </div>
        </Col>

        {/* KPI 2: Total Orders */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                }}
              >
                <ShoppingBag size={22} color="#FFFFFF" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 9px',
                  borderRadius: 20,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                <ArrowUpRight size={13} /> +8.6%
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
              Total Orders
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {totalOrdersCount} Orders
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
              Completed orders: {totalOrdersCount - pendingOrdersCount}
            </div>
          </div>
        </Col>

        {/* KPI 3: Pending Orders */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                }}
              >
                <Clock size={22} color="#FFFFFF" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 9px',
                  borderRadius: 20,
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                In Review
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
              Pending Orders
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {pendingOrdersCount} Orders
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
              Awaiting dispatch & approval
            </div>
          </div>
        </Col>

        {/* KPI 4: Total Customers */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                <Users size={22} color="#FFFFFF" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 9px',
                  borderRadius: 20,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                <ArrowUpRight size={13} /> +18 New
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
              Total Customers
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {totalCustomersCount} Active
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
              Transacting commercial accounts
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Sales Analytics Section: Charts & Comparisons */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Left Chart: Monthly Sales Revenue & Target */}
        <Col xs={24} lg={15}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 22px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  Monthly Sales Revenue vs Target
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Target milestone comparison across last 6 months (FY 2026)
                </span>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: BRAND_PURPLE }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: BRAND_PURPLE }} />
                  Actual Revenue
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                  Sales Target
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REVENUE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND_PURPLE} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={BRAND_PURPLE} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <RechartsTooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #ECE6F8', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={BRAND_PURPLE}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#purpleRevGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Right Chart: Performance by Category Donut */}
        <Col xs={24} lg={9}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 22px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                Sales by Product Category
              </h3>
              <span style={{ fontSize: 12, color: '#64748B' }}>
                Distribution across catalog verticals
              </span>
            </div>

            <div style={{ width: '100%', height: 160, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_PERFORMANCE}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {CATEGORY_PERFORMANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORY_PERFORMANCE.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.amount}</span>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>({item.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* 4. Branch & Top Sales Representatives Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Branch Targets & Sales */}
        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 22px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  Branch-Wise Sales Performance
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>Target vs Achieved across branches</span>
              </div>
              <Tag color="purple" style={{ borderRadius: 10, fontWeight: 700 }}>4 Hubs</Tag>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BRANCH_SALES.map((b, i) => (
                <div key={i} style={{ borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none', paddingBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{b.branch}</span>
                    <span style={{ fontWeight: 800, color: b.rate >= 100 ? '#16A34A' : '#D97706', fontSize: 13 }}>
                      ₹{(b.achieved / 100000).toFixed(2)}L / ₹{(b.target / 100000).toFixed(2)}L ({b.rate}%)
                    </span>
                  </div>
                  <Progress
                    percent={b.rate}
                    showInfo={false}
                    strokeColor={b.rate >= 100 ? BRAND_PURPLE : '#F59E0B'}
                    trailColor="#F1F5F9"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Top Performing Salespersons */}
        <Col xs={24} lg={12}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 22px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  Top Performing Sales Executives
                </h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>Target achievement leaderboards</span>
              </div>
              <Button
                type="text"
                size="small"
                onClick={() => navigate('/app/sales/team')}
                style={{ color: BRAND_PURPLE, fontWeight: 700, fontSize: 12 }}
              >
                View Team &rarr;
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TOP_SALES_REPS.map((rep, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 14,
                    backgroundColor: idx === 0 ? '#FAF5FF' : '#F8FAFC',
                    border: idx === 0 ? '1px solid #E9D5FF' : '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                      style={{
                        backgroundColor: idx === 0 ? BRAND_PURPLE : '#CBD5E1',
                        color: idx === 0 ? '#FFFFFF' : '#334155',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {rep.avatar}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{rep.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{rep.role}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>{rep.achieved}</div>
                    <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>
                      {rep.rate}% Achieved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* 5. Recent Sales Orders Table Section */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '22px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              Recent Sales Orders
            </h3>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Real-time records of incoming and confirmed customer purchase orders
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Input
              prefix={<Search size={15} color="#94A3B8" />}
              placeholder="Search order, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220, borderRadius: 10 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'PROCESSING', label: 'Processing' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'DRAFT', label: 'Draft' },
              ]}
            />
            <Button
              onClick={() => navigate('/app/sales/orders')}
              style={{
                borderRadius: 10,
                color: BRAND_PURPLE,
                borderColor: '#E9D5FF',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              View All Orders &rarr;
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} orders` }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default SalesOverviewPage;
