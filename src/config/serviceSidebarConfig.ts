import type { MenuGroupConfig } from '../config/menuConfig';

/**
 * SERVICE-ONLY SIDEBAR CONFIGURATION
 * Dedicated file containing ONLY Service Module sidebar groups & items.
 */
export const SERVICE_SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = [
  {
    key: 'grp-service-mgmt',
    label: 'Service Management',
    iconName: 'Wrench',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
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
  {
    key: 'grp-service-reports',
    label: 'Service Reports & Analytics',
    iconName: 'BarChart3',
    section: 'services',
    allowedPackages: ['SERVICE', 'COMPLETE'],
    children: [
      { key: 'rep-service', label: 'Service Reports', path: '/app/reports/service', iconName: 'Wrench' },
      { key: 'rep-overview', label: 'Reports Overview', path: '/app/reports', iconName: 'BarChart3' },
    ],
  },
];
