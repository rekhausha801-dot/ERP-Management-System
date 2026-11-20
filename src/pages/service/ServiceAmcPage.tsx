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

export const ServiceAmcPage: React.FC = () => {
  const [data] = useState<AMCContract[]>(MOCK_AMCS);
  const columns = [
    { title: 'Contract #', dataIndex: 'contractNumber', key: 'contractNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#4C1D95' }}>{t}</span> },
    { title: 'Customer', dataIndex: 'clientName', key: 'clientName' },
    { title: 'Contract Title', dataIndex: 'contractTitle', key: 'contractTitle' },
    { title: 'Valid Period', key: 'period', render: (_: any, r: AMCContract) => `${r.startDate} to ${r.endDate}` },
    { title: 'Annual Value', dataIndex: 'annualValue', key: 'annualValue', render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString()}</span> },
    { title: 'Visits (Done/Total)', key: 'visits', render: (_: any, r: AMCContract) => `${r.visitsCompleted} / ${r.visitsIncluded} Visits` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Annual Maintenance Contracts (AMC)" subtitle="Track recurrent service SLAs, preventative visit quotas, and contract renewals." />
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

// 6. Warranty Claims

export default ServiceAmcPage;
