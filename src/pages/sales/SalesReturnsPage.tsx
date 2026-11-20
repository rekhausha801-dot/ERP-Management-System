import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  Divider,
  message,
  Space,
  Tooltip,
  Dropdown,
  MenuProps,
  Upload,
} from 'antd';
import {
  Undo2,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Calendar,
  IndianRupee,
  MoreVertical,
  Edit,
  ShieldAlert,
  Clock,
  CheckCircle2,
  CheckCircle,
  FileText,
  Building,
  User,
  Package,
  Layers,
  FileCheck,
  RefreshCcw,
  Sparkles,
  Printer,
  XCircle,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';
import dayjs from 'dayjs';

// Enterprise Theme Constants
const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#E9D5FF';
const TEXT_DARK = '#0F172A';

export interface ReturnProductItem {
  id: string;
  productName: string;
  sku: string;
  orderedQty: number;
  returnedQty: number;
  unitPrice: number;
  totalClaim: number;
}

export interface DetailedRMARecord {
  id: string;
  returnNumber: string;
  orderNumber: string;
  invoiceNumber: string;
  customerName: string;
  contactPerson: string;
  customerPhone: string;
  customerEmail: string;
  billingAddress: string;
  returnDate: string;
  requestDate: string;
  reason: 'Defective' | 'Wrong Item' | 'Damaged in Transit';
  customerComments: string;
  returnedQuantity: number;
  claimAmount: number;
  resolutionType: 'Credit Note' | 'Refund' | 'Replacement';
  referenceNumber?: string;
  status: 'Under Inspection' | 'Approved' | 'Completed' | 'Requested' | 'Pending Approval' | 'Rejected' | 'Processing';
  resolutionStatus: 'Pending' | 'Processing' | 'Issued' | 'Refunded' | 'Replaced';
  items: ReturnProductItem[];
  inspection: {
    inspectionDate: string;
    inspectedBy: string;
    productCondition: string;
    defectDescription: string;
    inspectionResult: 'Passed' | 'Pending' | 'Failed';
    inspectionNotes: string;
  };
  creditNoteDetails?: {
    creditNoteNumber: string;
    creditNoteAmount: number;
    creditNoteDate: string;
    refundTransactionRef?: string;
    refundStatus: string;
  };
  timeline: { title: string; time: string; desc: string; type?: 'done' | 'active' | 'pending' | 'danger' }[];
}

export const INITIAL_RMA_RETURNS: DetailedRMARecord[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2026-081',
    orderNumber: 'SO-2026-398',
    invoiceNumber: 'INV-2026-0081',
    customerName: 'Metro Power Systems',
    contactPerson: 'Anand Mahindra (Procurement)',
    customerPhone: '+91 98401 22334',
    customerEmail: 'anand@metropower.in',
    billingAddress: 'Plot 12, Industrial Corridor, Ambattur, Chennai 600058',
    returnDate: '2026-11-12',
    requestDate: '2026-11-11',
    reason: 'Defective',
    customerComments: 'Induction unit capacitor thermal trip observed under nominal load during trial run.',
    returnedQuantity: 2,
    claimAmount: 84000,
    resolutionType: 'Credit Note',
    referenceNumber: 'CN-2026-014',
    status: 'Completed',
    resolutionStatus: 'Refunded',
    items: [
      {
        id: 'p-1',
        productName: 'Siemens 3-Phase Induction Motor 15HP',
        sku: 'MTR-SIEM-15HP',
        orderedQty: 4,
        returnedQty: 2,
        unitPrice: 42000,
        totalClaim: 84000,
      },
    ],
    inspection: {
      inspectionDate: '2026-11-13',
      inspectedBy: 'Karthik Raja (Senior QA Engineer)',
      productCondition: 'Original packing intact; internal capacitor coil heating confirmed.',
      defectDescription: 'Thermal sensor premature cutoff due to internal coil resistance discrepancy.',
      inspectionResult: 'Passed',
      inspectionNotes: 'QA Lab confirmed defective batch issue; credit note processing authorized immediately.',
    },
    creditNoteDetails: {
      creditNoteNumber: 'CN-2026-014',
      creditNoteAmount: 84000,
      creditNoteDate: '2026-11-14',
      refundTransactionRef: 'RTGS-CMS-992104',
      refundStatus: 'Settled to Customer Ledger',
    },
    timeline: [
      { title: 'Return Requested', time: '2026-11-11 10:30', desc: 'Customer reported capacitor thermal cutoff.', type: 'done' },
      { title: 'Approval Completed', time: '2026-11-12 14:00', desc: 'RMA authorization issued by Commercial Sales.', type: 'done' },
      { title: 'Inspection Completed', time: '2026-11-13 16:30', desc: 'QA Lab confirmed coil resistance defect.', type: 'done' },
      { title: 'Resolution Processed', time: '2026-11-14 11:20', desc: 'Credit Note CN-2026-014 generated for ₹84,000.', type: 'done' },
      { title: 'Return Closed', time: '2026-11-14 15:00', desc: 'Settled to customer ledger account.', type: 'done' },
    ],
  },
  {
    id: 'ret-2',
    returnNumber: 'RET-2026-082',
    orderNumber: 'SO-2026-401',
    invoiceNumber: 'INV-2026-0082',
    customerName: 'Apex Precision Tools Ltd',
    contactPerson: 'Ramesh Sundaram (Plant Head)',
    customerPhone: '+91 98412 11002',
    customerEmail: 'ramesh@apexprecision.com',
    billingAddress: 'Plot 45, Ambattur Industrial Estate, Phase II, Chennai 600058',
    returnDate: '2026-11-16',
    requestDate: '2026-11-15',
    reason: 'Wrong Item',
    customerComments: 'Client ordered 15kW Drive model but warehouse dispatch team shipped 11kW series.',
    returnedQuantity: 1,
    claimAmount: 42000,
    resolutionType: 'Replacement',
    referenceNumber: 'SO-2026-409 (Re-Dispatch)',
    status: 'Approved',
    resolutionStatus: 'Processing',
    items: [
      {
        id: 'p-2',
        productName: 'ABB Variable Frequency Drive 11kW',
        sku: 'DRV-ABB-11KW',
        orderedQty: 1,
        returnedQty: 1,
        unitPrice: 42000,
        totalClaim: 42000,
      },
    ],
    inspection: {
      inspectionDate: '2026-11-17',
      inspectedBy: 'Suresh Kumar (Inward QA Lead)',
      productCondition: 'Brand new, unopened sealed carton.',
      defectDescription: 'No manufacturing defect; packaging SKU tag mislabeled at warehouse dispatch bay.',
      inspectionResult: 'Passed',
      inspectionNotes: 'Material restocked into inventory Bay 2; authorized direct replacement shipment.',
    },
    timeline: [
      { title: 'Return Requested', time: '2026-11-15 11:45', desc: 'Customer reported model number mismatch on carton.', type: 'done' },
      { title: 'Approval Completed', time: '2026-11-16 09:30', desc: 'Sales manager approved free express replacement exchange.', type: 'done' },
      { title: 'Inspection Completed', time: '2026-11-17 14:15', desc: 'Item received intact and restocked.', type: 'done' },
      { title: 'Resolution Processed', time: '2026-11-17 17:00', desc: 'Replacement SO-2026-409 generated for dispatch.', type: 'active' },
      { title: 'Return Closed', time: 'Pending', desc: 'Awaiting delivery confirmation of replacement unit.', type: 'pending' },
    ],
  },
  {
    id: 'ret-3',
    returnNumber: 'RET-2026-083',
    orderNumber: 'SO-2026-390',
    invoiceNumber: 'INV-2026-0083',
    customerName: 'Precision Tools Co',
    contactPerson: 'Karthik Raja (Procurement Manager)',
    customerPhone: '+91 94441 55667',
    customerEmail: 'karthik@southauto.com',
    billingAddress: 'Industrial Suburb, Thudiyalur Road, Coimbatore, TN 641034',
    returnDate: '2026-11-15',
    requestDate: '2026-11-14',
    reason: 'Damaged in Transit',
    customerComments: 'Outer shipping crate was dented and terminal bus bars cracked upon unloading at client stores.',
    returnedQuantity: 3,
    claimAmount: 51000,
    resolutionType: 'Credit Note',
    referenceNumber: 'Awaiting CN Generation',
    status: 'Under Inspection',
    resolutionStatus: 'Pending',
    items: [
      {
        id: 'p-3',
        productName: 'Schneider Modicon PLC Controller',
        sku: 'PLC-SCH-M221',
        orderedQty: 6,
        returnedQty: 3,
        unitPrice: 17000,
        totalClaim: 51000,
      },
    ],
    inspection: {
      inspectionDate: '2026-11-16',
      inspectedBy: 'Ananya Sharma (Quality Inspector)',
      productCondition: 'Crushed packaging carton; connector pins bent due to transporter rough handling.',
      defectDescription: 'Transit impact damage on external casing and mounting bracket.',
      inspectionResult: 'Pending',
      inspectionNotes: 'Transporter insurance claim docket filed. Awaiting commercial signoff for Credit Note.',
    },
    timeline: [
      { title: 'Return Requested', time: '2026-11-14 16:20', desc: 'Photographic proof of transit damage submitted.', type: 'done' },
      { title: 'Approval Completed', time: '2026-11-15 10:00', desc: 'Preliminary RMA return authorized.', type: 'done' },
      { title: 'Inspection Completed', time: '2026-11-16 12:30', desc: 'Under active insurance surveyor evaluation.', type: 'active' },
      { title: 'Resolution Processed', time: 'Pending', desc: 'Credit note awaiting surveyor clearance.', type: 'pending' },
      { title: 'Return Closed', time: 'Pending', desc: 'Claim settlement pending.', type: 'pending' },
    ],
  },
];

export const SalesReturnsPage: React.FC = () => {
  const [data, setData] = useState<DetailedRMARecord[]>(INITIAL_RMA_RETURNS);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [resolutionFilter, setResolutionFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers state
  const [selectedRecord, setSelectedRecord] = useState<DetailedRMARecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DetailedRMARecord | null>(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Dynamic Calculation of exactly 7 required KPI cards from actual return records
  const kpiMetrics = useMemo(() => {
    // 1. Total Returns
    const totalReturns = data.length;

    // 2. Under Inspection
    const underInspection = data.filter((r) => r.status === 'Under Inspection' || r.status === 'Requested').length;

    // 3. Approved Returns
    const approvedReturns = data.filter((r) => r.status === 'Approved').length;

    // 4. Completed Returns
    const completedReturns = data.filter((r) => r.status === 'Completed').length;

    // 5. Total Claim Value (Sum of all claim amounts)
    const totalClaimValue = data.reduce((acc, r) => acc + r.claimAmount, 0);

    // 6. Refund Amount (Credit note or Refund resolutions only - DO NOT count replacement)
    const refundAmount = data
      .filter((r) => r.resolutionType === 'Credit Note' || r.resolutionType === 'Refund')
      .reduce((acc, r) => acc + r.claimAmount, 0);

    // 7. Replacement Value (Separate from refund)
    const replacementValue = data
      .filter((r) => r.resolutionType === 'Replacement')
      .reduce((acc, r) => acc + r.claimAmount, 0);

    return {
      totalReturns,
      underInspection,
      approvedReturns,
      completedReturns,
      totalClaimValue,
      refundAmount,
      replacementValue,
    };
  }, [data]);

  // Filtered returns list
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        item.returnNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchResolution = resolutionFilter === 'ALL' || item.resolutionType === resolutionFilter;
      const matchReason = reasonFilter === 'ALL' || item.reason === reasonFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.returnDate);
        matchDate =
          (itemDate.isAfter(dateRange[0], 'day') || itemDate.isSame(dateRange[0], 'day')) &&
          (itemDate.isBefore(dateRange[1], 'day') || itemDate.isSame(dateRange[1], 'day'));
      }

      return matchSearch && matchStatus && matchResolution && matchReason && matchDate;
    });
  }, [data, search, statusFilter, resolutionFilter, reasonFilter, dateRange]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setResolutionFilter('ALL');
    setReasonFilter('ALL');
    setDateRange(null);
  };

  const handleOpenDrawer = (record: DetailedRMARecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (record: DetailedRMARecord) => {
    setEditRecord(record);
    editForm.setFieldsValue({
      status: record.status,
      resolutionType: record.resolutionType,
      resolutionStatus: record.resolutionStatus,
      inspectionNotes: record.inspection.inspectionNotes,
      inspectionResult: record.inspection.inspectionResult,
    });
    setIsEditModalOpen(true);
  };

  const submitEdit = (values: any) => {
    if (!editRecord) return;
    const updated = data.map((d) => {
      if (d.id === editRecord.id) {
        return {
          ...d,
          status: values.status,
          resolutionType: values.resolutionType,
          resolutionStatus: values.resolutionStatus,
          inspection: {
            ...d.inspection,
            inspectionNotes: values.inspectionNotes,
            inspectionResult: values.inspectionResult,
          },
        };
      }
      return d;
    });
    setData(updated);
    message.success(`Return record ${editRecord.returnNumber} updated successfully!`);
    setIsEditModalOpen(false);
    if (selectedRecord && selectedRecord.id === editRecord.id) {
      setSelectedRecord(updated.find((x) => x.id === editRecord.id) || null);
    }
  };

  const submitCreate = (values: any) => {
    const newRecord: DetailedRMARecord = {
      id: `ret-${Date.now()}`,
      returnNumber: `RET-2026-0${80 + data.length + 1}`,
      orderNumber: values.orderNumber,
      invoiceNumber: `INV-2026-00${80 + data.length + 1}`,
      customerName: values.customerName,
      contactPerson: values.contactPerson || 'Procurement Incharge',
      customerPhone: values.customerPhone || '+91 98401 00000',
      customerEmail: values.customerEmail || 'orders@clientcompany.com',
      billingAddress: values.billingAddress || 'Industrial Park, Chennai 600058',
      returnDate: values.returnDate ? values.returnDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      requestDate: dayjs().format('YYYY-MM-DD'),
      reason: values.reason,
      customerComments: values.customerComments || 'Customer registered RMA ticket.',
      returnedQuantity: Number(values.returnedQuantity) || 1,
      claimAmount: Number(values.claimAmount) || 25000,
      resolutionType: values.resolutionType || 'Credit Note',
      referenceNumber: values.resolutionType === 'Credit Note' ? 'Pending CN Issuance' : 'Pending Replacement SO',
      status: 'Requested',
      resolutionStatus: 'Pending',
      items: [
        {
          id: `p-${Date.now()}`,
          productName: values.productName || 'Industrial Automation Component',
          sku: values.sku || 'SKU-IND-AUTO',
          orderedQty: Number(values.returnedQuantity) || 1,
          returnedQty: Number(values.returnedQuantity) || 1,
          unitPrice: Number(values.claimAmount) || 25000,
          totalClaim: Number(values.claimAmount) || 25000,
        },
      ],
      inspection: {
        inspectionDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        inspectedBy: 'Assigned QA Engineer',
        productCondition: 'Awaiting lab receiving & physical inspection',
        defectDescription: values.customerComments || 'Preliminary defect logged by client.',
        inspectionResult: 'Pending',
        inspectionNotes: 'Package pending delivery to inward inspection bay.',
      },
      timeline: [
        { title: 'Return Requested', time: dayjs().format('YYYY-MM-DD HH:mm'), desc: 'Customer logged return request in ERP.', type: 'done' },
        { title: 'Approval Completed', time: 'Pending', desc: 'Awaiting commercial verification.', type: 'active' },
        { title: 'Inspection Completed', time: 'Pending', desc: 'Inward physical check queued.', type: 'pending' },
        { title: 'Resolution Processed', time: 'Pending', desc: 'Credit note or replacement execution.', type: 'pending' },
        { title: 'Return Closed', time: 'Pending', desc: 'Final settlement.', type: 'pending' },
      ],
    };

    setData([newRecord, ...data]);
    message.success(`Sales Return ${newRecord.returnNumber} created successfully!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleApproveReturn = (record: DetailedRMARecord) => {
    const cnNumber = `CN-2026-0${Math.floor(15 + Math.random() * 30)}`;
    const updated = data.map((d) => {
      if (d.id === record.id) {
        return {
          ...d,
          status: 'Approved' as const,
          referenceNumber: d.resolutionType === 'Credit Note' ? cnNumber : d.referenceNumber,
          creditNoteDetails:
            d.resolutionType === 'Credit Note'
              ? {
                  creditNoteNumber: cnNumber,
                  creditNoteAmount: d.claimAmount,
                  creditNoteDate: dayjs().format('YYYY-MM-DD'),
                  refundTransactionRef: `CMS-${Math.floor(100000 + Math.random() * 900000)}`,
                  refundStatus: 'Credit Note Authorized',
                }
              : d.creditNoteDetails,
          timeline: [
            ...d.timeline,
            {
              title: 'Approved by Commercial Head',
              time: dayjs().format('YYYY-MM-DD HH:mm'),
              desc: `Return approved. Authorized ${d.resolutionType}.`,
              type: 'done' as const,
            },
          ],
        };
      }
      return d;
    });

    setData(updated);
    message.success(`Return ${record.returnNumber} approved!`);
    if (selectedRecord && selectedRecord.id === record.id) {
      setSelectedRecord(updated.find((x) => x.id === record.id) || null);
    }
  };

  const handleCompleteReturn = (record: DetailedRMARecord) => {
    const updated = data.map((d) => {
      if (d.id === record.id) {
        const nextResStatus: DetailedRMARecord['resolutionStatus'] = d.resolutionType === 'Replacement' ? 'Replaced' : 'Refunded';
        return {
          ...d,
          status: 'Completed' as const,
          resolutionStatus: nextResStatus,
          timeline: [
            ...d.timeline,
            {
              title: 'Return Closed & Settled',
              time: dayjs().format('YYYY-MM-DD HH:mm'),
              desc: 'Financial and inventory ledger reconciliations completed.',
              type: 'done' as const,
            },
          ],
        };
      }
      return d;
    });

    setData(updated);
    message.success(`Return ${record.returnNumber} marked as Completed!`);
    if (selectedRecord && selectedRecord.id === record.id) {
      setSelectedRecord(updated.find((x) => x.id === record.id) || null);
    }
  };

  // Status Badges
  const getStatusTag = (st: string) => {
    switch (st) {
      case 'Completed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Completed
          </span>
        );
      case 'Approved':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#1D4ED8', fontSize: 11.5, fontWeight: 700, border: '1px solid #BFDBFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Approved
          </span>
        );
      case 'Under Inspection':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Under Inspection
          </span>
        );
      case 'Requested':
      case 'Pending Approval':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FAF5FF', color: ROYAL_PURPLE, fontSize: 11.5, fontWeight: 700, border: '1px solid #E9D5FF' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} /> Requested
          </span>
        );
      case 'Rejected':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Rejected
          </span>
        );
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const getReasonTag = (reason: string) => {
    switch (reason) {
      case 'Defective':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 6, background: '#FEF2F2', color: '#B91C1C', fontSize: 11, fontWeight: 700, border: '1px solid #FECACA' }}>
            Defective
          </span>
        );
      case 'Wrong Item':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 6, background: '#FAF5FF', color: '#6D28D9', fontSize: 11, fontWeight: 700, border: '1px solid #DDD6FE' }}>
            Wrong Item
          </span>
        );
      case 'Damaged in Transit':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 6, background: '#FFF1F2', color: '#BE123C', fontSize: 11, fontWeight: 700, border: '1px solid #FDA4AF' }}>
            Damaged in Transit
          </span>
        );
      default:
        return <Tag>{reason}</Tag>;
    }
  };

  // Columns definition according to Prompt 4
  const columns = [
    {
      title: 'Return Number',
      dataIndex: 'returnNumber',
      key: 'returnNumber',
      render: (val: string, record: DetailedRMARecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span
            onClick={() => handleOpenDrawer(record)}
            style={{
              fontWeight: 800,
              color: ROYAL_PURPLE,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-block',
              letterSpacing: '-0.01em',
            }}
          >
            {val}
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>(Filed {record.returnDate})</span>
        </div>
      ),
    },
    {
      title: 'Against Order',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 140,
      render: (val: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: 6,
            background: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid #BFDBFE',
            whiteSpace: 'nowrap',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: DetailedRMARecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{name}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            • {dayjs(record.returnDate).format('DD MMM YYYY')}
          </span>
        </div>
      ),
    },
    {
      title: 'Return Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 160,
      render: (r: string) => getReasonTag(r),
    },
    {
      title: 'Quantity Returned',
      dataIndex: 'returnedQuantity',
      key: 'returnedQuantity',
      width: 135,
      render: (q: number) => <span style={{ fontWeight: 600, color: '#334155' }}>{q} {q === 1 ? 'Unit' : 'Units'}</span>,
    },
    {
      title: 'Claim Amount',
      dataIndex: 'claimAmount',
      key: 'claimAmount',
      width: 135,
      align: 'right' as const,
      render: (amt: number) => (
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 800, color: '#DC2626', fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>
            ₹{amt.toLocaleString('en-IN')}
          </span>
        </div>
      ),
    },
    {
      title: 'Resolution Type',
      dataIndex: 'resolutionType',
      key: 'resolutionType',
      width: 130,
      render: (t: string) => (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap' }}>
          {t}
        </span>
      ),
    },
    {
      title: 'Reference Number',
      key: 'referenceNumber',
      width: 200,
      render: (_: any, record: DetailedRMARecord) => {
        if (record.referenceNumber && record.referenceNumber.startsWith('CN-')) {
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 8px',
                borderRadius: 4,
                background: '#ECFDF5',
                color: '#047857',
                fontSize: 11,
                fontWeight: 700,
                border: '1px solid #A7F3D0',
                whiteSpace: 'nowrap',
              }}
            >
              {record.referenceNumber}
            </span>
          );
        }
        return (
          <span style={{ fontSize: 11.5, color: '#64748B', whiteSpace: 'nowrap' }}>
            {record.referenceNumber || '-'}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center' as const,
      render: (st: string) => getStatusTag(st),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      align: 'right' as const,
      render: (_: any, record: DetailedRMARecord) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Return Drawer',
            icon: <Eye size={13} />,
            onClick: () => handleOpenDrawer(record),
          },
          {
            key: 'edit',
            label: 'Edit Return Details',
            icon: <Edit size={13} />,
            onClick: () => handleOpenEdit(record),
          },
          { type: 'divider' },
          {
            key: 'approve',
            label: 'Approve Return',
            icon: <CheckCircle2 size={13} />,
            disabled: record.status === 'Completed' || record.status === 'Approved',
            onClick: () => handleApproveReturn(record),
          },
          {
            key: 'complete',
            label: 'Mark as Completed',
            icon: <CheckCircle size={13} />,
            disabled: record.status === 'Completed',
            onClick: () => handleCompleteReturn(record),
          },
          {
            key: 'print',
            label: 'Print RMA Slip',
            icon: <Printer size={13} />,
            onClick: () => message.success(`Printing RMA slip for ${record.returnNumber}`),
          },
        ];

        return (
          <Space size={6} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => handleOpenDrawer(record)}
              style={{
                borderRadius: 6,
                borderColor: '#E2E8F0',
                color: '#334155',
                fontSize: 11.5,
                fontWeight: 600,
                height: 28,
                padding: '0 8px',
              }}
            >
              View
            </Button>
            <Button
              size="small"
              onClick={() => handleOpenEdit(record)}
              style={{
                borderRadius: 6,
                borderColor: '#E2E8F0',
                color: '#334155',
                fontSize: 11.5,
                fontWeight: 600,
                height: 28,
                padding: '0 8px',
              }}
            >
              Edit
            </Button>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <Button
                size="small"
                type="text"
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: '#64748B',
                }}
              >
                <MoreVertical size={14} />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 2. PAGE HEADER BANNER (Single Row Layout matching user guidelines) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '12px 20px',
          backgroundColor: PURPLE_LIGHT_BG,
          borderRadius: 16,
          border: `1px solid ${PURPLE_BORDER}`,
          flexWrap: 'nowrap',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: '#EDE7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ROYAL_PURPLE,
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.12)',
              flexShrink: 0,
            }}
          >
            <Undo2 size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Sales Returns & RMA
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage customer return requests, return approvals, quality inspections, refunds, replacements and credit note processing.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            type="primary"
            onClick={() => {
              createForm.resetFields();
              setIsCreateModalOpen(true);
            }}
            icon={<Plus size={15} />}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 10,
              fontWeight: 700,
              height: 38,
              padding: '0 16px',
              whiteSpace: 'nowrap',
            }}
          >
            Add Return Request
          </Button>
        </div>
      </div>

      {/* 3. EXACTLY 7 COMPACT KPI STATISTICS CARDS (Colorful Vibrant Design matching user theme) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Row 1: 4 Cards */}
        <Row gutter={[12, 12]}>
          {/* Card 1: Total Returns (Vibrant Royal Purple) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => clearFilters()}
              style={{
                background: 'linear-gradient(135deg, #441A87 0%, #2A085C 100%)',
                borderRadius: 20,
                padding: '16px 18px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#441A87',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <Undo2 size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', whiteSpace: 'nowrap' }}>
                    Total Returns
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    {kpiMetrics.totalReturns}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4ADE80', whiteSpace: 'nowrap', marginTop: 2 }}>
                    All Return Tickets
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E9D5FF',
                  flexShrink: 0,
                }}
              >
                <Undo2 size={18} />
              </div>
            </div>
          </Col>

          {/* Card 2: Under Inspection (Vibrant Amber / Orange) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => {
                clearFilters();
                setStatusFilter('Under Inspection');
              }}
              style={{
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                borderRadius: 20,
                padding: '16px 18px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FDE68A', whiteSpace: 'nowrap' }}>
                    Under Inspection
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    {kpiMetrics.underInspection}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FEF3C7', whiteSpace: 'nowrap', marginTop: 2 }}>
                    QA Lab Review
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FEF3C7',
                  flexShrink: 0,
                }}
              >
                <Clock size={18} />
              </div>
            </div>
          </Col>

          {/* Card 3: Approved Returns (Vibrant Blue) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => {
                clearFilters();
                setStatusFilter('Approved');
              }}
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                borderRadius: 20,
                padding: '16px 18px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#BAE6FD', whiteSpace: 'nowrap' }}>
                    Approved Returns
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    {kpiMetrics.approvedReturns}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0F2FE', whiteSpace: 'nowrap', marginTop: 2 }}>
                    Authorized for Action
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#BAE6FD',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
            </div>
          </Col>

          {/* Card 4: Completed Returns (Vibrant Emerald / Green) */}
          <Col xs={24} sm={12} md={6}>
            <div
              onClick={() => {
                clearFilters();
                setStatusFilter('Completed');
              }}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: 20,
                padding: '16px 18px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#A7F3D0', whiteSpace: 'nowrap' }}>
                    Completed Returns
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    {kpiMetrics.completedReturns}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1FAE5', whiteSpace: 'nowrap', marginTop: 2 }}>
                    Fully Settled & Closed
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A7F3D0',
                  flexShrink: 0,
                }}
              >
                <CheckCircle size={18} />
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 2: 3 Cards */}
        <Row gutter={[12, 12]}>
          {/* Card 5: Total Claim Value (Vibrant Deep Violet / Purple) */}
          <Col xs={24} sm={12} md={8}>
            <div
              onClick={() => clearFilters()}
              style={{
                background: 'linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)',
                borderRadius: 20,
                padding: '16px 20px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(91, 33, 182, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5B21B6',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <IndianRupee size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#DDD6FE', whiteSpace: 'nowrap' }}>
                    Total Claim Value
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    ₹{kpiMetrics.totalClaimValue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#C4B5FD', whiteSpace: 'nowrap', marginTop: 2 }}>
                    Gross Value of Claims
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DDD6FE',
                  flexShrink: 0,
                }}
              >
                <IndianRupee size={18} />
              </div>
            </div>
          </Col>

          {/* Card 6: Refund Amount (Vibrant Teal / Cyan) */}
          <Col xs={24} sm={12} md={8}>
            <div
              onClick={() => {
                clearFilters();
                setResolutionFilter('Credit Note');
              }}
              style={{
                background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                borderRadius: 20,
                padding: '16px 20px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0D9488',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#99F6E4', whiteSpace: 'nowrap' }}>
                    Refund Amount
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    ₹{kpiMetrics.refundAmount.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#CCFBF1', whiteSpace: 'nowrap', marginTop: 2 }}>
                    Credit Notes & Refunds
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#99F6E4',
                  flexShrink: 0,
                }}
              >
                <FileText size={18} />
              </div>
            </div>
          </Col>

          {/* Card 7: Replacement Value (Vibrant Indigo / Blue-Violet) */}
          <Col xs={24} sm={12} md={8}>
            <div
              onClick={() => {
                clearFilters();
                setResolutionFilter('Replacement');
              }}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                borderRadius: 20,
                padding: '16px 20px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.28)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F46E5',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  <RefreshCcw size={24} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#C7D2FE', whiteSpace: 'nowrap' }}>
                    Replacement Value
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                    ₹{kpiMetrics.replacementValue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0E7FF', whiteSpace: 'nowrap', marginTop: 2 }}>
                    Exchanges & Replacements
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C7D2FE',
                  flexShrink: 0,
                }}
              >
                <RefreshCcw size={18} />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 4. RETURNS DATA TABLE WITH INTEGRATED TOOLBAR */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Toolbar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            backgroundColor: '#FAFAFA',
          }}
        >
          {/* Left: Title & Count Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
              All Sales Returns
            </span>
            <span
              style={{
                backgroundColor: '#EDE7F6',
                color: ROYAL_PURPLE,
                padding: '1px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {filteredData.length}
            </span>
          </div>

          {/* Right: Filters & Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Search by Return #, Customer, Order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 240, borderRadius: 8, height: 34, fontSize: 12 }}
              allowClear
            />
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(val) => setDateRange(val as any)}
              style={{ height: 34, borderRadius: 8, fontSize: 12 }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Return Statuses' },
                { value: 'Requested', label: 'Requested' },
                { value: 'Under Inspection', label: 'Under Inspection' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
            />
            <Select
              size="small"
              value={resolutionFilter}
              onChange={setResolutionFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Resolutions' },
                { value: 'Credit Note', label: 'Credit Note' },
                { value: 'Refund', label: 'Refund' },
                { value: 'Replacement', label: 'Replacement' },
              ]}
            />
            <Button
              size="small"
              icon={<Download size={13} />}
              onClick={() => message.success('Exporting returns log to CSV...')}
              style={{ borderRadius: 8, height: 34, fontWeight: 600, fontSize: 12, borderColor: '#CBD5E1' }}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1250 }}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: '#64748B' }}>
                Showing {range[0]}-{range[1]} of {total} return records
              </span>
            ),
          }}
          size="middle"
        />
      </div>

      {/* 5. RETURN DETAILS – VIEW DRAWER (Sections A through H) */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROYAL_PURPLE }}>
              <Undo2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                {selectedRecord?.returnNumber} Details
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Sales Return & RMA Case File</div>
            </div>
          </div>
        }
        placement="right"
        width={620}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Space>
            {selectedRecord?.status !== 'Completed' && (
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, borderRadius: 6, fontWeight: 700 }}
                onClick={() => {
                  if (selectedRecord) handleApproveReturn(selectedRecord);
                }}
              >
                Approve RMA
              </Button>
            )}
            <Button size="small" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
          </Space>
        }
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 12.5 }}>
            {/* Section A: Return Information */}
            <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: ROYAL_PURPLE, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                A. Return Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Return Number:</span>
                  <div style={{ fontWeight: 800, color: ROYAL_PURPLE }}>{selectedRecord.returnNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Return Date:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.returnDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Original Sales Order:</span>
                  <div style={{ fontWeight: 700, color: '#1D4ED8' }}>{selectedRecord.orderNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Original Invoice Number:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.invoiceNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Return Request Date:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.requestDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Current Status:</span>
                  <div>{getStatusTag(selectedRecord.status)}</div>
                </div>
              </div>
            </div>

            {/* Section B: Customer Details */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building size={14} color={ROYAL_PURPLE} /> B. Customer Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Customer Legal Name:</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{selectedRecord.customerName}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Contact Person:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.contactPerson}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Phone Number:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.customerPhone}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Email Address:</span>
                  <div style={{ fontWeight: 600, color: '#0284C7' }}>{selectedRecord.customerEmail}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Billing / Delivery Address:</span>
                  <div style={{ color: '#334155', marginTop: 2 }}>{selectedRecord.billingAddress}</div>
                </div>
              </div>
            </div>

            {/* Section C: Returned Products */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={14} color={ROYAL_PURPLE} /> C. Returned Products
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Product Name & SKU</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Ordered</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Returned</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Total Claim</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.items.map((it) => (
                    <tr key={it.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '8px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{it.productName}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>SKU: {it.sku}</div>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{it.orderedQty}</td>
                      <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#DC2626' }}>{it.returnedQty}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{it.unitPrice.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#DC2626' }}>₹{it.totalClaim.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section D: Return Reason */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                D. Return Reason
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>Category:</span>
                {getReasonTag(selectedRecord.reason)}
              </div>
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Customer Remarks:</span>
                <p style={{ margin: '4px 0 0 0', color: '#334155', fontStyle: 'italic' }}>
                  "{selectedRecord.customerComments}"
                </p>
              </div>
            </div>

            {/* Section E: Quality Inspection */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={14} color="#D97706" /> E. Quality Inspection
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Inspection Date:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.inspection.inspectionDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Inspected By:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.inspection.inspectedBy}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Product Condition:</span>
                  <div style={{ color: '#334155' }}>{selectedRecord.inspection.productCondition}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Defect Description:</span>
                  <div style={{ color: '#B91C1C', fontWeight: 500 }}>{selectedRecord.inspection.defectDescription}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Inspection Result:</span>
                  <div>
                    <Tag color={selectedRecord.inspection.inspectionResult === 'Passed' ? 'green' : 'orange'}>
                      {selectedRecord.inspection.inspectionResult}
                    </Tag>
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Inspection Notes:</span>
                  <div style={{ color: '#334155', marginTop: 2 }}>{selectedRecord.inspection.inspectionNotes}</div>
                </div>
              </div>
            </div>

            {/* Section F: Resolution Details */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                F. Resolution Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Resolution Type:</span>
                  <div style={{ fontWeight: 700, color: '#334155' }}>{selectedRecord.resolutionType}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Approved Amount:</span>
                  <div style={{ fontWeight: 800, color: '#16A34A' }}>₹{selectedRecord.claimAmount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Resolution Status:</span>
                  <div><Tag color="cyan">{selectedRecord.resolutionStatus}</Tag></div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Reference Number:</span>
                  <div style={{ fontWeight: 600 }}>{selectedRecord.referenceNumber || 'Pending'}</div>
                </div>
              </div>
            </div>

            {/* Section G: Credit Note & Refund Details */}
            {selectedRecord.creditNoteDetails && (
              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  G. Credit Note & Refund Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Credit Note Number:</span>
                    <div style={{ fontWeight: 800, color: '#0D9488' }}>{selectedRecord.creditNoteDetails.creditNoteNumber}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Credit Note Amount:</span>
                    <div style={{ fontWeight: 800, color: '#0D9488' }}>₹{selectedRecord.creditNoteDetails.creditNoteAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Credit Note Date:</span>
                    <div style={{ fontWeight: 600 }}>{selectedRecord.creditNoteDetails.creditNoteDate}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Transaction Reference:</span>
                    <div style={{ fontWeight: 600 }}>{selectedRecord.creditNoteDetails.refundTransactionRef || 'N/A'}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Refund Status:</span>
                    <div style={{ fontWeight: 600, color: '#0D9488' }}>{selectedRecord.creditNoteDetails.refundStatus}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section H: Activity Timeline */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                H. Activity Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedRecord.timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: item.type === 'done' ? '#16A34A' : item.type === 'active' ? '#D97706' : '#94A3B8',
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{item.title}</span>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Return Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Edit size={16} />
            <span>Edit Return Record - {editRecord?.returnNumber}</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form form={editForm} layout="vertical" onFinish={submitEdit} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Return Status</span>} name="status" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Requested', label: 'Requested' },
                    { value: 'Under Inspection', label: 'Under Inspection' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Resolution Type</span>} name="resolutionType" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Credit Note', label: 'Credit Note' },
                    { value: 'Refund', label: 'Refund' },
                    { value: 'Replacement', label: 'Replacement' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Resolution Status</span>} name="resolutionStatus">
                <Select
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Processing', label: 'Processing' },
                    { value: 'Issued', label: 'Issued' },
                    { value: 'Refunded', label: 'Refunded' },
                    { value: 'Replaced', label: 'Replaced' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>QA Inspection Result</span>} name="inspectionResult">
                <Select
                  options={[
                    { value: 'Passed', label: 'Passed' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Failed', label: 'Failed' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>QA Inspection Notes</span>} name="inspectionNotes">
            <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, fontWeight: 700 }}>
              Save Updates
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Return Request Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Plus size={16} />
            <span>Create New Sales Return / RMA Request</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={580}
      >
        <Form form={createForm} layout="vertical" onFinish={submitCreate} style={{ marginTop: 14 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Customer Name</span>} name="customerName" rules={[{ required: true }]}>
                <Input placeholder="Client company name" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Original Sales Order</span>} name="orderNumber" rules={[{ required: true }]}>
                <Input placeholder="e.g. SO-2026-401" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Contact Person</span>} name="contactPerson">
                <Input placeholder="Stores or procurement officer" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Return Date</span>} name="returnDate" initialValue={dayjs()}>
                <DatePicker style={{ width: '100%', height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Return Reason</span>} name="reason" initialValue="Defective" rules={[{ required: true }]}>
                <Select
                  style={{ height: 38 }}
                  options={[
                    { value: 'Defective', label: 'Defective' },
                    { value: 'Wrong Item', label: 'Wrong Item' },
                    { value: 'Damaged in Transit', label: 'Damaged in Transit' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Resolution Type</span>} name="resolutionType" initialValue="Credit Note" rules={[{ required: true }]}>
                <Select
                  style={{ height: 38 }}
                  options={[
                    { value: 'Credit Note', label: 'Credit Note' },
                    { value: 'Refund', label: 'Refund' },
                    { value: 'Replacement', label: 'Replacement' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Product Name / Description</span>} name="productName" initialValue="Industrial Control Unit">
                <Input style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Returned Qty</span>} name="returnedQuantity" initialValue={1} rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%', height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Claim Amount (₹)</span>} name="claimAmount" initialValue={42000} rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%', height: 38, borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Customer Remarks / Defect Details</span>} name="customerComments">
            <Input.TextArea rows={2} style={{ borderRadius: 8 }} placeholder="Describe the reason for return..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: ROYAL_PURPLE, borderColor: ROYAL_PURPLE, fontWeight: 700 }}>
              Submit Return Request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
