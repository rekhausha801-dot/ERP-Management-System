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

export const ServiceTicketsPage: React.FC = () => {
  const [data, setData] = useState<ServiceTicket[]>(MOCK_SERVICE_TICKETS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);
  const [form] = Form.useForm();

  const filtered = data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()) || d.ticketNumber.toLowerCase().includes(search.toLowerCase()) || d.productOrAsset.toLowerCase().includes(search.toLowerCase()));

  const handleAccept = (ticket: ServiceTicket) => {
    setData(prev => prev.map(t => t.id === ticket.id ? { ...t, stage: 'Resolved' } : t));
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({ ...selectedTicket, stage: 'Resolved' });
    }
    message.success(`Service Request ${ticket.ticketNumber} has been ACCEPTED.`);
    setViewModalOpen(false);
  };

  const handleReject = (ticket: ServiceTicket) => {
    setData(prev => prev.map(t => t.id === ticket.id ? { ...t, stage: 'Closed' } : t));
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({ ...selectedTicket, stage: 'Closed' });
    }
    message.error(`Service Request ${ticket.ticketNumber} has been REJECTED.`);
    setViewModalOpen(false);
  };

  const handleAdd = (values: any) => {
    const newRecord: ServiceTicket = {
      id: 'tick-' + Date.now(),
      ticketNumber: 'TCK-2026-70' + (data.length + 1),
      customerName: values.customerName,
      productOrAsset: values.productOrAsset,
      issueDescription: values.issueDescription,
      priority: values.priority || 'Medium',
      stage: 'Open',
      assignedTechnician: values.assignedTechnician || 'Unassigned',
      createdAt: '2026-11-16 14:00',
      dueDate: '2026-11-17 18:00',
    };
    setData([newRecord, ...data]);
    message.success('New service ticket logged successfully!');
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: 140,
      render: (t: string) => (
        <span style={{ fontWeight: 700, color: '#4C1D95', fontSize: 13, letterSpacing: '0.2px' }}>
          {t}
        </span>
      ),
    },
    {
      title: 'Customer & Asset',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (c: string, r: ServiceTicket) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{c}</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Asset: {r.productOrAsset}</div>
        </div>
      ),
    },
    {
      title: 'Reported Issue',
      dataIndex: 'issueDescription',
      key: 'issueDescription',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#475569', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as const,
      render: (p: string) => {
        let bg = '#F1F5F9';
        let text = '#475569';
        let border = '#E2E8F0';
        if (p === 'Emergency') {
          bg = '#FEF2F2';
          text = '#EF4444';
          border = '#FEE2E2';
        } else if (p === 'High') {
          bg = '#F8FAFC';
          text = '#475569';
          border = '#E2E8F0';
        } else if (p === 'Medium') {
          bg = '#F8FAFC';
          text = '#475569';
          border = '#E2E8F0';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 14px',
              borderRadius: 8,
              display: 'inline-block',
              border: `1px solid ${border}`,
            }}
          >
            {p}
          </span>
        );
      },
    },
    {
      title: 'Assigned Tech',
      dataIndex: 'assignedTechnician',
      key: 'assignedTechnician',
      align: 'center' as const,
      render: (t: string) => (
        <span
          style={{
            backgroundColor: '#F3E8FF',
            color: '#4C1D95',
            fontWeight: 600,
            fontSize: 12,
            padding: '4px 14px',
            borderRadius: 8,
            display: 'inline-block',
          }}
        >
          {t}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dt: string) => (
        <div style={{ color: '#334155', fontSize: 13, lineHeight: '18px' }}>
          {dt}
        </div>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      align: 'center' as const,
      width: 140,
      render: (st: string) => {
        let bg = '#FEF3C7';
        let text = '#D97706';
        if (st === 'Resolved') {
          bg = '#F3E8FF';
          text = '#4C1D95';
        } else if (st === 'Assigned') {
          bg = '#F8FAFC';
          text = '#475569';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 14px',
              borderRadius: 8,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {st}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, r: ServiceTicket) => (
        <Button
          type="link"
          style={{ padding: 0, fontWeight: 700, color: '#2563EB', fontSize: 13 }}
          onClick={() => {
            setSelectedTicket(r);
            setViewModalOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Service Desk & Helpdesk Tickets" subtitle="Log, triage, and route customer technical breakdown complaints." />
      <GenericCrudToolbar searchPlaceholder="Search tickets by customer or asset..." onSearch={setSearch} onCreateNew={() => setModalOpen(true)} createButtonText="Raise Service Ticket" />
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
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered={false}
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
      />
      </Card>
      <Modal title="Log Technical Service Incident" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Customer Organization" name="customerName" rules={[{ required: true }]}><Input placeholder="Customer name" /></Form.Item>
          <Form.Item label="Asset / Equipment Model" name="productOrAsset" rules={[{ required: true }]}><Input placeholder="e.g. CNC Machine Drive Unit 3" /></Form.Item>
          <Form.Item label="Issue Description" name="issueDescription" rules={[{ required: true }]}><Input.TextArea rows={3} placeholder="Describe the symptom or fault..." /></Form.Item>
          <Form.Item label="Priority Level" name="priority" initialValue="Medium">
            <Select>
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Emergency">Emergency Downtime</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}>Log Ticket</Button>
          </div>
        </Form>
      </Modal>

      {/* View Details Modal with Accept and Reject buttons */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#181433' }}>
              Service Request Details
            </span>
            {selectedTicket && (
              <span style={{ color: '#4C1D95', fontWeight: 600, fontSize: 14 }}>
                ({selectedTicket.ticketNumber})
              </span>
            )}
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={680}
        footer={
          selectedTicket ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
              <Space>
                <Button
                  danger
                  icon={<XCircle size={15} />}
                  onClick={() => handleReject(selectedTicket)}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  Reject
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircle size={15} />}
                  onClick={() => handleAccept(selectedTicket)}
                  style={{
                    backgroundColor: '#4C1D95',
                    borderColor: '#4C1D95',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Accept
                </Button>
              </Space>
            </div>
          ) : null
        }
      >
        {selectedTicket && (
          <div style={{ paddingTop: 8 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Ticket Number">
                <span style={{ fontWeight: 700, color: '#4C1D95' }}>{selectedTicket.ticketNumber}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Current Status / Stage">
                <StatusBadge status={selectedTicket.stage} />
              </Descriptions.Item>

              <Descriptions.Item label="Customer / Organization" span={2}>
                <span style={{ fontWeight: 600 }}>{selectedTicket.customerName}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Asset / Equipment" span={2}>
                <span style={{ color: '#4B5563' }}>{selectedTicket.productOrAsset}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Priority Level">
                <StatusBadge status={selectedTicket.priority} />
              </Descriptions.Item>
              <Descriptions.Item label="Assigned Technician">
                <Tag color="#4C1D95" style={{ backgroundColor: '#F3E8FF', borderColor: '#DDD6FE', color: '#4C1D95', fontWeight: 600 }}>{selectedTicket.assignedTechnician}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Created Date & Time">
                {selectedTicket.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Due SLA Time">
                <span style={{ color: '#DC2626', fontWeight: 600 }}>{selectedTicket.dueDate}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Reported Fault / Problem" span={2}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '10px 14px', borderRadius: 6, border: '1px solid #E5E7EB', color: '#1F2937', lineHeight: 1.6 }}>
                  {selectedTicket.issueDescription}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

// 2. Job Management

export default ServiceTicketsPage;
