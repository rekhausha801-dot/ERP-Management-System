import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  Input,
  message,
  Modal,
  Form,
  Drawer,
  Popconfirm,
  Tabs,
  Tooltip,
  Alert,
  Switch,
  InputNumber,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Award,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Layers,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  Package,
  Search,
  FileText,
  DollarSign,
  History,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  Upload,
} from 'lucide-react';
import { INITIAL_BRANDS, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './productMockData';
import type { BrandItem, ProductItem } from './productData';

// Theme constants
const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#FAF5FF';
const BRAND_BORDER = '#E9D5FF';
const TEXT_DARK = '#0F172A';

export interface BrandPricingPolicy {
  minPurchasePrice: number;
  maxPurchasePrice: number;
  minSellingPrice: number;
  maxSellingPrice: number;
  maxDiscountPercent: number;
  defaultGstRate: number;
  effectiveDate: string;
  requireApproval: boolean;
  allowProductOverride: boolean;
}

export interface BrandAgreement {
  agreementNumber: string;
  agreementType: string;
  startDate: string;
  endDate: string;
  contractStatus: 'Active' | 'Under Renewal' | 'Expired';
  warrantyPolicyDoc: string;
  authorizationDoc: string;
  authorizedTerritory: string;
}

export interface BrandAuditRecord {
  id: string;
  timestamp: string;
  type: 'Product Mapping' | 'Pricing Policy' | 'Agreement' | 'Status Change';
  description: string;
  actor: string;
}

export interface ExtendedBrandItem extends BrandItem {
  operatingMarket?: string;
  gstin?: string;
  registeredAddress?: string;
  pricingPolicy: BrandPricingPolicy;
  agreement: BrandAgreement;
  auditTrail: BrandAuditRecord[];
}

export const BrandManagementPage: React.FC = () => {
  // Master state for products (synced with brand mappings)
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  // Master state for extended brands
  const [brands, setBrands] = useState<ExtendedBrandItem[]>(() => {
    return INITIAL_BRANDS.map((b, idx) => ({
      ...b,
      operatingMarket: idx % 2 === 0 ? 'India Pan-National & SAARC' : 'Domestic Industrial Corridor',
      gstin: `33${b.code.replace(/[^A-Z]/g, '').slice(0, 5)}1234F1Z${idx + 1}`,
      registeredAddress: b.address,
      pricingPolicy: {
        minPurchasePrice: 200,
        maxPurchasePrice: 500000,
        minSellingPrice: 300,
        maxSellingPrice: 650000,
        maxDiscountPercent: 15,
        defaultGstRate: 18,
        effectiveDate: '2026-01-01',
        requireApproval: true,
        allowProductOverride: true,
      },
      agreement: {
        agreementNumber: `AGR-OEM-${b.code}-2026`,
        agreementType: 'Exclusive Industrial Channel Distribution',
        startDate: '2025-01-01',
        endDate: idx === 1 ? '2026-12-31' : '2027-12-31',
        contractStatus: 'Active',
        warrantyPolicyDoc: `Warranty-SOP-${b.code}.pdf`,
        authorizationDoc: `OEM-Auth-Letter-${b.code}-2026.pdf`,
        authorizedTerritory: 'All Tier-1 & Tier-2 Industrial Estates',
      },
      auditTrail: [
        {
          id: `audit-${idx}-1`,
          timestamp: '2026-11-15 10:45',
          type: 'Pricing Policy',
          description: 'Max discount threshold set to 15% with multi-level sign-off.',
          actor: 'Senthil Kumar (VP Sales)',
        },
        {
          id: `audit-${idx}-2`,
          timestamp: '2026-10-02 14:20',
          type: 'Agreement',
          description: 'Authorized channel distribution renewed for fiscal 2026-27.',
          actor: 'Karthik Raja (Procurement Lead)',
        },
      ],
    }));
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [manufacturerFilter, setManufacturerFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [originFilter, setOriginFilter] = useState('ALL');

  // Modals & Detail Workspace
  const [selectedBrand, setSelectedBrand] = useState<ExtendedBrandItem | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('overview');

  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Forms
  const [addBrandForm] = Form.useForm();
  const [editBrandForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [pricingForm] = Form.useForm();

  // Dynamic Metrics (calculated directly from live state)
  const totalBrands = brands.length;
  const activeBrands = brands.filter((b) => b.status === 'Active').length;
  const inactiveBrands = brands.filter((b) => b.status !== 'Active').length;
  const totalMappedProducts = products.filter((p) => Boolean(p.brand)).length;

  // Manufacturer and Country options for filters
  const manufacturerOptions = useMemo(() => {
    return Array.from(new Set(brands.map((b) => b.manufacturer)));
  }, [brands]);

  const countryOptions = useMemo(() => {
    return Array.from(new Set(brands.map((b) => b.country)));
  }, [brands]);

  // Unified Search & Filtering (Brand name, code, manufacturer, product name, sku, model)
  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands.filter((b) => {
      // Find if any products mapped to this brand match product name, sku, or model
      const matchingProduct = products.some(
        (p) =>
          p.brand.toLowerCase() === b.name.toLowerCase() &&
          (p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.modelNumber.toLowerCase().includes(q))
      );

      const matchesSearch =
        q === '' ||
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.manufacturer.toLowerCase().includes(q) ||
        b.contactPerson.toLowerCase().includes(q) ||
        matchingProduct;

      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const matchesMfg = manufacturerFilter === 'ALL' || b.manufacturer === manufacturerFilter;
      const matchesOrigin = originFilter === 'ALL' || b.country === originFilter;
      const matchesCategory =
        categoryFilter === 'ALL' ||
        b.categories.some((c) => c.toLowerCase() === categoryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesMfg && matchesOrigin && matchesCategory;
    });
  }, [brands, products, search, statusFilter, manufacturerFilter, originFilter, categoryFilter]);

  // Dynamic Product count for a given brand
  const getBrandProducts = (brandName: string) => {
    return products.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase());
  };

  // Open Workspace for Brand
  const handleOpenWorkspace = (brand: ExtendedBrandItem, defaultTab: string = 'overview') => {
    setSelectedBrand(brand);
    setActiveTabKey(defaultTab);
    setIsWorkspaceOpen(true);
    pricingForm.setFieldsValue(brand.pricingPolicy);
  };

  // 1. Add New Brand
  const handleSaveBrand = (values: any) => {
    const code = values.code
      ? values.code.toUpperCase()
      : values.name.substring(0, 3).toUpperCase() + '-IND';

    const newBrand: ExtendedBrandItem = {
      id: `b-${Date.now()}`,
      name: values.name,
      code,
      logoText: values.name.substring(0, 3).toUpperCase(),
      description: values.description || 'OEM Industrial Component and Automation Systems.',
      website: values.website || 'https://manufacturer-portal.com',
      country: values.country || 'India',
      manufacturer: values.manufacturer || values.name,
      contactPerson: values.contactPerson || 'Authorized Liaison',
      phone: values.phone || '+91 98400 12345',
      email: values.email || 'partner@brand.com',
      address: values.address || 'Industrial Corridor, Chennai, TN',
      categories: values.categories || ['Industrial Equipment'],
      totalProducts: 0,
      activeProducts: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      operatingMarket: values.operatingMarket || 'Pan-India Industrial Hubs',
      gstin: values.gstin || '33AAAAA9999A1Z9',
      registeredAddress: values.address || 'Industrial Corridor, Chennai, TN',
      pricingPolicy: {
        minPurchasePrice: 100,
        maxPurchasePrice: 500000,
        minSellingPrice: 150,
        maxSellingPrice: 650000,
        maxDiscountPercent: 15,
        defaultGstRate: 18,
        effectiveDate: new Date().toISOString().split('T')[0],
        requireApproval: true,
        allowProductOverride: true,
      },
      agreement: {
        agreementNumber: `AGR-OEM-${code}-2026`,
        agreementType: 'Industrial Distributor Agreement',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2028-12-31',
        contractStatus: 'Active',
        warrantyPolicyDoc: `Standard-Warranty-${code}.pdf`,
        authorizationDoc: `Authorization-${code}-2026.pdf`,
        authorizedTerritory: 'India South Region & Special Economic Zones',
      },
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-IN'),
          type: 'Status Change',
          description: `OEM Brand record created under ${values.manufacturer}`,
          actor: 'System Admin',
        },
      ],
    };

    setBrands([newBrand, ...brands]);
    setIsAddBrandModalOpen(false);
    addBrandForm.resetFields();
    message.success(`Brand "${newBrand.name}" registered successfully!`);
  };

  // 2. Edit Brand
  const handleUpdateBrand = (values: any) => {
    if (!selectedBrand) return;
    const updated = brands.map((b) => {
      if (b.id === selectedBrand.id) {
        const updatedItem: ExtendedBrandItem = {
          ...b,
          name: values.name,
          manufacturer: values.manufacturer,
          country: values.country,
          contactPerson: values.contactPerson,
          phone: values.phone,
          email: values.email,
          status: values.status,
          address: values.address,
          operatingMarket: values.operatingMarket,
          gstin: values.gstin,
          auditTrail: [
            {
              id: `audit-${Date.now()}`,
              timestamp: new Date().toLocaleString('en-IN'),
              type: 'Status Change' as const,
              description: `Brand details updated. Status: ${values.status}`,
              actor: 'Authorized User',
            },
            ...b.auditTrail,
          ],
        };
        setSelectedBrand(updatedItem);
        return updatedItem;
      }
      return b;
    });

    setBrands(updated);
    setIsEditBrandModalOpen(false);
    message.success(`Brand "${values.name}" updated successfully.`);
  };

  // 3. Deactivate / Activate Brand
  const handleToggleBrandStatus = (brand: ExtendedBrandItem) => {
    const nextStatus = brand.status === 'Active' ? 'Inactive' : 'Active';
    const updated = brands.map((b) => {
      if (b.id === brand.id) {
        return {
          ...b,
          status: nextStatus as 'Active' | 'Inactive',
          auditTrail: [
            {
              id: `audit-${Date.now()}`,
              timestamp: new Date().toLocaleString('en-IN'),
              type: 'Status Change' as const,
              description: `Brand status changed to ${nextStatus}`,
              actor: 'Compliance Manager',
            },
            ...b.auditTrail,
          ],
        };
      }
      return b;
    });
    setBrands(updated);
    if (selectedBrand && selectedBrand.id === brand.id) {
      setSelectedBrand({
        ...selectedBrand,
        status: nextStatus as 'Active' | 'Inactive',
      });
    }
    message.info(`Brand "${brand.name}" is now marked as ${nextStatus}.`);
  };

  // 4. Update Brand Pricing Policy
  const handleSavePricingPolicy = (values: any) => {
    if (!selectedBrand) return;
    const updatedPolicy: BrandPricingPolicy = {
      minPurchasePrice: values.minPurchasePrice,
      maxPurchasePrice: values.maxPurchasePrice,
      minSellingPrice: values.minSellingPrice,
      maxSellingPrice: values.maxSellingPrice,
      maxDiscountPercent: values.maxDiscountPercent,
      defaultGstRate: values.defaultGstRate,
      effectiveDate: values.effectiveDate,
      requireApproval: values.requireApproval,
      allowProductOverride: values.allowProductOverride,
    };

    const updated = brands.map((b) => {
      if (b.id === selectedBrand.id) {
        return {
          ...b,
          pricingPolicy: updatedPolicy,
          auditTrail: [
            {
              id: `audit-${Date.now()}`,
              timestamp: new Date().toLocaleString('en-IN'),
              type: 'Pricing Policy' as const,
              description: `Pricing bounds revised. Max Disc: ${values.maxDiscountPercent}%, Min SP: ₹${values.minSellingPrice}`,
              actor: 'Pricing Authority',
            },
            ...b.auditTrail,
          ],
        };
      }
      return b;
    });

    setBrands(updated);
    setSelectedBrand({ ...selectedBrand, pricingPolicy: updatedPolicy });
    message.success('Brand Pricing Policy saved and enforced across mapped items.');
  };

  // 5. Add or Edit Mapped Product (with Price Validation)
  const handleSaveProductMapping = (values: any) => {
    if (!selectedBrand) return;

    // Check duplicate SKU if adding new product
    if (!editingProduct) {
      const existingSku = products.find(
        (p) => p.sku.toLowerCase() === values.sku.trim().toLowerCase()
      );
      if (existingSku) {
        message.error(`Product with SKU "${values.sku}" already exists! SKUs must be unique.`);
        return;
      }
    }

    // Validate pricing limits against Brand pricing policy
    const policy = selectedBrand.pricingPolicy;
    if (values.purchasePrice < policy.minPurchasePrice || values.purchasePrice > policy.maxPurchasePrice) {
      message.warning(
        `Purchase Price ₹${values.purchasePrice} is outside brand range (₹${policy.minPurchasePrice} - ₹${policy.maxPurchasePrice}). Requires supervisor approval.`
      );
    }
    if (values.sellingPrice < policy.minSellingPrice || values.sellingPrice > policy.maxSellingPrice) {
      message.warning(
        `Selling Price ₹${values.sellingPrice} is outside brand range (₹${policy.minSellingPrice} - ₹${policy.maxSellingPrice}). Requires sales director sign-off.`
      );
    }

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: values.name,
            sku: values.sku,
            modelNumber: values.modelNumber,
            category: values.category,
            purchasePrice: Number(values.purchasePrice),
            costPrice: Number(values.landedCost || values.purchasePrice * 1.05),
            sellingPrice: Number(values.sellingPrice),
            mrp: Number(values.mrp),
            taxPercent: Number(values.taxPercent),
            warrantyMonths: Number(values.warrantyMonths),
            status: values.status,
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      message.success(`Product "${values.name}" updated successfully.`);
    } else {
      // Add new mapped product
      const newProd: ProductItem = {
        id: `p-${Date.now()}`,
        name: values.name,
        code: values.sku,
        sku: values.sku,
        barcode: `890${Date.now().toString().slice(-9)}`,
        brand: selectedBrand.name,
        category: values.category,
        subcategory: 'OEM Components',
        productType: 'Finished Goods',
        manufacturer: selectedBrand.manufacturer,
        modelNumber: values.modelNumber,
        purchasePrice: Number(values.purchasePrice),
        costPrice: Number(values.landedCost || values.purchasePrice * 1.05),
        sellingPrice: Number(values.sellingPrice),
        mrp: Number(values.mrp),
        taxPercent: Number(values.taxPercent || policy.defaultGstRate),
        uom: 'NOS',
        warrantyMonths: Number(values.warrantyMonths || 12),
        hsnCode: '8504',
        preferredSupplier: selectedBrand.manufacturer,
        status: values.status || 'Active',
        availableStock: 25,
        totalSold: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setProducts([newProd, ...products]);

      // Add to audit trail
      const updatedBrand = {
        ...selectedBrand,
        auditTrail: [
          {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleString('en-IN'),
            type: 'Product Mapping' as const,
            description: `Product "${newProd.name}" (${newProd.sku}) mapped to brand catalog.`,
            actor: 'Catalog Manager',
          },
          ...selectedBrand.auditTrail,
        ],
      };
      setSelectedBrand(updatedBrand);
      setBrands(brands.map((b) => (b.id === selectedBrand.id ? updatedBrand : b)));
      message.success(`Product "${newProd.name}" permanently mapped to ${selectedBrand.name}.`);
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    productForm.resetFields();
  };

  // Remove product mapping
  const handleRemoveProductMapping = (prodId: string) => {
    if (!selectedBrand) return;
    const targetProduct = products.find((p) => p.id === prodId);
    setProducts(products.filter((p) => p.id !== prodId));

    if (targetProduct) {
      const updatedBrand = {
        ...selectedBrand,
        auditTrail: [
          {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleString('en-IN'),
            type: 'Product Mapping' as const,
            description: `Product "${targetProduct.name}" removed from brand mapping.`,
            actor: 'Catalog Manager',
          },
          ...selectedBrand.auditTrail,
        ],
      };
      setSelectedBrand(updatedBrand);
      setBrands(brands.map((b) => (b.id === selectedBrand.id ? updatedBrand : b)));
    }
    message.success('Product mapping detached successfully.');
  };

  // Main Brand Portfolio Table Columns
  const brandTableColumns: ColumnsType<ExtendedBrandItem> = [
    {
      title: 'Brand Name & Code',
      key: 'name',
      render: (_, r) => (
        <div
          onClick={() => handleOpenWorkspace(r, 'overview')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: BRAND_PURPLE_LIGHT,
              border: `1px solid ${BRAND_BORDER}`,
              color: BRAND_PURPLE,
              fontWeight: 800,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            {r.logoText}
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#111827', fontSize: 13.5 }}>
              {r.name}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
              {r.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Manufacturer Entity',
      key: 'manufacturer',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12.5 }}>
            {r.manufacturer}
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            GSTIN: <span style={{ fontFamily: 'monospace' }}>{r.gstin}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Origin / HQ',
      dataIndex: 'country',
      key: 'country',
      align: 'center',
      render: (v) => (
        <Tag style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, color: '#334155', fontWeight: 600, fontSize: 11 }}>
          {v}
        </Tag>
      ),
    },
    {
      title: 'Mapped Products',
      key: 'mappedProducts',
      align: 'center',
      render: (_, r) => {
        const count = getBrandProducts(r.name).length;
        return (
          <Button
            type="link"
            size="small"
            onClick={() => handleOpenWorkspace(r, 'products')}
            style={{ fontWeight: 800, color: BRAND_PURPLE, padding: 0 }}
          >
            <Tag color="purple" style={{ fontWeight: 800, cursor: 'pointer', borderRadius: 12, padding: '2px 10px' }}>
              {count} Products
            </Tag>
          </Button>
        );
      },
    },
    {
      title: 'Key Representative',
      key: 'representative',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12 }}>
            {r.contactPerson}
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: 'Contact Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>{v}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <Tag
          style={{
            background: status === 'Active' ? '#F0FDF4' : '#FEF2F2',
            color: status === 'Active' ? '#15803D' : '#B91C1C',
            border: `1px solid ${status === 'Active' ? '#BBF7D0' : '#FECACA'}`,
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 11,
            padding: '2px 8px',
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <Tooltip title="View Full Brand Profile & Mappings">
            <Button
              size="small"
              icon={<Eye size={13} />}
              onClick={() => handleOpenWorkspace(r, 'overview')}
              style={{ borderRadius: 6, height: 28, width: 28, padding: 0, color: BRAND_PURPLE }}
            />
          </Tooltip>

          <Tooltip title="Edit Brand Information">
            <Button
              size="small"
              icon={<Edit size={13} />}
              onClick={() => {
                setSelectedBrand(r);
                editBrandForm.setFieldsValue({
                  name: r.name,
                  manufacturer: r.manufacturer,
                  country: r.country,
                  contactPerson: r.contactPerson,
                  phone: r.phone,
                  email: r.email,
                  status: r.status,
                  address: r.address,
                  operatingMarket: r.operatingMarket,
                  gstin: r.gstin,
                });
                setIsEditBrandModalOpen(true);
              }}
              style={{ borderRadius: 6, height: 28, width: 28, padding: 0 }}
            />
          </Tooltip>

          <Popconfirm
            title={`Toggle status to ${r.status === 'Active' ? 'Inactive' : 'Active'}?`}
            onConfirm={() => handleToggleBrandStatus(r)}
            okText="Yes, Change"
            cancelText="Cancel"
          >
            <Button
              size="small"
              style={{
                borderRadius: 6,
                height: 28,
                fontSize: 11,
                fontWeight: 600,
                color: r.status === 'Active' ? '#DC2626' : '#16A34A',
              }}
            >
              {r.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Workspace: Mapped Products Table Columns
  const mappedProductColumns: ColumnsType<ProductItem> = [
    {
      title: 'Product & SKU',
      key: 'product',
      render: (_, p) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>
            {p.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
            SKU: {p.sku} &bull; Model: {p.modelNumber}
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v) => <Tag color="blue" style={{ fontSize: 11, fontWeight: 600 }}>{v}</Tag>,
    },
    {
      title: 'Purchase Price (₹)',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      align: 'right',
      render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Landed Cost (₹)',
      dataIndex: 'costPrice',
      key: 'costPrice',
      align: 'right',
      render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'Selling Price (₹)',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      align: 'right',
      render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700, color: BRAND_PURPLE }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'MRP (₹)',
      dataIndex: 'mrp',
      key: 'mrp',
      align: 'right',
      render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>₹{v.toLocaleString('en-IN')}</span>,
    },
    {
      title: 'GST %',
      dataIndex: 'taxPercent',
      key: 'taxPercent',
      align: 'center',
      render: (v) => `${v}%`,
    },
    {
      title: 'Warranty',
      dataIndex: 'warrantyMonths',
      key: 'warrantyMonths',
      align: 'center',
      render: (v) => `${v} Mo`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'default'} style={{ fontWeight: 600, fontSize: 10.5 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, p) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
          <Button
            size="small"
            icon={<Edit size={12} />}
            onClick={() => {
              setEditingProduct(p);
              productForm.setFieldsValue({
                name: p.name,
                sku: p.sku,
                modelNumber: p.modelNumber,
                category: p.category,
                purchasePrice: p.purchasePrice,
                landedCost: p.costPrice,
                sellingPrice: p.sellingPrice,
                mrp: p.mrp,
                taxPercent: p.taxPercent,
                warrantyMonths: p.warrantyMonths,
                status: p.status,
              });
              setIsAddProductModalOpen(true);
            }}
            style={{ borderRadius: 6, height: 26, width: 26, padding: 0 }}
          />
          <Popconfirm
            title="Detach product mapping from this brand?"
            onConfirm={() => handleRemoveProductMapping(p.id)}
            okText="Detach"
            cancelText="Cancel"
          >
            <Button
              size="small"
              danger
              icon={<Trash2 size={12} />}
              style={{ borderRadius: 6, height: 26, width: 26, padding: 0 }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
      {/* 1. Header Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '18px 24px',
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
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              OEM Brand Portfolio & Manufacturers
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Manage manufacturer partnerships, brand catalogs, pricing policies, product mappings and authorized contacts.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            icon={<Upload size={14} />}
            onClick={() => message.info('Import OEM Brand Data from Excel/CSV...')}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Import Brands
          </Button>

          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting OEM Brand Portfolio ledger...')}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Export Brands
          </Button>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              addBrandForm.resetFields();
              setIsAddBrandModalOpen(true);
            }}
            style={{
              background: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 8,
              height: 38,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
            }}
          >
            Add New Brand
          </Button>
        </div>
      </div>

      {/* 2. Summary Cards (Exact 4 in 1 Row, Calculated Dynamically) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Total Brands */}
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
              Total Brands
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {totalBrands}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              OEM & authorized principals
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
            <Building2 size={20} />
          </div>
        </div>

        {/* Active Brands */}
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
              Active Brands
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {activeBrands}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Valid channel contracts
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

        {/* Inactive / On Hold Brands */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(217, 119, 6, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309' }}>
              Inactive / On Hold Brands
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {inactiveBrands}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Contract renewal pending
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <AlertCircle size={20} />
          </div>
        </div>

        {/* Total Mapped Products */}
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
              Total Mapped Products
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {totalMappedProducts}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Linked across brand catalogs
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
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* 3. Unified Search & Filters Toolbar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Input
          prefix={<Search size={15} color="#94A3B8" />}
          placeholder="Search Brand Name, Code, Manufacturer, Product Name, SKU, Model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ flex: '1 1 320px', minWidth: 260, height: 38, borderRadius: 8 }}
        />

        <Select
          style={{ width: 140, height: 38 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'ALL', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
        />

        <Select
          style={{ width: 180, height: 38 }}
          value={manufacturerFilter}
          onChange={setManufacturerFilter}
          options={[
            { value: 'ALL', label: 'All Manufacturers' },
            ...manufacturerOptions.map((m) => ({ value: m, label: m })),
          ]}
        />

        <Select
          style={{ width: 180, height: 38 }}
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: 'ALL', label: 'All Categories' },
            ...INITIAL_CATEGORIES.map((c) => ({ value: c.name, label: c.name })),
          ]}
        />

        <Select
          style={{ width: 150, height: 38 }}
          value={originFilter}
          onChange={setOriginFilter}
          options={[
            { value: 'ALL', label: 'All Origins' },
            ...countryOptions.map((c) => ({ value: c, label: c })),
          ]}
        />

        {(search || statusFilter !== 'ALL' || manufacturerFilter !== 'ALL' || categoryFilter !== 'ALL' || originFilter !== 'ALL') && (
          <Button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setManufacturerFilter('ALL');
              setCategoryFilter('ALL');
              setOriginFilter('ALL');
            }}
            style={{ height: 38, borderRadius: 8, fontSize: 12 }}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* 4. Brand Portfolio Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
            Registered OEM Brands & Principals
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Showing <strong>{filteredBrands.length}</strong> of {brands.length} brand entries &bull; Click any row to inspect brand workspace
          </span>
        </div>

        <Table
          dataSource={filteredBrands}
          columns={brandTableColumns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true }}
          size="middle"
        />
      </div>

      {/* 5. Brand Details Workspace (Detailed Profile Drawer / Modal with 6 Tabs) */}
      <Drawer
        title={
          selectedBrand ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: BRAND_PURPLE_LIGHT,
                    border: `1px solid ${BRAND_BORDER}`,
                    color: BRAND_PURPLE,
                    fontWeight: 800,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedBrand.logoText}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                    {selectedBrand.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    Code: <strong>{selectedBrand.code}</strong> &bull; {selectedBrand.manufacturer}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag
                  color={selectedBrand.status === 'Active' ? 'green' : 'red'}
                  style={{ fontWeight: 700, borderRadius: 6, padding: '3px 10px', fontSize: 11 }}
                >
                  {selectedBrand.status}
                </Tag>
              </div>
            </div>
          ) : (
            'Brand Profile'
          )
        }
        open={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        width={980}
      >
        {selectedBrand && (
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={[
              // A. Brand Overview
              {
                key: 'overview',
                label: 'A. Brand Overview',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                      <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Brand Code & Origin</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedBrand.code}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Origin: {selectedBrand.country}</div>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Operating Market</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{selectedBrand.operatingMarket}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Exclusive Distribution</div>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Mapped Catalog Items</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: BRAND_PURPLE, marginTop: 2 }}>
                          {getBrandProducts(selectedBrand.name).length} Active SKUs
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Direct Linkage</div>
                      </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 10, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A', marginBottom: 8 }}>
                        Principal Entity & Scope
                      </div>
                      <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.6 }}>
                        {selectedBrand.description}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Corporate Website</div>
                          <a href={selectedBrand.website} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: BRAND_PURPLE, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {selectedBrand.website} <ExternalLink size={12} />
                          </a>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Authorized Product Categories</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            {selectedBrand.categories.map((c, i) => (
                              <Tag key={i} color="purple">{c}</Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },

              // B. Product Mapping
              {
                key: 'products',
                label: `B. Product Mapping (${getBrandProducts(selectedBrand.name).length})`,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
                          Permanently Linked Products
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>
                          Products mapped to {selectedBrand.name} with strict brand pricing policy validation
                        </div>
                      </div>
                      <Button
                        type="primary"
                        icon={<Plus size={14} />}
                        onClick={() => {
                          setEditingProduct(null);
                          productForm.resetFields();
                          productForm.setFieldsValue({
                            taxPercent: selectedBrand.pricingPolicy.defaultGstRate,
                            status: 'Active',
                            warrantyMonths: 12,
                          });
                          setIsAddProductModalOpen(true);
                        }}
                        style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, borderRadius: 8, height: 34, fontWeight: 700 }}
                      >
                        Add Product to Brand
                      </Button>
                    </div>

                    <Table
                      dataSource={getBrandProducts(selectedBrand.name)}
                      columns={mappedProductColumns}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      size="small"
                    />
                  </div>
                ),
              },

              // C. Brand Pricing Configuration
              {
                key: 'pricing',
                label: 'C. Brand Pricing Configuration',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                    <Alert
                      type="info"
                      showIcon
                      message="Brand-Level Pricing Governance"
                      description="Configured price bands prevent catalog items from being purchased or sold outside authorized OEM agreements. Any catalog deviations will require authorized managerial sign-off."
                      style={{ borderRadius: 8 }}
                    />

                    <Form
                      form={pricingForm}
                      layout="vertical"
                      onFinish={handleSavePricingPolicy}
                      initialValues={selectedBrand.pricingPolicy}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13, marginBottom: 12 }}>
                            Purchase Price Limits (Inward)
                          </div>
                          <Form.Item name="minPurchasePrice" label="Minimum Purchase Price (₹)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%', height: 36 }} min={0} />
                          </Form.Item>
                          <Form.Item name="maxPurchasePrice" label="Maximum Purchase Price (₹)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%', height: 36 }} min={0} />
                          </Form.Item>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13, marginBottom: 12 }}>
                            Selling Price & Discount Boundaries
                          </div>
                          <Form.Item name="minSellingPrice" label="Minimum Selling Price (₹)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%', height: 36 }} min={0} />
                          </Form.Item>
                          <Form.Item name="maxSellingPrice" label="Maximum Selling Price (₹)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%', height: 36 }} min={0} />
                          </Form.Item>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
                        <Form.Item name="maxDiscountPercent" label="Max Permissible Discount (%)" rules={[{ required: true }]}>
                          <InputNumber style={{ width: '100%', height: 36 }} min={0} max={100} />
                        </Form.Item>

                        <Form.Item name="defaultGstRate" label="Default Statutory GST Rate (%)" rules={[{ required: true }]}>
                          <Select
                            style={{ height: 36 }}
                            options={[
                              { value: 0, label: '0% (Exempted)' },
                              { value: 5, label: '5%' },
                              { value: 12, label: '12%' },
                              { value: 18, label: '18% Standard' },
                              { value: 28, label: '28% Heavy' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item name="effectiveDate" label="Policy Effective Date">
                          <Input style={{ height: 36 }} />
                        </Form.Item>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FAF5FF', borderRadius: 8, border: '1px solid #E9D5FF' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: BRAND_PURPLE, fontSize: 13 }}>Enforce Multi-Tier Approval on Deviation</div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>Require VP Sales authorization if line price breaches brand boundaries</div>
                        </div>
                        <Form.Item name="requireApproval" valuePropName="checked" style={{ margin: 0 }}>
                          <Switch />
                        </Form.Item>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                        <Button type="primary" htmlType="submit" style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, height: 38, fontWeight: 700 }}>
                          Save Pricing Governance Policy
                        </Button>
                      </div>
                    </Form>
                  </div>
                ),
              },

              // D. Manufacturer & Contacts
              {
                key: 'manufacturer',
                label: 'D. Manufacturer & Contacts',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                    <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', marginBottom: 12 }}>
                        Manufacturer Legal Entity
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Legal Registered Name</div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E293B' }}>{selectedBrand.manufacturer}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>GSTIN / Tax ID</div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1E293B', fontFamily: 'monospace' }}>{selectedBrand.gstin}</div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Registered Address</div>
                          <div style={{ fontSize: 13, color: '#334155' }}>{selectedBrand.address}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 10, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', marginBottom: 12 }}>
                        Authorized Brand Representatives
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ border: '1px solid #E2E8F0', padding: 14, borderRadius: 8 }}>
                          <Tag color="purple" style={{ marginBottom: 6 }}>Primary Commercial Lead</Tag>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{selectedBrand.contactPerson}</div>
                          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Phone: {selectedBrand.phone}</div>
                          <div style={{ fontSize: 12, color: '#475569' }}>Email: {selectedBrand.email}</div>
                        </div>

                        <div style={{ border: '1px solid #E2E8F0', padding: 14, borderRadius: 8 }}>
                          <Tag color="blue" style={{ marginBottom: 6 }}>Technical Support Desk</Tag>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>National Engineering Desk</div>
                          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Phone: 1800-419-8822 (Toll Free)</div>
                          <div style={{ fontSize: 12, color: '#475569' }}>Email: tech.support@{selectedBrand.code.toLowerCase()}.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },

              // E. Agreements & Documents
              {
                key: 'agreements',
                label: 'E. Agreements & Documents',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                    <div style={{ background: '#FAF5FF', padding: 18, borderRadius: 10, border: '1px solid #E9D5FF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 11, color: BRAND_PURPLE, fontWeight: 700, textTransform: 'uppercase' }}>
                            Channel Partner Agreement
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                            {selectedBrand.agreement.agreementNumber}
                          </div>
                        </div>
                        <Tag color="green" style={{ fontWeight: 800, fontSize: 12, padding: '3px 10px' }}>
                          {selectedBrand.agreement.contractStatus}
                        </Tag>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14, paddingTop: 12, borderTop: '1px solid #E9D5FF' }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Agreement Type</div>
                          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 12.5 }}>{selectedBrand.agreement.agreementType}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Contract Period</div>
                          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 12.5 }}>
                            {selectedBrand.agreement.startDate} to {selectedBrand.agreement.endDate}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>Authorized Territory</div>
                          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 12.5 }}>{selectedBrand.agreement.authorizedTerritory}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: 18, borderRadius: 10, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', marginBottom: 12 }}>
                        Compliance & Warranty Documents
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FileText size={18} color={BRAND_PURPLE} />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{selectedBrand.agreement.authorizationDoc}</div>
                              <div style={{ fontSize: 11, color: '#64748B' }}>OEM Principal Authorization Letter & Certificate</div>
                            </div>
                          </div>
                          <Button size="small" icon={<Download size={12} />} onClick={() => message.info('Downloading authorized document...')}>
                            Download
                          </Button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ShieldCheck size={18} color="#16A34A" />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{selectedBrand.agreement.warrantyPolicyDoc}</div>
                              <div style={{ fontSize: 11, color: '#64748B' }}>Standard Replacement & Warranty SLA Policy</div>
                            </div>
                          </div>
                          <Button size="small" icon={<Download size={12} />} onClick={() => message.info('Downloading warranty policy...')}>
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },

              // F. Brand History
              {
                key: 'history',
                label: 'F. Brand History',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
                      Audit Trail & Governance Log
                    </div>
                    {selectedBrand.auditTrail.map((audit) => (
                      <div
                        key={audit.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 14,
                          padding: '12px 16px',
                          background: '#F9FAFB',
                          borderRadius: 8,
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        <Tag color="purple" style={{ marginTop: 2, fontWeight: 700 }}>{audit.type}</Tag>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: '#1E293B', fontWeight: 600 }}>{audit.description}</div>
                          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                            {audit.timestamp} &bull; Recorded by <strong>{audit.actor}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Drawer>

      {/* Modal: Add New Brand */}
      <Modal
        title="Register New OEM Brand Partner"
        open={isAddBrandModalOpen}
        onCancel={() => setIsAddBrandModalOpen(false)}
        footer={null}
        width={620}
      >
        <Form form={addBrandForm} layout="vertical" onFinish={handleSaveBrand} style={{ marginTop: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Brand Name" rules={[{ required: true, message: 'Brand name is required' }]}>
              <Input placeholder="e.g. Danfoss Drives" style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="code" label="Brand Code">
              <Input placeholder="e.g. DNF-DRV" style={{ height: 38 }} />
            </Form.Item>
          </div>

          <Form.Item name="manufacturer" label="Corporate / Manufacturer Entity" rules={[{ required: true, message: 'Manufacturer is required' }]}>
            <Input placeholder="e.g. Danfoss Industries Pvt Ltd" style={{ height: 38 }} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="country" label="Country of Origin" initialValue="Denmark / India">
              <Input style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="operatingMarket" label="Operating Market" initialValue="Pan-India Industrial Corridor">
              <Input style={{ height: 38 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="contactPerson" label="Principal Contact Person">
              <Input placeholder="Liaison Officer Name" style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="phone" label="Contact Phone">
              <Input placeholder="+91 ..." style={{ height: 38 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Contact Email">
              <Input placeholder="partnerships@brand.com" style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="gstin" label="Principal GSTIN">
              <Input placeholder="33AAAAA0000A1Z5" style={{ height: 38, fontFamily: 'monospace' }} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Brand Portfolio & Agreement Scope">
            <Input.TextArea rows={2} placeholder="Brief summary of distribution scope and product lines..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsAddBrandModalOpen(false)} style={{ height: 38 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, height: 38, fontWeight: 700 }}>
              Register Brand
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal: Edit Brand */}
      <Modal
        title={`Edit Brand Profile: ${selectedBrand?.name}`}
        open={isEditBrandModalOpen}
        onCancel={() => setIsEditBrandModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={editBrandForm} layout="vertical" onFinish={handleUpdateBrand} style={{ marginTop: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Brand Name" rules={[{ required: true }]}>
              <Input style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select
                style={{ height: 38 }}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive / On Hold' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="manufacturer" label="Manufacturer Legal Name" rules={[{ required: true }]}>
            <Input style={{ height: 38 }} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="country" label="Country of Origin">
              <Input style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="operatingMarket" label="Operating Market">
              <Input style={{ height: 38 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="contactPerson" label="Contact Person">
              <Input style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input style={{ height: 38 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Email Address">
              <Input style={{ height: 38 }} />
            </Form.Item>
            <Form.Item name="gstin" label="Manufacturer GSTIN">
              <Input style={{ height: 38, fontFamily: 'monospace' }} />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Registered Address">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditBrandModalOpen(false)} style={{ height: 38 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, height: 38, fontWeight: 700 }}>
              Save Brand Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal: Add or Edit Mapped Product */}
      <Modal
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : `Map Product to ${selectedBrand?.name}`}
        open={isAddProductModalOpen}
        onCancel={() => {
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
        }}
        footer={null}
        width={680}
      >
        <Form form={productForm} layout="vertical" onFinish={handleSaveProductMapping} style={{ marginTop: 14 }}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Product name is required' }]}>
            <Input placeholder="e.g. Variable Frequency Drive 15kW 415V" style={{ height: 38 }} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="sku" label="SKU (Unique)" rules={[{ required: true, message: 'SKU is required' }]}>
              <Input placeholder="e.g. VFD-15K-IND" style={{ height: 38, fontFamily: 'monospace' }} disabled={Boolean(editingProduct)} />
            </Form.Item>
            <Form.Item name="modelNumber" label="Model Number" rules={[{ required: true, message: 'Model number is required' }]}>
              <Input placeholder="e.g. ATV-630-15KW" style={{ height: 38 }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select
                style={{ height: 38 }}
                options={INITIAL_CATEGORIES.map((c) => ({ value: c.name, label: c.name }))}
              />
            </Form.Item>
            <Form.Item name="warrantyMonths" label="Warranty Period (Months)" initialValue={12}>
              <InputNumber style={{ width: '100%', height: 38 }} min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="purchasePrice" label="Purchase Price (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%', height: 38 }} min={0} />
            </Form.Item>
            <Form.Item name="landedCost" label="Landed Cost (₹)">
              <InputNumber style={{ width: '100%', height: 38 }} min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="sellingPrice" label="Selling Price (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%', height: 38 }} min={0} />
            </Form.Item>
            <Form.Item name="mrp" label="MRP (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%', height: 38 }} min={0} />
            </Form.Item>
            <Form.Item name="taxPercent" label="GST Rate (%)" initialValue={18}>
              <Select
                style={{ height: 38 }}
                options={[
                  { value: 5, label: '5%' },
                  { value: 12, label: '12%' },
                  { value: 18, label: '18%' },
                  { value: 28, label: '28%' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Product Status" initialValue="Active">
            <Select
              style={{ height: 38 }}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Discontinued', label: 'Discontinued' },
              ]}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button
              onClick={() => {
                setIsAddProductModalOpen(false);
                setEditingProduct(null);
              }}
              style={{ height: 38 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, height: 38, fontWeight: 700 }}>
              {editingProduct ? 'Save Product Changes' : 'Confirm Mapping'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagementPage;
