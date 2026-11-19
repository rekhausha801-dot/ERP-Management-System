import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Row,
  Col,
  message,
  Tooltip,
} from 'antd';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Award,
  Bell,
  ChevronDown,
  Layers,
  ArrowRight,
  Send,
  Eye,
  Edit,
  Trash2,
  FileText,
  Phone,
  Mail,
  Filter,
} from 'lucide-react';
import {
  INITIAL_EXTENDED_ENQUIRIES,
  ExtendedEnquiry,
} from '../../mock/crmCustomerStore';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const EnquiriesListPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<ExtendedEnquiry[]>(INITIAL_EXTENDED_ENQUIRIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingEnquiry, setViewingEnquiry] = useState<ExtendedEnquiry | null>(null);
  const [form] = Form.useForm();

  const filtered = enquiries.filter(e => {
    const q = search.toLowerCase();
    const match =
      e.enquiryNumber.toLowerCase().includes(q) ||
      e.clientName.toLowerCase().includes(q) ||
      e.contactPerson.toLowerCase().includes(q) ||
      e.requirements.toLowerCase().includes(q) ||
      e.assignedEmployee.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchType = typeFilter === 'ALL' || e.enquiryType === typeFilter;

    return match && matchStatus && matchType;
  });

  const totalEnquiries = enquiries.length;
  const openEnquiries = enquiries.filter(e => e.status === 'Open' || e.status === 'Under Review').length;
  const convertedToQuotation = enquiries.filter(e => e.status === 'Quoted' || e.status === 'Converted to Order').length;

  const handleConvertToQuotation = (enquiry: ExtendedEnquiry) => {
    setEnquiries(prev =>
      prev.map(e =>
        e.id === enquiry.id
          ? {
              ...e,
              status: 'Quoted',
              convertedQuotationNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
            }
          : e
      )
    );
    message.success(`Enquiry ${enquiry.enquiryNumber} converted to formal Quotation!`);
  };

  const handleCreateEnquiry = (values: any) => {
    const newEnq: ExtendedEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryNumber: `ENQ-2026-${String(enquiries.length + 901)}`,
      clientType: 'Lead',
      clientId: 'lead-temp',
      clientName: values.clientName,
      contactPerson: values.contactPerson,
      email: values.email || 'enquiry@client.com',
      phone: values.phone,
      enquiryDate: new Date().toISOString().slice(0, 10),
      enquiryType: values.enquiryType || 'Product',
      requirements: values.requirements,
      quantity: 1,
      budget: Number(values.budget) || 250000,
      expectedResponseDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      assignedEmployee: values.assignedEmployee || 'Vikram Seth',
      status: 'Open',
      priority: 'High',
    };

    setEnquiries(prev => [newEnq, ...prev]);
    message.success(`New enquiry ${newEnq.enquiryNumber} registered!`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteEnquiry = (id: string) => {
    Modal.confirm({
      title: 'Delete Enquiry',
      content: 'Are you sure you want to remove this client enquiry?',
      okType: 'danger',
      onOk: () => {
        setEnquiries(prev => prev.filter(e => e.id !== id));
        message.success('Enquiry removed.');
      },
    });
  };

  const kpiCards = [
    {
      title: 'Total Enquiries',
      value: totalEnquiries.toString(),
      growth: '+12% MoM',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <HelpCircle size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Open / Pending Response',
      value: openEnquiries.toString(),
      growth: 'Needs Action',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#F59E0B',
      icon: <Clock size={18} color="#FFFFFF" />,
      iconBg: '#F59E0B',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
    },
    {
      title: 'Converted to Quotes',
      value: convertedToQuotation.toString(),
      growth: '+2 today',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Award size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Quoted':
      case 'Converted to Order':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
          border: 'rgba(21, 128, 61, 0.2)',
        };
      case 'Open':
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          border: 'rgba(217, 119, 6, 0.2)',
        };
      case 'Under Review':
        return {
          bg: '#F3E8FF',
          text: '#7E22CE',
          border: 'rgba(126, 34, 206, 0.2)',
        };
      case 'Closed':
      default:
        return {
          bg: '#F3F4F6',
          text: '#6B7280',
          border: 'rgba(107, 114, 128, 0.2)',
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        minHeight: '100%',
        paddingBottom: 24,
      }}
    >
      {/* 1. Cohesive Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 14,
          columnGap: 20,
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
          borderRadius: 18,
          border: '1px solid #EAE4F5',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          backdropFilter: 'blur(8px)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, flex: '1 1 auto' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(84, 33, 168, 0.28)',
              flexShrink: 0,
            }}
          >
            <HelpCircle size={20} color="#FFFFFF" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#211044',
                margin: 0,
                letterSpacing: '-0.3px',
                lineHeight: 1.25,
              }}
            >
              Customer & Lead Enquiries
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Centralized technical specifications, incoming RFQs, and commercial enquiry intake.
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #ECE8F6',
              borderRadius: 30,
              padding: '6px 14px',
              width: 220,
              boxShadow: '0 2px 6px rgba(84, 33, 168, 0.04)',
            }}
          >
            <Search size={14} color="#7544D6" style={{ marginRight: 8, flexShrink: 0 }} />
            <input
              placeholder="Search enquiries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 12.5,
                color: '#1F2937',
                width: '100%',
              }}
            />
          </div>

          <Button
            type="primary"
            icon={<Plus size={15} />}
            onClick={() => {
              form.resetFields();
              form.setFieldsValue({
                enquiryType: 'Product',
                budget: 250000,
                assignedEmployee: 'Vikram Seth',
              });
              setIsModalOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              borderColor: '#5421A8',
              borderRadius: 24,
              fontWeight: 700,
              height: 36,
              padding: '0 18px',
              boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
            }}
          >
            New Enquiry
          </Button>
        </div>
      </div>

      {/* 2. Top 3 Compact Premium KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: '100%',
        }}
      >
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: kpi.cardBg,
              borderRadius: 16,
              padding: '16px 20px',
              border: kpi.isDark ? 'none' : '1px solid #ECE8F6',
              boxShadow: kpi.boxShadow,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: kpi.titleColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 4,
                }}
              >
                {kpi.title}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: kpi.valueColor,
                  lineHeight: 1.1,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {kpi.value}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: kpi.growthColor,
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{kpi.growth}</span>
                <span
                  style={{
                    color: kpi.isDark ? 'rgba(255, 255, 255, 0.65)' : '#9CA3AF',
                    fontWeight: 500,
                  }}
                >
                  &bull; verified
                </span>
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: kpi.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: kpi.isDark ? '0 4px 10px rgba(0,0,0,0.18)' : '0 3px 8px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            >
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Enquiries Table Card with exact CRM Dashboard styling and proper alignment */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '18px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Table Top Header and Filter Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: '1px solid #F5F3FB',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(117, 68, 214, 0.12)',
                flexShrink: 0,
              }}
            >
              <HelpCircle size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Technical Inbound Enquiries
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Client equipment requests, budget estimations, and quote status
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Open', value: 'Open' },
                { label: 'Under Review', value: 'Under Review' },
                { label: 'Quoted', value: 'Quoted' },
                { label: 'Converted to Order', value: 'Converted to Order' },
                { label: 'Closed', value: 'Closed' },
              ]}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Product', value: 'Product' },
                { label: 'Service', value: 'Service' },
                { label: 'AMC', value: 'AMC' },
              ]}
            />
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 4 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filtered.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 110 }}>
                  Enquiry #
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 180 }}>
                  Client / Prospect
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 260 }}>
                  Type & Requirement
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 120 }}>
                  Budget
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 150 }}>
                  Assigned To
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 120, textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 130 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No technical enquiries match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => {
                  const statusStyle = getStatusBadgeStyle(enq.status);
                  const avatarUrl = avatarMap[enq.assignedEmployee] || defaultAvatar;

                  return (
                    <tr
                      key={enq.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Enquiry # Badge Pill */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: '#F3EEFF',
                            color: '#7544D6',
                            fontWeight: 800,
                            fontSize: 12,
                            padding: '3px 8px',
                            borderRadius: 6,
                            display: 'inline-block',
                            letterSpacing: '0.2px',
                          }}
                        >
                          {enq.enquiryNumber}
                        </span>
                      </td>

                      {/* 2. Client / Prospect */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12.5, lineHeight: 1.3 }}>
                          {enq.clientName}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>👤 {enq.contactPerson}</span>
                          <span>&bull;</span>
                          <span style={{ color: '#4B5563' }}>{enq.phone}</span>
                        </div>
                      </td>

                      {/* 3. Type & Requirement with Clean Capsule & Inline Description */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', maxWidth: 300 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span
                            style={{
                              backgroundColor: enq.enquiryType === 'Service' ? '#E0F2FE' : '#F3EEFF',
                              color: enq.enquiryType === 'Service' ? '#0284C7' : '#7544D6',
                              fontWeight: 700,
                              fontSize: 10.5,
                              padding: '2px 8px',
                              borderRadius: 12,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {enq.enquiryType}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: '#374151',
                              fontWeight: 500,
                              lineHeight: 1.4,
                            }}
                            title={enq.requirements}
                          >
                            {enq.requirements}
                          </span>
                        </div>
                      </td>

                      {/* 4. Budget */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>
                          ₹{(enq.budget || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* 5. Assigned To with avatar */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img
                            src={avatarUrl}
                            alt={enq.assignedEmployee}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1.5px solid #FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                          />
                          <span style={{ color: '#4B5563', fontSize: 12, fontWeight: 600 }}>
                            {enq.assignedEmployee}
                          </span>
                        </div>
                      </td>

                      {/* 6. Status Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            boxShadow: `0 1px 2px ${statusStyle.text}15`,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {enq.status}
                        </span>
                      </td>

                      {/* 7. Quick Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={4}>
                          {enq.status === 'Open' || enq.status === 'Under Review' ? (
                            <Tooltip title="Convert to Quotation">
                              <Button
                                size="small"
                                type="text"
                                style={{
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1px solid #86EFAC',
                                  borderRadius: 6,
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  height: 26,
                                  padding: '0 8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                                icon={<Send size={11} />}
                                onClick={() => handleConvertToQuotation(enq)}
                              >
                                Quote
                              </Button>
                            </Tooltip>
                          ) : (
                            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginRight: 4 }}>
                              {enq.convertedQuotationNumber || 'Quoted'}
                            </span>
                          )}
                          <Tooltip title="View Details">
                            <Button
                              size="small"
                              type="text"
                              style={{
                                color: '#5421A8',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<Eye size={14} />}
                              onClick={() => setViewingEnquiry(enq)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Enquiry">
                            <Button
                              size="small"
                              type="text"
                              danger
                              style={{
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<Trash2 size={14} />}
                              onClick={() => handleDeleteEnquiry(enq.id)}
                            />
                          </Tooltip>
                        </Space>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Enquiry */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Register Client Technical Enquiry"
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateEnquiry} style={{ marginTop: 14 }}>
          <Form.Item name="clientName" label="Client / Company Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Apex Precision Tools Ltd" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
                <Input placeholder="Ramesh Sundaram" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="enquiryType" label="Enquiry Type" initialValue="Product">
                <Select
                  options={[
                    { label: 'Product Requirement', value: 'Product' },
                    { label: 'Service / Maintenance', value: 'Service' },
                    { label: 'Annual AMC Package', value: 'AMC' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="budget" label="Target Budget (₹)" initialValue={250000}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="requirements" label="Technical Specifications / Product Demand" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Describe product capacity, quantity, target delivery timeline..." />
          </Form.Item>
          <Form.Item name="assignedEmployee" label="Assigned Sales Representative" initialValue="Vikram Seth">
            <Select
              options={[
                { label: 'Vikram Seth', value: 'Vikram Seth' },
                { label: 'Ananya Sharma', value: 'Ananya Sharma' },
              ]}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Register Enquiry
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal View Enquiry Details */}
      <Modal
        open={!!viewingEnquiry}
        onCancel={() => setViewingEnquiry(null)}
        title={
          viewingEnquiry ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#5421A8', fontWeight: 800 }}>{viewingEnquiry.enquiryNumber}</span>
              <span style={{ fontSize: 13, color: '#6B7280' }}>Enquiry Details</span>
            </div>
          ) : 'Enquiry'
        }
        footer={[
          <Button key="close" onClick={() => setViewingEnquiry(null)}>
            Close
          </Button>,
          viewingEnquiry && (viewingEnquiry.status === 'Open' || viewingEnquiry.status === 'Under Review') && (
            <Button
              key="quote"
              type="primary"
              style={{ background: '#10B981', borderColor: '#10B981', fontWeight: 700 }}
              onClick={() => {
                handleConvertToQuotation(viewingEnquiry);
                setViewingEnquiry(null);
              }}
            >
              Convert to Quotation
            </Button>
          ),
        ]}
      >
        {viewingEnquiry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
            <div style={{ background: '#FAF8FE', padding: 14, borderRadius: 10, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>{viewingEnquiry.clientName}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                Contact: {viewingEnquiry.contactPerson} &bull; 📞 {viewingEnquiry.phone} &bull; ✉️ {viewingEnquiry.email}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12.5 }}>
              <div><strong>Type:</strong> <Tag color="purple">{viewingEnquiry.enquiryType}</Tag></div>
              <div><strong>Status:</strong> <Tag color="green">{viewingEnquiry.status}</Tag></div>
              <div><strong>Target Budget:</strong> <strong style={{ color: '#10B981' }}>₹{viewingEnquiry.budget?.toLocaleString()}</strong></div>
              <div><strong>Assigned Rep:</strong> {viewingEnquiry.assignedEmployee}</div>
              <div><strong>Enquiry Date:</strong> {viewingEnquiry.enquiryDate}</div>
              <div><strong>Expected By:</strong> {viewingEnquiry.expectedResponseDate}</div>
            </div>

            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>Specifications & Scope:</div>
              <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8, fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>
                {viewingEnquiry.requirements}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
