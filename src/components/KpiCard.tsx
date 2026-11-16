import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const { Text, Title } = Typography;

interface KpiCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  subtitle,
  icon,
  iconBgColor = 'rgba(81, 37, 140, 0.08)',
}) => {
  return (
    <Card
      bordered
      style={{
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(81, 37, 140, 0.05)',
        height: '100%',
      }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </Text>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && <span style={{ fontSize: 18, color: '#4B5563', fontWeight: 600 }}>{prefix}</span>}
            <Title level={2} style={{ margin: 0, color: '#1E152A', fontWeight: 700 }}>
              {value}
            </Title>
            {suffix && <span style={{ fontSize: 14, color: '#6B7280' }}>{suffix}</span>}
          </div>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {trend.isPositive ? (
                <ArrowUpRight size={16} color="#10B981" />
              ) : (
                <ArrowDownRight size={16} color="#EF4444" />
              )}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: trend.isPositive ? '#10B981' : '#EF4444',
                }}
              >
                {trend.value}
              </span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>vs last month</span>
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#51258C',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
