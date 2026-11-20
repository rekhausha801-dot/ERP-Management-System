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
  Popconfirm,
  Space,
} from 'antd';
import {
  Package,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  Edit,
  Trash2,
  Copy,
  Layers,
  Award,
  DollarSign,
  AlertTriangle,
  Upload,
  Search,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_PRODUCTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from './productMockData';
import type { ProductItem } from './productData';

export const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 4 Summary Metrics (as specified)
  const totalRegisteredProducts = products.length;
  const activeProductCount = products.filter((p) => p.status === 'Active').length;
  const activePercentage = ((activeProductCount / (totalRegisteredProducts || 1)) * 100).toFixed(1);
  const inactiveProductCount = products.filter((p) => p.status === 'Inactive').length;
  const discontinuedCount = products.filter((p) => p.status === 'Discontinued').length;
  const totalCategoriesCount = INITIAL_CATEGORIES.length;
  const totalBrandsCount = INITIAL_BRANDS.length;

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = brandFilter === 'ALL' || p.brand === brandFilter;
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesType = typeFilter === 'ALL' || p.productType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesBrand && matchesCat && matchesType && matchesStatus;
  });

  // Actions: Add Product
  const handleSaveAdd = (values: any) => {
    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      name: values.name,
      code: values.code || `PRD-GEN-${Math.floor(100 + Math.random() * 900)}`,
      sku: values.sku.toUpperCase(),
      barcode: values.barcode || `89012345${Math.floor(1000 + Math.random() * 9000)}`,
      brand: values.brand,
      category: values.category,
      subcategory: values.subcategory || 'General Subcategory',
      productType: values.productType || 'Finished Goods',
      manufacturer: values.manufacturer || values.brand,
      modelNumber: values.modelNumber || 'N/A',
      purchasePrice: Number(values.purchasePrice) || 0,
      costPrice: Number(values.costPrice) || Number(values.purchasePrice) || 0,
      sellingPrice: Number(values.sellingPrice) || 0,
      mrp: Number(values.mrp) || Number(values.sellingPrice) * 1.15,
      taxPercent: Number(values.taxPercent) || 18,
      uom: values.uom || 'PCS',
      weightKg: Number(values.weightKg) || 1,
      dimensions: values.dimensions || 'Standard Industrial',
      warrantyMonths: Number(values.warrantyMonths) || 12,
      hsnCode: values.hsnCode || '84812000',
      preferredSupplier: values.preferredSupplier || 'Authorized OEM Channel',
      status: 'Active',
      availableStock: Number(values.openingStock) || 0,
      totalSold: 0,
      description: values.description || 'Enterprise catalog equipment.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    addForm.resetFields();
    message.success(`Product ${newProd.name} (${newProd.sku}) created successfully!`);
  };

  // Actions: Edit Product
  const handleSaveEdit = (values: any) => {
    if (!selectedProduct) return;
    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          name: values.name,
          brand: values.brand,
          category: values.category,
          productType: values.productType,
          modelNumber: values.modelNumber,
          purchasePrice: Number(values.purchasePrice),
          sellingPrice: Number(values.sellingPrice),
          mrp: Number(values.mrp),
          taxPercent: Number(values.taxPercent),
          warrantyMonths: Number(values.warrantyMonths),
          status: values.status,
        };
      }
      return p;
    });

    setProducts(updated);
    setIsEditModalOpen(false);
    message.success(`Product ${selectedProduct.sku} updated successfully!`);
  };

  // Duplicate Product
  const handleDuplicate = (prod: ProductItem) => {
    const dup: ProductItem = {
      ...prod,
      id: `p-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      code: `${prod.code}-COPY`,
      sku: `${prod.sku}-CP`,
      barcode: `89012345${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalSold: 0,
    };
    setProducts([dup, ...products]);
    message.success(`Product ${prod.sku} duplicated as ${dup.sku}!`);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
          message.info(`Product status updated to ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Delete Product
  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Product deleted from active catalog.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Product Master Catalog"
        subtitle="Manage universal multi-tenant product lines, SKU codes, OEM brand mappings, categories, pricing, and warranty parameters."
        icon={<Package size={20} />}
        searchPlaceholder="Search product name, SKU, code, model..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add New Product"
        onPrimaryAction={() => setIsAddModalOpen(true)}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              icon={<FileSpreadsheet size={14} />}
              onClick={() => message.success('Exporting Product Catalog Master...')}
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
              Export Products
            </Button>
            <Button
              icon={<Upload size={14} />}
              onClick={() => message.info('Open Excel / CSV Bulk Product Import...')}
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
              Import
            </Button>
          </div>
        }
      />

      {/* 2. Top 4 Summary Cards (Exact required 4) */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Products',
            value: `${totalRegisteredProducts} Products`,
            growth: `${activeProductCount} Active in Catalog`,
            isDark: true,
            icon: <Package size={20} color="#5421A8" />,
          },
          {
            title: 'Active Products',
            value: `${activeProductCount} Available`,
            growth: `${activePercentage}% Catalog Active`,
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Inactive & Discontinued',
            value: `${inactiveProductCount + discontinuedCount} SKUs`,
            growth: `${discontinuedCount} Discontinued`,
            isPositive: false,
            isDark: true,
            icon: <AlertTriangle size={20} color="#EF4444" />,
          },
          {
            title: 'Product Categories & Brands',
            value: `${totalCategoriesCount} Categories`,
            growth: `${totalBrandsCount} Registered Brands`,
            isPositive: true,
            isDark: false,
            icon: <Layers size={20} color="#6D28D9" />,
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
        {/* Filter Controls Header */}
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
              value={brandFilter}
              onChange={setBrandFilter}
              style={{ width: 180, height: 34 }}
              options={[
                { label: 'All Brands', value: 'ALL' },
                ...INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name })),
              ]}
            />

            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 190, height: 34 }}
              options={[
                { label: 'All Categories', value: 'ALL' },
                ...INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name })),
              ]}
            />

            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 170, height: 34 }}
              options={[
                { label: 'All Types', value: 'ALL' },
                { label: 'Finished Goods', value: 'Finished Goods' },
                { label: 'Raw Material', value: 'Raw Material' },
                { label: 'Spares / Components', value: 'Spares / Components' },
                { label: 'Service Item', value: 'Service Item' },
              ]}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Discontinued', value: 'Discontinued' },
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
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 280 }}>
                  Product Details / Code
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Brand & Category
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Type
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Purchase Price
                </th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Selling Price / MRP
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
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
                          SKU: <strong style={{ color: '#5421A8' }}>{p.sku}</strong> • Model: {p.modelNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{p.brand}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{p.category}</div>
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA' }}>
                    <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{p.productType}</Tag>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontWeight: 700, color: '#475569', fontSize: 12.5 }}>₹{p.purchasePrice.toLocaleString()}</div>
                    <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Cost: ₹{p.costPrice.toLocaleString()}</div>
                  </td>

                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 13.5 }}>₹{p.sellingPrice.toLocaleString()}</div>
                    <div style={{ fontSize: 10.5, color: '#94A3B8' }}>MRP: ₹{p.mrp.toLocaleString()} (+{p.taxPercent}% GST)</div>
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <span
                      onClick={() => handleToggleStatus(p.id)}
                      title="Click to toggle status"
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: p.status === 'Active' ? '#D1FAE5' : p.status === 'Inactive' ? '#FEF3C7' : '#FEE2E2',
                        color: p.status === 'Active' ? '#059669' : p.status === 'Inactive' ? '#D97706' : '#DC2626',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Button
                        size="small"
                        type="text"
                        icon={<Eye size={14} color="#5421A8" />}
                        title="View Details"
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsDetailDrawerOpen(true);
                        }}
                      />
                      <Button
                        size="small"
                        type="text"
                        icon={<Edit size={14} color="#0284C7" />}
                        title="Edit Product"
                        onClick={() => {
                          setSelectedProduct(p);
                          editForm.setFieldsValue(p);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <Button
                        size="small"
                        type="text"
                        icon={<Copy size={14} color="#D97706" />}
                        title="Duplicate Product"
                        onClick={() => handleDuplicate(p)}
                      />
                      <Popconfirm
                        title="Delete product from catalog?"
                        onConfirm={() => handleDelete(p.id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<Trash2 size={14} />}
                          title="Delete Product"
                        />
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add Product Modal Form */}
      <Modal
        title="Register New Master Product"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={720}
      >
        <Form form={addForm} layout="vertical" onFinish={handleSaveAdd} style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, color: '#5421A8', marginBottom: 8 }}>1. Basic Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. 3-Phase Servo Motor 7.5kW" />
            </Form.Item>
            <Form.Item name="sku" label="SKU / Item Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. MOT-SER-075KW" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="code" label="Product Code">
              <Input placeholder="PRD-AUT-009" />
            </Form.Item>
            <Form.Item name="barcode" label="Barcode">
              <Input placeholder="890123450009" />
            </Form.Item>
            <Form.Item name="modelNumber" label="Model Number">
              <Input placeholder="1FK7-083-4P" />
            </Form.Item>
          </div>

          <div style={{ fontWeight: 800, color: '#5421A8', marginTop: 8, marginBottom: 8 }}>2. Classification</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
              <Select options={INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name }))} />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select options={INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name }))} />
            </Form.Item>
            <Form.Item name="productType" label="Product Type" initialValue="Finished Goods">
              <Select
                options={[
                  { label: 'Finished Goods', value: 'Finished Goods' },
                  { label: 'Raw Material', value: 'Raw Material' },
                  { label: 'Spares / Components', value: 'Spares / Components' },
                  { label: 'Service Item', value: 'Service Item' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ fontWeight: 800, color: '#5421A8', marginTop: 8, marginBottom: 8 }}>3. Pricing & Tax (GST)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="purchasePrice" label="Purchase Price (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="costPrice" label="Cost Base (₹)">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sellingPrice" label="Selling Price (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="taxPercent" label="GST Rate (%)" initialValue={18}>
              <Select options={[{ label: '18% GST', value: 18 }, { label: '12% GST', value: 12 }, { label: '28% GST', value: 28 }, { label: '5% GST', value: 5 }]} />
            </Form.Item>
          </div>

          <div style={{ fontWeight: 800, color: '#5421A8', marginTop: 8, marginBottom: 8 }}>4. Specifications & Warranty</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="uom" label="UOM" initialValue="PCS">
              <Select options={[{ label: 'PCS', value: 'PCS' }, { label: 'KGS', value: 'KGS' }, { label: 'BOX', value: 'BOX' }, { label: 'MTR', value: 'MTR' }]} />
            </Form.Item>
            <Form.Item name="warrantyMonths" label="Warranty (Months)" initialValue={12}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="hsnCode" label="HSN Code" initialValue="85015210">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Product Technical Description">
            <Input.TextArea rows={2} placeholder="Equipment specs, frame size, duty cycle..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm & Save Product
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Edit Product Modal */}
      <Modal
        title={`Edit Product: ${selectedProduct?.sku}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="brand" label="Brand">
              <Select options={INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name }))} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select options={INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name }))} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="purchasePrice" label="Purchase Price (₹)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sellingPrice" label="Selling Price (₹)">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="status" label="Status">
              <Select options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Discontinued', value: 'Discontinued' }]} />
            </Form.Item>
            <Form.Item name="warrantyMonths" label="Warranty Months">
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

      {/* 6. Product Details Drawer */}
      <Drawer
        title={`Product Master Dossier: ${selectedProduct?.sku}`}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={520}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>{selectedProduct.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                Brand: <strong>{selectedProduct.brand}</strong> • Category: <strong>{selectedProduct.category}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Model: <strong>{selectedProduct.modelNumber}</strong> • HSN: <strong>{selectedProduct.hsnCode}</strong>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: 12, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Pricing Structure</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>Purchase Cost: <strong>₹{selectedProduct.purchasePrice.toLocaleString()}</strong></div>
                <div>Standard Selling: <strong style={{ color: '#5421A8' }}>₹{selectedProduct.sellingPrice.toLocaleString()}</strong></div>
                <div>MRP: <strong>₹{selectedProduct.mrp.toLocaleString()}</strong></div>
                <div>Statutory GST: <strong>{selectedProduct.taxPercent}%</strong></div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: 12, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Physical Specifications</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>Unit of Measure: <strong>{selectedProduct.uom}</strong></div>
                <div>Net Weight: <strong>{selectedProduct.weightKg} kg</strong></div>
                <div>Dimensions: <strong>{selectedProduct.dimensions}</strong></div>
                <div>OEM Warranty: <strong>{selectedProduct.warrantyMonths} Months</strong></div>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: 12, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Stock & Sales Velocity</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>Available Units: <strong style={{ color: '#059669' }}>{selectedProduct.availableStock} Units</strong></div>
                <div>Historical Sold: <strong>{selectedProduct.totalSold} Units</strong></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
