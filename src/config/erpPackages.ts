import type { ErpPackageConfig, ErpPackageType, NavItemConfig } from '../types/erp';

export const ERP_PACKAGES: Record<ErpPackageType, ErpPackageConfig> = {
  BOTH: {
    id: 'BOTH',
    name: 'Complete ERP',
    code: 'FULL-ERP',
    tagline: 'Sales + Services Unified Suite',
    description: 'All-inclusive enterprise access encompassing complete CRM, end-to-end sales lifecycle, inventory, field service dispatch, and AMC tracking.',
    badgeColor: '#51258C',
    features: [
      'CRM & Pipeline Management',
      'Quotations, Orders & Invoices',
      'Inventory & Returns',
      'Field Service & Technician Dispatch',
      'AMC & Warranty Tracking',
      'Unified Business Analytics',
    ],
  },
  SALES: {
    id: 'SALES',
    name: 'Sales ERP',
    code: 'SALES-ONLY',
    tagline: 'High Velocity Commercial & Sales Suite',
    description: 'Designed for trading, distribution, and commercial teams to drive revenue from leads to cash collection.',
    badgeColor: '#1d4ed8',
    features: [
      'Leads & Enquiries Management',
      'Quotations & Approvals',
      'Sales Orders & Invoicing',
      'Customer Credit & Payments',
      'Product Catalog & Inventory',
      'Sales Performance Dashboards',
    ],
  },
  SERVICE: {
    id: 'SERVICE',
    name: 'Service ERP',
    code: 'SERVICE-ONLY',
    tagline: 'Field Service, AMC & Maintenance Suite',
    description: 'Purpose-built for service providers, repair centers, equipment dealers, and maintenance operations.',
    badgeColor: '#059669',
    features: [
      'Service Tickets & Helpdesk',
      'Job Scheduling & GPS Dispatch',
      'Technician Management',
      'Annual Maintenance Contracts (AMC)',
      'Warranty Claim Processing',
      'Spare Parts Inventory & Service Billing',
    ],
  },
};

export interface NavigationSection {
  title: string;
  items: NavItemConfig[];
  packageRequirement?: ErpPackageType[] | 'ALL';
}

export const ERP_NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: 'OVERVIEW',
    packageRequirement: 'ALL',
    items: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        iconName: 'LayoutDashboard',
        packages: 'ALL',
      },
    ],
  },
  {
    title: 'SALES & COMMERCE',
    packageRequirement: ['BOTH', 'SALES'],
    items: [
      {
        key: 'sales-crm',
        label: 'CRM & Pipeline',
        path: '/sales/crm',
        iconName: 'Target',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-leads',
        label: 'Leads',
        path: '/sales/leads',
        iconName: 'UserCheck',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-enquiries',
        label: 'Enquiries',
        path: '/sales/enquiries',
        iconName: 'HelpCircle',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-quotations',
        label: 'Quotations',
        path: '/sales/quotations',
        iconName: 'FileSpreadsheet',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-orders',
        label: 'Sales Orders',
        path: '/sales/orders',
        iconName: 'ShoppingBag',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-invoices',
        label: 'Invoices',
        path: '/sales/invoices',
        iconName: 'Receipt',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-payments',
        label: 'Payments',
        path: '/sales/payments',
        iconName: 'CreditCard',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-customers',
        label: 'Customers',
        path: '/sales/customers',
        iconName: 'Users',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-products',
        label: 'Products',
        path: '/sales/products',
        iconName: 'Package',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-inventory',
        label: 'Inventory',
        path: '/sales/inventory',
        iconName: 'Boxes',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-returns',
        label: 'Returns',
        path: '/sales/returns',
        iconName: 'Undo2',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-team',
        label: 'Sales Team',
        path: '/sales/team',
        iconName: 'Briefcase',
        packages: ['BOTH', 'SALES'],
      },
      {
        key: 'sales-reports',
        label: 'Sales Reports',
        path: '/sales/reports',
        iconName: 'BarChart3',
        packages: ['BOTH', 'SALES'],
      },
    ],
  },
  {
    title: 'SERVICE & MAINTENANCE',
    packageRequirement: ['BOTH', 'SERVICE'],
    items: [
      {
        key: 'service-requests',
        label: 'Service Requests',
        path: '/service/requests',
        iconName: 'Inbox',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-tickets',
        label: 'Tickets',
        path: '/service/tickets',
        iconName: 'LifeBuoy',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-jobs',
        label: 'Job Management',
        path: '/service/jobs',
        iconName: 'Wrench',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-scheduling',
        label: 'Scheduling & Calendar',
        path: '/service/scheduling',
        iconName: 'Calendar',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-technicians',
        label: 'Technicians',
        path: '/service/technicians',
        iconName: 'HardHat',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-field',
        label: 'Field Service',
        path: '/service/field',
        iconName: 'MapPin',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-amc',
        label: 'AMC Contracts',
        path: '/service/amc',
        iconName: 'FileCheck',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-warranty',
        label: 'Warranty Claims',
        path: '/service/warranty',
        iconName: 'ShieldAlert',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-spares',
        label: 'Spare Parts',
        path: '/service/spares',
        iconName: 'Cpu',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-billing',
        label: 'Service Billing',
        path: '/service/billing',
        iconName: 'FileText',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-feedback',
        label: 'Customer Feedback',
        path: '/service/feedback',
        iconName: 'ThumbsUp',
        packages: ['BOTH', 'SERVICE'],
      },
      {
        key: 'service-reports',
        label: 'Service Reports',
        path: '/service/reports',
        iconName: 'TrendingUp',
        packages: ['BOTH', 'SERVICE'],
      },
    ],
  },
  {
    title: 'ADMINISTRATION & SETTINGS',
    packageRequirement: 'ALL',
    items: [
      {
        key: 'company-profile',
        label: 'Company Profile',
        path: '/settings/company',
        iconName: 'Building2',
        packages: 'ALL',
      },
      {
        key: 'company-users',
        label: 'Users & Roles',
        path: '/settings/users',
        iconName: 'UserCog',
        packages: 'ALL',
      },
      {
        key: 'company-settings',
        label: 'System Settings',
        path: '/settings/general',
        iconName: 'SlidersHorizontal',
        packages: 'ALL',
      },
    ],
  },
];

/**
 * Filter sections and navigation items by current tenant's package type
 */
export function getNavForPackage(packageType: ErpPackageType): NavigationSection[] {
  return ERP_NAVIGATION_SECTIONS.map((section) => {
    // Check if section itself is allowed
    const isSectionAllowed =
      section.packageRequirement === 'ALL' ||
      (Array.isArray(section.packageRequirement) && section.packageRequirement.includes(packageType));

    if (!isSectionAllowed) return null;

    // Filter items within section
    const filteredItems = section.items.filter((item) => {
      if (item.packages === 'ALL') return true;
      return item.packages.includes(packageType);
    });

    if (filteredItems.length === 0) return null;

    return {
      ...section,
      items: filteredItems,
    };
  }).filter(Boolean) as NavigationSection[];
}
