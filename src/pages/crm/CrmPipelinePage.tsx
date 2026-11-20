import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Row,
  Col,
  message,
  Tooltip,
  Badge,
  DatePicker,
  Drawer,
  Divider,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  Target,
  Plus,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Building,
  UserCheck,
  Calendar,
  Eye,
  Edit,
  DollarSign,
  FileText,
  UserPlus,
  AlertTriangle,
  Download,
  Settings,
  ChevronDown,
  TrendingUp,
  Flame,
  Award,
  XCircle,
  MoreVertical,
  History,
  RotateCcw,
  Bell,
  GitBranch,
  Layers,
  Sparkles,
} from 'lucide-react';
import { INITIAL_CUSTOMERS, ExtendedCustomer } from '../../mock/customerData';

export type PipelineStage =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export interface DealItem {
  id: string;
  leadNumber: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: string;
  dealValue: number;
  assignedExecutive: string;
  stage: PipelineStage;
  priority: 'High' | 'Medium' | 'Low';
  expectedCloseDate: string;
  daysInStage: number;
  nextFollowUpDate: string;
  notes?: string;
  history: { stage: PipelineStage; date: string; user: string; note?: string }[];
}

const INITIAL_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    leadNumber: 'LD-2026-001',
    companyName: 'Apex Precision Tools Ltd',
    contactName: 'Ramesh Sundaram',
    email: 'ramesh@apexprecision.com',
    phone: '+91 98412 11002',
    source: 'Referral',
    dealValue: 450000,
    assignedExecutive: 'Vikram Seth',
    stage: 'Qualified',
    priority: 'High',
    expectedCloseDate: '2026-11-30',
    daysInStage: 4,
    nextFollowUpDate: '2026-11-20',
    notes: 'Requires 15KW Variable Frequency Drives for machinery overhaul.',
    history: [
      { stage: 'New Lead', date: '2026-11-10', user: 'Vikram Seth', note: 'Lead created from client referral' },
      { stage: 'Contacted', date: '2026-11-12', user: 'Vikram Seth', note: 'Discovery call completed' },
      { stage: 'Qualified', date: '2026-11-14', user: 'Vikram Seth', note: 'Budget & technical match approved' },
    ],
  },
  {
    id: 'deal-2',
    leadNumber: 'LD-2026-002',
    companyName: 'Omni Infra Ventures',
    contactName: 'Priya Narayanan',
    email: 'priya@omniinfra.in',
    phone: '+91 97890 33441',
    source: 'Website',
    dealValue: 1200000,
    assignedExecutive: 'Ananya Sharma',
    stage: 'Proposal Sent',
    priority: 'High',
    expectedCloseDate: '2026-12-05',
    daysInStage: 3,
    nextFollowUpDate: '2026-11-22',
    notes: 'Commercial quotation Q-1049 submitted. Reviewing SLA terms.',
    history: [
      { stage: 'New Lead', date: '2026-11-08', user: 'Ananya Sharma' },
      { stage: 'Contacted', date: '2026-11-11', user: 'Ananya Sharma' },
      { stage: 'Qualified', date: '2026-11-13', user: 'Ananya Sharma' },
      { stage: 'Proposal Sent', date: '2026-11-15', user: 'Ananya Sharma', note: 'Quotation sent' },
    ],
  },
  {
    id: 'deal-3',
    leadNumber: 'LD-2026-003',
    companyName: 'Southern Automation Works',
    contactName: 'Karthik Raja',
    email: 'karthik@southauto.com',
    phone: '+91 94441 55667',
    source: 'Direct Contact',
    dealValue: 850000,
    assignedExecutive: 'Vikram Seth',
    stage: 'Negotiation',
    priority: 'Medium',
    expectedCloseDate: '2026-11-25',
    daysInStage: 6,
    nextFollowUpDate: '2026-11-19',
    notes: 'Negotiating volume discount and 2-year warranty extension.',
    history: [
      { stage: 'New Lead', date: '2026-11-05', user: 'Vikram Seth' },
      { stage: 'Contacted', date: '2026-11-07', user: 'Vikram Seth' },
      { stage: 'Qualified', date: '2026-11-09', user: 'Vikram Seth' },
      { stage: 'Proposal Sent', date: '2026-11-11', user: 'Vikram Seth' },
      { stage: 'Negotiation', date: '2026-11-12', user: 'Vikram Seth', note: 'Pricing revision under review' },
    ],
  },
  {
    id: 'deal-4',
    leadNumber: 'LD-2026-004',
    companyName: 'Bharat Bio Labs',
    contactName: 'Dr. Ashok Kumar',
    email: 'ashok@bharatbio.org',
    phone: '+91 98210 99882',
    source: 'Campaign',
    dealValue: 620000,
    assignedExecutive: 'Ananya Sharma',
    stage: 'New Lead',
    priority: 'Medium',
    expectedCloseDate: '2026-12-15',
    daysInStage: 2,
    nextFollowUpDate: '2026-11-21',
    notes: 'Inbound enquiry from digital healthcare marketing campaign.',
    history: [
      { stage: 'New Lead', date: '2026-11-16', user: 'Ananya Sharma', note: 'Web lead captured' },
    ],
  },
  {
    id: 'deal-5',
    leadNumber: 'LD-2026-005',
    companyName: 'Verma Fabricators & Co',
    contactName: 'Manish Verma',
    email: 'verma@vermafab.com',
    phone: '+91 98455 12099',
    source: 'Advertisement',
    dealValue: 310000,
    assignedExecutive: 'Vikram Seth',
    stage: 'Contacted',
    priority: 'Low',
    expectedCloseDate: '2026-11-12', // Overdue
    daysInStage: 8,
    nextFollowUpDate: '2026-11-15',
    notes: 'Introductory pitch conducted over Zoom. Awaiting specifications.',
    history: [
      { stage: 'New Lead', date: '2026-11-06', user: 'Vikram Seth' },
      { stage: 'Contacted', date: '2026-11-10', user: 'Vikram Seth' },
    ],
  },
  {
    id: 'deal-6',
    leadNumber: 'LD-2026-006',
    companyName: 'Zenith Marine Hydraulics',
    contactName: 'Capt. Arvind Nair',
    email: 'arvind@zenithmarine.com',
    phone: '+91 98840 55110',
    source: 'Exhibition',
    dealValue: 1850000,
    assignedExecutive: 'Vikram Seth',
    stage: 'Won',
    priority: 'High',
    expectedCloseDate: '2026-11-14',
    daysInStage: 1,
    nextFollowUpDate: '2026-11-28',
    notes: 'Order confirmed with advance PO. Delivery scheduled for Q1.',
    history: [
      { stage: 'New Lead', date: '2026-10-25', user: 'Vikram Seth' },
      { stage: 'Proposal Sent', date: '2026-11-02', user: 'Vikram Seth' },
      { stage: 'Negotiation', date: '2026-11-08', user: 'Vikram Seth' },
      { stage: 'Won', date: '2026-11-14', user: 'Vikram Seth', note: 'PO Received' },
    ],
  },
  {
    id: 'deal-7',
    leadNumber: 'LD-2026-007',
    companyName: 'Delta Agro Systems',
    contactName: 'K. Balaji',
    email: 'balaji@deltaagro.in',
    phone: '+91 97900 11223',
    source: 'Social Media',
    dealValue: 420000,
    assignedExecutive: 'Ananya Sharma',
    stage: 'Lost',
    priority: 'Low',
    expectedCloseDate: '2026-11-10',
    daysInStage: 7,
    nextFollowUpDate: '—',
    notes: 'Client opted for a local low-cost reconditioned alternative.',
    history: [
      { stage: 'New Lead', date: '2026-11-01', user: 'Ananya Sharma' },
      { stage: 'Contacted', date: '2026-11-04', user: 'Ananya Sharma' },
      { stage: 'Lost', date: '2026-11-11', user: 'Ananya Sharma', note: 'Budget mismatch' },
    ],
  },
];

const STAGES_CONFIG: { key: PipelineStage; label: string; color: string; badgeBg: string }[] = [
  { key: 'New Lead', label: 'New Lead', color: '#0284C7', badgeBg: '#E0F2FE' },
  { key: 'Contacted', label: 'Contacted', color: '#7C3AED', badgeBg: '#EDE9FE' },
  { key: 'Qualified', label: 'Qualified', color: '#10B981', badgeBg: '#DCFCE7' },
  { key: 'Proposal Sent', label: 'Proposal Sent', color: '#F97316', badgeBg: '#FFEDD5' },
  { key: 'Negotiation', label: 'Negotiation', color: '#4338CA', badgeBg: '#E0E7FF' },
  { key: 'Won', label: 'Won', color: '#059669', badgeBg: '#D1FAE5' },
  { key: 'Lost', label: 'Lost', color: '#EF4444', badgeBg: '#FEE2E2' },
];

export const CrmPipelinePage: React.FC = () => {
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS);
  const [activeTab, setActiveTab] = useState<'board' | 'table'>('board');
  const [showInsights, setShowInsights] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [executiveFilter, setExecutiveFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConvertToCustomerModalOpen, setIsConvertToCustomerModalOpen] = useState(false);
  const [selectedDealForDrawer, setSelectedDealForDrawer] = useState<DealItem | null>(null);
  const [selectedDealForConvert, setSelectedDealForConvert] = useState<DealItem | null>(null);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);

  const [leadForm] = Form.useForm();
  const [convertForm] = Form.useForm();
  const [editDealForm] = Form.useForm();

  // Drag and Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Today Date for Overdue checking
  const todayStr = '2026-11-18';

  // Metrics Calculations (Business Logic)
  const activeDealsList = useMemo(() => deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost'), [deals]);
  const totalPipelineValue = useMemo(() => activeDealsList.reduce((sum, d) => sum + d.dealValue, 0), [activeDealsList]);
  const activeDealsCount = activeDealsList.length;

  const wonDealsList = useMemo(() => deals.filter(d => d.stage === 'Won'), [deals]);
  const wonDealsCount = wonDealsList.length;
  const wonTotalValue = useMemo(() => wonDealsList.reduce((sum, d) => sum + d.dealValue, 0), [wonDealsList]);

  const overdueDealsList = useMemo(() => {
    return activeDealsList.filter(d => d.expectedCloseDate && d.expectedCloseDate < todayStr);
  }, [activeDealsList]);
  const overdueDealsCount = overdueDealsList.length;

  const pipelineConversionRate = deals.length > 0 ? ((wonDealsCount / deals.length) * 100).toFixed(1) : '0.0';
  const avgDealValue = deals.length > 0 ? Math.round(deals.reduce((acc, d) => acc + d.dealValue, 0) / deals.length) : 0;

  // Filtering
  const filteredDeals = useMemo(() => {
    return deals.filter(d => {
      const q = search.toLowerCase();
      const matchesSearch =
        d.companyName.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q) ||
        d.leadNumber.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q);

      const matchesSource = sourceFilter === 'ALL' || d.source === sourceFilter;
      const matchesExec = executiveFilter === 'ALL' || d.assignedExecutive === executiveFilter;
      const matchesStage = stageFilter === 'ALL' || d.stage === stageFilter;
      const matchesPriority = priorityFilter === 'ALL' || d.priority === priorityFilter;

      return matchesSearch && matchesSource && matchesExec && matchesStage && matchesPriority;
    });
  }, [deals, search, sourceFilter, executiveFilter, stageFilter, priorityFilter]);

  // Stage transition
  const handleMoveStage = (dealId: string, newStage: PipelineStage, note?: string) => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === dealId) {
          if (d.stage === newStage) return d;
          const newHistory = [
            ...d.history,
            {
              stage: newStage,
              date: new Date().toISOString().slice(0, 10),
              user: 'Current User',
              note: note || `Moved to ${newStage}`,
            },
          ];
          return {
            ...d,
            stage: newStage,
            daysInStage: 0,
            history: newHistory,
          };
        }
        return d;
      })
    );
    message.success(`Lead moved to ${newStage}`);
    if (selectedDealForDrawer && selectedDealForDrawer.id === dealId) {
      setSelectedDealForDrawer(prev => prev ? { ...prev, stage: newStage, daysInStage: 0 } : null);
    }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      handleMoveStage(dealId, targetStage, 'Drag & Drop Progression');
    }
    setDraggedDealId(null);
  };

  // Convert to Customer
  const handleOpenConvertModal = (deal: DealItem) => {
    setSelectedDealForConvert(deal);
    convertForm.setFieldsValue({
      companyName: deal.companyName,
      contactPerson: deal.contactName,
      email: deal.email,
      phone: deal.phone,
      source: deal.source,
      assignedEmployee: deal.assignedExecutive,
      category: 'Enterprise',
      creditLimit: 500000,
    });
    setIsConvertToCustomerModalOpen(true);
  };

  const handleConfirmConvert = (values: any) => {
    if (!selectedDealForConvert) return;

    const isDup = INITIAL_CUSTOMERS.some(
      c => c.email.toLowerCase() === values.email.toLowerCase() || c.phone === values.phone
    );

    if (isDup) {
      message.warning('A customer account with this email/phone already exists in Customer Directory.');
    } else {
      const newCust: ExtendedCustomer = {
        id: `cust-${Date.now()}`,
        code: `CUST-00${INITIAL_CUSTOMERS.length + 1}`,
        name: values.companyName,
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        gstNumber: values.gstNumber || 'N/A',
        type: 'Business',
        category: values.category || 'Enterprise',
        address: values.address || '',
        city: values.city || 'Chennai',
        state: values.state || 'Tamil Nadu',
        country: 'India',
        pincode: values.pincode || '',
        source: values.source || 'Direct',
        assignedEmployee: values.assignedEmployee || 'Vikram Seth',
        creditLimit: Number(values.creditLimit) || 500000,
        currentBalance: 0,
        status: 'Active',
        notes: `Converted from Opportunity ${selectedDealForConvert.leadNumber}.`,
        totalOrdersValue: 0,
        totalServiceTickets: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      INITIAL_CUSTOMERS.unshift(newCust);
    }

    handleMoveStage(selectedDealForConvert.id, 'Won', 'Converted to Customer');
    setIsConvertToCustomerModalOpen(false);
    message.success(`${selectedDealForConvert.companyName} converted to official Customer Account!`);
  };

  // Add Opportunity
  const handleAddDealSubmit = (values: any) => {
    const newDeal: DealItem = {
      id: `deal-${Date.now()}`,
      leadNumber: `LD-2026-00${deals.length + 1}`,
      companyName: values.companyName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      source: values.source || 'Website',
      dealValue: Number(values.dealValue) || 100000,
      assignedExecutive: values.assignedExecutive || 'Vikram Seth',
      stage: values.stage || 'New Lead',
      priority: values.priority || 'Medium',
      expectedCloseDate: values.expectedCloseDate ? values.expectedCloseDate.format('YYYY-MM-DD') : '2026-12-15',
      daysInStage: 0,
      nextFollowUpDate: values.nextFollowUpDate ? values.nextFollowUpDate.format('YYYY-MM-DD') : '2026-11-25',
      notes: values.notes,
      history: [
        {
          stage: values.stage || 'New Lead',
          date: new Date().toISOString().slice(0, 10),
          user: values.assignedExecutive || 'Vikram Seth',
          note: 'Opportunity registered in pipeline',
        },
      ],
    };

    setDeals([newDeal, ...deals]);
    message.success('New opportunity added to pipeline!');
    setIsAddLeadModalOpen(false);
    leadForm.resetFields();
  };

  // Edit Opportunity
  const handleEditDealSubmit = (values: any) => {
    if (!editingDeal) return;
    setDeals(prev =>
      prev.map(d => {
        if (d.id === editingDeal.id) {
          return {
            ...d,
            companyName: values.companyName,
            contactName: values.contactName,
            email: values.email,
            phone: values.phone,
            dealValue: Number(values.dealValue),
            assignedExecutive: values.assignedExecutive,
            priority: values.priority,
            notes: values.notes,
          };
        }
        return d;
      })
    );
    message.success('Opportunity details updated!');
    setEditingDeal(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Lead ID,Company,Contact,Deal Value,Stage,Executive,Priority,Expected Close Date']
        .concat(
          filteredDeals.map(
            d =>
              `"${d.leadNumber}","${d.companyName}","${d.contactName}",${d.dealValue},"${d.stage}","${d.assignedExecutive}","${d.priority}","${d.expectedCloseDate}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crm_pipeline_export_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Pipeline CSV exported successfully!');
  };

  // Priority badge styling
  const renderPriorityBadge = (p: 'High' | 'Medium' | 'Low') => {
    if (p === 'High') {
      return (
        <span
          style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Flame size={11} /> High
        </span>
      );
    }
    if (p === 'Medium') {
      return (
        <span
          style={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 12,
          }}
        >
          Medium
        </span>
      );
    }
    return (
      <span
        style={{
          backgroundColor: '#F3F4F6',
          color: '#4B5563',
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 12,
        }}
      >
        Low
      </span>
    );
  };

  // KPI Cards matching CRM Executive Dashboard style
  const pipelineKpiCards = [
    {
      title: 'Total Pipeline Value',
      value: `₹${(totalPipelineValue / 100000).toFixed(2)}L`,
      growth: '+14.2%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <DollarSign size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Active Deals',
      value: activeDealsCount.toString(),
      growth: '+2',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Target size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Won Deals',
      value: wonDealsCount.toString(),
      growth: `${pipelineConversionRate}%`,
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Award size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
    {
      title: 'Overdue Deals',
      value: overdueDealsCount.toString(),
      growth: overdueDealsCount > 0 ? 'Action Req' : '0',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: overdueDealsCount > 0 ? '#DC2626' : '#111827',
      growthColor: overdueDealsCount > 0 ? '#DC2626' : '#10B981',
      icon: <AlertTriangle size={18} color="#FFFFFF" />,
      iconBg: overdueDealsCount > 0 ? '#DC2626' : '#10B981',
      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)',
    },
  ];

  // Table Columns
  const tableColumns = [
    {
      title: 'Lead ID',
      dataIndex: 'leadNumber',
      key: 'leadNumber',
      width: 140,
      render: (t: string, r: DealItem) => (
        <span
          onClick={() => setSelectedDealForDrawer(r)}
          style={{
            fontWeight: 800,
            color: '#5421A8',
            cursor: 'pointer',
            fontSize: 13,
            whiteSpace: 'nowrap',
            display: 'inline-block',
          }}
        >
          {t}
        </span>
      ),
    },
    {
      title: 'Company & Contact',
      key: 'company',
      render: (_: any, r: DealItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            onClick={() => setSelectedDealForDrawer(r)}
            style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 13.5, cursor: 'pointer' }}
          >
            {r.companyName}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>👤 {r.contactName}</span>
            <span style={{ color: '#D1D5DB' }}>&bull;</span>
            <span style={{ color: '#9CA3AF' }}>{r.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Deal Value',
      dataIndex: 'dealValue',
      key: 'dealValue',
      width: 140,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 14, whiteSpace: 'nowrap' }}>
          ₹{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 160,
      render: (stg: PipelineStage, r: DealItem) => (
        <Select
          value={stg}
          size="small"
          style={{ width: 145 }}
          onChange={val => handleMoveStage(r.id, val)}
          options={STAGES_CONFIG.map(s => ({ label: s.label, value: s.key }))}
        />
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      align: 'center' as const,
      render: (p: 'High' | 'Medium' | 'Low') => renderPriorityBadge(p),
    },
    {
      title: 'Executive',
      dataIndex: 'assignedExecutive',
      key: 'assignedExecutive',
      width: 150,
      render: (o: string) => (
        <span
          style={{
            backgroundColor: '#F3EEFF',
            color: '#7544D6',
            fontWeight: 700,
            fontSize: 11.5,
            padding: '3px 10px',
            borderRadius: 14,
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          {o}
        </span>
      ),
    },
    {
      title: 'Expected Close',
      dataIndex: 'expectedCloseDate',
      key: 'expectedCloseDate',
      width: 140,
      render: (d: string) => {
        const isOverdue = d && d < todayStr;
        return (
          <span
            style={{
              color: isOverdue ? '#DC2626' : '#4B5563',
              fontWeight: isOverdue ? 800 : 600,
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {d} {isOverdue && '(Overdue)'}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'right' as const,
      render: (_: any, r: DealItem) => (
        <Space size="small">
          <Button
            size="small"
            icon={<Eye size={13} color="#7544D6" />}
            onClick={() => setSelectedDealForDrawer(r)}
            style={{ borderRadius: 6, borderColor: '#ECE8F6' }}
          />
          {r.stage !== 'Won' && (
            <Button
              size="small"
              type="primary"
              style={{
                background: '#10B981',
                borderColor: '#10B981',
                fontSize: 11.5,
                fontWeight: 700,
                borderRadius: 6,
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              }}
              icon={<Award size={12} />}
              onClick={() => handleOpenConvertModal(r)}
            >
              Won
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        minHeight: '100%',
        paddingBottom: 24,
      }}
    >
      {/* 1. Top Header Row - Exact CRM Dashboard Style (Single Line) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 20,
          padding: '12px 20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
          borderRadius: 18,
          border: '1px solid #EAE4F5',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          backdropFilter: 'blur(8px)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 auto' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(84, 33, 168, 0.25)',
              flexShrink: 0,
            }}
          >
            <GitBranch size={18} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#211044',
                margin: 0,
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              CRM Pipeline & Lead Progression
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '2px 0 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Track opportunities, monitor deal progress, and manage your sales pipeline from initial lead to successful conversion.
            </p>
          </div>
        </div>

        {/* Right Search, Notification, User Pill, and Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Input
            prefix={<Search size={14} color="#7544D6" style={{ marginRight: 4 }} />}
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 170,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              borderColor: '#ECE8F6',
              padding: '5px 12px',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.04)',
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <Button
            icon={<Download size={13} />}
            onClick={handleExportCSV}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 11.5,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 32,
              padding: '0 10px',
            }}
          >
            Export
          </Button>

          <Button
            icon={<Settings size={13} />}
            onClick={() => setIsSettingsModalOpen(true)}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 11.5,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 32,
              padding: '0 10px',
            }}
          >
            Settings
          </Button>

          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={() => {
              leadForm.resetFields();
              leadForm.setFieldsValue({
                stage: 'New Lead',
                source: 'Website',
                priority: 'Medium',
                assignedExecutive: 'Vikram Seth',
                dealValue: 350000,
              });
              setIsAddLeadModalOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              border: 'none',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 11.5,
              boxShadow: '0 3px 10px rgba(84, 33, 168, 0.25)',
              padding: '0 12px',
              height: 32,
            }}
          >
            Add Lead
          </Button>

          {/* Notification Bell */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Bell size={15} color="#5421A8" />
            <span
              style={{
                position: 'absolute',
                top: -1,
                right: -1,
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: 8.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              3
            </span>
          </div>

          {/* User Profile Capsule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 8px 2px 3px',
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3A1078 0%, #5421A8 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              JD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#211044', lineHeight: 1.1 }}>
                Janani D
              </span>
              <span style={{ fontSize: 8.5, color: '#7544D6', fontWeight: 600 }}>
                VP of Sales
              </span>
            </div>
            <ChevronDown size={11} color="#7544D6" />
          </div>
        </div>
      </div>

      {/* 2. Top 4 Compact Premium KPI Cards (Exact Matching Colors from CRM Dashboard) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          width: '100%',
        }}
      >
        {pipelineKpiCards.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: kpi.cardBg,
              borderRadius: 16,
              padding: '16px 18px',
              border: kpi.isDark ? 'none' : '1px solid #ECE8F6',
              boxShadow: kpi.boxShadow,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {/* Top row: Icon */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: kpi.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: kpi.isDark ? '0 4px 10px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                {kpi.icon}
              </div>
            </div>

            {/* Title & Value */}
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 13,
                  color: kpi.titleColor,
                  fontWeight: 600,
                  letterSpacing: '0.1px',
                }}
              >
                {kpi.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: kpi.valueColor,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                  }}
                >
                  {kpi.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: kpi.growthColor,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ↑ {kpi.growth}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Bar & View Toggle */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: '14px 20px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Select
            value={sourceFilter}
            onChange={setSourceFilter}
            style={{ width: 140 }}
            options={[
              { value: 'ALL', label: 'All Sources' },
              { value: 'Website', label: 'Website' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Campaign', label: 'Campaign' },
              { value: 'Advertisement', label: 'Advertisement' },
              { value: 'Direct Contact', label: 'Direct Contact' },
              { value: 'Exhibition', label: 'Exhibition' },
            ]}
          />

          <Select
            value={executiveFilter}
            onChange={setExecutiveFilter}
            style={{ width: 150 }}
            options={[
              { value: 'ALL', label: 'All Executives' },
              { value: 'Vikram Seth', label: 'Vikram Seth' },
              { value: 'Ananya Sharma', label: 'Ananya Sharma' },
            ]}
          />

          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            style={{ width: 130 }}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          {(sourceFilter !== 'ALL' || executiveFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <Button
              type="text"
              onClick={() => {
                setSourceFilter('ALL');
                setExecutiveFilter('ALL');
                setPriorityFilter('ALL');
              }}
              style={{ color: '#EF4444', fontWeight: 600, fontSize: 12 }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* View Switcher: Board vs Table */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F3EEFF',
            padding: 3,
            borderRadius: 8,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            style={{
              border: 'none',
              backgroundColor: activeTab === 'board' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'board' ? '#5421A8' : '#6B7280',
              fontWeight: 700,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: activeTab === 'board' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Kanban Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            style={{
              border: 'none',
              backgroundColor: activeTab === 'table' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'table' ? '#5421A8' : '#6B7280',
              fontWeight: 700,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: activeTab === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            List View
          </button>
        </div>
      </div>

      {/* 4. KANBAN BOARD VIEW (Drag & Drop Progression) */}
      {activeTab === 'board' ? (
        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 16,
            alignItems: 'flex-start',
            minHeight: '62vh',
          }}
        >
          {STAGES_CONFIG.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage.key);
            const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

            return (
              <div
                key={stage.key}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, stage.key)}
                style={{
                  flex: '0 0 290px',
                  backgroundColor: '#FAF9FE',
                  borderRadius: 16,
                  border: '1px solid #ECE8F6',
                  boxShadow: '0 4px 14px rgba(84, 33, 168, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '75vh',
                }}
              >
                {/* Stage Header */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottom: '1px solid #ECE8F6',
                    borderTop: `3px solid ${stage.color}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#211044', fontSize: 13 }}>
                      {stage.label}
                    </span>
                    <span
                      style={{
                        backgroundColor: stage.badgeBg,
                        color: stage.color,
                        padding: '1px 8px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {stageDeals.length}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 4, fontWeight: 600 }}>
                    ₹{(stageTotalValue / 100000).toFixed(1)} Lakhs
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div
                  style={{
                    padding: 10,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {stageDeals.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#9CA3AF',
                        padding: '36px 12px',
                        fontSize: 12,
                        fontStyle: 'italic',
                      }}
                    >
                      No deals in this stage
                    </div>
                  ) : (
                    stageDeals.map(deal => {
                      const isOverdue =
                        deal.stage !== 'Won' &&
                        deal.stage !== 'Lost' &&
                        deal.expectedCloseDate &&
                        deal.expectedCloseDate < todayStr;

                      const dealActionItems: MenuProps['items'] = [
                        {
                          key: 'view',
                          label: 'View Details',
                          icon: <Eye size={13} />,
                          onClick: () => setSelectedDealForDrawer(deal),
                        },
                        {
                          key: 'edit',
                          label: 'Edit Lead',
                          icon: <Edit size={13} />,
                          onClick: () => {
                            setEditingDeal(deal);
                            editDealForm.setFieldsValue(deal);
                          },
                        },
                        {
                          type: 'divider',
                        },
                        {
                          key: 'won',
                          label: 'Mark as Won',
                          icon: <Award size={13} color="#059669" />,
                          disabled: deal.stage === 'Won',
                          onClick: () => handleOpenConvertModal(deal),
                        },
                        {
                          key: 'lost',
                          label: 'Mark as Lost',
                          icon: <XCircle size={13} color="#EF4444" />,
                          disabled: deal.stage === 'Lost',
                          onClick: () => handleMoveStage(deal.id, 'Lost', 'Marked as Lost'),
                        },
                        ...(deal.stage === 'Won' || deal.stage === 'Lost'
                          ? [
                              {
                                key: 'reopen',
                                label: 'Reopen Lead',
                                icon: <RotateCcw size={13} color="#7544D6" />,
                                onClick: () => handleMoveStage(deal.id, 'Negotiation', 'Reopened by Admin'),
                              },
                            ]
                          : []),
                      ];

                      return (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={e => handleDragStart(e, deal.id)}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 14,
                            padding: '12px 14px',
                            border: isOverdue ? '1px solid #FECACA' : '1px solid #ECE8F6',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                            cursor: 'grab',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 6px 14px rgba(84, 33, 168, 0.08)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {/* Card Top: ID & Priority */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              onClick={() => setSelectedDealForDrawer(deal)}
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#5421A8',
                                cursor: 'pointer',
                              }}
                            >
                              {deal.leadNumber}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {renderPriorityBadge(deal.priority)}
                              <Dropdown menu={{ items: dealActionItems }} trigger={['click']}>
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<MoreVertical size={13} color="#9CA3AF" />}
                                  style={{ padding: 0, width: 20, height: 20 }}
                                />
                              </Dropdown>
                            </div>
                          </div>

                          {/* Company Name & Contact Person */}
                          <div>
                            <div
                              onClick={() => setSelectedDealForDrawer(deal)}
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: '#1E1B4B',
                                cursor: 'pointer',
                              }}
                            >
                              {deal.companyName}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                              👤 {deal.contactName} &bull; {deal.source}
                            </div>
                          </div>

                          {/* Deal Value */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              paddingTop: 6,
                              borderTop: '1px dashed #F3F4F6',
                            }}
                          >
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                              ₹{deal.dealValue.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                              {deal.daysInStage}d in stage
                            </span>
                          </div>

                          {/* Executive & Close Date */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: 11,
                              color: '#6B7280',
                            }}
                          >
                            <span>{deal.assignedExecutive}</span>
                            <span
                              style={{
                                color: isOverdue ? '#DC2626' : '#6B7280',
                                fontWeight: isOverdue ? 700 : 500,
                              }}
                            >
                              {isOverdue ? `Overdue (${deal.expectedCloseDate})` : `Exp: ${deal.expectedCloseDate}`}
                            </span>
                          </div>

                          {/* Next Follow-up Pill */}
                          {deal.nextFollowUpDate && deal.nextFollowUpDate !== '—' && (
                            <div
                              style={{
                                backgroundColor: '#FAF5FF',
                                borderRadius: 6,
                                padding: '3px 8px',
                                fontSize: 10.5,
                                color: '#7544D6',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Clock size={11} /> Next: {deal.nextFollowUpDate}
                            </div>
                          )}

                          {/* Bottom Stage Selector Dropdown */}
                          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                            <Select
                              value={deal.stage}
                              size="small"
                              style={{ flex: 1, fontSize: 11 }}
                              onChange={newStg => handleMoveStage(deal.id, newStg)}
                              options={STAGES_CONFIG.map(s => ({ label: s.label, value: s.key }))}
                            />
                            {deal.stage !== 'Won' && (
                              <Tooltip title="Convert to Customer Directory (Won)">
                                <Button
                                  size="small"
                                  type="primary"
                                  style={{ background: '#10B981', borderColor: '#10B981', padding: '0 6px' }}
                                  icon={<Award size={12} />}
                                  onClick={() => handleOpenConvertModal(deal)}
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View - Enterprise Table Styling */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '20px 24px',
            border: '1px solid #ECE8F6',
            boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          }}
        >
          <Table
            dataSource={filteredDeals}
            columns={tableColumns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1050 }}
            className="enterprise-crm-table"
          />
        </div>
      )}

      {/* 5. DEAL DETAILS DRAWER */}
      <Drawer
        open={!!selectedDealForDrawer}
        onClose={() => setSelectedDealForDrawer(null)}
        width={480}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#5421A8', fontWeight: 800 }}>
              {selectedDealForDrawer?.leadNumber}
            </span>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Opportunity Details</span>
          </div>
        }
      >
        {selectedDealForDrawer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header Box */}
            <div
              style={{
                backgroundColor: '#FAF7FD',
                borderRadius: 12,
                padding: 16,
                border: '1px solid #ECE8F6',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
                {selectedDealForDrawer.companyName}
              </h2>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                Contact: {selectedDealForDrawer.contactName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#10B981' }}>
                  ₹{selectedDealForDrawer.dealValue.toLocaleString()}
                </span>
                {renderPriorityBadge(selectedDealForDrawer.priority)}
                <Tag color="purple">{selectedDealForDrawer.stage}</Tag>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#211044', marginBottom: 8 }}>
                Contact Information
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
                <div>📞 Phone: <strong>{selectedDealForDrawer.phone}</strong></div>
                <div>✉️ Email: <strong>{selectedDealForDrawer.email}</strong></div>
                <div>🌐 Acquisition Source: <strong>{selectedDealForDrawer.source}</strong></div>
                <div>👤 Account Executive: <strong>{selectedDealForDrawer.assignedExecutive}</strong></div>
                <div>📅 Expected Closing Date: <strong>{selectedDealForDrawer.expectedCloseDate}</strong></div>
              </div>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            {/* Notes */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#211044', marginBottom: 6 }}>
                Opportunity Notes
              </h4>
              <div style={{ backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, fontSize: 12, color: '#4B5563' }}>
                {selectedDealForDrawer.notes || 'No notes logged for this opportunity.'}
              </div>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            {/* Progression History */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#211044', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <History size={15} color="#5421A8" /> Stage Progression History
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedDealForDrawer.history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #ECE8F6',
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span style={{ color: '#5421A8' }}>{h.stage}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 11 }}>{h.date}</span>
                    </div>
                    {h.note && <div style={{ color: '#6B7280', marginTop: 3 }}>{h.note}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {selectedDealForDrawer.stage !== 'Won' && (
                <Button
                  type="primary"
                  icon={<Award size={14} />}
                  style={{ background: '#10B981', borderColor: '#10B981', flex: 1, fontWeight: 700 }}
                  onClick={() => {
                    handleOpenConvertModal(selectedDealForDrawer);
                    setSelectedDealForDrawer(null);
                  }}
                >
                  Mark as Won & Convert
                </Button>
              )}
              {selectedDealForDrawer.stage !== 'Lost' && (
                <Button
                  danger
                  icon={<XCircle size={14} />}
                  style={{ flex: 1, fontWeight: 600 }}
                  onClick={() => {
                    handleMoveStage(selectedDealForDrawer.id, 'Lost', 'Marked as Lost from Details');
                    setSelectedDealForDrawer(null);
                  }}
                >
                  Mark as Lost
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW LEAD / OPPORTUNITY                         */}
      {/* ========================================================= */}
      <Modal
        open={isAddLeadModalOpen}
        onCancel={() => setIsAddLeadModalOpen(false)}
        title="Add New Opportunity to Pipeline"
        footer={null}
        destroyOnClose
      >
        <Form form={leadForm} layout="vertical" onFinish={handleAddDealSubmit} style={{ marginTop: 14 }}>
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="e.g. Apex Precision Tools Ltd" />
          </Form.Item>
          <Form.Item
            name="contactName"
            label="Contact Person"
            rules={[{ required: true, message: 'Please enter contact person' }]}
          >
            <Input placeholder="e.g. Ramesh Sundaram" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="contact@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98412 11002" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dealValue" label="Estimated Deal Value (₹)" rules={[{ required: true }]}>
                <Input type="number" placeholder="500000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stage" label="Initial Pipeline Stage" initialValue="New Lead">
                <Select options={STAGES_CONFIG.map(s => ({ label: s.label, value: s.key }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priority" label="Priority" initialValue="Medium">
                <Select
                  options={[
                    { label: 'High Priority', value: 'High' },
                    { label: 'Medium Priority', value: 'Medium' },
                    { label: 'Low Priority', value: 'Low' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="source" label="Acquisition Source" initialValue="Website">
                <Select
                  options={[
                    { label: 'Website', value: 'Website' },
                    { label: 'Referral', value: 'Referral' },
                    { label: 'Campaign', value: 'Campaign' },
                    { label: 'Advertisement', value: 'Advertisement' },
                    { label: 'Direct Contact', value: 'Direct Contact' },
                    { label: 'Exhibition', value: 'Exhibition' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignedExecutive" label="Assigned Executive" initialValue="Vikram Seth">
                <Select
                  options={[
                    { label: 'Vikram Seth', value: 'Vikram Seth' },
                    { label: 'Ananya Sharma', value: 'Ananya Sharma' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expectedCloseDate" label="Expected Close Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Deal Notes / Specification">
            <Input.TextArea rows={2} placeholder="Client requirements, targets..." />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddLeadModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#5421A8', borderColor: '#5421A8', fontWeight: 600 }}
            >
              Create Opportunity
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL: EDIT LEAD                                          */}
      {/* ========================================================= */}
      <Modal
        open={!!editingDeal}
        onCancel={() => setEditingDeal(null)}
        title="Edit Opportunity Details"
        footer={null}
        destroyOnClose
      >
        <Form form={editDealForm} layout="vertical" onFinish={handleEditDealSubmit} style={{ marginTop: 14 }}>
          <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactName" label="Contact Person" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dealValue" label="Deal Value (₹)" rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority">
                <Select
                  options={[
                    { label: 'High Priority', value: 'High' },
                    { label: 'Medium Priority', value: 'Medium' },
                    { label: 'Low Priority', value: 'Low' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="assignedExecutive" label="Account Executive">
            <Select
              options={[
                { label: 'Vikram Seth', value: 'Vikram Seth' },
                { label: 'Ananya Sharma', value: 'Ananya Sharma' },
              ]}
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setEditingDeal(null)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL: CONVERT OPPORTUNITY TO CUSTOMER ACCOUNT            */}
      {/* ========================================================= */}
      <Modal
        open={isConvertToCustomerModalOpen}
        onCancel={() => setIsConvertToCustomerModalOpen(false)}
        title="Convert Opportunity to Official Customer Account"
        footer={null}
        destroyOnClose
      >
        <Form form={convertForm} layout="vertical" onFinish={handleConfirmConvert} style={{ marginTop: 14 }}>
          <p style={{ color: '#4B5563', fontSize: 13, marginBottom: 14 }}>
            Converting this opportunity automatically marks the pipeline deal as <strong>Won</strong> and establishes a customer record in the Customer Directory.
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gstNumber" label="GSTIN / Tax ID">
                <Input placeholder="33AABCT9988M1Z0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="creditLimit" label="Approved Credit Limit (₹)" initialValue={500000}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsConvertToCustomerModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#10B981', borderColor: '#10B981', fontWeight: 700 }}
            >
              Confirm Won & Convert
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL: PIPELINE SETTINGS                                  */}
      {/* ========================================================= */}
      <Modal
        open={isSettingsModalOpen}
        onCancel={() => setIsSettingsModalOpen(false)}
        title="Pipeline Stage Settings & Configuration"
        onOk={() => setIsSettingsModalOpen(false)}
      >
        <p style={{ color: '#6B7280', fontSize: 13 }}>
          Configure stages, stage order, and progression requirements for this tenant:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {STAGES_CONFIG.map((s, idx) => (
            <div
              key={s.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: '#FAF9FE',
                border: '1px solid #ECE8F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>0{idx + 1}</span>
                <span style={{ fontWeight: 600, color: '#211044' }}>{s.label}</span>
              </div>
              <Tag color={s.key === 'Won' ? 'green' : s.key === 'Lost' ? 'red' : 'purple'}>
                {s.key === 'Won' || s.key === 'Lost' ? 'Terminal' : 'Active'}
              </Tag>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
