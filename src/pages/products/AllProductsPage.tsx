import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Input,
  InputNumber,
  Modal,
  Drawer,
  Form,
  Space,
  Tabs,
  Tooltip,
  Popconfirm,
  message,
  Divider,
  Upload,
} from 'antd';
import {
  Package,
  Plus,
  FileSpreadsheet,
  Upload as UploadIcon,
  Search,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Building,
  DollarSign,
  ShieldCheck,
  Calendar,
  History,
  SlidersHorizontal,
  Download,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_BRANDS, INITIAL_CATEGORIES } from './productMockData';
import type { ProductItem } from './productData';

const BRAND_PURPLE = '#441A87';

export const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  // Filters State
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState<ProductItem | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  // Top 4 Summary Metrics (Exact Required Cards)
  const metrics = useMemo(() => {
    const totalCount = products.length;
    const activeCount = products.filter((p) => p.status === 'Active').length;
    const inactiveOrDiscontinued = products.filter((p) => p.status === 'Inactive' || p.status === 'Discontinued').length;
    const categoriesCount = INITIAL_CATEGORIES.length;
    const brandsCount = INITIAL_BRANDS.length;

    return {
      totalCount,
      activeCount,
      inactiveOrDiscontinued,
      categoriesCount,
      brandsCount,
    };
  }, [products]);

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search) ||
        (p.modelNumber && p.modelNumber.toLowerCase().includes(search.toLowerCase()));

      const matchBrand = brandFilter === 'ALL' || p.brand === brandFilter;
      const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchType = typeFilter === 'ALL' || p.productType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchBrand && matchCategory && matchType && matchStatus;
    });
  }, [products, search, brandFilter, categoryFilter, typeFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setBrandFilter('ALL');
    setCategoryFilter('ALL');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Tag style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Active
          </Tag>
        );
      case 'Inactive':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Inactive
          </Tag>
        );
      case 'Discontinued':
        return (
          <Tag style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Discontinued
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Actions
  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    form.resetFields();
    form.setFieldsValue({
      brand: INITIAL_BRANDS[0]?.name || 'Siemens',
      category: INITIAL_CATEGORIES[0]?.name || 'Motors & Drives',
      productType: 'Finished Goods',
      uom: 'PCS',
      taxPercent: 18,
      status: 'Active',
      warrantyMonths: 12,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (record: ProductItem) => {
    setIsEditing(true);
    setSelectedProduct(record);
    form.setFieldsValue({
      name: record.name,
      sku: record.sku,
      barcode: record.barcode,
      modelNumber: record.modelNumber,
      brand: record.brand,
      category: record.category,
      productType: record.productType,
      uom: record.uom,
      purchasePrice: record.purchasePrice,
      costPrice: record.costPrice,
      sellingPrice: record.sellingPrice,
      mrp: record.mrp,
      taxPercent: record.taxPercent,
      warrantyMonths: record.warrantyMonths,
      preferredSupplier: record.preferredSupplier,
      status: record.status,
      description: record.description,
      availableStock: record.availableStock,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (values: any) => {
    if (isEditing && selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                name: values.name,
                sku: values.sku.toUpperCase(),
                barcode: values.barcode || p.barcode,
                modelNumber: values.modelNumber || 'N/A',
                brand: values.brand,
                category: values.category,
                productType: values.productType,
                uom: values.uom,
                purchasePrice: Number(values.purchasePrice) || 0,
                costPrice: Number(values.costPrice) || Number(values.purchasePrice) || 0,
                sellingPrice: Number(values.sellingPrice) || 0,
                mrp: Number(values.mrp) || Number(values.sellingPrice) * 1.15,
                taxPercent: Number(values.taxPercent) || 18,
                warrantyMonths: Number(values.warrantyMonths) || 12,
                preferredSupplier: values.preferredSupplier || p.preferredSupplier,
                status: values.status || 'Active',
                description: values.description || p.description,
                availableStock: Number(values.availableStock) || p.availableStock,
              }
            : p
        )
      );
      message.success(`Product ${values.sku} updated successfully!`);
    } else {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name: values.name,
        code: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        sku: values.sku.toUpperCase(),
        barcode: values.barcode || `89010203${Math.floor(1000 + Math.random() * 9000)}`,
        modelNumber: values.modelNumber || 'N/A',
        brand: values.brand,
        category: values.category,
        subcategory: 'Industrial Grade',
        productType: values.productType || 'Finished Goods',
        manufacturer: values.brand,
        uom: values.uom || 'PCS',
        purchasePrice: Number(values.purchasePrice) || 0,
        costPrice: Number(values.costPrice) || Number(values.purchasePrice) || 0,
        sellingPrice: Number(values.sellingPrice) || 0,
        mrp: Number(values.mrp) || Number(values.sellingPrice) * 1.15,
        taxPercent: Number(values.taxPercent) || 18,
        warrantyMonths: Number(values.warrantyMonths) || 12,
        hsnCode: '84812000',
        preferredSupplier: values.preferredSupplier || 'Authorized OEM Vendor',
        status: values.status || 'Active',
        availableStock: Number(values.availableStock) || 10,
        totalSold: 0,
        description: values.description || 'Enterprise catalog equipment.',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts([newProd, ...products]);
      message.success(`New Product ${newProd.name} added to catalog!`);
    }
    setIsAddModalOpen(false);
  };

  const handleDuplicate = (record: ProductItem) => {
    const dup: ProductItem = {
      ...record,
      id: `prod-${Date.now()}`,
      name: `${record.name} (Copy)`,
      sku: `${record.sku}-CP`,
      barcode: `89010203${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalSold: 0,
    };
    setProducts([dup, ...products]);
    message.success(`Product ${record.sku} duplicated as ${dup.sku}`);
  };

  const handleToggleStatus = (record: ProductItem) => {
    const nextStatus = record.status === 'Active' ? 'Inactive' : 'Active';
    setProducts((prev) =>
      prev.map((p) => (p.id === record.id ? { ...p, status: nextStatus } : p))
    );
    message.info(`Product ${record.sku} marked as ${nextStatus}`);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    message.success('Product deleted from master catalog.');
  };

  // Table Columns (Exact 12 Columns from Requirements)
  const columns = [
    {
      title: 'Product Name & SKU',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, r: ProductItem) => (
        <div>
          <div style={{ fontWeight: 800, color: '#111827', fontSize: 13, lineHeight: 1.3 }}>
            {name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 700,
                color: BRAND_PURPLE,
                background: '#FAF5FF',
                border: '1px solid #E9D5FF',
                padding: '1px 5px',
                borderRadius: 4,
              }}
            >
              {r.sku}
            </span>
            {r.modelNumber && r.modelNumber !== 'N/A' && (
              <span style={{ fontSize: 11, color: '#6B7280' }}>Mod: {r.modelNumber}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
      render: (b: string) => (
        <span style={{ fontWeight: 600, color: '#374151', fontSize: 12 }}>
          {b}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (cat: string) => (
        <span style={{ fontSize: 12, color: '#4B5563' }}>
          {cat}
        </span>
      ),
    },
    {
      title: 'Product Type',
      dataIndex: 'productType',
      key: 'productType',
      width: 135,
      render: (type: string) => (
        <Tag style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569', borderRadius: 4, fontSize: 11 }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'uom',
      key: 'uom',
      width: 75,
      align: 'center' as const,
      render: (uom: string) => <span style={{ fontWeight: 600, fontSize: 11.5, color: '#6B7280' }}>{uom}</span>,
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 120,
      align: 'right' as const,
      render: (p: number) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#4B5563' }}>
          ₹{Number(p || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Landed Cost',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 120,
      align: 'right' as const,
      render: (c: number) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0369A1' }}>
          ₹{Number(c || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 125,
      align: 'right' as const,
      render: (sp: number) => (
        <span style={{ fontSize: 13, fontWeight: 800, color: BRAND_PURPLE }}>
          ₹{Number(sp || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'MRP',
      dataIndex: 'mrp',
      key: 'mrp',
      width: 115,
      align: 'right' as const,
      render: (mrp: number) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
          ₹{Number(mrp || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'GST Rate',
      dataIndex: 'taxPercent',
      key: 'taxPercent',
      width: 90,
      align: 'center' as const,
      render: (tx: number) => (
        <Tag style={{ background: '#FAF5FF', color: BRAND_PURPLE, border: '1px solid #E9D5FF', borderRadius: 4, fontWeight: 700, fontSize: 11, margin: 0 }}>
          {tx}%
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (st: string) => renderStatusBadge(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: ProductItem) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {/* View Drawer */}
          <Tooltip title="View Product Details">
            <button
              onClick={() => {
                setSelectedProduct(record);
                setIsDetailDrawerOpen(true);
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_PURPLE;
                e.currentTarget.style.color = BRAND_PURPLE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Eye size={13} />
            </button>
          </Tooltip>

          {/* Edit Product */}
          <Tooltip title="Edit Product">
            <button
              onClick={() => handleOpenEdit(record)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_PURPLE;
                e.currentTarget.style.color = BRAND_PURPLE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Edit2 size={13} />
            </button>
          </Tooltip>

          {/* Barcode Viewer */}
          <Tooltip title="Barcode Tag">
            <button
              onClick={() => {
                setBarcodeProduct(record);
                setIsBarcodeModalOpen(true);
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0D9488',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0D9488';
                e.currentTarget.style.background = '#F0FDFA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <Barcode size={13} />
            </button>
          </Tooltip>

          {/* Duplicate Product */}
          <Tooltip title="Duplicate SKU">
            <button
              onClick={() => handleDuplicate(record)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s ease',
              }}
            >
              <Copy size={13} />
            </button>
          </Tooltip>

          {/* Toggle Status */}
          <Tooltip title={record.status === 'Active' ? 'Deactivate' : 'Activate'}>
            <button
              onClick={() => handleToggleStatus(record)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `1px solid ${record.status === 'Active' ? '#FECACA' : '#BBF7D0'}`,
                background: record.status === 'Active' ? '#FEF2F2' : '#F0FDF4',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: record.status === 'Active' ? '#EF4444' : '#16A34A',
              }}
            >
              {record.status === 'Active' ? <X size={13} /> : <Check size={13} />}
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* 1. Page Header */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: BRAND_PURPLE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(68, 26, 135, 0.2)',
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Product Master Catalog
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Central enterprise catalog for item SKU definition, classification, multi-tier pricing, landed costs and GST parameters.
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            icon={<FileSpreadsheet size={15} />}
            onClick={() => message.info('Exporting Product Master spreadsheet...')}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Export
          </Button>

          <Button
            icon={<UploadIcon size={15} />}
            onClick={() => message.info('Opening bulk Excel / CSV product importer...')}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Import Products
          </Button>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
            style={{
              background: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 8,
              height: 38,
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 18px',
              boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
            }}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Summary Cards (100% Width CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Total Products */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(68, 26, 135, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: BRAND_PURPLE }}>
              Total Products
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.totalCount} SKUs
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Across all master categories
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: BRAND_PURPLE,
            }}
          >
            <Package size={20} />
          </div>
        </div>

        {/* Active Products */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#15803D' }}>
              Active Products
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.activeCount} SKUs
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Active in sales & billing
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Inactive & Discontinued */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B91C1C' }}>
              Inactive / Discontinued
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.inactiveOrDiscontinued} SKUs
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Archived or phased-out lines
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}
          >
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* Categories & Brands */}
        <div
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(29, 78, 216, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1D4ED8' }}>
              Categories & Brands
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {metrics.categoriesCount} / {metrics.brandsCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Taxonomy classification lines
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters (Single Clean Horizontal Row) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <Input
            prefix={<Search size={15} style={{ color: '#9CA3AF' }} />}
            placeholder="Search by Name, SKU, Barcode, Model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36, fontSize: 12.5 }}
          />
        </div>

        {/* Brand Filter */}
        <Select
          value={brandFilter}
          onChange={setBrandFilter}
          style={{ width: 165, height: 36 }}
          options={[
            { label: 'All Brands', value: 'ALL' },
            ...INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name })),
          ]}
        />

        {/* Category Filter */}
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 180, height: 36 }}
          options={[
            { label: 'All Categories', value: 'ALL' },
            ...INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name })),
          ]}
        />

        {/* Product Type Filter */}
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 175, height: 36 }}
          options={[
            { label: 'All Product Types', value: 'ALL' },
            { label: 'Finished Goods', value: 'Finished Goods' },
            { label: 'Raw Material', value: 'Raw Material' },
            { label: 'Spares / Components', value: 'Spares / Components' },
            { label: 'Service Item', value: 'Service Item' },
          ]}
        />

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 145, height: 36 }}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'Discontinued', value: 'Discontinued' },
          ]}
        />

        {/* Reset Filter Button */}
        {(search || brandFilter !== 'ALL' || categoryFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <Button
            icon={<RotateCcw size={14} />}
            onClick={handleResetFilters}
            style={{
              height: 36,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#6B7280',
              borderColor: '#D1D5DB',
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Professional Product Data Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
            Products Master Catalog ({filteredProducts.length})
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Base pricing shown ex-works; Landed cost includes freight & statutory tariff overheads.
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Total ${t} Products` }}
          scroll={{ x: 1650 }}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      {/* 5. Add / Edit Product Modal (Tabs: Basic, Brand & Class, Pricing & Tax, Inventory, Supplier, Warranty) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 6 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: BRAND_PURPLE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Package size={17} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              {isEditing ? `Edit Product: ${selectedProduct?.sku}` : 'Add New Product to Master Catalog'}
            </span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={780}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProduct} style={{ marginTop: 12 }}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Basic Information',
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px', paddingTop: 8 }}>
                    <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]} style={{ gridColumn: 'span 2' }}>
                      <Input placeholder="e.g. 3-Phase Induction Motor 15kW Heavy Duty" />
                    </Form.Item>
                    <Form.Item label="SKU Code" name="sku" rules={[{ required: true, message: 'Please enter SKU' }]}>
                      <Input placeholder="e.g. MOT-3PH-015KW" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                    <Form.Item label="Barcode / EAN" name="barcode">
                      <Input placeholder="e.g. 890102030401" />
                    </Form.Item>
                    <Form.Item label="Model / Spec Number" name="modelNumber">
                      <Input placeholder="e.g. 1LE1001-1DB23-4AA4" />
                    </Form.Item>
                    <Form.Item label="Product Status" name="status" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { label: 'Active', value: 'Active' },
                          { label: 'Inactive', value: 'Inactive' },
                          { label: 'Discontinued', value: 'Discontinued' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label="Product Description" name="description" style={{ gridColumn: 'span 2' }}>
                      <Input.TextArea rows={2} placeholder="Industrial technical specifications, application notes..." />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: '2',
                label: 'Brand & Classification',
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px', paddingTop: 8 }}>
                    <Form.Item label="Brand / OEM" name="brand" rules={[{ required: true }]}>
                      <Select options={INITIAL_BRANDS.map((b) => ({ label: b.name, value: b.name }))} />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                      <Select options={INITIAL_CATEGORIES.map((c) => ({ label: c.name, value: c.name }))} />
                    </Form.Item>
                    <Form.Item label="Product Type" name="productType" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { label: 'Finished Goods', value: 'Finished Goods' },
                          { label: 'Raw Material', value: 'Raw Material' },
                          { label: 'Spares / Components', value: 'Spares / Components' },
                          { label: 'Service Item', value: 'Service Item' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label="Unit of Measurement (UOM)" name="uom" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { label: 'PCS (Pieces)', value: 'PCS' },
                          { label: 'NOS (Numbers)', value: 'NOS' },
                          { label: 'KGS (Kilograms)', value: 'KGS' },
                          { label: 'MTR (Meters)', value: 'MTR' },
                          { label: 'BOX (Boxes)', value: 'BOX' },
                          { label: 'SET (Sets)', value: 'SET' },
                        ]}
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: '3',
                label: 'Pricing & Tax',
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px', paddingTop: 8 }}>
                    <Form.Item label="Purchase Price (₹)" name="purchasePrice" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
                    </Form.Item>
                    <Form.Item label="Landed Cost Price (₹)" name="costPrice">
                      <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
                    </Form.Item>
                    <Form.Item label="Selling Price (₹)" name="sellingPrice" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
                    </Form.Item>
                    <Form.Item label="Maximum Retail Price - MRP (₹)" name="mrp">
                      <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
                    </Form.Item>
                    <Form.Item label="GST Tax Rate (%)" name="taxPercent" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { label: '0% Nil', value: 0 },
                          { label: '5%', value: 5 },
                          { label: '12%', value: 12 },
                          { label: '18% Standard GST', value: 18 },
                          { label: '28%', value: 28 },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label="HSN / SAC Code" name="hsnCode" initialValue="84812000">
                      <Input placeholder="e.g. 84812000" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: '4',
                label: 'Inventory & Supplier',
                children: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px', paddingTop: 8 }}>
                    <Form.Item label="Opening / Initial Stock" name="availableStock" initialValue={10}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item label="Preferred Supplier / OEM Channel" name="preferredSupplier">
                      <Input placeholder="e.g. Siemens Authorized Channel" />
                    </Form.Item>
                    <Form.Item label="Warranty Period (Months)" name="warrantyMonths" initialValue={12}>
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}>
              {isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Product Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Package size={18} color={BRAND_PURPLE} />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                {selectedProduct?.name}
              </span>
            </div>
            {selectedProduct && renderStatusBadge(selectedProduct.status)}
          </div>
        }
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={560}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Header info */}
            <div style={{ background: '#FAF5FF', padding: 16, borderRadius: 10, border: '1px solid #E9D5FF' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND_PURPLE, textTransform: 'uppercase' }}>
                Classification
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginTop: 4 }}>
                {selectedProduct.brand} &bull; {selectedProduct.category}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                SKU: <strong style={{ fontFamily: 'monospace' }}>{selectedProduct.sku}</strong> | Barcode: {selectedProduct.barcode}
              </div>
            </div>

            {/* Pricing Matrix */}
            <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 10, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10 }}>
                Pricing & Margin Matrix
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12.5 }}>
                <div>Purchase Price: <strong>₹{selectedProduct.purchasePrice.toLocaleString('en-IN')}</strong></div>
                <div>Landed Cost: <strong style={{ color: '#0369A1' }}>₹{selectedProduct.costPrice.toLocaleString('en-IN')}</strong></div>
                <div>Selling Price: <strong style={{ color: BRAND_PURPLE, fontSize: 14 }}>₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}</strong></div>
                <div>MRP: <strong>₹{selectedProduct.mrp.toLocaleString('en-IN')}</strong></div>
                <div>GST Rate: <strong>{selectedProduct.taxPercent}%</strong></div>
                <div>Profit Margin: <strong style={{ color: '#15803D' }}>+{(((selectedProduct.sellingPrice - selectedProduct.purchasePrice) / (selectedProduct.purchasePrice || 1)) * 100).toFixed(1)}%</strong></div>
              </div>
            </div>

            {/* Specifications & Warranty */}
            <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 10, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 10 }}>
                Specifications & Supplier
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#4B5563' }}>
                <div>Model Number: <strong>{selectedProduct.modelNumber}</strong></div>
                <div>Unit: <strong>{selectedProduct.uom}</strong></div>
                <div>Warranty: <strong>{selectedProduct.warrantyMonths} Months Manufacturer Guarantee</strong></div>
                <div>Preferred Supplier: <strong>{selectedProduct.preferredSupplier}</strong></div>
                <div>Current Inventory Stock: <strong style={{ color: selectedProduct.availableStock > 0 ? '#15803D' : '#DC2626' }}>{selectedProduct.availableStock} {selectedProduct.uom} available</strong></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 7. Barcode Generator Modal */}
      <Modal
        title="Product Barcode Tag"
        open={isBarcodeModalOpen}
        onCancel={() => setIsBarcodeModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsBarcodeModalOpen(false)}>
            Close
          </Button>,
          <Button key="print" type="primary" onClick={() => window.print()} style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE }}>
            Print Barcode Label
          </Button>,
        ]}
        width={420}
      >
        {barcodeProduct && (
          <div style={{ textAlign: 'center', padding: '16px 10px', background: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: 8, marginTop: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>{barcodeProduct.name}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>SKU: {barcodeProduct.sku} | MRP: ₹{barcodeProduct.mrp}</div>
            <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 180, height: 48, background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 8px, #fff 8px, #fff 10px)' }} />
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, marginTop: 4, letterSpacing: '0.1em' }}>
                {barcodeProduct.barcode}
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>Universal Retail / Warehouse Barcode Standard</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllProductsPage;
