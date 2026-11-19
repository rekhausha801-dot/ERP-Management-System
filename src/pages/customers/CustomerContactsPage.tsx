import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Switch,
  Row,
  Col,
  message,
  Tooltip,
  Drawer,
  Descriptions,
  Divider,
} from 'antd';
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Eye,
  FileSpreadsheet,
  Download,
  Bell,
  ChevronDown,
  Layers,
  Award,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldAlert,
  Filter,
} from 'lucide-react';
import {
  INITIAL_CUSTOMER_CONTACTS,
  CustomerContactPerson,
} from '../../mock/crmCustomerStore';
import { INITIAL_CUSTOMERS, ExtendedCustomer } from '../../mock/customerData';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const CustomerContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<CustomerContactPerson[]>(INITIAL_CUSTOMER_CONTACTS);
  const [customers, setCustomers] = useState<ExtendedCustomer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<CustomerContactPerson | null>(null);
  const [viewingContact, setViewingContact] = useState<CustomerContactPerson | null>(null);

  const [form] = Form.useForm();

  // Search & Filter Logic
  const filteredContacts = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.contactPersonName.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.designation.toLowerCase().includes(q);

    const matchCompany = companyFilter === 'ALL' || c.customerId === companyFilter;
    const matchDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const matchRole = roleFilter === 'ALL' || c.contactRole === roleFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchSearch && matchCompany && matchDept && matchRole && matchStatus;
  });

  // Calculate Key Performance Indicators (Exactly Four KPI Cards)
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.status === 'Active').length;
  const primaryContacts = contacts.filter(c => c.isPrimary).length;

  // Calculate companies with multiple contacts
  const companyContactCounts: Record<string, number> = {};
  contacts.forEach(c => {
    companyContactCounts[c.customerId] = (companyContactCounts[c.customerId] || 0) + 1;
  });
  const companiesWithMultipleContacts = Object.values(companyContactCounts).filter(cnt => cnt > 1).length;

  const kpiCards = [
    {
      title: 'Total Contacts',
      value: totalContacts.toString(),
      growth: '+3 This Quarter',
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
      title: 'Active Contacts',
      value: activeContacts.toString(),
      growth: `${Math.round((activeContacts / (totalContacts || 1)) * 100)}% Operational`,
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <CheckCircle size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Primary Contacts',
      value: primaryContacts.toString(),
      growth: 'Verified Decision Makers',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Star size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Multi-Contact Companies',
      value: companiesWithMultipleContacts.toString(),
      growth: 'Deep Account Penetration',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Building size={18} color="#FFFFFF" />,
      iconBg: '#F59E0B',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
    },
  ];

  const handleOpenAdd = () => {
    setEditingContact(null);
    form.resetFields();
    form.setFieldsValue({
      customerId: 'cust-1',
      isPrimary: false,
      status: 'Active',
      department: 'Procurement',
      contactRole: 'Procurement Specialist',
      preferredCommunication: 'Email',
      assignedAccountManager: 'Vikram Seth',
      branchLocation: 'Main Office',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cnt: CustomerContactPerson) => {
    setEditingContact(cnt);
    form.setFieldsValue({ ...cnt });
    setIsModalOpen(true);
  };

  const handleSave = (values: any) => {
    const parentCust = customers.find(c => c.id === values.customerId);
    const companyName = parentCust ? parentCust.name : 'Corporate Client';

    // Business Logic: If set as Primary, demote other contacts under the same customer
    let updatedContacts = [...contacts];
    if (values.isPrimary) {
      updatedContacts = updatedContacts.map(c =>
        c.customerId === values.customerId && (!editingContact || c.id !== editingContact.id)
          ? { ...c, isPrimary: false }
          : c
      );
    }

    if (!editingContact) {
      const newC: CustomerContactPerson = {
        id: `cnt-${Date.now()}`,
        customerId: values.customerId,
        customerName: companyName,
        contactPersonName: values.contactPersonName,
        designation: values.designation,
        department: values.department || 'Operations',
        contactRole: values.contactRole || 'Procurement Specialist',
        branchLocation: values.branchLocation || 'Headquarters',
        email: values.email,
        phone: values.phone,
        alternateEmail: values.alternateEmail,
        alternatePhone: values.alternatePhone,
        preferredCommunication: values.preferredCommunication || 'Email',
        reportingTo: values.reportingTo || 'Management',
        assignedAccountManager: values.assignedAccountManager || 'Vikram Seth',
        notes: values.notes || 'Associated stakeholder.',
        isPrimary: values.isPrimary || false,
        status: values.status || 'Active',
      };
      setContacts([newC, ...updatedContacts]);
      message.success(`New stakeholder ${newC.contactPersonName} linked to ${companyName}!`);
    } else {
      setContacts(
        updatedContacts.map(c =>
          c.id === editingContact.id
            ? {
                ...c,
                ...values,
                customerName: companyName,
              }
            : c
        )
      );
      if (viewingContact?.id === editingContact.id) {
        setViewingContact(prev => (prev ? { ...prev, ...values, customerName: companyName } : null));
      }
      message.success('Stakeholder details updated.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (cnt: CustomerContactPerson) => {
    if (cnt.isPrimary) {
      message.error(`Cannot delete Primary contact "${cnt.contactPersonName}". Designate another stakeholder as primary before removing.`);
      return;
    }

    Modal.confirm({
      title: `Remove Stakeholder "${cnt.contactPersonName}"`,
      content: `Are you sure you want to remove this contact from ${cnt.customerName}?`,
      okType: 'danger',
      onOk: () => {
        setContacts(prev => prev.filter(c => c.id !== cnt.id));
        message.success('Contact removed.');
      },
    });
  };

  const handleToggleStatus = (cnt: CustomerContactPerson) => {
    const newStatus = cnt.status === 'Active' ? 'Inactive' : 'Active';
    setContacts(prev =>
      prev.map(c => (c.id === cnt.id ? { ...c, status: newStatus } : c))
    );
    message.success(`Contact status changed to ${newStatus}.`);
  };

  const handleExportCSV = () => {
    const headers = ['Contact Name', 'Designation', 'Primary Stakeholder', 'Associated Company', 'Department', 'Contact Role', 'Official Email', 'Direct Phone', 'Branch Location', 'Account Manager', 'Status'];
    const rows = filteredContacts.map(c => [
      `"${c.contactPersonName}"`,
      `"${c.designation}"`,
      c.isPrimary ? 'YES' : 'NO',
      `"${c.customerName}"`,
      c.department,
      c.contactRole || 'Key Stakeholder',
      c.email,
      c.phone,
      `"${c.branchLocation || 'Headquarters'}"`,
      `"${c.assignedAccountManager || 'Vikram Seth'}"`,
      c.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customer_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Contact directory exported to CSV / Excel!');
  };

  const handleExportPDF = () => {
    message.info('Generating PDF roster for Customer Stakeholders...');
    setTimeout(() => {
      message.success('Customer Contacts roster PDF generated successfully!');
    }, 1200);
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
            <UserCheck size={20} color="#FFFFFF" />
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
              Customer Contact Persons & Stakeholders
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Maintain stakeholder hierarchies across Procurement, Accounts, Engineering, and Executive leadership.
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
              placeholder="Search contacts..."
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

          <Button
            type="primary"
            icon={<Plus size={15} />}
            onClick={handleOpenAdd}
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
            Add Contact
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

      {/* 3. Contact Directory Table Card with exact CRM Dashboard styling */}
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
                Contact Persons & Stakeholders
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Organizational contact matrix, decision makers, and communication preferences
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Select
              value={companyFilter}
              onChange={setCompanyFilter}
              style={{ width: 180, height: 34 }}
              options={[
                { label: 'All Companies', value: 'ALL' },
                ...customers.map(c => ({ label: c.name, value: c.id })),
              ]}
            />
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { label: 'All Departments', value: 'ALL' },
                { label: 'Procurement', value: 'Procurement' },
                { label: 'Plant Operations', value: 'Plant Operations' },
                { label: 'Supply Chain', value: 'Supply Chain' },
                { label: 'Finance & Accounts', value: 'Finance & Billing' },
                { label: 'Engineering', value: 'Engineering & Maintenance' },
                { label: 'Executive Management', value: 'Executive Management' },
              ]}
            />
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { label: 'All Roles', value: 'ALL' },
                { label: 'Decision Maker', value: 'Decision Maker' },
                { label: 'Procurement Specialist', value: 'Procurement Specialist' },
                { label: 'Technical Evaluator', value: 'Technical Evaluator' },
                { label: 'Finance / Billing', value: 'Finance / Billing' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 115, height: 34 }}
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 2 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredContacts.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, minWidth: 200 }}>
                  Contact Person
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 190 }}>
                  Associated Company
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 150 }}>
                  Department
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 140, textAlign: 'center' }}>
                  Contact Role
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 180 }}>
                  Email & Phone
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 90, textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 130 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No contact persons match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(cnt => {
                  return (
                    <tr
                      key={cnt.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Contact Person Name, Title, and Primary Flag */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: '#1F2937',
                              fontSize: 12.5,
                              cursor: 'pointer',
                            }}
                            onClick={() => setViewingContact(cnt)}
                          >
                            {cnt.contactPersonName}
                          </span>
                          {cnt.isPrimary && (
                            <span
                              style={{
                                backgroundColor: '#F3EEFF',
                                color: '#7544D6',
                                fontSize: 9.5,
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: 4,
                                border: '1px solid rgba(117, 68, 214, 0.25)',
                              }}
                            >
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                          {cnt.designation} &bull; <span style={{ color: '#9CA3AF' }}>{cnt.branchLocation || 'HQ'}</span>
                        </div>
                      </td>

                      {/* 2. Associated Company */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 600, color: '#5421A8', fontSize: 12.5 }}>
                          {cnt.customerName}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                          Rep: {cnt.assignedAccountManager || 'Vikram Seth'}
                        </div>
                      </td>

                      {/* 3. Department */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                          {cnt.department}
                        </span>
                      </td>

                      {/* 4. Contact Role */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: cnt.contactRole === 'Decision Maker' ? '#ECFDF5' : cnt.contactRole === 'Procurement Specialist' ? '#EEF2FF' : '#FAF5FF',
                            color: cnt.contactRole === 'Decision Maker' ? '#059669' : cnt.contactRole === 'Procurement Specialist' ? '#4338CA' : '#7C3AED',
                            padding: '3px 9px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {cnt.contactRole || 'Key Stakeholder'}
                        </span>
                      </td>

                      {/* 5. Email & Phone */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontSize: 11.5, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Mail size={12} color="#7544D6" /> {cnt.email}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Phone size={12} color="#10B981" /> {cnt.phone}
                        </div>
                      </td>

                      {/* 6. Status Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: cnt.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                            color: cnt.status === 'Active' ? '#15803D' : '#6B7280',
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            boxShadow: cnt.status === 'Active' ? '0 1px 2px rgba(21, 128, 61, 0.15)' : 'none',
                          }}
                        >
                          {cnt.status}
                        </span>
                      </td>

                      {/* 7. Quick Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={3}>
                          <Tooltip title="View Stakeholder Profile">
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
                              onClick={() => setViewingContact(cnt)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit Contact">
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
                              onClick={() => handleOpenEdit(cnt)}
                            />
                          </Tooltip>
                          <Tooltip title={cnt.status === 'Active' ? 'Deactivate Contact' : 'Activate Contact'}>
                            <Button
                              type="text"
                              size="small"
                              style={{
                                color: cnt.status === 'Active' ? '#F59E0B' : '#10B981',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<ShieldAlert size={14} />}
                              onClick={() => handleToggleStatus(cnt)}
                            />
                          </Tooltip>
                          <Tooltip title="Remove Contact">
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
                              onClick={() => handleDelete(cnt)}
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

      {/* ADD / EDIT STAKEHOLDER MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={editingContact ? `Edit Stakeholder: ${editingContact.contactPersonName}` : 'Add New Stakeholder / Contact Person'}
        width={720}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="customerId" label="Associated Customer Company" rules={[{ required: true, message: 'Please select company' }]}>
            <Select
              options={customers.map(c => ({
                label: `${c.name} (${c.code})`,
                value: c.id,
              }))}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactPersonName" label="Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
                <Input placeholder="e.g. Ramesh Sundaram" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="designation" label="Designation / Position" rules={[{ required: true, message: 'Please enter title' }]}>
                <Input placeholder="e.g. Director of Supply Chain" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="department" label="Department" initialValue="Procurement">
                <Select
                  options={[
                    { label: 'Procurement & Purchase', value: 'Procurement' },
                    { label: 'Plant Operations', value: 'Plant Operations' },
                    { label: 'Supply Chain & Logistics', value: 'Supply Chain' },
                    { label: 'Finance & Accounts', value: 'Finance & Billing' },
                    { label: 'Engineering & Maintenance', value: 'Engineering & Maintenance' },
                    { label: 'Executive Management', value: 'Executive Management' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contactRole" label="Stakeholder Role" initialValue="Procurement Specialist">
                <Select
                  options={[
                    { label: 'Decision Maker', value: 'Decision Maker' },
                    { label: 'Procurement Specialist', value: 'Procurement Specialist' },
                    { label: 'Technical Evaluator', value: 'Technical Evaluator' },
                    { label: 'Finance / Billing', value: 'Finance / Billing' },
                    { label: 'Operations Lead', value: 'Operations Lead' },
                    { label: 'Executive Sponsor', value: 'Executive Sponsor' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="branchLocation" label="Branch / Facility Location" initialValue="Headquarters">
                <Input placeholder="e.g. Chennai Plant 2" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Official Business Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="ramesh@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Primary Phone / Mobile" rules={[{ required: true }]}>
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="alternateEmail" label="Alternate / Personal Email">
                <Input placeholder="ramesh.personal@gmail.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alternatePhone" label="Alternate Phone / Desk Extension">
                <Input placeholder="+91 98412 11003" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="preferredCommunication" label="Preferred Channel" initialValue="Email">
                <Select
                  options={[
                    { label: 'Official Email', value: 'Email' },
                    { label: 'Phone Call', value: 'Phone Call' },
                    { label: 'WhatsApp', value: 'WhatsApp' },
                    { label: 'In-Person Meeting', value: 'In-Person' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="reportingTo" label="Reports To (Supervisor)">
                <Input placeholder="e.g. Managing Director" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assignedAccountManager" label="Assigned Sales Rep" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth (Senior Sales)', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma (Enterprise Specialist)', value: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Stakeholder Notes & Background Context">
            <Input.TextArea rows={2} placeholder="Authority limits, signing powers, communication instructions..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isPrimary" label="Designate as Primary Contact for Company" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Contact Status" initialValue="Active">
                <Select
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              {editingContact ? 'Update Stakeholder' : 'Save Stakeholder'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW STAKEHOLDER DETAILS DRAWER */}
      <Drawer
        open={!!viewingContact}
        onClose={() => setViewingContact(null)}
        width={560}
        title={
          viewingContact ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#1E1B4B' }}>{viewingContact.contactPersonName}</span>
              {viewingContact.isPrimary && (
                <span style={{ backgroundColor: '#F3EEFF', color: '#7544D6', fontWeight: 800, fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>
                  PRIMARY STAKEHOLDER
                </span>
              )}
            </div>
          ) : 'Contact Profile'
        }
      >
        {viewingContact && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 12, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Associated Customer Account</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#5421A8', marginTop: 2 }}>
                {viewingContact.customerName}
              </div>
              <div style={{ fontSize: 12.5, color: '#4B5563', marginTop: 6 }}>
                <strong>{viewingContact.designation}</strong> &bull; {viewingContact.department}
              </div>
            </div>

            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Contact Role">
                <Tag color="purple">{viewingContact.contactRole || 'Key Stakeholder'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Branch Facility">{viewingContact.branchLocation || 'Headquarters'}</Descriptions.Item>
              <Descriptions.Item label="Official Email">{viewingContact.email}</Descriptions.Item>
              <Descriptions.Item label="Primary Phone">{viewingContact.phone}</Descriptions.Item>
              <Descriptions.Item label="Alternate Email">{viewingContact.alternateEmail || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Alternate Phone">{viewingContact.alternatePhone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Preferred Communication Channel">
                <Tag color="blue">{viewingContact.preferredCommunication || 'Email'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Supervisory Reporting To">{viewingContact.reportingTo || 'Management'}</Descriptions.Item>
              <Descriptions.Item label="Assigned Account Manager">{viewingContact.assignedAccountManager || 'Vikram Seth'}</Descriptions.Item>
              <Descriptions.Item label="Stakeholder Notes">{viewingContact.notes || 'No special notes logged.'}</Descriptions.Item>
              <Descriptions.Item label="Account Status">
                <Tag color={viewingContact.status === 'Active' ? 'green' : 'default'}>{viewingContact.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 8 }}>
              <Button
                type="primary"
                block
                icon={<Edit size={15} />}
                style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600, height: 38 }}
                onClick={() => {
                  handleOpenEdit(viewingContact);
                  setViewingContact(null);
                }}
              >
                Edit Stakeholder Details
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
