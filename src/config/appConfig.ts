export const appConfig = {
  name: 'Universal Multi-Tenant ERP',
  shortName: 'Universal ERP',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  dateFormat: 'DD/MM/YYYY',
  currency: 'INR',
  currencySymbol: '₹',
};
