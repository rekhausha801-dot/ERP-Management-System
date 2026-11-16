import React from 'react';
import { Row, Col, Card, Table, Tag, Progress, Button, Space, Typography } from 'antd';
import {
  Users,
  HardHat,
  CalendarCheck,
  FolderGit2,
  Boxes,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const recentProjects = [
    {
      key: '1',
      name: 'Metro Line Extension Phase 2',
      client: 'City Transit Authority',
      budget: '$2.4M',
      progress: 68,
      status: 'in_progress',
    },
    {
      key: '2',
      name: 'Central Plaza Commercial Complex',
      client: 'Apex Realty Group',
      budget: '$5.1M',
      progress: 92,
      status: 'in_progress',
    },
    {
      key: '3',
      name: 'Solar Power Plant Grid Unit',
      client: 'National Power Grid',
      budget: '$1.8M',
      progress: 34,
      status: 'in_progress',
    },
    {
      key: '4',
      name: 'Harbor Logistics Warehouse B',
      client: 'Blue Ocean Freight',
      budget: '$950K',
      progress: 100,
      status: 'completed',
    },
  ];

  const recentActivities = [
    { time: '10 mins ago', text: 'Invoice #INV-2024-089 paid by Apex Realty ($48,200)', user: 'Accounts' },
    { time: '35 mins ago', text: 'New worker batch (14 electricians) checked in at Site A', user: 'Supervisor' },
    { time: '2 hours ago', text: 'Purchase order #PO-4402 approved for steel reinforcement', user: 'Procurement' },
    { time: '4 hours ago', text: 'Employee John Miller onboarded to Engineering Dept', user: 'HR Dept' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#0d233a' }}>
            Executive ERP Dashboard
          </Title>
          <Text type="secondary">
            Real-time multi-entity performance, workforce, projects, and finance overview.
          </Text>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#0d233a', borderColor: '#0d233a' }}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
          <Button onClick={() => navigate('/reports')}>Download Reports</Button>
        </Space>
      </div>

      {/* 8 Core Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Employees"
            value="342"
            icon={<Users size={22} />}
            color="#1890ff"
            trend={{ value: 4.8, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Workers"
            value="1,280"
            icon={<HardHat size={22} />}
            color="#fa8c16"
            trend={{ value: 2.1, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Attendance"
            value="94.6%"
            icon={<CalendarCheck size={22} />}
            color="#52c41a"
            trend={{ value: 1.2, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Projects"
            value="18"
            icon={<FolderGit2 size={22} />}
            color="#722ed1"
            trend={{ value: 0, isPositive: true }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Inventory Items"
            value="4,850"
            icon={<Boxes size={22} />}
            color="#13c2c2"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Monthly Expenses"
            value="$184,200"
            icon={<TrendingDown size={22} />}
            color="#ff4d4f"
            trend={{ value: 3.5, isPositive: false }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Revenue (YTD)"
            value="$2,845,000"
            icon={<TrendingUp size={22} />}
            color="#52c41a"
            trend={{ value: 14.2, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Payments"
            value="$78,450"
            icon={<CreditCard size={22} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Middle Section: Recent Projects & Quick Action Feed */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={<Text strong style={{ fontSize: 16 }}>Key Active Projects</Text>}
            extra={
              <Button type="link" onClick={() => navigate('/projects')}>
                View All <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
              </Button>
            }
            style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
          >
            <Table
              dataSource={recentProjects}
              pagination={false}
              columns={[
                {
                  title: 'Project Name',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: 'Client',
                  dataIndex: 'client',
                  key: 'client',
                },
                {
                  title: 'Budget',
                  dataIndex: 'budget',
                  key: 'budget',
                },
                {
                  title: 'Progress',
                  dataIndex: 'progress',
                  key: 'progress',
                  render: (progress) => <Progress percent={progress} size="small" strokeColor="#0d233a" />,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'completed' ? 'success' : 'processing'}>
                      {status === 'completed' ? 'Completed' : 'In Progress'}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<Text strong style={{ fontSize: 16 }}>Recent Activities</Text>}
            style={{ borderRadius: 8, border: '1px solid #f0f0f0', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentActivities.map((act, index) => (
                <div
                  key={index}
                  style={{
                    paddingBottom: 12,
                    borderBottom: index < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Tag color="blue">{act.user}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {act.time}
                    </Text>
                  </div>
                  <Text style={{ fontSize: 13, color: '#334155' }}>{act.text}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
