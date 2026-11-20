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
  Divider,
} from 'antd';
import {
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  CreditCard,
  Download,
  Printer,
  ChevronRight,
  Eye,
  Calendar,
  FileCheck,
} from 'lucide-react';
import dayjs from 'dayjs';
import { PayableBillRecord } from './billingData';
import { INITIAL_PAYABLES } from './billingMockData';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const OutstandingPayablesPage: React.FC = () => {
  const [bills, setBills] = useState<PayableBillRecord[]>(INITIAL_PAYABLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<PayableBillRecord | null>(null);
  const [form] = Form.useForm();

  // 1. Summary Cards Metrics (Exactly 4 meaningful summary cards)
  const metrics = useMemo(() => {
    const totalOutstanding = bills.reduce((acc, b) => acc + b.outstandingBalance, 0);
    const dueThisWeek = bills.filter((b) => b.daysOverdue <= 0 && b.outstandingBalance > 0).length;
    const overdueAmount = bills.filter((b) => b.daysOverdue > 0).reduce((acc, b) => acc + b.outstandingBalance, 0);
    const paidThisMonth = bills.reduce((acc, b) => acc + b.amountPaid, 0);

    return { totalOutstanding, dueThisWeek, overdueAmount, paidThisMonth };
  }, [bills]);

  // 2. Separate Aging Analysis Table (Aging Period, Number of Bills, Outstanding Amount, Percentage)
  const agingData = useMemo(() => {
    let currentBills = 0, currentAmt = 0;
    let d1_30_Bills = 0, d1_30_Amt = 0;
    let d31_60_Bills = 0, d31_60_Amt = 0;
    let d61_90_Bills = 0, d61_90_Amt = 0;
    let dAbove90_Bills = 0, dAbove90_Amt = 0;

    const totalBal = metrics.totalOutstanding || 1;

    bills.forEach((b) => {
      if (b.outstandingBalance > 0) {
        if (b.daysOverdue <= 0) {
          currentBills++;
          currentAmt += b.outstandingBalance;
        } else if (b.daysOverdue <= 30) {
          d1_30_Bills++;
          d1_30_Amt += b.outstandingBalance;
        } else if (b.daysOverdue <= 60) {
          d31_60_Bills++;
          d31_60_Amt += b.outstandingBalance;
        } else if (b.daysOverdue <= 90) {
          d61_90_Bills++;
          d61_90_Amt += b.outstandingBalance;
        } else {
          dAbove90_Bills++;
          dAbove90_Amt += b.outstandingBalance;
        }
      }
    });

    return [
      { key: '1', period: 'Current / Not Due', count: currentBills, amount: currentAmt, percent: ((currentAmt / totalBal) * 100).toFixed(1), color: '#16A34A' },
      { key: '2', period: '1–30 Days Overdue', count: d1_30_Bills, amount: d1_30_Amt, percent: ((d1_30_Amt / totalBal) * 100).toFixed(1), color: '#D97706' },
      { key: '3', period: '31–60 Days Overdue', count: d31_60_Bills, amount: d31_60_Amt, percent: ((d31_60_Amt / totalBal) * 100).toFixed(1), color: '#EA580C' },
      { key: '4', period: '61–90 Days Overdue', count: d61_90_Bills, amount: d61_90_Amt, percent: ((d61_90_Amt / totalBal) * 100).toFixed(1), color: '#DC2626' },
      { key: '5', period: 'Above 90 Days Overdue', count: dAbove90_Bills, amount: dAbove90_Amt, percent: ((dAbove90_Amt / totalBal) * 100).toFixed(1), color: '#991B1B' },
    ];
  }, [bills, metrics.totalOutstanding]);

  // 3. Filtered List
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchSearch =
        b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.poReference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBranch = branchFilter === 'ALL' || b.branch === branchFilter;
      const matchStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;

      return matchSearch && matchBranch && matchStatus;
    });
  }, [bills, searchTerm, branchFilter, statusFilter]);

  const handleOpenPayment = (bill: PayableBillRecord) => {
    setSelectedBill(bill);
    form.setFieldsValue({
      billNumber: bill.billNumber,
      supplierName: bill.supplierName,
      supplierCode: bill.supplierCode,
      billAmount: bill.billAmount,
      previouslyPaid: bill.amountPaid,
      outstandingAmount: bill.outstandingBalance,
      currentPayment: bill.outstandingBalance,
      paymentMethod: 'Bank Transfer (NEFT/RTGS)',
      paymentDate: dayjs(),
      referenceNo: `PAY-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: '',
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (values: any) => {
    if (!selectedBill) return;
    const payAmt = Number(values.currentPayment);
    if (payAmt <= 0 || payAmt > selectedBill.outstandingBalance) {
      message.error('Payment amount must be valid and within outstanding balance.');
      return;
    }

    const newPaid = selectedBill.amountPaid + payAmt;
    const newBal = selectedBill.billAmount - newPaid;
    const newStatus = newBal === 0 ? 'Paid' : 'Partially Paid';

    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id
          ? {
              ...b,
              amountPaid: newPaid,
              outstandingBalance: newBal,
              paymentStatus: newStatus,
            }
          : b
      )
    );

    message.success(`Supplier disbursement of ₹${payAmt.toLocaleString('en-IN')} completed for ${selectedBill.billNumber}!`);
    setIsPaymentModalOpen(false);
  };

  // Main Table Columns
  const columns = [
    {
      title: 'Bill Number',
      dataIndex: 'billNumber',
      key: 'billNumber',
      render: (val: string) => <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{val}</span>,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name: string, record: PayableBillRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>PO Ref: {record.poReference} • {record.branch}</div>
        </div>
      ),
    },
    {
      title: 'Bill Date',
      dataIndex: 'billDate',
      key: 'billDate',
      render: (d: string) => <span style={{ fontSize: 12 }}>{d}</span>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (d: string, record: PayableBillRecord) => (
        <span
          style={{
            fontSize: 12,
            fontWeight: record.daysOverdue > 0 ? 700 : 500,
            color: record.daysOverdue > 0 ? '#DC2626' : '#334155',
          }}
        >
          {d}
        </span>
      ),
    },
    {
      title: 'Bill Amount',
      dataIndex: 'billAmount',
      key: 'billAmount',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ color: '#16A34A', fontWeight: 600 }}>₹{Number(amt).toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Outstanding Balance',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: amt > 0 ? '#DC2626' : '#64748B' }}>
          ₹{Number(amt).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      align: 'center' as const,
      render: (days: number) => {
        if (days <= 0) return <Tag color="green" style={{ borderRadius: 6 }}>Current</Tag>;
        return <Tag color="red" style={{ borderRadius: 6, fontWeight: 700 }}>{days} Days</Tag>;
      },
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (st: string) => {
        let col = 'default';
        if (st === 'Paid') col = 'green';
        if (st === 'Partially Paid') col = 'gold';
        if (st === 'Overdue') col = 'red';
        if (st === 'Unpaid') col = 'blue';
        return <Tag color={col} style={{ borderRadius: 8, fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PayableBillRecord) => (
        <Space size="small">
          {record.outstandingBalance > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CreditCard size={15} color="#16A34A" />}
              onClick={() => handleOpenPayment(record)}
              style={{ backgroundColor: '#DCFCE7', borderRadius: 6 }}
            >
              Pay
            </Button>
          )}
          <Tooltip title="Download Receipt">
            <Button
              type="text"
              size="small"
              icon={<Download size={14} color="#2563EB" />}
              onClick={() => message.success(`Downloading statement for ${record.billNumber}`)}
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
            <span>Creditors & Debtors</span>
            <ChevronRight size={13} />
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Outstanding Payables</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Outstanding Supplier Bills & Payables Aging
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Track unpaid supplier procurement bills, aging buckets, and record scheduled bank remittances
          </p>
        </div>

        <Space>
          <Button
            icon={<Download size={15} />}
            onClick={() => message.success('Exporting Payables Aging Report to Excel...')}
            style={{ borderRadius: 10 }}
          >
            Export Payables
          </Button>
        </Space>
      </div>

      {/* 2. Exactly 4 Meaningful Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Outstanding */}
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
                <ShoppingBag size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Outstanding</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(metrics.totalOutstanding / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Total unpaid supplier bills</div>
          </div>
        </Col>

        {/* Card 2: Due This Week */}
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Due This Week</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#D97706' }}>
              {metrics.dueThisWeek} Bills Due
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Due in the next 7 days</div>
          </div>
        </Col>

        {/* Card 3: Overdue Amount */}
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
                <AlertTriangle size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Overdue Amount</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626' }}>
              ₹{(metrics.overdueAmount / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4, fontWeight: 700 }}>
              Past agreed vendor terms
            </div>
          </div>
        </Col>

        {/* Card 4: Paid This Month */}
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Paid This Month</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>
              ₹{(metrics.paidThisMonth / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Supplier payments settled</div>
          </div>
        </Col>
      </Row>

      {/* 3. Payable Aging Analysis Clean Dedicated Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              Payable Aging Analysis Report
            </h3>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Detailed stratification of accounts payable by maturity period
            </span>
          </div>

          <div style={{ display: 'flex', gap: 14, fontSize: 13, fontWeight: 700 }}>
            <span>Total Bills: <strong style={{ color: BRAND_PURPLE }}>{bills.length}</strong></span>
            <span>Total Overdue: <strong style={{ color: '#DC2626' }}>₹{(metrics.overdueAmount / 100000).toFixed(2)}L</strong></span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px' }}>Aging Period</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>Number of Bills</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Outstanding Amount (INR)</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            {agingData.map((row) => (
              <tr key={row.key} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: row.color }}>
                  {row.period}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600 }}>
                  {row.count} Bills
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                  ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#64748B' }}>
                  {row.percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Table Section */}
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
            placeholder="Search bill number, supplier, PO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Partially Paid', label: 'Partially Paid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBills}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} bills` }}
          size="middle"
        />
      </div>

      {/* 5. Record Supplier Payment Form Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} color="#16A34A" />
            <span>Record Supplier Bill Payment & Disbursement</span>
          </div>
        }
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handlePaymentSubmit}>
          {/* Section A: Supplier Details */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            A. Supplier & Bill Details
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Supplier Name" name="supplierName">
                <Input disabled style={{ fontWeight: 700 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Supplier Bill Number" name="billNumber">
                <Input disabled style={{ fontWeight: 700 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Bill Amount (₹)" name="billAmount">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Previously Paid (₹)" name="previouslyPaid">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Outstanding Balance (₹)" name="outstandingAmount">
                <InputNumber disabled style={{ width: '100%', color: '#DC2626', fontWeight: 800 }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          {/* Section B: Payment Amount & Method */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            B. Payment Disbursement Details
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Current Payment Amount (₹)"
                name="currentPayment"
                rules={[{ required: true, message: 'Please enter payment amount' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payment Date" name="paymentDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
                    { value: 'IMPS', label: 'IMPS' },
                    { value: 'UPI', label: 'UPI' },
                    { value: 'Corporate Cheque', label: 'Cheque' },
                    { value: 'Cash', label: 'Cash' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Payment Reference / UTR" name="referenceNo" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Payment Remarks / Notes" name="notes">
            <Input.TextArea rows={2} placeholder="Optional disbursement notes..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              Disburse Payment & Update Ledger
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OutstandingPayablesPage;
