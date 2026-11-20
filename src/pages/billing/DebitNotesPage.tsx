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
  Upload,
  Divider,
} from 'antd';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  IndianRupee,
  Building,
  Printer,
  ShieldCheck,
  Check,
  Paperclip,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import dayjs from 'dayjs';
import { DebitNoteRecord } from './billingData';
import { INITIAL_DEBIT_NOTES } from './billingMockData';

const BRAND_PURPLE = '#441A87';

export const DebitNotesPage: React.FC = () => {
  const [debitNotes, setDebitNotes] = useState<DebitNoteRecord[]>(INITIAL_DEBIT_NOTES);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [partyTypeFilter, setPartyTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modal & Drawer State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<DebitNoteRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // Dynamic calculations for the 4 Summary Cards (Single Row)
  const metrics = useMemo(() => {
    const totalCount = debitNotes.length;
    const pendingApprovalCount = debitNotes.filter((d) => d.status === 'Pending Approval').length;
    const approvedCount = debitNotes.filter((d) => d.status === 'Approved' || d.status === 'Issued').length;
    const totalDebitValue = debitNotes.reduce((acc, d) => acc + (d.totalDebitAmount || 0), 0);

    return {
      totalCount,
      pendingApprovalCount,
      approvedCount,
      totalDebitValue,
    };
  }, [debitNotes]);

  // Unique reasons for dropdown
  const uniqueReasons = useMemo(() => {
    return Array.from(new Set(debitNotes.map((d) => d.reason))).filter(Boolean);
  }, [debitNotes]);

  // Filtered List
  const filteredNotes = useMemo(() => {
    return debitNotes.filter((dn) => {
      const matchSearch =
        !searchTerm ||
        dn.debitNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.referenceInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dn.partyCode && dn.partyCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchParty = partyTypeFilter === 'ALL' || dn.partyType === partyTypeFilter;
      const matchStatus = statusFilter === 'ALL' || dn.status === statusFilter;
      const matchReason = reasonFilter === 'ALL' || dn.reason === reasonFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const d = dayjs(dn.debitNoteDate);
        matchDate =
          (d.isAfter(dateRange[0], 'day') || d.isSame(dateRange[0], 'day')) &&
          (d.isBefore(dateRange[1], 'day') || d.isSame(dateRange[1], 'day'));
      }

      return matchSearch && matchParty && matchStatus && matchReason && matchDate;
    });
  }, [debitNotes, searchTerm, partyTypeFilter, statusFilter, reasonFilter, dateRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setPartyTypeFilter('ALL');
    setStatusFilter('ALL');
    setReasonFilter('ALL');
    setDateRange(null);
  };

  // Status Badge Helper for Approval Status
  const renderApprovalBadge = (status: string) => {
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
      case 'Pending Approval':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Pending Approval
          </Tag>
        );
      case 'Rejected':
        return (
          <Tag style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Rejected
          </Tag>
        );
      case 'Draft':
        return (
          <Tag style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB', borderRadius: 4, fontWeight: 600, fontSize: 11.5 }}>
            Draft
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

  // Status Badge Helper for Adjustment Status
  const renderAdjustmentBadge = (adjustment: string) => {
    switch (adjustment) {
      case 'Applied':
        return (
          <Tag style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Applied
          </Tag>
        );
      case 'Partially Applied':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11.5 }}>
            Partially Applied
          </Tag>
        );
      case 'Pending':
        return (
          <Tag style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: 4, fontWeight: 600, fontSize: 11.5 }}>
            Pending
          </Tag>
        );
      default:
        return (
          <Tag style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB', borderRadius: 4, fontWeight: 600, fontSize: 11.5 }}>
            {adjustment}
          </Tag>
        );
    }
  };

  const handleApprove = (id: string) => {
    setDebitNotes((prev) =>
      prev.map((dn) =>
        dn.id === id ? { ...dn, status: 'Approved', adjustmentStatus: 'Applied' } : dn
      )
    );
    message.success('Debit Note approved and ledger adjustment applied.');
  };

  const handleCreateSubmit = (values: any) => {
    const taxable = Number(values.taxableAmount) || 0;
    const taxRate = Number(values.taxRate) || 18;
    const taxAmt = Math.round((taxable * taxRate) / 100);
    const totalDebit = taxable + taxAmt;
    const nextNumber = `DN-2026-${String(100 + debitNotes.length + 1).padStart(4, '0')}`;

    const newNote: DebitNoteRecord = {
      id: `DN-${Date.now()}`,
      debitNoteNumber: nextNumber,
      referenceInvoice: values.referenceInvoice,
      partyName: values.partyName,
      partyType: values.partyType,
      partyCode: values.partyCode || 'PTY-GEN',
      debitNoteDate: values.debitNoteDate ? values.debitNoteDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      reason: values.reason,
      taxableAmount: taxable,
      taxAmount: taxAmt,
      totalDebitAmount: totalDebit,
      adjustmentStatus: 'Pending',
      status: 'Pending Approval',
      notes: values.notes || 'Supplementary debit note raised against invoice/bill discrepancy.',
    };

    setDebitNotes([newNote, ...debitNotes]);
    message.success(`Debit Note ${newNote.debitNoteNumber} submitted for approval successfully!`);
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  // Columns for the Professional Data Table
  const columns = [
    {
      title: 'Debit Note #',
      dataIndex: 'debitNoteNumber',
      key: 'debitNoteNumber',
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
      title: 'Reference Invoice / Bill',
      dataIndex: 'referenceInvoice',
      key: 'referenceInvoice',
      width: 165,
      render: (ref: string) => (
        <span style={{ fontWeight: 600, color: '#4B5563', fontSize: 12 }}>
          {ref}
        </span>
      ),
    },
    {
      title: 'Party Name & Type',
      dataIndex: 'partyName',
      key: 'partyName',
      width: 230,
      render: (name: string, record: DebitNoteRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 4,
                backgroundColor: record.partyType === 'Customer' ? '#EFF6FF' : '#FAF5FF',
                color: record.partyType === 'Customer' ? '#1D4ED8' : '#7C3AED',
                border: `1px solid ${record.partyType === 'Customer' ? '#BFDBFE' : '#DDD6FE'}`,
              }}
            >
              {record.partyType === 'Customer' ? 'Customer' : 'Supplier'}
            </span>
            <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>
              {record.partyCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Debit Note Date',
      dataIndex: 'debitNoteDate',
      key: 'debitNoteDate',
      width: 120,
      render: (d: string) => <span style={{ fontSize: 12, color: '#4B5563' }}>{d}</span>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 175,
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
      title: 'GST Amount',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      width: 120,
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
          ₹{Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Total Debit',
      dataIndex: 'totalDebitAmount',
      key: 'totalDebitAmount',
      width: 135,
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: BRAND_PURPLE, fontSize: 13 }}>
          ₹{Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Adjustment Status',
      dataIndex: 'adjustmentStatus',
      key: 'adjustmentStatus',
      width: 135,
      render: (adj: string) => renderAdjustmentBadge(adj),
    },
    {
      title: 'Approval Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (st: string) => renderApprovalBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 125,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: DebitNoteRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {/* View Details Drawer */}
          <Tooltip title="View Debit Note Details">
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
            <Tooltip title="Approve Debit Note">
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
              onClick={() => message.info(`Downloading PDF for Debit Note: ${record.debitNoteNumber}`)}
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
      {/* 1. Header (Compact title, description, and primary button) */}
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
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Debit Notes
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Manage supplementary debits, freight charges, underbilling corrections, and price differences for customers & suppliers.
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
          + Create Debit Note
        </Button>
      </div>

      {/* 2. 4 Summary Cards in One Horizontal Row (100% Width CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Card 1: Total Debit Notes */}
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
              Total Debit Notes
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
            <FileText size={20} />
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

        {/* Card 3: Approved / Issued */}
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
              Approved / Issued
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.approvedCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Formally approved and issued
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

        {/* Card 4: Total Debit Value */}
        <div
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(29, 78, 216, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1D4ED8' }}>
              Total Debit Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              ₹{(metrics.totalDebitValue / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Total supplementary debit value
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <IndianRupee size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters (Single Horizontal Toolbar) */}
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
            placeholder="Search Debit Note # / Invoice / Party"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36, fontSize: 12.5 }}
          />
        </div>

        {/* Party Type Filter */}
        <Select
          value={partyTypeFilter}
          onChange={setPartyTypeFilter}
          style={{ width: 155, height: 36 }}
          options={[
            { label: 'All Parties', value: 'ALL' },
            { label: 'Customer Only', value: 'Customer' },
            { label: 'Supplier Only', value: 'Supplier' },
          ]}
        />

        {/* Approval Status Filter */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 165, height: 36 }}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Approved', value: 'Approved' },
            { label: 'Pending Approval', value: 'Pending Approval' },
            { label: 'Issued', value: 'Issued' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Rejected', value: 'Rejected' },
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

        {/* Date Range Picker */}
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as any)}
          style={{ height: 36, borderRadius: 8, minWidth: 220 }}
          placeholder={['Start Date', 'End Date']}
        />

        {/* Reset Filter Button */}
        {(searchTerm || partyTypeFilter !== 'ALL' || statusFilter !== 'ALL' || reasonFilter !== 'ALL' || dateRange) && (
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
            Debit Note Records ({filteredNotes.length})
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Debit notes increase accounts receivable (customer) or decrease payables (supplier).
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Total ${t} Debit Notes` }}
          scroll={{ x: 1540 }}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      {/* 5. Create Debit Note Modal (Comprehensive Form with 8 Clear Business Sections) */}
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
              <FileText size={17} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              Create Supplementary Debit Note
            </span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={760}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            debitNoteDate: dayjs(),
            partyType: 'Customer',
            reason: 'Underbilling Correction',
            taxRate: 18,
            adjustmentMethod: 'Adjust in ledger and next bill cycle',
            approver: 'Finance Controller',
          }}
          style={{ marginTop: 12 }}
        >
          {/* Section 1 & 2: Basic & Party Details */}
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            1. Basic & Party Details
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 16px' }}>
            <Form.Item label="Party Type" name="partyType" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'Customer', label: 'Customer (Sales Underbilling / Charges)' },
                  { value: 'Supplier', label: 'Supplier (Purchase Return / Re-debit)' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Party Name" name="partyName" rules={[{ required: true, message: 'Please enter party name' }]}>
              <Input placeholder="e.g. Apex Industrial Dynamics" />
            </Form.Item>

            <Form.Item label="Party Code" name="partyCode">
              <Input placeholder="e.g. CUST-1001 or SUP-204" />
            </Form.Item>
          </div>

          {/* Section 3 & 4: Reference & Debit Information */}
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, marginTop: 6, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            2. Reference Details & Debit Reason
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 16px' }}>
            <Form.Item label="Reference Invoice / Bill #" name="referenceInvoice" rules={[{ required: true, message: 'Enter reference bill/invoice' }]}>
              <Input placeholder="e.g. INV-2026-0081" />
            </Form.Item>

            <Form.Item label="Debit Note Date" name="debitNoteDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Debit Reason" name="reason" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'Underbilling Correction', label: 'Underbilling Correction' },
                  { value: 'Additional Charges', label: 'Additional Charges' },
                  { value: 'Price Difference', label: 'Price Difference' },
                  { value: 'Freight Charges', label: 'Freight Charges' },
                  { value: 'Tax Adjustment', label: 'Tax Adjustment' },
                  { value: 'Service Charges', label: 'Service Charges' },
                  { value: 'Quantity Difference', label: 'Quantity Difference' },
                ]}
              />
            </Form.Item>
          </div>

          {/* Section 5: Tax Breakdown & Financial Amounts */}
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, marginTop: 6, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            3. Tax Breakdown & Financial Amounts
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item label="Taxable Amount (₹)" name="taxableAmount" rules={[{ required: true, message: 'Enter taxable amount' }]}>
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

          {/* Section 6 & 7: Adjustment & Approval Details */}
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND_PURPLE, marginBottom: 12, marginTop: 6, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            4. Adjustment & Approval Details
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item label="Adjustment Instructions / Method" name="adjustmentMethod">
              <Input placeholder="e.g. Direct adjustment on upcoming monthly billing" />
            </Form.Item>

            <Form.Item label="Assigning Approver" name="approver">
              <Input placeholder="e.g. Finance Controller / Accounts Head" />
            </Form.Item>
          </div>

          <Form.Item label="Detailed Description / Audit Justification" name="notes">
            <Input.TextArea rows={2} placeholder="Explain reason for extra charge, differential quantity or pricing revision..." />
          </Form.Item>

          {/* Section 8: Attachments */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginBottom: 6 }}>
            Supporting Documents (Optional)
          </div>
          <Upload maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadCloud size={14} />} style={{ borderRadius: 6, fontSize: 12 }}>
              Attach Supporting Invoice / Proof Document
            </Button>
          </Upload>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
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
              Submit Debit Note
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={18} color={BRAND_PURPLE} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                Debit Note: {selectedNote?.debitNoteNumber}
              </span>
            </div>
            {selectedNote && renderApprovalBadge(selectedNote.status)}
          </div>
        }
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={580}
      >
        {selectedNote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Actions Header */}
            <div style={{ display: 'flex', gap: 10, paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
              <Button
                icon={<Printer size={15} />}
                onClick={() => message.info(`Printing Debit Note ${selectedNote.debitNoteNumber}`)}
              >
                Print
              </Button>
              <Button
                icon={<Download size={15} />}
                onClick={() => message.info(`Downloading PDF for ${selectedNote.debitNoteNumber}`)}
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
                  Approve Debit Note
                </Button>
              )}
            </div>

            {/* Party & Reference Card */}
            <div style={{ background: '#FAF5FF', padding: '14px 18px', borderRadius: 10, border: '1px solid #E9D5FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: BRAND_PURPLE, textTransform: 'uppercase' }}>
                  {selectedNote.partyType} Information
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: selectedNote.partyType === 'Customer' ? '#EFF6FF' : '#FAF5FF',
                    color: selectedNote.partyType === 'Customer' ? '#1D4ED8' : '#7C3AED',
                    border: `1px solid ${selectedNote.partyType === 'Customer' ? '#BFDBFE' : '#DDD6FE'}`,
                  }}
                >
                  {selectedNote.partyType}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1F2937', marginTop: 4 }}>
                {selectedNote.partyName}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                Party Code: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedNote.partyCode}</span>
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                Reference Bill/Invoice: <strong style={{ color: BRAND_PURPLE }}>{selectedNote.referenceInvoice}</strong>
              </div>
            </div>

            {/* Financial Calculation Breakdown */}
            <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                Financial Debit Calculation
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                <span>Date of Issue:</span>
                <span style={{ fontWeight: 600 }}>{selectedNote.debitNoteDate}</span>
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
                <span>Total Debit Note Amount:</span>
                <span style={{ color: BRAND_PURPLE }}>₹{Number(selectedNote.totalDebitAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginTop: 8 }}>
                <span>Adjustment Status:</span>
                <span>{renderAdjustmentBadge(selectedNote.adjustmentStatus)}</span>
              </div>
            </div>

            {/* Notes & Justifications */}
            <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 14, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                Audit Justification & Notes
              </div>
              <div style={{ fontSize: 12.5, color: '#4B5563', marginTop: 6, lineHeight: 1.5 }}>
                {selectedNote.notes || 'Supplementary charge entered in accordance with commercial discrepancy review.'}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DebitNotesPage;
