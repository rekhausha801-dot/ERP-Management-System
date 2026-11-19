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
        borderRadius: 16,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
        height: '100%',
        border: '1px solid rgba(226, 232, 240, 0.8)',
      }}
      styles={{ body: { padding: '14px 16px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </Text>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && <span style={{ fontSize: 16, color: '#4B5563', fontWeight: 600 }}>{prefix}</span>}
            <Title level={2} style={{ margin: 0, color: '#1E152A', fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>
              {value}
            </Title>
            {suffix && <span style={{ fontSize: 12, color: '#6B7280' }}>{suffix}</span>}
          </div>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {trend.isPositive ? (
                <ArrowUpRight size={13} color="#10B981" />
              ) : (
                <ArrowDownRight size={13} color="#EF4444" />
              )}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: trend.isPositive ? '#10B981' : '#EF4444',
                }}
              >
                {trend.value}
              </span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>vs last month</span>
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
