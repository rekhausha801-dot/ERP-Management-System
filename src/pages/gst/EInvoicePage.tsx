import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Space,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileText,
  CheckCircle,
  Clock,
  Search,
  Download,
  QrCode,
  RefreshCw,
  XCircle,
  ShieldCheck,
  Building2,
  ExternalLink,
  Copy,
} from 'lucide-react';

const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#FAF5FF';
const BRAND_BORDER = '#E9D5FF';

interface EInvoiceRecord {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGstin: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  irnStatus: 'Generated' | 'Pending' | 'Failed' | 'Cancelled';
  irnNumber?: string;
  ackNumber?: string;
  ackDate?: string;
  qrCodeUrl?: string;
}

const INITIAL_EINVOICES: EInvoiceRecord[] = [
  {
    id: 'EIN-101',
    invoiceNumber: 'INV-2026-0891',
    invoiceDate: '2026-11-18',
    customerName: 'Tata Motors Fleet Solutions Ltd',
    customerGstin: '27AABCT3518Q1ZV',
    taxableAmount: 485000,
    taxAmount: 87300,
    totalAmount: 572300,
    irnStatus: 'Generated',
    irnNumber: '4a6b29cf10e8d9760c4980e0c3ab7b9b81ef1037624c965701fa1c28b577319e',
    ackNumber: '1126108992019',
    ackDate: '2026-11-18 14:22:10',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IRN:4a6b29cf10e8d9760c4980e0c3ab7b9b81ef1037624c965701fa1c28b577319e',
  },
  {
    id: 'EIN-102',
    invoiceNumber: 'INV-2026-0892',
    invoiceDate: '2026-11-18',
    customerName: 'Larsen & Toubro Heavy Infotech',
    customerGstin: '29AAACL0204P1Z4',
    taxableAmount: 1250000,
    taxAmount: 225000,
    totalAmount: 1475000,
    irnStatus: 'Generated',
    irnNumber: '9f21bc9081e289c09aa302bbce56311de12048995aae388410bc9318820011bb',
    ackNumber: '1126108992020',
    ackDate: '2026-11-18 16:45:00',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IRN:9f21bc9081e289c09aa302bbce56311de12048995aae388410bc9318820011bb',
  },
  {
    id: 'EIN-103',
    invoiceNumber: 'INV-2026-0895',
    invoiceDate: '2026-11-19',
    customerName: 'Mahindra Logistics Supply Chain',
    customerGstin: '27AABCM8291F1Z2',
    taxableAmount: 320000,
    taxAmount: 57600,
    totalAmount: 377600,
    irnStatus: 'Pending',
  },
  {
    id: 'EIN-104',
    invoiceNumber: 'INV-2026-0896',
    invoiceDate: '2026-11-19',
    customerName: 'Godrej Consumer Products Ltd',
    customerGstin: '27AAACG0582B1Z8',
    taxableAmount: 760000,
    taxAmount: 136800,
    totalAmount: 896800,
    irnStatus: 'Pending',
  },
  {
    id: 'EIN-105',
    invoiceNumber: 'INV-2026-0890',
    invoiceDate: '2026-11-17',
    customerName: 'Ashok Leyland Foundry Division',
    customerGstin: '33AAACA2310C1Z2',
    taxableAmount: 620000,
    taxAmount: 111600,
    totalAmount: 731600,
    irnStatus: 'Cancelled',
    irnNumber: '1b89ef001a88bb9011de22fc9081273948571029384756102938475610293847',
    ackNumber: '1126108991980',
    ackDate: '2026-11-17 11:15:30',
  },
];

export const EInvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<EInvoiceRecord[]>(INITIAL_EINVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  // QR Modal
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoiceRecord | null>(null);

  // Dynamic Calculated Metrics
  const metrics = useMemo(() => {
    const totalCount = invoices.length;
    const generatedCount = invoices.filter((i) => i.irnStatus === 'Generated').length;
    const pendingCount = invoices.filter((i) => i.irnStatus === 'Pending').length;
    const totalValue = invoices
      .filter((i) => i.irnStatus !== 'Cancelled')
      .reduce((sum, item) => sum + item.totalAmount, 0);

    return { totalCount, generatedCount, pendingCount, totalValue };
  }, [invoices]);

  // Unified Filter Logic
  const filteredInvoices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchesSearch =
        q === '' ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerGstin.toLowerCase().includes(q) ||
        (inv.irnNumber && inv.irnNumber.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || inv.irnStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Generate IRN
  const handleGenerateIRN = (record: EInvoiceRecord) => {
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const randomAck = `112610899${Math.floor(2030 + Math.random() * 9000)}`;

    const updated = invoices.map((inv) => {
      if (inv.id === record.id) {
        return {
          ...inv,
          irnStatus: 'Generated' as const,
          irnNumber: randomHex,
          ackNumber: randomAck,
          ackDate: '2026-11-20 17:35:00',
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IRN:${randomHex}`,
        };
      }
      return inv;
    });

    setInvoices(updated);
    message.success(`E-Invoice IRN successfully generated for ${record.invoiceNumber}`);
  };

  // Cancel IRN
  const handleCancelIRN = (record: EInvoiceRecord) => {
    Modal.confirm({
      title: 'Cancel E-Invoice IRN on NIC Portal',
      content: `Are you sure you want to cancel the IRN for ${record.invoiceNumber}? This cancellation will be permanently reported to the GST NIC Portal.`,
      okText: 'Yes, Cancel IRN',
      okType: 'danger',
      onOk: () => {
        setInvoices(
          invoices.map((inv) =>
            inv.id === record.id ? { ...inv, irnStatus: 'Cancelled' as const } : inv
          )
        );
        message.warning(`IRN for ${record.invoiceNumber} has been marked as Cancelled.`);
      },
    });
  };

  // Sync with IRP
  const handleSyncIRP = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      message.success('Synchronized with NIC E-Invoice IRP Portal. All acknowledgment records updated.');
    }, 1200);
  };

  // Professional Data Table Columns
  const columns: ColumnsType<EInvoiceRecord> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 150,
      render: (inv: string) => (
        <span style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace', fontSize: 13 }}>
          {inv}
        </span>
      ),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 130,
      render: (date: string) => <span style={{ color: '#475569', fontSize: 12.5 }}>{date}</span>,
    },
    {
      title: 'Customer & GSTIN',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, r: EInvoiceRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ marginTop: 2 }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 600,
                color: BRAND_PURPLE,
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              {r.customerGstin}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      align: 'right',
      width: 140,
      render: (v: number) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#334155' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      width: 150,
      render: (v: number) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', fontSize: 13 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'IRN Status',
      dataIndex: 'irnStatus',
      key: 'irnStatus',
      align: 'center',
      width: 130,
      render: (st: string) => {
        if (st === 'Generated') {
          return (
            <Tag style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', fontWeight: 700, borderRadius: 6, fontSize: 11, padding: '2px 8px' }}>
              Generated
            </Tag>
          );
        }
        if (st === 'Pending') {
          return (
            <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 700, borderRadius: 6, fontSize: 11, padding: '2px 8px' }}>
              Pending Push
            </Tag>
          );
        }
        if (st === 'Cancelled') {
          return (
            <Tag style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', fontWeight: 700, borderRadius: 6, fontSize: 11, padding: '2px 8px' }}>
              Cancelled
            </Tag>
          );
        }
        return <Tag>{st}</Tag>;
      },
    },
    {
      title: 'IRN Details / Action',
      key: 'action',
      align: 'right',
      width: 170,
      render: (_, r: EInvoiceRecord) => {
        if (r.irnStatus === 'Generated') {
          return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
              <Button
                size="small"
                icon={<QrCode size={13} color={BRAND_PURPLE} />}
                onClick={() => {
                  setSelectedInvoice(r);
                  setQrModalVisible(true);
                }}
                style={{
                  height: 30,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  borderColor: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                View QR
              </Button>
              <Tooltip title="Cancel IRN on NIC">
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<XCircle size={15} />}
                  onClick={() => handleCancelIRN(r)}
                  style={{ height: 30, width: 30, padding: 0 }}
                />
              </Tooltip>
            </div>
          );
        }

        if (r.irnStatus === 'Pending') {
          return (
            <Button
              type="primary"
              size="small"
              icon={<RefreshCw size={12} />}
              onClick={() => handleGenerateIRN(r)}
              style={{
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                height: 30,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Generate IRN
            </Button>
          );
        }

        return <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>Cancelled on NIC</span>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
      {/* 1. Header Bar: Title, Description & Action Button properly aligned */}
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              E-Invoicing Portal (IRN & QR)
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Automated GST E-Invoicing compliant with NIC IRP specifications, B2B digitally signed IRN & QR embedding.
            </div>
          </div>
        </div>

        <Button
          type="primary"
          icon={<RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />}
          loading={isSyncing}
          onClick={handleSyncIRP}
          style={{
            backgroundColor: BRAND_PURPLE,
            borderColor: BRAND_PURPLE,
            borderRadius: 8,
            height: 38,
            fontWeight: 700,
            fontSize: 13,
            boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
            padding: '0 18px',
          }}
        >
          Sync with IRP
        </Button>
      </div>

      {/* 2. Four Compact Summary Cards in One Horizontal Row (100% Width CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Total B2B Invoices */}
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
              Total B2B Invoices
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.totalCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Eligible for IRN generation
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

        {/* IRN Generated */}
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
              IRN Generated
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.generatedCount}
            </div>
            <div style={{ fontSize: 11, color: '#15803D', fontWeight: 600, marginTop: 2 }}>
              Active QR & Digital Signature
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
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Pending IRN */}
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
              Pending IRN
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.pendingCount}
            </div>
            <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, marginTop: 2 }}>
              Requires immediate upload
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

        {/* E-Invoice Value */}
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
              E-Invoice Value
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              ₹{metrics.totalValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: '#1D4ED8', fontWeight: 600, marginTop: 2 }}>
              Reconciled for GSTR-1
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
            <QrCode size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar: Aligned in One Clean Horizontal Toolbar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Input
          prefix={<Search size={15} color="#94A3B8" />}
          placeholder="Search by invoice #, GSTIN, customer name, IRN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ flex: '1 1 360px', height: 38, borderRadius: 8, fontSize: 13, borderColor: '#CBD5E1' }}
        />

        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 170, height: 38 }}
          options={[
            { value: 'ALL', label: 'All IRN Statuses' },
            { value: 'Generated', label: 'Generated' },
            { value: 'Pending', label: 'Pending Push' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
        />

        {(searchTerm || statusFilter !== 'ALL') && (
          <Button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            style={{ height: 38, borderRadius: 8, fontSize: 12 }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Main Data Table: Professional enterprise styling with aligned columns */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
            B2B Tax Invoices & IRN Generation Ledger
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Showing <strong>{filteredInvoices.length}</strong> of {invoices.length} registered invoices
          </span>
        </div>

        <Table
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true }}
          size="middle"
        />
      </div>

      {/* 5. IRN QR Code & Acknowledgment Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: BRAND_PURPLE, fontWeight: 800, fontSize: 16 }}>
            <QrCode size={18} />
            <span>NIC E-Invoice IRN & Signed QR Code</span>
          </div>
        }
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)} style={{ borderRadius: 8, height: 36, fontWeight: 600 }}>
            Close
          </Button>,
          <Button
            key="copy"
            icon={<Copy size={13} />}
            onClick={() => {
              if (selectedInvoice?.irnNumber) {
                navigator.clipboard.writeText(selectedInvoice.irnNumber);
                message.success('IRN copied to clipboard!');
              }
            }}
            style={{ borderRadius: 8, height: 36, fontWeight: 600 }}
          >
            Copy IRN
          </Button>,
          <Button
            key="pdf"
            type="primary"
            icon={<Download size={13} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, borderRadius: 8, height: 36, fontWeight: 700 }}
            onClick={() => {
              message.success(`Downloading digitally signed E-Invoice PDF for ${selectedInvoice?.invoiceNumber}`);
              setQrModalVisible(false);
            }}
          >
            Download Signed PDF
          </Button>,
        ]}
        width={580}
      >
        {selectedInvoice && (
          <div style={{ padding: '10px 0', textAlign: 'center' }}>
            {selectedInvoice.qrCodeUrl ? (
              <div style={{ display: 'inline-block', padding: 12, background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 12, boxShadow: '0 4px 14px rgba(68, 26, 135, 0.08)' }}>
                <img
                  src={selectedInvoice.qrCodeUrl}
                  alt="E-Invoice QR"
                  style={{ width: 180, height: 180, display: 'block', borderRadius: 6 }}
                />
                <div style={{ fontSize: 10.5, color: BRAND_PURPLE, fontWeight: 700, marginTop: 6 }}>
                  NIC Signed B2B QR Code
                </div>
              </div>
            ) : (
              <div style={{ width: 180, height: 180, margin: '0 auto', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', borderRadius: 8 }}>
                No QR Generated
              </div>
            )}

            <div style={{ textAlign: 'left', marginTop: 18, background: '#F8FAFC', padding: 16, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div>
                <span style={{ color: '#64748B', fontWeight: 600, display: 'block' }}>IRN (Invoice Reference Number):</span>
                <span style={{ fontFamily: 'monospace', color: BRAND_PURPLE, wordBreak: 'break-all', fontWeight: 700, fontSize: 11.5, background: '#FFFFFF', padding: '4px 8px', borderRadius: 6, display: 'block', marginTop: 3, border: '1px solid #E2E8F0' }}>
                  {selectedInvoice.irnNumber}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 6, borderTop: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Acknowledgment No:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{selectedInvoice.ackNumber}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Ack Date & Time:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedInvoice.ackDate}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 6, borderTop: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Invoice Number:</span>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Buyer GSTIN:</span>
                  <span style={{ fontWeight: 700, color: BRAND_PURPLE, fontFamily: 'monospace' }}>{selectedInvoice.customerGstin}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EInvoicePage;
