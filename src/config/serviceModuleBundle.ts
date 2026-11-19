import React from 'react';
import type { MenuGroupConfig } from './menuConfig';

// Re-export the Service Sidebar Groups
export { SERVICE_SIDEBAR_MENU_GROUPS } from './serviceSidebarConfig';

// Re-export all dedicated Service Pages & Components from their implementations
export { ServicesDashboard } from '../modules/services-erp/dashboard/ServicesDashboard';
export { CustomerServiceRequestsPage } from '../pages/service/CustomerServiceRequestsPage';
export { ServiceQuotationsPage } from '../pages/service/ServiceQuotationsPage';
export {
  ServiceTicketsPage,
  ServiceJobsPage,
  ServiceSchedulingPage,
  ServiceTechniciansPage,
  ServiceAmcPage,
  ServiceWarrantyPage,
  ServiceSparesPage,
  ServiceBillingPage,
  ServiceFeedbackPage,
  ServiceReportsPage,
} from '../pages/service/ServicePages';

// Service-only package definitions & metadata
export const SERVICE_MODULE_METADATA = {
  id: 'SERVICE',
  title: 'Field Service, Maintenance & Engineering ERP',
  code: 'SERVICE',
  description: 'Specialized enterprise module for repair centers, technician scheduling, warranties, AMC contracts, and service invoicing.',
  version: '2.0.0',
};
