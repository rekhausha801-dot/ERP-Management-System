// Reports & Analytics Unified Data Models & Real Database Engine
export interface SalesReportItem {
  id: string;
  reportDate: string;
  orderNumber: string;
  invoiceNumber: string;
  customerName: string;
  salesperson: string;
  productName: string;
  category: string;
  brand: string;
  quantity: number;
  grossAmount: number;
  discount: number;
  taxAmount: number;
  netSales: number;
  orderStatus: 'Delivered' | 'In Transit' | 'Processing' | 'Pending' | 'Cancelled';
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
  branch: string;
  department: string;
  salesChannel: 'Direct' | 'Online' | 'Partner' | 'Distributor';
}

export interface PurchaseReportItem {
  id: string;
  purchaseDate: string;
  purchaseOrderNumber: string;
  supplierName: string;
  productName: string;
  brand: string;
  category: string;
  orderedQuantity: number;
  receivedQuantity: number;
  pendingQuantity: number;
  unitPrice: number;
  grossAmount: number;
  taxAmount: number;
  totalPurchaseAmount: number;
  purchaseStatus: 'Completed' | 'Partially Received' | 'Pending Approval' | 'Draft' | 'Cancelled';
  branch: string;
  department: string;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
}

export interface InventoryReportItem {
  id: string;
  productCode: string;
  productName: string;
  brand: string;
  category: string;
  warehouse: string;
  branch: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  adjustments: number;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  unitCost: number;
  stockValue: number;
  stockStatus: 'Normal' | 'Low Stock' | 'Out of Stock' | 'Overstocked';
  fastSlowStatus: 'Fast-Moving' | 'Medium' | 'Slow-Moving' | 'Non-Moving';
}

export interface CustomerReportItem {
  id: string;
  customerCode: string;
  customerName: string;
  customerType: 'Corporate' | 'Wholesale' | 'Retail' | 'Individual';
  contactNumber: string;
  email: string;
  city: string;
  state: string;
  registrationDate: string;
  totalOrders: number;
  totalSales: number;
  totalPayments: number;
  outstandingBalance: number;
  lastPurchaseDate: string;
  customerStatus: 'Active' | 'High-Value' | 'Regular' | 'Inactive' | 'New';
  retentionSegment: 'Repeat Buyer' | 'At-Risk' | 'Loyal' | 'First-Time';
  salesperson: string;
  branch: string;
}

export interface FinancialReportItem {
  id: string;
  transactionDate: string;
  referenceNumber: string;
  accountCode: string;
  accountName: string;
  accountGroup: 'Assets' | 'Liabilities' | 'Equity' | 'Operating Income' | 'Operating Expenses';
  transactionType: 'Credit' | 'Debit';
  description: string;
  debitAmount: number;
  creditAmount: number;
  accountBalance: number;
  branch: string;
  department: string;
  financialYear: string;
}

export interface OutstandingReceivableItem {
  id: string;
  customerCode: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  amountReceived: number;
  creditAdjustments: number;
  outstandingAmount: number;
  daysOverdue: number;
  collectionStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Overdue' | 'Disputed' | 'On Hold';
  branch: string;
  agingCategory: 'Current / Not Due' | '1–30 Days Overdue' | '31–60 Days Overdue' | '61–90 Days Overdue' | 'Above 90 Days Overdue';
}

export interface OutstandingPayableItem {
  id: string;
  supplierCode: string;
  supplierName: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  billAmount: number;
  amountPaid: number;
  debitAdjustments: number;
  outstandingAmount: number;
  daysOverdue: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Overdue' | 'Disputed' | 'On Hold';
  branch: string;
  agingCategory: 'Current / Not Due' | '1–30 Days Overdue' | '31–60 Days Overdue' | '61–90 Days Overdue' | 'Above 90 Days Overdue';
}

export interface HrReportItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  branch: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Probation';
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  leaveBalance: number;
  salaryType: 'Monthly' | 'Weekly' | 'Daily Wage' | 'Hourly';
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending' | 'Hold' | 'Partially Paid';
  employeeStatus: 'Active' | 'Probation' | 'Resigned' | 'Notice Period';
  overtimeHours: number;
}
