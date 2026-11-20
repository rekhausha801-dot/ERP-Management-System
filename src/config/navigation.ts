import {
  LayoutDashboard,
  Calendar,
  Clock,
  ShoppingCart,
  FileCheck,
  Users,
  Undo2,
  Boxes,
  Layers,
  Truck,
  SlidersHorizontal,
  ShieldAlert,
  Building2,
  Package,
  Award,
  Receipt,
  TrendingUp,
  ShoppingBag,
  FileText,
  Target,
  UserCheck,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  Briefcase,
  MapPin,
  MessageSquare,
  History,
  ShieldCheck,
  Palette,
  Bell,
  Headphones,
  LifeBuoy,
  FileBox,
  FolderLock,
  Landmark,
  Scale,
  Percent,
  QrCode,
  Archive,
  BarChart3,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  key: string;
  label: string;
  route?: string;
  icon?: LucideIcon;
  iconName?: string;
  permissionKey?: string;
  badge?: string;
  children?: NavItemConfig[];
}

export interface NavSectionConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  iconName: string;
  route?: string;
  permissionKey?: string;
  children?: NavItemConfig[];
}

/**
 * =========================================================================
 * INDIAN SALES ERP ENTERPRISE - 18 EXACT SIDEBAR SPECIFICATION
 * Kebab-case URLs, Clean Title Case, GST Compliant Indian Architecture
 * =========================================================================
 */
export const SIDEBAR_NAVIGATION_CONFIG: NavSectionConfig[] = [
  // 1. Dashboard
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    iconName: 'LayoutDashboard',
    route: '/app/dashboard',
    permissionKey: 'dashboard.view',
  },

  // 2. Company Calendar
  {
    key: 'company-calendar',
    label: 'Company Calendar',
    icon: Calendar,
    iconName: 'Calendar',
    route: '/app/calendar',
    permissionKey: 'calendar.view',
  },

  // 3. Sales Management
  {
    key: 'sales-management',
    label: 'Sales Management',
    icon: TrendingUp,
    iconName: 'TrendingUp',
    permissionKey: 'sales.view',
    children: [
      { key: 'sales-overview', label: 'Sales Overview', route: '/app/sales/overview', icon: BarChart3, permissionKey: 'sales.overview' },
      { key: 'sales-quotations', label: 'Quotations', route: '/app/sales/quotations', icon: FileText, permissionKey: 'sales.quotations' },
      { key: 'sales-orders', label: 'Sales Orders', route: '/app/sales/orders', icon: ShoppingBag, permissionKey: 'sales.orders' },
      { key: 'sales-delivery-challans', label: 'Delivery Challans', route: '/app/delivery/overview', icon: Truck, permissionKey: 'sales.delivery' },
      { key: 'sales-invoices', label: 'Sales Invoices', route: '/app/sales/invoices', icon: Receipt, permissionKey: 'sales.invoices' },
      { key: 'sales-returns', label: 'Sales Returns', route: '/app/sales/returns', icon: Undo2, permissionKey: 'sales.returns' },
      { key: 'sales-receipts', label: 'Receipts', route: '/app/sales/payments-received', icon: CreditCard, permissionKey: 'sales.receipts' },
      { key: 'sales-price-lists', label: 'Price Lists & Discounts', route: '/app/sales/price-lists', icon: Receipt, permissionKey: 'sales.pricing' },
      { key: 'sales-targets-analytics', label: 'Sales Targets & Analytics', route: '/app/sales/targets', icon: Target, permissionKey: 'sales.targets' },
    ],
  },

  // 4. CRM & Leads
  {
    key: 'crm-leads',
    label: 'CRM & Leads',
    icon: UserCheck,
    iconName: 'UserCheck',
    permissionKey: 'crm.view',
    children: [
      { key: 'crm-leads-item', label: 'Leads', route: '/app/crm/leads', icon: Users, permissionKey: 'crm.leads' },
      { key: 'crm-pipeline-item', label: 'Sales Pipeline', route: '/app/crm/pipeline', icon: TrendingUp, permissionKey: 'crm.pipeline' },
      { key: 'crm-followups-item', label: 'Customer Follow-ups', route: '/app/crm/follow-ups', icon: Clock, permissionKey: 'crm.followups' },
    ],
  },

  // 5. Invoice & Billing
  {
    key: 'invoice-billing',
    label: 'Invoice & Billing',
    icon: Receipt,
    iconName: 'Receipt',
    permissionKey: 'billing.view',
    children: [
      { key: 'billing-proforma', label: 'Proforma Invoices', route: '/app/sales/proforma-invoices', icon: FileText, permissionKey: 'billing.proforma' },
      { key: 'billing-credit-notes', label: 'Credit Notes', route: '/app/finance/credit-notes', icon: Undo2, permissionKey: 'billing.credit_notes' },
      { key: 'billing-debit-notes', label: 'Debit Notes', route: '/app/finance/debit-notes', icon: FileText, permissionKey: 'billing.debit_notes' },
      { key: 'billing-pos', label: 'POS Billing', route: '/app/sales/pos', icon: ShoppingCart, permissionKey: 'billing.pos' },
      { key: 'billing-templates', label: 'Invoice Templates', route: '/app/finance/invoice-templates', icon: Palette, permissionKey: 'billing.templates' },
    ],
  },

  // 6. Customer Management
  {
    key: 'customer-management',
    label: 'Customer Management',
    icon: Users,
    iconName: 'Users',
    permissionKey: 'customers.view',
    children: [
      { key: 'customers-all', label: 'All Customers', route: '/app/customers', icon: Users, permissionKey: 'customers.all' },
      { key: 'customers-groups', label: 'Customer Groups', route: '/app/customers/groups', icon: Boxes, permissionKey: 'customers.groups' },
      { key: 'customers-contacts', label: 'Customer Contacts', route: '/app/customers/contacts', icon: UserCheck, permissionKey: 'customers.contacts' },
      { key: 'customers-portal', label: 'Customer Portal Access', route: '/app/portal/customer', icon: ShieldCheck, permissionKey: 'customers.portal' },
    ],
  },

  // 7. Product & Brand Management
  {
    key: 'product-brand-management',
    label: 'Product & Brand Management',
    icon: Package,
    iconName: 'Package',
    permissionKey: 'products.view',
    children: [
      { key: 'products-all', label: 'All Products', route: '/app/sales/products', icon: Package, permissionKey: 'products.all' },
      { key: 'products-brands', label: 'Brand Management', route: '/app/sales/brands', icon: Award, permissionKey: 'products.brands' },
      { key: 'products-categories', label: 'Product Categories', route: '/app/sales/product-categories', icon: Boxes, permissionKey: 'products.categories' },
      { key: 'products-pricing', label: 'Product Pricing', route: '/app/sales/price-lists', icon: Receipt, permissionKey: 'products.pricing' },
      { key: 'products-hsn-tax', label: 'HSN & Tax Mapping', route: '/app/settings/tax', icon: Percent, permissionKey: 'products.hsn' },
    ],
  },

  // 8. Inventory Management
  {
    key: 'inventory-management',
    label: 'Inventory Management',
    icon: Boxes,
    iconName: 'Boxes',
    permissionKey: 'inventory.view',
    children: [
      { key: 'inv-overview', label: 'Inventory Overview', route: '/app/sales/inventory', icon: BarChart3, permissionKey: 'inventory.overview' },
      { key: 'inv-stock-mgmt', label: 'Stock Management', route: '/app/sales/stock-management', icon: Boxes, permissionKey: 'inventory.stock' },
      { key: 'inv-stock-ledger', label: 'Stock Ledger', route: '/app/sales/stock-in-out', icon: Layers, permissionKey: 'inventory.ledger' },
      { key: 'inv-transfers', label: 'Stock Transfers', route: '/app/sales/stock-transfers', icon: Truck, permissionKey: 'inventory.transfers' },
      { key: 'inv-adjustments', label: 'Stock Adjustments', route: '/app/sales/stock-adjustments', icon: SlidersHorizontal, permissionKey: 'inventory.adjustments' },
      { key: 'inv-batch-serial', label: 'Batch & Serial Tracking', route: '/app/sales/batch-serial', icon: Layers, permissionKey: 'inventory.batch' },
      { key: 'inv-expiry', label: 'Expiry Tracking', route: '/app/sales/low-stock-alerts', icon: Clock, permissionKey: 'inventory.expiry' },
      { key: 'inv-reorder', label: 'Reorder Levels & Low Stock Alerts', route: '/app/sales/low-stock-alerts', icon: ShieldAlert, permissionKey: 'inventory.reorder' },
      { key: 'inv-warehouses', label: 'Warehouse & Bin Management', route: '/app/sales/warehouses', icon: Building2, permissionKey: 'inventory.warehouses' },
      { key: 'inv-barcodes', label: 'Barcode & Labels', route: '/app/sales/pos', icon: QrCode, permissionKey: 'inventory.barcodes' },
      { key: 'inv-valuation-audits', label: 'Stock Valuation & Audits', route: '/app/sales/inventory-reports', icon: FileSpreadsheet, permissionKey: 'inventory.valuation' },
    ],
  },

  // 9. Purchase Management
  {
    key: 'purchase-management',
    label: 'Purchase Management',
    icon: ShoppingCart,
    iconName: 'ShoppingCart',
    permissionKey: 'purchases.view',
    children: [
      { key: 'pur-overview', label: 'Purchase Overview', route: '/app/sales/purchases', icon: BarChart3, permissionKey: 'purchases.overview' },
      { key: 'pur-requisitions', label: 'Purchase Requisitions', route: '/app/sales/purchase-requisitions', icon: FileText, permissionKey: 'purchases.requisitions' },
      { key: 'pur-quotations', label: 'Supplier Quotations', route: '/app/sales/rfqs', icon: Award, permissionKey: 'purchases.rfq' },
      { key: 'pur-orders', label: 'Purchase Orders', route: '/app/sales/purchase-orders', icon: ShoppingCart, permissionKey: 'purchases.orders' },
      { key: 'pur-grn', label: 'Goods Received Notes', route: '/app/sales/grn', icon: FileCheck, permissionKey: 'purchases.grn' },
      { key: 'pur-bills', label: 'Purchase Bills', route: '/app/sales/purchase-bills', icon: Receipt, permissionKey: 'purchases.bills' },
      { key: 'pur-payments', label: 'Payments Made', route: '/app/sales/payments-made', icon: CreditCard, permissionKey: 'purchases.payments' },
      { key: 'pur-returns', label: 'Purchase Returns', route: '/app/sales/purchase-returns', icon: Undo2, permissionKey: 'purchases.returns' },
      { key: 'pur-suppliers', label: 'Suppliers & Vendor Portal', route: '/app/sales/suppliers', icon: Users, permissionKey: 'purchases.suppliers' },
      { key: 'pur-analytics', label: 'Purchase Analytics', route: '/app/sales/purchase-analytics', icon: TrendingUp, permissionKey: 'purchases.analytics' },
    ],
  },

  // 10. Receivables & Payables
  {
    key: 'receivables-payables',
    label: 'Receivables & Payables',
    icon: CreditCard,
    iconName: 'CreditCard',
    permissionKey: 'accounts.view',
    children: [
      { key: 'rp-debtors', label: 'Debtors Ageing', route: '/app/finance/debtors', icon: TrendingUp, permissionKey: 'accounts.debtors' },
      { key: 'rp-creditors', label: 'Creditors Ageing', route: '/app/finance/creditors', icon: ShoppingBag, permissionKey: 'accounts.creditors' },
      { key: 'rp-followups', label: 'Payment Follow-ups', route: '/app/finance/payment-reminders', icon: Bell, permissionKey: 'accounts.followups' },
    ],
  },

  // 11. Finance & Accounting
  {
    key: 'finance-accounting',
    label: 'Finance & Accounting',
    icon: Building2,
    iconName: 'Building2',
    permissionKey: 'finance.view',
    children: [
      { key: 'fin-overview', label: 'Finance Overview', route: '/app/finance/dashboard', icon: BarChart3, permissionKey: 'finance.overview' },
      { key: 'fin-coa', label: 'Chart of Accounts', route: '/app/finance/chart-of-accounts', icon: FileSpreadsheet, permissionKey: 'finance.coa' },
      { key: 'fin-cash-bank', label: 'Cash & Bank', route: '/app/finance/bank-cash', icon: CreditCard, permissionKey: 'finance.cash_bank' },
      { key: 'fin-bank-recon', label: 'Bank Reconciliation', route: '/app/finance/bank-reconciliation', icon: CheckCircle, permissionKey: 'finance.bank_recon' },
      { key: 'fin-ar', label: 'Accounts Receivable', route: '/app/finance/receivables', icon: TrendingUp, permissionKey: 'finance.ar' },
      { key: 'fin-ap', label: 'Accounts Payable', route: '/app/finance/payables', icon: ShoppingBag, permissionKey: 'finance.ap' },
      { key: 'fin-notes-ledger', label: 'Credit & Debit Notes Ledger', route: '/app/finance/notes', icon: Undo2, permissionKey: 'finance.notes' },
      { key: 'fin-expenses', label: 'Expenses', route: '/app/finance/expenses', icon: Receipt, permissionKey: 'finance.expenses' },
      { key: 'fin-income', label: 'Income', route: '/app/finance/income', icon: TrendingUp, permissionKey: 'finance.income' },
      { key: 'fin-journal', label: 'Journal Entries', route: '/app/finance/journal-entries', icon: FileText, permissionKey: 'finance.journal' },
      { key: 'fin-gl', label: 'General Ledger', route: '/app/finance/general-ledger', icon: FileSpreadsheet, permissionKey: 'finance.gl' },
      { key: 'fin-cost-centers', label: 'Cost Centers', route: '/app/finance/chart-of-accounts', icon: Landmark, permissionKey: 'finance.cost_centers' },
      { key: 'fin-budgets', label: 'Budgets', route: '/app/finance/dashboard', icon: Scale, permissionKey: 'finance.budgets' },
      { key: 'fin-multi-currency', label: 'Multi-Currency', route: '/app/settings', icon: Landmark, permissionKey: 'finance.multi_currency' },
      { key: 'fin-period-closing', label: 'Period Closing', route: '/app/finance/general-ledger', icon: Archive, permissionKey: 'finance.period_closing' },
    ],
  },

  // 12. GST & Compliance
  {
    key: 'gst-compliance',
    label: 'GST & Compliance',
    icon: Receipt,
    iconName: 'Receipt',
    permissionKey: 'gst.view',
    children: [
      { key: 'gst-overview', label: 'GST Overview', route: '/app/finance/tax', icon: Receipt, permissionKey: 'gst.overview' },
      { key: 'gst-einvoice', label: 'E-Invoice', route: '/app/finance/gst/e-invoice', icon: FileText, permissionKey: 'gst.einvoice' },
      { key: 'gst-ewaybill', label: 'E-Way Bill', route: '/app/finance/gst/e-way-bill', icon: Truck, permissionKey: 'gst.ewaybill' },
      { key: 'gst-reports', label: 'GST Reports (GSTR-1, GSTR-3B, GSTR-2B)', route: '/app/finance/gst/reports', icon: BarChart3, permissionKey: 'gst.reports' },
      { key: 'gst-itc-recon', label: 'ITC Reconciliation', route: '/app/finance/gst/reports', icon: CheckCircle, permissionKey: 'gst.itc' },
      { key: 'gst-hsn-summary', label: 'HSN Summary', route: '/app/finance/tax', icon: Percent, permissionKey: 'gst.hsn' },
      { key: 'gst-gstr9', label: 'GSTR-9 Annual Return', route: '/app/finance/gst/reports', icon: FileSpreadsheet, permissionKey: 'gst.gstr9' },
      { key: 'gst-tds-tcs', label: 'TDS & TCS', route: '/app/finance/tax', icon: Scale, permissionKey: 'gst.tds_tcs' },
    ],
  },

  // 13. HR & Employee Management
  {
    key: 'hr-employee-management',
    label: 'HR & Employee Management',
    icon: UserCheck,
    iconName: 'UserCheck',
    permissionKey: 'hr.view',
    children: [
      { key: 'hr-employees', label: 'Employees', route: '/app/hr/employees', icon: Users, permissionKey: 'hr.employees' },
      { key: 'hr-recruitment', label: 'Recruitment & Onboarding', route: '/app/hr/recruitment', icon: Briefcase, permissionKey: 'hr.recruitment' },
      { key: 'hr-attendance', label: 'Attendance, Shifts & Holidays', route: '/app/hr/attendance', icon: CheckCircle, permissionKey: 'hr.attendance' },
      { key: 'hr-leave', label: 'Leave Management', route: '/app/hr/leave', icon: Calendar, permissionKey: 'hr.leave' },
      { key: 'hr-expenses', label: 'Expense Claims & Advances', route: '/app/hr/expenses', icon: Receipt, permissionKey: 'hr.expenses' },
      { key: 'hr-performance', label: 'Performance & KPI', route: '/app/hr/performance', icon: Target, permissionKey: 'hr.performance' },
      { key: 'hr-payroll', label: 'Payroll (PF, ESI, PT)', route: '/app/hr/payroll', icon: CreditCard, permissionKey: 'hr.payroll' },
      { key: 'hr-payslips', label: 'Payslips', route: '/app/hr/payslips', icon: FileText, permissionKey: 'hr.payslips' },
    ],
  },

  // 14. Asset Management
  {
    key: 'asset-management',
    label: 'Asset Management',
    icon: Layers,
    iconName: 'Layers',
    permissionKey: 'assets.view',
    children: [
      { key: 'asset-overview', label: 'Asset Overview', route: '/app/assets/register', icon: Boxes, permissionKey: 'assets.overview' },
      { key: 'asset-categories', label: 'Asset Categories', route: '/app/assets/categories', icon: Layers, permissionKey: 'assets.categories' },
      { key: 'asset-allocation', label: 'Asset Allocation', route: '/app/assets/allocation', icon: UserCheck, permissionKey: 'assets.allocation' },
      { key: 'asset-transfers', label: 'Asset Transfers', route: '/app/assets/transfers', icon: Truck, permissionKey: 'assets.transfers' },
      { key: 'asset-maintenance', label: 'Asset Maintenance', route: '/app/assets/maintenance', icon: SlidersHorizontal, permissionKey: 'assets.maintenance' },
      { key: 'asset-disposal', label: 'Depreciation & Disposal', route: '/app/assets/disposal', icon: Undo2, permissionKey: 'assets.disposal' },
    ],
  },

  // 15. Support & Helpdesk
  {
    key: 'support-helpdesk',
    label: 'Support & Helpdesk',
    icon: Headphones,
    iconName: 'Headphones',
    permissionKey: 'support.view',
    children: [
      { key: 'support-tickets', label: 'Tickets', route: '/app/services/tickets', icon: LifeBuoy, permissionKey: 'support.tickets' },
      { key: 'support-requests', label: 'Service Requests', route: '/app/services/requests', icon: MessageSquare, permissionKey: 'support.requests' },
      { key: 'support-warranty-amc', label: 'Warranty & AMC', route: '/app/services/amc', icon: ShieldCheck, permissionKey: 'support.amc' },
    ],
  },

  // 16. Reports & Analytics
  {
    key: 'reports-analytics',
    label: 'Reports & Analytics',
    icon: BarChart3,
    iconName: 'BarChart3',
    permissionKey: 'reports.view',
    children: [
      { key: 'rep-sales', label: 'Sales Reports', route: '/app/reports/sales', icon: TrendingUp, permissionKey: 'reports.sales' },
      { key: 'rep-purchase', label: 'Purchase Reports', route: '/app/reports/purchase', icon: ShoppingCart, permissionKey: 'reports.purchase' },
      { key: 'rep-inventory', label: 'Inventory Reports', route: '/app/reports/inventory', icon: Boxes, permissionKey: 'reports.inventory' },
      { key: 'rep-customers', label: 'Customer Reports', route: '/app/reports/customers', icon: Users, permissionKey: 'reports.customers' },
      { key: 'rep-financial', label: 'Financial Reports', route: '/app/reports/financial', icon: CreditCard, permissionKey: 'reports.financial' },
      { key: 'rep-outstanding', label: 'Outstanding Reports', route: '/app/reports/outstanding', icon: FileText, permissionKey: 'reports.outstanding' },
      { key: 'rep-hr', label: 'HR Reports', route: '/app/reports/hr', icon: UserCheck, permissionKey: 'reports.hr' },
      { key: 'rep-custom', label: 'Custom Report Builder', route: '/app/reports/custom-builder', icon: FileSpreadsheet, permissionKey: 'reports.custom' },
    ],
  },

  // 17. Operations & Desk
  {
    key: 'operations-desk',
    label: 'Operations & Desk',
    icon: ShieldCheck,
    iconName: 'ShieldCheck',
    permissionKey: 'operations.view',
    children: [
      { key: 'op-approvals', label: 'Approval Workflows', route: '/app/approvals', icon: ShieldCheck, permissionKey: 'operations.approvals' },
      { key: 'op-documents', label: 'Document Vault', route: '/app/documents', icon: FolderLock, permissionKey: 'operations.documents' },
      { key: 'op-communication', label: 'Communication & Tasks', route: '/app/communication', icon: MessageSquare, permissionKey: 'operations.tasks' },
      { key: 'op-reminders', label: 'Notifications & Reminders', route: '/app/operations/notifications', icon: Bell, permissionKey: 'operations.reminders' },
    ],
  },

  // 18. Settings
  {
    key: 'settings',
    label: 'Settings',
    icon: SlidersHorizontal,
    iconName: 'SlidersHorizontal',
    permissionKey: 'settings.view',
    children: [
      { key: 'set-company', label: 'Company Profile', route: '/app/settings', icon: Briefcase, permissionKey: 'settings.company' },
      { key: 'set-branches', label: 'Branch Management', route: '/app/settings/branches', icon: MapPin, permissionKey: 'settings.branches' },
      { key: 'set-users', label: 'User Management', route: '/app/settings/users', icon: UserCheck, permissionKey: 'settings.users' },
      { key: 'set-roles', label: 'Roles & Permissions', route: '/app/settings/roles', icon: ShieldAlert, permissionKey: 'settings.roles' },
      { key: 'set-tax', label: 'Tax Settings (GST)', route: '/app/settings/tax', icon: Receipt, permissionKey: 'settings.tax' },
      { key: 'set-payment', label: 'Payment Settings', route: '/app/settings/payments', icon: CreditCard, permissionKey: 'settings.payments' },
      { key: 'set-notifications', label: 'Notification Settings', route: '/app/settings/notifications', icon: MessageSquare, permissionKey: 'settings.notifications' },
      { key: 'set-audit', label: 'Audit Logs', route: '/app/settings/audit-logs', icon: History, permissionKey: 'settings.audit' },
    ],
  },
];

/**
 * Filter navigation items based on user role and granular permissions
 */
export function getFilteredNavigation(userRole?: string, userPermissions?: string[]): NavSectionConfig[] {
  // Super Admins or Admins have access to all modules
  if (!userRole || userRole === 'SUPER_ADMIN' || userRole === 'Admin') {
    return SIDEBAR_NAVIGATION_CONFIG;
  }

  // Filter based on assigned permission keys if available
  if (userPermissions && userPermissions.length > 0) {
    return SIDEBAR_NAVIGATION_CONFIG.filter((section) => {
      if (section.permissionKey && !userPermissions.includes(section.permissionKey)) {
        return false;
      }
      return true;
    }).map((section) => {
      if (!section.children) return section;
      const validChildren = section.children.filter((item) => {
        return !item.permissionKey || userPermissions.includes(item.permissionKey);
      });
      return { ...section, children: validChildren };
    }).filter((section) => !section.children || section.children.length > 0);
  }

  return SIDEBAR_NAVIGATION_CONFIG;
}
