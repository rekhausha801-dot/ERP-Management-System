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
  Building2,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Boxes,
  Truck,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_WAREHOUSES } from './inventoryMockData';
import type { WarehouseItem } from './inventoryData';

export const WarehouseManagementPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem | null>(null);

  const [form] = Form.useForm();

  const handleSaveWarehouse = (values: any) => {
    const newWh: WarehouseItem = {
      id: `wh-${Date.now()}`,
      code: values.code.toUpperCase(),
      name: values.name,
      type: values.type,
      address: values.address,
      city: values.city,
      manager: values.manager,
      contactPhone: values.contactPhone,
      email: values.email,
      totalCapacitySqFt: Number(values.totalCapacitySqFt) || 15000,
      storageUtilizationPercent: 0,
      activeProductsCount: 0,
      totalValuation: 0,
      status: 'Active',
    };

    setWarehouses([newWh, ...warehouses]);
    setIsAddModalOpen(false);
    form.resetFields();
    message.success(`Warehouse Facility ${newWh.code} registered successfully!`);
  };

  const filtered = warehouses.filter((w) => {
    const matchesSearch =
      search === '' ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase()) ||
      w.manager.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || w.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Multi-Warehouse & Storage Bin Infrastructure"
        subtitle="Configure enterprise warehousing hubs, regional transit depots, storage rack/bin layouts, and capacity utilization."
        icon={<Building2 size={20} />}
        searchPlaceholder="Search warehouse name, code, manager, city..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Register New Warehouse"
        onPrimaryAction={() => setIsAddModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Warehouse Infrastructure Directory...')}
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
            Export Directory
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Warehouse Depots',
            value: `${warehouses.length} Facilities`,
            growth: 'Operational Hubs',
            isDark: true,
            icon: <Building2 size={20} color="#5421A8" />,
          },
          {
            title: 'Total Storage Footprint',
            value: `${warehouses.reduce((a, b) => a + b.totalCapacitySqFt, 0).toLocaleString()} sq.ft`,
            growth: 'Industrial Storage',
            isPositive: true,
            isDark: false,
            icon: <Boxes size={20} color="#0284C7" />,
          },
          {
            title: 'Aggregated Asset Valuation',
            value: `₹${(warehouses.reduce((a, b) => a + b.totalValuation, 0) / 10000000).toFixed(2)} Cr`,
            growth: 'Multi-Location Stocks',
            isDark: true,
            icon: <Building2 size={20} color="#6D28D9" />,
          },
          {
            title: 'Avg Storage Capacity Used',
            value: `${(warehouses.reduce((a, b) => a + b.storageUtilizationPercent, 0) / warehouses.length).toFixed(1)}%`,
            growth: 'Optimal Range (60-80%)',
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
        {/* Filter Controls */}
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
                { label: 'All Warehouse Types', value: 'ALL' },
                { label: 'Main Warehouse', value: 'Main Warehouse' },
                { label: 'Regional Warehouse', value: 'Regional Warehouse' },
                { label: 'Branch Warehouse', value: 'Branch Warehouse' },
                { label: 'Service Warehouse', value: 'Service Warehouse' },
                { label: 'Transit Warehouse', value: 'Transit Warehouse' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filtered.length}</strong> Facilities
          </div>
        </div>

        {/* Clean Enterprise Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 260 }}>
                  Warehouse Facility
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Classification
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Facility Manager
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 220 }}>
                  Storage Utilization
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Stock Valuation
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, idx) => (
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
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      <strong style={{ color: '#5421A8' }}>{w.code}</strong> • {w.city}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                    <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{w.type}</Tag>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{w.manager}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{w.contactPhone}</div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                      <span>{w.storageUtilizationPercent}% Utilized</span>
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
                    <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{w.activeProductsCount} SKUs</div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: w.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                        color: w.status === 'Active' ? '#059669' : '#D97706',
                        fontWeight: 800,
                        fontSize: 11,
                      }}
                    >
                      {w.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                    <Button
                      size="small"
                      type="text"
                      icon={<Eye size={14} color="#5421A8" />}
                      onClick={() => setSelectedWarehouse(w)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Register Warehouse */}
      <Modal
        title="Register New Warehouse Facility"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveWarehouse} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Warehouse Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Hyderabad Central Hub" />
            </Form.Item>
            <Form.Item name="code" label="Warehouse Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. WH-HYD-06" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="type" label="Facility Role / Type" initialValue="Regional Warehouse">
              <Select
                options={[
                  { label: 'Main Warehouse', value: 'Main Warehouse' },
                  { label: 'Regional Warehouse', value: 'Regional Warehouse' },
                  { label: 'Branch Warehouse', value: 'Branch Warehouse' },
                  { label: 'Service Warehouse', value: 'Service Warehouse' },
                  { label: 'Transit Warehouse', value: 'Transit Warehouse' },
                  { label: 'Damaged Goods Warehouse', value: 'Damaged Goods Warehouse' },
                ]}
              />
            </Form.Item>
            <Form.Item name="totalCapacitySqFt" label="Total Capacity (sq.ft)" initialValue={20000}>
              <InputNumber min={500} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Street Address" rules={[{ required: true }]}>
            <Input placeholder="Plot / Street / Industrial Area..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="city" label="City & State" rules={[{ required: true }]}>
              <Input placeholder="e.g. Hyderabad, Telangana" />
            </Form.Item>
            <Form.Item name="manager" label="Facility Manager" rules={[{ required: true }]}>
              <Input placeholder="e.g. Ramesh Naidu" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="contactPhone" label="Contact Phone" rules={[{ required: true }]}>
              <Input placeholder="+91 98..." />
            </Form.Item>
            <Form.Item name="email" label="Contact Email" rules={[{ required: true }]}>
              <Input placeholder="wh.hyd@company.com" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Facility
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Warehouse Details Drawer */}
      <Drawer
        title={`Warehouse Profile: ${selectedWarehouse?.code}`}
        open={!!selectedWarehouse}
        onClose={() => setSelectedWarehouse(null)}
        width={480}
      >
        {selectedWarehouse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>{selectedWarehouse.name}</div>
            <div>Classification: <Tag color="purple">{selectedWarehouse.type}</Tag></div>
            <div>Address: <strong>{selectedWarehouse.address}, {selectedWarehouse.city}</strong></div>
            <div>Facility Manager: <strong>{selectedWarehouse.manager}</strong></div>
            <div>Direct Phone: <strong>{selectedWarehouse.contactPhone}</strong></div>
            <div>Storage Footprint: <strong>{selectedWarehouse.totalCapacitySqFt.toLocaleString()} sq.ft</strong></div>
            <div>Storage Utilization: <strong>{selectedWarehouse.storageUtilizationPercent}%</strong></div>
            <div>Total Inventory Asset: <strong>₹{(selectedWarehouse.totalValuation / 100000).toFixed(2)} Lakhs</strong></div>
            <div>Catalog Products Stored: <strong>{selectedWarehouse.activeProductsCount} Items</strong></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8, fontSize: 12, color: '#64748B' }}>
              Zone & Bin Allocation: Zones A through D active with Barcode scanning terminals configured.
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
