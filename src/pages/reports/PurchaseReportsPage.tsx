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
  ShoppingBag,
  PackageCheck,
  Clock,
  Coins,
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
import { PurchaseReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const PurchaseReportsPage: React.FC = () => {
  const { purchaseReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<PurchaseReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [analyticsView, setAnalyticsView] = useState<'supplier' | 'category'>('supplier');

  // Filter Logic
  const filteredData = useMemo(() => {
    return purchaseReports.filter((item) => {
      const matchSearch =
        item.purchaseOrderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchText.toLowerCase());

      const matchSup = supplierFilter === 'ALL' || item.supplierName === supplierFilter;
      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchStatus = purchaseStatusFilter === 'ALL' || item.purchaseStatus === purchaseStatusFilter;
      const matchPayment = paymentStatusFilter === 'ALL' || item.paymentStatus === paymentStatusFilter;

      return matchSearch && matchSup && matchCat && matchStatus && matchPayment;
    });
  }, [purchaseReports, searchText, supplierFilter, categoryFilter, purchaseStatusFilter, paymentStatusFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalPurchaseValue = filteredData.reduce((acc, curr) => acc + curr.totalPurchaseAmount, 0);
    const totalOrders = filteredData.length;
    const goodsReceivedValue = filteredData.reduce(
      (acc, curr) => acc + curr.receivedQuantity * curr.unitPrice * 1.18,
      0
    );
    const pendingPurchaseValue = filteredData.reduce(
      (acc, curr) => acc + curr.pendingQuantity * curr.unitPrice * 1.18,
      0
    );

    return {
      totalPurchaseValue,
      totalOrders,
      goodsReceivedValue: Math.round(goodsReceivedValue),
      pendingPurchaseValue: Math.round(pendingPurchaseValue),
    };
  }, [filteredData]);

  // Supplier Breakdown Analytics
  const supplierAnalytics = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    filteredData.forEach((item) => {
      if (!map[item.supplierName]) map[item.supplierName] = { total: 0, count: 0 };
      map[item.supplierName].total += item.totalPurchaseAmount;
      map[item.supplierName].count += 1;
    });
    return Object.entries(map).map(([name, val]) => ({
      name,
      total: val.total,
      count: val.count,
      share: summaryMetrics.totalPurchaseValue > 0 ? Math.round((val.total / summaryMetrics.totalPurchaseValue) * 100) : 0,
    }));
  }, [filteredData, summaryMetrics.totalPurchaseValue]);

  const handleExport = (type: string) => {
    message.success(`Exporting Purchase Reports to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 110,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#334155' }}>{v}</span>,
    },
    {
      title: 'PO Number',
      dataIndex: 'purchaseOrderNumber',
      key: 'purchaseOrderNumber',
      width: 140,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (v: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{v}</span>,
    },
    {
      title: 'Product / Brand',
      key: 'prod',
      render: (_: any, r: PurchaseReportItem) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12.5 }}>{r.productName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.brand} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Ordered / Recv / Pend',
      key: 'qtyFmt',
      width: 170,
      align: 'center' as const,
      render: (_: any, r: PurchaseReportItem) => (
        <div style={{ fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.orderedQuantity}</span> ord /{' '}
          <span style={{ fontWeight: 700, color: '#10B981' }}>{r.receivedQuantity}</span> rec /{' '}
          <span style={{ fontWeight: 700, color: r.pendingQuantity > 0 ? '#EF4444' : '#64748B' }}>
            {r.pendingQuantity}
          </span>{' '}
          pend
        </div>
      ),
    },
    {
      title: 'Unit Price (₹)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Gross / GST (₹)',
      key: 'taxGross',
      align: 'right' as const,
      render: (_: any, r: PurchaseReportItem) => (
        <div style={{ fontSize: 11 }}>
          <div style={{ color: '#475569' }}>₹{r.grossAmount.toLocaleString('en-IN')}</div>
          <div style={{ color: '#64748B' }}>+₹{r.taxAmount.toLocaleString('en-IN')} GST</div>
        </div>
      ),
    },
    {
      title: 'Total Amount (₹)',
      dataIndex: 'totalPurchaseAmount',
      key: 'totalPurchaseAmount',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'PO Status',
      dataIndex: 'purchaseStatus',
      key: 'purchaseStatus',
      width: 130,
      render: (status: string) => {
        const color =
          status === 'Completed'
            ? 'success'
            : status === 'Partially Received'
            ? 'warning'
            : status === 'Pending Approval'
            ? 'processing'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 110,
      render: (status: string) => {
        const color =
          status === 'Paid'
            ? 'green'
            : status === 'Partially Paid'
            ? 'gold'
            : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: PurchaseReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Drill-down PO & GRN Details"
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
            Purchase & Procurement Reports
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Monitor supplier procurement orders, Goods Received Notes (GRN), delivery fulfillments, and purchase liabilities.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Procurement Digest
          </Button>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Report
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
          title="Total Purchase Value"
          value={`₹${summaryMetrics.totalPurchaseValue.toLocaleString('en-IN')}`}
          subtitle="Net procurement for selected period"
          trend={{ value: '6.4% procurement cycle', isPositive: true }}
          icon={<ShoppingBag size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Purchase Orders"
          value={summaryMetrics.totalOrders}
          subtitle="Purchase orders generated"
          trend={{ value: '3 new this week', isPositive: true }}
          icon={<Coins size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Goods Received (GRN) Value"
          value={`₹${summaryMetrics.goodsReceivedValue.toLocaleString('en-IN')}`}
          subtitle="Stock verified into warehouses"
          trend={{ value: '88% fulfillment rate', isPositive: true }}
          icon={<PackageCheck size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Pending Procurement Value"
          value={`₹${summaryMetrics.pendingPurchaseValue.toLocaleString('en-IN')}`}
          subtitle="PO orders awaiting factory dispatch"
          trend={{ value: 'Awaiting supplier delivery', isPositive: false }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Procurement Visual Analytics */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} color="#1E3A8A" />
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
              Supplier Distribution & Procurement Analytics
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              size="small"
              type={analyticsView === 'supplier' ? 'primary' : 'default'}
              onClick={() => setAnalyticsView('supplier')}
              style={analyticsView === 'supplier' ? { background: '#1E3A8A', border: 'none' } : {}}
            >
              Supplier Concentration
            </Button>
            <Button
              size="small"
              type={analyticsView === 'category' ? 'primary' : 'default'}
              onClick={() => setAnalyticsView('category')}
              style={analyticsView === 'category' ? { background: '#1E3A8A', border: 'none' } : {}}
            >
              Order Status Ratio
            </Button>
          </div>
        </div>

        {analyticsView === 'supplier' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {supplierAnalytics.map((sup) => (
              <div
                key={sup.name}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sup.name}
                  </span>
                  <Tag color="blue">{sup.share}%</Tag>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A', marginTop: 6 }}>
                  ₹{sup.total.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {sup.count} PO requisitions booked
                </div>
                <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${sup.share}%`, height: '100%', backgroundColor: '#0284C7', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {analyticsView === 'category' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 14, border: '1px solid #BBF7D0' }}>
              <div style={{ color: '#166534', fontWeight: 700 }}>Completed Orders (GRN Cleared)</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#15803D', marginTop: 4 }}>
                {filteredData.filter((i) => i.purchaseStatus === 'Completed').length} Orders
              </div>
              <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>100% stock received into warehouses</div>
            </div>
            <div style={{ background: '#FFFBEB', borderRadius: 10, padding: 14, border: '1px solid #FDE68A' }}>
              <div style={{ color: '#92400E', fontWeight: 700 }}>Partially Received</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#B45309', marginTop: 4 }}>
                {filteredData.filter((i) => i.purchaseStatus === 'Partially Received').length} Orders
              </div>
              <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>Balance shipments pending transit</div>
            </div>
            <div style={{ background: '#EFF6FF', borderRadius: 10, padding: 14, border: '1px solid #BFDBFE' }}>
              <div style={{ color: '#1E40AF', fontWeight: 700 }}>Pending Approval</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1D4ED8', marginTop: 4 }}>
                {filteredData.filter((i) => i.purchaseStatus === 'Pending Approval').length} Orders
              </div>
              <div style={{ fontSize: 11, color: '#1E40AF', marginTop: 2 }}>Awaiting Purchase Head approval</div>
            </div>
          </div>
        )}
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
            placeholder="Search PO, supplier, item..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={supplierFilter} onChange={setSupplierFilter}>
            <Select.Option value="ALL">All Suppliers</Select.Option>
            <Select.Option value="Bharat Heavy Electricals & Drives">BHEL Drives</Select.Option>
            <Select.Option value="Rexroth Bosch India Distributors">Rexroth Bosch</Select.Option>
            <Select.Option value="Schneider Electric Components">Schneider Electric</Select.Option>
            <Select.Option value="Festo India Automation Ltd">Festo India</Select.Option>
            <Select.Option value="Mitutoyo Metrology India Pvt">Mitutoyo Metrology</Select.Option>
          </Select>

          <Select value={categoryFilter} onChange={setCategoryFilter}>
            <Select.Option value="ALL">All Categories</Select.Option>
            <Select.Option value="Industrial Automation">Industrial Automation</Select.Option>
            <Select.Option value="Pneumatics & Hydraulics">Pneumatics & Hydraulics</Select.Option>
            <Select.Option value="Test & Calibration">Test & Calibration</Select.Option>
          </Select>

          <Select value={purchaseStatusFilter} onChange={setPurchaseStatusFilter}>
            <Select.Option value="ALL">All PO Statuses</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Partially Received">Partially Received</Select.Option>
            <Select.Option value="Pending Approval">Pending Approval</Select.Option>
          </Select>

          <Select value={paymentStatusFilter} onChange={setPaymentStatusFilter}>
            <Select.Option value="ALL">All Payment Statuses</Select.Option>
            <Select.Option value="Paid">Fully Paid</Select.Option>
            <Select.Option value="Partially Paid">Partially Paid</Select.Option>
            <Select.Option value="Unpaid">Unpaid</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Detailed Purchase Reports Table */}
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} purchase orders` }}
          scroll={{ x: 1250 }}
          size="middle"
        />
      </Card>

      {/* Drill-down PO Details Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Purchase Order & Goods Receipt (GRN) - {selectedRecord?.purchaseOrderNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="bill"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Viewing Vendor Bill & GRN record for ${selectedRecord?.purchaseOrderNumber}...`);
              setDetailModalOpen(false);
            }}
          >
            Open Supplier Ledger & GRN
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Authorized Supplier</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.supplierName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Department: {selectedRecord.department}</div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Fulfillment Status</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {selectedRecord.receivedQuantity} / {selectedRecord.orderedQuantity} Units Received
                </div>
                <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>
                  {selectedRecord.pendingQuantity > 0 ? `${selectedRecord.pendingQuantity} units pending dispatch` : 'Order fully completed'}
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Procurement Cost Analysis</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Procured Item:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.productName} ({selectedRecord.brand})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Unit Contract Price:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRecord.unitPrice.toLocaleString('en-IN')} / unit</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Gross PO Value:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRecord.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Input Tax Credit (ITC) / GST:</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>+₹{selectedRecord.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Total Invoice Cost:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedRecord.totalPurchaseAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>PO Status: {selectedRecord.purchaseStatus}</Tag>
              <Tag color="green" style={{ padding: '4px 10px', fontSize: 12 }}>Payment: {selectedRecord.paymentStatus}</Tag>
              <Tag color="gold" style={{ padding: '4px 10px', fontSize: 12 }}>Branch: {selectedRecord.branch}</Tag>
            </div>
          </div>
        )}
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Procurement & Supplier Performance Report"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
