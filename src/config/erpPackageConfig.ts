export type ErpPackageId = 'COMPLETE' | 'SALES' | 'SERVICE';

export interface ErpPackageDefinition {
  id: ErpPackageId;
  name: string;
  code: string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeColor: string;
  features: string[];
}

export const ERP_PACKAGES: Record<ErpPackageId, ErpPackageDefinition> = {
  COMPLETE: {
    id: 'COMPLETE',
    name: 'Complete ERP',
    code: 'COMPLETE',
    tagline: 'Sales + Services Unified Suite',
    description: 'Comprehensive enterprise access including all Common, Sales, and Service operational modules.',
    badgeBg: '#F0EAF8',
    badgeColor: '#51258C',
    features: [
      'CRM, Leads & Enquiries',
      'Quotations, Orders & Invoices',
      'Purchases & Inventory',
      'Service Requests & Ticket Queue',
      'Field Jobs & Technician Dispatch',
      'AMC & Warranty Tracking',
      'Billing & Financial Reports',
    ],
  },
  SALES: {
    id: 'SALES',
    name: 'Sales ERP',
    code: 'SALES',
    tagline: 'Commercial Trading & Distribution Suite',
    description: 'Full commercial lifecycle from lead pipeline to invoicing and cash collection.',
    badgeBg: '#EFF6FF',
    badgeColor: '#1D4ED8',
    features: [
      'CRM, Leads & Enquiries',
      'Quotations & Approvals',
      'Sales Orders & Invoicing',
      'Purchases & Inventory Management',
      'Supplier Management & Returns',
      'Commercial Sales Reports',
    ],
  },
  SERVICE: {
    id: 'SERVICE',
    name: 'Service ERP',
    code: 'SERVICE',
    tagline: 'Field Service, Maintenance & AMC Suite',
    description: 'Specialized for service providers, repair centers, and maintenance engineering teams.',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
    features: [
      'Service Requests & Helpdesk',
      'Work Orders & Scheduling',
      'Field Technician Tracking',
      'AMC Contract Management',
      'Warranty Claim Processing',
      'Spare Parts Inventory & Service Billing',
    ],
  },
};
