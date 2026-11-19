import {
  Customer,
  Lead,
  Enquiry,
  Quotation,
  SalesOrder,
  Invoice,
  Payment,
  ServiceTicket,
} from '../types';

export type PipelineStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface ExtendedLead extends Omit<Lead, 'status'> {
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  alternatePhone?: string;
  address?: string;
  industry?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  expectedRevenue: number;
  expectedClosingDate?: string;
  notes?: string;
  stage: PipelineStage;
  city?: string;
  state?: string;
  isConverted?: boolean;
  convertedCustomerId?: string;
  conversionDate?: string;
}

export interface LeadSource {
  id: string;
  name: string;
  code: string;
  description: string;
  totalLeads: number;
  conversionRate: number;
  isActive: boolean;
  createdDate: string;
}

export interface LeadAssignmentRecord {
  id: string;
  leadId: string;
  leadCode: string;
  companyName: string;
  assignedFrom: string;
  assignedTo: string;
  assignedDate: string;
  assignedBy: string;
  reason?: string;
  status: 'Active' | 'Reassigned' | 'Completed';
}

export interface ExtendedEnquiry {
  id: string;
  enquiryNumber: string;
  clientType: 'Lead' | 'Customer';
  clientId: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  enquiryDate: string;
  enquiryType: 'Product' | 'Service' | 'AMC' | 'Custom';
  requirements: string;
  quantity: number;
  budget: number;
  expectedResponseDate: string;
  assignedEmployee: string;
  status: 'Open' | 'Under Review' | 'Quoted' | 'Converted to Order' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  convertedQuotationNumber?: string;
}

export interface SalesActivity {
  id: string;
  activityType: 'Call' | 'Meeting' | 'Email' | 'Demonstration' | 'Site Visit' | 'Other';
  title: string;
  relatedType: 'Lead' | 'Customer';
  relatedId: string;
  relatedName: string;
  assignedEmployee: string;
  activityDate: string;
  activityTime: string;
  description: string;
  outcome: 'Positive / Interested' | 'Needs Follow-up' | 'Quotation Requested' | 'Not Interested' | 'Order Confirmed';
  nextAction: string;
  status: 'Completed' | 'Pending';
}

export interface UnifiedFollowUp {
  id: string;
  followUpDate: string;
  followUpTime: string;
  relatedType: 'Lead' | 'Customer';
  relatedId: string;
  relatedName: string;
  contactPerson: string;
  phone: string;
  assignedEmployee: string;
  followUpType: 'Call' | 'Meeting' | 'Email' | 'Site Visit';
  notes: string;
  reminder: 'None' | '15 mins before' | '1 hour before' | '1 day before';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Scheduled' | 'Completed' | 'Overdue' | 'Cancelled';
  createdAt: string;
}

export interface CustomerGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  groupType?: 'Enterprise' | 'Distributor' | 'SME' | 'Retail' | 'Government / Institutional' | 'Custom';
  pricingType?: 'Standard Pricing' | 'Group-based Pricing' | 'Custom Pricing';
  paymentTerms?: 'Advance Payment' | 'Net 7' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60' | 'Custom';
  defaultCreditLimit?: number;
  taxConfiguration?: string;
  assignedManager?: string;
  discountPercentage: number;
  creditDays: number;
  customerCount: number;
  status: 'Active' | 'Inactive';
}

export interface CustomerContactPerson {
  id: string;
  customerId: string;
  customerName: string;
  contactPersonName: string;
  designation: string;
  department: string;
  contactRole?: 'Decision Maker' | 'Procurement Specialist' | 'Technical Evaluator' | 'Finance / Billing' | 'Operations Lead' | 'Executive Sponsor' | 'Other';
  branchLocation?: string;
  email: string;
  phone: string;
  alternateEmail?: string;
  alternatePhone?: string;
  preferredCommunication?: 'Email' | 'Phone Call' | 'WhatsApp' | 'In-Person';
  reportingTo?: string;
  assignedAccountManager?: string;
  notes?: string;
  isPrimary: boolean;
  status: 'Active' | 'Inactive';
}

export type TimelineCategory =
  | 'Lead Management'
  | 'Customer Management'
  | 'Contact Management'
  | 'Quotations'
  | 'Sales Orders'
  | 'Invoices'
  | 'Payments'
  | 'Delivery & Shipment'
  | 'Calls & Communications'
  | 'Emails'
  | 'Meetings'
  | 'Follow-ups'
  | 'Service Requests'
  | 'Service Assignments'
  | 'Service Completion'
  | 'Complaints'
  | 'Document Management';

export type TimelineStatus =
  | 'Created'
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Confirmed'
  | 'Completed'
  | 'Overdue'
  | 'Cancelled'
  | 'Failed'
  | 'Resolved';

export interface CustomerActivityLog {
  id: string;
  customerId: string;
  customerName: string;
  activityCategory: TimelineCategory;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  refNumber?: string;
  amount?: number;
  status?: TimelineStatus;
  moduleType?: 'Sales' | 'Service' | 'Finance' | 'CRM';
  navigationPath?: string;
}

export interface ExtendedCustomer extends Customer {
  companyName?: string;
  customerType: 'Individual' | 'Business';
  alternatePhone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  gstNumber?: string;
  panNumber?: string;
  paymentTerms: string;
  assignedSalesRep: string;
  customerGroup: string;
  notes?: string;
  category?: 'Enterprise' | 'SME' | 'Retailer' | 'Distributor' | 'Govt';
  totalSalesValue?: number;
  createdAt?: string;
}

// -------------------------------------------------------------
// INITIAL MASTER DATA STORE
// -------------------------------------------------------------

export const INITIAL_LEAD_SOURCES: LeadSource[] = [
  { id: 'src-1', name: 'Website', code: 'WEB', description: 'Inbound organic website and SEO leads', totalLeads: 28, conversionRate: 32.5, isActive: true, createdDate: '2025-01-01' },
  { id: 'src-2', name: 'Referral', code: 'REF', description: 'Word of mouth and existing customer referrals', totalLeads: 42, conversionRate: 45.2, isActive: true, createdDate: '2025-01-05' },
  { id: 'src-3', name: 'Social Media', code: 'SOC', description: 'LinkedIn and enterprise social campaigns', totalLeads: 19, conversionRate: 21.0, isActive: true, createdDate: '2025-02-10' },
  { id: 'src-4', name: 'Advertisement', code: 'ADV', description: 'Print media, industrial directories, and portals', totalLeads: 15, conversionRate: 18.5, isActive: true, createdDate: '2025-02-15' },
  { id: 'src-5', name: 'Direct Contact', code: 'DIR', description: 'Direct email or phone enquiry received at HQ', totalLeads: 34, conversionRate: 38.0, isActive: true, createdDate: '2025-01-10' },
  { id: 'src-6', name: 'Campaign', code: 'CMP', description: 'Quarterly trade shows, exhibitions, and expos', totalLeads: 52, conversionRate: 41.8, isActive: true, createdDate: '2025-03-01' },
  { id: 'src-7', name: 'Other', code: 'OTH', description: 'Miscellaneous outreach and walk-ins', totalLeads: 11, conversionRate: 14.0, isActive: true, createdDate: '2025-03-15' },
];

export const INITIAL_EXTENDED_LEADS: ExtendedLead[] = [
  {
    id: 'lead-1',
    leadNumber: 'LD-2026-001',
    contactName: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    alternatePhone: '+91 98412 11003',
    address: '42 Commercial Axis, Mount Road, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Precision Engineering & Tooling',
    source: 'Exhibition',
    status: 'Qualified',
    stage: 'Qualified',
    priority: 'High',
    estimatedValue: 450000,
    expectedRevenue: 450000,
    expectedClosingDate: '2026-11-30',
    assignedTo: 'Vikram Seth',
    createdAt: '2026-11-12',
    notes: 'Requires 15kW Heavy Duty Frequency Drives with 2 years warranty.',
    isConverted: true,
    convertedCustomerId: 'cust-1',
    conversionDate: '2026-11-15',
  },
  {
    id: 'lead-2',
    leadNumber: 'LD-2026-002',
    contactName: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    alternatePhone: '+91 97890 33442',
    address: '104 Tech Park Avenue, Electronic City',
    city: 'Bengaluru',
    state: 'Karnataka',
    industry: 'Infrastructure & Construction',
    source: 'Website',
    status: 'Proposal',
    stage: 'Proposal',
    priority: 'Urgent',
    estimatedValue: 1200000,
    expectedRevenue: 1200000,
    expectedClosingDate: '2026-12-05',
    assignedTo: 'Ananya Sharma',
    createdAt: '2026-11-14',
    notes: 'Commercial quotation sent. Negotiating lead time for 20 units.',
    isConverted: true,
    convertedCustomerId: 'cust-3',
    conversionDate: '2026-11-16',
  },
  {
    id: 'lead-3',
    leadNumber: 'LD-2026-003',
    contactName: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    alternatePhone: '+91 94441 55668',
    address: '88 Industrial Estate, Peelamedu',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    industry: 'Factory Automation & Robotics',
    source: 'Referral',
    status: 'Negotiation',
    stage: 'Negotiation',
    priority: 'High',
    estimatedValue: 850000,
    expectedRevenue: 850000,
    expectedClosingDate: '2026-11-25',
    assignedTo: 'Vikram Seth',
    createdAt: '2026-11-10',
    notes: 'Reviewing payment milestone terms (50% advance, 50% on dispatch).',
    isConverted: true,
    convertedCustomerId: 'cust-2',
    conversionDate: '2026-11-14',
  },
  {
    id: 'lead-4',
    leadNumber: 'LD-2026-004',
    contactName: 'Dr. Ashok Kumar',
    companyName: 'Bharat Bio Labs',
    email: 'ashok@bharatbio.org',
    phone: '+91 98210 99882',
    alternatePhone: '+91 98210 99883',
    address: '12 Biotech Zone, GIDC',
    city: 'Vadodara',
    state: 'Gujarat',
    industry: 'Pharmaceuticals & Life Sciences',
    source: 'Campaign',
    status: 'New',
    stage: 'New',
    priority: 'Medium',
    estimatedValue: 620000,
    expectedRevenue: 620000,
    expectedClosingDate: '2026-12-15',
    assignedTo: 'Ananya Sharma',
    createdAt: '2026-11-16',
    notes: 'Inbound enquiry from healthcare automation exhibition.',
    isConverted: false,
  },
  {
    id: 'lead-5',
    leadNumber: 'LD-2026-005',
    contactName: 'Manish Verma',
    companyName: 'Verma Fabricators & Co',
    email: 'verma@vermafab.com',
    phone: '+91 98455 12099',
    alternatePhone: '+91 98455 12098',
    address: 'Plot 31, Ambattur Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Metal Fabrication & Sheet Works',
    source: 'Cold Outreach',
    status: 'Contacted',
    stage: 'Contacted',
    priority: 'Low',
    estimatedValue: 310000,
    expectedRevenue: 310000,
    expectedClosingDate: '2026-12-20',
    assignedTo: 'Vikram Seth',
    createdAt: '2026-11-15',
    notes: 'Initial call done. Scheduled technical demo next Tuesday.',
    isConverted: false,
  },
];

export const INITIAL_EXTENDED_ENQUIRIES: ExtendedEnquiry[] = [
  {
    id: 'enq-101',
    enquiryNumber: 'ENQ-2026-901',
    clientType: 'Customer',
    clientId: 'cust-1',
    clientName: 'Apex Precision Tools Ltd',
    contactPerson: 'Ramesh Sundaram',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    enquiryDate: '2026-11-15',
    enquiryType: 'Product',
    requirements: 'Bulk order of 3-Phase Variable Frequency Drives 15kW with EMC filter kit.',
    quantity: 12,
    budget: 450000,
    expectedResponseDate: '2026-11-18',
    assignedEmployee: 'Vikram Seth',
    status: 'Quoted',
    priority: 'High',
    convertedQuotationNumber: 'QT-2026-881',
  },
  {
    id: 'enq-102',
    enquiryNumber: 'ENQ-2026-902',
    clientType: 'Customer',
    clientId: 'cust-3',
    clientName: 'Omni Infra Ventures',
    contactPerson: 'Priya Narayanan',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    enquiryDate: '2026-11-14',
    enquiryType: 'Product',
    requirements: 'Heavy duty hydraulic pump units and pneumatic valve manifold assembly.',
    quantity: 6,
    budget: 1200000,
    expectedResponseDate: '2026-11-19',
    assignedEmployee: 'Ananya Sharma',
    status: 'Quoted',
    priority: 'Urgent',
    convertedQuotationNumber: 'QT-2026-882',
  },
  {
    id: 'enq-103',
    enquiryNumber: 'ENQ-2026-903',
    clientType: 'Lead',
    clientId: 'lead-4',
    clientName: 'Bharat Bio Labs',
    contactPerson: 'Dr. Ashok Kumar',
    email: 'ashok@bharatbio.org',
    phone: '+91 98210 99882',
    enquiryDate: '2026-11-16',
    enquiryType: 'Service',
    requirements: 'Clean room ventilation control servo panel calibration & AMC package.',
    quantity: 1,
    budget: 620000,
    expectedResponseDate: '2026-11-20',
    assignedEmployee: 'Ananya Sharma',
    status: 'Under Review',
    priority: 'Medium',
  },
  {
    id: 'enq-104',
    enquiryNumber: 'ENQ-2026-904',
    clientType: 'Customer',
    clientId: 'cust-2',
    clientName: 'Southern Automation Works',
    contactPerson: 'Karthik Raja',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    enquiryDate: '2026-11-10',
    enquiryType: 'Product',
    requirements: 'Repeat batch: AC Servo Motors 750W with optical multi-turn encoders.',
    quantity: 25,
    budget: 850000,
    expectedResponseDate: '2026-11-12',
    assignedEmployee: 'Vikram Seth',
    status: 'Converted to Order',
    priority: 'High',
  },
];

export const INITIAL_SALES_ACTIVITIES: SalesActivity[] = [
  {
    id: 'act-1',
    activityType: 'Meeting',
    title: 'Quarterly Supply & SLA Review',
    relatedType: 'Customer',
    relatedId: 'cust-1',
    relatedName: 'Apex Precision Tools Ltd',
    assignedEmployee: 'Vikram Seth',
    activityDate: '2026-11-15',
    activityTime: '11:00 AM',
    description: 'Met with plant manager Ramesh Sundaram to review dispatch schedule for 12 drives.',
    outcome: 'Quotation Requested',
    nextAction: 'Send revised commercial quotation QT-2026-881 with 18% GST breakdown.',
    status: 'Completed',
  },
  {
    id: 'act-2',
    activityType: 'Call',
    title: 'Initial Discovery & Machine Spec Call',
    relatedType: 'Lead',
    relatedId: 'lead-5',
    relatedName: 'Verma Fabricators & Co',
    assignedEmployee: 'Vikram Seth',
    activityDate: '2026-11-16',
    activityTime: '03:15 PM',
    description: 'Discussed retrofitting obsolete DC motor with high-efficiency 3-Phase AC motor.',
    outcome: 'Positive / Interested',
    nextAction: 'Schedule on-site technical demonstration with senior engineer.',
    status: 'Completed',
  },
  {
    id: 'act-3',
    activityType: 'Demonstration',
    title: 'Product Demo: Modular PLC System',
    relatedType: 'Lead',
    relatedId: 'lead-4',
    relatedName: 'Bharat Bio Labs',
    assignedEmployee: 'Ananya Sharma',
    activityDate: '2026-11-17',
    activityTime: '02:00 PM',
    description: 'Demonstrated real-time data logging capabilities to laboratory procurement panel.',
    outcome: 'Needs Follow-up',
    nextAction: 'Submit compliance documentation and calibration certificates.',
    status: 'Completed',
  },
  {
    id: 'act-4',
    activityType: 'Site Visit',
    title: 'Factory Inspection & Pump Alignment',
    relatedType: 'Customer',
    relatedId: 'cust-3',
    relatedName: 'Omni Infra Ventures',
    assignedEmployee: 'Ananya Sharma',
    activityDate: '2026-11-14',
    activityTime: '10:30 AM',
    description: 'Checked piping layout and electrical supply panel at their site warehouse.',
    outcome: 'Order Confirmed',
    nextAction: 'Issue formal sales order SO-2026-401 upon receipt of PO.',
    status: 'Completed',
  },
];

export const INITIAL_UNIFIED_FOLLOW_UPS: UnifiedFollowUp[] = [
  {
    id: 'flw-1',
    followUpDate: '2026-11-20',
    followUpTime: '11:00 AM',
    relatedType: 'Customer',
    relatedId: 'cust-1',
    relatedName: 'Apex Precision Tools Ltd',
    contactPerson: 'Ramesh Sundaram',
    phone: '+91 98412 11002',
    assignedEmployee: 'Vikram Seth',
    followUpType: 'Meeting',
    notes: 'Contract review on quarterly spare parts supply agreement.',
    reminder: '1 day before',
    priority: 'High',
    status: 'Scheduled',
    createdAt: '2026-11-15',
  },
  {
    id: 'flw-2',
    followUpDate: '2026-11-21',
    followUpTime: '03:30 PM',
    relatedType: 'Lead',
    relatedId: 'lead-4',
    relatedName: 'Bharat Bio Labs',
    contactPerson: 'Dr. Ashok Kumar',
    phone: '+91 98210 99882',
    assignedEmployee: 'Ananya Sharma',
    followUpType: 'Call',
    notes: 'Follow-up regarding technical evaluation of the calibration certificates.',
    reminder: '1 hour before',
    priority: 'Medium',
    status: 'Scheduled',
    createdAt: '2026-11-16',
  },
  {
    id: 'flw-3',
    followUpDate: '2026-11-14',
    followUpTime: '02:00 PM',
    relatedType: 'Customer',
    relatedId: 'cust-2',
    relatedName: 'Southern Automation Works',
    contactPerson: 'Karthik Raja',
    phone: '+91 94441 55667',
    assignedEmployee: 'Vikram Seth',
    followUpType: 'Site Visit',
    notes: 'Confirmed delivery tracking and GRN sign-off.',
    reminder: 'None',
    priority: 'Medium',
    status: 'Completed',
    createdAt: '2026-11-10',
  },
  {
    id: 'flw-4',
    followUpDate: '2026-11-12',
    followUpTime: '10:00 AM',
    relatedType: 'Lead',
    relatedId: 'lead-5',
    relatedName: 'Verma Fabricators & Co',
    contactPerson: 'Manish Verma',
    phone: '+91 98455 12099',
    assignedEmployee: 'Vikram Seth',
    followUpType: 'Call',
    notes: 'Verify readiness of their workshop for sample equipment testing.',
    reminder: 'None',
    priority: 'Low',
    status: 'Overdue',
    createdAt: '2026-11-08',
  },
];

export const INITIAL_CUSTOMER_GROUPS: CustomerGroup[] = [
  {
    id: 'grp-1',
    code: 'GRP-ENT',
    name: 'Enterprise Corporate Accounts',
    description: 'High-volume corporate accounts with tailored contracts, dedicated account management, and priority dispatch.',
    groupType: 'Enterprise',
    pricingType: 'Group-based Pricing',
    paymentTerms: 'Net 45',
    defaultCreditLimit: 2500000,
    taxConfiguration: 'Standard GST 18%',
    assignedManager: 'Vikram Seth',
    discountPercentage: 12,
    creditDays: 45,
    customerCount: 14,
    status: 'Active',
  },
  {
    id: 'grp-2',
    code: 'GRP-DIST',
    name: 'Authorized Regional Distributors',
    description: 'Authorized stockists and regional logistics channel partners with wholesale tier discount structures.',
    groupType: 'Distributor',
    pricingType: 'Group-based Pricing',
    paymentTerms: 'Net 30',
    defaultCreditLimit: 1500000,
    taxConfiguration: 'Standard GST 18%',
    assignedManager: 'Ananya Sharma',
    discountPercentage: 18,
    creditDays: 30,
    customerCount: 22,
    status: 'Active',
  },
  {
    id: 'grp-3',
    code: 'GRP-SME',
    name: 'SME & Medium Industry',
    description: 'Medium manufacturing plants, machine shops, and engineering tooling workshops with credit lines.',
    groupType: 'SME',
    pricingType: 'Standard Pricing',
    paymentTerms: 'Net 15',
    defaultCreditLimit: 800000,
    taxConfiguration: 'Standard GST 18%',
    assignedManager: 'Vikram Seth',
    discountPercentage: 5,
    creditDays: 15,
    customerCount: 38,
    status: 'Active',
  },
  {
    id: 'grp-4',
    code: 'GRP-RET',
    name: 'Retailers & Direct Trade',
    description: 'Direct spot purchase, retail counter pickups, and walk-in buyers with upfront payment.',
    groupType: 'Retail',
    pricingType: 'Standard Pricing',
    paymentTerms: 'Advance Payment',
    defaultCreditLimit: 0,
    taxConfiguration: 'Standard GST 18%',
    assignedManager: 'Ananya Sharma',
    discountPercentage: 0,
    creditDays: 0,
    customerCount: 45,
    status: 'Active',
  },
  {
    id: 'grp-5',
    code: 'GRP-GOV',
    name: 'Government & Institutional',
    description: 'Public sector undertakings, academic institutions, and government tender contracts with formal payment orders.',
    groupType: 'Government / Institutional',
    pricingType: 'Custom Pricing',
    paymentTerms: 'Net 60',
    defaultCreditLimit: 5000000,
    taxConfiguration: 'TDS / GST Exemption Applicable',
    assignedManager: 'Vikram Seth',
    discountPercentage: 8,
    creditDays: 60,
    customerCount: 6,
    status: 'Active',
  },
  {
    id: 'grp-6',
    code: 'GRP-SPEC',
    name: 'Custom Contract Partners',
    description: 'Ad-hoc project partnerships and joint development agreements undergoing annual review.',
    groupType: 'Custom',
    pricingType: 'Custom Pricing',
    paymentTerms: 'Net 30',
    defaultCreditLimit: 1000000,
    taxConfiguration: 'Standard GST 18%',
    assignedManager: 'Vikram Seth',
    discountPercentage: 10,
    creditDays: 30,
    customerCount: 0,
    status: 'Inactive',
  },
];

export const INITIAL_CUSTOMER_CONTACTS: CustomerContactPerson[] = [
  {
    id: 'cnt-1',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    contactPersonName: 'Ramesh Sundaram',
    designation: 'Plant General Manager',
    department: 'Plant Operations',
    contactRole: 'Decision Maker',
    branchLocation: 'Chennai Main Facility',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    alternateEmail: 'ramesh.personal@apexprecision.com',
    alternatePhone: '+91 98412 11003',
    preferredCommunication: 'Email',
    reportingTo: 'Board of Directors',
    assignedAccountManager: 'Vikram Seth',
    notes: 'Key decision maker for plant automation capex investments and quarterly contracts.',
    isPrimary: true,
    status: 'Active',
  },
  {
    id: 'cnt-2',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    contactPersonName: 'Venkatesh S.',
    designation: 'Senior Procurement Officer',
    department: 'Commercial & Purchase',
    contactRole: 'Procurement Specialist',
    branchLocation: 'Chennai Main Facility',
    email: 'purchase@apexprecision.com',
    phone: '+91 98412 11005',
    alternatePhone: '+91 98412 11006',
    preferredCommunication: 'Phone Call',
    reportingTo: 'Ramesh Sundaram',
    assignedAccountManager: 'Vikram Seth',
    notes: 'Issues formal commercial POs, requests quotation pricing comparisons.',
    isPrimary: false,
    status: 'Active',
  },
  {
    id: 'cnt-3',
    customerId: 'cust-2',
    customerName: 'Southern Automation Works',
    contactPersonName: 'Karthik Raja',
    designation: 'Managing Partner',
    department: 'Executive Management',
    contactRole: 'Decision Maker',
    branchLocation: 'Coimbatore HQ',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    alternatePhone: '+91 94441 55668',
    preferredCommunication: 'WhatsApp',
    reportingTo: 'Self / Executive Board',
    assignedAccountManager: 'Vikram Seth',
    notes: 'Oversees South India wholesale dealership distribution agreements.',
    isPrimary: true,
    status: 'Active',
  },
  {
    id: 'cnt-4',
    customerId: 'cust-2',
    customerName: 'Southern Automation Works',
    contactPersonName: 'Meenakshi Sundaram',
    designation: 'Accounts Manager',
    department: 'Finance & Billing',
    contactRole: 'Finance / Billing',
    branchLocation: 'Coimbatore HQ',
    email: 'accounts@southauto.com',
    phone: '+91 94441 55670',
    preferredCommunication: 'Email',
    reportingTo: 'Karthik Raja',
    assignedAccountManager: 'Vikram Seth',
    notes: 'Handles RTGS/NEFT payments, GST e-invoices, and statement reconciliations.',
    isPrimary: false,
    status: 'Active',
  },
  {
    id: 'cnt-5',
    customerId: 'cust-3',
    customerName: 'Omni Infra Ventures',
    contactPersonName: 'Priya Narayanan',
    designation: 'Director of Procurement',
    department: 'Supply Chain',
    contactRole: 'Decision Maker',
    branchLocation: 'Bengaluru Tech Park',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    alternatePhone: '+91 97890 33442',
    preferredCommunication: 'Email',
    reportingTo: 'Chief Operating Officer',
    assignedAccountManager: 'Ananya Sharma',
    notes: 'Commercial manager for infrastructure pumps and pneumatic valves.',
    isPrimary: true,
    status: 'Active',
  },
  {
    id: 'cnt-6',
    customerId: 'cust-4',
    customerName: 'Dynamic Motors Corp',
    contactPersonName: 'Ganesh Moorthy',
    designation: 'Chief Engineer',
    department: 'Engineering & Maintenance',
    contactRole: 'Technical Evaluator',
    branchLocation: 'Navi Mumbai Plant',
    email: 'ganesh@dynamicmotors.com',
    phone: '+91 98200 44556',
    preferredCommunication: 'Phone Call',
    reportingTo: 'Plant VP',
    assignedAccountManager: 'Ananya Sharma',
    notes: 'Conducts factory acceptance tests, reviews mechanical tolerances.',
    isPrimary: true,
    status: 'Active',
  },
  {
    id: 'cnt-7',
    customerId: 'cust-5',
    customerName: 'Sri Venkatesh Traders',
    contactPersonName: 'Venkatesh Rao',
    designation: 'Proprietor',
    department: 'Executive Management',
    contactRole: 'Decision Maker',
    branchLocation: 'Madurai Bazaar',
    email: 'venkatesh.traders@gmail.com',
    phone: '+91 98409 88123',
    preferredCommunication: 'Phone Call',
    reportingTo: 'Self',
    assignedAccountManager: 'Vikram Seth',
    notes: 'Retail proprietor, account temporarily inactive.',
    isPrimary: true,
    status: 'Inactive',
  },
];

export const INITIAL_CUSTOMER_ACTIVITIES: CustomerActivityLog[] = [
  {
    id: 'cact-1',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    activityCategory: 'Quotations',
    title: 'Quotation QT-2026-881 Approved',
    description: 'Commercial quotation for 12 units of 15kW drives generated and approved for dispatch pricing.',
    timestamp: '2026-11-15 11:30 AM',
    performedBy: 'Vikram Seth',
    refNumber: 'QT-2026-881',
    amount: 472000,
    status: 'Approved',
    moduleType: 'Sales',
    navigationPath: '/app/sales/quotations',
  },
  {
    id: 'cact-2',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    activityCategory: 'Sales Orders',
    title: 'Sales Order SO-2026-401 Confirmed',
    description: 'Official purchase order accepted; scheduled delivery date confirmed for 2026-11-20.',
    timestamp: '2026-11-15 02:45 PM',
    performedBy: 'Vikram Seth',
    refNumber: 'SO-2026-401',
    amount: 472000,
    status: 'Confirmed',
    moduleType: 'Sales',
    navigationPath: '/app/sales/orders',
  },
  {
    id: 'cact-3',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    activityCategory: 'Payments',
    title: 'Advance Payment Received',
    description: 'Receipt RCP-2026-301 verified for ₹2,00,000 received via Bank Transfer (NEFT-88992144).',
    timestamp: '2026-11-16 10:15 AM',
    performedBy: 'Finance Accounts',
    refNumber: 'RCP-2026-301',
    amount: 200000,
    status: 'Completed',
    moduleType: 'Finance',
    navigationPath: '/app/finance/dashboard',
  },
  {
    id: 'cact-4',
    customerId: 'cust-2',
    customerName: 'Southern Automation Works',
    activityCategory: 'Payments',
    title: 'Full Invoice Payment Cleared',
    description: 'Receipt RCP-2026-302 logged for ₹9,44,000 received via direct RTGS corporate settlement.',
    timestamp: '2026-11-12 04:20 PM',
    performedBy: 'Finance Accounts',
    refNumber: 'RCP-2026-302',
    amount: 944000,
    status: 'Completed',
    moduleType: 'Finance',
    navigationPath: '/app/finance/dashboard',
  },
  {
    id: 'cact-5',
    customerId: 'cust-3',
    customerName: 'Omni Infra Ventures',
    activityCategory: 'Meetings',
    title: 'Site Engineering Assessment',
    description: 'Conducted engineering alignment for hydraulic pump manifold placement at site facility.',
    timestamp: '2026-11-14 01:00 PM',
    performedBy: 'Ananya Sharma',
    refNumber: 'ACT-2026-088',
    status: 'Completed',
    moduleType: 'CRM',
    navigationPath: '/app/sales/activities',
  },
  {
    id: 'cact-6',
    customerId: 'cust-1',
    customerName: 'Apex Precision Tools Ltd',
    activityCategory: 'Delivery & Shipment',
    title: 'Shipment Consignment Dispatched',
    description: 'Goods dispatched via BlueDart Express (Airway Bill #778899120) with verified e-way bill.',
    timestamp: '2026-11-16 05:00 PM',
    performedBy: 'Logistics Desk',
    refNumber: 'SHP-2026-104',
    status: 'Confirmed',
    moduleType: 'Sales',
    navigationPath: '/app/sales/orders',
  },
  {
    id: 'cact-7',
    customerId: 'cust-3',
    customerName: 'Omni Infra Ventures',
    activityCategory: 'Service Requests',
    title: 'Warranty Support Ticket Opened',
    description: 'Reported pressure differential valve inspection on hydraulic pump line.',
    timestamp: '2026-11-17 09:30 AM',
    performedBy: 'Ananya Sharma',
    refNumber: 'TCK-2026-501',
    status: 'Created',
    moduleType: 'Service',
    navigationPath: '/app/services/tickets',
  },
  {
    id: 'cact-8',
    customerId: 'cust-4',
    customerName: 'Dynamic Motors Corp',
    activityCategory: 'Calls & Communications',
    title: 'Quarterly Maintenance Discovery Call',
    description: 'Discussed periodic rewinding requirements and stator coil inspection schedule.',
    timestamp: '2026-11-17 03:15 PM',
    performedBy: 'Vikram Seth',
    refNumber: 'CALL-2026-44',
    status: 'Completed',
    moduleType: 'CRM',
    navigationPath: '/app/sales/activities',
  },
];
