import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404 - Module Not Found"
        subTitle="The ERP resource or page you requested does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/app/dashboard')} icon={<Home size={15} />}>
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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="403"
        title="403 - Module Not Subscribed"
        subTitle="Your company's ERP package does not include access to this feature. Please contact your Super Administrator to upgrade your package."
        extra={
          <Button type="primary" onClick={() => navigate('/app/dashboard')} icon={<Home size={15} />}>
            Return to Active Workspace
          </Button>
        }
      />
    </div>
  );
};

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="403"
        title="403 - Forbidden Role Action"
        subTitle="You do not have the necessary role privileges to execute this administrative operation."
        extra={
          <Button type="primary" onClick={() => navigate('/app/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};
