import React, { useState } from 'react';
import {
  Table,
  Tag,
  Progress,
  Button,
  Select,
  Tooltip,
  message,
  Tabs,
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
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useNavigate } from 'react-router-dom';

export const PurchaseOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'departments' | 'buyers'>('departments');

  // Summary Metrics
  const totalPO = 142;
  const totalSpend = 4850000;
  const pendingApprovals = 6;
  const pendingDeliveries = 14;
  const outstandingPayments = 1250000;
  const totalSuppliers = 28;

  // Department-Wise Purchase Summary
  const departmentData = [
    {
      key: '1',
      deptCode: 'MFG-01',
      deptName: 'Manufacturing & Production',
      deptHead: 'Rajesh Khanna',
      headEmail: 'rajesh.k@company.com',
      totalOrders: 58,
      totalSpend: 2450000,
      budgetAllocated: 3000000,
      utilizationPercent: 81.6,
      pendingDeliveries: 6,
      status: 'High Volume',
    },
    {
      key: '2',
      deptCode: 'RND-02',
      deptName: 'R&D and Engineering',
      deptHead: 'Dr. S. Ramanathan',
      headEmail: 's.ramanathan@company.com',
      totalOrders: 32,
      totalSpend: 1120000,
      budgetAllocated: 1500000,
      utilizationPercent: 74.6,
      pendingDeliveries: 3,
      status: 'On Target',
    },
    {
      key: '3',
      deptCode: 'OPS-03',
      deptName: 'Operations & Maintenance',
      deptHead: 'Gokul Chandran',
      headEmail: 'gokul.c@company.com',
      totalOrders: 28,
      totalSpend: 780000,
      budgetAllocated: 1000000,
      utilizationPercent: 78.0,
      pendingDeliveries: 4,
      status: 'On Target',
    },
    {
      key: '4',
      deptCode: 'IT-04',
      deptName: 'IT & Infrastructure',
      deptHead: 'Kavitha Murugan',
      headEmail: 'kavitha.m@company.com',
      totalOrders: 16,
      totalSpend: 380000,
      budgetAllocated: 600000,
      utilizationPercent: 63.3,
      pendingDeliveries: 1,
      status: 'Under Budget',
    },
    {
      key: '5',
      deptCode: 'ADM-05',
      deptName: 'Administration & Facility',
      deptHead: 'Anand Kumar',
      headEmail: 'anand.k@company.com',
      totalOrders: 8,
      totalSpend: 120000,
      budgetAllocated: 250000,
      utilizationPercent: 48.0,
      pendingDeliveries: 0,
      status: 'Optimal',
    },
  ];

  // Buyer / Employee Purchasing Performance
  const employeeData = [
    {
      key: 'e1',
      empId: 'EMP-1021',
      empName: 'Suresh Varma',
      role: 'Senior Procurement Lead',
      dept: 'Manufacturing & Production',
      ordersCreated: 24,
      totalNegotiatedSpend: 1180000,
      negotiatedSavings: 84000,
      savingsPercent: '6.6%',
      onTimeDeliveryRate: 94,
    },
    {
      key: 'e2',
      empId: 'EMP-1044',
      empName: 'Meenakshi Iyer',
      role: 'Procurement Specialist',
      dept: 'Manufacturing & Production',
      ordersCreated: 19,
      totalNegotiatedSpend: 820000,
      negotiatedSavings: 52000,
      savingsPercent: '6.0%',
      onTimeDeliveryRate: 96,
    },
    {
      key: 'e3',
      empId: 'EMP-1088',
      empName: 'Karthik Raja',
      role: 'Technical Sourcing Engineer',
      dept: 'R&D and Engineering',
      ordersCreated: 21,
      totalNegotiatedSpend: 740000,
      negotiatedSavings: 68000,
      savingsPercent: '8.4%',
      onTimeDeliveryRate: 91,
    },
    {
      key: 'e4',
      empId: 'EMP-1102',
      empName: 'Deepa Natarajan',
      role: 'Operations Buyer',
      dept: 'Operations & Maintenance',
      ordersCreated: 15,
      totalNegotiatedSpend: 420000,
      negotiatedSavings: 31000,
      savingsPercent: '6.9%',
      onTimeDeliveryRate: 98,
    },
  ];

  const filteredDepts = departmentData.filter(
    (d) => selectedDept === 'ALL' || d.deptName === selectedDept
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Purchase & Procurement Overview"
        subtitle="Consolidated real-time monitoring of procurement expenditure, department budgets, approvals, and supplier execution."
        icon={<ShoppingCart size={20} />}
        searchPlaceholder="Filter purchase metrics..."
        primaryActionLabel="New Purchase Order"
        onPrimaryAction={() => navigate('/app/sales/purchase-orders')}
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
            value: `₹${(totalSpend / 100000).toFixed(1)} Lakhs`,
            growth: `${totalPO} Orders`,
            isDark: true,
            icon: <ShoppingCart size={20} color="#5421A8" />,
          },
          {
            title: 'Pending Approvals',
            value: `${pendingApprovals} Orders`,
            growth: 'Action Required',
            isPositive: false,
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Pending Deliveries',
            value: `${pendingDeliveries} In Transit`,
            growth: 'GRN Awaited',
            isDark: true,
            icon: <Truck size={20} color="#0284C7" />,
          },
          {
            title: 'Outstanding Payables',
            value: `₹${(outstandingPayments / 100000).toFixed(2)}L`,
            growth: `${totalSuppliers} Active Vendors`,
            isPositive: true,
            isDark: false,
            icon: <CreditCard size={20} color="#6D28D9" />,
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
          {/* Left Title with Pill Switcher */}
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
              {activeTab === 'departments' ? <Building size={20} /> : <Users size={20} />}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                {activeTab === 'departments'
                  ? 'Department Procurement & Budget Monitoring'
                  : 'Procurement Buyer & Negotiation Performance'}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginTop: 1 }}>
                {activeTab === 'departments'
                  ? 'Real-time allocation, spend, budget utilization percentage, and pending inward shipments'
                  : 'Track individual buyer savings, order volume, and supplier delivery compliance'}
              </div>
            </div>
          </div>

          {/* Right Controls: Tab Switcher & Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Elegant Segmented Switcher */}
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
                <Building size={14} />
                Departments ({departmentData.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('buyers')}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === 'buyers' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'buyers' ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === 'buyers' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Users size={14} />
                Buyers & Negotiation ({employeeData.length})
              </button>
            </div>

            {/* Department Filter (Visible when departments tab is active) */}
            {activeTab === 'departments' && (
              <Select
                value={selectedDept}
                onChange={setSelectedDept}
                style={{ width: 200, height: 34 }}
                options={[
                  { label: 'All Departments', value: 'ALL' },
                  { label: 'Manufacturing & Production', value: 'Manufacturing & Production' },
                  { label: 'R&D and Engineering', value: 'R&D and Engineering' },
                  { label: 'Operations & Maintenance', value: 'Operations & Maintenance' },
                  { label: 'IT & Infrastructure', value: 'IT & Infrastructure' },
                  { label: 'Administration & Facility', value: 'Administration & Facility' },
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
                  <th
                    style={{
                      padding: '12px 20px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 260,
                    }}
                  >
                    Department & Head
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'center',
                      width: 110,
                    }}
                  >
                    Orders
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 140,
                    }}
                  >
                    Total Spend
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 140,
                    }}
                  >
                    Budget Allocation
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      minWidth: 200,
                    }}
                  >
                    Budget Utilization
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'center',
                      width: 130,
                    }}
                  >
                    Pending Inward
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'right',
                      width: 100,
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                      No department data matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredDepts.map((d, idx) => {
                    const isNearCap = d.utilizationPercent > 80;
                    return (
                      <tr
                        key={d.key}
                        style={{
                          transition: 'background-color 0.15s ease',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                        }
                      >
                        {/* 1. Department & Head */}
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

                        {/* 2. Total Orders */}
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
                            {d.totalOrders} POs
                          </span>
                        </td>

                        {/* 3. Total Spend */}
                        <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                          <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 13.5 }}>
                            ₹{d.totalSpend.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                            {((d.totalSpend / totalSpend) * 100).toFixed(1)}% of total
                          </div>
                        </td>

                        {/* 4. Budget Allocation */}
                        <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                          <div style={{ fontWeight: 700, color: '#334155', fontSize: 13 }}>
                            ₹{d.budgetAllocated.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                            Remaining: ₹{(d.budgetAllocated - d.totalSpend).toLocaleString()}
                          </div>
                        </td>

                        {/* 5. Budget Utilization */}
                        <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                          <div style={{ width: '100%', maxWidth: 220 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 4 }}>
                              <span style={{ color: isNearCap ? '#D97706' : '#5421A8' }}>
                                {d.utilizationPercent}% Used
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
                              percent={d.utilizationPercent}
                              size="small"
                              strokeColor={isNearCap ? '#F59E0B' : '#7544D6'}
                              trailColor="#EDE9FE"
                              showInfo={false}
                            />
                          </div>
                        </td>

                        {/* 6. Pending Inward */}
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

                        {/* 7. Action */}
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
                              transition: 'all 0.15s ease',
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
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Buyers & Negotiation Table */}
        {activeTab === 'buyers' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th
                    style={{
                      padding: '12px 20px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 250,
                    }}
                  >
                    Buyer Details
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 200,
                    }}
                  >
                    Assigned Division
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'center',
                      width: 110,
                    }}
                  >
                    Orders Executed
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 150,
                    }}
                  >
                    Negotiated Spend
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      width: 170,
                    }}
                  >
                    Price Savings Achieved
                  </th>
                  <th
                    style={{
                      padding: '12px 18px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'center',
                      width: 150,
                    }}
                  >
                    Supplier On-Time Rate
                  </th>
                  <th
                    style={{
                      padding: '12px 20px',
                      fontSize: 11,
                      color: '#64748B',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid #ECE8F6',
                      textAlign: 'right',
                      width: 120,
                    }}
                  >
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((emp, idx) => (
                  <tr
                    key={emp.key}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    {/* 1. Buyer Details */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {emp.empName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>
                            {emp.empName}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
                            {emp.role} • {emp.empId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Assigned Division */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                        {emp.dept}
                      </span>
                    </td>

                    {/* 3. Orders Executed */}
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
                        {emp.ordersCreated} POs
                      </span>
                    </td>

                    {/* 4. Negotiated Spend */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>
                        ₹{emp.totalNegotiatedSpend.toLocaleString()}
                      </div>
                    </td>

                    {/* 5. Negotiated Savings */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: '#D1FAE5',
                          color: '#059669',
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        +₹{emp.negotiatedSavings.toLocaleString()} ({emp.savingsPercent})
                      </span>
                    </td>

                    {/* 6. On-Time Delivery Rate */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            background: '#F3E8FF',
                            color: '#6B21A8',
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {emp.onTimeDeliveryRate}%
                        </span>
                      </div>
                    </td>

                    {/* 7. Rating */}
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          color: '#F59E0B',
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        <Award size={14} /> Top Buyer
                      </span>
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
            Showing <strong style={{ color: '#5421A8' }}>{activeTab === 'departments' ? filteredDepts.length : employeeData.length}</strong> active records
          </div>
        </div>
      </div>
    </div>
  );
};
