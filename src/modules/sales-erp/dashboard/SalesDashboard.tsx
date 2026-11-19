import React, { useState } from 'react';
import { Row, Col, Table, Select } from 'antd';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  IndianRupee,
  ShoppingCart,
  Clock,
  TrendingUp,
  FileText,
  CreditCard,
  Users,
  Package,
  ChevronRight,
  ArrowUp,
  LineChart,
  PieChart as PieIcon,
  ListOrdered,
  Trophy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Line / Area chart data matching screenshot exactly: Jan (0.8Cr), Feb (1.20 Cr), Mar (1.1Cr), Apr (1.35Cr), May (1.6Cr), Jun (1.8Cr)
const SALES_PERFORMANCE_DATA = [
  { month: 'Jan', value: 0.8, tooltipVal: '₹0.80 Cr' },
  { month: 'Feb', value: 1.2, tooltipVal: '₹1.20 Cr' },
  { month: 'Mar', value: 1.1, tooltipVal: '₹1.10 Cr' },
  { month: 'Apr', value: 1.35, tooltipVal: '₹1.35 Cr' },
  { month: 'May', value: 1.6, tooltipVal: '₹1.60 Cr' },
  { month: 'Jun', value: 1.8, tooltipVal: '₹1.80 Cr' },
];

// Donut Chart Data matching screenshot
const CATEGORY_DATA = [
  { name: 'Electronics', value: 35.2, color: '#6366F1' },
  { name: 'Home & Living', value: 28.6, color: '#FBBF24' },
  { name: 'Fashion', value: 22.1, color: '#F59E0B' },
  { name: 'Others', value: 14.1, color: '#818CF8' },
];

// Recent Orders Table Data matching screenshot
const RECENT_ORDERS_DATA = [
  { key: '1', hash: '1', id: 'SO-1047', customer: 'Kumar & Co', date: '18 Jun 2025', amount: '₹48,750', status: 'Delivered' },
  { key: '2', hash: '2', id: 'SO-1046', customer: 'Sri Venkatesh Traders', date: '17 Jun 2025', amount: '₹32,500', status: 'Processing' },
  { key: '3', hash: '3', id: 'SO-1045', customer: 'Devi Agencies', date: '16 Jun 2025', amount: '₹27,800', status: 'Shipped' },
  { key: '4', hash: '4', id: 'SO-1044', customer: 'Ganesh Hardware', date: '15 Jun 2025', amount: '₹41,200', status: 'Delivered' },
];

// Top Customers Data matching screenshot
const TOP_CUSTOMERS_DATA = [
  { rank: '1', name: 'Kumar & Co', amount: '₹1,85,000' },
  { rank: '2', name: 'Sri Venkatesh Traders', amount: '₹1,42,000' },
  { rank: '3', name: 'Devi Agencies', amount: '₹1,28,000' },
  { rank: '4', name: 'Ganesh Hardware', amount: '₹98,000' },
];

export const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('6m');
  const [categoryPeriod, setCategoryPeriod] = useState('year');

  return (
    <div style={{ paddingBottom: 32, maxWidth: 1600, margin: '0 auto' }}>
      {/* =========================================================================
          ROW 1: STATS CARDS MATCHING USER SPECIFICATION
          Equal Width & Height, 2.45 Cr on a Single Line, Crisp Proportions
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Card 1: Total Revenue */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
              borderRadius: 22,
              padding: '20px 18px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 12px 28px rgba(88, 28, 135, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              height: 120,
              minHeight: 120,
              maxHeight: 120,
              boxSizing: 'border-box',
              color: '#FFFFFF',
            }}
          >
            {/* 3D Rupee / Coins Graphic at Right */}
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 6,
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg width="68" height="68" viewBox="0 0 80 80" fill="none">
                <circle cx="42" cy="42" r="28" fill="#C084FC" fillOpacity="0.22" filter="blur(6px)" />
                <ellipse cx="44" cy="56" rx="22" ry="9" fill="#4C1D95" />
                <path d="M22,46 C22,51 32,55 44,55 C56,55 66,51 66,46 L66,54 C66,59 56,63 44,63 C32,63 22,59 22,54 Z" fill="#7C3AED" />
                <ellipse cx="44" cy="46" rx="22" ry="9" fill="#8B5CF6" />
                <path d="M22,34 C22,39 32,43 44,43 C56,43 66,39 66,34 L66,42 C66,47 56,51 44,51 C32,51 22,47 22,42 Z" fill="#9333EA" />
                <ellipse cx="44" cy="34" rx="22" ry="9" fill="#A855F7" stroke="#DDD6FE" strokeWidth="2" />
                <text x="44" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif">₹</text>
              </svg>
            </div>

            {/* Circular Translucent Rupee Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <IndianRupee size={21} color="#6D28D9" strokeWidth={2.6} />
            </div>

            {/* Details: ₹2.45 Cr strictly on ONE line */}
            <div style={{ flex: 1, zIndex: 1, minWidth: 0, paddingRight: 48 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                Total Revenue
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                ₹2.45 Cr
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: '#4ADE80',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  <ArrowUp size={12} strokeWidth={3} style={{ marginRight: 2 }} /> +14.2%
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 2: Total Sales Orders */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 18px',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              height: 120,
              minHeight: 120,
              maxHeight: 120,
              boxSizing: 'border-box',
            }}
          >
            {/* 3D Shopping Cart Visual */}
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 6,
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg width="68" height="68" viewBox="0 0 80 80" fill="none">
                <ellipse cx="40" cy="72" rx="28" ry="5" fill="#C4B5FD" fillOpacity="0.45" />
                <path
                  d="M16 28 L24 28 L32 54 L58 54 L66 34 L26 34"
                  stroke="#7C3AED"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line x1="28" y1="40" x2="62" y2="40" stroke="#8B5CF6" strokeWidth="2.5" />
                <line x1="30" y1="46" x2="60" y2="46" stroke="#8B5CF6" strokeWidth="2.5" />
                <line x1="42" y1="34" x2="40" y2="54" stroke="#8B5CF6" strokeWidth="2.5" />
                <line x1="52" y1="34" x2="50" y2="54" stroke="#8B5CF6" strokeWidth="2.5" />
                <circle cx="34" cy="62" r="5" fill="#4C1D95" stroke="#DDD6FE" strokeWidth="2" />
                <circle cx="56" cy="62" r="5" fill="#4C1D95" stroke="#DDD6FE" strokeWidth="2" />
                <rect x="30" y="16" width="16" height="18" rx="3" fill="#A855F7" />
                <rect x="42" y="10" width="18" height="24" rx="3" fill="#EC4899" />
                <rect x="36" y="22" width="14" height="12" rx="2" fill="#38BDF8" />
              </svg>
            </div>

            {/* Circular Purple Icon Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: 12,
              }}
            >
              <ShoppingCart size={21} color="#6D28D9" strokeWidth={2.4} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, zIndex: 1, minWidth: 0, paddingRight: 48 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#475569',
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                Total Sales Orders
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                142
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: '#16A34A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  <ArrowUp size={12} strokeWidth={3} style={{ marginRight: 2 }} /> +12.5%
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 3: Pending Orders */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
              borderRadius: 22,
              padding: '20px 18px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 12px 28px rgba(88, 28, 135, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              height: 120,
              minHeight: 120,
              maxHeight: 120,
              boxSizing: 'border-box',
              color: '#FFFFFF',
            }}
          >
            {/* 3D Stopwatch / Timer Visual */}
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 6,
                width: 72,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
                <circle cx="44" cy="44" r="26" fill="#C084FC" fillOpacity="0.25" filter="blur(4px)" />
                <rect x="41" y="10" width="6" height="7" rx="1.5" fill="#E2E8F0" />
                <rect x="36" y="8" width="16" height="4" rx="2" fill="#CBD5E1" />
                <line x1="56" y1="18" x2="62" y2="24" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <circle cx="44" cy="46" r="24" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="4.5" />
                <circle cx="44" cy="46" r="19" fill="#FFFFFF" />
                <line x1="44" y1="30" x2="44" y2="33" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="44" y1="59" x2="44" y2="62" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="28" y1="46" x2="31" y2="46" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="57" y1="46" x2="60" y2="46" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="44" y1="46" x2="44" y2="34" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="44" y1="46" x2="38" y2="40" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                <circle cx="44" cy="46" r="2.5" fill="#4C1D95" />
              </svg>
            </div>

            {/* Circular White Clock Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Clock size={21} color="#6D28D9" strokeWidth={2.4} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, zIndex: 1, minWidth: 0, paddingRight: 48 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                Pending Orders
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                18
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: '#FDE047',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  <ArrowUp size={12} strokeWidth={3} style={{ marginRight: 2 }} /> +2.3%
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 4: Win Conversion Rate */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 22,
              padding: '20px 18px',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              height: 120,
              minHeight: 120,
              maxHeight: 120,
              boxSizing: 'border-box',
            }}
          >
            {/* 3D Growth Bars Visual */}
            <div
              style={{
                position: 'absolute',
                right: 8,
                bottom: 6,
                width: 72,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <svg width="70" height="68" viewBox="0 0 85 75" fill="none">
                <rect x="22" y="44" width="10" height="26" rx="3" fill="#C4B5FD" />
                <rect x="36" y="32" width="10" height="38" rx="3" fill="#A78BFA" />
                <rect x="50" y="20" width="10" height="50" rx="3" fill="#8B5CF6" />
                <rect x="64" y="8" width="10" height="62" rx="3" fill="#7C3AED" />
                <path
                  d="M12 56 Q36 40 52 26 T74 12"
                  stroke="#A855F7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <polygon points="76,8 64,12 72,20" fill="#7C3AED" />
              </svg>
            </div>

            {/* Circular Purple Icon Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: 12,
              }}
            >
              <TrendingUp size={21} color="#6D28D9" strokeWidth={2.4} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, zIndex: 1, minWidth: 0, paddingRight: 48 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#475569',
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                Win Conversion Rate
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                28.4%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: '#16A34A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  <ArrowUp size={12} strokeWidth={3} style={{ marginRight: 2 }} /> +3.1%
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* =========================================================================
          ROW 2: 4 HORIZONTAL PILL CARDS (QUOTATIONS, RECEIVABLES, ACTIVE CUSTOMERS, LOW STOCK)
          Exact Equal Height (72px) & Width across all 4 cards
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Pill 1: Quotations Pending */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => navigate('/app/sales/quotations')}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '0 18px',
              height: 72,
              minHeight: 72,
              maxHeight: 72,
              boxSizing: 'border-box',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={19} color="#4F46E5" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Quotations Pending</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>32</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Pill 2: Outstanding Receivables */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => navigate('/app/sales/outstanding-receivables')}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '0 18px',
              height: 72,
              minHeight: 72,
              maxHeight: 72,
              boxSizing: 'border-box',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={19} color="#4F46E5" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Outstanding Receivables</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2, whiteSpace: 'nowrap' }}>₹1.28 Cr</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Pill 3: Active Customers */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => navigate('/app/customers')}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '0 18px',
              height: 72,
              minHeight: 72,
              maxHeight: 72,
              boxSizing: 'border-box',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={19} color="#4F46E5" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Active Customers</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>1,250</div>
              </div>
            </div>
          </div>
        </Col>

        {/* Pill 4: Low Stock Products */}
        <Col xs={24} sm={12} lg={6}>
          <div
            onClick={() => navigate('/app/sales/low-stock-alerts')}
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '0 18px',
              height: 72,
              minHeight: 72,
              maxHeight: 72,
              boxSizing: 'border-box',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.04)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Package size={19} color="#4F46E5" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>Low Stock Products</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>12</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* =========================================================================
          ROW 3: SALES PERFORMANCE SMOOTH PURPLE AREA CHART & SALES BY PRODUCT CATEGORY DONUT
          Clean White Headers without Dark Blue Background
          ========================================================================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {/* Left: Sales Performance with Clean White Header */}
        <Col xs={24} lg={14}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Clean Header */}
            <div
              style={{
                padding: '20px 24px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LineChart size={19} color="#6D28D9" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Sales Performance
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                    Commercial turnover vs monthly targets
                  </div>
                </div>
              </div>

              {/* Clean White Select Pill */}
              <Select
                value={period}
                onChange={setPeriod}
                style={{
                  width: 130,
                  fontWeight: 600,
                  fontSize: 12,
                }}
                options={[
                  { value: '6m', label: 'Last 6 Months' },
                  { value: '1y', label: 'Last 1 Year' },
                ]}
              />
            </div>

            {/* Area Chart Container */}
            <div style={{ padding: '24px 22px 16px', flex: 1, minHeight: 260 }}>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_PERFORMANCE_DATA} margin={{ top: 20, right: 24, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(226, 232, 240, 0.6)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v === 0 ? '0L' : v === 0.5 ? '50L' : `${v}Cr`)}
                      ticks={[0, 0.5, 1.0, 1.5, 2.0]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div
                              style={{
                                background: '#1F1646',
                                borderRadius: 12,
                                padding: '8px 14px',
                                color: '#FFFFFF',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                                textAlign: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                              }}
                            >
                              <div style={{ fontSize: 11, color: '#A5B4FC', fontWeight: 600 }}>{data.month}</div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>{data.tooltipVal}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={3.5}
                      fillOpacity={1}
                      fill="url(#purpleAreaGrad)"
                      dot={{ r: 5, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2.5 }}
                      activeDot={{ r: 7, fill: '#4338CA', stroke: '#FFFFFF', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Col>

        {/* Right: Sales by Product Category Donut Chart */}
        <Col xs={24} lg={10}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Clean Header */}
            <div
              style={{
                padding: '20px 24px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PieIcon size={19} color="#6D28D9" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Sales by Product Category
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                    Distribution by product volume
                  </div>
                </div>
              </div>

              <Select
                value={categoryPeriod}
                onChange={setCategoryPeriod}
                style={{
                  width: 110,
                  fontWeight: 600,
                  fontSize: 12,
                }}
                options={[
                  { value: 'year', label: 'This Year' },
                  { value: 'month', label: 'This Month' },
                ]}
              />
            </div>

            {/* Donut Chart & Legend Side-by-Side */}
            <div
              style={{
                padding: '24px 22px',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {/* Donut with Central Total */}
              <div style={{ position: 'relative', width: 170, height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Central Text */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>₹2.45 Cr</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#64748B' }}>Total Sales</div>
                </div>
              </div>

              {/* Legend List matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
                {CATEGORY_DATA.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cat.color }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* =========================================================================
          ROW 4: RECENT ORDERS TABLE & TOP CUSTOMERS LEADERBOARD
          Clean White Headers
          ========================================================================= */}
      <Row gutter={[16, 16]}>
        {/* Left: Recent Orders Table */}
        <Col xs={24} lg={14}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              overflow: 'hidden',
            }}
          >
            {/* Clean Header */}
            <div
              style={{
                padding: '20px 24px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ListOrdered size={19} color="#6D28D9" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Recent Orders
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                    Latest confirmed invoices and shipments
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/sales/orders')}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: '6px 14px',
                  color: '#6D28D9',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'background 0.2s',
                }}
              >
                View All &rarr;
              </button>
            </div>

            {/* Table */}
            <div style={{ padding: '8px 12px 14px' }}>
              <Table
                dataSource={RECENT_ORDERS_DATA}
                pagination={false}
                size="middle"
                rowKey="key"
                columns={[
                  {
                    title: '#',
                    dataIndex: 'hash',
                    key: 'hash',
                    width: 44,
                    render: (t) => <span style={{ color: '#64748B', fontWeight: 600 }}>{t}</span>,
                  },
                  {
                    title: 'Customer',
                    key: 'customerInfo',
                    render: (_, r) => (
                      <div>
                        <div style={{ fontWeight: 700, color: '#4F46E5', fontSize: 13 }}>{r.id}</div>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12.5 }}>{r.customer}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Order Date',
                    dataIndex: 'date',
                    key: 'date',
                    render: (d) => <span style={{ color: '#64748B', fontSize: 12.5 }}>{d}</span>,
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (a) => <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{a}</span>,
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (s) => {
                      const isDelivered = s === 'Delivered';
                      const isProcessing = s === 'Processing';
                      const isShipped = s === 'Shipped';
                      const bg = isDelivered ? '#DCFCE7' : isProcessing ? '#FEF3C7' : '#E0E7FF';
                      const color = isDelivered ? '#15803D' : isProcessing ? '#B45309' : '#4338CA';
                      return (
                        <span
                          style={{
                            background: bg,
                            color: color,
                            padding: '4px 12px',
                            borderRadius: 14,
                            fontWeight: 700,
                            fontSize: 11.5,
                            display: 'inline-block',
                          }}
                        >
                          {s}
                        </span>
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>
        </Col>

        {/* Right: Top Customers Leaderboard */}
        <Col xs={24} lg={10}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.85)',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Clean Header */}
            <div
              style={{
                padding: '20px 24px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy size={19} color="#6D28D9" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Top Customers
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                    Highest grossing commercial accounts
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/customers')}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: '6px 14px',
                  color: '#6D28D9',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'background 0.2s',
                }}
              >
                View All &rarr;
              </button>
            </div>

            {/* Top Customers List */}
            <div style={{ padding: '16px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {TOP_CUSTOMERS_DATA.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: idx < TOP_CUSTOMERS_DATA.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                      }}
                    >
                      {item.rank}
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
