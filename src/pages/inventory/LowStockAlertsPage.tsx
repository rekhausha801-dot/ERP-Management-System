import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Progress,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Drawer,
} from 'antd';
import {
  ShieldAlert,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  DollarSign,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useNavigate } from 'react-router-dom';
import { INITIAL_REORDER_ITEMS, INITIAL_PRODUCTS } from './inventoryMockData';
import type { ReorderPlanItem } from './inventoryData';

export const LowStockAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reorderItems, setReorderItems] = useState<ReorderPlanItem[]>(INITIAL_REORDER_ITEMS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [selectedItem, setSelectedItem] = useState<ReorderPlanItem | null>(null);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [prForm] = Form.useForm();

  // Handle Generate Purchase Request
  const handleCreatePR = (values: any) => {
    if (!selectedItem) return;
    setReorderItems(
      reorderItems.map((r) =>
        r.id === selectedItem.id ? { ...r, status: 'PO Created' } : r
      )
    );
    setIsPRModalOpen(false);
    message.success(`Purchase Requisition successfully routed to Procurement for ${selectedItem.sku}!`);
  };

  const filtered = reorderItems.filter((r) => {
    const matchesSearch =
      search === '' ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.preferredSupplier.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Stock Depletion & Reorder Alerts"
        subtitle="Automated inventory safety monitoring, lead-time consumption forecasting, and automatic procurement replenishment suggestions."
        icon={<ShieldAlert size={20} />}
        searchPlaceholder="Search product SKU, name, preferred supplier..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Bulk Generate Reorders"
        onPrimaryAction={() => {
          setReorderItems(reorderItems.map((r) => ({ ...r, status: 'PO Created' })));
          message.success('Bulk Purchase Orders created for all depleted inventory items!');
        }}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              icon={<ShoppingCart size={14} />}
              onClick={() => navigate('/app/sales/purchase-orders')}
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
              Purchase Orders
            </Button>
            <Button
              icon={<FileSpreadsheet size={14} />}
              onClick={() => message.success('Exporting Stock Depletion Schedule...')}
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
              Export Report
            </Button>
          </div>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Critical Stock Shortages',
            value: `${reorderItems.filter((r) => r.status === 'Critical Shortage').length} SKUs`,
            growth: 'Immediate Reorder',
            isDark: true,
            icon: <AlertTriangle size={20} color="#EF4444" />,
          },
          {
            title: 'Suggested Replenishment',
            value: `${reorderItems.reduce((a, b) => a + b.suggestedReorderQty, 0)} Units`,
            growth: 'Total Reorder Qty',
            isPositive: true,
            isDark: false,
            icon: <ShoppingCart size={20} color="#0284C7" />,
          },
          {
            title: 'Estimated Procurement Cost',
            value: `₹${(reorderItems.reduce((a, b) => a + b.estimatedCost, 0) / 100000).toFixed(1)}L`,
            growth: 'PO Value Required',
            isDark: true,
            icon: <DollarSign size={20} color="#5421A8" />,
          },
          {
            title: 'Active Reorder Enquiries',
            value: `${reorderItems.filter((r) => r.status === 'PO Created').length} In Progress`,
            growth: 'Purchase Orders Placed',
            isPositive: false,
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
        {/* Table Filters Header */}
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
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 190, height: 34 }}
              options={[
                { label: 'All Replenishment Status', value: 'ALL' },
                { label: 'Critical Shortage', value: 'Critical Shortage' },
                { label: 'Pending PR', value: 'Pending PR' },
                { label: 'PO Created', value: 'PO Created' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filtered.length}</strong> Alerts
          </div>
        </div>

        {/* Clean Enterprise Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 260 }}>
                  Product / SKU
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Preferred Supplier
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Current Stock
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Reorder Level
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Suggested Order
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Est. Purchase Cost
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={r.id}
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
                    <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{r.productName}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      <strong style={{ color: '#5421A8' }}>{r.sku}</strong> • {r.category}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{r.preferredSupplier}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Lead Time: ~{r.leadTimeDays} Days</div>
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <strong style={{ color: r.availableStock === 0 ? '#DC2626' : '#D97706', fontSize: 13 }}>
                      {r.availableStock} Units
                    </strong>
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#475569' }}>
                    {r.reorderPoint} Units
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: '#EDE9FE',
                        color: '#5421A8',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      +{r.suggestedReorderQty}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <strong style={{ color: '#1E1B4B', fontSize: 13 }}>₹{r.estimatedCost.toLocaleString()}</strong>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: r.status === 'PO Created' ? '#D1FAE5' : r.status === 'Critical Shortage' ? '#FEE2E2' : '#FEF3C7',
                        color: r.status === 'PO Created' ? '#059669' : r.status === 'Critical Shortage' ? '#DC2626' : '#D97706',
                        fontWeight: 800,
                        fontSize: 11,
                      }}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                    {r.status !== 'PO Created' ? (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          setSelectedItem(r);
                          prForm.setFieldsValue({
                            suggestedQty: r.suggestedReorderQty,
                            supplier: r.preferredSupplier,
                          });
                          setIsPRModalOpen(true);
                        }}
                        style={{
                          background: '#5421A8',
                          borderColor: '#5421A8',
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        Create PO
                      </Button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>
                        PO Generated &check;
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Create PO */}
      <Modal
        title={`Generate Purchase Order: ${selectedItem?.sku}`}
        open={isPRModalOpen}
        onCancel={() => setIsPRModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={prForm} layout="vertical" onFinish={handleCreatePR} style={{ marginTop: 12 }}>
          <Form.Item label="Product SKU & Name">
            <Input value={`${selectedItem?.sku} - ${selectedItem?.productName}`} disabled />
          </Form.Item>
          <Form.Item name="supplier" label="Target Supplier" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="suggestedQty" label="Order Quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Estimated Cost (₹)">
              <Input value={`₹${selectedItem?.estimatedCost.toLocaleString()}`} disabled />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsPRModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm & Create PO
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
