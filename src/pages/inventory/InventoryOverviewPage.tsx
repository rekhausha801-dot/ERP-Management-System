import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Progress,
  message,
  Tabs,
  Badge,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  Boxes,
  Package,
  TrendingUp,
  AlertTriangle,
  Building2,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  ChevronRight,
  Calendar,
  Layers,
  ArrowRight,
  BarChart2,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useNavigate } from 'react-router-dom';
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_IN,
  INITIAL_STOCK_OUT,
  INITIAL_TRANSFERS,
  INITIAL_ADJUSTMENTS,
  INITIAL_REORDER_ITEMS,
} from './inventoryMockData';

export const InventoryOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'movements' | 'categories' | 'warehouses' | 'velocity'>('movements');

  // KPI Calculations
  const totalProducts = INITIAL_PRODUCTS.length;
  const totalStockQty = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.totalStock, 0);
  const totalStockValue = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.stockValue, 0);
  const totalAvailableQty = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.availableStock, 0);
  const totalReservedQty = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.reservedStock, 0);
  const totalInTransitQty = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.inTransitStock, 0);
  const lowStockCount = INITIAL_PRODUCTS.filter((p) => p.status === 'Low Stock' || p.status === 'Critical').length;
  const outOfStockCount = INITIAL_PRODUCTS.filter((p) => p.status === 'Out of Stock').length;
  const totalWarehouses = INITIAL_WAREHOUSES.length;

  // Category Breakdown
  const categoryStats = [
    { category: 'Electrical Motors', count: 18, totalVal: 3840000, percent: 35.8, health: 'Optimal' },
    { category: 'Automation Drives & PLCs', count: 24, totalVal: 2950000, percent: 27.5, health: 'Good' },
    { category: 'Hydraulics & Fluid Power', count: 12, totalVal: 1840000, percent: 17.2, health: 'Needs Reorder' },
    { category: 'Instrumentation & Sensors', count: 32, totalVal: 1120000, percent: 10.4, health: 'Optimal' },
    { category: 'Bearings & Power Transmission', count: 45, totalVal: 620000, percent: 5.8, health: 'Critical Shortage' },
    { category: 'Lubricants & Consumables', count: 15, totalVal: 360000, percent: 3.3, health: 'Low Stock' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Page Header */}
      <SalesModuleHeader
        title="Inventory & Warehouse Operations Overview"
        subtitle="Centralized enterprise monitoring of multi-warehouse stocks, valuation, in-transit consignments, and automatic replenishment alerts."
        icon={<Boxes size={20} />}
        searchPlaceholder="Search product SKU, barcode, warehouse..."
        primaryActionLabel="Stock In / Receive"
        onPrimaryAction={() => navigate('/app/sales/stock-in-out')}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              icon={<Truck size={14} />}
              onClick={() => navigate('/app/sales/stock-transfers')}
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                borderColor: '#ECE8F6',
                color: '#4B5563',
                height: 36,
                padding: '0 14px',
                backgroundColor: '#FFFFFF',
              }}
            >
              New Transfer
            </Button>
            <Button
              icon={<FileSpreadsheet size={14} />}
              onClick={() => message.success('Exporting Inventory Master Valuation Sheet...')}
              style={{
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 12,
                borderColor: '#ECE8F6',
                color: '#4B5563',
                height: 36,
                padding: '0 14px',
                backgroundColor: '#FFFFFF',
              }}
            >
              Export Valuation
            </Button>
          </div>
        }
      />

      {/* 2. Top Primary 4 High-Impact KPI Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Stock Valuation',
            value: `₹${(totalStockValue / 100000).toFixed(1)} Lakhs`,
            growth: `${totalStockQty} Total Units`,
            isDark: true,
            icon: <Boxes size={20} color="#5421A8" />,
          },
          {
            title: 'Available for Dispatch',
            value: `${totalAvailableQty} Units`,
            growth: `${totalReservedQty} Units Reserved`,
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'In-Transit Freight',
            value: `${totalInTransitQty} Inbound`,
            growth: 'Across 3 Transfers',
            isDark: true,
            icon: <Truck size={20} color="#0284C7" />,
          },
          {
            title: 'Critical Stock Alerts',
            value: `${lowStockCount + outOfStockCount} SKUs`,
            growth: `${outOfStockCount} Out of Stock`,
            isPositive: false,
            isDark: false,
            icon: <AlertTriangle size={20} color="#EF4444" />,
          },
        ]}
      />

      {/* 3. Secondary Metrics Bar (Compact 4 Sub-Metrics) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        <div
          onClick={() => navigate('/app/sales/warehouses')}
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '12px 18px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 2px 8px rgba(84, 33, 168, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7544D6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ECE8F6')}
        >
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Warehouses
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1E1B4B', marginTop: 2 }}>
              {totalWarehouses} Depots
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#F5F3FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5421A8',
            }}
          >
            <Building2 size={18} />
          </div>
        </div>

        <div
          onClick={() => navigate('/app/sales/stock-management')}
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '12px 18px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 2px 8px rgba(84, 33, 168, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7544D6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ECE8F6')}
        >
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Catalog SKUs Monitored
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1E1B4B', marginTop: 2 }}>
              {totalProducts} Master Items
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <Package size={18} />
          </div>
        </div>

        <div
          onClick={() => navigate('/app/sales/low-stock-alerts')}
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '12px 18px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 2px 8px rgba(84, 33, 168, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7544D6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ECE8F6')}
        >
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Replenishment Plans
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#D97706', marginTop: 2 }}>
              {INITIAL_REORDER_ITEMS.length} Suggestions
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <RefreshCw size={18} />
          </div>
        </div>

        <div
          onClick={() => navigate('/app/sales/stock-adjustments')}
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '12px 18px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 2px 8px rgba(84, 33, 168, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7544D6')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ECE8F6')}
        >
          <div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Pending Adjustments
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1E1B4B', marginTop: 2 }}>
              {INITIAL_ADJUSTMENTS.filter((a) => a.status === 'Pending Approval').length} For Review
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6D28D9',
            }}
          >
            <SlidersHorizontal size={18} />
          </div>
        </div>
      </div>

      {/* 4. Main Consolidated Operations Hub */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #EAE5F5',
          boxShadow: '0 8px 30px rgba(84, 33, 168, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Navigation Tabs Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #F1EDF9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(84, 33, 168, 0.25)',
              }}
            >
              <Boxes size={19} />
            </div>
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Inventory Management & Movement Streams
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>
                Live stock transactions, category distribution, warehouse capacities, and item velocity
              </div>
            </div>
          </div>

          {/* Segmented Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: '#F1EDF9',
              padding: 3,
              borderRadius: 14,
              border: '1px solid #E5DEFF',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('movements')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'movements' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'movements' ? '#5421A8' : '#64748B',
                boxShadow: activeTab === 'movements' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <TrendingUp size={14} />
              Recent Movements ({INITIAL_STOCK_IN.length + INITIAL_STOCK_OUT.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'categories' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'categories' ? '#5421A8' : '#64748B',
                boxShadow: activeTab === 'categories' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Layers size={14} />
              Categories ({categoryStats.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('warehouses')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'warehouses' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'warehouses' ? '#5421A8' : '#64748B',
                boxShadow: activeTab === 'warehouses' ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Building2 size={14} />
              Depots ({INITIAL_WAREHOUSES.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Live Transactions Table */}
        {activeTab === 'movements' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Reference / ID
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Type & Purpose
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Warehouse Facility
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                    Units Moved
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Total Value
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Stock In Rows */}
                {INITIAL_STOCK_IN.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: '#D1FAE5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowDownLeft size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>
                            {t.grnNumber}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            Ref: {t.referenceNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#ECFDF5',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        Stock In ({t.sourceType})
                      </span>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                        Party: {t.supplierName}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#334155' }}>
                      {t.warehouseName}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#059669', fontSize: 13 }}>+{t.totalQuantity} Units</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>₹{t.totalAmount.toLocaleString()}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: t.status === 'Completed' ? '#D1FAE5' : '#FEF3C7',
                          color: t.status === 'Completed' ? '#059669' : '#D97706',
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => navigate('/app/sales/stock-in-out')}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#5421A8',
                          fontWeight: 700,
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 6,
                        }}
                      >
                        Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Stock Out Rows */}
                {INITIAL_STOCK_OUT.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: '#FEE2E2',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowUpRight size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>
                            {t.issueNumber}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            Ref: {t.orderReference}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: '#FEF2F2',
                          color: '#DC2626',
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        Stock Out ({t.issueType})
                      </span>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                        To: {t.destination}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#334155' }}>
                      {t.warehouseName}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#DC2626', fontSize: 13 }}>-{t.totalQuantity} Units</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>₹{t.totalAmount.toLocaleString()}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: t.status === 'Completed' ? '#D1FAE5' : '#FEF3C7',
                          color: t.status === 'Completed' ? '#059669' : '#D97706',
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => navigate('/app/sales/stock-in-out')}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#5421A8',
                          fontWeight: 700,
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 6,
                        }}
                      >
                        Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Category Distribution */}
        {activeTab === 'categories' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Category Name
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                    Item Count
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Total Inventory Value
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 240 }}>
                    Value Share
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                    Stock Health
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((c, idx) => (
                  <tr
                    key={c.category}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{c.category}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag style={{ borderRadius: 6, fontWeight: 700 }}>{c.count} SKUs</Tag>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#5421A8', fontSize: 13.5 }}>₹{c.totalVal.toLocaleString()}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Progress percent={c.percent} size="small" strokeColor="#7544D6" railColor="#EDE9FE" showInfo={false} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', minWidth: 42 }}>{c.percent}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: c.health === 'Optimal' ? '#D1FAE5' : c.health === 'Good' ? '#E0F2FE' : '#FEE2E2',
                          color: c.health === 'Optimal' ? '#059669' : c.health === 'Good' ? '#0284C7' : '#DC2626',
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {c.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Warehouses Capacity Table */}
        {activeTab === 'warehouses' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Depot Name & Code
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Type / Role
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Manager
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 200 }}>
                    Storage Utilization
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Stock Value
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_WAREHOUSES.map((w, idx) => (
                  <tr
                    key={w.id}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Code: {w.code} • {w.city}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{w.type}</Tag>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                      {w.manager}
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                        <span>{w.storageUtilizationPercent}% Full</span>
                        <span>{w.totalCapacitySqFt.toLocaleString()} sq.ft</span>
                      </div>
                      <Progress
                        percent={w.storageUtilizationPercent}
                        size="small"
                        strokeColor={w.storageUtilizationPercent > 80 ? '#F59E0B' : '#7544D6'}
                        railColor="#EDE9FE"
                        showInfo={false}
                      />
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#5421A8', fontSize: 13 }}>₹{(w.totalValuation / 100000).toFixed(1)}L</strong>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => navigate('/app/sales/warehouses')}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#5421A8',
                          fontWeight: 700,
                          fontSize: 12,
                          padding: '4px 8px',
                          borderRadius: 6,
                        }}
                      >
                        Manage &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Strip */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid #F1EDF9',
            background: '#FAF9FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#64748B',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#5421A8" />
            <span>Multi-warehouse real-time ledger synchronized across Sales & Service modules.</span>
          </div>
          <div>
            Last audited count cycle: <strong>November 18, 2026</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
