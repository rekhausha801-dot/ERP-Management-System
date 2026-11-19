import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Form,
  Tag,
  Upload,
  message,
  Modal,
  Table,
  Descriptions,
  Space,
  Badge,
  Tabs,
  Timeline,
  Alert,
  Tooltip,
} from 'antd';
import {
  PhoneCall,
  Headphones,
  Calendar,
  Clock,
  Layers,
  Building,
  User,
  Phone,
  Wrench,
  AlertCircle,
  FileText,
  MapPin,
  UploadCloud,
  RotateCcw,
  Send,
  Monitor,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  List,
  Eye,
  Plus,
  ShieldCheck,
  Check,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getStoredServiceRequests,
  updateServiceRequestStatus,
  createServiceRequest,
  ServiceRequestRecord,
  ServiceRequestStatus,
} from '../../services/serviceWorkflowStorage';

export const CustomerServiceRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [adminActionForm] = Form.useForm();
  
  // Data State
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'intake'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestRecord | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'RequestInfo'>('Approve');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadRequests = () => {
    setRequests(getStoredServiceRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('storage', loadRequests);
    return () => window.removeEventListener('storage', loadRequests);
  }, []);

  const adminName = user?.name || 'Service Admin';

  const pendingRequests = requests.filter(
    (r) => r.status === 'Pending Approval' || r.status === 'Submitted'
  );

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.requestNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      (r.companyName && r.companyName.toLowerCase().includes(searchText.toLowerCase())) ||
      r.serviceType.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdminDecision = (values: any) => {
    if (!selectedRequest) return;

    if (actionType === 'Approve') {
      const ticketNum = `TCK-2026-${Math.floor(700 + Math.random() * 200)}`;
      updateServiceRequestStatus(selectedRequest.id, 'Approved', {
        actor: adminName,
        comments: values.adminComments || 'Service Request Approved for Execution.',
        technician: values.technician || 'Murugan Selvam',
        ticketId: ticketNum,
      });
      message.success(
        `Service Request ${selectedRequest.requestNumber} APPROVED! Unique Ticket ${ticketNum} generated and assigned to ${values.technician || 'Murugan Selvam'}.`
      );
    } else if (actionType === 'Reject') {
      updateServiceRequestStatus(selectedRequest.id, 'Rejected', {
        actor: adminName,
        comments: values.adminComments || 'Request rejected based on administrative validation.',
      });
      message.error(`Service Request ${selectedRequest.requestNumber} REJECTED.`);
    } else if (actionType === 'RequestInfo') {
      updateServiceRequestStatus(selectedRequest.id, 'More Information Required', {
        actor: adminName,
        comments: values.adminComments || 'Please provide additional machine specs and error code details.',
      });
      message.warning(`Request for more information sent back to Office Staff.`);
    }

    setReviewModalOpen(false);
    adminActionForm.resetFields();
    loadRequests();
  };

  const handleCreateNewCallRequest = (values: any) => {
    const created = createServiceRequest({
      customerName: values.customerName,
      contactNumber: values.contactNumber,
      companyName: values.companyName || undefined,
      serviceType: values.serviceType,
      serviceLocation: values.serviceLocation,
      requestDescription: values.requestDescription,
      priority: values.priority || 'Medium',
      requestSource: 'Phone Call',
      submittedBy: adminName,
      submittedByRole: 'service_admin',
      requestDate: new Date().toLocaleString(),
    });
    message.success(`Service request ${created.requestNumber} logged and placed in approval queue!`);
    form.resetFields();
    loadRequests();
    setActiveTab('pending');
  };

  const getStatusBadge = (st: ServiceRequestStatus) => {
    switch (st) {
      case 'Draft':
        return <Tag color="default">Draft</Tag>;
      case 'Submitted':
      case 'Pending Approval':
        return (
          <Tag color="orange" style={{ fontWeight: 700 }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            Pending Approval
          </Tag>
        );
      case 'Approved':
        return (
          <Tag color="green" style={{ fontWeight: 700 }}>
            <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} />
            Approved
          </Tag>
        );
      case 'Rejected':
        return (
          <Tag color="red" style={{ fontWeight: 600 }}>
            <XCircle size={12} style={{ display: 'inline', marginRight: 4 }} />
            Rejected
          </Tag>
        );
      case 'More Information Required':
        return (
          <Tag color="purple" style={{ fontWeight: 600 }}>
            <AlertCircle size={12} style={{ display: 'inline', marginRight: 4 }} />
            More Info Required
          </Tag>
        );
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'requestNumber',
      key: 'requestNumber',
      width: 130,
      render: (t: string) => <strong style={{ color: '#6E56CF', fontSize: 13 }}>{t}</strong>,
    },
    {
      title: 'Customer & Contact',
      key: 'customer',
      render: (_: any, r: ServiceRequestRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#181433' }}>{r.customerName}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>
            <PhoneCall size={11} style={{ display: 'inline', marginRight: 4 }} />
            {r.contactNumber}
            {r.companyName && ` • ${r.companyName}`}
          </div>
        </div>
      ),
    },
    {
      title: 'Service Type & Location',
      key: 'service',
      render: (_: any, r: ServiceRequestRecord) => (
        <div>
          <Tag color="blue">{r.serviceType}</Tag>
          <div style={{ fontSize: 11, color: '#8C89A0', marginTop: 2 }}>
            <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
            {r.serviceLocation}
          </div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (p: string) => {
        const color = p === 'Urgent' ? 'red' : p === 'High' ? 'orange' : p === 'Medium' ? 'blue' : 'default';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Submitted By',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
      render: (s: string) => (
        <span style={{ fontSize: 12, color: '#475569' }}>
          <User size={11} style={{ display: 'inline', marginRight: 4 }} />
          {s}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (st: ServiceRequestStatus) => getStatusBadge(st),
    },
    {
      title: 'Action',
      key: 'action',
      width: 130,
      render: (_: any, r: ServiceRequestRecord) => (
        <Space>
          <Button
            type="primary"
            size="small"
            style={{
              backgroundColor: r.status === 'Pending Approval' ? '#6E56CF' : '#0F172A',
              borderColor: r.status === 'Pending Approval' ? '#6E56CF' : '#0F172A',
              borderRadius: 6,
              fontWeight: 600,
            }}
            onClick={() => {
              setSelectedRequest(r);
              adminActionForm.resetFields();
              setActionType('Approve');
              setReviewModalOpen(true);
            }}
          >
            {r.status === 'Pending Approval' ? 'Review & Approve' : 'View Details'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* 1. Header Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.15)',
            }}
          >
            <Headphones size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F172A' }}>
                Service Request Intake & Approval Center
              </h1>
              <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 10 }}>
                ADMIN WORKFLOW
              </Tag>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
              Review inbound customer phone requests submitted by Office Staff, approve, reject, request information, and dispatch tickets to field technicians.
            </p>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              borderColor: '#7C3AED',
              borderRadius: 10,
              fontWeight: 600,
            }}
            onClick={() => setActiveTab('intake')}
          >
            Log Phone Request Directly
          </Button>
          <Button icon={<RefreshCw size={14} />} onClick={loadRequests}>
            Refresh Queue
          </Button>
        </Space>
      </div>

      {/* 2. Top Summary KPI Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: '#8C89A0', marginBottom: 4 }}>Pending Approval Queue</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={20} />
              {pendingRequests.length}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: '#8C89A0', marginBottom: 4 }}>Approved & Dispatched</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={20} />
              {requests.filter((r) => r.status === 'Approved').length}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: '#8C89A0', marginBottom: 4 }}>Info Queries to Staff</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#6E56CF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={20} />
              {requests.filter((r) => r.status === 'More Information Required').length}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: '#8C89A0', marginBottom: 4 }}>Total Intake History</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#181433', display: 'flex', alignItems: 'center', gap: 8 }}>
              <PhoneCall size={20} />
              {requests.length}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. Main Action Tabs */}
      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={(k: any) => setActiveTab(k)}
          items={[
            {
              key: 'pending',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Pending Approvals Queue
                  {pendingRequests.length > 0 && (
                    <Badge count={pendingRequests.length} style={{ marginLeft: 8, backgroundColor: '#F59E0B' }} />
                  )}
                </span>
              ),
            },
            {
              key: 'all',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <List size={14} style={{ display: 'inline', marginRight: 6 }} />
                  All Intake Requests & Ticket History ({requests.length})
                </span>
              ),
            },
            {
              key: 'intake',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <Plus size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Direct Phone Call Intake Form
                </span>
              ),
            },
          ]}
        />

        {/* TAB 1: PENDING APPROVAL QUEUE */}
        {activeTab === 'pending' && (
          <div style={{ paddingTop: 12 }}>
            {pendingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle size={48} color="#10B981" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#181433' }}>
                  All Service Requests Cleared!
                </div>
                <div style={{ fontSize: 13, color: '#8C89A0', marginTop: 4 }}>
                  No pending requests waiting for admin review right now.
                </div>
              </div>
            ) : (
              <>
                <Alert
                  type="warning"
                  showIcon
                  message={
                    <span style={{ fontWeight: 700 }}>
                      {pendingRequests.length} Service Request(s) Awaiting Admin Decision
                    </span>
                  }
                  description="Review customer problem statements, determine warranty or AMC contract coverage, and click 'Review & Approve' to generate unique service tickets and assign technicians."
                  style={{ marginBottom: 16, borderRadius: 8 }}
                />
                <Table
                  dataSource={pendingRequests}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                />
              </>
            )}
          </div>
        )}

        {/* TAB 2: ALL REQUESTS */}
        {activeTab === 'all' && (
          <div style={{ paddingTop: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <Space wrap>
                <Input
                  prefix={<Search size={14} color="#8C89A0" />}
                  placeholder="Search by ID, customer, company..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 280 }}
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 180 }}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'Pending Approval', label: 'Pending Approval' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'More Information Required', label: 'More Information Required' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                />
              </Space>
              <span style={{ fontSize: 13, color: '#64748B' }}>
                Showing {filteredRequests.length} of {requests.length} records
              </span>
            </div>
            <Table
              dataSource={filteredRequests}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8, showSizeChanger: true }}
            />
          </div>
        )}

        {/* TAB 3: DIRECT CALL INTAKE FORM */}
        {activeTab === 'intake' && (
          <div style={{ maxWidth: 840, margin: '16px auto', padding: '0 8px' }}>
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <PhoneCall size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1E3A8A', fontSize: 14 }}>
                  Fast-Track Admin Phone Intake
                </div>
                <div style={{ fontSize: 12, color: '#3B82F6' }}>
                  Record direct customer calls and immediately process them into the service dispatch queue.
                </div>
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateNewCallRequest}
              initialValues={{
                priority: 'Medium',
                serviceType: 'Breakdown Repair',
                requestSource: 'Phone Call',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Customer Name</span>}
                    name="customerName"
                    rules={[{ required: true, message: 'Please enter customer name' }]}
                  >
                    <Input placeholder="e.g. Ramesh Krishnan" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Contact Number</span>}
                    name="contactNumber"
                    rules={[{ required: true, message: 'Please enter telephone / mobile' }]}
                  >
                    <Input placeholder="+91 98402 77889" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Company Name (Optional)</span>} name="companyName">
                    <Input placeholder="e.g. Brakes & Clutch Engineering" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Service Type</span>}
                    name="serviceType"
                    rules={[{ required: true }]}
                  >
                    <Select size="large">
                      <Select.Option value="Breakdown Repair">Breakdown Repair</Select.Option>
                      <Select.Option value="Quarterly Maintenance (AMC)">Quarterly Maintenance (AMC)</Select.Option>
                      <Select.Option value="Installation & Commissioning">Installation & Commissioning</Select.Option>
                      <Select.Option value="Warranty Claim">Warranty Claim</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Service Location</span>}
                name="serviceLocation"
                rules={[{ required: true }]}
              >
                <Input placeholder="Site address, industrial corridor, city" size="large" />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Request Description</span>}
                name="requestDescription"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} placeholder="Fault symptoms reported by customer during call..." />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Priority</span>} name="priority">
                    <Select size="large">
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                      <Select.Option value="Urgent">Urgent</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Request Source</span>} name="requestSource">
                    <Input disabled prefix={<PhoneCall size={14} color="#6E56CF" />} value="Phone Call" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <Button size="large" onClick={() => form.resetFields()}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<Send size={15} />}
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                    borderColor: '#7C3AED',
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                >
                  Save and Add to Approval Queue
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Card>

      {/* Admin Review & Decision Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#181433' }}>
              Service Request Review & Approval Decision
            </span>
            {selectedRequest && <Tag color="purple">{selectedRequest.requestNumber}</Tag>}
          </div>
        }
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        footer={null}
        width={760}
      >
        {selectedRequest && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 13, color: '#64748B' }}>Current Status: </span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              {selectedRequest.generatedTicketId && (
                <Tag color="cyan" style={{ fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
                  Service Ticket: {selectedRequest.generatedTicketId}
                </Tag>
              )}
            </div>

            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Customer Name">{selectedRequest.customerName}</Descriptions.Item>
              <Descriptions.Item label="Contact Number">{selectedRequest.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="Company">{selectedRequest.companyName || 'Individual'}</Descriptions.Item>
              <Descriptions.Item label="Service Type">{selectedRequest.serviceType}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedRequest.priority === 'Urgent' ? 'red' : 'blue'}>{selectedRequest.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Request Source">{selectedRequest.requestSource}</Descriptions.Item>
              <Descriptions.Item label="Service Location" span={2}>{selectedRequest.serviceLocation}</Descriptions.Item>
              <Descriptions.Item label="Customer Complaint / Description" span={2}>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{selectedRequest.requestDescription}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted By">{selectedRequest.submittedBy}</Descriptions.Item>
              <Descriptions.Item label="Intake Date">{selectedRequest.requestDate}</Descriptions.Item>
            </Descriptions>

            {/* Admin Decision Form */}
            <Card
              style={{
                backgroundColor: '#FAF8FD',
                border: '1px solid #ECE8F6',
                borderRadius: 12,
                marginBottom: 16,
              }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#181433', marginBottom: 12 }}>
                Admin Decision Action
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <Button
                  type={actionType === 'Approve' ? 'primary' : 'default'}
                  icon={<CheckCircle size={15} />}
                  onClick={() => setActionType('Approve')}
                  style={{
                    backgroundColor: actionType === 'Approve' ? '#10B981' : undefined,
                    borderColor: actionType === 'Approve' ? '#10B981' : undefined,
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Approve Request (Generate Ticket)
                </Button>
                <Button
                  type={actionType === 'RequestInfo' ? 'primary' : 'default'}
                  icon={<HelpCircle size={15} />}
                  onClick={() => setActionType('RequestInfo')}
                  style={{
                    backgroundColor: actionType === 'RequestInfo' ? '#6E56CF' : undefined,
                    borderColor: actionType === 'RequestInfo' ? '#6E56CF' : undefined,
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Request More Information
                </Button>
                <Button
                  type={actionType === 'Reject' ? 'primary' : 'default'}
                  danger
                  icon={<XCircle size={15} />}
                  onClick={() => setActionType('Reject')}
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  Reject Request
                </Button>
              </div>

              <Form form={adminActionForm} layout="vertical" onFinish={handleAdminDecision}>
                {actionType === 'Approve' && (
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600 }}>
                        Assign Field Technician <span style={{ color: '#EF4444' }}>*</span>
                      </span>
                    }
                    name="technician"
                    initialValue="Murugan Selvam"
                    rules={[{ required: true, message: 'Please assign a technician' }]}
                  >
                    <Select size="large">
                      <Select.Option value="Murugan Selvam">Murugan Selvam (Lead Field Engineer - CNC & Drives)</Select.Option>
                      <Select.Option value="Rajesh Kannan">Rajesh Kannan (Senior Tech - Transformers & Switchgear)</Select.Option>
                      <Select.Option value="Deepak Varma">Deepak Varma (Specialist - HVAC & Hydraulics)</Select.Option>
                      <Select.Option value="Dinesh V.">Dinesh V. (Hydraulics & Mechanical Dispatch)</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  label={
                    <span style={{ fontWeight: 600 }}>
                      Admin Comments / Reason {actionType !== 'Approve' && <span style={{ color: '#EF4444' }}>*</span>}
                    </span>
                  }
                  name="adminComments"
                  rules={[{ required: actionType !== 'Approve', message: 'Please enter admin comments or reason' }]}
                  initialValue={
                    actionType === 'Approve'
                      ? 'Approved for on-site execution. Priority technician assigned.'
                      : actionType === 'RequestInfo'
                      ? 'Please verify machine serial number, error codes, and operational breaker details.'
                      : 'Request rejected: Equipment is out of warranty period and client has no active AMC contract.'
                  }
                >
                  <Input.TextArea rows={2} placeholder="Add comments visible in tracking audit..." />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                  <Button onClick={() => setReviewModalOpen(false)}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: actionType === 'Approve' ? '#10B981' : actionType === 'Reject' ? '#EF4444' : '#6E56CF',
                      borderColor: actionType === 'Approve' ? '#10B981' : actionType === 'Reject' ? '#EF4444' : '#6E56CF',
                      borderRadius: 8,
                      fontWeight: 700,
                      padding: '0 20px',
                    }}
                  >
                    {actionType === 'Approve'
                      ? 'Confirm Approval & Generate Ticket'
                      : actionType === 'Reject'
                      ? 'Confirm Rejection'
                      : 'Send Info Query to Staff'}
                  </Button>
                </div>
              </Form>
            </Card>

            {/* Complete Audit Timeline */}
            <div style={{ fontWeight: 700, fontSize: 13, color: '#181433', marginBottom: 10 }}>
              Request & Approval History
            </div>
            <Timeline
              items={selectedRequest.timeline.map((item) => ({
                color: item.status === 'Approved' ? 'green' : item.status === 'Rejected' ? 'red' : 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#181433' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                      {item.timestamp} &bull; Actor: <strong>{item.actor}</strong>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerServiceRequestsPage;
