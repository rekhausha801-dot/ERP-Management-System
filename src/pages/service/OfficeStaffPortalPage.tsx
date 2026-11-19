import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Tag,
  Space,
  Form,
  Input,
  Select,
  Typography,
  Tabs,
  Badge,
  Descriptions,
  Modal,
  Timeline,
  Alert,
  Tooltip,
  Upload,
  message,
} from 'antd';
import {
  PhoneCall,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  User,
  MapPin,
  Calendar,
  Send,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Layers,
  UploadCloud,
  Check,
  RotateCcw,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getStoredServiceRequests,
  createServiceRequest,
  updateServiceRequestStatus,
  ServiceRequestRecord,
  ServiceRequestStatus,
} from '../../services/serviceWorkflowStorage';

const { Title, Text, Paragraph } = Typography;

export const OfficeStaffPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'my-requests' | 'tracking'>('dashboard');
  const [selectedReq, setSelectedReq] = useState<ServiceRequestRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setRequests(getStoredServiceRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const staffName = user?.name || 'Kavitha S. (Office Staff)';

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.requestNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      (r.companyName && r.companyName.toLowerCase().includes(searchText.toLowerCase())) ||
      r.serviceType.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = (values: any, isDraft = false) => {
    setSubmitting(true);
    setTimeout(() => {
      const created = createServiceRequest({
        customerName: values.customerName,
        contactNumber: values.contactNumber,
        companyName: values.companyName || undefined,
        serviceType: values.serviceType,
        serviceLocation: values.serviceLocation,
        requestDescription: values.requestDescription,
        priority: values.priority || 'Medium',
        requestSource: 'Phone Call',
        attachments: values.attachments ? ['customer_call_notes.pdf'] : undefined,
        submittedBy: staffName,
        submittedByRole: user?.role || 'office_staff',
        requestDate: new Date().toLocaleString(),
        isDraft,
      });

      setSubmitting(false);
      form.resetFields();
      loadData();
      if (isDraft) {
        message.info(`Draft ${created.requestNumber} saved successfully.`);
      } else {
        message.success(`Service Request ${created.requestNumber} submitted to Admin for approval!`);
      }
      setActiveTab('my-requests');
    }, 400);
  };

  const getStatusBadge = (st: ServiceRequestStatus) => {
    switch (st) {
      case 'Draft':
        return <Tag color="default">Draft</Tag>;
      case 'Submitted':
      case 'Pending Approval':
        return (
          <Tag color="orange" style={{ fontWeight: 600 }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            Pending Approval
          </Tag>
        );
      case 'Approved':
        return (
          <Tag color="#4C1D95" style={{ backgroundColor: '#F3E8FF', borderColor: '#DDD6FE', color: '#4C1D95', fontWeight: 700 }}>
            <CheckCircle size={12} style={{ display: 'inline', marginRight: 4, color: '#4C1D95' }} />
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
            Info Required
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
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 160,
      render: (d: string) => <span style={{ fontSize: 12, color: '#64748B' }}>{d}</span>,
    },
    {
      title: 'Approval Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (st: ServiceRequestStatus) => getStatusBadge(st),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, r: ServiceRequestRecord) => (
        <Button
          size="small"
          type="link"
          icon={<Eye size={14} />}
          onClick={() => {
            setSelectedReq(r);
            setDetailModalOpen(true);
          }}
          style={{ fontWeight: 600, color: '#6E56CF' }}
        >
          Track
        </Button>
      ),
    },
  ];

  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending Approval' || r.status === 'Submitted').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const infoReqCount = requests.filter((r) => r.status === 'More Information Required').length;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* 1. Header Banner */}
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
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.25)',
            }}
          >
            <PhoneCall size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#181433' }}>
                Office Staff Service Desk Portal
              </h1>
              <Tag color="purple" style={{ fontWeight: 700, borderRadius: 10 }}>
                CALL INTAKE & WORKFLOW
              </Tag>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
              Attend customer service phone calls, record detailed complaints, and submit directly to Admin for ticket dispatch.
            </p>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<Plus size={15} />}
            onClick={() => setActiveTab('create')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              borderColor: '#7C3AED',
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Log New Call Request
          </Button>
          <Button icon={<RefreshCw size={14} />} onClick={loadData}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* 2. Top Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <Statistic
              title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Total Call Requests</span>}
              value={totalCount}
              prefix={<PhoneCall size={16} color="#6E56CF" style={{ marginRight: 6 }} />}
              valueStyle={{ fontWeight: 800, color: '#181433' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <Statistic
              title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Pending Admin Review</span>}
              value={pendingCount}
              prefix={<Clock size={16} color="#F59E0B" style={{ marginRight: 6 }} />}
              valueStyle={{ fontWeight: 800, color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <Statistic
              title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Approved & Tickets Created</span>}
              value={approvedCount}
              prefix={<CheckCircle size={16} color="#4C1D95" style={{ marginRight: 6 }} />}
              valueStyle={{ fontWeight: 800, color: '#4C1D95' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 14 }}>
            <Statistic
              title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Needs More Info</span>}
              value={infoReqCount}
              prefix={<AlertCircle size={16} color="#7C3AED" style={{ marginRight: 6 }} />}
              valueStyle={{ fontWeight: 800, color: '#7C3AED' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 3. Main Navigation Card with 4 Distinct Portal Views */}
      <Card bordered={false} style={{ borderRadius: 14 }}>
        <Tabs
          activeKey={activeTab}
          onChange={(k: any) => setActiveTab(k)}
          items={[
            {
              key: 'dashboard',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <Layers size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Dashboard Overview
                </span>
              ),
            },
            {
              key: 'create',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <Plus size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Create Service Request (Call Intake)
                </span>
              ),
            },
            {
              key: 'my-requests',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
                  My Submitted Requests ({requests.length})
                </span>
              ),
            },
            {
              key: 'tracking',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Request Status Tracking & Timeline
                </span>
              ),
            },
          ]}
        />

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div style={{ paddingTop: 12 }}>
            <Alert
              type="info"
              showIcon
              message={
                <span style={{ fontWeight: 700, color: '#1E40AF' }}>
                  Restricted Office Staff Mode: You have dedicated access only to Call Intake, Status Tracking, and Submission.
                </span>
              }
              description="Administrative dashboards, financial books, payroll, employee records, and system settings are restricted per role security policies."
              style={{ marginBottom: 20, borderRadius: 10 }}
            />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 15, color: '#181433' }}>
                    Recent Intake Submissions
                  </Text>
                  <Button type="link" onClick={() => setActiveTab('my-requests')}>
                    View All &rarr;
                  </Button>
                </div>
                <Table
                  dataSource={requests.slice(0, 5)}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Col>
              <Col xs={24} md={8}>
                <Card
                  style={{
                    backgroundColor: '#FBF9FE',
                    border: '1px solid #ECE8F6',
                    borderRadius: 12,
                  }}
                  styles={{ body: { padding: 18 } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <ShieldCheck size={18} color="#6E56CF" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#181433' }}>
                      Operating Guidelines
                    </span>
                  </div>
                  <Timeline
                    items={[
                      {
                        color: 'blue',
                        children: (
                          <div style={{ fontSize: 12 }}>
                            <strong>1. Greet Customer:</strong> Verify phone number & service location.
                          </div>
                        ),
                      },
                      {
                        color: 'orange',
                        children: (
                          <div style={{ fontSize: 12 }}>
                            <strong>2. Accurately Record Symptoms:</strong> Mention machine model, error codes, and urgency.
                          </div>
                        ),
                      },
                      {
                        color: 'purple',
                        children: (
                          <div style={{ fontSize: 12 }}>
                            <strong>3. Submit for Approval:</strong> Admin validates warranty/AMC & assigns technician.
                          </div>
                        ),
                      },
                      {
                        color: '#4C1D95',
                        children: (
                          <div style={{ fontSize: 12 }}>
                            <strong>4. Ticket Generation:</strong> Unique Service Ticket generated upon approval automatically.
                          </div>
                        ),
                      },
                    ]}
                  />
                  <Button
                    type="primary"
                    block
                    icon={<Plus size={15} />}
                    style={{ backgroundColor: '#6E56CF', borderRadius: 8, marginTop: 8 }}
                    onClick={() => setActiveTab('create')}
                  >
                    Open New Intake Form
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* TAB 2: CREATE SERVICE REQUEST FORM */}
        {activeTab === 'create' && (
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
                  Inbound Customer Service Intake Form
                </div>
                <div style={{ fontSize: 12, color: '#3B82F6' }}>
                  Source is pre-configured to <strong>Phone Call</strong>. Submissions route immediately into Admin Approval Queue.
                </div>
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => handleCreateRequest(values, false)}
              initialValues={{
                priority: 'Medium',
                serviceType: 'Breakdown Repair',
                requestSource: 'Phone Call',
                submittedBy: staffName,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Customer Name</span>}
                    name="customerName"
                    rules={[{ required: true, message: 'Please enter customer name' }]}
                  >
                    <Input placeholder="e.g. K. Senthil Nathan" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Contact Number</span>}
                    name="contactNumber"
                    rules={[{ required: true, message: 'Please enter telephone / mobile number' }]}
                  >
                    <Input placeholder="+91 98401 55667" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Company / Organization Name (Optional)</span>} name="companyName">
                    <Input placeholder="e.g. Apex Precision Engineering Ltd" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>Service Type</span>}
                    name="serviceType"
                    rules={[{ required: true, message: 'Select service type' }]}
                  >
                    <Select size="large">
                      <Select.Option value="Breakdown Repair">Breakdown Repair (Emergency)</Select.Option>
                      <Select.Option value="Quarterly Maintenance (AMC)">Quarterly Maintenance (AMC)</Select.Option>
                      <Select.Option value="Installation & Commissioning">Installation & Commissioning</Select.Option>
                      <Select.Option value="Electrical Inspection">Electrical Inspection</Select.Option>
                      <Select.Option value="Warranty Claim">Warranty Claim</Select.Option>
                      <Select.Option value="Software / Controller Support">Software / Controller Support</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Service Location / Site Address</span>}
                name="serviceLocation"
                rules={[{ required: true, message: 'Please enter service location address' }]}
              >
                <Input placeholder="e.g. Plot 45, Ambattur Industrial Estate, Chennai - 600058" size="large" />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Request Description / Customer Fault Statement</span>}
                name="requestDescription"
                rules={[{ required: true, message: 'Please provide full issue description' }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Record customer's exact verbal problem description, symptoms, machine noise, tripping times..."
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Priority</span>} name="priority">
                    <Select size="large">
                      <Select.Option value="Low">Low (Scheduled visit)</Select.Option>
                      <Select.Option value="Medium">Medium (Standard 24-hr SLA)</Select.Option>
                      <Select.Option value="High">High (Production impact)</Select.Option>
                      <Select.Option value="Urgent">Urgent (Plant stopped)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Request Source</span>} name="requestSource">
                    <Input disabled prefix={<PhoneCall size={14} color="#6E56CF" />} value="Phone Call" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>Submitted By</span>} name="submittedBy">
                    <Input disabled prefix={<User size={14} color="#6E56CF" />} value={staffName} size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span style={{ fontWeight: 600 }}>Attachments (Optional)</span>} name="attachments">
                <Upload
                  beforeUpload={() => {
                    message.success('Attachment queued with intake submission');
                    return false;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadCloud size={15} />}>Upload Reference File / Call Notes (PDF, JPG)</Button>
                </Upload>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <Button
                  size="large"
                  icon={<RotateCcw size={15} />}
                  onClick={() => form.resetFields()}
                >
                  Clear Form
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    form.validateFields().then((vals) => handleCreateRequest(vals, true));
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<Send size={15} />}
                  loading={submitting}
                  htmlType="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                    borderColor: '#7C3AED',
                    borderRadius: 10,
                    fontWeight: 700,
                    padding: '0 24px',
                  }}
                >
                  Submit to Admin for Approval
                </Button>
              </div>
            </Form>
          </div>
        )}

        {/* TAB 3: MY SUBMITTED REQUESTS */}
        {activeTab === 'my-requests' && (
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
                    { value: 'Draft', label: 'Draft' },
                  ]}
                />
              </Space>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Showing {filteredRequests.length} of {requests.length} requests
              </Text>
            </div>

            <Table
              dataSource={filteredRequests}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8, showSizeChanger: true }}
            />
          </div>
        )}

        {/* TAB 4: REQUEST STATUS TRACKING */}
        {activeTab === 'tracking' && (
          <div style={{ paddingTop: 12 }}>
            <Alert
              message="Live Lifecycle Tracker"
              description="Click on any request to view its real-time approval status, admin comments, ticket generation, and technician assignment status."
              type="info"
              showIcon
              style={{ marginBottom: 16, borderRadius: 10 }}
            />
            <Table
              dataSource={filteredRequests}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </div>
        )}
      </Card>

      {/* Detail & Tracking Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#181433' }}>
              Service Request Details & Lifecycle
            </span>
            {selectedReq && <Tag color="purple">{selectedReq.requestNumber}</Tag>}
          </div>
        }
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={720}
      >
        {selectedReq && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, color: '#8C89A0' }}>Current State: </span>
                {getStatusBadge(selectedReq.status)}
              </div>
              {selectedReq.generatedTicketId && (
                <Tag color="cyan" style={{ fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>
                  Service Ticket: {selectedReq.generatedTicketId}
                </Tag>
              )}
            </div>

            {selectedReq.adminComments && (
              <Alert
                message="Admin Feedback / Instructions"
                description={selectedReq.adminComments}
                type={selectedReq.status === 'Approved' ? 'success' : selectedReq.status === 'Rejected' ? 'error' : 'warning'}
                showIcon
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}

            <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Customer Name">{selectedReq.customerName}</Descriptions.Item>
              <Descriptions.Item label="Contact Number">{selectedReq.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="Company">{selectedReq.companyName || 'Individual'}</Descriptions.Item>
              <Descriptions.Item label="Service Type">{selectedReq.serviceType}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedReq.priority === 'Urgent' ? 'red' : 'blue'}>{selectedReq.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Request Source">{selectedReq.requestSource}</Descriptions.Item>
              <Descriptions.Item label="Service Location" span={2}>{selectedReq.serviceLocation}</Descriptions.Item>
              <Descriptions.Item label="Request Description" span={2}>{selectedReq.requestDescription}</Descriptions.Item>
              <Descriptions.Item label="Submitted By">{selectedReq.submittedBy}</Descriptions.Item>
              <Descriptions.Item label="Request Date">{selectedReq.requestDate}</Descriptions.Item>
              {selectedReq.assignedTechnician && (
                <Descriptions.Item label="Assigned Technician" span={2}>
                  <Tag color="#4C1D95" style={{ backgroundColor: '#F3E8FF', borderColor: '#DDD6FE', color: '#4C1D95', fontWeight: 600 }}>{selectedReq.assignedTechnician}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ fontWeight: 700, fontSize: 14, color: '#181433', marginBottom: 12 }}>
              Approval & Audit Timeline
            </div>
            <Timeline
              items={selectedReq.timeline.map((item) => ({
                color: item.status === 'Approved' ? '#4C1D95' : item.status === 'Rejected' ? 'red' : 'blue',
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

export default OfficeStaffPortalPage;
