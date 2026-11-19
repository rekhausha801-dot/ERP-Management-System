import { Quotation, SalesOrder, ReturnItem } from '../types';

export interface QuotationItem {
  id: string;
  itemName: string;
  sku: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxRatePercent: number;
  totalAmount: number;
}

export interface DetailedQuotation {
  id: string;
  quoteNumber: string;
  revision: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  issueDate: string;
  validUntil: string;
  salesExecutive: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired' | 'Converted to Order';
  convertedOrderNumber?: string;
  notes?: string;
  termsAndConditions?: string;
}

export interface QuotationTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  category: 'Standard Goods' | 'Equipment Supply' | 'Annual Maintenance' | 'Custom Project';
  currency: string;
  defaultValidityDays: number;
  defaultDiscountPercent: number;
  defaultTaxPercent: number;
  termsAndConditions: string;
  companyBranding: {
    headerColor: string;
    showLogo: boolean;
    footerText: string;
  };
  isActive: boolean;
  usageCount: number;
  lastUpdated: string;
}

export interface DetailedSalesOrder {
  id: string;
  orderNumber: string;
  quoteReference?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  expectedDelivery: string;
  salesExecutive: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Partially Delivered';
  shippingAddress: string;
  billingAddress: string;
  trackingNumber?: string;
  carrierName?: string;
  fulfilmentProgress: number; // 0 to 100%
  status: 'Confirmed' | 'In Progress' | 'Shipped' | 'Fulfilled' | 'Cancelled';
}

export interface ProformaInvoice {
  id: string;
  proformaNumber: string;
  orderReference: string;
  customerName: string;
  customerGst?: string;
  issueDate: string;
  validUntil: string;
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentTerms: string;
  salesExecutive: string;
  status: 'Draft' | 'Issued' | 'Converted to Tax Invoice' | 'Expired';
  convertedInvoiceNumber?: string;
}

export interface SalesTargetRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  targetPeriod: 'Monthly' | 'Quarterly' | 'Annual';
  periodLabel: string;
  targetRevenue: number;
  achievedRevenue: number;
  targetDeals: number;
  achievedDeals: number;
  commissionEligible: boolean;
  status: 'Active' | 'Closed';
}

export interface SalesCommissionRule {
  id: string;
  ruleCode: string;
  ruleName: string;
  appliesTo: string;
  thresholdRevenue: number;
  baseCommissionPercent: number;
  acceleratorPercent: number;
  calculatedThisMonth: number;
  status: 'Active' | 'Paused';
}

export interface DetailedSalesReturn {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  returnDate: string;
  reason: 'Defective' | 'Wrong Item' | 'Damaged in Transit' | 'Customer Cancel' | 'Exchange';
  returnedQuantity: number;
  claimAmount: number;
  refundMethod: 'Credit Note' | 'Bank Refund' | 'Replacement';
  creditNoteNumber?: string;
  inspectionNotes?: string;
  status: 'Requested' | 'Inspecting' | 'Approved' | 'Refunded' | 'Rejected';
}

// -------------------------------------------------------------
// INITIAL MOCK DATASETS
// -------------------------------------------------------------

export const INITIAL_QUOTATIONS: DetailedQuotation[] = [
  {
    id: 'qt-1',
    quoteNumber: 'QT-2026-881',
    revision: 1,
    customerName: 'Apex Precision Tools Ltd',
    customerEmail: 'ramesh@apexprecision.com',
    customerPhone: '+91 98412 11002',
    issueDate: '2026-11-13',
    validUntil: '2026-12-13',
    salesExecutive: 'Vikram Seth',
    subtotal: 400000,
    discountAmount: 20000,
    taxAmount: 68400,
    grandTotal: 448400,
    status: 'Approved',
    convertedOrderNumber: 'SO-2026-401',
    notes: 'Bulk purchase discount applied with standard 1-year equipment warranty.',
    termsAndConditions: '1. Payment: 50% advance, balance against delivery.\n2. Delivery within 14 business days from PO.\n3. Prices inclusive of transit insurance.',
    items: [
      {
        id: 'item-1',
        itemName: '15kW Variable Frequency Drive (VFD)',
        sku: 'VFD-15KW-EMC',
        quantity: 8,
        unitPrice: 42000,
        discountPercent: 5,
        taxRatePercent: 18,
        totalAmount: 376740,
      },
      {
        id: 'item-2',
        itemName: 'Harmonic Filter Choke 45A',
        sku: 'FLT-CHK-45A',
        quantity: 4,
        unitPrice: 16000,
        discountPercent: 0,
        taxRatePercent: 18,
        totalAmount: 75520,
      },
    ],
  },
  {
    id: 'qt-2',
    quoteNumber: 'QT-2026-882',
    revision: 2,
    customerName: 'Omni Infra Ventures',
    customerEmail: 'priya@omniinfra.in',
    customerPhone: '+91 97890 33441',
    issueDate: '2026-11-15',
    validUntil: '2026-12-15',
    salesExecutive: 'Ananya Sharma',
    subtotal: 1100000,
    discountAmount: 50000,
    taxAmount: 189000,
    grandTotal: 1239000,
    status: 'Sent',
    notes: 'Special project pricing approved by VP Sales.',
    termsAndConditions: '1. Net 30 payment terms upon installation sign-off.\n2. Equipment supply with on-site commissioning.\n3. Taxes as applicable at billing time.',
    items: [
      {
        id: 'item-3',
        itemName: 'Heavy Duty Hydraulic Pump Unit',
        sku: 'HYD-PMP-75B',
        quantity: 3,
        unitPrice: 320000,
        discountPercent: 5,
        taxRatePercent: 18,
        totalAmount: 1076160,
      },
      {
        id: 'item-4',
        itemName: 'Pneumatic Directional Valve Rack',
        sku: 'PNM-VLV-RCK',
        quantity: 2,
        unitPrice: 70000,
        discountPercent: 0,
        taxRatePercent: 18,
        totalAmount: 165200,
      },
    ],
  },
  {
    id: 'qt-3',
    quoteNumber: 'QT-2026-883',
    revision: 1,
    customerName: 'Southern Automation Works',
    customerEmail: 'karthik@southauto.com',
    customerPhone: '+91 94441 55667',
    issueDate: '2026-11-16',
    validUntil: '2026-12-16',
    salesExecutive: 'Vikram Seth',
    subtotal: 850000,
    discountAmount: 0,
    taxAmount: 153000,
    grandTotal: 1003000,
    status: 'Draft',
    notes: 'Draft proposal under engineering review.',
    termsAndConditions: 'Standard warranty and delivery terms apply.',
    items: [
      {
        id: 'item-5',
        itemName: 'PLC Automation Central Rack',
        sku: 'PLC-CPU-800',
        quantity: 5,
        unitPrice: 170000,
        discountPercent: 0,
        taxRatePercent: 18,
        totalAmount: 1003000,
      },
    ],
  },
];

export const INITIAL_QUOTATION_TEMPLATES: QuotationTemplate[] = [
  {
    id: 'tmpl-1',
    templateCode: 'TMP-STANDARD-01',
    templateName: 'Standard Commercial Goods Proposal',
    category: 'Standard Goods',
    currency: 'INR (₹)',
    defaultValidityDays: 30,
    defaultDiscountPercent: 5,
    defaultTaxPercent: 18,
    termsAndConditions: '1. Standard payment terms: 100% advance or Net 15 against verified PO.\n2. Goods once sold are covered under 12-month manufacturer replacement warranty.\n3. Rates are ex-works warehouse unless freight is explicitly billed.',
    companyBranding: {
      headerColor: '#5421A8',
      showLogo: true,
      footerText: 'Authorized Multi-Tenant Sales ERP Partner • Certified ISO 9001:2015',
    },
    isActive: true,
    usageCount: 48,
    lastUpdated: '2026-11-10',
  },
  {
    id: 'tmpl-2',
    templateCode: 'TMP-HEAVY-EQ-02',
    templateName: 'Heavy Machinery & Engineering Supply Contract',
    category: 'Equipment Supply',
    currency: 'INR (₹)',
    defaultValidityDays: 45,
    defaultDiscountPercent: 8,
    defaultTaxPercent: 18,
    termsAndConditions: '1. Mobilization advance: 30%, dispatch release: 60%, post-commissioning sign-off: 10%.\n2. Delivery timeline: 4 to 6 weeks from technical clearance.\n3. Erection and commissioning supervision included for up to 5 days.',
    companyBranding: {
      headerColor: '#3B1678',
      showLogo: true,
      footerText: 'Heavy Equipment Division • Precision Manufacturing Platform',
    },
    isActive: true,
    usageCount: 22,
    lastUpdated: '2026-11-05',
  },
  {
    id: 'tmpl-3',
    templateCode: 'TMP-AMC-SERV-03',
    templateName: 'Annual Maintenance Contract (Comprehensive)',
    category: 'Annual Maintenance',
    currency: 'INR (₹)',
    defaultValidityDays: 60,
    defaultDiscountPercent: 0,
    defaultTaxPercent: 18,
    termsAndConditions: '1. Includes 4 quarterly preventive visits and unlimited emergency breakdown visits.\n2. Spare parts up to ₹25,000 threshold included in comprehensive tier.\n3. Billing quarterly in advance.',
    companyBranding: {
      headerColor: '#0284C7',
      showLogo: true,
      footerText: 'Service Operations ERP Platform • 24/7 SLA Response',
    },
    isActive: true,
    usageCount: 15,
    lastUpdated: '2026-11-12',
  },
];

export const INITIAL_DETAILED_ORDERS: DetailedSalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-401',
    quoteReference: 'QT-2026-881',
    customerName: 'Apex Precision Tools Ltd',
    customerEmail: 'ramesh@apexprecision.com',
    customerPhone: '+91 98412 11002',
    orderDate: '2026-11-14',
    expectedDelivery: '2026-11-20',
    salesExecutive: 'Vikram Seth',
    subtotal: 380000,
    taxAmount: 68400,
    grandTotal: 448400,
    paymentStatus: 'Partially Paid',
    deliveryStatus: 'Processing',
    shippingAddress: 'Plot 45, Ambattur Industrial Estate, Chennai, TN 600058',
    billingAddress: 'Plot 45, Ambattur Industrial Estate, Chennai, TN 600058',
    carrierName: 'VRL Logistics Express',
    trackingNumber: 'VRL-992104-CHE',
    fulfilmentProgress: 45,
    status: 'In Progress',
    items: [
      {
        id: 'item-1',
        itemName: '15kW Variable Frequency Drive (VFD)',
        sku: 'VFD-15KW-EMC',
        quantity: 8,
        unitPrice: 42000,
        discountPercent: 5,
        taxRatePercent: 18,
        totalAmount: 376740,
      },
    ],
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-402',
    quoteReference: 'QT-2026-879',
    customerName: 'Southern Automation Works',
    customerEmail: 'karthik@southauto.com',
    customerPhone: '+91 94441 55667',
    orderDate: '2026-11-11',
    expectedDelivery: '2026-11-18',
    salesExecutive: 'Vikram Seth',
    subtotal: 800000,
    taxAmount: 144000,
    grandTotal: 944000,
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped',
    shippingAddress: '12 Electronic City, Phase 1, Hosur Road, Bangalore, KA 560100',
    billingAddress: '12 Electronic City, Phase 1, Hosur Road, Bangalore, KA 560100',
    carrierName: 'BlueDart Surface Freight',
    trackingNumber: 'BLU-881290-BLR',
    fulfilmentProgress: 85,
    status: 'Shipped',
    items: [
      {
        id: 'item-2',
        itemName: 'Harmonic Filter Choke 45A',
        sku: 'FLT-CHK-45A',
        quantity: 50,
        unitPrice: 16000,
        discountPercent: 0,
        taxRatePercent: 18,
        totalAmount: 944000,
      },
    ],
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2026-403',
    quoteReference: 'QT-2026-875',
    customerName: 'Kaveri Engineering Works',
    customerEmail: 'purchase@kaverieng.com',
    customerPhone: '+91 98401 22334',
    orderDate: '2026-11-08',
    expectedDelivery: '2026-11-15',
    salesExecutive: 'Ananya Sharma',
    subtotal: 350000,
    taxAmount: 63000,
    grandTotal: 413000,
    paymentStatus: 'Paid',
    deliveryStatus: 'Delivered',
    shippingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    billingAddress: 'Peenya 3rd Stage, Bangalore, KA 560058',
    carrierName: 'SafeXpress Logistics',
    trackingNumber: 'SFX-112093-BLR',
    fulfilmentProgress: 100,
    status: 'Fulfilled',
    items: [
      {
        id: 'item-3',
        itemName: 'Digital Sensor Interface Module',
        sku: 'SNS-INT-DIG',
        quantity: 20,
        unitPrice: 17500,
        discountPercent: 0,
        taxRatePercent: 18,
        totalAmount: 413000,
      },
    ],
  },
];

export const INITIAL_PROFORMA_INVOICES: ProformaInvoice[] = [
  {
    id: 'pi-1',
    proformaNumber: 'PI-2026-301',
    orderReference: 'SO-2026-401',
    customerName: 'Apex Precision Tools Ltd',
    customerGst: '33AABCA1234F1Z8',
    issueDate: '2026-11-14',
    validUntil: '2026-11-28',
    totalAmount: 380000,
    taxAmount: 68400,
    grandTotal: 448400,
    paymentTerms: '50% Advance against PI',
    salesExecutive: 'Vikram Seth',
    status: 'Converted to Tax Invoice',
    convertedInvoiceNumber: 'INV-2026-1044',
  },
  {
    id: 'pi-2',
    proformaNumber: 'PI-2026-302',
    orderReference: 'SO-2026-402',
    customerName: 'Southern Automation Works',
    customerGst: '29AABCS5678K1Z3',
    issueDate: '2026-11-11',
    validUntil: '2026-11-25',
    totalAmount: 800000,
    taxAmount: 144000,
    grandTotal: 944000,
    paymentTerms: '100% advance clearance',
    salesExecutive: 'Vikram Seth',
    status: 'Converted to Tax Invoice',
    convertedInvoiceNumber: 'INV-2026-1045',
  },
  {
    id: 'pi-3',
    proformaNumber: 'PI-2026-303',
    orderReference: 'SO-2026-404',
    customerName: 'Omni Infra Ventures',
    customerGst: '33AAFCO9900M1ZP',
    issueDate: '2026-11-16',
    validUntil: '2026-11-30',
    totalAmount: 1050000,
    taxAmount: 189000,
    grandTotal: 1239000,
    paymentTerms: 'Net 30 with Letter of Credit',
    salesExecutive: 'Ananya Sharma',
    status: 'Issued',
  },
];

export const INITIAL_SALES_TARGETS: SalesTargetRecord[] = [
  {
    id: 'st-1',
    employeeName: 'Vikram Seth',
    employeeId: 'EMP-1021',
    designation: 'Senior Enterprise Account Executive',
    targetPeriod: 'Monthly',
    periodLabel: 'November 2026',
    targetRevenue: 2500000,
    achievedRevenue: 2240000,
    targetDeals: 6,
    achievedDeals: 5,
    commissionEligible: true,
    status: 'Active',
  },
  {
    id: 'st-2',
    employeeName: 'Ananya Sharma',
    employeeId: 'EMP-1024',
    designation: 'Lead Business Development Manager',
    targetPeriod: 'Monthly',
    periodLabel: 'November 2026',
    targetRevenue: 2000000,
    achievedRevenue: 1850000,
    targetDeals: 5,
    achievedDeals: 4,
    commissionEligible: true,
    status: 'Active',
  },
  {
    id: 'st-3',
    employeeName: 'Kavitha Ramachandran',
    employeeId: 'EMP-1033',
    designation: 'Channel Sales Specialist',
    targetPeriod: 'Quarterly',
    periodLabel: 'Q3 FY2026 (Oct - Dec)',
    targetRevenue: 6000000,
    achievedRevenue: 4300000,
    targetDeals: 15,
    achievedDeals: 11,
    commissionEligible: true,
    status: 'Active',
  },
  {
    id: 'st-4',
    employeeName: 'Arjun Menon',
    employeeId: 'EMP-1042',
    designation: 'Inside Sales Executive',
    targetPeriod: 'Annual',
    periodLabel: 'FY 2026 - 2027',
    targetRevenue: 15000000,
    achievedRevenue: 11800000,
    targetDeals: 40,
    achievedDeals: 32,
    commissionEligible: true,
    status: 'Active',
  },
];

export const INITIAL_COMMISSION_RULES: SalesCommissionRule[] = [
  {
    id: 'com-1',
    ruleCode: 'COMM-ENT-DIRECT',
    ruleName: 'Direct Enterprise Account Commission',
    appliesTo: 'Enterprise Sales Executives',
    thresholdRevenue: 1500000,
    baseCommissionPercent: 3.5,
    acceleratorPercent: 5.0,
    calculatedThisMonth: 124500,
    status: 'Active',
  },
  {
    id: 'com-2',
    ruleCode: 'COMM-DIST-CHANNEL',
    ruleName: 'Regional Distributor Channel Override',
    appliesTo: 'Channel Sales Managers',
    thresholdRevenue: 2000000,
    baseCommissionPercent: 2.0,
    acceleratorPercent: 3.5,
    calculatedThisMonth: 86000,
    status: 'Active',
  },
  {
    id: 'com-3',
    ruleCode: 'COMM-NEW-CLIENT',
    ruleName: 'New Client Onboarding Bonus',
    appliesTo: 'Business Development Executives',
    thresholdRevenue: 500000,
    baseCommissionPercent: 4.0,
    acceleratorPercent: 6.0,
    calculatedThisMonth: 62000,
    status: 'Active',
  },
];

export const INITIAL_DETAILED_RETURNS: DetailedSalesReturn[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2026-081',
    orderNumber: 'SO-2026-398',
    customerName: 'Metro Power Systems',
    returnDate: '2026-11-12',
    reason: 'Defective',
    returnedQuantity: 2,
    claimAmount: 84000,
    refundMethod: 'Credit Note',
    creditNoteNumber: 'CN-2026-014',
    inspectionNotes: 'Capacitor overheating fault confirmed by QA lab. Replacement unit approved.',
    status: 'Refunded',
  },
  {
    id: 'ret-2',
    returnNumber: 'RET-2026-082',
    orderNumber: 'SO-2026-401',
    customerName: 'Apex Precision Tools Ltd',
    returnDate: '2026-11-16',
    reason: 'Wrong Item',
    returnedQuantity: 1,
    claimAmount: 42000,
    refundMethod: 'Replacement',
    inspectionNotes: 'Customer ordered 15kW but received 11kW batch in packing mix-up.',
    status: 'Approved',
  },
  {
    id: 'ret-3',
    returnNumber: 'RET-2026-083',
    orderNumber: 'SO-2026-390',
    customerName: 'Precision Tools Co',
    returnDate: '2026-11-15',
    reason: 'Damaged in Transit',
    returnedQuantity: 3,
    claimAmount: 51000,
    refundMethod: 'Credit Note',
    inspectionNotes: 'Outer casing broken during freight transit. Freight insurance claim filed.',
    status: 'Inspecting',
  },
];
