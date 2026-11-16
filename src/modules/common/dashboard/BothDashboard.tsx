import React from 'react';
import { Row, Col, Card, Table, Typography, Button } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Target, ShoppingBag, CreditCard, LifeBuoy, Wrench, Package, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge } from '../../../components';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_SALES_DATA } from '../../../mocks/sales.mock';
import { MOCK_SERVICES_DATA } from '../../../mocks/services.mock';
import { MOCK_LEADS, MOCK_SERVICE_TICKETS } from '../../../mock/salesServiceData';
import { SalesDashboard } from '../../sales-erp/dashboard/SalesDashboard';
import { ServicesDashboard } from '../../services-erp/dashboard/ServicesDashboard';
import type { ErpPackageId } from '../../../config/erpPackageConfig';

export const UnifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';

  // If company package is SALES only, render Sales dashboard
  if (currentPkg === 'SALES') {
    return <SalesDashboard />;
  }

  // If company package is SERVICE only, render Services dashboard
  if (currentPkg === 'SERVICE') {
    return <ServicesDashboard />;
  }

  // If COMPLETE, render complete unified Sales + Service command center
  return (
    <div>
      <PageHeader
        title={`${selectedCompany?.name || 'Company'} – Complete Unified ERP`}
        subtitle="Centralized operational command center: Commercial Sales & Field Service Engineering."
      />

      {/* SALES KPIS */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#51258C', letterSpacing: '0.04em' }}>
            COMMERCIAL & SALES METRICS
          </span>
          <Button type="link" size="small" onClick={() => navigate('/app/sales/dashboard')}>
            Sales Detail Overview <ArrowRight size={13} />
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Pipeline Leads"
              value={MOCK_SALES_DATA.kpis.totalCustomers}
              subtitle="Active enterprise leads"
              icon={<Target size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Pending Quotations"
              value={MOCK_SALES_DATA.kpis.pendingOrders}
              subtitle="In client review"
              icon={<ShoppingBag size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Monthly Sales Runrate"
              value={`₹${(MOCK_SALES_DATA.kpis.totalRevenue / 100000).toFixed(2)}L`}
              trend={{ value: '+14.2%', isPositive: true }}
              icon={<CreditCard size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Lead Conversion"
              value={MOCK_SALES_DATA.kpis.conversionRate}
              trend={{ value: '+3.1%', isPositive: true }}
              icon={<TrendingUp size={22} />}
            />
          </Col>
        </Row>
      </div>

      {/* SERVICE KPIS */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#16A36A', letterSpacing: '0.04em' }}>
            FIELD SERVICES & MAINTENANCE OPERATIONS
          </span>
          <Button type="link" size="small" onClick={() => navigate('/app/services/dashboard')}>
            Services Detail Overview <ArrowRight size={13} />
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Open Tickets"
              value={MOCK_SERVICES_DATA.kpis.openTickets}
              subtitle="Active incident queue"
              icon={<LifeBuoy size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Jobs Scheduled"
              value={MOCK_SERVICES_DATA.kpis.activeJobs}
              subtitle="Technicians dispatched"
              icon={<Wrench size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="First-Time Fix Rate"
              value={MOCK_SERVICES_DATA.kpis.firstTimeFixRate}
              subtitle="SLA compliance"
              icon={<Package size={22} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <KPICard
              title="Customer Satisfaction"
              value={MOCK_SERVICES_DATA.kpis.csat}
              subtitle="CSAT aggregate"
              icon={<Users size={22} />}
            />
          </Col>
        </Row>
      </div>

      {/* Dual Activity Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Commercial Leads"
            style={{ borderRadius: 8 }}
            extra={<Button type="link" onClick={() => navigate('/app/sales/leads')}>View All</Button>}
          >
            <Table
              dataSource={MOCK_LEADS.slice(0, 3)}
              columns={[
                { title: 'Lead #', dataIndex: 'leadNumber', render: (t) => <span style={{ fontWeight: 600, color: '#51258C' }}>{t}</span> },
                { title: 'Company', dataIndex: 'companyName' },
                { title: 'Deal Value', dataIndex: 'estimatedValue', render: (v) => `₹${v.toLocaleString()}` },
                { title: 'Stage', dataIndex: 'status', render: (s) => <StatusBadge status={s} /> },
              ]}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Critical Field Incidents"
            style={{ borderRadius: 8 }}
            extra={<Button type="link" onClick={() => navigate('/app/services/tickets')}>View All</Button>}
          >
            <Table
              dataSource={MOCK_SERVICE_TICKETS.slice(0, 3)}
              columns={[
                { title: 'Ticket #', dataIndex: 'ticketNumber', render: (t) => <span style={{ fontWeight: 600, color: '#16A36A' }}>{t}</span> },
                { title: 'Customer', dataIndex: 'customerName' },
                { title: 'Tech', dataIndex: 'assignedTechnician' },
                { title: 'Stage', dataIndex: 'stage', render: (s) => <StatusBadge status={s} /> },
              ]}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
