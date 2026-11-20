import { useState, useEffect } from 'react';

// ============================================================================
// 1. DATA MODELS FOR PURCHASE & PROCUREMENT MODULE
// ============================================================================

export interface PurchaseItemLine {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  category: string;
  orderedQty: number;
  receivedQty?: number;
  acceptedQty?: number;
  rejectedQty?: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number; // e.g. 18%
  subtotal: number; // Qty * unitPrice * (1 - discount)
  taxAmount: number; // subtotal * taxPercent / 100
  total: number; // subtotal + taxAmount
  unit: string;
}

export interface SupplierRecord {
  id: string;
  supplierCode: string;
  supplierName: string;
  supplierType: 'Manufacturer' | 'Authorized Distributor' | 'Wholesaler' | 'Specialized Service';
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  paymentTerms: string; // e.g. 'Net 30 Days'
  creditPeriodDays: number;
  creditLimit: number;
  totalOrders: number;
  totalSpend: number;
  outstandingBalance: number;
  onTimeDeliveryRate: number; // percentage
  qualityRating: number; // 1-5 scale
  complianceStatus: 'Verified' | 'Audit Pending' | 'Benchmarked';
  status: 'Active' | 'Under Review' | 'Blacklisted';
  suppliedBrands: string[];
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  prDate: string;
  requestedBy: string;
  department: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  items: PurchaseItemLine[];
  estimatedTotal: number;
  purpose: string;
  status: 'Pending Approval' | 'Approved' | 'Converted to PO' | 'Rejected';
  approvedBy?: string;
  approvalDate?: string;
  rfqNumber?: string;
  poNumber?: string;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  poDate: string;
  quotationRef?: string;
  prRef?: string;
  supplierId: string;
  supplierName: string;
  supplierGstin: string;
  department: string;
  buyerName: string;
  items: PurchaseItemLine[];
  subtotal: number;
  totalDiscount: number;
  cgst: number;
  sgst: number;
  igst: number;
  grossTotal: number;
  paymentTerms: string;
  expectedDeliveryDate: string;
  deliveryWarehouse: string;
  approvalStatus: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  grnStatus: 'Pending GRN' | 'Partially Received' | 'Completely Received';
  billingStatus: 'Unbilled' | 'Partially Billed' | 'Fully Billed';
  approvedBy?: string;
  notes?: string;
}

export interface GrnInspectionRecord {
  id: string;
  grnNumber: string;
  grnDate: string;
  poNumber: string;
  supplierName: string;
  supplierDeliveryChallan: string;
  warehouseName: string;
  batchLotNumber: string;
  qcInspector: string;
  items: {
    productId: string;
    productName: string;
    orderedQty: number;
    receivedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    rejectionReason?: string;
  }[];
  qcStatus: 'QC Passed' | 'QC Failed with Rejections' | 'Under Inspection';
  status: 'Verified & Stocked' | 'Pending Stock Update';
  remarks?: string;
  returnGenerated?: boolean;
}

export interface PurchaseBillRecord {
  id: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  supplierGstin: string;
  poNumber: string;
  grnNumber: string;
  department: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grossAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  threeWayMatchStatus: 'Matched' | 'Discrepancy' | 'Pending GRN Match';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue';
  status: 'Approved' | 'Under Dispute' | 'Draft';
  paymentHistory: {
    voucherNumber: string;
    date: string;
    amount: number;
    mode: string;
    refNumber: string;
  }[];
}

export interface PaymentMadeVoucher {
  id: string;
  voucherNumber: string;
  paymentDate: string;
  supplierId: string;
  supplierName: string;
  billNumber: string;
  poNumber?: string;
  amountPaid: number;
  paymentMode: 'NEFT' | 'RTGS' | 'Cheque' | 'IMPS' | 'UPI';
  utrTransactionRef: string;
  bankAccount: string;
  reconciliationStatus: 'Reconciled' | 'Pending Clearing' | 'Failed';
  status: 'Completed' | 'Scheduled' | 'Failed' | 'Reversed';
  notes?: string;
}

export interface PurchaseReturnRecord {
  id: string;
  returnNumber: string;
  returnDate: string;
  poNumber: string;
  grnNumber: string;
  supplierName: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    reason: string;
  }[];
  totalReturnAmount: number;
  actionTaken: 'Supplier Debit Note' | 'Replacement In-Transit' | 'Refund Pending';
  debitNoteNumber?: string;
  debitNoteAmount?: number;
  status: 'Approved' | 'Pending Sign-off' | 'Settled';
  notes?: string;
}

export interface DepartmentBudgetRecord {
  deptCode: string;
  deptName: string;
  deptHead: string;
  allocatedBudget: number;
  actualSpend: number;
  ordersCount: number;
  pendingDeliveries: number;
  status: 'Within Budget' | 'Critical / Approaching Limit';
}

// ============================================================================
// 2. SEED DATA - RELATIONAL & CONSISTENT
// ============================================================================

export const SEED_DEPARTMENTS: DepartmentBudgetRecord[] = [
  {
    deptCode: 'D-MFG',
    deptName: 'Manufacturing & Production',
    deptHead: 'Rajesh Subramanian',
    allocatedBudget: 5000000,
    actualSpend: 3820000,
    ordersCount: 14,
    pendingDeliveries: 3,
    status: 'Within Budget',
  },
  {
    deptCode: 'D-RND',
    deptName: 'R&D and Engineering',
    deptHead: 'Dr. Anand Ramanathan',
    allocatedBudget: 2500000,
    actualSpend: 1940000,
    ordersCount: 8,
    pendingDeliveries: 1,
    status: 'Within Budget',
  },
  {
    deptCode: 'D-OPS',
    deptName: 'Operations & Maintenance',
    deptHead: 'Murugan Pillai',
    allocatedBudget: 1800000,
    actualSpend: 1520000,
    ordersCount: 9,
    pendingDeliveries: 2,
    status: 'Critical / Approaching Limit',
  },
  {
    deptCode: 'D-IT',
    deptName: 'IT & Infrastructure',
    deptHead: 'Senthil Nathan',
    allocatedBudget: 2000000,
    actualSpend: 1380000,
    ordersCount: 6,
    pendingDeliveries: 1,
    status: 'Within Budget',
  },
  {
    deptCode: 'D-ADM',
    deptName: 'Administration & Facility',
    deptHead: 'Kavitha Balakrishnan',
    allocatedBudget: 1200000,
    actualSpend: 820000,
    ordersCount: 5,
    pendingDeliveries: 0,
    status: 'Within Budget',
  },
];

export const SEED_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'SUP-001',
    supplierCode: 'SUP-SIEMENS',
    supplierName: 'Siemens Industrial Automation Ltd',
    supplierType: 'Manufacturer',
    category: 'Industrial Electrical & Controls',
    contactPerson: 'Harish Mehta',
    phone: '+91 98401 99221',
    email: 'b2b.orders@siemens-india.com',
    gstin: '27AAACS1234F1Z8',
    pan: 'AAACS1234F',
    address: 'Worli Technology Hub, Dr. Annie Besant Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200011899201',
    ifscCode: 'HDFC0000060',
    paymentTerms: 'Net 30 Days',
    creditPeriodDays: 30,
    creditLimit: 5000000,
    totalOrders: 16,
    totalSpend: 3250000,
    outstandingBalance: 580000,
    onTimeDeliveryRate: 98.2,
    qualityRating: 4.9,
    complianceStatus: 'Benchmarked',
    status: 'Active',
    suppliedBrands: ['Siemens', 'SIMATIC', 'SIRIUS'],
  },
  {
    id: 'SUP-002',
    supplierCode: 'SUP-ABB',
    supplierName: 'ABB Power & Drives India Pvt Ltd',
    supplierType: 'Manufacturer',
    category: 'VFDs & Power Transformers',
    contactPerson: 'Girish Kulkarni',
    phone: '+91 98800 23411',
    email: 'drives.sales@in.abb.com',
    gstin: '29AAACA0123P1Z2',
    pan: 'AAACA0123P',
    address: 'Peenya Industrial Area, Phase II',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560058',
    bankName: 'Standard Chartered Bank',
    accountNumber: '22105991823001',
    ifscCode: 'SCBL0036001',
    paymentTerms: 'Net 45 Days',
    creditPeriodDays: 45,
    creditLimit: 4000000,
    totalOrders: 12,
    totalSpend: 2480000,
    outstandingBalance: 420000,
    onTimeDeliveryRate: 96.5,
    qualityRating: 4.8,
    complianceStatus: 'Benchmarked',
    status: 'Active',
    suppliedBrands: ['ABB', 'Baldor', 'Tropos'],
  },
  {
    id: 'SUP-003',
    supplierCode: 'SUP-SCHNEIDER',
    supplierName: 'Schneider Electric Solutions Ltd',
    supplierType: 'Authorized Distributor',
    category: 'Switchgear & Sensors',
    contactPerson: 'Naveen Joseph',
    phone: '+91 98455 88992',
    email: 'orders.chennai@schneider-electric.com',
    gstin: '33AAACS7766K1ZT',
    pan: 'AAACS7766K',
    address: 'Ambattur Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600058',
    bankName: 'ICICI Bank Ltd',
    accountNumber: '000905011928',
    ifscCode: 'ICIC0000009',
    paymentTerms: 'Net 30 Days',
    creditPeriodDays: 30,
    creditLimit: 3000000,
    totalOrders: 9,
    totalSpend: 1850000,
    outstandingBalance: 310000,
    onTimeDeliveryRate: 94.0,
    qualityRating: 4.7,
    complianceStatus: 'Verified',
    status: 'Active',
    suppliedBrands: ['Schneider Electric', 'Telemecanique', 'Modicon'],
  },
  {
    id: 'SUP-004',
    supplierCode: 'SUP-SKF',
    supplierName: 'SKF Bearings & Reliability Hub',
    supplierType: 'Authorized Distributor',
    category: 'Mechanical Bearings & Lubrication',
    contactPerson: 'Sanjay Deshmukh',
    phone: '+91 98220 54321',
    email: 'industrial.support@skf-distributors.in',
    gstin: '27AABCS9911Q1ZX',
    pan: 'AABCS9911Q',
    address: 'Chakan Industrial Corridor',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '410501',
    bankName: 'Axis Bank Ltd',
    accountNumber: '915020088991200',
    ifscCode: 'UTIB0000120',
    paymentTerms: 'Net 15 Days',
    creditPeriodDays: 15,
    creditLimit: 2000000,
    totalOrders: 8,
    totalSpend: 1140000,
    outstandingBalance: 190000,
    onTimeDeliveryRate: 97.0,
    qualityRating: 4.9,
    complianceStatus: 'Benchmarked',
    status: 'Active',
    suppliedBrands: ['SKF', 'Vogel'],
  },
  {
    id: 'SUP-005',
    supplierCode: 'SUP-DANFOSS',
    supplierName: 'Danfoss Thermal & Flow Systems',
    supplierType: 'Manufacturer',
    category: 'Pumps & Refrigeration Valves',
    contactPerson: 'Prakash Rao',
    phone: '+91 94440 12890',
    email: 'supplies@danfoss.com',
    gstin: '33AAACD9900P1Z1',
    pan: 'AAACD9900P',
    address: 'SIPCOT Industrial Park, Oragadam',
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    pincode: '602105',
    bankName: 'State Bank of India',
    accountNumber: '33908819200',
    ifscCode: 'SBIN0001524',
    paymentTerms: 'Immediate / Net 7 Days',
    creditPeriodDays: 7,
    creditLimit: 1500000,
    totalOrders: 5,
    totalSpend: 760000,
    outstandingBalance: 0,
    onTimeDeliveryRate: 99.0,
    qualityRating: 4.9,
    complianceStatus: 'Benchmarked',
    status: 'Active',
    suppliedBrands: ['Danfoss', 'Saginomiya'],
  },
];

export const SEED_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'PO-REC-101',
    poNumber: 'PO-2026-0891',
    poDate: '2026-11-10',
    quotationRef: 'QTN-SIEM-882',
    prRef: 'PR-2026-014',
    supplierId: 'SUP-001',
    supplierName: 'Siemens Industrial Automation Ltd',
    supplierGstin: '27AAACS1234F1Z8',
    department: 'Manufacturing & Production',
    buyerName: 'Karthik Raja',
    items: [
      {
        id: 'ITM-1',
        productId: 'P-101',
        productName: 'Siemens 15HP Induction Motor 4-Pole',
        brand: 'Siemens',
        sku: 'MTR-SIEM-15HP',
        category: 'Motors',
        orderedQty: 10,
        receivedQty: 10,
        acceptedQty: 10,
        rejectedQty: 0,
        unitPrice: 38500,
        discountPercent: 5,
        taxPercent: 18,
        subtotal: 365750,
        taxAmount: 65835,
        total: 431585,
        unit: 'Units',
      },
      {
        id: 'ITM-2',
        productId: 'P-102',
        productName: 'Siemens Heavy-Duty Overload Contactor 40A',
        brand: 'Siemens',
        sku: 'CON-SIEM-40A',
        category: 'Switchgear',
        orderedQty: 25,
        receivedQty: 25,
        acceptedQty: 25,
        rejectedQty: 0,
        unitPrice: 4200,
        discountPercent: 5,
        taxPercent: 18,
        subtotal: 99750,
        taxAmount: 17955,
        total: 117705,
        unit: 'Units',
      },
    ],
    subtotal: 465500,
    totalDiscount: 24500,
    cgst: 41895,
    sgst: 41895,
    igst: 0,
    grossTotal: 549290,
    paymentTerms: 'Net 30 Days',
    expectedDeliveryDate: '2026-11-18',
    deliveryWarehouse: 'Main Central Hub - Chennai',
    approvalStatus: 'Approved',
    grnStatus: 'Completely Received',
    billingStatus: 'Fully Billed',
    approvedBy: 'Rajesh Subramanian (Dept Head)',
    notes: 'Approved for urgent assembly unit upgrade batch 4.',
  },
  {
    id: 'PO-REC-102',
    poNumber: 'PO-2026-0892',
    poDate: '2026-11-14',
    quotationRef: 'QTN-ABB-109',
    prRef: 'PR-2026-019',
    supplierId: 'SUP-002',
    supplierName: 'ABB Power & Drives India Pvt Ltd',
    supplierGstin: '29AAACA0123P1Z2',
    department: 'R&D and Engineering',
    buyerName: 'Priya Sharma',
    items: [
      {
        id: 'ITM-3',
        productId: 'P-103',
        productName: 'ABB Variable Frequency Drive ACS580 11kW',
        brand: 'ABB',
        sku: 'VFD-ABB-11KW',
        category: 'Drives',
        orderedQty: 8,
        receivedQty: 8,
        acceptedQty: 7,
        rejectedQty: 1, // 1 rejected due to casing damage
        unitPrice: 52000,
        discountPercent: 6,
        taxPercent: 18,
        subtotal: 391040,
        taxAmount: 70387.2,
        total: 461427.2,
        unit: 'Units',
      },
    ],
    subtotal: 391040,
    totalDiscount: 24960,
    cgst: 0,
    sgst: 0,
    igst: 70387.2,
    grossTotal: 461427,
    paymentTerms: 'Net 45 Days',
    expectedDeliveryDate: '2026-11-20',
    deliveryWarehouse: 'R&D Testing Facility - Bengaluru',
    approvalStatus: 'Approved',
    grnStatus: 'Completely Received',
    billingStatus: 'Fully Billed',
    approvedBy: 'Dr. Anand Ramanathan',
    notes: 'Unit test approved. 1 rejected drive returned via Debit Note.',
  },
  {
    id: 'PO-REC-103',
    poNumber: 'PO-2026-0893',
    poDate: '2026-11-17',
    quotationRef: 'QTN-SCH-442',
    prRef: 'PR-2026-024',
    supplierId: 'SUP-003',
    supplierName: 'Schneider Electric Solutions Ltd',
    supplierGstin: '33AAACS7766K1ZT',
    department: 'Operations & Maintenance',
    buyerName: 'Vignesh Raman',
    items: [
      {
        id: 'ITM-4',
        productId: 'P-104',
        productName: 'Schneider Modicon M221 PLC Controller',
        brand: 'Schneider Electric',
        sku: 'PLC-SCH-M221',
        category: 'Controllers',
        orderedQty: 12,
        receivedQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        unitPrice: 28000,
        discountPercent: 4,
        taxPercent: 18,
        subtotal: 322560,
        taxAmount: 58060.8,
        total: 380620.8,
        unit: 'Units',
      },
    ],
    subtotal: 322560,
    totalDiscount: 13440,
    cgst: 29030.4,
    sgst: 29030.4,
    igst: 0,
    grossTotal: 380621,
    paymentTerms: 'Net 30 Days',
    expectedDeliveryDate: '2026-11-24',
    deliveryWarehouse: 'Ambattur Sub-Plant',
    approvalStatus: 'Approved',
    grnStatus: 'Pending GRN',
    billingStatus: 'Unbilled',
    approvedBy: 'Murugan Pillai',
    notes: 'Dispatched from factory via V-Trans Logistics.',
  },
  {
    id: 'PO-REC-104',
    poNumber: 'PO-2026-0894',
    poDate: '2026-11-18',
    prRef: 'PR-2026-029',
    supplierId: 'SUP-004',
    supplierName: 'SKF Bearings & Reliability Hub',
    supplierGstin: '27AABCS9911Q1ZX',
    department: 'Manufacturing & Production',
    buyerName: 'Karthik Raja',
    items: [
      {
        id: 'ITM-5',
        productId: 'P-105',
        productName: 'SKF Deep Groove Ball Bearing 6312-2Z',
        brand: 'SKF',
        sku: 'BRG-SKF-6312',
        category: 'Bearings',
        orderedQty: 60,
        receivedQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        unitPrice: 1950,
        discountPercent: 5,
        taxPercent: 18,
        subtotal: 111150,
        taxAmount: 20007,
        total: 131157,
        unit: 'Pieces',
      },
    ],
    subtotal: 111150,
    totalDiscount: 5850,
    cgst: 0,
    sgst: 0,
    igst: 20007,
    grossTotal: 131157,
    paymentTerms: 'Net 15 Days',
    expectedDeliveryDate: '2026-11-26',
    deliveryWarehouse: 'Main Central Hub - Chennai',
    approvalStatus: 'Submitted',
    grnStatus: 'Pending GRN',
    billingStatus: 'Unbilled',
    notes: 'Awaiting secondary managerial budget check.',
  },
];

export const SEED_GRNS: GrnInspectionRecord[] = [
  {
    id: 'GRN-001',
    grnNumber: 'GRN-2026-0481',
    grnDate: '2026-11-16 11:30',
    poNumber: 'PO-2026-0891',
    supplierName: 'Siemens Industrial Automation Ltd',
    supplierDeliveryChallan: 'DC-SIEM-99201',
    warehouseName: 'Main Central Hub - Chennai',
    batchLotNumber: 'LOT-SIEM-2026-B1',
    qcInspector: 'Dinesh Kumar (Chief QA)',
    items: [
      {
        productId: 'P-101',
        productName: 'Siemens 15HP Induction Motor 4-Pole',
        orderedQty: 10,
        receivedQty: 10,
        acceptedQty: 10,
        rejectedQty: 0,
      },
      {
        productId: 'P-102',
        productName: 'Siemens Heavy-Duty Overload Contactor 40A',
        orderedQty: 25,
        receivedQty: 25,
        acceptedQty: 25,
        rejectedQty: 0,
      },
    ],
    qcStatus: 'QC Passed',
    status: 'Verified & Stocked',
    remarks: 'Full delivery in excellent condition. Motor insulation tested 100MΩ.',
    returnGenerated: false,
  },
  {
    id: 'GRN-002',
    grnNumber: 'GRN-2026-0482',
    grnDate: '2026-11-18 15:45',
    poNumber: 'PO-2026-0892',
    supplierName: 'ABB Power & Drives India Pvt Ltd',
    supplierDeliveryChallan: 'DC-ABB-4418',
    warehouseName: 'R&D Testing Facility - Bengaluru',
    batchLotNumber: 'LOT-ABB-ACS-88',
    qcInspector: 'R. Srikumar (Lead QA)',
    items: [
      {
        productId: 'P-103',
        productName: 'ABB Variable Frequency Drive ACS580 11kW',
        orderedQty: 8,
        receivedQty: 8,
        acceptedQty: 7,
        rejectedQty: 1,
        rejectionReason: 'Heatsink flange fractured during transit; display bezel loose.',
      },
    ],
    qcStatus: 'QC Failed with Rejections',
    status: 'Verified & Stocked',
    remarks: '7 Units accepted into stock. 1 unit quarantined for supplier return.',
    returnGenerated: true,
  },
];

export const SEED_BILLS: PurchaseBillRecord[] = [
  {
    id: 'BILL-001',
    billNumber: 'PB-2026-0411',
    billDate: '2026-11-17',
    dueDate: '2026-12-17',
    supplierId: 'SUP-001',
    supplierName: 'Siemens Industrial Automation Ltd',
    supplierGstin: '27AAACS1234F1Z8',
    poNumber: 'PO-2026-0891',
    grnNumber: 'GRN-2026-0481',
    department: 'Manufacturing & Production',
    subtotal: 465500,
    cgst: 41895,
    sgst: 41895,
    igst: 0,
    roundOff: 0,
    grossAmount: 549290,
    paidAmount: 250000,
    outstandingBalance: 299290,
    threeWayMatchStatus: 'Matched',
    paymentStatus: 'Partially Paid',
    status: 'Approved',
    paymentHistory: [
      {
        voucherNumber: 'PV-2026-0091',
        date: '2026-11-18',
        amount: 250000,
        mode: 'NEFT',
        refNumber: 'UTR-HDFC-991823901',
      },
    ],
  },
  {
    id: 'BILL-002',
    billNumber: 'PB-2026-0412',
    billDate: '2026-11-18',
    dueDate: '2027-01-02',
    supplierId: 'SUP-002',
    supplierName: 'ABB Power & Drives India Pvt Ltd',
    supplierGstin: '29AAACA0123P1Z2',
    poNumber: 'PO-2026-0892',
    grnNumber: 'GRN-2026-0482',
    department: 'R&D and Engineering',
    subtotal: 342160, // Adjusted for 7 accepted units
    cgst: 0,
    sgst: 0,
    igst: 61588.8,
    roundOff: 0.2,
    grossAmount: 403749,
    paidAmount: 0,
    outstandingBalance: 403749,
    threeWayMatchStatus: 'Matched',
    paymentStatus: 'Unpaid',
    status: 'Approved',
    paymentHistory: [],
  },
];

export const SEED_PAYMENTS: PaymentMadeVoucher[] = [
  {
    id: 'PAY-001',
    voucherNumber: 'PV-2026-0091',
    paymentDate: '2026-11-18',
    supplierId: 'SUP-001',
    supplierName: 'Siemens Industrial Automation Ltd',
    billNumber: 'PB-2026-0411',
    poNumber: 'PO-2026-0891',
    amountPaid: 250000,
    paymentMode: 'NEFT',
    utrTransactionRef: 'UTR-HDFC-991823901',
    bankAccount: 'Corporate Current A/c - HDFC 99120',
    reconciliationStatus: 'Reconciled',
    status: 'Completed',
    notes: 'Advance installment towards PO-2026-0891 motors delivery.',
  },
];

export const SEED_RETURNS: PurchaseReturnRecord[] = [
  {
    id: 'RET-001',
    returnNumber: 'PRN-2026-0031',
    returnDate: '2026-11-19',
    poNumber: 'PO-2026-0892',
    grnNumber: 'GRN-2026-0482',
    supplierName: 'ABB Power & Drives India Pvt Ltd',
    items: [
      {
        productName: 'ABB Variable Frequency Drive ACS580 11kW',
        quantity: 1,
        unitPrice: 52000,
        totalAmount: 57678, // with 18% GST net of discount
        reason: 'Heatsink flange fractured in transit; QC inspection failed.',
      },
    ],
    totalReturnAmount: 57678,
    actionTaken: 'Supplier Debit Note',
    debitNoteNumber: 'DN-2026-081',
    debitNoteAmount: 57678,
    status: 'Approved',
    notes: 'Approved by Dr. Anand Ramanathan. Debit Note issued to offset supplier ledger.',
  },
];

export const SEED_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: 'PR-001',
    prNumber: 'PR-2026-014',
    prDate: '2026-11-05',
    requestedBy: 'Karthik Raja (Senior Buyer)',
    department: 'Manufacturing & Production',
    priority: 'Critical',
    purpose: 'Routine replacement of aging induction motors on Assembly Conveyor #2.',
    estimatedTotal: 550000,
    status: 'Converted to PO',
    approvedBy: 'Rajesh Subramanian',
    approvalDate: '2026-11-07',
    poNumber: 'PO-2026-0891',
    items: [],
  },
  {
    id: 'PR-002',
    prNumber: 'PR-2026-035',
    prDate: '2026-11-18',
    requestedBy: 'Vignesh Raman',
    department: 'Operations & Maintenance',
    priority: 'High',
    purpose: 'Pneumatic solenoids and high-pressure hose fittings for plant maintenance overhaul.',
    estimatedTotal: 280000,
    status: 'Pending Approval',
    items: [],
  },
  {
    id: 'PR-003',
    prNumber: 'PR-2026-036',
    prDate: '2026-11-19',
    requestedBy: 'Murugan Pillai',
    department: 'IT & Infrastructure',
    priority: 'Medium',
    purpose: 'Server rack replacement power supplies and gigabit industrial switches.',
    estimatedTotal: 340000,
    status: 'Pending Approval',
    items: [],
  },
];

// ============================================================================
// 3. REACT CONTEXT / LOCAL STORAGE CUSTOM HOOK
// ============================================================================

export function usePurchaseStore() {
  const [departments, setDepartments] = useState<DepartmentBudgetRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_departments');
    return raw ? JSON.parse(raw) : SEED_DEPARTMENTS;
  });

  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_suppliers');
    return raw ? JSON.parse(raw) : SEED_SUPPLIERS;
  });

  const [orders, setOrders] = useState<PurchaseOrderRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_orders');
    return raw ? JSON.parse(raw) : SEED_PURCHASE_ORDERS;
  });

  const [grns, setGrns] = useState<GrnInspectionRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_grns');
    return raw ? JSON.parse(raw) : SEED_GRNS;
  });

  const [bills, setBills] = useState<PurchaseBillRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_bills');
    return raw ? JSON.parse(raw) : SEED_BILLS;
  });

  const [payments, setPayments] = useState<PaymentMadeVoucher[]>(() => {
    const raw = localStorage.getItem('erp_purchase_payments');
    return raw ? JSON.parse(raw) : SEED_PAYMENTS;
  });

  const [returns, setReturns] = useState<PurchaseReturnRecord[]>(() => {
    const raw = localStorage.getItem('erp_purchase_returns');
    return raw ? JSON.parse(raw) : SEED_RETURNS;
  });

  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(() => {
    const raw = localStorage.getItem('erp_purchase_requisitions');
    return raw ? JSON.parse(raw) : SEED_REQUISITIONS;
  });

  // Safe localStorage helper
  const safeSave = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`[Storage] Failed to save key '${key}'. Kept in memory.`);
    }
  };

  // Sync with localStorage
  useEffect(() => {
    safeSave('erp_purchase_departments', departments);
  }, [departments]);

  useEffect(() => {
    safeSave('erp_purchase_suppliers', suppliers);
  }, [suppliers]);

  useEffect(() => {
    safeSave('erp_purchase_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSave('erp_purchase_grns', grns);
  }, [grns]);

  useEffect(() => {
    safeSave('erp_purchase_bills', bills);
  }, [bills]);

  useEffect(() => {
    safeSave('erp_purchase_payments', payments);
  }, [payments]);

  useEffect(() => {
    safeSave('erp_purchase_returns', returns);
  }, [returns]);

  useEffect(() => {
    safeSave('erp_purchase_requisitions', requisitions);
  }, [requisitions]);

  // Derived Business KPI Metrics
  const totalProcurementSpend = orders
    .filter((o) => o.approvalStatus === 'Approved')
    .reduce((sum, o) => sum + o.grossTotal, 0);

  const totalOrdersCount = orders.length;

  const pendingApprovalsCount = orders.filter((o) => o.approvalStatus === 'Submitted').length;

  const pendingDeliveriesCount = orders.filter(
    (o) => o.approvalStatus === 'Approved' && o.grnStatus !== 'Completely Received'
  ).length;

  const totalOutstandingPayables = bills.reduce(
    (sum, b) => sum + (b.outstandingBalance || 0),
    0
  );

  return {
    departments,
    setDepartments,
    suppliers,
    setSuppliers,
    orders,
    setOrders,
    grns,
    setGrns,
    bills,
    setBills,
    payments,
    setPayments,
    returns,
    setReturns,
    requisitions,
    setRequisitions,
    // Metrics
    totalProcurementSpend,
    totalOrdersCount,
    pendingApprovalsCount,
    pendingDeliveriesCount,
    totalOutstandingPayables,
  };
}
