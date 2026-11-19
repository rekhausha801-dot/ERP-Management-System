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
  message,
} from 'antd';
import {
  Boxes,
  BadgeAlert,
  PackageX,
  CircleDollarSign,
  Search,
  Download,
  Printer,
  Calendar,
  Layers,
  BarChart3,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { KpiCard } from '../../components/KpiCard';
import { useReportsDatabase } from './reportsStore';
import { InventoryReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const InventoryReportsPage: React.FC = () => {
  const { inventoryReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [movementFilter, setMovementFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<InventoryReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Filters
  const filteredData = useMemo(() => {
    return inventoryReports.filter((item) => {
      const matchSearch =
        item.productCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());

      const matchWh = warehouseFilter === 'ALL' || item.warehouse === warehouseFilter;
      const matchStatus = statusFilter === 'ALL' || item.stockStatus === statusFilter;
      const matchMovement = movementFilter === 'ALL' || item.fastSlowStatus === movementFilter;

      return matchSearch && matchWh && matchStatus && matchMovement;
    });
  }, [inventoryReports, searchText, warehouseFilter, statusFilter, movementFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalItems = filteredData.length;
    const totalStockValue = filteredData.reduce((acc, curr) => acc + curr.stockValue, 0);
    const lowStockItems = filteredData.filter((i) => i.stockStatus === 'Low Stock').length;
    const outOfStockItems = filteredData.filter((i) => i.stockStatus === 'Out of Stock').length;

    return {
      totalItems,
      totalStockValue,
      lowStockItems,
      outOfStockItems,
    };
  }, [filteredData]);

  // Warehouse breakdown
  const warehouseAnalytics = useMemo(() => {
    const map: Record<string, { totalVal: number; items: number }> = {};
    filteredData.forEach((item) => {
      if (!map[item.warehouse]) map[item.warehouse] = { totalVal: 0, items: 0 };
      map[item.warehouse].totalVal += item.stockValue;
      map[item.warehouse].items += 1;
    });
    return Object.entries(map).map(([wh, val]) => ({
      warehouse: wh,
      value: val.totalVal,
      count: val.items,
      share: summaryMetrics.totalStockValue > 0 ? Math.round((val.totalVal / summaryMetrics.totalStockValue) * 100) : 0,
    }));
  }, [filteredData, summaryMetrics.totalStockValue]);

  const handleExport = (type: string) => {
    message.success(`Exporting Inventory Valuation & Stock Audit to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      title: 'Product SKU',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Product Name / Brand',
      key: 'prod',
      render: (_: any, r: InventoryReportItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.productName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.brand} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Warehouse Depot',
      dataIndex: 'warehouse',
      key: 'warehouse',
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Opening / In / Out',
      key: 'movements',
      width: 160,
      align: 'center' as const,
      render: (_: any, r: InventoryReportItem) => (
        <div style={{ fontSize: 11.5 }}>
          <span>{r.openingStock}</span> op &bull;{' '}
          <span style={{ color: '#10B981', fontWeight: 600 }}>+{r.stockIn}</span> in &bull;{' '}
          <span style={{ color: '#EF4444', fontWeight: 600 }}>-{r.stockOut}</span> out
        </div>
      ),
    },
    {
      title: 'Available / Reserved',
      key: 'avail',
      width: 140,
      align: 'center' as const,
      render: (_: any, r: InventoryReportItem) => (
        <div>
          <span style={{ fontWeight: 800, fontSize: 14, color: r.availableStock === 0 ? '#EF4444' : '#0F172A' }}>
            {r.availableStock}
          </span>{' '}
          avail / <span style={{ color: '#64748B', fontSize: 11 }}>{r.reservedStock} res</span>
        </div>
      ),
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      width: 90,
      align: 'center' as const,
      render: (v: number) => <span style={{ color: '#64748B', fontWeight: 600 }}>{v}</span>,
    },
    {
      title: 'Unit Cost (₹)',
      dataIndex: 'unitCost',
      key: 'unitCost',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Stock Valuation (₹)',
      dataIndex: 'stockValue',
      key: 'stockValue',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Stock Status',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      width: 120,
      render: (status: string) => {
        const color =
          status === 'Normal'
            ? 'success'
            : status === 'Low Stock'
            ? 'warning'
            : status === 'Out of Stock'
            ? 'error'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Velocity',
      dataIndex: 'fastSlowStatus',
      key: 'fastSlowStatus',
      width: 110,
      render: (status: string) => {
        const color =
          status === 'Fast-Moving'
            ? 'purple'
            : status === 'Medium'
            ? 'blue'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: InventoryReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Audit Stock History & Movement"
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
            Inventory Valuation & Stock Reports
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Warehouse-wise stock valuation, stock movement history, fast/slow moving velocity, and reorder alerts.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Stock Audit Digest
          </Button>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Stock Report
          </Button>
          <Button icon={<Download size={14} />} onClick={() => handleExport('excel')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<FileSpreadsheet size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => handleExport('pdf')}
          >
            Download PDF
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
          title="Total Stock Items"
          value={summaryMetrics.totalItems}
          subtitle="Monitored active SKU lines"
          trend={{ value: 'Multi-warehouse tracked', isPositive: true }}
          icon={<Boxes size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Current Stock Valuation"
          value={`₹${summaryMetrics.totalStockValue.toLocaleString('en-IN')}`}
          subtitle="Asset valuation across depots"
          trend={{ value: 'Valued at landing cost', isPositive: true }}
          icon={<CircleDollarSign size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Low Stock Items"
          value={summaryMetrics.lowStockItems}
          subtitle="Items below safety threshold"
          trend={{ value: 'Reorder suggested', isPositive: false }}
          icon={<BadgeAlert size={20} color="#D97706" />}
          iconBgColor="#FFFBEB"
        />
        <KpiCard
          title="Out of Stock Items"
          value={summaryMetrics.outOfStockItems}
          subtitle="Zero available warehouse stock"
          trend={{ value: 'Critical supply urgency', isPositive: false }}
          icon={<PackageX size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
        />
      </div>

      {/* Warehouse Valuation Breakdown Card */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BarChart3 size={18} color="#1E3A8A" />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
            Depot & Warehouse Valuation Breakdown
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {warehouseAnalytics.map((wh) => (
            <div
              key={wh.warehouse}
              style={{
                background: '#F8FAFC',
                borderRadius: 10,
                padding: '12px 14px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{wh.warehouse}</span>
                <Tag color="cyan">{wh.share}%</Tag>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A', marginTop: 6 }}>
                ₹{wh.value.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{wh.count} inventory SKUs housed</div>
              <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: `${wh.share}%`, height: '100%', backgroundColor: '#0D9488', borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

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
            placeholder="Search SKU code, product, brand..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={warehouseFilter} onChange={setWarehouseFilter}>
            <Select.Option value="ALL">All Warehouses</Select.Option>
            <Select.Option value="Chennai Central Depot">Chennai Central Depot</Select.Option>
            <Select.Option value="Bengaluru Logistics Hub">Bengaluru Logistics Hub</Select.Option>
            <Select.Option value="Coimbatore Hub">Coimbatore Hub</Select.Option>
            <Select.Option value="Hosur Plant Storage">Hosur Plant Storage</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Stock Statuses</Select.Option>
            <Select.Option value="Normal">Normal Stock</Select.Option>
            <Select.Option value="Low Stock">Low Stock</Select.Option>
            <Select.Option value="Out of Stock">Out of Stock</Select.Option>
          </Select>

          <Select value={movementFilter} onChange={setMovementFilter}>
            <Select.Option value="ALL">All Velocity Categories</Select.Option>
            <Select.Option value="Fast-Moving">Fast-Moving</Select.Option>
            <Select.Option value="Medium">Medium Velocity</Select.Option>
            <Select.Option value="Slow-Moving">Slow-Moving</Select.Option>
            <Select.Option value="Non-Moving">Non-Moving (Dead Stock)</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Detailed Stock Table */}
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} inventory items` }}
          scroll={{ x: 1280 }}
          size="middle"
        />
      </Card>

      {/* Drill-down Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Stock Ledger & Audit Trail - {selectedRecord?.productCode}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="transfer"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Initiating warehouse stock adjustment for ${selectedRecord?.productName}...`);
              setDetailModalOpen(false);
            }}
          >
            Create Stock Adjustment
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Product Identification</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.productName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Brand: {selectedRecord.brand} &bull; SKU: {selectedRecord.productCode}</div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Storage Depot</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.warehouse}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Branch Location: {selectedRecord.branch}</div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Physical Stock Balance & Valuation</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Opening Count:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.openingStock} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Stock Inflow (Purchases/Returns):</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>+{selectedRecord.stockIn} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Stock Outflow (Sales Orders):</span>
                <span style={{ fontWeight: 600, color: '#EF4444' }}>-{selectedRecord.stockOut} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Safety Reorder Level:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.reorderLevel} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Total Book Asset Valuation:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedRecord.stockValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>Stock Status: {selectedRecord.stockStatus}</Tag>
              <Tag color="purple" style={{ padding: '4px 10px', fontSize: 12 }}>Velocity: {selectedRecord.fastSlowStatus}</Tag>
              <Tag color="cyan" style={{ padding: '4px 10px', fontSize: 12 }}>Unit Cost: ₹{selectedRecord.unitCost.toLocaleString('en-IN')}</Tag>
            </div>
          </div>
        )}
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Inventory Valuation & Low Stock Report"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
