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
  InputNumber,
  DatePicker,
  Space,
  Tooltip,
  message,
} from 'antd';
import {
  Undo2,
  Clock,
  CheckCircle,
  IndianRupee,
  Search,
  Plus,
  Eye,
  Download,
  Printer,
  ChevronRight,
  FileText,
} from 'lucide-react';
import dayjs from 'dayjs';
import { CreditNoteRecord } from './billingData';
import { INITIAL_CREDIT_NOTES } from './billingMockData';

const BRAND_PURPLE = '#5421A8';

export const CreditNotesPage: React.FC = () => {
  const [creditNotes, setCreditNotes] = useState<CreditNoteRecord[]>(INITIAL_CREDIT_NOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Summary Cards Metrics
  const metrics = useMemo(() => {
    const totalCount = creditNotes.length;
    const pendingCount = creditNotes.filter((c) => c.status === 'Pending Approval').length;
    const issuedCount = creditNotes.filter((c) => c.status === 'Issued' || c.status === 'Approved').length;
    const totalAmount = creditNotes.reduce((acc, c) => acc + c.totalCreditAmount, 0);

    return { totalCount, pendingCount, issuedCount, totalAmount };
  }, [creditNotes]);

  // Filtered List
  const filteredNotes = useMemo(() => {
    return creditNotes.filter((cn) => {
      const matchSearch =
        cn.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cn.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchReason = reasonFilter === 'ALL' || cn.reason === reasonFilter;
      const matchStatus = statusFilter === 'ALL' || cn.status === statusFilter;

      return matchSearch && matchReason && matchStatus;
    });
  }, [creditNotes, searchTerm, reasonFilter, statusFilter]);

  const handleCreateSubmit = (values: any) => {
    const taxable = Number(values.taxableAmount) || 0;
    const taxRate = Number(values.taxRate) || 18;
    const taxAmt = (taxable * taxRate) / 100;
    const totalCredit = taxable + taxAmt;

    const newNote: CreditNoteRecord = {
      id: `CN-${Date.now()}`,
      creditNoteNumber: `CN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      originalInvoiceNumber: values.originalInvoiceNumber,
      customerName: values.customerName,
      customerCode: 'CUST-GEN',
      creditNoteDate: values.creditNoteDate.format('YYYY-MM-DD'),
      reason: values.reason,
      creditType: values.creditType,
      taxableAmount: taxable,
      taxAmount: taxAmt,
      totalCreditAmount: totalCredit,
      adjustmentStatus: 'Pending',
      status: 'Pending Approval',
      adjustmentMethod: values.adjustmentMethod || 'To be adjusted on next billing',
      notes: values.notes,
    };

    setCreditNotes([newNote, ...creditNotes]);
    message.success(`Credit Note ${newNote.creditNoteNumber} submitted for approval successfully!`);
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const handleApprove = (id: string) => {
    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === id ? { ...cn, status: 'Approved', adjustmentStatus: 'Applied' } : cn
      )
    );
    message.success('Credit note approved and credit amount applied against receivable balance.');
  };

  // Columns
  const columns = [
    {
      title: 'Credit Note #',
      dataIndex: 'creditNoteNumber',
      key: 'creditNoteNumber',
      render: (val: string) => <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{val}</span>,
    },
    {
      title: 'Original Invoice',
      dataIndex: 'originalInvoiceNumber',
      key: 'originalInvoiceNumber',
      render: (val: string) => (
        <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (val: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{val}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'creditNoteDate',
      key: 'creditNoteDate',
      render: (d: string) => <span style={{ fontSize: 12 }}>{d}</span>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (r: string) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{r}</span>
      ),
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span>₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      ),
    },
    {
      title: 'Total Credit',
      dataIndex: 'totalCreditAmount',
      key: 'totalCreditAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#DC2626' }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Adjustment',
      dataIndex: 'adjustmentStatus',
      key: 'adjustmentStatus',
      render: (st: string) => {
        let col = 'default';
        if (st === 'Applied') col = 'green';
        if (st === 'Refunded') col = 'blue';
        if (st === 'Pending') col = 'gold';
        return <Tag color={col} style={{ borderRadius: 8, fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        let col = 'blue';
        if (st === 'Approved' || st === 'Issued') col = 'green';
        if (st === 'Pending Approval') col = 'orange';
        return <Tag color={col} style={{ borderRadius: 8, fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CreditNoteRecord) => (
        <Space size="small">
          {record.status === 'Pending Approval' && (
            <Button
              type="text"
              size="small"
              onClick={() => handleApprove(record.id)}
              style={{ color: '#16A34A', fontWeight: 700, backgroundColor: '#DCFCE7', borderRadius: 6 }}
            >
              Approve
            </Button>
          )}
          <Tooltip title="Download PDF">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} color="#2563EB" />}
              onClick={() => message.success(`Downloading Credit Note ${record.creditNoteNumber}`)}
              style={{ backgroundColor: '#DBEAFE', borderRadius: 6 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 32px 0' }}>
      {/* 1. Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 4 }}>
            <span>Invoice & Billing</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Credit Notes</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Customer Credit Notes Management
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Issue, approve, and apply credit notes for customer sales returns, overbilling, and price adjustments
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            form.resetFields();
            setIsCreateModalOpen(true);
          }}
          style={{
            backgroundColor: BRAND_PURPLE,
            borderColor: BRAND_PURPLE,
            borderRadius: 12,
            fontWeight: 700,
            height: 38,
            boxShadow: '0 4px 14px rgba(84, 33, 168, 0.25)',
          }}
        >
          Create Credit Note
        </Button>
      </div>

      {/* 2. 4 Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Credit Notes */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Undo2 size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Credit Notes</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>{metrics.totalCount} Generated</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Across all sales divisions</div>
          </div>
        </Col>

        {/* Card 2: Pending Approval */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Clock size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Pending Approval</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>{metrics.pendingCount} Pending</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Awaiting financial controller signoff</div>
          </div>
        </Col>

        {/* Card 3: Issued Credit Notes */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <CheckCircle size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Issued & Applied</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>{metrics.issuedCount} Notes</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Successfully applied to ledger</div>
          </div>
        </Col>

        {/* Card 4: Total Credit Value */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '18px 20px',
              border: '1px solid #ECE6F8',
              boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <IndianRupee size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Credit Amount</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(metrics.totalAmount / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Adjusted against customer balances</div>
          </div>
        </Col>
      </Row>

      {/* 3. Filter & Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '22px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            prefix={<Search size={15} color="#94A3B8" />}
            placeholder="Search note number, invoice, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={reasonFilter}
            onChange={setReasonFilter}
            style={{ width: 180 }}
            options={[
              { value: 'ALL', label: 'All Reasons' },
              { value: 'Sales Return', label: 'Sales Return' },
              { value: 'Product Damage', label: 'Product Damage' },
              { value: 'Overbilling', label: 'Overbilling' },
              { value: 'Discount Adjustment', label: 'Discount Adjustment' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'Pending Approval', label: 'Pending Approval' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Issued', label: 'Issued' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} credit notes` }}
          size="middle"
        />
      </div>

      {/* 4. Create Credit Note Modal */}
      <Modal
        title="Create New Credit Note"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={620}
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
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Original Invoice Number"
                name="originalInvoiceNumber"
                rules={[{ required: true, message: 'Please enter original invoice' }]}
              >
                <Input placeholder="e.g. INV-2026-0081" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true, message: 'Please enter customer' }]}
              >
                <Input placeholder="e.g. Apex Industrial Dynamics" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Credit Note Date" name="creditNoteDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Taxable Amount (₹)"
                name="taxableAmount"
                rules={[{ required: true, message: 'Enter taxable amount' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="GST Tax Rate (%)" name="taxRate" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 0, label: '0%' },
                    { value: 5, label: '5%' },
                    { value: 12, label: '12%' },
                    { value: 18, label: '18%' },
                    { value: 28, label: '28%' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Adjustment Instructions / Method" name="adjustmentMethod">
            <Input placeholder="e.g. Adjust against receivable balance or issue refund" />
          </Form.Item>

          <Form.Item label="Detailed Reason / Return Inspection Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Explain defect, authorization or invoice difference..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditNotesPage;
