import type { MenuGroupConfig } from './menuConfig';

/**
 * PURE DEDICATED SERVICE ERP SIDEBAR CONFIGURATION
 * Contains ONLY Service modules and general utilities (Dashboard, Calendar, Settings).
 * Completely free of Sales / Trading modules.
 */
export const SERVICE_SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = [
  // 1. Dashboard
  {
    key: 'service-dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    path: '/app/services/dashboard',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 2. Company Calendar
  {
    key: 'service-calendar',
    label: 'Company Calendar',
    iconName: 'Calendar',
    path: '/app/calendar',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 3. Service Requests & Intake Queue
  {
    key: 'service-requests-mgmt',
    label: 'Service Requests',
    iconName: 'FileText',
    path: '/app/services/requests',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'sr-intake', label: 'Customer Requests Queue', path: '/app/services/requests', iconName: 'FileText' },
      { key: 'sr-enquiries', label: 'Service Enquiries', path: '/app/services/enquiries', iconName: 'HelpCircle' },
    ],
  },

  // 4. Service Tickets
  {
    key: 'service-tickets-mgmt',
    label: 'Service Tickets',
    iconName: 'LifeBuoy',
    path: '/app/services/tickets',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'st-all', label: 'All Service Tickets', path: '/app/services/tickets', iconName: 'LifeBuoy' },
      { key: 'st-categories', label: 'Ticket Categories', path: '/app/services/ticket-categories', iconName: 'Layers' },
      { key: 'st-assignments', label: 'Ticket Assignments', path: '/app/services/ticket-assignments', iconName: 'UserCheck' },
      { key: 'st-status', label: 'Ticket Status & Pipeline', path: '/app/services/ticket-status', iconName: 'Clock' },
    ],
  },

  // 5. Service Quotations
  {
    key: 'service-quotations-mgmt',
    label: 'Service Quotations',
    iconName: 'FileSpreadsheet',
    path: '/app/services/quotations',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 6. Service Orders
  {
    key: 'service-orders-mgmt',
    label: 'Service Orders',
    iconName: 'ShoppingBag',
    path: '/app/services/orders',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 7. Work Orders & Field Jobs
  {
    key: 'service-jobs-mgmt',
    label: 'Work Order Management',
    iconName: 'Briefcase',
    path: '/app/services/jobs',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'sj-jobs', label: 'Field Service Jobs', path: '/app/services/jobs', iconName: 'Briefcase' },
      { key: 'sj-visits', label: 'Service Visits & Dispatch', path: '/app/services/visit-management', iconName: 'MapPin' },
      { key: 'sj-job-cards', label: 'Electronic Job Cards', path: '/app/services/job-cards', iconName: 'FileCheck' },
    ],
  },

  // 8. Service Scheduling & Calendar Dispatch
  {
    key: 'service-scheduling-mgmt',
    label: 'Service Scheduling',
    iconName: 'Calendar',
    path: '/app/services/scheduling',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 9. Technician Management
  {
    key: 'service-technicians-mgmt',
    label: 'Technician Management',
    iconName: 'HardHat',
    path: '/app/services/technicians',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'st-techs', label: 'Technician Roster & Skills', path: '/app/services/technicians', iconName: 'HardHat' },
      { key: 'st-assign', label: 'Technician Allocation', path: '/app/services/technician-assignments', iconName: 'UserCheck' },
    ],
  },

  // 10. Warranty Management
  {
    key: 'service-warranty-mgmt',
    label: 'Warranty Management',
    iconName: 'ShieldAlert',
    path: '/app/services/warranty',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 11. AMC & Service Contracts
  {
    key: 'service-amc-mgmt',
    label: 'AMC & Contracts',
    iconName: 'FileCheck',
    path: '/app/services/amc',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'amc-contracts', label: 'Active AMC Contracts', path: '/app/services/amc', iconName: 'FileCheck' },
      { key: 'amc-preventive', label: 'Preventive Maintenance', path: '/app/services/preventive-maintenance', iconName: 'Wrench' },
    ],
  },

  // 12. Spares & Materials Used
  {
    key: 'service-spares-mgmt',
    label: 'Spares & Parts Management',
    iconName: 'Cpu',
    path: '/app/services/spare-parts',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'sp-inventory', label: 'Spare Parts Inventory', path: '/app/services/spare-parts', iconName: 'Cpu' },
      { key: 'sp-consumption', label: 'Parts Consumption Log', path: '/app/services/parts-consumption', iconName: 'Layers' },
    ],
  },

  // 13. Service Invoices & Billing
  {
    key: 'service-billing-mgmt',
    label: 'Service Invoicing & Billing',
    iconName: 'Receipt',
    path: '/app/services/billing',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'sb-invoices', label: 'Service Invoices', path: '/app/services/billing', iconName: 'Receipt' },
      { key: 'sb-payments', label: 'Service Payment Receipts', path: '/app/services/service-invoices', iconName: 'CreditCard' },
    ],
  },

  // 14. SLA & Performance Management
  {
    key: 'service-sla-mgmt',
    label: 'SLA Management',
    iconName: 'Shield',
    path: '/app/services/sla-management',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 15. Customer Feedback & CSAT
  {
    key: 'service-feedback-mgmt',
    label: 'Customer Feedback (CSAT)',
    iconName: 'ThumbsUp',
    path: '/app/services/feedback',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 16. Service Reports & Analytics
  {
    key: 'service-reports-mgmt',
    label: 'Service Reports & Analytics',
    iconName: 'BarChart3',
    path: '/app/reports/service',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
  },

  // 17. Service Settings
  {
    key: 'service-settings-mgmt',
    label: 'Service Settings',
    iconName: 'SlidersHorizontal',
    path: '/app/services/settings/company',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'set-company-profile', label: 'Company Profile', path: '/app/services/settings/company', iconName: 'Briefcase' },
    ],
  },
];
