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
  DatePicker,
  TimePicker,
  Timeline,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Clock,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Users,
  MessageSquare,
  Building,
  Check,
  Bell,
  ArrowRight,
  RefreshCw,
  PhoneCall,
  CalendarCheck,
  Video,
  FileText,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';
import dayjs from 'dayjs';

// Enterprise Purple Palette
const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#6E39CB';
const BRAND_PURPLE_TINT = '#F5EEFD';

export type FollowUpType = 'Phone Call' | 'Email' | 'WhatsApp' | 'Meeting';
export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue' | 'Rescheduled';
export type FollowUpPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type FollowUpOutcome =
  | 'Interested'
  | 'Not Interested'
  | 'Callback Required'
  | 'Meeting Scheduled'
  | 'Quotation Requested'
  | 'No Response'
  | 'Successfully Completed';

export interface FollowUpItem {
  id: string;
  followUpNumber: string;
  contactPerson: string;
  companyName: string;
  relatedOpportunity: string; // Linked opportunity ID or 'General Lead'
  followUpType: FollowUpType;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm or h:mm A
  assignedEmployee: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  outcome?: FollowUpOutcome;
  discussionNotes?: string;
  nextFollowUpDate?: string;
  reminderSetting?: string;
  // Specific Communication metadata
  callDuration?: string;
  whatsappStatus?: string;
  emailSubject?: string;
  meetingLocationOrLink?: string;
  meetingParticipants?: string;
  history: Array<{
    id: string;
    timestamp: string;
    action: string;
    note: string;
    performedBy: string;
  }>;
}

const EMPLOYEES = [
  'Vikram Seth',
  'Ananya Sharma',
  'Murugan Selvam',
  'Rajesh Kannan',
  'Pooja Hegde',
];

const OPPORTUNITIES_LIST = [
  { value: 'General Lead', label: 'General Lead (Unlinked)' },
  { value: 'OPP-2026-081', label: 'OPP-2026-081 - Assembly Line 15kW VFD Overhaul' },
  { value: 'OPP-2026-082', label: 'OPP-2026-082 - Warehouse Automated Stacker Actuators' },
  { value: 'OPP-2026-083', label: 'OPP-2026-083 - Factory Packaging Line PLC Retrofit' },
  { value: 'OPP-2026-084', label: 'OPP-2026-084 - Cleanroom Environmental HVAC System' },
  { value: 'OPP-2026-085', label: 'OPP-2026-085 - IE3 Energy Efficient Motor Upgrades' },
];

const INITIAL_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: 'flw-1',
    followUpNumber: 'FLW-2026-041',
    contactPerson: 'Ramesh Sundaram',
    companyName: 'Apex Precision Tools Ltd',
    relatedOpportunity: 'OPP-2026-081',
    followUpType: 'Phone Call',
    scheduledDate: '2026-11-20',
    scheduledTime: '11:30 AM',
    assignedEmployee: 'Vikram Seth',
    priority: 'High',
    status: 'Pending',
    discussionNotes: 'Clarify 30-day payment milestone terms and final warranty coverage on 15kW inverters.',
    reminderSetting: '15 mins before',
    callDuration: 'Scheduled 15 mins',
    history: [
      {
        id: 'h-1',
        timestamp: '2026-11-18 04:00 PM',
        action: 'Follow-up Scheduled',
        note: 'Scheduled post quotation review meeting.',
        performedBy: 'Vikram Seth',
      },
    ],
  },
  {
    id: 'flw-2',
    followUpNumber: 'FLW-2026-042',
    contactPerson: 'Priya Narayanan',
    companyName: 'Omni Infra Ventures',
    relatedOpportunity: 'OPP-2026-082',
    followUpType: 'WhatsApp',
    scheduledDate: '2026-11-20',
    scheduledTime: '02:30 PM',
    assignedEmployee: 'Ananya Sharma',
    priority: 'Urgent',
    status: 'Pending',
    discussionNotes: 'Send CAD drawing confirmation and hydraulic cylinder flange mounting specifications via WhatsApp catalog.',
    reminderSetting: '1 hour before',
    whatsappStatus: 'Awaiting Customer Response',
    history: [
      {
        id: 'h-2',
        timestamp: '2026-11-19 10:00 AM',
        action: 'Specs Shared',
        note: 'Shared PDF data sheet; customer reviewing flange layout.',
        performedBy: 'Ananya Sharma',
      },
    ],
  },
  {
    id: 'flw-3',
    followUpNumber: 'FLW-2026-043',
    contactPerson: 'Karthik Raja',
    companyName: 'Southern Automation Works',
    relatedOpportunity: 'OPP-2026-083',
    followUpType: 'Meeting',
    scheduledDate: '2026-11-24',
    scheduledTime: '10:00 AM',
    assignedEmployee: 'Vikram Seth',
    priority: 'Medium',
    status: 'Pending',
    discussionNotes: 'Demonstration of Modbus IO modules and PLC synchronization at customer factory premises.',
    meetingLocationOrLink: 'Peelamedu Industrial Estate Plant #4, Coimbatore',
    meetingParticipants: 'Karthik Raja (Works Head), Plant Electrician, Vikram Seth',
    reminderSetting: '1 day before',
    history: [
      {
        id: 'h-3',
        timestamp: '2026-11-16 02:30 PM',
        action: 'Meeting Confirmed',
        note: 'Customer confirmed site access pass for tech demo.',
        performedBy: 'Vikram Seth',
      },
    ],
  },
  {
    id: 'flw-4',
    followUpNumber: 'FLW-2026-044',
    contactPerson: 'Dr. Ashok Kumar',
    companyName: 'Bharat Bio Labs',
    relatedOpportunity: 'OPP-2026-084',
    followUpType: 'Email',
    scheduledDate: '2026-11-23',
    scheduledTime: '04:00 PM',
    assignedEmployee: 'Ananya Sharma',
    priority: 'Medium',
    status: 'Pending',
    emailSubject: 'Proposal Submission: Cleanroom HVAC Temperature & Humidity Regulators',
    discussionNotes: 'Email cleanroom environmental control datasheets and ISO calibration certificates.',
    reminderSetting: '1 hour before',
    history: [
      {
        id: 'h-4',
        timestamp: '2026-11-19 05:00 PM',
        action: 'Email Prepared',
        note: 'Drafted proposal with compliance certificates.',
        performedBy: 'Ananya Sharma',
      },
    ],
  },
  {
    id: 'flw-5',
    followUpNumber: 'FLW-2026-045',
    contactPerson: 'Suresh Menon',
    companyName: 'Coimbatore Foundry Cluster',
    relatedOpportunity: 'OPP-2026-085',
    followUpType: 'Phone Call',
    scheduledDate: '2026-11-18',
    scheduledTime: '11:00 AM',
    assignedEmployee: 'Rajesh Kannan',
    priority: 'High',
    status: 'Completed',
    outcome: 'Successfully Completed',
    discussionNotes: 'Customer finalized order. Purchase order generated for 6 units of 22kW induction motors.',
    nextFollowUpDate: '2026-12-01',
    callDuration: '18 minutes',
    history: [
      {
        id: 'h-5',
        timestamp: '2026-11-18 11:30 AM',
        action: 'Call Completed',
        note: 'Customer approved proforma invoice without deductions.',
        performedBy: 'Rajesh Kannan',
      },
    ],
  },
  {
    id: 'flw-6',
    followUpNumber: 'FLW-2026-046',
    contactPerson: 'Manish Verma',
    companyName: 'Verma Fabricators & Co',
    relatedOpportunity: 'General Lead',
    followUpType: 'Phone Call',
    scheduledDate: '2026-11-10',
    scheduledTime: '03:00 PM',
    assignedEmployee: 'Murugan Selvam',
    priority: 'Low',
    status: 'Overdue',
    discussionNotes: 'Inquire regarding replacement CNC spindle bearings requirement for Q4 budget.',
    outcome: 'No Response',
    callDuration: 'Ringing - No Answer',
    history: [
      {
        id: 'h-6',
        timestamp: '2026-11-10 03:05 PM',
        action: 'Unanswered Call',
        note: 'Call went to voicemail. Sent follow-up WhatsApp note.',
        performedBy: 'Murugan Selvam',
      },
    ],
  },
  {
    id: 'flw-7',
    followUpNumber: 'FLW-2026-047',
    contactPerson: 'Bala Swaminathan',
    companyName: 'Sri Balaji Agro Equipments',
    relatedOpportunity: 'General Lead',
    followUpType: 'WhatsApp',
    scheduledDate: '2026-11-21',
    scheduledTime: '11:15 AM',
    assignedEmployee: 'Pooja Hegde',
    priority: 'Low',
    status: 'Rescheduled',
    discussionNotes: 'Follow up on grain sorter 24V DC solenoid valve sample trial test results.',
    nextFollowUpDate: '2026-11-25',
    whatsappStatus: 'Customer requested reschedule to next week',
    history: [
      {
        id: 'h-7',
        timestamp: '2026-11-19 02:00 PM',
        action: 'Rescheduled by Customer',
        note: 'Client is on business travel until Nov 24.',
        performedBy: 'Pooja Hegde',
      },
    ],
  },
];

export const CentralFollowUpsPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(INITIAL_FOLLOW_UPS);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [employeeFilter, setEmployeeFilter] = useState<string>('ALL');
  const [oppFilter, setOppFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFlw, setEditingFlw] = useState<FollowUpItem | null>(null);
  const [viewFlw, setViewFlw] = useState<FollowUpItem | null>(null);
  const [completeModalFlw, setCompleteModalFlw] = useState<FollowUpItem | null>(null);
  const [rescheduleModalFlw, setRescheduleModalFlw] = useState<FollowUpItem | null>(null);

  const [form] = Form.useForm();
  const [completeForm] = Form.useForm();
  const [rescheduleForm] = Form.useForm();

  // Dynamic Anchor Date
  const todayStr = '2026-11-20';

  // 1. Dynamic Summary Cards (Exact Match to Requirement 3)
  // No duplicate counting. Non-overlapping calculation:
  // - Total: All records
  // - Today: scheduledDate === todayStr and status !== Completed
  // - Upcoming: scheduledDate > todayStr and status !== Completed
  // - Overdue: (scheduledDate < todayStr and status !== Completed) OR status === 'Overdue'
  // - Completed: status === 'Completed'
  const metrics = useMemo(() => {
    const total = followUps.length;
    const completedCount = followUps.filter((f) => f.status === 'Completed').length;
    const overdueCount = followUps.filter(
      (f) => f.status === 'Overdue' || (f.scheduledDate < todayStr && f.status !== 'Completed')
    ).length;
    const todayCount = followUps.filter(
      (f) => f.scheduledDate === todayStr && f.status !== 'Completed' && f.status !== 'Overdue'
    ).length;
    const upcomingCount = followUps.filter(
      (f) => f.scheduledDate > todayStr && f.status !== 'Completed' && f.status !== 'Overdue'
    ).length;

    return { total, todayCount, upcomingCount, overdueCount, completedCount };
  }, [followUps]);

  // 2. Filtered Follow-up Records
  const filteredFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        f.followUpNumber.toLowerCase().includes(q) ||
        f.contactPerson.toLowerCase().includes(q) ||
        f.companyName.toLowerCase().includes(q) ||
        f.discussionNotes?.toLowerCase().includes(q) ||
        f.relatedOpportunity.toLowerCase().includes(q);

      const matchType = typeFilter === 'ALL' || f.followUpType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
      const matchEmployee = employeeFilter === 'ALL' || f.assignedEmployee === employeeFilter;
      const matchOpp = oppFilter === 'ALL' || f.relatedOpportunity === oppFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(f.scheduledDate);
        matchDate =
          itemDate.isAfter(dateRange[0].startOf('day')) &&
          itemDate.isBefore(dateRange[1].endOf('day'));
      }

      return matchSearch && matchType && matchStatus && matchEmployee && matchOpp && matchDate;
    });
  }, [followUps, search, typeFilter, statusFilter, employeeFilter, oppFilter, dateRange]);

  // Handlers
  const handleSaveFollowUp = (values: any) => {
    const dateFormatted = dayjs(values.scheduledDate).format('YYYY-MM-DD');
    const timeFormatted = values.scheduledTime ? dayjs(values.scheduledTime).format('hh:mm A') : '11:00 AM';

    if (editingFlw) {
      setFollowUps((prev) =>
        prev.map((f) =>
          f.id === editingFlw.id
            ? {
                ...f,
                contactPerson: values.contactPerson,
                companyName: values.companyName || '',
                relatedOpportunity: values.relatedOpportunity || 'General Lead',
                followUpType: values.followUpType,
                scheduledDate: dateFormatted,
                scheduledTime: timeFormatted,
                assignedEmployee: values.assignedEmployee,
                priority: values.priority,
                status: values.status,
                reminderSetting: values.reminderSetting || '15 mins before',
                discussionNotes: values.discussionNotes,
                callDuration: values.callDuration,
                whatsappStatus: values.whatsappStatus,
                emailSubject: values.emailSubject,
                meetingLocationOrLink: values.meetingLocationOrLink,
                meetingParticipants: values.meetingParticipants,
              }
            : f
        )
      );
      message.success(`Follow-up ${editingFlw.followUpNumber} updated successfully!`);
      setEditingFlw(null);
    } else {
      const nextNum = followUps.length + 1;
      const flwCode = `FLW-2026-${String(nextNum).padStart(3, '0')}`;
      const newEntry: FollowUpItem = {
        id: `flw-${Date.now()}`,
        followUpNumber: flwCode,
        contactPerson: values.contactPerson,
        companyName: values.companyName || '',
        relatedOpportunity: values.relatedOpportunity || 'General Lead',
        followUpType: values.followUpType || 'Phone Call',
        scheduledDate: dateFormatted,
        scheduledTime: timeFormatted,
        assignedEmployee: values.assignedEmployee,
        priority: values.priority || 'Medium',
        status: values.status || 'Pending',
        reminderSetting: values.reminderSetting || '15 mins before',
        discussionNotes: values.discussionNotes || '',
        callDuration: values.callDuration,
        whatsappStatus: values.whatsappStatus,
        emailSubject: values.emailSubject,
        meetingLocationOrLink: values.meetingLocationOrLink,
        meetingParticipants: values.meetingParticipants,
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
            action: 'Scheduled',
            note: 'Initial communication scheduled.',
            performedBy: values.assignedEmployee,
          },
        ],
      };
      setFollowUps((prev) => [newEntry, ...prev]);
      message.success(`New follow-up ${flwCode} scheduled!`);
      setIsAddModalOpen(false);
    }
    form.resetFields();
  };

  const handleCompleteFollowUp = (values: any) => {
    if (!completeModalFlw) return;
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === completeModalFlw.id
          ? {
              ...f,
              status: 'Completed',
              outcome: values.outcome,
              discussionNotes: values.notes ? `${f.discussionNotes ? f.discussionNotes + ' | ' : ''}${values.notes}` : f.discussionNotes,
              nextFollowUpDate: values.nextFollowUpDate ? dayjs(values.nextFollowUpDate).format('YYYY-MM-DD') : f.nextFollowUpDate,
              history: [
                ...f.history,
                {
                  id: `h-${Date.now()}`,
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  action: 'Completed',
                  note: `Outcome: ${values.outcome}. Notes: ${values.notes || 'None'}`,
                  performedBy: f.assignedEmployee,
                },
              ],
            }
          : f
      )
    );
    message.success(`Follow-up ${completeModalFlw.followUpNumber} marked as Completed!`);
    setCompleteModalFlw(null);
    completeForm.resetFields();
  };

  const handleRescheduleFollowUp = (values: any) => {
    if (!rescheduleModalFlw) return;
    const newDate = dayjs(values.newDate).format('YYYY-MM-DD');
    const newTime = values.newTime ? dayjs(values.newTime).format('hh:mm A') : rescheduleModalFlw.scheduledTime;

    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === rescheduleModalFlw.id
          ? {
              ...f,
              scheduledDate: newDate,
              scheduledTime: newTime,
              status: 'Rescheduled',
              history: [
                ...f.history,
                {
                  id: `h-${Date.now()}`,
                  timestamp: dayjs().format('YYYY-MM-DD hh:mm A'),
                  action: 'Rescheduled',
                  note: `Rescheduled to ${newDate} ${newTime}. Reason: ${values.reason || 'Customer requested shift'}`,
                  performedBy: f.assignedEmployee,
                },
              ],
            }
          : f
      )
    );
    message.success(`Follow-up ${rescheduleModalFlw.followUpNumber} rescheduled to ${newDate}!`);
    setRescheduleModalFlw(null);
    rescheduleForm.resetFields();
  };

  const handleDeleteFollowUp = (id: string, num: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
    if (viewFlw?.id === id) setViewFlw(null);
    message.success(`Follow-up ${num} deleted`);
  };

  // Badge Helpers
  const getTypeBadge = (type: FollowUpType) => {
    const config: Record<FollowUpType, { bg: string; color: string; border: string; icon: any }> = {
      'Phone Call': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', icon: PhoneCall },
      Email: { bg: '#F0FDFA', color: '#0F766E', border: '#99F6E4', icon: Mail },
      Meeting: { bg: '#FAF5FF', color: '#6B21A8', border: '#E9D5FF', icon: Users },
      WhatsApp: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', icon: MessageSquare },
    };
    const c = config[type] || { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0', icon: Clock };
    const Icon = c.icon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
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
        <Icon size={12} />
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: FollowUpStatus, date: string) => {
    const isOverdue = status === 'Overdue' || (date < todayStr && status !== 'Completed');
    if (isOverdue) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 700,
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            border: '1px solid #FECACA',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#DC2626' }} />
          Overdue
        </span>
      );
    }

    const config: Record<FollowUpStatus, { bg: string; color: string; border: string }> = {
      Pending: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
      Completed: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
      Overdue: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
      Rescheduled: { bg: '#F3E8FF', color: '#7E22CE', border: '#E9D5FF' },
    };
    const c = config[status] || { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' };
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
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
        {status}
      </span>
    );
  };

  const getPriorityBadge = (p: FollowUpPriority) => {
    const config: Record<FollowUpPriority, { bg: string; color: string; border: string }> = {
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

  // Table Columns (Exact Match to Requirement 5)
  const columns: ColumnsType<FollowUpItem> = [
    {
      title: 'Follow-up ID',
      dataIndex: 'followUpNumber',
      key: 'followUpNumber',
      width: 125,
      render: (text: string, r) => (
        <span
          onClick={() => setViewFlw(r)}
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
      title: 'Customer / Lead',
      key: 'customerLead',
      width: 190,
      render: (_, r) => (
        <div>
          <div
            onClick={() => setViewFlw(r)}
            style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5, cursor: 'pointer' }}
          >
            {r.contactPerson}
          </div>
          {r.companyName && (
            <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building size={11} color="#94A3B8" />
              <span>{r.companyName}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Related Opportunity',
      dataIndex: 'relatedOpportunity',
      key: 'relatedOpportunity',
      width: 150,
      render: (opp: string) =>
        opp === 'General Lead' ? (
          <span style={{ color: '#64748B', fontSize: 11.5, fontStyle: 'italic' }}>General Lead</span>
        ) : (
          <span
            style={{
              fontWeight: 700,
              color: BRAND_PURPLE,
              backgroundColor: '#FAF5FF',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 11,
              border: '1px solid #E9D5FF',
            }}
          >
            {opp}
          </span>
        ),
    },
    {
      title: 'Follow-up Type',
      dataIndex: 'followUpType',
      key: 'followUpType',
      width: 120,
      render: (type: FollowUpType) => getTypeBadge(type),
    },
    {
      title: 'Scheduled Date & Time',
      key: 'dateTime',
      width: 160,
      sorter: (a, b) => a.scheduledDate.localeCompare(b.scheduledDate),
      render: (_, r) => {
        const isToday = r.scheduledDate === todayStr;
        const isOverdue = r.scheduledDate < todayStr && r.status !== 'Completed';
        return (
          <div>
            <div
              style={{
                fontWeight: 700,
                color: isOverdue ? '#DC2626' : isToday ? BRAND_PURPLE : '#0F172A',
                fontSize: 12,
              }}
            >
              {r.scheduledDate} {isToday && '(Today)'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>{r.scheduledTime}</div>
          </div>
        );
      },
    },
    {
      title: 'Assigned Employee',
      dataIndex: 'assignedEmployee',
      key: 'assignedEmployee',
      width: 140,
      render: (emp: string) => (
        <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{emp}</span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 90,
      render: (p: FollowUpPriority) => getPriorityBadge(p),
    },
    {
      title: 'Status',
      key: 'status',
      width: 115,
      render: (_, r) => getStatusBadge(r.status, r.scheduledDate),
    },
    {
      title: 'Outcome',
      dataIndex: 'outcome',
      key: 'outcome',
      width: 150,
      render: (out: FollowUpOutcome) =>
        out ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: out === 'Successfully Completed' || out === 'Interested' ? '#15803D' : '#64748B',
              backgroundColor: out === 'Successfully Completed' || out === 'Interested' ? '#F0FDF4' : '#F8FAFC',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #E2E8F0',
            }}
          >
            {out}
          </span>
        ) : (
          <span style={{ color: '#94A3B8', fontSize: 11 }}>Pending</span>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<Eye size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => setViewFlw(r)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<Edit3 size={13} color="#475569" />}
              style={{ borderRadius: 6, borderColor: '#E2E8F0' }}
              onClick={() => {
                setEditingFlw(r);
                form.setFieldsValue({
                  ...r,
                  scheduledDate: dayjs(r.scheduledDate),
                  scheduledTime: dayjs(`2026-11-20 ${r.scheduledTime}`),
                });
              }}
            />
          </Tooltip>
          {r.status !== 'Completed' && (
            <Tooltip title="Complete Follow-up">
              <Button
                size="small"
                icon={<CheckCheck size={13} color="#15803D" />}
                style={{
                  borderRadius: 6,
                  backgroundColor: '#F0FDF4',
                  borderColor: '#BBF7D0',
                }}
                onClick={() => {
                  setCompleteModalFlw(r);
                  completeForm.resetFields();
                }}
              />
            </Tooltip>
          )}
          {r.status !== 'Completed' && (
            <Tooltip title="Reschedule">
              <Button
                size="small"
                icon={<RefreshCw size={13} color="#7E22CE" />}
                style={{
                  borderRadius: 6,
                  backgroundColor: '#FAF5FF',
                  borderColor: '#E9D5FF',
                }}
                onClick={() => {
                  setRescheduleModalFlw(r);
                  rescheduleForm.setFieldsValue({
                    newDate: dayjs(r.scheduledDate).add(2, 'day'),
                  });
                }}
              />
            </Tooltip>
          )}
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
            <Clock size={20} />
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
              Customer & Lead Follow-ups
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Manage customer communications, schedule follow-ups, track interaction history and monitor communication outcomes.
            </p>
          </div>
        </div>

        <div>
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
              setEditingFlw(null);
              form.resetFields();
              setIsAddModalOpen(true);
            }}
          >
            + Schedule Follow-up
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
        {/* Total Follow-ups */}
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
              Total Follow-ups
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
              <Clock size={14} color={BRAND_PURPLE} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: BRAND_PURPLE, marginTop: 6 }}>
            {metrics.total}
          </div>
        </div>

        {/* Today's Follow-ups */}
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
              Today's Follow-ups
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
              <Bell size={14} color="#2563EB" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#1E40AF', marginTop: 6 }}>
            {metrics.todayCount}
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>
              Upcoming Follow-ups
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
              <Calendar size={14} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#92400E', marginTop: 6 }}>
            {metrics.upcomingCount}
          </div>
        </div>

        {/* Overdue Follow-ups */}
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
              Overdue Follow-ups
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
              <AlertTriangle size={14} color="#DC2626" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#991B1B', marginTop: 6 }}>
            {metrics.overdueCount}
          </div>
        </div>

        {/* Completed Follow-ups */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 14,
            padding: '14px 18px',
            border: '1px solid #BBF7D0',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>
              Completed Follow-ups
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
            {metrics.completedCount}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Section (Single Row Alignment) */}
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
        {/* Search by Follow-up ID / Customer / Lead / Company */}
        <div style={{ flex: '1 1 200px', minWidth: 170 }}>
          <Input
            prefix={<Search size={14} color="#94A3B8" />}
            placeholder="Search by ID / Customer / Lead"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36 }}
          />
        </div>

        {/* Follow-up Type Filter */}
        <div style={{ width: 140, flexShrink: 0 }}>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Types' },
              { value: 'Phone Call', label: 'Phone Call' },
              { value: 'Email', label: 'Email' },
              { value: 'WhatsApp', label: 'WhatsApp' },
              { value: 'Meeting', label: 'Customer Meeting' },
            ]}
          />
        </div>

        {/* Status Filter */}
        <div style={{ width: 135, flexShrink: 0 }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Rescheduled', label: 'Rescheduled' },
            ]}
          />
        </div>

        {/* Assigned Employee Filter */}
        <div style={{ width: 145, flexShrink: 0 }}>
          <Select
            value={employeeFilter}
            onChange={setEmployeeFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Employees' },
              ...EMPLOYEES.map((e) => ({ value: e, label: e })),
            ]}
          />
        </div>

        {/* Related Opportunity Filter */}
        <div style={{ width: 155, flexShrink: 0 }}>
          <Select
            value={oppFilter}
            onChange={setOppFilter}
            style={{ width: '100%', height: 36 }}
            options={[
              { value: 'ALL', label: 'All Opportunities' },
              ...OPPORTUNITIES_LIST.map((o) => ({ value: o.value, label: o.value })),
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

        {/* Reset Filters Button */}
        {(search ||
          typeFilter !== 'ALL' ||
          statusFilter !== 'ALL' ||
          employeeFilter !== 'ALL' ||
          oppFilter !== 'ALL' ||
          dateRange) && (
          <Button
            size="small"
            icon={<RefreshCw size={12} />}
            onClick={() => {
              setSearch('');
              setTypeFilter('ALL');
              setStatusFilter('ALL');
              setEmployeeFilter('ALL');
              setOppFilter('ALL');
              setDateRange(null);
            }}
            style={{ height: 36, borderRadius: 8, fontSize: 12, color: '#64748B', flexShrink: 0 }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Follow-up Management Table */}
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
              Follow-up Communications
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
              {filteredFollowUps.length} scheduled
            </span>
          </div>
        </div>

        <Table<FollowUpItem>
          columns={columns}
          dataSource={filteredFollowUps}
          rowKey="id"
          pagination={{
            pageSize: 7,
            size: 'small',
            showTotal: (total, range) => (
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Showing {range[0]}-{range[1]} of {total} follow-ups
              </span>
            ),
          }}
          size="middle"
          scroll={{ x: 1400 }}
        />
      </div>

      {/* 5. Schedule / Edit Follow-up Modal (Requirement 6 & 7) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800 }}>
            <Clock size={18} color={BRAND_PURPLE} />
            {editingFlw ? `Edit Follow-up: ${editingFlw.followUpNumber}` : 'Schedule Follow-up Activity'}
          </div>
        }
        open={isAddModalOpen || !!editingFlw}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingFlw(null);
          form.resetFields();
        }}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveFollowUp}
          initialValues={{
            followUpType: 'Phone Call',
            status: 'Pending',
            priority: 'Medium',
            assignedEmployee: 'Vikram Seth',
            scheduledDate: dayjs(),
            scheduledTime: dayjs(),
            reminderSetting: '15 mins before',
            relatedOpportunity: 'General Lead',
          }}
          style={{ marginTop: 14 }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Customer / Lead Contact Person</span>}
                name="contactPerson"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="e.g. Ramesh Sundaram" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Company Name</span>}
                name="companyName"
              >
                <Input placeholder="e.g. Apex Precision Tools Ltd" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Related Sales Opportunity</span>}
                name="relatedOpportunity"
              >
                <Select
                  options={OPPORTUNITIES_LIST}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Communication Type</span>}
                name="followUpType"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Phone Call', label: 'Phone Call' },
                    { value: 'Email', label: 'Email' },
                    { value: 'WhatsApp', label: 'WhatsApp' },
                    { value: 'Meeting', label: 'Customer Meeting' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Scheduled Date</span>}
                name="scheduledDate"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Scheduled Time</span>}
                name="scheduledTime"
                rules={[{ required: true }]}
              >
                <TimePicker use12Hours format="h:mm a" style={{ width: '100%', borderRadius: 6 }} />
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
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Assigned Employee</span>}
                name="assignedEmployee"
                rules={[{ required: true }]}
              >
                <Select
                  options={EMPLOYEES.map((e) => ({ value: e, label: e }))}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>Reminder Notification</span>}
                name="reminderSetting"
              >
                <Select
                  options={[
                    { value: 'None', label: 'No Reminder' },
                    { value: '15 mins before', label: '15 mins before' },
                    { value: '1 hour before', label: '1 hour before' },
                    { value: '1 day before', label: '1 day before' },
                  ]}
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Type-Specific Fields */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.followUpType !== curr.followUpType}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('followUpType');
              if (type === 'Email') {
                return (
                  <Form.Item
                    label={<span style={{ fontWeight: 600, fontSize: 12 }}>Email Subject</span>}
                    name="emailSubject"
                  >
                    <Input placeholder="e.g. Quotation Review & Engineering Specs" style={{ borderRadius: 6 }} />
                  </Form.Item>
                );
              }
              if (type === 'Meeting') {
                return (
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 12 }}>Meeting Location / Video Link</span>}
                        name="meetingLocationOrLink"
                      >
                        <Input placeholder="e.g. Plant Boardroom or Google Meet" style={{ borderRadius: 6 }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 12 }}>Participants</span>}
                        name="meetingParticipants"
                      >
                        <Input placeholder="e.g. Technical Director, Plant Electrician" style={{ borderRadius: 6 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Follow-up Goal & Discussion Notes</span>}
            name="discussionNotes"
            rules={[{ required: true, message: 'Please enter notes for the follow-up' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g. Discuss revised discount on induction motors, confirm CAD drawing approval..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingFlw(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            >
              {editingFlw ? 'Update Follow-up' : 'Save & Schedule'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Complete Follow-up Modal (Requirement 9) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 800 }}>
            <CheckCircle size={18} color="#16A34A" />
            Complete Follow-up: {completeModalFlw?.followUpNumber}
          </div>
        }
        open={!!completeModalFlw}
        onCancel={() => setCompleteModalFlw(null)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={completeForm} layout="vertical" onFinish={handleCompleteFollowUp} style={{ marginTop: 14 }}>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Follow-up Outcome</span>}
            name="outcome"
            rules={[{ required: true, message: 'Please select communication outcome' }]}
            initialValue="Successfully Completed"
          >
            <Select
              options={[
                { value: 'Interested', label: 'Interested - Moving forward' },
                { value: 'Not Interested', label: 'Not Interested' },
                { value: 'Callback Required', label: 'Callback Required' },
                { value: 'Meeting Scheduled', label: 'Meeting Scheduled' },
                { value: 'Quotation Requested', label: 'Quotation Requested' },
                { value: 'No Response', label: 'No Response / Unreachable' },
                { value: 'Successfully Completed', label: 'Successfully Completed' },
              ]}
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Discussion Outcome & Customer Response</span>}
            name="notes"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Customer approved terms, requested proforma invoice..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Schedule Next Follow-up (Optional)</span>}
            name="nextFollowUpDate"
          >
            <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setCompleteModalFlw(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#15803D', borderColor: '#15803D', fontWeight: 700 }}
            >
              Record Completion
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 7. Reschedule Follow-up Modal (Requirement 10) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7E22CE', fontWeight: 800 }}>
            <RefreshCw size={18} color="#7E22CE" />
            Reschedule: {rescheduleModalFlw?.followUpNumber}
          </div>
        }
        open={!!rescheduleModalFlw}
        onCancel={() => setRescheduleModalFlw(null)}
        footer={null}
        width={450}
        destroyOnClose
      >
        <Form form={rescheduleForm} layout="vertical" onFinish={handleRescheduleFollowUp} style={{ marginTop: 14 }}>
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>New Scheduled Date</span>}
                name="newDate"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%', borderRadius: 6 }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 12 }}>New Time</span>}
                name="newTime"
              >
                <TimePicker use12Hours format="h:mm a" style={{ width: '100%', borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 12 }}>Reschedule Reason</span>}
            name="reason"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Client requested callback next Tuesday after plant inspection..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setRescheduleModalFlw(null)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            >
              Confirm Reschedule
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 8. Detailed View Drawer (Requirement 8) */}
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
                {viewFlw?.followUpNumber}
              </span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                {viewFlw?.contactPerson}
              </span>
            </div>
            {viewFlw && getStatusBadge(viewFlw.status, viewFlw.scheduledDate)}
          </div>
        }
        open={!!viewFlw}
        onClose={() => setViewFlw(null)}
        width={550}
        destroyOnClose
      >
        {viewFlw && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Quick Summary Card */}
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
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Communication</div>
                <div style={{ marginTop: 4 }}>{getTypeBadge(viewFlw.followUpType)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Priority</div>
                <div style={{ marginTop: 4 }}>{getPriorityBadge(viewFlw.priority)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Assigned To</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  {viewFlw.assignedEmployee}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {viewFlw.status !== 'Completed' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCheck size={12} />}
                  onClick={() => {
                    setCompleteModalFlw(viewFlw);
                    completeForm.resetFields();
                  }}
                  style={{ backgroundColor: '#15803D', borderColor: '#15803D', borderRadius: 6, fontWeight: 700 }}
                >
                  Complete Activity
                </Button>
                <Button
                  size="small"
                  icon={<RefreshCw size={12} />}
                  onClick={() => {
                    setRescheduleModalFlw(viewFlw);
                    rescheduleForm.setFieldsValue({
                      newDate: dayjs(viewFlw.scheduledDate).add(2, 'day'),
                    });
                  }}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  Reschedule
                </Button>
              </div>
            )}

            {/* 1. Customer & Lead Details */}
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
                Customer & Opportunity Association
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
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewFlw.contactPerson}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Company:</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{viewFlw.companyName || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Related Opportunity:</span>
                  <span style={{ fontWeight: 700, color: BRAND_PURPLE }}>{viewFlw.relatedOpportunity}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Reminder Alert:</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewFlw.reminderSetting}</span>
                </div>
              </div>
            </div>

            {/* 2. Schedule & Communication Specifics */}
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
                Schedule & Communication Specifics
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: 11 }}>Date & Time:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>
                      {viewFlw.scheduledDate} at {viewFlw.scheduledTime}
                    </div>
                  </div>
                  {viewFlw.nextFollowUpDate && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Next Follow-up Date:</span>
                      <div style={{ fontWeight: 700, color: '#2563EB' }}>
                        {viewFlw.nextFollowUpDate}
                      </div>
                    </div>
                  )}
                </div>

                {viewFlw.emailSubject && (
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    <span style={{ color: '#64748B' }}>Email Subject: </span>
                    <strong>{viewFlw.emailSubject}</strong>
                  </div>
                )}
                {viewFlw.meetingLocationOrLink && (
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    <span style={{ color: '#64748B' }}>Meeting Location: </span>
                    <strong>{viewFlw.meetingLocationOrLink}</strong>
                  </div>
                )}
                {viewFlw.meetingParticipants && (
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    <span style={{ color: '#64748B' }}>Participants: </span>
                    <span>{viewFlw.meetingParticipants}</span>
                  </div>
                )}
                {viewFlw.callDuration && (
                  <div style={{ marginTop: 6, fontSize: 11.5 }}>
                    <span style={{ color: '#64748B' }}>Call Duration: </span>
                    <span>{viewFlw.callDuration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Activity Notes & Outcomes */}
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
                <FileText size={14} color={BRAND_PURPLE} />
                Activity Notes & Outcome
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
                <div style={{ color: '#334155', lineHeight: 1.5 }}>
                  {viewFlw.discussionNotes || 'No notes entered.'}
                </div>
                {viewFlw.outcome && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 8,
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 6,
                      fontSize: 11.5,
                      color: '#166534',
                    }}
                  >
                    <strong>Recorded Outcome:</strong> {viewFlw.outcome}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Communication History Timeline */}
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
                Activity Log & Reschedule History
              </div>
              <Timeline
                items={viewFlw.history.map((h) => ({
                  color: h.action === 'Completed' ? '#16A34A' : h.action === 'Rescheduled' ? '#7E22CE' : '#2563EB',
                  children: (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>
                        {h.action}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
                        {h.timestamp} • by {h.performedBy}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                        {h.note}
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CentralFollowUpsPage;
