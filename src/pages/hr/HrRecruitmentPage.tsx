import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Tooltip,
  Badge,
  message,
  Card,
  Progress,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserCheck,
  UserPlus,
  Briefcase,
  FileCheck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Send,
  Calendar,
  Building,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_PURPLE = '#5421A8';

interface CandidateRecord {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: string;
  phone: string;
  email: string;
  stage: 'Applied' | 'Screening' | 'Technical Round' | 'HR Interview' | 'Offer Released' | 'Onboarded';
  rating: number;
  expectedCtc: string;
}

const INITIAL_CANDIDATES: CandidateRecord[] = [
  {
    id: 'cand-1',
    name: 'Gowtham Sundaram',
    position: 'Senior Embedded Systems Engineer',
    department: 'R&D and Engineering',
    experience: '6 Years',
    phone: '+91 98402 11990',
    email: 'gowtham.s@gmail.com',
    stage: 'Offer Released',
    rating: 92,
    expectedCtc: '₹14,50,000 P.A.',
  },
  {
    id: 'cand-2',
    name: 'Priyanka Reddy',
    position: 'Industrial Automation Sales Manager',
    department: 'Manufacturing & Production',
    experience: '4.5 Years',
    phone: '+91 97890 33441',
    email: 'priyanka.reddy@yahoo.com',
    stage: 'Technical Round',
    rating: 86,
    expectedCtc: '₹10,00,000 P.A.',
  },
  {
    id: 'cand-3',
    name: 'Arun Prakash',
    position: 'Warehouse & Inventory Lead',
    department: 'Operations & Maintenance',
    experience: '5 Years',
    phone: '+91 94441 55662',
    email: 'arun.logistics@outlook.com',
    stage: 'Screening',
    rating: 78,
    expectedCtc: '₹7,50,000 P.A.',
  },
  {
    id: 'cand-4',
    name: 'Deepika Narayanan',
    position: 'Statutory Payroll & Accounts Executive',
    department: 'Administration & Facility',
    experience: '3 Years',
    phone: '+91 99620 77883',
    email: 'deepika.finance@gmail.com',
    stage: 'Onboarded',
    rating: 95,
    expectedCtc: '₹6,20,000 P.A.',
  },
];

export const HrRecruitmentPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRecord[]>(INITIAL_CANDIDATES);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const metrics = {
    totalOpenings: 8,
    activeCandidates: candidates.length,
    offersReleased: candidates.filter((c) => c.stage === 'Offer Released').length,
    onboardedThisMonth: candidates.filter((c) => c.stage === 'Onboarded').length + 3,
  };

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'ALL' || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleCreateCandidate = (values: any) => {
    const newCand: CandidateRecord = {
      id: `cand-${Date.now()}`,
      name: values.name,
      position: values.position,
      department: values.department,
      experience: values.experience,
      phone: values.phone,
      email: values.email,
      stage: 'Screening',
      rating: 80,
      expectedCtc: values.expectedCtc,
    };
    setCandidates([newCand, ...candidates]);
    message.success(`Candidate ${newCand.name} enrolled into talent pipeline!`);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<CandidateRecord> = [
    {
      title: 'Candidate Name',
      key: 'name',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{r.name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.email} • {r.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Target Position & Dept',
      key: 'position',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: 12 }}>{r.position}</div>
          <Tag color="purple" style={{ fontSize: 10, marginTop: 2 }}>{r.department}</Tag>
        </div>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 110,
    },
    {
      title: 'Expected CTC',
      dataIndex: 'expectedCtc',
      key: 'expectedCtc',
      render: (t: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{t}</span>,
    },
    {
      title: 'Interview Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (score: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Progress percent={score} size="small" style={{ width: 80 }} />
          <span style={{ fontWeight: 700, fontSize: 11 }}>{score}%</span>
        </div>
      ),
    },
    {
      title: 'Hiring Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (st: string) => {
        const color =
          st === 'Onboarded' ? 'green' : st === 'Offer Released' ? 'gold' : st === 'Technical Round' ? 'processing' : 'default';
        return <Tag color={color} style={{ fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            onClick={() => message.success(`Opening hiring dossier for ${r.name}`)}
          >
            Review Dossier
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Recruitment & Talent Onboarding"
        subtitle="Manage job openings, candidate evaluations, multi-stage interview assessments, offer letters, and statutory onboarding."
        icon={<UserCheck size={20} />}
        searchPlaceholder="Search candidate, role, department..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add Candidate"
        onPrimaryAction={() => {
          form.resetFields();
          setIsAddModalOpen(true);
        }}
      />

      {/* 2. 4 Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Open Positions',
            value: `${metrics.totalOpenings} Roles`,
            growth: 'Across 5 Depts',
            isDark: true,
            icon: <Briefcase size={20} color={BRAND_PURPLE} />,
            pillExtra: 'Active Vacancies',
          },
          {
            title: 'In Talent Pipeline',
            value: `${metrics.activeCandidates} Candidates`,
            growth: 'Active Assessments',
            isDark: false,
            icon: <UserPlus size={20} color="#3B82F6" />,
            pillExtra: 'Screening to Final',
          },
          {
            title: 'Offers Released',
            value: `${metrics.offersReleased} Offers`,
            growth: 'CTC Approved',
            isDark: true,
            icon: <FileCheck size={20} color="#10B981" />,
            pillExtra: 'Awaiting Joining',
          },
          {
            title: 'Onboarded (Month)',
            value: `${metrics.onboardedThisMonth} Hires`,
            growth: 'PF/ESI Enrolled',
            isDark: false,
            icon: <CheckCircle size={20} color="#F59E0B" />,
            pillExtra: 'Fully Inducted',
          },
        ]}
      />

      {/* 3. Candidate Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <Select
            value={stageFilter}
            onChange={setStageFilter}
            style={{ width: 180 }}
            options={[
              { value: 'ALL', label: 'All Hiring Stages' },
              { value: 'Screening', label: 'Screening' },
              { value: 'Technical Round', label: 'Technical Round' },
              { value: 'HR Interview', label: 'HR Interview' },
              { value: 'Offer Released', label: 'Offer Released' },
              { value: 'Onboarded', label: 'Onboarded' },
            ]}
          />
        </div>

        <Table<CandidateRecord>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small' }}
          size="middle"
        />
      </div>

      {/* 4. Add Candidate Modal */}
      <Modal
        title="Enroll New Candidate into Pipeline"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCandidate}>
          <Form.Item label="Candidate Full Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Ramesh Kumar" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Target Position" name="position" rules={[{ required: true }]}>
                <Input placeholder="e.g. Senior Mechanical Design Engineer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Manufacturing & Production', label: 'Manufacturing & Production' },
                    { value: 'R&D and Engineering', label: 'R&D and Engineering' },
                    { value: 'Operations & Maintenance', label: 'Operations & Maintenance' },
                    { value: 'IT & Infrastructure', label: 'IT & Infrastructure' },
                    { value: 'Administration & Facility', label: 'Administration & Facility' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
                <Input placeholder="e.g. 5 Years" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Expected CTC (₹)" name="expectedCtc" rules={[{ required: true }]}>
                <Input placeholder="e.g. ₹9,00,000 P.A." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Contact Mobile" name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98765 43210" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email Address" name="email" rules={[{ required: true }]}>
                <Input placeholder="candidate@email.com" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}>
              Add to Pipeline
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HrRecruitmentPage;
