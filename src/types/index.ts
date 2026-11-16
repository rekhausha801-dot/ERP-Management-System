export * from './erp';

// Sales ERP Interfaces
export interface Lead {
  id: string;
  leadNumber: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Exhibition' | 'Cold Outreach' | 'Campaign';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Lost';
  estimatedValue: number;
  assignedTo: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  clientName: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Review' | 'Quoted' | 'Closed';
  date: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerName: string;
  issueDate: string;
  validUntil: string;
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';
}

export interface Payment {
  id: string;
  receiptNumber: string;
  customerName: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Cash' | 'UPI';
  amount: number;
  referenceNumber: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  type: 'Business' | 'Individual';
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  creditLimit: number;
  currentBalance: number;
  status: 'Active' | 'Inactive';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unitPrice: number;
  costPrice: number;
  stockQty: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface ReturnItem {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  returnDate: string;
  reason: 'Defective' | 'Wrong Item' | 'Customer Cancel' | 'Exchange';
  amount: number;
  status: 'Requested' | 'Inspecting' | 'Approved' | 'Refunded' | 'Rejected';
}

// Service ERP Interfaces
export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  productOrAsset: string;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  stage: 'Open' | 'Assigned' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed';
  assignedTechnician: string;
  createdAt: string;
  dueDate: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  ticketNumber: string;
  clientName: string;
  siteLocation: string;
  scheduledDate: string;
  technicianName: string;
  jobType: 'Installation' | 'Repair' | 'Maintenance' | 'Inspection';
  status: 'Scheduled' | 'En Route' | 'Working' | 'Completed' | 'Cancelled';
}

export interface Technician {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  experienceYears: number;
  currentJobsCount: number;
  rating: number;
  status: 'Available' | 'On Job' | 'On Leave';
}

export interface AMCContract {
  id: string;
  contractNumber: string;
  clientName: string;
  contractTitle: string;
  startDate: string;
  endDate: string;
  annualValue: number;
  visitsIncluded: number;
  visitsCompleted: number;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Renewed';
}

export interface WarrantyClaim {
  id: string;
  claimNumber: string;
  productSerial: string;
  productName: string;
  customerName: string;
  purchaseDate: string;
  warrantyExpiry: string;
  claimDate: string;
  defectCategory: string;
  status: 'Submitted' | 'Verified' | 'Under Inspection' | 'Approved' | 'Rejected';
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  compatibleWith: string;
  unitPrice: number;
  quantityOnHand: number;
  minAlertQty: number;
  locationBin: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}

export interface ServiceBilling {
  id: string;
  billNumber: string;
  ticketNumber: string;
  customerName: string;
  laborCharge: number;
  partsCharge: number;
  travelCharge: number;
  tax: number;
  totalBill: number;
  paymentStatus: 'Pending' | 'Paid' | 'Waived Under Warranty';
  date: string;
}

export interface CustomerFeedback {
  id: string;
  ticketOrJobNumber: string;
  customerName: string;
  technicianName: string;
  rating: number; // 1-5
  timelinessScore: number;
  comments: string;
  date: string;
  recommend: boolean;
}
