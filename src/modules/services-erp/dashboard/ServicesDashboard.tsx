import React from 'react';
import { Row, Col, Card, Table, Typography, Button } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LifeBuoy, Wrench, Package, Users, HardHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatusBadge } from '../../../components';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_SERVICES_DATA } from '../../../mocks/services.mock';
import { MOCK_SERVICE_TICKETS } from '../../../mock/salesServiceData';

export const ServicesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const { kpis, monthlyJobsChart, technicianPerformance } = MOCK_SERVICES_DATA;

  const ticketColumns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (t: string) => <span style={{ fontWeight: 600, color: '#16A36A' }}>{t}</span>,
    },
    {
      title: 'Customer & Asset',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (c: string, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{c}</div>
          <div style={{ fontSize: 12, color: '#77718A' }}>Asset: {r.productOrAsset}</div>
        </div>
      ),
    },
    {
      title: 'Assigned Tech',
      dataIndex: 'assignedTechnician',
      key: 'assignedTechnician',
      render: (t: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <HardHat size={14} color="#7546B8" /> {t}
        </span>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (st: string) => <StatusBadge status={st} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${selectedCompany?.name || 'Company'} – Services ERP`}
        subtitle="Field service dispatch, technician SLA tracking, AMC coverage, and breakdown tickets."
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Open Tickets"
            value={kpis.openTickets}
            subtitle="Incident queue"
            icon={<LifeBuoy size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Jobs Today"
            value={kpis.activeJobs}
            subtitle="Engineers on site"
            icon={<Wrench size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="First-Time Fix Rate"
            value={kpis.firstTimeFixRate}
            trend={{ value: '+2.4%', isPositive: true }}
            icon={<Package size={22} />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Customer CSAT"
            value={kpis.csat}
            trend={{ value: 'Rated 4.8', isPositive: true }}
            icon={<Users size={22} />}
          />
        </Col>
      </Row>

      {/* Chart Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <ChartCard title="Monthly Service Tickets & Job Resolutions" subtitle="Incoming requests vs Completed field jobs">
            <div style={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyJobsChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAF7" />
                  <XAxis dataKey="month" stroke="#77718A" />
                  <YAxis stroke="#77718A" />
                  <Tooltip />
                  <Bar dataKey="incoming" fill="#E6A23C" radius={[4, 4, 0, 0]} name="Incoming" />
                  <Bar dataKey="completed" fill="#51258C" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Technician Roster & Ratings" style={{ height: '100%', borderRadius: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {technicianPerformance.map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    backgroundColor: '#FAF7FC',
                    border: '1px solid #E7E0F0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#242033', fontSize: 13 }}>{tech.name}</span>
                    <span style={{ fontWeight: 700, color: '#E6A23C' }}>⭐ {tech.rating}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#77718A', marginTop: 2 }}>{tech.specialization}</div>
                  <div style={{ fontSize: 12, color: '#51258C', marginTop: 4, fontWeight: 500 }}>
                    {tech.jobs} Jobs completed
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tickets Table */}
      <Card
        title="Critical Incident Tickets"
        style={{ borderRadius: 8 }}
        extra={
          <Button type="link" onClick={() => navigate('/app/services/tickets')}>
            View All Tickets <ArrowRight size={14} />
          </Button>
        }
      >
        <Table dataSource={MOCK_SERVICE_TICKETS} columns={ticketColumns} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  );
};
