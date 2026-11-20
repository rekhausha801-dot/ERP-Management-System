// Asset Management Data Types & Interfaces

export type AssetCondition = 'Brand New' | 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Damaged';
export type AssetStatus =
  | 'Draft'
  | 'Active'
  | 'Available'
  | 'Allocated'
  | 'Under Maintenance'
  | 'Damaged'
  | 'Lost'
  | 'Retired'
  | 'Disposed';

export interface CompanyAsset {
  id: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  category: string;
  subcategory: string;
  description: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  barcode: string;
  image?: string;

  // Purchase details
  purchaseDate: string;
  purchaseOrderNumber: string;
  supplierName: string;
  supplierInvoiceNumber: string;
  purchaseCost: number;
  gstAmount: number;
  additionalCharges: number;
  totalAcquisitionCost: number;
  warrantyExpiryDate: string;

  // Financial & Depreciation
  capitalizationDate: string;
  usefulLifeYears: number;
  depreciationMethod: 'Straight Line' | 'Written Down Value';
  depreciationRate: number; // e.g. 15%
  salvageValue: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  assetLedgerAccount: string;

  // Location & Assignment
  branch: string;
  department: string;
  building: string;
  floor: string;
  room: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;

  // Condition & Status
  condition: AssetCondition;
  status: AssetStatus;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  notes?: string;
}

export interface AssetCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  parentCategory?: string;
  description: string;
  totalAssets: number;
  totalPurchaseValue: number;
  defaultDepreciationMethod: 'Straight Line' | 'Written Down Value';
  defaultUsefulLifeYears: number;
  defaultDepreciationRate: number;
  assetLedgerAccount: string;
  status: 'Active' | 'Inactive';
}

export interface AssetAllocationRecord {
  id: string;
  allocationId: string;
  assetId: string;
  assetName: string;
  category: string;
  serialNumber: string;
  allocationType: 'Employee' | 'Department' | 'Branch' | 'Project' | 'Temporary';
  assignedTo: string;
  employeeId?: string;
  department: string;
  branch: string;
  location: string;
  allocationDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  conditionBefore: AssetCondition;
  conditionAtReturn?: AssetCondition;
  assignedBy: string;
  approvedBy: string;
  allocationStatus: 'Pending Approval' | 'Approved' | 'Allocated' | 'Returned' | 'Overdue' | 'Cancelled';
  handoverNotes?: string;
  missingAccessories?: string;
  damageDescription?: string;
}

export interface AssetTransferRecord {
  id: string;
  transferId: string;
  assetId: string;
  assetName: string;
  category: string;
  transferType: 'Employee to Employee' | 'Department to Department' | 'Branch to Branch' | 'Location to Location';
  fromBranch: string;
  toBranch: string;
  fromDepartment: string;
  toDepartment: string;
  fromEmployee?: string;
  toEmployee?: string;
  fromLocation: string;
  toLocation: string;
  requestDate: string;
  transferDate: string;
  requestedBy: string;
  approvedBy: string;
  transferReason: string;
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  transferStatus: 'Draft' | 'Pending Approval' | 'In Transit' | 'Completed' | 'Cancelled';
  handedOverBy?: string;
  receivedBy?: string;
}

export interface AssetMaintenanceRecord {
  id: string;
  maintenanceId: string;
  assetId: string;
  assetName: string;
  category: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Emergency';
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requestDate: string;
  scheduledDate: string;
  completionDate?: string;
  serviceProviderType: 'Internal Technician' | 'External Vendor';
  serviceProvider: string;
  technicianName: string;
  contactNumber: string;
  estimatedCost: number;
  actualCost: number;
  partsReplaced?: string;
  maintenanceStatus: 'Requested' | 'Pending Approval' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  technicianRemarks?: string;
}

export interface AssetDisposalRecord {
  id: string;
  disposalId: string;
  assetId: string;
  assetName: string;
  category: string;
  purchaseDate: string;
  originalCost: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  disposalDate: string;
  disposalMethod: 'Asset Sale' | 'Scrap Sale' | 'Write-Off' | 'Donation' | 'Asset Retirement' | 'Damaged Disposal' | 'E-Waste Scrap Sale';
  disposalReason: string;
  saleValue: number;
  disposalExpenses: number;
  netProceeds: number;
  gainOrLoss: number; // positive = Gain, negative = Loss
  requestedBy: string;
  approvedBy: string;
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  disposalStatus: 'Draft' | 'Pending Approval' | 'Approved' | 'Completed' | 'Cancelled';
}

export interface AssetHistoryRecord {
  id: string;
  historyId: string;
  assetId: string;
  assetName: string;
  activityType:
    | 'Asset Created'
    | 'Asset Updated'
    | 'Asset Purchased'
    | 'Asset Allocated'
    | 'Asset Returned'
    | 'Asset Transferred'
    | 'Maintenance Requested'
    | 'Maintenance Completed'
    | 'Depreciation Recorded'
    | 'Asset Condition Updated'
    | 'Asset Disposed';
  previousValue: string;
  updatedValue: string;
  activityDate: string;
  performedBy: string;
  department: string;
  branch: string;
  referenceNumber: string;
  remarks: string;
}
