import React from 'react';
import { Row, Col, Card, Table, Typography, Progress, Button, Space, Tag } from 'antd';
import {
  TrendingUp,
  Target,
  ShoppingBag,
  CreditCard,
  Wrench,
  LifeBuoy,
  Users,
  HardHat,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, KpiCard, PackageBadge, StatusBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SALES_STATS, MOCK_SERVICE_STATS } from '../../mock/erpData';
import { MOCK_LEADS, MOCK_SERVICE_TICKETS } from '../../mock/salesServiceData';

const { Title, Text, Paragraph } = Typography;

export const UnifiedDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useAuth();
  const pkgType: any = selectedCompany?.packageType || 'COMPLETE';

  const showSales = pkgType === 'COMPLETE' || pkgType === 'BOTH' || pkgType === 'SALES';
  const showService = pkgType === 'COMPLETE' || pkgType === 'BOTH' || pkgType === 'SERVICE';

  const leadColumns = [
    {
      title: 'Lead #',
      dataIndex: 'leadNumber',
      key: 'leadNumber',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#51258C' }}>{text}</span>,
    },
    {
      title: 'Client Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E152A' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Contact: {record.contactName}</div>
        </div>
      ),
    },
    {
      title: 'Estimated Value',
      dataIndex: 'estimatedValue',
      key: 'estimatedValue',
      render: (val: number) => <span style={{ fontWeight: 700 }}>₹{val.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  const ticketColumns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{text}</span>,
    },
    {
      title: 'Customer & Asset',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E152A' }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Asset: {record.productOrAsset}</div>
        </div>
      ),
    },
    {
      title: 'Technician',
      dataIndex: 'assignedTechnician',
      key: 'assignedTechnician',
      render: (tech: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
          <HardHat size={14} color="#7546B8" /> {tech}
        </span>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => <StatusBadge status={stage} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${selectedCompany?.name || 'Company'} Dashboard`}
        subtitle="Dynamic enterprise dashboard configured specifically for your active ERP package."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#51258C' }}>
              Package: {pkgType}
            </span>
          </div>
        }
      />

      {/* SALES KPIS - Shown if BOTH or SALES */}
      {showSales && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#51258C', letterSpacing: '0.05em' }}>
              SALES & COMMERCIAL METRICS
            </span>
            <Button type="link" size="small" onClick={() => navigate('/sales/crm')}>
              Go to Sales Pipeline <ArrowRight size={13} />
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Active CRM Leads"
                value={MOCK_SALES_STATS.totalLeads}
                subtitle="In current quarterly pipeline"
                icon={<Target size={22} />}
                trend={{ value: '+18.5%', isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Pending Quotations"
                value={MOCK_SALES_STATS.pendingQuotations}
                subtitle="Awaiting client approval"
                icon={<ShoppingBag size={22} />}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Monthly Sales Revenue"
                value={`₹${(MOCK_SALES_STATS.monthlySalesRevenue / 100000).toFixed(2)}L`}
                subtitle="Invoiced revenue this month"
                icon={<CreditCard size={22} />}
                trend={{ value: '+12.4%', isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Lead Conversion Rate"
                value={MOCK_SALES_STATS.conversionRate}
                subtitle="Enquiries converted to orders"
                icon={<TrendingUp size={22} />}
              />
            </Col>
          </Row>
        </div>
      )}

      {/* SERVICE KPIS - Shown if BOTH or SERVICE */}
      {showService && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#059669', letterSpacing: '0.05em' }}>
              FIELD SERVICE & MAINTENANCE OPERATIONS
            </span>
            <Button type="link" size="small" onClick={() => navigate('/service/tickets')}>
              Go to Service Desk <ArrowRight size={13} />
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Open Service Tickets"
                value={MOCK_SERVICE_STATS.openTickets}
                subtitle="Active incidents / requests"
                icon={<LifeBuoy size={22} />}
                iconBgColor="rgba(5, 150, 105, 0.1)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Jobs Scheduled Today"
                value={MOCK_SERVICE_STATS.activeJobsToday}
                subtitle="Field technician dispatches"
                icon={<Wrench size={22} />}
                iconBgColor="rgba(5, 150, 105, 0.1)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="Active AMC Contracts"
                value={MOCK_SERVICE_STATS.activeAMCs}
                subtitle="Equipment under maintenance"
                icon={<Package size={22} />}
                iconBgColor="rgba(5, 150, 105, 0.1)"
                trend={{ value: '+8 contracts', isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <KpiCard
                title="CSAT Rating"
                value={MOCK_SERVICE_STATS.customerSatisfaction}
                subtitle="Based on customer feedback"
                icon={<Users size={22} />}
                iconBgColor="rgba(5, 150, 105, 0.1)"
              />
            </Col>
          </Row>
        </div>
      )}

      {/* Tables Row according to package */}
      <Row gutter={[16, 16]}>
        {showSales && (
          <Col xs={24} lg={showService ? 12 : 24}>
            <Card
              title="Recent Qualified Commercial Leads"
              style={{ borderRadius: 8 }}
              extra={
                <Button type="link" onClick={() => navigate('/sales/leads')}>
                  View All Leads
                </Button>
              }
            >
              <Table
                dataSource={MOCK_LEADS}
                columns={leadColumns}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>
        )}

        {showService && (
          <Col xs={24} lg={showSales ? 12 : 24}>
            <Card
              title="Active Critical Service Tickets"
              style={{ borderRadius: 8 }}
              extra={
                <Button type="link" onClick={() => navigate('/service/tickets')}>
                  View All Tickets
                </Button>
              }
            >
              <Table
                dataSource={MOCK_SERVICE_TICKETS}
                columns={ticketColumns}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};
