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
  Drawer,
  Form,
  InputNumber,
  Space,
  Tooltip,
  message,
  Tabs,
  Divider,
} from 'antd';
import {
  UserCheck,
  CheckCircle,
  Clock,
  IndianRupee,
  Search,
  Plus,
  Eye,
  Mail,
  Download,
  ChevronRight,
  Building,
  Edit,
  Power,
  FileText,
} from 'lucide-react';
import { DebtorRecord } from './billingData';
import { INITIAL_DEBTORS, INITIAL_RECEIVABLES } from './billingMockData';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const DebtorsPage: React.FC = () => {
  const [debtors, setDebtors] = useState<DebtorRecord[]>(INITIAL_DEBTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Drawer & Modal State
  const [selectedDebtor, setSelectedDebtor] = useState<DebtorRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState<DebtorRecord | null>(null);
  const [form] = Form.useForm();

  // 1. Summary Cards Metrics (Exactly 4 meaningful summary cards)
  const metrics = useMemo(() => {
    const totalCount = debtors.length;
    const activeCount = debtors.filter((d) => d.accountStatus === 'Active').length;
    const totalReceivables = debtors.reduce((acc, d) => acc + d.outstandingBalance, 0);

    const overdueDebtors = debtors.filter((d) => d.overdueAmount > 0);
    const overdueCount = overdueDebtors.length;
    const overdueReceivables = debtors.reduce((acc, d) => acc + d.overdueAmount, 0);

    return {
      totalCount,
      activeCount,
      totalReceivables,
      overdueCount,
      overdueReceivables,
    };
  }, [debtors]);

  // 2. Filtered List
  const filteredDebtors = useMemo(() => {
    return debtors.filter((d) => {
      const matchSearch =
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.gstin.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = customerTypeFilter === 'ALL' || d.customerType === customerTypeFilter;
      const matchBranch = branchFilter === 'ALL' || d.branch === branchFilter;
      const matchStatus = statusFilter === 'ALL' || d.accountStatus === statusFilter;

      return matchSearch && matchType && matchBranch && matchStatus;
    });
  }, [debtors, searchTerm, customerTypeFilter, branchFilter, statusFilter]);

  // Form Save
  const handleSaveDebtor = (values: any) => {
    if (editingDebtor) {
      setDebtors((prev) =>
        prev.map((d) =>
          d.id === editingDebtor.id
            ? {
                ...d,
                customerName: values.customerName,
                customerType: values.customerType,
                contactPerson: values.contactPerson,
                phone: values.phone,
                email: values.email,
                gstin: values.gstin,
                pan: values.pan || d.pan,
                billingAddress: values.billingAddress,
                branch: values.branch,
                salesperson: values.salesperson || d.salesperson,
                creditLimit: Number(values.creditLimit) || d.creditLimit,
                paymentTerms: values.paymentTerms,
              }
            : d
        )
      );
      message.success(`Customer Debtor ${values.customerName} updated successfully!`);
    } else {
      const newDebtor: DebtorRecord = {
        id: `DEBT-${Date.now()}`,
        customerCode: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: values.customerName,
        customerType: values.customerType,
        contactPerson: values.contactPerson,
        phone: values.phone,
        email: values.email,
        gstin: values.gstin,
        pan: values.pan || 'PAN-NA',
        billingAddress: values.billingAddress,
        city: values.city || 'Chennai',
        state: values.state || 'Tamil Nadu',
        branch: values.branch,
        salesperson: values.salesperson || 'Priya Sharma',
        totalSales: Number(values.openingBalance) || 0,
        totalReceived: 0,
        outstandingBalance: Number(values.openingBalance) || 0,
        overdueAmount: 0,
        creditLimit: Number(values.creditLimit) || 500000,
        paymentTerms: values.paymentTerms,
        creditPeriodDays: 15,
        accountStatus: 'Active',
        openingBalance: Number(values.openingBalance) || 0,
      };
      setDebtors([newDebtor, ...debtors]);
      message.success(`Customer Debtor ${newDebtor.customerName} registered successfully!`);
    }

    setIsAddModalOpen(false);
    setEditingDebtor(null);
    form.resetFields();
  };

  const handleToggleStatus = (record: DebtorRecord) => {
    const newStatus = record.accountStatus === 'Active' ? 'Credit Blocked' : 'Active';
    setDebtors((prev) =>
      prev.map((d) => (d.id === record.id ? { ...d, accountStatus: newStatus } : d))
    );
    message.info(`Customer status updated to ${newStatus}`);
  };

  const openEditModal = (record: DebtorRecord) => {
    setEditingDebtor(record);
    form.setFieldsValue({
      customerName: record.customerName,
      customerType: record.customerType,
      contactPerson: record.contactPerson,
      phone: record.phone,
      email: record.email,
      gstin: record.gstin,
      pan: record.pan,
      branch: record.branch,
      salesperson: record.salesperson,
      creditLimit: record.creditLimit,
      paymentTerms: record.paymentTerms,
      billingAddress: record.billingAddress,
    });
    setIsAddModalOpen(true);
  };

  const columns = [
    {
      title: 'Customer Code',
      dataIndex: 'customerCode',
      key: 'customerCode',
      render: (val: string, record: DebtorRecord) => (
        <a
          onClick={() => {
            setSelectedDebtor(record);
            setIsDetailDrawerOpen(true);
          }}
          style={{ fontWeight: 700, color: BRAND_PURPLE }}
        >
          {val}
        </a>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: DebtorRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.customerType} • {record.city}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      render: (cp: string, record: DebtorRecord) => (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{cp}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'GSTIN',
      dataIndex: 'gstin',
      key: 'gstin',
      render: (g: string) => <span style={{ fontSize: 12, color: '#475569' }}>{g}</span>,
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Total Received',
      dataIndex: 'totalReceived',
      key: 'totalReceived',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ color: '#16A34A', fontWeight: 600 }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Outstanding Balance',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      align: 'right' as const,
      render: (lim: number) => <span>₹{Number(lim).toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      render: (t: string) => <Tag color="blue" style={{ borderRadius: 6 }}>{t}</Tag>,
    },
    {
      title: 'Account Status',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (st: string) => (
        <Tag color={st === 'Active' ? 'green' : 'red'} style={{ borderRadius: 8, fontWeight: 700 }}>
          {st}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DebtorRecord) => (
        <Space size="small">
          <Tooltip title="View Account Profile">
            <Button
              type="text"
              size="small"
              icon={<Eye size={15} color={BRAND_PURPLE} />}
              onClick={() => {
                setSelectedDebtor(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{ backgroundColor: '#F3E8FF', borderRadius: 6 }}
            />
          </Tooltip>
          <Tooltip title="Edit Debtor">
            <Button
              type="text"
              size="small"
              icon={<Edit size={14} color="#1E3A8A" />}
              onClick={() => openEditModal(record)}
              style={{ backgroundColor: '#DBEAFE', borderRadius: 6 }}
            />
          </Tooltip>
          {record.overdueAmount > 0 && (
            <Tooltip title="Send Payment Reminder">
              <Button
                type="text"
                size="small"
                icon={<Mail size={14} color="#D97706" />}
                onClick={() => message.success(`Payment reminder email sent to ${record.email}`)}
                style={{ backgroundColor: '#FEF3C7', borderRadius: 6 }}
              />
            </Tooltip>
          )}
          <Tooltip title={record.accountStatus === 'Active' ? 'Block Credit' : 'Unblock Credit'}>
            <Button
              type="text"
              size="small"
              icon={<Power size={14} color={record.accountStatus === 'Active' ? '#DC2626' : '#16A34A'} />}
              onClick={() => handleToggleStatus(record)}
              style={{
                backgroundColor: record.accountStatus === 'Active' ? '#FEE2E2' : '#DCFCE7',
                borderRadius: 6,
              }}
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
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Debtors</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Customer Debtors & Accounts Receivable Ledger
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Manage client credit accounts, trade limits, accounts receivable ledger, and payment follow-ups
          </p>
        </div>

        <Space>
          <Button
            icon={<Download size={15} />}
            onClick={() => message.success('Exporting customer debtors ledger to Excel...')}
            style={{ borderRadius: 10 }}
          >
            Export Debtors
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              setEditingDebtor(null);
              form.resetFields();
              setIsAddModalOpen(true);
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
            Add Credit Debtor
          </Button>
        </Space>
      </div>

      {/* 2. Exactly 4 Meaningful Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Debtors',
            value: `${metrics.totalCount}`,
            growth: `${metrics.activeCount} Active`,
            isDark: true,
            icon: <UserCheck size={20} color="#5421A8" />,
            pillExtra: 'Credit Accounts',
          },
          {
            title: 'Active Debtors',
            value: `${metrics.activeCount}`,
            growth: 'Good Standing',
            isDark: false,
            icon: <CheckCircle size={20} color="#10B981" />,
            pillExtra: 'Active Lines',
          },
          {
            title: 'Total Receivables',
            value: `₹${(metrics.totalReceivables / 100000).toFixed(2)}L`,
            growth: 'Expected Cash',
            isDark: true,
            icon: <IndianRupee size={20} color="#3B82F6" />,
            pillExtra: 'Incoming',
          },
          {
            title: 'Overdue Debtors',
            value: `${metrics.overdueCount}`,
            growth: `₹${(metrics.overdueReceivables / 100000).toFixed(2)}L Past Due`,
            isPositive: false,
            isDark: false,
            icon: <Clock size={20} color="#DC2626" />,
            pillExtra: 'Overdue',
          },
        ]}
      />

      {/* 3. Table */}
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
            placeholder="Search customer name, code, contact, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={customerTypeFilter}
            onChange={setCustomerTypeFilter}
            style={{ width: 170 }}
            options={[
              { value: 'ALL', label: 'All Customer Types' },
              { value: 'Enterprise', label: 'Enterprise' },
              { value: 'SMB', label: 'SMB' },
              { value: 'Government', label: 'Government' },
              { value: 'Retail Client', label: 'Retail Client' },
            ]}
          />
          <Select
            value={branchFilter}
            onChange={setBranchFilter}
            style={{ width: 160 }}
            options={[
              { value: 'ALL', label: 'All Branches' },
              { value: 'Chennai HQ', label: 'Chennai HQ' },
              { value: 'Coimbatore Hub', label: 'Coimbatore Hub' },
              { value: 'Bengaluru Hub', label: 'Bengaluru Hub' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Credit Blocked', label: 'Credit Blocked' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredDebtors}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} debtors` }}
          size="middle"
        />
      </div>

      {/* 4. Debtor Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building size={18} color={BRAND_PURPLE} />
            <span>Customer Debtor Statement — {selectedDebtor?.customerName}</span>
          </div>
        }
        width={680}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        extra={
          <Button
            type="primary"
            icon={<Download size={14} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => message.success(`Generating customer ledger statement for ${selectedDebtor?.customerName}`)}
          >
            Download Statement
          </Button>
        }
      >
        {selectedDebtor && (
          <div>
            <div style={{ background: '#FAF5FF', padding: '18px 20px', borderRadius: 16, marginBottom: 20 }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Customer Code</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{selectedDebtor.customerCode}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>GSTIN / PAN</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{selectedDebtor.gstin}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Outstanding Receivable</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#1E3A8A' }}>
                    ₹{selectedDebtor.outstandingBalance.toLocaleString('en-IN')}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Credit Limit & Terms</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    ₹{selectedDebtor.creditLimit.toLocaleString('en-IN')} ({selectedDebtor.paymentTerms})
                  </div>
                </Col>
              </Row>
            </div>

            <Tabs
              defaultActiveKey="profile"
              items={[
                {
                  key: 'profile',
                  label: 'Account Profile',
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Billing & Delivery Address</div>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{selectedDebtor.billingAddress}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Commercial Contact</div>
                        <div style={{ fontSize: 13, color: '#0F172A' }}>
                          {selectedDebtor.contactPerson} • {selectedDebtor.phone} • {selectedDebtor.email}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Assigned Account Manager & Hub</div>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>
                          {selectedDebtor.salesperson} ({selectedDebtor.branch})
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'invoices',
                  label: 'Customer Invoices',
                  children: (
                    <div>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F1F5F9', textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                            <th style={{ padding: '8px 10px' }}>Invoice #</th>
                            <th style={{ padding: '8px 10px' }}>Date</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Balance</th>
                            <th style={{ padding: '8px 10px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {INITIAL_RECEIVABLES.filter((r) => r.customerName === selectedDebtor.customerName).map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: BRAND_PURPLE }}>{r.invoiceNumber}</td>
                              <td style={{ padding: '8px 10px' }}>{r.invoiceDate}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{r.invoiceAmount.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#1E3A8A' }}>
                                ₹{r.outstandingBalance.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <Tag color={r.collectionStatus === 'Paid' ? 'green' : 'orange'}>{r.collectionStatus}</Tag>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* 5. Add / Edit Modal */}
      <Modal
        title={editingDebtor ? 'Edit Customer Debtor' : 'Register Customer Debtor Account'}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingDebtor(null);
        }}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveDebtor}
          initialValues={{
            customerType: 'Enterprise',
            branch: 'Chennai HQ',
            paymentTerms: 'Net 15 Days',
            creditLimit: 500000,
            openingBalance: 0,
            salesperson: 'Priya Sharma',
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
          }}
        >
          {/* Section A: Customer Information */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            A. Customer Information
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Customer Legal Name" name="customerName" rules={[{ required: true }]}>
                <Input placeholder="e.g. Apex Industrial Dynamics" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customer Segment" name="customerType" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Enterprise', label: 'Enterprise' },
                    { value: 'SMB', label: 'SMB' },
                    { value: 'Government', label: 'Government' },
                    { value: 'Retail Client', label: 'Retail Client' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true }]}>
                <Input placeholder="Authorized finance/procure officer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Email Address" name="email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website" name="website">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          {/* Section B: Business Information */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            B. Business & Tax Details
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="GSTIN" name="gstin" rules={[{ required: true }]}>
                <Input placeholder="33AABCA1234F1Z8" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="PAN Number" name="pan">
                <Input placeholder="AABCA1234F" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Billing & Shipping Address" name="billingAddress" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider style={{ margin: '12px 0' }} />

          {/* Section C: Financial Information */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            C. Financial & Trade Terms
          </div>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Approved Credit Limit (₹)" name="creditLimit">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Payment Terms" name="paymentTerms">
                <Select
                  options={[
                    { value: 'Net 15 Days', label: 'Net 15 Days' },
                    { value: 'Net 30 Days', label: 'Net 30 Days' },
                    { value: 'Net 45 Days', label: 'Net 45 Days' },
                    { value: 'Immediate Payment', label: 'Immediate Payment' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Opening Balance (₹)" name="openingBalance">
                <InputNumber disabled={!!editingDebtor} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Branch Location" name="branch">
                <Select
                  options={[
                    { value: 'Chennai HQ', label: 'Chennai HQ' },
                    { value: 'Coimbatore Hub', label: 'Coimbatore Hub' },
                    { value: 'Bengaluru Hub', label: 'Bengaluru Hub' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Assigned Account Manager" name="salesperson">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingDebtor(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              {editingDebtor ? 'Update Debtor' : 'Save Debtor'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DebtorsPage;
