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
  Tabs,
  Space,
} from 'antd';
import {
  Receipt,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_PRODUCTS, INITIAL_PRICE_LISTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from './productMockData';
import type { PriceListItem, ProductItem } from './productData';

export const ProductPricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'pricelists'>('products');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [priceLists, setPriceLists] = useState<PriceListItem[]>(INITIAL_PRICE_LISTS);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Modals
  const [isNewPriceListModalOpen, setIsNewPriceListModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const [priceListForm] = Form.useForm();
  const [editPriceForm] = Form.useForm();

  // Exact 4 Summary Cards as requested
  const totalProductsPriced = products.length;
  const activePriceListsCount = priceLists.filter((p) => p.status === 'Active').length;
  const pendingApprovalsCount = 1;
  const scheduledPriceChangesCount = 2;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = brandFilter === 'ALL' || p.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const handleSavePriceEdit = (values: any) => {
    if (!selectedProduct) return;
    const updated = products.map((p) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          purchasePrice: Number(values.purchasePrice),
          sellingPrice: Number(values.sellingPrice),
          mrp: Number(values.mrp),
          taxPercent: Number(values.taxPercent),
        };
      }
      return p;
    });

    setProducts(updated);
    setIsEditPriceModalOpen(false);
    message.success(`Commercial tariff for ${selectedProduct.sku} updated!`);
  };

  const handleCreatePriceList = (values: any) => {
    const newPL: PriceListItem = {
      id: `pl-${Date.now()}`,
      name: values.name,
      code: values.code ? values.code.toUpperCase() : `PL-${Math.floor(100 + Math.random() * 900)}`,
      customerGroup: values.customerGroup,
      productCount: products.length,
      effectiveDate: values.effectiveDate || '2026-11-20',
      expiryDate: values.expiryDate || '2027-03-31',
      discountPercentage: Number(values.discountPercentage) || 5,
      status: 'Active',
    };

    setPriceLists([newPL, ...priceLists]);
    setIsNewPriceListModalOpen(false);
    priceListForm.resetFields();
    message.success(`Price List ${newPL.name} activated!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Product Pricing, Rate Contracts & Price Lists"
        subtitle="Configure multi-tier wholesale/dealer pricing structures, profit margins, GST statutory calculations, and customer group price lists."
        icon={<Receipt size={20} />}
        searchPlaceholder="Search product SKU, tariff, price list..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Create Price List"
        onPrimaryAction={() => setIsNewPriceListModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Master Commercial Price List...')}
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
            Export Pricing Schedule
          </Button>
        }
      />

      {/* 2. Top 4 Summary Cards (Exact required 4) */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Products Priced',
            value: `${totalProductsPriced} SKUs`,
            growth: 'Active Commercial Tariffs',
            isDark: true,
            icon: <Receipt size={20} color="#5421A8" />,
          },
          {
            title: 'Active Price Lists',
            value: `${activePriceListsCount} Tier Schemes`,
            growth: 'Wholesale, Dealer & Retail',
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Pending Price Approvals',
            value: `${pendingApprovalsCount} Revision`,
            growth: 'Management Review',
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Scheduled Price Changes',
            value: `${scheduledPriceChangesCount} Upcoming`,
            growth: 'Effective next quarter',
            isPositive: false,
            isDark: false,
            icon: <TrendingUp size={20} color="#0284C7" />,
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
              onClick={() => setActiveTab('products')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'products' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'products' ? '#5421A8' : '#64748B',
                boxShadow: activeTab === 'products' ? '0 2px 8px rgba(84, 33, 168, 0.15)' : 'none',
              }}
            >
              Product-Wise Pricing Matrix ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pricelists')}
              style={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.18s ease',
                background: activeTab === 'pricelists' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'pricelists' ? '#5421A8' : '#64748B',
                boxShadow: activeTab === 'pricelists' ? '0 2px 8px rgba(84, 33, 168, 0.15)' : 'none',
              }}
            >
              Customer Group Price Lists ({priceLists.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Select
                value={brandFilter}
                onChange={setBrandFilter}
                style={{ width: 180, height: 32 }}
                options={[
                  { label: 'All Brands', value: 'ALL' },
                  ...INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name })),
                ]}
              />
            </div>
          )}
        </div>

        {/* Tab 1: Product Pricing Table */}
        {activeTab === 'products' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Product & Brand</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Purchase Cost</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Selling Price</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>MRP (+Tax)</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Profit Margin</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Status</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => {
                  const marginAmt = p.sellingPrice - p.purchasePrice;
                  const marginPct = ((marginAmt / (p.sellingPrice || 1)) * 100).toFixed(1);
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
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          SKU: <strong style={{ color: '#5421A8' }}>{p.sku}</strong> • {p.brand}
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#475569', fontSize: 12.5 }}>₹{p.purchasePrice.toLocaleString()}</div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Cost: ₹{p.costPrice.toLocaleString()}</div>
                      </td>

                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 800, color: '#5421A8', fontSize: 13.5 }}>₹{p.sellingPrice.toLocaleString()}</div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>Base Ex-Works</div>
                      </td>

                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 12.5 }}>₹{p.mrp.toLocaleString()}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>+{p.taxPercent}% GST</div>
                      </td>

                      <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 12, background: '#D1FAE5', color: '#059669', fontWeight: 800, fontSize: 11.5 }}>
                          +{marginPct}% (₹{marginAmt.toLocaleString()})
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA' }}>
                        <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>Active Tariff</Tag>
                      </td>

                      <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                        <Button
                          size="small"
                          type="dashed"
                          onClick={() => {
                            setSelectedProduct(p);
                            editPriceForm.setFieldsValue(p);
                            setIsEditPriceModalOpen(true);
                          }}
                          style={{ borderColor: '#7544D6', color: '#5421A8', fontWeight: 700, fontSize: 11 }}
                        >
                          Modify Price
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Price Lists */}
        {activeTab === 'pricelists' && (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF9FE' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Price List Scheme</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Target Customer Group</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Products Covered</th>
                  <th style={{ padding: '12px 16px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Scheme Discount</th>
                  <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>Validity Period</th>
                  <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {priceLists.map((pl, idx) => (
                  <tr key={pl.id} style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE' }}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{pl.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Code: <strong style={{ color: '#5421A8' }}>{pl.code}</strong></div>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 600, color: '#334155' }}>
                      {pl.customerGroup}
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{pl.productCount} SKUs</Tag>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <strong style={{ color: '#059669', fontSize: 13 }}>-{pl.discountPercentage}%</strong>
                    </td>
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 11.5, color: '#475569' }}>
                      {pl.effectiveDate} to {pl.expiryDate}
                    </td>
                    <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      <Tag color="success" style={{ borderRadius: 6, fontWeight: 700 }}>{pl.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Edit Price Modal */}
      <Modal
        title={`Modify Commercial Tariff: ${selectedProduct?.sku}`}
        open={isEditPriceModalOpen}
        onCancel={() => setIsEditPriceModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={editPriceForm} layout="vertical" onFinish={handleSavePriceEdit} style={{ marginTop: 12 }}>
          <Form.Item label="Product Name">
            <Input value={selectedProduct?.name} disabled />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="purchasePrice" label="Purchase Price (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="sellingPrice" label="Base Selling Price (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="mrp" label="MRP (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="taxPercent" label="GST Tax %" rules={[{ required: true }]}>
              <Select options={[{ label: '18% GST', value: 18 }, { label: '12% GST', value: 12 }, { label: '28% GST', value: 28 }, { label: '5% GST', value: 5 }]} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditPriceModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Price Update
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Create Price List Modal */}
      <Modal
        title="Create Customer Group Price List Scheme"
        open={isNewPriceListModalOpen}
        onCancel={() => setIsNewPriceListModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form form={priceListForm} layout="vertical" onFinish={handleCreatePriceList} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Price List Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Q4 Dealer Incentive Tariff" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="code" label="Tariff Code">
              <Input placeholder="PL-DLR-Q4" />
            </Form.Item>
            <Form.Item name="customerGroup" label="Target Customer Group" initialValue="Retail Dealers">
              <Select
                options={[
                  { label: 'All Customers', value: 'All Customers' },
                  { label: 'Wholesale Buyers', value: 'Wholesale Buyers' },
                  { label: 'Retail Dealers', value: 'Retail Dealers' },
                  { label: 'Enterprise / Key Accounts', value: 'Enterprise / Key Accounts' },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="discountPercentage" label="Overall Discount %" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="effectiveDate" label="Effective Start Date" initialValue="2026-11-20">
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsNewPriceListModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Activate Price List
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
