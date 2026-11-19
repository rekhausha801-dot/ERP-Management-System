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
  Drawer,
  Tabs,
  Row,
  Col,
  message,
  Tooltip,
  Divider,
  Descriptions,
  Badge,
  Upload,
  Timeline,
} from 'antd';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload as UploadIcon,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  FileText,
  ShoppingBag,
  Wrench,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar,
  Send,
  HelpCircle,
  Bell,
  ChevronDown,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  FileCheck,
  Briefcase,
  DollarSign,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { StatusBadge } from '../../components';
import {
  ExtendedCustomer,
  INITIAL_CUSTOMERS,
  INITIAL_FOLLOW_UPS,
  INITIAL_COMMUNICATIONS,
  CustomerFollowUp,
  CustomerCommunication,
} from '../../mock/customerData';
import {
  MOCK_ENQUIRIES,
  MOCK_QUOTATIONS,
  MOCK_SALES_ORDERS,
  MOCK_PAYMENTS,
  MOCK_SERVICE_TICKETS,
  MOCK_INVOICES,
} from '../../mock/salesServiceData';
import { INITIAL_SALES_ACTIVITIES } from '../../mock/crmCustomerStore';
import type { Enquiry, Quotation, SalesOrder, Payment, ServiceTicket, Invoice } from '../../types';

const avatarMap: Record<string, string> = {
  'Vikram Seth': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
  'Ananya Sharma': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
};

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80';

export const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<ExtendedCustomer[]>(INITIAL_CUSTOMERS);
  const [followUps, setFollowUps] = useState<CustomerFollowUp[]>(INITIAL_FOLLOW_UPS);
  const [communications, setCommunications] = useState<CustomerCommunication[]>(INITIAL_COMMUNICATIONS);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [repFilter, setRepFilter] = useState<string>('ALL');
  const [balanceFilter, setBalanceFilter] = useState<string>('ALL');

  // Modal / Drawer States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ExtendedCustomer | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ExtendedCustomer | null>(null);

  // Action Modals from Profile (Enquiry, Quote, FollowUp, Note)
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [enquiryForm] = Form.useForm();
  const [followUpForm] = Form.useForm();
  const [commForm] = Form.useForm();

  // Statistics
  const totalCustomersCount = customers.length;
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;
  const totalReceivables = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0);
  const enterpriseCount = customers.filter(c => c.category === 'Enterprise').length;

  // Search and Filter logic
  const filteredCustomers = customers.filter((cust) => {
    const query = search.toLowerCase();
    const matchesSearch =
      cust.name.toLowerCase().includes(query) ||
      cust.code.toLowerCase().includes(query) ||
      cust.contactPerson.toLowerCase().includes(query) ||
      cust.email.toLowerCase().includes(query) ||
      cust.phone.toLowerCase().includes(query) ||
      (cust.city && cust.city.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || cust.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || cust.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || cust.category === categoryFilter;
    const matchesRep = repFilter === 'ALL' || cust.assignedEmployee === repFilter;
    const matchesBalance =
      balanceFilter === 'ALL' ||
      (balanceFilter === 'OUTSTANDING' && (cust.currentBalance || 0) > 0) ||
      (balanceFilter === 'CLEAR' && (cust.currentBalance || 0) === 0);

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesRep && matchesBalance;
  });

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setRepFilter('ALL');
    setBalanceFilter('ALL');
  };

  // Open Add / Edit Modal
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'Active',
      type: 'Business',
      category: 'Enterprise',
      country: 'India',
      source: 'Direct',
      creditLimit: 500000,
      assignedEmployee: 'Vikram Seth',
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (cust: ExtendedCustomer) => {
    setEditingCustomer(cust);
    form.setFieldsValue({
      ...cust,
      companyName: cust.companyName || cust.name,
    });
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomer = (values: any) => {
    if (!editingCustomer) {
      const isDuplicate = customers.some(
        c => c.email.toLowerCase() === values.email.toLowerCase() || c.phone === values.phone
      );
      if (isDuplicate) {
        message.error('A customer with this email or phone number already exists!');
        return;
      }

      const newCust: ExtendedCustomer = {
        id: `cust-${Date.now()}`,
        code: `CUST-00${customers.length + 1}`,
        name: values.companyName || values.name,
        companyName: values.companyName || values.name,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        alternatePhone: values.alternatePhone,
        gstNumber: values.gstNumber || 'N/A',
        panNumber: values.panNumber || 'N/A',
        type: values.type || 'Business',
        category: values.category || 'Enterprise',
        address: values.address || '',
        city: values.city || '',
        state: values.state || '',
        country: values.country || 'India',
        pincode: values.pincode || '',
        source: values.source || 'Direct',
        assignedEmployee: values.assignedEmployee || 'Vikram Seth',
        creditLimit: Number(values.creditLimit) || 0,
        currentBalance: 0,
        status: values.status || 'Active',
        notes: values.notes || '',
        totalOrdersValue: 0,
        totalServiceTickets: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setCustomers([newCust, ...customers]);
      message.success('New customer account created successfully!');
    } else {
      setCustomers(prev =>
        prev.map(c =>
          c.id === editingCustomer.id
            ? {
                ...c,
                ...values,
                name: values.companyName || values.name,
                companyName: values.companyName || values.name,
                creditLimit: Number(values.creditLimit) || 0,
              }
            : c
        )
      );
      if (selectedCustomer?.id === editingCustomer.id) {
        setSelectedCustomer(prev => (prev ? { ...prev, ...values, name: values.companyName || values.name } : null));
      }
      message.success('Customer details updated successfully!');
    }

    setIsAddEditModalOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    Modal.confirm({
      title: 'Delete Customer Record',
      content: 'Are you sure you want to delete this customer? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        if (selectedCustomer?.id === id) {
          setIsProfileDrawerOpen(false);
        }
        message.success('Customer removed successfully.');
      },
    });
  };

  const handleToggleStatus = (cust: ExtendedCustomer) => {
    const newStatus = cust.status === 'Active' ? 'Inactive' : 'Active';
    setCustomers(prev =>
      prev.map(c => (c.id === cust.id ? { ...c, status: newStatus } : c))
    );
    message.success(`Customer status set to ${newStatus}.`);
  };

  const handleOpenProfile = (cust: ExtendedCustomer) => {
    setSelectedCustomer(cust);
    setIsProfileDrawerOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Code', 'Company Name', 'Customer Type', 'Category', 'Contact Person', 'Email', 'Phone', 'City', 'State', 'GSTIN', 'Credit Limit', 'Balance Due', 'Assigned Sales Executive', 'Status'];
    const rows = filteredCustomers.map(c => [
      c.code,
      `"${c.name}"`,
      c.type,
      c.category || 'Standard',
      `"${c.contactPerson}"`,
      c.email,
      c.phone,
      c.city,
      c.state || '',
      c.gstNumber || '',
      c.creditLimit,
      c.currentBalance,
      `"${c.assignedEmployee || 'Unassigned'}"`,
      c.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customer_Directory_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Customer Directory exported to CSV / Excel!');
  };

  const handleExportPDF = () => {
    message.info('Generating PDF statement for filtered Customer Directory...');
    setTimeout(() => {
      message.success('Customer Directory PDF generated successfully!');
    }, 1200);
  };

  const handleCreateEnquiry = (values: any) => {
    if (!selectedCustomer) return;
    const newComm: CustomerCommunication = {
      id: `comm-${Date.now()}`,
      customerId: selectedCustomer.id,
      channel: 'Email',
      subject: `New Enquiry Logged: ${values.subject}`,
      summary: `Enquiry logged for ${values.category || 'Product'} with priority ${values.priority}. Requirements: ${values.notes || 'None'}`,
      timestamp: new Date().toLocaleString(),
      byUser: 'Vikram Seth',
    };
    setCommunications([newComm, ...communications]);
    message.success(`Enquiry registered and linked to CRM pipeline for ${selectedCustomer.name}!`);
    setIsEnquiryModalOpen(false);
    enquiryForm.resetFields();
  };

  const handleCreateFollowUp = (values: any) => {
    if (!selectedCustomer) return;
    const newFollowUp: CustomerFollowUp = {
      id: `flw-${Date.now()}`,
      customerId: selectedCustomer.id,
      type: values.type,
      date: values.date,
      time: values.time || '10:00 AM',
      assignedTo: values.assignedTo || selectedCustomer.assignedEmployee || 'Vikram Seth',
      status: 'Scheduled',
      notes: values.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFollowUps([newFollowUp, ...followUps]);
    message.success(`Follow-up scheduled with ${selectedCustomer.contactPerson}!`);
    setIsFollowUpModalOpen(false);
    followUpForm.resetFields();
  };

  const handleAddCommunication = (values: any) => {
    if (!selectedCustomer) return;
    const newComm: CustomerCommunication = {
      id: `comm-${Date.now()}`,
      customerId: selectedCustomer.id,
      channel: values.channel,
      subject: values.subject,
      summary: values.summary,
      timestamp: new Date().toLocaleString(),
      byUser: values.byUser || 'Janani D',
    };
    setCommunications([newComm, ...communications]);
    message.success('Interaction note recorded successfully!');
    setIsCommModalOpen(false);
    commForm.resetFields();
  };

  // Top 4 KPI Cards matching the exact CRM Dashboard color scheme
  const kpiCards = [
    {
      title: 'Total Customers',
      value: totalCustomersCount.toString(),
      growth: '+18% MoM',
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
      title: 'Active Customers',
      value: activeCustomersCount.toString(),
      growth: `${Math.round((activeCustomersCount / (totalCustomersCount || 1)) * 100)}% Active`,
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
      title: 'Total Receivables',
      value: `₹${(totalReceivables / 100000).toFixed(2)}L`,
      growth: 'Verified Dues',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <CreditCard size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Enterprise Accounts',
      value: enterpriseCount.toString(),
      growth: '+2 Key Clients',
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

  // Related Records for Selected Customer Profile
  const customerQuotations = selectedCustomer
    ? MOCK_QUOTATIONS.filter(
        q =>
          q.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          selectedCustomer.name.toLowerCase().includes(q.customerName.toLowerCase())
      )
    : [];

  const customerOrders = selectedCustomer
    ? MOCK_SALES_ORDERS.filter(
        o =>
          o.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          selectedCustomer.name.toLowerCase().includes(o.customerName.toLowerCase())
      )
    : [];

  const customerServiceTickets = selectedCustomer
    ? MOCK_SERVICE_TICKETS.filter(
        s =>
          s.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          selectedCustomer.name.toLowerCase().includes(s.customerName.toLowerCase())
      )
    : [];

  const customerPayments = selectedCustomer
    ? MOCK_PAYMENTS.filter(
        p =>
          p.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
          selectedCustomer.name.toLowerCase().includes(p.customerName.toLowerCase())
      )
    : [];

  const customerFollowUps = selectedCustomer
    ? followUps.filter(f => f.customerId === selectedCustomer.id)
    : [];

  const customerComms = selectedCustomer
    ? communications.filter(c => c.customerId === selectedCustomer.id)
    : [];

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
              Customer Directory & CRM 360°
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '3px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              Manage customer profiles, business relationships, sales history, credit limits, and customer interactions in one place.
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
              placeholder="Search customers..."
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
            Add Customer
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

      {/* 3. Customer Directory Table Card */}
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
                Customer Directory
              </span>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Enterprise accounts, receivables, and CRM 360° portfolio
              </div>
            </div>
          </div>

          {/* Quick Filters Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Enterprise', value: 'Business' },
                { label: 'Individual', value: 'Individual' },
              ]}
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Groups', value: 'ALL' },
                { label: 'Enterprise', value: 'Enterprise' },
                { label: 'Distributor', value: 'Distributor' },
                { label: 'SME', value: 'SME' },
                { label: 'Retailer', value: 'Retailer' },
              ]}
            />
            <Select
              value={balanceFilter}
              onChange={setBalanceFilter}
              style={{ width: 155, height: 34 }}
              options={[
                { label: 'All Balances', value: 'ALL' },
                { label: 'With Outstanding', value: 'OUTSTANDING' },
                { label: 'Zero Balance', value: 'CLEAR' },
              ]}
            />
            <Button
              onClick={handleClearFilters}
              style={{
                height: 34,
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 600,
                color: '#6B7280',
              }}
            >
              Clear
            </Button>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginLeft: 2 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredCustomers.length}</strong>
            </div>
          </div>
        </div>

        {/* Clean Dashboard-Style Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, width: 100 }}>
                  Customer Code
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 200 }}>
                  Company Name & Contact
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 170 }}>
                  Email & Phone
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 120 }}>
                  Location
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', width: 110, textAlign: 'center' }}>
                  Customer Type
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 120 }}>
                  Total Sales
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 130 }}>
                  Outstanding
                </th>
                <th style={{ padding: '9px 12px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 140 }}>
                  Credit Utilization
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
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '36px', textAlign: 'center', color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>
                    No customer accounts match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((r) => {
                  const creditLimit = r.creditLimit || 500000;
                  const balance = r.currentBalance || 0;
                  const utilizationPct = Math.min(100, Math.round((balance / (creditLimit || 1)) * 100));
                  const avatarUrl = avatarMap[r.assignedEmployee || ''] || defaultAvatar;

                  return (
                    <tr
                      key={r.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* 1. Customer Code */}
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
                          {r.code}
                        </span>
                      </td>

                      {/* 2. Company & Primary Contact */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: '#1F2937',
                            fontSize: 12.5,
                            lineHeight: 1.3,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenProfile(r)}
                        >
                          {r.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>👤 {r.contactPerson}</span>
                          <span>&bull;</span>
                          <span style={{ color: '#5421A8', fontWeight: 600 }}>{r.assignedEmployee || 'Vikram Seth'}</span>
                        </div>
                      </td>

                      {/* 3. Email & Phone */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontSize: 11.5, color: '#374151', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Mail size={12} color="#7544D6" /> {r.email}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Phone size={12} color="#10B981" /> {r.phone}
                        </div>
                      </td>

                      {/* 4. Location */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#1F2937', fontSize: 12 }}>
                          {r.city || 'Chennai'}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 1 }}>
                          {r.state || 'Tamil Nadu'}
                        </div>
                      </td>

                      {/* 5. Customer Type */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: r.category === 'Enterprise' ? '#EEF2FF' : r.category === 'Distributor' ? '#ECFDF5' : '#FAF5FF',
                            color: r.category === 'Enterprise' ? '#4338CA' : r.category === 'Distributor' ? '#059669' : '#7C3AED',
                            padding: '3px 9px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            border: '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {r.category || r.type}
                        </span>
                      </td>

                      {/* 6. Total Sales */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, color: '#1F2937', fontSize: 12.5 }}>
                          ₹{(r.totalOrdersValue || 1850000).toLocaleString()}
                        </span>
                      </td>

                      {/* 7. Outstanding Balance */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 12.5,
                            color: balance > 0 ? '#DC2626' : '#10B981',
                          }}
                        >
                          ₹{balance.toLocaleString()}
                        </span>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
                          Limit: ₹{(creditLimit / 100000).toFixed(1)}L
                        </div>
                      </td>

                      {/* 8. Credit Utilization Progress */}
                      <td style={{ padding: '12px 12px', borderBottom: '1px solid #F3F0FA', minWidth: 130 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#4B5563', marginBottom: 3 }}>
                          <span>{utilizationPct}%</span>
                          <span style={{ color: '#9CA3AF' }}>Avail: ₹{((creditLimit - balance) / 1000).toFixed(0)}k</span>
                        </div>
                        <div style={{ width: '100%', height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${utilizationPct}%`,
                              height: '100%',
                              backgroundColor: utilizationPct > 80 ? '#EF4444' : utilizationPct > 40 ? '#F59E0B' : '#10B981',
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </td>

                      {/* 9. Status Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            backgroundColor: r.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                            color: r.status === 'Active' ? '#15803D' : '#6B7280',
                            padding: '3px 10px',
                            borderRadius: 14,
                            fontSize: 10.5,
                            fontWeight: 700,
                            display: 'inline-block',
                            boxShadow: r.status === 'Active' ? '0 1px 2px rgba(21, 128, 61, 0.15)' : 'none',
                          }}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td style={{ padding: '12px 12px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                        <Space size={3}>
                          <Tooltip title="View CRM 360° Profile">
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
                              onClick={() => handleOpenProfile(r)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit Customer">
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
                              onClick={() => handleOpenEditModal(r)}
                            />
                          </Tooltip>
                          <Tooltip title={r.status === 'Active' ? 'Deactivate Customer' : 'Activate Customer'}>
                            <Button
                              type="text"
                              size="small"
                              style={{
                                color: r.status === 'Active' ? '#F59E0B' : '#10B981',
                                width: 26,
                                height: 26,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                              }}
                              icon={<AlertCircle size={14} />}
                              onClick={() => handleToggleStatus(r)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete Record">
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
                              onClick={() => handleDeleteCustomer(r.id)}
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

      {/* ========================================================= */}
      {/* 360° CUSTOMER PROFILE DRAWER                             */}
      {/* ========================================================= */}
      <Drawer
        open={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        width={900}
        title={
          selectedCustomer ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#1E1B4B' }}>
                  {selectedCustomer.name}
                </span>
                <span style={{ backgroundColor: '#F3EEFF', color: '#7544D6', fontWeight: 800, fontSize: 12, padding: '2px 8px', borderRadius: 6 }}>
                  {selectedCustomer.code}
                </span>
              </div>
              <span
                style={{
                  backgroundColor: selectedCustomer.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                  color: selectedCustomer.status === 'Active' ? '#15803D' : '#6B7280',
                  padding: '3px 10px',
                  borderRadius: 14,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {selectedCustomer.status}
              </span>
            </div>
          ) : (
            'Customer 360° Profile'
          )
        }
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<Plus size={14} />}
              onClick={() => setIsEnquiryModalOpen(true)}
              style={{ background: '#5421A8', borderColor: '#5421A8', borderRadius: 6, fontWeight: 600 }}
            >
              New Enquiry
            </Button>
            <Button
              size="small"
              icon={<Clock size={14} />}
              onClick={() => setIsFollowUpModalOpen(true)}
              style={{ borderRadius: 6, fontWeight: 600 }}
            >
              Schedule Follow-up
            </Button>
            <Button
              size="small"
              icon={<MessageSquare size={14} />}
              onClick={() => setIsCommModalOpen(true)}
              style={{ borderRadius: 6, fontWeight: 600 }}
            >
              Log Note
            </Button>
          </Space>
        }
      >
        {selectedCustomer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Header Snapshot Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid #ECE8F6',
                boxShadow: '0 2px 10px rgba(84, 33, 168, 0.04)',
              }}
            >
              <Row gutter={[20, 12]}>
                <Col span={6}>
                  <div style={{ fontSize: 11.5, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Primary Contact</div>
                  <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 14, marginTop: 2 }}>{selectedCustomer.contactPerson}</div>
                  <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>📞 {selectedCustomer.phone}</div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 11.5, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Official Email & Tax ID</div>
                  <div style={{ fontWeight: 600, color: '#1E1B4B', fontSize: 13, marginTop: 2 }}>✉️ {selectedCustomer.email}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>GSTIN: <strong style={{ color: '#5421A8' }}>{selectedCustomer.gstNumber || 'N/A'}</strong></div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 11.5, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Credit & Balance</div>
                  <div style={{ fontWeight: 800, color: (selectedCustomer.currentBalance || 0) > 0 ? '#DC2626' : '#10B981', fontSize: 14, marginTop: 2 }}>
                    Due: ₹{(selectedCustomer.currentBalance || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                    Limit: ₹{(selectedCustomer.creditLimit || 500000).toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 11.5, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Sales Representative</div>
                  <div style={{ fontWeight: 700, color: '#5421A8', fontSize: 13, marginTop: 2 }}>
                    {selectedCustomer.assignedEmployee || 'Vikram Seth'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                    Type: <Tag color="purple">{selectedCustomer.category || selectedCustomer.type}</Tag>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Profile Tabs */}
            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: 'overview',
                  label: 'Overview & Details',
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Descriptions title="Account & Registration Details" bordered size="small" column={2}>
                        <Descriptions.Item label="Customer Code">{selectedCustomer.code}</Descriptions.Item>
                        <Descriptions.Item label="Company Name">{selectedCustomer.name}</Descriptions.Item>
                        <Descriptions.Item label="Customer Type">{selectedCustomer.type}</Descriptions.Item>
                        <Descriptions.Item label="Customer Group">{selectedCustomer.category || 'Standard'}</Descriptions.Item>
                        <Descriptions.Item label="Registration Date">{selectedCustomer.createdAt || '2025-01-15'}</Descriptions.Item>
                        <Descriptions.Item label="Customer Status">{selectedCustomer.status}</Descriptions.Item>
                        <Descriptions.Item label="Assigned Sales Rep">{selectedCustomer.assignedEmployee || 'Vikram Seth'}</Descriptions.Item>
                        <Descriptions.Item label="Payment Terms">Net 30 Days</Descriptions.Item>
                        <Descriptions.Item label="Billing Address" span={2}>
                          {selectedCustomer.address ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state} - ${selectedCustomer.pincode}` : 'No address registered'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shipping Address" span={2}>
                          {selectedCustomer.address ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state} - ${selectedCustomer.pincode}` : 'Same as billing address'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Account Notes" span={2}>
                          {selectedCustomer.notes || 'No special notes logged for this customer account.'}
                        </Descriptions.Item>
                      </Descriptions>

                      {/* Scheduled Follow-ups Snapshot */}
                      <Card
                        size="small"
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5421A8' }}>
                            <Clock size={16} /> Upcoming Scheduled Follow-ups
                          </div>
                        }
                      >
                        {customerFollowUps.length === 0 ? (
                          <div style={{ color: '#9CA3AF', fontSize: 13, padding: '8px 0' }}>
                            No follow-ups scheduled currently.
                          </div>
                        ) : (
                          customerFollowUps.map(f => (
                            <div
                              key={f.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                background: '#F9FAFB',
                                borderRadius: 8,
                                marginBottom: 6,
                              }}
                            >
                              <div>
                                <Tag color="purple">{f.type}</Tag>
                                <span style={{ fontWeight: 600 }}>{f.date} at {f.time}</span>
                                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                                  {f.notes} (Assigned: {f.assignedTo})
                                </div>
                              </div>
                              <Tag color={f.status === 'Completed' ? 'green' : 'blue'}>{f.status}</Tag>
                            </div>
                          ))
                        )}
                      </Card>
                    </div>
                  ),
                },
                {
                  key: 'sales-tab',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShoppingBag size={14} /> Sales History & Orders
                    </span>
                  ),
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Divider titlePlacement="left" style={{ margin: '8px 0', fontSize: 13, color: '#5421A8' }}>
                        Commercial Quotations
                      </Divider>
                      <Table
                        size="small"
                        pagination={false}
                        dataSource={customerQuotations}
                        rowKey="id"
                        columns={[
                          { title: 'Quote #', dataIndex: 'quoteNumber', key: 'quoteNumber', render: t => <span style={{ fontWeight: 600, color: '#5421A8' }}>{t}</span> },
                          { title: 'Issue Date', dataIndex: 'issueDate', key: 'issueDate' },
                          { title: 'Total Amount', dataIndex: 'grandTotal', key: 'grandTotal', render: v => `₹${v.toLocaleString()}` },
                          { title: 'Status', dataIndex: 'status', key: 'status', render: st => <StatusBadge status={st} /> },
                        ]}
                        locale={{ emptyText: 'No quotations found for this customer.' }}
                      />

                      <Divider titlePlacement="left" style={{ margin: '8px 0', fontSize: 13, color: '#5421A8' }}>
                        Confirmed Sales Orders
                      </Divider>
                      <Table
                        size="small"
                        pagination={false}
                        dataSource={customerOrders}
                        rowKey="id"
                        columns={[
                          { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber', render: t => <span style={{ fontWeight: 600, color: '#10B981' }}>{t}</span> },
                          { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
                          { title: 'Expected Delivery', dataIndex: 'expectedDelivery', key: 'expectedDelivery' },
                          { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: v => `₹${v.toLocaleString()}` },
                          { title: 'Delivery Status', dataIndex: 'deliveryStatus', key: 'deliveryStatus', render: s => <Tag color="geekblue">{s}</Tag> },
                        ]}
                        locale={{ emptyText: 'No sales orders logged yet.' }}
                      />

                      <Divider titlePlacement="left" style={{ margin: '8px 0', fontSize: 13, color: '#5421A8' }}>
                        Payment Receipts & Collections
                      </Divider>
                      <Table
                        size="small"
                        pagination={false}
                        dataSource={customerPayments}
                        rowKey="id"
                        columns={[
                          { title: 'Receipt #', dataIndex: 'receiptNumber', key: 'receiptNumber' },
                          { title: 'Invoice Ref', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
                          { title: 'Date', dataIndex: 'paymentDate', key: 'paymentDate' },
                          { title: 'Method', dataIndex: 'paymentMethod', key: 'paymentMethod', render: m => <Tag color="blue">{m}</Tag> },
                          { title: 'Amount Paid', dataIndex: 'amount', key: 'amount', render: a => <span style={{ fontWeight: 700, color: '#10B981' }}>₹{a.toLocaleString()}</span> },
                        ]}
                        locale={{ emptyText: 'No payments recorded.' }}
                      />
                    </div>
                  ),
                },
                {
                  key: 'financial-tab',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CreditCard size={14} /> Invoices & Credit Limits
                    </span>
                  ),
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Card size="small" style={{ borderRadius: 10, border: '1px solid #ECE8F6' }}>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>Credit Ceilings</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', marginTop: 4 }}>
                              ₹{(selectedCustomer.creditLimit || 500000).toLocaleString()}
                            </div>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ borderRadius: 10, border: '1px solid #ECE8F6' }}>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>Current Receivables</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: (selectedCustomer.currentBalance || 0) > 0 ? '#DC2626' : '#10B981', marginTop: 4 }}>
                              ₹{(selectedCustomer.currentBalance || 0).toLocaleString()}
                            </div>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ borderRadius: 10, border: '1px solid #ECE8F6' }}>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>Available Headroom</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                              ₹{((selectedCustomer.creditLimit || 500000) - (selectedCustomer.currentBalance || 0)).toLocaleString()}
                            </div>
                          </Card>
                        </Col>
                      </Row>

                      <Descriptions title="Financial & Tax Registration" bordered size="small" column={2}>
                        <Descriptions.Item label="GSTIN">{selectedCustomer.gstNumber || '33AABCT9988M1Z0'}</Descriptions.Item>
                        <Descriptions.Item label="PAN Number">{selectedCustomer.panNumber || 'AABCT9988M'}</Descriptions.Item>
                        <Descriptions.Item label="Approved Payment Terms">30 Days Net EOM</Descriptions.Item>
                        <Descriptions.Item label="Credit Rating">Grade A+ (Prime Enterprise)</Descriptions.Item>
                      </Descriptions>
                    </div>
                  ),
                },
                {
                  key: 'crm-timeline',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={14} /> Interaction Logs & Activities
                    </span>
                  ),
                  children: (
                    <div style={{ paddingTop: 10 }}>
                      {customerComms.length === 0 ? (
                        <div style={{ color: '#9CA3AF', textAlign: 'center', padding: '24px 0' }}>
                          No customer communications recorded yet.
                        </div>
                      ) : (
                        <Timeline
                          items={customerComms.map(c => ({
                            color: c.channel === 'Email' ? '#5421A8' : c.channel === 'WhatsApp' ? '#10B981' : '#3B82F6',
                            children: (
                              <div style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <Tag color={c.channel === 'Email' ? 'purple' : c.channel === 'WhatsApp' ? 'green' : 'blue'}>
                                    {c.channel}
                                  </Tag>
                                  <span style={{ fontWeight: 600, color: '#181433' }}>{c.subject}</span>
                                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{c.timestamp}</span>
                                </div>
                                <div style={{ color: '#4B5563', fontSize: 13, marginTop: 4 }}>
                                  {c.summary}
                                </div>
                                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                                  Logged by: {c.byUser}
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* ========================================================= */}
      {/* ADD / EDIT CUSTOMER MODAL                                 */}
      {/* ========================================================= */}
      <Modal
        open={isAddEditModalOpen}
        onCancel={() => setIsAddEditModalOpen(false)}
        title={editingCustomer ? `Edit Customer - ${editingCustomer.code}` : 'Add New Enterprise Customer'}
        width={720}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCustomer}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Company / Enterprise Name"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="e.g. Apex Precision Tools Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="Primary Contact Person"
                rules={[{ required: true, message: 'Please enter primary contact' }]}
              >
                <Input placeholder="e.g. Ramesh Sundaram" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
              >
                <Input placeholder="ramesh@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Primary Phone Number"
                rules={[{ required: true, message: 'Phone required' }]}
              >
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Customer Type" initialValue="Business">
                <Select
                  options={[
                    { label: 'Business Enterprise', value: 'Business' },
                    { label: 'Individual Trader', value: 'Individual' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="category" label="Customer Group" initialValue="Enterprise">
                <Select
                  options={[
                    { label: 'Enterprise', value: 'Enterprise' },
                    { label: 'Distributor', value: 'Distributor' },
                    { label: 'SME', value: 'SME' },
                    { label: 'Retailer', value: 'Retailer' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Account Status" initialValue="Active">
                <Select
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gstNumber" label="GSTIN Number">
                <Input placeholder="33AABCT9988M1Z0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creditLimit" label="Approved Credit Limit (₹)" initialValue={500000}>
                <Input type="number" placeholder="500000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="city" label="City" initialValue="Chennai">
                <Input placeholder="Chennai" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State" initialValue="Tamil Nadu">
                <Input placeholder="Tamil Nadu" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assignedEmployee" label="Sales Representative" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth (Senior Sales)', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma (Enterprise Specialist)', value: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Registered Commercial Address">
            <Input.TextArea rows={2} placeholder="Street address, Industrial Estate..." />
          </Form.Item>

          <Form.Item name="notes" label="Special Terms & Instructions">
            <Input.TextArea rows={2} placeholder="Credit terms, special packaging agreements..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              {editingCustomer ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: REGISTER ENQUIRY */}
      <Modal
        open={isEnquiryModalOpen}
        onCancel={() => setIsEnquiryModalOpen(false)}
        title={`Register CRM Enquiry for ${selectedCustomer?.name}`}
        footer={null}
        destroyOnClose
      >
        <Form form={enquiryForm} layout="vertical" onFinish={handleCreateEnquiry} style={{ marginTop: 14 }}>
          <Form.Item name="subject" label="Enquiry Subject / Machine Requirement" rules={[{ required: true }]}>
            <Input placeholder="e.g. 15kW Heavy-Duty Drive Enquiry" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" initialValue="Product">
                <Select
                  options={[
                    { label: 'Industrial Equipment', value: 'Product' },
                    { label: 'Maintenance Contract', value: 'AMC' },
                    { label: 'Custom Automation', value: 'Custom' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority Level" initialValue="High">
                <Select
                  options={[
                    { label: 'High Priority', value: 'High' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Urgent', value: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Technical Specifications & Notes">
            <Input.TextArea rows={3} placeholder="Lead time requirements, specs, quantities..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsEnquiryModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Register CRM Enquiry
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: SCHEDULE FOLLOW-UP */}
      <Modal
        open={isFollowUpModalOpen}
        onCancel={() => setIsFollowUpModalOpen(false)}
        title={`Schedule Follow-up with ${selectedCustomer?.contactPerson}`}
        footer={null}
        destroyOnClose
      >
        <Form form={followUpForm} layout="vertical" onFinish={handleCreateFollowUp} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Follow-up Type" initialValue="Call" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: 'Phone Call', value: 'Call' },
                    { label: 'Meeting / Discussion', value: 'Meeting' },
                    { label: 'Site Visit', value: 'Site Visit' },
                    { label: 'Email Follow-up', value: 'Email' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Scheduled Date"
                rules={[{ required: true, message: 'Please enter date' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="time" label="Time" initialValue="11:00 AM">
                <Input placeholder="11:00 AM" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignedTo" label="Assigned Employee" initialValue={selectedCustomer?.assignedEmployee}>
                <Input placeholder="Vikram Seth" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Agenda / Meeting Notes" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Discussion agenda or objective..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsFollowUpModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Follow-up
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: LOG COMMUNICATION NOTE */}
      <Modal
        open={isCommModalOpen}
        onCancel={() => setIsCommModalOpen(false)}
        title="Record Customer Interaction Note"
        footer={null}
        destroyOnClose
      >
        <Form form={commForm} layout="vertical" onFinish={handleAddCommunication} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="channel" label="Channel" initialValue="Phone Call" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: 'Phone Call', value: 'Phone Call' },
                    { label: 'Email', value: 'Email' },
                    { label: 'WhatsApp', value: 'WhatsApp' },
                    { label: 'In-Person Meeting', value: 'In-Person' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="byUser" label="Logged By" initialValue="Janani D">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="subject" label="Interaction Topic" rules={[{ required: true }]}>
            <Input placeholder="e.g. Pricing renegotiation for upcoming order" />
          </Form.Item>
          <Form.Item name="summary" label="Detailed Conversation Summary" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Summary of what was agreed or discussed..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsCommModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Interaction Note
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
