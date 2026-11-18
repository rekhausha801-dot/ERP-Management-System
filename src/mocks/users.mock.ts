export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | 'superadmin'
    | 'company_admin'
    | 'manager'
    | 'accountant'
    | 'sales_manager'
    | 'service_manager'
    | 'technician'
    | 'employee';
  companyId?: string;
  status: 'active' | 'inactive';
}

export const MOCK_USERS: User[] = [
  {
    id: 'usr-super',
    name: 'Devi SuperAdmin',
    email: 'superadmin@universal-erp.io',
    role: 'superadmin',
    status: 'active',
  },
  {
    id: 'usr-abc',
    name: 'Janani (Admin)',
    email: 'janani@abctraders.com',
    role: 'company_admin',
    companyId: 'comp-abc',
    status: 'active',
  },
  {
    id: 'usr-xyz',
    name: 'Karthik Raja (Sales Manager)',
    email: 'sales@xyzagencies.com',
    role: 'sales_manager',
    companyId: 'comp-xyz',
    status: 'active',
  },
  {
    id: 'usr-pqr',
    name: 'Murugan Selvam (Service Manager)',
    email: 'support@pqrsolutions.com',
    role: 'service_manager',
    companyId: 'comp-pqr',
    status: 'active',
  },
];
