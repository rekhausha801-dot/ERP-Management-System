import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  Typography,
  message,
} from 'antd';
import {
  Truck,
  Clock,
  CheckCircle2,
  Navigation,
  Search,
  Plus,
  Printer,
  Check,
  Eye,
  Layers,
} from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetTransferRecord } from './assetsData';

const { Text, Title } = Typography;

export const AssetTransfersPage: React.FC = () => {
  const { transfers, assets, createTransfer, completeTransfer } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromBranchFilter, setFromBranchFilter] = useState('ALL');
  const [toBranchFilter, setToBranchFilter] = useState('ALL');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filters
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchSearch =
        t.transferId.toLowerCase().includes(searchText.toLowerCase()) ||
        t.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        t.transferReason.toLowerCase().includes(searchText.toLowerCase()) ||
        t.requestedBy.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || t.transferStatus === statusFilter;
      const matchFrom = fromBranchFilter === 'ALL' || t.fromBranch === fromBranchFilter;
      const matchTo = toBranchFilter === 'ALL' || t.toBranch === toBranchFilter;

      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [transfers, searchText, statusFilter, fromBranchFilter, toBranchFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalTransfers = transfers.length;
    const pendingApprovals = transfers.filter((t) => t.approvalStatus === 'Pending Approval').length;
    const completedTransfers = transfers.filter((t) => t.transferStatus === 'Completed').length;
    const inTransit = transfers.filter((t) => t.transferStatus === 'In Transit').length;

    return {
      totalTransfers,
      pendingApprovals,
      completedTransfers,
      inTransit,
    };
  }, [transfers]);

  const handleSaveTransfer = (values: any) => {
    const asset = assets.find((a) => a.assetId === values.assetId);
    if (!asset) {
      message.error('Please select an asset to transfer');
      return;
    }

    createTransfer({
      assetId: asset.assetId,
      assetName: asset.assetName,
      category: asset.category,
      transferType: values.transferType || 'Branch to Branch',
      fromBranch: asset.branch,
      toBranch: values.toBranch,
      fromDepartment: asset.department,
      toDepartment: values.toDepartment || asset.department,
      fromEmployee: asset.assignedEmployeeName,
      toEmployee: values.toEmployee,
      fromLocation: asset.room,
      toLocation: values.toLocation || 'General Storage',
      requestDate: dayjs().format('YYYY-MM-DD'),
      transferDate: values.transferDate ? values.transferDate.format('YYYY-MM-DD') : dayjs().add(2, 'day').format('YYYY-MM-DD'),
      requestedBy: values.requestedBy || 'Store Custodian',
      approvedBy: 'Operations Director',
      transferReason: values.transferReason,
      approvalStatus: 'Approved',
      transferStatus: 'Completed',
    });

    message.success(`Transfer initiated for asset "${asset.assetName}"!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Transfer ID',
      dataIndex: 'transferId',
      key: 'transferId',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Asset Name & ID',
      key: 'assetName',
      render: (_: any, r: AssetTransferRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            ID: {r.assetId} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Origin -> Destination',
      key: 'route',
      render: (_: any, r: AssetTransferRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#475569' }}>
            From: {r.fromBranch} ({r.fromDepartment})
          </div>
          <div style={{ fontWeight: 700, color: '#1E3A8A', marginTop: 2 }}>
            To: {r.toBranch} ({r.toDepartment})
          </div>
        </div>
      ),
    },
    {
      title: 'Dates',
      key: 'dates',
      width: 150,
      render: (_: any, r: AssetTransferRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Req: {r.requestDate}</div>
          <div style={{ color: '#0F766E', fontWeight: 600 }}>Date: {r.transferDate}</div>
        </div>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'transferReason',
      key: 'transferReason',
      render: (v: string) => (
        <span style={{ fontSize: 12, color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'transferStatus',
      key: 'transferStatus',
      width: 120,
      render: (status: string) => {
        const color =
          status === 'Completed'
            ? 'success'
            : status === 'In Transit'
            ? 'processing'
            : status === 'Pending Approval'
            ? 'warning'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: AssetTransferRecord) => (
        <Space size="small">
          {r.transferStatus !== 'Completed' && (
            <Button
              size="small"
              type="primary"
              style={{ background: '#0D9488', border: 'none', fontSize: 11 }}
              onClick={() => {
                completeTransfer(r.transferId);
                message.success(`Transfer ${r.transferId} marked as completed and verified!`);
              }}
            >
              Confirm Receipt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Title & Action Bar */}
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
          <Title level={3} style={{ margin: 0, color: '#1E3A8A', fontWeight: 800 }}>
            Asset Transfers & Relocations
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Manage asset movement between branches, departments, warehouses, and project sites with authorization audits.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Transfer Log
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Initiate Transfer
          </Button>
        </Space>
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
          title="Total Transfer Requests"
          value={summaryMetrics.totalTransfers}
          subtitle="Inter-branch & department moves"
          trend={{ value: 'Multi-location network', isPositive: true }}
          icon={<Truck size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Pending Approvals"
          value={summaryMetrics.pendingApprovals}
          subtitle="Waiting for manager authorization"
          trend={{ value: 'Authorizations required', isPositive: true }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Completed Transfers"
          value={summaryMetrics.completedTransfers}
          subtitle="Successfully delivered & verified"
          trend={{ value: '100% receipt verified', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="In-Transit Assets"
          value={summaryMetrics.inTransit}
          subtitle="En route via logistics courier"
          trend={{ value: 'Tracking numbers active', isPositive: true }}
          icon={<Navigation size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
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
            placeholder="Search transfer ID, asset, reason..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Transfer Statuses</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="In Transit">In Transit</Select.Option>
            <Select.Option value="Pending Approval">Pending Approval</Select.Option>
          </Select>

          <Select value={fromBranchFilter} onChange={setFromBranchFilter}>
            <Select.Option value="ALL">All Origin Branches</Select.Option>
            <Select.Option value="Chennai HQ">From: Chennai HQ</Select.Option>
            <Select.Option value="Coimbatore Plant">From: Coimbatore Plant</Select.Option>
            <Select.Option value="Bengaluru Tech Park">From: Bengaluru Tech Park</Select.Option>
          </Select>

          <Select value={toBranchFilter} onChange={setToBranchFilter}>
            <Select.Option value="ALL">All Destination Branches</Select.Option>
            <Select.Option value="Chennai HQ">To: Chennai HQ</Select.Option>
            <Select.Option value="Bengaluru Tech Park">To: Bengaluru Tech Park</Select.Option>
            <Select.Option value="Hosur Hub">To: Hosur Hub</Select.Option>
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
          dataSource={filteredTransfers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} transfers` }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* Initiate Transfer Form Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Initiate Asset Movement & Relocation</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Authorize & Dispatch"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveTransfer}>
          <Form.Item name="assetId" label="Select Asset to Move" rules={[{ required: true }]}>
            <Select placeholder="Select registered asset">
              {assets.map((a) => (
                <Select.Option key={a.assetId} value={a.assetId}>
                  {a.assetName} ({a.assetId}) - Currently in: {a.branch} ({a.department})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="transferType" label="Transfer Scope" initialValue="Branch to Branch">
              <Select>
                <Select.Option value="Branch to Branch">Branch to Branch</Select.Option>
                <Select.Option value="Department to Department">Department to Department</Select.Option>
                <Select.Option value="Employee to Employee">Employee to Employee</Select.Option>
                <Select.Option value="Location to Location">Warehouse Relocation</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="toBranch" label="Target Destination Branch" rules={[{ required: true }]}>
              <Select placeholder="Select destination">
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
                <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="toDepartment" label="Target Department" initialValue="Production & Manufacturing">
              <Select>
                <Select.Option value="Production & Manufacturing">Production</Select.Option>
                <Select.Option value="Warehouse & Logistics">Warehouse</Select.Option>
                <Select.Option value="Field Engineering & Service">Field Engineering</Select.Option>
                <Select.Option value="Sales & Business Dev">Sales</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="toLocation" label="Target Bay / Room" initialValue="Bay 02 Storage">
              <Input placeholder="e.g. Bay 02, Server Rack 4" />
            </Form.Item>
          </div>

          <Form.Item name="transferReason" label="Business Reason for Movement" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Explain operational necessity, contract allocation, capacity balancing..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="transferDate" label="Scheduled Transfer Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="requestedBy" label="Requested By Custodian" initialValue="Store Supervisor">
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
