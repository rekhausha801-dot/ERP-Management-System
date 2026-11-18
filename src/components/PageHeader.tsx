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
    <div style={{ marginBottom: 20 }}>
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
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#1E152A', fontWeight: 700 }}>
            {title}
          </Title>
          {subtitle && (
            <Text style={{ color: '#5C526A', fontSize: 13, marginTop: 4, display: 'block' }}>
              {subtitle}
            </Text>
          )}
        </div>
        <Space wrap>
          {rightActions}
          {actionLabel && (
            <Button
              type="primary"
              icon={<Plus size={16} style={{ marginRight: 4 }} />}
              onClick={onActionClick}
              style={{
                backgroundColor: '#51258C',
                borderColor: '#51258C',
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
