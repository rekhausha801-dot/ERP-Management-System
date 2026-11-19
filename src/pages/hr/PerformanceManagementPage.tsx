import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Tabs, Row, Col, Statistic, Progress, message } from 'antd';
import { Award, TrendingUp, Wrench, CheckCircle, Star, Users, Download, Plus } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface PerformanceItem {
  key: string;
  empId: string;
  name: string;
  department: string;
  role: string;
  targetMetric: string;
  achievedMetric: string;
  score: number;
  rating: 'Outstanding' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement';
  reviewCycle: string;
}

const INITIAL_PERFORMANCE: PerformanceItem[] = [
  { key: '1', empId: 'EMP-002', name: 'Suresh Kumar', department: 'Service Contracts', role: 'AMC Service Specialist', targetMetric: '40 AMC Renewals', achievedMetric: '46 Renewals (115%)', score: 94, rating: 'Outstanding', reviewCycle: 'Q3 2026' },
  { key: '2', empId: 'EMP-003', name: 'Murugan K.', department: 'Field Services', role: 'Field Service Engineer', targetMetric: '45 Service Tickets', achievedMetric: '49 Tickets Resolved (108%)', score: 91, rating: 'Outstanding', reviewCycle: 'Q3 2026' },
  { key: '3', empId: 'EMP-005', name: 'Dinesh V.', department: 'Technical Dispatch', role: 'Hydraulics Tech', targetMetric: '30 Maintenance Jobs', achievedMetric: '28 Jobs (93%)', score: 82, rating: 'Meets Expectations', reviewCycle: 'Q3 2026' },
  { key: '4', empId: 'EMP-004', name: 'Ananya Sharma', department: 'Customer Support', role: 'Helpdesk Coordinator', targetMetric: 'Resolve 150 Tickets', achievedMetric: '158 Resolved (105%)', score: 88, rating: 'Exceeds Expectations', reviewCycle: 'Q3 2026' },
  { key: '5', empId: 'EMP-006', name: 'Karthik Raja', department: 'Service Operations', role: 'Warranty & Parts Specialist', targetMetric: '100% SLA Compliance', achievedMetric: '99.4% SLA Met', score: 89, rating: 'Exceeds Expectations', reviewCycle: 'Q3 2026' },
];

export const PerformanceManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<PerformanceItem[]>(INITIAL_PERFORMANCE);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddReview = (values: any) => {
    const newItem: PerformanceItem = {
      key: String(Date.now()),
      empId: 'EMP-00' + (reviews.length + 1),
      name: values.name,
      department: values.department,
      role: values.role || 'Staff',
      targetMetric: values.targetMetric || 'Standard OKR',
      achievedMetric: values.achievedMetric || '100% completed',
      score: Number(values.score) || 85,
      rating: 'Exceeds Expectations',
      reviewCycle: 'Q4 2026',
    };
    setReviews([newItem, ...reviews]);
    message.success('Performance review recorded successfully!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Emp ID', dataIndex: 'empId', key: 'empId', render: (t: string) => <Text strong style={{ color: '#6E56CF' }}>{t}</Text> },
    { title: 'Employee', dataIndex: 'name', key: 'name', render: (n: string) => <strong>{n}</strong> },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (d: string) => <Tag color="blue">{d}</Tag> },
    { title: 'Assigned Target / KPI', dataIndex: 'targetMetric', key: 'targetMetric' },
    { title: 'Actual Achievement', dataIndex: 'achievedMetric', key: 'achievedMetric', render: (t: string) => <strong style={{ color: '#10B981' }}>{t}</strong> },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (s: number) => <Progress percent={s} size="small" strokeColor={s >= 90 ? '#10B981' : '#6E56CF'} style={{ width: 100 }} />,
    },
    {
      title: 'Appraisal Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: string) => {
        const color = r === 'Outstanding' ? 'purple' : r === 'Exceeds Expectations' ? 'green' : 'gold';
        return <Tag color={color}>{r}</Tag>;
      },
    },
    { title: 'Review Cycle', dataIndex: 'reviewCycle', key: 'reviewCycle' },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Performance Management"
        subtitle="Individual appraisal scores, service contract renewals, technician completion ratings, and OKRs."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Performance matrix exported')}>
              Export
            </Button>
            <Button type="primary" icon={<Plus size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsModalOpen(true)}>
              Record Review
            </Button>
          </Space>
        }
      />

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Average Score" value="89.2%" prefix={<Award size={16} color="#6E56CF" />} valueStyle={{ color: '#6E56CF', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Outstanding Performers" value={reviews.filter(r => r.rating === 'Outstanding').length} prefix={<Star size={16} color="#F59E0B" />} valueStyle={{ color: '#F59E0B', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Target Quota Met" value="94.5%" prefix={<TrendingUp size={16} color="#10B981" />} valueStyle={{ color: '#10B981', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Service SLAs Passed" value="98.1%" prefix={<CheckCircle size={16} color="#3B82F6" />} valueStyle={{ color: '#19153B', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'All Appraisals' },
            { key: 'contracts', label: 'Service Contracts & AMCs' },
            { key: 'technicians', label: 'Technician Job Performance' },
            { key: 'productivity', label: 'Service Desk Productivity' },
          ]}
        />

        <Table dataSource={reviews} columns={columns} pagination={{ pageSize: 8 }} />
      </Card>

      {/* Record Review Modal */}
      <Modal title="Log Employee Performance Review" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddReview}>
          <Form.Item label="Employee Name" name="name" initialValue="Suresh Kumar" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Department" name="department" initialValue="Field Services" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Field Services', label: 'Field Services' },
              { value: 'Service Contracts', label: 'Service Contracts' },
              { value: 'Technical Dispatch', label: 'Technical Dispatch' },
              { value: 'Customer Support', label: 'Customer Support' },
            ]} />
          </Form.Item>
          <Form.Item label="Assigned Target Metric" name="targetMetric" initialValue="40 AMC Renewals" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Actual Performance Score (0-100)" name="score" initialValue={90} rules={[{ required: true }]}>
            <Input type="number" min={0} max={100} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>Submit Appraisal</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
