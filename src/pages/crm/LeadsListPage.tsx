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
  Drawer,
  Descriptions,
} from 'antd';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Building,
  Target,
  ArrowRight,
  DollarSign,
  Calendar,
  Bell,
  ChevronDown,
  Layers,
  Award,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import {
  INITIAL_EXTENDED_LEADS,
  ExtendedLead,
  INITIAL_LEAD_SOURCES,
} from '../../mock/crmCustomerStore';
import { INITIAL_CUSTOMERS, ExtendedCustomer } from '../../mock/customerData';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const LeadsListPage: React.FC = () => {
  const [leads, setLeads] = useState<ExtendedLead[]>(INITIAL_EXTENDED_LEADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ExtendedLead | null>(null);
  const [viewingLead, setViewingLead] = useState<ExtendedLead | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<ExtendedLead | null>(null);

  const [form] = Form.useForm();
  const [convertForm] = Form.useForm();

  // Search and Filters
  const filteredLeads = leads.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.companyName.toLowerCase().includes(q) ||
      l.contactName.toLowerCase().includes(q) ||
      l.leadNumber.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q);

    const matchesStatus = statusFilter === 'ALL' || l.stage === statusFilter || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const totalPipelineRevenue = leads.reduce((acc, curr) => acc + (curr.expectedRevenue || 0), 0);
  const qualifiedLeadsCount = leads.filter(l => ['Qualified', 'Proposal', 'Negotiation', 'Won'].includes(l.stage)).length;

  const handleOpenAddModal = () => {
    setEditingLead(null);
    form.resetFields();
    form.setFieldsValue({
      stage: 'New',
      priority: 'Medium',
      source: 'Website',
      assignedTo: 'Vikram Seth',
      expectedRevenue: 500000,
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (lead: ExtendedLead) => {
    setEditingLead(lead);
    form.setFieldsValue({
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      alternatePhone: lead.alternatePhone,
      industry: lead.industry,
      source: lead.source,
      stage: lead.stage,
      priority: lead.priority,
      expectedRevenue: lead.expectedRevenue,
      expectedClosingDate: lead.expectedClosingDate,
      assignedTo: lead.assignedTo,
      address: lead.address,
      notes: lead.notes,
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveLead = (values: any) => {
    if (editingLead) {
      setLeads(prev =>
        prev.map(l =>
          l.id === editingLead.id
            ? {
                ...l,
                ...values,
                expectedRevenue: Number(values.expectedRevenue) || 0,
                estimatedValue: Number(values.expectedRevenue) || 0,
              }
            : l
        )
      );
      message.success(`Lead ${editingLead.leadNumber} updated successfully.`);
    } else {
      const newLead: ExtendedLead = {
        id: `lead_${Date.now()}`,
        leadNumber: `LD-2026-${String(leads.length + 1).padStart(3, '0')}`,
        companyName: values.companyName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        alternatePhone: values.alternatePhone,
        industry: values.industry || 'General Industry',
        source: values.source || 'Website',
        stage: values.stage || 'New',
        priority: values.priority || 'Medium',
        estimatedValue: Number(values.expectedRevenue) || 0,
        expectedRevenue: Number(values.expectedRevenue) || 0,
        expectedClosingDate: values.expectedClosingDate,
        assignedTo: values.assignedTo || 'Vikram Seth',
        address: values.address,
        notes: values.notes,
        createdAt: new Date().toISOString().slice(0, 10),
        status: values.stage === 'Won' ? 'Won' : values.stage === 'Lost' ? 'Lost' : (values.stage || 'New'),
      };
      setLeads(prev => [newLead, ...prev]);
      message.success(`Lead ${newLead.leadNumber} created successfully!`);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDeleteLead = (id: string) => {
    Modal.confirm({
      title: 'Delete Lead',
      content: 'Are you sure you want to permanently delete this sales lead?',
      okType: 'danger',
      onOk: () => {
        setLeads(prev => prev.filter(l => l.id !== id));
        message.success('Lead deleted successfully.');
      },
    });
  };

  const handleOpenConvert = (lead: ExtendedLead) => {
    setLeadToConvert(lead);
    convertForm.setFieldsValue({
      companyName: lead.companyName,
      contactPerson: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      gstNumber: '',
      creditLimit: 500000,
      source: lead.source,
      assignedEmployee: lead.assignedTo,
    });
    setIsConvertModalOpen(true);
  };

  const handleConfirmConvert = (values: any) => {
    if (!leadToConvert) return;

    const existingCust = INITIAL_CUSTOMERS.find(c => c.name.toLowerCase() === leadToConvert.companyName.toLowerCase());
    if (!existingCust) {
      const newCust: ExtendedCustomer = {
        id: `cust_${Date.now()}`,
        code: `CUST-2026-${String(INITIAL_CUSTOMERS.length + 1).padStart(3, '0')}`,
        name: values.companyName,
        companyName: values.companyName,
        type: 'Business',
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        city: 'Chennai',
        address: leadToConvert.address || 'Standard Registered Address',
        gstNumber: values.gstNumber || '33AABCT9988M1Z0',
        source: (values.source as any) || 'Direct',
        assignedEmployee: values.assignedEmployee || 'Vikram Seth',
        creditLimit: Number(values.creditLimit) || 500000,
        currentBalance: 0,
        status: 'Active',
        notes: `Converted from Lead ${leadToConvert.leadNumber}. Lead notes: ${leadToConvert.notes || 'None'}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      INITIAL_CUSTOMERS.unshift(newCust);
    }

    setLeads(prev =>
      prev.map(l =>
        l.id === leadToConvert.id
          ? {
              ...l,
              stage: 'Won',
              status: 'Won',
              isConverted: true,
              conversionDate: new Date().toISOString().slice(0, 10),
            }
          : l
      )
    );

    message.success(`Lead ${leadToConvert.companyName} successfully converted to Customer Account!`);
    setIsConvertModalOpen(false);
  };

  const kpiCards = [
    {
      title: 'Total Active Leads',
      value: totalLeadsCount.toString(),
      growth: '+14% MoM',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Users size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Total Pipeline Value',
      value: `₹${(totalPipelineRevenue / 100000).toFixed(1)}L`,
      growth: '+18.5%',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <DollarSign size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Qualified & Progressing',
      value: qualifiedLeadsCount.toString(),
      growth: `${Math.round((qualifiedLeadsCount / (totalLeadsCount || 1)) * 100)}% Rate`,
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

  const getStageTagStyle = (stage: string) => {
    switch (stage) {
      case 'New':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'Contacted':
        return { bg: '#F3E8FF', text: '#7C3AED' };
      case 'Qualified':
        return { bg: '#E6F4EA', text: '#137333' };
      case 'Proposal':
        return { bg: '#FFEDD5', text: '#C2410C' };
      case 'Negotiation':
        return { bg: '#EEF2FF', text: '#4338CA' };
      case 'Won':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'Lost':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return { bg: '#FEF2F2', text: '#EF4444', border: '#FCA5A5' };
      case 'High':
        return { bg: '#FFF7ED', text: '#EA580C', border: '#FDBA74' };
      case 'Medium':
        return { bg: '#FAF5FF', text: '#7544D6', border: '#D8B4FE' };
      case 'Low':
      default:
        return { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' };
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
            <Users size={20} color="#FFFFFF" />
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
              Leads Management
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Capture, track, qualify, and convert commercial sales opportunities into customer accounts.
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
              placeholder="Search leads..."
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
            icon={<UserPlus size={15} />}
            onClick={handleOpenAddModal}
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
            Create Lead
          </Button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: kpi.cardBg,
              borderRadius: 16,
              padding: '16px 20px',
              border: kpi.isDark ? 'none' : '1px solid #EAE4F5',
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

      {/* 3. Table Card with exact CRM Dashboard styling and proper alignment */}
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
              <Users size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Active Opportunities & Leads
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Enterprise deal pipelines and client conversions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { label: 'All Stages', value: 'ALL' },
                { label: 'New Lead', value: 'New' },
                { label: 'Contacted', value: 'Contacted' },
                { label: 'Qualified', value: 'Qualified' },
                { label: 'Proposal Sent', value: 'Proposal' },
                { label: 'Negotiation', value: 'Negotiation' },
                { label: 'Won / Converted', value: 'Won' },
                { label: 'Lost', value: 'Lost' },
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { label: 'All Priorities', value: 'ALL' },
                { label: 'Urgent', value: 'Urgent' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' },
              ]}
            />
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 4 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredLeads.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 90 }}>
                  Lead ID
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 200 }}>
                  Company & Contact
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 120 }}>
                  Deal Value
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 120, textAlign: 'center' }}>
                  Stage
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 95, textAlign: 'center' }}>
                  Priority
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 140 }}>
                  Executive
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 110 }}>
                  Expected Close
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 140 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No leads found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((r) => {
                  const stageStyle = getStageTagStyle(r.stage);
                  const prioStyle = getPriorityStyle(r.priority);
                  const avatarUrl = avatarMap[r.assignedTo] || defaultAvatar;

                  return (
                    <tr
                      key={r.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Lead ID */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <span
                          style={{
                            backgroundColor: '#F3EEFF',
                            color: '#7544D6',
                            fontWeight: 800,
                            fontSize: 11.5,
                            padding: '3px 8px',
                            borderRadius: 6,
                            display: 'inline-block',
                            letterSpacing: '0.2px',
                          }}
                        >
                          {r.leadNumber}
                        </span>
                      </td>

                      {/* 2. Company & Contact */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12.5, lineHeight: 1.3 }}>
                          {r.companyName}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>👤 {r.contactName}</span>
                          <span>&bull;</span>
                          <span style={{ color: '#4B5563' }}>{r.industry}</span>
                        </div>
                      </td>

                      {/* 3. Deal Value */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>
                          ₹{(r.expectedRevenue || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* 4. Stage Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: stageStyle.bg,
                            color: stageStyle.text,
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: `1px solid ${stageStyle.text}22`,
                          }}
                        >
                          {r.stage}
                        </span>
                      </td>

                      {/* 5. Priority */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: prioStyle.bg,
                            color: prioStyle.text,
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: `1px solid ${prioStyle.border}`,
                          }}
                        >
                          {r.priority}
                        </span>
                      </td>

                      {/* 6. Executive with avatar */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img
                            src={avatarUrl}
                            alt={r.assignedTo}
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
                            {r.assignedTo || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* 7. Expected Close */}
                      <td style={{ padding: '12px 12px', color: '#4B5563', fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: '1px solid #F3F0FA' }}>
                        {r.expectedClosingDate || '2026-12-31'}
                      </td>

                      {/* 8. Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={4}>
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
                              onClick={() => {
                                setViewingLead(r);
                                setIsViewDrawerOpen(true);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Edit Lead">
                            <Button
                              type="text"
                              size="small"
                              style={{
                                color: '#7544D6',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<Edit size={14} />}
                              onClick={() => handleOpenEdit(r)}
                            />
                          </Tooltip>
                          {!r.isConverted && r.stage !== 'Lost' && (
                            <Tooltip title="Mark as Won & Convert">
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
                                icon={<Award size={13} />}
                                onClick={() => handleOpenConvert(r)}
                              >
                                Won
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Lead">
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
                              onClick={() => handleDeleteLead(r.id)}
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

      {/* ADD / EDIT LEAD MODAL */}
      <Modal
        open={isAddEditModalOpen}
        onCancel={() => setIsAddEditModalOpen(false)}
        title={editingLead ? `Edit Lead: ${editingLead.leadNumber}` : 'Create New Commercial Lead'}
        width={700}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveLead} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactName" label="Contact Person Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g. Ramesh Sundaram" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="ramesh@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Primary Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="alternatePhone" label="Alternate Phone">
                <Input placeholder="+91 98412 11003" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="industry" label="Industry Sector">
                <Input placeholder="e.g. Precision Engineering, Pharma, Retail" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="expectedRevenue" label="Expected Deal Value (₹)" rules={[{ required: true }]}>
                <Input type="number" placeholder="500000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedClosingDate" label="Expected Closing Date">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="source" label="Lead Source" initialValue="Website">
                <Select options={INITIAL_LEAD_SOURCES.map(s => ({ label: s.name, value: s.name }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stage" label="Pipeline Stage" initialValue="New">
                <Select
                  options={[
                    { label: 'New', value: 'New' },
                    { label: 'Contacted', value: 'Contacted' },
                    { label: 'Qualified', value: 'Qualified' },
                    { label: 'Proposal', value: 'Proposal' },
                    { label: 'Negotiation', value: 'Negotiation' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="Priority" initialValue="Medium">
                <Select
                  options={[
                    { label: 'Low', value: 'Low' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'High', value: 'High' },
                    { label: 'Urgent', value: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="assignedTo" label="Lead Owner (Assigned Employee)" initialValue="Vikram Seth">
            <Select
              options={[
                { label: 'Vikram Seth (Senior Sales)', value: 'Vikram Seth' },
                { label: 'Ananya Sharma (Enterprise Specialist)', value: 'Ananya Sharma' },
                { label: 'Admin Team', value: 'Admin Team' },
              ]}
            />
          </Form.Item>

          <Form.Item name="address" label="Office / Factory Address">
            <Input.TextArea rows={2} placeholder="Street, Industrial Area, City..." />
          </Form.Item>

          <Form.Item name="notes" label="Technical Requirements & Discussion Notes">
            <Input.TextArea rows={2} placeholder="Equipment specs, lead time commitments..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              {editingLead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW LEAD DETAILS DRAWER */}
      <Drawer
        open={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        width={560}
        title={
          viewingLead ? (
            <div>
              <span style={{ fontWeight: 700, color: '#181433' }}>{viewingLead.companyName}</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: '#5421A8' }}>({viewingLead.leadNumber})</span>
            </div>
          ) : 'Lead Details'
        }
      >
        {viewingLead && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Contact Person">{viewingLead.contactName}</Descriptions.Item>
            <Descriptions.Item label="Email Address">{viewingLead.email}</Descriptions.Item>
            <Descriptions.Item label="Phone Numbers">
              {viewingLead.phone} {viewingLead.alternatePhone && ` / ${viewingLead.alternatePhone}`}
            </Descriptions.Item>
            <Descriptions.Item label="Industry Sector">{viewingLead.industry || 'General Trade'}</Descriptions.Item>
            <Descriptions.Item label="Lead Source">{viewingLead.source}</Descriptions.Item>
            <Descriptions.Item label="Current Pipeline Stage">{viewingLead.stage}</Descriptions.Item>
            <Descriptions.Item label="Priority Level"><Tag color="purple">{viewingLead.priority}</Tag></Descriptions.Item>
            <Descriptions.Item label="Expected Deal Value">₹{viewingLead.expectedRevenue.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Expected Close Date">{viewingLead.expectedClosingDate || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Assigned Account Owner">{viewingLead.assignedTo}</Descriptions.Item>
            <Descriptions.Item label="Address">{viewingLead.address || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Discussion Notes">{viewingLead.notes || 'No notes added.'}</Descriptions.Item>
            <Descriptions.Item label="Customer Conversion Status">
              {viewingLead.isConverted ? (
                <Tag color="green">Converted to Customer ({viewingLead.conversionDate})</Tag>
              ) : (
                <Tag color="blue">Active Sales Opportunity</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* CONVERT TO CUSTOMER MODAL */}
      <Modal
        open={isConvertModalOpen}
        onCancel={() => setIsConvertModalOpen(false)}
        title={`Convert Opportunity: ${leadToConvert?.companyName} to Official Customer`}
        footer={null}
        destroyOnClose
      >
        <Form form={convertForm} layout="vertical" onFinish={handleConfirmConvert} style={{ marginTop: 14 }}>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 14 }}>
            Converting this lead marks it as <strong>Won</strong> and creates an active Customer Account in the Directory with shared Sales and Service history.
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Primary Contact" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gstNumber" label="GSTIN / Tax ID">
                <Input placeholder="33AABCT9988M1Z0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creditLimit" label="Approved Credit Limit (₹)" initialValue={500000}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsConvertModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#10B981', borderColor: '#10B981', fontWeight: 600 }}>
              Confirm Customer Conversion
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
