import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Descriptions,
  message,
  Dropdown,
  Tooltip,
} from 'antd';
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Plus,
  Eye,
  Edit,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Calendar,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components';

interface ServiceQuotation {
  key: string;
  quotationNo: string;
  quotationType: 'Providing' | 'Purchasing';
  customerName: string;
  serviceCategory: string;
  serviceType: string;
  quotationDate: string;
  validUntil: string;
  totalAmount: string;
  rawAmount: number;
  status: 'Sent' | 'Approved' | 'Draft' | 'Rejected' | 'Expired';
}

const INITIAL_QUOTATIONS: ServiceQuotation[] = [
  {
    key: '1',
    quotationNo: 'SQ-2026-001',
    quotationType: 'Providing',
    customerName: 'Apex Precision Tools',
    serviceCategory: 'Mechanical',
    serviceType: 'Machine Repair',
    quotationDate: '18-11-2026',
    validUntil: '30-11-2026',
    totalAmount: '₹15,000',
    rawAmount: 15000,
    status: 'Sent',
  },
  {
    key: '2',
    quotationNo: 'SQ-2026-002',
    quotationType: 'Purchasing',
    customerName: 'ABC Industries',
    serviceCategory: 'IT Services',
    serviceType: 'IT Maintenance',
    quotationDate: '17-11-2026',
    validUntil: '29-11-2026',
    totalAmount: '₹8,500',
    rawAmount: 8500,
    status: 'Approved',
  },
  {
    key: '3',
    quotationNo: 'SQ-2026-003',
    quotationType: 'Providing',
    customerName: 'Sri Traders',
    serviceCategory: 'Electrical',
    serviceType: 'Installation',
    quotationDate: '16-11-2026',
    validUntil: '28-11-2026',
    totalAmount: '₹12,000',
    rawAmount: 12000,
    status: 'Draft',
  },
  {
    key: '4',
    quotationNo: 'SQ-2026-004',
    quotationType: 'Purchasing',
    customerName: 'Global Tech Solutions',
    serviceCategory: 'Facility Management',
    serviceType: 'Office Maintenance',
    quotationDate: '15-11-2026',
    validUntil: '27-11-2026',
    totalAmount: '₹5,000',
    rawAmount: 5000,
    status: 'Rejected',
  },
  {
    key: '5',
    quotationNo: 'SQ-2026-005',
    quotationType: 'Providing',
    customerName: 'Southern Automations',
    serviceCategory: 'Mechanical',
    serviceType: 'Hydraulic Overhaul',
    quotationDate: '10-11-2026',
    validUntil: '20-11-2026',
    totalAmount: '₹42,000',
    rawAmount: 42000,
    status: 'Approved',
  },
  {
    key: '6',
    quotationNo: 'SQ-2026-006',
    quotationType: 'Providing',
    customerName: 'Metro Rail Workshop',
    serviceCategory: 'Electrical',
    serviceType: 'Substation Servicing',
    quotationDate: '01-11-2026',
    validUntil: '12-11-2026',
    totalAmount: '₹95,000',
    rawAmount: 95000,
    status: 'Expired',
  },
];

export const ServiceQuotationsPage: React.FC = () => {
  const [data, setData] = useState<ServiceQuotation[]>(INITIAL_QUOTATIONS);
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<ServiceQuotation | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filtered
  const filtered = data.filter((item) =>
    item.quotationNo.toLowerCase().includes(search.toLowerCase()) ||
    item.customerName.toLowerCase().includes(search.toLowerCase()) ||
    item.serviceCategory.toLowerCase().includes(search.toLowerCase()) ||
    item.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  // Statistics Calculation
  const totalCount = 48; // Preserving enterprise total
  const draftCount = data.filter((d) => d.status === 'Draft').length + 7;
  const sentCount = data.filter((d) => d.status === 'Sent').length + 11;
  const approvedCount = data.filter((d) => d.status === 'Approved').length + 23;
  const rejectedCount = data.filter((d) => d.status === 'Rejected').length + 5;
  const expiredCount = data.filter((d) => d.status === 'Expired').length + 3;

  const handleAccept = (quote: ServiceQuotation) => {
    setData((prev) =>
      prev.map((q) => (q.key === quote.key ? { ...q, status: 'Approved' } : q))
    );
    if (selectedQuote && selectedQuote.key === quote.key) {
      setSelectedQuote({ ...selectedQuote, status: 'Approved' });
    }
    message.success(`Quotation ${quote.quotationNo} has been APPROVED / ACCEPTED.`);
    setViewModalOpen(false);
  };

  const handleReject = (quote: ServiceQuotation) => {
    setData((prev) =>
      prev.map((q) => (q.key === quote.key ? { ...q, status: 'Rejected' } : q))
    );
    if (selectedQuote && selectedQuote.key === quote.key) {
      setSelectedQuote({ ...selectedQuote, status: 'Rejected' });
    }
    message.error(`Quotation ${quote.quotationNo} has been REJECTED.`);
    setViewModalOpen(false);
  };

  const handleAddSubmit = (values: any) => {
    const newQuote: ServiceQuotation = {
      key: String(Date.now()),
      quotationNo: `SQ-2026-00${data.length + 1}`,
      quotationType: values.quotationType || 'Providing',
      customerName: values.customerName,
      serviceCategory: values.serviceCategory,
      serviceType: values.serviceType,
      quotationDate: values.quotationDate ? values.quotationDate.format('DD-MM-YYYY') : '18-11-2026',
      validUntil: values.validUntil ? values.validUntil.format('DD-MM-YYYY') : '30-11-2026',
      totalAmount: `₹${Number(values.totalAmount).toLocaleString()}`,
      rawAmount: Number(values.totalAmount),
      status: 'Draft',
    };
    setData([newQuote, ...data]);
    message.success('New service quotation created successfully!');
    setAddModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Quotation No',
      dataIndex: 'quotationNo',
      key: 'quotationNo',
      width: 140,
      render: (val: string) => (
        <span style={{ fontWeight: 700, color: '#6E56CF', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Quotation Type',
      dataIndex: 'quotationType',
      key: 'quotationType',
      width: 130,
      render: (type: 'Providing' | 'Purchasing') => (
        <Tag
          style={{
            borderRadius: 16,
            padding: '2px 14px',
            fontWeight: 600,
            border: 'none',
            backgroundColor: type === 'Providing' ? '#E0F2FE' : '#F3E8FF',
            color: type === 'Providing' ? '#0284C7' : '#9333EA',
            whiteSpace: 'nowrap',
          }}
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (val: string) => (
        <span style={{ fontWeight: 600, color: '#181433', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Service Category',
      dataIndex: 'serviceCategory',
      key: 'serviceCategory',
      render: (val: string) => (
        <span style={{ color: '#4B5563', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (val: string) => (
        <span style={{ color: '#4B5563', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Quotation Date',
      dataIndex: 'quotationDate',
      key: 'quotationDate',
      render: (val: string) => (
        <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (val: string) => (
        <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: string) => (
        <span style={{ fontWeight: 700, color: '#181433', whiteSpace: 'nowrap' }}>{val}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (st: string) => {
        let bg = '#F3F4F6';
        let text = '#6B7280';
        if (st === 'Sent') {
          bg = '#E0F2FE';
          text = '#0284C7';
        } else if (st === 'Approved') {
          bg = '#DCFCE7';
          text = '#16A34A';
        } else if (st === 'Draft') {
          bg = '#F3F4F6';
          text = '#4B5563';
        } else if (st === 'Rejected') {
          bg = '#FEE2E2';
          text = '#EF4444';
        } else if (st === 'Expired') {
          bg = '#F3E8FF';
          text = '#8B5CF6';
        }
        return (
          <Tag
            style={{
              borderRadius: 16,
              padding: '2px 14px',
              fontWeight: 600,
              border: 'none',
              backgroundColor: bg,
              color: text,
              whiteSpace: 'nowrap',
            }}
          >
            {st}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_: any, record: ServiceQuotation) => {
        const moreItems = [
          {
            key: 'pdf',
            label: 'Download PDF',
            icon: <Download size={14} />,
            onClick: () => message.success(`Downloading ${record.quotationNo} PDF...`),
          },
          {
            key: 'email',
            label: 'Send Email to Client',
            icon: <Send size={14} />,
            onClick: () => message.info(`Quotation ${record.quotationNo} sent via email.`),
          },
        ];

        return (
          <Space size="small" style={{ whiteSpace: 'nowrap' }}>
            <Tooltip title="View Details">
              <Button
                type="text"
                size="small"
                icon={<Eye size={16} color="#3B82F6" />}
                onClick={() => {
                  setSelectedQuote(record);
                  setViewModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Edit Quotation">
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} color="#6366F1" />}
                onClick={() => message.info(`Editing ${record.quotationNo}`)}
              />
            </Tooltip>
            <Tooltip title="Download">
              <Button
                type="text"
                size="small"
                icon={<Download size={16} color="#3B82F6" />}
                onClick={() => message.success(`Downloading ${record.quotationNo}...`)}
              />
            </Tooltip>
            <Dropdown menu={{ items: moreItems }} placement="bottomRight" trigger={['click']}>
              <Button type="text" size="small" icon={<MoreVertical size={16} color="#6B7280" />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Top Header */}
      <PageHeader
        title="Service Quotations"
        subtitle="Manage, create, send and track service quotations."
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button
              icon={<FileSpreadsheet size={15} color="#10B981" />}
              onClick={() => message.success('Exporting Service Quotations to Excel...')}
              style={{
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              Export Excel
            </Button>
            <Button
              icon={<FileText size={15} color="#EF4444" />}
              onClick={() => message.success('Generating Service Quotations PDF...')}
              style={{
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              Export PDF
            </Button>
            <Button
              type="primary"
              icon={<Plus size={15} />}
              style={{
                backgroundColor: '#6E56CF',
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: '0 6px 20px rgba(110, 86, 207, 0.35)',
              }}
              onClick={() => setAddModalOpen(true)}
            >
              Add New Quotation
            </Button>

            <Input
              prefix={<Search size={15} color="#A5A1BE" />}
              placeholder="Search quotation number, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 280,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            />

            <Button
              icon={<Filter size={14} />}
              style={{
                borderRadius: 10,
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              Advanced Filters
            </Button>
          </div>
        }
      />

      {/* 7 Clean White KPI Metric Cards with Enhanced Deep Box Shadow & Scaled Fonts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
          marginBottom: 16,
          width: '100%',
        }}
      >
        {/* Total Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
              flexShrink: 0,
            }}
          >
            <FileCheck size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1E40AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Quotations</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{totalCount}</div>
          </div>
        </Card>

        {/* Draft Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
              flexShrink: 0,
            }}
          >
            <Clock size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Draft Quotations</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{draftCount}</div>
          </div>
        </Card>

        {/* Sent Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1E40AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sent Quotations</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{sentCount}</div>
          </div>
        </Card>

        {/* Approved Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
              flexShrink: 0,
            }}
          >
            <CheckCircle size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Approved</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{approvedCount}</div>
          </div>
        </Card>

        {/* Rejected Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
              flexShrink: 0,
            }}
          >
            <XCircle size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Rejected</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{rejectedCount}</div>
          </div>
        </Card>

        {/* Expired Quotations */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#E9D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7E22CE',
              flexShrink: 0,
            }}
          >
            <Calendar size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#7E22CE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Expired</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{expiredCount}</div>
          </div>
        </Card>

        {/* Total Quotation Value */}
        <Card
          bordered={false}
          style={{
            borderRadius: 14,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF',
          }}
          styles={{ body: { padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 } }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
              fontSize: 16,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ₹
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Value</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>₹4.8 L</div>
          </div>
        </Card>
      </div>

      {/* Main Quotations Table */}
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="key"
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 4,
          showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} records`,
          position: ['bottomRight'],
        }}
        size="middle"
      />

      {/* View Details Modal with Accept and Reject buttons */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#181433' }}>
              Service Quotation Details
            </span>
            {selectedQuote && (
              <span style={{ color: '#6E56CF', fontWeight: 600, fontSize: 14 }}>
                ({selectedQuote.quotationNo})
              </span>
            )}
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={680}
        footer={
          selectedQuote ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
              <Space>
                <Button
                  danger
                  icon={<XCircle size={15} />}
                  onClick={() => handleReject(selectedQuote)}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  Reject
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircle size={15} />}
                  onClick={() => handleAccept(selectedQuote)}
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
        {selectedQuote && (
          <div style={{ paddingTop: 8 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Quotation No">
                <span style={{ fontWeight: 700, color: '#6E56CF' }}>{selectedQuote.quotationNo}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={selectedQuote.quotationType === 'Providing' ? 'blue' : 'purple'}>
                  {selectedQuote.quotationType}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Customer Name" span={2}>
                <span style={{ fontWeight: 700, color: '#181433' }}>{selectedQuote.customerName}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Service Category">
                {selectedQuote.serviceCategory}
              </Descriptions.Item>
              <Descriptions.Item label="Service Type">
                {selectedQuote.serviceType}
              </Descriptions.Item>

              <Descriptions.Item label="Quotation Date">
                {selectedQuote.quotationDate}
              </Descriptions.Item>
              <Descriptions.Item label="Valid Until">
                <span style={{ color: '#DC2626', fontWeight: 600 }}>{selectedQuote.validUntil}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Total Amount" span={2}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                  {selectedQuote.totalAmount}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Current Status" span={2}>
                <Tag
                  color={
                    selectedQuote.status === 'Approved'
                      ? 'green'
                      : selectedQuote.status === 'Sent'
                      ? 'blue'
                      : selectedQuote.status === 'Rejected'
                      ? 'red'
                      : 'default'
                  }
                  style={{ fontWeight: 600, padding: '2px 12px', borderRadius: 12 }}
                >
                  {selectedQuote.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Add New Quotation Modal */}
      <Modal
        title="Create New Service Quotation"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        width={620}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit} style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Quotation Type" name="quotationType" initialValue="Providing" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Providing">Providing</Select.Option>
                  <Select.Option value="Purchasing">Purchasing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customer / Client Name" name="customerName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Precision Tools" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Service Category" name="serviceCategory" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Select.Option value="Mechanical">Mechanical</Select.Option>
                  <Select.Option value="Electrical">Electrical</Select.Option>
                  <Select.Option value="IT Services">IT Services</Select.Option>
                  <Select.Option value="Facility Management">Facility Management</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Service Type" name="serviceType" rules={[{ required: true }]}>
                <Input placeholder="e.g. Machine Repair / Installation" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Quotation Date" name="quotationDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Valid Until" name="validUntil">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Total Estimated Amount (₹)" name="totalAmount" rules={[{ required: true }]}>
            <Input type="number" placeholder="15000" prefix="₹" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF', borderRadius: 8 }}>
              Create Quotation
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceQuotationsPage;
