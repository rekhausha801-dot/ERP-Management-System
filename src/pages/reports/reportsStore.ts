import { useState, useEffect } from 'react';
import {
  SalesReportItem,
  PurchaseReportItem,
  InventoryReportItem,
  CustomerReportItem,
  FinancialReportItem,
  OutstandingReceivableItem,
  OutstandingPayableItem,
  HrReportItem,
} from './reportsData';
import {
  INITIAL_SALES_REPORTS,
  INITIAL_PURCHASE_REPORTS,
  INITIAL_INVENTORY_REPORTS,
  INITIAL_CUSTOMER_REPORTS,
  INITIAL_FINANCIAL_REPORTS,
  INITIAL_OUTSTANDING_RECEIVABLES,
  INITIAL_OUTSTANDING_PAYABLES,
  INITIAL_HR_REPORTS,
} from './reportsMockData';

const STORAGE_KEYS = {
  SALES: 'erp_rep_sales',
  PURCHASE: 'erp_rep_purchase',
  INVENTORY: 'erp_rep_inventory',
  CUSTOMERS: 'erp_rep_customers',
  FINANCIAL: 'erp_rep_financial',
  RECEIVABLES: 'erp_rep_receivables',
  PAYABLES: 'erp_rep_payables',
  HR: 'erp_rep_hr',
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

export function useReportsDatabase() {
  const [salesReports, setSalesReports] = useState<SalesReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.SALES, INITIAL_SALES_REPORTS)
  );
  const [purchaseReports, setPurchaseReports] = useState<PurchaseReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.PURCHASE, INITIAL_PURCHASE_REPORTS)
  );
  const [inventoryReports, setInventoryReports] = useState<InventoryReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY_REPORTS)
  );
  const [customerReports, setCustomerReports] = useState<CustomerReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMER_REPORTS)
  );
  const [financialReports, setFinancialReports] = useState<FinancialReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.FINANCIAL, INITIAL_FINANCIAL_REPORTS)
  );
  const [receivables, setReceivables] = useState<OutstandingReceivableItem[]>(() =>
    loadStorage(STORAGE_KEYS.RECEIVABLES, INITIAL_OUTSTANDING_RECEIVABLES)
  );
  const [payables, setPayables] = useState<OutstandingPayableItem[]>(() =>
    loadStorage(STORAGE_KEYS.PAYABLES, INITIAL_OUTSTANDING_PAYABLES)
  );
  const [hrReports, setHrReports] = useState<HrReportItem[]>(() =>
    loadStorage(STORAGE_KEYS.HR, INITIAL_HR_REPORTS)
  );

  const refreshAll = () => {
    setSalesReports(loadStorage(STORAGE_KEYS.SALES, INITIAL_SALES_REPORTS));
    setPurchaseReports(loadStorage(STORAGE_KEYS.PURCHASE, INITIAL_PURCHASE_REPORTS));
    setInventoryReports(loadStorage(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY_REPORTS));
    setCustomerReports(loadStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMER_REPORTS));
    setFinancialReports(loadStorage(STORAGE_KEYS.FINANCIAL, INITIAL_FINANCIAL_REPORTS));
    setReceivables(loadStorage(STORAGE_KEYS.RECEIVABLES, INITIAL_OUTSTANDING_RECEIVABLES));
    setPayables(loadStorage(STORAGE_KEYS.PAYABLES, INITIAL_OUTSTANDING_PAYABLES));
    setHrReports(loadStorage(STORAGE_KEYS.HR, INITIAL_HR_REPORTS));
  };

  const recordCustomerPayment = (receivableId: string, paidAmount: number) => {
    setReceivables((prev) => {
      const updated = prev.map((item) => {
        if (item.id === receivableId) {
          const newOutstanding = Math.max(0, item.outstandingAmount - paidAmount);
          return {
            ...item,
            amountReceived: item.amountReceived + paidAmount,
            outstandingAmount: newOutstanding,
            collectionStatus: newOutstanding === 0 ? ('Paid' as const) : ('Partially Paid' as const),
          };
        }
        return item;
      });
      saveStorage(STORAGE_KEYS.RECEIVABLES, updated);
      return updated;
    });
  };

  const recordSupplierPayment = (payableId: string, paidAmount: number) => {
    setPayables((prev) => {
      const updated = prev.map((item) => {
        if (item.id === payableId) {
          const newOutstanding = Math.max(0, item.outstandingAmount - paidAmount);
          return {
            ...item,
            amountPaid: item.amountPaid + paidAmount,
            outstandingAmount: newOutstanding,
            paymentStatus: newOutstanding === 0 ? ('Paid' as const) : ('Partially Paid' as const),
          };
        }
        return item;
      });
      saveStorage(STORAGE_KEYS.PAYABLES, updated);
      return updated;
    });
  };

  return {
    salesReports,
    purchaseReports,
    inventoryReports,
    customerReports,
    financialReports,
    receivables,
    payables,
    hrReports,
    refreshAll,
    recordCustomerPayment,
    recordSupplierPayment,
  };
}
