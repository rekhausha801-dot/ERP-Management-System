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
  InputNumber,
  DatePicker,
} from 'antd';
import {
  Truck,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Download,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';

const BRAND_PURPLE = '#5421A8';

interface EWayBillRecord {
  id: string;
  ewayBillNo: string;
  ewayBillDate: string;
  invoiceNo: string;
  customerName: string;
  fromPincode: string;
  toPincode: string;
  distanceKm: number;
  transporterName: string;
  transporterId: string;
  vehicleNo: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  validUntil: string;
  invoiceValue: number;
}

const INITIAL_EWAY_BILLS: EWayBillRecord[] = [
  {
    id: 'EWB-001',
    ewayBillNo: '241890219842',
    ewayBillDate: '2026-11-18 10:15',
    invoiceNo: 'INV-2026-0891',
    customerName: 'Tata Motors Fleet Solutions Ltd',
    fromPincode: '400001 (Mumbai)',
    toPincode: '411018 (Pune)',
    distanceKm: 148,
    transporterName: 'V-Trans Logistics Ltd',
    transporterId: '27AABCV8910Q1ZZ',
    vehicleNo: 'MH-12-RN-9921',
    status: 'Active',
    validUntil: '2026-11-20 23:59',
    invoiceValue: 572300,
  },
  {
    id: 'EWB-002',
    ewayBillNo: '241890219888',
    ewayBillDate: '2026-11-17 14:30',
    invoiceNo: 'INV-2026-0888',
    customerName: 'Bharat Forge Industrial Hub',
    fromPincode: '400001 (Mumbai)',
    toPincode: '380001 (Ahmedabad)',
    distanceKm: 520,
    transporterName: 'Safexpress Private Ltd',
    transporterId: '27AAACS1092P1ZT',
    vehicleNo: 'GJ-01-AX-4432',
    status: 'Active',
    validUntil: '2026-11-21 23:59',
    invoiceValue: 1240000,
  },
  {
    id: 'EWB-003',
    ewayBillNo: '241890219710',
    ewayBillDate: '2026-11-12 09:00',
    invoiceNo: 'INV-2026-0865',
    customerName: 'Havells India Warehouse',
    fromPincode: '400001 (Mumbai)',
    toPincode: '110001 (Delhi)',
    distanceKm: 1420,
    transporterName: 'GATI KWE Cargo',
    transporterId: '27AAACG4419K1ZS',
    vehicleNo: 'DL-01-GA-1120',
    status: 'Expired',
    validUntil: '2026-11-16 23:59',
    invoiceValue: 890000,
  },
  {
    id: 'EWB-004',
    ewayBillNo: '241890219650',
    ewayBillDate: '2026-11-14 11:20',
    invoiceNo: 'INV-2026-0870',
    customerName: 'Wipro Infrastructure Engineering',
    fromPincode: '400001 (Mumbai)',
    toPincode: '560001 (Bangalore)',
    distanceKm: 980,
    transporterName: 'Blue Dart Surface',
    transporterId: '27AAACB0991P1ZK',
    vehicleNo: 'KA-05-AA-5561',
    status: 'Cancelled',
    validUntil: '2026-11-17 23:59',
    invoiceValue: 247800,
  },
];

export const EWayBillPage: React.FC = () => {
  const [ewayBills, setEwayBills] = useState<EWayBillRecord[]>(INITIAL_EWAY_BILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<EWayBillRecord | null>(null);
  const [form] = Form.useForm();

  // Summary Metrics (4 Cards)
  const metrics = useMemo(() => {
    const totalCount = ewayBills.length;
    const activeCount = ewayBills.filter((b) => b.status === 'Active').length;
    const expiredCount = ewayBills.filter((b) => b.status === 'Expired').length;
    const totalValue = ewayBills.reduce((acc, b) => acc + b.invoiceValue, 0);

    return { totalCount, activeCount, expiredCount, totalValue };
  }, [ewayBills]);

  // Filtered List
  const filteredBills = useMemo(() => {
    return ewayBills.filter((bill) => {
      const matchSearch =
        bill.ewayBillNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.transporterName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || bill.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [ewayBills, searchTerm, statusFilter]);

  const handleCreateSubmit = (values: any) => {
    const randomEwb = `24189021${Math.floor(1000 + Math.random() * 9000)}`;
    const newBill: EWayBillRecord = {
      id: `EWB-${Date.now()}`,
      ewayBillNo: randomEwb,
      ewayBillDate: dayjs().format('YYYY-MM-DD HH:mm'),
      invoiceNo: values.invoiceNo,
      customerName: values.customerName,
      fromPincode: values.fromPincode || '400001 (Mumbai)',
      toPincode: values.toPincode,
      distanceKm: Number(values.distanceKm) || 100,
      transporterName: values.transporterName,
      transporterId: values.transporterId || '27AABCX0000X1ZZ',
      vehicleNo: values.vehicleNo.toUpperCase(),
      status: 'Active',
      validUntil: dayjs().add(2, 'day').format('YYYY-MM-DD 23:59'),
      invoiceValue: Number(values.invoiceValue) || 100000,
    };

    setEwayBills([newBill, ...ewayBills]);
    message.success(`E-Way Bill ${newBill.ewayBillNo} generated successfully!`);
    setIsGenerateModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'E-Way Bill #',
      dataIndex: 'ewayBillNo',
      key: 'ewayBillNo',
      render: (num: string) => <span className="font-bold text-purple-900">{num}</span>,
    },
    {
      title: 'Date & Valid Until',
      dataIndex: 'ewayBillDate',
      key: 'ewayBillDate',
      render: (date: string, r: EWayBillRecord) => (
        <div className="text-xs">
          <div className="text-slate-800 font-medium">{date}</div>
          <div className="text-slate-500">Exp: {r.validUntil}</div>
        </div>
      ),
    },
    {
      title: 'Invoice & Consignee',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: (inv: string, r: EWayBillRecord) => (
        <div>
          <span className="font-semibold text-blue-700 text-xs">{inv}</span>
          <div className="text-slate-800 font-medium text-xs">{r.customerName}</div>
        </div>
      ),
    },
    {
      title: 'Route & Distance',
      dataIndex: 'fromPincode',
      key: 'fromPincode',
      render: (_: any, r: EWayBillRecord) => (
        <div className="text-xs">
          <div className="text-slate-700">
            {r.fromPincode} → {r.toPincode}
          </div>
          <span className="text-[11px] font-bold text-slate-500">{r.distanceKm} KM</span>
        </div>
      ),
    },
    {
      title: 'Vehicle & Transporter',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      render: (veh: string, r: EWayBillRecord) => (
        <div>
          <Tag color="cyan" className="font-mono font-bold">
            {veh}
          </Tag>
          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{r.transporterName}</div>
        </div>
      ),
    },
    {
      title: 'Bill Value',
      dataIndex: 'invoiceValue',
      key: 'invoiceValue',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (st: string) => {
        if (st === 'Active') return <Tag color="success">Active (In Transit)</Tag>;
        if (st === 'Expired') return <Tag color="warning">Expired</Tag>;
        return <Tag color="error">Cancelled</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: EWayBillRecord) => (
        <Space size="small">
          <Tooltip title="View E-Way Bill">
            <Button
              type="text"
              size="small"
              icon={<Eye size={14} className="text-purple-700" />}
              onClick={() => setViewRecord(record)}
            />
          </Tooltip>
          <Tooltip title="Print Slip">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} className="text-slate-600" />}
              onClick={() => message.info(`Downloading E-Way Bill PDF for ${record.ewayBillNo}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">E-Way Bill Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate, track, update vehicle Part B and manage validity for goods in transit under GST
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => setIsGenerateModalOpen(true)}
          >
            Generate E-Way Bill
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total E-Way Bills</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{metrics.totalCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Generated this month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Truck size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Active In Transit</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{metrics.activeCount}</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Valid vehicle authorization</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Expired / Needs Part B</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1">{metrics.expiredCount}</h3>
              <p className="text-xs text-amber-700 mt-1">Requires extension / update</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Consignment Value</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{metrics.totalValue.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Insured goods moved</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin size={24} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Table & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Input
            prefix={<Search size={16} className="text-slate-400" />}
            placeholder="Search by E-Way Bill #, Invoice #, Vehicle #, Transporter..."
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
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Active', label: 'Active In-Transit' },
              { value: 'Expired', label: 'Expired' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        <Table
          dataSource={filteredBills}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Generate E-Way Bill Modal */}
      <Modal
        title="Generate New E-Way Bill (Part A & Part B)"
        open={isGenerateModalOpen}
        onCancel={() => setIsGenerateModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit} className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="invoiceNo"
                label="Invoice Number"
                rules={[{ required: true, message: 'Please enter invoice number' }]}
              >
                <Input placeholder="e.g. INV-2026-0899" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Consignee / Customer Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="e.g. JSW Steel Ltd" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromPincode"
                label="Dispatch From Pincode"
                initialValue="400001"
                rules={[{ required: true }]}
              >
                <Input placeholder="Origin Pincode" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toPincode"
                label="Ship To Pincode"
                rules={[{ required: true, message: 'Destination pincode required' }]}
              >
                <Input placeholder="e.g. 560001" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="distanceKm"
                label="Distance (in KM)"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={1} placeholder="e.g. 350" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="vehicleNo"
                label="Vehicle Number (Part B)"
                rules={[{ required: true, message: 'Vehicle number required' }]}
              >
                <Input placeholder="e.g. MH-12-PQ-8899" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="invoiceValue"
                label="Consignment Value (₹)"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={0} placeholder="₹ Value" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="transporterName"
                label="Transporter Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. V-Trans / Safexpress" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="transporterId" label="Transporter GSTIN / ID">
                <Input placeholder="15-digit Transporter ID" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE }}>
              Generate E-Way Bill
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="E-Way Bill Summary Slip"
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<Download size={14} />}
            style={{ backgroundColor: BRAND_PURPLE }}
            onClick={() => {
              message.success(`Downloading E-Way Bill print slip for ${viewRecord?.ewayBillNo}`);
              setViewRecord(null);
            }}
          >
            Download Print Slip
          </Button>,
        ]}
      >
        {viewRecord && (
          <div className="py-2 space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">E-Way Bill Number:</span>
              <span className="font-bold text-purple-900 text-sm">{viewRecord.ewayBillNo}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Generated Date:</span>
              <span className="font-medium text-slate-800">{viewRecord.ewayBillDate}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Valid Until:</span>
              <span className="font-bold text-emerald-700">{viewRecord.validUntil}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Reference Invoice:</span>
              <span className="font-semibold text-blue-700">{viewRecord.invoiceNo}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Consignee:</span>
              <span className="font-medium text-slate-800">{viewRecord.customerName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Route:</span>
              <span>
                {viewRecord.fromPincode} to {viewRecord.toPincode} ({viewRecord.distanceKm} KM)
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Vehicle No (Part B):</span>
              <Tag color="cyan" className="font-mono font-bold">
                {viewRecord.vehicleNo}
              </Tag>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Transporter:</span>
              <span>{viewRecord.transporterName}</span>
            </div>
            <div className="flex justify-between font-bold text-sm">
              <span>Invoice Value:</span>
              <span>₹{viewRecord.invoiceValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
