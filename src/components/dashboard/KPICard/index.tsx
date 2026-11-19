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
  badge?: {
    text: string;
    color?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  bgGradient?: string;
  shadowColor?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  subtitle,
  badge,
  icon,
  iconBgColor = 'rgba(255, 255, 255, 0.22)',
  bgGradient = 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  shadowColor = 'rgba(30, 64, 175, 0.35)',
  loading = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      bordered={false}
      loading={loading}
      onClick={onClick}
      style={{
        borderRadius: 20,
        background: bgGradient,
        boxShadow: isHovered
          ? `0 16px 36px -4px ${shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.1)`
          : `0 10px 25px -5px ${shadowColor}, 0 2px 6px rgba(0, 0, 0, 0.05)`,
        border: '1px solid rgba(255, 255, 255, 0.22)',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      styles={{
        body: {
          padding: '22px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      {/* Decorative Translucent Glowing Background Circles */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          left: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div>
        {/* Top Header: Translucent Icon & Trend Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {icon && (
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: iconBgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {icon}
            </div>
          )}
          {trend ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {trend.isPositive ? (
                <ArrowUpRight size={14} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight size={14} color="#FFFFFF" strokeWidth={2.5} />
              )}
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                {trend.value}
              </span>
            </div>
          ) : badge ? (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {badge.text}
            </div>
          ) : null}
        </div>

        {/* Main Value & Title */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && (
              <span
                style={{
                  fontSize: 22,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                {prefix}
              </span>
            )}
            <Title
              level={2}
              style={{
                margin: 0,
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 31,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              {value}
            </Title>
            {suffix && (
              <span
                style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 600,
                }}
              >
                {suffix}
              </span>
            )}
          </div>
          <Text
            style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 600,
              display: 'block',
              marginTop: 6,
              letterSpacing: '-0.01em',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            {title}
          </Text>
        </div>
      </div>

      {/* Subtitle / Operational Breakdown */}
      {subtitle && (
        <div
          style={{
            fontSize: 12.5,
            color: 'rgba(255, 255, 255, 0.82)',
            marginTop: 14,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: 10,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      )}
    </Card>
  );
};
