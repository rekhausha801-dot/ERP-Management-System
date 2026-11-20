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
  Tabs,
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
  FileText,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import dayjs from 'dayjs';
import { CreditNoteRecord, DebitNoteRecord } from './billingData';
import { INITIAL_CREDIT_NOTES, INITIAL_DEBIT_NOTES } from './billingMockData';

const BRAND_PURPLE = '#5421A8';

export const UnifiedNotesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'credit' | 'debit'>('credit');
  const [creditNotes, setCreditNotes] = useState<CreditNoteRecord[]>(INITIAL_CREDIT_NOTES);
  const [debitNotes, setDebitNotes] = useState<DebitNoteRecord[]>(INITIAL_DEBIT_NOTES);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');

  // Modal States
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<any>(null);

  const [creditForm] = Form.useForm();
  const [debitForm] = Form.useForm();

  // Summary Metrics (4 Cards)
  const summaryMetrics = useMemo(() => {
    const totalCreditAmt = creditNotes.reduce((acc, c) => acc + c.totalCreditAmount, 0);
    const totalDebitAmt = debitNotes.reduce((acc, d) => acc + d.totalDebitAmount, 0);
    const pendingCount =
      creditNotes.filter((c) => c.status === 'Pending Approval').length +
      debitNotes.filter((d) => d.status === 'Pending Approval').length;
    const approvedCount =
      creditNotes.filter((c) => c.status === 'Issued' || c.status === 'Approved').length +
      debitNotes.filter((d) => d.status === 'Issued' || d.status === 'Approved').length;

    return {
      totalCreditAmt,
      totalDebitAmt,
      pendingCount,
      approvedCount,
    };
  }, [creditNotes, debitNotes]);

  // Filtered Credit Notes
  const filteredCreditNotes = useMemo(() => {
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

  // Filtered Debit Notes
  const filteredDebitNotes = useMemo(() => {
    return debitNotes.filter((dn) => {
      const matchSearch =
        dn.debitNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.referenceInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dn.partyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || dn.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [debitNotes, searchTerm, statusFilter]);

  const handleCreateCredit = (values: any) => {
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
    message.success(`Credit Note ${newNote.creditNoteNumber} registered successfully!`);
    setIsCreditModalOpen(false);
    creditForm.resetFields();
  };

  const handleCreateDebit = (values: any) => {
    const taxable = Number(values.taxableAmount) || 0;
    const taxRate = Number(values.taxRate) || 18;
    const taxAmt = (taxable * taxRate) / 100;
    const totalDebit = taxable + taxAmt;

    const newNote: DebitNoteRecord = {
      id: `DN-${Date.now()}`,
      debitNoteNumber: `DN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceInvoice: values.referenceInvoice,
      partyType: values.partyType === 'Customer' ? 'Customer' : 'Supplier',
      partyName: values.partyName,
      partyCode: 'PTY-GEN',
      debitNoteDate: values.debitNoteDate.format('YYYY-MM-DD'),
      reason: values.reason || 'Price Difference',
      taxableAmount: taxable,
      taxAmount: taxAmt,
      totalDebitAmount: totalDebit,
      adjustmentStatus: 'Pending',
      status: 'Pending Approval',
      notes: values.notes,
    };

    setDebitNotes([newNote, ...debitNotes]);
    message.success(`Debit Note ${newNote.debitNoteNumber} created successfully!`);
    setIsDebitModalOpen(false);
    debitForm.resetFields();
  };

  const creditColumns = [
    {
      title: 'Credit Note #',
      dataIndex: 'creditNoteNumber',
      key: 'creditNoteNumber',
      render: (text: string) => <span className="font-semibold text-purple-900">{text}</span>,
    },
    {
      title: 'Original Invoice',
      dataIndex: 'originalInvoiceNumber',
      key: 'originalInvoiceNumber',
      render: (inv: string) => <Tag color="blue">{inv}</Tag>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'creditNoteDate',
      key: 'creditNoteDate',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (r: string) => (
        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{r}</span>
      ),
    },
    {
      title: 'Taxable (₹)',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Total Credit (₹)',
      dataIndex: 'totalCreditAmount',
      key: 'totalCreditAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span className="font-bold text-red-600">₹{v.toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Approved' || status === 'Issued' ? 'success' : status === 'Pending Approval' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space orientation="horizontal" size="small">
          <Button
            type="text"
            size="small"
            icon={<Eye size={14} className="text-purple-700" />}
            onClick={() => setViewRecord({ type: 'credit', data: record })}
          />
          <Tooltip title="Download Note PDF">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} className="text-slate-600" />}
              onClick={() => message.info(`Downloading PDF for ${record.creditNoteNumber}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const debitColumns = [
    {
      title: 'Debit Note #',
      dataIndex: 'debitNoteNumber',
      key: 'debitNoteNumber',
      render: (text: string) => <span className="font-semibold text-indigo-900">{text}</span>,
    },
    {
      title: 'Ref Bill / Inv',
      dataIndex: 'referenceInvoice',
      key: 'referenceInvoice',
      render: (ref: string) => <Tag color="geekblue">{ref}</Tag>,
    },
    {
      title: 'Party Name',
      dataIndex: 'partyName',
      key: 'partyName',
      render: (name: string, r: any) => (
        <div>
          <div className="font-medium text-slate-800">{name}</div>
          <span className="text-[11px] text-slate-400 capitalize">{r.partyType}</span>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'debitNoteDate',
      key: 'debitNoteDate',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (r: string) => (
        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{r}</span>
      ),
    },
    {
      title: 'Total Debit (₹)',
      dataIndex: 'totalDebitAmount',
      key: 'totalDebitAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span className="font-bold text-emerald-700">₹{v.toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Approved' || status === 'Issued' ? 'success' : status === 'Pending Approval' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space orientation="horizontal" size="small">
          <Button
            type="text"
            size="small"
            icon={<Eye size={14} className="text-indigo-700" />}
            onClick={() => setViewRecord({ type: 'debit', data: record })}
          />
          <Tooltip title="Download PDF">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} className="text-slate-600" />}
              onClick={() => message.info(`Downloading PDF for ${record.debitNoteNumber}`)}
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Credit & Debit Notes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized management for customer sales returns (Credit Notes) & vendor purchase adjustments (Debit Notes)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {activeTab === 'credit' ? (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
              onClick={() => setIsCreditModalOpen(true)}
            >
              Issue Credit Note
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
              onClick={() => setIsDebitModalOpen(true)}
            >
              Issue Debit Note
            </Button>
          )}
        </div>
      </div>

      {/* 4 Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total Credit Notes</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{summaryMetrics.totalCreditAmt.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <Undo2 size={12} /> {creditNotes.length} Customer adjustments
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Undo2 size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total Debit Notes</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{summaryMetrics.totalDebitAmt.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <FileCheck size={12} /> {debitNotes.length} Vendor adjustments
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Pending Approval</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {summaryMetrics.pendingCount}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Awaiting manager sign-off</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Approved & Settled</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {summaryMetrics.approvedCount}
              </h3>
              <p className="text-xs text-slate-500 mt-1">GST & Ledger reconciled</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle size={24} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Tabbed Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            {
              key: 'credit',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <Undo2 size={16} /> Credit Notes (Sales Returns & Discounts)
                </span>
              ),
            },
            {
              key: 'debit',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <FileText size={16} /> Debit Notes (Purchase Returns & Vendor Rebates)
                </span>
              ),
            },
          ]}
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 my-4">
          <Input
            prefix={<Search size={16} className="text-slate-400" />}
            placeholder={
              activeTab === 'credit'
                ? 'Search note #, invoice #, customer...'
                : 'Search note #, bill #, vendor...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80"
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full md:w-44"
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Pending Approval', label: 'Pending Approval' },
              { value: 'Issued', label: 'Issued' },
            ]}
          />

          {activeTab === 'credit' && (
            <Select
              value={reasonFilter}
              onChange={setReasonFilter}
              className="w-full md:w-52"
              options={[
                { value: 'ALL', label: 'All Reasons' },
                { value: 'Sales Return', label: 'Sales Return' },
                { value: 'Post-Sale Discount', label: 'Post-Sale Discount' },
                { value: 'Rate Difference', label: 'Rate Difference' },
                { value: 'Damaged in Transit', label: 'Damaged in Transit' },
              ]}
            />
          )}
        </div>

        {/* Data Table */}
        {activeTab === 'credit' ? (
          <Table
            dataSource={filteredCreditNotes}
            columns={creditColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            className="border-t border-slate-100"
          />
        ) : (
          <Table
            dataSource={filteredDebitNotes}
            columns={debitColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            className="border-t border-slate-100"
          />
        )}
      </div>

      {/* Credit Note Modal */}
      <Modal
        title="Issue New Credit Note"
        open={isCreditModalOpen}
        onCancel={() => setIsCreditModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={creditForm} layout="vertical" onFinish={handleCreateCredit} className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="originalInvoiceNumber"
                label="Original Invoice #"
                rules={[{ required: true, message: 'Please input invoice number' }]}
              >
                <Input placeholder="e.g. INV-2026-1044" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: 'Please input customer name' }]}
              >
                <Input placeholder="e.g. Reliance Retail Ltd" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="creditNoteDate"
                label="Credit Note Date"
                initialValue={dayjs()}
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reason"
                label="Reason for Credit Note"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select reason"
                  options={[
                    { value: 'Sales Return', label: 'Goods Returned / Defective' },
                    { value: 'Post-Sale Discount', label: 'Post-Sale Volume Discount' },
                    { value: 'Rate Difference', label: 'Price Overcharge Correction' },
                    { value: 'Damaged in Transit', label: 'Goods Damaged During Transit' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taxableAmount"
                label="Taxable Amount (₹)"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={0} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taxRate" label="GST Rate (%)" initialValue={18}>
                <Select
                  options={[
                    { value: 0, label: '0% (Exempt)' },
                    { value: 5, label: '5%' },
                    { value: 12, label: '12%' },
                    { value: 18, label: '18%' },
                    { value: 28, label: '28%' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Remarks / Note Justification">
            <Input.TextArea rows={2} placeholder="Explain reason for credit adjustment" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsCreditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE }}>
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Debit Note Modal */}
      <Modal
        title="Issue New Debit Note"
        open={isDebitModalOpen}
        onCancel={() => setIsDebitModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={debitForm} layout="vertical" onFinish={handleCreateDebit} className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="referenceInvoice"
                label="Reference Purchase Bill #"
                rules={[{ required: true, message: 'Please input vendor bill ref' }]}
              >
                <Input placeholder="e.g. PB-2026-089" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="partyName"
                label="Supplier / Vendor Name"
                rules={[{ required: true, message: 'Please enter vendor name' }]}
              >
                <Input placeholder="e.g. Precision Components Inc." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="partyType"
                label="Party Type"
                initialValue="supplier"
              >
                <Select
                  options={[
                    { value: 'supplier', label: 'Supplier / Vendor' },
                    { value: 'customer', label: 'Customer (Underbilling correction)' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="debitNoteDate"
                label="Debit Note Date"
                initialValue={dayjs()}
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taxableAmount"
                label="Taxable Amount (₹)"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" min={0} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taxRate" label="GST Rate (%)" initialValue={18}>
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

          <Form.Item
            name="reason"
            label="Reason for Debit Adjustment"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Rejection of defective batch, shortage received" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsDebitModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Submit Debit Note
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Record Modal */}
      <Modal
        title={viewRecord?.type === 'credit' ? 'Credit Note Details' : 'Debit Note Details'}
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<Download size={14} />}
            onClick={() => {
              message.success('Downloading document summary...');
              setViewRecord(null);
            }}
          >
            Download Print Copy
          </Button>,
        ]}
      >
        {viewRecord?.data && (
          <div className="py-2 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Document No:</span>
              <span className="font-bold text-slate-800">
                {viewRecord.data.creditNoteNumber || viewRecord.data.debitNoteNumber}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Reference Document:</span>
              <span className="font-semibold text-blue-600">
                {viewRecord.data.originalInvoiceNumber || viewRecord.data.referenceInvoice}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Party Name:</span>
              <span className="font-medium text-slate-800">
                {viewRecord.data.customerName || viewRecord.data.partyName}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Date:</span>
              <span className="text-slate-700">
                {viewRecord.data.creditNoteDate || viewRecord.data.debitNoteDate}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Reason:</span>
              <span className="text-slate-800 font-medium">{viewRecord.data.reason}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Taxable Amount:</span>
              <span className="text-slate-800">
                ₹{viewRecord.data.taxableAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Tax Amount:</span>
              <span className="text-slate-800">
                ₹{viewRecord.data.taxAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 font-bold text-base">
              <span>Total Adjusted Amount:</span>
              <span className={viewRecord.type === 'credit' ? 'text-red-600' : 'text-emerald-700'}>
                ₹
                {(
                  viewRecord.data.totalCreditAmount || viewRecord.data.totalDebitAmount
                )?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <Tag color="green">{viewRecord.data.status}</Tag>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
