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
  Users,
  CheckCircle,
  Clock,
  IndianRupee,
  Search,
  Plus,
  Eye,
  CreditCard,
  Download,
  ChevronRight,
  Building,
  Phone,
  Mail,
  FileText,
  Calendar,
  AlertTriangle,
  FileCheck,
  Edit,
  Power,
} from 'lucide-react';
import { CreditorRecord } from './billingData';
import { INITIAL_CREDITORS, INITIAL_PAYABLES } from './billingMockData';

const BRAND_NAVY = '#1E3A8A';
const BRAND_PURPLE = '#5421A8';

export const CreditorsPage: React.FC = () => {
  const [creditors, setCreditors] = useState<CreditorRecord[]>(INITIAL_CREDITORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supplierTypeFilter, setSupplierTypeFilter] = useState('ALL');

  // Drawer & Modal State
  const [selectedCreditor, setSelectedCreditor] = useState<CreditorRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCreditor, setEditingCreditor] = useState<CreditorRecord | null>(null);
  const [form] = Form.useForm();

  // 1. Summary Cards Metrics (Exactly 4 meaningful summary cards)
  const metrics = useMemo(() => {
    const totalCount = creditors.length;
    const withPayableCount = creditors.filter((c) => c.outstandingBalance > 0).length;

    const activeCount = creditors.filter((c) => c.status === 'Active').length;
    const totalPayable = creditors.reduce((acc, c) => acc + c.outstandingBalance, 0);

    const overdueCreditors = creditors.filter((c) => c.overdueAmount > 0);
    const overdueCount = overdueCreditors.length;
    const overduePayables = creditors.reduce((acc, c) => acc + c.overdueAmount, 0);

    return {
      totalCount,
      withPayableCount,
      activeCount,
      totalPayable,
      overdueCount,
      overduePayables,
    };
  }, [creditors]);

  // 2. Filtered List
  const filteredCreditors = useMemo(() => {
    return creditors.filter((c) => {
      const matchSearch =
        c.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.gstin.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBranch = branchFilter === 'ALL' || c.branch === branchFilter;
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchType = supplierTypeFilter === 'ALL' || c.supplierType === supplierTypeFilter;

      return matchSearch && matchBranch && matchStatus && matchType;
    });
  }, [creditors, searchTerm, branchFilter, statusFilter, supplierTypeFilter]);

  // Form Submit (Add or Edit)
  const handleSaveCreditor = (values: any) => {
    if (editingCreditor) {
      setCreditors((prev) =>
        prev.map((c) =>
          c.id === editingCreditor.id
            ? {
                ...c,
                supplierName: values.supplierName,
                supplierType: values.supplierType,
                contactPerson: values.contactPerson,
                phone: values.phone,
                email: values.email,
                gstin: values.gstin,
                pan: values.pan || c.pan,
                billingAddress: values.billingAddress,
                branch: values.branch,
                paymentTerms: values.paymentTerms,
                creditLimit: Number(values.creditLimit) || c.creditLimit,
                bankAccount: values.bankAccount || c.bankAccount,
              }
            : c
        )
      );
      message.success(`Supplier ${values.supplierName} updated successfully!`);
    } else {
      const newCreditor: CreditorRecord = {
        id: `CRED-${Date.now()}`,
        supplierCode: `SUPP-${Math.floor(3000 + Math.random() * 1000)}`,
        supplierName: values.supplierName,
        supplierType: values.supplierType,
        contactPerson: values.contactPerson,
        phone: values.phone,
        email: values.email,
        gstin: values.gstin,
        pan: values.pan || 'PAN-NA',
        billingAddress: values.billingAddress,
        city: values.city || 'Chennai',
        state: values.state || 'Tamil Nadu',
        branch: values.branch,
        totalPurchases: Number(values.openingBalance) || 0,
        totalPaid: 0,
        outstandingBalance: Number(values.openingBalance) || 0,
        overdueAmount: 0,
        creditLimit: Number(values.creditLimit) || 500000,
        paymentTerms: values.paymentTerms,
        creditPeriodDays: 30,
        bankAccount: values.bankAccount || 'Not specified',
        status: 'Active',
        openingBalance: Number(values.openingBalance) || 0,
      };
      setCreditors([newCreditor, ...creditors]);
      message.success(`Supplier Creditor ${newCreditor.supplierName} registered successfully!`);
    }

    setIsAddModalOpen(false);
    setEditingCreditor(null);
    form.resetFields();
  };

  const handleToggleStatus = (record: CreditorRecord) => {
    const newStatus = record.status === 'Active' ? 'Inactive' : 'Active';
    setCreditors((prev) =>
      prev.map((c) => (c.id === record.id ? { ...c, status: newStatus } : c))
    );
    message.info(`Supplier status updated to ${newStatus}`);
  };

  const openEditModal = (record: CreditorRecord) => {
    setEditingCreditor(record);
    form.setFieldsValue({
      supplierName: record.supplierName,
      supplierType: record.supplierType,
      contactPerson: record.contactPerson,
      phone: record.phone,
      email: record.email,
      gstin: record.gstin,
      pan: record.pan,
      branch: record.branch,
      paymentTerms: record.paymentTerms,
      creditLimit: record.creditLimit,
      billingAddress: record.billingAddress,
      bankAccount: record.bankAccount,
    });
    setIsAddModalOpen(true);
  };

  // Table Columns
  const columns = [
    {
      title: 'Supplier Code',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      render: (val: string, record: CreditorRecord) => (
        <a
          onClick={() => {
            setSelectedCreditor(record);
            setIsDetailDrawerOpen(true);
          }}
          style={{ fontWeight: 700, color: BRAND_PURPLE }}
        >
          {val}
        </a>
      ),
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (name: string, record: CreditorRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{record.supplierType} • {record.city}</div>
        </div>
      ),
    },
    {
      title: 'Contact Details',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      render: (cp: string, record: CreditorRecord) => (
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
      title: 'Total Purchases',
      dataIndex: 'totalPurchases',
      key: 'totalPurchases',
      align: 'right' as const,
      render: (amt: number) => (
        <span style={{ fontWeight: 600 }}>
          ₹{Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: 'Total Paid',
      dataIndex: 'totalPaid',
      key: 'totalPaid',
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
        <span style={{ fontWeight: 800, color: amt > 0 ? '#DC2626' : '#64748B' }}>
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
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => (
        <Tag color={st === 'Active' ? 'green' : 'gold'} style={{ borderRadius: 8, fontWeight: 700 }}>
          {st}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CreditorRecord) => (
        <Space size="small">
          <Tooltip title="View Account Profile">
            <Button
              type="text"
              size="small"
              icon={<Eye size={15} color={BRAND_PURPLE} />}
              onClick={() => {
                setSelectedCreditor(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{ backgroundColor: '#F3E8FF', borderRadius: 6 }}
            />
          </Tooltip>
          <Tooltip title="Edit Creditor">
            <Button
              type="text"
              size="small"
              icon={<Edit size={14} color="#1E3A8A" />}
              onClick={() => openEditModal(record)}
              style={{ backgroundColor: '#DBEAFE', borderRadius: 6 }}
            />
          </Tooltip>
          <Tooltip title={record.status === 'Active' ? 'Deactivate' : 'Activate'}>
            <Button
              type="text"
              size="small"
              icon={<Power size={14} color={record.status === 'Active' ? '#DC2626' : '#16A34A'} />}
              onClick={() => handleToggleStatus(record)}
              style={{
                backgroundColor: record.status === 'Active' ? '#FEE2E2' : '#DCFCE7',
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
      {/* 1. Header with Breadcrumb & Primary Action */}
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
            <span style={{ color: BRAND_PURPLE, fontWeight: 700 }}>Creditors</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Supplier Creditors & Accounts Payable Ledger
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Manage supplier vendor accounts, payable liabilities, credit terms, and banking disbursement instructions
          </p>
        </div>

        <Space>
          <Button
            icon={<Download size={15} />}
            onClick={() => message.success('Exporting supplier creditors directory to Excel...')}
            style={{ borderRadius: 10 }}
          >
            Export Directory
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              setEditingCreditor(null);
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
            Add Supplier Creditor
          </Button>
        </Space>
      </div>

      {/* 2. Exactly 4 Meaningful Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Card 1: Total Creditors */}
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
                <Users size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Creditors</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              {metrics.totalCount} Suppliers
            </div>
            <div style={{ fontSize: 11, color: '#5421A8', marginTop: 4, fontWeight: 700 }}>
              {metrics.withPayableCount} with active payable balances
            </div>
          </div>
        </Col>

        {/* Card 2: Active Creditors */}
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
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Active Creditors</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16A34A' }}>
              {metrics.activeCount} Accounts
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
              Active procurement credit facilities
            </div>
          </div>
        </Col>

        {/* Card 3: Total Payable */}
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
                <IndianRupee size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Total Payable</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              ₹{(metrics.totalPayable / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: 11, color: '#D97706', marginTop: 4, fontWeight: 700 }}>
              Company supplier liability
            </div>
          </div>
        </Col>

        {/* Card 4: Overdue Creditors */}
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
                <Clock size={22} />
              </div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#64748B' }}>Overdue Creditors</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#DC2626' }}>
              {metrics.overdueCount} Overdue
            </div>
            <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4, fontWeight: 700 }}>
              ₹{(metrics.overduePayables / 100000).toFixed(2)} Lakhs past due date
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Filter Section & Table */}
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
            placeholder="Search supplier name, code, contact, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />
          <Select
            value={supplierTypeFilter}
            onChange={setSupplierTypeFilter}
            style={{ width: 170 }}
            options={[
              { value: 'ALL', label: 'All Supplier Types' },
              { value: 'Manufacturer', label: 'Manufacturer' },
              { value: 'Distributor', label: 'Distributor' },
              { value: 'Wholesaler', label: 'Wholesaler' },
              { value: 'Service Provider', label: 'Service Provider' },
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
            style={{ width: 140 }}
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCreditors}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small', showTotal: (t) => `Total ${t} creditors` }}
          size="middle"
        />
      </div>

      {/* 4. Creditor Details View Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building size={18} color={BRAND_PURPLE} />
            <span>Supplier Creditor Statement — {selectedCreditor?.supplierName}</span>
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
            onClick={() => message.success(`Generating account statement for ${selectedCreditor?.supplierName}`)}
          >
            Download Statement
          </Button>
        }
      >
        {selectedCreditor && (
          <div>
            {/* Top Stat Cards */}
            <div style={{ background: '#FAF5FF', padding: '18px 20px', borderRadius: 16, marginBottom: 20 }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Supplier Code</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{selectedCreditor.supplierCode}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>GSTIN & PAN</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{selectedCreditor.gstin}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Outstanding Payable</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#DC2626' }}>
                    ₹{selectedCreditor.outstandingBalance.toLocaleString('en-IN')}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Credit Limit & Terms</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    ₹{selectedCreditor.creditLimit.toLocaleString('en-IN')} ({selectedCreditor.paymentTerms})
                  </div>
                </Col>
              </Row>
            </div>

            <Tabs
              defaultActiveKey="profile"
              items={[
                {
                  key: 'profile',
                  label: 'Supplier Profile',
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Billing & Factory Address</div>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{selectedCreditor.billingAddress}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Contact Person & Communications</div>
                        <div style={{ fontSize: 13, color: '#0F172A' }}>
                          {selectedCreditor.contactPerson} • {selectedCreditor.phone} • {selectedCreditor.email}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Preferred Banking Disbursement</div>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{selectedCreditor.bankAccount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Assigned Hub Location</div>
                        <div style={{ fontSize: 13, color: '#0F172A' }}>{selectedCreditor.branch}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'bills',
                  label: 'Supplier Bills',
                  children: (
                    <div>
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F1F5F9', textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                            <th style={{ padding: '8px 10px' }}>Bill Number</th>
                            <th style={{ padding: '8px 10px' }}>Date</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Bill Amt</th>
                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Balance</th>
                            <th style={{ padding: '8px 10px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {INITIAL_PAYABLES.filter((p) => p.supplierName === selectedCreditor.supplierName).map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: BRAND_PURPLE }}>{p.billNumber}</td>
                              <td style={{ padding: '8px 10px' }}>{p.billDate}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{p.billAmount.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                                ₹{p.outstandingBalance.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <Tag color={p.paymentStatus === 'Paid' ? 'green' : 'orange'}>{p.paymentStatus}</Tag>
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

      {/* 5. Add / Edit Creditor Structured Form Modal */}
      <Modal
        title={editingCreditor ? 'Edit Supplier Creditor' : 'Add New Supplier Creditor'}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingCreditor(null);
        }}
        footer={null}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCreditor}
          initialValues={{
            supplierType: 'Manufacturer',
            branch: 'Chennai HQ',
            paymentTerms: 'Net 30 Days',
            creditLimit: 1000000,
            openingBalance: 0,
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
          }}
        >
          {/* Section A: Supplier Information */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            A. Supplier Information
          </div>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Supplier Name" name="supplierName" rules={[{ required: true }]}>
                <Input placeholder="e.g. ABB India Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Supplier Classification" name="supplierType" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Manufacturer', label: 'Manufacturer' },
                    { value: 'Distributor', label: 'Distributor' },
                    { value: 'Wholesaler', label: 'Wholesaler' },
                    { value: 'Service Provider', label: 'Service Provider' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true }]}>
                <Input placeholder="Name of primary procurement rep" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98401 ..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Email Address" name="email">
                <Input placeholder="accounts@supplier.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website / Portal" name="website">
                <Input placeholder="www.supplier.com" />
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
                <Input placeholder="33AAACS1234D1Z5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="PAN Number" name="pan">
                <Input placeholder="AAACS1234D" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Billing & Factory Address" name="billingAddress" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider style={{ margin: '12px 0' }} />

          {/* Section C: Financial Information */}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            C. Financial & Payment Terms
          </div>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Credit Limit (₹)" name="creditLimit">
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
                <InputNumber disabled={!!editingCreditor} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Bank Account Details (for NEFT / RTGS)" name="bankAccount">
            <Input placeholder="Bank Name, Account Number, IFSC Code" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCreditor(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
              {editingCreditor ? 'Update Creditor' : 'Save Creditor'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditorsPage;
