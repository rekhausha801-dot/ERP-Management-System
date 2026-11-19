import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';

// Public & Auth Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';
import { CompanyManagementPage as CompanyList } from '../pages/superadmin/CompanyManagementPage';
import { ErpPackageMatrixPage as ERPPlans } from '../pages/superadmin/ErpPackageMatrixPage';
import { SubscriptionManagementPage } from '../pages/superadmin/SubscriptionManagementPage';
import { UserManagementPage } from '../pages/superadmin/UserManagementPage';
import { RolesPermissionsPage } from '../pages/superadmin/RolesPermissionsPage';
import { PlatformSettingsPage } from '../pages/superadmin/AuditAndSettingsPages';

// Dashboards
import { UnifiedDashboard } from '../modules/common/dashboard/BothDashboard';
import { SalesDashboard } from '../modules/sales-erp/dashboard/SalesDashboard';
import { ServicesDashboard } from '../modules/services-erp/dashboard/ServicesDashboard';

// Sales Pages
import {
  SalesQuotationsPage,
  SalesQuotationTemplatesPage,
  SalesOrdersPage,
  SalesOrderTrackingPage,
  SalesProformaInvoicesPage,
  SalesTargetsPage,
  SalesCommissionsPage,
  SalesReturnsPage,
  SalesTeamPage,
  SalesInvoicesPage as InvoicesPage,
  SalesPaymentsPage as PaymentsPage,
  SalesCustomersPage as CustomersPage,
  SalesProductsPage,
} from '../pages/sales/SalesPages';
import { SalesOverviewPage } from '../pages/sales/SalesOverviewPage';
import { ConfirmedSalesOrdersPage } from '../pages/sales/ConfirmedSalesOrdersPage';
import { PurchaseOverviewPage } from '../pages/purchases/PurchaseOverviewPage';
import { PurchaseOrdersPage } from '../pages/purchases/PurchaseOrdersPage';
import { GoodsReceivedPage } from '../pages/purchases/GoodsReceivedPage';
import { SuppliersPage } from '../pages/purchases/SuppliersPage';
import { PurchaseReturnsPage } from '../pages/purchases/PurchaseReturnsPage';
import { PurchaseAnalyticsPage } from '../pages/purchases/PurchaseAnalyticsPage';

// Inventory Management Pages
import { InventoryOverviewPage } from '../pages/inventory/InventoryOverviewPage';
import { StockManagementPage } from '../pages/inventory/StockManagementPage';
import { StockInOutPage } from '../pages/inventory/StockInOutPage';
import { StockTransfersPage } from '../pages/inventory/StockTransfersPage';
import { StockAdjustmentsPage } from '../pages/inventory/StockAdjustmentsPage';
import { LowStockAlertsPage } from '../pages/inventory/LowStockAlertsPage';
import { WarehouseManagementPage } from '../pages/inventory/WarehouseManagementPage';
import { InventoryAnalyticsReportsPage } from '../pages/inventory/InventoryAnalyticsReportsPage';

// Product & Brand Management Pages
import { AllProductsPage } from '../pages/products/AllProductsPage';
import { BrandManagementPage } from '../pages/products/BrandManagementPage';
import { BrandWiseProductsPage } from '../pages/products/BrandWiseProductsPage';
import { ProductCategoriesPage } from '../pages/products/ProductCategoriesPage';
import { ProductPricingPage } from '../pages/products/ProductPricingPage';

// Invoicing, Billing, Creditors & Debtors Pages
import { AllInvoicesPage } from '../pages/billing/AllInvoicesPage';
import { CreateInvoicePage } from '../pages/billing/CreateInvoicePage';
import { CreditNotesPage } from '../pages/billing/CreditNotesPage';
import { DebitNotesPage } from '../pages/billing/DebitNotesPage';
import { UnifiedNotesPage } from '../pages/billing/UnifiedNotesPage';
import { PaymentsReceivedPage } from '../pages/billing/PaymentsReceivedPage';
import { PurchaseInvoicesBillsPage } from '../pages/purchases/PurchaseInvoicesBillsPage';
import { PaymentsMadePage } from '../pages/purchases/PaymentsMadePage';
import { ChartOfAccountsPage } from '../pages/finance/ChartOfAccountsPage';
import { BankReconciliationPage } from '../pages/finance/BankReconciliationPage';
import { AccountsReceivablePayablePage } from '../pages/finance/AccountsReceivablePayablePage';
import { EInvoicePage } from '../pages/gst/EInvoicePage';
import { EWayBillPage } from '../pages/gst/EWayBillPage';
import { GstReportsPage } from '../pages/gst/GstReportsPage';
import { CreditorsPage } from '../pages/billing/CreditorsPage';
import { DebtorsPage } from '../pages/billing/DebtorsPage';
import { OutstandingPayablesPage } from '../pages/billing/OutstandingPayablesPage';
import { OutstandingReceivablesPage } from '../pages/billing/OutstandingReceivablesPage';

import { CompanyProfileSettingsPage as SettingsPage } from '../pages/settings/CompanySettingsPages';
import { TaxConfigurationPage } from '../pages/settings/TaxConfigurationPage';
import { CompanyCalendarPage } from '../pages/calendar/CompanyCalendarPage';
import { CustomerManagementPage } from '../pages/customers/CustomerManagementPage';
import { CustomerGroupsPage } from '../pages/customers/CustomerGroupsPage';
import { CustomerContactsPage } from '../pages/customers/CustomerContactsPage';
import { CustomerActivitiesHistoryPage } from '../pages/customers/CustomerActivitiesHistoryPage';
import { CrmDashboardPage } from '../pages/crm/CrmDashboardPage';
import { CrmPipelinePage } from '../pages/crm/CrmPipelinePage';
import { LeadsListPage } from '../pages/crm/LeadsListPage';
import { LeadSourcesPage } from '../pages/crm/LeadSourcesPage';
import { LeadAssignmentsPage } from '../pages/crm/LeadAssignmentsPage';
import { EnquiriesListPage } from '../pages/crm/EnquiriesListPage';
import { SalesActivitiesPage } from '../pages/crm/SalesActivitiesPage';
import { CentralFollowUpsPage } from '../pages/crm/CentralFollowUpsPage';


// Service Pages
import {
  ServiceTicketsPage,
  ServiceJobsPage,
  ServiceTechniciansPage,
  ServiceSchedulingPage,
  ServiceAmcPage,
  ServiceWarrantyPage,
  ServiceSparesPage,
  ServiceBillingPage,
  ServiceFeedbackPage,
  ServiceReportsPage,
} from '../pages/service/ServicePages';
import { ServiceQuotationsPage } from '../pages/service/ServiceQuotationsPage';
import { CustomerServiceRequestsPage } from '../pages/service/CustomerServiceRequestsPage';
import { OfficeStaffPortalPage } from '../pages/service/OfficeStaffPortalPage';

// Generic Active Module Viewer for dynamic features
import { GenericModuleView } from '../pages/GenericModuleView';

// Dedicated Sub-Portals
import { CustomerPortal } from '../pages/portals/CustomerPortal';
import { SupplierPortal } from '../pages/portals/SupplierPortal';
import { EmployeePortal } from '../pages/portals/EmployeePortal';
import { FinanceBillingPage } from '../pages/finance/FinanceBillingPage';

// Reports & Analytics Suite (All 7 Dedicated Pages)
import {
  SalesReportsPage,
  PurchaseReportsPage,
  InventoryReportsPage,
  CustomerReportsPage,
  FinancialReportsPage,
  OutstandingReportsPage,
  HrReportsPage,
} from '../pages/reports';

// Asset Management Suite (All 8 Dedicated Pages)
import {
  AssetOverviewPage,
  AllAssetsPage,
  AssetCategoriesPage,
  AssetAllocationPage,
  AssetTransfersPage,
  AssetMaintenancePage,
  AssetDisposalPage,
  AssetHistoryPage,
} from '../pages/assets';

// Additional Enterprise Suite Pages
import { DeliveryManagementPage } from '../pages/delivery/DeliveryManagementPage';
import { ApprovalManagementPage } from '../pages/approvals/ApprovalManagementPage';
import { DocumentManagementPage } from '../pages/documents/DocumentManagementPage';
import { CommunicationTaskManagementPage } from '../pages/communication/CommunicationTaskManagementPage';

// Consolidated Employee & HR Management Pages
import { HrDashboardPage } from '../pages/hr/HrDashboardPage';
import { EmployeeManagementPage } from '../pages/hr/EmployeeManagementPage';
import { AttendanceManagementPage } from '../pages/hr/AttendanceManagementPage';
import { LeaveManagementPage } from '../pages/hr/LeaveManagementPage';
import { PayrollManagementPage } from '../pages/payroll/PayrollManagementPage';
import { TaskManagementPage } from '../pages/hr/TaskManagementPage';
import { PerformanceManagementPage } from '../pages/hr/PerformanceManagementPage';
import { ExpenseManagementPage } from '../pages/hr/ExpenseManagementPage';
import { ExitManagementPage } from '../pages/hr/ExitManagementPage';

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
        <Route path="reports" element={<GenericModuleView title="Platform Reports" />} />
        <Route path="audit-logs" element={<PlatformSettingsPage />} />
        <Route path="settings" element={<PlatformSettingsPage />} />
      </Route>

      {/* 4. Unified Company ERP Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />

        {/* 01. BUSINESS OVERVIEW */}
        <Route path="dashboard" element={<UnifiedDashboard />} />
        <Route path="dashboard-overview" element={<UnifiedDashboard />} />
        <Route path="notifications" element={<GenericModuleView title="Notifications" />} />
        <Route path="calendar" element={<CompanyCalendarPage />} />

        {/* 02. CUSTOMER MANAGEMENT */}
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="customers/groups" element={<CustomerGroupsPage />} />
        <Route path="customers/contacts" element={<CustomerContactsPage />} />
        <Route path="customers/activities" element={<CustomerActivitiesHistoryPage />} />
        <Route path="customers/follow-ups" element={<Navigate to="/app/sales/lead-follow-ups" replace />} />

        {/* 03. COMMUNICATION */}
        <Route path="communication/messages" element={<GenericModuleView title="Messages" />} />
        <Route path="communication/emails" element={<GenericModuleView title="Email History" />} />
        <Route path="communication/announcements" element={<GenericModuleView title="Announcements" />} />
        <Route path="communication/tasks" element={<Navigate to="/app/hr/tasks" replace />} />

        {/* 04. DOCUMENT MANAGEMENT */}
        <Route path="documents" element={<GenericModuleView title="Documents" />} />
        <Route path="documents/templates" element={<GenericModuleView title="Document Templates" />} />
        <Route path="documents/attachments" element={<GenericModuleView title="Attachments" />} />
        <Route path="documents/history" element={<GenericModuleView title="Document History" />} />

        {/* 05. SALES MANAGEMENT (SALES & COMPLETE) */}
        <Route path="sales/overview" element={<ModuleAccessRoute><SalesOverviewPage /></ModuleAccessRoute>} />
        <Route path="sales/dashboard" element={<ModuleAccessRoute><SalesDashboard /></ModuleAccessRoute>} />
        <Route path="sales/targets" element={<ModuleAccessRoute><SalesTargetsPage /></ModuleAccessRoute>} />
        <Route path="sales/performance" element={<ModuleAccessRoute><SalesTargetsPage /></ModuleAccessRoute>} />
        <Route path="sales/team" element={<ModuleAccessRoute><SalesTeamPage /></ModuleAccessRoute>} />
        <Route path="sales/commissions" element={<ModuleAccessRoute><SalesCommissionsPage /></ModuleAccessRoute>} />
        <Route path="sales/activities" element={<ModuleAccessRoute><SalesActivitiesPage /></ModuleAccessRoute>} />
        <Route path="sales/follow-ups" element={<ModuleAccessRoute><CentralFollowUpsPage /></ModuleAccessRoute>} />
        <Route path="sales/proforma-invoices" element={<ModuleAccessRoute><SalesProformaInvoicesPage /></ModuleAccessRoute>} />

        {/* 06. CRM MANAGEMENT (SALES & COMPLETE) */}
        <Route path="sales/crm" element={<ModuleAccessRoute><CrmDashboardPage /></ModuleAccessRoute>} />
        <Route path="sales/crm-pipeline" element={<ModuleAccessRoute><CrmPipelinePage /></ModuleAccessRoute>} />
        <Route path="sales/pipeline" element={<ModuleAccessRoute><CrmPipelinePage /></ModuleAccessRoute>} />
        <Route path="sales/leads" element={<ModuleAccessRoute><LeadsListPage /></ModuleAccessRoute>} />
        <Route path="sales/lead-sources" element={<ModuleAccessRoute><LeadSourcesPage /></ModuleAccessRoute>} />
        <Route path="sales/lead-assignments" element={<ModuleAccessRoute><LeadAssignmentsPage /></ModuleAccessRoute>} />
        <Route path="sales/lead-follow-ups" element={<ModuleAccessRoute><CentralFollowUpsPage /></ModuleAccessRoute>} />
        <Route path="sales/lead-conversion" element={<ModuleAccessRoute><CrmPipelinePage /></ModuleAccessRoute>} />

        <Route path="sales/enquiries" element={<ModuleAccessRoute><EnquiriesListPage /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-assignments" element={<ModuleAccessRoute><GenericModuleView title="Enquiry Assignments" /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-follow-ups" element={<ModuleAccessRoute><Navigate to="/app/sales/lead-follow-ups" replace /></ModuleAccessRoute>} />
        <Route path="sales/enquiry-status" element={<ModuleAccessRoute><GenericModuleView title="Enquiry Status" /></ModuleAccessRoute>} />

        <Route path="sales/quotations" element={<ModuleAccessRoute><SalesQuotationsPage /></ModuleAccessRoute>} />
        <Route path="sales/quotation-templates" element={<ModuleAccessRoute><SalesQuotationTemplatesPage /></ModuleAccessRoute>} />
        <Route path="sales/quotation-approvals" element={<ModuleAccessRoute><SalesQuotationsPage /></ModuleAccessRoute>} />
        <Route path="sales/quotation-history" element={<ModuleAccessRoute><SalesQuotationsPage /></ModuleAccessRoute>} />

        <Route path="sales/orders" element={<ModuleAccessRoute><ConfirmedSalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/order-approvals" element={<ModuleAccessRoute><SalesOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/order-tracking" element={<ModuleAccessRoute><SalesOrderTrackingPage /></ModuleAccessRoute>} />
        <Route path="sales/customers-mgmt" element={<ModuleAccessRoute><CustomerManagementPage /></ModuleAccessRoute>} />
        <Route path="sales/payments-received" element={<ModuleAccessRoute><PaymentsReceivedPage /></ModuleAccessRoute>} />
        <Route path="sales/delivery-management" element={<ModuleAccessRoute><GenericModuleView title="Delivery Management" /></ModuleAccessRoute>} />
        <Route path="sales/returns" element={<ModuleAccessRoute><SalesReturnsPage /></ModuleAccessRoute>} />

        {/* 05. DELIVERY MANAGEMENT */}
        <Route path="delivery/overview" element={<ModuleAccessRoute><GenericModuleView title="Delivery Overview" /></ModuleAccessRoute>} />
        <Route path="delivery/orders" element={<ModuleAccessRoute><GenericModuleView title="Delivery Orders" /></ModuleAccessRoute>} />
        <Route path="delivery/tracking" element={<ModuleAccessRoute><GenericModuleView title="Delivery Tracking" /></ModuleAccessRoute>} />
        <Route path="delivery/shipments" element={<ModuleAccessRoute><GenericModuleView title="Shipment Management" /></ModuleAccessRoute>} />
        <Route path="delivery/returns" element={<ModuleAccessRoute><GenericModuleView title="Delivery Returns" /></ModuleAccessRoute>} />

        {/* 06. CRM EXTENDED */}
        <Route path="sales/crm-pipeline" element={<ModuleAccessRoute><GenericModuleView title="CRM Pipeline" /></ModuleAccessRoute>} />
        <Route path="sales/supplier-groups" element={<ModuleAccessRoute><GenericModuleView title="Supplier Groups" /></ModuleAccessRoute>} />
        <Route path="sales/supplier-contacts" element={<ModuleAccessRoute><GenericModuleView title="Supplier Contacts" /></ModuleAccessRoute>} />

        {/* 09. FINANCE EXTENDED */}
        <Route path="finance/dashboard" element={<FinanceBillingPage />} />

        {/* 14. REPORTS EXTENDED */}
        <Route path="reports/revenue" element={<GenericModuleView title="Revenue Reports" />} />
        <Route path="reports/quotations" element={<GenericModuleView title="Quotation Reports" />} />
        <Route path="reports/orders" element={<GenericModuleView title="Order Reports" />} />
        <Route path="reports/products" element={<GenericModuleView title="Product Reports" />} />
        <Route path="reports/inventory" element={<GenericModuleView title="Inventory Reports" />} />
        <Route path="reports/purchase" element={<GenericModuleView title="Purchase Reports" />} />

        {/* 07. SERVICE MANAGEMENT (SERVICE & COMPLETE) */}
        <Route path="services/dashboard" element={<ModuleAccessRoute><ServicesDashboard /></ModuleAccessRoute>} />
        <Route path="services/requests" element={<ModuleAccessRoute><CustomerServiceRequestsPage /></ModuleAccessRoute>} />
        <Route path="services/customer-request" element={<ModuleAccessRoute><CustomerServiceRequestsPage /></ModuleAccessRoute>} />
        <Route path="services/tickets" element={<ModuleAccessRoute><ServiceTicketsPage /></ModuleAccessRoute>} />
        <Route path="services/ticket-categories" element={<ModuleAccessRoute><GenericModuleView title="Ticket Categories" /></ModuleAccessRoute>} />
        <Route path="services/ticket-assignments" element={<ModuleAccessRoute><GenericModuleView title="Ticket Assignments" /></ModuleAccessRoute>} />
        <Route path="services/ticket-status" element={<ModuleAccessRoute><GenericModuleView title="Ticket Status" /></ModuleAccessRoute>} />
        <Route path="services/ticket-priorities" element={<ModuleAccessRoute><GenericModuleView title="Ticket Priorities" /></ModuleAccessRoute>} />
        <Route path="services/enquiries" element={<ModuleAccessRoute><GenericModuleView title="Service Enquiries" /></ModuleAccessRoute>} />
        <Route path="services/quotations" element={<ModuleAccessRoute><ServiceQuotationsPage /></ModuleAccessRoute>} />
        <Route path="services/orders" element={<ModuleAccessRoute><GenericModuleView title="Service Orders" /></ModuleAccessRoute>} />
        <Route path="services/jobs" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/work-orders" element={<ModuleAccessRoute><ServiceJobsPage /></ModuleAccessRoute>} />
        <Route path="services/scheduling" element={<ModuleAccessRoute><ServiceSchedulingPage /></ModuleAccessRoute>} />
        <Route path="services/technicians" element={<ModuleAccessRoute><ServiceTechniciansPage /></ModuleAccessRoute>} />
        <Route path="services/technician-assignments" element={<ModuleAccessRoute><GenericModuleView title="Technician Assignment" /></ModuleAccessRoute>} />
        <Route path="services/visit-management" element={<ModuleAccessRoute><GenericModuleView title="Service Visits" /></ModuleAccessRoute>} />
        <Route path="services/job-cards" element={<ModuleAccessRoute><GenericModuleView title="Job Cards" /></ModuleAccessRoute>} />
        <Route path="services/warranty" element={<ModuleAccessRoute><ServiceWarrantyPage /></ModuleAccessRoute>} />
        <Route path="services/amc" element={<ModuleAccessRoute><ServiceAmcPage /></ModuleAccessRoute>} />
        <Route path="services/service-contracts" element={<ModuleAccessRoute><GenericModuleView title="Service Contracts" /></ModuleAccessRoute>} />
        <Route path="services/preventive-maintenance" element={<ModuleAccessRoute><GenericModuleView title="Preventive Maintenance" /></ModuleAccessRoute>} />
        <Route path="services/complaints" element={<ModuleAccessRoute><GenericModuleView title="Complaint Management" /></ModuleAccessRoute>} />
        <Route path="services/tracking" element={<ModuleAccessRoute><GenericModuleView title="Service Tracking" /></ModuleAccessRoute>} />
        <Route path="services/completion" element={<ModuleAccessRoute><GenericModuleView title="Service Completion" /></ModuleAccessRoute>} />
        <Route path="services/sla-management" element={<ModuleAccessRoute><GenericModuleView title="SLA Management" /></ModuleAccessRoute>} />
        <Route path="services/feedback" element={<ModuleAccessRoute><ServiceFeedbackPage /></ModuleAccessRoute>} />
        <Route path="services/history" element={<ModuleAccessRoute><GenericModuleView title="Service History" /></ModuleAccessRoute>} />
        <Route path="services/parts-consumption" element={<ModuleAccessRoute><GenericModuleView title="Parts & Materials Used" /></ModuleAccessRoute>} />
        <Route path="services/spare-parts" element={<ModuleAccessRoute><ServiceSparesPage /></ModuleAccessRoute>} />
        <Route path="services/billing" element={<ModuleAccessRoute><ServiceBillingPage /></ModuleAccessRoute>} />
        <Route path="services/service-invoices" element={<ModuleAccessRoute><GenericModuleView title="Service Invoices" /></ModuleAccessRoute>} />

        {/* 08. PROJECT MANAGEMENT */}
        <Route path="projects/overview" element={<GenericModuleView title="Project Overview" />} />
        <Route path="projects/list" element={<GenericModuleView title="Projects" />} />
        <Route path="projects/tasks" element={<GenericModuleView title="Project Tasks" />} />
        <Route path="projects/task-assignment" element={<GenericModuleView title="Task Assignment" />} />
        <Route path="projects/milestones" element={<GenericModuleView title="Project Milestones" />} />
        <Route path="projects/progress" element={<GenericModuleView title="Project Progress" />} />

        {/* 09. ASSET MANAGEMENT (ALL 8 DEDICATED SUITE PAGES) */}
        <Route path="assets" element={<Navigate to="/app/assets/overview" replace />} />
        <Route path="assets/overview" element={<AssetOverviewPage />} />
        <Route path="assets/register" element={<AllAssetsPage />} />
        <Route path="assets/categories" element={<AssetCategoriesPage />} />
        <Route path="assets/allocation" element={<AssetAllocationPage />} />
        <Route path="assets/transfers" element={<AssetTransfersPage />} />
        <Route path="assets/maintenance" element={<AssetMaintenancePage />} />
        <Route path="assets/disposal" element={<AssetDisposalPage />} />
        <Route path="assets/history" element={<AssetHistoryPage />} />

        {/* 08. PRODUCT MANAGEMENT */}
        <Route path="sales/products" element={<ModuleAccessRoute><AllProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/brands" element={<ModuleAccessRoute><BrandManagementPage /></ModuleAccessRoute>} />
        <Route path="sales/brand-products" element={<ModuleAccessRoute><BrandWiseProductsPage /></ModuleAccessRoute>} />
        <Route path="sales/product-categories" element={<ModuleAccessRoute><ProductCategoriesPage /></ModuleAccessRoute>} />
        <Route path="sales/price-lists" element={<ModuleAccessRoute><ProductPricingPage /></ModuleAccessRoute>} />
        <Route path="sales/discounts" element={<ModuleAccessRoute><ProductPricingPage /></ModuleAccessRoute>} />
        <Route path="sales/uom" element={<ModuleAccessRoute><GenericModuleView title="Units of Measurement" /></ModuleAccessRoute>} />

        {/* 11. INVENTORY MANAGEMENT */}
        <Route path="sales/inventory" element={<ModuleAccessRoute><InventoryOverviewPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-management" element={<ModuleAccessRoute><StockManagementPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-in-out" element={<ModuleAccessRoute><StockInOutPage /></ModuleAccessRoute>} />
        <Route path="sales/low-stock-alerts" element={<ModuleAccessRoute><LowStockAlertsPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-transfers" element={<ModuleAccessRoute><StockTransfersPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-adjustments" element={<ModuleAccessRoute><StockAdjustmentsPage /></ModuleAccessRoute>} />
        <Route path="sales/warehouses" element={<ModuleAccessRoute><WarehouseManagementPage /></ModuleAccessRoute>} />
        <Route path="sales/inventory-reports" element={<ModuleAccessRoute><InventoryAnalyticsReportsPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-valuation" element={<ModuleAccessRoute><InventoryAnalyticsReportsPage /></ModuleAccessRoute>} />
        <Route path="sales/reorder-levels" element={<ModuleAccessRoute><LowStockAlertsPage /></ModuleAccessRoute>} />
        <Route path="sales/stock-history" element={<ModuleAccessRoute><StockInOutPage /></ModuleAccessRoute>} />
        <Route path="sales/batch-serial" element={<ModuleAccessRoute><InventoryAnalyticsReportsPage /></ModuleAccessRoute>} />

        {/* 12. PURCHASE MANAGEMENT */}
        <Route path="sales/purchases" element={<ModuleAccessRoute><PurchaseOverviewPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-orders" element={<ModuleAccessRoute><PurchaseOrdersPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-bills" element={<ModuleAccessRoute><PurchaseInvoicesBillsPage /></ModuleAccessRoute>} />
        <Route path="sales/payments-made" element={<ModuleAccessRoute><PaymentsMadePage /></ModuleAccessRoute>} />
        <Route path="sales/grn" element={<ModuleAccessRoute><GoodsReceivedPage /></ModuleAccessRoute>} />
        <Route path="sales/suppliers" element={<ModuleAccessRoute><SuppliersPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-returns" element={<ModuleAccessRoute><PurchaseReturnsPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-analytics" element={<ModuleAccessRoute><PurchaseAnalyticsPage /></ModuleAccessRoute>} />
        <Route path="sales/purchase-requisitions" element={<ModuleAccessRoute><GenericModuleView title="Purchase Requisitions" /></ModuleAccessRoute>} />
        <Route path="sales/supplier-payments" element={<ModuleAccessRoute><GenericModuleView title="Supplier Payments" /></ModuleAccessRoute>} />

        {/* 13. FINANCE & ACCOUNTS */}
        <Route path="billing" element={<AllInvoicesPage />} />
        <Route path="finance/invoices" element={<AllInvoicesPage />} />
        <Route path="finance/create-invoice" element={<CreateInvoicePage />} />
        <Route path="sales/invoices" element={<AllInvoicesPage />} />
        <Route path="finance/chart-of-accounts" element={<ChartOfAccountsPage />} />
        <Route path="finance/bank-reconciliation" element={<BankReconciliationPage />} />
        <Route path="finance/ar-ap" element={<AccountsReceivablePayablePage />} />
        <Route path="finance/notes" element={<UnifiedNotesPage />} />
        <Route path="finance/credit-debit-notes" element={<UnifiedNotesPage />} />
        <Route path="finance/gst/e-invoice" element={<EInvoicePage />} />
        <Route path="finance/gst/e-way-bill" element={<EWayBillPage />} />
        <Route path="finance/gst/reports" element={<GstReportsPage />} />
        <Route path="finance/proforma-invoices" element={<GenericModuleView title="Proforma Invoices" />} />
        <Route path="finance/recurring-invoices" element={<GenericModuleView title="Recurring Invoices" />} />
        <Route path="finance/credit-notes" element={<CreditNotesPage />} />
        <Route path="finance/debit-notes" element={<DebitNotesPage />} />
        <Route path="finance/creditors" element={<CreditorsPage />} />
        <Route path="finance/debtors" element={<DebtorsPage />} />
        <Route path="finance/general-ledger" element={<GenericModuleView title="General Ledger" />} />
        <Route path="finance/journal-entries" element={<GenericModuleView title="Journal Entries" />} />
        <Route path="finance/cash-flow" element={<GenericModuleView title="Cash Flow" />} />
        <Route path="finance/income" element={<GenericModuleView title="Income" />} />
        <Route path="finance/balance-sheet" element={<GenericModuleView title="Balance Sheet" />} />
        <Route path="finance/invoice-templates" element={<GenericModuleView title="Invoice Templates" />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="finance/payment-history" element={<GenericModuleView title="Payment History" />} />
        <Route path="finance/refunds" element={<GenericModuleView title="Refund Management" />} />
        <Route path="finance/reconciliation" element={<GenericModuleView title="Payment Reconciliation" />} />
        <Route path="finance/receivables" element={<OutstandingReceivablesPage />} />
        <Route path="finance/payables" element={<OutstandingPayablesPage />} />
        <Route path="finance/expenses" element={<GenericModuleView title="Expenses" />} />
        <Route path="finance/tax" element={<TaxConfigurationPage />} />
        <Route path="finance/bank-cash" element={<GenericModuleView title="Cash & Bank" />} />
        <Route path="finance/profit-loss" element={<GenericModuleView title="Profit & Loss" />} />

        {/* 12. APPROVAL MANAGEMENT */}
        <Route path="approvals" element={<ApprovalManagementPage />} />
        <Route path="approvals/pending" element={<ApprovalManagementPage />} />
        <Route path="approvals/workflows" element={<ApprovalManagementPage />} />
        <Route path="approvals/history" element={<ApprovalManagementPage />} />

        {/* 14. ENTERPRISE DELIVERY, DOCUMENTS & COMMUNICATION */}
        <Route path="delivery" element={<DeliveryManagementPage />} />
        <Route path="delivery/overview" element={<DeliveryManagementPage />} />
        <Route path="documents" element={<DocumentManagementPage />} />
        <Route path="documents/overview" element={<DocumentManagementPage />} />
        <Route path="communication" element={<CommunicationTaskManagementPage />} />
        <Route path="communication/tasks" element={<CommunicationTaskManagementPage />} />

        {/* 13. REPORTS & ANALYTICS (7 DEDICATED SUITE PAGES) */}
        <Route path="reports" element={<Navigate to="/app/reports/sales" replace />} />
        <Route path="reports/sales" element={<SalesReportsPage />} />
        <Route path="reports/purchase" element={<PurchaseReportsPage />} />
        <Route path="reports/inventory" element={<InventoryReportsPage />} />
        <Route path="reports/customers" element={<CustomerReportsPage />} />
        <Route path="reports/financial" element={<FinancialReportsPage />} />
        <Route path="reports/outstanding" element={<OutstandingReportsPage />} />
        <Route path="reports/hr" element={<HrReportsPage />} />
        <Route path="reports/service" element={<GenericModuleView title="Service Reports" />} />
        <Route path="reports/activities" element={<GenericModuleView title="Activity Reports" />} />
        <Route path="reports/custom" element={<GenericModuleView title="Custom Reports" />} />

        {/* 14. ENTERPRISE PORTALS */}
        <Route path="portal/customer" element={<CustomerPortal />} />
        <Route path="portal/office-staff" element={<OfficeStaffPortalPage />} />
        <Route path="portal/supplier" element={<SupplierPortal />} />
        <Route path="portal/technician" element={<EmployeePortal />} />

        {/* 15. EMPLOYEE & HR MANAGEMENT (CONSOLIDATED 9 MAIN PAGES) */}
        <Route path="hr/dashboard" element={<HrDashboardPage />} />
        <Route path="hr/employees" element={<EmployeeManagementPage />} />
        <Route path="hr/attendance" element={<AttendanceManagementPage />} />
        <Route path="hr/leave" element={<LeaveManagementPage />} />
        <Route path="hr/payroll" element={<PayrollManagementPage />} />
        <Route path="hr/payslips" element={<GenericModuleView title="Employee Payslips" />} />
        <Route path="hr/tasks" element={<TaskManagementPage />} />
        <Route path="hr/performance" element={<PerformanceManagementPage />} />
        <Route path="hr/expenses" element={<ExpenseManagementPage />} />
        <Route path="hr/exit" element={<ExitManagementPage />} />

        {/* Backward-Compatible Submenu Aliases & Redirects for HR */}
        <Route path="hr/all-employees" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/add-employee" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/employee-profiles" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/departments" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/designations" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/branch-allocation" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/employee-documents" element={<Navigate to="/app/hr/employees" replace />} />
        <Route path="hr/employee-status" element={<Navigate to="/app/hr/employees" replace />} />

        <Route path="hr/attendance-dashboard" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/daily-attendance" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/checkin-checkout" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/manual-attendance" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/biometric-attendance" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/late-arrivals" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/early-checkouts" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/half-day-records" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/absentees" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/overtime-tracking" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/attendance-regularization" element={<Navigate to="/app/hr/attendance" replace />} />
        <Route path="hr/attendance-reports" element={<Navigate to="/app/hr/attendance" replace />} />

        <Route path="hr/apply-leave" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/leave-requests" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/leave-approval" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/leave-types" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/leave-balance" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/holiday-calendar" element={<Navigate to="/app/hr/leave" replace />} />
        <Route path="hr/leave-reports" element={<Navigate to="/app/hr/leave" replace />} />

        <Route path="hr/payroll-dashboard" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/salary-structure" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/employee-salary-setup" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/allowances" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/deductions" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/overtime-calculation" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/payroll-processing" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/monthly-salary-generation" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/payslip-generation" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/salary-payment" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/bonus-incentives" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/advance-salary" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/loan-management" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/arrears-adjustments" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/payroll-approval" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/tax-statutory-deductions" element={<Navigate to="/app/hr/payroll" replace />} />
        <Route path="hr/payroll-reports" element={<Navigate to="/app/hr/payroll" replace />} />

        <Route path="hr/task-dashboard" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/create-task" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/assign-tasks" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/my-tasks" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/team-tasks" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-priorities" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-categories" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-deadlines" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-progress" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-comments" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-reassignment" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/task-approval" element={<Navigate to="/app/hr/tasks" replace />} />
        <Route path="hr/completed-tasks" element={<Navigate to="/app/hr/tasks" replace />} />

        <Route path="hr/performance-dashboard" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/individual-performance" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/team-performance" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/sales-target-achievement" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/technician-job-performance" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/productivity-reports" element={<Navigate to="/app/hr/performance" replace />} />
        <Route path="hr/performance-reviews" element={<Navigate to="/app/hr/performance" replace />} />

        <Route path="hr/expense-claims" element={<Navigate to="/app/hr/expenses" replace />} />
        <Route path="hr/travel-allowances" element={<Navigate to="/app/hr/expenses" replace />} />
        <Route path="hr/fuel-expenses" element={<Navigate to="/app/hr/expenses" replace />} />
        <Route path="hr/reimbursements" element={<Navigate to="/app/hr/expenses" replace />} />
        <Route path="hr/expense-approvals" element={<Navigate to="/app/hr/expenses" replace />} />

        <Route path="hr/resignation-requests" element={<Navigate to="/app/hr/exit" replace />} />
        <Route path="hr/exit-approval" element={<Navigate to="/app/hr/exit" replace />} />
        <Route path="hr/notice-period-tracking" element={<Navigate to="/app/hr/exit" replace />} />
        <Route path="hr/fnf-settlement" element={<Navigate to="/app/hr/exit" replace />} />
        <Route path="hr/employee-history" element={<Navigate to="/app/hr/exit" replace />} />

        {/* 16. SETTINGS */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/branches" element={<GenericModuleView title="Branch Management" />} />
        <Route path="settings/users" element={<UserManagementPage />} />
        <Route path="settings/roles" element={<RolesPermissionsPage />} />
        <Route path="settings/modules" element={<ERPPlans />} />
        <Route path="settings/subscription" element={<SubscriptionManagementPage />} />
        <Route path="settings/tax" element={<TaxConfigurationPage />} />
        <Route path="settings/payments" element={<GenericModuleView title="Payment Settings" />} />
        <Route path="settings/notifications" element={<GenericModuleView title="Notification Settings" />} />
        <Route path="settings/integrations" element={<GenericModuleView title="Integrations" />} />
        <Route path="settings/import-export" element={<GenericModuleView title="Import / Export" />} />
        <Route path="settings/audit-logs" element={<GenericModuleView title="Audit Logs" />} />
        <Route path="settings/system" element={<PlatformSettingsPage />} />
      </Route>

      {/* Redirects & 404 */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
