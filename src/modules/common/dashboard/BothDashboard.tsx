import React, { useState } from 'react';
import { Row, Col, Card, Table, Typography, Button, Select, Badge, Tag, Progress, Tabs } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  DollarSign,
  CreditCard,
  ArrowRight,
  Calendar as CalendarIcon,
  Globe,
  Award,
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { SalesDashboard } from '../../sales-erp/dashboard/SalesDashboard';
import { ServicesDashboard } from '../../services-erp/dashboard/ServicesDashboard';
import type { ErpPackageId } from '../../../config/erpPackageConfig';

// Yearly Revenue Bar Series (Reference UI Dual Purple Palette)
const YEARLY_REVENUE_DATA = [
  { month: 'Jan', revenue: 26000, color: '#7E69DC' },
  { month: 'Feb', revenue: 38000, color: '#2C225C' },
  { month: 'Mar', revenue: 9000, color: '#6A53D6' },
  { month: 'April', revenue: 48000, color: '#1B1440' },
  { month: 'May', revenue: 16000, color: '#8874E8' },
  { month: 'June', revenue: 35000, color: '#3A2E78' },
  { month: 'July', revenue: 18000, color: '#9D8BF2' },
  { month: 'Aug', revenue: 49000, color: '#1F174A' },
  { month: 'Sep', revenue: 45000, color: '#7E69DC' },
  { month: 'Oct', revenue: 48000, color: '#1E1647' },
  { month: 'Nov', revenue: 39000, color: '#8A77E8' },
  { month: 'Dec', revenue: 29000, color: '#2A1F5E' },
];

const SALES_EXPENSES_DATA = [
  { month: 'Jul', sales: 62000, expenses: 34000 },
  { month: 'Aug', sales: 78000, expenses: 41000 },
  { month: 'Sep', sales: 71000, expenses: 39000 },
  { month: 'Oct', sales: 89000, expenses: 46000 },
  { month: 'Nov', sales: 94000, expenses: 48000 },
  { month: 'Dec', sales: 112000, expenses: 54000 },
];

const DONUT_DATA = [
  { name: 'Goal Achieved', value: 90, color: '#6E56CF' },
  { name: 'Ongoing', value: 10, color: '#201A4A' },
];

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');

  // Role/Package-based sub-dashboards for pure packages
  if (currentPkg === 'SALES') return <SalesDashboard />;
  if (currentPkg === 'SERVICE') return <ServicesDashboard />;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* =========================================================================
          SECTION 1: MAIN 8 KPI CARDS (Sales + Services Unified Enterprise Overview)
          ========================================================================= */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#181433' }}>
              Enterprise Performance Indicators
            </h2>
            <span style={{ fontSize: 12, color: '#7E7A9B' }}>
              Real-time synchronization across Sales & Field Service divisions
            </span>
          </div>
          <Tag color="purple" style={{ borderRadius: 12, padding: '3px 10px', fontWeight: 700, fontSize: 11 }}>
            PACKAGE: COMPLETE (SALES + SERVICE)
          </Tag>
        </div>

        <Row gutter={[14, 14]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Customers"
              value="97,560"
              trend={{ value: '↗ 15.5% +10k today', isPositive: true }}
              icon={<Users size={20} color="#6E56CF" />}
              iconBgColor="#EFEBFF"
              onClick={() => navigate('/app/customers')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Active Customers"
              value="50,890"
              trend={{ value: '↗ 15.5% +10k today', isPositive: true }}
              icon={<Users size={20} color="#F59E0B" />}
              iconBgColor="#FEF3C7"
              onClick={() => navigate('/app/customers')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Revenue"
              value="₹3.85 Cr"
              trend={{ value: '↗ 18.2% vs last month', isPositive: true }}
              icon={<DollarSign size={20} color="#10B981" />}
              iconBgColor="#E6FDF4"
              onClick={() => navigate('/app/finance/overview')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Profit"
              value="$250,000"
              trend={{ value: '↙ 0.5% -0.5k today', isPositive: false }}
              icon={<DollarSign size={20} color="#10B981" />}
              iconBgColor="#E6FDF4"
              onClick={() => navigate('/app/finance/overview')}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Expenses"
              value="156,560"
              trend={{ value: '↗ 5.5% +10k today', isPositive: true }}
              icon={<CreditCard size={20} color="#EF4444" />}
              iconBgColor="#FEE2E2"
              onClick={() => navigate('/app/finance/expenses')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Outstanding Payments"
              value="₹14.20 L"
              trend={{ value: '18 Overdue Invoices', isPositive: false }}
              icon={<CreditCard size={20} color="#F59E0B" />}
              iconBgColor="#FEF3C7"
              onClick={() => navigate('/app/sales/outstanding-receivables')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Employees"
              value="148 Active"
              trend={{ value: '42 Field Techs | 38 Sales', isPositive: true }}
              icon={<UserCheck size={20} color="#6E56CF" />}
              iconBgColor="#EFEBFF"
              onClick={() => navigate('/app/settings/users')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Total Suppliers"
              value="64 Verified"
              trend={{ value: '99.2% On-time GRN', isPositive: true }}
              icon={<Truck size={20} color="#8B5CF6" />}
              iconBgColor="#EDE9FE"
              onClick={() => navigate('/app/sales/suppliers')}
            />
          </Col>
        </Row>
      </div>

      {/* =========================================================================
          SECTION 2: SALES MANAGEMENT OVERVIEW & SERVICE MANAGEMENT OVERVIEW PILLARS
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Sales Overview Banner Card */}
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
              <Button type="link" size="small" onClick={() => navigate('/app/sales/overview')} style={{ color: '#6E56CF', fontWeight: 700 }}>
                Sales Hub &gt;
              </Button>
            }
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>1,248</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Total Orders</div>
                <Tag color="blue" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>24 Processing</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>142</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Quotations</div>
                <Tag color="gold" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>18 Pending</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>₹28.4L</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Invoiced Value</div>
                <Tag color="green" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>92% Realized</Tag>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 8 }}>
              Recent Sales Orders Pipeline
            </div>
            {[
              { id: 'SO-9041', client: 'Apex Precision Tools', val: '₹4,50,000', status: 'Delivered', date: 'Today, 11:20' },
              { id: 'SO-9040', client: 'Omni Infra Ventures', val: '₹12,00,000', status: 'Processing', date: 'Today, 09:45' },
              { id: 'SO-9039', client: 'Southern Automation', val: '₹8,50,000', status: 'Confirmed', date: 'Yesterday' },
            ].map((ord, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < 2 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#6E56CF', marginRight: 8 }}>{ord.id}</span>
                  <span style={{ fontWeight: 600, color: '#181433' }}>{ord.client}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: '#181433' }}>{ord.val}</span>
                  <Tag color={ord.status === 'Delivered' ? 'green' : ord.status === 'Processing' ? 'blue' : 'purple'} style={{ borderRadius: 10, fontSize: 10 }}>
                    {ord.status}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        {/* Service Management Overview Banner Card */}
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
              <Button type="link" size="small" onClick={() => navigate('/app/services/overview')} style={{ color: '#10B981', fontWeight: 700 }}>
                Service Ops &gt;
              </Button>
            }
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '14px 22px 20px' } }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>384</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Active Tickets</div>
                <Tag color="red" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>3 SLA Alert</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>42 / 48</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Technicians</div>
                <Tag color="green" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>87% On-Field</Tag>
              </div>
              <div style={{ backgroundColor: '#FAF8FC', padding: '12px 14px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#181433' }}>98.4%</div>
                <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>SLA Compliance</div>
                <Tag color="cyan" style={{ marginTop: 4, borderRadius: 10, fontSize: 10 }}>CSAT 4.9/5</Tag>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#181433', marginBottom: 8 }}>
              Active Breakdown & Dispatch Tickets
            </div>
            {[
              { id: 'TKT-104', asset: 'CNC Spindle Unit 04', tech: 'Murugan K.', stage: 'In Progress', priority: 'High' },
              { id: 'TKT-103', asset: 'Hydraulic Press 50T', tech: 'Dinesh V.', stage: 'Assigned', priority: 'Urgent' },
              { id: 'TKT-102', asset: 'Compressor Sys-B', tech: 'Suresh R.', stage: 'Completed', priority: 'Normal' },
            ].map((tkt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < 2 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#10B981', marginRight: 8 }}>{tkt.id}</span>
                  <span style={{ fontWeight: 600, color: '#181433' }}>{tkt.asset}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#7E7A9B' }}>Tech: {tkt.tech}</span>
                  <Tag color={tkt.stage === 'Completed' ? 'green' : tkt.stage === 'In Progress' ? 'blue' : 'orange'} style={{ borderRadius: 10, fontSize: 10 }}>
                    {tkt.stage}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* =========================================================================
          SECTION 3: BUSINESS ANALYTICS & CHARTS (Yearly Revenue + Sales vs Expense)
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Yearly Revenue Bar Series (Reference UI replica) */}
        <Col xs={24} lg={15}>
          <ChartCard
            title="Yearly Revenue Analytics"
            extra={
              <Select defaultValue="last_year" size="small" variant="borderless" style={{ fontSize: 12, color: '#7E7A9B' }}>
                <Select.Option value="last_year">Showing: Last year</Select.Option>
                <Select.Option value="this_year">Showing: This year</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 260, width: '100%', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={YEARLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, backgroundColor: '#1E1938', border: 'none', color: '#FFFFFF' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {YEARLY_REVENUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        {/* Top Agents & Sales Performers */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Top Sales & Service Performers</span>
                <span style={{ fontSize: 11, color: '#7E7A9B' }}>By Orders & SLA</span>
              </div>
            }
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 22px 20px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A5A1BE', marginBottom: 12 }}>
              <span>Personnel & Department</span>
              <span>Performance</span>
            </div>

            {[
              { name: 'Vikram Seth', dept: 'Senior Sales Lead', score: '₹42.5L Sold', rate: 98 },
              { name: 'Murugan K.', dept: 'Senior Field Engineer', score: '124 Jobs / 99% SLA', rate: 99 },
              { name: 'Ananya Sharma', dept: 'Enterprise Account Exec', score: '₹38.2L Sold', rate: 95 },
              { name: 'Dinesh V.', dept: 'Field Tech Specialist', score: '98 Jobs / 97% SLA', rate: 97 },
              { name: 'Pooja Hegde', dept: 'AMC Contract Manager', score: '48 Renewals', rate: 94 },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < 4 ? '1px solid #FAF7FC' : 'none',
                  fontSize: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#181433' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>{item.dept}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#6E56CF' }}>{item.score}</div>
                  <Progress percent={item.rate} showInfo={false} strokeColor="#6E56CF" size="small" style={{ width: 60, margin: 0 }} />
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* =========================================================================
          SECTION 4: INVENTORY, FINANCE, CUSTOMER GEO & CALENDAR ROW
          ========================================================================= */}
      <Row gutter={[16, 16]}>
        {/* Customer Geo Distribution */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Customer by Country</span>}
            extra={<span style={{ fontSize: 11, color: '#7E7A9B' }}>Showing: This Month</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '16px 22px 22px' } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={110} color="#E0DBF0" strokeWidth={1.2} />
              </div>

              <div style={{ width: 130, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>25,600</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>Total Orders</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>20,100</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>Delivered</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>1,100</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>In Transit</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Inventory & Low Stock Alerts */}
        <Col xs={24} lg={8}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, backgroundColor: '#FAF8FC', padding: '10px 14px', borderRadius: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: '#7E7A9B' }}>Total SKUs</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#181433' }}>2,450</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#7E7A9B' }}>Stock Valuation</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#6E56CF' }}>₹1.84 Cr</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#EF4444' }}>Low Stock</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#EF4444' }}>8 SKUs</div>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: '#181433', marginBottom: 6 }}>Critical Reorder Alerts:</div>
            {[
              { item: 'Industrial 3-Phase Inverter 15kW', qty: 2, min: 10, unit: 'Units' },
              { item: 'Synthetic Compressor Lubricant 50L', qty: 4, min: 25, unit: 'Cans' },
              { item: 'Precision Bearing Kit 6204-ZZ', qty: 8, min: 50, unit: 'Pcs' },
            ].map((st, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: idx < 2 ? '1px solid #FAF7FC' : 'none', fontSize: 11.5 }}>
                <span style={{ fontWeight: 600, color: '#181433' }}>{st.item}</span>
                <Tag color="error" style={{ borderRadius: 8, fontSize: 10 }}>
                  Only {st.qty} {st.unit} left
                </Tag>
              </div>
            ))}
          </Card>
        </Col>

        {/* Enterprise Operations Calendar & Upcoming Tasks */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarIcon size={18} color="#6E56CF" />
                <span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Calendar & Dispatches</span>
              </div>
            }
            extra={<span style={{ fontSize: 11, color: '#7E7A9B' }}>Showing: Today</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 20px 20px' } }}
          >
            {/* Calendar Mini Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center', fontSize: 10, marginBottom: 12 }}>
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <span key={d} style={{ color: '#A5A1BE', fontWeight: 600 }}>{d}</span>
              ))}
              {[15, 16, 17, 18, 19, 20, 21].map((day, i) => {
                const isHighlight = day === 16;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '4px 0',
                      borderRadius: 6,
                      backgroundColor: isHighlight ? '#6E56CF' : 'transparent',
                      color: isHighlight ? '#FFFFFF' : '#181433',
                      fontWeight: isHighlight ? 800 : 500,
                      fontSize: 10,
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: '#181433', marginBottom: 6 }}>Upcoming Scheduled Operations:</div>
            {[
              { time: '10:30 AM', title: 'Site Inspection – Metro Line 4', type: 'Service' },
              { time: '02:00 PM', title: 'Commercial Contract Signing – Omni Infra', type: 'Sales' },
              { time: '04:30 PM', title: 'Quarterly Supplier Review (GRN)', type: 'Procurement' },
            ].map((task, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: idx < 2 ? '1px solid #FAF7FC' : 'none', fontSize: 11.5 }}>
                <span style={{ fontWeight: 800, color: '#6E56CF', fontSize: 11, width: 60 }}>{task.time}</span>
                <span style={{ flex: 1, fontWeight: 600, color: '#181433' }}>{task.title}</span>
                <Tag color={task.type === 'Sales' ? 'purple' : task.type === 'Service' ? 'cyan' : 'gold'} style={{ borderRadius: 8, fontSize: 9 }}>
                  {task.type}
                </Tag>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
