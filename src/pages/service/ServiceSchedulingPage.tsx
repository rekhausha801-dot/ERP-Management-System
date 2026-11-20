import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message, Descriptions, Space, Card, Row, Col, DatePicker, TimePicker, Collapse } from 'antd';
import {
  Plus, CheckCircle, XCircle, Wrench, LifeBuoy, Calendar, HardHat, MapPin,
  FileCheck, ShieldAlert, Cpu, FileText, ThumbsUp, TrendingUp, User, Clock,
  RotateCcw, Save, Building, Layers, CalendarCheck, Eye, Edit, Trash2, ListFilter, Download, Star,
  AlertCircle, ChevronLeft, ChevronRight, Zap, Shield, Cog
} from 'lucide-react';
import { TbStarFilled } from 'react-icons/tb';
import { PageHeader, StatusBadge, GenericCrudToolbar } from '../../components';
import {
  MOCK_SERVICE_TICKETS, MOCK_JOBS, MOCK_TECHNICIANS, MOCK_AMCS,
  MOCK_WARRANTIES, MOCK_SPARES, MOCK_SERVICE_BILLING, MOCK_FEEDBACK
} from '../../mock/salesServiceData';
import type { ServiceTicket, Job, Technician, AMCContract, WarrantyClaim, SparePart, ServiceBilling, CustomerFeedback } from '../../types';
import { getStoredServiceRequests } from '../../services/serviceWorkflowStorage';

export const ServiceSchedulingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [searchSchedule, setSearchSchedule] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Initial list matching exact values and alignment with Service Quotations
  const [schedules, setSchedules] = useState<any[]>([
    {
      key: '1',
      idNum: '1',
      scheduleId: 'SCH-001',
      serviceOrder: 'SO-1001',
      customerName: 'Apex Precision Tools',
      serviceCategory: 'Mechanical',
      serviceType: 'Machine Repair',
      technician: 'Deepak Varma',
      dateTime: '18-11-2026 10:00 AM - 12:00 PM',
      serviceDate: '18-11-2026',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      priority: 'High',
      status: 'Scheduled',
      location: '123, Industrial Area, Pondicherry',
      remarks: 'Machine repair and mechanical maintenance.',
    },
    {
      key: '2',
      idNum: '2',
      scheduleId: 'SCH-002',
      serviceOrder: 'SO-1002',
      customerName: 'ABC Industries',
      serviceCategory: 'IT Services',
      serviceType: 'IT Maintenance',
      technician: 'Murugan Selvam',
      dateTime: '17-11-2026 02:00 PM - 04:00 PM',
      serviceDate: '17-11-2026',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      priority: 'Medium',
      status: 'In Progress',
      location: 'Plot 4B, Ambattur Industrial Estate, Chennai',
      remarks: 'IT infrastructure and server maintenance.',
    },
    {
      key: '3',
      idNum: '3',
      scheduleId: 'SCH-003',
      serviceOrder: 'SO-1003',
      customerName: 'Sri Traders',
      serviceCategory: 'Electrical',
      serviceType: 'Installation',
      technician: 'Rajesh Kannan',
      dateTime: '16-11-2026 09:00 AM - 11:00 AM',
      serviceDate: '16-11-2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      priority: 'Low',
      status: 'Scheduled',
      location: '77 Sriperumbudur Expressway',
      remarks: 'Electrical installation & equipment setup.',
    },
    {
      key: '4',
      idNum: '4',
      scheduleId: 'SCH-004',
      serviceOrder: 'SO-1004',
      customerName: 'Global Tech Solutions',
      serviceCategory: 'Facility Management',
      serviceType: 'Office Maintenance',
      technician: 'Deepak Varma',
      dateTime: '15-11-2026 01:00 PM - 03:00 PM',
      serviceDate: '15-11-2026',
      startTime: '01:00 PM',
      endTime: '03:00 PM',
      priority: 'Medium',
      status: 'Cancelled',
      location: '12 North Block, IT Corridor',
      remarks: 'Office facilities check and maintenance.',
    },
  ]);

  const handleFinish = (values: any) => {
    const nextIdx = schedules.length + 1;
    const dateStr = values.serviceDate ? values.serviceDate.format('DD-MM-YYYY') : '20-11-2026';
    const startStr = values.startTime ? values.startTime.format('hh:mm A') : '10:00 AM';
    const endStr = values.endTime ? values.endTime.format('hh:mm A') : '12:00 PM';
    const rawOrder = values.serviceOrder || 'SO-1005 – General Maintenance';
    const orderCode = rawOrder.split(' ')[0] || `SO-${1000 + nextIdx}`;

    const newSchedule = {
      key: String(Date.now()),
      idNum: String(nextIdx),
      scheduleId: `SCH-00${nextIdx}`,
      serviceOrder: orderCode,
      customerName: values.customerName || 'ABC Industries',
      serviceType: values.serviceType || 'AC Maintenance',
      technician: values.assignedTechnician || 'Deepak Varma',
      dateTime: `${dateStr} ${startStr} - ${endStr}`,
      serviceDate: dateStr,
      startTime: startStr,
      endTime: endStr,
      priority: values.priority || 'High',
      status: values.status || 'Scheduled',
      location: values.serviceLocation || '123, Industrial Area, Pondicherry',
      remarks: values.remarks || 'Check cooling issue and clean filters.',
    };

    setSchedules([newSchedule, ...schedules]);
    message.success('Service successfully scheduled!');
    setScheduleModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (recordKey: string) => {
    setSchedules(prev => prev.filter(item => item.key !== recordKey));
    message.success('Schedule deleted successfully');
  };

  const handleAccept = (record: any) => {
    setSchedules(prev =>
      prev.map(item => (item.key === record.key ? { ...item, status: 'Scheduled' } : item))
    );
    message.success(`Schedule ${record.scheduleId} Accepted!`);
    setViewModalOpen(false);
  };

  const handleReject = (record: any) => {
    setSchedules(prev =>
      prev.map(item => (item.key === record.key ? { ...item, status: 'Cancelled' } : item))
    );
    message.error(`Schedule ${record.scheduleId} Rejected / Cancelled!`);
    setViewModalOpen(false);
  };

  const filteredSchedules = schedules.filter(s =>
    `${s.scheduleId} ${s.serviceOrder} ${s.customerName} ${s.serviceType} ${s.technician}`
      .toLowerCase()
      .includes(searchSchedule.toLowerCase())
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'idNum',
      key: 'idNum',
      width: 48,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span style={{ color: '#4C1D95', fontWeight: 800, fontSize: 13 }}>{index + 1}</span>
      ),
    },
    {
      title: 'Schedule ID',
      dataIndex: 'scheduleId',
      key: 'scheduleId',
      render: (id: string) => (
        <span style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{id}</span>
      ),
    },
    {
      title: 'Service Order',
      dataIndex: 'serviceOrder',
      key: 'serviceOrder',
      render: (so: string) => (
        <span style={{ color: '#334155', fontWeight: 500, fontSize: 13 }}>{so}</span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (c: string) => (
        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>{c}</span>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (t: string) => {
        let icon = <Wrench size={13} color="#2563EB" />;
        let iconBg = '#EFF6FF';
        if (t === 'Machine Repair') {
          icon = <Cog size={13} color="#2563EB" />;
        } else if (t === 'IT Maintenance') {
          icon = <Wrench size={13} color="#2563EB" />;
        } else if (t === 'Installation') {
          icon = <Zap size={13} color="#2563EB" />;
        } else if (t === 'Office Maintenance') {
          icon = <Shield size={13} color="#2563EB" />;
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <span style={{ color: '#1E293B', fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap' }}>{t}</span>
          </div>
        );
      },
    },
    {
      title: 'Technician',
      dataIndex: 'technician',
      key: 'technician',
      render: (tech: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1E293B', fontWeight: 500, fontSize: 13 }}>
          <User size={14} color="#2563EB" />
          <span>{tech}</span>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (dt: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 12.5, fontWeight: 500 }}>
          <Calendar size={14} color="#6D28D9" />
          <span>{dt}</span>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as const,
      render: (p: string) => {
        if (p === 'High') {
          return (
            <span
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: 11.5,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <AlertCircle size={12} color="#DC2626" />
              High
            </span>
          );
        }
        if (p === 'Medium') {
          return (
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                fontWeight: 700,
                fontSize: 11.5,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 900 }}>📶</span>
              Medium
            </span>
          );
        }
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              fontWeight: 700,
              fontSize: 11.5,
              padding: '4px 12px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 900 }}>↓</span>
            Low
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (st: string) => {
        let bg = '#F3E8FF';
        let text = '#6D28D9';
        let dot = '#6D28D9';
        if (st === 'In Progress') {
          bg = '#DBEAFE';
          text = '#1D4ED8';
          dot = '#2563EB';
        } else if (st === 'Cancelled') {
          bg = '#FEE2E2';
          text = '#DC2626';
          dot = '#EF4444';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 700,
              fontSize: 12,
              padding: '4px 14px',
              whiteSpace: 'nowrap',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 9, color: dot }}>●</span> {st}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            onClick={() => {
              setSelectedRecord(record);
              setViewModalOpen(true);
            }}
            title="View Details"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              border: 'none',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => {
              form.setFieldsValue({
                serviceOrder: record.serviceOrder,
                customerName: record.customerName,
                serviceType: record.serviceType,
                assignedTechnician: record.technician,
                priority: record.priority,
                serviceLocation: record.location,
                remarks: record.remarks,
                status: record.status,
              });
              setScheduleModalOpen(true);
            }}
            title="Edit Schedule"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#EFF6FF',
              border: 'none',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Edit size={13} />
          </button>
          <button
            onClick={() => handleDelete(record.key)}
            title="Delete Schedule"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#FEE2E2',
              border: 'none',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* 1. Header Section matching Purple ERP Theme */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #EAE8FD',
              boxShadow: '0 2px 8px rgba(110, 86, 207, 0.08)',
            }}
          >
            <Calendar size={22} color="#6E56CF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#181433' }}>
              Service Schedule
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#827B9E' }}>
              Plan and manage service visits efficiently
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* View Calendar Button */}
          <button
            onClick={() => message.info('Calendar view toggle')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAE8FD',
              color: '#6E56CF',
              padding: '9px 18px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(110, 86, 207, 0.06)',
            }}
          >
            <Calendar size={15} color="#6E56CF" />
            <span>View Calendar</span>
          </button>

          {/* Schedule Service Button - Purple Theme Gradient */}
          <button
            onClick={() => {
              form.resetFields();
              setScheduleModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #6E56CF 0%, #5B44B9 100%)',
              border: 'none',
              color: '#FFFFFF',
              padding: '9px 20px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(110, 86, 207, 0.35)',
            }}
          >
            <Plus size={16} color="#FFFFFF" />
            <span>Schedule Service</span>
          </button>
        </div>
      </div>

      {/* 2. Four Soft Pill KPI Metric Cards matching Leave Management Theme */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Schedules - Soft Sky Blue Pill */}
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #F9FBFF 0%, #EFF6FF 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', marginBottom: 2 }}>
                  Total Schedules
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#1D4ED8', lineHeight: 1 }}>
                  45
                </div>
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        </Col>

        {/* Card 2: Completed - Soft Pastel Green Pill */}
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #F8FFF9 0%, #EEFDF3 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <CheckCircle size={22} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', marginBottom: 2 }}>
                  Completed
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', lineHeight: 1 }}>
                  28
                </div>
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        </Col>

        {/* Card 3: Upcoming - Soft Peach / Warm Amber Pill */}
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF5EB 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#FFE8CC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EA580C',
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', marginBottom: 2 }}>
                  Upcoming
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
                  10
                </div>
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
              }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        </Col>

        {/* Card 4: Cancelled - Soft Violet / Purple Pill */}
        <Col xs={24} sm={12} md={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #FAF7FF 0%, #F3E8FF 100%)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                }}
              >
                <XCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', marginBottom: 2 }}>
                  Cancelled
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#7C3AED', lineHeight: 1 }}>
                  7
                </div>
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <ChevronRight size={16} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Schedule Service Form Modal matching Screenshot ba453ecb.png */}
      <Modal
        title={
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', padding: '0 0 2px' }}>
            Schedule Service
          </div>
        }
        open={scheduleModalOpen}
        onCancel={() => setScheduleModalOpen(false)}
        footer={null}
        width={540}
        centered
        styles={{
          body: {
            padding: 0,
            maxHeight: 'calc(85vh - 60px)',
            overflowY: 'auto',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 6 }}
          initialValues={{
            serviceOrder: 'SO-1001 – AC Maintenance',
            customerName: 'ABC Industries',
            serviceType: 'AC Maintenance',
            assignedTechnician: 'Deepak Varma',
            priority: 'High',
            serviceLocation: '123, Industrial Area, Pondicherry',
            remarks: 'Check cooling issue and clean filters.',
            status: 'Scheduled',
          }}
        >
          <Row gutter={[12, 0]}>
            {/* Service Order */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Order</span>}
                name="serviceOrder"
                required
                rules={[{ required: true, message: 'Please select service order' }]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<Layers size={13} color="#64748B" />}
                  options={[
                    { value: 'SO-1001 – AC Maintenance', label: 'SO-1001 – AC Maintenance' },
                    { value: 'SO-1002 – Hydraulic Overhaul', label: 'SO-1002 – Hydraulic Overhaul' },
                    { value: 'SO-1003 – CNC Laser Calibration', label: 'SO-1003 – CNC Laser Calibration' },
                    { value: 'SO-1004 – Transformer Inspection', label: 'SO-1004 – Transformer Inspection' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Customer Name */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Customer Name</span>}
                name="customerName"
                required
                rules={[{ required: true, message: 'Please enter customer name' }]}
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  prefix={<Building size={14} color="#64748B" style={{ marginRight: 4 }} />}
                  placeholder="Enter customer name"
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>

            {/* Service Type */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Type</span>}
                name="serviceType"
                required
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<Wrench size={13} color="#64748B" />}
                  options={[
                    { value: 'AC Maintenance', label: 'AC Maintenance' },
                    { value: 'Machine Repair', label: 'Machine Repair' },
                    { value: 'Electrical Repair', label: 'Electrical Repair' },
                    { value: 'HVAC Service', label: 'HVAC Service' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Assigned Technician */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Assigned Technician</span>}
                name="assignedTechnician"
                required
                rules={[{ required: true, message: 'Please select technician' }]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  suffixIcon={<User size={13} color="#64748B" />}
                  options={[
                    { value: 'Deepak Varma', label: 'Deepak Varma' },
                    { value: 'Murugan Selvam', label: 'Murugan Selvam' },
                    { value: 'Rajesh Kannan', label: 'Rajesh Kannan' },
                    { value: 'Suresh Raina', label: 'Suresh Raina' },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Service Date */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Date</span>}
                name="serviceDate"
                required
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  size="middle"
                  format="DD/MM/YYYY"
                  style={{ width: '100%', borderRadius: 6 }}
                  placeholder="Select service date"
                />
              </Form.Item>
            </Col>

            {/* Timing (Start Time & End Time) */}
            <Col xs={24} sm={12}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Start Time</span>}
                  name="startTime"
                  required
                  style={{ flex: 1, marginBottom: 10 }}
                >
                  <TimePicker
                    size="middle"
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%', borderRadius: 6 }}
                    placeholder="10:00 AM"
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>End Time</span>}
                  name="endTime"
                  style={{ flex: 1, marginBottom: 10 }}
                >
                  <TimePicker
                    size="middle"
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%', borderRadius: 6 }}
                    placeholder="12:00 PM"
                  />
                </Form.Item>
              </div>
            </Col>

            {/* Priority */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Priority</span>}
                name="priority"
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  options={[
                    {
                      value: 'High',
                      label: (
                        <span>
                          <span style={{ color: '#EF4444', marginRight: 6 }}>●</span> High
                        </span>
                      ),
                    },
                    {
                      value: 'Medium',
                      label: (
                        <span>
                          <span style={{ color: '#F59E0B', marginRight: 6 }}>●</span> Medium
                        </span>
                      ),
                    },
                    {
                      value: 'Low',
                      label: (
                        <span>
                          <span style={{ color: '#4C1D95', marginRight: 6 }}>●</span> Low
                        </span>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Operational Status */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Operational Status</span>}
                name="status"
                required
                style={{ marginBottom: 10 }}
              >
                <Select
                  size="middle"
                  style={{ borderRadius: 6 }}
                  options={[
                    {
                      value: 'Scheduled',
                      label: (
                        <span style={{ color: '#4C1D95', fontWeight: 600 }}>
                          ● Scheduled
                        </span>
                      ),
                    },
                    {
                      value: 'In Progress',
                      label: (
                        <span style={{ color: '#2563EB', fontWeight: 600 }}>
                          ● In Progress
                        </span>
                      ),
                    },
                    {
                      value: 'Cancelled',
                      label: (
                        <span style={{ color: '#DC2626', fontWeight: 600 }}>
                          ● Cancelled
                        </span>
                      ),
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Service Location */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Service Location</span>}
                name="serviceLocation"
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  prefix={<MapPin size={14} color="#64748B" style={{ marginRight: 4 }} />}
                  placeholder="123, Industrial Area, Pondicherry"
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>

            {/* Remarks */}
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>Remarks</span>}
                name="remarks"
                style={{ marginBottom: 10 }}
              >
                <Input
                  size="middle"
                  placeholder="Check cooling issue and clean filters."
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Footer Action Buttons matching Screenshot ba453ecb.png */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <Button
              size="middle"
              onClick={() => setScheduleModalOpen(false)}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                color: '#334155',
                borderColor: '#E2E8F0',
                padding: '0 20px',
                height: 36,
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              style={{
                backgroundColor: '#6E56CF',
                borderColor: '#6E56CF',
                borderRadius: 6,
                fontWeight: 600,
                padding: '0 20px',
                height: 36,
                boxShadow: '0 2px 10px rgba(110, 86, 207, 0.25)',
              }}
            >
              Submit & Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 4. Scheduled Services Container */}
      <Card
        bordered={false}
        className="service-portal-card"
        style={{
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Title with List icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#181433' }}>
            <ListFilter size={18} color="#6E56CF" />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#181433' }}>
              Scheduled Services
            </span>
          </div>

          {/* Controls: Search, Filter, Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '6px 14px',
                width: 240,
                border: '1.5px solid #7C3AED',
              }}
            >
              <input
                type="text"
                placeholder="Search schedule..."
                value={searchSchedule}
                onChange={e => setSearchSchedule(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  width: '100%',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => message.info('Filter options')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <ListFilter size={13} color="#6E56CF" />
              <span>Filter</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => message.success('Exporting scheduled services to CSV/Excel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Download size={13} color="#4C1D95" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredSchedules}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="middle"
          className="service-scheduling-table"
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
        />

        {/* Footer Bar matching screenshot: Showing entries + pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4C1D95', fontWeight: 600 }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              i
            </span>
            <span style={{ color: '#4C1D95' }}>
              Showing 1 to {filteredSchedules.length} of {filteredSchedules.length} entries
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* View Detail Modal with Accept and Reject buttons */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} color="#0F172A" />
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              Service Schedule Details - {selectedRecord?.scheduleId}
            </span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={680}
        footer={[
          <Button
            key="reject"
            danger
            icon={<XCircle size={15} />}
            onClick={() => handleReject(selectedRecord)}
            style={{ fontWeight: 600, borderRadius: 6 }}
          >
            Reject / Cancel
          </Button>,
          <Button
            key="accept"
            type="primary"
            icon={<CheckCircle size={15} />}
            onClick={() => handleAccept(selectedRecord)}
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            Accept Schedule
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div style={{ marginTop: 14 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Schedule ID">
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedRecord.scheduleId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Service Order">
                <span style={{ fontWeight: 600, color: '#2563EB' }}>{selectedRecord.serviceOrder}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name" span={2}>
                <span style={{ fontWeight: 600 }}>{selectedRecord.customerName}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Service Type">
                {selectedRecord.serviceType}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned Technician">
                <Tag color="blue">{selectedRecord.technician}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Service Timing" span={2}>
                {selectedRecord.dateTime}
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedRecord.priority === 'High' ? 'red' : selectedRecord.priority === 'Medium' ? 'orange' : '#4C1D95'}>
                  {selectedRecord.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedRecord.status === 'Scheduled' ? '#4C1D95' : selectedRecord.status === 'In Progress' ? 'blue' : 'red'}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Service Location" span={2}>
                {selectedRecord.location}
              </Descriptions.Item>
              <Descriptions.Item label="Remarks" span={2}>
                {selectedRecord.remarks}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceSchedulingPage;
