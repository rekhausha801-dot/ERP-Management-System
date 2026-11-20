import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Tag,
  Progress,
  Button,
  Select,
  Tooltip,
  message,
  Card,
  Badge,
} from 'antd';
import {
  ShoppingCart,
  Clock,
  Truck,
  CreditCard,
  Building,
  TrendingUp,
  FileSpreadsheet,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  Briefcase,
  DollarSign,
  ArrowUpRight,
  Filter,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useNavigate } from 'react-router-dom';
import { usePurchaseStore } from '../../mock/purchaseManagementStore';

// Monthly trend data
const MONTHLY_PROCUREMENT_TRENDS = [
  { month: 'Jun', spend: 32.4, budget: 40.0, orders: 18 },
  { month: 'Jul', spend: 38.6, budget: 42.0, orders: 22 },
  { month: 'Aug', spend: 41.2, budget: 45.0, orders: 26 },
  { month: 'Sep', spend: 44.8, budget: 46.0, orders: 29 },
  { month: 'Oct', spend: 47.5, budget: 48.0, orders: 31 },
  { month: 'Nov', spend: 48.5, budget: 50.0, orders: 34 },
];

export const PurchaseOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    departments,
    suppliers,
    orders,
    bills,
    totalProcurementSpend,
    totalOrdersCount,
    pendingApprovalsCount,
    pendingDeliveriesCount,
    totalOutstandingPayables,
  } = usePurchaseStore();

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'departments' | 'trends' | 'suppliers' | 'deliveries'>('departments');

  const filteredDepts = departments.filter(
    (d) => selectedDept === 'ALL' || d.deptName === selectedDept
  );

  // Top suppliers by spend
  const topSuppliersList = [...suppliers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  // Active upcoming deliveries
  const upcomingDeliveriesList = orders
    .filter((o) => o.approvalStatus === 'Approved' && o.grnStatus !== 'Completely Received')
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Purchase & Procurement Overview"
        subtitle="Consolidated real-time monitoring of procurement expenditure, department budgets, approvals, and supplier execution."
        icon={<ShoppingCart size={20} />}
        searchPlaceholder="Filter purchase metrics..."
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              icon={<FileSpreadsheet size={14} />}
              onClick={() => message.success('Exporting Procurement Master Ledger...')}
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                borderColor: '#ECE8F6',
                color: '#4B5563',
                height: 36,
                padding: '0 14px',
                backgroundColor: '#FFFFFF',
              }}
            >
              Export Report
            </Button>
            <Button
              icon={<TrendingUp size={14} />}
              onClick={() => navigate('/app/sales/purchase-analytics')}
              style={{
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 12,
                borderColor: '#DDD6FE',
                color: '#5421A8',
                backgroundColor: '#F5F3FF',
                height: 36,
                padding: '0 14px',
              }}
            >
              Analytics
            </Button>
          </div>
        }
      />

      {/* 2. Top 4 High-Impact KPI Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Procurement Spend',
            value: `₹${(totalProcurementSpend / 100000).toFixed(1)} Lakhs`,
            growth: `${totalOrdersCount} POs Total`,
            isDark: true,
            icon: <ShoppingCart size={20} color="#5421A8" />,
            pillExtra: 'Approved',
          },
          {
            title: 'Pending Approvals',
            value: `${pendingApprovalsCount} Orders`,
            growth: 'Needs Action',
            isPositive: false,
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Workflow',
          },
          {
            title: 'Pending Deliveries',
            value: `${pendingDeliveriesCount} In Transit`,
            growth: 'GRN Awaited',
            isDark: true,
            icon: <Truck size={20} color="#0284C7" />,
            pillExtra: 'Shipments',
          },
          {
            title: 'Outstanding Payables',
            value: `₹${(totalOutstandingPayables / 100000).toFixed(2)}L`,
            growth: `${suppliers.length} Vendors`,
            isPositive: true,
            isDark: false,
            icon: <CreditCard size={20} color="#6D28D9" />,
            pillExtra: 'Due Bills',
          },
        ]}
      />

      {/* 3. Main Consolidated Content Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #EAE5F5',
          boxShadow: '0 8px 30px rgba(84, 33, 168, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Card Header & Controls */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #F1EDF9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 100%)',
          }}
        >
          {/* Left Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
              }}
            >
              {activeTab === 'departments' ? (
                <Building size={20} />
              ) : activeTab === 'trends' ? (
                <TrendingUp size={20} />
              ) : activeTab === 'suppliers' ? (
                <Users size={20} />
              ) : (
                <Truck size={20} />
              )}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                {activeTab === 'departments'
                  ? 'Department Procurement & Budget Allocation'
                  : activeTab === 'trends'
                  ? 'Monthly Spend & Budget Variance Trends'
                  : activeTab === 'suppliers'
                  ? 'Top Supplier Spend & Benchmark Performance'
                  : 'Upcoming Consignment Deliveries & Tracking'}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginTop: 1 }}>
                {activeTab === 'departments'
                  ? 'Real-time allocation, spend, budget utilization percentage across all 5 key departments'
                  : activeTab === 'trends'
                  ? '6-month rolling procurement expenditure vs allocated financial budget limits'
                  : activeTab === 'suppliers'
                  ? 'Strategic supplier partner volume, delivery compliance rating, and payment standing'
                  : 'Active purchase orders dispatched by suppliers awaiting warehouse GRN receipt'}
              </div>
            </div>
          </div>

          {/* Right Controls: Tab Switcher & Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                background: '#F1EDF9',
                padding: 3,
                borderRadius: 14,
                border: '1px solid #E5DEFF',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('departments')}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === 'departments' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'departments' ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === 'departments' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Building size={14} /> Departments ({departments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('trends')}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === 'trends' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'trends' ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === 'trends' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <TrendingUp size={14} /> Monthly Trends
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('suppliers')}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === 'suppliers' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'suppliers' ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === 'suppliers' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Users size={14} /> Top Suppliers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deliveries')}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === 'deliveries' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'deliveries' ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === 'deliveries' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Truck size={14} /> Deliveries ({upcomingDeliveriesList.length})
              </button>
            </div>

            {activeTab === 'departments' && (
              <Select
                value={selectedDept}
                onChange={setSelectedDept}
                style={{ width: 220, height: 34 }}
                options={[
                  { label: 'All Departments', value: 'ALL' },
                  ...departments.map((d) => ({ label: d.deptName, value: d.deptName })),
                ]}
              />
            )}
          </div>
        </div>

        {/* Tab 1: Department-Wise Table */}
        {activeTab === 'departments' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', width: 260 }}>
                    Department & Head
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'center', width: 110 }}>
                    Orders
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', width: 140 }}>
                    Total Spend
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', width: 140 }}>
                    Budget Allocation
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', minWidth: 200 }}>
                    Budget Utilization
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'center', width: 130 }}>
                    Pending Inward
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'right', width: 100 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.map((d, idx) => {
                  const utilization = Math.round((d.actualSpend / d.allocatedBudget) * 100);
                  const isNearCap = utilization > 80;
                  return (
                    <tr
                      key={d.deptCode}
                      style={{
                        transition: 'background-color 0.15s ease',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                      }
                    >
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                              border: '1px solid #DDD6FE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#5421A8',
                              fontWeight: 800,
                              fontSize: 11,
                              flexShrink: 0,
                            }}
                          >
                            {d.deptCode}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>
                              {d.deptName}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                              <span>Head:</span>
                              <strong style={{ color: '#475569' }}>{d.deptHead}</strong>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 12,
                            background: '#F1EDF9',
                            color: '#5421A8',
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {d.ordersCount} POs
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 13.5 }}>
                          ₹{d.actualSpend.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                          {((d.actualSpend / (totalProcurementSpend || 1)) * 100).toFixed(1)}% of total
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#334155', fontSize: 13 }}>
                          ₹{d.allocatedBudget.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                          Remaining: ₹{(d.allocatedBudget - d.actualSpend).toLocaleString()}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ width: '100%', maxWidth: 220 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                            <span style={{ color: isNearCap ? '#D97706' : '#5421A8' }}>
                              {utilization}% Used
                            </span>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: isNearCap ? '#B45309' : '#059669',
                                padding: '1px 6px',
                                borderRadius: 8,
                                background: isNearCap ? '#FEF3C7' : '#D1FAE5',
                              }}
                            >
                              {d.status}
                            </span>
                          </div>
                          <Progress
                            percent={utilization}
                            size="small"
                            strokeColor={isNearCap ? '#F59E0B' : '#7544D6'}
                            railColor="#EDE9FE"
                            showInfo={false}
                          />
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        {d.pendingDeliveries > 0 ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '3px 10px',
                              borderRadius: 12,
                              background: '#E0F2FE',
                              color: '#0284C7',
                              fontWeight: 700,
                              fontSize: 11.5,
                            }}
                          >
                            <Truck size={12} />
                            {d.pendingDeliveries} In Transit
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '3px 10px',
                              borderRadius: 12,
                              background: '#D1FAE5',
                              color: '#059669',
                              fontWeight: 700,
                              fontSize: 11.5,
                            }}
                          >
                            <CheckCircle2 size={12} />
                            Cleared
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/app/sales/purchase-orders')}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#5421A8',
                            fontWeight: 700,
                            fontSize: 12,
                            padding: '4px 8px',
                            borderRadius: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EDE9FE')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          Orders <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Monthly Procurement Trends Chart */}
        {activeTab === 'trends' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>
                  Procurement Spend vs Monthly Budget Ceiling (in ₹ Lakhs)
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#64748B' }}>
                  Track expenditure velocity against authorized company capital allocation
                </p>
              </div>
            </div>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_PROCUREMENT_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} unit="L" />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="spend" name="Actual Spend (₹L)" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                  <Area type="monotone" dataKey="budget" name="Approved Budget (₹L)" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorBudget)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Top Suppliers Leaderboard */}
        {activeTab === 'suppliers' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Supplier Name</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Type & GSTIN</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Total POs</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Total Spend</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Outstanding Balance</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>On-Time Rate</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {topSuppliersList.map((sup, idx) => (
                  <tr key={sup.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{sup.supplierName}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{sup.city}, {sup.state}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color="purple">{sup.supplierType}</Tag>
                      <div style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#6B7280', marginTop: 2 }}>{sup.gstin}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center', fontWeight: 800, color: '#5421A8' }}>
                      {sup.totalOrders}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontWeight: 800, color: '#1E1B4B' }}>
                      ₹{sup.totalSpend.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontWeight: 800, color: sup.outstandingBalance > 0 ? '#DC2626' : '#10B981' }}>
                      ₹{sup.outstandingBalance.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag color="cyan">{sup.onTimeDeliveryRate}%</Tag>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <Tag color="success">{sup.complianceStatus}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Upcoming Deliveries */}
        {activeTab === 'deliveries' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>PO Number</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Supplier</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Expected Date</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Warehouse</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6' }}>Order Value</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>GRN Status</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDeliveriesList.map((po, idx) => (
                  <tr key={po.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', fontWeight: 800, color: '#5421A8' }}>
                      {po.poNumber}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontWeight: 700, color: '#1E1B4B' }}>
                      {po.supplierName}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', color: '#64748B', fontSize: 12 }}>
                      {po.expectedDeliveryDate}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', color: '#475569', fontSize: 12 }}>
                      {po.deliveryWarehouse}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontWeight: 800, color: '#1E1B4B' }}>
                      ₹{po.grossTotal.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag color="orange">{po.grnStatus}</Tag>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <Button
                        size="small"
                        type="primary"
                        style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED', borderRadius: 8, fontSize: 11 }}
                        onClick={() => navigate('/app/sales/grn')}
                      >
                        Create GRN
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary Strip */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #F1EDF9',
            background: '#FAF9FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#64748B',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#5421A8" />
            <span>Audit-compliant statutory procurement tracking active. FY 2026-27 Q3.</span>
          </div>
          <div>
            Connected to Live Procurement Store: <strong style={{ color: '#5421A8' }}>{orders.length} Orders</strong> &bull; <strong style={{ color: '#10B981' }}>{suppliers.length} Verified Suppliers</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
