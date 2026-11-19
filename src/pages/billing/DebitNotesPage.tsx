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
  FileText,
  Clock,
  CheckCircle,
  IndianRupee,
  Search,
  Plus,
  Eye,
  Download,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import dayjs from 'dayjs';
import { DebitNoteRecord } from './billingData';
import { INITIAL_DEBIT_NOTES } from './billingMockData';

const BRAND_PURPLE = '#5421A8';

export const DebitNotesPage: React.FC = () => {
  const [debitNotes, setDebitNotes] = useState<DebitNoteRecord[]>(INITIAL_DEBIT_NOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [partyTypeFilter, setPartyTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = debitNotes.length;
    const pendingCount = debitNotes.filter((d) => d.status === 'Pending Approval').length;
    const issuedCount = debitNotes.filter((d) => d.status === 'Approved' || d.status === 'Issued').length;
    const totalAmount = debitNotes.reduce((acc, d) => acc + d.totalDebitAmount, 0);

    return { totalCount, pendingCount, issuedCount, totalAmount };
  }, [debitNotes]);

  // Filtered List
  const filteredNotes = useMemo(() => {
    return debitNotes.filter((dn) => {
      const matchSearch =
        dn.debitNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.referenceInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.partyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchParty = partyTypeFilter === 'ALL' || dn.partyType === partyTypeFilter;
      const matchStatus = statusFilter === 'ALL' || dn.status === statusFilter;

      return matchSearch && matchParty && matchStatus;
    });
  }, [debitNotes, searchTerm, partyTypeFilter, statusFilter]);

  const handleCreateSubmit = (values: any) => {
    const taxable = Number(values.taxableAmount) || 0;
    const taxRate = Number(values.taxRate) || 18;
    const taxAmt = (taxable * taxRate) / 100;
    const totalDebit = taxable + taxAmt;

    const newNote: DebitNoteRecord = {
      id: `DN-${Date.now()}`,
      debitNoteNumber: `DN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceInvoice: values.referenceInvoice,
      partyName: values.partyName,
      partyType: values.partyType,
      partyCode: 'PTY-GEN',
      debitNoteDate: values.debitNoteDate.format('YYYY-MM-DD'),
      reason: values.reason,
      taxableAmount: taxable,
      taxAmount: taxAmt,
      totalDebitAmount: totalDebit,
      adjustmentStatus: 'Pending',
      status: 'Pending Approval',
      notes: values.notes,
    };

    setDebitNotes([newNote, ...debitNotes]);
    message.success(`Debit Note ${newNote.debitNoteNumber} created successfully!`);
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const handleApprove = (id: string) => {
    setDebitNotes((prev) =>
      prev.map((dn) =>
        dn.id === id ? { ...dn, status: 'Approved', adjustmentStatus: 'Applied' } : dn
      )
    );
    message.success('Debit note approved and balance adjusted.');
  };

  // Columns
  const columns = [
    {
      title: 'Debit Note #',
      dataIndex: 'debitNoteNumber',
      key: 'debitNoteNumber',
      render: (val: string) => <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{val}</span>,
    },
    {
      title: 'Reference Invoice/Bill',
      dataIndex: 'referenceInvoice',
      key: 'referenceInvoice',
      render: (val: string) => (
        <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: 'Party Name',
      dataIndex: 'partyName',
      key: 'partyName',
      render: (name: string, record: DebitNoteRecord) => (
        <div>
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{name}</span>
          <div>
            <Tag color={record.partyType === 'Customer' ? 'blue' : 'purple'} style={{ fontSize: 10, borderRadius: 6 }}>
              {record.partyType}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'debitNoteDate',
      key: 'debitNoteDate',
      render: (d: string) => <span style={{ fontSize: 12 }}>{d}</span>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (r: string) => <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{r}</span>,
    },
    {
      title: 'Total Debit',
      dataIndex: 'totalDebitAmount',
      key: 'totalDebitAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
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
      render: (_: any, record: DebitNoteRecord) => (
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
              onClick={() => message.success(`Downloading Debit Note ${record.debitNoteNumber}`)}
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
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Debit Notes</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Customer & Supplier Debit Notes
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Manage supplementary debits, freight charges, underbilling corrections, and price differences
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
          Create Debit Note
        </Button>
      </div>

      {/* 2. 4 Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Debit Notes */}
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
                <FileText size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Debit Notes</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>{metrics.totalCount} Generated</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Customer & supplier notes</div>
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
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Awaiting financial signoff</div>
          </div>
        </Col>

        {/* Card 3: Issued Debit Notes */}
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
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Posted to account balances</div>
          </div>
        </Col>

        {/* Card 4: Total Debit Amount */}
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <IndianRupee size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Debit Value</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(metrics.totalAmount / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Supplementary bill additions</div>
          </div>
        </Col>
      </Row>

      {/* 3. Table Section */}
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
            placeholder="Search debit note, party, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={partyTypeFilter}
            onChange={setPartyTypeFilter}
            style={{ width: 160 }}
            options={[
              { value: 'ALL', label: 'All Parties' },
              { value: 'Customer', label: 'Customers' },
              { value: 'Supplier', label: 'Suppliers' },
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
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} debit notes` }}
          size="middle"
        />
      </div>

      {/* 4. Create Modal */}
      <Modal
        title="Create Supplementary Debit Note"
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
            debitNoteDate: dayjs(),
            partyType: 'Customer',
            reason: 'Freight Charges',
            taxRate: 18,
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Party Classification" name="partyType" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Customer', label: 'Customer (Charge to Customer)' },
                    { value: 'Supplier', label: 'Supplier (Debit to Supplier)' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Party Name" name="partyName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Industrial Dynamics" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Reference Invoice / Bill" name="referenceInvoice" rules={[{ required: true }]}>
                <Input placeholder="e.g. INV-2026-0081 or BILL-2026-045" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Debit Note Date" name="debitNoteDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Debit Reason" name="reason" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Additional Charges', label: 'Additional Charges' },
                { value: 'Underbilling Correction', label: 'Underbilling Correction' },
                { value: 'Price Difference', label: 'Price Difference' },
                { value: 'Freight Charges', label: 'Freight Charges' },
                { value: 'Tax Adjustment', label: 'Tax Adjustment' },
                { value: 'Service Charges', label: 'Service Charges' },
              ]}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Taxable Amount (₹)" name="taxableAmount" rules={[{ required: true }]}>
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

          <Form.Item label="Supporting Notes & Comments" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Create Debit Note
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DebitNotesPage;
