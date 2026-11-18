import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
import { Plus, Wrench, LifeBuoy, Calendar, HardHat, MapPin, FileCheck, ShieldAlert, Cpu, FileText, ThumbsUp, TrendingUp } from 'lucide-react';
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

// 1. Service Requests & Tickets
export const ServiceTicketsPage: React.FC = () => {
  const [data, setData] = useState<ServiceTicket[]>(MOCK_SERVICE_TICKETS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = data.filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()) || d.ticketNumber.toLowerCase().includes(search.toLowerCase()) || d.productOrAsset.toLowerCase().includes(search.toLowerCase()));

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
    { title: 'Ticket #', dataIndex: 'ticketNumber', key: 'ticketNumber', render: (t: string) => <span style={{ fontWeight: 600, color: '#059669' }}>{t}</span> },
    { title: 'Customer & Asset', dataIndex: 'customerName', key: 'customerName', render: (c: string, r: ServiceTicket) => <div><div style={{ fontWeight: 600 }}>{c}</div><div style={{ fontSize: 12, color: '#6B7280' }}>Asset: {r.productOrAsset}</div></div> },
    { title: 'Reported Issue', dataIndex: 'issueDescription', key: 'issueDescription', ellipsis: true },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <StatusBadge status={p} /> },
    { title: 'Assigned Tech', dataIndex: 'assignedTechnician', key: 'assignedTechnician', render: (t: string) => <Tag color="green">{t}</Tag> },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', render: (st: string) => <StatusBadge status={st} /> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: ServiceTicket) => (
        <Button
          type="link"
          size="small"
          style={{ padding: 0, fontWeight: 500, color: '#1677ff' }}
          onClick={() => message.info(`Viewing details for Ticket ${r.ticketNumber}`)}
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
      <Table dataSource={filtered} columns={columns} rowKey="id" bordered />
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
  return (
    <div>
      <PageHeader title="Service Scheduling & Dispatch Calendar" subtitle="Coordinate engineer rosters, field routes, and scheduled visits." />
      <div style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 8, border: '1px solid #E8E0F0' }}>
        <p style={{ margin: 0, color: '#5C526A' }}>Roster matrix loaded: 14 technicians scheduled for on-site client inspections today.</p>
      </div>
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
    { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (r: number) => <span style={{ fontWeight: 700, color: '#F59E0B' }}>⭐ {r}</span> },
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
