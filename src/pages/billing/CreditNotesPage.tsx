import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Drawer,
  Form,
  Space,
  Tooltip,
  message,
  InputNumber,
  Popconfirm,
  Divider,
} from 'antd';
import {
  Undo2,
  Plus,
  Search,
  Eye,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  CreditCard,
  Printer,
  ChevronRight,
  ShieldCheck,
  FileText,
  IndianRupee,
  XCircle,
  Check,
} from 'lucide-react';
import dayjs from 'dayjs';
import { CreditNoteRecord } from './billingData';
import { INITIAL_CREDIT_NOTES } from './billingMockData';

const BRAND_PURPLE = '#441A87';

// Extended status options matching business requirements
export type CreditNoteStatus = 'Approved' | 'Pending Approval' | 'Issued' | 'Applied' | 'Pending' | 'Refunded';

export const CreditNotesPage: React.FC = () => {
  const [creditNotes, setCreditNotes] = useState<CreditNoteRecord[]>(() => {
    // Enhance initial mock data to demonstrate all status types cleanly
    return INITIAL_CREDIT_NOTES.map((cn, idx) => {
      let status = cn.status;
      let adjustmentStatus = cn.adjustmentStatus;
      if (idx === 0) {
        status = 'Issued';
        adjustmentStatus = 'Applied';
      } else if (idx === 1) {
        status = 'Pending Approval';
        adjustmentStatus = 'Pending';
      } else if (idx === 2) {
        status = 'Approved';
        adjustmentStatus = 'Applied';
      } else if (idx === 3) {
        status = 'Applied';
        adjustmentStatus = 'Applied';
      }
      return { ...cn, status, adjustmentStatus };
    });
  });

  // Filter toolbar states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [adjustmentFilter, setAdjustmentFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modal & Drawer states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<CreditNoteRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // Summary Metrics - Exact 4 Cards in a single row
  const metrics = useMemo(() => {
    const totalCount = creditNotes.length;
    const totalCreditValue = creditNotes.reduce((acc, c) => acc + (c.totalCreditAmount || 0), 0);
    const pendingApprovalCount = creditNotes.filter((c) => c.status === 'Pending Approval' || c.adjustmentStatus === 'Pending').length;
    const appliedCount = creditNotes.filter((c) => c.status === 'Applied' || c.adjustmentStatus === 'Applied').length;

    return {
      totalCount,
      totalCreditValue,
      pendingApprovalCount,
      appliedCount,
    };
  }, [creditNotes]);

  // Unique reasons for dropdown
  const uniqueReasons = useMemo(() => {
    return Array.from(new Set(creditNotes.map((c) => c.reason))).filter(Boolean);
  }, [creditNotes]);

  // Filtered List
  const filteredNotes = useMemo(() => {
    return creditNotes.filter((cn) => {
      const matchSearch =
        !searchTerm ||
        cn.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cn.customerCode && cn.customerCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || cn.status === statusFilter;
      const matchReason = reasonFilter === 'ALL' || cn.reason === reasonFilter;
      const matchAdjustment = adjustmentFilter === 'ALL' || cn.adjustmentStatus === adjustmentFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const d = dayjs(cn.creditNoteDate);
        matchDate = (d.isAfter(dateRange[0], 'day') || d.isSame(dateRange[0], 'day')) &&
                    (d.isBefore(dateRange[1], 'day') || d.isSame(dateRange[1], 'day'));
      }

      return matchSearch && matchStatus && matchReason && matchAdjustment && matchDate;
    });
  }, [creditNotes, searchTerm, statusFilter, reasonFilter, adjustmentFilter, dateRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setReasonFilter('ALL');
    setAdjustmentFilter('ALL');
    setDateRange(null);
  };

  // Status Badge Helper with subtle, professional enterprise colors
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Tag style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Approved
          </Tag>
        );
      case 'Issued':
        return (
          <Tag style={{ background: '#FAF5FF', color: '#6B21A8', border: '1px solid #E9D5FF', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Issued
          </Tag>
        );
      case 'Applied':
        return (
          <Tag style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Applied
          </Tag>
        );
      case 'Pending Approval':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Pending Approval
          </Tag>
        );
      case 'Pending':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Pending
          </Tag>
        );
      case 'Refunded':
        return (
          <Tag style={{ background: '#F0F9FF', color: '#0369A1', border: '1px solid #BAE6FD', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Refunded
          </Tag>
        );
      default:
        return (
          <Tag style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB', borderRadius: 4, fontWeight: 600, fontSize: 11.5 }}>
            {status}
          </Tag>
        );
    }
  };

  const handleApprove = (id: string) => {
    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === id ? { ...cn, status: 'Approved', adjustmentStatus: 'Applied' } : cn
      )
    );
    message.success('Credit Note approved and credit amount applied against receivable balance.');
  };

  const handleCreateSubmit = (values: any) => {
    const taxable = Number(values.taxableAmount) || 0;
    const taxRate = Number(values.taxRate) || 18;
    const taxAmt = Math.round((taxable * taxRate) / 100);
    const totalCredit = taxable + taxAmt;
    const nextNumber = `CN-2026-${String(100 + creditNotes.length + 1).padStart(4, '0')}`;

    const newNote: CreditNoteRecord = {
      id: `CN-${Date.now()}`,
      creditNoteNumber: nextNumber,
      originalInvoiceNumber: values.originalInvoiceNumber,
      customerName: values.customerName,
      customerCode: values.customerCode || 'CUST-GEN',
      creditNoteDate: values.creditNoteDate ? values.creditNoteDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      reason: values.reason,
      creditType: values.creditType || 'Sales Return Credit',
      taxableAmount: taxable,
      taxAmount: taxAmt,
      totalCreditAmount: totalCredit,
      adjustmentStatus: 'Pending',
      status: 'Pending Approval',
      adjustmentMethod: values.adjustmentMethod || 'To be adjusted on next billing',
      notes: values.notes || 'Credit note raised against customer invoice discrepancy.',
    };

    setCreditNotes([newNote, ...creditNotes]);
    message.success(`Credit Note ${newNote.creditNoteNumber} created and submitted for approval!`);
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  // Table Columns with exact widths, aligned amounts, and clean actions
  const columns = [
    {
      title: 'Credit Note #',
      dataIndex: 'creditNoteNumber',
      key: 'creditNoteNumber',
      width: 140,
      render: (val: string) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: BRAND_PURPLE,
            backgroundColor: '#FAF5FF',
            border: '1px solid #E9D5FF',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: 'Original Invoice',
      dataIndex: 'originalInvoiceNumber',
      key: 'originalInvoiceNumber',
      width: 135,
      render: (inv: string) => (
        <span style={{ fontWeight: 600, color: '#4B5563', fontSize: 12 }}>
          {inv}
        </span>
      ),
    },
    {
      title: 'Customer Details',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 220,
      render: (name: string, r: CreditNoteRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
            Code: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.customerCode || 'CUST-GEN'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'creditNoteDate',
      key: 'creditNoteDate',
      width: 110,
      render: (d: string) => <span style={{ fontSize: 12, color: '#4B5563' }}>{d}</span>,
    },
    {
      title: 'Credit Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 160,
      render: (r: string) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
          {r}
        </span>
      ),
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      width: 130,
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#374151' }}>
          ₹{Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Total Credit',
      dataIndex: 'totalCreditAmount',
      key: 'totalCreditAmount',
      width: 135,
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#DC2626', fontSize: 13 }}>
          ₹{Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Adjustment',
      dataIndex: 'adjustmentStatus',
      key: 'adjustmentStatus',
      width: 115,
      render: (adj: string) => renderStatusBadge(adj),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 135,
      render: (st: string) => renderStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 125,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: CreditNoteRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {/* View Details Drawer */}
          <Tooltip title="View Credit Note Details">
            <button
              onClick={() => {
                setSelectedNote(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_PURPLE;
                e.currentTarget.style.color = BRAND_PURPLE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Eye size={14} />
            </button>
          </Tooltip>

          {/* Quick Approve Action */}
          {record.status === 'Pending Approval' && (
            <Tooltip title="Approve Credit Note">
              <button
                onClick={() => handleApprove(record.id)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid #BBF7D0',
                  background: '#F0FDF4',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#16A34A',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#16A34A';
                  e.currentTarget.style.background = '#DCFCE7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#BBF7D0';
                  e.currentTarget.style.background = '#F0FDF4';
                }}
              >
                <Check size={14} />
              </button>
            </Tooltip>
          )}

          {/* Download PDF */}
          <Tooltip title="Download PDF">
            <button
              onClick={() => message.info(`Downloading PDF for Credit Note: ${record.creditNoteNumber}`)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0284C7',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284C7';
                e.currentTarget.style.background = '#F0F9FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <Download size={14} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* 1. Page Header (Title and Create Button Aligned) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: BRAND_PURPLE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(68, 26, 135, 0.2)',
            }}
          >
            <Undo2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Credit Notes
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Issue, approve, and apply credit notes for customer sales returns, overbilling, and price adjustments.
            </div>
          </div>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            form.resetFields();
            setIsCreateModalOpen(true);
          }}
          style={{
            background: BRAND_PURPLE,
            borderColor: BRAND_PURPLE,
            borderRadius: 8,
            height: 38,
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 18px',
            boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
          }}
        >
          + Create Credit Note
        </Button>
      </div>

      {/* 2. 4 Summary Cards (Single Horizontal Row, 100% Width CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Card 1: Total Credit Notes */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(68, 26, 135, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: BRAND_PURPLE }}>
              Total Credit Notes
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.totalCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              All issued & pending records
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: BRAND_PURPLE,
            }}
          >
            <Undo2 size={20} />
          </div>
        </div>

        {/* Card 2: Pending Approval */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(217, 119, 6, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309' }}>
              Pending Approval
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.pendingApprovalCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Awaiting manager sign-off
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Clock size={20} />
          </div>
        </div>

        {/* Card 3: Applied & Adjusted */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#15803D' }}>
              Applied & Adjusted
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.appliedCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Reconciled against balances
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Card 4: Total Credit Value */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B91C1C' }}>
              Total Credit Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              ₹{(metrics.totalCreditValue / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Total adjustment value
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}
          >
            <IndianRupee size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters (Clean horizontal toolbar, single line) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <Input
            prefix={<Search size={15} style={{ color: '#9CA3AF' }} />}
            placeholder="Search Note # / Invoice / Customer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36, fontSize: 12.5 }}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 165, height: 36 }}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Approved', value: 'Approved' },
            { label: 'Pending Approval', value: 'Pending Approval' },
            { label: 'Issued', value: 'Issued' },
            { label: 'Applied', value: 'Applied' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Refunded', value: 'Refunded' },
          ]}
        />

        {/* Reason Filter */}
        <Select
          value={reasonFilter}
          onChange={setReasonFilter}
          style={{ width: 175, height: 36 }}
          options={[
            { label: 'All Reasons', value: 'ALL' },
            ...uniqueReasons.map((r) => ({ label: r, value: r })),
          ]}
        />

        {/* Adjustment Filter */}
        <Select
          value={adjustmentFilter}
          onChange={setAdjustmentFilter}
          style={{ width: 155, height: 36 }}
          options={[
            { label: 'All Adjustments', value: 'ALL' },
            { label: 'Applied', value: 'Applied' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Refunded', value: 'Refunded' },
          ]}
        />

        {/* Date Range Picker */}
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as any)}
          style={{ height: 36, borderRadius: 8, minWidth: 220 }}
          placeholder={['Start Date', 'End Date']}
        />

        {/* Reset Filter Button */}
        {(searchTerm || statusFilter !== 'ALL' || reasonFilter !== 'ALL' || adjustmentFilter !== 'ALL' || dateRange) && (
          <Button
            icon={<RotateCcw size={14} />}
            onClick={handleResetFilters}
            style={{
              height: 36,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#6B7280',
              borderColor: '#D1D5DB',
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Professional Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
            Credit Note Records ({filteredNotes.length})
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Credits reduce customer accounts receivable and adjust GST output tax liability.
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Total ${t} Credit Notes` }}
          scroll={{ x: 1280 }}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      {/* 5. Create Credit Note Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 6 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: BRAND_PURPLE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Undo2 size={17} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              Create Customer Credit Note
            </span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            creditNoteDate: dayjs(),
            creditType: 'Sales Return Credit',
            reason: 'Sales Return',
            taxRate: 18,
            adjustmentMethod: 'To be adjusted on next billing',
          }}
          style={{ marginTop: 12 }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            1. Invoice & Customer References
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item
              label="Original Invoice Number"
              name="originalInvoiceNumber"
              rules={[{ required: true, message: 'Please enter original invoice number' }]}
            >
              <Input placeholder="e.g. INV-2026-0081" />
            </Form.Item>

            <Form.Item
              label="Customer Name"
              name="customerName"
              rules={[{ required: true, message: 'Please enter customer name' }]}
            >
              <Input placeholder="e.g. Apex Precision Tools Ltd" />
            </Form.Item>

            <Form.Item label="Credit Note Date" name="creditNoteDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Credit Reason" name="reason" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'Sales Return', label: 'Sales Return' },
                  { value: 'Product Damage', label: 'Product Damage' },
                  { value: 'Product Defect', label: 'Product Defect' },
                  { value: 'Overbilling', label: 'Overbilling' },
                  { value: 'Excess Tax Charged', label: 'Excess Tax Charged' },
                  { value: 'Discount Adjustment', label: 'Discount Adjustment' },
                  { value: 'Pricing Correction', label: 'Pricing Correction' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, marginTop: 8, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            2. Taxable Value & GST Rate
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item
              label="Taxable Amount (₹)"
              name="taxableAmount"
              rules={[{ required: true, message: 'Enter taxable amount' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} prefix="₹" />
            </Form.Item>

            <Form.Item label="GST Tax Rate (%)" name="taxRate" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 0, label: '0% Nil' },
                  { value: 5, label: '5%' },
                  { value: 12, label: '12%' },
                  { value: 18, label: '18% Standard GST' },
                  { value: 28, label: '28%' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item label="Adjustment Instructions / Settlement Method" name="adjustmentMethod">
            <Input placeholder="e.g. Adjust against receivable balance or issue refund" />
          </Form.Item>

          <Form.Item label="Detailed Reason / Inspection Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Explain defect inspection, customer approval or billing dispute details..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                fontWeight: 700,
              }}
            >
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Undo2 size={18} color={BRAND_PURPLE} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                Credit Note: {selectedNote?.creditNoteNumber}
              </span>
            </div>
            {selectedNote && renderStatusBadge(selectedNote.status)}
          </div>
        }
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={560}
      >
        {selectedNote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Actions Header */}
            <div style={{ display: 'flex', gap: 10, paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
              <Button
                icon={<Printer size={15} />}
                onClick={() => message.info(`Printing Credit Note ${selectedNote.creditNoteNumber}`)}
              >
                Print
              </Button>
              <Button
                icon={<Download size={15} />}
                onClick={() => message.info(`Downloading PDF for ${selectedNote.creditNoteNumber}`)}
              >
                Download PDF
              </Button>
              {selectedNote.status === 'Pending Approval' && (
                <Button
                  type="primary"
                  icon={<Check size={15} />}
                  onClick={() => {
                    handleApprove(selectedNote.id);
                    setIsDetailDrawerOpen(false);
                  }}
                  style={{ background: '#16A34A', borderColor: '#16A34A', fontWeight: 700 }}
                >
                  Approve Credit Note
                </Button>
              )}
            </div>

            {/* Customer & Invoice Reference Card */}
            <div style={{ background: '#FAF5FF', padding: '14px 18px', borderRadius: 10, border: '1px solid #E9D5FF' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_PURPLE, textTransform: 'uppercase' }}>
                Customer & Original Invoice
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1F2937', marginTop: 4 }}>
                {selectedNote.customerName}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                Customer Code: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedNote.customerCode || 'CUST-GEN'}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                Original Tax Invoice: <strong style={{ color: BRAND_PURPLE }}>{selectedNote.originalInvoiceNumber}</strong>
              </div>
            </div>

            {/* Credit Breakdown */}
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                Financial Credit Calculation
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                <span>Date Issued:</span>
                <span style={{ fontWeight: 600 }}>{selectedNote.creditNoteDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                <span>Reason:</span>
                <span style={{ fontWeight: 600 }}>{selectedNote.reason}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                <span>Taxable Amount:</span>
                <span style={{ fontWeight: 600 }}>₹{Number(selectedNote.taxableAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                <span>Tax Amount (GST):</span>
                <span style={{ fontWeight: 600 }}>₹{Number(selectedNote.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#111827' }}>
                <span>Total Credit Note Amount:</span>
                <span style={{ color: '#DC2626' }}>₹{Number(selectedNote.totalCreditAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Settlement Instructions */}
            <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 14, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                Settlement & Inspection Notes
              </div>
              <div style={{ fontSize: 12.5, color: '#4B5563', marginTop: 6, lineHeight: 1.5 }}>
                {selectedNote.notes || 'Standard credit adjustment against outstanding receivables balance.'}
              </div>
              <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 8 }}>
                Settlement Method: <strong>{selectedNote.adjustmentMethod || 'Account ledger adjustment'}</strong>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CreditNotesPage;
