import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';
import type { ErpPackage } from '../config/modules.config';

const { Content } = Layout;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedCompany } = useAuth();

  const packageType = (selectedCompany?.packageType as any) || 'COMPLETE';

  return (
    <Layout style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', backgroundColor: '#F3F0F9', display: 'flex', flexDirection: 'row' }}>
      <Sidebar
        collapsed={collapsed}
        packageType={packageType}
        companyName={selectedCompany?.name || 'Company ERP'}
        companyCode={selectedCompany?.code || 'ERP'}
      />
      <Layout style={{ height: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0, backgroundColor: '#F3F0F9' }}>
        <Navbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            padding: '0 24px 20px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            minHeight: 0,
          }}
        >
          <Outlet />
        </Content>
        <Footer companyName={selectedCompany?.name} />
      </Layout>
    </Layout>
  );
};
