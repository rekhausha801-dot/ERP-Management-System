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
  Space,
} from 'antd';
import {
  Boxes,
  Plus,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Package,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_PRODUCTS } from './inventoryMockData';
import type { InventoryProduct } from './inventoryData';

export const StockManagementPage: React.FC = () => {
  const [products, setProducts] = useState<InventoryProduct[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isOpeningStockModalOpen, setIsOpeningStockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [openingStockForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesWarehouse = warehouseFilter === 'ALL' || p.warehouseName === warehouseFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
  });

  // Handle Add Opening Stock
  const handleSaveOpeningStock = (values: any) => {
    const newProd: InventoryProduct = {
      id: `prod-${Date.now()}`,
      sku: values.sku.toUpperCase(),
      barcode: values.barcode || `89012345${Math.floor(1000 + Math.random() * 9000)}`,
      name: values.name,
      category: values.category,
      brand: values.brand,
      uom: values.uom || 'PCS',
      warehouseId: 'wh-01',
      warehouseName: values.warehouseName || 'Chennai Central Depot (WH-01)',
      locationBin: values.locationBin || 'Zone A - General Bay',
      openingStock: Number(values.openingStock) || 0,
      availableStock: Number(values.openingStock) || 0,
      reservedStock: 0,
      inTransitStock: 0,
      damagedStock: 0,
      expiredStock: 0,
      totalStock: Number(values.openingStock) || 0,
      minLevel: Number(values.minLevel) || 5,
      reorderPoint: Number(values.reorderPoint) || 10,
      maxLevel: Number(values.maxLevel) || 50,
      unitCost: Number(values.unitCost) || 0,
      stockValue: (Number(values.openingStock) || 0) * (Number(values.unitCost) || 0),
      valuationMethod: values.valuationMethod || 'FIFO',
      lastMovementDate: new Date().toISOString().split('T')[0],
      status: Number(values.openingStock) > Number(values.reorderPoint) ? 'In Stock' : 'Low Stock',
    };

    setProducts([newProd, ...products]);
    setIsOpeningStockModalOpen(false);
    openingStockForm.resetFields();
    message.success(`Opening stock for ${newProd.sku} initialized successfully!`);
  };

  // Handle Edit Stock Info
  const handleSaveEdit = (values: any) => {
    if (!selectedProduct) return;
    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          name: values.name,
          category: values.category,
          brand: values.brand,
          locationBin: values.locationBin,
          minLevel: values.minLevel,
          reorderPoint: values.reorderPoint,
          maxLevel: values.maxLevel,
          unitCost: values.unitCost,
          stockValue: p.totalStock * values.unitCost,
        };
      }
      return p;
    });

    setProducts(updated);
    setIsEditModalOpen(false);
    message.success('Stock master parameters updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Stock Master Management"
        subtitle="Manage product-level SKU stocks, warehouse locations, bin assignments, safety buffer thresholds, and valuation records."
        icon={<Boxes size={20} />}
        searchPlaceholder="Search product SKU, barcode, brand..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add Opening Stock"
        onPrimaryAction={() => setIsOpeningStockModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Stock Master Sheet...')}
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
            Export Master
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Catalog Inventory Value',
            value: `₹${(products.reduce((a, b) => a + b.stockValue, 0) / 100000).toFixed(1)}L`,
            growth: `${products.length} Tracked SKUs`,
            isDark: true,
            icon: <DollarSign size={20} color="#5421A8" />,
          },
          {
            title: 'Available Stock',
            value: `${products.reduce((a, b) => a + b.availableStock, 0)} Units`,
            growth: 'Ready for Dispatch',
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Allocated / Reserved',
            value: `${products.reduce((a, b) => a + b.reservedStock, 0)} Units`,
            growth: 'Locked for Orders',
            isDark: true,
            icon: <Boxes size={20} color="#0284C7" />,
          },
          {
            title: 'Stock Health Alert',
            value: `${products.filter((p) => p.status !== 'In Stock').length} SKUs`,
            growth: 'Needs Replenishment',
            isPositive: false,
            isDark: false,
            icon: <AlertTriangle size={20} color="#EF4444" />,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 190, height: 34 }}
              options={[
                { label: 'All Categories', value: 'ALL' },
                { label: 'Electrical Motors', value: 'Electrical Motors' },
                { label: 'Automation Drives', value: 'Automation Drives' },
                { label: 'Automation & Controllers', value: 'Automation & Controllers' },
                { label: 'Hydraulics & Fluid Power', value: 'Hydraulics & Fluid Power' },
                { label: 'Pneumatics', value: 'Pneumatics' },
                { label: 'Bearings & Transmission', value: 'Bearings & Power Transmission' },
                { label: 'Instrumentation', value: 'Instrumentation' },
                { label: 'Lubricants & Consumables', value: 'Lubricants & Consumables' },
              ]}
            />

            <Select
              value={warehouseFilter}
              onChange={setWarehouseFilter}
              style={{ width: 220, height: 34 }}
              options={[
                { label: 'All Warehouses', value: 'ALL' },
                { label: 'Chennai Central Depot', value: 'Chennai Central Depot (WH-01)' },
                { label: 'Bangalore Regional Hub', value: 'Bangalore Regional Hub (WH-02)' },
                { label: 'Coimbatore Plant Depot', value: 'Coimbatore Plant Depot (WH-03)' },
                { label: 'Service Spares Depot', value: 'Service Spares Depot (WH-04)' },
              ]}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'In Stock', value: 'In Stock' },
                { label: 'Low Stock', value: 'Low Stock' },
                { label: 'Out of Stock', value: 'Out of Stock' },
                { label: 'Critical', value: 'Critical' },
              ]}
            />
          </div>

          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filteredProducts.length}</strong> Products
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
                  Warehouse & Bin
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Available
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Reserved
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  In Transit
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Stock Valuation
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Health
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No inventory products match your filter parameters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const isCritical = p.status === 'Critical' || p.status === 'Out of Stock';
                  return (
                    <tr
                      key={p.id}
                      style={{
                        transition: 'background-color 0.15s ease',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                      }
                    >
                      {/* Product / SKU */}
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                              border: '1px solid #DDD6FE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#5421A8',
                              fontWeight: 800,
                              fontSize: 11,
                              flexShrink: 0,
                            }}
                          >
                            {p.uom}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                              <strong style={{ color: '#5421A8' }}>{p.sku}</strong> • {p.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Warehouse & Bin */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{p.warehouseName}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{p.locationBin}</div>
                      </td>

                      {/* Available */}
                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <strong style={{ color: p.availableStock > 0 ? '#059669' : '#DC2626', fontSize: 13 }}>
                          {p.availableStock}
                        </strong>
                      </td>

                      {/* Reserved */}
                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <span style={{ color: '#0284C7', fontWeight: 700, fontSize: 12 }}>
                          {p.reservedStock}
                        </span>
                      </td>

                      {/* In Transit */}
                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <span style={{ color: '#D97706', fontWeight: 700, fontSize: 12 }}>
                          {p.inTransitStock}
                        </span>
                      </td>

                      {/* Stock Valuation */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 13 }}>
                          ₹{p.stockValue.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                          @ ₹{p.unitCost.toLocaleString()} / {p.uom}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            background: p.status === 'In Stock' ? '#D1FAE5' : p.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2',
                            color: p.status === 'In Stock' ? '#059669' : p.status === 'Low Stock' ? '#D97706' : '#DC2626',
                            fontWeight: 800,
                            fontSize: 11,
                          }}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <Button
                            size="small"
                            type="text"
                            icon={<Eye size={14} color="#5421A8" />}
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsDetailDrawerOpen(true);
                            }}
                          />
                          <Button
                            size="small"
                            type="text"
                            icon={<SlidersHorizontal size={14} color="#475569" />}
                            onClick={() => {
                              setSelectedProduct(p);
                              editForm.setFieldsValue(p);
                              setIsEditModalOpen(true);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="#5421A8" />
            <span>Valuation calculated via statutory weighted average & FIFO method.</span>
          </div>
          <div>
            Total Inventory Units: <strong>{products.reduce((a, b) => a + b.totalStock, 0)}</strong>
          </div>
        </div>
      </div>

      {/* 4. Product Stock Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Boxes size={18} color="#5421A8" />
            <span>Product Inventory Ledger: {selectedProduct?.sku}</span>
          </div>
        }
        placement="right"
        width={560}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 14,
                padding: '16px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>{selectedProduct.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                Brand: <strong>{selectedProduct.brand}</strong> • Category: <strong>{selectedProduct.category}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Barcode: <code>{selectedProduct.barcode}</code> • UOM: <strong>{selectedProduct.uom}</strong>
              </div>
            </div>

            {/* Warehouse Stock Matrix */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                Warehouse & Bin Storage
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div>Facility: <strong>{selectedProduct.warehouseName}</strong></div>
                <div>Storage Bin: <strong>{selectedProduct.locationBin}</strong></div>
                <div>Batch No: <strong>{selectedProduct.batchNumber || 'N/A'}</strong></div>
                <div>Serial Tracking: <strong>{selectedProduct.serialNumber || 'Batch-Tracked'}</strong></div>
              </div>
            </div>

            {/* Stock Quantities Breakdown */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                Inventory Balance Quantities
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>Available for Dispatch</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#15803D' }}>{selectedProduct.availableStock}</div>
                </div>
                <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 700 }}>Reserved for Orders</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#1D4ED8' }}>{selectedProduct.reservedStock}</div>
                </div>
                <div style={{ background: '#FFFBEB', padding: '10px', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#D97706', fontWeight: 700 }}>In-Transit Rebalance</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#B45309' }}>{selectedProduct.inTransitStock}</div>
                </div>
                <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>Damaged / Quarantined</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#B91C1C' }}>{selectedProduct.damagedStock}</div>
                </div>
              </div>
            </div>

            {/* Reorder Thresholds */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                Reorder & Buffer Levels
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div>Minimum Level: <strong>{selectedProduct.minLevel} {selectedProduct.uom}</strong></div>
                <div>Reorder Point: <strong style={{ color: '#D97706' }}>{selectedProduct.reorderPoint} {selectedProduct.uom}</strong></div>
                <div>Maximum Cap: <strong>{selectedProduct.maxLevel} {selectedProduct.uom}</strong></div>
              </div>
            </div>

            {/* Financial Valuation */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                Financial Costing & Valuation
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div>Unit Purchase Cost: <strong>₹{selectedProduct.unitCost.toLocaleString()}</strong></div>
                <div>Total Asset Value: <strong style={{ color: '#5421A8' }}>₹{selectedProduct.stockValue.toLocaleString()}</strong></div>
                <div>Valuation Rule: <strong>{selectedProduct.valuationMethod}</strong></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 5. Add Opening Stock Modal */}
      <Modal
        title="Initialize Opening Stock Entry"
        open={isOpeningStockModalOpen}
        onCancel={() => setIsOpeningStockModalOpen(false)}
        footer={null}
        width={580}
      >
        <Form form={openingStockForm} layout="vertical" onFinish={handleSaveOpeningStock} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g. Servo Motor 5kW" />
            </Form.Item>
            <Form.Item name="sku" label="SKU / Item Code" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g. MOT-SER-005" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Required' }]}>
              <Select
                options={[
                  { label: 'Electrical Motors', value: 'Electrical Motors' },
                  { label: 'Automation Drives', value: 'Automation Drives' },
                  { label: 'Hydraulics & Fluid Power', value: 'Hydraulics & Fluid Power' },
                  { label: 'Pneumatics', value: 'Pneumatics' },
                  { label: 'Instrumentation', value: 'Instrumentation' },
                ]}
              />
            </Form.Item>
            <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g. Siemens" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="warehouseName" label="Storage Warehouse" initialValue="Chennai Central Depot (WH-01)">
              <Select
                options={[
                  { label: 'Chennai Central Depot (WH-01)', value: 'Chennai Central Depot (WH-01)' },
                  { label: 'Bangalore Regional Hub (WH-02)', value: 'Bangalore Regional Hub (WH-02)' },
                  { label: 'Coimbatore Plant Depot (WH-03)', value: 'Coimbatore Plant Depot (WH-03)' },
                ]}
              />
            </Form.Item>
            <Form.Item name="locationBin" label="Storage Location / Bin">
              <Input placeholder="e.g. Zone A - Rack 01 - Bin 04" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="openingStock" label="Opening Quantity" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitCost" label="Unit Cost (₹)" rules={[{ required: true, message: 'Required' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="uom" label="UOM" initialValue="PCS">
              <Select options={[{ label: 'PCS', value: 'PCS' }, { label: 'BOX', value: 'BOX' }, { label: 'KGS', value: 'KGS' }]} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="minLevel" label="Min Safe Level" initialValue={5}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="reorderPoint" label="Reorder Point" initialValue={10}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsOpeningStockModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Opening Stock
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Edit Stock Parameters Modal */}
      <Modal
        title={`Edit Stock Parameters: ${selectedProduct?.sku}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item name="brand" label="Brand">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="locationBin" label="Storage Bin Location">
            <Input />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="minLevel" label="Min Level">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="reorderPoint" label="Reorder Point">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitCost" label="Unit Cost (₹)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Updates
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
