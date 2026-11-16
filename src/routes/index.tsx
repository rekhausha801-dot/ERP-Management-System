import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { GenericModulePlaceholder } from '../pages/GenericModulePlaceholder';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="companies"
          element={
            <GenericModulePlaceholder
              title="Companies"
              description="Manage multiple legal entities, business units, branches, and regional compliance."
            />
          }
        />
        <Route
          path="employees"
          element={
            <GenericModulePlaceholder
              title="Employees"
              description="Full lifecycle employee directory, department allocation, salary details, and onboarding."
            />
          }
        />
        <Route
          path="workers"
          element={
            <GenericModulePlaceholder
              title="Workers"
              description="Labor and contractor management, daily wage registers, skill sets, and site assignments."
            />
          }
        />
        <Route
          path="attendance"
          element={
            <GenericModulePlaceholder
              title="Attendance"
              description="Biometric and daily shift attendance tracking for staff and on-site workers."
            />
          }
        />
        <Route
          path="projects"
          element={
            <GenericModulePlaceholder
              title="Projects"
              description="Project budgets, client timelines, milestones, completion tracking, and team staffing."
            />
          }
        />
        <Route
          path="works"
          element={
            <GenericModulePlaceholder
              title="Works"
              description="Daily site work orders, task assignments, and progress verification."
            />
          }
        />
        <Route
          path="payroll"
          element={
            <GenericModulePlaceholder
              title="Payroll"
              description="Salary computation, allowances, deductions, payslip generation, and disbursements."
            />
          }
        />
        <Route
          path="inventory"
          element={
            <GenericModulePlaceholder
              title="Inventory"
              description="Warehouse stock, material tracking, SKU counts, reorder alerts, and site dispatches."
            />
          }
        />
        <Route
          path="purchases"
          element={
            <GenericModulePlaceholder
              title="Purchases"
              description="Procurement orders, vendor management, quotes, and goods receipt notes (GRN)."
            />
          }
        />
        <Route
          path="billing"
          element={
            <GenericModulePlaceholder
              title="Billing"
              description="Customer invoicing, payment terms, outstanding receivables, and tax summaries."
            />
          }
        />
        <Route
          path="reports"
          element={
            <GenericModulePlaceholder
              title="Reports"
              description="Executive analytics, financial reports, labor cost analysis, and custom data exports."
            />
          }
        />
        <Route
          path="settings"
          element={
            <GenericModulePlaceholder
              title="Settings"
              description="System preferences, user roles, security access controls, and organization config."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
