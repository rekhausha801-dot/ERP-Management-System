import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  DatePicker,
  Space,
  message,
  Dropdown,
  Avatar,
  Badge,
} from 'antd';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Plus,
  Users,
  Briefcase,
  Gift,
  MoreVertical,
  CheckCircle,
  Clock,
  User,
  ChevronDown,
  Shield,
  Presentation,
  Bell,
} from 'lucide-react';

interface CalendarEventItem {
  key: string;
  code: string;
  name: string;
  category: 'Meeting' | 'Project' | 'Personal' | 'Audit';
  status: 'Upcoming' | 'Active' | 'Completed' | 'Pending';
  date: string;
  updatedBy: string;
}

const INITIAL_EVENTS: CalendarEventItem[] = [
  {
    key: '1',
    code: 'EVT-001',
    name: 'Team Meeting',
    category: 'Meeting',
    status: 'Upcoming',
    date: '2026-11-20',
    updatedBy: 'Admin Team',
  },
  {
    key: '2',
    code: 'EVT-002',
    name: 'Project Review',
    category: 'Project',
    status: 'Active',
    date: '2026-11-18',
    updatedBy: 'Operations Team',
  },
  {
    key: '3',
    code: 'EVT-003',
    name: 'Birthday Celebration',
    category: 'Personal',
    status: 'Completed',
    date: '2026-11-15',
    updatedBy: 'HR Team',
  },
  {
    key: '4',
    code: 'EVT-004',
    name: 'Audit Schedule',
    category: 'Audit',
    status: 'Pending',
    date: '2026-11-12',
    updatedBy: 'Finance Team',
  },
];

export const CompanyCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEventItem[]>(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [searchText, setSearchText] = useState('');
  const [monthFilter, setMonthFilter] = useState('This Month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filtered Events
  const filteredEvents = events.filter((item) => {
    // Tab filter
    if (activeTab === 'Upcoming' && item.status !== 'Upcoming' && item.status !== 'Active') return false;
    if (activeTab === 'Completed' && item.status !== 'Completed') return false;

    // Search filter
    if (searchText) {
      const q = searchText.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.updatedBy.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleCreateEvent = (values: any) => {
    const newEntry: CalendarEventItem = {
      key: String(Date.now()),
      code: `EVT-00${events.length + 1}`,
      name: values.name,
      category: values.category,
      status: values.status || 'Upcoming',
      date: values.date ? values.date.format('YYYY-MM-DD') : '2026-11-20',
      updatedBy: 'Admin Team',
    };
    setEvents([newEntry, ...events]);
    message.success('New event added successfully!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleExportExcel = () => {
    message.success('Exporting Company Calendar data to Excel format...');
  };

  const handleExportPDF = () => {
    message.success('Generating official Company Calendar PDF document...');
  };

  // Category Icon & Label matching the screenshot exactly
  const renderCategoryTag = (category: string) => {
    switch (category) {
      case 'Meeting':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
            <Users size={16} color="#0EA5E9" />
            <span style={{ color: '#1E293B' }}>Meeting</span>
          </div>
        );
      case 'Project':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
            <Briefcase size={16} color="#9333EA" />
            <span style={{ color: '#1E293B' }}>Project</span>
          </div>
        );
      case 'Personal':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
            <span style={{ color: '#7C3AED', fontSize: 15, lineHeight: 1 }}>★</span>
            <span style={{ color: '#1E293B' }}>Personal</span>
          </div>
        );
      case 'Audit':
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
            <Shield size={16} color="#6366F1" fill="#6366F1" />
            <span style={{ color: '#1E293B' }}>Audit</span>
          </div>
        );
      default:
        return <span>{category}</span>;
    }
  };

  // Status Badge Pill matching screenshot
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#DCFCE7',
              color: '#16A34A',
              padding: '4px 14px',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
            Upcoming
          </span>
        );
      case 'Active':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#E0F2FE',
              color: '#0284C7',
              padding: '4px 14px',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284C7' }} />
            Active
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#E2E8F0',
              color: '#475569',
              padding: '4px 14px',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748B' }} />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FEF3C7',
              color: '#D97706',
              padding: '4px 14px',
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} />
            Pending
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Event Name with Colorful Rounded Square Icons matching screenshot
  const renderEventName = (name: string, category: string) => {
    let icon = <CalendarIcon size={16} color="#FFFFFF" />;
    let bg = '#7C3AED';

    if (category === 'Meeting') {
      icon = <CalendarIcon size={16} color="#FFFFFF" />;
      bg = '#7C3AED';
    } else if (category === 'Project') {
      icon = <Presentation size={16} color="#FFFFFF" />;
      bg = '#8B5CF6';
    } else if (category === 'Personal') {
      icon = <Gift size={16} color="#FFFFFF" />;
      bg = '#9333EA';
    } else if (category === 'Audit') {
      icon = <FileText size={16} color="#FFFFFF" />;
      bg = '#6366F1';
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {icon}
        </div>
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{name}</span>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '20px 28px 40px',
        maxWidth: 1600,
        margin: '0 auto',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F9F7FD 0%, #F5F2FA 100%)',
        position: 'relative',
      }}
    >
      {/* =========================================================================
          SECTION 1: PAGE HEADER & ACTION CONTROLS
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 18,
        }}
      >
        {/* Title Area with Left Violet Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED 0%, #581C87 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 18px rgba(124, 58, 237, 0.28)',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <CalendarIcon size={24} strokeWidth={2.4} />
          </div>
          <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: 14 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Company Calendar
            </h1>
            <div style={{ fontSize: 12.5, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
              Manage your important events, meetings and activities
            </div>
          </div>
        </div>

        {/* Right Search, Calendar Picker, & Filter Icons + Avatar Notification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Input
              prefix={<Search size={15} color="#94A3B8" style={{ marginRight: 6 }} />}
              placeholder="Search events..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: 230,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                height: 40,
                fontSize: 13,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            />
          </div>

          {/* Calendar Picker Icon Button */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6D28D9',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <CalendarIcon size={17} />
          </div>

          {/* Filter Icon Button */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6D28D9',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <Filter size={17} />
          </div>

          {/* Notification Bell Badge as in screenshot top-right */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: 8,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <Bell size={18} color="#475569" />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 15,
                height: 15,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: 9,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              3
            </span>
          </div>

          {/* User Profile Avatar with dropdown arrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Avatar
              size={38}
              style={{
                backgroundColor: '#1E1B4B',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              JD
            </Avatar>
            <ChevronDown size={14} color="#64748B" />
          </div>
        </div>
      </div>

      {/* Button Row: Export Excel, Export PDF, + Add Event */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        {/* Export Excel Button */}
        <button
          onClick={handleExportExcel}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 24,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Export Excel</span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={handleExportPDF}
          style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 24,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
          }}
        >
          <FileText size={16} />
          <span>Export PDF</span>
        </button>

        {/* Add Event Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #4C1D95 0%, #3B1678 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 24,
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(76, 29, 149, 0.35)',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          <span>Add Event</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 2: HERO BANNER CARD (STAY ORGANIZED + 3 STAT METRICS)
          ========================================================================= */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 28px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 22,
        }}
      >
        {/* Left Side: 3D Calendar Clock Illustration + Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Real 3D Calendar and Clock Cropped Graphic */}
          <div style={{ width: 110, height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/calendar_illustration.png"
              alt="Calendar Illustration"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: 18 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Stay Organized!
            </h2>
            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginTop: 4 }}>
              Manage your company schedule efficiently
            </div>
          </div>
        </div>

        {/* Right Side: 3 Key Metrics Cards */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
          {/* Metric 1: Total Events */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#EDE9FE',
                color: '#6D28D9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarIcon size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Total Events</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.15 }}>
                {events.length}
              </div>
            </div>
          </div>

          {/* Metric 2: Upcoming */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 50,
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Upcoming</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.15 }}>
                {events.filter((e) => e.status === 'Upcoming' || e.status === 'Active').length}
              </div>
            </div>
          </div>

          {/* Metric 3: This Month */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 50,
                background: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>This Month</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', lineHeight: 1.15 }}>
                {events.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: UPCOMING & RECENT EVENTS TABLE WITH PILL FILTERS
          ========================================================================= */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '24px 26px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Table Header Row: Title on Left, Pills & Dropdown on Right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Left Title with Vertical Violet Accent Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#4C1D95' }} />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Upcoming & Recent Events
            </h3>
          </div>

          {/* Right Filter Pills: All, Upcoming, Completed, and This Month Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* All Pill */}
            <button
              onClick={() => setActiveTab('All')}
              style={{
                padding: '6px 18px',
                borderRadius: 20,
                border: 'none',
                background: activeTab === 'All' ? '#3B1678' : 'transparent',
                color: activeTab === 'All' ? '#FFFFFF' : '#64748B',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              All
            </button>

            {/* Upcoming Pill */}
            <button
              onClick={() => setActiveTab('Upcoming')}
              style={{
                padding: '6px 18px',
                borderRadius: 20,
                border: 'none',
                background: activeTab === 'Upcoming' ? '#3B1678' : 'transparent',
                color: activeTab === 'Upcoming' ? '#FFFFFF' : '#64748B',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Upcoming
            </button>

            {/* Completed Pill */}
            <button
              onClick={() => setActiveTab('Completed')}
              style={{
                padding: '6px 18px',
                borderRadius: 20,
                border: 'none',
                background: activeTab === 'Completed' ? '#3B1678' : 'transparent',
                color: activeTab === 'Completed' ? '#FFFFFF' : '#64748B',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Completed
            </button>

            {/* This Month Select Dropdown */}
            <Select
              value={monthFilter}
              onChange={setMonthFilter}
              variant="borderless"
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: '#334155',
              }}
              options={[
                { value: 'This Month', label: 'This Month' },
                { value: 'Next Month', label: 'Next Month' },
                { value: 'All Time', label: 'All Time' },
              ]}
            />
          </div>
        </div>

        {/* Events Table matching reference screenshot */}
        <Table
          dataSource={filteredEvents}
          pagination={false}
          size="middle"
          rowKey="key"
          columns={[
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Code</span>,
              dataIndex: 'code',
              key: 'code',
              width: 120,
              render: (code) => (
                <span
                  style={{
                    fontWeight: 700,
                    color: '#4338CA',
                    fontSize: 12.5,
                    background: '#EEF2FF',
                    padding: '4px 10px',
                    borderRadius: 12,
                    display: 'inline-block',
                  }}
                >
                  {code}
                </span>
              ),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Event Name</span>,
              key: 'name',
              render: (_, record) => renderEventName(record.name, record.category),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Category</span>,
              dataIndex: 'category',
              key: 'category',
              render: (cat) => renderCategoryTag(cat),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Status</span>,
              dataIndex: 'status',
              key: 'status',
              render: (st) => renderStatusBadge(st),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Date</span>,
              dataIndex: 'date',
              key: 'date',
              render: (date) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 13, fontWeight: 500 }}>
                  <CalendarIcon size={15} color="#94A3B8" />
                  <span>{date}</span>
                </div>
              ),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Updated By</span>,
              dataIndex: 'updatedBy',
              key: 'updatedBy',
              render: (user) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 13, fontWeight: 500 }}>
                  <User size={15} color="#94A3B8" />
                  <span>{user}</span>
                </div>
              ),
            },
            {
              title: <span style={{ fontWeight: 800, color: '#334155', fontSize: 13 }}>Actions</span>,
              key: 'actions',
              width: 120,
              render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => {
                      setSelectedEvent(record);
                      setIsViewModalOpen(true);
                    }}
                    style={{
                      border: 'none',
                      background: '#F5F3FF',
                      color: '#6D28D9',
                      fontWeight: 700,
                      fontSize: 12,
                      padding: '4px 12px',
                      borderRadius: 12,
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: 'Edit Event',
                          onClick: () => message.info(`Editing event ${record.code}`),
                        },
                        {
                          key: 'complete',
                          label: 'Mark as Completed',
                          onClick: () => {
                            setEvents((prev) =>
                              prev.map((e) => (e.key === record.key ? { ...e, status: 'Completed' } : e))
                            );
                            message.success(`${record.name} marked as Completed`);
                          },
                        },
                        {
                          key: 'delete',
                          label: <span style={{ color: '#EF4444' }}>Delete Event</span>,
                          onClick: () => {
                            setEvents((prev) => prev.filter((e) => e.key !== record.key));
                            message.success(`Deleted event ${record.code}`);
                          },
                        },
                      ],
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <div style={{ cursor: 'pointer', padding: '4px', color: '#94A3B8' }}>
                      <MoreVertical size={16} />
                    </div>
                  </Dropdown>
                </div>
              ),
            },
          ]}
        />

        {/* Footer Pagination Info matching reference */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid #F1F5F9',
            fontSize: 12.5,
            color: '#64748B',
          }}
        >
          <div>Showing 1 to {filteredEvents.length} of {events.length} records</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#CBD5E1',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &lt;
            </button>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: '#4C1D95',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </div>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#CBD5E1',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW EVENT
          ========================================================================= */}
      <Modal
        title={<span style={{ fontWeight: 800, fontSize: 16 }}>Schedule New Company Event</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreateEvent} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Event Name" rules={[{ required: true, message: 'Please enter event name' }]}>
            <Input placeholder="e.g. Annual Strategy Review" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category' }]}>
            <Select
              placeholder="Select Event Category"
              options={[
                { value: 'Meeting', label: 'Meeting' },
                { value: 'Project', label: 'Project Review' },
                { value: 'Personal', label: 'Personal / Celebration' },
                { value: 'Audit', label: 'Audit Schedule' },
              ]}
            />
          </Form.Item>

          <Form.Item name="date" label="Scheduled Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="status" label="Initial Status" initialValue="Upcoming">
            <Select
              options={[
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Active', label: 'Active' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Pending', label: 'Pending' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#6D28D9', borderColor: '#6D28D9', fontWeight: 600 }}
            >
              Schedule Event
            </Button>
          </div>
        </Form>
      </Modal>

      {/* =========================================================================
          MODAL: VIEW EVENT DETAILS
          ========================================================================= */}
      <Modal
        title={
          <span style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>
            Event Details - {selectedEvent?.code}
          </span>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" type="primary" style={{ background: '#6D28D9' }} onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        centered
      >
        {selectedEvent && (
          <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Event Name:</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>{selectedEvent.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Category:</span>
              <span>{renderCategoryTag(selectedEvent.category)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Status:</span>
              <span>{renderStatusBadge(selectedEvent.status)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Date:</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>{selectedEvent.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Assigned / Updated By:</span>
              <span style={{ fontWeight: 600, color: '#4F46E5' }}>{selectedEvent.updatedBy}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
