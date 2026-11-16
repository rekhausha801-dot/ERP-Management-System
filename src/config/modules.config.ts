export type ErpPackage = 'SALES' | 'SERVICES' | 'BOTH';

export interface ModuleConfig {
  key: string;
  label: string;
  path: string;
  iconName: string;
  category: 'common' | 'sales' | 'services';
  allowedPackages: ErpPackage[];
  badge?: string;
}

export interface ErpPackageInfo {
  id: ErpPackage;
  name: string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeColor: string;
}

export const ERP_PACKAGES_METADATA: Record<ErpPackage, ErpPackageInfo> = {
  SALES: {
    id: 'SALES',
    name: 'Sales ERP',
    tagline: 'Commercial & Distribution Suite',
    description: 'Specialized for wholesale, trading, distribution, and product sales operations.',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB',
  },
  SERVICES: {
    id: 'SERVICES',
    name: 'Services ERP',
    tagline: 'Service, Maintenance & Field Operations',
    description: 'Specialized for technical service companies, field engineering, repair centers, and AMC management.',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
  },
  BOTH: {
    id: 'BOTH',
    name: 'Complete ERP',
    tagline: 'Sales + Services Unified Platform',
    description: 'Comprehensive enterprise system providing complete Sales and Service operational modules.',
    badgeBg: '#F5F3FF',
    badgeColor: '#7C3AED',
  },
};

/**
 * Master Registry of all ERP modules.
 * Used for dynamic sidebar generation and route protection.
 */
export const ERP_MODULES: ModuleConfig[] = [
  // --- Common Modules (Never duplicated) ---
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    iconName: 'LayoutDashboard',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },
  {
    key: 'customers',
    label: 'Customers',
    path: '/customers',
    iconName: 'Users',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },

  // --- Sales ERP Modules ---
  {
    key: 'products',
    label: 'Products',
    path: '/sales/products',
    iconName: 'Package',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    path: '/sales/inventory',
    iconName: 'Boxes',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'purchases',
    label: 'Purchases',
    path: '/sales/purchases',
    iconName: 'ShoppingCart',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    path: '/sales/suppliers',
    iconName: 'Truck',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'sales-orders',
    label: 'Sales Orders',
    path: '/sales/orders',
    iconName: 'ShoppingBag',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'quotations',
    label: 'Quotations',
    path: '/sales/quotations',
    iconName: 'FileSpreadsheet',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },
  {
    key: 'sales-returns',
    label: 'Sales Returns',
    path: '/sales/returns',
    iconName: 'Undo2',
    category: 'sales',
    allowedPackages: ['SALES', 'BOTH'],
  },

  // --- Services ERP Modules ---
  {
    key: 'service-requests',
    label: 'Service Requests',
    path: '/services/requests',
    iconName: 'Inbox',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },
  {
    key: 'work-orders',
    label: 'Work Orders',
    path: '/services/work-orders',
    iconName: 'Wrench',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },
  {
    key: 'technicians',
    label: 'Technicians',
    path: '/services/technicians',
    iconName: 'HardHat',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },
  {
    key: 'scheduling',
    label: 'Scheduling',
    path: '/services/scheduling',
    iconName: 'Calendar',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },
  {
    key: 'amc',
    label: 'AMC Management',
    path: '/services/amc',
    iconName: 'FileCheck',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },
  {
    key: 'service-history',
    label: 'Service History',
    path: '/services/history',
    iconName: 'History',
    category: 'services',
    allowedPackages: ['SERVICES', 'BOTH'],
  },

  // --- Common Financial & Administrative Modules ---
  {
    key: 'billing',
    label: 'Billing & Invoicing',
    path: '/billing',
    iconName: 'Receipt',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },
  {
    key: 'payments',
    label: 'Payments',
    path: '/payments',
    iconName: 'CreditCard',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },
  {
    key: 'reports',
    label: 'Reports & Analytics',
    path: '/reports',
    iconName: 'BarChart3',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    iconName: 'Settings',
    category: 'common',
    allowedPackages: ['SALES', 'SERVICES', 'BOTH'],
  },
];
