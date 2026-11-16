import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SIDEBAR_MENU_GROUPS } from '../config/menuConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';

interface ModuleAccessRouteProps {
  children: React.ReactNode;
}

export const ModuleAccessRoute: React.FC<ModuleAccessRouteProps> = ({ children }) => {
  const { selectedCompany } = useAuth();
  const location = useLocation();

  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const normalizedPath = location.pathname.replace(/\/$/, '');

  // Find parent group that owns this path
  const matchingGroup = SIDEBAR_MENU_GROUPS.find((group) =>
    group.children.some((child) => child.path === normalizedPath)
  );

  // If path matches a group and current company ERP package is not allowed, block access
  if (matchingGroup && !matchingGroup.allowedPackages.includes(currentPkg)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
