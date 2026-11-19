import type { ErpPackageId } from './erpPackageConfig';
import { SERVICE_SIDEBAR_MENU_GROUPS } from './serviceSidebarConfig';
import { ADMIN_FULL_SIDEBAR_GROUPS } from './adminSidebarConfig';

export interface SubMenuItemConfig {
  key: string;
  label: string;
  path?: string;
  iconName?: string;
  allowedRoles?: string[];
  allowedPackages?: ErpPackageId[];
  children?: SubMenuItemConfig[];
}

export interface MenuGroupConfig {
  key: string;
  label: string;
  iconName: string;
  path?: string;
  section: 'common' | 'sales' | 'services';
  allowedPackages: ErpPackageId[];
  allowedRoles?: string[];
  children?: SubMenuItemConfig[];
}

/**
 * =========================================================================
 * PROFESSIONAL SALES ERP - 14 MAIN SIDEBAR MODULES
 * Standardized, Enterprise-Grade, Zero Duplicates, Strictly Organized
 * =========================================================================
 */
export const SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = [
  // 1. Dashboard
  {
    key: 'grp-dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'dash-overview', label: 'Dashboard Overview', path: '/app/sales/dashboard', iconName: 'LayoutDashboard' },
    ],
  },

  // 2. Company Calendar
  {
    key: 'grp-calendar',
    label: 'Company Calendar',
    iconName: 'Calendar',
    path: '/app/calendar',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
  },

  // 3. Purchase Management
  {
    key: 'grp-purchase',
    label: 'Purchase Management',
    iconName: 'ShoppingCart',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'pur-overview', label: 'Purchase Overview', path: '/app/sales/purchases', iconName: 'BarChart3' },
      { key: 'pur-orders', label: 'Purchase Orders', path: '/app/sales/purchase-orders', iconName: 'ShoppingCart' },
      { key: 'pur-grn', label: 'Goods Received (GRN)', path: '/app/sales/grn', iconName: 'FileCheck' },
      { key: 'pur-suppliers', label: 'Suppliers', path: '/app/sales/suppliers', iconName: 'Users' },
      { key: 'pur-returns', label: 'Purchase Returns', path: '/app/sales/purchase-returns', iconName: 'Undo2' },
      { key: 'pur-analytics', label: 'Purchase Analytics', path: '/app/sales/purchase-analytics', iconName: 'TrendingUp' },
    ],
  },

  // 4. Inventory Management
  {
    key: 'grp-inventory',
    label: 'Inventory Management',
    iconName: 'Boxes',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'inv-overview', label: 'Inventory Overview', path: '/app/sales/inventory', iconName: 'BarChart3' },
      { key: 'inv-stock-mgmt', label: 'Stock Management', path: '/app/sales/stock-management', iconName: 'Boxes' },
      { key: 'inv-in-out', label: 'Stock In / Stock Out', path: '/app/sales/stock-in-out', iconName: 'Layers' },
      { key: 'inv-transfers', label: 'Stock Transfers', path: '/app/sales/stock-transfers', iconName: 'Truck' },
      { key: 'inv-adjustments', label: 'Stock Adjustments', path: '/app/sales/stock-adjustments', iconName: 'SlidersHorizontal' },
      { key: 'inv-low-stock', label: 'Low Stock Alerts', path: '/app/sales/low-stock-alerts', iconName: 'ShieldAlert' },
      { key: 'inv-warehouses', label: 'Warehouse Management', path: '/app/sales/warehouses', iconName: 'Building2' },
      { key: 'inv-reports', label: 'Inventory Reports & Audits', path: '/app/sales/inventory-reports', iconName: 'FileSpreadsheet' },
    ],
  },

  // 5. Product & Brand Management
  {
    key: 'grp-products',
    label: 'Product & Brand Management',
    iconName: 'Package',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'pm-products', label: 'All Products', path: '/app/sales/products', iconName: 'Package' },
      { key: 'pm-brands', label: 'Brand Management', path: '/app/sales/brands', iconName: 'Award' },
      { key: 'pm-brand-products', label: 'Brand-wise Products', path: '/app/sales/brand-products', iconName: 'Layers' },
      { key: 'pm-categories', label: 'Product Categories', path: '/app/sales/product-categories', iconName: 'Boxes' },
      { key: 'pm-pricing', label: 'Product Pricing', path: '/app/sales/price-lists', iconName: 'Receipt' },
    ],
  },

  // 6. Sales Management
  {
    key: 'grp-sales',
    label: 'Sales Management',
    iconName: 'TrendingUp',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'sm-overview', label: 'Sales Overview', path: '/app/sales/overview', iconName: 'BarChart3' },
      { key: 'sm-quotations', label: 'Quotations', path: '/app/sales/quotations', iconName: 'FileText' },
      { key: 'sm-orders', label: 'Sales Orders', path: '/app/sales/orders', iconName: 'ShoppingBag' },
      { key: 'sm-delivery', label: 'Delivery Management', path: '/app/delivery/overview', iconName: 'Truck' },
      { key: 'sm-returns', label: 'Sales Returns', path: '/app/sales/returns', iconName: 'Undo2' },
      { key: 'sm-targets', label: 'Sales Targets', path: '/app/sales/targets', iconName: 'Target' },
      { key: 'sm-team', label: 'Sales Team', path: '/app/sales/team', iconName: 'Users' },
    ],
  },

  // 7. Customer Management
  {
    key: 'grp-customers',
    label: 'Customer Management',
    iconName: 'Users',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'cm-all', label: 'All Customers', path: '/app/customers', iconName: 'Users' },
      { key: 'cm-groups', label: 'Customer Groups', path: '/app/customers/groups', iconName: 'Boxes' },
      { key: 'cm-contacts', label: 'Customer Contacts', path: '/app/customers/contacts', iconName: 'UserCheck' },
      { key: 'cm-follow-ups', label: 'Customer Follow-ups', path: '/app/sales/lead-follow-ups', iconName: 'Clock' },
    ],
  },

  // 8. Invoice & Billing
  {
    key: 'grp-invoices',
    label: 'Invoice & Billing',
    iconName: 'Receipt',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'inv-all', label: 'All Invoices', path: '/app/finance/invoices', iconName: 'Receipt' },
      { key: 'inv-create', label: 'Create Invoice', path: '/app/finance/create-invoice', iconName: 'FileText' },
      { key: 'inv-credit-notes', label: 'Credit Notes', path: '/app/finance/credit-notes', iconName: 'Undo2' },
      { key: 'inv-debit-notes', label: 'Debit Notes', path: '/app/finance/debit-notes', iconName: 'FileText' },
    ],
  },

  // 9. Creditors & Debtors
  {
    key: 'grp-creditors-debtors',
    label: 'Creditors & Debtors',
    iconName: 'CreditCard',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'cd-creditors', label: 'Creditors', path: '/app/finance/creditors', iconName: 'Users' },
      { key: 'cd-debtors', label: 'Debtors', path: '/app/finance/debtors', iconName: 'UserCheck' },
      { key: 'cd-payables', label: 'Outstanding Payables', path: '/app/finance/payables', iconName: 'ShoppingBag' },
      { key: 'cd-receivables', label: 'Outstanding Receivables', path: '/app/finance/receivables', iconName: 'TrendingUp' },
    ],
  },

  // 10. HR & Employee Management
  {
    key: 'grp-hr',
    label: 'HR & Employee Management',
    iconName: 'UserCheck',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'hr-employees', label: 'Employees', path: '/app/hr/employees', iconName: 'Users' },
      { key: 'hr-attendance', label: 'Attendance', path: '/app/hr/attendance', iconName: 'CheckCircle' },
      { key: 'hr-leave', label: 'Leave Management', path: '/app/hr/leave', iconName: 'Calendar' },
      { key: 'hr-payroll', label: 'Payroll', path: '/app/hr/payroll', iconName: 'CreditCard' },
      { key: 'hr-payslips', label: 'Payslips', path: '/app/hr/payslips', iconName: 'FileText' },
    ],
  },

  // 11. Finance & Accounting
  {
    key: 'grp-finance',
    label: 'Finance & Accounting',
    iconName: 'Building2',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'fin-overview', label: 'Finance Overview', path: '/app/finance/dashboard', iconName: 'BarChart3' },
      { key: 'fin-bank-cash', label: 'Cash & Bank', path: '/app/finance/bank-cash', iconName: 'CreditCard' },
      { key: 'fin-expenses', label: 'Expenses', path: '/app/finance/expenses', iconName: 'Receipt' },
      { key: 'fin-income', label: 'Income', path: '/app/finance/income', iconName: 'TrendingUp' },
      { key: 'fin-gl', label: 'General Ledger', path: '/app/finance/general-ledger', iconName: 'FileSpreadsheet' },
      { key: 'fin-journal', label: 'Journal Entries', path: '/app/finance/journal-entries', iconName: 'FileText' },
      { key: 'fin-gst', label: 'GST Management', path: '/app/finance/tax', iconName: 'Receipt' },
    ],
  },

  // 12. Reports & Analytics
  {
    key: 'grp-reports',
    label: 'Reports & Analytics',
    iconName: 'BarChart3',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'rep-sales', label: 'Sales Reports', path: '/app/reports/sales', iconName: 'TrendingUp' },
      { key: 'rep-purchase', label: 'Purchase Reports', path: '/app/reports/purchase', iconName: 'ShoppingCart' },
      { key: 'rep-inventory', label: 'Inventory Reports', path: '/app/reports/inventory', iconName: 'Boxes' },
      { key: 'rep-customers', label: 'Customer Reports', path: '/app/reports/customers', iconName: 'Users' },
      { key: 'rep-financial', label: 'Financial Reports', path: '/app/reports/financial', iconName: 'CreditCard' },
      { key: 'rep-outstanding', label: 'Outstanding Reports', path: '/app/reports/outstanding', iconName: 'FileText' },
      { key: 'rep-hr', label: 'HR Reports', path: '/app/reports/hr', iconName: 'UserCheck' },
    ],
  },

  // 13. Asset Management
  {
    key: 'grp-assets',
    label: 'Asset Management',
    iconName: 'Layers',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'ast-overview', label: 'Asset Overview', path: '/app/assets/overview', iconName: 'BarChart3' },
      { key: 'ast-all', label: 'All Assets', path: '/app/assets/register', iconName: 'Boxes' },
      { key: 'ast-categories', label: 'Asset Categories', path: '/app/assets/categories', iconName: 'Layers' },
      { key: 'ast-allocation', label: 'Asset Allocation', path: '/app/assets/allocation', iconName: 'UserCheck' },
      { key: 'ast-transfers', label: 'Asset Transfers', path: '/app/assets/transfers', iconName: 'Truck' },
      { key: 'ast-maintenance', label: 'Asset Maintenance', path: '/app/assets/maintenance', iconName: 'SlidersHorizontal' },
      { key: 'ast-disposal', label: 'Asset Disposal', path: '/app/assets/disposal', iconName: 'Undo2' },
      { key: 'ast-history', label: 'Asset History', path: '/app/assets/history', iconName: 'History' },
    ],
  },

  // 14. Settings
  {
    key: 'grp-settings',
    label: 'Settings',
    iconName: 'SlidersHorizontal',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'set-company', label: 'Company Profile', path: '/app/settings', iconName: 'Briefcase' },
      { key: 'set-branches', label: 'Branch Management', path: '/app/settings/branches', iconName: 'MapPin' },
      { key: 'set-users', label: 'User Management', path: '/app/settings/users', iconName: 'UserCheck' },
      { key: 'set-roles', label: 'Roles & Permissions', path: '/app/settings/roles', iconName: 'ShieldAlert' },
      { key: 'set-tax', label: 'Tax Settings', path: '/app/settings/tax', iconName: 'Receipt' },
      { key: 'set-payment', label: 'Payment Settings', path: '/app/settings/payments', iconName: 'CreditCard' },
      { key: 'set-notifications', label: 'Notification Settings', path: '/app/settings/notifications', iconName: 'MessageSquare' },
      { key: 'set-audit', label: 'Audit Logs', path: '/app/settings/audit-logs', iconName: 'History' },
    ],
  },
];

/**
 * Filter collapsible menu groups for current package and user role
 */
export function getMenuGroupsForPackage(packageType: ErpPackageId, userRole?: string): MenuGroupConfig[] {
  // Always return the complete full Admin sidebar groups for all views
  if (packageType === 'SERVICE') {
    return ADMIN_FULL_SIDEBAR_GROUPS.filter((group) => group.allowedPackages.includes('SERVICE'));
  }

  return SIDEBAR_MENU_GROUPS.filter((group) => group.allowedPackages.includes(packageType)).map((group) => {
    if (packageType === 'SERVICE' && group.children) {
      return {
        ...group,
        children: group.children.filter((child) => child.key !== 'rep-sales'),
      };
    }
    return group;
  });
}
