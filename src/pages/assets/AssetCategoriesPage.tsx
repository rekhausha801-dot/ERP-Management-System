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
  InputNumber,
  Typography,
  message,
} from 'antd';
import {
  Layers,
  CheckCircle,
  Coins,
  BadgePercent,
  Search,
  Plus,
  Download,
  Printer,
  Edit,
  Eye,
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetCategory } from './assetsData';

const { Text, Title } = Typography;

export const AssetCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Filters
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchSearch =
        c.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.categoryCode.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [categories, searchText, statusFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalCategories = filteredCategories.length;
    const activeCategories = filteredCategories.filter((c) => c.status === 'Active').length;
    const totalCategorizedAssets = filteredCategories.reduce((acc, curr) => acc + curr.totalAssets, 0);
    const totalCategoryValue = filteredCategories.reduce((acc, curr) => acc + curr.totalPurchaseValue, 0);

    return {
      totalCategories,
      activeCategories,
      totalCategorizedAssets,
      totalCategoryValue,
    };
  }, [filteredCategories]);

  const handleSaveCategory = (values: any) => {
    const code = 'CAT-' + values.categoryName.slice(0, 3).toUpperCase() + '-' + Math.floor(10 + Math.random() * 90);
    addCategory({
      categoryCode: code,
      categoryName: values.categoryName,
      description: values.description || '',
      totalAssets: 0,
      totalPurchaseValue: 0,
      defaultDepreciationMethod: values.defaultDepreciationMethod || 'Straight Line',
      defaultUsefulLifeYears: values.defaultUsefulLifeYears || 5,
      defaultDepreciationRate: values.defaultDepreciationRate || 20,
      assetLedgerAccount: `ACC-AST-${values.categoryName.slice(0, 4).toUpperCase()}`,
      status: 'Active',
    });
    message.success(`Asset Category "${values.categoryName}" created successfully!`);
    form.resetFields();
    setAddModalOpen(false);
  };

  const columns = [
    {
      title: 'Category Code & ID',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Category Name',
      key: 'nameDesc',
      render: (_: any, r: AssetCategory) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{r.categoryName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.description}</div>
        </div>
      ),
    },
    {
      title: 'Total Assets',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 110,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontWeight: 800, fontSize: 14, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Cumulative Value (₹)',
      dataIndex: 'totalPurchaseValue',
      key: 'totalPurchaseValue',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: '#0F172A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Depreciation Method',
      key: 'depr',
      render: (_: any, r: AssetCategory) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>{r.defaultDepreciationMethod}</div>
          <div style={{ color: '#64748B', fontSize: 11 }}>
            {r.defaultDepreciationRate}% p.a. &bull; {r.defaultUsefulLifeYears} yrs
          </div>
        </div>
      ),
    },
    {
      title: 'Ledger Mapping',
      dataIndex: 'assetLedgerAccount',
      key: 'assetLedgerAccount',
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: string) => <Tag color={v === 'Active' ? 'green' : 'default'}>{v}</Tag>,
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
            Asset Categories & Depreciation Rules
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Organize company fixed assets into classes, configure default useful lives, depreciation methods, and GL mappings.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Categories
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setAddModalOpen(true)}
          >
            Add Category
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
          title="Total Asset Categories"
          value={summaryMetrics.totalCategories}
          subtitle="Fixed asset classes registered"
          trend={{ value: 'Accounting mapped', isPositive: true }}
          icon={<Layers size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Active Operational Categories"
          value={summaryMetrics.activeCategories}
          subtitle="Categories open for asset addition"
          trend={{ value: '100% active status', isPositive: true }}
          icon={<CheckCircle size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Total Assets Categorized"
          value={summaryMetrics.totalCategorizedAssets}
          subtitle="Assigned asset volume"
          trend={{ value: 'Across IT, plant, fleet', isPositive: true }}
          icon={<Coins size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Total Category Gross Value"
          value={`₹${summaryMetrics.totalCategoryValue.toLocaleString('en-IN')}`}
          subtitle="Combined historic asset cost"
          trend={{ value: 'Depreciated per rules', isPositive: true }}
          icon={<BadgePercent size={20} color="#EA580C" />}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search category code, title, specs..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Statuses</Select.Option>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Categories Table */}
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
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1050 }}
          size="middle"
        />
      </Card>

      {/* Add Category Modal */}
      <Modal
        open={addModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create Asset Classification Category</span>
          </div>
        }
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create Category"
        cancelText="Cancel"
        width={580}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCategory}>
          <Form.Item name="categoryName" label="Category Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Laboratory & Testing Equipment" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Brief summary of assets encompassed by this category" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="defaultDepreciationMethod" label="Depreciation Method" initialValue="Straight Line">
              <Select>
                <Select.Option value="Straight Line">Straight Line Method (SLM)</Select.Option>
                <Select.Option value="Written Down Value">Written Down Value (WDV)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="defaultUsefulLifeYears" label="Default Useful Life (Years)" initialValue={5}>
              <InputNumber style={{ width: '100%' }} min={1} max={30} />
            </Form.Item>
          </div>

          <Form.Item name="defaultDepreciationRate" label="Default Depreciation Rate (% p.a.)" initialValue={20}>
            <InputNumber style={{ width: '100%' }} min={1} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
