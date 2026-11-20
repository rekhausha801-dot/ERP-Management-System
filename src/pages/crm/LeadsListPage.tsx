import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Row,
  Col,
  Space,
  Tooltip,
  Drawer,
  message,
  Popconfirm,
  Timeline,
  DatePicker,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Briefcase,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import dayjs from 'dayjs';

// Enterprise Purple Palette
const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#6E39CB';
const BRAND_PURPLE_TINT = '#F5EEFD';

export type LeadStatusType = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadPriorityType = 'Low' | 'Medium' | 'High' | 'Urgent';
export type LeadSourceType = 'Website' | 'Referral' | 'Campaign' | 'Social Media' | 'Cold Outreach';

export interface LeadActivityItem {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  title: string;
  timestamp: string;
  performedBy: string;
  details: string;
  outcome?: string;
}

export interface LeadItem {
  id: string;
  leadNumber: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  source: LeadSourceType;
  interestedProduct: string;
  assignedSalesperson: string;
  priority: LeadPriorityType;
  status: LeadStatusType;
  lastContacted: string;
  nextFollowUp: string;
  createdDate: string;
  estimatedBudget: number;
  requirementNotes?: string;
  isConverted?: boolean;
  convertedEntity?: string;
  activities: LeadActivityItem[];
}

const SALESPERSON_LIST = [
  'Vikram Seth',
  'Ananya Sharma',
  'Murugan Selvam',
  'Rajesh Kannan',
  'Pooja Hegde',
];

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    leadNumber: 'LD-2026-001',
    contactName: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    source: 'Website',
    interestedProduct: 'Heavy-Duty Variable Frequency Drives 15kW',
    assignedSalesperson: 'Vikram Seth',
    priority: 'High',
    status: 'Qualified',
    lastContacted: '2026-11-18',
    nextFollowUp: '2026-11-24',
    createdDate: '2026-11-10',
    estimatedBudget: 450000,
    requirementNotes: 'Requires 15kW Heavy Duty Frequency Drives with 2 years warranty and on-site commissioning support.',
    isConverted: false,
    activities: [
      {
        id: 'act-1',
        type: 'Call',
        title: 'Initial Discovery Call',
        timestamp: '2026-11-11 11:30 AM',
        performedBy: 'Vikram Seth',
        details: 'Explored machinery specifications and voltage tolerance.',
        outcome: 'Budget confirmed, product specs sent',
      },
      {
        id: 'act-2',
        type: 'Meeting',
        title: 'Technical Demonstration at Plant',
        timestamp: '2026-11-15 02:30 PM',
        performedBy: 'Vikram Seth',
        details: 'Demonstrated motor inverter synchronization at Chennai facility.',
        outcome: 'Technical team cleared specification; lead qualified',
      },
    ],
  },
  {
    id: 'lead-2',
    leadNumber: 'LD-2026-002',
    contactName: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    source: 'Referral',
    interestedProduct: 'High-Pressure Hydraulic Cylinders & Actuators',
    assignedSalesperson: 'Ananya Sharma',
    priority: 'Urgent',
    status: 'Contacted',
    lastContacted: '2026-11-17',
    nextFollowUp: '2026-11-22',
    createdDate: '2026-11-14',
    estimatedBudget: 1200000,
    requirementNotes: 'Urgent expansion project in Electronic City. Needs delivery in 30 days.',
    isConverted: false,
    activities: [
      {
        id: 'act-3',
        type: 'Call',
        title: 'Requirement Clarification',
        timestamp: '2026-11-16 10:15 AM',
        performedBy: 'Ananya Sharma',
        details: 'Discussed bore size 100mm and mounting flange specs.',
        outcome: 'Awaiting CAD drawings from customer engineering team',
      },
    ],
  },
  {
    id: 'lead-3',
    leadNumber: 'LD-2026-003',
    contactName: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    source: 'Campaign',
    interestedProduct: 'Modular PLC & Industrial I/O Modules',
    assignedSalesperson: 'Vikram Seth',
    priority: 'Medium',
    status: 'New',
    lastContacted: '2026-11-18',
    nextFollowUp: '2026-11-21',
    createdDate: '2026-11-18',
    estimatedBudget: 850000,
    requirementNotes: 'Inquired through Industrial Expo 2026 campaign landing page.',
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
    contactName: 'Dr. Ashok Kumar',
    companyName: 'Bharat Bio Labs',
    email: 'ashok@bharatbio.org',
    phone: '+91 98210 99882',
    source: 'Social Media',
    interestedProduct: 'Laboratory Clean-Room HVAC Regulators',
    assignedSalesperson: 'Ananya Sharma',
    priority: 'Medium',
    status: 'New',
    lastContacted: '2026-11-19',
    nextFollowUp: '2026-11-23',
    createdDate: '2026-11-19',
    estimatedBudget: 620000,
    requirementNotes: 'Inquired on LinkedIn corporate page for precision environmental HVAC controllers.',
    isConverted: false,
    activities: [],
  },
  {
    id: 'lead-5',
    leadNumber: 'LD-2026-005',
    contactName: 'Manish Verma',
    companyName: 'Verma Fabricators & Co',
    email: 'verma@vermafab.com',
    phone: '+91 98455 12099',
    source: 'Cold Outreach',
    interestedProduct: 'CNC Spindle Bearings & Power Belts',
    assignedSalesperson: 'Murugan Selvam',
    priority: 'Low',
    status: 'Lost',
    lastContacted: '2026-11-10',
    nextFollowUp: '-',
    createdDate: '2026-11-05',
    estimatedBudget: 310000,
    requirementNotes: 'Decided to renew with previous vendor due to 15% discount difference.',
    isConverted: false,
    activities: [
      {
        id: 'act-5',
        type: 'Call',
        title: 'Price Negotiation Call',
        timestamp: '2026-11-10 11:00 AM',
        performedBy: 'Murugan Selvam',
        details: 'Customer finalized local supplier on 15% discount.',
        outcome: 'Lead marked Lost (Price sensitivity)',
      },
    ],
  },
  {
    id: 'lead-6',
    leadNumber: 'LD-2026-006',
    contactName: 'Suresh Menon',
    companyName: 'Coimbatore Foundry Cluster',
    email: 'suresh@cbfc.co.in',
    phone: '+91 94432 88123',
    source: 'Referral',
    interestedProduct: '3-Phase Induction Motors 22kW Heavy Duty',
    assignedSalesperson: 'Rajesh Kannan',
    priority: 'High',
    status: 'Qualified',
    lastContacted: '2026-11-19',
    nextFollowUp: '2026-11-25',
    createdDate: '2026-11-12',
    estimatedBudget: 980000,
    requirementNotes: 'Requires replacement of 6 older induction motors with IE3 high efficiency models.',
    isConverted: false,
    activities: [
      {
        id: 'act-6',
        type: 'Meeting',
        title: 'Audit & Site Visit',
        timestamp: '2026-11-16 03:00 PM',
        performedBy: 'Rajesh Kannan',
        details: 'Checked motor footprint and electrical cabinet dimensions.',
        outcome: 'Scope and budget confirmed',
      },
    ],
  },
  {
    id: 'lead-7',
    leadNumber: 'LD-2026-007',
    contactName: 'Bala Swaminathan',
    companyName: 'Sri Balaji Agro Equipments',
    email: 'bala@sribalajiagro.com',
    phone: '+91 94883 23456',
    source: 'Website',
    interestedProduct: 'Pneumatic Control Valves & Filter Regulators',
    assignedSalesperson: 'Pooja Hegde',
    priority: 'Low',
    status: 'Contacted',
    lastContacted: '2026-11-18',
    nextFollowUp: '2026-11-26',
    createdDate: '2026-11-16',
    estimatedBudget: 240000,
    requirementNotes: 'Looking for 24V DC solenoid valves for agricultural grain sorting machines.',
    isConverted: false,
    activities: [
      {
        id: 'act-7',
        type: 'Call',
        title: 'Initial Specs Discussion',
        timestamp: '2026-11-18 02:00 PM',
        performedBy: 'Pooja Hegde',
        details: 'Sent product datasheets and flow rate charts.',
      },
    ],
  },
];

export const LeadsListPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  const [viewLead, setViewLead] = useState<LeadItem | null>(null);
  const [convertLeadModal, setConvertLeadModal] = useState<LeadItem | null>(null);
  const [assignModalLead, setAssignModalLead] = useState<LeadItem | null>(null);
  const [newActivityLead, setNewActivityLead] = useState<LeadItem | null>(null);

  const [form] = Form.useForm();
  const [convertForm] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [activityForm] = Form.useForm();

  // 1. Metric Calculations
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
    const lostCount = leads.filter((l) => l.status === 'Lost').length;
    return { total, newCount, contactedCount, qualifiedCount, lostCount };
  }, [leads]);

  // 2. Filter Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        l.leadNumber.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.companyName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.interestedProduct.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
      const matchSource = sourceFilter === 'ALL' || l.source === sourceFilter;
      const matchSalesperson =
        salespersonFilter === 'ALL' || l.assignedSalesperson === salespersonFilter;
      const matchPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const leadDate = dayjs(l.createdDate);
        matchDate =
          leadDate.isAfter(dateRange[0].startOf('day')) &&
          leadDate.isBefore(dateRange[1].endOf('day'));
      }

      return (
        matchSearch &&
        matchStatus &&
        matchSource &&
        matchSalesperson &&
        matchPriority &&
        matchDate
      );
    });
  }, [leads, search, statusFilter, sourceFilter, salespersonFilter, priorityFilter, dateRange]);

  // Handlers
  const handleSaveLead = (values: any) => {
    if (editingLead) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingLead.id
            ? {
                ...l,
                contactName: values.contactName,
                companyName: values.companyName,
                email: values.email,
                phone: values.phone,
                source: values.source,
                interestedProduct: values.interestedProduct,
                assignedSalesperson: values.assignedSalesperson,
                priority: values.priority,
                status: values.status,
                estimatedBudget: Number(values.estimatedBudget) || 0,
                nextFollowUp: values.nextFollowUp
                  ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
                  : l.nextFollowUp,
                requirementNotes: values.requirementNotes,
              }
            : l
        )
      );
      message.success(`Lead ${editingLead.leadNumber} updated successfully!`);
      setEditingLead(null);
    } else {
      const nextNum = leads.length + 1;
      const formattedNum = `LD-2026-${String(nextNum).padStart(3, '0')}`;
      const newEntry: LeadItem = {
        id: `lead-${Date.now()}`,
        leadNumber: formattedNum,
        contactName: values.contactName,
        companyName: values.companyName,
        email: values.email,
        phone: values.phone,
        source: values.source || 'Website',
        interestedProduct: values.interestedProduct,
        assignedSalesperson: values.assignedSalesperson,
        priority: values.priority || 'Medium',
        status: values.status || 'New',
        lastContacted: dayjs().format('YYYY-MM-DD'),
        nextFollowUp: values.nextFollowUp
          ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
          : dayjs().add(3, 'day').format('YYYY-MM-DD'),
        createdDate: dayjs().format('YYYY-MM-DD'),
        estimatedBudget: Number(values.estimatedBudget) || 0,
        requirementNotes: values.requirementNotes || '',
        isConverted: false,
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'Note',
            title: 'Lead Created',
            timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
            performedBy: values.assignedSalesperson,
            details: 'Lead initialized in the system.',
          },
        ],
      };
      setLeads((prev) => [newEntry, ...prev]);
      message.success(`New lead ${formattedNum} created successfully!`);
      setIsAddModalOpen(false);
    }
    form.resetFields();
  };

  const handleDeleteLead = (id: string, num: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (viewLead?.id === id) setViewLead(null);
    message.success(`Lead ${num} deleted`);
  };

  const handleConvertLead = (values: any) => {
    if (!convertLeadModal) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === convertLeadModal.id
          ? {
              ...l,
              isConverted: true,
              convertedEntity: `${values.entityType}: ${values.opportunityName || l.companyName}`,
              status: 'Qualified',
              activities: [
                ...l.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'Note',
                  title: `Converted to ${values.entityType}`,
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  performedBy: l.assignedSalesperson,
                  details: `Converted by sales desk with estimated deal size ₹${Number(
                    values.dealValue || l.estimatedBudget
                  ).toLocaleString('en-IN')}`,
                },
              ],
            }
          : l
      )
    );
    message.success(
      `Lead ${convertLeadModal.leadNumber} successfully converted to ${values.entityType}!`
    );
    setConvertLeadModal(null);
    convertForm.resetFields();
  };

  const handleAssignLead = (values: any) => {
    if (!assignModalLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === assignModalLead.id
          ? {
              ...l,
              assignedSalesperson: values.newSalesperson,
              activities: [
                ...l.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'Note',
                  title: 'Salesperson Reassigned',
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  performedBy: 'Sales Director',
                  details: `Reassigned from ${l.assignedSalesperson} to ${values.newSalesperson}. Reason: ${
                    values.reason || 'Territory alignment'
                  }`,
                },
              ],
            }
          : l
      )
    );
    message.success(
      `Lead ${assignModalLead.leadNumber} assigned to ${values.newSalesperson}`
    );
    setAssignModalLead(null);
    assignForm.resetFields();
  };

  const handleAddActivity = (values: any) => {
    if (!newActivityLead) return;
    const newAct: LeadActivityItem = {
      id: `act-${Date.now()}`,
      type: values.type,
      title: values.title,
      timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
      performedBy: newActivityLead.assignedSalesperson,
      details: values.details,
      outcome: values.outcome,
    };
    setLeads((prev) =>
      prev.map((l) =>
        l.id === newActivityLead.id
          ? {
              ...l,
              lastContacted: dayjs().format('YYYY-MM-DD'),
              nextFollowUp: values.nextFollowUp
                ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
                : l.nextFollowUp,
              activities: [newAct, ...l.activities],
            }
          : l
      )
    );
    message.success('Activity and communication history updated');
    setNewActivityLead(null);
    activityForm.resetFields();
  };

  // Badges & Tags Helpers
  const getStatusBadge = (status: LeadStatusType) => {
    const config: Record<
      LeadStatusType,
      { bg: string; color: string; border: string }
    > = {
      New: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
      Contacted: { bg: '#FDF4FF', color: '#A21CAF', border: '#F5D0FE' },
      Qualified: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
      Lost: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
    };
    const c = config[status] || { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' };
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 9px',
          borderRadius: 20,
          fontSize: 11.5,
          fontWeight: 700,
          backgroundColor: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: c.color,
          }}
        />
        {status}
      </span>
    );
  };

  const getPriorityBadge = (p: LeadPriorityType) => {
    const config: Record<LeadPriorityType, { bg: string; color: string; border: string }> = {
      Urgent: { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5' },
      High: { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
      Medium: { bg: '#FEFCE8', color: '#854D0E', border: '#FDE047' },
      Low: { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
    };
    const c = config[p] || { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    return (
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          backgroundColor: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        {p}
      </span>
    );
  };

  // Table Columns (Exact Match to Requirement 5)
  // Generous column widths so that Interested Product and Actions do not collide
  const columns: ColumnsType<LeadItem> = [
    {
      title: 'Lead ID',
      dataIndex: 'leadNumber',
      key: 'leadNumber',
      width: 125,
      render: (text: string, r) => (
        <span
          onClick={() => setViewLead(r)}
          style={{
            fontWeight: 800,
            color: BRAND_PURPLE,
            backgroundColor: BRAND_PURPLE_TINT,
            border: '1px solid #E9D5FF',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 11.5,
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Lead Name & Company',
      key: 'nameCompany',
      width: 210,
      render: (_, r) => (
        <div>
          <div
            onClick={() => setViewLead(r)}
            style={{
              fontWeight: 700,
              color: '#0F172A',
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            {r.contactName}
          </div>
          <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
            <Building size={11} color="#94A3B8" />
            <span style={{ fontWeight: 500 }}>{r.companyName}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Details',
      key: 'contactDetails',
      width: 180,
      render: (_, r) => (
        <div>
          <div style={{ fontSize: 11.5, color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone size={11} color="#64748B" />
            {r.phone}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
            <Mail size={11} color="#94A3B8" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Lead Source',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (source: LeadSourceType) => (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: '#334155',
            backgroundColor: '#F8FAFC',
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid #E2E8F0',
          }}
        >
          {source}
        </span>
      ),
    },
    {
      title: 'Interested Product / Service',
      dataIndex: 'interestedProduct',
      key: 'interestedProduct',
      width: 280,
      render: (prod: string) => (
        <span
          style={{
            fontWeight: 600,
            color: '#1E293B',
            fontSize: 12,
            display: 'block',
            lineHeight: 1.4,
            paddingRight: 16,
          }}
        >
          {prod}
        </span>
      ),
    },
    {
      title: 'Assigned Salesperson',
      dataIndex: 'assignedSalesperson',
      key: 'assignedSalesperson',
      width: 160,
      render: (rep: string, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#EDE9FE',
              color: BRAND_PURPLE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {rep.charAt(0)}
          </div>
          <span
            onClick={() => {
              setAssignModalLead(r);
              assignForm.setFieldsValue({ newSalesperson: r.assignedSalesperson });
            }}
            style={{
              fontSize: 12,
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline dotted #CBD5E1',
            }}
            title="Click to reassign"
          >
            {rep}
          </span>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 95,
      render: (p: LeadPriorityType) => getPriorityBadge(p),
    },
    {
      title: 'Lead Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: LeadStatusType) => getStatusBadge(s),
    },
    {
      title: 'Last Contacted',
      dataIndex: 'lastContacted',
      key: 'lastContacted',
      width: 115,
      render: (d: string) => (
        <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 500 }}>
          {d}
        </span>
      ),
    },
    {
      title: 'Next Follow-up',
      dataIndex: 'nextFollowUp',
      key: 'nextFollowUp',
      width: 120,
      render: (d: string) => {
        if (!d || d === '-') return <span style={{ color: '#94A3B8' }}>-</span>;
        const isPast = dayjs(d).isBefore(dayjs(), 'day');
        return (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: isPast ? 700 : 600,
              color: isPast ? '#DC2626' : '#2563EB',
            }}
          >
            {d} {isPast && '(!)'}
          </span>
        );
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 110,
      render: (d: string) => (
        <span style={{ fontSize: 11, color: '#64748B' }}>{d}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      fixed: 'right',
      align: 'center',
      render: (_, r) => (
        <Space size={6} style={{ justifyContent: 'center' }}>
          <Tooltip title="View Lead Details">
            <Button
              size="small"
              icon={<Eye size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => setViewLead(r)}
            />
          </Tooltip>
          <Tooltip title="Edit Lead">
            <Button
              size="small"
              icon={<Edit3 size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => {
                setEditingLead(r);
                form.setFieldsValue({
                  ...r,
                  nextFollowUp: r.nextFollowUp && r.nextFollowUp !== '-' ? dayjs(r.nextFollowUp) : null,
                });
              }}
            />
          </Tooltip>
          {!r.isConverted && r.status !== 'Lost' && (
            <Tooltip title="Convert Lead">
              <Button
                size="small"
                icon={<ArrowRight size={13} color="#15803D" />}
                style={{
                  borderRadius: 6,
                  backgroundColor: '#F0FDF4',
                  borderColor: '#BBF7D0',
                }}
                onClick={() => {
                  setConvertLeadModal(r);
                  convertForm.setFieldsValue({
                    entityType: 'Opportunity',
                    opportunityName: `${r.companyName} - Project`,
                    dealValue: r.estimatedBudget,
                  });
                }}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Delete this lead?"
            description="Are you sure you want to delete this lead record?"
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteLead(r.id, r.leadNumber)}
          >
            <Tooltip title="Delete">
              <Button
                size="small"
                danger
                icon={<Trash2 size={13} />}
                style={{ borderRadius: 6 }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)',
          borderRadius: 16,
          padding: '18px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 2px 8px rgba(68, 26, 135, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: BRAND_PURPLE_TINT,
                color: BRAND_PURPLE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Leads Management
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Manage sales prospects, track lead qualification, assign sales representatives and monitor conversion activities.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              backgroundColor: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              fontWeight: 700,
              height: 38,
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(68, 26, 135, 0.2)',
            }}
            onClick={() => {
              setEditingLead(null);
              form.resetFields();
              setIsAddModalOpen(true);
            }}
          >
            + Add New Lead
          </Button>
        </div>
      </div>

      {/* 2. 5 Summary Cards - Full 100% container width */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 14,
          width: '100%',
        }}
      >
        {/* Total Leads */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #E9D5FF',
            boxShadow: '0 2px 6px rgba(68, 26, 135, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6B21A8' }}>
              Total Leads
            </span>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={14} color={BRAND_PURPLE} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: BRAND_PURPLE, marginTop: 6 }}>
            {metrics.total}
          </div>
        </div>

        {/* New Leads */}
        <div
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #BFDBFE',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF' }}>
              New Leads
            </span>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={14} color="#2563EB" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#1E40AF', marginTop: 6 }}>
            {metrics.newCount}
          </div>
        </div>

        {/* Contacted Leads */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #F5D0FE',
            boxShadow: '0 2px 6px rgba(162, 28, 175, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#86198F' }}>
              Contacted Leads
            </span>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhoneCall size={14} color="#A21CAF" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#86198F', marginTop: 6 }}>
            {metrics.contactedCount}
          </div>
        </div>

        {/* Qualified Leads */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #BBF7D0',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>
              Qualified Leads
            </span>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={14} color="#16A34A" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#166534', marginTop: 6 }}>
            {metrics.qualifiedCount}
          </div>
        </div>

        {/* Lost Leads */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #FECACA',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>
              Lost Leads
            </span>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <XCircle size={14} color="#DC2626" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#991B1B', marginTop: 6 }}>
            {metrics.lostCount}
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Section (Single properly aligned row) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '14px 18px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 2px 8px rgba(68, 26, 135, 0.03)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {/* Search by Lead ID / Name / Company */}
        <div style={{ flex: '1 1 220px', minWidth: 200 }}>
          <Input
            prefix={<Search size={14} color="#94A3B8" />}
            placeholder="Search by Lead ID / Name / Company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36 }}
          />
        </div>

        {/* Lead Status Filter */}
        <div style={{ width: 145 }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Lost', label: 'Lost' },
            ]}
          />
        </div>

        {/* Lead Source Filter */}
        <div style={{ width: 145 }}>
          <Select
            value={sourceFilter}
            onChange={setSourceFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Sources' },
              { value: 'Website', label: 'Website' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Campaign', label: 'Campaign' },
              { value: 'Social Media', label: 'Social Media' },
              { value: 'Cold Outreach', label: 'Cold Outreach' },
            ]}
          />
        </div>

        {/* Assigned Salesperson Filter */}
        <div style={{ width: 160 }}>
          <Select
            value={salespersonFilter}
            onChange={setSalespersonFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Salespeople' },
              ...SALESPERSON_LIST.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div style={{ width: 130 }}>
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'Urgent', label: 'Urgent' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
        </div>

        {/* Date Range Filter */}
        <div style={{ width: 230 }}>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as any)}
            style={{ width: '100%', height: 36, borderRadius: 8 }}
            format="YYYY-MM-DD"
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        {/* Clear Filters Button if any active */}
        {(search ||
          statusFilter !== 'ALL' ||
          sourceFilter !== 'ALL' ||
          salespersonFilter !== 'ALL' ||
          priorityFilter !== 'ALL' ||
          dateRange) && (
          <Button
            size="small"
            icon={<RotateCcw size={12} />}
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setSourceFilter('ALL');
              setSalespersonFilter('ALL');
              setPriorityFilter('ALL');
              setDateRange(null);
            }}
            style={{ height: 36, borderRadius: 8, fontSize: 12, color: '#64748B' }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Lead Management Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '16px 20px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 4px 16px rgba(68, 26, 135, 0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
              All Leads
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: BRAND_PURPLE,
                backgroundColor: BRAND_PURPLE_TINT,
                padding: '2px 8px',
                borderRadius: 12,
              }}
            >
              {filteredLeads.length} records
            </span>
          </div>
        </div>

        <Table<LeadItem>
          columns={columns}
          dataSource={filteredLeads}
          rowKey="id"
          pagination={{
            pageSize: 7,
            size: 'small',
            showTotal: (total, range) => (
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Showing {range[0]}-{range[1]} of {total} leads
              </span>
            ),
          }}
          size="middle"
          scroll={{ x: 1750 }}
        />
      </div>

      {/* 5. Add / Edit Lead Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <Users size={18} color={BRAND_PURPLE} />
            {editingLead ? `Edit Lead: ${editingLead.leadNumber}` : 'Add New Sales Lead'}
          </div>
        }
        open={isAddModalOpen || !!editingLead}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
          form.resetFields();
        }}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveLead}
          initialValues={{
            status: 'New',
            priority: 'Medium',
            source: 'Website',
            assignedSalesperson: 'Vikram Seth',
          }}
          style={{ marginTop: 16 }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Contact Person Name</span>}
                name="contactName"
                rules={[{ required: true, message: 'Please enter contact person name' }]}
              >
                <Input placeholder="e.g. Ramesh Sundaram" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Company Name</span>}
                name="companyName"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="e.g. Apex Precision Tools Ltd" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Email Address</span>}
                name="email"
                rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
              >
                <Input placeholder="ramesh@apexprecision.com" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Phone Number</span>}
                name="phone"
                rules={[{ required: true, message: 'Enter contact phone' }]}
              >
                <Input placeholder="+91 98412 11002" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Lead Source</span>}
                name="source"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Website', label: 'Website' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Campaign', label: 'Campaign' },
                    { value: 'Social Media', label: 'Social Media' },
                    { value: 'Cold Outreach', label: 'Cold Outreach' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Assigned Salesperson</span>}
                name="assignedSalesperson"
                rules={[{ required: true }]}
              >
                <Select
                  options={SALESPERSON_LIST.map((s) => ({ value: s, label: s }))}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Priority</span>}
                name="priority"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Urgent', label: 'Urgent' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Lead Status</span>}
                name="status"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'Contacted', label: 'Contacted' },
                    { value: 'Qualified', label: 'Qualified' },
                    { value: 'Lost', label: 'Lost' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Estimated Budget (₹)</span>}
                name="estimatedBudget"
              >
                <Input placeholder="450000" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Next Follow-up</span>}
                name="nextFollowUp"
              >
                <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Interested Product / Service</span>}
            name="interestedProduct"
            rules={[{ required: true, message: 'Please specify interested product or service' }]}
          >
            <Input placeholder="e.g. Heavy-Duty Variable Frequency Drives 15kW" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Requirement Notes & Qualification Details</span>}
            name="requirementNotes"
          >
            <Input.TextArea
              rows={3}
              placeholder="Record technical specifications, budget readiness, timeline constraints..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingLead(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                fontWeight: 700,
                borderRadius: 6,
              }}
            >
              {editingLead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Lead Conversion Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <ArrowRight size={18} color="#15803D" />
            Convert Lead: {convertLeadModal?.leadNumber}
          </div>
        }
        open={!!convertLeadModal}
        onCancel={() => setConvertLeadModal(null)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={convertForm} layout="vertical" onFinish={handleConvertLead} style={{ marginTop: 14 }}>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Conversion Target</span>}
            name="entityType"
            rules={[{ required: true }]}
            initialValue="Opportunity"
          >
            <Select
              options={[
                { value: 'Opportunity', label: 'Sales Opportunity (Pipeline)' },
                { value: 'Customer Account', label: 'Customer Account (Active Client)' },
              ]}
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Opportunity / Deal Name</span>}
            name="opportunityName"
            rules={[{ required: true }]}
          >
            <Input style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Expected Deal Value (₹)</span>}
            name="dealValue"
            rules={[{ required: true }]}
          >
            <Input style={{ borderRadius: 6 }} />
          </Form.Item>

          <div
            style={{
              padding: 10,
              backgroundColor: '#F0FDF4',
              borderRadius: 8,
              border: '1px solid #BBF7D0',
              fontSize: 11.5,
              color: '#166534',
              marginBottom: 16,
            }}
          >
            Original lead info (<strong>{convertLeadModal?.leadNumber}</strong>) and activity history will be retained and linked to the new record.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setConvertLeadModal(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#15803D', borderColor: '#15803D', fontWeight: 700 }}
            >
              Confirm Conversion
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 7. Reassign Lead Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <UserCheck size={18} color={BRAND_PURPLE} />
            Assign Lead: {assignModalLead?.leadNumber}
          </div>
        }
        open={!!assignModalLead}
        onCancel={() => setAssignModalLead(null)}
        footer={null}
        width={450}
        destroyOnClose
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssignLead} style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
            Currently assigned to: <strong>{assignModalLead?.assignedSalesperson}</strong>
          </div>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Select Sales Representative</span>}
            name="newSalesperson"
            rules={[{ required: true, message: 'Please select a salesperson' }]}
          >
            <Select
              options={SALESPERSON_LIST.map((s) => ({ value: s, label: s }))}
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Assignment Reason / Instructions</span>}
            name="reason"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Industry domain specialization, regional territory reallocation..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setAssignModalLead(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            >
              Assign Salesperson
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 8. Log Activity Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <PhoneCall size={18} color={BRAND_PURPLE} />
            Log Activity: {newActivityLead?.leadNumber}
          </div>
        }
        open={!!newActivityLead}
        onCancel={() => setNewActivityLead(null)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={activityForm} layout="vertical" onFinish={handleAddActivity} style={{ marginTop: 14 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Activity Type</span>}
                name="type"
                rules={[{ required: true }]}
                initialValue="Call"
              >
                <Select
                  options={[
                    { value: 'Call', label: 'Phone Call' },
                    { value: 'Email', label: 'Email Follow-up' },
                    { value: 'Meeting', label: 'Client Meeting' },
                    { value: 'Note', label: 'Internal Note' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Next Follow-up Date</span>}
                name="nextFollowUp"
              >
                <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Activity Title / Subject</span>}
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Discussion on pricing and lead time" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Discussion Details</span>}
            name="details"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Key points discussed with customer..." style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Call / Meeting Outcome</span>}
            name="outcome"
          >
            <Input placeholder="e.g. Customer agreed to receive quote" style={{ borderRadius: 6 }} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setNewActivityLead(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            >
              Save Activity
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 9. Comprehensive Lead Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontWeight: 800,
                  color: BRAND_PURPLE,
                  backgroundColor: BRAND_PURPLE_TINT,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                {viewLead?.leadNumber}
              </span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                {viewLead?.companyName}
              </span>
            </div>
            {viewLead && getStatusBadge(viewLead.status)}
          </div>
        }
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        width={580}
        destroyOnClose
      >
        {viewLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Quick Stats Banner */}
            <div
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)',
                borderRadius: 12,
                border: '1px solid #ECE6F8',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Estimated Budget</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: BRAND_PURPLE, marginTop: 2 }}>
                  ₹{viewLead.estimatedBudget.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Priority</div>
                <div style={{ marginTop: 4 }}>{getPriorityBadge(viewLead.priority)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Assigned To</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  {viewLead.assignedSalesperson}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                size="small"
                icon={<PhoneCall size={12} />}
                onClick={() => {
                  setNewActivityLead(viewLead);
                  activityForm.resetFields();
                }}
                style={{ borderRadius: 6, fontWeight: 600, color: BRAND_PURPLE, borderColor: '#D8B4FE' }}
              >
                Log Activity
              </Button>
              <Button
                size="small"
                icon={<UserCheck size={12} />}
                onClick={() => {
                  setAssignModalLead(viewLead);
                  assignForm.setFieldsValue({ newSalesperson: viewLead.assignedSalesperson });
                }}
                style={{ borderRadius: 6, fontWeight: 600 }}
              >
                Reassign Rep
              </Button>
              {!viewLead.isConverted && viewLead.status !== 'Lost' && (
                <Button
                  size="small"
                  type="primary"
                  icon={<ArrowRight size={12} />}
                  onClick={() => {
                    setConvertLeadModal(viewLead);
                    convertForm.setFieldsValue({
                      entityType: 'Opportunity',
                      opportunityName: `${viewLead.companyName} - Project`,
                      dealValue: viewLead.estimatedBudget,
                    });
                  }}
                  style={{ backgroundColor: '#15803D', borderColor: '#15803D', borderRadius: 6, fontWeight: 700 }}
                >
                  Convert Lead
                </Button>
              )}
            </div>

            {/* 1. Lead Information & Company Details */}
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Building size={14} color={BRAND_PURPLE} />
                Company & Contact Information
              </div>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: '1px solid #E2E8F0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px 16px',
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Contact Person:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewLead.contactName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Company Name:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewLead.companyName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Phone Number:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewLead.phone}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Email Address:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewLead.email}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Lead Source:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewLead.source}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Created Date:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewLead.createdDate}</span>
                </div>
              </div>
            </div>

            {/* 2. Interested Product & Qualification */}
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Briefcase size={14} color={BRAND_PURPLE} />
                Interested Products & Scope
              </div>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: '1px solid #E2E8F0',
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                  {viewLead.interestedProduct}
                </div>
                <div style={{ color: '#475569', fontSize: 11.5, lineHeight: 1.5 }}>
                  {viewLead.requirementNotes || 'No specific requirement notes recorded.'}
                </div>
              </div>
            </div>

            {/* 3. Follow-up Schedule */}
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Calendar size={14} color={BRAND_PURPLE} />
                Follow-up Schedule
              </div>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: '1px solid #E2E8F0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Last Contacted Date:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewLead.lastContacted}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Next Follow-up Date:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        viewLead.nextFollowUp &&
                        viewLead.nextFollowUp !== '-' &&
                        dayjs(viewLead.nextFollowUp).isBefore(dayjs(), 'day')
                          ? '#DC2626'
                          : '#2563EB',
                    }}
                  >
                    {viewLead.nextFollowUp || 'Not scheduled'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Conversion Details (if converted) */}
            {viewLead.isConverted && (
              <div
                style={{
                  background: '#F0FDF4',
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: '1px solid #BBF7D0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontWeight: 800, fontSize: 12.5 }}>
                  <CheckCircle size={14} />
                  Lead Converted
                </div>
                <div style={{ fontSize: 11.5, color: '#14532D', marginTop: 4 }}>
                  {viewLead.convertedEntity}
                </div>
              </div>
            )}

            {/* 5. Lead Activity Timeline */}
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Clock size={14} color={BRAND_PURPLE} />
                Activity Timeline & Communication History
              </div>

              {viewLead.activities.length === 0 ? (
                <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', padding: 8 }}>
                  No activities recorded yet. Use the "Log Activity" button above to log calls or meetings.
                </div>
              ) : (
                <Timeline
                  style={{ marginTop: 8 }}
                  items={viewLead.activities.map((a) => ({
                    color: a.type === 'Meeting' ? '#16A34A' : a.type === 'Call' ? '#2563EB' : '#8B5CF6',
                    children: (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0F172A' }}>
                          {a.title}
                          <Tag
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                              lineHeight: '16px',
                              padding: '0 4px',
                              fontWeight: 600,
                            }}
                          >
                            {a.type}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>
                          {a.timestamp} • by {a.performedBy}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#475569', marginTop: 3 }}>
                          {a.details}
                        </div>
                        {a.outcome && (
                          <div
                            style={{
                              fontSize: 11,
                              color: '#15803D',
                              fontWeight: 600,
                              marginTop: 3,
                              backgroundColor: '#F0FDF4',
                              padding: '2px 6px',
                              borderRadius: 4,
                              display: 'inline-block',
                            }}
                          >
                            Outcome: {a.outcome}
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default LeadsListPage;
