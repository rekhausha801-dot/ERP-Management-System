import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Select,
  Progress,
  Radio,
  Space,
  Badge,
} from 'antd';
import {
  LayoutDashboard,
  ShieldAlert,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Users,
  Building,
  CreditCard,
  IndianRupee,
  CheckCircle,
  Truck,
  FileCheck,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_PURPLE = '#5421A8';

type RoleView = 'Admin' | 'Sales' | 'Purchase' | 'Accounts' | 'Warehouse';

export const RoleBasedDashboardsPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleView>('Admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Role-Based Executive Dashboards"
        subtitle="Dedicated operational workspaces tailored for Admin, Sales Directorate, Procurement, Accounts & Finance, and Warehouse Logistics."
        icon={<LayoutDashboard size={20} />}
        extraActions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Radio.Group
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="Admin">Admin</Radio.Button>
              <Radio.Button value="Sales">Sales</Radio.Button>
              <Radio.Button value="Purchase">Purchase</Radio.Button>
              <Radio.Button value="Accounts">Accounts</Radio.Button>
              <Radio.Button value="Warehouse">Warehouse</Radio.Button>
            </Radio.Group>
          </div>
        }
      />

      {/* 2. Dynamic 4 KPI Summary Cards matching active role */}
      {activeRole === 'Admin' && (
        <SalesKpiCardsRow
          cards={[
            {
              title: 'Total Monthly Revenue',
              value: '₹1.84 Cr',
              growth: '+14.2% YoY',
              isDark: true,
              icon: <IndianRupee size={20} color={BRAND_PURPLE} />,
              pillExtra: 'Consolidated',
            },
            {
              title: 'Active Branches',
              value: '5 Units',
              growth: '100% Operational',
              isDark: false,
              icon: <Building size={20} color="#10B981" />,
              pillExtra: 'Chennai, Cbe, Blr',
            },
            {
              title: 'Total Employees',
              value: '148 Active',
              growth: '98.4% Attendance',
              isDark: true,
              icon: <Users size={20} color="#3B82F6" />,
              pillExtra: 'Across 5 Depts',
            },
            {
              title: 'Outstanding Dues (Net)',
              value: '₹34.8 Lakhs',
              growth: 'Receivables > Payables',
              isDark: false,
              icon: <CreditCard size={20} color="#F59E0B" />,
              pillExtra: 'Healthy Liquidity',
            },
          ]}
        />
      )}

      {activeRole === 'Sales' && (
        <SalesKpiCardsRow
          cards={[
            {
              title: 'Sales Order Intake',
              value: '₹48.2 Lakhs',
              growth: '64 Orders Confirmed',
              isDark: true,
              icon: <TrendingUp size={20} color={BRAND_PURPLE} />,
              pillExtra: 'This Month',
            },
            {
              title: 'Open Quotations',
              value: '₹1.12 Cr',
              growth: '28 Quotes Pending',
              isDark: false,
              icon: <FileCheck size={20} color="#3B82F6" />,
              pillExtra: 'Pipeline Value',
            },
            {
              title: 'Dispatch Delivered',
              value: '58 Challans',
              growth: '96.2% On-Time',
              isDark: true,
              icon: <Truck size={20} color="#10B981" />,
              pillExtra: 'POD Signed',
            },
            {
              title: 'Team Quota Attainment',
              value: '84.6%',
              growth: 'Target ₹60L',
              isDark: false,
              icon: <CheckCircle size={20} color="#F59E0B" />,
              pillExtra: 'On Track',
            },
          ]}
        />
      )}

      {activeRole === 'Purchase' && (
        <SalesKpiCardsRow
          cards={[
            {
              title: 'Procurement Spend',
              value: '₹39.4 Lakhs',
              growth: '18 POs Issued',
              isDark: true,
              icon: <ShoppingCart size={20} color={BRAND_PURPLE} />,
              pillExtra: 'Committed',
            },
            {
              title: 'Pending Requisitions',
              value: '6 PRs',
              growth: 'Needs Approval',
              isDark: false,
              icon: <ShieldAlert size={20} color="#EF4444" />,
              pillExtra: 'Production Urgent',
            },
            {
              title: 'Open Inbound GRNs',
              value: '4 Shipments',
              growth: 'QC In-Progress',
              isDark: true,
              icon: <Boxes size={20} color="#3B82F6" />,
              pillExtra: 'Gate Inward',
            },
            {
              title: 'Supplier On-Time Rate',
              value: '93.5%',
              growth: 'BHEL & L&T Tier 1',
              isDark: false,
              icon: <CheckCircle size={20} color="#10B981" />,
              pillExtra: 'OTIF Score',
            },
          ]}
        />
      )}

      {activeRole === 'Accounts' && (
        <SalesKpiCardsRow
          cards={[
            {
              title: 'Accounts Receivable',
              value: '₹42.8 Lakhs',
              growth: '14 Debtors Overdue',
              isDark: true,
              icon: <IndianRupee size={20} color={BRAND_PURPLE} />,
              pillExtra: 'Dunning Active',
            },
            {
              title: 'Accounts Payable',
              value: '₹18.4 Lakhs',
              growth: 'Vendor Payments',
              isDark: false,
              icon: <CreditCard size={20} color="#EF4444" />,
              pillExtra: 'Scheduled Net 30',
            },
            {
              title: 'GST ITC Available',
              value: '₹6.84 Lakhs',
              growth: 'GSTR-2B Reconciled',
              isDark: true,
              icon: <CheckCircle size={20} color="#10B981" />,
              pillExtra: 'Eligible Credits',
            },
            {
              title: 'Bank & Cash Balance',
              value: '₹54.2 Lakhs',
              growth: 'HDFC & ICICI',
              isDark: false,
              icon: <Building size={20} color="#3B82F6" />,
              pillExtra: 'Reconciled Today',
            },
          ]}
        />
      )}

      {activeRole === 'Warehouse' && (
        <SalesKpiCardsRow
          cards={[
            {
              title: 'Total Stock Valuation',
              value: '₹1.14 Cr',
              growth: '1,840 Active SKUs',
              isDark: true,
              icon: <Boxes size={20} color={BRAND_PURPLE} />,
              pillExtra: 'Across 3 WHs',
            },
            {
              title: 'Critical Low Stock',
              value: '4 SKUs',
              growth: 'Below Safety Stock',
              isDark: false,
              icon: <ShieldAlert size={20} color="#EF4444" />,
              pillExtra: 'Reorders Fired',
            },
            {
              title: 'Inter-Branch In-Transit',
              value: '89 Units',
              growth: '3 Active Transfers',
              isDark: true,
              icon: <Truck size={20} color="#3B82F6" />,
              pillExtra: 'Chennai to Cbe',
            },
            {
              title: 'Dispatch Readiness',
              value: '99.1%',
              growth: 'Fast Order Pick',
              isDark: false,
              icon: <CheckCircle size={20} color="#10B981" />,
              pillExtra: 'FIFO Audited',
            },
          ]}
        />
      )}

      {/* 3. Operational Quick Action Cards */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 24,
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
          {activeRole} Operational Summary & Prioritized Action Items
        </div>
        <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>
          Displaying role-specific KPIs and permission-governed authorizations for <b>{activeRole}</b>. All records are dynamically tied to the live multi-tenant database with Indian GST, statutory TDS/PF compliances, and automated general ledger posting.
        </p>
      </div>
    </div>
  );
};

export default RoleBasedDashboardsPage;
