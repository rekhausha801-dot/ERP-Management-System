import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const { Text, Title } = Typography;

export interface KPICardProps {
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
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  subtitle,
  icon,
  iconBgColor = 'rgba(110, 86, 207, 0.08)',
  onClick,
}) => {
  return (
    <Card
      bordered={false}
      onClick={onClick}
      style={{
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(110, 86, 207, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(25, 21, 59, 0.04)';
        }
      }}
      styles={{ body: { padding: '20px 22px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6E56CF',
            }}
          >
            {icon}
          </div>
        )}
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 20,
              backgroundColor: trend.isPositive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            }}
          >
            {trend.isPositive ? <ArrowUpRight size={13} color="#10B981" /> : <ArrowDownRight size={13} color="#EF4444" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: trend.isPositive ? '#10B981' : '#EF4444' }}>
              {trend.value}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          {prefix && <span style={{ fontSize: 20, color: '#181433', fontWeight: 700 }}>{prefix}</span>}
          <Title level={2} style={{ margin: 0, color: '#181433', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>
            {value}
          </Title>
          {suffix && <span style={{ fontSize: 13, color: '#7E7A9B' }}>{suffix}</span>}
        </div>
        <Text style={{ fontSize: 13, color: '#7E7A9B', fontWeight: 500, display: 'block', marginTop: 4 }}>
          {title}
        </Text>
        {subtitle && <div style={{ fontSize: 11, color: '#A5A1BE', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </Card>
  );
};
