import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  message,
  Card,
  Modal,
  Form,
  Input,
  Drawer,
  Space,
} from 'antd';
import {
  Layers,
  Award,
  Package,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_BRANDS, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './productMockData';
import type { ProductItem, BrandItem } from './productData';

export const BrandWiseProductsPage: React.FC = () => {
  const [selectedBrandName, setSelectedBrandName] = useState<string>('Siemens Precision');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Selected Brand Info
  const currentBrand = INITIAL_BRANDS.find((b) => b.name === selectedBrandName) || INITIAL_BRANDS[0];

  // Filtered Products for selected brand
  const brandProducts = products.filter((p) => {
    const matchesBrand = p.brand === selectedBrandName;
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesBrand && matchesSearch && matchesCat;
  });

  // 4 Top Summary Cards (Exact required 4)
  const totalBrandsCount = INITIAL_BRANDS.length;
  const totalMappedProducts = products.filter((p) => p.brand).length;
  const activeBrandProducts = products.filter((p) => p.brand && p.status === 'Active').length;
  const unmappedProductsCount = products.filter((p) => !p.brand).length;

  // Selected Brand Performance Metrics (Exact required 4)
  const brandProductCount = brandProducts.length;
  const brandStockQuantity = brandProducts.reduce((a, b) => a + b.availableStock, 0);
  const brandStockValue = brandProducts.reduce((a, b) => a + b.availableStock * b.sellingPrice, 0);
  const brandSalesValue = brandProducts.reduce((a, b) => a + b.totalSold * b.sellingPrice, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Brand-Wise Product Mapping & Performance"
        subtitle="Filter and analyze product distribution, warehouse stocks, sales velocity, and catalog mappings filtered by OEM brand."
        icon={<Layers size={20} />}
        searchPlaceholder="Search product name, SKU, model..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add Product to Brand"
        onPrimaryAction={() => message.info(`Assigning new product line under ${selectedBrandName}...`)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success(`Exporting ${selectedBrandName} Product Ledger...`)}
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
            Export Brand Catalog
          </Button>
        }
      />

      {/* 2. Top 4 Summary Cards (Exact required 4) */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Brands',
            value: `${totalBrandsCount} Brands`,
            growth: 'Registered OEM Lines',
            isDark: true,
            icon: <Award size={20} color="#5421A8" />,
          },
          {
            title: 'Total Brand Products',
            value: `${totalMappedProducts} SKUs`,
            growth: 'Mapped to Brands',
            isPositive: true,
            isDark: false,
            icon: <Package size={20} color="#10B981" />,
          },
          {
            title: 'Active Brand Products',
            value: `${activeBrandProducts} Active`,
            growth: 'In Distribution',
            isDark: true,
            icon: <CheckCircle2 size={20} color="#0284C7" />,
          },
          {
            title: 'Unmapped Products',
            value: `${unmappedProductsCount} SKUs`,
            growth: 'Requires Mapping',
            isPositive: false,
            isDark: false,
            icon: <Layers size={20} color="#EF4444" />,
          },
        ]}
      />

      {/* 3. Brand Selector & Performance Banner */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '18px 24px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 16px rgba(84, 33, 168, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(84, 33, 168, 0.3)',
              }}
            >
              {currentBrand.logoText}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#1E1B4B' }}>{currentBrand.name}</span>
                <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{currentBrand.code}</Tag>
                <Tag color="success" style={{ borderRadius: 6, fontWeight: 700 }}>{currentBrand.status}</Tag>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                Manufacturer: <strong>{currentBrand.manufacturer}</strong> • Origin: {currentBrand.country}
              </div>
            </div>
          </div>

          {/* Brand Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Switch OEM Brand:
            </span>
            <Select
              value={selectedBrandName}
              onChange={setSelectedBrandName}
              style={{ width: 230, height: 36 }}
              options={INITIAL_BRANDS.map((b) => ({ label: `${b.name} (${b.code})`, value: b.name }))}
            />
          </div>
        </div>

        {/* Brand Performance Section (Exact 4 Metrics) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            paddingTop: 12,
            borderTop: '1px solid #F1EDF9',
          }}
        >
          <div style={{ background: '#FAF9FE', padding: '12px 16px', borderRadius: 12, border: '1px solid #ECE8F6' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Product Count</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#1E1B4B', marginTop: 2 }}>{brandProductCount} SKUs</div>
          </div>
          <div style={{ background: '#FAF9FE', padding: '12px 16px', borderRadius: 12, border: '1px solid #ECE8F6' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Stock Quantity</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#059669', marginTop: 2 }}>{brandStockQuantity} Available</div>
          </div>
          <div style={{ background: '#FAF9FE', padding: '12px 16px', borderRadius: 12, border: '1px solid #ECE8F6' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Stock Value</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#5421A8', marginTop: 2 }}>₹{(brandStockValue / 100000).toFixed(2)} Lakhs</div>
          </div>
          <div style={{ background: '#FAF9FE', padding: '12px 16px', borderRadius: 12, border: '1px solid #ECE8F6' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Sales Value</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0284C7', marginTop: 2 }}>₹{(brandSalesValue / 100000).toFixed(2)} Lakhs</div>
          </div>
        </div>
      </div>

      {/* 4. Brand-Wise Products Table */}
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
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 190, height: 34 }}
              options={[
                { label: 'All Categories', value: 'ALL' },
                ...INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name })),
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Catalog for <strong style={{ color: '#5421A8' }}>{selectedBrandName}</strong> ({brandProducts.length} items)
          </div>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product Name / SKU</th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Category</th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Model Number</th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Purchase Price</th>
                <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Selling Price</th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Available Stock</th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {brandProducts.map((p, idx) => (
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
                    <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>SKU: <strong style={{ color: '#5421A8' }}>{p.sku}</strong></div>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#334155' }}>{p.category}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 600, color: '#475569' }}>{p.modelNumber}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 12.5, fontWeight: 700, color: '#475569' }}>₹{p.purchasePrice.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', fontSize: 13, fontWeight: 800, color: '#5421A8' }}>₹{p.sellingPrice.toLocaleString()}</td>
                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <strong style={{ color: p.availableStock > 0 ? '#059669' : '#DC2626' }}>{p.availableStock} {p.uom}</strong>
                  </td>
                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <Tag color={p.status === 'Active' ? 'success' : 'default'} style={{ borderRadius: 6 }}>{p.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
