import React from 'react';
import { Row, Col, Card, Table, Typography, Button, Tag, Progress } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import {
  TrendingUp,
  Target,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  Users,
  Boxes,
  Truck,
  ArrowRight,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_SALES_DATA } from '../../../mocks/sales.mock';

const SALES_BY_CATEGORY_DATA = [
  { category: 'Heavy Machinery', sales: 48000, color: '#6E56CF' },
  { category: 'Electrical Drives', sales: 34000, color: '#3A2E78' },
  { category: 'Hydraulic Parts', sales: 26000, color: '#8874E8' },
  { category: 'Consumables', sales: 18000, color: '#9D8BF2' },
  { category: 'Tooling Units', sales: 12000, color: '#2C225C' },
];

export const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const { kpis, monthlyRevenueChart, topProducts } = MOCK_SALES_DATA;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Sales Header & Status Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#181433' }}>
            Sales Management & Commercial Pipeline
          </h2>
          <span style={{ fontSize: 12, color: '#7E7A9B' }}>
            Comprehensive sales orders, pipeline conversions, and inventory movements
          </span>
        </div>
        <Tag color="purple" style={{ borderRadius: 12, padding: '3px 10px', fontWeight: 700, fontSize: 11 }}>
          PACKAGE: SALES ERP ONLY
        </Tag>
      </div>

      {/* 8 Sales Specific Main KPI Cards */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Revenue"
            value="₹2.45 Cr"
            trend={{ value: '+14.2% MoM', isPositive: true }}
            icon={<DollarSign size={20} color="#10B981" />}
            iconBgColor="#E6FDF4"
            onClick={() => navigate('/app/sales/finance')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Sales Orders"
            value={kpis.totalOrders}
            trend={{ value: '+24 this week', isPositive: true }}
            icon={<ShoppingBag size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/sales/orders')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Pending Orders"
            value={kpis.pendingOrders}
            subtitle="Processing & in-transit"
            icon={<Target size={20} color="#F59E0B" />}
            iconBgColor="#FEF3C7"
            onClick={() => navigate('/app/sales/orders')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Win Conversion Rate"
            value={kpis.conversionRate}
            trend={{ value: '+3.1% velocity', isPositive: true }}
            icon={<TrendingUp size={20} color="#10B981" />}
            iconBgColor="#E6FDF4"
            onClick={() => navigate('/app/sales/crm')}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Quotations in Review"
            value="38 Pending"
            trend={{ value: '₹54L pipeline', isPositive: true }}
            icon={<FileText size={20} color="#8B5CF6" />}
            iconBgColor="#EDE9FE"
            onClick={() => navigate('/app/sales/quotations')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Outstanding Receivables"
            value="₹9.80 L"
            trend={{ value: '12 overdue', isPositive: false }}
            icon={<CreditCard size={20} color="#EF4444" />}
            iconBgColor="#FEE2E2"
            onClick={() => navigate('/app/sales/outstanding-receivables')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Customers"
            value="1,420 B2B"
            trend={{ value: '+18 new this month', isPositive: true }}
            icon={<Users size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/customers')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Low Stock Watch"
            value="8 Products"
            trend={{ value: 'Needs reorder', isPositive: false }}
            icon={<AlertCircle size={20} color="#F59E0B" />}
            iconBgColor="#FEF3C7"
            onClick={() => navigate('/app/sales/low-stock-alerts')}
          />
        </Col>
      </Row>

      {/* Middle Row: Revenue Performance Chart & Top Products */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        <Col xs={24} lg={15}>
          <ChartCard title="Monthly Revenue Performance (INR)" subtitle="Actual commercial realizations vs targets">
            <div style={{ height: 260, width: '100%', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E56CF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6E56CF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: 12, backgroundColor: '#1E1938', border: 'none', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6E56CF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        {/* Sales by Category Bar Chart */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Sales by Product Category</span>}
            extra={<span style={{ fontSize: 11, color: '#7E7A9B' }}>By Value</span>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)', height: '100%' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '10px 20px 20px' } }}
          >
            <div style={{ height: 230, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_BY_CATEGORY_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#A5A1BE" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <YAxis type="category" dataKey="category" stroke="#181433" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: 12, backgroundColor: '#1E1938', border: 'none', color: '#FFF' }}
                  />
                  <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                    {SALES_BY_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row: Recent Confirmed Orders Table & Top Sales Reps */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Recent Confirmed Sales Orders</span>}
            extra={<Button type="link" size="small" onClick={() => navigate('/app/sales/orders')} style={{ color: '#6E56CF', fontWeight: 700 }}>All Orders &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '10px 22px 20px' } }}
          >
            <Table
              dataSource={[
                { key: '1', so: 'SO-9041', customer: 'Apex Precision Tools', amount: '₹4,50,000', rep: 'Vikram Seth', status: 'Delivered' },
                { key: '2', so: 'SO-9040', customer: 'Omni Infra Ventures', amount: '₹12,00,000', rep: 'Ananya Sharma', status: 'Processing' },
                { key: '3', so: 'SO-9039', customer: 'Southern Automation Works', amount: '₹8,50,000', rep: 'Vikram Seth', status: 'Confirmed' },
                { key: '4', so: 'SO-9038', customer: 'Dynamic Motors Corp', amount: '₹3,20,000', rep: 'Rohan Verma', status: 'Delivered' },
              ]}
              pagination={false}
              size="small"
              columns={[
                { title: 'Order #', dataIndex: 'so', key: 'so', render: (t) => <span style={{ fontWeight: 700, color: '#6E56CF' }}>{t}</span> },
                { title: 'Customer', dataIndex: 'customer', key: 'customer', render: (c) => <span style={{ fontWeight: 600 }}>{c}</span> },
                { title: 'Order Value', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ fontWeight: 700 }}>{a}</span> },
                { title: 'Sales Rep', dataIndex: 'rep', key: 'rep' },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (s) => (
                    <Tag color={s === 'Delivered' ? 'green' : s === 'Processing' ? 'blue' : 'purple'} style={{ borderRadius: 10 }}>
                      {s}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Top Products Volume */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Top Moving Inventory</span>}
            extra={<Button type="link" size="small" onClick={() => navigate('/app/sales/products')} style={{ color: '#6E56CF', fontWeight: 700 }}>Catalogue &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 22px 20px' } }}
          >
            {[
              { name: 'Industrial 3-Phase Inverter', sold: '420 Units', revenue: '₹42,00,000' },
              { name: 'Hydraulic Seal Kit Type-A', sold: '380 Kits', revenue: '₹18,50,000' },
              { name: 'High-Torque AC Servo Motor', sold: '200 Units', revenue: '₹24,00,000' },
              { name: 'Synthetic Gear Lubricant 20L', sold: '190 Cans', revenue: '₹9,80,000' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #FAF7FC' : 'none', fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#181433' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B' }}>{p.sold}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#6E56CF' }}>{p.revenue}</div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
