import React from 'react';
import { Card, Result, Button } from 'antd';
import { PageHeader } from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';

interface GenericModulePlaceholderProps {
  title: string;
  description: string;
}

export const GenericModulePlaceholder: React.FC<GenericModulePlaceholderProps> = ({
  title,
  description,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title={title}
        breadcrumbs={[
          { title: 'Home', href: '/dashboard' },
          { title },
        ]}
        actionLabel={`Add ${title.replace(/s$/, '')}`}
      />
      <Card style={{ borderRadius: 8 }}>
        <Result
          status="info"
          title={`${title} Management Module`}
          subTitle={description}
          extra={
            <Button
              type="primary"
              style={{ backgroundColor: '#0d233a', borderColor: '#0d233a' }}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default GenericModulePlaceholder;
