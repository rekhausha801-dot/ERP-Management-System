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
  Row,
  Col,
  message,
} from 'antd';
import {
  Undo2,
  Plus,
  FileSpreadsheet,
  Search,
  CheckCircle,
  AlertTriangle,
  Receipt,
  FileText,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export interface PurchaseReturnRecord {
  id: string;
  returnNumber: string;
  poNumber: string;
  grnNumber: string;
  supplier: string;
  department: string;
  brand: string;
  product: string;
  returnQty: number;
  returnReason: string;
  returnDate: string;
  refundAmount: number;
  creditNoteStatus: 'Credit Issued' | 'Pending Credit' | 'Refund Completed';
}

const INITIAL_RETURNS: PurchaseReturnRecord[] = [
  {
    id: 'pr-1',
    returnNumber: 'PR-2026-011',
    poNumber: 'PO-2026-101',
    grnNumber: 'GRN-2026-051',
    supplier: 'Lakshmi Precision Castings',
    department: 'Manufacturing & Production',
    brand: 'Lakshmi Pro',
    product: 'Ductile Iron Pump Housing Casings',
    returnQty: 2,
    returnReason: 'Surface Casting Blowholes detected during QA',
    returnDate: '2026-11-17',
    refundAmount: 29500,
    creditNoteStatus: 'Credit Issued',
  },
  {
    id: 'pr-2',
    returnNumber: 'PR-2026-012',
    poNumber: 'PO-2026-098',
    grnNumber: 'GRN-2026-048',
    supplier: 'Bharat Hydraulic Drives',
    department: 'R&D and Engineering',
    brand: 'BharatDrive',
    product: 'Hydraulic Seal Compression Rings',
    returnQty: 10,
    returnReason: 'Dimensional mismatch (+0.4mm tolerance deviation)',
    returnDate: '2026-11-15',
    refundAmount: 42000,
    creditNoteStatus: 'Pending Credit',
  },
];

export const PurchaseReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<PurchaseReturnRecord[]>(INITIAL_RETURNS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = returns.filter((r) => {
    const matchTab = activeTab === 'ALL' || r.creditNoteStatus === activeTab;
    const matchSearch =
      r.returnNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleCreateReturn = (values: any) => {
    const qty = Number(values.returnQty || 1);
    const amount = Number(values.refundAmount || 15000);

    const newReturn: PurchaseReturnRecord = {
      id: `pr-${Date.now()}`,
      returnNumber: `PR-2026-0${10 + returns.length + 1}`,
      poNumber: values.poNumber || 'PO-2026-101',
      grnNumber: values.grnNumber || 'GRN-2026-051',
      supplier: values.supplier || 'Industrial Supplier',
      department: values.department || 'Manufacturing & Production',
      brand: values.brand || 'Std Brand',
      product: values.product || 'Defective Raw Material',
      returnQty: qty,
      returnReason: values.returnReason || 'Defective batch found during inspection',
      returnDate: new Date().toISOString().slice(0, 10),
      refundAmount: amount,
      creditNoteStatus: 'Pending Credit',
    };

    setReturns([newReturn, ...returns]);
    message.success(`Purchase Return ${newReturn.returnNumber} filed! Awaiting vendor credit note.`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Return Number',
      dataIndex: 'returnNumber',
      key: 'returnNumber',
      render: (t: string) => (
        <span style={{ fontWeight: 800, color: '#5421A8', backgroundColor: '#F3EEFF', padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
          {t}
        </span>
      ),
    },
    {
      title: 'PO & GRN Ref',
      key: 'ref',
      render: (_: any, r: PurchaseReturnRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>PO: <strong>{r.poNumber}</strong></div>
          <div style={{ color: '#64748B' }}>GRN: {r.grnNumber}</div>
        </div>
      ),
    },
    {
      title: 'Supplier & Department',
      key: 'supp',
      render: (_: any, r: PurchaseReturnRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{r.supplier}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Dept: {r.department}</div>
        </div>
      ),
    },
    {
      title: 'Product & Qty Returned',
      key: 'prod',
      render: (_: any, r: PurchaseReturnRecord) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E1B4B' }}>{r.product}</div>
          <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
            Qty Returned: {r.returnQty} &bull; Brand: {r.brand}
          </div>
        </div>
      ),
    },
    {
      title: 'Return Reason',
      dataIndex: 'returnReason',
      key: 'returnReason',
      render: (text: string) => <span style={{ fontSize: 11.5, color: '#475569' }}>{text}</span>,
    },
    {
      title: 'Refund / Credit Value',
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      render: (val: number) => <strong style={{ color: '#10B981', fontSize: 13 }}>₹{val.toLocaleString()}</strong>,
    },
    {
      title: 'Credit Note Status',
      dataIndex: 'creditNoteStatus',
      key: 'creditNoteStatus',
      render: (st: PurchaseReturnRecord['creditNoteStatus']) => {
        const color = st === 'Credit Issued' ? 'success' : st === 'Refund Completed' ? 'purple' : 'warning';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 8 }}>{st}</Tag>;
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Purchase Returns & Supplier Debits"
        subtitle="Manage defective goods returns, reject shipments, vendor debit notes, and replacement tracking."
        icon={<Undo2 size={20} />}
        searchPlaceholder="Search Return #, PO #, supplier..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Create Purchase Return"
        onPrimaryAction={() => {
          form.resetFields();
          setIsModalOpen(true);
        }}
        extraActions={
          <Button icon={<FileSpreadsheet size={14} />} onClick={() => message.success('Exporting Returns Report...')} style={{ borderRadius: 20 }}>
            Export Returns
          </Button>
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Filed Returns',
            value: `${returns.length} Returns`,
            growth: 'Supplier Claims',
            isDark: true,
            icon: <Undo2 size={20} color="#5421A8" />,
          },
          {
            title: 'Total Return Value',
            value: `₹${(returns.reduce((s, r) => s + r.refundAmount, 0) / 1000).toFixed(1)}K`,
            growth: 'Claim Amount',
            isDark: false,
            icon: <Receipt size={20} color="#10B981" />,
          },
          {
            title: 'Credits Issued',
            value: `${returns.filter((r) => r.creditNoteStatus === 'Credit Issued').length} Settled`,
            growth: 'Debit Adjusted',
            isDark: true,
            icon: <CheckCircle size={20} color="#F59E0B" />,
          },
          {
            title: 'Pending Resolution',
            value: `${returns.filter((r) => r.creditNoteStatus === 'Pending Credit').length} In Review`,
            growth: 'Follow-up Due',
            isPositive: false,
            isDark: false,
            icon: <AlertTriangle size={20} color="#6D28D9" />,
          },
        ]}
      />

      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '12px 20px', border: '1px solid #ECE8F6', display: 'flex', gap: 8 }}>
        {['ALL', 'Pending Credit', 'Credit Issued', 'Refund Completed'].map((tab) => (
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
            {tab === 'ALL' ? 'All Returns' : tab}
          </Button>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #ECE8F6', overflow: 'hidden' }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>

      <Modal title="Create Purchase Return" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={620}>
        <Form form={form} layout="vertical" onFinish={handleCreateReturn} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="poNumber" label="Original PO Reference" rules={[{ required: true }]}>
                <Input placeholder="e.g. PO-2026-101" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="grnNumber" label="Associated GRN #" rules={[{ required: true }]}>
                <Input placeholder="e.g. GRN-2026-051" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="Supplier Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Lakshmi Precision Castings" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product" label="Product Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Pump Casings" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="returnQty" label="Return Quantity" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="refundAmount" label="Claim / Debit Amount (₹)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="returnReason" label="Reason for Defective Rejection" rules={[{ required: true }]}>
                <Input.TextArea rows={2} placeholder="Detail technical defects found during QA inspection" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              File Return & Issue Debit Request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
