export interface ProductItem {
  id: string;
  name: string;
  code: string;
  sku: string;
  barcode: string;
  image?: string;
  brand: string;
  category: string;
  subcategory: string;
  productType: 'Finished Goods' | 'Raw Material' | 'Spares / Components' | 'Service Item' | 'Consumable';
  manufacturer: string;
  modelNumber: string;
  purchasePrice: number;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  taxPercent: number; // GST
  uom: string; // PCS, KGS, BOX, etc.
  weightKg?: number;
  dimensions?: string;
  warrantyMonths: number;
  hsnCode: string;
  preferredSupplier: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  availableStock: number;
  totalSold: number;
  description?: string;
  createdAt: string;
}

export interface BrandItem {
  id: string;
  name: string;
  code: string;
  logoText: string;
  description: string;
  website: string;
  country: string;
  manufacturer: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  totalProducts: number;
  activeProducts: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  code: string;
  parentCategory: string | null;
  description: string;
  categoryType: 'Standard' | 'Service' | 'Spares' | 'Assembly';
  displayOrder: number;
  totalSubcategories: number;
  totalProducts: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface PriceListItem {
  id: string;
  name: string;
  code: string;
  customerGroup: 'All Customers' | 'Wholesale Buyers' | 'Retail Dealers' | 'Enterprise / Key Accounts' | 'Government / PSU';
  productCount: number;
  effectiveDate: string;
  expiryDate: string;
  discountPercentage: number;
  status: 'Active' | 'Pending Approval' | 'Expired';
}

export interface ProductPricingRecord {
  id: string;
  productId: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  purchasePrice: number;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  taxPercent: number;
  marginPercent: number;
  effectiveDate: string;
  status: 'Active' | 'Pending Approval' | 'Scheduled Update';
}
