import { SAMPLE_COMPANIES } from './companies.mock';
import { MOCK_SALES_DATA } from './sales.mock';
import { MOCK_SERVICES_DATA } from './services.mock';

export const MOCK_DASHBOARD_DATA = {
  superAdmin: {
    totalCompanies: SAMPLE_COMPANIES.length,
    activeCompanies: SAMPLE_COMPANIES.filter((c) => c.status === 'active').length,
    inactiveCompanies: SAMPLE_COMPANIES.filter((c) => c.status !== 'active').length,
    totalUsers: 80,
    activeSubscriptions: 3,
    expiredSubscriptions: 0,
    mrr: 259997,
    packageDistribution: [
      { name: 'Complete ERP', count: 1, percentage: 33.3 },
      { name: 'Sales ERP', count: 1, percentage: 33.3 },
      { name: 'Service ERP', count: 1, percentage: 33.3 },
    ],
  },
  sales: MOCK_SALES_DATA,
  services: MOCK_SERVICES_DATA,
};
