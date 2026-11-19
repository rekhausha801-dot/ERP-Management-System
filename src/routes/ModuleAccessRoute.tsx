import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_MENU_GROUPS } from '../config/menuConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';

interface ModuleAccessRouteProps {
  children: React.ReactNode;
}

export const ModuleAccessRoute: React.FC<ModuleAccessRouteProps> = ({ children }) => {
  const { selectedCompany, user } = useAuth();
  const location = useLocation();

  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const normalizedPath = location.pathname.replace(/\/$/, '');

  // Restrict Office Staff users strictly to Office Staff Portal & Service Tickets
  if (user?.role === 'office_staff') {
    const allowedForStaff = [
      '/app/portal/office-staff',
      '/app/services/tickets',
      '/app/services/requests',
    ];
    const isAllowed = allowedForStaff.some((p) => normalizedPath.startsWith(p));
    if (!isAllowed) {
      return <Navigate to="/app/portal/office-staff" replace />;
    }
  }

  // Recursive helper to check if a group owns the path
  const groupContainsPath = (group: any): boolean => {
    const checkChildren = (items: any[]): boolean => {
      for (const item of items) {
        if (item.path === normalizedPath) return true;
        if (item.children && checkChildren(item.children)) return true;
      }
      return false;
    };
    return checkChildren(group.children || []);
  };

  // Find parent group that owns this path
  const matchingGroup = SIDEBAR_MENU_GROUPS.find((group) => groupContainsPath(group));

  // If path matches a group and current company ERP package is not allowed, block access
  if (matchingGroup && !matchingGroup.allowedPackages.includes(currentPkg)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
