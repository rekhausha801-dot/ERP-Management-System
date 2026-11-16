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
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar
        collapsed={collapsed}
        packageType={packageType}
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
            margin: '16px 20px 8px',
            flex: '1 0 auto',
          }}
        >
          <Outlet />
        </Content>
        <Footer companyName={selectedCompany?.name} />
      </Layout>
    </Layout>
  );
};
