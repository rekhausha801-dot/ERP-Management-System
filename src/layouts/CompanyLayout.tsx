import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AppBreadcrumb } from './Breadcrumb';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

export const CompanyLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedCompany } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F1FA' }}>
      <Sidebar
        collapsed={collapsed}
        packageType={selectedCompany?.packageType || 'COMPLETE'}
        companyName={selectedCompany?.name || 'Company ERP'}
        companyCode={selectedCompany?.code || 'ERP'}
      />
      <Layout>
        <Navbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: '20px 24px 12px',
            flex: '1 0 auto',
          }}
        >
          <AppBreadcrumb />
          <Outlet />
        </Content>
        <Footer companyName={selectedCompany?.name} />
      </Layout>
    </Layout>
  );
};
