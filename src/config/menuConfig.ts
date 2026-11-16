import type { ErpPackageId } from './erpPackageConfig';

export interface SubMenuItemConfig {
  key: string;
  label: string;
  path: string;
  iconName?: string;
  allowedRoles?: string[];
}

export interface MenuGroupConfig {
  key: string;
  label: string;
  iconName: string;
  section: 'common' | 'sales' | 'services';
  allowedPackages: ErpPackageId[];
  children: SubMenuItemConfig[];
}

export const SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = [
  // ==========================================
  // 1. BUSINESS OVERVIEW (COMMON)
  // ==========================================
  {
    key: 'grp-business-overview',
    label: 'Business Overview',
    iconName: 'LayoutDashboard',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'bo-dashboard', label: 'Dashboard Overview', path: '/app/dashboard', iconName: 'LayoutDashboard' },
      { key: 'bo-notifications', label: 'Notifications', path: '/app/notifications', iconName: 'Bell' },
      { key: 'bo-calendar', label: 'Company Calendar', path: '/app/calendar', iconName: 'Calendar' },
    ],
  },

  // ==========================================
  // 2. CUSTOMER MANAGEMENT (COMMON)
  // ==========================================
  {
    key: 'grp-customer-mgmt',
    label: 'Customer Management',
    iconName: 'Users',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'cm-customers', label: 'Customers', path: '/app/customers', iconName: 'Users' },
      { key: 'cm-groups', label: 'Customer Groups', path: '/app/customers/groups', iconName: 'Users' },
      { key: 'cm-contacts', label: 'Customer Contacts', path: '/app/customers/contacts', iconName: 'UserCheck' },
      { key: 'cm-activities', label: 'Customer Activities', path: '/app/customers/activities', iconName: 'History' },
      { key: 'cm-followups', label: 'Customer Follow-ups', path: '/app/customers/follow-ups', iconName: 'Calendar' },
    ],
  },

  // ==========================================
  // 3. COMMUNICATION (COMMON)
  // ==========================================
  {
    key: 'grp-communication',
    label: 'Communication',
    iconName: 'MessageSquare',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'comm-messages', label: 'Messages', path: '/app/communication/messages', iconName: 'MessageSquare' },
      { key: 'comm-emails', label: 'Email History', path: '/app/communication/emails', iconName: 'FileText' },
      { key: 'comm-announcements', label: 'Announcements', path: '/app/communication/announcements', iconName: 'FileText' },
      { key: 'comm-tasks', label: 'Tasks & Reminders', path: '/app/communication/tasks', iconName: 'CheckSquare' },
    ],
  },

  // ==========================================
  // 4. DOCUMENT MANAGEMENT (COMMON)
  // ==========================================
  {
    key: 'grp-documents',
    label: 'Document Management',
    iconName: 'FileText',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'dm-docs', label: 'Documents', path: '/app/documents', iconName: 'FileText' },
      { key: 'dm-templates', label: 'Document Templates', path: '/app/documents/templates', iconName: 'FileSpreadsheet' },
      { key: 'dm-attachments', label: 'Attachments', path: '/app/documents/attachments', iconName: 'FileText' },
      { key: 'dm-history', label: 'Document History', path: '/app/documents/history', iconName: 'History' },
    ],
  },

  // ==========================================
  // 5. SALES MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-sales-mgmt',
    label: 'Sales Management',
    iconName: 'TrendingUp',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'sm-overview', label: 'Sales Overview', path: '/app/sales/dashboard', iconName: 'TrendingUp' },
      { key: 'sm-targets', label: 'Sales Targets', path: '/app/sales/targets', iconName: 'Target' },
      { key: 'sm-performance', label: 'Sales Performance', path: '/app/sales/performance', iconName: 'BarChart3' },
      { key: 'sm-team', label: 'Sales Team', path: '/app/sales/team', iconName: 'Briefcase' },
      { key: 'sm-commissions', label: 'Sales Commissions', path: '/app/sales/commissions', iconName: 'CreditCard' },
      { key: 'sm-activities', label: 'Sales Activities', path: '/app/sales/activities', iconName: 'History' },
    ],
  },

  // ==========================================
  // 6. CRM MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-crm-mgmt',
    label: 'CRM Management',
    iconName: 'Target',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'crm-pipeline', label: 'CRM Pipeline', path: '/app/sales/crm', iconName: 'TrendingUp' },
      { key: 'crm-leads', label: 'Leads', path: '/app/sales/leads', iconName: 'Users' },
      { key: 'crm-sources', label: 'Lead Sources', path: '/app/sales/lead-sources', iconName: 'FileText' },
      { key: 'crm-assignments', label: 'Lead Assignments', path: '/app/sales/lead-assignments', iconName: 'UserCheck' },
      { key: 'crm-followups', label: 'Lead Follow-ups', path: '/app/sales/lead-follow-ups', iconName: 'Calendar' },
      { key: 'crm-conversion', label: 'Lead Conversion', path: '/app/sales/lead-conversion', iconName: 'CheckCircle' },
    ],
  },

  // ==========================================
  // 7. ENQUIRY MANAGEMENT (ALL ERP EDITIONS)
  // ==========================================
  {
    key: 'grp-enquiry-mgmt',
    label: 'Enquiry Management',
    iconName: 'HelpCircle',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'enq-list', label: 'Enquiries', path: '/app/sales/enquiries', iconName: 'HelpCircle' },
      { key: 'enq-assignments', label: 'Enquiry Assignments', path: '/app/sales/enquiry-assignments', iconName: 'UserCheck' },
      { key: 'enq-followups', label: 'Enquiry Follow-ups', path: '/app/sales/enquiry-follow-ups', iconName: 'Calendar' },
      { key: 'enq-status', label: 'Enquiry Status', path: '/app/sales/enquiry-status', iconName: 'History' },
    ],
  },

  // ==========================================
  // 8. QUOTATION MANAGEMENT (ALL ERP EDITIONS)
  // ==========================================
  {
    key: 'grp-quotation-mgmt',
    label: 'Quotation Management',
    iconName: 'FileSpreadsheet',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'quot-list', label: 'Quotations', path: '/app/sales/quotations', iconName: 'FileSpreadsheet' },
      { key: 'quot-templates', label: 'Quotation Templates', path: '/app/sales/quotation-templates', iconName: 'FileText' },
      { key: 'quot-approvals', label: 'Quotation Approvals', path: '/app/sales/quotation-approvals', iconName: 'FileCheck' },
      { key: 'quot-history', label: 'Quotation History', path: '/app/sales/quotation-history', iconName: 'History' },
    ],
  },

  // ==========================================
  // 9. ORDER MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-order-mgmt',
    label: 'Order Management',
    iconName: 'ShoppingBag',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'ord-sales-orders', label: 'Sales Orders', path: '/app/sales/orders', iconName: 'ShoppingBag' },
      { key: 'ord-approvals', label: 'Order Approvals', path: '/app/sales/order-approvals', iconName: 'FileCheck' },
      { key: 'ord-tracking', label: 'Order Tracking', path: '/app/sales/order-tracking', iconName: 'Truck' },
      { key: 'ord-delivery', label: 'Delivery Management', path: '/app/sales/delivery-management', iconName: 'Truck' },
      { key: 'ord-returns', label: 'Sales Returns', path: '/app/sales/returns', iconName: 'Undo2' },
    ],
  },

  // ==========================================
  // 10. SERVICE MANAGEMENT (SERVICE & COMPLETE)
  // ==========================================
  {
    key: 'grp-service-mgmt',
    label: 'Service Management',
    iconName: 'Wrench',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'sm-service-overview', label: 'Service Overview', path: '/app/services/dashboard', iconName: 'Wrench' },
      { key: 'sm-requests', label: 'Service Requests', path: '/app/services/requests', iconName: 'FileText' },
      { key: 'sm-tickets', label: 'Service Tickets', path: '/app/services/tickets', iconName: 'Ticket' },
      { key: 'sm-categories', label: 'Ticket Categories', path: '/app/services/ticket-categories', iconName: 'Boxes' },
      { key: 'sm-assignments', label: 'Ticket Assignments', path: '/app/services/ticket-assignments', iconName: 'UserCheck' },
      { key: 'sm-priorities', label: 'Ticket Priorities', path: '/app/services/ticket-priorities', iconName: 'ShieldAlert' },
      { key: 'sm-status', label: 'Ticket Status', path: '/app/services/ticket-status', iconName: 'History' },
      { key: 'sm-enquiries', label: 'Service Enquiries', path: '/app/services/enquiries', iconName: 'HelpCircle' },
      { key: 'sm-quotations', label: 'Service Quotations', path: '/app/services/quotations', iconName: 'FileSpreadsheet' },
      { key: 'sm-orders', label: 'Service Orders', path: '/app/services/orders', iconName: 'ShoppingBag' },
      { key: 'sm-work-orders', label: 'Work Order Management', path: '/app/services/jobs', iconName: 'Briefcase' },
      { key: 'sm-scheduling', label: 'Service Scheduling', path: '/app/services/scheduling', iconName: 'Calendar' },
      { key: 'sm-technicians', label: 'Technician Management', path: '/app/services/technicians', iconName: 'HardHat' },
      { key: 'sm-tech-assignments', label: 'Technician Assignments', path: '/app/services/technician-assignments', iconName: 'UserCheck' },
      { key: 'sm-visits', label: 'Service Visits', path: '/app/services/visit-management', iconName: 'MapPin' },
      { key: 'sm-reports', label: 'Service Reports', path: '/app/services/field-reports', iconName: 'FileText' },
      { key: 'sm-parts-used', label: 'Parts & Materials Used', path: '/app/services/parts-consumption', iconName: 'Cpu' },
      { key: 'sm-warranty', label: 'Warranty Management', path: '/app/services/warranty', iconName: 'ShieldAlert' },
      { key: 'sm-amc', label: 'AMC Management', path: '/app/services/amc', iconName: 'FileCheck' },
      { key: 'sm-contracts', label: 'Service Contracts', path: '/app/services/service-contracts', iconName: 'FileText' },
      { key: 'sm-sla', label: 'SLA Management', path: '/app/services/sla-management', iconName: 'ShieldAlert' },
      { key: 'sm-feedback', label: 'Customer Feedback', path: '/app/services/feedback', iconName: 'ThumbsUp' },
      { key: 'sm-history', label: 'Service History', path: '/app/services/history', iconName: 'History' },
    ],
  },

  // ==========================================
  // 11. PRODUCT MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-product-mgmt',
    label: 'Product Management',
    iconName: 'Package',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'prod-list', label: 'Products', path: '/app/sales/products', iconName: 'Package' },
      { key: 'prod-categories', label: 'Product Categories', path: '/app/sales/product-categories', iconName: 'Boxes' },
      { key: 'prod-brands', label: 'Brands', path: '/app/sales/brands', iconName: 'Tag' },
      { key: 'prod-uom', label: 'Units of Measurement', path: '/app/sales/uom', iconName: 'SlidersHorizontal' },
      { key: 'prod-price-lists', label: 'Price Lists', path: '/app/sales/price-lists', iconName: 'CreditCard' },
      { key: 'prod-discounts', label: 'Discounts & Offers', path: '/app/sales/discounts', iconName: 'CreditCard' },
    ],
  },

  // ==========================================
  // 12. INVENTORY MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-inventory-mgmt',
    label: 'Inventory Management',
    iconName: 'Boxes',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'inv-overview', label: 'Inventory Overview', path: '/app/sales/inventory', iconName: 'Boxes' },
      { key: 'inv-stock', label: 'Stock Management', path: '/app/sales/stock-management', iconName: 'Boxes' },
      { key: 'inv-transfers', label: 'Stock Transfers', path: '/app/sales/stock-transfers', iconName: 'Truck' },
      { key: 'inv-adjustments', label: 'Stock Adjustments', path: '/app/sales/stock-adjustments', iconName: 'SlidersHorizontal' },
      { key: 'inv-warehouses', label: 'Warehouse Management', path: '/app/sales/warehouses', iconName: 'Building' },
      { key: 'inv-low-stock', label: 'Low Stock Alerts', path: '/app/sales/low-stock-alerts', iconName: 'ShieldAlert' },
      { key: 'inv-history', label: 'Stock History', path: '/app/sales/stock-history', iconName: 'History' },
    ],
  },

  // ==========================================
  // 13. PURCHASE MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-purchase-mgmt',
    label: 'Purchase Management',
    iconName: 'ShoppingCart',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'pur-list', label: 'Purchases', path: '/app/sales/purchases', iconName: 'ShoppingCart' },
      { key: 'pur-orders', label: 'Purchase Orders', path: '/app/sales/purchase-orders', iconName: 'ShoppingBag' },
      { key: 'pur-grn', label: 'Goods Received Notes (GRN)', path: '/app/sales/grn', iconName: 'FileCheck' },
      { key: 'pur-suppliers', label: 'Suppliers', path: '/app/sales/suppliers', iconName: 'Users' },
      { key: 'pur-payments', label: 'Supplier Payments', path: '/app/sales/supplier-payments', iconName: 'CreditCard' },
      { key: 'pur-returns', label: 'Purchase Returns', path: '/app/sales/purchase-returns', iconName: 'Undo2' },
    ],
  },

  // ==========================================
  // 14. FINANCE & ACCOUNTS (ALL ERP EDITIONS)
  // ==========================================
  {
    key: 'grp-finance-accounts',
    label: 'Finance & Accounts',
    iconName: 'Receipt',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'fin-dashboard', label: 'Finance Dashboard', path: '/app/billing', iconName: 'BarChart3' },
      { key: 'fin-all-invoices', label: 'All Invoices', path: '/app/finance/invoices', iconName: 'Receipt' },
      { key: 'fin-sales-invoices', label: 'Sales Invoices', path: '/app/sales/invoices', iconName: 'FileText' },
      { key: 'fin-service-invoices', label: 'Service Invoices', path: '/app/services/service-invoices', iconName: 'Receipt' },
      { key: 'fin-proforma', label: 'Proforma Invoices', path: '/app/finance/proforma-invoices', iconName: 'FileText' },
      { key: 'fin-recurring', label: 'Recurring Invoices', path: '/app/finance/recurring-invoices', iconName: 'History' },
      { key: 'fin-templates', label: 'Invoice Templates', path: '/app/finance/invoice-templates', iconName: 'FileSpreadsheet' },
      { key: 'fin-credit-notes', label: 'Credit Notes', path: '/app/finance/credit-notes', iconName: 'CreditCard' },
      { key: 'fin-debit-notes', label: 'Debit Notes', path: '/app/finance/debit-notes', iconName: 'CreditCard' },
      { key: 'fin-payments', label: 'Receive Payments', path: '/app/payments', iconName: 'CreditCard' },
      { key: 'fin-pay-history', label: 'Payment History', path: '/app/finance/payment-history', iconName: 'History' },
      { key: 'fin-refunds', label: 'Refund Management', path: '/app/finance/refunds', iconName: 'Undo2' },
      { key: 'fin-reconciliation', label: 'Payment Reconciliation', path: '/app/finance/reconciliation', iconName: 'FileCheck' },
      { key: 'fin-receivables', label: 'Accounts Receivable', path: '/app/finance/receivables', iconName: 'TrendingUp' },
      { key: 'fin-payables', label: 'Accounts Payable', path: '/app/finance/payables', iconName: 'CreditCard' },
      { key: 'fin-expenses', label: 'Expenses', path: '/app/finance/expenses', iconName: 'Receipt' },
      { key: 'fin-tax', label: 'Tax & GST Management', path: '/app/finance/tax', iconName: 'Receipt' },
      { key: 'fin-bank', label: 'Bank & Cash Management', path: '/app/finance/bank-cash', iconName: 'CreditCard' },
      { key: 'fin-pnl', label: 'Profit & Loss', path: '/app/finance/profit-loss', iconName: 'BarChart3' },
    ],
  },

  // ==========================================
  // 15. APPROVAL MANAGEMENT (COMMON)
  // ==========================================
  {
    key: 'grp-approvals',
    label: 'Approval Management',
    iconName: 'FileCheck',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'appr-pending', label: 'Pending Approvals', path: '/app/approvals/pending', iconName: 'FileCheck' },
      { key: 'appr-workflows', label: 'Approval Workflows', path: '/app/approvals/workflows', iconName: 'SlidersHorizontal' },
      { key: 'appr-history', label: 'Approval History', path: '/app/approvals/history', iconName: 'History' },
    ],
  },

  // ==========================================
  // 16. REPORTS & ANALYTICS (COMMON)
  // ==========================================
  {
    key: 'grp-reports',
    label: 'Reports & Analytics',
    iconName: 'BarChart3',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'rep-overview', label: 'Reports Overview', path: '/app/reports', iconName: 'BarChart3' },
      { key: 'rep-sales', label: 'Sales Reports', path: '/app/reports/sales', iconName: 'TrendingUp' },
      { key: 'rep-service', label: 'Service Reports', path: '/app/reports/service', iconName: 'Wrench' },
      { key: 'rep-customer', label: 'Customer Reports', path: '/app/reports/customers', iconName: 'Users' },
      { key: 'rep-financial', label: 'Financial Reports', path: '/app/reports/financial', iconName: 'Receipt' },
      { key: 'rep-activity', label: 'Activity Reports', path: '/app/reports/activities', iconName: 'History' },
      { key: 'rep-custom', label: 'Custom Reports', path: '/app/reports/custom', iconName: 'SlidersHorizontal' },
    ],
  },

  // ==========================================
  // 17. ENTERPRISE PORTALS (COMMON)
  // ==========================================
  {
    key: 'grp-enterprise-portals',
    label: 'Enterprise Portals',
    iconName: 'Briefcase',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'portal-customer', label: 'Customer Self-Service', path: '/app/portal/customer', iconName: 'Users' },
      { key: 'portal-supplier', label: 'Supplier Collaboration', path: '/app/portal/supplier', iconName: 'Truck' },
      { key: 'portal-technician', label: 'Technician Mobile Workspace', path: '/app/portal/technician', iconName: 'HardHat' },
    ],
  },

  // ==========================================
  // 18. SETTINGS (COMMON)
  // ==========================================
  {
    key: 'grp-settings',
    label: 'Settings',
    iconName: 'SlidersHorizontal',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'set-company', label: 'Company Profile', path: '/app/settings', iconName: 'Briefcase' },
      { key: 'set-branches', label: 'Branch Management', path: '/app/settings/branches', iconName: 'MapPin' },
      { key: 'set-users', label: 'User Management', path: '/app/settings/users', iconName: 'UserCheck' },
      { key: 'set-roles', label: 'Roles & Permissions', path: '/app/settings/roles', iconName: 'ShieldAlert' },
      { key: 'set-modules', label: 'Module Access', path: '/app/settings/modules', iconName: 'Boxes' },
      { key: 'set-subs', label: 'Subscription & Plans', path: '/app/settings/subscription', iconName: 'CreditCard' },
      { key: 'set-tax', label: 'Tax Configuration', path: '/app/settings/tax', iconName: 'Receipt' },
      { key: 'set-notifications', label: 'Notification Settings', path: '/app/settings/notifications', iconName: 'MessageSquare' },
      { key: 'set-integrations', label: 'Integrations', path: '/app/settings/integrations', iconName: 'Cpu' },
      { key: 'set-import-export', label: 'Import / Export', path: '/app/settings/import-export', iconName: 'FileSpreadsheet' },
      { key: 'set-audit', label: 'Audit Logs', path: '/app/settings/audit-logs', iconName: 'History' },
      { key: 'set-system', label: 'System Settings', path: '/app/settings/system', iconName: 'SlidersHorizontal' },
    ],
  },
];

/**
 * Filter whole collapsible menu groups allowed for the current ERP package
 */
export function getMenuGroupsForPackage(packageType: ErpPackageId): MenuGroupConfig[] {
  return SIDEBAR_MENU_GROUPS.filter((group) => group.allowedPackages.includes(packageType));
}
