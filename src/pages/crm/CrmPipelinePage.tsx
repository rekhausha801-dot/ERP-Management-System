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
  Progress,
  Radio,
  DatePicker,
  Timeline,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  TrendingUp,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Award,
  Filter,
  IndianRupee,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  UserCheck,
  FileText,
  DollarSign,
  PhoneCall,
  Briefcase,
  AlertCircle,
  BarChart2,
  PieChart,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import dayjs from 'dayjs';

// Enterprise Purple Palette
const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#6E39CB';
const BRAND_PURPLE_TINT = '#F5EEFD';

export type PipelineStageType =
  | 'New Opportunity'
  | 'Requirement Analysis'
  | 'Proposal / Quotation'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type OpportunityPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface OpportunityActivity {
  id: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Discussion' | 'Note';
  title: string;
  timestamp: string;
  performedBy: string;
  details: string;
  outcome?: string;
}

export interface OpportunityItem {
  id: string;
  opportunityNumber: string;
  name: string;
  companyName: string;
  customerName: string;
  productService: string;
  dealValue: number;
  probability: number;
  stage: PipelineStageType;
  assignedSalesperson: string;
  expectedClosingDate: string;
  nextFollowUp: string;
  priority: OpportunityPriority;
  createdDate: string;
  relatedLeadNumber?: string;
  relatedQuotation?: string;
  proposedAmount?: number;
  negotiationDetails?: string;
  winLossReason?: string;
  competitorInfo?: string;
  closedDate?: string;
  salesOrderNumber?: string;
  notes?: string;
  activities: OpportunityActivity[];
}

const PIPELINE_STAGES: PipelineStageType[] = [
  'New Opportunity',
  'Requirement Analysis',
  'Proposal / Quotation',
  'Negotiation',
  'Won',
  'Lost',
];

const SALESPERSON_LIST = [
  'Vikram Seth',
  'Ananya Sharma',
  'Murugan Selvam',
  'Rajesh Kannan',
  'Pooja Hegde',
];

const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    opportunityNumber: 'OPP-2026-081',
    name: 'Assembly Line 15kW VFD Overhaul',
    companyName: 'Apex Precision Tools Ltd',
    customerName: 'Ramesh Sundaram',
    productService: 'Heavy-Duty Variable Frequency Inverters 15kW',
    dealValue: 450000,
    probability: 80,
    stage: 'Negotiation',
    assignedSalesperson: 'Vikram Seth',
    expectedClosingDate: '2026-11-30',
    nextFollowUp: '2026-11-22',
    priority: 'High',
    createdDate: '2026-11-10',
    relatedLeadNumber: 'LD-2026-001',
    relatedQuotation: 'QT-2026-104',
    proposedAmount: 440000,
    negotiationDetails: 'Reviewing 30-day payment credit terms and free on-site commissioning.',
    activities: [
      {
        id: 'act-1',
        type: 'Call',
        title: 'Commercial Terms Discussion',
        timestamp: '2026-11-18 11:30 AM',
        performedBy: 'Vikram Seth',
        details: 'Agreed on 440,000 final deal value with 30-day payment credit.',
        outcome: 'Purchase order approval in final management round',
      },
    ],
  },
  {
    id: 'opp-2',
    opportunityNumber: 'OPP-2026-082',
    name: 'Warehouse Automated Stacker Actuators',
    companyName: 'Omni Infra Ventures',
    customerName: 'Priya Narayanan',
    productService: 'High-Pressure Hydraulic Cylinders & Actuators',
    dealValue: 1200000,
    probability: 60,
    stage: 'Proposal / Quotation',
    assignedSalesperson: 'Ananya Sharma',
    expectedClosingDate: '2026-12-05',
    nextFollowUp: '2026-11-24',
    priority: 'Urgent',
    createdDate: '2026-11-14',
    relatedLeadNumber: 'LD-2026-002',
    relatedQuotation: 'QT-2026-108',
    proposedAmount: 1180000,
    negotiationDetails: 'Quotation sent. Customer evaluating 3-week delivery lead time.',
    activities: [
      {
        id: 'act-2',
        type: 'Email',
        title: 'Detailed Engineering Proposal Sent',
        timestamp: '2026-11-16 03:00 PM',
        performedBy: 'Ananya Sharma',
        details: 'Submitted formal proposal for 20 cylinder actuator assemblies.',
      },
    ],
  },
  {
    id: 'opp-3',
    opportunityNumber: 'OPP-2026-083',
    name: 'Factory Packaging Line PLC Retrofit',
    companyName: 'Southern Automation Works',
    customerName: 'Karthik Raja',
    productService: 'Modular PLC & Industrial I/O Modules',
    dealValue: 850000,
    probability: 40,
    stage: 'Requirement Analysis',
    assignedSalesperson: 'Vikram Seth',
    expectedClosingDate: '2026-12-15',
    nextFollowUp: '2026-11-25',
    priority: 'Medium',
    createdDate: '2026-11-12',
    relatedLeadNumber: 'LD-2026-003',
    negotiationDetails: 'Scoping existing machine wiring and Modbus network topology.',
    activities: [
      {
        id: 'act-3',
        type: 'Meeting',
        title: 'On-site IO Audit',
        timestamp: '2026-11-15 02:00 PM',
        performedBy: 'Vikram Seth',
        details: 'Counted 64 digital inputs and 32 analog channels required.',
        outcome: 'Bill of Materials being finalized',
      },
    ],
  },
  {
    id: 'opp-4',
    opportunityNumber: 'OPP-2026-084',
    name: 'Cleanroom Environmental HVAC System',
    companyName: 'Bharat Bio Labs',
    customerName: 'Dr. Ashok Kumar',
    productService: 'Laboratory Clean-Room HVAC Regulators',
    dealValue: 620000,
    probability: 20,
    stage: 'New Opportunity',
    assignedSalesperson: 'Ananya Sharma',
    expectedClosingDate: '2026-12-20',
    nextFollowUp: '2026-11-23',
    priority: 'Medium',
    createdDate: '2026-11-19',
    relatedLeadNumber: 'LD-2026-004',
    activities: [],
  },
  {
    id: 'opp-5',
    opportunityNumber: 'OPP-2026-085',
    name: 'IE3 Energy Efficient Motor Upgrades',
    companyName: 'Coimbatore Foundry Cluster',
    customerName: 'Suresh Menon',
    productService: '3-Phase Induction Motors 22kW Heavy Duty',
    dealValue: 980000,
    probability: 100,
    stage: 'Won',
    assignedSalesperson: 'Rajesh Kannan',
    expectedClosingDate: '2026-11-18',
    nextFollowUp: '-',
    priority: 'High',
    createdDate: '2026-11-01',
    closedDate: '2026-11-18',
    salesOrderNumber: 'SO-2026-398',
    relatedQuotation: 'QT-2026-095',
    proposedAmount: 980000,
    winLossReason: 'Superior energy efficiency class IE3 with quick 10-day local dispatch.',
    activities: [
      {
        id: 'act-4',
        type: 'Note',
        title: 'Deal Won & Purchase Order Received',
        timestamp: '2026-11-18 04:30 PM',
        performedBy: 'Rajesh Kannan',
        details: 'Received official PO. Converted to Sales Order SO-2026-398.',
        outcome: 'Won Deal',
      },
    ],
  },
  {
    id: 'opp-6',
    opportunityNumber: 'OPP-2026-086',
    name: 'High Precision CNC Spindle Overhaul',
    companyName: 'Verma Fabricators & Co',
    customerName: 'Manish Verma',
    productService: 'CNC Spindle Bearings & Power Belts',
    dealValue: 310000,
    probability: 0,
    stage: 'Lost',
    assignedSalesperson: 'Murugan Selvam',
    expectedClosingDate: '2026-11-10',
    nextFollowUp: '-',
    priority: 'Low',
    createdDate: '2026-10-25',
    closedDate: '2026-11-10',
    winLossReason: 'Competitor offered 15% discount on bulk bearing packages.',
    competitorInfo: 'SKF Local Regional Distributor',
    activities: [
      {
        id: 'act-5',
        type: 'Call',
        title: 'Lost Deal Debrief',
        timestamp: '2026-11-10 11:30 AM',
        performedBy: 'Murugan Selvam',
        details: 'Client cited extreme price discount from competitor.',
        outcome: 'Lost Deal',
      },
    ],
  },
];

export const CrmPipelinePage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Search & Filters State
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [closingDateMonth, setClosingDateMonth] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityItem | null>(null);
  const [viewOpp, setViewOpp] = useState<OpportunityItem | null>(null);
  const [winModalOpp, setWinModalOpp] = useState<OpportunityItem | null>(null);
  const [lostModalOpp, setLostModalOpp] = useState<OpportunityItem | null>(null);
  const [newActivityOpp, setNewActivityOpp] = useState<OpportunityItem | null>(null);

  const [form] = Form.useForm();
  const [winForm] = Form.useForm();
  const [lostForm] = Form.useForm();
  const [activityForm] = Form.useForm();

  // Drag and drop state for Kanban
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);

  // 1. Five Summary Metrics (Exact Match to Requirement 3)
  const metrics = useMemo(() => {
    const totalDeals = opportunities.length;
    const openDealsList = opportunities.filter((o) => o.stage !== 'Won' && o.stage !== 'Lost');
    const openDeals = openDealsList.length;
    const wonDealsList = opportunities.filter((o) => o.stage === 'Won');
    const wonDeals = wonDealsList.length;
    const lostDealsList = opportunities.filter((o) => o.stage === 'Lost');
    const lostDeals = lostDealsList.length;

    const expectedWeightedRevenue = openDealsList.reduce(
      (sum, o) => sum + (o.dealValue * o.probability) / 100,
      0
    );

    const totalOpenPipelineValue = openDealsList.reduce((sum, o) => sum + o.dealValue, 0);
    const wonRevenue = wonDealsList.reduce((sum, o) => sum + o.dealValue, 0);
    const lostValue = lostDealsList.reduce((sum, o) => sum + o.dealValue, 0);

    return {
      totalDeals,
      openDeals,
      wonDeals,
      lostDeals,
      expectedWeightedRevenue,
      totalOpenPipelineValue,
      wonRevenue,
      lostValue,
    };
  }, [opportunities]);

  // 2. Filtered Opportunities
  const filteredOpps = useMemo(() => {
    return opportunities.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        o.opportunityNumber.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.companyName.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productService.toLowerCase().includes(q);

      const matchStage = stageFilter === 'ALL' || o.stage === stageFilter;
      const matchRep = salespersonFilter === 'ALL' || o.assignedSalesperson === salespersonFilter;
      const matchPriority = priorityFilter === 'ALL' || o.priority === priorityFilter;

      let matchMonth = true;
      if (closingDateMonth !== 'ALL') {
        matchMonth = dayjs(o.expectedClosingDate).format('YYYY-MM') === closingDateMonth;
      }

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const d = dayjs(o.expectedClosingDate);
        matchDate = d.isAfter(dateRange[0].startOf('day')) && d.isBefore(dateRange[1].endOf('day'));
      }

      return matchSearch && matchStage && matchRep && matchPriority && matchMonth && matchDate;
    });
  }, [opportunities, search, stageFilter, salespersonFilter, priorityFilter, closingDateMonth, dateRange]);

  // Handlers
  const handleSaveOpp = (values: any) => {
    const val = Number(values.dealValue) || 0;
    let prob = Number(values.probability) || 50;
    if (values.stage === 'Won') prob = 100;
    if (values.stage === 'Lost') prob = 0;

    if (editingOpp) {
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === editingOpp.id
            ? {
                ...o,
                name: values.name,
                companyName: values.companyName,
                customerName: values.customerName,
                productService: values.productService,
                dealValue: val,
                probability: prob,
                stage: values.stage,
                assignedSalesperson: values.assignedSalesperson,
                priority: values.priority,
                expectedClosingDate: values.expectedClosingDate
                  ? dayjs(values.expectedClosingDate).format('YYYY-MM-DD')
                  : o.expectedClosingDate,
                nextFollowUp: values.nextFollowUp
                  ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
                  : o.nextFollowUp,
                relatedQuotation: values.relatedQuotation,
                notes: values.notes,
              }
            : o
        )
      );
      message.success(`Opportunity ${editingOpp.opportunityNumber} updated`);
      setEditingOpp(null);
    } else {
      const nextNum = opportunities.length + 1;
      const oppNum = `OPP-2026-${String(nextNum).padStart(3, '0')}`;
      const newEntry: OpportunityItem = {
        id: `opp-${Date.now()}`,
        opportunityNumber: oppNum,
        name: values.name,
        companyName: values.companyName,
        customerName: values.customerName,
        productService: values.productService,
        dealValue: val,
        probability: prob,
        stage: values.stage || 'New Opportunity',
        assignedSalesperson: values.assignedSalesperson,
        priority: values.priority || 'Medium',
        expectedClosingDate: values.expectedClosingDate
          ? dayjs(values.expectedClosingDate).format('YYYY-MM-DD')
          : dayjs().add(20, 'day').format('YYYY-MM-DD'),
        nextFollowUp: values.nextFollowUp
          ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
          : dayjs().add(3, 'day').format('YYYY-MM-DD'),
        createdDate: dayjs().format('YYYY-MM-DD'),
        relatedQuotation: values.relatedQuotation || '',
        notes: values.notes || '',
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'Note',
            title: 'Opportunity Created',
            timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
            performedBy: values.assignedSalesperson,
            details: 'Deal entered into sales pipeline.',
          },
        ],
      };
      setOpportunities((prev) => [newEntry, ...prev]);
      message.success(`New Opportunity ${oppNum} generated!`);
      setIsAddModalOpen(false);
    }
    form.resetFields();
  };

  const handleStageTransition = (id: string, newStage: PipelineStageType) => {
    const opp = opportunities.find((o) => o.id === id);
    if (!opp) return;

    if (newStage === 'Won') {
      setWinModalOpp(opp);
      winForm.setFieldsValue({
        finalDealValue: opp.dealValue,
        confirmedQuotation: opp.relatedQuotation || `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
        salesOrderNumber: `SO-2026-${Math.floor(400 + Math.random() * 100)}`,
        closedDate: dayjs(),
      });
      return;
    }

    if (newStage === 'Lost') {
      setLostModalOpp(opp);
      lostForm.setFieldsValue({
        lostDate: dayjs(),
      });
      return;
    }

    let defaultProb = opp.probability;
    if (newStage === 'New Opportunity') defaultProb = 20;
    else if (newStage === 'Requirement Analysis') defaultProb = 40;
    else if (newStage === 'Proposal / Quotation') defaultProb = 60;
    else if (newStage === 'Negotiation') defaultProb = 80;

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              stage: newStage,
              probability: defaultProb,
              activities: [
                ...o.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'Note',
                  title: `Stage Updated to ${newStage}`,
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  performedBy: o.assignedSalesperson,
                  details: `Advanced stage to ${newStage} with win probability ${defaultProb}%.`,
                },
              ],
            }
          : o
      )
    );
    message.success(`Opportunity moved to ${newStage}`);
  };

  const handleWinDeal = (values: any) => {
    if (!winModalOpp) return;
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === winModalOpp.id
          ? {
              ...o,
              stage: 'Won',
              probability: 100,
              dealValue: Number(values.finalDealValue) || o.dealValue,
              relatedQuotation: values.confirmedQuotation,
              salesOrderNumber: values.salesOrderNumber,
              closedDate: values.closedDate ? dayjs(values.closedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
              winLossReason: values.winReason || 'Commercial and technical terms accepted',
              activities: [
                ...o.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'Note',
                  title: 'Deal Won & Closed',
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  performedBy: o.assignedSalesperson,
                  details: `Final order value ₹${Number(values.finalDealValue || o.dealValue).toLocaleString(
                    'en-IN'
                  )}. Linked Sales Order: ${values.salesOrderNumber}`,
                  outcome: 'Deal Won',
                },
              ],
            }
          : o
      )
    );
    message.success(`Opportunity ${winModalOpp.opportunityNumber} marked as WON!`);
    setWinModalOpp(null);
    winForm.resetFields();
  };

  const handleLostDeal = (values: any) => {
    if (!lostModalOpp) return;
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === lostModalOpp.id
          ? {
              ...o,
              stage: 'Lost',
              probability: 0,
              closedDate: values.lostDate ? dayjs(values.lostDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
              winLossReason: values.lostReason,
              competitorInfo: values.competitorInfo || '',
              activities: [
                ...o.activities,
                {
                  id: `act-${Date.now()}`,
                  type: 'Note',
                  title: 'Deal Marked as Lost',
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  performedBy: o.assignedSalesperson,
                  details: `Reason: ${values.lostReason}. Competitor: ${values.competitorInfo || 'None specified'}`,
                  outcome: 'Deal Lost',
                },
              ],
            }
          : o
      )
    );
    message.warning(`Opportunity ${lostModalOpp.opportunityNumber} marked as LOST`);
    setLostModalOpp(null);
    lostForm.resetFields();
  };

  const handleAddActivity = (values: any) => {
    if (!newActivityOpp) return;
    const act: OpportunityActivity = {
      id: `act-${Date.now()}`,
      type: values.type,
      title: values.title,
      timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
      performedBy: newActivityOpp.assignedSalesperson,
      details: values.details,
      outcome: values.outcome,
    };
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === newActivityOpp.id
          ? {
              ...o,
              nextFollowUp: values.nextFollowUp
                ? dayjs(values.nextFollowUp).format('YYYY-MM-DD')
                : o.nextFollowUp,
              activities: [act, ...o.activities],
            }
          : o
      )
    );
    message.success('Activity logged successfully');
    setNewActivityOpp(null);
    activityForm.resetFields();
  };

  const handleDeleteOpp = (id: string, num: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    if (viewOpp?.id === id) setViewOpp(null);
    message.success(`Opportunity ${num} deleted`);
  };

  // Badges & Tag Helpers
  const getStageBadge = (stage: PipelineStageType) => {
    const config: Record<PipelineStageType, { bg: string; color: string; border: string }> = {
      'New Opportunity': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
      'Requirement Analysis': { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
      'Proposal / Quotation': { bg: '#FAF5FF', color: '#6B21A8', border: '#E9D5FF' },
      Negotiation: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
      Won: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
      Lost: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
    };
    const c = config[stage] || { bg: '#F8FAFC', color: '#475569', border: '#CBD5E1' };
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '2px 8px',
          borderRadius: 16,
          fontSize: 11,
          fontWeight: 700,
          backgroundColor: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.color }} />
        {stage}
      </span>
    );
  };

  const getPriorityBadge = (p: OpportunityPriority) => {
    const config: Record<OpportunityPriority, { bg: string; color: string; border: string }> = {
      Urgent: { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5' },
      High: { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
      Medium: { bg: '#FEFCE8', color: '#854D0E', border: '#FDE047' },
      Low: { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
    };
    const c = config[p] || { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    return (
      <span
        style={{
          padding: '2px 7px',
          borderRadius: 6,
          fontSize: 10.5,
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

  // Table Columns for List View (Requirement 7)
  const columns: ColumnsType<OpportunityItem> = [
    {
      title: 'Opportunity ID',
      dataIndex: 'opportunityNumber',
      key: 'opportunityNumber',
      width: 125,
      render: (text: string, r) => (
        <span
          onClick={() => setViewOpp(r)}
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
      title: 'Opportunity Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text: string, r) => (
        <div>
          <div
            onClick={() => setViewOpp(r)}
            style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5, cursor: 'pointer' }}
          >
            {text}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{r.productService}</div>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12 }}>{r.companyName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.customerName}</div>
        </div>
      ),
    },
    {
      title: 'Deal Value',
      dataIndex: 'dealValue',
      key: 'dealValue',
      align: 'right',
      width: 120,
      sorter: (a, b) => a.dealValue - b.dealValue,
      render: (val: number) => (
        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 12 }}>
          ₹{val.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      width: 115,
      sorter: (a, b) => a.probability - b.probability,
      render: (prob: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Progress
            percent={prob}
            size="small"
            showInfo={false}
            strokeColor={prob >= 80 ? '#10B981' : prob >= 40 ? '#3B82F6' : '#F59E0B'}
            style={{ width: 45 }}
          />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#334155' }}>{prob}%</span>
        </div>
      ),
    },
    {
      title: 'Weighted Revenue',
      key: 'weightedRevenue',
      align: 'right',
      width: 135,
      sorter: (a, b) => (a.dealValue * a.probability) / 100 - (b.dealValue * b.probability) / 100,
      render: (_, r) => {
        const weighted = Math.round((r.dealValue * r.probability) / 100);
        return (
          <span style={{ fontWeight: 800, color: BRAND_PURPLE, fontSize: 12 }}>
            ₹{weighted.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      title: 'Salesperson',
      dataIndex: 'assignedSalesperson',
      key: 'assignedSalesperson',
      width: 135,
      render: (rep: string) => (
        <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{rep}</span>
      ),
    },
    {
      title: 'Pipeline Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 160,
      render: (st: PipelineStageType) => getStageBadge(st),
    },
    {
      title: 'Expected Closing Date',
      dataIndex: 'expectedClosingDate',
      key: 'expectedClosingDate',
      width: 120,
      sorter: (a, b) => a.expectedClosingDate.localeCompare(b.expectedClosingDate),
      render: (d: string) => <span style={{ fontSize: 11.5, color: '#475569' }}>{d}</span>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (p: OpportunityPriority) => getPriorityBadge(p),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<Eye size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => setViewOpp(r)}
            />
          </Tooltip>
          <Tooltip title="Edit Deal">
            <Button
              size="small"
              icon={<Edit3 size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => {
                setEditingOpp(r);
                form.setFieldsValue({
                  ...r,
                  expectedClosingDate: dayjs(r.expectedClosingDate),
                  nextFollowUp: r.nextFollowUp && r.nextFollowUp !== '-' ? dayjs(r.nextFollowUp) : null,
                });
              }}
            />
          </Tooltip>
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
            <TrendingUp size={20} />
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
              Opportunities & Sales Pipeline
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Manage sales opportunities, track deal progress, monitor win probability and forecast expected revenue.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Kanban / List View Toggle */}
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
            style={{ borderRadius: 8 }}
          >
            <Radio.Button value="kanban" style={{ height: 38, lineHeight: '36px', fontSize: 12, fontWeight: 600 }}>
              <LayoutGrid size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Kanban
            </Radio.Button>
            <Radio.Button value="list" style={{ height: 38, lineHeight: '36px', fontSize: 12, fontWeight: 600 }}>
              <ListIcon size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              List View
            </Radio.Button>
          </Radio.Group>

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
              setEditingOpp(null);
              form.resetFields();
              setIsAddModalOpen(true);
            }}
          >
            + New Opportunity
          </Button>
        </div>
      </div>

      {/* 2. 5 Summary Cards - Full 100% Width CSS Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 14,
          width: '100%',
        }}
      >
        {/* Total Deals */}
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
              Total Deals
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
              <Layers size={14} color={BRAND_PURPLE} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: BRAND_PURPLE, marginTop: 6 }}>
            {metrics.totalDeals}
          </div>
        </div>

        {/* Open Deals */}
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
              Open Deals
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
            {metrics.openDeals}
          </div>
        </div>

        {/* Won Deals */}
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
              Won Deals
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
            {metrics.wonDeals}
          </div>
        </div>

        {/* Lost Deals */}
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
              Lost Deals
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
            {metrics.lostDeals}
          </div>
        </div>

        {/* Expected Weighted Revenue */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #E9D5FF',
            boxShadow: '0 2px 6px rgba(107, 33, 168, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6B21A8' }}>
              Expected Weighted Revenue
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
              <IndianRupee size={14} color={BRAND_PURPLE} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: BRAND_PURPLE, marginTop: 6 }}>
            ₹{(metrics.expectedWeightedRevenue / 100000).toFixed(2)} Lakhs
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Row (Single Unified Row) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '14px 18px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 2px 8px rgba(68, 26, 135, 0.03)',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 10,
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        {/* Search by Opportunity ID / Name / Customer */}
        <div style={{ flex: '1 1 200px', minWidth: 170 }}>
          <Input
            prefix={<Search size={14} color="#94A3B8" />}
            placeholder="Search deal ID / Name / Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36 }}
          />
        </div>

        {/* Pipeline Stage Filter */}
        <div style={{ width: 155, flexShrink: 0 }}>
          <Select
            value={stageFilter}
            onChange={setStageFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Stages' },
              ...PIPELINE_STAGES.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        {/* Assigned Salesperson Filter */}
        <div style={{ width: 145, flexShrink: 0 }}>
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
        <div style={{ width: 125, flexShrink: 0 }}>
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

        {/* Expected Closing Date Month Filter */}
        <div style={{ width: 145, flexShrink: 0 }}>
          <Select
            value={closingDateMonth}
            onChange={setClosingDateMonth}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Closing Months' },
              { value: '2026-11', label: 'Nov 2026' },
              { value: '2026-12', label: 'Dec 2026' },
              { value: '2027-01', label: 'Jan 2027' },
            ]}
          />
        </div>

        {/* Date Range Filter */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as any)}
            style={{ width: '100%', height: 36, borderRadius: 8 }}
            format="YYYY-MM-DD"
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        {/* Reset Filter Button */}
        {(search ||
          stageFilter !== 'ALL' ||
          salespersonFilter !== 'ALL' ||
          priorityFilter !== 'ALL' ||
          closingDateMonth !== 'ALL' ||
          dateRange) && (
          <Button
            size="small"
            icon={<RotateCcw size={12} />}
            onClick={() => {
              setSearch('');
              setStageFilter('ALL');
              setSalespersonFilter('ALL');
              setPriorityFilter('ALL');
              setClosingDateMonth('ALL');
              setDateRange(null);
            }}
            style={{ height: 36, borderRadius: 8, fontSize: 12, color: '#64748B', flexShrink: 0 }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Sales Forecast & Revenue Tracking Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8FE 100%)',
          borderRadius: 14,
          padding: '14px 18px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 2px 8px rgba(68, 26, 135, 0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart2 size={15} color={BRAND_PURPLE} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
              Sales Forecasting & Pipeline Health
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            Weighted Revenue = Deal Value × Win Probability / 100 (Open Deals Only)
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 12,
            width: '100%',
          }}
        >
          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600 }}>Total Open Pipeline</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
              ₹{(metrics.totalOpenPipelineValue / 100000).toFixed(2)} Lakhs
            </div>
          </div>
          <div style={{ padding: '8px 12px', background: '#FAF5FF', borderRadius: 8, border: '1px solid #E9D5FF' }}>
            <div style={{ fontSize: 10.5, color: '#6B21A8', fontWeight: 600 }}>Expected Weighted</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: BRAND_PURPLE, marginTop: 2 }}>
              ₹{(metrics.expectedWeightedRevenue / 100000).toFixed(2)} Lakhs
            </div>
          </div>
          <div style={{ padding: '8px 12px', background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 10.5, color: '#1E40AF', fontWeight: 600 }}>Nov 2026 Forecast</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1D4ED8', marginTop: 2 }}>
              ₹3.60 Lakhs
            </div>
          </div>
          <div style={{ padding: '8px 12px', background: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD' }}>
            <div style={{ fontSize: 10.5, color: '#0369A1', fontWeight: 600 }}>Q3 Quarterly Forecast</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0284C7', marginTop: 2 }}>
              ₹15.40 Lakhs
            </div>
          </div>
          <div style={{ padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 10.5, color: '#166534', fontWeight: 600 }}>Won Revenue</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#15803D', marginTop: 2 }}>
              ₹{(metrics.wonRevenue / 100000).toFixed(2)} Lakhs
            </div>
          </div>
          <div style={{ padding: '8px 12px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
            <div style={{ fontSize: 10.5, color: '#991B1B', fontWeight: 600 }}>Lost Deal Value</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#DC2626', marginTop: 2 }}>
              ₹{(metrics.lostValue / 100000).toFixed(2)} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* 5. Main Body: Kanban View OR List View */}
      {viewMode === 'kanban' ? (
        <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, minWidth: 1450 }}>
            {PIPELINE_STAGES.map((stage) => {
              const stageOpps = filteredOpps.filter((o) => o.stage === stage);
              const stageValue = stageOpps.reduce((sum, o) => sum + o.dealValue, 0);

              return (
                <div
                  key={stage}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedOppId) {
                      handleStageTransition(draggedOppId, stage);
                      setDraggedOppId(null);
                    }
                  }}
                  style={{
                    flex: '1 1 0px',
                    minWidth: 265,
                    background: '#F8F6FC',
                    borderRadius: 14,
                    padding: 12,
                    border: '1px solid #EAE4F5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {/* Kanban Stage Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 6px',
                      borderBottom: '1px solid #ECE6F8',
                      paddingBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 12.5, color: '#0F172A' }}>{stage}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, marginTop: 1 }}>
                        ₹{(stageValue / 100000).toFixed(2)} Lakhs
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: BRAND_PURPLE,
                        border: '1px solid #E9D5FF',
                        borderRadius: 12,
                        padding: '1px 8px',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {stageOpps.length}
                    </span>
                  </div>

                  {/* Opportunities inside Stage */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      minHeight: 420,
                    }}
                  >
                    {stageOpps.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '30px 10px',
                          color: '#94A3B8',
                          fontSize: 11.5,
                          border: '1px dashed #E2E8F0',
                          borderRadius: 10,
                          margin: 'auto 0',
                        }}
                      >
                        No deals in {stage}
                      </div>
                    ) : (
                      stageOpps.map((opp) => (
                        <div
                          key={opp.id}
                          draggable
                          onDragStart={() => setDraggedOppId(opp.id)}
                          onClick={() => setViewOpp(opp)}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: 12,
                            padding: '14px 16px',
                            minHeight: 220,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            border: '1px solid #ECE6F8',
                            boxShadow: '0 2px 8px rgba(68, 26, 135, 0.04)',
                            cursor: 'grab',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Top Section */}
                          <div>
                            {/* Opp ID + Priority Tag */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: BRAND_PURPLE, letterSpacing: '0.02em' }}>
                                {opp.opportunityNumber}
                              </span>
                              {getPriorityBadge(opp.priority)}
                            </div>

                            {/* Opp Name */}
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 13.5,
                                color: '#0F172A',
                                marginTop: 8,
                                lineHeight: 1.4,
                              }}
                            >
                              {opp.name}
                            </div>

                            {/* Customer / Company */}
                            <div
                              style={{
                                fontSize: 12,
                                color: '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginTop: 4,
                              }}
                            >
                              <Building size={13} color="#94A3B8" />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {opp.companyName}
                              </span>
                            </div>
                          </div>

                          {/* Middle Section: Value & Win Probability */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                              marginTop: 12,
                              paddingTop: 10,
                              borderTop: '1px solid #F8FAFC',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                Value
                              </div>
                              <div style={{ fontWeight: 900, color: '#0F172A', fontSize: 14, marginTop: 1 }}>
                                ₹{opp.dealValue.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                Win Prob
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  marginTop: 1,
                                  color: opp.probability >= 80 ? '#10B981' : opp.probability >= 40 ? '#2563EB' : '#F59E0B',
                                }}
                              >
                                {opp.probability}%
                              </div>
                            </div>
                          </div>

                          {/* Dates: Expected Close & Next Follow-up in clear rows */}
                          <div
                            style={{
                              marginTop: 10,
                              padding: '6px 8px',
                              background: '#F9FAFB',
                              borderRadius: 6,
                              fontSize: 11,
                              color: '#64748B',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>Close: <strong style={{ color: '#334155' }}>{opp.expectedClosingDate}</strong></span>
                            <span>Next: <strong style={{ color: '#334155' }}>{opp.nextFollowUp || '-'}</strong></span>
                          </div>

                          {/* Bottom Section: Salesperson & Stage Selector */}
                          <div
                            style={{
                              marginTop: 10,
                              paddingTop: 10,
                              borderTop: '1px solid #F1EDF9',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: 12, color: '#334155', fontWeight: 600, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {opp.assignedSalesperson}
                            </span>
                            <Select
                              size="small"
                              value={opp.stage}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(val) => handleStageTransition(opp.id, val)}
                              style={{ width: 124, fontSize: 11 }}
                              options={PIPELINE_STAGES.map((s) => ({ value: s, label: s }))}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
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
                All Opportunities Table
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
                {filteredOpps.length} records
              </span>
            </div>
          </div>

          <Table<OpportunityItem>
            columns={columns}
            dataSource={filteredOpps}
            rowKey="id"
            pagination={{
              pageSize: 7,
              size: 'small',
              showTotal: (total, range) => (
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  Showing {range[0]}-{range[1]} of {total} opportunities
                </span>
              ),
            }}
            size="middle"
            scroll={{ x: 1400 }}
          />
        </div>
      )}

      {/* 6. Add / Edit Opportunity Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <TrendingUp size={18} color={BRAND_PURPLE} />
            {editingOpp ? `Edit Deal: ${editingOpp.opportunityNumber}` : 'Add New Sales Opportunity'}
          </div>
        }
        open={isAddModalOpen || !!editingOpp}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingOpp(null);
          form.resetFields();
        }}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveOpp}
          initialValues={{
            stage: 'New Opportunity',
            probability: 20,
            priority: 'Medium',
            assignedSalesperson: 'Vikram Seth',
            expectedClosingDate: dayjs().add(20, 'day'),
          }}
          style={{ marginTop: 14 }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Opportunity / Project Name</span>}
            name="name"
            rules={[{ required: true, message: 'Please enter opportunity name' }]}
          >
            <Input placeholder="e.g. 15kW Heavy Inverter Synchronization Package" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Company Name</span>}
                name="companyName"
                rules={[{ required: true, message: 'Company name required' }]}
              >
                <Input placeholder="e.g. Apex Precision Tools Ltd" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Customer Contact Person</span>}
                name="customerName"
                rules={[{ required: true, message: 'Contact name required' }]}
              >
                <Input placeholder="e.g. Ramesh Sundaram" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={14}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Product / Service Scope</span>}
                name="productService"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. Variable Frequency Drives 15kW" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Deal Value (₹)</span>}
                name="dealValue"
                rules={[{ required: true, message: 'Please enter deal value' }]}
              >
                <Input placeholder="450000" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Pipeline Stage</span>}
                name="stage"
                rules={[{ required: true }]}
              >
                <Select options={PIPELINE_STAGES.map((s) => ({ value: s, label: s }))} style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Win Probability (%)</span>}
                name="probability"
                rules={[{ required: true }]}
              >
                <Input placeholder="60" style={{ borderRadius: 6 }} />
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
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Expected Close Date</span>}
                name="expectedClosingDate"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
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

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Related Quotation #</span>}
                name="relatedQuotation"
              >
                <Input placeholder="e.g. QT-2026-104" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Internal Commercial Notes</span>}
                name="notes"
              >
                <Input placeholder="Discount boundaries, delivery expectations..." style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingOpp(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            >
              {editingOpp ? 'Update Deal' : 'Save Opportunity'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 7. Mark Deal WON Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 800 }}>
            <CheckCircle size={18} color="#16A34A" />
            Record Deal Won: {winModalOpp?.opportunityNumber}
          </div>
        }
        open={!!winModalOpp}
        onCancel={() => setWinModalOpp(null)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={winForm} layout="vertical" onFinish={handleWinDeal} style={{ marginTop: 14 }}>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Final Closed Deal Value (₹)</span>}
            name="finalDealValue"
            rules={[{ required: true }]}
          >
            <Input style={{ borderRadius: 6 }} />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Confirmed Quotation #</span>}
                name="confirmedQuotation"
                rules={[{ required: true }]}
              >
                <Input style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Sales Order # Generated</span>}
                name="salesOrderNumber"
                rules={[{ required: true }]}
              >
                <Input style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Closure Date</span>}
            name="closedDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Winning Factor / Client Feedback</span>}
            name="winReason"
          >
            <Input.TextArea rows={2} placeholder="e.g. Technical capability, competitive pricing, warranty terms..." style={{ borderRadius: 6 }} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setWinModalOpp(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#15803D', borderColor: '#15803D', fontWeight: 700 }}
            >
              Confirm Deal Won & Convert to Order
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 8. Mark Deal LOST Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#991B1B', fontWeight: 800 }}>
            <XCircle size={18} color="#DC2626" />
            Record Deal Lost: {lostModalOpp?.opportunityNumber}
          </div>
        }
        open={!!lostModalOpp}
        onCancel={() => setLostModalOpp(null)}
        footer={null}
        width={480}
        destroyOnClose
      >
        <Form form={lostForm} layout="vertical" onFinish={handleLostDeal} style={{ marginTop: 14 }}>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Reason for Lost Deal</span>}
            name="lostReason"
            rules={[{ required: true, message: 'Please specify reason for lost deal' }]}
          >
            <Select
              options={[
                { value: 'Price Sensitivity / Competitor Discount', label: 'Price Sensitivity / Competitor Discount' },
                { value: 'Delivery Lead Time Too Long', label: 'Delivery Lead Time Too Long' },
                { value: 'Technical Specification Mismatch', label: 'Technical Specification Mismatch' },
                { value: 'Budget Postponed / Project Cancelled', label: 'Budget Postponed / Project Cancelled' },
                { value: 'Customer Chose Incumbent Supplier', label: 'Customer Chose Incumbent Supplier' },
              ]}
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Competitor Information (if known)</span>}
            name="competitorInfo"
          >
            <Input placeholder="e.g. SKF Regional Distributor, ABB Industrial" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Lost Date</span>}
            name="lostDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setLostModalOpp(null)}>Cancel</Button>
            <Button type="primary" danger htmlType="submit" style={{ fontWeight: 700 }}>
              Confirm Lost Deal
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 9. Log Activity Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <PhoneCall size={18} color={BRAND_PURPLE} />
            Log Activity: {newActivityOpp?.opportunityNumber}
          </div>
        }
        open={!!newActivityOpp}
        onCancel={() => setNewActivityOpp(null)}
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
                    { value: 'Meeting', label: 'Client Meeting' },
                    { value: 'Email', label: 'Email Follow-up' },
                    { value: 'Discussion', label: 'Commercial Discussion' },
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
            <Input placeholder="e.g. Commercial discount negotiation with plant head" style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Discussion Details</span>}
            name="details"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Summary of what was agreed..." style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Outcome</span>}
            name="outcome"
          >
            <Input placeholder="e.g. PO expected by next Monday" style={{ borderRadius: 6 }} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setNewActivityOpp(null)}>Cancel</Button>
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

      {/* 10. Comprehensive Opportunity Details Drawer */}
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
                {viewOpp?.opportunityNumber}
              </span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                {viewOpp?.name}
              </span>
            </div>
            {viewOpp && getStageBadge(viewOpp.stage)}
          </div>
        }
        open={!!viewOpp}
        onClose={() => setViewOpp(null)}
        width={580}
        destroyOnClose
      >
        {viewOpp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Quick Metrics Bar */}
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
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Deal Value</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
                  ₹{viewOpp.dealValue.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Win Probability</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: BRAND_PURPLE, marginTop: 2 }}>
                  {viewOpp.probability}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Weighted Revenue</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#15803D', marginTop: 2 }}>
                  ₹{Math.round((viewOpp.dealValue * viewOpp.probability) / 100).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                size="small"
                icon={<PhoneCall size={12} />}
                onClick={() => {
                  setNewActivityOpp(viewOpp);
                  activityForm.resetFields();
                }}
                style={{ borderRadius: 6, fontWeight: 600, color: BRAND_PURPLE, borderColor: '#D8B4FE' }}
              >
                Log Activity
              </Button>
              {viewOpp.stage !== 'Won' && (
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircle size={12} />}
                  onClick={() => {
                    setWinModalOpp(viewOpp);
                    winForm.setFieldsValue({
                      finalDealValue: viewOpp.dealValue,
                      confirmedQuotation: viewOpp.relatedQuotation || 'QT-2026-104',
                      salesOrderNumber: `SO-2026-${Math.floor(400 + Math.random() * 100)}`,
                      closedDate: dayjs(),
                    });
                  }}
                  style={{ backgroundColor: '#15803D', borderColor: '#15803D', borderRadius: 6, fontWeight: 700 }}
                >
                  Mark as Won
                </Button>
              )}
              {viewOpp.stage !== 'Lost' && (
                <Button
                  size="small"
                  danger
                  icon={<XCircle size={12} />}
                  onClick={() => {
                    setLostModalOpp(viewOpp);
                    lostForm.setFieldsValue({ lostDate: dayjs() });
                  }}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  Mark as Lost
                </Button>
              )}
            </div>

            {/* 1. Basic Information */}
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
                Basic Deal Information
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
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Company Name:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewOpp.companyName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Customer Contact:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewOpp.customerName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Assigned Salesperson:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewOpp.assignedSalesperson}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Priority:</span>
                  <span>{getPriorityBadge(viewOpp.priority)}</span>
                </div>
                {viewOpp.relatedLeadNumber && (
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Originating Lead:</span>
                    <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{viewOpp.relatedLeadNumber}</span>
                  </div>
                )}
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Created Date:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewOpp.createdDate}</span>
                </div>
              </div>
            </div>

            {/* 2. Sales Progress & Follow-up */}
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
                Sales Progress & Timelines
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
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Current Stage:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewOpp.stage}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Expected Closing Date:</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>{viewOpp.expectedClosingDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Next Follow-up Date:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewOpp.nextFollowUp || '-'}</span>
                </div>
                {viewOpp.closedDate && (
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Closed Date:</span>
                    <span style={{ fontWeight: 700, color: '#166534' }}>{viewOpp.closedDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Commercial Details & Scope */}
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
                Commercial Details & Product Scope
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
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Product Scope: {viewOpp.productService}
                </div>
                {viewOpp.relatedQuotation && (
                  <div style={{ fontSize: 11.5, color: '#475569', marginBottom: 4 }}>
                    Linked Quotation: <strong>{viewOpp.relatedQuotation}</strong>
                  </div>
                )}
                {viewOpp.salesOrderNumber && (
                  <div style={{ fontSize: 11.5, color: '#15803D', fontWeight: 600, marginBottom: 4 }}>
                    Confirmed Sales Order: {viewOpp.salesOrderNumber}
                  </div>
                )}
                {viewOpp.negotiationDetails && (
                  <div style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>
                    Negotiation Notes: {viewOpp.negotiationDetails}
                  </div>
                )}
                {viewOpp.winLossReason && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      background: viewOpp.stage === 'Won' ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${viewOpp.stage === 'Won' ? '#BBF7D0' : '#FECACA'}`,
                      borderRadius: 6,
                      fontSize: 11.5,
                      color: viewOpp.stage === 'Won' ? '#166534' : '#991B1B',
                    }}
                  >
                    <strong>{viewOpp.stage === 'Won' ? 'Win' : 'Loss'} Reason:</strong> {viewOpp.winLossReason}
                    {viewOpp.competitorInfo && <span> (Competitor: {viewOpp.competitorInfo})</span>}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Activity Tracking Timeline */}
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
                Activity Tracking & Communication History
              </div>

              {viewOpp.activities.length === 0 ? (
                <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', padding: 8 }}>
                  No activities recorded yet. Use the "Log Activity" button above to log customer discussions.
                </div>
              ) : (
                <Timeline
                  style={{ marginTop: 8 }}
                  items={viewOpp.activities.map((a) => ({
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

export default CrmPipelinePage;
