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

// Existing Functional Pages
import {
  SalesCustomersPage as CustomersPage,
  SalesInvoicesPage as InvoicesPage,
  SalesPaymentsPage as PaymentsPage,
  SalesReportsPage as ReportsPage,
  SalesCrmPage,
  SalesEnquiriesPage,
  SalesQuotationsPage,
  SalesOrdersPage,
  SalesProductsPage,
  SalesReturnsPage,
  SalesTeamPage,
} from '../pages/sales/SalesPages';
import { CompanyProfileSettingsPage as SettingsPage } from '../pages/settings/CompanySettingsPages';

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

// Generic Active Module Viewer for newly structured sub-modules
import { GenericModuleView } from '../pages/GenericModuleView';

// Dedicated Sub-Portals
import { CustomerPortal } from '../pages/portals/CustomerPortal';
import { SupplierPortal } from '../pages/portals/SupplierPortal';
import { EmployeePortal } from '../pages/portals/EmployeePortal';
import { FinanceBillingPage } from '../pages/finance/FinanceBillingPage';

// Error Pages & Route Guard
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

      {/* 4. Unified Company ERP Routes with Collapsible Group Mappings */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />

        {/* --- COMMON MODULES --- */}
        {/* Dashboard */}
        <Route path="dashboard" element={<UnifiedDashboard />} />
        <Route path="notifications" element={<GenericModuleView title="Notifications" />} />
        <Route path="calendar" element={<GenericModuleView title="Company Calendar" />} />

        {/* Customer Management */}
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/groups" element={<GenericModuleView title="Customer Groups" />} />
        <Route path="customers/contacts" element={<GenericModuleView title="Customer Contacts" />} />
        <Route path="customers/activities" element={<GenericModuleView title="Customer Activities" />} />
        <Route path="customers/follow-ups" element={<GenericModuleView title="Customer Follow-ups" />} />

        {/* Communication */}
        <Route path="communication/messages" element={<GenericModuleView title="Messages" />} />
        <Route path="communication/emails" element={<GenericModuleView title="Email History" />} />
        <Route path="communication/announcements" element={<GenericModuleView title="Announcements" />} />
        <Route path="communication/tasks" element={<GenericModuleView title="Tasks & Reminders" />} />

        {/* Document Management */}
        <Route path="documents" element={<GenericModuleView title="Documents" />} />
        <Route path="documents/templates" element={<GenericModuleView title="Document Templates" />} />
        <Route path="documents/attachments" element={<GenericModuleView title="Attachments" />} />
        <Route path="documents/history" element={<GenericModuleView title="Document History" />} />

        {/* Finance & Accounts Extended Architecture */}
        <Route path="billing" element={<FinanceBillingPage />} />
        <Route path="finance/invoices" element={<FinanceBillingPage />} />
        <Route path="finance/proforma-invoices" element={<GenericModuleView title="Proforma Invoices" />} />
        <Route path="finance/recurring-invoices" element={<GenericModuleView title="Recurring Invoices" />} />
        <Route path="finance/credit-notes" element={<GenericModuleView title="Credit Notes" />} />
        <Route path="finance/debit-notes" element={<GenericModuleView title="Debit Notes" />} />
        <Route path="finance/invoice-templates" element={<GenericModuleView title="Invoice Templates" />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="finance/payment-history" element={<GenericModuleView title="Payment History" />} />
        <Route path="finance/refunds" element={<GenericModuleView title="Refund Management" />} />
        <Route path="finance/reconciliation" element={<GenericModuleView title="Payment Reconciliation" />} />
        <Route path="finance/bank-cash" element={<GenericModuleView title="Bank & Cash Management" />} />
        <Route path="finance/reports" element={<GenericModuleView title="Financial Reports" />} />
        <Route path="finance/profit-loss" element={<GenericModuleView title="Profit & Loss" />} />
        <Route path="finance/payment-methods" element={<GenericModuleView title="Payment Methods" />} />
        <Route path="finance/expenses" element={<GenericModuleView title="Expenses" />} />
        <Route path="finance/tax" element={<GenericModuleView title="Tax Management" />} />
        <Route path="finance/receivables" element={<GenericModuleView title="Receivables" />} />
        <Route path="finance/payables" element={<GenericModuleView title="Payables" />} />
        <Route path="finance/transactions" element={<GenericModuleView title="Financial Transactions" />} />

        {/* Approval Management */}
        <Route path="approvals/pending" element={<GenericModuleView title="Pending Approvals" />} />
        <Route path="approvals/workflows" element={<GenericModuleView title="Approval Workflows" />} />
        <Route path="approvals/history" element={<GenericModuleView title="Approval History" />} />

        {/* Reports & Analytics */}
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/customers" element={<GenericModuleView title="Customer Reports" />} />
        <Route path="reports/financial" element={<GenericModuleView title="Financial Reports" />} />
        <Route path="reports/activities" element={<GenericModuleView title="Activity Reports" />} />
        <Route path="reports/custom" element={<GenericModuleView title="Custom Reports" />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/branches" element={<GenericModuleView title="Branch Management" />} />
        <Route path="settings/users" element={<UserManagementPage />} />
        <Route path="settings/roles" element={<RolesPermissionsPage />} />
        <Route path="settings/modules" element={<ERPPlans />} />
        <Route path="settings/subscription" element={<SubscriptionManagementPage />} />
        <Route path="settings/tax" element={<GenericModuleView title="Tax Configuration" />} />
        <Route path="settings/notifications" element={<GenericModuleView title="Notification Settings" />} />
        <Route path="settings/integrations" element={<GenericModuleView title="Integrations" />} />
        <Route path="settings/import-export" element={<GenericModuleView title="Import / Export" />} />
        <Route path="settings/audit-logs" element={<AuditLogsPage />} />
        <Route path="settings/system" element={<PlatformSettingsPage />} />

        {/* --- SALES ERP MODULES (Gated by ModuleAccessRoute) --- */}
        <Route path="sales/dashboard" element={<ModuleAccessRoute><SalesDashboard /></ModuleAccessRoute>} />
        <Route path="sales/targets" element={<ModuleAccessRoute><GenericModuleView title="Sales Targets" /></ModuleAccessRoute>} />
        <Route path="sales/performance" element={<ModuleAccessRoute><GenericModuleView title="Sales Performance" /></ModuleAccessRoute>} />
        <Route path="sales/team" element={<ModuleAccessRoute><SalesTeamPage /></ModuleAccessRoute>} />
        <Route path="sales/commissions" element={<ModuleAccessRoute><GenericModuleView title="Sales Commissions" /></ModuleAccessRoute>} />
        <Route path="sales/activities" element={<ModuleAccessRoute><GenericModuleView title="Sales Activities" /></ModuleAccessRoute>} />

        <Route path="sales/crm" element={<ModuleAccessRoute><SalesCrmPage /></ModuleAccessRoute>} />
        <Route path="sales/leads" element={<ModuleAccessRoute><SalesCrmPage /></ModuleAccessRoute>} />
        <Route path="sales/lead-sources" element={<ModuleAccessRoute><GenericModuleView title="Lead Sources" /></ModuleAccessRoute>} />
        <Route path="sales/lead-assignments" element={<ModuleAccessRoute><GenericModuleView title="Lead Assignments" /></ModuleAccessRoute>} />
        <Route path="sales/lead-follow-ups" element={<ModuleAccessRoute><GenericModuleView title="Lead Follow-ups" /></ModuleAccessRoute>} />
        <Route path="sales/lead-conversion" element={<ModuleAccessRoute><GenericModuleView title="Lead Conversion" /></ModuleAccessRoute>} />

        <Route path="sales/enquiries" element={<ModuleAccessRoute><SalesEnquiriesPage /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-assignments" element={<ModuleAccessRoute><GenericModuleView title="Enquiry Assignments" /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-follow-ups" element={<ModuleAccessRoute><GenericModuleView title="Enquiry Follow-ups" /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-status" element={<ModuleAccessRoute><GenericModuleView title="Enquiry Status" /></ModuleAccessRoute>} />

        <Route path="sales/quotations" element={<ModuleAccessRoute><SalesQuotationsPage /></ModuleAccessRoute>} />
        <Route path="sales/quotation-templates" element={<ModuleAccessRoute><GenericModuleView title="Quotation Templates" /></ModuleAccessRoute>} />
        <Route path="sales/quotation-approvals" element={<ModuleAccessRoute><GenericModuleView title="Quotation Approvals" /></ModuleAccessRoute>} />
        <Route path="sales/quotation-history" element={<ModuleAccessRoute><GenericModuleView title="Quotation History" /></ModuleAccessRoute>} />

        <Route path="sales/orders" element={<ModuleAccessRoute><SalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/order-approvals" element={<ModuleAccessRoute><GenericModuleView title="Order Approvals" /></ModuleAccessRoute>} />
        <Route path="sales/order-tracking" element={<ModuleAccessRoute><GenericModuleView title="Order Tracking" /></ModuleAccessRoute>} />
        <Route path="sales/delivery-management" element={<ModuleAccessRoute><GenericModuleView title="Delivery Management" /></ModuleAccessRoute>} />
        <Route path="sales/returns" element={<ModuleAccessRoute><SalesReturnsPage /></ModuleAccessRoute>} />

        <Route path="sales/products" element={<ModuleAccessRoute><SalesProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/product-categories" element={<ModuleAccessRoute><GenericModuleView title="Product Categories" /></ModuleAccessRoute>} />
        <Route path="sales/brands" element={<ModuleAccessRoute><GenericModuleView title="Brands" /></ModuleAccessRoute>} />
        <Route path="sales/uom" element={<ModuleAccessRoute><GenericModuleView title="Units of Measurement" /></ModuleAccessRoute>} />
        <Route path="sales/price-lists" element={<ModuleAccessRoute><GenericModuleView title="Price Lists" /></ModuleAccessRoute>} />
        <Route path="sales/discounts" element={<ModuleAccessRoute><GenericModuleView title="Discounts & Offers" /></ModuleAccessRoute>} />

        <Route path="sales/inventory" element={<ModuleAccessRoute><SalesProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-management" element={<ModuleAccessRoute><GenericModuleView title="Stock Management" /></ModuleAccessRoute>} />
        <Route path="sales/stock-transfers" element={<ModuleAccessRoute><GenericModuleView title="Stock Transfers" /></ModuleAccessRoute>} />
        <Route path="sales/stock-adjustments" element={<ModuleAccessRoute><GenericModuleView title="Stock Adjustments" /></ModuleAccessRoute>} />
        <Route path="sales/warehouses" element={<ModuleAccessRoute><GenericModuleView title="Warehouse Management" /></ModuleAccessRoute>} />
        <Route path="sales/low-stock-alerts" element={<ModuleAccessRoute><GenericModuleView title="Low Stock Alerts" /></ModuleAccessRoute>} />
        <Route path="sales/stock-history" element={<ModuleAccessRoute><GenericModuleView title="Stock History" /></ModuleAccessRoute>} />

        <Route path="sales/purchases" element={<ModuleAccessRoute><SalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-orders" element={<ModuleAccessRoute><GenericModuleView title="Purchase Orders" /></ModuleAccessRoute>} />
        <Route path="sales/grn" element={<ModuleAccessRoute><GenericModuleView title="Goods Received Notes (GRN)" /></ModuleAccessRoute>} />
        <Route path="sales/suppliers" element={<ModuleAccessRoute><CustomersPage /></ModuleAccessRoute>} />
        <Route path="sales/supplier-payments" element={<ModuleAccessRoute><GenericModuleView title="Supplier Payments" /></ModuleAccessRoute>} />
        <Route path="sales/purchase-returns" element={<ModuleAccessRoute><GenericModuleView title="Purchase Returns" /></ModuleAccessRoute>} />

        <Route path="sales/invoices" element={<ModuleAccessRoute><InvoicesPage /></ModuleAccessRoute>} />
        <Route path="sales/credit-notes" element={<ModuleAccessRoute><GenericModuleView title="Credit Notes" /></ModuleAccessRoute>} />
        <Route path="sales/debit-notes" element={<ModuleAccessRoute><GenericModuleView title="Debit Notes" /></ModuleAccessRoute>} />
        <Route path="sales/finance-payments" element={<ModuleAccessRoute><PaymentsPage /></ModuleAccessRoute>} />
        <Route path="sales/outstanding-receivables" element={<ModuleAccessRoute><GenericModuleView title="Outstanding Receivables" /></ModuleAccessRoute>} />
        <Route path="sales/financial-reports" element={<ModuleAccessRoute><ReportsPage /></ModuleAccessRoute>} />

        {/* --- SERVICE ERP MODULES (Gated by ModuleAccessRoute) --- */}
        <Route path="services/dashboard" element={<ModuleAccessRoute><ServicesDashboard /></ModuleAccessRoute>} />
        <Route path="services/categories" element={<ModuleAccessRoute><GenericModuleView title="Service Categories" /></ModuleAccessRoute>} />
        <Route path="services/types" element={<ModuleAccessRoute><GenericModuleView title="Service Types" /></ModuleAccessRoute>} />
        <Route path="services/pricing" element={<ModuleAccessRoute><GenericModuleView title="Service Pricing" /></ModuleAccessRoute>} />
        <Route path="services/performance" element={<ModuleAccessRoute><GenericModuleView title="Service Performance" /></ModuleAccessRoute>} />

        <Route path="services/requests" element={<ModuleAccessRoute><ServiceTicketsPage /></ModuleAccessRoute>} />
        <Route path="services/request-assignments" element={<ModuleAccessRoute><GenericModuleView title="Request Assignments" /></ModuleAccessRoute>} />
        <Route path="services/request-approvals" element={<ModuleAccessRoute><GenericModuleView title="Request Approvals" /></ModuleAccessRoute>} />
        <Route path="services/request-tracking" element={<ModuleAccessRoute><GenericModuleView title="Request Tracking" /></ModuleAccessRoute>} />
        <Route path="services/request-history" element={<ModuleAccessRoute><GenericModuleView title="Request History" /></ModuleAccessRoute>} />

        <Route path="services/tickets" element={<ModuleAccessRoute><ServiceTicketsPage /></ModuleAccessRoute>} />
        <Route path="services/ticket-priorities" element={<ModuleAccessRoute><GenericModuleView title="Ticket Priorities" /></ModuleAccessRoute>} />
        <Route path="services/ticket-escalations" element={<ModuleAccessRoute><GenericModuleView title="Ticket Escalations" /></ModuleAccessRoute>} />
        <Route path="services/sla-management" element={<ModuleAccessRoute><GenericModuleView title="SLA Management" /></ModuleAccessRoute>} />
        <Route path="services/ticket-history" element={<ModuleAccessRoute><GenericModuleView title="Ticket History" /></ModuleAccessRoute>} />

        <Route path="services/jobs" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/work-orders" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/job-assignments" element={<ModuleAccessRoute><GenericModuleView title="Job Assignments" /></ModuleAccessRoute>} />
        <Route path="services/job-status" element={<ModuleAccessRoute><GenericModuleView title="Job Status" /></ModuleAccessRoute>} />
        <Route path="services/job-completion" element={<ModuleAccessRoute><GenericModuleView title="Job Completion" /></ModuleAccessRoute>} />
        <Route path="services/job-history" element={<ModuleAccessRoute><GenericModuleView title="Job History" /></ModuleAccessRoute>} />

        <Route path="services/scheduling" element={<ModuleAccessRoute><ServiceSchedulingPage /></ModuleAccessRoute>} />
        <Route path="services/technician-availability" element={<ModuleAccessRoute><GenericModuleView title="Technician Availability" /></ModuleAccessRoute>} />
        <Route path="services/service-calendar" element={<ModuleAccessRoute><GenericModuleView title="Service Calendar" /></ModuleAccessRoute>} />
        <Route path="services/route-planning" element={<ModuleAccessRoute><GenericModuleView title="Route Planning" /></ModuleAccessRoute>} />
        <Route path="services/dispatch-management" element={<ModuleAccessRoute><GenericModuleView title="Dispatch Management" /></ModuleAccessRoute>} />

        <Route path="services/technicians" element={<ModuleAccessRoute><ServiceTechniciansPage /></ModuleAccessRoute>} />
        <Route path="services/technician-teams" element={<ModuleAccessRoute><GenericModuleView title="Technician Teams" /></ModuleAccessRoute>} />
        <Route path="services/technician-skills" element={<ModuleAccessRoute><GenericModuleView title="Technician Skills" /></ModuleAccessRoute>} />
        <Route path="services/technician-attendance" element={<ModuleAccessRoute><GenericModuleView title="Technician Attendance" /></ModuleAccessRoute>} />
        <Route path="services/technician-workload" element={<ModuleAccessRoute><GenericModuleView title="Technician Workload" /></ModuleAccessRoute>} />
        <Route path="services/technician-performance" element={<ModuleAccessRoute><GenericModuleView title="Technician Performance" /></ModuleAccessRoute>} />

        <Route path="services/field-service" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/visit-management" element={<ModuleAccessRoute><GenericModuleView title="Visit Management" /></ModuleAccessRoute>} />
        <Route path="services/service-locations" element={<ModuleAccessRoute><GenericModuleView title="Service Locations" /></ModuleAccessRoute>} />
        <Route path="services/checkin-checkout" element={<ModuleAccessRoute><GenericModuleView title="Check-in / Check-out" /></ModuleAccessRoute>} />
        <Route path="services/service-checklist" element={<ModuleAccessRoute><GenericModuleView title="Service Checklist" /></ModuleAccessRoute>} />
        <Route path="services/field-reports" element={<ModuleAccessRoute><GenericModuleView title="Service Reports" /></ModuleAccessRoute>} />

        <Route path="services/amc" element={<ModuleAccessRoute><ServiceAmcPage /></ModuleAccessRoute>} />
        <Route path="services/service-contracts" element={<ModuleAccessRoute><GenericModuleView title="Service Contracts" /></ModuleAccessRoute>} />
        <Route path="services/contract-renewals" element={<ModuleAccessRoute><GenericModuleView title="Contract Renewals" /></ModuleAccessRoute>} />
        <Route path="services/contract-expiry-alerts" element={<ModuleAccessRoute><GenericModuleView title="Contract Expiry Alerts" /></ModuleAccessRoute>} />
        <Route path="services/contract-history" element={<ModuleAccessRoute><GenericModuleView title="Contract History" /></ModuleAccessRoute>} />

        <Route path="services/warranty-registration" element={<ModuleAccessRoute><GenericModuleView title="Warranty Registration" /></ModuleAccessRoute>} />
        <Route path="services/warranty" element={<ModuleAccessRoute><ServiceWarrantyPage /></ModuleAccessRoute>} />
        <Route path="services/warranty-approvals" element={<ModuleAccessRoute><GenericModuleView title="Warranty Approvals" /></ModuleAccessRoute>} />
        <Route path="services/warranty-tracking" element={<ModuleAccessRoute><GenericModuleView title="Warranty Tracking" /></ModuleAccessRoute>} />
        <Route path="services/warranty-expiry" element={<ModuleAccessRoute><GenericModuleView title="Warranty Expiry" /></ModuleAccessRoute>} />

        <Route path="services/spare-parts" element={<ModuleAccessRoute><ServiceSparesPage /></ModuleAccessRoute>} />
        <Route path="services/spare-parts-inventory" element={<ModuleAccessRoute><GenericModuleView title="Spare Parts Inventory" /></ModuleAccessRoute>} />
        <Route path="services/parts-consumption" element={<ModuleAccessRoute><GenericModuleView title="Parts Consumption" /></ModuleAccessRoute>} />
        <Route path="services/parts-requests" element={<ModuleAccessRoute><GenericModuleView title="Parts Requests" /></ModuleAccessRoute>} />
        <Route path="services/parts-returns" element={<ModuleAccessRoute><GenericModuleView title="Parts Returns" /></ModuleAccessRoute>} />

        <Route path="services/billing" element={<ModuleAccessRoute><ServiceBillingPage /></ModuleAccessRoute>} />
        <Route path="services/service-invoices" element={<ModuleAccessRoute><GenericModuleView title="Service Invoices" /></ModuleAccessRoute>} />
        <Route path="services/service-payments" element={<ModuleAccessRoute><GenericModuleView title="Service Payments" /></ModuleAccessRoute>} />
        <Route path="services/service-expenses" element={<ModuleAccessRoute><GenericModuleView title="Service Expenses" /></ModuleAccessRoute>} />
        <Route path="services/outstanding-service-payments" element={<ModuleAccessRoute><GenericModuleView title="Outstanding Service Payments" /></ModuleAccessRoute>} />

        <Route path="services/feedback" element={<ModuleAccessRoute><ServiceFeedbackPage /></ModuleAccessRoute>} />
        <Route path="services/customer-ratings" element={<ModuleAccessRoute><GenericModuleView title="Customer Ratings" /></ModuleAccessRoute>} />
        <Route path="services/complaints" element={<ModuleAccessRoute><GenericModuleView title="Complaints" /></ModuleAccessRoute>} />
        <Route path="services/csat-reports" element={<ModuleAccessRoute><GenericModuleView title="Customer Satisfaction Reports" /></ModuleAccessRoute>} />

        {/* Dedicated Specialized Portals */}
        <Route path="portal/customer" element={<CustomerPortal />} />
        <Route path="portal/supplier" element={<SupplierPortal />} />
        <Route path="portal/technician" element={<EmployeePortal />} />
      </Route>

      {/* Redirects & 404 */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
