import React from 'react';
import { Layout, Typography, Space } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

interface FooterProps {
  companyName?: string;
}

export const Footer: React.FC<FooterProps> = ({ companyName }) => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        padding: '10px 24px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        fontSize: 12,
        color: '#64748B',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <Text style={{ fontSize: 12, color: '#64748B' }}>
          &copy; {new Date().getFullYear()} {companyName || 'Enterprise'} &bull; Universal ERP Platform
        </Text>
        <Space size="middle">
          <span style={{ fontSize: 11, color: '#94A3B8' }}>Release v1.0.0</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>Status: Production Operational</span>
        </Space>
      </div>
    </AntFooter>
  );
};
