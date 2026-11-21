import { SIDEBAR_NAVIGATION_CONFIG, getFilteredNavigation, NavSectionConfig, NavItemConfig } from './navigation';
import type { ErpPackageId } from './erpPackageConfig';

export interface SubMenuItemConfig {
  key: string;
  label: string;
  path?: string;
  iconName?: string;
  allowedRoles?: string[];
  allowedPackages?: ErpPackageId[];
  children?: SubMenuItemConfig[];
}

export interface MenuGroupConfig {
  key: string;
  label: string;
  iconName: string;
  path?: string;
  section: 'common' | 'sales' | 'services';
  allowedPackages: ErpPackageId[];
  allowedRoles?: string[];
  children?: SubMenuItemConfig[];
}

// Convert SIDEBAR_NAVIGATION_CONFIG into MenuGroupConfig format for seamless backward compatibility
export const SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = SIDEBAR_NAVIGATION_CONFIG.map((nav) => ({
  key: nav.key,
  label: nav.label,
  iconName: nav.iconName,
  path: nav.route,
  section: 'sales',
  allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
  children: nav.children?.map((child) => ({
    key: child.key,
    label: child.label,
    path: child.route,
    iconName: child.icon?.name || 'FileText',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
  })),
}));

import { SERVICE_SIDEBAR_MENU_GROUPS } from './serviceSidebarConfig';

export function getMenuGroupsForPackage(packageType: ErpPackageId, userRole?: string): MenuGroupConfig[] {
  if (packageType === 'SERVICE') {
    return SERVICE_SIDEBAR_MENU_GROUPS;
  }

  const filtered = getFilteredNavigation(userRole);
  return filtered.map((nav) => ({
    key: nav.key,
    label: nav.label,
    iconName: nav.iconName,
    path: nav.route,
    section: 'sales',
    allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    children: nav.children?.map((child) => ({
      key: child.key,
      label: child.label,
      path: child.route,
      iconName: child.icon?.name || 'FileText',
      allowedPackages: ['COMPLETE', 'SALES', 'SERVICE'],
    })),
  }));
}
