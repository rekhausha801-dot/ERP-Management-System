import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

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
  // Determine soft pastel gradient palette based on card theme or positive/warning
  const isAlert = trend && !trend.isPositive;
  const isAmber = iconBgColor?.includes('FEF') || iconBgColor?.includes('FDE') || iconBgColor?.includes('FEE');
  
  let bgGradient = 'linear-gradient(135deg, #FCFAFF 0%, #F5F0FF 100%)';
  let borderColor = 'rgba(124, 58, 237, 0.16)';
  let accentColor = '#4C1D95';
  let pillBg = '#F3E8FF';
  let arrowColor = '#7C3AED';

  if (isAlert) {
    bgGradient = 'linear-gradient(135deg, #FFFDF8 0%, #FFF5EB 100%)';
    borderColor = 'rgba(245, 158, 11, 0.22)';
    accentColor = '#D97706';
    pillBg = '#FFE8CC';
    arrowColor = '#EA580C';
  } else if (isAmber) {
    bgGradient = 'linear-gradient(135deg, #FFFDF8 0%, #FFF9EB 100%)';
    borderColor = 'rgba(217, 119, 6, 0.2)';
    accentColor = '#B45309';
    pillBg = '#FEF3C7';
    arrowColor = '#D97706';
  } else if (iconBgColor?.includes('DBE') || iconBgColor?.includes('EFF')) {
    bgGradient = 'linear-gradient(135deg, #F9FBFF 0%, #EFF6FF 100%)';
    borderColor = 'rgba(59, 130, 246, 0.2)';
    accentColor = '#1E3A8A';
    pillBg = '#DBEAFE';
    arrowColor = '#2563EB';
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: bgGradient,
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 6px 20px rgba(76, 29, 149, 0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(76, 29, 149, 0.09)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 29, 149, 0.05)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        {icon && (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: pillBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#181433',
              marginBottom: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
            {prefix && <span style={{ fontSize: 13, fontWeight: 700, color: accentColor }}>{prefix}</span>}
            <span
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: accentColor,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {value}
            </span>
            {suffix && <span style={{ fontSize: 11, color: '#7E7A9B' }}>{suffix}</span>}
          </div>
          {trend && (
            <div style={{ fontSize: 10, fontWeight: 600, color: trend.isPositive ? '#4C1D95' : '#EF4444', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {trend.value}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: arrowColor,
          flexShrink: 0,
          marginLeft: 8,
          border: `1px solid ${borderColor}`,
        }}
      >
        <ChevronRight size={15} />
      </div>
    </div>
  );
};
