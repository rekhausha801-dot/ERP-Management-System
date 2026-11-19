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
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Search,
  Truck,
  Building2,
  DollarSign,
  Package,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_STOCK_IN, INITIAL_STOCK_OUT, INITIAL_PRODUCTS } from './inventoryMockData';
import type { StockInTransaction, StockOutTransaction } from './inventoryData';

export const StockInOutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'in' | 'out'>('in');
  const [stockInList, setStockInList] = useState<StockInTransaction[]>(INITIAL_STOCK_IN);
  const [stockOutList, setStockOutList] = useState<StockOutTransaction[]>(INITIAL_STOCK_OUT);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [selectedStockIn, setSelectedStockIn] = useState<StockInTransaction | null>(null);
  const [selectedStockOut, setSelectedStockOut] = useState<StockOutTransaction | null>(null);

  const [stockInForm] = Form.useForm();
  const [stockOutForm] = Form.useForm();

  // Create Stock In
  const handleSaveStockIn = (values: any) => {
    const newEntry: StockInTransaction = {
      id: `in-${Date.now()}`,
      grnNumber: `GRN-2026-${Math.floor(100 + Math.random() * 900)}`,
      sourceType: values.sourceType,
      referenceNumber: values.referenceNumber,
      supplierName: values.supplierName,
      warehouseName: values.warehouseName,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: values.receivedBy || 'Store In-Charge',
      totalItems: 1,
      totalQuantity: Number(values.quantity),
      totalAmount: Number(values.quantity) * Number(values.unitCost),
      status: 'Completed',
      notes: values.notes || 'Inward goods receipt posted.',
      items: [
        {
          sku: values.sku,
          productName: values.productName,
          orderedQty: Number(values.quantity),
          receivedQty: Number(values.quantity),
          acceptedQty: Number(values.quantity),
          rejectedQty: 0,
          unitCost: Number(values.unitCost),
          batchNo: values.batchNo || `BAT-2026-${Math.floor(100 + Math.random() * 900)}`,
        },
      ],
    };

    setStockInList([newEntry, ...stockInList]);
    setIsStockInModalOpen(false);
    stockInForm.resetFields();
    message.success(`Stock In ${newEntry.grnNumber} recorded successfully! Inventory updated.`);
  };

  // Create Stock Out
  const handleSaveStockOut = (values: any) => {
    const newEntry: StockOutTransaction = {
      id: `out-${Date.now()}`,
      issueNumber: `ISS-2026-${Math.floor(500 + Math.random() * 500)}`,
      issueType: values.issueType,
      orderReference: values.orderReference,
      destination: values.destination,
      warehouseName: values.warehouseName,
      issueDate: new Date().toISOString().split('T')[0],
      requestedBy: values.requestedBy || 'Field Engineer',
      approvedBy: 'Warehouse Manager',
      totalItems: 1,
      totalQuantity: Number(values.quantity),
      totalAmount: Number(values.quantity) * Number(values.unitCost),
      status: 'Completed',
      notes: values.notes || 'Dispatched and ledger debited.',
      items: [
        {
          sku: values.sku,
          productName: values.productName,
          issuedQty: Number(values.quantity),
          unitCost: Number(values.unitCost),
          batchNo: values.batchNo,
        },
      ],
    };

    setStockOutList([newEntry, ...stockOutList]);
    setIsStockOutModalOpen(false);
    stockOutForm.resetFields();
    message.success(`Stock Out ${newEntry.issueNumber} dispatched successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Stock In & Stock Out Movements"
        subtitle="Record receipt of goods (GRN/Purchases/Returns) and authorized stock dispatches (Sales Orders/Service Material/Internal Use)."
        icon={<Layers size={20} />}
        searchPlaceholder="Search GRN, Issue No, order ref, supplier..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel={activeTab === 'in' ? 'Record Stock In' : 'Issue Stock Out'}
        onPrimaryAction={() => (activeTab === 'in' ? setIsStockInModalOpen(true) : setIsStockOutModalOpen(true))}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Movement Register...')}
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
            Export Register
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Stock In Inward',
            value: `₹${(stockInList.reduce((a, b) => a + b.totalAmount, 0) / 100000).toFixed(1)}L`,
            growth: `${stockInList.reduce((a, b) => a + b.totalQuantity, 0)} Units Received`,
            isDark: true,
            icon: <ArrowDownLeft size={20} color="#5421A8" />,
          },
          {
            title: 'Total Stock Out Dispatched',
            value: `₹${(stockOutList.reduce((a, b) => a + b.totalAmount, 0) / 100000).toFixed(1)}L`,
            growth: `${stockOutList.reduce((a, b) => a + b.totalQuantity, 0)} Units Dispatched`,
            isPositive: true,
            isDark: false,
            icon: <ArrowUpRight size={20} color="#0284C7" />,
          },
          {
            title: 'Pending Inward Clearances',
            value: `${stockInList.filter((s) => s.status === 'Pending Approval').length} Receipts`,
            growth: 'Needs GRN Signoff',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Material Issue Approvals',
            value: `${stockOutList.filter((s) => s.status === 'Pending Approval').length} Pending`,
            growth: 'Service & Sales Requests',
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
        {/* Switcher Header */}
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
          {/* Elegant Pill Switcher */}
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
              onClick={() => setActiveTab('in')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'in' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'in' ? '#059669' : '#64748B',
                boxShadow: activeTab === 'in' ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ArrowDownLeft size={15} />
              Stock In Transactions ({stockInList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('out')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'out' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'out' ? '#DC2626' : '#64748B',
                boxShadow: activeTab === 'out' ? '0 2px 8px rgba(220, 38, 38, 0.15)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ArrowUpRight size={15} />
              Stock Out Transactions ({stockOutList.length})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150, height: 32 }}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Pending Approval', value: 'Pending Approval' },
              ]}
            />
          </div>
        </div>

        {/* Stock In Table */}
        {activeTab === 'in' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    GRN No & Date
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Source & Reference
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Supplier / Source
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Warehouse Facility
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                    Qty Received
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Total Value
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
                {stockInList
                  .filter((s) => statusFilter === 'ALL' || s.status === statusFilter)
                  .map((t, idx) => (
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
                        <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{t.grnNumber}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{t.receivedDate}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 700 }}>{t.sourceType}</Tag>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Ref: {t.referenceNumber}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 600, color: '#334155' }}>
                        {t.supplierName}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                        {t.warehouseName}
                      </td>
                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <strong style={{ color: '#059669', fontSize: 13 }}>+{t.totalQuantity}</strong>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <strong style={{ color: '#1E1B4B', fontSize: 13 }}>₹{t.totalAmount.toLocaleString()}</strong>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
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
                        <Button
                          size="small"
                          type="text"
                          icon={<Eye size={14} color="#5421A8" />}
                          onClick={() => setSelectedStockIn(t)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stock Out Table */}
        {activeTab === 'out' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Issue No & Date
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Issue Type & Order Ref
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Dispatch Destination
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Warehouse Facility
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                    Qty Dispatched
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                    Total Value
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
                {stockOutList
                  .filter((s) => statusFilter === 'ALL' || s.status === statusFilter)
                  .map((t, idx) => (
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
                        <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{t.issueNumber}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{t.issueDate}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <Tag color="volcano" style={{ borderRadius: 6, fontWeight: 700 }}>{t.issueType}</Tag>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Ref: {t.orderReference}</div>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 600, color: '#334155' }}>
                        {t.destination}
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                        {t.warehouseName}
                      </td>
                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <strong style={{ color: '#DC2626', fontSize: 13 }}>-{t.totalQuantity}</strong>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <strong style={{ color: '#1E1B4B', fontSize: 13 }}>₹{t.totalAmount.toLocaleString()}</strong>
                      </td>
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
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
                        <Button
                          size="small"
                          type="text"
                          icon={<Eye size={14} color="#5421A8" />}
                          onClick={() => setSelectedStockOut(t)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal: Record Stock In */}
      <Modal
        title="Record Stock In (Inward Goods Receipt)"
        open={isStockInModalOpen}
        onCancel={() => setIsStockInModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={stockInForm} layout="vertical" onFinish={handleSaveStockIn} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="sourceType" label="Receipt Type" initialValue="Purchase Order">
              <Select
                options={[
                  { label: 'Purchase Order', value: 'Purchase Order' },
                  { label: 'Sales Return', value: 'Sales Return' },
                  { label: 'Transfer Receipt', value: 'Transfer Receipt' },
                  { label: 'Bonus / Free Stock', value: 'Bonus Stock' },
                ]}
              />
            </Form.Item>
            <Form.Item name="referenceNumber" label="Reference Document / PO" rules={[{ required: true }]}>
              <Input placeholder="e.g. PO-2026-880" />
            </Form.Item>
          </div>

          <Form.Item name="supplierName" label="Supplier / Party Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Siemens Precision India" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. 3-Phase Motor 15kW" />
            </Form.Item>
            <Form.Item name="sku" label="Product SKU" rules={[{ required: true }]}>
              <Input placeholder="e.g. MOT-3PH-015KW" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="quantity" label="Received Qty" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitCost" label="Unit Cost (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="batchNo" label="Batch No">
              <Input placeholder="BAT-2026-X" />
            </Form.Item>
          </div>

          <Form.Item name="warehouseName" label="Destination Warehouse" initialValue="Chennai Central Depot (WH-01)">
            <Select
              options={[
                { label: 'Chennai Central Depot (WH-01)', value: 'Chennai Central Depot (WH-01)' },
                { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
              ]}
            />
          </Form.Item>

          <Form.Item name="notes" label="Receipt Notes / Remarks">
            <Input.TextArea rows={2} placeholder="Verification details, inspection notes..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsStockInModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Stock In
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Modal: Issue Stock Out */}
      <Modal
        title="Issue Stock Out (Material Dispatch)"
        open={isStockOutModalOpen}
        onCancel={() => setIsStockOutModalOpen(false)}
        footer={null}
        width={560}
      >
        <Form form={stockOutForm} layout="vertical" onFinish={handleSaveStockOut} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="issueType" label="Dispatch Type" initialValue="Sales Dispatch">
              <Select
                options={[
                  { label: 'Sales Dispatch', value: 'Sales Dispatch' },
                  { label: 'Service Material Issue', value: 'Service Material Issue' },
                  { label: 'Internal Consumption', value: 'Internal Consumption' },
                  { label: 'Supplier Return', value: 'Supplier Return' },
                ]}
              />
            </Form.Item>
            <Form.Item name="orderReference" label="Order Ref / Work Order" rules={[{ required: true }]}>
              <Input placeholder="e.g. SO-2026-901" />
            </Form.Item>
          </div>

          <Form.Item name="destination" label="Destination / Customer / Plant Line" rules={[{ required: true }]}>
            <Input placeholder="e.g. Apex Precision Tools Ltd" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. 3-Phase Motor 15kW" />
            </Form.Item>
            <Form.Item name="sku" label="Product SKU" rules={[{ required: true }]}>
              <Input placeholder="e.g. MOT-3PH-015KW" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="quantity" label="Issue Quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitCost" label="Cost Base (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="warehouseName" label="Source Warehouse" initialValue="Chennai Central Depot (WH-01)">
            <Select
              options={[
                { label: 'Chennai Central Depot (WH-01)', value: 'Chennai Central Depot (WH-01)' },
                { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsStockOutModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Stock Issue
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Details Drawer for Stock In */}
      <Drawer
        title={`Stock In Details: ${selectedStockIn?.grnNumber}`}
        open={!!selectedStockIn}
        onClose={() => setSelectedStockIn(null)}
        width={480}
      >
        {selectedStockIn && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Receipt Type: <strong>{selectedStockIn.sourceType}</strong></div>
            <div>Reference Document: <strong>{selectedStockIn.referenceNumber}</strong></div>
            <div>Supplier: <strong>{selectedStockIn.supplierName}</strong></div>
            <div>Warehouse: <strong>{selectedStockIn.warehouseName}</strong></div>
            <div>Received By: <strong>{selectedStockIn.receivedBy}</strong></div>
            <div>Received Date: <strong>{selectedStockIn.receivedDate}</strong></div>
            <div>Total Quantity: <strong>{selectedStockIn.totalQuantity} Units</strong></div>
            <div>Total Value: <strong>₹{selectedStockIn.totalAmount.toLocaleString()}</strong></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              Notes: {selectedStockIn.notes}
            </div>
          </div>
        )}
      </Drawer>

      {/* 7. Details Drawer for Stock Out */}
      <Drawer
        title={`Stock Out Details: ${selectedStockOut?.issueNumber}`}
        open={!!selectedStockOut}
        onClose={() => setSelectedStockOut(null)}
        width={480}
      >
        {selectedStockOut && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Dispatch Type: <strong>{selectedStockOut.issueType}</strong></div>
            <div>Order Reference: <strong>{selectedStockOut.orderReference}</strong></div>
            <div>Destination: <strong>{selectedStockOut.destination}</strong></div>
            <div>Warehouse: <strong>{selectedStockOut.warehouseName}</strong></div>
            <div>Requested By: <strong>{selectedStockOut.requestedBy}</strong></div>
            <div>Approved By: <strong>{selectedStockOut.approvedBy}</strong></div>
            <div>Issue Date: <strong>{selectedStockOut.issueDate}</strong></div>
            <div>Total Quantity: <strong>{selectedStockOut.totalQuantity} Units</strong></div>
            <div>Total Value: <strong>₹{selectedStockOut.totalAmount.toLocaleString()}</strong></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              Notes: {selectedStockOut.notes}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
