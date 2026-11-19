// Comprehensive Data Types for Invoicing, Billing, Creditors & Debtors

export type InvoiceType =
  | 'Sales Invoice'
  | 'Service Invoice'
  | 'Tax Invoice'
  | 'Proforma Invoice'
  | 'Recurring Invoice'
  | 'Advance Invoice'
  | 'Final Invoice';

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';

export type InvoiceStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Sent'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled'
  | 'Void';

export interface InvoiceLineItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  taxRate: number; // e.g. 18 for 18%
  taxAmount: number;
  lineTotal: number;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  customerEmail: string;
  customerPhone: string;
  gstin: string;
  billingAddress: string;
  shippingAddress: string;
  salesOrderRef?: string;
  serviceOrderRef?: string;
  poReference?: string;
  branch: string;
  salesperson: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  itemDiscount: number;
  additionalDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  shippingCharges: number;
  additionalCharges: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  status: InvoiceStatus;
  paymentTerms: string;
  notes?: string;
  termsConditions?: string;
}

export interface CreditNoteRecord {
  id: string;
  creditNoteNumber: string;
  originalInvoiceNumber: string;
  customerName: string;
  customerCode: string;
  creditNoteDate: string;
  reason:
    | 'Sales Return'
    | 'Product Damage'
    | 'Product Defect'
    | 'Overbilling'
    | 'Excess Tax Charged'
    | 'Discount Adjustment'
    | 'Pricing Correction'
    | 'Invoice Cancellation';
  creditType:
    | 'Sales Return Credit'
    | 'Price Adjustment Credit'
    | 'Tax Adjustment Credit'
    | 'Discount Credit'
    | 'Invoice Correction Credit';
  taxableAmount: number;
  taxAmount: number;
  totalCreditAmount: number;
  adjustmentStatus: 'Pending' | 'Partially Applied' | 'Applied' | 'Refunded';
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Applied' | 'Cancelled' | 'Rejected';
  refundMethod?: string;
  adjustmentMethod?: string;
  notes?: string;
}

export interface DebitNoteRecord {
  id: string;
  debitNoteNumber: string;
  referenceInvoice: string;
  partyName: string;
  partyType: 'Customer' | 'Supplier';
  partyCode: string;
  debitNoteDate: string;
  reason:
    | 'Additional Charges'
    | 'Underbilling Correction'
    | 'Price Difference'
    | 'Freight Charges'
    | 'Tax Adjustment'
    | 'Service Charges'
    | 'Quantity Difference'
    | 'Other Financial Adjustments';
  taxableAmount: number;
  taxAmount: number;
  totalDebitAmount: number;
  adjustmentStatus: 'Pending' | 'Partially Applied' | 'Applied';
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Applied' | 'Cancelled' | 'Rejected';
  notes?: string;
}

export interface CreditorRecord {
  id: string;
  supplierCode: string;
  supplierName: string;
  supplierType: 'Manufacturer' | 'Distributor' | 'Wholesaler' | 'Service Provider';
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  city: string;
  state: string;
  branch: string;
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
  overdueAmount: number;
  creditLimit: number;
  paymentTerms: string;
  creditPeriodDays: number;
  bankAccount: string;
  status: 'Active' | 'Inactive' | 'On Hold';
  openingBalance: number;
}

export interface DebtorRecord {
  id: string;
  customerCode: string;
  customerName: string;
  customerType: 'Enterprise' | 'SMB' | 'Government' | 'Retail Client';
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  billingAddress: string;
  city: string;
  state: string;
  branch: string;
  salesperson: string;
  totalSales: number;
  totalReceived: number;
  outstandingBalance: number;
  overdueAmount: number;
  creditLimit: number;
  paymentTerms: string;
  creditPeriodDays: number;
  accountStatus: 'Active' | 'Under Review' | 'Credit Blocked' | 'Inactive';
  openingBalance: number;
}

export interface PayableBillRecord {
  id: string;
  billNumber: string;
  supplierName: string;
  supplierCode: string;
  poReference: string;
  billDate: string;
  dueDate: string;
  billAmount: number;
  amountPaid: number;
  creditNoteAdjustment: number;
  outstandingBalance: number;
  daysOverdue: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'On Hold' | 'Disputed';
  branch: string;
}

export interface ReceivableInvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerCode: string;
  salesOrderRef: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  amountReceived: number;
  creditNoteAdjustment: number;
  outstandingBalance: number;
  daysOverdue: number;
  collectionStatus: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'On Hold' | 'Disputed';
  branch: string;
  salesperson: string;
}
