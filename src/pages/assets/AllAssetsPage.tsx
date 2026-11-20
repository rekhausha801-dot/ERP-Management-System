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
  DatePicker,
  Typography,
  message,
  Tabs,
} from 'antd';
import {
  Boxes,
  CheckCircle,
  PackageCheck,
  Coins,
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  Edit,
  QrCode,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { CompanyAsset } from './assetsData';

const { Text, Title } = Typography;

export const AllAssetsPage: React.FC = () => {
  const { assets, addAsset, updateAsset } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState('ALL');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CompanyAsset | null>(null);

  const [form] = Form.useForm();

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      const matchSearch =
        item.assetId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchText.toLowerCase());

      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      const matchCond = conditionFilter === 'ALL' || item.condition === conditionFilter;

      return matchSearch && matchCat && matchStatus && matchBranch && matchCond;
    });
  }, [assets, searchText, categoryFilter, statusFilter, branchFilter, conditionFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalAssets = filteredAssets.length;
    const activeAssets = filteredAssets.filter((a) => a.status === 'Active' || a.status === 'Allocated').length;
    const availableAssets = filteredAssets.filter((a) => a.status === 'Available').length;
    const totalPurchaseValue = filteredAssets.reduce((acc, curr) => acc + curr.purchaseCost, 0);

    return {
      totalAssets,
      activeAssets,
      availableAssets,
      totalPurchaseValue,
    };
  }, [filteredAssets]);

  const handleSaveAsset = (values: any) => {
    const purchaseCost = values.purchaseCost || 0;
    const gstAmount = Math.round(purchaseCost * 0.18);
    const totalAcquisitionCost = purchaseCost + gstAmount + (values.additionalCharges || 0);
    const usefulLifeYears = values.usefulLifeYears || 5;
    const salvageValue = values.salvageValue || 0;
    const annualDepr = (purchaseCost - salvageValue) / usefulLifeYears;
    const accumulatedDepreciation = Math.round(annualDepr * 0.5); // Initial partial year
    const currentBookValue = Math.max(0, purchaseCost - accumulatedDepreciation);

    const assetId = 'AST-2026-' + Math.floor(100 + Math.random() * 900);
    const assetCode = (values.category?.slice(0, 3).toUpperCase() || 'AST') + '-' + Math.floor(100 + Math.random() * 900);

    addAsset({
      assetId,
      assetCode,
      assetName: values.assetName,
      category: values.category,
      subcategory: values.subcategory || 'General Equipment',
      description: values.description || '',
      brand: values.brand,
      modelNumber: values.modelNumber || 'N/A',
      serialNumber: values.serialNumber,
      barcode: 'BC-' + values.serialNumber,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      purchaseOrderNumber: values.purchaseOrderNumber || 'PO-MANUAL',
      supplierName: values.supplierName || 'Authorized Vendor',
      supplierInvoiceNumber: values.supplierInvoiceNumber || 'INV-MANUAL',
      purchaseCost,
      gstAmount,
      additionalCharges: values.additionalCharges || 0,
      totalAcquisitionCost,
      warrantyExpiryDate: values.warrantyExpiryDate ? values.warrantyExpiryDate.format('YYYY-MM-DD') : '2028-01-01',
      capitalizationDate: dayjs().format('YYYY-MM-DD'),
      usefulLifeYears,
      depreciationMethod: values.depreciationMethod || 'Straight Line',
      depreciationRate: Math.round((100 / usefulLifeYears) * 100) / 100,
      salvageValue,
      accumulatedDepreciation,
      currentBookValue,
      assetLedgerAccount: 'ACC-AST-1000 (Fixed Assets General)',
      branch: values.branch,
      department: values.department,
      building: values.building || 'Main Building',
      floor: values.floor || 'Ground',
      room: values.room || 'General Storage',
      condition: values.condition || 'Brand New',
      status: 'Available',
    });

    message.success(`Asset "${values.assetName}" successfully registered with ID ${assetId}!`);
    form.resetFields();
    setAddModalOpen(false);
  };

  const handleExport = (type: string) => {
    message.success(`Exporting All Assets Register to ${type.toUpperCase()}...`);
  };

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
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 150,
      render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{v}</span>,
    },
    {
      title: 'Location & Branch',
      key: 'loc',
      render: (_: any, r: CompanyAsset) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.branch}</div>
          <div style={{ color: '#64748B', fontSize: 11 }}>{r.room} ({r.department})</div>
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
      title: 'Book Value (₹)',
      dataIndex: 'currentBookValue',
      key: 'currentBookValue',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
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
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      align: 'center' as const,
      render: (_: any, r: CompanyAsset) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={15} color="#4F46E5" />}
            title="View Complete Asset Dossier"
            onClick={() => {
              setSelectedAsset(r);
              setDetailModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<QrCode size={15} color="#0D9488" />}
            title="Generate QR / Barcode Tag"
            onClick={() => {
              setSelectedAsset(r);
              setQrModalOpen(true);
            }}
          />
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
            Enterprise Asset Register (All Assets)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Complete master records of company-owned machinery, IT systems, vehicles, equipment, and office fixtures.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Register
          </Button>
          <Button icon={<Download size={14} />} onClick={() => handleExport('excel')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setAddModalOpen(true)}
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
          subtitle="Fixed assets entered in ledger"
          trend={{ value: 'Multi-branch tracked', isPositive: true }}
          icon={<Boxes size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Active Operational Assets"
          value={summaryMetrics.activeAssets}
          subtitle="Currently deployed & allocated"
          trend={{ value: 'High utilization rate', isPositive: true }}
          icon={<CheckCircle size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Available in Storage Pool"
          value={summaryMetrics.availableAssets}
          subtitle="Unallocated assets ready for use"
          trend={{ value: 'Ready for quick issue', isPositive: true }}
          icon={<PackageCheck size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Total Original Asset Cost"
          value={`₹${summaryMetrics.totalPurchaseValue.toLocaleString('en-IN')}`}
          subtitle="Historic purchase valuation"
          trend={{ value: 'Capitalized procurement cost', isPositive: true }}
          icon={<Coins size={20} color="#EA580C" />}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search ID, name, SKU, serial..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={categoryFilter} onChange={setCategoryFilter}>
            <Select.Option value="ALL">All Categories</Select.Option>
            <Select.Option value="Plant & Machinery">Plant & Machinery</Select.Option>
            <Select.Option value="IT & Electronics">IT & Electronics</Select.Option>
            <Select.Option value="Vehicles & Fleet">Vehicles & Fleet</Select.Option>
            <Select.Option value="Furniture & Fixtures">Furniture & Fixtures</Select.Option>
            <Select.Option value="Office Equipment">Office Equipment</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Statuses</Select.Option>
            <Select.Option value="Allocated">Allocated</Select.Option>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Available">Available</Select.Option>
            <Select.Option value="Under Maintenance">Under Maintenance</Select.Option>
          </Select>

          <Select value={conditionFilter} onChange={setConditionFilter}>
            <Select.Option value="ALL">All Conditions</Select.Option>
            <Select.Option value="Brand New">Brand New</Select.Option>
            <Select.Option value="Good">Good</Select.Option>
            <Select.Option value="Fair">Fair</Select.Option>
            <Select.Option value="Needs Repair">Needs Repair</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
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
          dataSource={filteredAssets}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} assets` }}
          scroll={{ x: 1250 }}
          size="middle"
        />
      </Card>

      {/* Add New Asset Form Modal */}
      <Modal
        open={addModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Register Capital Asset into Master</span>
          </div>
        }
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Capitalize & Save Asset"
        cancelText="Cancel"
        width={780}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAsset}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="assetName" label="Asset Name / Description" rules={[{ required: true }]}>
              <Input placeholder="e.g. 5-Axis CNC Milling Station" />
            </Form.Item>

            <Form.Item name="category" label="Asset Category" rules={[{ required: true }]}>
              <Select placeholder="Select category">
                <Select.Option value="Plant & Machinery">Plant & Machinery</Select.Option>
                <Select.Option value="IT & Electronics">IT & Electronics</Select.Option>
                <Select.Option value="Vehicles & Fleet">Vehicles & Fleet</Select.Option>
                <Select.Option value="Furniture & Fixtures">Furniture & Fixtures</Select.Option>
                <Select.Option value="Office Equipment">Office Equipment</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="brand" label="Brand / Manufacturer" rules={[{ required: true }]}>
              <Input placeholder="e.g. Siemens, Dell, Tata" />
            </Form.Item>

            <Form.Item name="modelNumber" label="Model Number">
              <Input placeholder="e.g. SINUMERIK-840D" />
            </Form.Item>

            <Form.Item name="serialNumber" label="Serial Number" rules={[{ required: true }]}>
              <Input placeholder="e.g. SN-884920" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="purchaseCost" label="Purchase Cost (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="Original procurement cost" />
            </Form.Item>

            <Form.Item name="usefulLifeYears" label="Useful Life (Years)" initialValue={5}>
              <InputNumber style={{ width: '100%' }} min={1} max={30} />
            </Form.Item>

            <Form.Item name="salvageValue" label="Scrap / Salvage (₹)" initialValue={0}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="branch" label="Branch Location" rules={[{ required: true }]}>
              <Select placeholder="Select branch">
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
                <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Select placeholder="Select department">
                <Select.Option value="Production & Manufacturing">Production</Select.Option>
                <Select.Option value="IT & Infrastructure">IT & Infrastructure</Select.Option>
                <Select.Option value="Field Engineering & Service">Field Engineering</Select.Option>
                <Select.Option value="Sales & Business Dev">Sales</Select.Option>
                <Select.Option value="Warehouse & Logistics">Warehouse</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="condition" label="Initial Condition" initialValue="Brand New">
              <Select>
                <Select.Option value="Brand New">Brand New</Select.Option>
                <Select.Option value="Good">Good</Select.Option>
                <Select.Option value="Fair">Fair</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Asset Dossier View Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Asset Master Dossier - {selectedAsset?.assetName}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="qr"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              setDetailModalOpen(false);
              setQrModalOpen(true);
            }}
          >
            Generate QR Label
          </Button>,
        ]}
        width={720}
      >
        {selectedAsset && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Asset Identification</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedAsset.assetName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  ID: {selectedAsset.assetId} &bull; Code: {selectedAsset.assetCode}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Serial: <span style={{ fontFamily: 'monospace' }}>{selectedAsset.serialNumber}</span>
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Deployment & Custodian</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {selectedAsset.assignedEmployeeName || 'Unassigned (Storage Pool)'}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  Branch: {selectedAsset.branch} &bull; Dept: {selectedAsset.department}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Location: {selectedAsset.building}, {selectedAsset.room}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Financial & Depreciation Schedule</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Original Purchase Cost:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedAsset.purchaseCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Capitalized Acquisition:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedAsset.totalAcquisitionCost.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Depreciation Method & Rate:</span>
                <span style={{ fontWeight: 600 }}>{selectedAsset.depreciationMethod} ({selectedAsset.depreciationRate}% p.a.)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Accumulated Depreciation to Date:</span>
                <span style={{ fontWeight: 600, color: '#EF4444' }}>-₹{selectedAsset.accumulatedDepreciation.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Net Book Value (Current Asset Value):</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedAsset.currentBookValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>Status: {selectedAsset.status}</Tag>
              <Tag color="green" style={{ padding: '4px 10px', fontSize: 12 }}>Condition: {selectedAsset.condition}</Tag>
              <Tag color="purple" style={{ padding: '4px 10px', fontSize: 12 }}>Warranty: {selectedAsset.warrantyExpiryDate}</Tag>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Tag Modal */}
      <Modal
        open={qrModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <QrCode size={18} />
            <span>Asset Barcode & QR Physical Tag</span>
          </div>
        }
        onCancel={() => setQrModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.success('Printing physical metallic asset tag sticker...');
              setQrModalOpen(false);
            }}
          >
            Print Asset Tag Sticker
          </Button>,
        ]}
        width={420}
      >
        {selectedAsset && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                display: 'inline-block',
                padding: 16,
                background: '#FFFFFF',
                borderRadius: 12,
                border: '2px solid #1E3A8A',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontWeight: 900, color: '#1E3A8A', fontSize: 16 }}>UNIVERSAL ERP ASSET TAG</div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>PROPERTY OF COMPANY - DO NOT REMOVE</div>
              {/* Simulated QR Code box */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: '0 auto',
                  background: 'repeating-linear-gradient(45deg, #1E3A8A, #1E3A8A 10px, #FFFFFF 10px, #FFFFFF 20px)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                [ QR CODE ]
              </div>
              <div style={{ marginTop: 12, fontWeight: 800, fontSize: 15, color: '#0F172A' }}>{selectedAsset.assetId}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{selectedAsset.assetName}</div>
              <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>SN: {selectedAsset.serialNumber}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
