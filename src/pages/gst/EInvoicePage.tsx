import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Tooltip,
  message,
  Typography,
} from 'antd';
import {
  FileText,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Download,
  QrCode,
  AlertCircle,
  Share2,
  RefreshCw,
  XCircle,
} from 'lucide-react';

const { Text } = Typography;
const BRAND_PURPLE = '#5421A8';

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
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=IRN:4a6b29cf10e8d9760c4980e0c3ab7b9b81ef1037624c965701fa1c28b577319e',
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
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=IRN:9f21bc9081e289c09aa302bbce56311de12048995aae388410bc9318820011bb',
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
    invoiceNumber: 'INV-2026-0870',
    invoiceDate: '2026-11-15',
    customerName: 'Wipro Infrastructure Engineering',
    customerGstin: '29AAACW1234D1ZP',
    taxableAmount: 210000,
    taxAmount: 37800,
    totalAmount: 247800,
    irnStatus: 'Cancelled',
    irnNumber: '33bb89c10982bb90f911802931aadc880011aa340918ef00192837bcda124500',
    ackNumber: '1126108991823',
    ackDate: '2026-11-15 11:10:00',
  },
];

export const EInvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<EInvoiceRecord[]>(INITIAL_EINVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<EInvoiceRecord | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Summary Metrics (4 Cards)
  const metrics = useMemo(() => {
    const totalCount = invoices.length;
    const generatedCount = invoices.filter((i) => i.irnStatus === 'Generated').length;
    const pendingCount = invoices.filter((i) => i.irnStatus === 'Pending').length;
    const totalValue = invoices
      .filter((i) => i.irnStatus === 'Generated')
      .reduce((acc, i) => acc + i.totalAmount, 0);

    return { totalCount, generatedCount, pendingCount, totalValue };
  }, [invoices]);

  // Filtered List
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerGstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.irnNumber && inv.irnNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || inv.irnStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Generate IRN Action
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
          ackDate: '2026-11-19 16:00:00',
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=IRN:${randomHex}`,
        };
      }
      return inv;
    });

    setInvoices(updated);
    message.success(`E-Invoice IRN successfully generated for ${record.invoiceNumber}`);
  };

  const handleCancelIRN = (record: EInvoiceRecord) => {
    Modal.confirm({
      title: 'Cancel E-Invoice IRN',
      content: `Are you sure you want to cancel IRN for ${record.invoiceNumber}? This will report cancellation to GST NIC Portal.`,
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

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (inv: string) => <span className="font-bold text-slate-800">{inv}</span>,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
    },
    {
      title: 'Customer & GSTIN',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: EInvoiceRecord) => (
        <div>
          <div className="font-medium text-slate-900">{name}</div>
          <div className="text-xs font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
            {record.customerGstin}
          </div>
        </div>
      ),
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span className="font-bold text-slate-900">₹${v.toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'IRN Status',
      dataIndex: 'irnStatus',
      key: 'irnStatus',
      align: 'center' as const,
      render: (st: string) => {
        if (st === 'Generated') return <Tag color="success">Generated</Tag>;
        if (st === 'Pending') return <Tag color="warning">Pending Push</Tag>;
        if (st === 'Cancelled') return <Tag color="error">Cancelled</Tag>;
        return <Tag>{st}</Tag>;
      },
    },
    {
      title: 'IRN Details / Action',
      key: 'action',
      render: (_: any, record: EInvoiceRecord) => {
        if (record.irnStatus === 'Generated') {
          return (
            <Space size="small">
              <Tooltip title="View IRN & QR Code">
                <Button
                  size="small"
                  icon={<QrCode size={14} className="text-purple-700" />}
                  onClick={() => {
                    setSelectedInvoice(record);
                    setQrModalVisible(true);
                  }}
                >
                  View QR
                </Button>
              </Tooltip>
              <Tooltip title="Cancel IRN">
                <Button
                  size="small"
                  danger
                  type="text"
                  icon={<XCircle size={14} />}
                  onClick={() => handleCancelIRN(record)}
                />
              </Tooltip>
            </Space>
          );
        }

        if (record.irnStatus === 'Pending') {
          return (
            <Button
              type="primary"
              size="small"
              icon={<RefreshCw size={13} />}
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
              onClick={() => handleGenerateIRN(record)}
            >
              Generate IRN
            </Button>
          );
        }

        return <span className="text-xs text-rose-500 font-medium">Cancelled on NIC</span>;
      },
    },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">E-Invoicing Portal (IRN & QR)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Automated GST E-Invoicing compliant with NIC IRP specifications & QR code embedding
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            type="primary"
            icon={<RefreshCw size={14} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => message.success('Syncing with NIC E-Invoice IRP Portal...')}
          >
            Sync with IRP
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total B2B Invoices</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{metrics.totalCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Eligible for IRN generation</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <FileText size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">IRN Generated</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{metrics.generatedCount}</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Active QR & Digital Signature</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Pending IRN</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">{metrics.pendingCount}</h3>
              <p className="text-xs text-amber-700 mt-1">Requires immediate upload</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">E-Invoice Value</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{metrics.totalValue.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Reconciled for GSTR-1</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <QrCode size={24} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Table & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Input
            prefix={<Search size={16} className="text-slate-400" />}
            placeholder="Search by invoice #, GSTIN, customer name, IRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full md:w-44"
            options={[
              { value: 'ALL', label: 'All IRN Statuses' },
              { value: 'Generated', label: 'Generated' },
              { value: 'Pending', label: 'Pending Push' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        <Table
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* IRN QR Modal */}
      <Modal
        title="E-Invoice IRN & QR Code Details"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="pdf"
            type="primary"
            icon={<Download size={14} />}
            style={{ backgroundColor: BRAND_PURPLE }}
            onClick={() => {
              message.success(`Downloading signed E-Invoice PDF for ${selectedInvoice?.invoiceNumber}`);
              setQrModalVisible(false);
            }}
          >
            Download Signed PDF
          </Button>,
        ]}
        width={550}
      >
        {selectedInvoice && (
          <div className="py-2 text-center">
            {selectedInvoice.qrCodeUrl ? (
              <img
                src={selectedInvoice.qrCodeUrl}
                alt="E-Invoice QR"
                className="w-44 h-44 mx-auto p-2 border border-slate-300 rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-44 h-44 mx-auto border flex items-center justify-center text-slate-400">
                No QR Generated
              </div>
            )}

            <div className="text-left mt-5 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">IRN (Invoice Reference Number):</span>
                <span className="font-mono text-purple-900 break-all select-all font-semibold">
                  {selectedInvoice.irnNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block">Ack No:</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.ackNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ack Date & Time:</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.ackDate}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block">Invoice #:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Buyer GSTIN:</span>
                  <span className="font-semibold text-indigo-700">{selectedInvoice.customerGstin}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
