import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { Plus } from 'lucide-react';

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { title: string; href?: string }[];
  actionLabel?: string;
  onActionClick?: () => void;
  actions?: React.ReactNode;
  extraActions?: React.ReactNode;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actionLabel,
  onActionClick,
  actions,
  extraActions,
  extra,
}) => {
  const rightActions = extra || actions || extraActions;

  return (
    <div style={{ marginBottom: 24, paddingTop: 8 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((b) => ({
            title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
          }))}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#1E152A', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            {title}
          </Title>
          {subtitle && (
            <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4, display: 'block' }}>
              {subtitle}
            </Text>
          )}
        </div>
        <Space size={12} wrap style={{ alignItems: 'center' }}>
          {rightActions}
          {actionLabel && (
            <Button
              type="primary"
              icon={<Plus size={16} style={{ marginRight: 4 }} />}
              onClick={onActionClick}
              style={{
                backgroundColor: '#4C1D95',
                borderColor: '#4C1D95',
                borderRadius: 10,
                fontWeight: 600,
                boxShadow: '0 6px 20px rgba(110, 86, 207, 0.35)',
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
