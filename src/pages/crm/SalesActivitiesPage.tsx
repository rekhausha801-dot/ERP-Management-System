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
  History,
  Plus,
  Search,
  Phone,
  Mail,
  Users,
  Presentation,
  MapPin,
  Calendar,
  Bell,
  ChevronDown,
  Layers,
  Award,
  Video,
  FileText,
  Eye,
  Trash2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  INITIAL_SALES_ACTIVITIES,
  SalesActivity,
} from '../../mock/crmCustomerStore';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const SalesActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<SalesActivity[]>(INITIAL_SALES_ACTIVITIES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingActivity, setViewingActivity] = useState<SalesActivity | null>(null);
  const [form] = Form.useForm();

  const filtered = activities.filter(a => {
    const q = search.toLowerCase();
    const match =
      a.title.toLowerCase().includes(q) ||
      a.relatedName.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.assignedEmployee.toLowerCase().includes(q);

    const matchesType = typeFilter === 'ALL' || a.activityType === typeFilter;
    const matchesOutcome = outcomeFilter === 'ALL' || a.outcome === outcomeFilter;
    return match && matchesType && matchesOutcome;
  });

  const totalActivities = activities.length;
  const meetingsCount = activities.filter(a => a.activityType === 'Demonstration' || a.activityType === 'Site Visit' || a.activityType === 'Meeting').length;
  const callsCount = activities.filter(a => a.activityType === 'Call').length;

  const handleCreateActivity = (values: any) => {
    const newA: SalesActivity = {
      id: `act-${Date.now()}`,
      activityType: values.activityType,
      title: values.title,
      relatedType: values.relatedType || 'Customer',
      relatedId: 'rel-1',
      relatedName: values.relatedName,
      assignedEmployee: values.assignedEmployee || 'Vikram Seth',
      activityDate: values.activityDate || new Date().toISOString().slice(0, 10),
      activityTime: values.activityTime || '11:00 AM',
      description: values.description,
      outcome: values.outcome || 'Positive / Interested',
      nextAction: values.nextAction || 'Follow up with quotation',
      status: 'Completed',
    };

    setActivities([newA, ...activities]);
    message.success('Sales activity logged successfully!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteActivity = (id: string) => {
    Modal.confirm({
      title: 'Delete Activity Record',
      content: 'Are you sure you want to remove this logged touchpoint?',
      okType: 'danger',
      onOk: () => {
        setActivities(prev => prev.filter(a => a.id !== id));
        message.success('Activity removed.');
      },
    });
  };

  const kpiCards = [
    {
      title: 'Logged Sales Activities',
      value: totalActivities.toString(),
      growth: '+24%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Calendar size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Client Meetings & Demos',
      value: meetingsCount.toString(),
      growth: '+12 this week',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Presentation size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Prospect Discovery Calls',
      value: callsCount.toString(),
      growth: '+9 today',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Phone size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call':
        return <Phone size={15} color="#7544D6" />;
      case 'Meeting':
        return <Calendar size={15} color="#7544D6" />;
      case 'Demonstration':
        return <Video size={15} color="#7544D6" />;
      case 'Site Visit':
        return <MapPin size={15} color="#7544D6" />;
      case 'Email':
        return <Mail size={15} color="#7544D6" />;
      default:
        return <Calendar size={15} color="#7544D6" />;
    }
  };

  const getOutcomeStyle = (outcome: string) => {
    switch (outcome) {
      case 'Quotation Requested':
        return { bg: '#E6F4EA', text: '#137333', border: 'rgba(19, 115, 51, 0.2)' };
      case 'Positive / Interested':
        return { bg: '#E8F0FE', text: '#1A73E8', border: 'rgba(26, 115, 232, 0.2)' };
      case 'Needs Follow-up':
        return { bg: '#FEF7E0', text: '#B06000', border: 'rgba(176, 96, 0, 0.2)' };
      case 'Order Confirmed':
        return { bg: '#DCFCE7', text: '#15803D', border: 'rgba(21, 128, 61, 0.2)' };
      case 'Not Interested':
        return { bg: '#FEE2E2', text: '#DC2626', border: 'rgba(220, 38, 38, 0.2)' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563', border: 'rgba(107, 114, 128, 0.2)' };
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
            <History size={20} color="#FFFFFF" />
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
              Sales Activities & Client Touchpoints
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Track and log calls, customer meetings, product demonstrations, and site visits in real time.
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
              placeholder="Search activities..."
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
                activityType: 'Call',
                outcome: 'Positive / Interested',
                assignedEmployee: 'Vikram Seth',
                activityDate: new Date().toISOString().slice(0, 10),
                activityTime: '11:00 AM',
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
            Log Activity
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

      {/* 3. Main Sales Activities Table Card matching CRM Dashboard design */}
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
              <Calendar size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Recent Sales Activities
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Real-time client touchpoints, meetings, demonstrations, and logs
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Discovery Call', value: 'Call' },
                { label: 'Client Meeting', value: 'Meeting' },
                { label: 'Product Demo', value: 'Demonstration' },
                { label: 'Site Inspection', value: 'Site Visit' },
              ]}
            />
            <Select
              value={outcomeFilter}
              onChange={setOutcomeFilter}
              style={{ width: 170, height: 34 }}
              options={[
                { label: 'All Outcomes', value: 'ALL' },
                { label: 'Quotation Requested', value: 'Quotation Requested' },
                { label: 'Positive / Interested', value: 'Positive / Interested' },
                { label: 'Needs Follow-up', value: 'Needs Follow-up' },
                { label: 'Order Confirmed', value: 'Order Confirmed' },
              ]}
            />
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 2 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filtered.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 60 }}>
                  Type
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 220 }}>
                  Activity Details
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 170 }}>
                  Related To
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 140 }}>
                  Performed By
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 150 }}>
                  Outcome
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 110 }}>
                  Date
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 80 }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No sales activities match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(act => {
                  const outcomeStyle = getOutcomeStyle(act.outcome);
                  const avatarUrl = avatarMap[act.assignedEmployee] || defaultAvatar;

                  return (
                    <tr
                      key={act.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Type Icon Pill */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: '#F3E8FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(117, 68, 214, 0.1)',
                          }}
                        >
                          {getTypeIcon(act.activityType)}
                        </div>
                      </td>

                      {/* 2. Activity Details & Summary */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', maxWidth: 240 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#1F2937',
                            fontSize: 12.5,
                            lineHeight: 1.3,
                            cursor: 'pointer',
                          }}
                          onClick={() => setViewingActivity(act)}
                        >
                          {act.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: '#6B7280',
                            marginTop: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={act.description}
                        >
                          {act.description}
                        </div>
                      </td>

                      {/* 3. Related To Account */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            color: '#2563EB',
                            fontWeight: 600,
                            fontSize: 12.5,
                            cursor: 'pointer',
                          }}
                        >
                          {act.relatedName}
                        </span>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>
                          {act.relatedType}
                        </div>
                      </td>

                      {/* 4. Performed By with Avatar */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img
                            src={avatarUrl}
                            alt={act.assignedEmployee}
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
                            {act.assignedEmployee}
                          </span>
                        </div>
                      </td>

                      {/* 5. Outcome Pill */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: outcomeStyle.bg,
                            color: outcomeStyle.text,
                            padding: '3px 9px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: `1px solid ${outcomeStyle.border}`,
                          }}
                        >
                          {act.outcome}
                        </span>
                      </td>

                      {/* 6. Date */}
                      <td style={{ padding: '12px 12px', color: '#6B7280', fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: '1px solid #F3F0FA' }}>
                        <div>{act.activityDate}</div>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>{act.activityTime}</div>
                      </td>

                      {/* 7. Action */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={3}>
                          <Tooltip title="View Details">
                            <Button
                              type="text"
                              size="small"
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
                              onClick={() => setViewingActivity(act)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Activity">
                            <Button
                              type="text"
                              size="small"
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
                              onClick={() => handleDeleteActivity(act.id)}
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

      {/* MODAL: LOG ACTIVITY */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Log Client Sales Activity"
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateActivity} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="activityType" label="Activity Type" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: 'Discovery Call', value: 'Call' },
                    { label: 'Client Meeting', value: 'Meeting' },
                    { label: 'Product Demonstration', value: 'Demonstration' },
                    { label: 'Factory / Site Visit', value: 'Site Visit' },
                    { label: 'Email Outreach', value: 'Email' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="relatedName" label="Related Company / Lead" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="title" label="Activity Summary / Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Machine specification review & SLA discussion" />
          </Form.Item>
          <Form.Item name="description" label="Detailed Conversation Notes" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Customer questions, technical specs requested, pricing considerations..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="outcome" label="Meeting / Call Outcome" initialValue="Positive / Interested">
                <Select
                  options={[
                    { label: 'Positive / Interested', value: 'Positive / Interested' },
                    { label: 'Quotation Requested', value: 'Quotation Requested' },
                    { label: 'Needs Follow-up', value: 'Needs Follow-up' },
                    { label: 'Order Confirmed', value: 'Order Confirmed' },
                    { label: 'Not Interested', value: 'Not Interested' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nextAction" label="Next Immediate Action">
                <Input placeholder="e.g. Send formal price proposal by Friday" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Activity Log
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: VIEW DETAILS */}
      <Modal
        open={!!viewingActivity}
        onCancel={() => setViewingActivity(null)}
        title={
          viewingActivity ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#5421A8', fontWeight: 800 }}>{viewingActivity.title}</span>
            </div>
          ) : 'Activity'
        }
        footer={[
          <Button key="close" onClick={() => setViewingActivity(null)}>
            Close
          </Button>,
        ]}
      >
        {viewingActivity && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
            <div style={{ background: '#FAF8FE', padding: 14, borderRadius: 10, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>{viewingActivity.relatedName}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                Type: {viewingActivity.activityType} &bull; Performed By: {viewingActivity.assignedEmployee}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12.5 }}>
              <div><strong>Outcome:</strong> <Tag color="green">{viewingActivity.outcome}</Tag></div>
              <div><strong>Date & Time:</strong> {viewingActivity.activityDate} at {viewingActivity.activityTime}</div>
            </div>

            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 4 }}>Touchpoint Notes:</div>
              <div style={{ background: '#F9FAFB', padding: 10, borderRadius: 8, fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>
                {viewingActivity.description}
              </div>
            </div>

            {viewingActivity.nextAction && (
              <div style={{ marginTop: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5421A8', marginBottom: 4 }}>Next Action Plan:</div>
                <div style={{ background: '#F3EEFF', padding: 10, borderRadius: 8, fontSize: 12, color: '#5421A8' }}>
                  {viewingActivity.nextAction}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
