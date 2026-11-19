import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Drawer,
} from 'antd';
import {
  SlidersHorizontal,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_ADJUSTMENTS, INITIAL_PRODUCTS, INITIAL_WAREHOUSES } from './inventoryMockData';
import type { StockAdjustmentTransaction } from './inventoryData';

export const StockAdjustmentsPage: React.FC = () => {
  const [adjustments, setAdjustments] = useState<StockAdjustmentTransaction[]>(INITIAL_ADJUSTMENTS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<StockAdjustmentTransaction | null>(null);

  const [form] = Form.useForm();

  const handleSaveAdjustment = (values: any) => {
    const variance = Number(values.physicalQty) - Number(values.systemQty);
    const newAdj: StockAdjustmentTransaction = {
      id: `adj-${Date.now()}`,
      adjNumber: `ADJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      warehouseName: values.warehouseName,
      adjustmentType: values.adjustmentType,
      productName: values.productName,
      sku: values.sku,
      systemQty: Number(values.systemQty),
      physicalQty: Number(values.physicalQty),
      varianceQty: variance,
      varianceAmount: variance * (Number(values.unitCost) || 5000),
      reason: values.reason,
      date: new Date().toISOString().split('T')[0],
      requestedBy: values.requestedBy || 'Cycle Count Auditor',
      approvedBy: 'Pending Store Head',
      status: 'Pending Approval',
    };

    setAdjustments([newAdj, ...adjustments]);
    setIsNewModalOpen(false);
    form.resetFields();
    message.success(`Stock Adjustment ${newAdj.adjNumber} submitted for approval!`);
  };

  const handleApprove = (id: string) => {
    setAdjustments(
      adjustments.map((a) => (a.id === id ? { ...a, status: 'Approved', approvedBy: 'Store Head Approved' } : a))
    );
    message.success('Stock adjustment approved! Product physical count reconciled in ledger.');
  };

  const filtered = adjustments.filter((a) => {
    const matchesSearch =
      search === '' ||
      a.adjNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.productName.toLowerCase().includes(search.toLowerCase()) ||
      a.sku.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || a.adjustmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Stock Corrections & Reconciliation Adjustments"
        subtitle="Manage physical audit counts, damage write-offs, scrap reductions, expiry quarantines, and positive/negative ledger adjustments."
        icon={<SlidersHorizontal size={20} />}
        searchPlaceholder="Search adjustment ref, SKU, product, reason..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Stock Adjustment"
        onPrimaryAction={() => setIsNewModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Adjustment Audit Ledger...')}
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
            Export Audit
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Adjustments Filed',
            value: `${adjustments.length} Records`,
            growth: 'Audit Reconciliations',
            isDark: true,
            icon: <SlidersHorizontal size={20} color="#5421A8" />,
          },
          {
            title: 'Net Variance Value',
            value: `₹${(Math.abs(adjustments.reduce((a, b) => a + b.varianceAmount, 0)) / 1000).toFixed(1)}k`,
            growth: 'Net Variance',
            isPositive: false,
            isDark: false,
            icon: <AlertTriangle size={20} color="#EF4444" />,
          },
          {
            title: 'Awaiting Authorization',
            value: `${adjustments.filter((a) => a.status === 'Pending Approval').length} Pending`,
            growth: 'Finance / Head Approval',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Reconciled Adjustments',
            value: `${adjustments.filter((a) => a.status === 'Approved').length} Cleared`,
            growth: 'Book Stock Updated',
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
        ]}
      />

      {/* 3. Main Data Card */}
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
        {/* Filter Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 220, height: 34 }}
              options={[
                { label: 'All Adjustment Types', value: 'ALL' },
                { label: 'Physical Count Adjustment', value: 'Physical Count Adjustment' },
                { label: 'Damage Adjustment', value: 'Damage Adjustment' },
                { label: 'Expiry Adjustment', value: 'Expiry Adjustment' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filtered.length}</strong> Adjustments
          </div>
        </div>

        {/* Clean Enterprise Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Adjustment No & Date
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Product SKU & Warehouse
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Book Qty
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Physical Qty
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Variance Qty
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Adjustment Reason
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => {
                const isPositive = a.varianceQty > 0;
                return (
                  <tr
                    key={a.id}
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
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{a.adjNumber}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{a.date}</div>
                    </td>

                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{a.productName}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        <strong style={{ color: '#5421A8' }}>{a.sku}</strong> • {a.warehouseName}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#475569' }}>
                      {a.systemQty}
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#1E1B4B' }}>
                      {a.physicalQty}
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: isPositive ? '#D1FAE5' : '#FEE2E2',
                          color: isPositive ? '#059669' : '#DC2626',
                          fontWeight: 800,
                          fontSize: 12,
                        }}
                      >
                        {isPositive ? `+${a.varianceQty}` : a.varianceQty} Units
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 11.5, color: '#475569', maxWidth: 240 }}>
                      <Tag color="purple" style={{ borderRadius: 6, marginBottom: 2 }}>{a.adjustmentType}</Tag>
                      <div>{a.reason}</div>
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: a.status === 'Approved' ? '#D1FAE5' : '#FEF3C7',
                          color: a.status === 'Approved' ? '#059669' : '#D97706',
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {a.status === 'Pending Approval' && (
                          <Button
                            size="small"
                            type="dashed"
                            onClick={() => handleApprove(a.id)}
                            style={{ borderColor: '#10B981', color: '#059669', fontWeight: 700, fontSize: 11 }}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="small"
                          type="text"
                          icon={<Eye size={14} color="#5421A8" />}
                          onClick={() => setSelectedAdjustment(a)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: New Adjustment */}
      <Modal
        title="Record Stock Adjustment / Cycle Count Variance"
        open={isNewModalOpen}
        onCancel={() => setIsNewModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAdjustment} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="adjustmentType" label="Adjustment Type" initialValue="Physical Count Adjustment">
              <Select
                options={[
                  { label: 'Physical Count Adjustment', value: 'Physical Count Adjustment' },
                  { label: 'Damage Adjustment', value: 'Damage Adjustment' },
                  { label: 'Expiry Adjustment', value: 'Expiry Adjustment' },
                  { label: 'Lost / Missing Item', value: 'Lost / Missing' },
                  { label: 'Excess Stock Found', value: 'Excess Stock Entry' },
                ]}
              />
            </Form.Item>
            <Form.Item name="warehouseName" label="Warehouse" initialValue="Chennai Central Depot (WH-01)">
              <Select
                options={[
                  { label: 'Chennai Central Depot (WH-01)', value: 'Chennai Central Depot (WH-01)' },
                  { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                  { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. 5/2-Way Pneumatic Directional Valve" />
            </Form.Item>
            <Form.Item name="sku" label="Product SKU" rules={[{ required: true }]}>
              <Input placeholder="e.g. PNEU-VALVE-5/2" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="systemQty" label="Book System Qty" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="physicalQty" label="Physical Counted Qty" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitCost" label="Est. Unit Cost (₹)" initialValue={4850}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="reason" label="Audit Reason & Root Cause Explanation" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Explain why physical count differs from book stock..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Submit for Approval
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Adjustment Details Drawer */}
      <Drawer
        title={`Adjustment Ledger Item: ${selectedAdjustment?.adjNumber}`}
        open={!!selectedAdjustment}
        onClose={() => setSelectedAdjustment(null)}
        width={460}
      >
        {selectedAdjustment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Product: <strong>{selectedAdjustment.productName}</strong> ({selectedAdjustment.sku})</div>
            <div>Facility: <strong>{selectedAdjustment.warehouseName}</strong></div>
            <div>Adjustment Category: <Tag color="purple">{selectedAdjustment.adjustmentType}</Tag></div>
            <div>Book System Qty: <strong>{selectedAdjustment.systemQty} Units</strong></div>
            <div>Physical Count Qty: <strong>{selectedAdjustment.physicalQty} Units</strong></div>
            <div>Reconciled Variance: <strong>{selectedAdjustment.varianceQty} Units (₹{selectedAdjustment.varianceAmount.toLocaleString()})</strong></div>
            <div>Filing Date: <strong>{selectedAdjustment.date}</strong></div>
            <div>Auditor: <strong>{selectedAdjustment.requestedBy}</strong></div>
            <div>Approval Status: <strong>{selectedAdjustment.status}</strong></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              Reason: {selectedAdjustment.reason}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
