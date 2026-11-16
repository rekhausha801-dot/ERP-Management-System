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
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  subtitle,
  icon,
  iconBgColor = '#F0EAF8',
}) => {
  return (
    <Card
      bordered
      style={{
        borderRadius: 8,
        borderColor: '#E7E0F0',
        height: '100%',
        boxShadow: '0 1px 3px rgba(81, 37, 140, 0.04)',
      }}
      styles={{ body: { padding: '18px 20px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ fontSize: 12, color: '#77718A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </Text>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && <span style={{ fontSize: 18, color: '#242033', fontWeight: 600 }}>{prefix}</span>}
            <Title level={3} style={{ margin: 0, color: '#242033', fontWeight: 700 }}>
              {value}
            </Title>
            {suffix && <span style={{ fontSize: 13, color: '#77718A' }}>{suffix}</span>}
          </div>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              {trend.isPositive ? <ArrowUpRight size={14} color="#16A36A" /> : <ArrowDownRight size={14} color="#DC4C4C" />}
              <span style={{ fontSize: 12, fontWeight: 600, color: trend.isPositive ? '#16A36A' : '#DC4C4C' }}>
                {trend.value}
              </span>
              <span style={{ fontSize: 11, color: '#9E98AD' }}>vs last period</span>
            </div>
          )}
          {subtitle && <div style={{ fontSize: 12, color: '#77718A', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
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
