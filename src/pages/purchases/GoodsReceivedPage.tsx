import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Tabs,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
} from 'antd';
import {
  FileCheck,
  Plus,
  FileSpreadsheet,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Truck,
  Building2,
  Clock,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export interface GrnRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplier: string;
  brand: string;
  product: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  pendingQty: number;
  warehouse: string;
  receivedDate: string;
  inspectionStatus: 'Quality Inspection' | 'Accepted' | 'Partial Receipts' | 'Rejected';
}

const INITIAL_GRNS: GrnRecord[] = [
  {
    id: 'grn-1',
    grnNumber: 'GRN-2026-051',
    poNumber: 'PO-2026-101',
    supplier: 'Lakshmi Precision Castings',
    brand: 'Lakshmi Pro',
    product: 'Ductile Iron Pump Housing Casings',
    orderedQty: 40,
    receivedQty: 25,
    acceptedQty: 23,
    rejectedQty: 2,
    pendingQty: 15,
    warehouse: 'Chennai Central Depot (WH-01)',
    receivedDate: '2026-11-16',
    inspectionStatus: 'Accepted',
  },
  {
    id: 'grn-2',
    grnNumber: 'GRN-2026-052',
    poNumber: 'PO-2026-103',
    supplier: 'Delta Pneumatics India',
    brand: 'DeltaPure',
    product: 'Solenoid Directional Air Valves (1/2 Inch)',
    orderedQty: 60,
    receivedQty: 60,
    acceptedQty: 60,
    rejectedQty: 0,
    pendingQty: 0,
    warehouse: 'Bangalore Regional Hub (WH-02)',
    receivedDate: '2026-11-15',
    inspectionStatus: 'Accepted',
  },
  {
    id: 'grn-3',
    grnNumber: 'GRN-2026-053',
    poNumber: 'PO-2026-102',
    supplier: 'Bharat Hydraulic Drives',
    brand: 'BharatDrive',
    product: 'High Pressure Variable Piston Pump 75kW',
    orderedQty: 4,
    receivedQty: 2,
    acceptedQty: 0,
    rejectedQty: 0,
    pendingQty: 2,
    warehouse: 'Chennai Central Depot (WH-01)',
    receivedDate: '2026-11-18',
    inspectionStatus: 'Quality Inspection',
  },
];

export const GoodsReceivedPage: React.FC = () => {
  const [grns, setGrns] = useState<GrnRecord[]>(INITIAL_GRNS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = grns.filter((g) => {
    const matchTab = activeTab === 'ALL' || g.inspectionStatus === activeTab;
    const matchSearch =
      g.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.supplier.toLowerCase().includes(search.toLowerCase()) ||
      g.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleCreateGRN = (values: any) => {
    const ordered = Number(values.orderedQty || 20);
    const received = Number(values.receivedQty || 20);
    const accepted = Number(values.acceptedQty || received);
    const rejected = received - accepted;
    const pending = Math.max(0, ordered - received);

    const newGRN: GrnRecord = {
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-0${50 + grns.length + 1}`,
      poNumber: values.poNumber || 'PO-2026-105',
      supplier: values.supplier || 'Industrial Supplier',
      brand: values.brand || 'Std Brand',
      product: values.product || 'Machinery Spare',
      orderedQty: ordered,
      receivedQty: received,
      acceptedQty: accepted,
      rejectedQty: rejected,
      pendingQty: pending,
      warehouse: values.warehouse || 'Chennai Central Depot (WH-01)',
      receivedDate: new Date().toISOString().slice(0, 10),
      inspectionStatus: accepted > 0 ? 'Accepted' : 'Quality Inspection',
    };

    setGrns([newGRN, ...grns]);
    message.success(`Goods Received Note ${newGRN.grnNumber} generated! Inventory updated for accepted quantity.`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grnNumber',
      key: 'grnNumber',
      render: (t: string) => (
        <span style={{ fontWeight: 800, color: '#5421A8', backgroundColor: '#F3EEFF', padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
          {t}
        </span>
      ),
    },
    {
      title: 'Purchase Order #',
      dataIndex: 'poNumber',
      key: 'poNumber',
      render: (t: string) => <strong style={{ color: '#1E1B4B' }}>{t}</strong>,
    },
    {
      title: 'Supplier & Brand',
      key: 'supp',
      render: (_: any, r: GrnRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{r.supplier}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Brand: {r.brand}</div>
        </div>
      ),
    },
    {
      title: 'Product Received',
      dataIndex: 'product',
      key: 'product',
      render: (p: string) => <span style={{ fontWeight: 600, color: '#334155' }}>{p}</span>,
    },
    {
      title: 'Quantities Breakdown',
      key: 'quantities',
      render: (_: any, r: GrnRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Ordered: <strong>{r.orderedQty}</strong> &bull; Received: <strong>{r.receivedQty}</strong></div>
          <div style={{ marginTop: 2 }}>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>Accepted: {r.acceptedQty}</span>
            {r.rejectedQty > 0 && <span style={{ color: '#EF4444', marginLeft: 6, fontWeight: 700 }}>Rejected: {r.rejectedQty}</span>}
          </div>
        </div>
      ),
    },
    {
      title: 'Warehouse & Date',
      key: 'wh',
      render: (_: any, r: GrnRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>{r.warehouse}</div>
          <div style={{ color: '#64748B' }}>Date: {r.receivedDate}</div>
        </div>
      ),
    },
    {
      title: 'Inspection Status',
      dataIndex: 'inspectionStatus',
      key: 'inspectionStatus',
      render: (st: GrnRecord['inspectionStatus']) => {
        const color = st === 'Accepted' ? 'success' : st === 'Quality Inspection' ? 'warning' : 'cyan';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 8 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" type="link" style={{ color: '#5421A8', fontWeight: 700 }} onClick={() => message.info('Printing Goods Receipt Note')}>
          Print GRN
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Goods Received (GRN) Inward Register"
        subtitle="Record warehouse shipments, quality inspections, accepted inventory stock intake, and supplier rejection manifests."
        icon={<FileCheck size={20} />}
        searchPlaceholder="Search GRN #, PO #, supplier..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Create GRN"
        onPrimaryAction={() => {
          form.resetFields();
          setIsModalOpen(true);
        }}
        extraActions={
          <Button icon={<FileSpreadsheet size={14} />} onClick={() => message.success('Exporting GRN Manifest...')} style={{ borderRadius: 20 }}>
            Export Register
          </Button>
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Receipts (GRN)',
            value: `${grns.length} Inward`,
            growth: 'Warehouse Intake',
            isDark: true,
            icon: <FileCheck size={20} color="#5421A8" />,
          },
          {
            title: 'Accepted Inventory',
            value: `${grns.reduce((s, g) => s + g.acceptedQty, 0)} Units`,
            growth: 'Stock Updated',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
          },
          {
            title: 'Quality Inspection',
            value: `${grns.filter((g) => g.inspectionStatus === 'Quality Inspection').length} Under Test`,
            growth: 'QC Hold',
            isPositive: false,
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Rejected Quantities',
            value: `${grns.reduce((s, g) => s + g.rejectedQty, 0)} Units`,
            growth: 'Return Eligible',
            isPositive: false,
            isDark: false,
            icon: <XCircle size={20} color="#EF4444" />,
          },
        ]}
      />

      {/* Tabs */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '12px 20px', border: '1px solid #ECE8F6', display: 'flex', gap: 8 }}>
        {['ALL', 'Accepted', 'Quality Inspection', 'Partial Receipts', 'Rejected'].map((tab) => (
          <Button
            key={tab}
            size="small"
            onClick={() => setActiveTab(tab)}
            style={{
              borderRadius: 16,
              fontWeight: 700,
              fontSize: 11,
              height: 28,
              padding: '0 14px',
              borderColor: activeTab === tab ? '#5421A8' : '#E2E8F0',
              background: activeTab === tab ? '#5421A8' : '#F8FAFC',
              color: activeTab === tab ? '#FFFFFF' : '#64748B',
            }}
          >
            {tab === 'ALL' ? 'All GRNs' : tab}
          </Button>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #ECE8F6', overflow: 'hidden' }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>

      <Modal title="Create Goods Received Note (GRN)" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={620}>
        <Form form={form} layout="vertical" onFinish={handleCreateGRN} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="poNumber" label="Purchase Order Reference" rules={[{ required: true }]}>
                <Input placeholder="e.g. PO-2026-101" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="Supplier Company" rules={[{ required: true }]}>
                <Input placeholder="e.g. Lakshmi Precision Castings" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
                <Input placeholder="e.g. Siemens, BharatDrive" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product" label="Product Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Cast Iron Pump Casings" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orderedQty" label="Ordered Qty" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="receivedQty" label="Received Qty" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="acceptedQty" label="Accepted Qty" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="warehouse" label="Receiving Warehouse Destination">
                <Select
                  size="large"
                  defaultValue="Chennai Central Depot (WH-01)"
                  options={[
                    { value: 'Chennai Central Depot (WH-01)', label: 'Chennai Central Depot (WH-01)' },
                    { value: 'Bangalore Regional Hub (WH-02)', label: 'Bangalore Regional Hub (WH-02)' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Intake & Update Stock
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
