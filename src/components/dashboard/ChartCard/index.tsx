import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  extra,
  children,
}) => {
  return (
    <Card
      title={
        <div>
          <Title level={5} style={{ margin: 0, color: '#181433', fontWeight: 700, fontSize: 16 }}>
            {title}
          </Title>
          {subtitle && <Text style={{ fontSize: 12, color: '#7E7A9B' }}>{subtitle}</Text>}
        </div>
      }
      extra={extra}
      bordered={false}
      style={{
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)',
        height: '100%',
      }}
      styles={{
        header: { borderBottom: 'none', padding: '20px 24px 0' },
        body: { padding: '16px 24px 24px' },
      }}
    >
      {children}
    </Card>
  );
};
