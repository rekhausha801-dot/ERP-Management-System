import React from 'react';
import { Row, Col, Card, Table, Typography, Progress, Button } from 'antd';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Building2, Layers, CreditCard, Users, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge } from '../../components';
import { KPICard } from '../../components/dashboard/KPICard';
import { ChartCard } from '../../components/dashboard/ChartCard';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DASHBOARD_DATA } from '../../mocks/dashboard.mock';
import { MOCK_AUDIT_LOGS } from '../../mock/erpData';

const COLORS = ['#51258C', '#1D4ED8', '#059669'];

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useAuth();
  const { superAdmin } = MOCK_DASHBOARD_DATA;

  const bothCount = companies.filter((c) => c.packageType === 'COMPLETE').length;
  const salesCount = companies.filter((c) => c.packageType === 'SALES').length;
  const serviceCount = companies.filter((c) => c.packageType === 'SERVICE').length;

  const pieData = [
    { name: 'Complete ERP', value: bothCount || 1 },
    { name: 'Sales ERP', value: salesCount || 1 },
    { name: 'Service ERP', value: serviceCount || 1 },
  ];

  return (
    <div>
      <PageHeader
        title="Super Admin HQ Command Center"
        subtitle="Global platform orchestration, multi-tenant license distribution, and tenant metrics."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => navigate('/super-admin/companies')}
          >
            Provision Company
          </Button>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Registered Companies"
            value={companies.length}
            trend={{ value: '+2 new', isPositive: true }}
            icon={<Building2 size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Packages"
            value="3 Active"
            subtitle="COMPLETE, SALES, SERVICE"
            icon={<Layers size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active ARR"
            value="₹2.60L"
            trend={{ value: '+14.2%', isPositive: true }}
            icon={<CreditCard size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Total Tenant Users"
            value={superAdmin.totalUsers}
            subtitle="Platform users"
            icon={<Users size={22} />}
          />
        </Col>
      </Row>

      {/* Charts & Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={12}>
          <ChartCard title="Tenant Package Distribution" subtitle="Active ERP subscriptions by tier">
            <div style={{ height: 240, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i] }} />
                  <span>{d.name}: <strong>{d.value}</strong></span>
                </div>
              ))}
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Recent Platform Security Events"
            style={{ borderRadius: 8, height: '100%' }}
            extra={<Button type="link" onClick={() => navigate('/super-admin/audit-logs')}>View All</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOCK_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: '#FAF7FC',
                    border: '1px solid #E7E0F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#242033' }}>
                      {log.action} &bull; <span style={{ color: '#7546B8' }}>{log.user}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#77718A' }}>{log.details}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={log.status} />
                    <div style={{ fontSize: 10, color: '#9E98AD', marginTop: 2 }}>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Companies List Preview */}
      <Card
        title="Provisioned Tenant Organizations"
        style={{ borderRadius: 8 }}
        extra={<Button type="link" onClick={() => navigate('/super-admin/companies')}>Manage All</Button>}
      >
        <Table
          dataSource={companies}
          columns={[
            { title: 'Company Name', dataIndex: 'name', render: (t, r) => <div><strong>{t}</strong><div style={{ fontSize: 11, color: '#77718A' }}>Code: {r.code}</div></div> },
            { title: 'Package', dataIndex: 'packageType', render: (p) => <span style={{ fontWeight: 600, color: '#51258C' }}>{p}</span> },
            { title: 'City', dataIndex: 'city' },
            { title: 'Status', dataIndex: 'status', render: (s) => <StatusBadge status={s} /> },
          ]}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};
