import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message, Descriptions, Space, Card, Row, Col, DatePicker, TimePicker, Collapse } from 'antd';
import {
  Plus, CheckCircle, XCircle, Wrench, LifeBuoy, Calendar, HardHat, MapPin,
  FileCheck, ShieldAlert, Cpu, FileText, ThumbsUp, TrendingUp, User, Clock,
  RotateCcw, Save, Building, Layers, CalendarCheck, Eye, Edit, Trash2, ListFilter, Download, Star
} from 'lucide-react';
import { TbStarFilled } from 'react-icons/tb';
import { PageHeader, StatusBadge, GenericCrudToolbar } from '../../components';
import {
  MOCK_SERVICE_TICKETS, MOCK_JOBS, MOCK_TECHNICIANS, MOCK_AMCS,
  MOCK_WARRANTIES, MOCK_SPARES, MOCK_SERVICE_BILLING, MOCK_FEEDBACK
} from '../../mock/salesServiceData';
import type { ServiceTicket, Job, Technician, AMCContract, WarrantyClaim, SparePart, ServiceBilling, CustomerFeedback } from '../../types';
import { getStoredServiceRequests } from '../../services/serviceWorkflowStorage';

export const ServiceTechniciansPage: React.FC = () => {
  const [data] = useState<Technician[]>(MOCK_TECHNICIANS);
  const columns = [
    { title: 'Badge Code', dataIndex: 'code', key: 'code', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Technician Name', dataIndex: 'name', key: 'name', render: (t: string, r: Technician) => <div><div style={{ fontWeight: 600 }}>{t}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{r.phone}</div></div> },
    { title: 'Technical Specialization', dataIndex: 'specialization', key: 'specialization' },
    { title: 'Experience', dataIndex: 'experienceYears', key: 'experienceYears', render: (y: number) => `${y} Years` },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (r: number) => (
        <span style={{ fontWeight: 700, color: '#1E293B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <TbStarFilled size={14} color="#F59E0B" /> {r}
        </span>
      ),
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Field Service Technicians & Engineers" subtitle="Roster, certifications, skill matrices, and live field availability." />
      <Card bordered={false}  style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          marginTop: 16,
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
      <Table bordered={false} rowClassName={(_, idx) => (idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]")} dataSource={data} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

// 5. AMC Contracts

export default ServiceTechniciansPage;
