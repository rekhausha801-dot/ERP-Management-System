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
  Clock,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Phone,
  Calendar,
  Check,
  X,
  Bell,
  ChevronDown,
  Layers,
  Award,
  Video,
  MapPin,
  Mail,
  UserCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  INITIAL_UNIFIED_FOLLOW_UPS,
  UnifiedFollowUp,
} from '../../mock/crmCustomerStore';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const CentralFollowUpsPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<UnifiedFollowUp[]>(INITIAL_UNIFIED_FOLLOW_UPS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = followUps.filter(f => {
    const q = search.toLowerCase();
    const match =
      f.relatedName.toLowerCase().includes(q) ||
      f.contactPerson.toLowerCase().includes(q) ||
      f.notes.toLowerCase().includes(q) ||
      f.assignedEmployee.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || f.priority === priorityFilter;

    return match && matchStatus && matchPriority;
  });

  const totalFollowUps = followUps.length;
  const scheduledCount = followUps.filter(f => f.status === 'Scheduled').length;
  const overdueCount = followUps.filter(f => f.status === 'Overdue').length;

  const handleMarkStatus = (id: string, newStatus: 'Completed' | 'Cancelled') => {
    setFollowUps(prev =>
      prev.map(f => (f.id === id ? { ...f, status: newStatus } : f))
    );
    message.success(`Follow-up marked as ${newStatus}`);
  };

  const handleCreateFollowUp = (values: any) => {
    const newFlw: UnifiedFollowUp = {
      id: `flw-${Date.now()}`,
      relatedName: values.relatedName,
      contactPerson: values.contactPerson,
      phone: values.phone || '+91 98412 11000',
      followUpType: values.followUpType || 'Call',
      followUpDate: values.followUpDate,
      followUpTime: values.followUpTime || '11:00 AM',
      assignedEmployee: values.assignedEmployee || 'Vikram Seth',
      priority: values.priority || 'Medium',
      reminder: values.reminder || '1 hour before',
      notes: values.notes || 'Routine follow-up',
      status: 'Scheduled',
      relatedType: 'Lead',
      relatedId: 'lead-temp',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setFollowUps(prev => [newFlw, ...prev]);
    message.success('New follow-up scheduled successfully!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const kpiCards = [
    {
      title: 'Total Follow-ups',
      value: totalFollowUps.toString(),
      growth: '+15%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Clock size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Scheduled This Week',
      value: scheduledCount.toString(),
      growth: 'Active Reminders',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Calendar size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Overdue Follow-ups',
      value: overdueCount.toString(),
      growth: overdueCount > 0 ? 'Requires Action' : 'All Clear',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: overdueCount > 0 ? '#EF4444' : '#4ADE80',
      icon: <AlertTriangle size={20} color="#4C1D95" />,
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
      case 'Site Visit':
        return <MapPin size={15} color="#7544D6" />;
      case 'Email':
        return <Mail size={15} color="#7544D6" />;
      default:
        return <Calendar size={15} color="#7544D6" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return {
          bg: '#F3E8FF',
          text: '#7E22CE',
        };
      case 'Completed':
        return {
          bg: '#DCFCE7',
          text: '#15803D',
        };
      case 'Overdue':
        return {
          bg: '#FEE2E2',
          text: '#DC2626',
        };
      case 'Cancelled':
      default:
        return {
          bg: '#F3F4F6',
          text: '#6B7280',
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
      {/* 1. Cohesive Single-Line Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 20,
          padding: '12px 20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
          borderRadius: 18,
          border: '1px solid #EAE4F5',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          backdropFilter: 'blur(8px)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 auto' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(84, 33, 168, 0.25)',
              flexShrink: 0,
            }}
          >
            <Clock size={18} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#211044',
                margin: 0,
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              Central Follow-up Tracker
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '2px 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Unified scheduling, reminders, customer calls, and meeting commitments across all sales reps.
            </p>
          </div>
        </div>

        {/* Right Action Controls in a Single Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 30,
              padding: '4px 14px',
              width: 220,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Search size={15} color="#9CA3AF" style={{ marginRight: 8, flexShrink: 0 }} />
            <input
              placeholder="Search follow-ups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 13,
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
                followUpType: 'Call',
                followUpTime: '11:00 AM',
                followUpDate: new Date().toISOString().slice(0, 10),
                assignedEmployee: 'Vikram Seth',
                priority: 'High',
                reminder: '1 hour before',
              });
              setIsModalOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              borderColor: '#5421A8',
              borderRadius: 24,
              fontWeight: 700,
              height: 38,
              padding: '0 18px',
              boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Schedule Follow-up
          </Button>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Bell size={17} color="#4B5563" />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: 9,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              3
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 30,
              padding: '4px 12px 4px 5px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#3A1078',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              JD
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>Janani D</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>VP of Sales</div>
            </div>
            <ChevronDown size={13} color="#9CA3AF" />
          </div>
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

      {/* 3. Main Follow-ups Table Card with exact CRM Dashboard alignment */}
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
              <Bell size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Upcoming Follow-ups
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Scheduled client meetings & calls
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
                { label: 'Scheduled', value: 'Scheduled' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Overdue', value: 'Overdue' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { label: 'All Priorities', value: 'ALL' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
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
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 60 }}>
                  Type
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 180 }}>
                  Customer
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 200 }}>
                  Follow-up Details & Notes
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 150 }}>
                  Assigned To
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 130 }}>
                  Date & Time
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 110, textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 90 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No follow-ups match your current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((fu) => {
                  const statusStyle = getStatusBadgeStyle(fu.status);
                  const avatarUrl = avatarMap[fu.assignedEmployee] || defaultAvatar;

                  return (
                    <tr
                      key={fu.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                          {getTypeIcon(fu.followUpType)}
                        </div>
                      </td>

                      {/* 2. Customer Name & Contact */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12.5, lineHeight: 1.3 }}>
                          {fu.relatedName}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>👤 {fu.contactPerson}</span>
                          <span>&bull;</span>
                          <span style={{ color: '#4B5563' }}>{fu.phone}</span>
                        </div>
                      </td>

                      {/* 3. Follow-up Details & Notes */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', maxWidth: 220 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#374151',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={fu.notes}
                        >
                          {fu.notes}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2 }}>
                          Priority: <strong style={{ color: fu.priority === 'High' ? '#DC2626' : '#5421A8' }}>{fu.priority}</strong> &bull; Reminder: {fu.reminder}
                        </div>
                      </td>

                      {/* 4. Assigned To with avatar */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img
                            src={avatarUrl}
                            alt={fu.assignedEmployee}
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
                            {fu.assignedEmployee}
                          </span>
                        </div>
                      </td>

                      {/* 5. Date & Time */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: fu.status === 'Overdue' ? '#DC2626' : '#1F2937', fontSize: 11.5 }}>
                          {fu.followUpDate}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>
                          {fu.followUpTime}
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
                            border: `1px solid ${statusStyle.text}20`,
                          }}
                        >
                          {fu.status}
                        </span>
                      </td>

                      {/* 7. Quick Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={4}>
                          {fu.status !== 'Completed' && (
                            <Tooltip title="Mark as Completed">
                              <Button
                                size="small"
                                type="text"
                                style={{
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1px solid #86EFAC',
                                  borderRadius: 6,
                                  width: 26,
                                  height: 26,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                }}
                                icon={<Check size={13} />}
                                onClick={() => handleMarkStatus(fu.id, 'Completed')}
                              />
                            </Tooltip>
                          )}
                          {fu.status !== 'Cancelled' && (
                            <Tooltip title="Cancel Follow-up">
                              <Button
                                size="small"
                                type="text"
                                danger
                                style={{
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  border: '1px solid #FCA5A5',
                                  borderRadius: 6,
                                  width: 26,
                                  height: 26,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                }}
                                icon={<X size={13} />}
                                onClick={() => handleMarkStatus(fu.id, 'Cancelled')}
                              />
                            </Tooltip>
                          )}
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

      {/* Modal Add Follow-up */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title="Schedule Client Follow-up"
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateFollowUp} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="relatedName" label="Client / Lead Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
                <Input placeholder="Ramesh Sundaram" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="followUpType" label="Follow-up Type" initialValue="Call">
                <Select
                  options={[
                    { label: 'Follow-up Call', value: 'Call' },
                    { label: 'Review Meeting', value: 'Meeting' },
                    { label: 'On-site Inspection', value: 'Site Visit' },
                    { label: 'Official Email', value: 'Email' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Contact Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="followUpDate" label="Schedule Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="followUpTime" label="Schedule Time" initialValue="11:00 AM">
                <Input placeholder="11:00 AM" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignedEmployee" label="Assigned Representative" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth (Senior Sales)', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma (Enterprise Specialist)', value: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority" initialValue="High">
                <Select
                  options={[
                    { label: 'High Priority', value: 'High' },
                    { label: 'Medium Priority', value: 'Medium' },
                    { label: 'Low Priority', value: 'Low' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Agenda / Discussion Plan" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Describe topics to discuss, quotation revisions, dispatch checks..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600 }}>
              Confirm & Schedule
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
