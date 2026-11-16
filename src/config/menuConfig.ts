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
  // 1. COMMON MODULES (ALL ERP TYPES)
  // ==========================================
  {
    key: 'grp-dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'dash-overview', label: 'Dashboard Overview', path: '/app/dashboard', iconName: 'LayoutDashboard' },
      { key: 'dash-notifications', label: 'Notifications', path: '/app/notifications', iconName: 'Bell' },
      { key: 'dash-calendar', label: 'Company Calendar', path: '/app/calendar', iconName: 'Calendar' },
    ],
  },
  {
    key: 'grp-customer-mgmt',
    label: 'Customer Management',
    iconName: 'Users',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'cust-list', label: 'Customers', path: '/app/customers', iconName: 'Users' },
      { key: 'cust-groups', label: 'Customer Groups', path: '/app/customers/groups', iconName: 'FolderTree' },
      { key: 'cust-contacts', label: 'Customer Contacts', path: '/app/customers/contacts', iconName: 'UserCheck' },
      { key: 'cust-activities', label: 'Customer Activities', path: '/app/customers/activities', iconName: 'Activity' },
      { key: 'cust-followups', label: 'Customer Follow-ups', path: '/app/customers/follow-ups', iconName: 'Clock' },
    ],
  },
  {
    key: 'grp-communication',
    label: 'Communication',
    iconName: 'MessageSquare',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'comm-messages', label: 'Messages', path: '/app/communication/messages', iconName: 'MessageSquare' },
      { key: 'comm-email-hist', label: 'Email History', path: '/app/communication/emails', iconName: 'Mail' },
      { key: 'comm-announcements', label: 'Announcements', path: '/app/communication/announcements', iconName: 'Megaphone' },
      { key: 'comm-tasks', label: 'Tasks & Reminders', path: '/app/communication/tasks', iconName: 'CheckSquare' },
    ],
  },
  {
    key: 'grp-documents',
    label: 'Document Management',
    iconName: 'FileText',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'doc-list', label: 'Documents', path: '/app/documents', iconName: 'FileText' },
      { key: 'doc-templates', label: 'Document Templates', path: '/app/documents/templates', iconName: 'FileSpreadsheet' },
      { key: 'doc-attachments', label: 'Attachments', path: '/app/documents/attachments', iconName: 'Paperclip' },
      { key: 'doc-history', label: 'Document History', path: '/app/documents/history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-finance-accounting',
    label: 'Finance & Accounting',
    iconName: 'Receipt',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'fin-billing', label: 'Billing Overview', path: '/app/billing', iconName: 'Receipt' },
      { key: 'fin-payments', label: 'Payments', path: '/app/payments', iconName: 'CreditCard' },
      { key: 'fin-pay-methods', label: 'Payment Methods', path: '/app/finance/payment-methods', iconName: 'Wallet' },
      { key: 'fin-expenses', label: 'Expenses', path: '/app/finance/expenses', iconName: 'TrendingDown' },
      { key: 'fin-tax', label: 'Tax Management', path: '/app/finance/tax', iconName: 'Percent' },
      { key: 'fin-receivables', label: 'Receivables', path: '/app/finance/receivables', iconName: 'ArrowDownLeft' },
      { key: 'fin-payables', label: 'Payables', path: '/app/finance/payables', iconName: 'ArrowUpRight' },
      { key: 'fin-transactions', label: 'Financial Transactions', path: '/app/finance/transactions', iconName: 'DollarSign' },
    ],
  },
  {
    key: 'grp-approvals',
    label: 'Approval Management',
    iconName: 'ShieldCheck',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'appr-pending', label: 'Pending Approvals', path: '/app/approvals/pending', iconName: 'Clock' },
      { key: 'appr-workflows', label: 'Approval Workflows', path: '/app/approvals/workflows', iconName: 'GitBranch' },
      { key: 'appr-history', label: 'Approval History', path: '/app/approvals/history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-reports',
    label: 'Reports & Analytics',
    iconName: 'BarChart3',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'rep-overview', label: 'Reports Overview', path: '/app/reports', iconName: 'BarChart3' },
      { key: 'rep-customer', label: 'Customer Reports', path: '/app/reports/customers', iconName: 'Users' },
      { key: 'rep-financial', label: 'Financial Reports', path: '/app/reports/financial', iconName: 'DollarSign' },
      { key: 'rep-activity', label: 'Activity Reports', path: '/app/reports/activities', iconName: 'Activity' },
      { key: 'rep-custom', label: 'Custom Reports', path: '/app/reports/custom', iconName: 'Sliders' },
    ],
  },
  {
    key: 'grp-settings',
    label: 'Settings',
    iconName: 'Settings',
    section: 'common',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: [
      { key: 'set-company', label: 'Company Profile', path: '/app/settings', iconName: 'Building' },
      { key: 'set-branches', label: 'Branch Management', path: '/app/settings/branches', iconName: 'Network' },
      { key: 'set-users', label: 'User Management', path: '/app/settings/users', iconName: 'UserCheck' },
      { key: 'set-roles', label: 'Roles & Permissions', path: '/app/settings/roles', iconName: 'Shield' },
      { key: 'set-modules', label: 'Module Access', path: '/app/settings/modules', iconName: 'Boxes' },
      { key: 'set-subs', label: 'Subscription & Plans', path: '/app/settings/subscription', iconName: 'CreditCard' },
      { key: 'set-tax', label: 'Tax Configuration', path: '/app/settings/tax', iconName: 'Percent' },
      { key: 'set-notifications', label: 'Notification Settings', path: '/app/settings/notifications', iconName: 'Bell' },
      { key: 'set-integrations', label: 'Integrations', path: '/app/settings/integrations', iconName: 'Cpu' },
      { key: 'set-import-export', label: 'Import / Export', path: '/app/settings/import-export', iconName: 'ArrowUpDown' },
      { key: 'set-audit', label: 'Audit Logs', path: '/app/settings/audit-logs', iconName: 'Activity' },
      { key: 'set-system', label: 'System Settings', path: '/app/settings/system', iconName: 'Sliders' },
    ],
  },

  // ==========================================
  // 2. SALES ERP MODULES
  // ==========================================
  {
    key: 'grp-sales-mgmt',
    label: 'Sales Management',
    iconName: 'TrendingUp',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'sales-overview', label: 'Sales Overview', path: '/app/sales/dashboard', iconName: 'TrendingUp' },
      { key: 'sales-targets', label: 'Sales Targets', path: '/app/sales/targets', iconName: 'Target' },
      { key: 'sales-perf', label: 'Sales Performance', path: '/app/sales/performance', iconName: 'Award' },
      { key: 'sales-team-list', label: 'Sales Team', path: '/app/sales/team', iconName: 'Briefcase' },
      { key: 'sales-commissions', label: 'Sales Commissions', path: '/app/sales/commissions', iconName: 'DollarSign' },
      { key: 'sales-activities', label: 'Sales Activities', path: '/app/sales/activities', iconName: 'Activity' },
    ],
  },
  {
    key: 'grp-sales-crm',
    label: 'CRM Management',
    iconName: 'Target',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'crm-pipe', label: 'CRM Pipeline', path: '/app/sales/crm', iconName: 'Target' },
      { key: 'crm-leads', label: 'Leads', path: '/app/sales/leads', iconName: 'UserCheck' },
      { key: 'crm-sources', label: 'Lead Sources', path: '/app/sales/lead-sources', iconName: 'FolderTree' },
      { key: 'crm-assign', label: 'Lead Assignments', path: '/app/sales/lead-assignments', iconName: 'UserPlus' },
      { key: 'crm-follow', label: 'Lead Follow-ups', path: '/app/sales/lead-follow-ups', iconName: 'Clock' },
      { key: 'crm-conversion', label: 'Lead Conversion', path: '/app/sales/lead-conversion', iconName: 'ArrowRightCircle' },
    ],
  },
  {
    key: 'grp-enquiry-mgmt',
    label: 'Enquiry Management',
    iconName: 'HelpCircle',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'enq-list', label: 'Enquiries', path: '/app/sales/enquiries', iconName: 'HelpCircle' },
      { key: 'enq-assign', label: 'Enquiry Assignments', path: '/app/sales/enquiry-assignments', iconName: 'UserCheck' },
      { key: 'enq-follow', label: 'Enquiry Follow-ups', path: '/app/sales/enquiry-follow-ups', iconName: 'Clock' },
      { key: 'enq-status', label: 'Enquiry Status', path: '/app/sales/enquiry-status', iconName: 'Activity' },
    ],
  },
  {
    key: 'grp-quotation-mgmt',
    label: 'Quotation Management',
    iconName: 'FileSpreadsheet',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'quot-list', label: 'Quotations', path: '/app/sales/quotations', iconName: 'FileSpreadsheet' },
      { key: 'quot-templates', label: 'Quotation Templates', path: '/app/sales/quotation-templates', iconName: 'FileText' },
      { key: 'quot-approvals', label: 'Quotation Approvals', path: '/app/sales/quotation-approvals', iconName: 'CheckCircle' },
      { key: 'quot-history', label: 'Quotation History', path: '/app/sales/quotation-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-order-mgmt',
    label: 'Order Management',
    iconName: 'ShoppingBag',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'ord-orders', label: 'Sales Orders', path: '/app/sales/orders', iconName: 'ShoppingBag' },
      { key: 'ord-approvals', label: 'Order Approvals', path: '/app/sales/order-approvals', iconName: 'CheckSquare' },
      { key: 'ord-tracking', label: 'Order Tracking', path: '/app/sales/order-tracking', iconName: 'Navigation' },
      { key: 'ord-delivery', label: 'Delivery Management', path: '/app/sales/delivery-management', iconName: 'Truck' },
      { key: 'ord-returns', label: 'Sales Returns', path: '/app/sales/returns', iconName: 'Undo2' },
    ],
  },
  {
    key: 'grp-product-mgmt',
    label: 'Product Management',
    iconName: 'Package',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'prod-list', label: 'Products', path: '/app/sales/products', iconName: 'Package' },
      { key: 'prod-categories', label: 'Product Categories', path: '/app/sales/product-categories', iconName: 'Folder' },
      { key: 'prod-brands', label: 'Brands', path: '/app/sales/brands', iconName: 'Award' },
      { key: 'prod-uom', label: 'Units of Measurement', path: '/app/sales/uom', iconName: 'Scale' },
      { key: 'prod-pricelists', label: 'Price Lists', path: '/app/sales/price-lists', iconName: 'DollarSign' },
      { key: 'prod-discounts', label: 'Discounts & Offers', path: '/app/sales/discounts', iconName: 'Percent' },
    ],
  },
  {
    key: 'grp-inventory-mgmt',
    label: 'Inventory Management',
    iconName: 'Boxes',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'inv-overview', label: 'Inventory Overview', path: '/app/sales/inventory', iconName: 'Boxes' },
      { key: 'inv-stock-mgmt', label: 'Stock Management', path: '/app/sales/stock-management', iconName: 'Layers' },
      { key: 'inv-transfers', label: 'Stock Transfers', path: '/app/sales/stock-transfers', iconName: 'ArrowRightLeft' },
      { key: 'inv-adjustments', label: 'Stock Adjustments', path: '/app/sales/stock-adjustments', iconName: 'Sliders' },
      { key: 'inv-warehouses', label: 'Warehouse Management', path: '/app/sales/warehouses', iconName: 'Building' },
      { key: 'inv-lowstock', label: 'Low Stock Alerts', path: '/app/sales/low-stock-alerts', iconName: 'AlertTriangle' },
      { key: 'inv-history', label: 'Stock History', path: '/app/sales/stock-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-purchase-mgmt',
    label: 'Purchase Management',
    iconName: 'ShoppingCart',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'pur-purchases', label: 'Purchases', path: '/app/sales/purchases', iconName: 'ShoppingCart' },
      { key: 'pur-orders', label: 'Purchase Orders', path: '/app/sales/purchase-orders', iconName: 'FileText' },
      { key: 'pur-grn', label: 'Goods Received Notes (GRN)', path: '/app/sales/grn', iconName: 'CheckCircle' },
      { key: 'pur-suppliers', label: 'Suppliers', path: '/app/sales/suppliers', iconName: 'Truck' },
      { key: 'pur-supplier-payments', label: 'Supplier Payments', path: '/app/sales/supplier-payments', iconName: 'CreditCard' },
      { key: 'pur-returns', label: 'Purchase Returns', path: '/app/sales/purchase-returns', iconName: 'Undo2' },
    ],
  },
  {
    key: 'grp-sales-finance',
    label: 'Sales Finance',
    iconName: 'DollarSign',
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES'],
    children: [
      { key: 'sf-invoices', label: 'Invoices', path: '/app/sales/invoices', iconName: 'Receipt' },
      { key: 'sf-credit-notes', label: 'Credit Notes', path: '/app/sales/credit-notes', iconName: 'FileMinus' },
      { key: 'sf-debit-notes', label: 'Debit Notes', path: '/app/sales/debit-notes', iconName: 'FilePlus' },
      { key: 'sf-payments', label: 'Payments', path: '/app/sales/finance-payments', iconName: 'CreditCard' },
      { key: 'sf-receivables', label: 'Outstanding Receivables', path: '/app/sales/outstanding-receivables', iconName: 'Clock' },
      { key: 'sf-reports', label: 'Sales Financial Reports', path: '/app/sales/financial-reports', iconName: 'BarChart' },
    ],
  },

  // ==========================================
  // 3. SERVICE ERP MODULES
  // ==========================================
  {
    key: 'grp-service-mgmt',
    label: 'Service Management',
    iconName: 'LifeBuoy',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'srv-overview', label: 'Services Overview', path: '/app/services/dashboard', iconName: 'LifeBuoy' },
      { key: 'srv-categories', label: 'Service Categories', path: '/app/services/categories', iconName: 'FolderTree' },
      { key: 'srv-types', label: 'Service Types', path: '/app/services/types', iconName: 'Layers' },
      { key: 'srv-pricing', label: 'Service Pricing', path: '/app/services/pricing', iconName: 'DollarSign' },
      { key: 'srv-performance', label: 'Service Performance', path: '/app/services/performance', iconName: 'Award' },
    ],
  },
  {
    key: 'grp-srv-request-mgmt',
    label: 'Service Request Management',
    iconName: 'Inbox',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'sr-requests', label: 'Service Requests', path: '/app/services/requests', iconName: 'Inbox' },
      { key: 'sr-assign', label: 'Request Assignments', path: '/app/services/request-assignments', iconName: 'UserCheck' },
      { key: 'sr-approvals', label: 'Request Approvals', path: '/app/services/request-approvals', iconName: 'CheckCircle' },
      { key: 'sr-tracking', label: 'Request Tracking', path: '/app/services/request-tracking', iconName: 'Navigation' },
      { key: 'sr-history', label: 'Request History', path: '/app/services/request-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-srv-ticket-mgmt',
    label: 'Service Ticket Management',
    iconName: 'Ticket',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'st-tickets', label: 'Service Tickets', path: '/app/services/tickets', iconName: 'Ticket' },
      { key: 'st-priorities', label: 'Ticket Priorities', path: '/app/services/ticket-priorities', iconName: 'AlertCircle' },
      { key: 'st-escalations', label: 'Ticket Escalations', path: '/app/services/ticket-escalations', iconName: 'TrendingUp' },
      { key: 'st-sla', label: 'SLA Management', path: '/app/services/sla-management', iconName: 'Clock' },
      { key: 'st-history', label: 'Ticket History', path: '/app/services/ticket-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-job-mgmt',
    label: 'Job Management',
    iconName: 'Wrench',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'job-mgmt-list', label: 'Job Management', path: '/app/services/jobs', iconName: 'Wrench' },
      { key: 'job-work-orders', label: 'Work Orders', path: '/app/services/work-orders', iconName: 'FileText' },
      { key: 'job-assignments', label: 'Job Assignments', path: '/app/services/job-assignments', iconName: 'UserCheck' },
      { key: 'job-status', label: 'Job Status', path: '/app/services/job-status', iconName: 'Activity' },
      { key: 'job-completion', label: 'Job Completion', path: '/app/services/job-completion', iconName: 'CheckCircle' },
      { key: 'job-history', label: 'Job History', path: '/app/services/job-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-scheduling-dispatch',
    label: 'Scheduling & Dispatch',
    iconName: 'Calendar',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'sch-scheduling', label: 'Scheduling', path: '/app/services/scheduling', iconName: 'Calendar' },
      { key: 'sch-tech-avail', label: 'Technician Availability', path: '/app/services/technician-availability', iconName: 'UserCheck' },
      { key: 'sch-calendar', label: 'Service Calendar', path: '/app/services/service-calendar', iconName: 'Calendar' },
      { key: 'sch-routes', label: 'Route Planning', path: '/app/services/route-planning', iconName: 'Map' },
      { key: 'sch-dispatch', label: 'Dispatch Management', path: '/app/services/dispatch-management', iconName: 'Send' },
    ],
  },
  {
    key: 'grp-technician-mgmt',
    label: 'Technician Management',
    iconName: 'HardHat',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'tech-list', label: 'Technicians', path: '/app/services/technicians', iconName: 'HardHat' },
      { key: 'tech-teams', label: 'Technician Teams', path: '/app/services/technician-teams', iconName: 'Users' },
      { key: 'tech-skills', label: 'Technician Skills', path: '/app/services/technician-skills', iconName: 'Award' },
      { key: 'tech-attendance', label: 'Attendance', path: '/app/services/technician-attendance', iconName: 'CheckSquare' },
      { key: 'tech-workload', label: 'Workload', path: '/app/services/technician-workload', iconName: 'BarChart' },
      { key: 'tech-perf', label: 'Performance', path: '/app/services/technician-performance', iconName: 'TrendingUp' },
    ],
  },
  {
    key: 'grp-field-service',
    label: 'Field Service',
    iconName: 'MapPin',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'fs-service', label: 'Field Service', path: '/app/services/field-service', iconName: 'MapPin' },
      { key: 'fs-visits', label: 'Visit Management', path: '/app/services/visit-management', iconName: 'Navigation' },
      { key: 'fs-locations', label: 'Service Locations', path: '/app/services/service-locations', iconName: 'Map' },
      { key: 'fs-checkin', label: 'Check-in / Check-out', path: '/app/services/checkin-checkout', iconName: 'Clock' },
      { key: 'fs-checklist', label: 'Service Checklist', path: '/app/services/service-checklist', iconName: 'CheckSquare' },
      { key: 'fs-reports', label: 'Service Reports', path: '/app/services/field-reports', iconName: 'FileText' },
    ],
  },
  {
    key: 'grp-contract-mgmt',
    label: 'Contract Management',
    iconName: 'FileCheck',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'cnt-amc', label: 'AMC Contracts', path: '/app/services/amc', iconName: 'FileCheck' },
      { key: 'cnt-service', label: 'Service Contracts', path: '/app/services/service-contracts', iconName: 'FileText' },
      { key: 'cnt-renewals', label: 'Contract Renewals', path: '/app/services/contract-renewals', iconName: 'RefreshCw' },
      { key: 'cnt-expiry', label: 'Contract Expiry Alerts', path: '/app/services/contract-expiry-alerts', iconName: 'AlertTriangle' },
      { key: 'cnt-history', label: 'Contract History', path: '/app/services/contract-history', iconName: 'History' },
    ],
  },
  {
    key: 'grp-warranty-mgmt',
    label: 'Warranty Management',
    iconName: 'ShieldAlert',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'war-registration', label: 'Warranty Registration', path: '/app/services/warranty-registration', iconName: 'Shield' },
      { key: 'war-claims', label: 'Warranty Claims', path: '/app/services/warranty', iconName: 'ShieldAlert' },
      { key: 'war-approvals', label: 'Warranty Approvals', path: '/app/services/warranty-approvals', iconName: 'CheckCircle' },
      { key: 'war-tracking', label: 'Warranty Tracking', path: '/app/services/warranty-tracking', iconName: 'Navigation' },
      { key: 'war-expiry', label: 'Warranty Expiry', path: '/app/services/warranty-expiry', iconName: 'Clock' },
    ],
  },
  {
    key: 'grp-spare-parts-mgmt',
    label: 'Spare Parts Management',
    iconName: 'Cpu',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'sp-parts', label: 'Spare Parts', path: '/app/services/spare-parts', iconName: 'Cpu' },
      { key: 'sp-inventory', label: 'Spare Parts Inventory', path: '/app/services/spare-parts-inventory', iconName: 'Boxes' },
      { key: 'sp-consumption', label: 'Parts Consumption', path: '/app/services/parts-consumption', iconName: 'TrendingDown' },
      { key: 'sp-requests', label: 'Parts Requests', path: '/app/services/parts-requests', iconName: 'Inbox' },
      { key: 'sp-returns', label: 'Parts Returns', path: '/app/services/parts-returns', iconName: 'Undo2' },
    ],
  },
  {
    key: 'grp-service-finance',
    label: 'Service Finance',
    iconName: 'FileText',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'svf-billing', label: 'Service Billing', path: '/app/services/billing', iconName: 'FileText' },
      { key: 'svf-invoices', label: 'Service Invoices', path: '/app/services/service-invoices', iconName: 'Receipt' },
      { key: 'svf-payments', label: 'Service Payments', path: '/app/services/service-payments', iconName: 'CreditCard' },
      { key: 'svf-expenses', label: 'Service Expenses', path: '/app/services/service-expenses', iconName: 'TrendingDown' },
      { key: 'svf-outstanding', label: 'Outstanding Service Payments', path: '/app/services/outstanding-service-payments', iconName: 'Clock' },
    ],
  },
  {
    key: 'grp-customer-exp',
    label: 'Customer Experience',
    iconName: 'ThumbsUp',
    section: 'services',
    allowedPackages: ['COMPLETE', 'SERVICE'],
    children: [
      { key: 'ce-feedback', label: 'Customer Feedback', path: '/app/services/feedback', iconName: 'ThumbsUp' },
      { key: 'ce-ratings', label: 'Customer Ratings', path: '/app/services/customer-ratings', iconName: 'Star' },
      { key: 'ce-complaints', label: 'Complaints', path: '/app/services/complaints', iconName: 'AlertCircle' },
      { key: 'ce-reports', label: 'Customer Satisfaction Reports', path: '/app/services/csat-reports', iconName: 'BarChart' },
    ],
  },
];

/**
 * Filter whole collapsible menu groups allowed for the current ERP package
 */
export function getMenuGroupsForPackage(packageType: ErpPackageId): MenuGroupConfig[] {
  return SIDEBAR_MENU_GROUPS.filter((group) => group.allowedPackages.includes(packageType));
}
