export interface InventoryProduct {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  uom: string; // Unit of measurement (PCS, KGS, BOX, MTR, etc.)
  warehouseId: string;
  warehouseName: string;
  locationBin: string; // e.g., 'Zone A - Rack 04 - Bin 12'
  openingStock: number;
  availableStock: number;
  reservedStock: number;
  inTransitStock: number;
  damagedStock: number;
  expiredStock: number;
  totalStock: number;
  minLevel: number;
  reorderPoint: number;
  maxLevel: number;
  unitCost: number;
  stockValue: number;
  batchNumber?: string;
  serialNumber?: string;
  expiryDate?: string;
  valuationMethod: 'FIFO' | 'WEIGHTED_AVG';
  lastMovementDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Critical';
}

export interface StockMovementItem {
  id: string;
  date: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'DAMAGE_WRITE_OFF';
  referenceNo: string;
  productId: string;
  productName: string;
  sku: string;
  sourceWarehouse?: string;
  destWarehouse?: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  performedBy: string;
  notes: string;
  status: 'Completed' | 'Pending Approval' | 'In Transit' | 'Cancelled';
}

export interface WarehouseItem {
  id: string;
  code: string;
  name: string;
  type: 'Main Warehouse' | 'Branch Warehouse' | 'Regional Warehouse' | 'Service Warehouse' | 'Transit Warehouse' | 'Damaged Goods Warehouse';
  address: string;
  city: string;
  manager: string;
  contactPhone: string;
  email: string;
  totalCapacitySqFt: number;
  storageUtilizationPercent: number;
  activeProductsCount: number;
  totalValuation: number;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
}

export interface StockInTransaction {
  id: string;
  grnNumber: string;
  sourceType: 'Purchase Order' | 'Sales Return' | 'Opening Entry' | 'Transfer Receipt' | 'Bonus Stock';
  referenceNumber: string;
  supplierName: string;
  warehouseName: string;
  receivedDate: string;
  receivedBy: string;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  status: 'Completed' | 'Draft' | 'Pending Approval' | 'Rejected';
  notes: string;
  items: {
    sku: string;
    productName: string;
    orderedQty: number;
    receivedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    unitCost: number;
    batchNo: string;
    expiryDate?: string;
  }[];
}

export interface StockOutTransaction {
  id: string;
  issueNumber: string;
  issueType: 'Sales Dispatch' | 'Service Material Issue' | 'Internal Consumption' | 'Supplier Return' | 'Damaged Write-Off';
  orderReference: string;
  destination: string;
  warehouseName: string;
  issueDate: string;
  requestedBy: string;
  approvedBy: string;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  status: 'Completed' | 'Draft' | 'Pending Approval' | 'Rejected';
  notes: string;
  items: {
    sku: string;
    productName: string;
    issuedQty: number;
    unitCost: number;
    batchNo?: string;
  }[];
}

export interface StockTransferTransaction {
  id: string;
  transferNo: string;
  sourceWarehouse: string;
  destWarehouse: string;
  transferDate: string;
  expectedDeliveryDate: string;
  transportVehicle: string;
  driverContact: string;
  initiatedBy: string;
  approvedBy: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Transit' | 'Partially Received' | 'Completed' | 'Cancelled';
  itemCount: number;
  totalQty: number;
  notes: string;
}

export interface StockAdjustmentTransaction {
  id: string;
  adjNumber: string;
  warehouseName: string;
  adjustmentType: 'Physical Count Adjustment' | 'Damage Adjustment' | 'Expiry Adjustment' | 'Excess Stock Entry' | 'Lost / Missing';
  productName: string;
  sku: string;
  systemQty: number;
  physicalQty: number;
  varianceQty: number;
  varianceAmount: number;
  reason: string;
  date: string;
  requestedBy: string;
  approvedBy: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

export interface StockRequestItem {
  id: string;
  requestNo: string;
  department: string;
  requestedBy: string;
  productName: string;
  sku: string;
  requestedQty: number;
  availableQty: number;
  requiredDate: string;
  reason: string;
  status: 'Pending Approval' | 'Approved' | 'Issued' | 'Rejected';
}

export interface StockReservationItem {
  id: string;
  reservationNo: string;
  type: 'Sales Order' | 'Service Order';
  referenceNo: string;
  customerName: string;
  productName: string;
  sku: string;
  reservedQty: number;
  availableQty: number;
  warehouseName: string;
  reservationDate: string;
  expiryDate: string;
  status: 'Active' | 'Fulfilled' | 'Released' | 'Expired';
}

export interface BatchItem {
  id: string;
  batchNo: string;
  productName: string;
  sku: string;
  manufacturingDate: string;
  expiryDate: string;
  supplier: string;
  warehouse: string;
  initialQty: number;
  availableQty: number;
  reservedQty: number;
  expiredQty: number;
  unitCost: number;
  daysToExpiry: number;
  status: 'Active' | 'Near Expiry' | 'Expired' | 'Blocked';
}

export interface StockAuditItem {
  id: string;
  auditNo: string;
  auditType: 'Full Stock Audit' | 'Cycle Count' | 'Category Audit' | 'Warehouse Spot Check';
  warehouseName: string;
  auditDate: string;
  leadAuditor: string;
  totalProductsAudited: number;
  itemsWithVariance: number;
  netVarianceAmount: number;
  status: 'In Progress' | 'Pending Review' | 'Completed' | 'Reconciled';
}

export interface ReorderPlanItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  preferredSupplier: string;
  availableStock: number;
  reorderPoint: number;
  minLevel: number;
  maxLevel: number;
  dailyConsumption: number;
  leadTimeDays: number;
  suggestedReorderQty: number;
  estimatedCost: number;
  status: 'Pending PR' | 'PO Created' | 'Adequate Stock' | 'Critical Shortage';
}

export interface DamagedStockItem {
  id: string;
  reportNo: string;
  productName: string;
  sku: string;
  batchNo: string;
  warehouse: string;
  damageType: 'Transit Damage' | 'Moisture / Water' | 'Handling Failure' | 'Factory Defect' | 'Chemical Expiry';
  damagedQty: number;
  unitCost: number;
  totalLossValue: number;
  reportedBy: string;
  reportedDate: string;
  status: 'Under Inspection' | 'Approved for Scrap' | 'Written Off' | 'Insurance Claimed';
}
