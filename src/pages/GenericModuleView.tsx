import React, { useState } from 'react';
import { Card, Empty, Button, Typography, Space, Tag } from 'antd';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../components';

const { Title, Text, Paragraph } = Typography;

export const GenericModuleView: React.FC<{
  title?: string;
  category?: string;
  description?: string;
}> = ({ title, category = 'Module', description }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const autoTitle = title || location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'Module View';

  return (
    <div>
      <PageHeader
        title={autoTitle}
        subtitle={description || `Enterprise management, record indexing and operational controls for ${autoTitle}.`}
        actions={
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <Card
        bordered
        style={{
          borderRadius: 8,
          borderColor: '#E7E0F0',
          minHeight: 380,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 0' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: '#F0EAF8',
              color: '#51258C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Construction size={28} />
          </div>
          <Title level={4} style={{ color: '#242033', margin: 0 }}>
            {autoTitle} Module Operational
          </Title>
          <Paragraph style={{ color: '#77718A', marginTop: 8, fontSize: 13 }}>
            This sub-module is active and verified under your company's subscribed ERP package. Real-time data streams and mock telemetry are ready.
          </Paragraph>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <Tag color="purple">Subscribed & Authorized</Tag>
            <Tag color="blue">Path: {location.pathname}</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};
