import { ERP_MODULES, ModuleConfig, ErpPackage } from '../config/modules.config';

/**
 * Filter modules for a specific company ERP package.
 * Guarantees that:
 * - Common modules are included exactly once (no duplication).
 * - Sales modules appear only if allowed for the package.
 * - Services modules appear only if allowed for the package.
 */
export function getAuthorizedModules(packageType: ErpPackage): ModuleConfig[] {
  return ERP_MODULES.filter((module) => module.allowedPackages.includes(packageType));
}

/**
 * Check whether a specific path is authorized under the given package.
 */
export function isRouteAuthorized(path: string, packageType: ErpPackage): boolean {
  // Normalize path
  const normalized = path.replace(/\/$/, '');
  const matchedModule = ERP_MODULES.find((m) => m.path === normalized);

  if (!matchedModule) {
    return true; // Allow non-module routes like profile, general etc.
  }

  return matchedModule.allowedPackages.includes(packageType);
}
