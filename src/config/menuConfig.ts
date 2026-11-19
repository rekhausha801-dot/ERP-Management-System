import type { ErpPackageId } from './erpPackageConfig';
import { SERVICE_SIDEBAR_MENU_GROUPS } from './serviceSidebarConfig';
import { ADMIN_FULL_SIDEBAR_GROUPS } from './adminSidebarConfig';

export interface SubMenuItemConfig {
  key: string;
  label: string;
  path?: string;
  iconName?: string;
  allowedRoles?: string[];
  children?: SubMenuItemConfig[];
}

export interface MenuGroupConfig {
  key: string;
  label: string;
  iconName: string;
  section: 'common' | 'sales' | 'services';
  allowedPackages: ErpPackageId[];
  children: SubMenuItemConfig[];
}

// Full Admin Sidebar Groups are imported from the dedicated adminSidebarConfig.ts file
export const SIDEBAR_MENU_GROUPS: MenuGroupConfig[] = ADMIN_FULL_SIDEBAR_GROUPS;

/**
 * Filter collapsible menu groups for current package and user role
 */
export function getMenuGroupsForPackage(packageType: ErpPackageId, userRole?: string): MenuGroupConfig[] {
  // Always return the complete full Admin sidebar groups for all views
  if (packageType === 'SERVICE') {
    return ADMIN_FULL_SIDEBAR_GROUPS.filter((group) => group.allowedPackages.includes('SERVICE'));
  }

  return ADMIN_FULL_SIDEBAR_GROUPS.filter((group) => group.allowedPackages.includes(packageType));
}
