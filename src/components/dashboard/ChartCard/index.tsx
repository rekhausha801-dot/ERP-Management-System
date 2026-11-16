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
          <Title level={5} style={{ margin: 0, color: '#242033', fontWeight: 600 }}>
            {title}
          </Title>
          {subtitle && <Text style={{ fontSize: 12, color: '#77718A' }}>{subtitle}</Text>}
        </div>
      }
      extra={extra}
      bordered
      style={{
        borderRadius: 8,
        borderColor: '#E7E0F0',
        height: '100%',
      }}
    >
      {children}
    </Card>
  );
};
