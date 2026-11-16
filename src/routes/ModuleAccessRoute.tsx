import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../config/menuConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';

interface ModuleAccessRouteProps {
  children: React.ReactNode;
}

export const ModuleAccessRoute: React.FC<ModuleAccessRouteProps> = ({ children }) => {
  const { selectedCompany } = useAuth();
  const location = useLocation();

  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';

  // Normalize path
  const normalizedPath = location.pathname.replace(/\/$/, '');
  const matchedMenuItem = MENU_ITEMS.find((m) => m.path === normalizedPath);

  if (matchedMenuItem && !matchedMenuItem.allowedPackages.includes(currentPkg)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
