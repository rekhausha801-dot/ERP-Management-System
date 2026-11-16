import React from 'react';
import { Card, Statistic } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  icon,
  color = '#0d233a',
}) => {
  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f0f0f0',
        height: '100%',
      }}
      styles={{ body: { padding: '20px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ color: '#64748b', fontSize: 14 }}>{title}</span>
          <div style={{ marginTop: 8 }}>
            <Statistic
              value={value}
              prefix={prefix}
              suffix={suffix}
              valueStyle={{ fontWeight: 600, color: '#0d233a', fontSize: 24 }}
            />
          </div>
          {trend && (
            <div style={{ marginTop: 8, fontSize: 13, display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  color: trend.isPositive ? '#52c41a' : '#ff4d4f',
                  fontWeight: 600,
                  marginRight: 6,
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span style={{ color: '#8c8c8c' }}>vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
