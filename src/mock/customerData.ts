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

export interface CustomerFollowUp {
  id: string;
  customerId: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Site Visit';
  date: string;
  time: string;
  assignedTo: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: string;
}

export interface CustomerCommunication {
  id: string;
  customerId: string;
  channel: 'Email' | 'Phone Call' | 'WhatsApp' | 'In-Person';
  subject: string;
  summary: string;
  timestamp: string;
  byUser: string;
}

export interface ExtendedCustomer extends Customer {
  companyName?: string;
  gstNumber?: string;
  panNumber?: string;
  alternatePhone?: string;
  address?: string;
  state?: string;
  country?: string;
  pincode?: string;
  source?: 'Website' | 'Referral' | 'Exhibition' | 'Cold Outreach' | 'Campaign' | 'Walk-in' | 'Direct';
  assignedEmployee?: string;
  notes?: string;
  category?: 'Enterprise' | 'SME' | 'Retailer' | 'Distributor' | 'Govt';
  totalOrdersValue?: number;
  totalServiceTickets?: number;
  createdAt?: string;
}

export const INITIAL_CUSTOMERS: ExtendedCustomer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'Apex Precision Tools Ltd',
    companyName: 'Apex Precision Tools Ltd',
    type: 'Business',
    contactPerson: 'Ramesh Sundaram',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    gstNumber: '33AABCT9988M1Z0',
    address: '42 Commercial Axis, Mount Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '600002',
    source: 'Exhibition',
    assignedEmployee: 'Vikram Seth',
    creditLimit: 1000000,
    currentBalance: 272000,
    status: 'Active',
    category: 'Enterprise',
    notes: 'Premium key account for manufacturing CNC drives and servo equipment.',
    totalOrdersValue: 1850000,
    totalServiceTickets: 4,
    createdAt: '2025-01-15',
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'Southern Automation Works',
    companyName: 'Southern Automation Works',
    type: 'Business',
    contactPerson: 'Karthik Raja',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    gstNumber: '33AABCS4455K1Z3',
    address: '88 Industrial Estate, Peelamedu',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '641004',
    source: 'Referral',
    assignedEmployee: 'Vikram Seth',
    creditLimit: 1500000,
    currentBalance: 0,
    status: 'Active',
    category: 'Distributor',
    notes: 'Major automation distributor across South India. High promptness in payments.',
    totalOrdersValue: 2420000,
    totalServiceTickets: 2,
    createdAt: '2025-03-20',
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'Omni Infra Ventures',
    companyName: 'Omni Infra Ventures',
    type: 'Business',
    contactPerson: 'Priya Narayanan',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    gstNumber: '29AAACX4411K1Z2',
    address: '104 Tech Park Avenue, Electronic City',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560100',
    source: 'Website',
    assignedEmployee: 'Ananya Sharma',
    creditLimit: 2500000,
    currentBalance: 450000,
    status: 'Active',
    category: 'Enterprise',
    notes: 'Infrastructure contractor requiring heavy hydraulic cylinders and pumps.',
    totalOrdersValue: 3100000,
    totalServiceTickets: 3,
    createdAt: '2025-06-10',
  },
  {
    id: 'cust-4',
    code: 'CUST-004',
    name: 'Dynamic Motors Corp',
    companyName: 'Dynamic Motors Corp',
    type: 'Business',
    contactPerson: 'Ganesh Moorthy',
    email: 'ganesh@dynamicmotors.com',
    phone: '+91 98200 44556',
    gstNumber: '27AAACP7766P1Z8',
    address: '15 Sector 8, Turbhe Industrial Park',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400705',
    source: 'Cold Outreach',
    assignedEmployee: 'Ananya Sharma',
    creditLimit: 800000,
    currentBalance: 84000,
    status: 'Active',
    category: 'SME',
    notes: 'Requires periodic motor rewind services and preventive maintenance.',
    totalOrdersValue: 920000,
    totalServiceTickets: 5,
    createdAt: '2025-08-01',
  },
  {
    id: 'cust-5',
    code: 'CUST-005',
    name: 'Sri Venkatesh Traders',
    companyName: 'Sri Venkatesh Traders',
    type: 'Individual',
    contactPerson: 'Venkatesh Rao',
    email: 'venkatesh.traders@gmail.com',
    phone: '+91 98409 88123',
    gstNumber: '33AABCV1234F1Z9',
    address: '77 Big Bazaar Street',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    pincode: '625001',
    source: 'Walk-in',
    assignedEmployee: 'Vikram Seth',
    creditLimit: 500000,
    currentBalance: 0,
    status: 'Inactive',
    category: 'Retailer',
    notes: 'Inactive account for the past 6 months.',
    totalOrdersValue: 340000,
    totalServiceTickets: 0,
    createdAt: '2025-02-14',
  },
];

export const INITIAL_FOLLOW_UPS: CustomerFollowUp[] = [
  {
    id: 'flw-1',
    customerId: 'cust-1',
    type: 'Meeting',
    date: '2026-11-21',
    time: '11:00 AM',
    assignedTo: 'Vikram Seth',
    status: 'Scheduled',
    notes: 'Quarterly review on annual spare supplies and SLA extension.',
    createdAt: '2026-11-16',
  },
  {
    id: 'flw-2',
    customerId: 'cust-3',
    type: 'Call',
    date: '2026-11-20',
    time: '03:30 PM',
    assignedTo: 'Ananya Sharma',
    status: 'Scheduled',
    notes: 'Follow-up regarding payment of outstanding invoice INV-2026-1044.',
    createdAt: '2026-11-17',
  },
  {
    id: 'flw-3',
    customerId: 'cust-2',
    type: 'Site Visit',
    date: '2026-11-15',
    time: '02:00 PM',
    assignedTo: 'Vikram Seth',
    status: 'Completed',
    notes: 'Completed warehouse audit and new quotation requirement briefing.',
    createdAt: '2026-11-14',
  },
];

export const INITIAL_COMMUNICATIONS: CustomerCommunication[] = [
  {
    id: 'comm-1',
    customerId: 'cust-1',
    channel: 'Email',
    subject: 'Quotation QT-2026-881 Approved and Sent',
    summary: 'Sent official formal commercial proposal with 18% GST and delivery lead time of 7 business days.',
    timestamp: '2026-11-16 10:45 AM',
    byUser: 'Vikram Seth',
  },
  {
    id: 'comm-2',
    customerId: 'cust-1',
    channel: 'Phone Call',
    subject: 'Technical Specification Alignment',
    summary: 'Discussed voltage surge protection on 15KW inverter with their plant manager Mr. Ramesh.',
    timestamp: '2026-11-15 03:20 PM',
    byUser: 'Vikram Seth',
  },
  {
    id: 'comm-3',
    customerId: 'cust-2',
    channel: 'WhatsApp',
    subject: 'Payment receipt confirmation',
    summary: 'Sent official digital receipt RCP-2026-302 for ₹9,44,000 received via UPI.',
    timestamp: '2026-11-12 04:30 PM',
    byUser: 'Finance HQ',
  },
  {
    id: 'comm-4',
    customerId: 'cust-4',
    channel: 'In-Person',
    subject: 'Service Engineer Visit & Troubleshooting',
    summary: 'Engineer Murugan checked trip log on CNC mill. Recommended replacement of auxiliary cooling relay.',
    timestamp: '2026-11-15 05:00 PM',
    byUser: 'Murugan Selvam',
  },
];
