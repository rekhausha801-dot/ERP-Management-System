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
  Users,
  UserPlus,
  UserCheck,
  BadgeIndianRupee,
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
import { CustomerReportItem } from './reportsData';
import { ReportScheduleModal } from './ReportScheduleModal';

const { Text, Title } = Typography;

export const CustomerReportsPage: React.FC = () => {
  const { customerReports } = useReportsDatabase();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [retentionFilter, setRetentionFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<CustomerReportItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Filters
  const filteredData = useMemo(() => {
    return customerReports.filter((item) => {
      const matchSearch =
        item.customerCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.city.toLowerCase().includes(searchText.toLowerCase()) ||
        item.salesperson.toLowerCase().includes(searchText.toLowerCase());

      const matchType = typeFilter === 'ALL' || item.customerType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || item.customerStatus === statusFilter;
      const matchRetention = retentionFilter === 'ALL' || item.retentionSegment === retentionFilter;

      return matchSearch && matchType && matchStatus && matchRetention;
    });
  }, [customerReports, searchText, typeFilter, statusFilter, retentionFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalCustomers = filteredData.length;
    const newCustomers = filteredData.filter((i) => i.customerStatus === 'New').length;
    const activeCustomers = filteredData.filter((i) => i.customerStatus === 'Active' || i.customerStatus === 'High-Value').length;
    const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.totalSales, 0);

    return {
      totalCustomers,
      newCustomers,
      activeCustomers,
      totalRevenue,
    };
  }, [filteredData]);

  const handleExport = (type: string) => {
    message.success(`Exporting Customer Lifetime & Acquisition Report to ${type.toUpperCase()}...`);
  };

  const columns = [
    {
      title: 'Customer Code',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 120,
      render: (v: string) => <span style={{ fontWeight: 700, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Customer Name & Type',
      key: 'nameType',
      render: (_: any, r: CustomerReportItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.customerName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.customerType} &bull; {r.city}, {r.state}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, r: CustomerReportItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div style={{ color: '#1E293B' }}>{r.contactNumber}</div>
          <div style={{ color: '#64748B' }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 70,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontWeight: 700 }}>{v}</span>,
    },
    {
      title: 'Total Sales (₹)',
      dataIndex: 'totalSales',
      key: 'totalSales',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#1E3A8A' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Paid (₹)',
      dataIndex: 'totalPayments',
      key: 'totalPayments',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ color: '#10B981', fontWeight: 600 }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Outstanding (₹)',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: v > 0 ? '#EF4444' : '#64748B' }}>
          ₹{v.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Last Purchase',
      dataIndex: 'lastPurchaseDate',
      key: 'lastPurchaseDate',
      width: 110,
      render: (v: string) => <span style={{ fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Tier / Status',
      dataIndex: 'customerStatus',
      key: 'customerStatus',
      width: 120,
      render: (status: string) => {
        const color =
          status === 'High-Value'
            ? 'gold'
            : status === 'Active'
            ? 'green'
            : status === 'New'
            ? 'cyan'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Retention',
      dataIndex: 'retentionSegment',
      key: 'retentionSegment',
      width: 115,
      render: (v: string) => {
        const color = v === 'Loyal' ? 'purple' : v === 'Repeat Buyer' ? 'blue' : 'default';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 70,
      align: 'center' as const,
      render: (_: any, r: CustomerReportItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#4F46E5" />}
          title="Drill-down Customer Profile"
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
            Customer Insights & Lifetime Value Reports
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Monitor customer acquisition, purchase behavior, retention segments, revenue contribution, and outstanding balances.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<Calendar size={14} />}
            onClick={() => setScheduleModalOpen(true)}
            style={{ fontWeight: 600, color: '#4338CA', borderColor: '#C7D2FE' }}
          >
            Schedule Customer Insights
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
          title="Total Registered Customers"
          value={summaryMetrics.totalCustomers}
          subtitle="Corporate, wholesale & retail"
          trend={{ value: 'Multi-branch accounts', isPositive: true }}
          icon={<Users size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="New Customers (Quarter)"
          value={summaryMetrics.newCustomers}
          subtitle="Newly onboarded buyer accounts"
          trend={{ value: '+12% onboarding surge', isPositive: true }}
          icon={<UserPlus size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Active Transacting Accounts"
          value={summaryMetrics.activeCustomers}
          subtitle="Accounts active in past 90 days"
          trend={{ value: 'High repeat cadence', isPositive: true }}
          icon={<UserCheck size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Total Customer Revenue"
          value={`₹${summaryMetrics.totalRevenue.toLocaleString('en-IN')}`}
          subtitle="Cumulative lifetime billing"
          trend={{ value: '₹350K pending balance', isPositive: true }}
          icon={<BadgeIndianRupee size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Customer Segmentation Analytics */}
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
            Customer Category Revenue Share & Key Tiers
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Corporate Enterprise</span>
              <Tag color="purple">74% Share</Tag>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A', marginTop: 6 }}>₹96,10,000</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Tata Steel, Ashok Leyland, Sundaram</div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Wholesale Distributors</span>
              <Tag color="blue">22% Share</Tag>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0D9488', marginTop: 6 }}>₹28,50,000</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Lucas TVS & regional partners</div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Retail & Small Workshop</span>
              <Tag color="cyan">4% Share</Tag>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#EA580C', marginTop: 6 }}>₹4,10,000</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Apex Precision & local workshops</div>
          </div>
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
            placeholder="Search code, customer, city..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={typeFilter} onChange={setTypeFilter}>
            <Select.Option value="ALL">All Customer Types</Select.Option>
            <Select.Option value="Corporate">Corporate</Select.Option>
            <Select.Option value="Wholesale">Wholesale</Select.Option>
            <Select.Option value="Retail">Retail</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Statuses</Select.Option>
            <Select.Option value="High-Value">High-Value Accounts</Select.Option>
            <Select.Option value="Active">Active Transacting</Select.Option>
            <Select.Option value="New">New Registrations</Select.Option>
          </Select>

          <Select value={retentionFilter} onChange={setRetentionFilter}>
            <Select.Option value="ALL">All Retention Segments</Select.Option>
            <Select.Option value="Loyal">Loyal Accounts</Select.Option>
            <Select.Option value="Repeat Buyer">Repeat Buyer</Select.Option>
            <Select.Option value="First-Time">First-Time</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Detailed Customer Table */}
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
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} customer accounts` }}
          scroll={{ x: 1280 }}
          size="middle"
        />
      </Card>

      {/* Drill-down Customer Details Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Layers size={18} />
            <span>Customer Account Dossier - {selectedRecord?.customerName}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="ledger"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.info(`Opening customer account statement for ${selectedRecord?.customerName}...`);
              setDetailModalOpen(false);
            }}
          >
            View Customer Statement
          </Button>,
        ]}
        width={680}
      >
        {selectedRecord && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Primary Account Details</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.customerName}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  Code: {selectedRecord.customerCode} &bull; Reg: {selectedRecord.registrationDate}
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Assigned Salesperson & Branch</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedRecord.salesperson}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Branch: {selectedRecord.branch}</div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E3A8A', marginBottom: 8 }}>Cumulative Financial Profile</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Sales Orders Executed:</span>
                <span style={{ fontWeight: 600 }}>{selectedRecord.totalOrders} orders</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Cumulative Billed Invoices:</span>
                <span style={{ fontWeight: 600 }}>₹{selectedRecord.totalSales.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Total Payments Realized:</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>₹{selectedRecord.totalPayments.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: 4 }}>
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Current Outstanding Receivable:</span>
                <span style={{ fontWeight: 800, color: selectedRecord.outstandingBalance > 0 ? '#EF4444' : '#10B981', fontSize: 16 }}>
                  ₹{selectedRecord.outstandingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="gold" style={{ padding: '4px 10px', fontSize: 12 }}>Status: {selectedRecord.customerStatus}</Tag>
              <Tag color="purple" style={{ padding: '4px 10px', fontSize: 12 }}>Segment: {selectedRecord.retentionSegment}</Tag>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: 12 }}>City: {selectedRecord.city}</Tag>
            </div>
          </div>
        )}
      </Modal>

      <ReportScheduleModal
        open={scheduleModalOpen}
        reportName="Customer Insights & Lifetime Value Digest"
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
};
