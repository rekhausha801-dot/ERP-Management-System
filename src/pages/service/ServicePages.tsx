import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message, Descriptions, Space, Card, Row, Col, DatePicker, TimePicker, Collapse } from 'antd';
import {
  Plus,
  CheckCircle,
  XCircle,
  Wrench,
  LifeBuoy,
  Calendar,
  HardHat,
  MapPin,
  FileCheck,
  ShieldAlert,
  Cpu,
  FileText,
  ThumbsUp,
  TrendingUp,
  User,
  Clock,
  RotateCcw,
  Save,
  Building,
  Layers,
  CalendarCheck,
  Eye,
  Edit,
  Trash2,
  ListFilter,
  Download,
  Star,
} from 'lucide-react';
import { PageHeader, StatusBadge, GenericCrudToolbar } from '../../components';
import {
  MOCK_SERVICE_TICKETS,
  MOCK_JOBS,
  MOCK_TECHNICIANS,
  MOCK_AMCS,
  MOCK_WARRANTIES,
  MOCK_SPARES,
  MOCK_SERVICE_BILLING,
  MOCK_FEEDBACK,
} from '../../mock/salesServiceData';
import type { ServiceTicket, Job, Technician, AMCContract, WarrantyClaim, SparePart, ServiceBilling, CustomerFeedback } from '../../types';
import { getStoredServiceRequests } from '../../services/serviceWorkflowStorage';

// 1. Service Requests & Tickets
export const ServiceTicketsPage: React.FC = () => {
  const [data, setData] = useState<ServiceTicket[]>(() => {
    // Merge mock tickets with any approved workflow requests
    const approvedWorkflowTickets: ServiceTicket[] = getStoredServiceRequests()
      .filter((r) => r.status === 'Approved' && r.generatedTicketId)
      .map((r) => ({
        id: r.id,
        ticketNumber: r.generatedTicketId || 'TCK-2026-999',
        customerName: r.companyName ? `${r.customerName} (${r.companyName})` : r.customerName,
        productOrAsset: r.serviceType,
        issueDescription: r.requestDescription,
        priority: (r.priority === 'Urgent' ? 'Emergency' : r.priority) as any,
        stage: 'Assigned',
        assignedTechnician: r.assignedTechnician || 'Murugan Selvam',
        createdAt: r.requestDate,
        dueDate: 'Within 24 Hours',
      }));

    // Avoid duplicate IDs
    const existingIds = new Set(approvedWorkflowTickets.map(t => t.ticketNumber));
    const uniqueMocks = MOCK_SERVICE_TICKETS.filter(m => !existingIds.has(m.ticketNumber));
    return [...approvedWorkflowTickets, ...uniqueMocks];
  });
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
        <span style={{ fontWeight: 700, color: '#059669', fontSize: 13, letterSpacing: '0.2px' }}>
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
            backgroundColor: '#F0FDF4',
            color: '#16A34A',
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
          bg = '#DCFCE7';
          text = '#15803D';
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
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered={false}
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
      />
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
              <span style={{ color: '#059669', fontWeight: 600, fontSize: 14 }}>
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
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
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
                <span style={{ fontWeight: 700, color: '#059669' }}>{selectedTicket.ticketNumber}</span>
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
                <Tag color="green" style={{ fontWeight: 600 }}>{selectedTicket.assignedTechnician}</Tag>
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
export const ServiceJobsPage: React.FC = () => {
  const [data] = useState<Job[]>(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const columns = [
    { title: 'Job #', dataIndex: 'jobNumber', key: 'jobNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
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
      <Table dataSource={data.filter(d => d.clientName.toLowerCase().includes(search.toLowerCase()))} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 3. Scheduling & Calendar
export const ServiceSchedulingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [searchSchedule, setSearchSchedule] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Initial list matching exact values in screenshot media_1794983803340_fd3a4726.jpg
  const [schedules, setSchedules] = useState<any[]>([
    {
      key: '1',
      idNum: '1',
      scheduleId: 'SCH-001',
      serviceOrder: 'SO-1001',
      customerName: 'ABC Industries',
      serviceType: 'AC Maintenance',
      technician: 'Deepak Varma',
      dateTime: '20-11-2026 10:00 AM - 12:00 PM',
      serviceDate: '20-11-2026',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      priority: 'High',
      status: 'Scheduled',
      location: '123, Industrial Area, Pondicherry',
      remarks: 'Check cooling issue and clean filters.',
    },
    {
      key: '2',
      idNum: '2',
      scheduleId: 'SCH-002',
      serviceOrder: 'SO-1002',
      customerName: 'Apex Tools',
      serviceType: 'Machine Repair',
      technician: 'Murugan Selvam',
      dateTime: '20-11-2026 02:00 PM - 04:00 PM',
      serviceDate: '20-11-2026',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      priority: 'Medium',
      status: 'In Progress',
      location: 'Plot 4B, Ambattur Industrial Estate, Chennai',
      remarks: 'Over-current trip issue on cylinder 2.',
    },
    {
      key: '3',
      idNum: '3',
      scheduleId: 'SCH-003',
      serviceOrder: 'SO-1003',
      customerName: 'Sri Traders',
      serviceType: 'Electrical Repair',
      technician: 'Rajesh Kannan',
      dateTime: '21-11-2026 09:00 AM - 11:00 AM',
      serviceDate: '21-11-2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      priority: 'Low',
      status: 'Scheduled',
      location: '77 Sriperumbudur Expressway',
      remarks: 'Periodic axis laser accuracy test.',
    },
    {
      key: '4',
      idNum: '4',
      scheduleId: 'SCH-004',
      serviceOrder: 'SO-1004',
      customerName: 'Global Systems',
      serviceType: 'HVAC Service',
      technician: 'Deepak Varma',
      dateTime: '21-11-2026 01:00 PM - 03:00 PM',
      serviceDate: '21-11-2026',
      startTime: '01:00 PM',
      endTime: '03:00 PM',
      priority: 'Medium',
      status: 'Cancelled',
      location: '12 North Block, IT Corridor',
      remarks: 'Customer requested reschedule.',
    },
  ]);

  const handleFinish = (values: any) => {
    const nextIdx = schedules.length + 1;
    const dateStr = values.serviceDate ? values.serviceDate.format('DD-MM-YYYY') : '20-11-2026';
    const startStr = values.startTime ? values.startTime.format('hh:mm A') : '10:00 AM';
    const endStr = values.endTime ? values.endTime.format('hh:mm A') : '12:00 PM';
    const rawOrder = values.serviceOrder || 'SO-1005 – General Maintenance';
    const orderCode = rawOrder.split(' ')[0] || `SO-${1000 + nextIdx}`;

    const newSchedule = {
      key: String(Date.now()),
      idNum: String(nextIdx),
      scheduleId: `SCH-00${nextIdx}`,
      serviceOrder: orderCode,
      customerName: values.customerName || 'ABC Industries',
      serviceType: values.serviceType || 'AC Maintenance',
      technician: values.assignedTechnician || 'Deepak Varma',
      dateTime: `${dateStr} ${startStr} - ${endStr}`,
      serviceDate: dateStr,
      startTime: startStr,
      endTime: endStr,
      priority: values.priority || 'High',
      status: values.status || 'Scheduled',
      location: values.serviceLocation || '123, Industrial Area, Pondicherry',
      remarks: values.remarks || 'Check cooling issue and clean filters.',
    };

    setSchedules([newSchedule, ...schedules]);
    message.success('Service successfully scheduled!');
    setScheduleModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (recordKey: string) => {
    setSchedules(prev => prev.filter(item => item.key !== recordKey));
    message.success('Schedule deleted successfully');
  };

  const handleAccept = (record: any) => {
    setSchedules(prev =>
      prev.map(item => (item.key === record.key ? { ...item, status: 'Scheduled' } : item))
    );
    message.success(`Schedule ${record.scheduleId} Accepted!`);
    setViewModalOpen(false);
  };

  const handleReject = (record: any) => {
    setSchedules(prev =>
      prev.map(item => (item.key === record.key ? { ...item, status: 'Cancelled' } : item))
    );
    message.error(`Schedule ${record.scheduleId} Rejected / Cancelled!`);
    setViewModalOpen(false);
  };

  const filteredSchedules = schedules.filter(s =>
    `${s.scheduleId} ${s.serviceOrder} ${s.customerName} ${s.serviceType} ${s.technician}`
      .toLowerCase()
      .includes(searchSchedule.toLowerCase())
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'idNum',
      key: 'idNum',
      width: 50,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span style={{ color: '#475569', fontWeight: 600 }}>{index + 1}</span>
      ),
    },
    {
      title: 'Schedule ID',
      dataIndex: 'scheduleId',
      key: 'scheduleId',
      render: (id: string) => (
        <span style={{ fontWeight: 600, color: '#1E293B' }}>{id}</span>
      ),
    },
    {
      title: 'Service Order',
      dataIndex: 'serviceOrder',
      key: 'serviceOrder',
      render: (so: string) => (
        <span style={{ color: '#334155', fontWeight: 500 }}>{so}</span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (c: string) => (
        <span style={{ fontWeight: 600, color: '#1E293B' }}>{c}</span>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (t: string) => (
        <span style={{ color: '#334155' }}>{t}</span>
      ),
    },
    {
      title: 'Technician',
      dataIndex: 'technician',
      key: 'technician',
      render: (tech: string) => (
        <span style={{ color: '#334155' }}>{tech}</span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dt: string) => (
        <span style={{ color: '#334155', fontSize: 13, lineHeight: '1.4' }}>{dt}</span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as const,
      render: (p: string) => {
        let bg = '#FEF2F2';
        let text = '#DC2626';
        if (p === 'Medium') {
          bg = '#FEF3C7';
          text = '#D97706';
        } else if (p === 'Low') {
          bg = '#DCFCE7';
          text = '#16A34A';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 600,
              fontSize: 12,
              padding: '3px 12px',
              borderRadius: 6,
              display: 'inline-block',
            }}
          >
            {p}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (st: string) => {
        let bg = '#DCFCE7';
        let text = '#15803D';
        let dot = '#16A34A';
        if (st === 'In Progress') {
          bg = '#DBEAFE';
          text = '#1D4ED8';
          dot = '#2563EB';
        } else if (st === 'Cancelled') {
          bg = '#FEE2E2';
          text = '#DC2626';
          dot = '#EF4444';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 14px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10, color: dot }}>●</span> {st}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {/* View Button */}
          <button
            onClick={() => {
              setSelectedRecord(record);
              setViewModalOpen(true);
            }}
            title="View Details"
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Eye size={15} />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => {
              form.setFieldsValue({
                serviceOrder: record.serviceOrder,
                customerName: record.customerName,
                serviceType: record.serviceType,
                assignedTechnician: record.technician,
                priority: record.priority,
                serviceLocation: record.location,
                remarks: record.remarks,
                status: record.status,
              });
              setScheduleModalOpen(true);
            }}
            title="Edit Schedule"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              backgroundColor: '#EFF6FF',
              border: 'none',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Edit size={14} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(record.key)}
            title="Delete Schedule"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              backgroundColor: '#FEF2F2',
              border: 'none',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* 1. Header Section matching Purple ERP Theme */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #EAE8FD',
              boxShadow: '0 2px 8px rgba(110, 86, 207, 0.08)',
            }}
          >
            <Calendar size={22} color="#6E56CF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#181433' }}>
              Service Schedule
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#827B9E' }}>
              Plan and manage service visits efficiently
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* View Calendar Button */}
          <button
            onClick={() => message.info('Calendar view toggle')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE8FD',
              color: '#6E56CF',
              padding: '9px 18px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(110, 86, 207, 0.06)',
            }}
          >
            <Calendar size={15} color="#6E56CF" />
            <span>View Calendar</span>
          </button>

          {/* Schedule Service Button - Purple Theme Gradient */}
          <button
            onClick={() => {
              form.resetFields();
              setScheduleModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #6E56CF 0%, #5B44B9 100%)',
              border: 'none',
              color: '#FFFFFF',
              padding: '9px 20px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(110, 86, 207, 0.35)',
            }}
          >
            <Plus size={16} color="#FFFFFF" />
            <span>Schedule Service</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards matching ERP Theme with White Background */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Schedules */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE8FD',
              boxShadow: '0 4px 16px rgba(110, 86, 207, 0.05)',
            }}
            styles={{ body: { padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 } }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                flexShrink: 0,
              }}
            >
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', lineHeight: 1.1 }}>
                45
              </div>
              <div style={{ fontSize: 13, color: '#827B9E', fontWeight: 500, marginTop: 3 }}>
                Total Schedules
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Completed */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE8FD',
              boxShadow: '0 4px 16px rgba(110, 86, 207, 0.05)',
            }}
            styles={{ body: { padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 } }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#F0FDF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
                flexShrink: 0,
              }}
            >
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', lineHeight: 1.1 }}>
                28
              </div>
              <div style={{ fontSize: 13, color: '#827B9E', fontWeight: 500, marginTop: 3 }}>
                Completed
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Upcoming */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE8FD',
              boxShadow: '0 4px 16px rgba(110, 86, 207, 0.05)',
            }}
            styles={{ body: { padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 } }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#FFFBEB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                flexShrink: 0,
              }}
            >
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', lineHeight: 1.1 }}>
                10
              </div>
              <div style={{ fontSize: 13, color: '#827B9E', fontWeight: 500, marginTop: 3 }}>
                Upcoming
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: Cancelled */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE8FD',
              boxShadow: '0 4px 16px rgba(110, 86, 207, 0.05)',
            }}
            styles={{ body: { padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 } }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC2626',
                flexShrink: 0,
              }}
            >
              <XCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', lineHeight: 1.1 }}>
                7
              </div>
              <div style={{ fontSize: 13, color: '#827B9E', fontWeight: 500, marginTop: 3 }}>
                Cancelled
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. Schedule Service Form Modal matching Screenshot ba453ecb.png */}
      <Modal
        title={
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', padding: '0 0 2px' }}>
            Schedule Service
          </div>
        }
        open={scheduleModalOpen}
        onCancel={() => setScheduleModalOpen(false)}
        footer={null}
        width={540}
        centered
        styles={{
          body: {
            padding: 0,
            maxHeight: 'calc(85vh - 60px)',
            overflowY: 'auto',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 6 }}
          initialValues={{
            serviceOrder: 'SO-1001 – AC Maintenance',
            customerName: 'ABC Industries',
            serviceType: 'AC Maintenance',
            assignedTechnician: 'Deepak Varma',
            priority: 'High',
            serviceLocation: '123, Industrial Area, Pondicherry',
            remarks: 'Check cooling issue and clean filters.',
            status: 'Scheduled',
          }}
        >
          <Row gutter={[12, 0]}>
            {/* Service Order */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Order</span>}
                name="serviceOrder"
                required
                rules={[{ required: true, message: 'Please select service order' }]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<Layers size={13} color="#64748B" />}
                  options={[
                    { value: 'SO-1001 – AC Maintenance', label: 'SO-1001 – AC Maintenance' },
                    { value: 'SO-1002 – Hydraulic Overhaul', label: 'SO-1002 – Hydraulic Overhaul' },
                    { value: 'SO-1003 – CNC Laser Calibration', label: 'SO-1003 – CNC Laser Calibration' },
                    { value: 'SO-1004 – Transformer Inspection', label: 'SO-1004 – Transformer Inspection' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Customer Name */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Customer Name</span>}
                name="customerName"
                required
                rules={[{ required: true, message: 'Please enter customer name' }]}
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  prefix={<Building size={14} color="#64748B" style={{ marginRight: 4 }} />}
                  placeholder="Enter customer name"
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>

            {/* Service Type */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Type</span>}
                name="serviceType"
                required
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<Wrench size={13} color="#64748B" />}
                  options={[
                    { value: 'AC Maintenance', label: 'AC Maintenance' },
                    { value: 'Machine Repair', label: 'Machine Repair' },
                    { value: 'Electrical Repair', label: 'Electrical Repair' },
                    { value: 'HVAC Service', label: 'HVAC Service' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Assigned Technician */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Assigned Technician</span>}
                name="assignedTechnician"
                required
                rules={[{ required: true, message: 'Please select technician' }]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<User size={13} color="#64748B" />}
                  options={[
                    { value: 'Deepak Varma', label: 'Deepak Varma' },
                    { value: 'Murugan Selvam', label: 'Murugan Selvam' },
                    { value: 'Rajesh Kannan', label: 'Rajesh Kannan' },
                    { value: 'Suresh Raina', label: 'Suresh Raina' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Service Date */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Date</span>}
                name="serviceDate"
                required
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  size="middle"
                  format="DD/MM/YYYY"
                  style={{ width: '100%', borderRadius: 6 }}
                  placeholder="Select service date"
                />
              </Form.Item>
            </Col>

            {/* Timing (Start Time & End Time) */}
            <Col xs={24} sm={12}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Start Time</span>}
                  name="startTime"
                  required
                  style={{ flex: 1, marginBottom: 10 }}
                >
                  <TimePicker
                    size="middle"
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%', borderRadius: 6 }}
                    placeholder="10:00 AM"
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>End Time</span>}
                  name="endTime"
                  style={{ flex: 1, marginBottom: 10 }}
                >
                  <TimePicker
                    size="middle"
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%', borderRadius: 6 }}
                    placeholder="12:00 PM"
                  />
                </Form.Item>
              </div>
            </Col>

            {/* Priority */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Priority</span>}
                name="priority"
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  options={[
                    {
                      value: 'High',
                      label: (
                        <span>
                          <span style={{ color: '#EF4444', marginRight: 6 }}>●</span> High
                        </span>
                      ),
                    },
                    {
                      value: 'Medium',
                      label: (
                        <span>
                          <span style={{ color: '#F59E0B', marginRight: 6 }}>●</span> Medium
                        </span>
                      ),
                    },
                    {
                      value: 'Low',
                      label: (
                        <span>
                          <span style={{ color: '#10B981', marginRight: 6 }}>●</span> Low
                        </span>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Operational Status */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Operational Status</span>}
                name="status"
                required
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  options={[
                    {
                      value: 'Scheduled',
                      label: (
                        <span style={{ color: '#15803D', fontWeight: 600 }}>
                          ● Scheduled
                        </span>
                      ),
                    },
                    {
                      value: 'In Progress',
                      label: (
                        <span style={{ color: '#2563EB', fontWeight: 600 }}>
                          ● In Progress
                        </span>
                      ),
                    },
                    {
                      value: 'Cancelled',
                      label: (
                        <span style={{ color: '#DC2626', fontWeight: 600 }}>
                          ● Cancelled
                        </span>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Service Location */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Location</span>}
                name="serviceLocation"
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  prefix={<MapPin size={14} color="#64748B" style={{ marginRight: 4 }} />}
                  placeholder="123, Industrial Area, Pondicherry"
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>

            {/* Remarks */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Remarks</span>}
                name="remarks"
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  placeholder="Check cooling issue and clean filters."
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Footer Action Buttons matching Screenshot ba453ecb.png */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <Button
              size="middle"
              onClick={() => setScheduleModalOpen(false)}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                color: '#334155',
                borderColor: '#E2E8F0',
                padding: '0 20px',
                height: 36,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              style={{
                backgroundColor: '#6E56CF',
                borderColor: '#6E56CF',
                borderRadius: 6,
                fontWeight: 600,
                padding: '0 20px',
                height: 36,
                boxShadow: '0 2px 10px rgba(110, 86, 207, 0.25)',
              }}
            >
              Submit & Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 4. Scheduled Services Container */}
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Title with List icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#181433' }}>
            <ListFilter size={18} color="#6E56CF" />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#181433' }}>
              Scheduled Services
            </span>
          </div>

          {/* Controls: Search, Filter, Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '6px 14px',
                width: 240,
                border: '1.5px solid #7C3AED',
              }}
            >
              <input
                type="text"
                placeholder="Search schedule..."
                value={searchSchedule}
                onChange={e => setSearchSchedule(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  width: '100%',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => message.info('Filter options')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <ListFilter size={13} color="#6E56CF" />
              <span>Filter</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => message.success('Exporting scheduled services to CSV/Excel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Download size={13} color="#10B981" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredSchedules}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="middle"
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
        />

        {/* Footer Bar matching screenshot: Showing entries + pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 18px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
          }}
        >
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Showing 1 to {filteredSchedules.length} of {filteredSchedules.length} entries
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              ‹
            </button>
            <button
              style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                border: 'none',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </Card>

      {/* View Detail Modal with Accept and Reject buttons */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} color="#0F172A" />
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              Service Schedule Details - {selectedRecord?.scheduleId}
            </span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={680}
        footer={[
          <Button
            key="reject"
            danger
            icon={<XCircle size={15} />}
            onClick={() => handleReject(selectedRecord)}
            style={{ fontWeight: 600, borderRadius: 6 }}
          >
            Reject / Cancel
          </Button>,
          <Button
            key="accept"
            type="primary"
            icon={<CheckCircle size={15} />}
            onClick={() => handleAccept(selectedRecord)}
            style={{
              backgroundColor: '#16A34A',
              borderColor: '#16A34A',
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            Accept Schedule
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div style={{ marginTop: 14 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Schedule ID">
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedRecord.scheduleId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Service Order">
                <span style={{ fontWeight: 600, color: '#2563EB' }}>{selectedRecord.serviceOrder}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name" span={2}>
                <span style={{ fontWeight: 600 }}>{selectedRecord.customerName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Service Type">
                {selectedRecord.serviceType}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned Technician">
                <Tag color="blue">{selectedRecord.technician}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Service Timing" span={2}>
                {selectedRecord.dateTime}
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedRecord.priority === 'High' ? 'red' : selectedRecord.priority === 'Medium' ? 'orange' : 'green'}>
                  {selectedRecord.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedRecord.status === 'Scheduled' ? 'green' : selectedRecord.status === 'In Progress' ? 'blue' : 'red'}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Service Location" span={2}>
                {selectedRecord.location}
              </Descriptions.Item>
              <Descriptions.Item label="Remarks" span={2}>
                {selectedRecord.remarks}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

// 4. Technicians
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
          <Star size={14} fill="#F59E0B" color="#F59E0B" /> {r}
        </span>
      ),
    },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Field Service Technicians & Engineers" subtitle="Roster, certifications, skill matrices, and live field availability." />
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 5. AMC Contracts
export const ServiceAmcPage: React.FC = () => {
  const [data] = useState<AMCContract[]>(MOCK_AMCS);
  const columns = [
    { title: 'Contract #', dataIndex: 'contractNumber', key: 'contractNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
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
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 6. Warranty Claims
export const ServiceWarrantyPage: React.FC = () => {
  const [data] = useState<WarrantyClaim[]>(MOCK_WARRANTIES);
  const columns = [
    { title: 'Claim #', dataIndex: 'claimNumber', key: 'claimNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
    { title: 'Product & Serial', key: 'product', render: (_: any, r: WarrantyClaim) => <div><div style={{ fontWeight: 600 }}>{r.productName}</div><div style={{ fontSize: 12, color: '#6B7280' }}>SN: {r.productSerial}</div></div> },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Defect Category', dataIndex: 'defectCategory', key: 'defectCategory' },
    { title: 'Claim Date', dataIndex: 'claimDate', key: 'claimDate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Warranty Claims Verification" subtitle="Validate manufacturer warranty coverage, RMA authorizations, and component defects." />
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 7. Spare Parts
export const ServiceSparesPage: React.FC = () => {
  const [data] = useState<SparePart[]>(MOCK_SPARES);
  const columns = [
    { title: 'Part #', dataIndex: 'partNumber', key: 'partNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
    { title: 'Part Name', dataIndex: 'name', key: 'name' },
    { title: 'Compatibility', dataIndex: 'compatibleWith', key: 'compatibleWith' },
    { title: 'Warehouse Bin', dataIndex: 'locationBin', key: 'locationBin' },
    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Stock on Hand', dataIndex: 'quantityOnHand', key: 'quantityOnHand', render: (q: number) => <span style={{ fontWeight: 600 }}>{q} Units</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Service Spare Parts Inventory" subtitle="Track parts consumed during service calls, van inventory, and replenishment." />
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 8. Service Billing
export const ServiceBillingPage: React.FC = () => {
  const [data] = useState<ServiceBilling[]>(MOCK_SERVICE_BILLING);
  const columns = [
    { title: 'Service Bill #', dataIndex: 'billNumber', key: 'billNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
    { title: 'Ticket Reference', dataIndex: 'ticketNumber', key: 'ticketNumber' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Labor Charge', dataIndex: 'laborCharge', key: 'laborCharge', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Parts Charge', dataIndex: 'partsCharge', key: 'partsCharge', render: (v: number) => `₹${v.toLocaleString()}` },
    { title: 'Total Bill (inc. Tax)', dataIndex: 'totalBill', key: 'totalBill', render: (v: number) => <span style={{ fontWeight: 700, color: '#059669' }}>₹${v.toLocaleString()}</span> },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (st: string) => <StatusBadge status={st} /> },
  ];
  return (
    <div>
      <PageHeader title="Field Service Invoicing & Billing" subtitle="Generate bills combining engineer labor, travel, and parts consumed." />
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 9. Feedback
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
      <Table dataSource={data} columns={columns} rowKey="id" bordered />
    </div>
  );
};

// 10. Service Reports
export const ServiceReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader title="Service Analytics & SLA Compliance Reports" subtitle="First-time fix rates, mean time to repair (MTTR), and technician utilization." />
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 8, border: '1px solid #E8E0F0' }}>
        <p style={{ margin: 0, color: '#5C526A' }}>Current Mean Time to Resolution: 4.2 hours with 92.6% First-Time Fix rate across all technicians.</p>
      </div>
    </div>
  );
};
