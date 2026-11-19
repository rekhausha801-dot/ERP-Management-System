import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  DatePicker,
  message,
  Table,
} from 'antd';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  FileText,
  Users,
  Presentation,
  Gift,
  FileCheck,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

interface CalendarEventItem {
  id: string;
  code: string;
  name: string;
  category: 'Meeting' | 'Project' | 'Personal' | 'Audit' | string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Pending';
  date: string;
  updatedBy: string;
  iconType: 'meeting' | 'project' | 'personal' | 'audit';
}

export const CompanyCalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'month'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [events, setEvents] = useState<CalendarEventItem[]>([
    {
      id: '1',
      code: 'EVT-001',
      name: 'Team Meeting',
      category: 'Meeting',
      status: 'Upcoming',
      date: '2026-11-20',
      updatedBy: 'Admin Team',
      iconType: 'meeting',
    },
    {
      id: '2',
      code: 'EVT-002',
      name: 'Project Review',
      category: 'Project',
      status: 'Active',
      date: '2026-11-18',
      updatedBy: 'Operations Team',
      iconType: 'project',
    },
    {
      id: '3',
      code: 'EVT-003',
      name: 'Birthday Celebration',
      category: 'Personal',
      status: 'Completed',
      date: '2026-11-15',
      updatedBy: 'HR Team',
      iconType: 'personal',
    },
    {
      id: '4',
      code: 'EVT-004',
      name: 'Audit Schedule',
      category: 'Audit',
      status: 'Pending',
      date: '2026-11-12',
      updatedBy: 'Finance Team',
      iconType: 'audit',
    },
  ]);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(search.toLowerCase()) ||
      ev.code.toLowerCase().includes(search.toLowerCase()) ||
      ev.updatedBy.toLowerCase().includes(search.toLowerCase()) ||
      ev.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'upcoming') return ev.status === 'Upcoming' || ev.status === 'Active';
    if (activeTab === 'completed') return ev.status === 'Completed';
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Meeting':
        return <Users size={16} color="#3B82F6" />;
      case 'Project':
        return <Presentation size={16} color="#8B5CF6" />;
      case 'Personal':
        return <Gift size={16} color="#A855F7" />;
      case 'Audit':
        return <FileCheck size={16} color="#7C3AED" />;
      default:
        return <Sparkles size={16} color="#6366F1" />;
    }
  };

  const getEventNameIcon = (category: string) => {
    switch (category) {
      case 'Meeting':
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <CalendarIcon size={16} />
          </div>
        );
      case 'Project':
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <Presentation size={16} />
          </div>
        );
      case 'Personal':
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <Gift size={16} />
          </div>
        );
      case 'Audit':
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <FileText size={16} />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <CalendarCheck size={16} />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#16A34A',
              }}
            />
            Upcoming
          </span>
        );
      case 'Active':
        return (
          <span
            style={{
              backgroundColor: '#DBEAFE',
              color: '#1D4ED8',
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#2563EB',
              }}
            />
            Active
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              backgroundColor: '#F3E8FF',
              color: '#6B21A8',
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#7E22CE',
              }}
            />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontWeight: 600,
              fontSize: 12,
              padding: '4px 12px',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#D97706',
              }}
            />
            Pending
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: ColumnsType<CalendarEventItem> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => (
        <span
          style={{
            backgroundColor: '#F3E8FF',
            color: '#6B21A8',
            fontWeight: 700,
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 8,
            display: 'inline-block',
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CalendarEventItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {getEventNameIcon(record.category)}
          <span style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 13 }}>
            {name}
          </span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getCategoryIcon(category)}
          <span style={{ color: '#4338CA', fontWeight: 600, fontSize: 13 }}>
            {category}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (dt: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontSize: 13 }}>
          <CalendarIcon size={15} color="#64748B" />
          <span>{dt}</span>
        </div>
      ),
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (user: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontSize: 13 }}>
          <span style={{ color: '#64748B' }}>👤</span>
          <span>{user}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      width: 110,
      render: (_: any, record: CalendarEventItem) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Button
            type="text"
            style={{
              backgroundColor: '#F3E8FF',
              color: '#6B21A8',
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 8,
              height: 28,
              padding: '0 12px',
            }}
            onClick={() => {
              setSelectedEvent(record);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<MoreVertical size={15} color="#94A3B8" />}
            style={{ width: 28, height: 28, padding: 0 }}
          />
        </div>
      ),
    },
  ];

  const handleAddEvent = (values: any) => {
    const nextCode = `EVT-00${events.length + 1}`;
    const newEvent: CalendarEventItem = {
      id: String(Date.now()),
      code: nextCode,
      name: values.name,
      category: values.category || 'Meeting',
      status: 'Upcoming',
      date: values.date ? values.date.format('YYYY-MM-DD') : '2026-11-22',
      updatedBy: 'Admin Team',
      iconType: 'meeting',
    };
    setEvents([newEvent, ...events]);
    message.success('New event added to calendar!');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* 1. Header Row matching Screenshot 17fc201e.jpg */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Glowing Purple Calendar Square Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(109, 40, 217, 0.35)',
              color: '#FFFFFF',
            }}
          >
            <CalendarIcon size={24} />
          </div>
          <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: 12 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: '#1E1B4B',
                letterSpacing: '-0.02em',
              }}
            >
              Company Calendar
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
              Manage your important events, meetings and activities
            </p>
          </div>
        </div>

        {/* Right Notification & Profile Avatar (JD) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15 }}>🔔</span>
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                backgroundColor: '#EF4444',
                color: '#FFF',
                fontSize: 9,
                fontWeight: 800,
                borderRadius: 10,
                padding: '1px 4px',
              }}
            >
              3
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: 20,
              padding: '3px 8px 3px 4px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#1E1B4B',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              JD
            </div>
            <ChevronDown size={14} color="#64748B" />
          </div>
        </div>
      </div>

      {/* 2. Top Action Buttons & Search Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left Action Buttons matching Screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => message.success('Exporting events to Excel...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 24,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.3)',
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} color="#4ADE80" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => message.success('Exporting events to PDF...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              color: '#1E1B4B',
              border: '1px solid #E2E8F0',
              padding: '9px 18px',
              borderRadius: 24,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              cursor: 'pointer',
            }}
          >
            <FileText size={16} color="#EF4444" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 24,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 4px 14px rgba(67, 56, 202, 0.3)',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} color="#FFFFFF" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Right Search & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Input
              prefix={<Search size={15} color="#94A3B8" style={{ marginRight: 6 }} />}
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #F1F5F9',
                height: 38,
                width: 220,
                fontSize: 13,
              }}
            />
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
            onClick={() => message.info('Toggle calendar view')}
          >
            <CalendarIcon size={16} />
          </div>

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#7C3AED',
            }}
            onClick={() => message.info('Filter options opened')}
          >
            <Filter size={16} />
          </div>
        </div>
      </div>

      {/* 3. Hero Banner Card: "Stay Organized!" with 3 KPI Cards */}
      <Card
        bordered={false}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          marginBottom: 18,
        }}
        styles={{
          body: {
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          },
        }}
      >
        {/* Left Side: Calendar 3D Illustration & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 90,
              height: 70,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
              boxShadow: '0 6px 16px rgba(109, 40, 217, 0.15)',
            }}
          >
            <CalendarCheck size={40} />
          </div>

          <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: 16 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: '#1E1B4B',
                letterSpacing: '-0.02em',
              }}
            >
              Stay Organized!
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
              Manage your company schedule efficiently
            </p>
          </div>
        </div>

        {/* Right Side: 3 Metric Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
          {/* Metric 1: Total Events */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarIcon size={20} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Events</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B' }}>{events.length}</div>
            </div>
          </div>

          <div style={{ width: 1, height: 36, backgroundColor: '#E2E8F0' }} />

          {/* Metric 2: Upcoming */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Upcoming</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B' }}>
                {events.filter((e) => e.status === 'Upcoming' || e.status === 'Active').length}
              </div>
            </div>
          </div>

          <div style={{ width: 1, height: 36, backgroundColor: '#E2E8F0' }} />

          {/* Metric 3: This Month */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>This Month</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B' }}>4</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Main Event Table Card */}
      <Card
        bordered={false}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        {/* Table Title and Pill Filter Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 4,
                height: 20,
                backgroundColor: '#6D28D9',
                borderRadius: 2,
                display: 'inline-block',
              }}
            />
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: '#1E1B4B',
              }}
            >
              Upcoming & Recent Events
            </h3>
          </div>

          {/* Tabs: All, Upcoming, Completed, This Month */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                backgroundColor: activeTab === 'all' ? '#5B21B6' : '#F1F5F9',
                color: activeTab === 'all' ? '#FFFFFF' : '#64748B',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                backgroundColor: activeTab === 'upcoming' ? '#5B21B6' : 'transparent',
                color: activeTab === 'upcoming' ? '#FFFFFF' : '#64748B',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              style={{
                backgroundColor: activeTab === 'completed' ? '#5B21B6' : 'transparent',
                color: activeTab === 'completed' ? '#FFFFFF' : '#64748B',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Completed
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: '#64748B',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              <span>This Month</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <Table
          dataSource={filteredEvents}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered={false}
          rowClassName={(_, idx) => (idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
        />

        {/* Bottom Pagination Summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid #F1F5F9',
            fontSize: 12,
            color: '#64748B',
          }}
        >
          <span>Showing 1 to {filteredEvents.length} of {events.length} records</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              &lt;
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#5B21B6',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </Card>

      {/* Add New Event Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarIcon size={20} color="#6D28D9" />
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>
              Add New Event to Calendar
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEvent} style={{ marginTop: 16 }}>
          <Form.Item label="Event Title" name="name" rules={[{ required: true, message: 'Please enter event name' }]}>
            <Input placeholder="e.g. Executive Strategy Review" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Category" name="category" initialValue="Meeting">
                <Select>
                  <Select.Option value="Meeting">Meeting</Select.Option>
                  <Select.Option value="Project">Project</Select.Option>
                  <Select.Option value="Personal">Personal</Select.Option>
                  <Select.Option value="Audit">Audit</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Event Date" name="date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
                borderColor: '#5B21B6',
                fontWeight: 700,
                borderRadius: 8,
              }}
            >
              Add Event
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Event Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarIcon size={20} color="#6D28D9" />
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1E1B4B' }}>
              Event Details ({selectedEvent?.code})
            </span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={
          <Button
            type="primary"
            style={{
              background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
              borderColor: '#5B21B6',
              fontWeight: 700,
            }}
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </Button>
        }
      >
        {selectedEvent && (
          <div style={{ padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#64748B' }}>Event Name:</span>
              <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{selectedEvent.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#64748B' }}>Category:</span>
              <span style={{ fontWeight: 600, color: '#4338CA' }}>{selectedEvent.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#64748B' }}>Date:</span>
              <span style={{ fontWeight: 600, color: '#1E1B4B' }}>{selectedEvent.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#64748B' }}>Status:</span>
              <span>{getStatusBadge(selectedEvent.status)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Updated By:</span>
              <span style={{ fontWeight: 600, color: '#1E1B4B' }}>{selectedEvent.updatedBy}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
