import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F1FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Outlet />
    </Layout>
  );
};
