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
  InputNumber,
  Typography,
  message,
} from 'antd';
import {
  Undo2,
  Clock,
  BadgeIndianRupee,
  TrendingDown,
  Search,
  Plus,
  Printer,
  Check,
  AlertOctagon,
} from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetDisposalRecord } from './assetsData';

const { Text, Title } = Typography;

export const AssetDisposalPage: React.FC = () => {
  const { disposals, assets, createDisposal } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filters
  const filteredDisposals = useMemo(() => {
    return disposals.filter((item) => {
      const matchSearch =
        item.disposalId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.disposalReason.toLowerCase().includes(searchText.toLowerCase());

      const matchMethod = methodFilter === 'ALL' || item.disposalMethod === methodFilter;
      const matchStatus = statusFilter === 'ALL' || item.disposalStatus === statusFilter;

      return matchSearch && matchMethod && matchStatus;
    });
  }, [disposals, searchText, methodFilter, statusFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalRequests = disposals.length;
    const pendingApprovals = disposals.filter((d) => d.approvalStatus === 'Pending Approval').length;
    const totalDisposalValue = disposals.reduce((acc, curr) => acc + curr.saleValue, 0);
    const totalLoss = disposals
      .filter((d) => d.gainOrLoss < 0)
      .reduce((acc, curr) => acc + Math.abs(curr.gainOrLoss), 0);

    return {
      totalRequests,
      pendingApprovals,
      totalDisposalValue,
      totalLoss,
    };
  }, [disposals]);

  const handleSaveDisposal = (values: any) => {
    const asset = assets.find((a) => a.assetId === values.assetId);
    if (!asset) {
      message.error('Please select an asset to dispose');
      return;
    }

    const saleValue = values.saleValue || 0;
    const disposalExpenses = values.disposalExpenses || 0;
    const netProceeds = saleValue - disposalExpenses;
    const gainOrLoss = netProceeds - asset.currentBookValue;

    createDisposal({
      assetId: asset.assetId,
      assetName: asset.assetName,
      category: asset.category,
      purchaseDate: asset.purchaseDate,
      originalCost: asset.purchaseCost,
      accumulatedDepreciation: asset.accumulatedDepreciation,
      currentBookValue: asset.currentBookValue,
      disposalDate: values.disposalDate ? values.disposalDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      disposalMethod: values.disposalMethod,
      disposalReason: values.disposalReason,
      saleValue,
      disposalExpenses,
      netProceeds,
      gainOrLoss,
      requestedBy: values.requestedBy || 'Plant Asset Custodian',
      approvedBy: 'Chief Financial Officer',
      approvalStatus: 'Approved',
      disposalStatus: 'Completed',
    });

    message.success(`Asset "${asset.assetName}" successfully retired & disposed!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const columns = [
    {
      title: 'Disposal ID',
      dataIndex: 'disposalId',
      key: 'disposalId',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Asset Name & ID',
      key: 'assetName',
      render: (_: any, r: AssetDisposalRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            ID: {r.assetId} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Original / Book Value',
      key: 'values',
      align: 'right' as const,
      render: (_: any, r: AssetDisposalRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ color: '#64748B' }}>Orig: ₹{r.originalCost.toLocaleString('en-IN')}</div>
          <div style={{ fontWeight: 700, color: '#1E293B' }}>
            NBV: ₹{r.currentBookValue.toLocaleString('en-IN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Method & Date',
      key: 'methodDate',
      render: (_: any, r: AssetDisposalRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{r.disposalMethod}</div>
          <div style={{ color: '#64748B', fontSize: 11 }}>Date: {r.disposalDate}</div>
        </div>
      ),
    },
    {
      title: 'Sale Value (₹)',
      dataIndex: 'saleValue',
      key: 'saleValue',
      align: 'right' as const,
      render: (v: number) => <span style={{ fontWeight: 700 }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Gain / Loss on Disposal',
      key: 'gainLoss',
      align: 'right' as const,
      render: (_: any, r: AssetDisposalRecord) => {
        const isGain = r.gainOrLoss >= 0;
        return (
          <span style={{ fontWeight: 800, color: isGain ? '#10B981' : '#EF4444' }}>
            {isGain ? `+₹${r.gainOrLoss.toLocaleString('en-IN')}` : `-₹${Math.abs(r.gainOrLoss).toLocaleString('en-IN')}`}
          </span>
        );
      },
    },
    {
      title: 'Disposal Status',
      dataIndex: 'disposalStatus',
      key: 'disposalStatus',
      width: 120,
      render: (status: string) => {
        const color = status === 'Completed' ? 'success' : status === 'Approved' ? 'blue' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
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
            Asset Retirement, Scrapping & Disposal
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Manage asset write-offs, e-waste scrap sales, salvage value realizations, and accounting gain/loss recognition.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Disposal Log
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Disposal Request
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
          title="Total Disposal Records"
          value={summaryMetrics.totalRequests}
          subtitle="Retired, scrapped & sold assets"
          trend={{ value: 'Audit certificates stored', isPositive: true }}
          icon={<Undo2 size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Pending Approvals"
          value={summaryMetrics.pendingApprovals}
          subtitle="Awaiting CFO write-off signoff"
          trend={{ value: 'Requires finance review', isPositive: true }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Total Disposal Proceeds"
          value={`₹${summaryMetrics.totalDisposalValue.toLocaleString('en-IN')}`}
          subtitle="Cash realized from scrap & sales"
          trend={{ value: 'Banked into current A/C', isPositive: true }}
          icon={<BadgeIndianRupee size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Total Loss on Disposal"
          value={`₹${summaryMetrics.totalLoss.toLocaleString('en-IN')}`}
          subtitle="Written off to P&L expense"
          trend={{ value: 'Obsolescence & damages', isPositive: false }}
          icon={<TrendingDown size={20} color="#EF4444" />}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search disposal ID, asset, reason..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={methodFilter} onChange={setMethodFilter}>
            <Select.Option value="ALL">All Disposal Methods</Select.Option>
            <Select.Option value="Asset Sale">Asset Sale</Select.Option>
            <Select.Option value="Scrap Sale">Scrap Sale</Select.Option>
            <Select.Option value="Write-Off">Write-Off (Damaged)</Select.Option>
            <Select.Option value="E-Waste Scrap Sale">E-Waste Disposal</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Statuses</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Pending Approval">Pending Approval</Select.Option>
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
          dataSource={filteredDisposals}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} disposals` }}
          scroll={{ x: 1150 }}
          size="middle"
        />
      </Card>

      {/* Create Disposal Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Process Asset Retirement & Disposal</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Authorize Disposal"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveDisposal}>
          <Form.Item name="assetId" label="Select Asset to Retire / Dispose" rules={[{ required: true }]}>
            <Select placeholder="Choose asset">
              {assets
                .filter((a) => a.status !== 'Disposed')
                .map((a) => (
                  <Select.Option key={a.assetId} value={a.assetId}>
                    {a.assetName} ({a.assetId}) - Book Value: ₹{a.currentBookValue.toLocaleString('en-IN')}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="disposalMethod" label="Disposal Method" rules={[{ required: true }]} initialValue="Asset Sale">
              <Select>
                <Select.Option value="Asset Sale">Asset Sale (Commercial)</Select.Option>
                <Select.Option value="Scrap Sale">Scrap Sale (Salvage)</Select.Option>
                <Select.Option value="Write-Off">Write-Off (Unrepairable Damage)</Select.Option>
                <Select.Option value="E-Waste Scrap Sale">Certified E-Waste Recycling</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="disposalDate" label="Disposal Execution Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="disposalReason" label="Reason for Disposal / Obsolescence" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Explain obsolescence, replacement, unviable repair costs..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="saleValue" label="Realized Sale / Scrap Value (₹)" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="disposalExpenses" label="Incidental Expenses (₹)" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
