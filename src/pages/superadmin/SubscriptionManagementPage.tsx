import React, { useState } from 'react';
import {
  Table,
  Tag,
  Typography,
  Button,
  Space,
  Card,
  Row,
  Col,
  Input,
  Select,
  Tooltip,
  message,
} from 'antd';
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Plus,
  RefreshCw,
  Building,
  TrendingUp,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { StatusBadge } from '../../components';
import { MOCK_SUBSCRIPTIONS } from '../../mock/erpData';

const { Text } = Typography;

export const SubscriptionManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredData = MOCK_SUBSCRIPTIONS.filter((sub) => {
    const matchesSearch =
      sub.companyName.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.toLowerCase().includes(search.toLowerCase()) ||
      sub.billingCycle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalARR = MOCK_SUBSCRIPTIONS.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const activeCount = MOCK_SUBSCRIPTIONS.filter((s) => s.status.toLowerCase() === 'active').length;

  const columns = [
    {
      title: 'Company / Tenant',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13.5 }}>{text}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Tenant ID: TNT-{text.slice(0, 3).toUpperCase()}-2026</div>
        </div>
      ),
    },
    {
      title: 'ERP Package',
      dataIndex: 'packageType',
      key: 'packageType',
      render: (pkg: any) => {
        const pkgText = typeof pkg === 'string' ? pkg : pkg?.name || 'COMPLETE ERP';
        return (
          <Tag
            style={{
              background: '#EDE9FE',
              color: '#5421A8',
              border: '1px solid #DDD6FE',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 11,
              padding: '2px 10px',
            }}
          >
            {pkgText}
          </Tag>
        );
      },
    },
    {
      title: 'Plan Frequency',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => (
        <span
          style={{
            background: '#E0F2FE',
            color: '#0369A1',
            borderRadius: 6,
            padding: '2px 8px',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          {plan}
        </span>
      ),
    },
    {
      title: 'Billing Cycle',
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (bc: string) => <span style={{ color: '#475569', fontSize: 12 }}>{bc}</span>,
    },
    {
      title: 'Amount (Contract ARR)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => (
        <div>
          <div style={{ fontWeight: 900, color: '#5421A8', fontSize: 14 }}>
            ₹{amount.toLocaleString()}
          </div>
          <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>{record.currency || 'INR'} / Annual</div>
        </div>
      ),
    },
    {
      title: 'Next Renewal Date',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
      render: (date: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontWeight: 600, fontSize: 12 }}>
          <Calendar size={13} color="#6D28D9" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={status === 'Active' ? 'success' : 'warning'}
          style={{ borderRadius: 10, fontWeight: 800, padding: '1px 10px' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            style={{ color: '#5421A8', fontWeight: 700, fontSize: 11.5 }}
            onClick={() => message.info('Subscription contract details opened')}
          >
            Manage
          </Button>
          <Button
            type="text"
            size="small"
            style={{ color: '#0284C7', fontWeight: 700, fontSize: 11.5 }}
            onClick={() => message.success('Invoice receipt PDF downloaded')}
          >
            Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar matching Sales Dashboard */}
      <SalesModuleHeader
        title="Subscriptions & Tenant Billing"
        subtitle="Manage SaaS recurring revenue, contract renewals, license keys, and billing cycles across enterprise tenants."
        icon={<CreditCard size={20} />}
        searchPlaceholder="Search tenant company, plan, billing cycle..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Subscription"
        onPrimaryAction={() => message.info('Provision New Tenant Subscription Drawer')}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting SaaS ARR ledger...')}
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
            Export ARR Report
          </Button>
        }
      />

      {/* 2. Top 4 High-Impact Metric Cards matching Sales Dashboard Exactly */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Annual Contract Value',
            value: `₹${(totalARR / 100000).toFixed(2)}L`,
            growth: '+18.5%',
            isDark: true,
            icon: <CreditCard size={20} color="#5421A8" />,
          },
          {
            title: 'Active Subscriptions',
            value: `${activeCount} Accounts`,
            growth: '100% Retained',
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Upcoming Renewals',
            value: '1 Renewal',
            growth: 'Next 30 Days',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Net Revenue Retention',
            value: '108.4%',
            growth: 'Expanding',
            isPositive: true,
            isDark: false,
            icon: <TrendingUp size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Table Container */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #ECE8F6',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
          overflow: 'hidden',
        }}
      >
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};
