import { useState } from 'react';
import {
  CompanyAsset,
  AssetCategory,
  AssetAllocationRecord,
  AssetTransferRecord,
  AssetMaintenanceRecord,
  AssetDisposalRecord,
  AssetHistoryRecord,
} from './assetsData';
import {
  INITIAL_ASSETS,
  INITIAL_CATEGORIES,
  INITIAL_ALLOCATIONS,
  INITIAL_TRANSFERS,
  INITIAL_MAINTENANCE,
  INITIAL_DISPOSALS,
  INITIAL_ASSET_HISTORY,
} from './assetsMockData';

const STORAGE_KEYS = {
  ASSETS: 'erp_assets_list',
  CATEGORIES: 'erp_assets_categories',
  ALLOCATIONS: 'erp_assets_allocations',
  TRANSFERS: 'erp_assets_transfers',
  MAINTENANCE: 'erp_assets_maintenance',
  DISPOSALS: 'erp_assets_disposals',
  HISTORY: 'erp_assets_history',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error for', key, err);
  }
}

export function useAssetsDatabase() {
  const [assets, setAssets] = useState<CompanyAsset[]>(() =>
    loadStorage(STORAGE_KEYS.ASSETS, INITIAL_ASSETS)
  );
  const [categories, setCategories] = useState<AssetCategory[]>(() =>
    loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [allocations, setAllocations] = useState<AssetAllocationRecord[]>(() =>
    loadStorage(STORAGE_KEYS.ALLOCATIONS, INITIAL_ALLOCATIONS)
  );
  const [transfers, setTransfers] = useState<AssetTransferRecord[]>(() =>
    loadStorage(STORAGE_KEYS.TRANSFERS, INITIAL_TRANSFERS)
  );
  const [maintenanceRecords, setMaintenanceRecords] = useState<AssetMaintenanceRecord[]>(() =>
    loadStorage(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE)
  );
  const [disposals, setDisposals] = useState<AssetDisposalRecord[]>(() =>
    loadStorage(STORAGE_KEYS.DISPOSALS, INITIAL_DISPOSALS)
  );
  const [historyRecords, setHistoryRecords] = useState<AssetHistoryRecord[]>(() =>
    loadStorage(STORAGE_KEYS.HISTORY, INITIAL_ASSET_HISTORY)
  );

  // Helper to log audit history automatically
  const logHistory = (
    assetId: string,
    assetName: string,
    activityType: AssetHistoryRecord['activityType'],
    previousValue: string,
    updatedValue: string,
    remarks: string,
    referenceNumber: string = 'REF-' + Date.now().toString().slice(-4),
    performedBy: string = 'Current Administrator'
  ) => {
    const newEntry: AssetHistoryRecord = {
      id: 'HST-' + Date.now(),
      historyId: 'HST-2026-' + Math.floor(100 + Math.random() * 900),
      assetId,
      assetName,
      activityType,
      previousValue,
      updatedValue,
      activityDate: new Date().toISOString().split('T')[0],
      performedBy,
      department: 'Asset Administration',
      branch: 'Chennai HQ',
      referenceNumber,
      remarks,
    };
    setHistoryRecords((prev) => {
      const updated = [newEntry, ...prev];
      saveStorage(STORAGE_KEYS.HISTORY, updated);
      return updated;
    });
  };

  // 1. Assets CRUD
  const addAsset = (newAsset: Omit<CompanyAsset, 'id'>) => {
    const item: CompanyAsset = {
      ...newAsset,
      id: 'AST-' + Date.now(),
    };
    setAssets((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });
    logHistory(
      item.assetId,
      item.assetName,
      'Asset Created',
      'None',
      `Registered with Cost ₹${item.purchaseCost.toLocaleString('en-IN')}`,
      'New asset added to register'
    );
  };

  const updateAsset = (id: string, updates: Partial<CompanyAsset>) => {
    setAssets((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      saveStorage(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });
    const target = assets.find((a) => a.id === id);
    if (target) {
      logHistory(
        target.assetId,
        target.assetName,
        'Asset Updated',
        'Previous specs',
        'Updated asset master details',
        'Asset details modified'
      );
    }
  };

  // 2. Categories
  const addCategory = (newCat: Omit<AssetCategory, 'id'>) => {
    const item: AssetCategory = { ...newCat, id: 'CAT-' + Date.now() };
    setCategories((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.CATEGORIES, updated);
      return updated;
    });
  };

  const updateCategory = (id: string, updates: Partial<AssetCategory>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveStorage(STORAGE_KEYS.CATEGORIES, updated);
      return updated;
    });
  };

  // 3. Allocations
  const createAllocation = (newAlc: Omit<AssetAllocationRecord, 'id' | 'allocationId'>) => {
    const allocationId = 'ALC-2026-' + Math.floor(10 + Math.random() * 90);
    const item: AssetAllocationRecord = {
      ...newAlc,
      id: 'ALC-' + Date.now(),
      allocationId,
    };
    setAllocations((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.ALLOCATIONS, updated);
      return updated;
    });

    // Update target asset status to Allocated
    setAssets((prev) => {
      const updated = prev.map((a) =>
        a.assetId === newAlc.assetId
          ? {
              ...a,
              status: 'Allocated' as const,
              assignedEmployeeName: newAlc.assignedTo,
              department: newAlc.department,
              branch: newAlc.branch,
            }
          : a
      );
      saveStorage(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });

    logHistory(
      newAlc.assetId,
      newAlc.assetName,
      'Asset Allocated',
      'Available in Central Pool',
      `Allocated to ${newAlc.assignedTo} (${newAlc.department})`,
      'Asset assigned and handed over',
      allocationId
    );
  };

  const returnAsset = (
    allocationId: string,
    returnDate: string,
    conditionAtReturn: CompanyAsset['condition'],
    remarks: string
  ) => {
    let targetAssetId = '';
    let targetAssetName = '';
    setAllocations((prev) => {
      const updated = prev.map((item) => {
        if (item.allocationId === allocationId) {
          targetAssetId = item.assetId;
          targetAssetName = item.assetName;
          return {
            ...item,
            allocationStatus: 'Returned' as const,
            actualReturnDate: returnDate,
            conditionAtReturn,
            handoverNotes: remarks,
          };
        }
        return item;
      });
      saveStorage(STORAGE_KEYS.ALLOCATIONS, updated);
      return updated;
    });

    if (targetAssetId) {
      setAssets((prev) => {
        const updated = prev.map((a) =>
          a.assetId === targetAssetId
            ? {
                ...a,
                status: 'Available' as const,
                assignedEmployeeName: undefined,
                assignedEmployeeId: undefined,
                condition: conditionAtReturn,
              }
            : a
        );
        saveStorage(STORAGE_KEYS.ASSETS, updated);
        return updated;
      });

      logHistory(
        targetAssetId,
        targetAssetName,
        'Asset Returned',
        'Allocated',
        `Returned into Stock (${conditionAtReturn})`,
        remarks,
        allocationId
      );
    }
  };

  // 4. Transfers
  const createTransfer = (newTrf: Omit<AssetTransferRecord, 'id' | 'transferId'>) => {
    const transferId = 'TRF-2026-' + Math.floor(10 + Math.random() * 90);
    const item: AssetTransferRecord = {
      ...newTrf,
      id: 'TRF-' + Date.now(),
      transferId,
    };
    setTransfers((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.TRANSFERS, updated);
      return updated;
    });

    logHistory(
      newTrf.assetId,
      newTrf.assetName,
      'Asset Transferred',
      `${newTrf.fromBranch} (${newTrf.fromDepartment})`,
      `Transfer initiated to ${newTrf.toBranch} (${newTrf.toDepartment})`,
      newTrf.transferReason,
      transferId
    );
  };

  const completeTransfer = (transferId: string) => {
    setTransfers((prev) => {
      const updated = prev.map((t) => {
        if (t.transferId === transferId) {
          // Also update Asset location
          setAssets((aPrev) => {
            const aUpdated = aPrev.map((a) =>
              a.assetId === t.assetId
                ? {
                    ...a,
                    branch: t.toBranch,
                    department: t.toDepartment,
                    room: t.toLocation,
                    assignedEmployeeName: t.toEmployee || a.assignedEmployeeName,
                  }
                : a
            );
            saveStorage(STORAGE_KEYS.ASSETS, aUpdated);
            return aUpdated;
          });

          return { ...t, transferStatus: 'Completed' as const, approvalStatus: 'Approved' as const };
        }
        return t;
      });
      saveStorage(STORAGE_KEYS.TRANSFERS, updated);
      return updated;
    });
  };

  // 5. Maintenance
  const createMaintenance = (newMnt: Omit<AssetMaintenanceRecord, 'id' | 'maintenanceId'>) => {
    const maintenanceId = 'MNT-2026-' + Math.floor(10 + Math.random() * 90);
    const item: AssetMaintenanceRecord = {
      ...newMnt,
      id: 'MNT-' + Date.now(),
      maintenanceId,
    };
    setMaintenanceRecords((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.MAINTENANCE, updated);
      return updated;
    });

    // Mark asset status as Under Maintenance
    setAssets((prev) => {
      const updated = prev.map((a) =>
        a.assetId === newMnt.assetId ? { ...a, status: 'Under Maintenance' as const } : a
      );
      saveStorage(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });

    logHistory(
      newMnt.assetId,
      newMnt.assetName,
      'Maintenance Requested',
      'Operational',
      `Logged ${newMnt.maintenanceType} maintenance (${newMnt.priority})`,
      newMnt.issueDescription,
      maintenanceId
    );
  };

  const completeMaintenance = (maintenanceId: string, actualCost: number, partsReplaced: string) => {
    let targetAssetId = '';
    let targetAssetName = '';
    setMaintenanceRecords((prev) => {
      const updated = prev.map((m) => {
        if (m.maintenanceId === maintenanceId) {
          targetAssetId = m.assetId;
          targetAssetName = m.assetName;
          return {
            ...m,
            maintenanceStatus: 'Completed' as const,
            completionDate: new Date().toISOString().split('T')[0],
            actualCost,
            partsReplaced,
          };
        }
        return m;
      });
      saveStorage(STORAGE_KEYS.MAINTENANCE, updated);
      return updated;
    });

    if (targetAssetId) {
      setAssets((prev) => {
        const updated = prev.map((a) =>
          a.assetId === targetAssetId ? { ...a, status: 'Active' as const, condition: 'Good' as const } : a
        );
        saveStorage(STORAGE_KEYS.ASSETS, updated);
        return updated;
      });

      logHistory(
        targetAssetId,
        targetAssetName,
        'Maintenance Completed',
        'Under Maintenance',
        `Restored to Active Condition (Cost: ₹${actualCost.toLocaleString('en-IN')})`,
        `Parts: ${partsReplaced}`,
        maintenanceId
      );
    }
  };

  // 6. Disposal
  const createDisposal = (newDsp: Omit<AssetDisposalRecord, 'id' | 'disposalId'>) => {
    const disposalId = 'DSP-2026-' + Math.floor(10 + Math.random() * 90);
    const item: AssetDisposalRecord = {
      ...newDsp,
      id: 'DSP-' + Date.now(),
      disposalId,
    };
    setDisposals((prev) => {
      const updated = [item, ...prev];
      saveStorage(STORAGE_KEYS.DISPOSALS, updated);
      return updated;
    });

    // Mark asset as Retired or Disposed
    setAssets((prev) => {
      const updated = prev.map((a) =>
        a.assetId === newDsp.assetId ? { ...a, status: 'Disposed' as const } : a
      );
      saveStorage(STORAGE_KEYS.ASSETS, updated);
      return updated;
    });

    logHistory(
      newDsp.assetId,
      newDsp.assetName,
      'Asset Disposed',
      'Active / Depreciated',
      `Disposed via ${newDsp.disposalMethod} (Sale: ₹${newDsp.saleValue.toLocaleString('en-IN')})`,
      newDsp.disposalReason,
      disposalId
    );
  };

  return {
    assets,
    categories,
    allocations,
    transfers,
    maintenanceRecords,
    disposals,
    historyRecords,
    addAsset,
    updateAsset,
    addCategory,
    updateCategory,
    createAllocation,
    returnAsset,
    createTransfer,
    completeTransfer,
    createMaintenance,
    completeMaintenance,
    createDisposal,
  };
}
