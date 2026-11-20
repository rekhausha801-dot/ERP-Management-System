import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

export const CompanyLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedCompany } = useAuth();

  return (
    <div className="erp-app-frame">
      <div className="erp-inner-window">
        {/* Deep Dark Navy Sidebar */}
        <Sidebar
          collapsed={collapsed}
          packageType={selectedCompany?.packageType || 'COMPLETE'}
          companyName={selectedCompany?.name || 'Company ERP'}
          companyCode={selectedCompany?.code || 'ERP'}
        />

        {/* Clean Pure White Inner Canvas */}
        <Layout style={{ backgroundColor: '#FFFFFF', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0 }}>
          <Navbar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />

          <Content
            style={{
              padding: '0 28px 28px',
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </div>
    </div>
  );
};
