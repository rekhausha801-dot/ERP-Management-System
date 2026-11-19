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
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 14px 36px rgba(109, 40, 217, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)';
        }
      }}
      styles={{ body: { padding: '14px 16px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              color: '#6E56CF',
              flexShrink: 0,
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
              padding: '2px 8px',
              borderRadius: 16,
              backgroundColor: trend.isPositive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            }}
          >
            {trend.isPositive ? <ArrowUpRight size={12} color="#10B981" /> : <ArrowDownRight size={12} color="#EF4444" />}
            <span style={{ fontSize: 10, fontWeight: 700, color: trend.isPositive ? '#10B981' : '#EF4444', whiteSpace: 'nowrap' }}>
              {trend.value}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          {prefix && <span style={{ fontSize: 16, color: '#181433', fontWeight: 700 }}>{prefix}</span>}
          <Title level={2} style={{ margin: 0, color: '#181433', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {value}
          </Title>
          {suffix && <span style={{ fontSize: 12, color: '#7E7A9B' }}>{suffix}</span>}
        </div>
        <Text style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600, display: 'block', marginTop: 3 }}>
          {title}
        </Text>
        {subtitle && <div style={{ fontSize: 10, color: '#A5A1BE', marginTop: 1 }}>{subtitle}</div>}
      </div>
    </Card>
  );
};
