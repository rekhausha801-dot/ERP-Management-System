import { useState, useEffect } from 'react';

// ============================================================================
// DATA MODELS FOR UNIFIED CRM & LEADS MODULE
// ============================================================================

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type OpportunityStage = 'New Opportunity' | 'Initial Contact' | 'Requirement Analysis' | 'Proposal / Quotation' | 'Negotiation' | 'Won' | 'Lost';
export type FollowUpType = 'Phone Call' | 'Email' | 'Meeting' | 'WhatsApp';
export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';

export interface LeadActivity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  title: string;
  timestamp: string;
  performedBy: string;
  details: string;
  outcome?: string;
}

export interface CrmLead {
  id: string;
  leadNumber: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Social Media' | 'Campaign' | 'Cold Outreach' | 'Exhibition';
  interestedProduct: string;
  assignedSalesperson: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: LeadStatus;
  createdDate: string;
  estimatedValue: number;
  notes?: string;
  isConverted?: boolean;
  convertedOpportunityId?: string;
  convertedCustomerId?: string;
  activities: LeadActivity[];
}

export interface CrmOpportunity {
  id: string;
  opportunityNumber: string;
  name: string;
  customerName: string;
  companyName: string;
  relatedLeadId?: string;
  relatedLeadNumber?: string;
  productService: string;
  dealValue: number;
  probability: number; // percentage 0 - 100
  expectedClosingDate: string;
  assignedSalesperson: string;
  stage: OpportunityStage;
  winLossReason?: string;
  notes?: string;
  createdDate: string;
}

export interface CrmFollowUp {
  id: string;
  followUpNumber: string;
  customerLeadName: string;
  companyName?: string;
  relatedOpportunityId?: string;
  relatedOpportunityNumber?: string;
  followUpType: FollowUpType;
  date: string;
  time: string;
  assignedEmployee: string;
  nextAction: string;
  status: FollowUpStatus;
  previousCommunication?: string;
  customerResponse?: string;
  outcome?: string;
  nextFollowUpDate?: string;
}

// ============================================================================
// SEED DATA FOR CRM & LEADS MODULE
// ============================================================================

export const SEED_LEADS: CrmLead[] = [
  {
    id: 'lead-1',
    leadNumber: 'LD-2026-001',
    name: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    source: 'Website',
    interestedProduct: 'Heavy-Duty Variable Frequency Inverters 15kW',
    assignedSalesperson: 'Vikram Seth',
    priority: 'High',
    status: 'Qualified',
    createdDate: '2026-11-12',
    estimatedValue: 450000,
    notes: 'Inquired for automation plant overhaul. Budget approved by management.',
    isConverted: true,
    convertedOpportunityId: 'opp-1',
    activities: [
      {
        id: 'act-1',
        type: 'Call',
        title: 'Initial Discovery Call',
        timestamp: '2026-11-12 11:30 AM',
        performedBy: 'Vikram Seth',
        details: 'Confirmed 15kW specifications and factory power input stability.',
        outcome: 'Scheduled technical demonstration',
      },
      {
        id: 'act-2',
        type: 'Meeting',
        title: 'Technical Demonstration at Plant',
        timestamp: '2026-11-14 02:00 PM',
        performedBy: 'Vikram Seth',
        details: 'Demonstrated motor inverter synchronization.',
        outcome: 'Lead Qualified; proposal requested',
      },
    ],
  },
  {
    id: 'lead-2',
    leadNumber: 'LD-2026-002',
    name: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    source: 'Referral',
    interestedProduct: 'High-Pressure Hydraulic Cylinders & Actuators',
    assignedSalesperson: 'Ananya Sharma',
    priority: 'Urgent',
    status: 'Contacted',
    createdDate: '2026-11-15',
    estimatedValue: 1200000,
    notes: 'Referred by Southern Infra. Needs delivery within 30 days.',
    isConverted: false,
    activities: [
      {
        id: 'act-3',
        type: 'Call',
        title: 'Requirement Clarification',
        timestamp: '2026-11-16 10:15 AM',
        performedBy: 'Ananya Sharma',
        details: 'Discussed bore size 100mm and mounting flange specs.',
        outcome: 'Awaiting CAD drawings from customer',
      },
    ],
  },
  {
    id: 'lead-3',
    leadNumber: 'LD-2026-003',
    name: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    source: 'Campaign',
    interestedProduct: 'Modular PLC & Industrial I/O Modules',
    assignedSalesperson: 'Vikram Seth',
    priority: 'High',
    status: 'New',
    createdDate: '2026-11-18',
    estimatedValue: 850000,
    notes: 'Lead captured via Industrial Expo campaign landing page.',
    isConverted: false,
    activities: [
      {
        id: 'act-4',
        type: 'Email',
        title: 'Welcome Brochure Dispatched',
        timestamp: '2026-11-18 04:45 PM',
        performedBy: 'System Auto-Mailer',
        details: 'Sent product technical catalog and company credentials.',
      },
    ],
  },
  {
    id: 'lead-4',
    leadNumber: 'LD-2026-004',
    name: 'Dr. Ashok Kumar',
    companyName: 'Bharat Bio Labs',
    email: 'ashok@bharatbio.org',
    phone: '+91 98210 99882',
    source: 'Social Media',
    interestedProduct: 'Laboratory Clean-Room HVAC Regulators',
    assignedSalesperson: 'Ananya Sharma',
    priority: 'Medium',
    status: 'New',
    createdDate: '2026-11-19',
    estimatedValue: 620000,
    notes: 'Inquired on LinkedIn corporate page for precision environmental controls.',
    isConverted: false,
    activities: [],
  },
  {
    id: 'lead-5',
    leadNumber: 'LD-2026-005',
    name: 'Manish Verma',
    companyName: 'Verma Fabricators & Co',
    email: 'verma@vermafab.com',
    phone: '+91 98455 12099',
    source: 'Cold Outreach',
    interestedProduct: 'CNC Spindle Bearings & Power Belts',
    assignedSalesperson: 'Vikram Seth',
    priority: 'Low',
    status: 'Lost',
    createdDate: '2026-11-05',
    estimatedValue: 310000,
    notes: 'Decided to continue with existing local supplier due to pricing discount.',
    isConverted: false,
    activities: [
      {
        id: 'act-5',
        type: 'Call',
        title: 'Follow-up Call',
        timestamp: '2026-11-10 11:00 AM',
        performedBy: 'Vikram Seth',
        details: 'Customer finalized local supplier on 15% discount.',
        outcome: 'Lead marked Lost (Price sensitivity)',
      },
    ],
  },
];

export const SEED_OPPORTUNITIES: CrmOpportunity[] = [
  {
    id: 'opp-1',
    opportunityNumber: 'OPP-2026-081',
    name: 'Assembly Line 15kW VFD Overhaul',
    customerName: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    relatedLeadId: 'lead-1',
    relatedLeadNumber: 'LD-2026-001',
    productService: 'Heavy-Duty Variable Frequency Inverters 15kW',
    dealValue: 450000,
    probability: 80,
    expectedClosingDate: '2026-11-30',
    assignedSalesperson: 'Vikram Seth',
    stage: 'Negotiation',
    notes: 'Commercial terms sent. Reviewing 30-day payment credit window.',
    createdDate: '2026-11-14',
  },
  {
    id: 'opp-2',
    opportunityNumber: 'OPP-2026-082',
    name: 'Warehouse Automated Stacker Actuators',
    customerName: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    relatedLeadId: 'lead-2',
    relatedLeadNumber: 'LD-2026-002',
    productService: 'High-Pressure Hydraulic Cylinders & Actuators',
    dealValue: 1200000,
    probability: 60,
    expectedClosingDate: '2026-12-10',
    assignedSalesperson: 'Ananya Sharma',
    stage: 'Proposal / Quotation',
    notes: 'Quotation QT-2026-042 sent with 18% GST breakdown.',
    createdDate: '2026-11-16',
  },
  {
    id: 'opp-3',
    opportunityNumber: 'OPP-2026-083',
    name: 'Smart Factory PLC Integration Project',
    customerName: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    productService: 'Modular PLC & Industrial I/O Modules',
    dealValue: 850000,
    probability: 40,
    expectedClosingDate: '2026-12-15',
    assignedSalesperson: 'Vikram Seth',
    stage: 'Requirement Analysis',
    notes: 'Engineering team evaluating sensor input interfaces.',
    createdDate: '2026-11-17',
  },
  {
    id: 'opp-4',
    opportunityNumber: 'OPP-2026-084',
    name: 'Coimbatore Foundry CNC Retrofit',
    customerName: 'S. Shanmugam',
    companyName: 'Apex Industrial Steels Pvt Ltd',
    productService: 'Seamless Carbon Steel Hydraulic Pipes 32mm',
    dealValue: 396480,
    probability: 100,
    expectedClosingDate: '2026-11-20',
    assignedSalesperson: 'Vikram Seth',
    stage: 'Won',
    notes: 'Purchase Order received! PO-2026-104 converted into production schedule.',
    createdDate: '2026-11-08',
  },
  {
    id: 'opp-5',
    opportunityNumber: 'OPP-2026-085',
    name: 'Tamil Nadu Power Grid Drives Replacement',
    customerName: 'M. Duraisamy',
    companyName: 'State Utility Grid Division',
    productService: 'Ultra-High Voltage Drives 400V',
    dealValue: 1850000,
    probability: 0,
    expectedClosingDate: '2026-11-12',
    assignedSalesperson: 'Ananya Sharma',
    stage: 'Lost',
    winLossReason: 'Government tender bid awarded to L1 state PSU contractor.',
    notes: 'Disqualified on PSU offset compliance clause.',
    createdDate: '2026-10-25',
  },
];

export const SEED_FOLLOW_UPS: CrmFollowUp[] = [
  {
    id: 'flw-1',
    followUpNumber: 'FLW-2026-101',
    customerLeadName: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    relatedOpportunityId: 'opp-1',
    relatedOpportunityNumber: 'OPP-2026-081',
    followUpType: 'Phone Call',
    date: '2026-11-20',
    time: '11:00 AM',
    assignedEmployee: 'Vikram Seth',
    nextAction: 'Confirm dispatch terms and advance payment cheque details.',
    status: 'Pending',
    previousCommunication: 'Spoke with CFO Mr. Raman on 16-Nov regarding 50% advance milestone.',
    customerResponse: 'Agreed in principle, requested revised proforma invoice copy.',
    outcome: 'Pending today call',
  },
  {
    id: 'flw-2',
    followUpNumber: 'FLW-2026-102',
    customerLeadName: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    relatedOpportunityId: 'opp-2',
    relatedOpportunityNumber: 'OPP-2026-082',
    followUpType: 'WhatsApp',
    date: '2026-11-20',
    time: '03:30 PM',
    assignedEmployee: 'Ananya Sharma',
    nextAction: 'Share digital product datasheet and warranty certificate via WhatsApp.',
    status: 'Pending',
    previousCommunication: 'Sent initial quotation PDF via email on 18-Nov.',
    customerResponse: 'Acknowledged email, asked for instant messaging link with engineering lead.',
  },
  {
    id: 'flw-3',
    followUpNumber: 'FLW-2026-103',
    customerLeadName: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    relatedOpportunityId: 'opp-3',
    relatedOpportunityNumber: 'OPP-2026-083',
    followUpType: 'Meeting',
    date: '2026-11-22',
    time: '02:00 PM',
    assignedEmployee: 'Vikram Seth',
    nextAction: 'On-site technical evaluation meeting at customer Coimbatore plant.',
    status: 'Pending',
    previousCommunication: 'Online demo conducted on 15-Nov.',
    customerResponse: 'Wants physical verification of machine cabinet space.',
  },
  {
    id: 'flw-4',
    followUpNumber: 'FLW-2026-104',
    customerLeadName: 'Dr. Ashok Kumar',
    companyName: 'Bharat Bio Labs',
    followUpType: 'Email',
    date: '2026-11-14',
    time: '10:00 AM',
    assignedEmployee: 'Ananya Sharma',
    nextAction: 'Send compliance certifications and cleanroom ISO 14644 report.',
    status: 'Overdue',
    previousCommunication: 'Customer left enquiry on website on 12-Nov.',
    customerResponse: 'Requires vendor audit checklist filled before placing quotation request.',
  },
  {
    id: 'flw-5',
    followUpNumber: 'FLW-2026-105',
    customerLeadName: 'S. Shanmugam',
    companyName: 'Apex Industrial Steels Pvt Ltd',
    relatedOpportunityId: 'opp-4',
    relatedOpportunityNumber: 'OPP-2026-084',
    followUpType: 'Meeting',
    date: '2026-11-18',
    time: '04:00 PM',
    assignedEmployee: 'Vikram Seth',
    nextAction: 'Handed over signed commercial contract and advance receipt voucher.',
    status: 'Completed',
    previousCommunication: 'PO-2026-104 final negotiations on 17-Nov.',
    customerResponse: 'PO issued. Signed order accepted.',
    outcome: 'Deal Won & Converted',
  },
];

// ============================================================================
// REACT HOOK FOR CRM & LEADS STORAGE
// ============================================================================

// Safe localStorage helper to prevent QuotaExceededError crashes
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[Storage] Failed to save key '${key}' (Quota exceeded or restricted). State maintained in memory.`);
  }
}

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function useCrmStore() {
  const [leads, setLeads] = useState<CrmLead[]>(() => safeGetItem('erp_crm_leads', SEED_LEADS));
  const [opportunities, setOpportunities] = useState<CrmOpportunity[]>(() => safeGetItem('erp_crm_opportunities', SEED_OPPORTUNITIES));
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>(() => safeGetItem('erp_crm_followups', SEED_FOLLOW_UPS));

  useEffect(() => {
    safeSetItem('erp_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    safeSetItem('erp_crm_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    safeSetItem('erp_crm_followups', JSON.stringify(followUps));
  }, [followUps]);

  // Lead Operations
  const addLead = (newLead: Omit<CrmLead, 'id' | 'leadNumber' | 'createdDate' | 'activities'>) => {
    const lead: CrmLead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      leadNumber: `LD-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().slice(0, 10),
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'Note',
          title: 'Lead Enrolled',
          timestamp: new Date().toLocaleString(),
          performedBy: newLead.assignedSalesperson || 'System',
          details: 'Lead created in CRM system.',
        },
      ],
    };
    setLeads((prev) => [lead, ...prev]);
    return lead;
  };

  const updateLead = (id: string, updates: Partial<CrmLead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const convertLeadToOpportunity = (leadId: string, opportunityName: string, dealValue: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const newOpp: CrmOpportunity = {
      id: `opp-${Date.now()}`,
      opportunityNumber: `OPP-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: opportunityName,
      customerName: lead.name,
      companyName: lead.companyName,
      relatedLeadId: lead.id,
      relatedLeadNumber: lead.leadNumber,
      productService: lead.interestedProduct,
      dealValue: dealValue || lead.estimatedValue,
      probability: 60,
      expectedClosingDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      assignedSalesperson: lead.assignedSalesperson,
      stage: 'Proposal / Quotation',
      createdDate: new Date().toISOString().slice(0, 10),
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    updateLead(leadId, {
      status: 'Qualified',
      isConverted: true,
      convertedOpportunityId: newOpp.id,
    });

    return newOpp;
  };

  // Opportunity Operations
  const addOpportunity = (newOpp: Omit<CrmOpportunity, 'id' | 'opportunityNumber' | 'createdDate'>) => {
    const opp: CrmOpportunity = {
      ...newOpp,
      id: `opp-${Date.now()}`,
      opportunityNumber: `OPP-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdDate: new Date().toISOString().slice(0, 10),
    };
    setOpportunities((prev) => [opp, ...prev]);
    return opp;
  };

  const updateOpportunity = (id: string, updates: Partial<CrmOpportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  // Follow-up Operations
  const addFollowUp = (newFlw: Omit<CrmFollowUp, 'id' | 'followUpNumber'>) => {
    const flw: CrmFollowUp = {
      ...newFlw,
      id: `flw-${Date.now()}`,
      followUpNumber: `FLW-2026-${Math.floor(100 + Math.random() * 900)}`,
    };
    setFollowUps((prev) => [flw, ...prev]);
    return flw;
  };

  const updateFollowUp = (id: string, updates: Partial<CrmFollowUp>) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  };

  return {
    leads,
    setLeads,
    addLead,
    updateLead,
    deleteLead,
    convertLeadToOpportunity,
    opportunities,
    setOpportunities,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    followUps,
    setFollowUps,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp,
  };
}
