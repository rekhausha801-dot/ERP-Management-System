import React, { useState } from 'react';
import {
  Card,
  Table,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Checkbox,
  Input,
  Select,
  Tooltip,
  Badge,
  message,
} from 'antd';
import {
  ShieldCheck,
  Shield,
  KeyRound,
  Save,
  Lock,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  Eye,
  Sliders,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

interface PermissionRow {
  module: string;
  desc: string;
  scope: 'SALES' | 'SERVICE' | 'COMMON' | 'SUPERADMIN';
  superadmin: boolean;
  admin: boolean;
  sales_manager: boolean;
  service_manager: boolean;
  staff: boolean;
}

const DEFAULT_PERMISSIONS: PermissionRow[] = [
  {
    module: 'Company Provisioning & Tenant Setup',
    desc: 'Multi-tenant creation, database isolation, subscription plan allocation',
    scope: 'SUPERADMIN',
    superadmin: true,
    admin: false,
    sales_manager: false,
    service_manager: false,
    staff: false,
  },
  {
    module: 'Subscriptions, Billing & Invoicing Engine',
    desc: 'License renewals, recurring billing, GST payment gateways',
    scope: 'SUPERADMIN',
    superadmin: true,
    admin: false,
    sales_manager: false,
    service_manager: false,
    staff: false,
  },
  {
    module: 'Platform Audit Logs & Forensics',
    desc: 'Immutable system event tracing, login trails, security alerts',
    scope: 'SUPERADMIN',
    superadmin: true,
    admin: false,
    sales_manager: false,
    service_manager: false,
    staff: false,
  },
  {
    module: 'CRM, Pipeline & Enquiries Management',
    desc: 'Lead prospecting, qualification, enquiry assignments, customer contacts',
    scope: 'SALES',
    superadmin: true,
    admin: true,
    sales_manager: true,
    service_manager: false,
    staff: false,
  },
  {
    module: 'Quotations, Proforma & Sales Orders',
    desc: 'Price estimates, approvals, order confirmations and tracking',
    scope: 'SALES',
    superadmin: true,
    admin: true,
    sales_manager: true,
    service_manager: false,
    staff: false,
  },
  {
    module: 'Commercial GST Invoices & Payment Collections',
    desc: 'GSTR-1 tax invoicing, credit notes, receipts, reconciliation',
    scope: 'SALES',
    superadmin: true,
    admin: true,
    sales_manager: true,
    service_manager: false,
    staff: false,
  },
  {
    module: 'Product Catalog & Stock Inventory',
    desc: 'Warehouse stock balances, price lists, SKU adjustments',
    scope: 'SALES',
    superadmin: true,
    admin: true,
    sales_manager: true,
    service_manager: false,
    staff: true,
  },
  {
    module: 'Service Tickets, Helpdesk & SLAs',
    desc: 'Customer complaint lodging, resolution workflows, escalations',
    scope: 'SERVICE',
    superadmin: true,
    admin: true,
    sales_manager: false,
    service_manager: true,
    staff: true,
  },
  {
    module: 'Field Job Scheduling & Tech Dispatch',
    desc: 'Engineer route planning, on-site diagnostics, digital job cards',
    scope: 'SERVICE',
    superadmin: true,
    admin: true,
    sales_manager: false,
    service_manager: true,
    staff: false,
  },
  {
    module: 'AMC Contracts, Warranties & Renewals',
    desc: 'Annual maintenance agreements, equipment schedules, preventive checks',
    scope: 'SERVICE',
    superadmin: true,
    admin: true,
    sales_manager: false,
    service_manager: true,
    staff: false,
  },
  {
    module: 'Spare Parts & Service Labour Billing',
    desc: 'Job-wise component consumption, labour charges, service invoicing',
    scope: 'SERVICE',
    superadmin: true,
    admin: true,
    sales_manager: false,
    service_manager: true,
    staff: false,
  },
  {
    module: 'Organization Profile & User Master',
    desc: 'Corporate branches, employee profiles, access tokens, policy config',
    scope: 'COMMON',
    superadmin: true,
    admin: true,
    sales_manager: false,
    service_manager: false,
    staff: false,
  },
];

export const RolesPermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_PERMISSIONS);
  const [search, setSearch] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('ALL');

  const filteredPermissions = permissions.filter((row) => {
    const matchesSearch =
      row.module.toLowerCase().includes(search.toLowerCase()) ||
      row.desc.toLowerCase().includes(search.toLowerCase());
    const matchesScope = selectedScope === 'ALL' || row.scope === selectedScope;
    return matchesSearch && matchesScope;
  });

  const togglePermission = (index: number, role: keyof PermissionRow) => {
    const updated = [...permissions];
    if (role !== 'module' && role !== 'desc' && role !== 'scope' && role !== 'superadmin') {
      (updated[index][role] as boolean) = !(updated[index][role] as boolean);
      setPermissions(updated);
    }
  };

  const scopeBadgeColor = (scope: string) => {
    switch (scope) {
      case 'SUPERADMIN':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      case 'SALES':
        return { bg: '#EDE9FE', text: '#5421A8', border: '#DDD6FE' };
      case 'SERVICE':
        return { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' };
      default:
        return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
    }
  };

  const columns = [
    {
      title: 'ERP Feature Module',
      dataIndex: 'module',
      key: 'module',
      width: 340,
      render: (text: string, record: PermissionRow) => {
        const badge = scopeBadgeColor(record.scope);
        return (
          <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13.5 }}>{text}</span>
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3, lineHeight: 1.4 }}>
              {record.desc}
            </div>
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  background: badge.bg,
                  color: badge.text,
                  border: `1px solid ${badge.border}`,
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  display: 'inline-block',
                }}
              >
                {record.scope} MODULE
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 12.5 }}>Super Admin</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Unrestricted</div>
        </div>
      ),
      dataIndex: 'superadmin',
      key: 'superadmin',
      width: 130,
      align: 'center' as const,
      render: (checked: boolean) => (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
          }}
        >
          <Lock size={15} color="#64748B" />
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 12.5 }}>Company Admin</div>
          <div style={{ fontSize: 10, color: '#7544D6', fontWeight: 600 }}>Tenant Executive</div>
        </div>
      ),
      dataIndex: 'admin',
      key: 'admin',
      width: 140,
      align: 'center' as const,
      render: (checked: boolean, record: PermissionRow, index: number) => (
        <div
          onClick={() => togglePermission(index, 'admin')}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 10,
            transition: 'all 0.2s ease',
            background: checked
              ? 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)'
              : '#F8FAFC',
            border: checked ? '1px solid #6D28D9' : '1px solid #E2E8F0',
            boxShadow: checked ? '0 4px 10px rgba(88, 28, 135, 0.25)' : 'none',
          }}
        >
          {checked ? (
            <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.6} />
          ) : (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 12.5 }}>Sales Manager</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Commercial Lead</div>
        </div>
      ),
      dataIndex: 'sales_manager',
      key: 'sales_manager',
      width: 140,
      align: 'center' as const,
      render: (checked: boolean, record: PermissionRow, index: number) => (
        <div
          onClick={() => togglePermission(index, 'sales_manager')}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 10,
            transition: 'all 0.2s ease',
            background: checked
              ? 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)'
              : '#F8FAFC',
            border: checked ? '1px solid #6D28D9' : '1px solid #E2E8F0',
            boxShadow: checked ? '0 4px 10px rgba(88, 28, 135, 0.25)' : 'none',
          }}
        >
          {checked ? (
            <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.6} />
          ) : (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 12.5 }}>Service Manager</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Field Operations</div>
        </div>
      ),
      dataIndex: 'service_manager',
      key: 'service_manager',
      width: 140,
      align: 'center' as const,
      render: (checked: boolean, record: PermissionRow, index: number) => (
        <div
          onClick={() => togglePermission(index, 'service_manager')}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 10,
            transition: 'all 0.2s ease',
            background: checked
              ? 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)'
              : '#F8FAFC',
            border: checked ? '1px solid #6D28D9' : '1px solid #E2E8F0',
            boxShadow: checked ? '0 4px 10px rgba(88, 28, 135, 0.25)' : 'none',
          }}
        >
          {checked ? (
            <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.6} />
          ) : (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 12.5 }}>Staff / Engineer</div>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>Frontline Tech</div>
        </div>
      ),
      dataIndex: 'staff',
      key: 'staff',
      width: 140,
      align: 'center' as const,
      render: (checked: boolean, record: PermissionRow, index: number) => (
        <div
          onClick={() => togglePermission(index, 'staff')}
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 10,
            transition: 'all 0.2s ease',
            background: checked
              ? 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)'
              : '#F8FAFC',
            border: checked ? '1px solid #6D28D9' : '1px solid #E2E8F0',
            boxShadow: checked ? '0 4px 10px rgba(88, 28, 135, 0.25)' : 'none',
          }}
        >
          {checked ? (
            <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.6} />
          ) : (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar matching Sales Dashboard */}
      <SalesModuleHeader
        title="Role-Based Access Control (RBAC) & Permissions"
        subtitle="Configure feature boundaries, read/write authorizations, and granular role permissions across ERP modules."
        icon={<ShieldCheck size={20} />}
        searchPlaceholder="Filter permissions by module or capability..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Save Matrix"
        onPrimaryAction={() => message.success('RBAC security policies deployed to platform cache!')}
        extraActions={
          <Button
            icon={<RotateCcw size={14} />}
            onClick={() => {
              setPermissions(DEFAULT_PERMISSIONS);
              message.info('Reset to default system policy presets');
            }}
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
            Reset Defaults
          </Button>
        }
      />

      {/* 2. Top 4 High-Impact Metric Cards matching Sales Dashboard Exactly */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'User Roles',
            value: '5 Active',
            growth: '+100%',
            isDark: true,
            icon: <KeyRound size={20} color="#5421A8" />,
          },
          {
            title: 'Modules',
            value: `${permissions.length} Total`,
            growth: 'Isolated',
            isDark: false,
            icon: <Lock size={20} color="#10B981" />,
          },
          {
            title: 'Grants',
            value: '38 Active',
            growth: 'Audited',
            isDark: true,
            icon: <UserCheck size={20} color="#F59E0B" />,
          },
          {
            title: 'Compliance',
            value: 'SOC-2',
            growth: 'Secure',
            isPositive: true,
            isDark: false,
            icon: <Shield size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Filter Bar & Scope Switcher */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '14px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 2px 10px rgba(84, 33, 168, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>Filter Module Scope:</span>
          {['ALL', 'SALES', 'SERVICE', 'COMMON', 'SUPERADMIN'].map((scope) => (
            <Button
              key={scope}
              size="small"
              onClick={() => setSelectedScope(scope)}
              style={{
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 11,
                height: 28,
                padding: '0 12px',
                borderColor: selectedScope === scope ? '#5421A8' : '#E2E8F0',
                background: selectedScope === scope ? '#5421A8' : '#F8FAFC',
                color: selectedScope === scope ? '#FFFFFF' : '#64748B',
              }}
            >
              {scope === 'ALL' ? 'All Modules' : `${scope}`}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B' }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#6D28D9' }} />
          <span>Click on any role check to toggle instant grant or revoke</span>
        </div>
      </div>

      {/* 4. Permissions Matrix Table */}
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
          dataSource={filteredPermissions}
          columns={columns}
          rowKey="module"
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};
