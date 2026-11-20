import React, { useMemo } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Progress } from 'antd';
import {
  Boxes,
  Coins,
  BadgeIndianRupee,
  Wrench,
  Plus,
  ArrowRight,
  TrendingDown,
  Layers,
  Building,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { CompanyAsset } from './assetsData';

const { Text, Title } = Typography;

export const AssetOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { assets, maintenanceRecords, categories, transfers } = useAssetsDatabase();

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalAssets = assets.length;
    const activeAssets = assets.filter((a) => a.status === 'Active' || a.status === 'Allocated').length;
    const totalOriginalValue = assets.reduce((acc, curr) => acc + curr.purchaseCost, 0);
    const totalBookValue = assets.reduce((acc, curr) => acc + curr.currentBookValue, 0);
    const assetsInMaintenance = assets.filter((a) => a.status === 'Under Maintenance').length;

    return {
      totalAssets,
      activeAssets,
      totalOriginalValue,
      totalBookValue,
      assetsInMaintenance,
    };
  }, [assets]);

  // Category Distribution Breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; value: number }> = {};
    assets.forEach((a) => {
      if (!map[a.category]) map[a.category] = { count: 0, value: 0 };
      map[a.category].count += 1;
      map[a.category].value += a.currentBookValue;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.count,
      value: data.value,
      percentage: summaryMetrics.totalBookValue > 0 ? Math.round((data.value / summaryMetrics.totalBookValue) * 100) : 0,
    }));
  }, [assets, summaryMetrics.totalBookValue]);

  // Recent Asset Activities Columns
  const columns = [
    {
      title: 'Asset ID & Code',
      key: 'assetId',
      width: 140,
      render: (_: any, r: CompanyAsset) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.assetId}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.assetCode}</div>
        </div>
      ),
    },
    {
      title: 'Asset Name & Category',
      key: 'nameCat',
      render: (_: any, r: CompanyAsset) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.brand} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Custodian',
      key: 'custodian',
      render: (_: any, r: CompanyAsset) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12.5 }}>
            {r.assignedEmployeeName || 'Central Storage Pool'}
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.department} &bull; {r.branch}
          </div>
        </div>
      ),
    },
    {
      title: 'Original Cost (₹)',
      dataIndex: 'purchaseCost',
      key: 'purchaseCost',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Current Book Value (₹)',
      dataIndex: 'currentBookValue',
      key: 'currentBookValue',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹${v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 110,
      render: (cond: string) => {
        const color = cond === 'Brand New' || cond === 'Good' ? 'green' : cond === 'Fair' ? 'blue' : 'warning';
        return <Tag color={color}>{cond}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        const color =
          status === 'Active' || status === 'Allocated'
            ? 'success'
            : status === 'Available'
            ? 'cyan'
            : status === 'Under Maintenance'
            ? 'warning'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Header & Quick Navigation Bar */}
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
            Asset Management Overview
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Centralized enterprise registry, capital equipment tracking, depreciation valuations, and maintenance lifecycle.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Layers size={14} />}
            onClick={() => navigate('/app/assets/categories')}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Manage Categories
          </Button>
          <Button icon={<Wrench size={14} />} onClick={() => navigate('/app/assets/maintenance')}>
            Maintenance Schedules
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => navigate('/app/assets/register')}
          >
            Add New Asset
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
          title="Total Registered Assets"
          value={summaryMetrics.totalAssets}
          subtitle={`${summaryMetrics.activeAssets} operational in field/depot`}
          trend={{ value: 'Multi-branch tracked', isPositive: true }}
          icon={<Boxes size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Original Acquisition Cost"
          value={`₹${summaryMetrics.totalOriginalValue.toLocaleString('en-IN')}`}
          subtitle="Historic asset procurement cost"
          trend={{ value: 'Capitalized gross book cost', isPositive: true }}
          icon={<Coins size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Current Book Value (NBV)"
          value={`₹${summaryMetrics.totalBookValue.toLocaleString('en-IN')}`}
          subtitle="Net value after depreciation"
          trend={{ value: 'Straight-line & WDV calculated', isPositive: true }}
          icon={<BadgeIndianRupee size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Assets Under Maintenance"
          value={summaryMetrics.assetsInMaintenance}
          subtitle="Currently scheduled or undergoing repair"
          trend={{ value: 'Vendor & internal repairs', isPositive: false }}
          icon={<Wrench size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Visual Analytics: Category & Location Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card
          bordered
          title={<span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 14 }}>Asset Book Value by Category</span>}
          style={{ borderRadius: 14, border: '1px solid #E2E8F0' }}
          styles={{ body: { padding: '16px 20px' } }}
        >
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{cat.name} ({cat.count} units)</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A' }}>₹{cat.value.toLocaleString('en-IN')} ({cat.percentage}%)</span>
              </div>
              <Progress percent={cat.percentage} showInfo={false} strokeColor="#4F46E5" />
            </div>
          ))}
        </Card>

        <Card
          bordered
          title={<span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 14 }}>Operational Asset Health & Status</span>}
          style={{ borderRadius: 14, border: '1px solid #E2E8F0' }}
          styles={{ body: { padding: '16px 20px' } }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#F0FDF4', padding: '12px 14px', borderRadius: 8, border: '1px solid #BBF7D0' }}>
              <div style={{ color: '#166534', fontSize: 12, fontWeight: 700 }}>Allocated & Active</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#15803D', marginTop: 4 }}>
                {assets.filter((a) => a.status === 'Allocated' || a.status === 'Active').length}
              </div>
              <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>In active operational use</div>
            </div>

            <div style={{ background: '#F0FDFA', padding: '12px 14px', borderRadius: 8, border: '1px solid #99F6E4' }}>
              <div style={{ color: '#0F766E', fontSize: 12, fontWeight: 700 }}>Available Pool</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0D9488', marginTop: 4 }}>
                {assets.filter((a) => a.status === 'Available').length}
              </div>
              <div style={{ fontSize: 11, color: '#0F766E', marginTop: 2 }}>Ready for immediate allocation</div>
            </div>

            <div style={{ background: '#FFFBEB', padding: '12px 14px', borderRadius: 8, border: '1px solid #FDE68A' }}>
              <div style={{ color: '#92400E', fontSize: 12, fontWeight: 700 }}>Under Maintenance</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#B45309', marginTop: 4 }}>
                {summaryMetrics.assetsInMaintenance}
              </div>
              <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>In-house or OEM workshop</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#475569', fontSize: 12, fontWeight: 700 }}>Completed Transfers</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', marginTop: 4 }}>
                {transfers.filter((t) => t.transferStatus === 'Completed').length}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Inter-branch reallocations</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Assets Registered Table */}
      <Card
        bordered
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 15 }}>
              Recently Registered Capital Assets
            </span>
            <Button
              type="link"
              onClick={() => navigate('/app/assets/register')}
              style={{ fontWeight: 700, color: '#4F46E5', padding: 0 }}
            >
              View Full Register <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
            </Button>
          </div>
        }
        style={{
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={assets.slice(0, 5)}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1050 }}
          size="middle"
        />
      </Card>
    </div>
  );
};
