import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Typography, message, Tabs } from 'antd';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Search, Filter, Layers, Eye, Check } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface ApprovalRequest {
  id: string;
  requestId: string;
  module: 'Quotation' | 'Sales Order' | 'Purchase Order' | 'Credit Limit' | 'Expense' | 'Leave' | 'Service Order';
  referenceNumber: string;
  initiatorName: string;
  department: string;
  branch: string;
  amountOrDetails: string;
  submittedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approverRemarks?: string;
}

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APP-01',
    requestId: 'REQ-2026-901',
    module: 'Quotation',
    referenceNumber: 'QT-2026-104',
    initiatorName: 'Priya Sharma',
    department: 'Sales & Business Dev',
    branch: 'Chennai HQ',
    amountOrDetails: 'Special 14% Trade Discount (₹48,500 concession)',
    submittedDate: '2026-11-19',
    priority: 'High',
    approvalStatus: 'Pending',
  },
  {
    id: 'APP-02',
    requestId: 'REQ-2026-902',
    module: 'Purchase Order',
    referenceNumber: 'PO-2026-062',
    initiatorName: 'Muruganandham V',
    department: 'Procurement',
    branch: 'Chennai HQ',
    amountOrDetails: 'Siemens Automation Components (₹6,13,600)',
    submittedDate: '2026-11-18',
    priority: 'High',
    approvalStatus: 'Pending',
  },
  {
    id: 'APP-03',
    requestId: 'REQ-2026-903',
    module: 'Credit Limit',
    referenceNumber: 'CUST-1005',
    initiatorName: 'Ramesh Sundaram',
    department: 'Finance',
    branch: 'Bengaluru Tech Park',
    amountOrDetails: 'Increase credit limit from ₹2,00,000 to ₹5,00,000 for Apex Precision',
    submittedDate: '2026-11-17',
    priority: 'Medium',
    approvalStatus: 'Pending',
  },
  {
    id: 'APP-04',
    requestId: 'REQ-2026-904',
    module: 'Expense',
    referenceNumber: 'EXP-NOV-114',
    initiatorName: 'Karthik Raja',
    department: 'Field Engineering',
    branch: 'Coimbatore Plant',
    amountOrDetails: 'On-site breakdown travel & client emergency tooling (₹14,200)',
    submittedDate: '2026-11-16',
    priority: 'Low',
    approvalStatus: 'Approved',
  },
  {
    id: 'APP-05',
    requestId: 'REQ-2026-905',
    module: 'Leave',
    referenceNumber: 'LEV-2026-08',
    initiatorName: 'Ananya Roy',
    department: 'Quality & Metrology',
    branch: 'Chennai HQ',
    amountOrDetails: 'Casual Leave (3 Days) from 2026-11-24 to 2026-11-26',
    submittedDate: '2026-11-15',
    priority: 'Low',
    approvalStatus: 'Approved',
  },
];

export const ApprovalManagementPage: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const raw = localStorage.getItem('erp_approval_requests');
    return raw ? JSON.parse(raw) : INITIAL_APPROVALS;
  });
  const [searchText, setSearchText] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredData = useMemo(() => {
    return approvals.filter((item) => {
      const matchSearch =
        item.requestId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.initiatorName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.amountOrDetails.toLowerCase().includes(searchText.toLowerCase());

      const matchMod = moduleFilter === 'ALL' || item.module === moduleFilter;
      const matchStatus = statusFilter === 'ALL' || item.approvalStatus === statusFilter;
      const matchPrio = priorityFilter === 'ALL' || item.priority === priorityFilter;

      return matchSearch && matchMod && matchStatus && matchPrio;
    });
  }, [approvals, searchText, moduleFilter, statusFilter, priorityFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalRequests = approvals.length;
    const pendingApprovals = approvals.filter((a) => a.approvalStatus === 'Pending').length;
    const approvedRequests = approvals.filter((a) => a.approvalStatus === 'Approved').length;
    const highPriorityPending = approvals.filter((a) => a.approvalStatus === 'Pending' && a.priority === 'High').length;

    return {
      totalRequests,
      pendingApprovals,
      approvedRequests,
      highPriorityPending,
    };
  }, [approvals]);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    const updated = approvals.map((a) => (a.id === id ? { ...a, approvalStatus: action } : a));
    setApprovals(updated);
    localStorage.setItem('erp_approval_requests', JSON.stringify(updated));
    message.success(`Request ${action === 'Approved' ? 'approved and authorized' : 'rejected'} successfully!`);
  };

  const columns = [
    {
      title: 'Request ID & Module',
      key: 'reqMod',
      width: 160,
      render: (_: any, r: ApprovalRequest) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.requestId}</div>
          <Tag color="purple" style={{ marginTop: 2, fontSize: 10.5 }}>{r.module}</Tag>
        </div>
      ),
    },
    {
      title: 'Target Reference',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{v}</span>,
    },
    {
      title: 'Request Scope & Details',
      dataIndex: 'amountOrDetails',
      key: 'amountOrDetails',
      render: (v: string) => <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1E293B' }}>{v}</span>,
    },
    {
      title: 'Initiator & Department',
      key: 'initiator',
      render: (_: any, r: ApprovalRequest) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.initiatorName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.department} &bull; {r.branch}</div>
        </div>
      ),
    },
    {
      title: 'Date Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 120,
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: string) => {
        const color = p === 'High' ? 'red' : p === 'Medium' ? 'gold' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (status: string) => {
        const color = status === 'Approved' ? 'success' : status === 'Pending' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      align: 'center' as const,
      render: (_: any, r: ApprovalRequest) => (
        <Space size="small">
          {r.approvalStatus === 'Pending' ? (
            <>
              <Button
                size="small"
                type="primary"
                style={{ background: '#10B981', border: 'none', fontSize: 11 }}
                onClick={() => handleAction(r.id, 'Approved')}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                style={{ fontSize: 11 }}
                onClick={() => handleAction(r.id, 'Rejected')}
              >
                Reject
              </Button>
            </>
          ) : (
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Decision Recorded</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Title Bar */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, color: '#1E3A8A', fontWeight: 800 }}>
          Enterprise Approval Workflows
        </Title>
        <Text style={{ color: '#64748B', fontSize: 13 }}>
          Centralized authorization desk for sales quotations, purchase orders, credit limits, operational expenses, and leaves.
        </Text>
      </div>

      {/* Exactly 4 Meaningful Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Total Approval Requests"
          value={summaryMetrics.totalRequests}
          subtitle="Cross-module authorizations"
          trend={{ value: 'Multi-level approval chains', isPositive: true }}
          icon={<ShieldCheck size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Pending Queue"
          value={summaryMetrics.pendingApprovals}
          subtitle="Waiting for manager review"
          trend={{ value: 'Decision SLA: < 24 hrs', isPositive: false }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Approved Requests"
          value={summaryMetrics.approvedRequests}
          subtitle="Authorized & released to execution"
          trend={{ value: 'Signatures captured', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="High Priority Escalations"
          value={summaryMetrics.highPriorityPending}
          subtitle="High value deals or contracts"
          trend={{ value: 'Requires immediate action', isPositive: false }}
          icon={<XCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
      </div>

      {/* Filter Toolbar */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
        styles={{ body: { padding: '14px 18px' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search request ID, ref #, initiator..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={moduleFilter} onChange={setModuleFilter}>
            <Select.Option value="ALL">All Modules</Select.Option>
            <Select.Option value="Quotation">Quotation (Discounts)</Select.Option>
            <Select.Option value="Purchase Order">Purchase Orders</Select.Option>
            <Select.Option value="Credit Limit">Credit Limits</Select.Option>
            <Select.Option value="Expense">Expenses</Select.Option>
            <Select.Option value="Leave">Employee Leaves</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Statuses</Select.Option>
            <Select.Option value="Pending">Pending Review</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
          </Select>

          <Select value={priorityFilter} onChange={setPriorityFilter}>
            <Select.Option value="ALL">All Priorities</Select.Option>
            <Select.Option value="High">High Priority</Select.Option>
            <Select.Option value="Medium">Medium Priority</Select.Option>
            <Select.Option value="Low">Low Priority</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} requests` }}
          scroll={{ x: 1150 }}
          size="middle"
        />
      </Card>
    </div>
  );
};
