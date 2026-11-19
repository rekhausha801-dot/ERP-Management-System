import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Badge,
  Avatar,
  Table,
} from 'antd';
import {
  Users,
  UserPlus,
  Award,
  Trophy,
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Phone,
  Video,
  MapPin,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CrmDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelinePeriod, setPipelinePeriod] = useState('This Month');
  const [sourcesPeriod, setSourcesPeriod] = useState('This Month');

  // KPI Data matching reference image with distinct rich colored cards
  const kpiCards = [
    {
      title: 'Total Leads',
      value: '5',
      growth: '+25%',
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
      title: 'New Leads',
      value: '1',
      growth: '+0%',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <UserPlus size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Qualified',
      value: '1',
      growth: '+0%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Award size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Converted Won',
      value: '3',
      growth: '+50%',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Trophy size={18} color="#FFFFFF" />,
      iconBg: '#F59E0B',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
    },
    {
      title: 'Conversion Rate',
      value: '60.0%',
      growth: '+12.5%',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <BarChart3 size={18} color="#FFFFFF" />,
      iconBg: '#8B5CF6',
      boxShadow: '0 4px 14px rgba(139, 92, 246, 0.08)',
    },
  ];

  // Pipeline stages
  const pipelineStages = [
    { count: '1', label: 'New Lead', bg: '#0284C7' },
    { count: '1', label: 'Contacted', bg: '#7C3AED' },
    { count: '1', label: 'Qualified', bg: '#10B981' },
    { count: '1', label: 'Proposal', bg: '#F97316' },
    { count: '1', label: 'Negotiation', bg: '#4338CA' },
    { count: '3', label: 'Won /\nConverted', bg: '#059669' },
  ];

  // Lead Sources legend
  const leadSources = [
    { name: 'Website', leads: '28 Leads', pct: '32.5%', color: '#3B82F6' },
    { name: 'Referral', leads: '42 Leads', pct: '45.2%', color: '#8B5CF6' },
    { name: 'Social Media', leads: '19 Leads', pct: '21%', color: '#F97316' },
    { name: 'Advertisement', leads: '15 Leads', pct: '18.5%', color: '#10B981' },
    { name: 'Direct Contact', leads: '34 Leads', pct: '38%', color: '#4338CA' },
  ];

  // Recent Sales Activities matching screenshot
  const recentActivities = [
    {
      key: '1',
      icon: <Calendar size={15} color="#7544D6" />,
      type: 'Meeting',
      details: 'Quarterly Supply & SLA Review',
      relatedTo: 'Apex Precision Tools Ltd',
      performedBy: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      outcome: 'Quotation Requested',
      outcomeColor: '#E6F4EA',
      outcomeText: '#137333',
      date: '2026-11-15',
    },
    {
      key: '2',
      icon: <Phone size={15} color="#7544D6" />,
      type: 'Call',
      details: 'Initial Discovery & Machine Spec Call',
      relatedTo: 'Verma Fabricators & Co',
      performedBy: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      outcome: 'Positive / Interested',
      outcomeColor: '#E8F0FE',
      outcomeText: '#1A73E8',
      date: '2026-11-16',
    },
    {
      key: '3',
      icon: <Video size={15} color="#7544D6" />,
      type: 'Demonstration',
      details: 'Product Demo: Modular PLC System',
      relatedTo: 'Bharat Bio Labs',
      performedBy: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
      outcome: 'Needs Follow-up',
      outcomeColor: '#FEF7E0',
      outcomeText: '#B06000',
      date: '2026-11-17',
    },
    {
      key: '4',
      icon: <MapPin size={15} color="#7544D6" />,
      type: 'Site Visit',
      details: 'Factory Inspection & Pump Alignment',
      relatedTo: 'Omni Infra Ventures',
      performedBy: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
      outcome: 'Order Confirmed',
      outcomeColor: '#E6F4EA',
      outcomeText: '#137333',
      date: '2026-11-14',
    },
  ];

  // Upcoming Follow-ups matching screenshot
  const upcomingFollowUps = [
    {
      key: '1',
      icon: <Calendar size={15} color="#7544D6" />,
      type: 'Meeting',
      customer: 'Apex Precision Tools Ltd',
      assignedTo: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      dateTime: 'Nov 20, 2026\n11:00 AM',
      status: 'Scheduled',
      statusBg: '#F3E8FF',
      statusText: '#7E22CE',
    },
    {
      key: '2',
      icon: <Phone size={15} color="#7544D6" />,
      type: 'Call',
      customer: 'Bharat Bio Labs',
      assignedTo: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80',
      dateTime: 'Nov 21, 2026\n03:30 PM',
      status: 'Scheduled',
      statusBg: '#F3E8FF',
      statusText: '#7E22CE',
    },
    {
      key: '3',
      icon: <MapPin size={15} color="#7544D6" />,
      type: 'Site Visit',
      customer: 'Southern Automation Works',
      assignedTo: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      dateTime: 'Nov 14, 2026\n02:00 PM',
      status: 'Completed',
      statusBg: '#DCFCE7',
      statusText: '#15803D',
    },
    {
      key: '4',
      icon: <Phone size={15} color="#7544D6" />,
      type: 'Call',
      customer: 'Verma Fabricators &\nCo',
      assignedTo: 'Vikram Seth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      dateTime: 'Nov 12, 2026\n10:00 AM',
      status: 'Overdue',
      statusBg: '#FEE2E2',
      statusText: '#DC2626',
    },
  ];

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
      {/* Top Header Row - Everything on a single cohesive line (No wrapping) */}
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
            <BarChart3 size={18} color="#FFFFFF" />
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
              CRM Executive Dashboard
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '2px 0 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Holistic performance metrics, lead conversion funnel, pipeline velocity, and active follow-ups.
            </p>
          </div>
        </div>

        {/* Right Search, Notification, User Pill - Guaranteed Single Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Input
            prefix={<Search size={15} color="#7544D6" style={{ marginRight: 6 }} />}
            placeholder="Search leads, customers..."
            style={{
              width: 250,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              borderColor: '#ECE8F6',
              padding: '6px 14px',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.04)',
              fontSize: 12.5,
              fontWeight: 500,
            }}
          />

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FBF9FF';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Bell size={16} color="#5421A8" />
            <span
              style={{
                position: 'absolute',
                top: -1,
                right: -1,
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
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 4px rgba(239, 68, 68, 0.35)',
              }}
            >
              3
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 12px 3px 4px',
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FAF7FD';
              e.currentTarget.style.borderColor = '#D8CFF2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#ECE8F6';
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3A1078 0%, #5421A8 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(58, 16, 120, 0.25)',
              }}
            >
              JD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#211044', lineHeight: 1.1 }}>
                Janani D
              </span>
              <span style={{ fontSize: 9.5, color: '#7544D6', fontWeight: 600 }}>
                VP of Sales
              </span>
            </div>
            <ChevronDown size={13} color="#7544D6" style={{ marginLeft: 2 }} />
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards in 1 Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {/* Top row: Icon */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: kpi.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: kpi.isDark ? '0 4px 10px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                {kpi.icon}
              </div>
            </div>

            {/* Title & Value */}
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 13,
                  color: kpi.titleColor,
                  fontWeight: 600,
                  letterSpacing: '0.1px',
                }}
              >
                {kpi.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: kpi.valueColor,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                  }}
                >
                  {kpi.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: kpi.growthColor,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ↑ {kpi.growth}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Sales Pipeline Overview (Left) + Top Lead Sources (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* Left: Sales Pipeline Overview */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 1px 4px rgba(84, 33, 168, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={16} color="#7544D6" />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>
                Sales Pipeline Overview
              </span>
            </div>

            <Select
              value={pipelinePeriod}
              onChange={setPipelinePeriod}
              size="small"
              bordered={false}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                color: '#4B5563',
                border: '1px solid #E5E7EB',
                padding: '1px 4px',
              }}
              options={[
                { value: 'This Month', label: 'This Month' },
                { value: 'This Quarter', label: 'This Quarter' },
                { value: 'This Year', label: 'This Year' },
              ]}
            />
          </div>

          {/* Connected Chevrons Funnel */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 180,
              padding: '6px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: 140,
                filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.06))',
              }}
            >
              {pipelineStages.map((stg, i) => {
                const isFirst = i === 0;
                const isLast = i === pipelineStages.length - 1;
                // Clip-path for modern enterprise chevron
                const clipPath = isFirst
                  ? 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)'
                  : isLast
                  ? 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)'
                  : 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)';

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: stg.bg,
                      clipPath: clipPath,
                      marginLeft: isFirst ? 0 : -6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      padding: '0 8px',
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: pipelineStages.length - i,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {stg.count}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        lineHeight: 1.25,
                        whiteSpace: 'pre-line',
                        opacity: 0.95,
                      }}
                    >
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Top Lead Sources */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 1px 4px rgba(84, 33, 168, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: '3px solid #7544D6',
                    borderRightColor: 'transparent',
                  }}
                />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B' }}>
                Top Lead Sources
              </span>
            </div>

            <Select
              value={sourcesPeriod}
              onChange={setSourcesPeriod}
              size="small"
              bordered={false}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                color: '#4B5563',
                border: '1px solid #E5E7EB',
                padding: '1px 4px',
              }}
              options={[
                { value: 'This Month', label: 'This Month' },
                { value: 'This Quarter', label: 'This Quarter' },
                { value: 'This Year', label: 'This Year' },
              ]}
            />
          </div>

          {/* Donut Chart + Legend */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            {/* Donut SVG with center text: 112 Total Leads */}
            <div
              style={{
                position: 'relative',
                width: 155,
                height: 155,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="155" height="155" viewBox="0 0 160 160">
                {/* Donut Segments */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="24"
                  strokeDasharray="90 351"
                  strokeDashoffset="0"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="24"
                  strokeDasharray="140 351"
                  strokeDashoffset="-90"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="24"
                  strokeDasharray="45 351"
                  strokeDashoffset="-230"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="24"
                  strokeDasharray="40 351"
                  strokeDashoffset="-275"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="transparent"
                  stroke="#4338CA"
                  strokeWidth="24"
                  strokeDasharray="36 351"
                  strokeDashoffset="-315"
                />
              </svg>
              {/* Center Content */}
              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#1E1B4B',
                    lineHeight: 1,
                  }}
                >
                  112
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: '#6B7280',
                    fontWeight: 500,
                    marginTop: 3,
                  }}
                >
                  Total Leads
                </span>
              </div>
            </div>

            {/* Right Legend List */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {leadSources.map((ls, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: ls.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: '#374151', fontWeight: 500 }}>{ls.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#6B7280', fontSize: 11 }}>{ls.leads}</span>
                    <span
                      style={{
                        color: '#1E1B4B',
                        fontWeight: 700,
                        fontSize: 11,
                        width: 38,
                        textAlign: 'right',
                      }}
                    >
                      {ls.pct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sales Activities (Left) + Upcoming Follow-ups (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'stretch',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Recent Sales Activities Table Card */}
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
          {/* Table Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: '1px solid #F5F3FB',
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
                  Real-time client touchpoints and logs
                </div>
              </div>
            </div>

            <Button
              type="link"
              onClick={() => navigate('/app/sales/sales-activities')}
              style={{
                color: '#7544D6',
                fontWeight: 700,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: '#FAF5FF',
                border: '1px solid #EDE9FE',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              View All <ArrowRight size={13} />
            </Button>
          </div>

          {/* Activities Table */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>Type</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Activity Details</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Related To</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Performed By</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Outcome</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act) => (
                  <tr
                    key={act.key}
                    style={{
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA' }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor: '#F3E8FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(117, 68, 214, 0.1)',
                        }}
                      >
                        {act.icon}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 700, color: '#1F2937', fontSize: 12, borderBottom: '1px solid #F3F0FA', maxWidth: 170 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={act.details}>
                        {act.details}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA', maxWidth: 130 }}>
                      <span
                        style={{
                          color: '#2563EB',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={act.relatedTo}
                      >
                        {act.relatedTo}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img
                          src={act.avatar}
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
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          backgroundColor: act.outcomeColor,
                          color: act.outcomeText,
                          padding: '3px 8px',
                          borderRadius: 14,
                          fontSize: 10.5,
                          fontWeight: 700,
                          display: 'inline-block',
                          border: `1px solid ${act.outcomeText}22`,
                        }}
                      >
                        {act.outcome}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px', color: '#6B7280', fontSize: 11, fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap', borderBottom: '1px solid #F3F0FA' }}>
                      {act.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Upcoming Follow-ups Table Card */}
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
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: '1px solid #F5F3FB',
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

            <Button
              type="link"
              onClick={() => navigate('/app/sales/follow-ups')}
              style={{
                color: '#7544D6',
                fontWeight: 700,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: '#FAF5FF',
                border: '1px solid #EDE9FE',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              View All <ArrowRight size={13} />
            </Button>
          </div>

          {/* Follow-ups Table */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>Type</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Customer</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Assigned To</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Date & Time</th>
                  <th style={{ padding: '8px 10px', fontSize: 10.5, color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingFollowUps.map((fu) => (
                  <tr
                    key={fu.key}
                    style={{
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBF9FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA' }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor: '#F3E8FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(117, 68, 214, 0.1)',
                        }}
                      >
                        {fu.icon}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 700, color: '#1F2937', fontSize: 12, borderBottom: '1px solid #F3F0FA', maxWidth: 140 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={fu.customer.replace('\n', ' ')}>
                        {fu.customer.replace('\n', ' ')}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img
                          src={fu.avatar}
                          alt={fu.assignedTo}
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
                          {fu.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', color: '#4B5563', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', borderBottom: '1px solid #F3F0FA' }}>
                      {fu.dateTime.replace('\n', ' ')}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          backgroundColor: fu.statusBg,
                          color: fu.statusText,
                          padding: '3px 10px',
                          borderRadius: 14,
                          fontSize: 10.5,
                          fontWeight: 700,
                          display: 'inline-block',
                          boxShadow: `0 1px 2px ${fu.statusText}15`,
                          border: `1px solid ${fu.statusText}20`,
                        }}
                      >
                        {fu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Performance Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          padding: '14px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 1px 4px rgba(84, 33, 168, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: '#F3E8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={18} color="#7544D6" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B' }}>
            Your Sales Performance
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#10B981',
              marginLeft: 4,
            }}
          >
            +18.5%
          </span>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            vs last month
          </span>
        </div>

        <Button
          type="primary"
          style={{
            background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
            border: 'none',
            borderRadius: 20,
            padding: '4px 18px',
            fontSize: 12,
            fontWeight: 600,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(84, 33, 168, 0.25)',
          }}
          onClick={() => navigate('/app/sales/sales-targets')}
        >
          View Detailed Report →
        </Button>
      </div>
    </div>
  );
};
