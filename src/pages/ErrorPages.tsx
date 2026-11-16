import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F1FA',
      }}
    >
      <Result
        status="404"
        title="404 - Page Not Found"
        subTitle="The ERP resource or module you requested does not exist or has been relocated."
        extra={
          <Button
            type="primary"
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            icon={<Home size={15} />}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F1FA',
      }}
    >
      <Result
        status="403"
        title="403 - Module Not Subscribed"
        subTitle="Your current company ERP package subscription does not include access to this module."
        extra={
          <Button
            type="primary"
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            icon={<Home size={15} />}
            onClick={() => navigate('/dashboard')}
          >
            Return to Active Workspace
          </Button>
        }
      />
    </div>
  );
};
