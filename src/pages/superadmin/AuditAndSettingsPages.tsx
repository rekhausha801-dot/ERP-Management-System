import React from 'react';
import { Card, Table, Typography, Tag, Row, Col, Space, Input, Button } from 'antd';
import { Activity, ShieldAlert, Download, Search } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components';
import { MOCK_AUDIT_LOGS } from '../../mock/erpData';

const { Text } = Typography;

export const AuditLogsPage: React.FC = () => {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (t: string) => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{t}</span>,
    },
    {
      title: 'Action Code',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => <Tag color="purple">{action}</Tag>,
    },
    {
      title: 'User / Identity',
      dataIndex: 'user',
      key: 'user',
      render: (user: string, record: any) => (
        <div>
          <span style={{ fontWeight: 600, color: '#1E152A' }}>{user}</span>
          <span style={{ fontSize: 11, color: '#8E849E', marginLeft: 6 }}>({record.role})</span>
        </div>
      ),
    },
    {
      title: 'Details & Event Payload',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Source IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (ip: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ip}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Trails & Platform Security Logs"
        subtitle="Immutable security telemetry, authentication records, and administrative operations."
        actions={
          <Button icon={<Download size={15} />} onClick={() => alert('Exporting CSV audit stream...')}>
            Export CSV
          </Button>
        }
      />

      <Card style={{ borderRadius: 8 }}>
        <Table dataSource={MOCK_AUDIT_LOGS} columns={columns} rowKey="id" bordered />
      </Card>
    </div>
  );
};

export const PlatformReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Global Platform Analytics & Cross-Tenant Reports"
        subtitle="Aggregate multi-tenant telemetry, data volume utilization, and package trends."
      />
      <Card style={{ borderRadius: 8, padding: 24, textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <Activity size={48} color="#51258C" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ margin: 0, color: '#1E152A' }}>Cross-Tenant Business Intelligence Engine</h3>
          <p style={{ color: '#5C526A', marginTop: 8 }}>
            Consolidated reporting active across Sales, Service, and Complete ERP packages. Data aggregates nightly for all licensed organizations.
          </p>
        </div>
      </Card>
    </div>
  );
};

export const PlatformSettingsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Super Admin Platform Settings"
        subtitle="Global environment policies, notification dispatchers, and tenant isolation flags."
      />
      <Card style={{ borderRadius: 8 }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 600, color: '#1E152A' }}>Multi-Tenant Isolation Strategy</span>
            <p style={{ color: '#5C526A', fontSize: 13, margin: 0 }}>
              Enforces tenant ID headers (`X-Tenant-Code`) and strict database table partitioning.
            </p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 600, color: '#1E152A' }}>Default Theme System</span>
            <p style={{ color: '#5C526A', fontSize: 13, margin: 0 }}>
              Enterprise Purple (#51258C) and White surfaces configured across all package dashboards.
            </p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 600, color: '#1E152A' }}>Runtime Version</span>
            <p style={{ color: '#5C526A', fontSize: 13, margin: 0 }}>
              Universal ERP Frontend Core v1.0.0 (Phase 1 UI Foundation)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
