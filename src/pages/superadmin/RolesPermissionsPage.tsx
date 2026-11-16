import React, { useState } from 'react';
import { Card, Table, Typography, Row, Col, Tag, Button, Checkbox, Tabs } from 'antd';
import { ShieldCheck, Shield, KeyRound, Save } from 'lucide-react';
import { PageHeader } from '../../components';

const { Title, Text, Paragraph } = Typography;

interface PermissionRow {
  module: string;
  scope: 'SALES' | 'SERVICE' | 'COMMON' | 'SUPERADMIN';
  superadmin: boolean;
  admin: boolean;
  sales_manager: boolean;
  service_manager: boolean;
  staff: boolean;
}

const DEFAULT_PERMISSIONS: PermissionRow[] = [
  { module: 'Company Provisioning & Packages', scope: 'SUPERADMIN', superadmin: true, admin: false, sales_manager: false, service_manager: false, staff: false },
  { module: 'Subscriptions & Billing', scope: 'SUPERADMIN', superadmin: true, admin: false, sales_manager: false, service_manager: false, staff: false },
  { module: 'Platform Audit Logs', scope: 'SUPERADMIN', superadmin: true, admin: false, sales_manager: false, service_manager: false, staff: false },
  { module: 'CRM & Leads Management', scope: 'SALES', superadmin: true, admin: true, sales_manager: true, service_manager: false, staff: false },
  { module: 'Quotations & Sales Orders', scope: 'SALES', superadmin: true, admin: true, sales_manager: true, service_manager: false, staff: false },
  { module: 'Invoicing & Payments', scope: 'SALES', superadmin: true, admin: true, sales_manager: true, service_manager: false, staff: false },
  { module: 'Product & Stock Inventory', scope: 'SALES', superadmin: true, admin: true, sales_manager: true, service_manager: false, staff: true },
  { module: 'Service Tickets & Helpdesk', scope: 'SERVICE', superadmin: true, admin: true, sales_manager: false, service_manager: true, staff: true },
  { module: 'Job Management & Dispatch', scope: 'SERVICE', superadmin: true, admin: true, sales_manager: false, service_manager: true, staff: false },
  { module: 'AMC Contracts & Warranty', scope: 'SERVICE', superadmin: true, admin: true, sales_manager: false, service_manager: true, staff: false },
  { module: 'Spare Parts & Service Billing', scope: 'SERVICE', superadmin: true, admin: true, sales_manager: false, service_manager: true, staff: false },
  { module: 'Company Profile & Users', scope: 'COMMON', superadmin: true, admin: true, sales_manager: false, service_manager: false, staff: false },
];

export const RolesPermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_PERMISSIONS);

  const columns = [
    {
      title: 'ERP Feature Module',
      dataIndex: 'module',
      key: 'module',
      render: (text: string, record: PermissionRow) => (
        <div>
          <span style={{ fontWeight: 600, color: '#1E152A' }}>{text}</span>
          <div style={{ marginTop: 2 }}>
            <Tag color={record.scope === 'SUPERADMIN' ? 'red' : record.scope === 'SALES' ? 'blue' : record.scope === 'SERVICE' ? 'green' : 'purple'}>
              {record.scope}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Super Admin',
      dataIndex: 'superadmin',
      key: 'superadmin',
      align: 'center' as const,
      render: (checked: boolean) => <Checkbox checked={checked} disabled />,
    },
    {
      title: 'Company Admin',
      dataIndex: 'admin',
      key: 'admin',
      align: 'center' as const,
      render: (checked: boolean) => <Checkbox defaultChecked={checked} />,
    },
    {
      title: 'Sales Manager',
      dataIndex: 'sales_manager',
      key: 'sales_manager',
      align: 'center' as const,
      render: (checked: boolean) => <Checkbox defaultChecked={checked} />,
    },
    {
      title: 'Service Manager',
      dataIndex: 'service_manager',
      key: 'service_manager',
      align: 'center' as const,
      render: (checked: boolean) => <Checkbox defaultChecked={checked} />,
    },
    {
      title: 'Staff / Tech',
      dataIndex: 'staff',
      key: 'staff',
      align: 'center' as const,
      render: (checked: boolean) => <Checkbox defaultChecked={checked} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Role-Based Access Control (RBAC) & Permissions"
        subtitle="Configure feature boundaries, read/write authorizations, and role matrix across ERP packages."
        actions={
          <Button
            type="primary"
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            icon={<Save size={16} />}
            onClick={() => alert('RBAC policies saved to platform cache!')}
          >
            Save Permission Matrix
          </Button>
        }
      />

      <Card style={{ borderRadius: 8 }}>
        <Table
          dataSource={permissions}
          columns={columns}
          rowKey="module"
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};
