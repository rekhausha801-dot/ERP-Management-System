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

export const ServiceBillingPage: React.FC = () => {
  const [data] = useState<ServiceBilling[]>(MOCK_SERVICE_BILLING);
  const columns = [
    { title: 'Service Bill #', dataIndex: 'billNumber', key: 'billNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#4C1D95' }}>{t}</span> },
    { title: 'Ticket Reference', dataIndex: 'ticketNumber', key: 'ticketNumber' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Labor Charge', dataIndex: 'laborCharge', key: 'laborCharge', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Parts Charge', dataIndex: 'partsCharge', key: 'partsCharge', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Total Bill (inc. Tax)', dataIndex: 'totalBill', key: 'totalBill', render: (v: number) => <span style={{ fontWeight: 700, color: '#4C1D95' }}>₹${v.toLocaleString()}</span> },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Field Service Invoicing & Billing" subtitle="Generate bills combining engineer labor, travel, and parts consumed." />
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

// 9. Feedback

export default ServiceBillingPage;
