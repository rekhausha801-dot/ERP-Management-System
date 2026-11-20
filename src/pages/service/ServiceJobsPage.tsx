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

export const ServiceJobsPage: React.FC = () => {
  const [data] = useState<Job[]>(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Job #', dataIndex: 'jobNumber', key: 'jobNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#4C1D95' }}>{t}</span> },
    { title: 'Ticket Reference', dataIndex: 'ticketNumber', key: 'ticketNumber' },
    { title: 'Client & Site Location', dataIndex: 'clientName', key: 'clientName', render: (c: string, r: Job) => <div><div style={{ fontWeight: 600 }}>{c}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{r.siteLocation}</div></div> },
    { title: 'Scheduled Timing', dataIndex: 'scheduledDate', key: 'scheduledDate' },
    { title: 'Technician Dispatched', dataIndex: 'technicianName', key: 'technicianName' },
    { title: 'Job Type', dataIndex: 'jobType', key: 'jobType', render: (jt: string) => <Tag color="blue">{jt}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Field Job Management & Work Orders" subtitle="Dispatch and verify on-site customer service work orders." />
      <GenericCrudToolbar searchPlaceholder="Search jobs..." onSearch={setSearch} />
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
      <Table bordered={false} rowClassName={(_, idx) => (idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]")} dataSource={data.filter(d => d.clientName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

// 3. Scheduling & Calendar

export default ServiceJobsPage;
