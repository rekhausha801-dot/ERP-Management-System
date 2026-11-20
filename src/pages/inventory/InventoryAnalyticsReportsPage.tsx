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
  FileText,
  Boxes,
  Lock,
  Layers,
  ClipboardCheck,
  DollarSign,
  AlertOctagon,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_PRODUCTS, INITIAL_WAREHOUSES } from './inventoryMockData';
import type {
  StockRequestItem,
  StockReservationItem,
  BatchItem,
  StockAuditItem,
  DamagedStockItem,
} from './inventoryData';

export const InventoryAnalyticsReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('requests');

  // 1. Stock Requests Data
  const [requests, setRequests] = useState<StockRequestItem[]>([
    {
      id: 'req-01',
      requestNo: 'REQ-2026-301',
      department: 'Production Assembly',
      requestedBy: 'S. Selvakumar',
      productName: '3-Phase Induction Motor 15kW Heavy Duty',
      sku: 'MOT-3PH-015KW',
      requestedQty: 4,
      availableQty: 18,
      requiredDate: '2026-11-22',
      reason: 'Assembly for line 2 pump skid project.',
      status: 'Pending Approval',
    },
    {
      id: 'req-02',
      requestNo: 'REQ-2026-302',
      department: 'Field Maintenance',
      requestedBy: 'P. Balaji',
      productName: 'Digital RTD Temperature Transmitter 4-20mA',
      sku: 'TEMP-TRANS-420',
      requestedQty: 2,
      availableQty: 34,
      requiredDate: '2026-11-20',
      reason: 'Urgent sensor replacement at client plant.',
      status: 'Approved',
    },
  ]);

  // 2. Stock Reservations Data
  const [reservations, setReservations] = useState<StockReservationItem[]>([
    {
      id: 'res-01',
      reservationNo: 'RES-2026-101',
      type: 'Sales Order',
      referenceNo: 'SO-2026-901',
      customerName: 'Apex Precision Tools Ltd',
      productName: '3-Phase Induction Motor 15kW Heavy Duty',
      sku: 'MOT-3PH-015KW',
      reservedQty: 4,
      availableQty: 18,
      warehouseName: 'Chennai Central Depot (WH-01)',
      reservationDate: '2026-11-17',
      expiryDate: '2026-11-24',
      status: 'Active',
    },
    {
      id: 'res-02',
      reservationNo: 'RES-2026-102',
      type: 'Service Order',
      referenceNo: 'WO-2026-104',
      customerName: 'Metro Water Supply Station',
      productName: 'Compact PLC CPU Module with Profinet',
      sku: 'PLC-MOD-CPU12',
      reservedQty: 2,
      availableQty: 24,
      warehouseName: 'Bangalore Regional Hub (WH-02)',
      reservationDate: '2026-11-18',
      expiryDate: '2026-11-25',
      status: 'Active',
    },
  ]);

  // 3. Batches & Expiry Data
  const [batches, setBatches] = useState<BatchItem[]>([
    {
      id: 'bat-01',
      batchNo: 'BAT-2026-M15',
      productName: '3-Phase Induction Motor 15kW Heavy Duty',
      sku: 'MOT-3PH-015KW',
      manufacturingDate: '2026-08-15',
      expiryDate: '2031-08-15',
      supplier: 'Siemens Precision',
      warehouse: 'Chennai Central Depot (WH-01)',
      initialQty: 25,
      availableQty: 18,
      reservedQty: 4,
      expiredQty: 0,
      unitCost: 42500,
      daysToExpiry: 1720,
      status: 'Active',
    },
    {
      id: 'bat-02',
      batchNo: 'BAT-2025-MOB-09',
      productName: 'High-Temperature Industrial Lithium Grease EP2 (18kg Pail)',
      sku: 'IND-GREASE-EP2',
      manufacturingDate: '2025-01-10',
      expiryDate: '2026-12-31',
      supplier: 'Mobil Industrial',
      warehouse: 'Chennai Central Depot (WH-01)',
      initialQty: 40,
      availableQty: 12,
      reservedQty: 2,
      expiredQty: 2,
      unitCost: 7800,
      daysToExpiry: 42,
      status: 'Near Expiry',
    },
  ]);

  // 4. Physical Stock Audit Data
  const [audits, setAudits] = useState<StockAuditItem[]>([
    {
      id: 'aud-01',
      auditNo: 'AUD-2026-Q3-01',
      auditType: 'Cycle Count',
      warehouseName: 'Chennai Central Depot (WH-01)',
      auditDate: '2026-11-16',
      leadAuditor: 'R. Gopinath (Quality Inspector)',
      totalProductsAudited: 85,
      itemsWithVariance: 2,
      netVarianceAmount: -5900,
      status: 'Completed',
    },
    {
      id: 'aud-02',
      auditNo: 'AUD-2026-Q3-02',
      auditType: 'Warehouse Spot Check',
      warehouseName: 'Bangalore Regional Hub (WH-02)',
      auditDate: '2026-11-18',
      leadAuditor: 'Santosh Gowda',
      totalProductsAudited: 42,
      itemsWithVariance: 1,
      netVarianceAmount: -68000,
      status: 'Pending Review',
    },
  ]);

  // 5. Damaged & Expired Stock Data
  const [damagedItems, setDamagedItems] = useState<DamagedStockItem[]>([
    {
      id: 'dmg-01',
      reportNo: 'DMG-2026-08',
      productName: 'Variable Frequency Drive 22kW 415V IP65',
      sku: 'VFD-DRV-022KW',
      batchNo: 'BAT-2026-V22',
      warehouse: 'Bangalore Regional Hub (WH-02)',
      damageType: 'Handling Failure',
      damagedQty: 1,
      unitCost: 68000,
      totalLossValue: 68000,
      reportedBy: 'Santosh Gowda',
      reportedDate: '2026-11-18',
      status: 'Under Inspection',
    },
    {
      id: 'dmg-02',
      reportNo: 'DMG-2026-09',
      productName: 'High-Temperature Industrial Lithium Grease EP2 (18kg Pail)',
      sku: 'IND-GREASE-EP2',
      batchNo: 'BAT-2025-MOB-09',
      warehouse: 'Chennai Central Depot (WH-01)',
      damageType: 'Chemical Expiry',
      damagedQty: 2,
      unitCost: 7800,
      totalLossValue: 15600,
      reportedBy: 'D. Vinod',
      reportedDate: '2026-11-17',
      status: 'Approved for Scrap',
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Stock Requests, Audits, Valuation & Compliance"
        subtitle="Manage department material requests, sales reservations, batch/expiry controls, physical stock reconciliation, and damaged write-offs."
        icon={<ClipboardCheck size={20} />}
        searchPlaceholder="Search audit, batch, request, or scrap report..."
        primaryActionLabel="Export Inventory Pack"
        onPrimaryAction={() => message.success('Exporting Consolidated Inventory Compliance Dossier...')}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Stock Valuation Ledger...')}
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
            Valuation Sheet
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Internal Stock Requests',
            value: `${requests.length} Requests`,
            growth: `${requests.filter((r) => r.status === 'Pending Approval').length} Pending Approval`,
            isDark: true,
            icon: <Boxes size={20} color="#5421A8" />,
          },
          {
            title: 'Active Stock Reservations',
            value: `${reservations.reduce((a, b) => a + b.reservedQty, 0)} Units`,
            growth: 'Locked for Deliveries',
            isPositive: true,
            isDark: false,
            icon: <Lock size={20} color="#0284C7" />,
          },
          {
            title: 'Batches Monitored',
            value: `${batches.length} Batches`,
            growth: `${batches.filter((b) => b.status === 'Near Expiry').length} Near Expiry`,
            isDark: true,
            icon: <Layers size={20} color="#F59E0B" />,
          },
          {
            title: 'Damaged / Scrap Loss',
            value: `₹${(damagedItems.reduce((a, b) => a + b.totalLossValue, 0) / 1000).toFixed(1)}k`,
            growth: `${damagedItems.length} Quarantined Items`,
            isPositive: false,
            isDark: false,
            icon: <AlertOctagon size={20} color="#EF4444" />,
          },
        ]}
      />

      {/* 3. Main Consolidated Tabs Card */}
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
        {/* Custom Tab Switcher */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #F1EDF9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 100%)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: '#F1EDF9',
              padding: 3,
              borderRadius: 14,
              border: '1px solid #E5DEFF',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {[
              { key: 'requests', label: 'Stock Requests', icon: <Boxes size={14} /> },
              { key: 'reservations', label: 'Order Reservations', icon: <Lock size={14} /> },
              { key: 'batches', label: 'Batches & Expiry', icon: <Layers size={14} /> },
              { key: 'audits', label: 'Physical Stock Audits', icon: <ClipboardCheck size={14} /> },
              { key: 'scrap', label: 'Damaged & Scrap', icon: <AlertOctagon size={14} /> },
              { key: 'valuation', label: 'Inventory Valuation', icon: <DollarSign size={14} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: activeTab === tab.key ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab.key ? '#5421A8' : '#64748B',
                  boxShadow: activeTab === tab.key ? '0 2px 8px rgba(84, 33, 168, 0.12)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Stock Requests */}
        {activeTab === 'requests' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Request No</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Department & Requester</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product Requested</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Req Qty</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Stock Available</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Required Date</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Status</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, idx) => (
                  <tr key={r.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{r.requestNo}</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#334155', fontSize: 12.5 }}>{r.department}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>By: {r.requestedBy}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 12.5 }}>{r.productName}</div>
                      <div style={{ fontSize: 11, color: '#5421A8' }}>{r.sku}</div>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#5421A8' }}>{r.requestedQty} Units</strong>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{r.availableQty} Units</span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                      {r.requiredDate}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color={r.status === 'Approved' ? 'success' : 'warning'}>{r.status}</Tag>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      {r.status === 'Pending Approval' ? (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            setRequests(requests.map((item) => (item.id === r.id ? { ...item, status: 'Approved' } : item)));
                            message.success('Stock Request approved for issue!');
                          }}
                          style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 700, fontSize: 11 }}
                        >
                          Approve Issue
                        </Button>
                      ) : (
                        <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Cleared &check;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Stock Reservations */}
        {activeTab === 'reservations' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Reservation Ref</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Customer & Order</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product SKU</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Reserved Qty</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Warehouse</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Hold Expiry</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, idx) => (
                  <tr key={res.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{res.reservationNo}</strong>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{res.reservationDate}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{res.customerName}</div>
                      <div style={{ fontSize: 11, color: '#5421A8' }}>Ref: {res.referenceNo}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#1E1B4B' }}>{res.productName}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{res.sku}</div>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 12, background: '#E0F2FE', color: '#0284C7', fontWeight: 800 }}>
                        {res.reservedQty} Units Locked
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                      {res.warehouseName}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#D97706', fontWeight: 600 }}>
                      {res.expiryDate}
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <Tag color="cyan">{res.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Batches & Expiry */}
        {activeTab === 'batches' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Batch Number</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product & Supplier</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Available Qty</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Mfg Date</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Expiry Date</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Days Remaining</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b, idx) => (
                  <tr key={b.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{b.batchNo}</strong>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{b.warehouse}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{b.productName}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Supplier: {b.supplier}</div>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#059669' }}>{b.availableQty} Units</strong>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12 }}>{b.manufacturingDate}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 700, color: b.daysToExpiry < 60 ? '#DC2626' : '#334155' }}>
                      {b.expiryDate}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color={b.daysToExpiry < 60 ? 'error' : 'purple'}>{b.daysToExpiry} Days</Tag>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 12, background: b.status === 'Active' ? '#D1FAE5' : '#FEE2E2', color: b.status === 'Active' ? '#059669' : '#DC2626', fontWeight: 800, fontSize: 11 }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Physical Stock Audits */}
        {activeTab === 'audits' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Audit Code</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Type & Warehouse</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Lead Auditor</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>SKUs Audited</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Variances Found</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Net Variance Value</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a, idx) => (
                  <tr key={a.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{a.auditNo}</strong>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Date: {a.auditDate}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color="purple">{a.auditType}</Tag>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{a.warehouseName}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12 }}>{a.leadAuditor}</td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag>{a.totalProductsAudited} Items</Tag>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: a.itemsWithVariance > 0 ? '#DC2626' : '#059669' }}>
                        {a.itemsWithVariance} Items
                      </strong>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#DC2626' }}>₹{Math.abs(a.netVarianceAmount).toLocaleString()}</strong>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <Tag color={a.status === 'Completed' ? 'success' : 'processing'}>{a.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Damaged & Scrap */}
        {activeTab === 'scrap' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Damage Dossier</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product & SKU</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Damage Cause</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Quarantined Qty</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Loss Valuation</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Disposal Status</th>
                </tr>
              </thead>
              <tbody>
                {damagedItems.map((d, idx) => (
                  <tr key={d.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#1E1B4B', fontSize: 13 }}>{d.reportNo}</strong>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Reported: {d.reportedDate}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{d.productName}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{d.sku} • {d.warehouse}</div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <Tag color="volcano">{d.damageType}</Tag>
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#DC2626' }}>{d.damagedQty} Units</strong>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <strong style={{ color: '#DC2626' }}>₹{d.totalLossValue.toLocaleString()}</strong>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <Tag color="gold">{d.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Financial Stock Valuation */}
        {activeTab === 'valuation' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#FAF9FE', border: '1px solid #ECE8F6', padding: 18, borderRadius: 14 }}>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Book Asset Valuation</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#5421A8', marginTop: 4 }}>
                  ₹{(INITIAL_PRODUCTS.reduce((a, b) => a + b.stockValue, 0) / 100000).toFixed(2)} Lakhs
                </div>
                <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>Compliant with GAAP / AS-2 (FIFO Method)</div>
              </div>

              <div style={{ background: '#FAF9FE', border: '1px solid #ECE8F6', padding: 18, borderRadius: 14 }}>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Weighted Average Unit Cost Base</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#1E1B4B', marginTop: 4 }}>
                  ₹{(INITIAL_PRODUCTS.reduce((a, b) => a + b.unitCost, 0) / INITIAL_PRODUCTS.length).toFixed(0)} Avg
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Dynamic standard moving price index</div>
              </div>

              <div style={{ background: '#FAF9FE', border: '1px solid #ECE8F6', padding: 18, borderRadius: 14 }}>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Capital Tied in Safety Stock</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0284C7', marginTop: 4 }}>
                  ₹32.4 Lakhs
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Buffer stock insurance coverage active</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                icon={<FileSpreadsheet size={14} />}
                onClick={() => message.success('Exporting Statutory Stock Audit Balance Sheet...')}
                style={{ background: '#5421A8', color: '#FFFFFF', fontWeight: 700, borderRadius: 14 }}
              >
                Download Valuation Ledger (Excel)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
