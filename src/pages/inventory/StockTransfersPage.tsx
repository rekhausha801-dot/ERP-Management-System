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
  DatePicker,
  Drawer,
} from 'antd';
import {
  Truck,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Building2,
  Boxes,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_TRANSFERS, INITIAL_WAREHOUSES, INITIAL_PRODUCTS } from './inventoryMockData';
import type { StockTransferTransaction } from './inventoryData';

export const StockTransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransferTransaction[]>(INITIAL_TRANSFERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransferTransaction | null>(null);

  const [form] = Form.useForm();

  // Create New Stock Transfer
  const handleSaveTransfer = (values: any) => {
    if (values.sourceWarehouse === values.destWarehouse) {
      message.error('Source and Destination Warehouses cannot be the same!');
      return;
    }

    const newTransfer: StockTransferTransaction = {
      id: `tr-${Date.now()}`,
      transferNo: `TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
      sourceWarehouse: values.sourceWarehouse,
      destWarehouse: values.destWarehouse,
      transferDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: values.expectedDate || '2026-11-25',
      transportVehicle: values.transportVehicle || 'Company Freight Van',
      driverContact: values.driverContact || '+91 98840 11223',
      initiatedBy: values.initiatedBy || 'Store Associate',
      approvedBy: 'Warehouse Manager',
      status: 'In Transit',
      itemCount: 1,
      totalQty: Number(values.totalQty) || 10,
      notes: values.notes || 'Inter-warehouse stock rebalancing transfer.',
    };

    setTransfers([newTransfer, ...transfers]);
    setIsNewTransferModalOpen(false);
    form.resetFields();
    message.success(`Transfer Order ${newTransfer.transferNo} generated successfully! Stock status set to In-Transit.`);
  };

  const handleMarkDelivered = (id: string) => {
    setTransfers(
      transfers.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
    );
    message.success('Stock transfer received and credited to destination warehouse balance!');
  };

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch =
      search === '' ||
      t.transferNo.toLowerCase().includes(search.toLowerCase()) ||
      t.sourceWarehouse.toLowerCase().includes(search.toLowerCase()) ||
      t.destWarehouse.toLowerCase().includes(search.toLowerCase()) ||
      t.transportVehicle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Inter-Warehouse Stock Transfers"
        subtitle="Coordinate internal inventory transfers between central depots, regional hubs, and service transit locations."
        icon={<Truck size={20} />}
        searchPlaceholder="Search transfer no, source, destination, vehicle..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Initiate Stock Transfer"
        onPrimaryAction={() => setIsNewTransferModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Stock Transfers Register...')}
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
            Export Transfers
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Active Transfers',
            value: `${transfers.length} Transfers`,
            growth: `${transfers.reduce((a, b) => a + b.totalQty, 0)} Total Units`,
            isDark: true,
            icon: <Truck size={20} color="#5421A8" />,
          },
          {
            title: 'In-Transit Shipments',
            value: `${transfers.filter((t) => t.status === 'In Transit').length} In Transit`,
            growth: 'On the road',
            isPositive: true,
            isDark: false,
            icon: <Boxes size={20} color="#0284C7" />,
          },
          {
            title: 'Awaiting Authorization',
            value: `${transfers.filter((t) => t.status === 'Pending Approval').length} Orders`,
            growth: 'Review Required',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Completed Transfers',
            value: `${transfers.filter((t) => t.status === 'Completed').length} Received`,
            growth: '100% Verified',
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
        {/* Table Filter Controls */}
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
              style={{ width: 170, height: 34 }}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'In Transit', value: 'In Transit' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Pending Approval', value: 'Pending Approval' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filteredTransfers.length}</strong> Transfers
          </div>
        </div>

        {/* Clean Enterprise Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Transfer No & Date
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Origin & Destination Route
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Transport Logistics
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Transfer Qty
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Transfer Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No stock transfers match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t, idx) => (
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
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{t.transferNo}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        Date: {t.transferDate}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{t.sourceWarehouse}</span>
                        <ArrowRight size={13} color="#7544D6" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#5421A8' }}>{t.destWarehouse}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        Expected: {t.expectedDeliveryDate}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{t.transportVehicle}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Contact: {t.driverContact}</div>
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#5421A8', fontSize: 13 }}>{t.totalQty} Units</strong>
                      <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{t.itemCount} SKUs</div>
                    </td>

                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: t.status === 'Completed' ? '#D1FAE5' : t.status === 'In Transit' ? '#E0F2FE' : '#FEF3C7',
                          color: t.status === 'Completed' ? '#059669' : t.status === 'In Transit' ? '#0284C7' : '#D97706',
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {t.status === 'In Transit' && (
                          <Button
                            size="small"
                            type="dashed"
                            onClick={() => handleMarkDelivered(t.id)}
                            style={{ borderColor: '#10B981', color: '#059669', fontWeight: 700, fontSize: 11 }}
                          >
                            Mark Received
                          </Button>
                        )}
                        <Button
                          size="small"
                          type="text"
                          icon={<Eye size={14} color="#5421A8" />}
                          onClick={() => setSelectedTransfer(t)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: Initiate Stock Transfer */}
      <Modal
        title="Initiate Inter-Warehouse Stock Transfer"
        open={isNewTransferModalOpen}
        onCancel={() => setIsNewTransferModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveTransfer} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="sourceWarehouse" label="Source Warehouse" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Chennai Central Depot (WH-01)', value: 'Chennai Central Depot (WH-01)' },
                  { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                  { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
                ]}
              />
            </Form.Item>
            <Form.Item name="destWarehouse" label="Destination Warehouse" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                  { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
                  { label: 'Service Spares Depot (WH-04)', value: 'Service Spares Depot (WH-04)' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="totalQty" label="Total Units to Transfer" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="expectedDate" label="Expected Delivery Date">
              <Input placeholder="YYYY-MM-DD" defaultValue="2026-11-25" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="transportVehicle" label="Vehicle / Carrier Details" rules={[{ required: true }]}>
              <Input placeholder="e.g. Eicher 14ft (TN-09-CB-4491)" />
            </Form.Item>
            <Form.Item name="driverContact" label="Driver / Courier Contact" rules={[{ required: true }]}>
              <Input placeholder="e.g. +91 94441 00213" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Transfer Purpose & Instructions">
            <Input.TextArea rows={2} placeholder="Reason for transfer, handling instructions..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsNewTransferModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm & Dispatch
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Transfer Details Drawer */}
      <Drawer
        title={`Stock Transfer Dossier: ${selectedTransfer?.transferNo}`}
        open={!!selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        width={480}
      >
        {selectedTransfer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Origin: <strong>{selectedTransfer.sourceWarehouse}</strong></div>
            <div>Destination: <strong>{selectedTransfer.destWarehouse}</strong></div>
            <div>Date Dispatched: <strong>{selectedTransfer.transferDate}</strong></div>
            <div>Expected Arrival: <strong>{selectedTransfer.expectedDeliveryDate}</strong></div>
            <div>Transport Vehicle: <strong>{selectedTransfer.transportVehicle}</strong></div>
            <div>Carrier Contact: <strong>{selectedTransfer.driverContact}</strong></div>
            <div>Total Units: <strong>{selectedTransfer.totalQty} Units</strong></div>
            <div>Status: <Tag color="purple">{selectedTransfer.status}</Tag></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              Instructions: {selectedTransfer.notes}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
