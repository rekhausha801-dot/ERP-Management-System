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
    <Layout
      style={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Sidebar
        collapsed={collapsed}
        packageType={packageType}
        companyName={selectedCompany?.name || 'Company ERP'}
        companyCode={selectedCompany?.code || 'ERP'}
      />
      <Layout
        style={{
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flex: 1,
          minWidth: 0,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Navbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            padding: '20px 24px 0',
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            minHeight: 0,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            <Outlet />
          </div>
        </Content>
        <Footer companyName={selectedCompany?.name} />
      </Layout>
    </Layout>
  );
};
