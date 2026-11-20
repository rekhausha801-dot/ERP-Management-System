import React, { useState, useMemo } from 'react';
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
  Space,
  Tooltip,
  message,
  Card,
  Progress,
  Badge,
  DatePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  FileText,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Download,
  Building,
  User,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  FileCheck,
  Send,
  Award,
} from 'lucide-react';
import dayjs from 'dayjs';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { usePurchaseStore, PurchaseRequisition } from '../../mock/purchaseManagementStore';

const BRAND_PURPLE = '#5421A8';

interface SupplierQuoteComparison {
  id: string;
  prNumber: string;
  rfqNumber: string;
  itemDescription: string;
  quantity: number;
  uom: string;
  suppliers: {
    supplierName: string;
    unitPrice: number;
    gstRate: number;
    deliveryDays: number;
    paymentTerms: string;
    warranty: string;
    score: number;
    isL1: boolean;
  }[];
  selectedSupplier?: string;
  status: 'Open RFQ' | 'Quotes Evaluated' | 'PO Awarded';
}

const MOCK_RFQ_COMPARISONS: SupplierQuoteComparison[] = [
  {
    id: 'rfq-comp-1',
    prNumber: 'PR-2026-014',
    rfqNumber: 'RFQ-2026-101',
    itemDescription: 'High-Torque AC Induction Motor 15kW IE3',
    quantity: 15,
    uom: 'Units',
    status: 'Quotes Evaluated',
    selectedSupplier: 'Bharat Heavy Electricals Consortium',
    suppliers: [
      {
        supplierName: 'Bharat Heavy Electricals Consortium',
        unitPrice: 52000,
        gstRate: 18,
        deliveryDays: 7,
        paymentTerms: '30 Days Net',
        warranty: '24 Months',
        score: 94,
        isL1: true,
      },
      {
        supplierName: 'Siemens Industrial Drives India',
        unitPrice: 56500,
        gstRate: 18,
        deliveryDays: 14,
        paymentTerms: '15 Days Advance',
        warranty: '36 Months',
        score: 88,
        isL1: false,
      },
      {
        supplierName: 'ABB Power & Motion Tech',
        unitPrice: 54000,
        gstRate: 18,
        deliveryDays: 10,
        paymentTerms: '45 Days Net',
        warranty: '24 Months',
        score: 91,
        isL1: false,
      },
    ],
  },
  {
    id: 'rfq-comp-2',
    prNumber: 'PR-2026-035',
    rfqNumber: 'RFQ-2026-102',
    itemDescription: 'Double-Acting Hydraulic Cylinder 100mm Bore',
    quantity: 25,
    uom: 'Pcs',
    status: 'Open RFQ',
    suppliers: [
      {
        supplierName: 'L&T Precision Hydraulics Ltd',
        unitPrice: 18500,
        gstRate: 18,
        deliveryDays: 5,
        paymentTerms: '30 Days Net',
        warranty: '12 Months',
        score: 92,
        isL1: true,
      },
      {
        supplierName: 'Apex Fluid Controls India',
        unitPrice: 19800,
        gstRate: 18,
        deliveryDays: 8,
        paymentTerms: 'Immediate',
        warranty: '12 Months',
        score: 82,
        isL1: false,
      },
    ],
  },
];

export const PurchaseRequisitionsPage: React.FC = () => {
  const { requisitions, setRequisitions } = usePurchaseStore();
  const [activeTab, setActiveTab] = useState<'requisitions' | 'rfqs'>('requisitions');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [viewPR, setViewPR] = useState<PurchaseRequisition | null>(null);
  const [prForm] = Form.useForm();

  // Metrics
  const metrics = useMemo(() => {
    const total = requisitions.length;
    const pending = requisitions.filter((r) => r.status === 'Pending Approval').length;
    const approved = requisitions.filter((r) => r.status === 'Approved' || r.status === 'Converted to PO').length;
    const totalEstValue = requisitions.reduce((acc, r) => acc + (r.estimatedTotal || 0), 0);

    return { total, pending, approved, totalEstValue };
  }, [requisitions]);

  // Filtered PRs
  const filteredPRs = useMemo(() => {
    return requisitions.filter((r) => {
      const matchSearch =
        r.prNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.purpose.toLowerCase().includes(search.toLowerCase()) ||
        r.requestedBy.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'ALL' || r.department === deptFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [requisitions, search, deptFilter, statusFilter]);

  const handleCreatePR = (values: any) => {
    const qty = Number(values.quantity) || 1;
    const unitCost = Number(values.estimatedCost) || 0;
    const total = qty * unitCost;

    const newPr: PurchaseRequisition = {
      id: `PR-${Date.now()}`,
      prNumber: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      prDate: new Date().toISOString().slice(0, 10),
      requestedBy: values.requestedBy,
      department: values.department,
      priority: values.priority,
      estimatedTotal: total,
      purpose: values.purpose,
      status: 'Pending Approval',
      items: [
        {
          id: `item-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          brand: values.brand || 'Standard',
          productName: values.itemName,
          sku: 'MAT-GEN',
          category: values.category || 'General Procurement',
          unit: values.uom || 'Units',
          orderedQty: qty,
          receivedQty: 0,
          unitPrice: unitCost,
          discountPercent: 0,
          taxPercent: 18,
          subtotal: total,
          taxAmount: (total * 18) / 100,
          total: total * 1.18,
        },
      ],
    };

    setRequisitions([newPr, ...requisitions]);
    message.success(`Requisition ${newPr.prNumber} raised successfully!`);
    setIsPRModalOpen(false);
    prForm.resetFields();
  };

  const handleApprove = (id: string) => {
    setRequisitions(
      requisitions.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              approvedBy: 'Procurement Head',
              approvalDate: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
    message.success('Purchase Requisition approved!');
  };

  const handleReject = (id: string) => {
    setRequisitions(
      requisitions.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    message.warning('Purchase Requisition rejected.');
  };

  const prColumns: ColumnsType<PurchaseRequisition> = [
    {
      title: 'PR Number',
      dataIndex: 'prNumber',
      key: 'prNumber',
      width: 140,
      render: (text: string, record) => (
        <span
          onClick={() => setViewPR(record)}
          style={{
            fontWeight: 800,
            color: BRAND_PURPLE,
            backgroundColor: '#F3EEFF',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Purpose & Description',
      key: 'purpose',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.purpose}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            Date: {r.prDate} {r.poNumber && `• Linked PO: ${r.poNumber}`}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 190,
      render: (dept: string, r) => (
        <div>
          <Tag color="purple" style={{ fontWeight: 700, borderRadius: 6 }}>
            {dept}
          </Tag>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Req: {r.requestedBy}</div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: string) => {
        const color = p === 'Critical' ? 'red' : p === 'High' ? 'orange' : 'blue';
        return <Tag color={color} style={{ fontWeight: 700, borderRadius: 6 }}>{p}</Tag>;
      },
    },
    {
      title: 'Est. Total (₹)',
      dataIndex: 'estimatedTotal',
      key: 'estimatedTotal',
      width: 130,
      align: 'right',
      render: (val: number) => (
        <span style={{ fontWeight: 800, color: '#0F172A' }}>₹{val.toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color = 'default';
        if (status === 'Pending Approval') color = 'warning';
        if (status === 'Approved') color = 'processing';
        if (status === 'Converted to PO') color = 'success';
        if (status === 'Rejected') color = 'error';
        return <Badge status={color as any} text={<span style={{ fontWeight: 700 }}>{status}</span>} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View PR Details">
            <Button size="small" icon={<Eye size={13} />} onClick={() => setViewPR(record)} />
          </Tooltip>
          {record.status === 'Pending Approval' && (
            <>
              <Tooltip title="Approve PR">
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircle size={13} />}
                  onClick={() => handleApprove(record.id)}
                  style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                />
              </Tooltip>
              <Tooltip title="Reject PR">
                <Button
                  size="small"
                  danger
                  icon={<XCircle size={13} />}
                  onClick={() => handleReject(record.id)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'Approved' && (
            <Tooltip title="Float RFQ to Suppliers">
              <Button
                size="small"
                icon={<Send size={13} />}
                onClick={() => {
                  setActiveTab('rfqs');
                  message.info(`Float RFQ opened for ${record.prNumber}`);
                }}
                style={{ color: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
              >
                Float RFQ
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Purchase Requisitions & RFQ Management"
        subtitle="Internal department purchase requests, multi-tier budgetary approval workflows, and RFQ supplier quotation matrix."
        icon={<FileText size={20} />}
        searchPlaceholder="Search PR #, item, employee..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Raise Requisition"
        onPrimaryAction={() => {
          prForm.resetFields();
          setIsPRModalOpen(true);
        }}
        extraActions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              icon={<Award size={14} />}
              onClick={() => setActiveTab(activeTab === 'requisitions' ? 'rfqs' : 'requisitions')}
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                borderColor: '#ECE8F6',
                color: BRAND_PURPLE,
                height: 36,
                padding: '0 14px',
              }}
            >
              {activeTab === 'requisitions' ? 'View RFQ Comparisons' : 'View Requisitions'}
            </Button>
          </div>
        }
      />

      {/* 2. 4 Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Requisitions',
            value: `${metrics.total}`,
            growth: '+12% vs last month',
            isDark: true,
            icon: <FileText size={20} color={BRAND_PURPLE} />,
            pillExtra: 'All 5 Depts',
          },
          {
            title: 'Pending Approvals',
            value: `${metrics.pending}`,
            growth: 'Needs Action',
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Awaiting Sign-off',
          },
          {
            title: 'Approved / Ready for PO',
            value: `${metrics.approved}`,
            growth: 'Budget Cleared',
            isDark: true,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Authorized',
          },
          {
            title: 'Estimated Pipeline Value',
            value: `₹${(metrics.totalEstValue / 100000).toFixed(2)} L`,
            growth: 'Committed Spend',
            isDark: false,
            icon: <TrendingUp size={20} color="#3B82F6" />,
            pillExtra: 'Estimated Cost',
          },
        ]}
      />

      {/* 3. Main View with Requisitions and RFQ Tabs */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          {/* Tab switch */}
          <div style={{ display: 'inline-flex', padding: 4, background: '#F8F6FC', borderRadius: 12, border: '1px solid #ECE6F8' }}>
            <button
              type="button"
              onClick={() => setActiveTab('requisitions')}
              style={{
                padding: '7px 18px',
                borderRadius: 9,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                backgroundColor: activeTab === 'requisitions' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'requisitions' ? BRAND_PURPLE : '#64748B',
                boxShadow: activeTab === 'requisitions' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Requisition Requests ({requisitions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rfqs')}
              style={{
                padding: '7px 18px',
                borderRadius: 9,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                backgroundColor: activeTab === 'rfqs' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'rfqs' ? BRAND_PURPLE : '#64748B',
                boxShadow: activeTab === 'rfqs' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              RFQ Quotation Comparison Matrix ({MOCK_RFQ_COMPARISONS.length})
            </button>
          </div>

          {activeTab === 'requisitions' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Select
                value={deptFilter}
                onChange={setDeptFilter}
                style={{ width: 200 }}
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  { value: 'Manufacturing & Production', label: 'Manufacturing & Production' },
                  { value: 'R&D and Engineering', label: 'R&D and Engineering' },
                  { value: 'Operations & Maintenance', label: 'Operations & Maintenance' },
                  { value: 'IT & Infrastructure', label: 'IT & Infrastructure' },
                  { value: 'Administration & Facility', label: 'Administration & Facility' },
                ]}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 160 }}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'Pending Approval', label: 'Pending Approval' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Converted to PO', label: 'Converted to PO' },
                  { value: 'Rejected', label: 'Rejected' },
                ]}
              />
            </div>
          )}
        </div>

        {activeTab === 'requisitions' ? (
          <Table<PurchaseRequisition>
            columns={prColumns}
            dataSource={filteredPRs}
            rowKey="id"
            pagination={{ pageSize: 7, size: 'small', showTotal: (t) => `Total ${t} Requisitions` }}
            size="middle"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {MOCK_RFQ_COMPARISONS.map((rfq) => (
              <Card
                key={rfq.id}
                style={{
                  borderRadius: 16,
                  borderColor: '#EAE4F5',
                  boxShadow: '0 2px 10px rgba(84,33,168,0.03)',
                }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Tag color="purple" style={{ fontWeight: 800 }}>{rfq.rfqNumber}</Tag>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{rfq.itemDescription}</span>
                      <Tag color="default">Linked: {rfq.prNumber}</Tag>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Qty: {rfq.quantity} {rfq.uom}</span>
                    </div>
                    <Tag color={rfq.status === 'Quotes Evaluated' ? 'success' : 'processing'} style={{ fontWeight: 700 }}>
                      {rfq.status}
                    </Tag>
                  </div>
                }
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8F6FC', borderBottom: '2px solid #EAE4F5' }}>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Supplier Name</th>
                        <th style={{ padding: '10px 14px', color: '#475569', textAlign: 'right' }}>Unit Price (₹)</th>
                        <th style={{ padding: '10px 14px', color: '#475569', textAlign: 'right' }}>Total (excl. Tax)</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Delivery Time</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Payment Terms</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Warranty</th>
                        <th style={{ padding: '10px 14px', color: '#475569' }}>Evaluation Score</th>
                        <th style={{ padding: '10px 14px', color: '#475569', textAlign: 'center' }}>Recommendation</th>
                        <th style={{ padding: '10px 14px', color: '#475569', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfq.suppliers.map((s, idx) => {
                        const total = s.unitPrice * rfq.quantity;
                        const isChosen = rfq.selectedSupplier === s.supplierName;
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid #F1EDF9',
                              backgroundColor: isChosen ? '#F4FDFC' : 'transparent',
                            }}
                          >
                            <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                              {s.supplierName}
                              {isChosen && <Tag color="green" style={{ marginLeft: 6, fontWeight: 700 }}>Awarded</Tag>}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: s.isL1 ? '#10B981' : '#0F172A' }}>
                              ₹{s.unitPrice.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>
                              ₹{total.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{s.deliveryDays} Days</td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{s.paymentTerms}</td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{s.warranty}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Progress percent={s.score} size="small" style={{ width: 80 }} />
                                <span style={{ fontWeight: 700, fontSize: 11 }}>{s.score}/100</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              {s.isL1 ? (
                                <Tag color="success" style={{ fontWeight: 800 }}>L1 Lowest Bidder</Tag>
                              ) : (
                                <Tag color="default">Alternative</Tag>
                              )}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <Button
                                size="small"
                                type={isChosen ? 'primary' : 'default'}
                                style={{
                                  backgroundColor: isChosen ? '#10B981' : undefined,
                                  borderColor: isChosen ? '#10B981' : BRAND_PURPLE,
                                  color: isChosen ? '#FFFFFF' : BRAND_PURPLE,
                                  fontWeight: 700,
                                }}
                                onClick={() => message.success(`PO converted for ${s.supplierName} under ${rfq.rfqNumber}`)}
                              >
                                {isChosen ? 'PO Created' : 'Award PO'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 4. Raise PR Modal */}
      <Modal
        title="Raise Department Purchase Requisition"
        open={isPRModalOpen}
        onCancel={() => setIsPRModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form
          form={prForm}
          layout="vertical"
          onFinish={handleCreatePR}
          initialValues={{
            department: 'Manufacturing & Production',
            priority: 'Medium',
            uom: 'Units',
            requiredByDate: dayjs().add(10, 'days'),
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Target Department" name="department" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Manufacturing & Production', label: 'Manufacturing & Production' },
                    { value: 'R&D and Engineering', label: 'R&D and Engineering' },
                    { value: 'Operations & Maintenance', label: 'Operations & Maintenance' },
                    { value: 'IT & Infrastructure', label: 'IT & Infrastructure' },
                    { value: 'Administration & Facility', label: 'Administration & Facility' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Requested By (Employee)" name="requestedBy" rules={[{ required: true }]}>
                <Input placeholder="e.g. S. Meenakshi (Eng. Lead)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={14}>
              <Form.Item label="Item Description / Material" name="itemName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Servo Motor 5kW 3000RPM IE4" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Procurement Category" name="category">
                <Input placeholder="e.g. Motors & Drives" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Unit of Measure (UOM)" name="uom">
                <Select
                  options={[
                    { value: 'Units', label: 'Units' },
                    { value: 'Pcs', label: 'Pcs' },
                    { value: 'Mtrs', label: 'Mtrs' },
                    { value: 'Kg', label: 'Kg' },
                    { value: 'Sets', label: 'Sets' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Est. Unit Cost (₹)" name="estimatedCost" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Priority Level" name="priority" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Critical', label: 'Critical (Production Critical)' },
                    { value: 'High', label: 'High (Within 10 Days)' },
                    { value: 'Medium', label: 'Medium (Standard Restock)' },
                    { value: 'Low', label: 'Low (General Planning)' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Required By Date" name="requiredByDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Business Justification & Technical Specifications" name="purpose" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Specify machine breakdown, project expansion, or production schedule..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <Button onClick={() => setIsPRModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}>
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. View Details Modal */}
      <Modal
        title={`Requisition Details: ${viewPR?.prNumber}`}
        open={!!viewPR}
        onCancel={() => setViewPR(null)}
        footer={[
          <Button key="close" onClick={() => setViewPR(null)}>Close</Button>,
        ]}
      >
        {viewPR && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#F8F6FC', borderRadius: 10 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Department</span>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{viewPR.department}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Requested By</span>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{viewPR.requestedBy}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B' }}>Status</span>
                <div><Tag color="purple" style={{ fontWeight: 800 }}>{viewPR.status}</Tag></div>
              </div>
            </div>

            <div style={{ border: '1px solid #EAE4F5', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, color: '#64748B' }}>Purpose & Specifications:</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: BRAND_PURPLE, marginTop: 2 }}>{viewPR.purpose}</div>
              <div style={{ marginTop: 8, fontSize: 12 }}>
                Estimated Budget: <b>₹{viewPR.estimatedTotal.toLocaleString('en-IN')}</b> &nbsp;|&nbsp; Priority: <b>{viewPR.priority}</b>
              </div>
              {viewPR.approvedBy && (
                <div style={{ marginTop: 10, fontSize: 11, color: '#10B981', background: '#F0FDF4', padding: 8, borderRadius: 6 }}>
                  <b>Approved By:</b> {viewPR.approvedBy} ({viewPR.approvalDate})
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseRequisitionsPage;
