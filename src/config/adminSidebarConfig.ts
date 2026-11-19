import type { MenuGroupConfig } from './menuConfig';

/**
 * COMPLETE ADMIN SIDEBAR CONFIGURATION
 * Dedicated file containing the full Admin enterprise navigation structure.
 */
export const ADMIN_FULL_SIDEBAR_GROUPS: MenuGroupConfig[] = [
  // ==========================================
  // 01. BUSINESS OVERVIEW (COMMON)
  // ==========================================
  {
    key: 'grp-business-overview',
    label: 'Business Overview',
    iconName: 'LayoutDashboard',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'bo-dashboard', label: 'Dashboard', path: '/app/dashboard', iconName: 'LayoutDashboard' },
      { key: 'bo-notifications', label: 'Notifications', path: '/app/notifications', iconName: 'Bell' },
      { key: 'bo-calendar', label: 'Company Calendar', path: '/app/calendar', iconName: 'Calendar' },
    ],
  },

  // ==========================================
  // 02. CUSTOMER MANAGEMENT (COMMON)
  // ==========================================
  {
    key: 'grp-customer-mgmt',
    label: 'Customer Management',
    iconName: 'Users',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'cm-customers', label: 'Customers', path: '/app/customers', iconName: 'Users' },
      { key: 'cm-groups', label: 'Customer Groups', path: '/app/customers/groups', iconName: 'Boxes' },
      { key: 'cm-contacts', label: 'Customer Contacts', path: '/app/customers/contacts', iconName: 'UserCheck' },
    ],
  },

  // ==========================================
  // 03. COMMUNICATION (COMMON)
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
    ],
  },

  // ==========================================
  // 04. DOCUMENT MANAGEMENT (COMMON)
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
    ],
  },

  // ==========================================
  // 05. SALES MANAGEMENT (SALES & COMPLETE)
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
      { key: 'sm-team', label: 'Sales Team', path: '/app/sales/team', iconName: 'Briefcase' },
      { key: 'sm-commissions', label: 'Sales Commissions', path: '/app/sales/commissions', iconName: 'CreditCard' },
      { key: 'sm-activities', label: 'Sales Activities', path: '/app/sales/activities', iconName: 'History' },
    ],
  },

  // ==========================================
  // 06. CRM MANAGEMENT (SALES & COMPLETE)
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
      { key: 'crm-enquiries', label: 'Enquiries', path: '/app/sales/enquiries', iconName: 'HelpCircle' },
      { key: 'crm-quotations', label: 'Quotations', path: '/app/sales/quotations', iconName: 'FileSpreadsheet' },
      { key: 'crm-orders', label: 'Sales Orders', path: '/app/sales/orders', iconName: 'ShoppingBag' },
      { key: 'crm-delivery', label: 'Delivery Management', path: '/app/sales/delivery-management', iconName: 'Truck' },
      { key: 'crm-returns', label: 'Sales Returns', path: '/app/sales/returns', iconName: 'Undo2' },
    ],
  },

  // ==========================================
  // 07. SERVICE MANAGEMENT (SERVICE & COMPLETE)
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
      { key: 'sm-quotations', label: 'Service Quotations', path: '/app/services/quotations', iconName: 'FileSpreadsheet' },
      { key: 'sm-orders', label: 'Service Orders', path: '/app/services/orders', iconName: 'ShoppingBag' },
      { key: 'sm-work-orders', label: 'Work Order Management', path: '/app/services/jobs', iconName: 'Briefcase' },
      { key: 'sm-scheduling', label: 'Service Scheduling', path: '/app/services/scheduling', iconName: 'Calendar' },
      { key: 'sm-technicians', label: 'Technician Management', path: '/app/services/technicians', iconName: 'HardHat' },
      { key: 'sm-warranty', label: 'Warranty Management', path: '/app/services/warranty', iconName: 'ShieldAlert' },
      { key: 'sm-amc', label: 'AMC & Contracts', path: '/app/services/amc', iconName: 'FileCheck' },
      { key: 'sm-sla', label: 'SLA Management', path: '/app/services/sla-management', iconName: 'ShieldAlert' },
      { key: 'sm-feedback', label: 'Customer Feedback', path: '/app/services/feedback', iconName: 'ThumbsUp' },
    ],
  },

  // ==========================================
  // 08. PRODUCT MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-product-mgmt',
    label: 'Product Management',
    iconName: 'Package',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'prod-list', label: 'Products', path: '/app/sales/products', iconName: 'Package' },
      { key: 'prod-price-lists', label: 'Price Lists', path: '/app/sales/price-lists', iconName: 'CreditCard' },
      { key: 'prod-discounts', label: 'Discounts & Offers', path: '/app/sales/discounts', iconName: 'CreditCard' },
    ],
  },

  // ==========================================
  // 09. INVENTORY MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-inventory-mgmt',
    label: 'Inventory Management',
    iconName: 'Boxes',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'inv-overview', label: 'Inventory Overview', path: '/app/sales/inventory', iconName: 'Boxes' },
      { key: 'inv-stock', label: 'Stock Management', path: '/app/sales/stock-management', iconName: 'Boxes' },
      { key: 'inv-transfers', label: 'Stock Transfers', path: '/app/sales/stock-transfers', iconName: 'Truck' },
      { key: 'inv-warehouses', label: 'Warehouse Management', path: '/app/sales/warehouses', iconName: 'Building' },
    ],
  },

  // ==========================================
  // 10. PURCHASE MANAGEMENT (SALES & COMPLETE)
  // ==========================================
  {
    key: 'grp-purchase-mgmt',
    label: 'Purchase Management',
    iconName: 'ShoppingCart',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'pur-overview', label: 'Purchase Overview', path: '/app/sales/purchases', iconName: 'ShoppingCart' },
      { key: 'pur-requisitions', label: 'Purchase Requisitions', path: '/app/sales/purchase-requisitions', iconName: 'FileText' },
      { key: 'pur-suppliers', label: 'Supplier Management', path: '/app/sales/suppliers', iconName: 'Users' },
      { key: 'pur-orders', label: 'Purchase Orders', path: '/app/sales/purchase-orders', iconName: 'ShoppingBag' },
      { key: 'pur-grn', label: 'Goods Received Notes (GRN)', path: '/app/sales/grn', iconName: 'FileCheck' },
      { key: 'pur-returns', label: 'Purchase Returns', path: '/app/sales/purchase-returns', iconName: 'Undo2' },
    ],
  },

  // ==========================================
  // 11. FINANCE & ACCOUNTS (ALL ERP EDITIONS)
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
      { key: 'fin-receive-payments', label: 'Receive Payments', path: '/app/payments', iconName: 'CreditCard' },
      { key: 'fin-reconciliation', label: 'Payment Reconciliation', path: '/app/finance/reconciliation', iconName: 'FileCheck' },
      { key: 'fin-receivables', label: 'Accounts Receivable', path: '/app/finance/receivables', iconName: 'TrendingUp' },
      { key: 'fin-payables', label: 'Accounts Payable', path: '/app/finance/payables', iconName: 'CreditCard' },
      { key: 'fin-expenses', label: 'Expenses', path: '/app/finance/expenses', iconName: 'Receipt' },
      { key: 'fin-tax', label: 'Tax & GST Management', path: '/app/finance/tax', iconName: 'Receipt' },
      { key: 'fin-bank', label: 'Bank & Cash Management', path: '/app/finance/bank-cash', iconName: 'CreditCard' },
      { key: 'fin-reports', label: 'Financial Reports', path: '/app/finance/profit-loss', iconName: 'BarChart3' },
    ],
  },

  // ==========================================
  // 12. APPROVAL MANAGEMENT (COMMON)
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
  // 13. REPORTS & ANALYTICS (COMMON)
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
  // 14. ENTERPRISE PORTALS (COMMON)
  // ==========================================
  {
    key: 'grp-enterprise-portals',
    label: 'Enterprise Portals',
    iconName: 'Briefcase',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'portal-customer', label: 'Customer Self-Service Portal', path: '/app/portal/customer', iconName: 'Users' },
      { key: 'portal-supplier', label: 'Supplier Collaboration Portal', path: '/app/portal/supplier', iconName: 'Truck' },
      { key: 'portal-technician', label: 'Technician Mobile Workspace', path: '/app/portal/technician', iconName: 'HardHat' },
    ],
  },

  // ==========================================
  // 15. EMPLOYEE & HR MANAGEMENT (CONSOLIDATED 9 MAIN PAGES)
  // ==========================================
  {
    key: 'grp-hr-mgmt',
    label: 'Employee & HR Management',
    iconName: 'Users',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'hr-dash', label: 'HR Dashboard', path: '/app/hr/dashboard', iconName: 'BarChart3' },
      { key: 'hr-employees', label: 'Employee Management', path: '/app/hr/employees', iconName: 'Users' },
      { key: 'hr-attendance', label: 'Attendance Management', path: '/app/hr/attendance', iconName: 'Clock' },
      { key: 'hr-leave', label: 'Leave Management', path: '/app/hr/leave', iconName: 'Calendar' },
      { key: 'hr-payroll', label: 'Payroll Management', path: '/app/hr/payroll', iconName: 'CreditCard' },
      { key: 'hr-tasks', label: 'Task Management', path: '/app/hr/tasks', iconName: 'CheckSquare' },
      { key: 'hr-performance', label: 'Performance Management', path: '/app/hr/performance', iconName: 'Award' },
      { key: 'hr-expenses', label: 'Expense & Reimbursement', path: '/app/hr/expenses', iconName: 'Receipt' },
      { key: 'hr-exit', label: 'Employee Exit Management', path: '/app/hr/exit', iconName: 'History' },
    ],
  },

  // ==========================================
  // 16. SETTINGS (COMMON)
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
