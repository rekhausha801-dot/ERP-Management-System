import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  DatePicker,
  Space,
  Modal,
  Typography,
  message,
  Tabs,
} from 'antd';
import {
  TrendingUp,
  ShoppingCart,
  Receipt,
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
import { SalesReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const SalesReportsPage: React.FC = () => {
  const { salesReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [salespersonFilter, setSalespersonFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<SalesReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [analyticsView, setAnalyticsView] = useState<'trends' | 'category' | 'executive'>('trends');

  // Filter Logic
  const filteredData = useMemo(() => {
    return salesReports.filter((item) => {
      const matchSearch =
        item.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.salesperson.toLowerCase().includes(searchText.toLowerCase());

      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      const matchSalesperson = salespersonFilter === 'ALL' || item.salesperson === salespersonFilter;
      const matchOrderStatus = orderStatusFilter === 'ALL' || item.orderStatus === orderStatusFilter;
      const matchPaymentStatus = paymentStatusFilter === 'ALL' || item.paymentStatus === paymentStatusFilter;

      return matchSearch && matchCat && matchBranch && matchSalesperson && matchOrderStatus && matchPaymentStatus;
    });
  }, [salesReports, searchText, categoryFilter, branchFilter, salespersonFilter, orderStatusFilter, paymentStatusFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.netSales, 0);
    const totalOrders = filteredData.length;
    const completedOrders = filteredData.filter((i) => i.orderStatus === 'Delivered').length;
    const totalInvoiced = filteredData.reduce((acc, curr) => acc + (curr.grossAmount + curr.taxAmount), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    return {
      totalSales,
      totalOrders,
      completedOrders,
      totalInvoiced,
      avgOrderValue,
    };
  }, [filteredData]);

  // Analytics Grouping
  const categoryAnalytics = useMemo(() => {
    const map: Record<string, { total: number; qty: number }> = {};
    filteredData.forEach((item) => {
      if (!map[item.category]) map[item.category] = { total: 0, qty: 0 };
      map[item.category].total += item.netSales;
      map[item.category].qty += item.quantity;
    });
    return Object.entries(map).map(([cat, val]) => ({
      category: cat,
      revenue: val.total,
      quantity: val.qty,
      share: summaryMetrics.totalSales > 0 ? Math.round((val.total / summaryMetrics.totalSales) * 100) : 0,
    }));
  }, [filteredData, summaryMetrics.totalSales]);

  const executiveAnalytics = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    filteredData.forEach((item) => {
      if (!map[item.salesperson]) map[item.salesperson] = { total: 0, count: 0 };
      map[item.salesperson].total += item.netSales;
      map[item.salesperson].count += 1;
    });
    return Object.entries(map).map(([name, val]) => ({
      name,
      revenue: val.total,
      deals: val.count,
    }));
  }, [filteredData]);

  const handleExport = (type: string) => {
    message.success(`Exporting Sales Report to ${type.toUpperCase()} with active filters...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: 'Report Date',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 105,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#334155' }}>{v}</span>,
    },
    {
      title: 'Order & Invoice',
      key: 'orderInv',
      width: 150,
      render: (_: any, r: SalesReportItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E3A8A' }}>{r.orderNumber}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.invoiceNumber}</div>
        </div>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (v: string) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{v}</span>,
    },
    {
      title: 'Salesperson',
      dataIndex: 'salesperson',
      key: 'salesperson',
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Product / Category',
      key: 'prod',
      render: (_: any, r: SalesReportItem) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12.5 }}>{r.productName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.brand} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 60,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontWeight: 700 }}>{v}</span>,
    },
    {
      title: 'Gross (₹)',
      dataIndex: 'grossAmount',
      key: 'grossAmount',
      align: 'right' as const,
      render: (v: number) => `₹${v.toLocaleString('en-IN')}`,
    },
    {
      title: 'Disc / Tax (₹)',
      key: 'taxDisc',
      align: 'right' as const,
      render: (_: any, r: SalesReportItem) => (
        <div style={{ fontSize: 11 }}>
          <div style={{ color: '#EF4444' }}>-₹{r.discount.toLocaleString('en-IN')}</div>
          <div style={{ color: '#64748B' }}>+₹{r.taxAmount.toLocaleString('en-IN')} GST</div>
        </div>
      ),
    },
    {
      title: 'Net Sales (₹)',
      dataIndex: 'netSales',
      key: 'netSales',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 110,
      render: (status: string) => {
        const color =
          status === 'Delivered'
            ? 'success'
            : status === 'In Transit'
            ? 'processing'
            : status === 'Processing'
            ? 'warning'
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
            : status === 'Overdue'
            ? 'red'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, r: SalesReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Drill-down Detailed Record"
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
            Sales Reports & Analytics
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Comprehensive analytics of revenue generation, customer orders, salesperson performance, and regional sales.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Automated Delivery
          </Button>
          <Button icon={<Printer size={14} />} onClick={handlePrint}>
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
          title="Total Net Sales"
          value={`₹${summaryMetrics.totalSales.toLocaleString('en-IN')}`}
          subtitle="Net revenue for selected period"
          trend={{ value: '14.8% vs last month', isPositive: true }}
          icon={<TrendingUp size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Total Sales Orders"
          value={summaryMetrics.totalOrders}
          subtitle={`${summaryMetrics.completedOrders} orders delivered`}
          trend={{ value: '8.2% order volume', isPositive: true }}
          icon={<ShoppingCart size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Total Invoiced Value"
          value={`₹${summaryMetrics.totalInvoiced.toLocaleString('en-IN')}`}
          subtitle="Gross + GST billings booked"
          trend={{ value: '12.4% billed value', isPositive: true }}
          icon={<Receipt size={20} color="#7C3AED" />}
          iconBgColor="#F5F3FF"
        />
        <KpiCard
          title="Average Order Value (AOV)"
          value={`₹${summaryMetrics.avgOrderValue.toLocaleString('en-IN')}`}
          subtitle="Avg realization per order"
          trend={{ value: '5.1% ticket size', isPositive: true }}
          icon={<CircleDollarSign size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Graphical Analytics Panel */}
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
              Sales Visual Intelligence & Trends
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              size="small"
              type={analyticsView === 'trends' ? 'primary' : 'default'}
              onClick={() => setAnalyticsView('trends')}
              style={analyticsView === 'trends' ? { background: '#1E3A8A', border: 'none' } : {}}
            >
              Revenue Timeline
            </Button>
            <Button
              size="small"
              type={analyticsView === 'category' ? 'primary' : 'default'}
              onClick={() => setAnalyticsView('category')}
              style={analyticsView === 'category' ? { background: '#1E3A8A', border: 'none' } : {}}
            >
              Category Share
            </Button>
            <Button
              size="small"
              type={analyticsView === 'executive' ? 'primary' : 'default'}
              onClick={() => setAnalyticsView('executive')}
              style={analyticsView === 'executive' ? { background: '#1E3A8A', border: 'none' } : {}}
            >
              Salesperson Leaderboard
            </Button>
          </div>
        </div>

        {analyticsView === 'trends' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {filteredData.slice(0, 6).map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{item.reportDate}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1E3A8A', marginTop: 4 }}>
                  ₹{item.netSales.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#334155', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.customerName}
                </div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>{item.orderNumber}</Tag>
                  <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700 }}>{item.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {analyticsView === 'category' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {categoryAnalytics.map((cat) => (
              <div
                key={cat.category}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{cat.category}</span>
                  <Tag color="purple">{cat.share}%</Tag>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A', marginTop: 6 }}>
                  ₹{cat.revenue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {cat.quantity} units sold across branches
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.share}%`, height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {analyticsView === 'executive' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {executiveAnalytics.map((exec) => (
              <div
                key={exec.name}
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{exec.name}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0D9488', marginTop: 6 }}>
                  ₹{exec.revenue.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {exec.deals} high-value deals closed
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Multi-Dimensional Filter Toolbar */}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search order, customer, SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={categoryFilter} onChange={setCategoryFilter}>
            <Select.Option value="ALL">All Categories</Select.Option>
            <Select.Option value="Industrial Automation">Industrial Automation</Select.Option>
            <Select.Option value="Pneumatics & Hydraulics">Pneumatics & Hydraulics</Select.Option>
            <Select.Option value="Automation Controllers">Automation Controllers</Select.Option>
            <Select.Option value="Test & Calibration">Test & Calibration</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
          </Select>

          <Select value={salespersonFilter} onChange={setSalespersonFilter}>
            <Select.Option value="ALL">All Sales Executives</Select.Option>
            <Select.Option value="Ramesh Sundaram">Ramesh Sundaram</Select.Option>
            <Select.Option value="Priya Sharma">Priya Sharma</Select.Option>
            <Select.Option value="Karthik Raja">Karthik Raja</Select.Option>
            <Select.Option value="Ananya Roy">Ananya Roy</Select.Option>
          </Select>

          <Select value={orderStatusFilter} onChange={setOrderStatusFilter}>
            <Select.Option value="ALL">All Order Statuses</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
            <Select.Option value="In Transit">In Transit</Select.Option>
            <Select.Option value="Processing">Processing</Select.Option>
          </Select>

          <Select value={paymentStatusFilter} onChange={setPaymentStatusFilter}>
            <Select.Option value="ALL">All Payment Statuses</Select.Option>
            <Select.Option value="Paid">Fully Paid</Select.Option>
            <Select.Option value="Partially Paid">Partially Paid</Select.Option>
            <Select.Option value="Unpaid">Unpaid</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Detailed Sales Reports Table */}
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} sales records` }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Drill-Down Detailed Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Sales Order & Invoice Audit Trail - {selectedRecord?.orderNumber}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="invoice"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Navigating to Tax Invoice ${selectedRecord?.invoiceNumber}...`);
              setDetailModalOpen(false);
            }}
          >
            Open Associated Invoice
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Customer Account</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.customerName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Branch: {selectedRecord.branch} &bull; Channel: {selectedRecord.salesChannel}</div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Sales Account Lead</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.salesperson}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Department: {selectedRecord.department}</div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Itemized Transaction Financials</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Product Item:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.productName} ({selectedRecord.quantity} units)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Gross Order Amount:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRecord.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Trade Discount Given:</span>
                <span style={{ fontWeight: 600, color: '#EF4444' }}>-₹{selectedRecord.discount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Applicable GST (18%):</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>+₹{selectedRecord.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Final Net Sales Realization:</span>
                <span style={{ fontWeight: 800, color: '#1E3A8A', fontSize: 16 }}>₹{selectedRecord.netSales.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>Order Status: {selectedRecord.orderStatus}</Tag>
              <Tag color="green" style={{ padding: '4px 10px', fontSize: 12 }}>Payment: {selectedRecord.paymentStatus}</Tag>
              <Tag color="purple" style={{ padding: '4px 10px', fontSize: 12 }}>Invoice Ref: {selectedRecord.invoiceNumber}</Tag>
            </div>
          </div>
        )}
      </Modal>

      {/* Automated Report Schedule Modal */}
      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Executive Sales Analytics & Revenue Report"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
