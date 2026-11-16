import React from 'react';
import { Row, Col, Card, Table, Typography, Button } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Target, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge } from '../../../components';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_SALES_DATA } from '../../../mocks/sales.mock';
import { MOCK_LEADS } from '../../../mock/salesServiceData';

export const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const { kpis, monthlyRevenueChart, topProducts } = MOCK_SALES_DATA;

  const leadColumns = [
    {
      title: 'Lead #',
      dataIndex: 'leadNumber',
      key: 'leadNumber',
      render: (t: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span>,
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (name: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#77718A' }}>Contact: {r.contactName}</div>
        </div>
      ),
    },
    {
      title: 'Estimated Deal',
      dataIndex: 'estimatedValue',
      key: 'estimatedValue',
      render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => <StatusBadge status={st} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${selectedCompany?.name || 'Company'} – Sales ERP`}
        subtitle="Commercial pipeline, quarterly sales velocity, and order fulfillment."
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Monthly Sales Revenue"
            value={`₹${(kpis.totalRevenue / 100000).toFixed(2)}L`}
            trend={{ value: '+14.2%', isPositive: true }}
            icon={<CreditCard size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Confirmed Orders"
            value={kpis.totalOrders}
            trend={{ value: '+8 orders', isPositive: true }}
            icon={<ShoppingBag size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Pending Orders"
            value={kpis.pendingOrders}
            subtitle="In fulfillment pipeline"
            icon={<Target size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Win Conversion"
            value={kpis.conversionRate}
            trend={{ value: '+3.1%', isPositive: true }}
            icon={<TrendingUp size={22} />}
          />
        </Col>
      </Row>

      {/* Chart Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <ChartCard title="Monthly Revenue Performance (INR)" subtitle="Actual vs Target revenue trend">
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#51258C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#51258C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAF7" />
                  <XAxis dataKey="month" stroke="#77718A" />
                  <YAxis stroke="#77718A" tickFormatter={(v) => `₹${v / 100000}L`} />
                  <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#51258C" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Top Selling SKUs" style={{ height: '100%', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    backgroundColor: '#FAF7FC',
                    border: '1px solid #E7E0F0',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#242033', fontSize: 13 }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12 }}>
                    <span style={{ color: '#77718A' }}>{p.sales} Units sold</span>
                    <span style={{ fontWeight: 700, color: '#51258C' }}>₹{p.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Leads Table */}
      <Card
        title="Active CRM Deals & Inquiries"
        style={{ borderRadius: 8 }}
        extra={
          <Button type="link" onClick={() => navigate('/app/sales/leads')}>
            View All Leads <ArrowRight size={14} />
          </Button>
        }
      >
        <Table dataSource={MOCK_LEADS} columns={leadColumns} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  );
};
