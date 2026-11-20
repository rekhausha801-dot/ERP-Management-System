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

export const ServiceFeedbackPage: React.FC = () => {
  const [data] = useState<CustomerFeedback[]>(MOCK_FEEDBACK);
  const columns = [
    { title: 'Job Reference', dataIndex: 'ticketOrJobNumber', key: 'ticketOrJobNumber' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Technician Evaluated', dataIndex: 'technicianName', key: 'technicianName' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => <span style={{ fontWeight: 700, color: '#F59E0B' }}>⭐ {r} / 5</span> },
    { title: 'Customer Remarks', dataIndex: 'comments', key: 'comments' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];
  return (
    <div>
      <PageHeader title="Customer Feedback & CSAT" subtitle="Collect customer satisfaction metrics post-service resolution." />
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

// 10. Service Reports

export default ServiceFeedbackPage;
