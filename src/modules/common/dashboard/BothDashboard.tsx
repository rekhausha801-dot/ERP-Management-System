import React, { useState } from 'react';
import { Row, Col, Card, Table, Typography, Button, Select, Badge, Tag, Progress, Tabs, Tooltip as AntTooltip } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import {
  Users,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Wrench,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  Truck,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Package,
  Calendar as CalendarIcon,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { SalesDashboard } from '../../sales-erp/dashboard/SalesDashboard';
import { ServicesDashboard } from '../../services-erp/dashboard/ServicesDashboard';
import type { ErpPackageId } from '../../../config/erpPackageConfig';
import {
  MOCK_CUSTOMERS,
  MOCK_SALES_ORDERS,
  MOCK_SERVICE_TICKETS,
  MOCK_INVOICES,
  MOCK_PRODUCTS,
  MOCK_TECHNICIANS,
} from '../../../mock/salesServiceData';

// 12-Month Revenue Comparison Data with Sales & Service breakdown in INR
const MONTHLY_12M_REVENUE = [
  { month: 'Dec 25', sales: 2450000, service: 1200000, total: 3650000 },
  { month: 'Jan 26', sales: 2800000, service: 1350000, total: 4150000 },
  { month: 'Feb 26', sales: 3100000, service: 1400000, total: 4500000 },
  { month: 'Mar 26', sales: 3600000, service: 1650000, total: 5250000 },
  { month: 'Apr 26', sales: 3200000, service: 1500000, total: 4700000 },
  { month: 'May 26', sales: 3450000, service: 1580000, total: 5030000 },
  { month: 'Jun 26', sales: 3800000, service: 1720000, total: 5520000 },
  { month: 'Jul 26', sales: 3950000, service: 1800000, total: 5750000 },
  { month: 'Aug 26', sales: 4200000, service: 1950000, total: 6150000 },
  { month: 'Sep 26', sales: 4100000, service: 1900000, total: 6000000 },
  { month: 'Oct 26', sales: 4650000, service: 2150000, total: 6800000 },
  { month: 'Nov 26', sales: 4850000, service: 2350000, total: 7200000 },
];

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const [revenuePeriod, setRevenuePeriod] = useState<'12m' | '6m'>('12m');

  // Package-Specific Conditional Rendering
  if (currentPkg === 'SALES') return <SalesDashboard />;
  if (currentPkg === 'SERVICE') return <ServicesDashboard />;

  const displayedRevenue = revenuePeriod === '6m' ? MONTHLY_12M_REVENUE.slice(-6) : MONTHLY_12M_REVENUE;

  return (
    <div style={{ paddingBottom: 36, maxWidth: 1600, margin: '0 auto' }}>
      {/* =========================================================================
          SECTION 1: ENTERPRISE PERFORMANCE INDICATORS (10 OVERALL BUSINESS KPIS)
          ========================================================================= */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>
              Enterprise Performance Indicators
            </h1>
            <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500, marginTop: 4, display: 'inline-block' }}>
              Real-time operational metrics and financial synchronization for {selectedCompany?.name || 'Enterprise'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Tag color="blue" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 12, border: '1px solid #BFDBFE' }}>
              TENANT: {selectedCompany?.code || 'ABC'}
            </Tag>
            <Tag color="purple" style={{ borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 12, border: '1px solid #DDD6FE' }}>
              COMPLETE ERP (SALES + SERVICE)
            </Tag>
          </div>
        </div>

        {/* Top 10 Enterprise Performance KPIs Grid (4 on Desktop, 2 on Tablet, 1 on Mobile) */}
        <Row gutter={[18, 18]}>
          {/* Card 1: Total Customers – Royal Blue gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Customers"
              value="2,480"
              trend={{ value: '+8.4%', isPositive: true }}
              icon={<Users size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)"
              shadowColor="rgba(37, 99, 235, 0.4)"
              onClick={() => navigate('/app/customers')}
            />
          </Col>

          {/* Card 2: Active Customers – Emerald Green gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Active Customers"
              value="1,894"
              trend={{ value: '76.4%', isPositive: true }}
              icon={<UserCheck size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #065F46 0%, #059669 50%, #10B981 100%)"
              shadowColor="rgba(16, 185, 129, 0.4)"
              onClick={() => navigate('/app/customers')}
            />
          </Col>

          {/* Card 3: Total Revenue – Vibrant Purple gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Revenue"
              value="₹72.00 L"
              trend={{ value: '+14.8%', isPositive: true }}
              icon={<DollarSign size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #581C87 0%, #7C3AED 50%, #8B5CF6 100%)"
              shadowColor="rgba(124, 58, 237, 0.4)"
              onClick={() => navigate('/app/billing')}
            />
          </Col>

          {/* Card 4: Total Profit – Teal gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Profit"
              value="₹21.60 L"
              trend={{ value: '30.0%', isPositive: true }}
              icon={<TrendingUp size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #115E59 0%, #0D9488 50%, #14B8A6 100%)"
              shadowColor="rgba(13, 148, 136, 0.4)"
              onClick={() => navigate('/app/finance/profit-loss')}
            />
          </Col>

          {/* Card 5: Total Expenses – Warm Orange gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Expenses"
              value="₹14.80 L"
              trend={{ value: '-4.2%', isPositive: true }}
              icon={<CreditCard size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)"
              shadowColor="rgba(234, 88, 12, 0.4)"
              onClick={() => navigate('/app/finance/expenses')}
            />
          </Col>

          {/* Card 6: Outstanding Payments – Deep Coral gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Outstanding Payments"
              value="₹9.40 L"
              trend={{ value: '14 Pending', isPositive: false }}
              icon={<AlertTriangle size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #9F1239 0%, #E11D48 50%, #F43F5E 100%)"
              shadowColor="rgba(225, 29, 72, 0.4)"
              onClick={() => navigate('/app/finance/receivables')}
            />
          </Col>

          {/* Card 7: Overdue Invoices – Rose Red gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Overdue Invoices"
              value="6 Invoices"
              trend={{ value: '₹3.20 L', isPositive: false }}
              icon={<FileText size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #881337 0%, #BE123C 50%, #E11D48 100%)"
              shadowColor="rgba(190, 18, 60, 0.4)"
              onClick={() => navigate('/app/finance/invoices')}
            />
          </Col>

          {/* Card 8: Total Employees – Indigo gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Employees"
              value="38 Active"
              trend={{ value: '+3 New', isPositive: true }}
              icon={<Users size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #312E81 0%, #4338CA 50%, #6366F1 100%)"
              shadowColor="rgba(67, 56, 202, 0.4)"
              onClick={() => navigate('/app/hr/employees')}
            />
          </Col>

          {/* Card 9: Total Suppliers – Cyan / Blue gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="Total Suppliers"
              value="24 Verified"
              badge={{ text: 'Active' }}
              icon={<Truck size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #0E7490 0%, #0284C7 50%, #06B6D4 100%)"
              shadowColor="rgba(2, 132, 199, 0.4)"
              onClick={() => navigate('/app/sales/suppliers')}
            />
          </Col>

          {/* Card 10: On-time GRN Rate – Premium Green gradient */}
          <Col xs={24} sm={12} lg={6} className="erp-kpi-col-4">
            <KPICard
              title="On-time GRN Rate"
              value="98.2%"
              trend={{ value: '+1.8%', isPositive: true }}
              icon={<ShieldCheck size={22} color="#FFFFFF" strokeWidth={2.2} />}
              bgGradient="linear-gradient(135deg, #14532D 0%, #15803D 50%, #22C55E 100%)"
              shadowColor="rgba(21, 128, 61, 0.4)"
              onClick={() => navigate('/app/sales/grn')}
            />
          </Col>
        </Row>
      </div>

      {/* =========================================================================
          SECTION 2: REVENUE ANALYTICS (12-MONTH MONTHLY SALES VS SERVICE COMPARISON)
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <ChartCard
            title="Revenue Analytics (Sales & Service Performance)"
            extra={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>+18.5% YoY Growth</span>
                <Select
                  value={revenuePeriod}
                  onChange={setRevenuePeriod}
                  size="small"
                  variant="borderless"
                  style={{ fontSize: 12, color: '#7E7A9B' }}
                  options={[
                    { value: '12m', label: 'Last 12 Months' },
                    { value: '6m', label: 'Last 6 Months' },
                  ]}
                />
              </div>
            }
          >
            <div style={{ height: 280, width: '100%', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="#A5A1BE"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, backgroundColor: '#19153B', border: 'none', color: '#FFFFFF' }}
                    itemStyle={{ color: '#FFFFFF' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                  />
                  <Bar name="Sales Revenue" dataKey="sales" fill="#6E56CF" radius={[4, 4, 0, 0]} />
                  <Bar name="Service Revenue" dataKey="service" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        {/* Financial Overview Card */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ReceiptIcon />
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Finance Overview</span>
              </div>
            }
            extra={<Button type="link" size="small" onClick={() => navigate('/app/billing')} style={{ color: '#6E56CF', fontWeight: 700 }}>Finance &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF8FC', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#7E7A9B', fontWeight: 600 }}>Total Invoiced Amount</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#181433' }}>₹81.40 L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#E6FDF4', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#047857', fontWeight: 600 }}>Payments Received</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#047857' }}>₹72.00 L (88.4%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FEF3C7', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>Outstanding Balance</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#B45309' }}>₹9.40 L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FEE2E2', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 600 }}>Overdue Invoices (6)</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#B91C1C' }}>₹3.20 L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#FAF8FC', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#7E7A9B', fontWeight: 600 }}>Total Expenses</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>-₹14.80 L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#EFEBFF', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#5B21B6', fontWeight: 700 }}>Net Realized Profit</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#6E56CF' }}>₹21.60 L</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* =========================================================================
          SECTION 3: SALES MANAGEMENT OVERVIEW & SERVICE MANAGEMENT OVERVIEW PILLARS
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Sales Management Overview */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#EFEBFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={17} color="#6E56CF" />
                </div>
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Sales Management Overview</span>
              </div>
            }
            extra={
              <Button type="link" size="small" onClick={() => navigate('/app/sales/orders')} style={{ color: '#6E56CF', fontWeight: 700 }}>
                Orders &gt;
              </Button>
            }
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            {/* 4 Stat Boxes for Sales Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>1,248</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Total Orders</div>
                <Tag color="blue" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>24 Processing</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>142</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Quotations</div>
                <Tag color="gold" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>18 Pending</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>91.2%</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Realization</div>
                <Tag color="green" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>₹48.5L Invoiced</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>68.5%</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Conversion</div>
                <Tag color="purple" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>8 Deliveries Due</Tag>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Recent Sales Orders Pipeline</span>
              <span style={{ fontSize: 11, color: '#7E7A9B' }}>Real-time Delivery Tracking</span>
            </div>
            {MOCK_SALES_ORDERS.slice(0, 4).map((ord, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < 3 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#6E56CF', marginRight: 8 }}>{ord.orderNumber}</span>
                  <span style={{ fontWeight: 600, color: '#181433' }}>{ord.customerName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: '#181433' }}>₹{ord.totalAmount.toLocaleString()}</span>
                  <Tag color={ord.deliveryStatus === 'Delivered' ? 'green' : ord.deliveryStatus === 'Processing' ? 'blue' : 'purple'} style={{ borderRadius: 10, fontSize: 10 }}>
                    {ord.deliveryStatus}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Service Management Overview */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#E6FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={17} color="#10B981" />
                </div>
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Service Management Overview</span>
              </div>
            }
            extra={
              <Button type="link" size="small" onClick={() => navigate('/app/services/tickets')} style={{ color: '#10B981', fontWeight: 700 }}>
                Tickets &gt;
              </Button>
            }
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            {/* 4 Stat Boxes for Service Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>384</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Active Tickets</div>
                <Tag color="cyan" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>28 In-Progress</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>326</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Completed</div>
                <Tag color="green" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>356 Resolved</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>14 / 16</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Technicians</div>
                <Tag color="purple" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>2 Available</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>98.4%</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>SLA Score</div>
                <Tag color="gold" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>CSAT 4.9/5</Tag>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Breakdown & Dispatch Tickets</span>
              <span style={{ fontSize: 11, color: '#7E7A9B' }}>Assigned Techs</span>
            </div>
            {MOCK_SERVICE_TICKETS.slice(0, 4).map((tkt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < 3 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#10B981', marginRight: 8 }}>{tkt.ticketNumber}</span>
                  <span style={{ fontWeight: 600, color: '#181433' }}>{tkt.customerName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#7E7A9B' }}>{tkt.assignedTechnician}</span>
                  <Tag color={tkt.stage === 'Resolved' ? 'green' : tkt.stage === 'In Progress' ? 'blue' : 'gold'} style={{ borderRadius: 10, fontSize: 10 }}>
                    {tkt.stage}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* =========================================================================
          SECTION 4: INVENTORY WATCH & PERFORMANCE ANALYTICS (TOP AGENTS & TEAMS)
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Inventory & Stock Watch */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Boxes size={18} color="#6E56CF" />
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Inventory & Stock Watch</span>
              </div>
            }
            extra={<Button type="link" size="small" onClick={() => navigate('/app/sales/inventory')} style={{ color: '#6E56CF', fontWeight: 700 }}>Stock &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Total SKUs</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>2,450</div>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Valuation</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#6E56CF' }}>₹1.84 Cr</div>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Low Stock</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#EF4444' }}>8 SKUs</div>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '10px 8px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Pending POs</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>12 Orders</div>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 6 }}>Critical Reorder Alerts:</div>
            {[
              { item: 'Industrial 3-Phase Inverter 15kW', qty: 2, min: 10, unit: 'Units' },
              { item: 'Synthetic Compressor Lubricant 50L', qty: 4, min: 25, unit: 'Cans' },
              { item: 'Precision Bearing Kit 6204-ZZ', qty: 8, min: 50, unit: 'Pcs' },
            ].map((st, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx < 2 ? '1px solid #FAF7FC' : 'none', fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: '#181433' }}>{st.item}</span>
                <Tag color="error" style={{ borderRadius: 8, fontSize: 10 }}>
                  Only {st.qty} {st.unit} left (Min: {st.min})
                </Tag>
              </div>
            ))}
          </Card>
        </Col>

        {/* Top Sales & Service Performers */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} color="#6E56CF" />
                  <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Top Performers (Sales & Service)</span>
                </div>
                <span style={{ fontSize: 11, color: '#7E7A9B' }}>Live Field Metrics</span>
              </div>
            }
            extra={<Button type="link" size="small" onClick={() => navigate('/app/hr/performance')} style={{ color: '#6E56CF', fontWeight: 700 }}>Appraisals &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            {[
              { name: 'Vikram Seth', dept: 'Enterprise Sales', role: 'Sales Lead', score: '₹42.5L Quota (116%)', rate: 98, type: 'Sales' },
              { name: 'Murugan K.', dept: 'Field Engineering', role: 'Lead Tech', score: '49 Tickets / 99% SLA', rate: 99, type: 'Service' },
              { name: 'Ananya Sharma', dept: 'HR & Commercial', role: 'Specialist', score: '100% Tax & SLA Filing', rate: 95, type: 'Operations' },
              { name: 'Dinesh V.', dept: 'Technical Dispatch', role: 'Field Tech', score: '28 Jobs / 94% SLA', rate: 92, type: 'Service' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: i < 3 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#181433' }}>
                    {item.name} <Tag color={item.type === 'Sales' ? 'purple' : 'green'} style={{ fontSize: 9, borderRadius: 6, marginLeft: 4 }}>{item.type}</Tag>
                  </div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>{item.role} • {item.dept}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#6E56CF' }}>{item.score}</div>
                  <Progress percent={item.rate} showInfo={false} strokeColor={item.type === 'Service' ? '#10B981' : '#6E56CF'} size="small" style={{ width: 70, margin: 0 }} />
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* =========================================================================
          SECTION 5: OPERATIONAL MONITORING (SCHEDULED DISPATCHES & CALENDAR)
          ========================================================================= */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarIcon size={18} color="#6E56CF" />
            <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Operational Monitoring & Scheduled Dispatches</span>
          </div>
        }
        extra={<Button type="link" size="small" onClick={() => navigate('/app/calendar')} style={{ color: '#6E56CF', fontWeight: 700 }}>Full Calendar &gt;</Button>}
        style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
        styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
      >
        <Row gutter={[16, 12]}>
          {[
            { time: '10:30 AM', title: 'Site Inspection & Breakdown Repair – Metro Rail Workshop', client: 'Southern Metro', type: 'Service Breakdown', status: 'En Route', tech: 'Murugan K.' },
            { time: '01:30 PM', title: 'Commercial Contract Signing & PO Handover', client: 'Omni Infra Ventures', type: 'Sales Deal', status: 'Confirmed', tech: 'Vikram Seth' },
            { time: '03:45 PM', title: 'Warehouse Stock Replenishment – Industrial Seal Kits', client: 'Central Hub', type: 'Inventory GRN', status: 'Scheduled', tech: 'Dinesh V.' },
            { time: '05:00 PM', title: 'Monthly Warranty & AMC Audit Signoff', client: 'Apex Precision Works', type: 'AMC Contract', status: 'Pending Review', tech: 'Ananya S.' },
          ].map((op, idx) => (
            <Col xs={24} md={12} key={idx}>
              <div style={{ padding: '12px 14px', backgroundColor: '#FAF8FC', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6E56CF' }}>{op.time} • <span style={{ color: '#7E7A9B' }}>{op.type}</span></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#181433', marginTop: 2 }}>{op.title}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B', marginTop: 2 }}>Client: {op.client} | Lead: {op.tech}</div>
                </div>
                <Tag color={op.status === 'Confirmed' ? 'green' : op.status === 'En Route' ? 'processing' : 'purple'} style={{ borderRadius: 10 }}>
                  {op.status}
                </Tag>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

// Helper Icon for Finance
const ReceiptIcon: React.FC = () => (
  <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CreditCard size={17} color="#F59E0B" />
  </div>
);
