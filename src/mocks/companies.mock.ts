import type { ErpPackageId } from '../config/erpPackageConfig';

export interface Company {
  id: string;
  name: string;
  code: string;
  businessType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  website?: string;
  packageType: ErpPackageId;
  subscriptionPlan: 'Startup' | 'Professional' | 'Enterprise';
  startDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended';
  logo?: string;
  usersCount?: number;
}

export const SAMPLE_COMPANIES: Company[] = [
  {
    id: 'comp-abc',
    name: 'ABC Traders Ltd',
    code: 'ABC',
    businessType: 'Trading & Services',
    contactPerson: 'Ramesh Sundaram',
    email: 'operations@abctraders.com',
    phone: '+91 98401 23456',
    address: '42 Commercial Axis, Mount Road',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    website: 'https://abctraders.com',
    packageType: 'COMPLETE',
    subscriptionPlan: 'Enterprise',
    startDate: '2024-01-15',
    expiryDate: '2027-01-14',
    status: 'active',
    usersCount: 38,
  },
  {
    id: 'comp-xyz',
    name: 'XYZ Agencies Pvt Ltd',
    code: 'XYZ',
    businessType: 'Wholesale & Commercial Distribution',
    contactPerson: 'Karthik Raja',
    email: 'sales@xyzagencies.com',
    phone: '+91 98450 67890',
    address: '78 Industrial Estate, Peenya',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    website: 'https://xyzagencies.com',
    packageType: 'SALES',
    subscriptionPlan: 'Professional',
    startDate: '2024-03-10',
    expiryDate: '2026-12-10',
    status: 'active',
    usersCount: 18,
  },
  {
    id: 'comp-pqr',
    name: 'PQR Solutions & Services',
    code: 'PQR',
    businessType: 'Technical Maintenance & Field Engineering',
    contactPerson: 'Murugan Selvam',
    email: 'support@pqrsolutions.com',
    phone: '+91 98200 11223',
    address: '12 Tech Park Avenue, Andheri East',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    website: 'https://pqrsolutions.com',
    packageType: 'SERVICE',
    subscriptionPlan: 'Professional',
    startDate: '2024-05-01',
    expiryDate: '2027-05-01',
    status: 'active',
    usersCount: 24,
  },
];
