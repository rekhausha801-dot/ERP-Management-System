import React from 'react';
import { Table, Tag, Typography, Button, Space, Card, Row, Col } from 'antd';
import { CreditCard, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader, PackageBadge, StatusBadge, KpiCard } from '../../components';
import { MOCK_SUBSCRIPTIONS } from '../../mock/erpData';

const { Text } = Typography;

export const SubscriptionManagementPage: React.FC = () => {
  const columns = [
    {
      title: 'Company / Tenant',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1E152A' }}>{text}</span>,
    },
    {
      title: 'ERP Package',
      dataIndex: 'packageType',
      key: 'packageType',
      render: (pkg: any) => <PackageBadge packageType={pkg} />,
    },
    {
      title: 'Plan Frequency',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => <Tag color="blue">{plan}</Tag>,
    },
    {
      title: 'Billing Cycle',
      dataIndex: 'billingCycle',
      key: 'billingCycle',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => (
        <span style={{ fontWeight: 700, color: '#51258C' }}>
          ₹{amount.toLocaleString()} <span style={{ fontSize: 11, color: '#8E849E' }}>{record.currency}</span>
        </span>
      ),
    },
    {
      title: 'Next Renewal Date',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Subscriptions & Tenant Billing"
        subtitle="Manage SaaS recurring revenue, contract renewals, license keys, and billing cycles."
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Active Subscriptions"
            value="3"
            subtitle="100% renewal retention"
            icon={<CheckCircle2 size={22} />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Annual Contract Value (ARR)"
            value="₹2,59,997"
            subtitle="Contracted revenue"
            icon={<CreditCard size={22} />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Upcoming Renewals"
            value="1"
            subtitle="Within next 30 days"
            icon={<Clock size={22} />}
          />
        </Col>
      </Row>

      <Card style={{ borderRadius: 8 }}>
        <Table
          dataSource={MOCK_SUBSCRIPTIONS}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};
