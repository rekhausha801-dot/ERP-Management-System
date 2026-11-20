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
  Space,
  Tooltip,
  Divider,
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
  Printer,
  Undo2,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { usePurchaseStore, GrnInspectionRecord } from '../../mock/purchaseManagementStore';
import { useNavigate } from 'react-router-dom';

export const GoodsReceivedPage: React.FC = () => {
  const navigate = useNavigate();
  const { grns, setGrns, orders, setOrders, setReturns, returns } = usePurchaseStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'QC Passed' | 'QC Failed with Rejections' | 'Under Inspection'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrn, setSelectedGrn] = useState<GrnInspectionRecord | null>(null);
  const [form] = Form.useForm();

  const filteredGrns = grns.filter((g) => {
    const matchSearch =
      g.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      g.qcInspector.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'ALL' || g.qcStatus === activeTab;
    return matchSearch && matchTab;
  });

  // Calculate Metrics strictly from store
  const totalReceipts = grns.length;
  const qcPassedCount = grns.filter((g) => g.qcStatus === 'QC Passed').length;
  const rejectionsCount = grns.filter((g) => g.qcStatus === 'QC Failed with Rejections').length;
  const totalAcceptedUnits = grns.reduce(
    (acc, g) => acc + g.items.reduce((sum, itm) => sum + itm.acceptedQty, 0),
    0
  );

  const handleCreateSubmit = (values: any) => {
    const ordered = Number(values.orderedQty) || 1;
    const received = Number(values.receivedQty) || 1;
    const accepted = Number(values.acceptedQty) || 0;
    const rejected = Number(values.rejectedQty) || 0;

    // Strict validation: Received = Accepted + Rejected
    if (accepted + rejected !== received) {
      message.error('Validation Error: Received Qty must strictly equal Accepted Qty + Rejected Qty.');
      return;
    }

    if (received > ordered) {
      message.error('Validation Error: Received Qty cannot exceed PO Ordered Qty without change order.');
      return;
    }

    const newGrn: GrnInspectionRecord = {
      id: `GRN-${Date.now()}`,
      grnNumber: `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      grnDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      poNumber: values.poNumber,
      supplierName: values.supplierName,
      supplierDeliveryChallan: values.supplierDeliveryChallan || `DC-${Math.floor(10000 + Math.random() * 90000)}`,
      warehouseName: values.warehouseName || 'Main Central Hub - Chennai',
      batchLotNumber: values.batchLotNumber || `LOT-${new Date().getFullYear()}-01`,
      qcInspector: values.qcInspector || 'Dinesh Kumar (QA Lead)',
      items: [
        {
          productId: 'P-GEN',
          productName: values.productName || 'Industrial Consignment',
          orderedQty: ordered,
          receivedQty: received,
          acceptedQty: accepted,
          rejectedQty: rejected,
          rejectionReason: rejected > 0 ? values.rejectionReason : undefined,
        },
      ],
      qcStatus: rejected > 0 ? 'QC Failed with Rejections' : 'QC Passed',
      status: 'Verified & Stocked',
      remarks: values.remarks,
      returnGenerated: false,
    };

    setGrns([newGrn, ...grns]);

    // Update PO grnStatus
    setOrders((prev) =>
      prev.map((o) =>
        o.poNumber === values.poNumber
          ? {
              ...o,
              grnStatus: accepted >= ordered ? 'Completely Received' : 'Partially Received',
            }
          : o
      )
    );

    message.success(`GRN ${newGrn.grnNumber} generated successfully! ${accepted} units added to Available Inventory Stock.`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleGenerateReturn = (grn: GrnInspectionRecord) => {
    const rejectedItem = grn.items.find((i) => i.rejectedQty > 0);
    if (!rejectedItem) return;

    const newReturn = {
      id: `RET-${Date.now()}`,
      returnNumber: `PRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      returnDate: new Date().toISOString().slice(0, 10),
      poNumber: grn.poNumber,
      grnNumber: grn.grnNumber,
      supplierName: grn.supplierName,
      items: [
        {
          productName: rejectedItem.productName,
          quantity: rejectedItem.rejectedQty,
          unitPrice: 45000,
          totalAmount: rejectedItem.rejectedQty * 45000 * 1.18,
          reason: rejectedItem.rejectionReason || 'Quality inspection failed at warehouse intake.',
        },
      ],
      totalReturnAmount: rejectedItem.rejectedQty * 45000 * 1.18,
      actionTaken: 'Supplier Debit Note' as const,
      debitNoteNumber: `DN-2026-${Math.floor(100 + Math.random() * 900)}`,
      debitNoteAmount: rejectedItem.rejectedQty * 45000 * 1.18,
      status: 'Approved' as const,
      notes: `Generated automatically from failed GRN ${grn.grnNumber}.`,
    };

    setReturns([newReturn, ...returns]);
    setGrns((prev) =>
      prev.map((g) => (g.id === grn.id ? { ...g, returnGenerated: true } : g))
    );

    message.success(`Purchase Return ${newReturn.returnNumber} & Debit Note issued for ${rejectedItem.rejectedQty} rejected units.`);
  };

  const columns = [
    {
      title: 'GRN Number & Date',
      key: 'grnNumber',
      render: (_: any, r: GrnInspectionRecord) => (
        <div>
          <span style={{ fontWeight: 800, color: '#5421A8' }}>{r.grnNumber}</span>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{r.grnDate}</div>
        </div>
      ),
    },
    {
      title: 'Ref PO & DC Challan',
      key: 'poRef',
      render: (_: any, r: GrnInspectionRecord) => (
        <div>
          <Tag color="purple">{r.poNumber}</Tag>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>DC: {r.supplierDeliveryChallan}</div>
        </div>
      ),
    },
    {
      title: 'Supplier & Warehouse',
      key: 'supplier',
      render: (_: any, r: GrnInspectionRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{r.supplierName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.warehouseName}</div>
        </div>
      ),
    },
    {
      title: 'Inspection Breakdown',
      key: 'breakdown',
      render: (_: any, r: GrnInspectionRecord) => {
        const item = r.items[0];
        if (!item) return '-';
        return (
          <div style={{ fontSize: 11.5 }}>
            <div>Ordered: <strong>{item.orderedQty}</strong> &bull; Received: <strong>{item.receivedQty}</strong></div>
            <div style={{ marginTop: 2 }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>Accepted: {item.acceptedQty}</span>
              {item.rejectedQty > 0 && (
                <span style={{ color: '#EF4444', marginLeft: 8, fontWeight: 800 }}>
                  Rejected: {item.rejectedQty}
                </span>
              )}
            </div>
            <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>Lot: {r.batchLotNumber}</div>
          </div>
        );
      },
    },
    {
      title: 'QC Status',
      dataIndex: 'qcStatus',
      key: 'qcStatus',
      render: (st: string) => {
        const color = st === 'QC Passed' ? 'success' : st === 'QC Failed with Rejections' ? 'error' : 'warning';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 8 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: GrnInspectionRecord) => (
        <Space size="small">
          <Tooltip title="View Receipt Voucher">
            <Button
              size="small"
              type="text"
              icon={<Eye size={14} color="#5421A8" />}
              onClick={() => setSelectedGrn(record)}
            />
          </Tooltip>
          <Tooltip title="Print Goods Receipt Note">
            <Button
              size="small"
              type="text"
              icon={<Printer size={14} color="#2563EB" />}
              onClick={() => message.info(`Printing GRN Slip for ${record.grnNumber}`)}
            />
          </Tooltip>
          {record.qcStatus === 'QC Failed with Rejections' && !record.returnGenerated && (
            <Tooltip title="Initiate Return & Debit Note">
              <Button
                size="small"
                type="primary"
                danger
                icon={<Undo2 size={13} />}
                style={{ fontSize: 11, borderRadius: 6 }}
                onClick={() => handleGenerateReturn(record)}
              >
                Return
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
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
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting GRN Manifest...')}
            style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, height: 36 }}
          >
            Export Register
          </Button>
        }
      />

      {/* 2. Top 4 High-Impact KPI Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Receipts (GRN)',
            value: `${totalReceipts} Inward`,
            growth: 'Warehouse Intake',
            isDark: true,
            icon: <FileCheck size={20} color="#5421A8" />,
            pillExtra: 'Logged',
          },
          {
            title: 'QC Inspected & Cleared',
            value: `${qcPassedCount} Passed`,
            growth: '100% QA Tested',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Added to Stock',
          },
          {
            title: 'Rejections Quarantined',
            value: `${rejectionsCount} Shipments`,
            growth: 'Return Mandated',
            isPositive: false,
            isDark: true,
            icon: <AlertTriangle size={20} color="#EF4444" />,
            pillExtra: 'Excluded from Stock',
          },
          {
            title: 'Stocked Inward Qty',
            value: `${totalAcceptedUnits} Units`,
            growth: 'Available Live',
            isPositive: true,
            isDark: false,
            icon: <Truck size={20} color="#0284C7" />,
            pillExtra: 'Inventoried',
          },
        ]}
      />

      {/* 3. Main Data Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          overflow: 'hidden',
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ALL', 'QC Passed', 'QC Failed with Rejections'] as const).map((tab) => (
              <Button
                key={tab}
                size="small"
                onClick={() => setActiveTab(tab)}
                style={{
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 12,
                  background: activeTab === tab ? '#5421A8' : '#F1EDF9',
                  color: activeTab === tab ? '#FFFFFF' : '#64748B',
                  borderColor: activeTab === tab ? '#5421A8' : '#ECE8F6',
                }}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: '#64748B' }}>
            Showing <strong>{filteredGrns.length}</strong> verified warehouse intake vouchers
          </div>
        </div>

        <Table
          dataSource={filteredGrns}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Create GRN Modal */}
      <Modal
        title="Create Goods Received Note (GRN) & QA Inspection"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit} className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="poNumber"
                label="Reference Purchase Order #"
                rules={[{ required: true, message: 'Please select or enter PO #' }]}
              >
                <Select
                  placeholder="Select approved PO"
                  options={orders.map((o) => ({
                    label: `${o.poNumber} • ${o.supplierName}`,
                    value: o.poNumber,
                  }))}
                  onChange={(poNum) => {
                    const match = orders.find((o) => o.poNumber === poNum);
                    if (match) {
                      form.setFieldsValue({
                        supplierName: match.supplierName,
                        productName: match.items[0]?.productName || 'Industrial Consignment',
                        orderedQty: match.items[0]?.orderedQty || 10,
                        receivedQty: match.items[0]?.orderedQty || 10,
                        acceptedQty: match.items[0]?.orderedQty || 10,
                        rejectedQty: 0,
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplierName" label="Supplier / Vendor" rules={[{ required: true }]}>
                <Input placeholder="Supplier trade name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="supplierDeliveryChallan" label="Delivery Challan / Bill of Lading" rules={[{ required: true }]}>
                <Input placeholder="e.g. DC-2026-9921" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="warehouseName" label="Intake Receiving Warehouse" initialValue="Main Central Hub - Chennai">
                <Select
                  options={[
                    { value: 'Main Central Hub - Chennai', label: 'Main Central Hub - Chennai' },
                    { value: 'R&D Testing Facility - Bengaluru', label: 'R&D Testing Facility - Bengaluru' },
                    { value: 'Ambattur Sub-Plant', label: 'Ambattur Sub-Plant' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="orderedQty" label="Ordered Qty" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={1} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="receivedQty" label="Received Qty" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={1} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="acceptedQty" label="Accepted Qty (QC OK)" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rejectedQty" label="Rejected Qty (QC Fail)" initialValue={0}>
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="batchLotNumber" label="Batch / Lot Tracking Number" initialValue={`LOT-${new Date().getFullYear()}-01`}>
                <Input placeholder="e.g. LOT-SIEM-2026-B1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="qcInspector" label="QC QA Inspector Name" initialValue="Dinesh Kumar (QA Lead)">
                <Input placeholder="Inspector Name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="rejectionReason" label="Rejection Reason (If Rejected Qty > 0)">
            <Input.TextArea rows={2} placeholder="Specify defect details (physical damage, spec deviation, leakage, etc.)" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5421A8', borderColor: '#5421A8' }}>
              Confirm GRN & Update Inventory
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View GRN Slip Modal */}
      <Modal
        title="Warehouse Goods Received Note (GRN)"
        open={!!selectedGrn}
        onCancel={() => setSelectedGrn(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedGrn(null)}>Close</Button>,
          <Button key="print" type="primary" icon={<Printer size={14} />} style={{ backgroundColor: '#5421A8' }} onClick={() => message.success('Printing GRN...')}>
            Print Certified Copy
          </Button>,
        ]}
      >
        {selectedGrn && (
          <div className="space-y-3 text-xs py-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">GRN Number:</span>
              <span className="font-bold text-purple-900 text-sm">{selectedGrn.grnNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Reference PO:</span>
              <Tag color="purple">{selectedGrn.poNumber}</Tag>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Supplier:</span>
              <span className="font-semibold text-slate-800">{selectedGrn.supplierName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Warehouse:</span>
              <span>{selectedGrn.warehouseName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Lot Number:</span>
              <span className="font-mono">{selectedGrn.batchLotNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">QC Inspector:</span>
              <span className="font-medium text-slate-800">{selectedGrn.qcInspector}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-700 mb-1">Receipt Summary:</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded border">Ordered: <strong>{selectedGrn.items[0]?.orderedQty}</strong></div>
                <div className="bg-white p-2 rounded border text-emerald-700">Accepted: <strong>{selectedGrn.items[0]?.acceptedQty}</strong></div>
                <div className="bg-white p-2 rounded border text-rose-600">Rejected: <strong>{selectedGrn.items[0]?.rejectedQty}</strong></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
