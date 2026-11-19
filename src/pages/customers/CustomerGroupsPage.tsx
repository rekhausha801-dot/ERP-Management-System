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
  Row,
  Col,
  message,
  Tooltip,
  Drawer,
  Descriptions,
  Divider,
} from 'antd';
import {
  Boxes,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  FileSpreadsheet,
  Download,
  Bell,
  ChevronDown,
  Layers,
  Award,
  CreditCard,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Briefcase,
  TrendingUp,
  Tag as TagIcon,
  Filter,
} from 'lucide-react';
import {
  INITIAL_CUSTOMER_GROUPS,
  CustomerGroup,
} from '../../mock/crmCustomerStore';
import { INITIAL_CUSTOMERS, ExtendedCustomer } from '../../mock/customerData';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const CustomerGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<CustomerGroup[]>(INITIAL_CUSTOMER_GROUPS);
  const [customers, setCustomers] = useState<ExtendedCustomer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [viewingGroup, setViewingGroup] = useState<CustomerGroup | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedGroupForAssign, setSelectedGroupForAssign] = useState<CustomerGroup | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  const [form] = Form.useForm();

  // Search and Filter logic
  const filteredGroups = groups.filter(g => {
    const q = search.toLowerCase();
    const matchSearch =
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      (g.groupType && g.groupType.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchType = typeFilter === 'ALL' || g.groupType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  // KPI calculations
  const totalGroups = groups.length;
  const activeGroups = groups.filter(g => g.status === 'Active').length;
  const inactiveGroups = groups.filter(g => g.status === 'Inactive').length;
  const totalAssignedCustomers = groups.reduce((acc, curr) => acc + (curr.customerCount || 0), 0);

  const kpiCards = [
    {
      title: 'Total Customer Groups',
      value: totalGroups.toString(),
      growth: '+1 New Group',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Boxes size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Active Groups',
      value: activeGroups.toString(),
      growth: `${Math.round((activeGroups / (totalGroups || 1)) * 100)}% Operational`,
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
      title: 'Assigned Accounts',
      value: totalAssignedCustomers.toString(),
      growth: 'Segmented Accounts',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Users size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Inactive Groups',
      value: inactiveGroups.toString(),
      growth: inactiveGroups > 0 ? 'Requires Review' : 'All Clear',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: inactiveGroups > 0 ? '#EF4444' : '#10B981',
      icon: <XCircle size={18} color="#FFFFFF" />,
      iconBg: '#F59E0B',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
    },
  ];

  const handleOpenAdd = () => {
    setEditingGroup(null);
    form.resetFields();
    form.setFieldsValue({
      code: `GRP-${String(groups.length + 1).padStart(2, '0')}`,
      groupType: 'Enterprise',
      pricingType: 'Group-based Pricing',
      paymentTerms: 'Net 30',
      discountPercentage: 10,
      creditDays: 30,
      defaultCreditLimit: 1000000,
      taxConfiguration: 'Standard GST 18%',
      assignedManager: 'Vikram Seth',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (grp: CustomerGroup) => {
    setEditingGroup(grp);
    form.setFieldsValue({ ...grp });
    setIsModalOpen(true);
  };

  const handleSave = (values: any) => {
    if (!editingGroup) {
      // Prevent duplicate group codes
      const isDuplicate = groups.some(g => g.code.toUpperCase() === values.code.toUpperCase());
      if (isDuplicate) {
        message.error(`A group with code ${values.code.toUpperCase()} already exists!`);
        return;
      }

      const newG: CustomerGroup = {
        id: `grp-${Date.now()}`,
        code: values.code.toUpperCase(),
        name: values.name,
        description: values.description || 'Configured classification tier.',
        groupType: values.groupType || 'Enterprise',
        pricingType: values.pricingType || 'Standard Pricing',
        paymentTerms: values.paymentTerms || 'Net 30',
        defaultCreditLimit: Number(values.defaultCreditLimit) || 1000000,
        taxConfiguration: values.taxConfiguration || 'Standard GST 18%',
        assignedManager: values.assignedManager || 'Vikram Seth',
        discountPercentage: Number(values.discountPercentage) || 0,
        creditDays: Number(values.creditDays) || 0,
        customerCount: 0,
        status: values.status || 'Active',
      };
      setGroups([...groups, newG]);
      message.success(`Customer group ${newG.name} created successfully!`);
    } else {
      setGroups(prev =>
        prev.map(g =>
          g.id === editingGroup.id
            ? {
                ...g,
                ...values,
                code: values.code.toUpperCase(),
                discountPercentage: Number(values.discountPercentage) || 0,
                creditDays: Number(values.creditDays) || 0,
                defaultCreditLimit: Number(values.defaultCreditLimit) || 0,
              }
            : g
        )
      );
      if (viewingGroup?.id === editingGroup.id) {
        setViewingGroup(prev => (prev ? { ...prev, ...values } : null));
      }
      message.success('Customer group details updated.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (grp: CustomerGroup) => {
    if (grp.customerCount > 0) {
      message.error(`Cannot delete group "${grp.name}" because it has ${grp.customerCount} assigned customer accounts. Reassign them first.`);
      return;
    }

    Modal.confirm({
      title: `Delete Customer Group "${grp.name}"`,
      content: 'Are you sure you want to permanently delete this customer classification tier?',
      okType: 'danger',
      onOk: () => {
        setGroups(prev => prev.filter(g => g.id !== grp.id));
        message.success('Customer group deleted.');
      },
    });
  };

  const handleToggleStatus = (grp: CustomerGroup) => {
    const newStatus = grp.status === 'Active' ? 'Inactive' : 'Active';
    setGroups(prev =>
      prev.map(g => (g.id === grp.id ? { ...g, status: newStatus } : g))
    );
    message.success(`Group ${grp.name} is now ${newStatus}.`);
  };

  const handleExportCSV = () => {
    const headers = ['Group Code', 'Group Name', 'Classification Type', 'Pricing Type', 'Default Discount (%)', 'Credit Period (Days)', 'Default Credit Limit (₹)', 'Payment Terms', 'Manager', 'Assigned Accounts', 'Status'];
    const rows = filteredGroups.map(g => [
      g.code,
      `"${g.name}"`,
      g.groupType || 'Enterprise',
      g.pricingType || 'Standard Pricing',
      g.discountPercentage,
      g.creditDays,
      g.defaultCreditLimit || 1000000,
      g.paymentTerms || 'Net 30',
      `"${g.assignedManager || 'Vikram Seth'}"`,
      g.customerCount,
      g.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customer_Groups_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Customer groups exported to CSV / Excel!');
  };

  const handleExportPDF = () => {
    message.info('Generating PDF statement for Customer Groups & Classification...');
    setTimeout(() => {
      message.success('Customer Groups summary PDF generated successfully!');
    }, 1200);
  };

  const handleOpenAssignModal = (grp: CustomerGroup) => {
    setSelectedGroupForAssign(grp);
    setSelectedCustomerIds([]);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedGroupForAssign || selectedCustomerIds.length === 0) {
      message.warning('Please select at least one customer account to assign.');
      return;
    }

    setGroups(prev =>
      prev.map(g =>
        g.id === selectedGroupForAssign.id
          ? { ...g, customerCount: g.customerCount + selectedCustomerIds.length }
          : g
      )
    );
    message.success(`Successfully assigned ${selectedCustomerIds.length} customer(s) to ${selectedGroupForAssign.name}!`);
    setIsAssignModalOpen(false);
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
            <Boxes size={20} color="#FFFFFF" />
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
              Customer Groups & Classification
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Organize customer accounts into business groups with configurable pricing, discounts, and payment terms.
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
              placeholder="Search groups..."
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
            Add Customer Group
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

      {/* 3. Customer Groups Table Card with exact CRM Dashboard styling */}
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
              <Boxes size={17} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Configured Classification Tiers
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Discount percentages, payment terms, and assigned customer accounts
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 130, height: 34 }}
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 160, height: 34 }}
              options={[
                { label: 'All Categories', value: 'ALL' },
                { label: 'Enterprise', value: 'Enterprise' },
                { label: 'Distributor', value: 'Distributor' },
                { label: 'SME', value: 'SME' },
                { label: 'Retail', value: 'Retail' },
                { label: 'Government', value: 'Government / Institutional' },
                { label: 'Custom', value: 'Custom' },
              ]}
            />
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 2 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredGroups.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 110 }}>
                  Group Code
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 260 }}>
                  Group Name & Description
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 130 }}>
                  Default Discount
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 150 }}>
                  Credit Period & Terms
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 140, textAlign: 'center' }}>
                  Assigned Accounts
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 95, textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8, width: 150 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No customer groups match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredGroups.map(grp => {
                  const avatarUrl = avatarMap[grp.assignedManager || ''] || defaultAvatar;

                  return (
                    <tr
                      key={grp.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Group Code */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
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
                          {grp.code}
                        </span>
                      </td>

                      {/* 2. Group Name & Description */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#1F2937',
                            fontSize: 12.5,
                            lineHeight: 1.3,
                            cursor: 'pointer',
                          }}
                          onClick={() => setViewingGroup(grp)}
                        >
                          {grp.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 3, lineHeight: 1.35 }}>
                          {grp.description}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#5421A8', marginTop: 3, fontWeight: 600 }}>
                          Pricing: {grp.pricingType || 'Group-based Pricing'} &bull; Manager: {grp.assignedManager || 'Vikram Seth'}
                        </div>
                      </td>

                      {/* 3. Default Discount */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              backgroundColor: grp.discountPercentage > 0 ? '#ECFDF5' : '#F3F4F6',
                              color: grp.discountPercentage > 0 ? '#059669' : '#6B7280',
                              fontWeight: 800,
                              fontSize: 13,
                              padding: '2px 8px',
                              borderRadius: 6,
                              display: 'inline-block',
                            }}
                          >
                            {grp.discountPercentage}% OFF
                          </span>
                        </div>
                      </td>

                      {/* 4. Credit Period & Terms */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 12 }}>
                          {grp.creditDays > 0 ? `${grp.creditDays} Days Credit` : 'Immediate Due'}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                          Terms: <strong style={{ color: '#5421A8' }}>{grp.paymentTerms || 'Net 30'}</strong>
                        </div>
                      </td>

                      {/* 5. Assigned Accounts */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: '#EFF6FF',
                            color: '#1D4ED8',
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: '1px solid #BFDBFE',
                          }}
                        >
                          👥 {grp.customerCount} Accounts
                        </span>
                      </td>

                      {/* 6. Status Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: grp.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                            color: grp.status === 'Active' ? '#15803D' : '#6B7280',
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            boxShadow: grp.status === 'Active' ? '0 1px 2px rgba(21, 128, 61, 0.15)' : 'none',
                          }}
                        >
                          {grp.status}
                        </span>
                      </td>

                      {/* 7. Quick Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={3}>
                          <Tooltip title="View Group Details">
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
                              onClick={() => setViewingGroup(grp)}
                            />
                          </Tooltip>
                          <Tooltip title="Assign Customers">
                            <Button
                              type="text"
                              size="small"
                              style={{
                                color: '#10B981',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<Users size={14} />}
                              onClick={() => handleOpenAssignModal(grp)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit Group">
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
                              onClick={() => handleOpenEdit(grp)}
                            />
                          </Tooltip>
                          <Tooltip title={grp.status === 'Active' ? 'Deactivate Group' : 'Activate Group'}>
                            <Button
                              type="text"
                              size="small"
                              style={{
                                color: grp.status === 'Active' ? '#F59E0B' : '#10B981',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<AlertCircle size={14} />}
                              onClick={() => handleToggleStatus(grp)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Group">
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
                              onClick={() => handleDelete(grp)}
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

      {/* ADD / EDIT CUSTOMER GROUP MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={editingGroup ? `Edit Group: ${editingGroup.name}` : 'Configure New Customer Group'}
        width={720}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Group Name" rules={[{ required: true, message: 'Please enter group name' }]}>
                <Input placeholder="e.g. Enterprise Corporate Accounts" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Group Code" rules={[{ required: true, message: 'Please enter unique code' }]}>
                <Input placeholder="e.g. GRP-ENT" disabled={!!editingGroup} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="groupType" label="Classification Type" initialValue="Enterprise">
                <Select
                  options={[
                    { label: 'Enterprise', value: 'Enterprise' },
                    { label: 'Distributor', value: 'Distributor' },
                    { label: 'SME', value: 'SME' },
                    { label: 'Retail', value: 'Retail' },
                    { label: 'Government / Institutional', value: 'Government / Institutional' },
                    { label: 'Custom Specification', value: 'Custom' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pricingType" label="Pricing Structure Model" initialValue="Group-based Pricing">
                <Select
                  options={[
                    { label: 'Standard Base Pricing', value: 'Standard Pricing' },
                    { label: 'Group-based Pricing (Tier Matrix)', value: 'Group-based Pricing' },
                    { label: 'Custom Contract Pricing', value: 'Custom Pricing' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="discountPercentage" label="Default Discount (%)">
                <Input type="number" placeholder="10" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="paymentTerms" label="Approved Payment Terms" initialValue="Net 30">
                <Select
                  options={[
                    { label: 'Advance Payment', value: 'Advance Payment' },
                    { label: 'Net 7 Days', value: 'Net 7' },
                    { label: 'Net 15 Days', value: 'Net 15' },
                    { label: 'Net 30 Days', value: 'Net 30' },
                    { label: 'Net 45 Days', value: 'Net 45' },
                    { label: 'Net 60 Days', value: 'Net 60' },
                    { label: 'Custom Terms', value: 'Custom' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="creditDays" label="Credit Period (Days)">
                <Input type="number" placeholder="30" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="defaultCreditLimit" label="Default Credit Ceiling (₹)" initialValue={1000000}>
                <Input type="number" placeholder="1000000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="taxConfiguration" label="Tax & GST Scheme" initialValue="Standard GST 18%">
                <Select
                  options={[
                    { label: 'Standard GST 18%', value: 'Standard GST 18%' },
                    { label: 'Concessional / SEZ 0%', value: 'Concessional / SEZ 0%' },
                    { label: 'TDS Exempt Institutional', value: 'TDS / GST Exemption Applicable' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assignedManager" label="Assigned Group Manager" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth (Senior Sales)', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma (Enterprise Specialist)', value: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Classification Scope & Qualification Criteria">
            <Input.TextArea rows={2} placeholder="Explain eligibility, commercial scope, volume thresholds..." />
          </Form.Item>

          <Form.Item name="status" label="Group Status" initialValue="Active">
            <Select
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              {editingGroup ? 'Update Customer Group' : 'Save Customer Group'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW CUSTOMER GROUP DRAWER */}
      <Drawer
        open={!!viewingGroup}
        onClose={() => setViewingGroup(null)}
        width={560}
        title={
          viewingGroup ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#1E1B4B' }}>{viewingGroup.name}</span>
              <span style={{ backgroundColor: '#F3EEFF', color: '#7544D6', fontWeight: 800, fontSize: 12, padding: '2px 8px', borderRadius: 6 }}>
                {viewingGroup.code}
              </span>
            </div>
          ) : 'Group Details'
        }
      >
        {viewingGroup && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 12, border: '1px solid #ECE8F6' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Classification Type</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#5421A8', marginTop: 2 }}>
                {viewingGroup.groupType || 'Enterprise'}
              </div>
              <div style={{ fontSize: 12.5, color: '#4B5563', marginTop: 6, lineHeight: 1.4 }}>
                {viewingGroup.description}
              </div>
            </div>

            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Group Code">{viewingGroup.code}</Descriptions.Item>
              <Descriptions.Item label="Pricing Policy">{viewingGroup.pricingType || 'Group-based Pricing'}</Descriptions.Item>
              <Descriptions.Item label="Default Discount Percentage">
                <Tag color="green" style={{ fontWeight: 700 }}>{viewingGroup.discountPercentage}% OFF</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Approved Payment Terms">{viewingGroup.paymentTerms || 'Net 30'}</Descriptions.Item>
              <Descriptions.Item label="Credit Period Allowed">{viewingGroup.creditDays} Days</Descriptions.Item>
              <Descriptions.Item label="Default Credit Limit Allowed">
                ₹{(viewingGroup.defaultCreditLimit || 1000000).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Tax & GST Setup">{viewingGroup.taxConfiguration || 'Standard GST 18%'}</Descriptions.Item>
              <Descriptions.Item label="Group Account Manager">{viewingGroup.assignedManager || 'Vikram Seth'}</Descriptions.Item>
              <Descriptions.Item label="Total Assigned Customers">
                <Tag color="blue">{viewingGroup.customerCount} Active Accounts</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Operational Status">
                <Tag color={viewingGroup.status === 'Active' ? 'green' : 'default'}>{viewingGroup.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 8 }}>
              <Button
                type="primary"
                block
                icon={<Users size={15} />}
                style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600, height: 38 }}
                onClick={() => {
                  handleOpenAssignModal(viewingGroup);
                  setViewingGroup(null);
                }}
              >
                Assign / Link More Customer Accounts
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* BULK ASSIGN CUSTOMERS MODAL */}
      <Modal
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        title={`Assign Accounts to "${selectedGroupForAssign?.name}"`}
        footer={[
          <Button key="cancel" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>,
          <Button
            key="submit"
            type="primary"
            style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600 }}
            onClick={handleConfirmAssignment}
          >
            Confirm Assignment
          </Button>,
        ]}
      >
        <div style={{ padding: '12px 0' }}>
          <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 14 }}>
            Select customer accounts from the directory to assign them to <strong>{selectedGroupForAssign?.name}</strong>. Default discount ({selectedGroupForAssign?.discountPercentage}%) and credit terms ({selectedGroupForAssign?.paymentTerms}) will apply to upcoming quotes.
          </p>
          <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #E5E7EB', borderRadius: 8, padding: 8 }}>
            {customers.map(c => {
              const isSelected = selectedCustomerIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomerIds(prev =>
                      isSelected ? prev.filter(id => id !== c.id) : [...prev, c.id]
                    );
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: isSelected ? '#F3EEFF' : '#FFFFFF',
                    cursor: 'pointer',
                    marginBottom: 4,
                    border: isSelected ? '1px solid #7544D6' : '1px solid #F3F4F6',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#1F2937', fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: '#6B7280' }}>
                      {c.code} &bull; {c.contactPerson} &bull; {c.city}
                    </div>
                  </div>
                  <Tag color={isSelected ? 'purple' : 'default'}>
                    {isSelected ? 'Selected' : 'Click to Select'}
                  </Tag>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
