import React from 'react';
import { Row, Col } from 'antd';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface SalesKpiCardItem {
  title: string;
  value: string;
  growth: string;
  isPositive?: boolean;
  isDark?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
  pillExtra?: string;
}

interface SalesKpiCardsRowProps {
  cards: SalesKpiCardItem[];
}

export const SalesKpiCardsRow: React.FC<SalesKpiCardsRowProps> = ({ cards }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 18, width: '100%', margin: 0 }}>
      {cards.map((c, idx) => {
        const isDark = c.isDark !== undefined ? c.isDark : idx % 2 === 0;

        return (
          <Col xs={24} sm={12} md={12} lg={6} key={idx} style={{ padding: '0 8px 12px 8px' }}>
            <div
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)'
                  : '#FFFFFF',
                borderRadius: 22,
                padding: '16px 18px',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.18)'
                  : '1px solid rgba(226, 232, 240, 0.85)',
                boxShadow: isDark
                  ? '0 10px 24px rgba(88, 28, 135, 0.28)'
                  : '0 6px 20px rgba(99, 102, 241, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                height: 124,
                minHeight: 124,
                boxSizing: 'border-box',
                color: isDark ? '#FFFFFF' : '#1E1B4B',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Left Circular Badge Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: isDark ? '#FFFFFF' : c.iconBg || '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginRight: 14,
                  boxShadow: isDark
                    ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                    : '0 2px 8px rgba(109, 40, 217, 0.12)',
                  color: '#6D28D9',
                }}
              >
                {c.icon}
              </div>

              {/* Metric Content */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  title={c.title}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? 'rgba(255, 255, 255, 0.88)' : '#64748B',
                    marginBottom: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.2,
                  }}
                >
                  {c.title}
                </div>
                <div
                  title={c.value}
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.value}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: isDark
                        ? '#4ADE80'
                        : c.isPositive !== false
                        ? '#16A34A'
                        : '#EF4444',
                      display: 'inline-flex',
                      alignItems: 'center',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {c.isPositive !== false ? (
                      <ArrowUp size={11} strokeWidth={3} style={{ marginRight: 2 }} />
                    ) : (
                      <ArrowDown size={11} strokeWidth={3} style={{ marginRight: 2 }} />
                    )}
                    {c.growth}
                  </span>
                  {c.pillExtra && (
                    <span
                      title={c.pillExtra}
                      style={{
                        fontSize: 10.5,
                        color: isDark ? 'rgba(255,255,255,0.72)' : '#94A3B8',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      &bull; {c.pillExtra}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};
