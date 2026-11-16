// Universal Multi-Tenant ERP Package Types & Models

export type ErpPackageType = 'BOTH' | 'SALES' | 'SERVICE';

export interface ErpPackageConfig {
  id: ErpPackageType;
  name: string;
  code: string;
  description: string;
  tagline: string;
  badgeColor: string;
  features: string[];
}

export interface Company {
  id: string;
  name: string;
  code: string;
  registrationNumber: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  packageType: ErpPackageType;
  status: 'active' | 'inactive' | 'trial' | 'suspended';
  logo?: string;
  subscribedSince?: string;
  subscriptionPlan?: 'Startup' | 'Professional' | 'Enterprise';
  usersCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'sales_manager' | 'service_manager' | 'technician' | 'staff';
  avatar?: string;
  companyId?: string; // Empty if superadmin
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  ip: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  packageType: ErpPackageType;
  plan: 'Monthly' | 'Quarterly' | 'Annual';
  billingCycle: string;
  amount: number;
  currency: string;
  status: 'active' | 'expiring_soon' | 'overdue' | 'cancelled';
  nextBillingDate: string;
}

// Module Definition for Dynamic Package-based Navigation
export interface NavItemConfig {
  key: string;
  label: string;
  path: string;
  iconName: string;
  packages: ErpPackageType[] | 'ALL'; // Which ERP packages show this module
  badge?: string;
  children?: {
    key: string;
    label: string;
    path: string;
  }[];
}
