import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { Plus } from 'lucide-react';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  breadcrumbs: { title: string; href?: string }[];
  actionLabel?: string;
  onActionClick?: () => void;
  extraActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  actionLabel,
  onActionClick,
  extraActions,
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Breadcrumb
        style={{ marginBottom: 8 }}
        items={breadcrumbs.map((b) => ({
          title: b.href ? <a href={b.href}>{b.title}</a> : b.title,
        }))}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Title level={3} style={{ margin: 0, color: '#0d233a' }}>
          {title}
        </Title>
        <Space wrap>
          {extraActions}
          {actionLabel && (
            <Button
              type="primary"
              icon={<Plus size={16} style={{ marginRight: 4 }} />}
              onClick={onActionClick}
              style={{
                backgroundColor: '#0d233a',
                borderColor: '#0d233a',
                display: 'inline-flex',
                alignItems: 'center',
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

export default PageHeader;
