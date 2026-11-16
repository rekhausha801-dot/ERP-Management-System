import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { CompanyLayout } from '../layouts/CompanyLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/super-admin/Dashboard';
import { CompanyList } from '../pages/super-admin/CompanyList';
import { ERPPlans } from '../pages/super-admin/ERPPlans';
import { SubscriptionManagementPage } from '../pages/superadmin/SubscriptionManagementPage';
import { UserManagementPage } from '../pages/superadmin/UserManagementPage';
import { RolesPermissionsPage } from '../pages/superadmin/RolesPermissionsPage';
import { AuditLogsPage, PlatformReportsPage, PlatformSettingsPage } from '../pages/superadmin/AuditAndSettingsPages';

// Dashboards
import { UnifiedDashboard } from '../modules/common/dashboard/BothDashboard';
import { SalesDashboard } from '../modules/sales-erp/dashboard/SalesDashboard';
import { ServicesDashboard } from '../modules/services-erp/dashboard/ServicesDashboard';

// Common Modules
import {
  SalesCustomersPage as CustomersPage,
  SalesInvoicesPage as BillingPage,
  SalesPaymentsPage as PaymentsPage,
  SalesReportsPage as ReportsPage,
} from '../pages/sales/SalesPages';
import { CompanyProfileSettingsPage as SettingsPage } from '../pages/settings/CompanySettingsPages';

// Sales ERP Modules
import {
  SalesCrmPage,
  SalesEnquiriesPage,
  SalesQuotationsPage,
  SalesOrdersPage,
  SalesInvoicesPage,
  SalesPaymentsPage,
  SalesProductsPage,
  SalesReturnsPage,
  SalesTeamPage,
} from '../pages/sales/SalesPages';

// Services ERP Modules
import {
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

// Error Pages
import { NotFoundPage, UnauthorizedPage, ForbiddenPage } from '../pages/errors/ErrorPages';
import { ModuleAccessRoute } from './ModuleAccessRoute';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/forbidden" replace />;
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* 2. Error Routes */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* 3. Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <SuperAdminRoute>
            <SuperAdminLayout />
          </SuperAdminRoute>
        }
      >
        <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="packages" element={<ERPPlans />} />
        <Route path="subscriptions" element={<SubscriptionManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="roles" element={<RolesPermissionsPage />} />
        <Route path="reports" element={<PlatformReportsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<PlatformSettingsPage />} />
      </Route>

      {/* 4. Unified Company ERP Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />

        {/* Common Modules */}
        <Route path="dashboard" element={<UnifiedDashboard />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Sales ERP Modules with Dynamic Route Gate */}
        <Route path="sales/dashboard" element={<ModuleAccessRoute><SalesDashboard /></ModuleAccessRoute>} />
        <Route path="sales/crm" element={<ModuleAccessRoute><SalesCrmPage /></ModuleAccessRoute>} />
        <Route path="sales/leads" element={<ModuleAccessRoute><SalesCrmPage /></ModuleAccessRoute>} />
        <Route path="sales/enquiries" element={<ModuleAccessRoute><SalesEnquiriesPage /></ModuleAccessRoute>} />
        <Route path="sales/quotations" element={<ModuleAccessRoute><SalesQuotationsPage /></ModuleAccessRoute>} />
        <Route path="sales/orders" element={<ModuleAccessRoute><SalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/invoices" element={<ModuleAccessRoute><SalesInvoicesPage /></ModuleAccessRoute>} />
        <Route path="sales/products" element={<ModuleAccessRoute><SalesProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/inventory" element={<ModuleAccessRoute><SalesProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/purchases" element={<ModuleAccessRoute><SalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/suppliers" element={<ModuleAccessRoute><CustomersPage /></ModuleAccessRoute>} />
        <Route path="sales/returns" element={<ModuleAccessRoute><SalesReturnsPage /></ModuleAccessRoute>} />
        <Route path="sales/team" element={<ModuleAccessRoute><SalesTeamPage /></ModuleAccessRoute>} />

        {/* Services ERP Modules with Dynamic Route Gate */}
        <Route path="services/dashboard" element={<ModuleAccessRoute><ServicesDashboard /></ModuleAccessRoute>} />
        <Route path="services/requests" element={<ModuleAccessRoute><ServiceTicketsPage /></ModuleAccessRoute>} />
        <Route path="services/tickets" element={<ModuleAccessRoute><ServiceTicketsPage /></ModuleAccessRoute>} />
        <Route path="services/jobs" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/scheduling" element={<ModuleAccessRoute><ServiceSchedulingPage /></ModuleAccessRoute>} />
        <Route path="services/technicians" element={<ModuleAccessRoute><ServiceTechniciansPage /></ModuleAccessRoute>} />
        <Route path="services/field-service" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/amc" element={<ModuleAccessRoute><ServiceAmcPage /></ModuleAccessRoute>} />
        <Route path="services/warranty" element={<ModuleAccessRoute><ServiceWarrantyPage /></ModuleAccessRoute>} />
        <Route path="services/spare-parts" element={<ModuleAccessRoute><ServiceSparesPage /></ModuleAccessRoute>} />
        <Route path="services/billing" element={<ModuleAccessRoute><ServiceBillingPage /></ModuleAccessRoute>} />
        <Route path="services/feedback" element={<ModuleAccessRoute><ServiceFeedbackPage /></ModuleAccessRoute>} />
        <Route path="services/reports" element={<ModuleAccessRoute><ServiceReportsPage /></ModuleAccessRoute>} />
      </Route>

      {/* Redirects & 404 */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
