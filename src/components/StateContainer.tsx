import React from 'react';
import { Card, Empty, Button, Spin, Alert } from 'antd';
import { RefreshCw, Plus } from 'lucide-react';

interface ReusableStateContainerProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  onCreateNew?: () => void;
  createButtonText?: string;
  children: React.ReactNode;
}

export const StateContainer: React.FC<ReusableStateContainerProps> = ({
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your current filter criteria.',
  onRetry,
  onCreateNew,
  createButtonText = 'Create New Record',
  children,
}) => {
  if (loading) {
    return (
      <Card style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Loading enterprise records..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        message="System Error"
        description={error}
        type="error"
        showIcon
        action={
          onRetry ? (
            <Button size="small" type="primary" danger onClick={onRetry} icon={<RefreshCw size={14} />}>
              Retry
            </Button>
          ) : undefined
        }
        style={{ margin: '20px 0' }}
      />
    );
  }

  if (empty) {
    return (
      <Card style={{ padding: '40px 0', textAlign: 'center' }}>
        <Empty description={<span><strong>{emptyTitle}</strong><br />{emptyDescription}</span>}>
          {onCreateNew && (
            <Button
              type="primary"
              style={{ backgroundColor: '#51258C', borderColor: '#51258C', marginTop: 12 }}
              onClick={onCreateNew}
              icon={<Plus size={16} />}
            >
              {createButtonText}
            </Button>
          )}
        </Empty>
      </Card>
    );
  }

  return <>{children}</>;
};
