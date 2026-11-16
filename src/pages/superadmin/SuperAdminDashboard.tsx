import React from 'react';
import { Row, Col, Card, Table, Typography, Progress, Button, Space } from 'antd';
import {
  Building2,
  Layers,
  CreditCard,
  Users,
  Activity,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, KpiCard, StatusBadge, PackageBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SUBSCRIPTIONS, MOCK_AUDIT_LOGS } from '../../mock/erpData';

const { Title, Text } = Typography;

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { companies } = useAuth();

  const totalTenants = companies.length;
  const bothCount = companies.filter((c) => (c.packageType as any) === 'COMPLETE' || (c.packageType as any) === 'BOTH').length;
  const salesCount = companies.filter((c) => c.packageType === 'SALES').length;
  const serviceCount = companies.filter((c) => c.packageType === 'SERVICE').length;

  const totalMRR = MOCK_SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.amount, 0);

  const companyColumns = [
    {
      title: 'Company / Tenant',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E152A' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Code: {record.code}</div>
        </div>
      ),
    },
    {
      title: 'ERP Package',
      dataIndex: 'packageType',
      key: 'packageType',
      render: (pkg: any) => <PackageBadge packageType={pkg} />,
    },
    {
      title: 'Subscription',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      render: (plan: string) => <span style={{ fontWeight: 500 }}>{plan || 'Enterprise'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" type="link" onClick={() => navigate('/superadmin/companies')}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Super Admin HQ Overview"
        subtitle="Global telemetry, multi-tenant license distribution, and provisioning metrics."
        actions={
          <Button
            type="primary"
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            icon={<Plus size={16} />}
            onClick={() => navigate('/superadmin/companies')}
          >
            Register New Tenant
          </Button>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Total Tenant Companies"
            value={totalTenants}
            subtitle="Active enterprise organizations"
            icon={<Building2 size={24} />}
            trend={{ value: '+2 new', isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Total Active Packages"
            value="3"
            subtitle="BOTH, SALES, and SERVICE"
            icon={<Layers size={24} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Annual License Run-rate"
            value={`₹${(totalMRR / 100000).toFixed(2)}L`}
            subtitle="Contracted multi-tenant subscriptions"
            icon={<CreditCard size={24} />}
            trend={{ value: '+14.2%', isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KpiCard
            title="Total Enterprise Users"
            value="80+"
            subtitle="Across all provisioned tenants"
            icon={<Users size={24} />}
          />
        </Col>
      </Row>

      {/* Package Distribution Breakdown */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Tenant Package Distribution"
            style={{ borderRadius: 8, height: '100%' }}
            extra={<Button type="link" onClick={() => navigate('/superadmin/packages')}>View Matrix</Button>}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#51258C' }}>Complete ERP (Sales + Services)</span>
                <span style={{ fontWeight: 700 }}>{bothCount} Tenants</span>
              </div>
              <Progress
                percent={Math.round((bothCount / totalTenants) * 100)}
                strokeColor="#51258C"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#1d4ed8' }}>Sales ERP (Sales Only)</span>
                <span style={{ fontWeight: 700 }}>{salesCount} Tenants</span>
              </div>
              <Progress
                percent={Math.round((salesCount / totalTenants) * 100)}
                strokeColor="#1d4ed8"
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#059669' }}>Service ERP (Services Only)</span>
                <span style={{ fontWeight: 700 }}>{serviceCount} Tenants</span>
              </div>
              <Progress
                percent={Math.round((serviceCount / totalTenants) * 100)}
                strokeColor="#059669"
              />
            </div>
          </Card>
        </Col>

        {/* Real-time System Audit Feed */}
        <Col xs={24} lg={12}>
          <Card
            title="Recent Platform Activity"
            style={{ borderRadius: 8, height: '100%' }}
            extra={<Button type="link" onClick={() => navigate('/superadmin/audit-logs')}>View All Logs</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    backgroundColor: '#FAF7FC',
                    border: '1px solid #E8E0F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1E152A' }}>
                      {log.action} &bull; <span style={{ color: '#7546B8' }}>{log.user}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{log.details}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={log.status} />
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tenant Companies Table */}
      <Card
        title="Provisioned Tenant Organizations"
        style={{ borderRadius: 8 }}
        extra={
          <Button type="primary" size="small" onClick={() => navigate('/superadmin/companies')}>
            Manage All Tenants
          </Button>
        }
      >
        <Table
          dataSource={companies}
          columns={companyColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};
