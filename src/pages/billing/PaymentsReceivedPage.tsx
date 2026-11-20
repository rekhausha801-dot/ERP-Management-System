import React, { useState, useMemo } from 'react';
import { Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, InputNumber, Typography, message, Row, Col } from 'antd';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Plus, Search, Printer, Download, Eye, Layers, DollarSign, XCircle, TrendingUp, IndianRupee, ArrowDownLeft } from 'lucide-react';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#EDE9FE';

export interface PaymentReceivedRecord {
  id: string;
  receiptNumber: string;
  paymentDate: string;
  customerName: string;
  customerCode: string;
  invoiceNumber: string;
  amountReceived: number;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Cheque' | 'Credit Card' | 'Cash';
  referenceTransactionId: string;
  status: 'Completed' | 'Pending' | 'Partially Allocated' | 'Unallocated' | 'Refunded';
  allocatedAmount: number;
  unallocatedAmount: number;
  bankAccount: string;
  notes?: string;
}

export const INITIAL_PAYMENTS: PaymentReceivedRecord[] = [
  {
    id: 'PAY-REC-01',
    receiptNumber: 'RCP-2026-101',
    paymentDate: '2026-11-18',
    customerName: 'Tata Steel Processing Ltd',
    customerCode: 'CUST-1001',
    invoiceNumber: 'INV-2026-089',
    amountReceived: 358720,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    referenceTransactionId: 'UTR-HDFC-9948201',
    status: 'Completed',
    allocatedAmount: 358720,
    unallocatedAmount: 0,
    bankAccount: 'HDFC Corporate Current A/C #5020',
    notes: 'Full payment cleared against SO-1048 machinery delivery.',
  },
  {
    id: 'PAY-REC-02',
    receiptNumber: 'RCP-2026-102',
    paymentDate: '2026-11-17',
    customerName: 'Ashok Leyland Foundry Div',
    customerCode: 'CUST-1002',
    invoiceNumber: 'INV-2026-088',
    amountReceived: 201780,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    referenceTransactionId: 'UTR-SBI-4418290',
    status: 'Completed',
    allocatedAmount: 201780,
    unallocatedAmount: 0,
    bankAccount: 'HDFC Corporate Current A/C #5020',
  },
  {
    id: 'PAY-REC-03',
    receiptNumber: 'RCP-2026-103',
    paymentDate: '2026-11-16',
    customerName: 'Lucas TVS Components Ltd',
    customerCode: 'CUST-1003',
    invoiceNumber: 'INV-2026-087',
    amountReceived: 150000,
    paymentMode: 'Cheque',
    referenceTransactionId: 'CHQ-882104 (ICICI)',
    status: 'Partially Allocated',
    allocatedAmount: 150000,
    unallocatedAmount: 0,
    bankAccount: 'ICICI Operational A/C #9914',
    notes: 'Part-settlement for PLC controllers (Inv balance: ₹158,275).',
  },
  {
    id: 'PAY-REC-04',
    receiptNumber: 'RCP-2026-104',
    paymentDate: '2026-11-15',
    customerName: 'Apex Precision Engineering',
    customerCode: 'CUST-1005',
    invoiceNumber: 'Advance Deposit',
    amountReceived: 50000,
    paymentMode: 'UPI',
    referenceTransactionId: 'UPI-AXIS-331089',
    status: 'Unallocated',
    allocatedAmount: 0,
    unallocatedAmount: 50000,
    bankAccount: 'HDFC Corporate Current A/C #5020',
    notes: 'Advance booking token for high-precision tooling.',
  },
];

export const PaymentsReceivedPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentReceivedRecord[]>(() => {
    const raw = localStorage.getItem('erp_payments_received_list');
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS;
  });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'Completed' | 'Pending' | 'Partially Allocated' | 'Unallocated'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentReceivedRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [form] = Form.useForm();

  // Filters
  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchSearch =
        item.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceTransactionId.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus =
        activeTab === 'all' ? statusFilter === 'ALL' || item.status === statusFilter : item.status === activeTab;
      const matchMode = modeFilter === 'ALL' || item.paymentMode === modeFilter;

      return matchSearch && matchStatus && matchMode;
    });
  }, [payments, searchText, statusFilter, modeFilter, activeTab]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amountReceived, 0);
    const completedCount = payments.filter((p) => p.status === 'Completed').length;
    const unallocatedAmount = payments.reduce((acc, curr) => acc + curr.unallocatedAmount, 0);
    const totalReceipts = payments.length;

    return {
      totalCollected,
      completedCount,
      unallocatedAmount,
      totalReceipts,
    };
  }, [payments]);

  const handleSavePayment = (values: any) => {
    const amountReceived = values.amountReceived || 0;
    const isAdvance = values.isAdvance;
    const newRecord: PaymentReceivedRecord = {
      id: 'PAY-REC-' + Date.now(),
      receiptNumber: 'RCP-2026-' + Math.floor(100 + Math.random() * 900),
      paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      customerName: values.customerName,
      customerCode: 'CUST-AUTO',
      invoiceNumber: isAdvance ? 'Advance Deposit' : values.invoiceNumber || 'INV-MANUAL',
      amountReceived,
      paymentMode: values.paymentMode || 'Bank Transfer (NEFT/RTGS)',
      referenceTransactionId: values.referenceTransactionId || 'UTR-TXN-' + Math.floor(1000 + Math.random() * 9000),
      status: isAdvance ? 'Unallocated' : 'Completed',
      allocatedAmount: isAdvance ? 0 : amountReceived,
      unallocatedAmount: isAdvance ? amountReceived : 0,
      bankAccount: values.bankAccount || 'HDFC Corporate Current A/C #5020',
      notes: values.notes,
    };

    const updated = [newRecord, ...payments];
    setPayments(updated);
    localStorage.setItem('erp_payments_received_list', JSON.stringify(updated));
    message.success(`Receipt ${newRecord.receiptNumber} for ₹${amountReceived.toLocaleString('en-IN')} recorded successfully!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Receipt # & Date',
      key: 'rcpDate',
      width: 170,
      render: (_: any, r: PaymentReceivedRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span
            onClick={() => {
              setSelectedRecord(r);
              setDetailModalOpen(true);
            }}
            style={{ fontWeight: 800, color: ROYAL_PURPLE, cursor: 'pointer', fontSize: 13 }}
          >
            {r.receiptNumber}
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>({r.paymentDate})</span>
        </div>
      ),
    },
    {
      title: 'Customer Name & Code',
      key: 'cust',
      render: (_: any, r: PaymentReceivedRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.customerName}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>• {r.customerCode}</span>
        </div>
      ),
    },
    {
      title: 'Invoice Ref',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 140,
      render: (v: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 6,
            background: v === 'Advance Deposit' ? '#FEF3C7' : '#EFF6FF',
            color: v === 'Advance Deposit' ? '#92400E' : '#1D4ED8',
            fontSize: 11.5,
            fontWeight: 700,
            border: v === 'Advance Deposit' ? '1px solid #FDE68A' : '1px solid #BFDBFE',
            whiteSpace: 'nowrap',
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: 'Amount Received (₹)',
      dataIndex: 'amountReceived',
      key: 'amountReceived',
      width: 150,
      align: 'right' as const,
      render: (v: number) => (
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 800, color: '#059669', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{v.toLocaleString('en-IN')}
          </span>
        </div>
      ),
    },
    {
      title: 'Payment Mode & Ref',
      key: 'modeRef',
      width: 220,
      render: (_: any, r: PaymentReceivedRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontSize: 12 }}>
          <span style={{ fontWeight: 600, color: '#1E293B' }}>{r.paymentMode}</span>
          <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
            ({r.referenceTransactionId})
          </span>
        </div>
      ),
    },
    {
      title: 'Bank Account',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 200,
      render: (v: string) => <span style={{ fontSize: 11.5, color: '#475569', whiteSpace: 'nowrap' }}>{v}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center' as const,
      render: (status: string) => {
        if (status === 'Completed') {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0', whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Completed
            </span>
          );
        }
        if (status === 'Partially Allocated') {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A', whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Partially Allocated
            </span>
          );
        }
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FAF5FF', color: ROYAL_PURPLE, fontSize: 11.5, fontWeight: 700, border: '1px solid #E9D5FF', whiteSpace: 'nowrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} /> Unallocated
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, r: PaymentReceivedRecord) => (
        <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            size="small"
            onClick={() => {
              setSelectedRecord(r);
              setDetailModalOpen(true);
            }}
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
            onClick={() => message.success(`Printing Receipt Voucher ${r.receiptNumber}...`)}
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
            Print
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. PAGE HEADER BANNER (Single Row Layout matching Purple ERP Theme) */}
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
            <CreditCard size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Payments Received (Collections)
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Track customer incoming collections, bank remittances, advance deposits, and invoice-wise settlement allocations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Printer size={14} />}
            onClick={() => window.print()}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1' }}
          >
            Print Receipts Log
          </Button>
          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting collections log to Excel...')}
            style={{ borderRadius: 10, height: 38, fontWeight: 600, borderColor: '#CBD5E1' }}
          >
            Export Excel
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
            onClick={() => setCreateModalOpen(true)}
          >
            Record Payment Receipt
          </Button>
        </div>
      </div>

      {/* 2. COLORFUL LIGHT-THEMED KPI CARDS (Each with its distinct soft tinted background & accent colors) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Row 1: 4 Cards */}
        <Row gutter={[12, 12]}>
          {/* Card 1: Total Receipts (Soft Lavender/Purple Theme) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => setActiveTab('all')}
              style={{
                background: 'linear-gradient(180deg, #FAF5FF 0%, #F5EEFD 100%)',
                borderRadius: 16,
                padding: '16px 18px',
                border: activeTab === 'all' ? `1.5px solid ${ROYAL_PURPLE}` : '1px solid #E9D5FF',
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
                  Total Receipts
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
                  <CreditCard size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: ROYAL_PURPLE, lineHeight: 1 }}>
                    {summaryMetrics.totalReceipts < 10 ? `0${summaryMetrics.totalReceipts}` : summaryMetrics.totalReceipts}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED' }}>
                    ₹{(summaryMetrics.totalCollected / 100000).toFixed(2)}L
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7E22CE', marginTop: 4, whiteSpace: 'nowrap' }}>
                  All Receipts
                </div>
              </div>
            </div>
          </Col>

          {/* Card 2: Today's Collections (Soft Sky Blue Theme) */}
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
                  Today's Collections
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
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#0284C7', lineHeight: 1 }}>
                    ₹1.85L
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0284C7', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Awaiting Clearance
                </div>
              </div>
            </div>
          </Col>

          {/* Card 3: This Month Collections (Soft Mint Green Theme) */}
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
                  This Month Collections
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
                  <IndianRupee size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#059669', lineHeight: 1 }}>
                    ₹{(summaryMetrics.totalCollected / 100000).toFixed(2)}L
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Fully Settled
                </div>
              </div>
            </div>
          </Col>

          {/* Card 4: Pending Collections (Soft Coral/Rose Theme) */}
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
                  Pending Collections
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
                    ₹8.45L
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Past Due
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 2: 2 Cards (Equal Width md={12}) */}
        <Row gutter={[12, 12]}>
          {/* Card 5: Unallocated Payments (Soft Amber Theme) */}
          <Col xs={24} sm={12} md={12}>
            <div
              onClick={() => setActiveTab('Unallocated')}
              style={{
                background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
                borderRadius: 16,
                padding: '16px 20px',
                border: activeTab === 'Unallocated' ? '1.5px solid #D97706' : '1px solid #FDE68A',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 114,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', whiteSpace: 'nowrap' }}>
                  Unallocated Payments
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
                  <AlertCircle size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                    ₹{(summaryMetrics.unallocatedAmount / 1000).toFixed(0)}k
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#B45309', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Split Collection
                </div>
              </div>
            </div>
          </Col>

          {/* Card 6: Pending Receivables (Soft Indigo Theme) */}
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
                  Pending Receivables
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
                  <IndianRupee size={16} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>
                    ₹4.25L
                  </span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4338CA', marginTop: 4, whiteSpace: 'nowrap' }}>
                  Pending Receivables
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 3. TABLE CONTAINER WITH CLEAN PILL TABS & INTEGRATED FILTER TOOLBAR */}
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
          {/* Pill Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Button
              type={activeTab === 'all' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('all')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'all' ? ROYAL_PURPLE : '#FFFFFF',
                borderColor: activeTab === 'all' ? ROYAL_PURPLE : '#E2E8F0',
                color: activeTab === 'all' ? '#FFFFFF' : '#475569',
              }}
            >
              All Collections ({payments.length})
            </Button>
            <Button
              type={activeTab === 'Completed' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('Completed')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'Completed' ? '#059669' : '#FFFFFF',
                borderColor: activeTab === 'Completed' ? '#059669' : '#E2E8F0',
                color: activeTab === 'Completed' ? '#FFFFFF' : '#059669',
              }}
            >
              Completed Payments
            </Button>
            <Button
              type={activeTab === 'Partially Allocated' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('Partially Allocated')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'Partially Allocated' ? '#D97706' : '#FFFFFF',
                borderColor: activeTab === 'Partially Allocated' ? '#D97706' : '#E2E8F0',
                color: activeTab === 'Partially Allocated' ? '#FFFFFF' : '#D97706',
              }}
            >
              Partially Allocated
            </Button>
            <Button
              type={activeTab === 'Unallocated' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('Unallocated')}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                backgroundColor: activeTab === 'Unallocated' ? '#7C3AED' : '#FFFFFF',
                borderColor: activeTab === 'Unallocated' ? '#7C3AED' : '#E2E8F0',
                color: activeTab === 'Unallocated' ? '#FFFFFF' : '#7C3AED',
              }}
            >
              Unallocated Advances
            </Button>
          </div>

          {/* Search & Mode Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Search receipt #, customer, UTR, inv..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260, height: 34, borderRadius: 8 }}
              allowClear
            />
            <Select
              value={modeFilter}
              onChange={setModeFilter}
              style={{ width: 190, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Payment Modes' },
                { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                { value: 'UPI', label: 'UPI Remittance' },
                { value: 'Cheque', label: 'Bank Cheque' },
                { value: 'Cash', label: 'Cash Counter' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} collections` }}
          scroll={{ x: 1150 }}
          size="middle"
        />
      </div>

      {/* Record Payment Receipt Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Record Customer Payment Collection Receipt</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Post Payment Voucher"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSavePayment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
              <Select placeholder="Select transacting customer">
                <Select.Option value="Tata Steel Processing Ltd">Tata Steel Processing Ltd</Select.Option>
                <Select.Option value="Ashok Leyland Foundry Div">Ashok Leyland Foundry Div</Select.Option>
                <Select.Option value="Lucas TVS Components Ltd">Lucas TVS Components Ltd</Select.Option>
                <Select.Option value="Sundaram Fasteners Ltd">Sundaram Fasteners Ltd</Select.Option>
                <Select.Option value="Apex Precision Engineering">Apex Precision Engineering</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="invoiceNumber" label="Target Invoice Number" initialValue="INV-2026-090">
              <Input placeholder="e.g. INV-2026-090" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="amountReceived" label="Amount Received (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="INR Amount" />
            </Form.Item>

            <Form.Item name="paymentDate" label="Remittance Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="paymentMode" label="Payment Channel" initialValue="Bank Transfer (NEFT/RTGS)">
              <Select>
                <Select.Option value="Bank Transfer (NEFT/RTGS)">NEFT / RTGS</Select.Option>
                <Select.Option value="UPI">Instant UPI</Select.Option>
                <Select.Option value="Cheque">Cheque Clearing</Select.Option>
                <Select.Option value="Cash">Cash</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="referenceTransactionId" label="UTR / Cheque / Transaction Ref #" rules={[{ required: true }]}>
              <Input placeholder="e.g. UTR-HDFC-99214" />
            </Form.Item>

            <Form.Item name="bankAccount" label="Deposited Bank Account" initialValue="HDFC Corporate Current A/C #5020">
              <Select>
                <Select.Option value="HDFC Corporate Current A/C #5020">HDFC Corporate Current A/C #5020</Select.Option>
                <Select.Option value="ICICI Operational A/C #9914">ICICI Operational A/C #9914</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Receipt Voucher Notes">
            <Input.TextArea rows={2} placeholder="Add payment notes, TDS deductions, rebate remarks..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Receipt Voucher Detail Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Official Receipt Voucher - {selectedRecord?.receiptNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.success(`Printing Receipt Voucher ${selectedRecord?.receiptNumber}...`);
              setDetailModalOpen(false);
            }}
          >
            Print Receipt Voucher
          </Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{selectedRecord.customerName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Customer Code: {selectedRecord.customerCode} &bull; Date: {selectedRecord.paymentDate}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Collected Amount:</span>
                <span style={{ fontWeight: 800, color: '#10B981', fontSize: 16 }}>
                  ₹{selectedRecord.amountReceived.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Allocated to Invoice:</span>
                <span style={{ fontWeight: 700 }}>{selectedRecord.invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Payment Method:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.paymentMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Bank Reference (UTR):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedRecord.referenceTransactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748B' }}>Deposited Account:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.bankAccount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
