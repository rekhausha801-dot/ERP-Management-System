import React from 'react';
import { Row, Col, Card, Table, Typography, Button, Tag, Progress } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, AreaChart, Area } from 'recharts';
import {
  FiLifeBuoy,
  FiTool,
  FiPackage,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiDollarSign,
  FiArrowRight,
  FiClock,
  FiUserCheck,
  FiStar,
} from 'react-icons/fi';
import {
  TbCurrencyRupee,
  TbTools,
  TbHelmet,
} from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';
import { Wrench, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '../../../components/dashboard/KPICard';
import { ChartCard } from '../../../components/dashboard/ChartCard';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_SERVICES_DATA } from '../../../mocks/services.mock';
import { getStoredServiceRequests, ServiceRequestRecord } from '../../../services/serviceWorkflowStorage';

const SERVICE_TICKET_TRENDS = [
  { month: 'Jul', incoming: 120, resolved: 114 },
  { month: 'Aug', incoming: 145, resolved: 138 },
  { month: 'Sep', incoming: 130, resolved: 128 },
  { month: 'Oct', incoming: 160, resolved: 152 },
  { month: 'Nov', incoming: 175, resolved: 169 },
  { month: 'Dec', incoming: 190, resolved: 184 },
];

export const ServicesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const { kpis, technicianPerformance } = MOCK_SERVICES_DATA;

  const [storedRequests, setStoredRequests] = React.useState<ServiceRequestRecord[]>([]);

  React.useEffect(() => {
    setStoredRequests(getStoredServiceRequests());
  }, []);

  const pendingApprovalRequests = storedRequests.filter(
    (r) => r.status === 'Pending Approval' || r.status === 'Submitted'
  );

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Service Header & Status Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#181433' }}>
            Service Management & Field Operations
          </h2>
          <span style={{ fontSize: 12, color: '#7E7A9B' }}>
            Real-time technician tracking, breakdown SLA compliance, and AMC lifecycle
          </span>
        </div>
        <Tag color="cyan" style={{ borderRadius: 12, padding: '3px 10px', fontWeight: 700, fontSize: 11 }}>
          PACKAGE: SERVICE ERP ONLY
        </Tag>
      </div>

      {/* 8 Service Specific Main KPI Cards with React Icons */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active Service Tickets"
            value={kpis.openTickets}
            trend={{ value: '3 Critical Breaches', isPositive: false }}
            icon={<FiLifeBuoy size={20} color="#EF4444" />}
            iconBgColor="#FEE2E2"
            onClick={() => navigate('/app/services/tickets')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Field Jobs Today"
            value={kpis.activeJobs}
            trend={{ value: '42 Technicians Assigned', isPositive: true }}
            icon={<Wrench size={20} color="#4C1D95" />}
            iconBgColor="#F3E8FF"
            onClick={() => navigate('/app/services/jobs')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="SLA Compliance Rate"
            value="98.4%"
            trend={{ value: '+1.2% this quarter', isPositive: true }}
            icon={<FiShield size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/services/sla')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Customer CSAT Score"
            value="4.85 / 5"
            trend={{ value: '94% 5-Star Ratings', isPositive: true }}
            icon={<FaStar size={20} color="#F59E0B" />}
            iconBgColor="#FEF3C7"
            onClick={() => navigate('/app/services/feedback')}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Active AMC Contracts"
            value="184 Active"
            trend={{ value: '14 due for renewal', isPositive: true }}
            icon={<FiCheckCircle size={20} color="#8B5CF6" />}
            iconBgColor="#EDE9FE"
            onClick={() => navigate('/app/services/amc')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Service Revenue (INR)"
            value="₹48.20 L"
            trend={{ value: '+12% vs target', isPositive: true }}
            icon={<IndianRupee size={22} color="#4C1D95" />}
            iconBgColor="#F3E8FF"
            onClick={() => navigate('/app/services/billing')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="First-Time Fix Rate"
            value={kpis.firstTimeFixRate}
            trend={{ value: '+2.4% resolution', isPositive: true }}
            icon={<FiPackage size={20} color="#6E56CF" />}
            iconBgColor="#EFEBFF"
            onClick={() => navigate('/app/services/performance')}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <KPICard
            title="Spare Parts Consumption"
            value="₹8.45 L"
            trend={{ value: '184 parts utilized', isPositive: true }}
            icon={<TbTools size={20} color="#F59E0B" />}
            iconBgColor="#FEF3C7"
            onClick={() => navigate('/app/services/spare-parts')}
          />
        </Col>
      </Row>

      {/* Middle Row: Service Ticket Resolutions Chart & Technician Leaderboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
        <Col xs={24} lg={15}>
          <ChartCard title="Monthly Service Tickets: Incoming vs Resolved" subtitle="Field breakdown ticket clearance efficiency">
            <div style={{ height: 260, width: '100%', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SERVICE_TICKET_TRENDS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(110, 86, 207, 0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#A5A1BE" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: 12, backgroundColor: '#1E1938', border: 'none', color: '#FFF' }}
                  />
                  <Bar dataKey="incoming" name="Incoming Tickets" fill="#8874E8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved Jobs" fill="#4C1D95" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Col>

        {/* Technician Field Dispatch & Performance */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Top Field Engineers</span>}
            extra={<Button type="link" size="small" onClick={() => navigate('/app/services/technicians')} style={{ color: '#4C1D95', fontWeight: 700 }}>Team &gt;</Button>}
            style={{
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              height: '100%',
            }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '12px 22px 20px' } }}
          >
            {[
              { name: 'Murugan K.', skill: 'HVAC & Drives Expert', rating: '4.95', jobs: '124 Jobs Done', sla: 99 },
              { name: 'Dinesh V.', skill: 'Hydraulics Specialist', rating: '4.88', jobs: '98 Jobs Done', sla: 97 },
              { name: 'Suresh R.', skill: 'Automation Engineer', rating: '4.82', jobs: '86 Jobs Done', sla: 96 },
              { name: 'Balaji M.', skill: 'Electrical Maintenance', rating: '4.78', jobs: '72 Jobs Done', sla: 94 },
            ].map((tech, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #FAF7FC' : 'none', fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#181433', fontSize: 13 }}>{tech.name}</div>
                  <div style={{ fontSize: 11, color: '#7E7A9B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span>{tech.skill}</span>
                    <span>&bull;</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: 6 }}>
                      <FaStar size={11} color="#F59E0B" />
                      <span style={{ fontWeight: 700, color: '#B45309', fontSize: 11 }}>{tech.rating}</span>
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#4C1D95' }}>{tech.jobs}</div>
                  <Progress percent={tech.sla} size="small" strokeColor="#4C1D95" showInfo={false} style={{ width: 60, margin: 0 }} />
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Bottom Row: Active Dispatch Work Orders */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            bordered={false}
            title={<span style={{ fontWeight: 800, color: '#181433', fontSize: 16 }}>Live Dispatch & Field Work Orders</span>}
            extra={<Button type="link" size="small" onClick={() => navigate('/app/services/jobs')} style={{ color: '#4C1D95', fontWeight: 700 }}>Dispatch Console &gt;</Button>}
            style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
            styles={{ header: { borderBottom: 'none', padding: '18px 22px 0' }, body: { padding: '10px 22px 20px' } }}
          >
            <Table
              dataSource={[
                { key: '1', ticket: 'TKT-104', asset: 'CNC Spindle Unit 04', customer: 'Precision Engineering Ltd', tech: 'Murugan K.', stage: 'In Progress', priority: 'High', sla: '2 hrs left' },
                { key: '2', ticket: 'TKT-103', asset: 'Hydraulic Press 50T', customer: 'Metro Rail Workshop', tech: 'Dinesh V.', stage: 'Assigned', priority: 'Urgent', sla: '45 mins left' },
                { key: '3', ticket: 'TKT-102', asset: 'Rotary Compressor Sys-B', customer: 'Apex Motors Ltd', tech: 'Suresh R.', stage: 'Completed', priority: 'Normal', sla: 'Met On-Time' },
                { key: '4', ticket: 'TKT-101', asset: 'Servo Drive Assembly', customer: 'Southern Automations', tech: 'Balaji M.', stage: 'Completed', priority: 'Normal', sla: 'Met On-Time' },
              ]}
              pagination={false}
              size="small"
              columns={[
                { title: 'Ticket #', dataIndex: 'ticket', key: 'ticket', render: (t) => <span style={{ fontWeight: 700, color: '#4C1D95' }}>{t}</span> },
                { title: 'Asset / Equipment', dataIndex: 'asset', key: 'asset', render: (a) => <span style={{ fontWeight: 600 }}>{a}</span> },
                { title: 'Client Company', dataIndex: 'customer', key: 'customer' },
                {
                  title: 'Assigned Engineer',
                  dataIndex: 'tech',
                  key: 'tech',
                  render: (tc) => (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <TbHelmet size={16} color="#6E56CF" /> {tc}
                    </span>
                  ),
                },
                {
                  title: 'Stage',
                  dataIndex: 'stage',
                  key: 'stage',
                  render: (st) => (
                    <Tag
                      color={st === 'Completed' ? '#4C1D95' : st === 'In Progress' ? 'blue' : 'orange'}
                      style={{
                        borderRadius: 10,
                        backgroundColor: st === 'Completed' ? '#F3E8FF' : undefined,
                        borderColor: st === 'Completed' ? '#DDD6FE' : undefined,
                        color: st === 'Completed' ? '#4C1D95' : undefined,
                        fontWeight: st === 'Completed' ? 700 : 500,
                      }}
                    >
                      {st}
                    </Tag>
                  ),
                },
                {
                  title: 'SLA Status',
                  dataIndex: 'sla',
                  key: 'sla',
                  render: (sl, r) => (
                    <span style={{ fontWeight: 700, color: r.priority === 'Urgent' ? '#EF4444' : '#181433', fontSize: 12 }}>
                      {sl}
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
