import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Progress,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Drawer,
  Typography,
} from 'antd';
import {
  Target,
  Plus,
  TrendingUp,
  Clock,
  Award,
  Users,
  Sparkles,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart3,
  Edit,
  Eye,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  INITIAL_SALES_TARGETS,
  SalesTargetRecord,
} from '../../mock/salesManagementStore';

const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#EDE9FE';

export const SalesTargetsPage: React.FC = () => {
  const [data, setData] = useState<SalesTargetRecord[]>(INITIAL_SALES_TARGETS);
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<SalesTargetRecord | null>(null);
  const [viewDrawerTarget, setViewDrawerTarget] = useState<SalesTargetRecord | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Summary Metrics calculations
  const totalTargetRevenue = useMemo(
    () => data.reduce((acc, t) => acc + t.targetRevenue, 0),
    [data]
  );
  const totalAchievedRevenue = useMemo(
    () => data.reduce((acc, t) => acc + t.achievedRevenue, 0),
    [data]
  );
  const remainingTargetRevenue = Math.max(0, totalTargetRevenue - totalAchievedRevenue);
  const overallAchievementPercent = totalTargetRevenue > 0
    ? Math.round((totalAchievedRevenue / totalTargetRevenue) * 100)
    : 0;

  const topPerformer = useMemo(() => {
    return [...data].sort((a, b) => (b.achievedRevenue / b.targetRevenue) - (a.achievedRevenue / a.targetRevenue))[0];
  }, [data]);

  // Filtered records
  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.employeeName.toLowerCase().includes(q) ||
        d.designation.toLowerCase().includes(q) ||
        d.employeeId.toLowerCase().includes(q);

      const matchPeriod = periodFilter === 'ALL' || d.targetPeriod === periodFilter;
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;

      return matchSearch && matchPeriod && matchStatus;
    });
  }, [data, search, periodFilter, statusFilter]);

  const clearFilters = () => {
    setSearch('');
    setPeriodFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleEditClick = (record: SalesTargetRecord) => {
    setSelectedTarget(record);
    editForm.setFieldsValue({
      employeeName: record.employeeName,
      designation: record.designation,
      targetPeriod: record.targetPeriod,
      periodLabel: record.periodLabel,
      targetRevenue: record.targetRevenue,
      achievedRevenue: record.achievedRevenue,
      targetDeals: record.targetDeals,
      achievedDeals: record.achievedDeals,
      commissionEligible: record.commissionEligible,
      status: record.status,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (values: any) => {
    if (!selectedTarget) return;
    const updated = data.map((t) => {
      if (t.id === selectedTarget.id) {
        return {
          ...t,
          targetRevenue: Number(values.targetRevenue),
          achievedRevenue: Number(values.achievedRevenue),
          targetDeals: Number(values.targetDeals),
          achievedDeals: Number(values.achievedDeals),
          commissionEligible: values.commissionEligible,
          status: values.status,
          targetPeriod: values.targetPeriod,
          periodLabel: values.periodLabel,
        };
      }
      return t;
    });
    setData(updated);
    message.success(`Sales target for ${selectedTarget.employeeName} updated successfully!`);
    setIsEditModalOpen(false);
  };

  const handleCreateTarget = (values: any) => {
    const newRecord: SalesTargetRecord = {
      id: `st-${Date.now()}`,
      employeeName: values.employeeName,
      employeeId: `EMP-${Math.floor(1030 + Math.random() * 50)}`,
      designation: values.designation || 'Sales Account Executive',
      targetPeriod: values.targetPeriod || 'Monthly',
      periodLabel: values.periodLabel || 'Q4 FY26 Target',
      targetRevenue: Number(values.targetRevenue) || 2000000,
      achievedRevenue: Number(values.achievedRevenue) || 0,
      targetDeals: Number(values.targetDeals) || 5,
      achievedDeals: Number(values.achievedDeals) || 0,
      commissionEligible: values.commissionEligible ?? false,
      status: 'Active',
    };
    setData([newRecord, ...data]);
    message.success(`New sales quota created for ${newRecord.employeeName}!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const columns = [
    {
      title: 'Sales Representative',
      key: 'employeeName',
      render: (_: any, r: SalesTargetRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span
            onClick={() => setViewDrawerTarget(r)}
            style={{ fontWeight: 800, color: ROYAL_PURPLE, cursor: 'pointer', fontSize: 13 }}
          >
            {r.employeeName}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            ({r.employeeId} • {r.designation})
          </span>
        </div>
      ),
    },
    {
      title: 'Target Horizon',
      dataIndex: 'targetPeriod',
      key: 'targetPeriod',
      width: 140,
      render: (p: string, r: SalesTargetRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 6,
              background: '#FAF5FF',
              color: ROYAL_PURPLE,
              fontSize: 11.5,
              fontWeight: 700,
              border: '1px solid #E9D5FF',
            }}
          >
            {p}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>• {r.periodLabel}</span>
        </div>
      ),
    },
    {
      title: 'Target Revenue',
      dataIndex: 'targetRevenue',
      key: 'targetRevenue',
      width: 135,
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: '#334155', fontSize: 13, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          ₹{(v / 100000).toFixed(2)}L
        </span>
      ),
    },
    {
      title: 'Achieved Revenue',
      dataIndex: 'achievedRevenue',
      key: 'achievedRevenue',
      width: 180,
      render: (v: number, r: SalesTargetRecord) => {
        const percent = Math.round((v / (r.targetRevenue || 1)) * 100);
        const isExceeded = percent >= 100;
        return (
          <div style={{ width: 160 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 2 }}>
              <span style={{ color: isExceeded ? '#059669' : '#0284C7' }}>₹{(v / 100000).toFixed(2)}L</span>
              <span style={{ color: isExceeded ? '#059669' : '#475569' }}>{percent}%</span>
            </div>
            <Progress
              percent={Math.min(100, percent)}
              size="small"
              strokeColor={isExceeded ? '#059669' : percent >= 75 ? '#0284C7' : '#D97706'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Deals Closed',
      key: 'deals',
      width: 130,
      render: (_: any, r: SalesTargetRecord) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
          <strong style={{ color: ROYAL_PURPLE }}>{r.achievedDeals}</strong> / {r.targetDeals} deals
        </span>
      ),
    },
    {
      title: 'Commission Eligibility',
      dataIndex: 'commissionEligible',
      key: 'commissionEligible',
      width: 140,
      align: 'center' as const,
      render: (eligible: boolean) =>
        eligible ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '2px 8px',
              borderRadius: 20,
              background: '#F0FDF4',
              color: '#166534',
              fontSize: 11,
              fontWeight: 700,
              border: '1px solid #BBF7D0',
              whiteSpace: 'nowrap',
            }}
          >
            <CheckCircle2 size={12} color="#16A34A" /> Eligible
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '2px 8px',
              borderRadius: 20,
              background: '#FFFBEB',
              color: '#92400E',
              fontSize: 11,
              fontWeight: 700,
              border: '1px solid #FDE68A',
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={12} color="#D97706" /> In Review
          </span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center' as const,
      render: (st: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: st === 'Active' ? '#F0FDF4' : '#F8FAFC',
            color: st === 'Active' ? '#166534' : '#64748B',
            fontSize: 11.5,
            fontWeight: 700,
            border: st === 'Active' ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: st === 'Active' ? '#16A34A' : '#94A3B8',
            }}
          />
          {st || 'Active'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'right' as const,
      render: (_: any, r: SalesTargetRecord) => (
        <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            size="small"
            onClick={() => setViewDrawerTarget(r)}
            style={{
              borderRadius: 6,
              borderColor: '#E2E8F0',
              color: '#334155',
              fontSize: 11.5,
              fontWeight: 600,
              height: 28,
              padding: '0 8px',
            }}
          >
            View
          </Button>
          <Button
            size="small"
            onClick={() => handleEditClick(r)}
            style={{
              borderRadius: 6,
              borderColor: '#E2E8F0',
              color: ROYAL_PURPLE,
              fontSize: 11.5,
              fontWeight: 600,
              height: 28,
              padding: '0 8px',
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. PAGE HEADER BANNER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '12px 20px',
          backgroundColor: PURPLE_LIGHT_BG,
          borderRadius: 16,
          border: `1px solid ${PURPLE_BORDER}`,
          flexWrap: 'nowrap',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: '#EDE7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ROYAL_PURPLE,
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
              flexShrink: 0,
            }}
          >
            <Target size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Sales Targets & Quotas
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage commercial sales quotas, deal milestones, and representative performance tracking.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting Sales Quota & Performance registry to Excel...')}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#334155' }}
          >
            Export Quotas
          </Button>
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 16px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => {
              createForm.resetFields();
              setIsCreateModalOpen(true);
            }}
          >
            Assign Quota
          </Button>
        </div>
      </div>

      {/* 2. SIX COLORFUL LIGHT-THEMED KPI CARDS (2 Rows: 4 + 2 Grid Layout) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Row 1: 4 Cards */}
        <Row gutter={[12, 12]}>
          {/* Card 1: Overall Sales Target (Soft Lavender/Purple Theme) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => clearFilters()}
              style={{
                background: 'linear-gradient(180deg, #FAF5FF 0%, #F5EEFD 100%)',
                borderRadius: 16,
                padding: '16px 18px',
                border: '1px solid #E9D5FF',
                boxShadow: '0 2px 10px rgba(68, 26, 135, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#581C87', whiteSpace: 'nowrap' }}>
                  Overall Sales Target
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ROYAL_PURPLE,
                    boxShadow: '0 1px 3px rgba(68, 26, 135, 0.08)',
                  }}
                >
                  <Target size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: ROYAL_PURPLE, lineHeight: 1 }}>
                    ₹{(totalTargetRevenue / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7E22CE', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Combined Rep Quotas
                </div>
              </div>
            </div>
          </Col>

          {/* Card 2: Achieved Revenue (Soft Mint Green Theme) */}
          <Col xs={24} sm={12} md={6}>
            <div
              style={{
                background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)',
                borderRadius: 16,
                padding: '16px 18px',
                border: '1px solid #BBF7D0',
                boxShadow: '0 2px 10px rgba(5, 150, 105, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap' }}>
                  Achieved Revenue
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    boxShadow: '0 1px 3px rgba(5, 150, 105, 0.08)',
                  }}
                >
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                    ₹{(totalAchievedRevenue / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Closed Realized Billings
                </div>
              </div>
            </div>
          </Col>

          {/* Card 3: Remaining Target (Soft Coral / Red Theme) */}
          <Col xs={24} sm={12} md={6}>
            <div
              style={{
                background: 'linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 100%)',
                borderRadius: 16,
                padding: '16px 18px',
                border: '1px solid #FECACA',
                boxShadow: '0 2px 10px rgba(220, 38, 38, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C', whiteSpace: 'nowrap' }}>
                  Remaining Target
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FECACA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                    boxShadow: '0 1px 3px rgba(220, 38, 38, 0.08)',
                  }}
                >
                  <Clock size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#DC2626', lineHeight: 1 }}>
                    ₹{(remainingTargetRevenue / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Pipeline Gap to Close
                </div>
              </div>
            </div>
          </Col>

          {/* Card 4: Target Achievement (Soft Sky Blue Theme) */}
          <Col xs={24} sm={12} md={6}>
            <div
              style={{
                background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
                borderRadius: 16,
                padding: '16px 18px',
                border: '1px solid #BAE6FD',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0369A1', whiteSpace: 'nowrap' }}>
                  Target Achievement
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7',
                    boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)',
                  }}
                >
                  <Award size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#0284C7', lineHeight: 1 }}>
                    {overallAchievementPercent}%
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0284C7', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Team Quota Run-Rate
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 2: 2 Cards (Equal Width md={12}) */}
        <Row gutter={[12, 12]}>
          {/* Card 5: Total Salespersons (Soft Amber Theme) */}
          <Col xs={24} sm={12} md={12}>
            <div
              style={{
                background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid #FDE68A',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', whiteSpace: 'nowrap' }}>
                  Total Sales Executives
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    boxShadow: '0 1px 3px rgba(217, 119, 6, 0.08)',
                  }}
                >
                  <Users size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                    0{data.length} Executives
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#B45309', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Active Assigned Quotas
                </div>
              </div>
            </div>
          </Col>

          {/* Card 6: Top Performer (Soft Indigo Theme) */}
          <Col xs={24} sm={12} md={12}>
            <div
              style={{
                background: 'linear-gradient(180deg, #EEF2FF 0%, #E0E7FF 100%)',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid #C7D2FE',
                boxShadow: '0 2px 10px rgba(79, 70, 229, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3730A3', whiteSpace: 'nowrap' }}>
                  Top Performer Leaderboard
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #C7D2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F46E5',
                    boxShadow: '0 1px 3px rgba(79, 70, 229, 0.08)',
                  }}
                >
                  <Sparkles size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>
                    {topPerformer?.employeeName || 'Priya Sharma'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>
                    {topPerformer ? `${Math.round((topPerformer.achievedRevenue / topPerformer.targetRevenue) * 100)}% Quota` : '118% Quota'}
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4338CA', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Leading Sales Achievement
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 3. TABLE CONTAINER WITH INTEGRATED TOOLBAR */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Integrated Toolbar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            backgroundColor: '#FAFAFA',
          }}
        >
          {/* Left Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
              Sales Quotas & Milestones
            </span>
            <span
              style={{
                backgroundColor: '#EDE7F6',
                color: ROYAL_PURPLE,
                padding: '1px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {filteredData.length} Records
            </span>
          </div>

          {/* Right Search & Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Search rep name, designation, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250, height: 34, borderRadius: 8 }}
              allowClear
            />
            <Select
              value={periodFilter}
              onChange={setPeriodFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Horizons', value: 'ALL' },
                { label: 'Monthly', value: 'Monthly' },
                { label: 'Quarterly', value: 'Quarterly' },
                { label: 'Annual', value: 'Annual' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120, height: 34 }}
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1050 }}
          pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} rep quotas` }}
          size="middle"
        />
      </div>

      {/* CREATE TARGET MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Plus size={18} />
            <span>Assign Sales Target & Quota</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateTarget} style={{ marginTop: 14 }}>
          <Form.Item name="employeeName" label="Sales Representative Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Karthik Raja" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="designation" label="Designation" initialValue="Key Account Manager">
              <Input placeholder="e.g. Key Account Manager" />
            </Form.Item>
            <Form.Item name="targetPeriod" label="Target Period" initialValue="Monthly">
              <Select
                options={[
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Quarterly', value: 'Quarterly' },
                  { label: 'Annual', value: 'Annual' },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="periodLabel" label="Target Label" initialValue="December 2026">
              <Input placeholder="e.g. Q4 Target" />
            </Form.Item>
            <Form.Item name="targetRevenue" label="Target Revenue (₹)" rules={[{ required: true }]}>
              <InputNumber min={100000} style={{ width: '100%' }} placeholder="2500000" />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="targetDeals" label="Target Deals" initialValue={5}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="commissionEligible" label="Commission Eligible" initialValue={true}>
              <Select
                options={[
                  { label: 'Yes - Eligible', value: true },
                  { label: 'No - In Review', value: false },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}>
              Assign Quota
            </Button>
          </div>
        </Form>
      </Modal>

      {/* EDIT TARGET MODAL */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Edit size={17} />
            <span>Update Quota: {selectedTarget?.employeeName}</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="targetRevenue" label="Target Revenue (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="achievedRevenue" label="Achieved Revenue (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="targetDeals" label="Target Deals" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="achievedDeals" label="Achieved Deals" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="targetPeriod" label="Period">
              <Select
                options={[
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Quarterly', value: 'Quarterly' },
                  { label: 'Annual', value: 'Annual' },
                ]}
              />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Completed', value: 'Completed' },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW TARGET DRAWER */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ROYAL_PURPLE,
              }}
            >
              <Target size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Quota & Performance Scorecard</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{viewDrawerTarget?.employeeId}</div>
            </div>
          </div>
        }
        open={!!viewDrawerTarget}
        onClose={() => setViewDrawerTarget(null)}
        width={420}
      >
        {viewDrawerTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Sales Representative</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{viewDrawerTarget.employeeName}</div>
              <div style={{ fontSize: 12, color: ROYAL_PURPLE, fontWeight: 600, marginTop: 1 }}>{viewDrawerTarget.designation}</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: 13, marginBottom: 12 }}>
                Target vs Actual Achievement
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Assigned Quota:</span>
                <span style={{ fontWeight: 700, color: '#334155' }}>₹{(viewDrawerTarget.targetRevenue / 100000).toFixed(2)} Lakhs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Revenue Achieved:</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>₹{(viewDrawerTarget.achievedRevenue / 100000).toFixed(2)} Lakhs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: 12.5 }}>Deals Milestone:</span>
                <span style={{ fontWeight: 700, color: '#0284C7' }}>{viewDrawerTarget.achievedDeals} of {viewDrawerTarget.targetDeals} Closed</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
                <span style={{ color: '#475569', fontWeight: 600, fontSize: 12.5 }}>Achievement Ratio:</span>
                <span style={{ fontWeight: 800, color: ROYAL_PURPLE, fontSize: 14 }}>
                  {Math.round((viewDrawerTarget.achievedRevenue / (viewDrawerTarget.targetRevenue || 1)) * 100)}%
                </span>
              </div>
            </div>

            <Button
              type="primary"
              block
              onClick={() => {
                const target = viewDrawerTarget;
                setViewDrawerTarget(null);
                handleEditClick(target);
              }}
              style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, borderRadius: 8, height: 38, fontWeight: 700 }}
            >
              Modify Quota & Numbers
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
