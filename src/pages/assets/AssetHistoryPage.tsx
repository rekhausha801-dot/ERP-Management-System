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
  Typography,
} from 'antd';
import {
  History,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Printer,
  Eye,
  Layers,
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetHistoryRecord } from './assetsData';

const { Text, Title } = Typography;

export const AssetHistoryPage: React.FC = () => {
  const { historyRecords } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [activityFilter, setActivityFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AssetHistoryRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Filters
  const filteredHistory = useMemo(() => {
    return historyRecords.filter((item) => {
      const matchSearch =
        item.historyId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.performedBy.toLowerCase().includes(searchText.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchText.toLowerCase());

      const matchAct = activityFilter === 'ALL' || item.activityType === activityFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;

      return matchSearch && matchAct && matchBranch;
    });
  }, [historyRecords, searchText, activityFilter, branchFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalActivities = historyRecords.length;
    const recentActivities = historyRecords.slice(0, 5).length;
    const allocationEvents = historyRecords.filter(
      (h) => h.activityType === 'Asset Allocated' || h.activityType === 'Asset Returned'
    ).length;
    const maintenanceEvents = historyRecords.filter(
      (h) => h.activityType === 'Maintenance Requested' || h.activityType === 'Maintenance Completed'
    ).length;

    return {
      totalActivities,
      recentActivities,
      allocationEvents,
      maintenanceEvents,
    };
  }, [historyRecords]);

  const columns = [
    {
      title: 'Audit ID & Date',
      key: 'auditId',
      width: 140,
      render: (_: any, r: AssetHistoryRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.historyId}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.activityDate}</div>
        </div>
      ),
    },
    {
      title: 'Asset ID & Name',
      key: 'assetName',
      render: (_: any, r: AssetHistoryRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Asset ID: {r.assetId}</div>
        </div>
      ),
    },
    {
      title: 'Activity Event',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 170,
      render: (v: string) => {
        const color =
          v === 'Asset Created' || v === 'Asset Purchased'
            ? 'cyan'
            : v === 'Asset Allocated'
            ? 'blue'
            : v === 'Asset Returned'
            ? 'geekblue'
            : v === 'Maintenance Completed'
            ? 'green'
            : v === 'Asset Disposed'
            ? 'red'
            : 'purple';
        return <Tag color={color} style={{ fontWeight: 600 }}>{v}</Tag>;
      },
    },
    {
      title: 'Audit Transition (Before -> After)',
      key: 'transition',
      render: (_: any, r: AssetHistoryRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ color: '#64748B' }}>Prev: {r.previousValue}</div>
          <div style={{ fontWeight: 600, color: '#1E293B', marginTop: 2 }}>
            Now: {r.updatedValue}
          </div>
        </div>
      ),
    },
    {
      title: 'Performed By & Branch',
      key: 'performed',
      render: (_: any, r: AssetHistoryRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.performedBy}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.department} &bull; {r.branch}
          </div>
        </div>
      ),
    },
    {
      title: 'Remarks / Ref #',
      key: 'remarks',
      render: (_: any, r: AssetHistoryRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ color: '#334155' }}>{r.remarks}</div>
          <div style={{ fontSize: 11, color: '#0F766E', fontWeight: 600 }}>Ref: {r.referenceNumber}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: AssetHistoryRecord) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="View Complete Audit Log"
          onClick={() => {
            setSelectedRecord(r);
            setDetailModalOpen(true);
          }}
        />
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
            Asset Activity & Audit Trail History
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Immutable chronological timeline of all asset purchases, allocations, physical transfers, service jobs, and write-offs.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Audit Log
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
          title="Total Recorded Activities"
          value={summaryMetrics.totalActivities}
          subtitle="System lifecycle audit logs"
          trend={{ value: 'Full audit verification', isPositive: true }}
          icon={<History size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Recent Asset Transactions"
          value={summaryMetrics.recentActivities}
          subtitle="Changes in current month"
          trend={{ value: 'Real-time ledger events', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Allocation / Return Events"
          value={summaryMetrics.allocationEvents}
          subtitle="Custodian custody handovers"
          trend={{ value: 'Verified with signatures', isPositive: true }}
          icon={<CheckCircle size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Maintenance Service Events"
          value={summaryMetrics.maintenanceEvents}
          subtitle="Inspections & repair events"
          trend={{ value: 'Service invoices filed', isPositive: true }}
          icon={<FileText size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
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
            placeholder="Search audit ID, asset, staff..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={activityFilter} onChange={setActivityFilter}>
            <Select.Option value="ALL">All Activity Types</Select.Option>
            <Select.Option value="Asset Created">Asset Created</Select.Option>
            <Select.Option value="Asset Allocated">Asset Allocated</Select.Option>
            <Select.Option value="Asset Returned">Asset Returned</Select.Option>
            <Select.Option value="Asset Transferred">Asset Transferred</Select.Option>
            <Select.Option value="Maintenance Requested">Maintenance Requested</Select.Option>
            <Select.Option value="Maintenance Completed">Maintenance Completed</Select.Option>
            <Select.Option value="Asset Disposed">Asset Disposed</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
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
          dataSource={filteredHistory}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} audit records` }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Audit Trail Event - {selectedRecord?.historyId}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={580}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 15 }}>{selectedRecord.assetName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Asset ID: {selectedRecord.assetId} &bull; Date: {selectedRecord.activityDate}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Action Event:</span>
                <span style={{ fontWeight: 700 }}>{selectedRecord.activityType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Performed By:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.performedBy} ({selectedRecord.department})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Reference Number:</span>
                <span style={{ fontWeight: 600, color: '#0F766E' }}>{selectedRecord.referenceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Previous State:</span>
                <span style={{ color: '#EF4444' }}>{selectedRecord.previousValue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>New State:</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>{selectedRecord.updatedValue}</span>
              </div>
              <div style={{ padding: '8px 0 0' }}>
                <span style={{ color: '#64748B', display: 'block', marginBottom: 2 }}>Remarks / Notes:</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{selectedRecord.remarks}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
