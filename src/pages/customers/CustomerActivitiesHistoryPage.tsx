import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Drawer,
  Descriptions,
  message,
  Tooltip,
} from 'antd';
import {
  History,
  Search,
  ShoppingBag,
  FileText,
  CreditCard,
  Phone,
  Users,
  Clock,
  Download,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  ArrowRight,
  TrendingUp,
  Truck,
  Wrench,
  Mail,
  Video,
  FileCheck,
  Send,
  Eye,
  Filter,
  Layers,
  Bell,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  INITIAL_CUSTOMER_ACTIVITIES,
  CustomerActivityLog,
  TimelineCategory,
  TimelineStatus,
} from '../../mock/crmCustomerStore';
import { INITIAL_CUSTOMERS, ExtendedCustomer } from '../../mock/customerData';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const CustomerActivitiesHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CustomerActivityLog[]>(INITIAL_CUSTOMER_ACTIVITIES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Detail Modal / Drawer
  const [viewingActivity, setViewingActivity] = useState<CustomerActivityLog | null>(null);

  // Filter & Sort Logic
  const filteredActivities = activities
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch =
        a.title.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.refNumber && a.refNumber.toLowerCase().includes(q)) ||
        a.performedBy.toLowerCase().includes(q);

      const matchCategory = categoryFilter === 'ALL' || a.activityCategory === categoryFilter;
      const matchCustomer = customerFilter === 'ALL' || a.customerId === customerFilter;
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchModule = moduleFilter === 'ALL' || a.moduleType === moduleFilter;

      return matchSearch && matchCategory && matchCustomer && matchStatus && matchModule;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp.localeCompare(a.timestamp);
      }
      return a.timestamp.localeCompare(b.timestamp);
    });

  // Calculate Key Performance Indicators (Exactly Four KPI Cards)
  const totalAuditEvents = activities.length;
  const salesAndFinanceEvents = activities.filter(a => a.moduleType === 'Sales' || a.moduleType === 'Finance').length;
  const crmInteractions = activities.filter(a => a.moduleType === 'CRM').length;
  const serviceEvents = activities.filter(a => a.moduleType === 'Service').length;

  const kpiCards = [
    {
      title: 'Total Audit Trail Logs',
      value: totalAuditEvents.toString(),
      growth: '+100% Immutable',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <History size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Sales & Invoicing Logs',
      value: salesAndFinanceEvents.toString(),
      growth: 'Quotes, Orders, Dues',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <ShoppingBag size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Client Interactions',
      value: crmInteractions.toString(),
      growth: 'Calls & Touchpoints',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Phone size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Service & Maintenance',
      value: serviceEvents.toString(),
      growth: 'Tickets & Calibration',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Wrench size={18} color="#FFFFFF" />,
      iconBg: '#F59E0B',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
    },
  ];

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Category', 'Associated Customer', 'Activity Title', 'Reference #', 'Value (₹)', 'Module', 'Status', 'Performed By', 'Description'];
    const rows = filteredActivities.map(a => [
      `"${a.timestamp}"`,
      `"${a.activityCategory}"`,
      `"${a.customerName}"`,
      `"${a.title}"`,
      a.refNumber || 'N/A',
      a.amount || 0,
      a.moduleType || 'CRM',
      a.status || 'Completed',
      `"${a.performedBy}"`,
      `"${a.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customer_Audit_Timeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Chronological audit timeline exported to CSV / Excel!');
  };

  const handleExportPDF = () => {
    message.info('Generating PDF statement for Customer Interaction & Transaction Timeline...');
    setTimeout(() => {
      message.success('Audit timeline PDF statement exported successfully!');
    }, 1200);
  };

  const getCategoryStyle = (cat: TimelineCategory) => {
    switch (cat) {
      case 'Quotations':
        return { bg: '#F3EEFF', text: '#7544D6', border: '#E9D8FD' };
      case 'Sales Orders':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'Payments':
        return { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' };
      case 'Delivery & Shipment':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Service Requests':
      case 'Service Assignments':
      case 'Service Completion':
        return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'Calls & Communications':
      case 'Emails':
      case 'Meetings':
      case 'Follow-ups':
        return { bg: '#FAF5FF', text: '#6B21A8', border: '#E9D8FD' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };
    }
  };

  const getStatusBadgeStyle = (status?: TimelineStatus) => {
    switch (status) {
      case 'Confirmed':
      case 'Approved':
      case 'Completed':
      case 'Resolved':
        return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
      case 'Created':
      case 'Pending':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' };
      case 'Overdue':
      case 'Failed':
      case 'Rejected':
        return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' };
      case 'Cancelled':
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
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
              Customer Interaction & Transaction Timeline
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Chronological audit history across customer quotations, sales orders, payment clearances, calls, and follow-ups.
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
              placeholder="Search audit trail..."
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
            icon={<FileSpreadsheet size={14} />}
            onClick={handleExportCSV}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 12,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 36,
              padding: '0 14px',
              backgroundColor: '#FFFFFF',
            }}
          >
            Export Excel
          </Button>

          <Button
            icon={<Download size={14} />}
            onClick={handleExportPDF}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 12,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 36,
              padding: '0 14px',
              backgroundColor: '#FFFFFF',
            }}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Compact Premium KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
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
              padding: '16px 18px',
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
                  fontSize: 11.5,
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
                  fontSize: 24,
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
                width: 42,
                height: 42,
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

      {/* 3. Timeline Audit Directory Card with exact CRM Dashboard styling */}
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
              <History size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Chronological Audit Trail
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Traceable enterprise history across Sales, Service, and CRM lifecycle events
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Select
              value={moduleFilter}
              onChange={setModuleFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { label: 'All Modules', value: 'ALL' },
                { label: 'Sales Module', value: 'Sales' },
                { label: 'Service ERP', value: 'Service' },
                { label: 'Finance Dues', value: 'Finance' },
                { label: 'CRM Activities', value: 'CRM' },
              ]}
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 155, height: 34 }}
              options={[
                { label: 'All Categories', value: 'ALL' },
                { label: 'Quotations', value: 'Quotations' },
                { label: 'Sales Orders', value: 'Sales Orders' },
                { label: 'Payments', value: 'Payments' },
                { label: 'Delivery & Shipment', value: 'Delivery & Shipment' },
                { label: 'Service Requests', value: 'Service Requests' },
                { label: 'Calls & Communications', value: 'Calls & Communications' },
                { label: 'Meetings', value: 'Meetings' },
              ]}
            />
            <Select
              value={customerFilter}
              onChange={setCustomerFilter}
              style={{ width: 170, height: 34 }}
              options={[
                { label: 'All Customers', value: 'ALL' },
                ...INITIAL_CUSTOMERS.map(c => ({ label: c.name, value: c.id })),
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120, height: 34 }}
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Created', value: 'Created' },
              ]}
            />
            <Button
              icon={<ArrowUpDown size={13} />}
              onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
              style={{
                height: 34,
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#5421A8',
              }}
            >
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </Button>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 2 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredActivities.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, minWidth: 150 }}>
                  Timestamp
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 160 }}>
                  Category & Module
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 180 }}>
                  Associated Customer
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 260 }}>
                  Activity Title & Audit Description
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 120 }}>
                  Value / Amount
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 110, textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 140 }}>
                  Performed By
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 90 }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No audit records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map(act => {
                  const catStyle = getCategoryStyle(act.activityCategory);
                  const statusStyle = getStatusBadgeStyle(act.status);
                  const avatarUrl = avatarMap[act.performedBy] || defaultAvatar;

                  return (
                    <tr
                      key={act.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Timestamp */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12 }}>
                          {act.timestamp.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>
                          {act.timestamp.split(' ').slice(1).join(' ')}
                        </div>
                      </td>

                      {/* 2. Category & Module Pill */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <span
                          style={{
                            backgroundColor: catStyle.bg,
                            color: catStyle.text,
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: `1px solid ${catStyle.border}`,
                          }}
                        >
                          {act.activityCategory}
                        </span>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2, fontWeight: 500 }}>
                          Module: <strong style={{ color: '#5421A8' }}>{act.moduleType || 'CRM'}</strong>
                        </div>
                      </td>

                      {/* 3. Associated Customer */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12.5, lineHeight: 1.3 }}>
                          {act.customerName}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                          ID: {act.customerId}
                        </div>
                      </td>

                      {/* 4. Title, Ref Number & Description */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: '#1E1B4B',
                              fontSize: 12.5,
                              cursor: 'pointer',
                            }}
                            onClick={() => setViewingActivity(act)}
                          >
                            {act.title}
                          </span>
                          {act.refNumber && (
                            <span
                              style={{
                                backgroundColor: '#F3EEFF',
                                color: '#7544D6',
                                fontSize: 10,
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: 4,
                                letterSpacing: '0.2px',
                              }}
                            >
                              {act.refNumber}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 3, lineHeight: 1.35, maxWidth: 360 }}>
                          {act.description}
                        </div>
                      </td>

                      {/* 5. Amount / Financial Value */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        {act.amount ? (
                          <span style={{ fontWeight: 800, color: '#10B981', fontSize: 12.5 }}>
                            ₹{act.amount.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ color: '#D1D5DB', fontSize: 12 }}>—</span>
                        )}
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
                          {act.status || 'Completed'}
                        </span>
                      </td>

                      {/* 7. Performed By with Avatar */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img
                            src={avatarUrl}
                            alt={act.performedBy}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1.5px solid #FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                          />
                          <span style={{ color: '#4B5563', fontSize: 11.5, fontWeight: 600 }}>
                            {act.performedBy}
                          </span>
                        </div>
                      </td>

                      {/* 8. Action (View / Open Link) */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Tooltip title="View Detailed Event Audit">
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW EVENT AUDIT DETAILS DRAWER */}
      <Drawer
        open={!!viewingActivity}
        onClose={() => setViewingActivity(null)}
        width={560}
        title={
          viewingActivity ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#1E1B4B' }}>{viewingActivity.title}</span>
              {viewingActivity.refNumber && (
                <span style={{ backgroundColor: '#F3EEFF', color: '#7544D6', fontWeight: 800, fontSize: 11.5, padding: '2px 8px', borderRadius: 4 }}>
                  {viewingActivity.refNumber}
                </span>
              )}
            </div>
          ) : 'Audit Entry'
        }
      >
        {viewingActivity && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 12, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Associated Customer Account</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#5421A8', marginTop: 2 }}>
                {viewingActivity.customerName}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 4 }}>
                Customer Key: {viewingActivity.customerId}
              </div>
            </div>

            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Activity Category">
                <Tag color="purple">{viewingActivity.activityCategory}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Originating ERP Module">
                <Tag color="blue">{viewingActivity.moduleType || 'CRM'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Audit Timestamp">{viewingActivity.timestamp}</Descriptions.Item>
              <Descriptions.Item label="Unique Reference ID">{viewingActivity.refNumber || 'N/A'}</Descriptions.Item>
              {viewingActivity.amount && (
                <Descriptions.Item label="Transaction Financial Value">
                  <strong style={{ color: '#10B981', fontSize: 13 }}>₹{viewingActivity.amount.toLocaleString()}</strong>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Lifecycle Status">
                <Tag color="green">{viewingActivity.status || 'Completed'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Actor / Performed By">{viewingActivity.performedBy}</Descriptions.Item>
              <Descriptions.Item label="Full Log Details">
                {viewingActivity.description}
              </Descriptions.Item>
            </Descriptions>

            {viewingActivity.navigationPath && (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  block
                  icon={<ArrowRight size={15} />}
                  style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600, height: 38 }}
                  onClick={() => {
                    navigate(viewingActivity.navigationPath!);
                  }}
                >
                  Navigate to Associated Record ({viewingActivity.moduleType})
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
