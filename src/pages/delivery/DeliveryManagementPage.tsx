import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  Typography,
  message,
  Drawer,
  Badge,
  Row,
  Col,
  Tabs,
  Progress,
  Divider,
  Timeline,
  Dropdown,
  MenuProps,
  Upload,
} from 'antd';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Printer,
  Download,
  MapPin,
  Eye,
  FileSpreadsheet,
  XCircle,
  FileText,
  User,
  ShieldCheck,
  Package,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  CheckCircle,
  Phone,
  Mail,
  Building,
  Navigation,
  FileCheck,
  AlertCircle,
  MoreVertical,
  Camera,
  PenTool,
} from 'lucide-react';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

// Color Constants matching enterprise theme
const ROYAL_PURPLE = '#441A87';
const PURPLE_LIGHT_BG = '#FAF5FF';
const PURPLE_BORDER = '#E9D5FF';
const TEXT_DARK = '#0F172A';

export interface DeliveryItemDetail {
  id: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  dispatchedQty: number;
  deliveredQty: number;
  pendingQty: number;
  uom: string;
  unitWeightKg: number;
}

export interface DeliveryException {
  failedReason: string;
  damagedOrMissingItems?: string;
  customerNotAvailable?: boolean;
  incorrectAddress?: boolean;
  reattemptDate?: string;
  returnToWarehouseStatus?: 'Not Returned' | 'Pending Return' | 'Returned to Warehouse' | 'Restocked';
  exceptionLoggedAt?: string;
  remarks?: string;
}

export interface ProofOfDeliveryInfo {
  receiverName: string;
  receiverPhone?: string;
  receiverDesignation?: string;
  actualDeliveryDateTime: string;
  signatureUrl?: string;
  photoUrl?: string;
  podDocumentName?: string;
  verificationStatus: 'Verified & Approved' | 'Pending Verification' | 'Rejected / Dispute';
  verifiedBy?: string;
}

export interface DeliveryItem {
  id: string;
  deliveryId: string; // Challan #
  orderNumber: string; // SO #
  quoteRef?: string;
  customerName: string;
  customerCompany: string;
  customerContactPerson: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  assignedDriver: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  transporterName: string;
  trackingNumber: string;
  ewayBillNumber?: string;
  dispatchDate: string;
  expectedDate: string;
  actualDeliveryDate?: string;
  deliveryStatus: 'Pending Dispatch' | 'Dispatched' | 'Partially Delivered' | 'Delivered' | 'Failed Deliveries';
  podStatus: 'Verified' | 'Pending Upload' | 'Awaiting Review' | 'Disputed' | 'Not Applicable';
  itemsCount: number;
  totalWeightKg: number;
  branch: string;
  items: DeliveryItemDetail[];
  pod?: ProofOfDeliveryInfo;
  exception?: DeliveryException;
  timeline: { title: string; time: string; desc: string; type?: 'done' | 'active' | 'pending' | 'danger' }[];
}

export const INITIAL_DELIVERIES: DeliveryItem[] = [
  {
    id: 'DEL-01',
    deliveryId: 'DC-2026-901',
    orderNumber: 'SO-2026-901',
    quoteRef: 'QT-2026-881',
    customerName: 'Ramesh Sundaram',
    customerCompany: 'Apex Precision Tools Ltd',
    customerContactPerson: 'Ramesh Sundaram (Plant Head)',
    customerPhone: '+91 98412 11002',
    customerEmail: 'ramesh@apexprecision.com',
    deliveryAddress: 'Plot 45, Ambattur Industrial Estate, Phase II, Chennai, TN 600058',
    assignedDriver: 'Muruganandham V',
    driverPhone: '+91 97890 44551',
    vehicleNumber: 'TN-07-CM-4819',
    vehicleType: 'Tata 407 (3.5T Closed Container)',
    transporterName: 'VRL Logistics Express Surface',
    trackingNumber: 'VRL-992104-CHE',
    ewayBillNumber: 'EWB-881920394011',
    dispatchDate: '2026-11-18',
    expectedDate: '2026-11-19',
    actualDeliveryDate: '2026-11-19 14:35',
    deliveryStatus: 'Delivered',
    podStatus: 'Verified',
    itemsCount: 8,
    totalWeightKg: 420,
    branch: 'Chennai HQ Depot',
    items: [
      {
        id: 'it-1',
        itemCode: 'VFD-15KW-EMC',
        itemName: '3-Phase Frequency Inverter 15kW with EMC Filter',
        orderedQty: 8,
        dispatchedQty: 8,
        deliveredQty: 8,
        pendingQty: 0,
        uom: 'Units',
        unitWeightKg: 52.5,
      },
    ],
    pod: {
      receiverName: 'Ramesh Sundaram',
      receiverPhone: '+91 98412 11002',
      receiverDesignation: 'Chief Plant Engineer',
      actualDeliveryDateTime: '2026-11-19 14:35 IST',
      signatureUrl: 'DIGITAL_SIGN_RAMESH_901.png',
      photoUrl: 'DOCK_UNLOAD_PHOTO_APEX.jpg',
      podDocumentName: 'SIGNED_CHALLAN_POD_DC901.pdf',
      verificationStatus: 'Verified & Approved',
      verifiedBy: 'Suresh Kumar (Logistics Manager)',
    },
    timeline: [
      { title: 'Challan Generated', time: '2026-11-18 09:30', desc: 'Generated from SO-2026-901 in ERP', type: 'done' },
      { title: 'Loading & Dispatch', time: '2026-11-18 14:15', desc: 'Vehicle TN-07-CM-4819 departed Chennai HQ Depot', type: 'done' },
      { title: 'In Transit Checkpoint', time: '2026-11-19 11:20', desc: 'Passed Ambattur bypass toll plaza', type: 'done' },
      { title: 'Goods Delivered & Verified', time: '2026-11-19 14:35', desc: 'Received and signed by Ramesh Sundaram at Gate 2', type: 'done' },
    ],
  },
  {
    id: 'DEL-02',
    deliveryId: 'DC-2026-902',
    orderNumber: 'SO-2026-902',
    quoteRef: 'QT-2026-882',
    customerName: 'Priya Narayanan',
    customerCompany: 'Omni Infra Ventures Ltd',
    customerContactPerson: 'Priya Narayanan (Commercial Mgr)',
    customerPhone: '+91 97890 33441',
    customerEmail: 'priya@omniinfra.in',
    deliveryAddress: 'Gate 4, Metro Rail Yard Project Site, Guindy, Chennai, TN 600032',
    assignedDriver: 'Saravanan K',
    driverPhone: '+91 94441 22883',
    vehicleNumber: 'TN-04-E-9011',
    vehicleType: 'Eicher Pro 3015 (8T Open Truck)',
    transporterName: 'Internal Fleet Dedicated',
    trackingNumber: 'FLEET-INT-CHE-102',
    ewayBillNumber: 'EWB-901128374612',
    dispatchDate: '2026-11-19',
    expectedDate: '2026-11-20',
    deliveryStatus: 'Dispatched',
    podStatus: 'Pending Upload',
    itemsCount: 6,
    totalWeightKg: 850,
    branch: 'Chennai HQ Depot',
    items: [
      {
        id: 'it-2',
        itemCode: 'SERVO-DRV-75',
        itemName: 'High Torque Industrial Servo Drive 7.5kW Heavy Duty',
        orderedQty: 6,
        dispatchedQty: 6,
        deliveredQty: 0,
        pendingQty: 6,
        uom: 'Sets',
        unitWeightKg: 141.6,
      },
    ],
    timeline: [
      { title: 'Delivery Challan Created', time: '2026-11-19 10:00', desc: 'Outbound DC booked for Metro Site', type: 'done' },
      { title: 'Vehicle Loaded & Outbound Gate Pass', time: '2026-11-19 16:30', desc: 'Driver Saravanan K took charge of cargo', type: 'done' },
      { title: 'On Route to Destination', time: '2026-11-20 08:30', desc: 'Estimated delivery arrival today 15:00', type: 'active' },
    ],
  },
  {
    id: 'DEL-03',
    deliveryId: 'DC-2026-903',
    orderNumber: 'SO-2026-903',
    quoteRef: 'QT-2026-883',
    customerName: 'Karthik Raja',
    customerCompany: 'Southern Automation Works',
    customerContactPerson: 'Karthik Raja (Procurement)',
    customerPhone: '+91 94441 55667',
    customerEmail: 'karthik@southauto.com',
    deliveryAddress: 'Industrial Suburb, Thudiyalur Road, Coimbatore, TN 641034',
    assignedDriver: 'Mani Maran',
    driverPhone: '+91 98840 77112',
    vehicleNumber: 'TN-38-BY-2210',
    vehicleType: 'Mahindra Bolero Maxi Truck (1.5T)',
    transporterName: 'SpotOn Logistics Express',
    trackingNumber: 'SPOT-558291-CBE',
    ewayBillNumber: 'EWB-382210492811',
    dispatchDate: '2026-11-19',
    expectedDate: '2026-11-21',
    actualDeliveryDate: '2026-11-20 11:00',
    deliveryStatus: 'Partially Delivered',
    podStatus: 'Awaiting Review',
    itemsCount: 15,
    totalWeightKg: 310,
    branch: 'Coimbatore Plant',
    items: [
      {
        id: 'it-3a',
        itemCode: 'SENS-IND-OPT',
        itemName: 'IP67 Rated Optical Proximity Sensor Batch',
        orderedQty: 10,
        dispatchedQty: 10,
        deliveredQty: 10,
        pendingQty: 0,
        uom: 'Nos',
        unitWeightKg: 11,
      },
      {
        id: 'it-3b',
        itemCode: 'CTRL-PLC-MOD',
        itemName: 'Modular PLC I/O Expansion Rack (16 Ch)',
        orderedQty: 5,
        dispatchedQty: 5,
        deliveredQty: 2,
        pendingQty: 3,
        uom: 'Units',
        unitWeightKg: 40,
      },
    ],
    exception: {
      failedReason: 'Partial delivery - 3 units held due to warehouse packing discrepancy',
      damagedOrMissingItems: '3 PLC Expansion Modules retained for recalibration',
      customerNotAvailable: false,
      incorrectAddress: false,
      reattemptDate: '2026-11-23',
      returnToWarehouseStatus: 'Pending Return',
      exceptionLoggedAt: '2026-11-20 11:30',
      remarks: 'Customer accepted 10 sensors + 2 PLCs. Signed partial delivery note.',
    },
    pod: {
      receiverName: 'Karthik Raja',
      receiverPhone: '+91 94441 55667',
      receiverDesignation: 'Procurement Specialist',
      actualDeliveryDateTime: '2026-11-20 11:00 IST',
      signatureUrl: 'SIGN_KARTHIK_PARTIAL_903.png',
      photoUrl: 'PARTIAL_DELIVERY_DOCK.jpg',
      podDocumentName: 'PARTIAL_POD_DC903.pdf',
      verificationStatus: 'Pending Verification',
      verifiedBy: 'Awaiting Depot Verification',
    },
    timeline: [
      { title: 'Challan Generated', time: '2026-11-19 11:00', desc: 'Coimbatore Plant outbound line', type: 'done' },
      { title: 'Dispatched via SpotOn', time: '2026-11-19 15:45', desc: 'Handed over at Coimbatore Hub', type: 'done' },
      { title: 'Partial Delivery Handover', time: '2026-11-20 11:00', desc: '12 items handed over, 3 items pending re-attempt', type: 'active' },
    ],
  },
  {
    id: 'DEL-04',
    deliveryId: 'DC-2026-904',
    orderNumber: 'SO-2026-904',
    quoteRef: 'QT-2026-884',
    customerName: 'Venkatesh Rao',
    customerCompany: 'Bharat Heavy Dynamics Ltd',
    customerContactPerson: 'Venkatesh Rao (Plant Manager)',
    customerPhone: '+91 98400 99881',
    customerEmail: 'venkat@bharatdynamic.com',
    deliveryAddress: 'Survey 112, Whitefield Industrial Zone, Bengaluru, KA 560066',
    assignedDriver: 'Unassigned',
    driverPhone: 'N/A',
    vehicleNumber: 'Awaiting Vehicle Assignment',
    vehicleType: 'TBD (3T Recommended)',
    transporterName: 'Pending Carrier Booking',
    trackingNumber: 'Awaiting Generation',
    dispatchDate: '2026-11-20',
    expectedDate: '2026-11-22',
    deliveryStatus: 'Pending Dispatch',
    podStatus: 'Not Applicable',
    itemsCount: 5,
    totalWeightKg: 190,
    branch: 'Bengaluru Tech Park',
    items: [
      {
        id: 'it-4',
        itemCode: 'VFD-PANEL-30',
        itemName: 'IP55 Automated Inverter Control Cabinet 30kW',
        orderedQty: 5,
        dispatchedQty: 0,
        deliveredQty: 0,
        pendingQty: 5,
        uom: 'Cabinets',
        unitWeightKg: 38,
      },
    ],
    timeline: [
      { title: 'Order Approved for Dispatch', time: '2026-11-20 09:15', desc: 'Goods staged at Bay 2 waiting for driver assignment', type: 'active' },
    ],
  },
  {
    id: 'DEL-05',
    deliveryId: 'DC-2026-905',
    orderNumber: 'SO-2026-905',
    quoteRef: 'QT-2026-885',
    customerName: 'Anand Mahindra',
    customerCompany: 'Sundaram Fasteners Ltd',
    customerContactPerson: 'Anand Mahindra (Supply Chain Lead)',
    customerPhone: '+91 98410 88219',
    customerEmail: 'anand@sundaramfasteners.com',
    deliveryAddress: 'Padi Industrial Complex, MTH Road, Chennai, TN 600050',
    assignedDriver: 'Rajesh K',
    driverPhone: '+91 98402 11993',
    vehicleNumber: 'TN-09-BK-3392',
    vehicleType: 'Tata Ace (1T Mini Truck)',
    transporterName: 'Internal Fleet Dedicated',
    trackingNumber: 'FLEET-INT-CHE-105',
    ewayBillNumber: 'EWB-093392817263',
    dispatchDate: '2026-11-19',
    expectedDate: '2026-11-19',
    deliveryStatus: 'Failed Deliveries',
    podStatus: 'Disputed',
    itemsCount: 2,
    totalWeightKg: 65,
    branch: 'Chennai HQ Depot',
    items: [
      {
        id: 'it-5',
        itemCode: 'TOOL-PNEUM-X',
        itemName: 'Pneumatic Precision Torque Assembly Screwdriver Kit',
        orderedQty: 2,
        dispatchedQty: 2,
        deliveredQty: 0,
        pendingQty: 2,
        uom: 'Kits',
        unitWeightKg: 32.5,
      },
    ],
    exception: {
      failedReason: 'Client Site Gate closed due to factory scheduled power maintenance',
      customerNotAvailable: true,
      incorrectAddress: false,
      damagedOrMissingItems: 'None. Cargo intact and secured in vehicle.',
      reattemptDate: '2026-11-21',
      returnToWarehouseStatus: 'Returned to Warehouse',
      exceptionLoggedAt: '2026-11-19 17:45',
      remarks: 'Driver contacted Mr. Anand; requested re-dispatch Saturday morning 10 AM.',
    },
    timeline: [
      { title: 'Challan Created', time: '2026-11-19 11:30', desc: 'Outbound dispatch booked', type: 'done' },
      { title: 'Dispatched for Delivery', time: '2026-11-19 14:00', desc: 'Vehicle TN-09-BK-3392 out for delivery', type: 'done' },
      { title: 'Delivery Failed - Gate Closed', time: '2026-11-19 17:30', desc: 'Customer premises shut for plant maintenance', type: 'danger' },
      { title: 'Consignment Returned to Depot', time: '2026-11-19 19:15', desc: 'Checked back into Chennai HQ Warehouse Bay 1', type: 'active' },
    ],
  },
  {
    id: 'DEL-06',
    deliveryId: 'DC-2026-906',
    orderNumber: 'SO-2026-906',
    quoteRef: 'QT-2026-886',
    customerName: 'Siddharth Roy',
    customerCompany: 'TVS Motor Company Ltd',
    customerContactPerson: 'Siddharth Roy (Stores Head)',
    customerPhone: '+91 97890 11223',
    customerEmail: 'siddharth@tvsmotor.com',
    deliveryAddress: 'Hosur Plant II, Harita, Hosur, TN 635109',
    assignedDriver: 'Muruganandham V',
    driverPhone: '+91 97890 44551',
    vehicleNumber: 'TN-07-CM-4819',
    vehicleType: 'Tata 407 (3.5T Closed Container)',
    transporterName: 'VRL Logistics Surface Express',
    trackingNumber: 'VRL-992188-HSR',
    ewayBillNumber: 'EWB-771829304192',
    dispatchDate: '2026-11-17',
    expectedDate: '2026-11-18',
    actualDeliveryDate: '2026-11-18 16:10',
    deliveryStatus: 'Delivered',
    podStatus: 'Verified',
    itemsCount: 12,
    totalWeightKg: 580,
    branch: 'Chennai HQ Depot',
    items: [
      {
        id: 'it-6',
        itemCode: 'LINE-SENS-SYS',
        itemName: 'Conveyor Line Smart Optical Inspection Units',
        orderedQty: 12,
        dispatchedQty: 12,
        deliveredQty: 12,
        pendingQty: 0,
        uom: 'Units',
        unitWeightKg: 48.3,
      },
    ],
    pod: {
      receiverName: 'Siddharth Roy',
      receiverPhone: '+91 97890 11223',
      receiverDesignation: 'Senior Stores Superintendent',
      actualDeliveryDateTime: '2026-11-18 16:10 IST',
      signatureUrl: 'SIGN_SIDDHARTH_TVS_906.png',
      photoUrl: 'TVS_RECEIVING_DOCK.jpg',
      podDocumentName: 'SIGNED_CHALLAN_TVS_906.pdf',
      verificationStatus: 'Verified & Approved',
      verifiedBy: 'Suresh Kumar (Logistics Manager)',
    },
    timeline: [
      { title: 'Challan Generated', time: '2026-11-17 08:30', desc: 'Outbound DC generated for Hosur Plant', type: 'done' },
      { title: 'Dispatched via VRL Logistics', time: '2026-11-17 12:00', desc: 'Truck departed depot', type: 'done' },
      { title: 'Delivered at Receiving Bay 4', time: '2026-11-18 16:10', desc: 'Goods verified and signed on electronic POD', type: 'done' },
    ],
  },
];

export const DeliveryManagementPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(() => {
    const raw = localStorage.getItem('erp_deliveries_list_v2');
    return raw ? JSON.parse(raw) : INITIAL_DELIVERIES;
  });

  // Filters state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [driverFilter, setDriverFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [isAssignFleetModalOpen, setIsAssignFleetModalOpen] = useState(false);

  // Forms
  const [createForm] = Form.useForm();
  const [podForm] = Form.useForm();
  const [exceptionForm] = Form.useForm();
  const [fleetForm] = Form.useForm();

  // 1. Calculate all 6 KPI cards dynamically from actual delivery records
  const kpiMetrics = useMemo(() => {
    const totalChallans = deliveries.length;
    const pendingDispatch = deliveries.filter((d) => d.deliveryStatus === 'Pending Dispatch').length;
    const dispatched = deliveries.filter((d) => d.deliveryStatus === 'Dispatched').length;
    const partiallyDelivered = deliveries.filter((d) => d.deliveryStatus === 'Partially Delivered').length;
    const delivered = deliveries.filter((d) => d.deliveryStatus === 'Delivered').length;
    const failedDeliveries = deliveries.filter((d) => d.deliveryStatus === 'Failed Deliveries').length;

    return {
      totalChallans,
      pendingDispatch,
      dispatched,
      partiallyDelivered,
      delivered,
      failedDeliveries,
    };
  }, [deliveries]);

  // Unique Filter Options
  const uniqueBranches = useMemo(() => Array.from(new Set(deliveries.map((d) => d.branch))), [deliveries]);
  const uniqueVehicles = useMemo(
    () => Array.from(new Set(deliveries.map((d) => d.vehicleNumber).filter((v) => v && v !== 'Awaiting Vehicle Assignment'))),
    [deliveries]
  );
  const uniqueDrivers = useMemo(
    () => Array.from(new Set(deliveries.map((d) => d.assignedDriver).filter((v) => v && v !== 'Unassigned'))),
    [deliveries]
  );

  // Filtered deliveries list
  const filteredData = useMemo(() => {
    return deliveries.filter((item) => {
      const q = searchText.toLowerCase();
      const matchSearch =
        !searchText ||
        item.deliveryId.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerCompany.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.trackingNumber.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || item.deliveryStatus === statusFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      const matchVehicle = vehicleFilter === 'ALL' || item.vehicleNumber === vehicleFilter;
      const matchDriver = driverFilter === 'ALL' || item.assignedDriver === driverFilter;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(item.dispatchDate);
        matchDate =
          (itemDate.isAfter(dateRange[0], 'day') || itemDate.isSame(dateRange[0], 'day')) &&
          (itemDate.isBefore(dateRange[1], 'day') || itemDate.isSame(dateRange[1], 'day'));
      }

      return matchSearch && matchStatus && matchBranch && matchVehicle && matchDriver && matchDate;
    });
  }, [deliveries, searchText, statusFilter, branchFilter, vehicleFilter, driverFilter, dateRange]);

  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('ALL');
    setBranchFilter('ALL');
    setVehicleFilter('ALL');
    setDriverFilter('ALL');
    setDateRange(null);
  };

  const handleOpenDrawer = (record: DeliveryItem) => {
    setSelectedDelivery(record);
    setIsDrawerOpen(true);
  };

  const handleOpenPodModal = (record: DeliveryItem) => {
    setSelectedDelivery(record);
    podForm.setFieldsValue({
      receiverName: record.pod?.receiverName || record.customerContactPerson || record.customerName,
      receiverPhone: record.pod?.receiverPhone || record.customerPhone,
      receiverDesignation: record.pod?.receiverDesignation || 'Store / Site Officer',
      actualDeliveryDateTime: record.pod?.actualDeliveryDateTime || dayjs().format('YYYY-MM-DD HH:mm'),
      verificationStatus: record.pod?.verificationStatus || 'Verified & Approved',
    });
    setIsPodModalOpen(true);
  };

  const handleOpenExceptionModal = (record: DeliveryItem) => {
    setSelectedDelivery(record);
    exceptionForm.setFieldsValue({
      failedReason: record.exception?.failedReason || 'Customer Site Closed / Not Available',
      damagedOrMissingItems: record.exception?.damagedOrMissingItems || 'No physical damage reported',
      customerNotAvailable: record.exception?.customerNotAvailable !== undefined ? record.exception.customerNotAvailable : true,
      incorrectAddress: record.exception?.incorrectAddress || false,
      reattemptDate: record.exception?.reattemptDate ? dayjs(record.exception.reattemptDate) : dayjs().add(1, 'day'),
      returnToWarehouseStatus: record.exception?.returnToWarehouseStatus || 'Returned to Warehouse',
      remarks: record.exception?.remarks || '',
    });
    setIsExceptionModalOpen(true);
  };

  const handleOpenFleetModal = (record: DeliveryItem) => {
    setSelectedDelivery(record);
    fleetForm.setFieldsValue({
      assignedDriver: record.assignedDriver !== 'Unassigned' ? record.assignedDriver : 'Muruganandham V',
      driverPhone: record.driverPhone !== 'N/A' ? record.driverPhone : '+91 97890 44551',
      vehicleNumber: record.vehicleNumber !== 'Awaiting Vehicle Assignment' ? record.vehicleNumber : 'TN-07-CM-4819',
      vehicleType: record.vehicleType || 'Tata 407 (3.5T Closed Container)',
      transporterName: record.transporterName || 'Internal Fleet Dedicated',
      trackingNumber: record.trackingNumber || `FLT-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setIsAssignFleetModalOpen(true);
  };

  const submitAssignFleet = (values: any) => {
    if (!selectedDelivery) return;
    const updated = deliveries.map((d) => {
      if (d.id === selectedDelivery.id) {
        return {
          ...d,
          assignedDriver: values.assignedDriver,
          driverPhone: values.driverPhone,
          vehicleNumber: values.vehicleNumber,
          vehicleType: values.vehicleType,
          transporterName: values.transporterName,
          trackingNumber: values.trackingNumber,
          deliveryStatus: d.deliveryStatus === 'Pending Dispatch' ? ('Dispatched' as const) : d.deliveryStatus,
          timeline: [
            ...d.timeline,
            {
              title: 'Driver & Vehicle Assigned',
              time: dayjs().format('YYYY-MM-DD HH:mm'),
              desc: `Assigned to ${values.assignedDriver} (${values.vehicleNumber}). Dispatched via ${values.transporterName}.`,
              type: 'done' as const,
            },
          ],
        };
      }
      return d;
    });

    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list_v2', JSON.stringify(updated));
    message.success(`Fleet & Driver assigned to Challan ${selectedDelivery.deliveryId}!`);
    setIsAssignFleetModalOpen(false);
    if (selectedDelivery) {
      setSelectedDelivery(updated.find((x) => x.id === selectedDelivery.id) || null);
    }
  };

  const submitPod = (values: any) => {
    if (!selectedDelivery) return;

    const updated = deliveries.map((d) => {
      if (d.id === selectedDelivery.id) {
        return {
          ...d,
          deliveryStatus: 'Delivered' as const,
          podStatus: 'Verified' as const,
          actualDeliveryDate: values.actualDeliveryDateTime,
          pod: {
            receiverName: values.receiverName,
            receiverPhone: values.receiverPhone,
            receiverDesignation: values.receiverDesignation,
            actualDeliveryDateTime: values.actualDeliveryDateTime,
            podDocumentName: `DIGITAL_POD_${d.deliveryId}.pdf`,
            signatureUrl: 'CUSTOMER_DIGITAL_SIGN.png',
            photoUrl: 'SITE_DELIVERY_CONFIRMATION.jpg',
            verificationStatus: values.verificationStatus,
            verifiedBy: 'Suresh Kumar (Logistics Manager)',
          },
          items: d.items.map((it) => ({
            ...it,
            deliveredQty: it.dispatchedQty,
            pendingQty: 0,
          })),
          timeline: [
            ...d.timeline,
            {
              title: 'Proof of Delivery Recorded',
              time: dayjs().format('YYYY-MM-DD HH:mm'),
              desc: `Confirmed by ${values.receiverName} (${values.receiverDesignation}). POD Document verified.`,
              type: 'done' as const,
            },
          ],
        };
      }
      return d;
    });

    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list_v2', JSON.stringify(updated));
    message.success(`Proof of Delivery (POD) successfully recorded for ${selectedDelivery.deliveryId}!`);
    setIsPodModalOpen(false);
    if (selectedDelivery) {
      setSelectedDelivery(updated.find((x) => x.id === selectedDelivery.id) || null);
    }
  };

  const submitException = (values: any) => {
    if (!selectedDelivery) return;

    const updated = deliveries.map((d) => {
      if (d.id === selectedDelivery.id) {
        return {
          ...d,
          deliveryStatus: 'Failed Deliveries' as const,
          podStatus: 'Disputed' as const,
          exception: {
            failedReason: values.failedReason,
            damagedOrMissingItems: values.damagedOrMissingItems,
            customerNotAvailable: values.customerNotAvailable,
            incorrectAddress: values.incorrectAddress,
            reattemptDate: values.reattemptDate ? values.reattemptDate.format('YYYY-MM-DD') : dayjs().add(1, 'day').format('YYYY-MM-DD'),
            returnToWarehouseStatus: values.returnToWarehouseStatus,
            exceptionLoggedAt: dayjs().format('YYYY-MM-DD HH:mm'),
            remarks: values.remarks,
          },
          timeline: [
            ...d.timeline,
            {
              title: 'Delivery Exception Logged',
              time: dayjs().format('YYYY-MM-DD HH:mm'),
              desc: `${values.failedReason}. Status: ${values.returnToWarehouseStatus}. Reattempt scheduled.`,
              type: 'danger' as const,
            },
          ],
        };
      }
      return d;
    });

    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list_v2', JSON.stringify(updated));
    message.warning(`Delivery Exception recorded for Challan ${selectedDelivery.deliveryId}`);
    setIsExceptionModalOpen(false);
    if (selectedDelivery) {
      setSelectedDelivery(updated.find((x) => x.id === selectedDelivery.id) || null);
    }
  };

  const handleCreateDelivery = (values: any) => {
    const pkgs = Number(values.itemsCount || 4);
    const wt = Number(values.totalWeightKg || 150);
    const newChallan: DeliveryItem = {
      id: `DEL-${Date.now()}`,
      deliveryId: `DC-2026-${900 + deliveries.length + 1}`,
      orderNumber: values.orderNumber || `SO-2026-${900 + deliveries.length + 1}`,
      quoteRef: values.quoteRef || 'QT-2026-DIRECT',
      customerName: values.customerName,
      customerCompany: values.customerCompany || values.customerName,
      customerContactPerson: values.customerContactPerson || values.customerName,
      customerPhone: values.customerPhone || '+91 98400 00000',
      customerEmail: values.customerEmail || 'orders@clientcorp.in',
      deliveryAddress: values.deliveryAddress,
      assignedDriver: values.assignedDriver || 'Muruganandham V',
      driverPhone: values.driverPhone || '+91 97890 44551',
      vehicleNumber: values.vehicleNumber || 'TN-07-CM-4819',
      vehicleType: values.vehicleType || 'Tata 407 (3.5T Closed Container)',
      transporterName: values.transporterName || 'Internal Fleet Dedicated',
      trackingNumber: `TRK-CHE-${Math.floor(100000 + Math.random() * 900000)}`,
      ewayBillNumber: `EWB-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      dispatchDate: values.dispatchDate ? values.dispatchDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      expectedDate: values.expectedDate ? values.expectedDate.format('YYYY-MM-DD') : dayjs().add(2, 'day').format('YYYY-MM-DD'),
      deliveryStatus: 'Pending Dispatch',
      podStatus: 'Pending Upload',
      itemsCount: pkgs,
      totalWeightKg: wt,
      branch: values.branch || 'Chennai HQ Depot',
      items: [
        {
          id: `it-${Date.now()}`,
          itemCode: 'SUPPLY-PKG-01',
          itemName: values.itemName || 'Industrial Machinery Spares & Supplies Consignment',
          orderedQty: pkgs,
          dispatchedQty: pkgs,
          deliveredQty: 0,
          pendingQty: pkgs,
          uom: 'Pkgs',
          unitWeightKg: Math.round(wt / pkgs),
        },
      ],
      timeline: [
        {
          title: 'Delivery Challan Created',
          time: dayjs().format('YYYY-MM-DD HH:mm'),
          desc: `Booked in ERP against ${values.orderNumber}. Staged for dispatch bay verification.`,
          type: 'done',
        },
      ],
    };

    const updated = [newChallan, ...deliveries];
    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list_v2', JSON.stringify(updated));
    message.success(`Outbound Delivery Challan ${newChallan.deliveryId} created successfully!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  // Status Badge Helper functions (SaaS Minimal Dot Tag style)
  const getDeliveryStatusTag = (status: DeliveryItem['deliveryStatus']) => {
    switch (status) {
      case 'Pending Dispatch':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Pending Dispatch
          </span>
        );
      case 'Dispatched':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#1D4ED8', fontSize: 11.5, fontWeight: 700, border: '1px solid #BFDBFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Dispatched
          </span>
        );
      case 'Partially Delivered':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F5F3FF', color: '#6D28D9', fontSize: 11.5, fontWeight: 700, border: '1px solid #E9D5FF' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} /> Partially Delivered
          </span>
        );
      case 'Delivered':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#15803D', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Delivered
          </span>
        );
      case 'Failed Deliveries':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Failed Delivery
          </span>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPodStatusTag = (status: DeliveryItem['podStatus']) => {
    switch (status) {
      case 'Verified':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 700, border: '1px solid #BBF7D0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> Verified POD
          </span>
        );
      case 'Pending Upload':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#B45309', fontSize: 11.5, fontWeight: 700, border: '1px solid #FDE68A' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} /> Pending Upload
          </span>
        );
      case 'Awaiting Review':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#EFF6FF', color: '#1D4ED8', fontSize: 11.5, fontWeight: 700, border: '1px solid #BFDBFE' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} /> Under Review
          </span>
        );
      case 'Disputed':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#B91C1C', fontSize: 11.5, fontWeight: 700, border: '1px solid #FECACA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626' }} /> Disputed
          </span>
        );
      default:
        return (
          <span style={{ fontSize: 11, color: '#94A3B8' }}>N/A</span>
        );
    }
  };

  // Professional Clean Minimalist Data Table Columns
  const columns = [
    {
      title: 'Challan',
      key: 'delOrder',
      width: 155,
      render: (_: any, r: DeliveryItem) => (
        <div>
          <span
            onClick={() => handleOpenDrawer(r)}
            style={{
              fontWeight: 800,
              color: ROYAL_PURPLE,
              fontSize: 13,
              cursor: 'pointer',
              display: 'inline-block',
              letterSpacing: '-0.01em',
            }}
          >
            {r.deliveryId}
          </span>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
            Ref: <span style={{ color: '#64748B', fontWeight: 600 }}>{r.orderNumber}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer & Destination',
      key: 'custDest',
      render: (_: any, r: DeliveryItem) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{r.customerCompany}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span>{r.customerContactPerson}</span>
            <span style={{ color: '#CBD5E1' }}>&bull;</span>
            <span>{r.customerPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Fleet',
      key: 'fleet',
      width: 175,
      render: (_: any, r: DeliveryItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#EDE7F6',
              color: ROYAL_PURPLE,
              fontSize: 10.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {r.assignedDriver === 'Unassigned' ? '?' : r.assignedDriver.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: r.assignedDriver === 'Unassigned' ? '#94A3B8' : '#334155' }}>
              {r.assignedDriver}
            </div>
            <div style={{ fontSize: 10.5, color: '#94A3B8' }}>
              {r.vehicleNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 130,
      render: (v: string, r: DeliveryItem) => (
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>
            {v}
          </div>
          <div style={{ fontSize: 10.5, color: '#0284C7' }}>
            Disp: {r.dispatchDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Consignment',
      key: 'itemsWt',
      width: 120,
      render: (_: any, r: DeliveryItem) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E293B', fontSize: 12.5 }}>{r.itemsCount} pkgs</div>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>{r.totalWeightKg} kg</div>
        </div>
      ),
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 145,
      align: 'center' as const,
      render: (status: DeliveryItem['deliveryStatus']) => getDeliveryStatusTag(status),
    },
    {
      title: 'POD Status',
      dataIndex: 'podStatus',
      key: 'podStatus',
      width: 130,
      align: 'center' as const,
      render: (st: DeliveryItem['podStatus']) => getPodStatusTag(st),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right' as const,
      render: (_: any, r: DeliveryItem) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'view',
            label: 'View Full Details',
            icon: <Eye size={13} />,
            onClick: () => handleOpenDrawer(r),
          },
          {
            key: 'fleet',
            label: 'Assign Fleet / Driver',
            icon: <Truck size={13} />,
            disabled: r.deliveryStatus === 'Delivered',
            onClick: () => handleOpenFleetModal(r),
          },
          {
            key: 'pod',
            label: 'Record Proof of Delivery',
            icon: <FileCheck size={13} />,
            disabled: r.deliveryStatus === 'Delivered' && r.podStatus === 'Verified',
            onClick: () => handleOpenPodModal(r),
          },
          {
            key: 'exception',
            label: 'Log Delivery Exception',
            icon: <AlertTriangle size={13} />,
            danger: true,
            onClick: () => handleOpenExceptionModal(r),
          },
          { type: 'divider' },
          {
            key: 'print',
            label: 'Print Delivery Challan',
            icon: <Printer size={13} />,
            onClick: () => message.success(`Printing Delivery Challan ${r.deliveryId}`),
          },
          {
            key: 'pdf',
            label: 'Download Challan PDF',
            icon: <Download size={13} />,
            onClick: () => message.info(`Downloading official PDF for ${r.deliveryId}`),
          },
        ];

        return (
          <Space size={4} style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button
              size="small"
              onClick={() => handleOpenDrawer(r)}
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
      {/* 1. PAGE HEADER BANNER (Single Row Layout matching user guidelines) */}
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
            <Truck size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Delivery & Dispatch Management
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Manage delivery challans, vehicle fleet dispatch, transit tracking, exceptions, and electronic Proof of Delivery (POD).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Button
            icon={<Printer size={14} />}
            onClick={() => window.print()}
            style={{
              borderRadius: 10,
              height: 38,
              fontWeight: 600,
              borderColor: '#CBD5E1',
              color: '#334155',
              padding: '0 12px',
              whiteSpace: 'nowrap',
            }}
          >
            Print Manifest
          </Button>

          <Button
            icon={<Download size={14} />}
            onClick={() => message.success('Exporting Outbound Delivery manifest to Excel...')}
            style={{
              borderRadius: 10,
              height: 38,
              fontWeight: 600,
              borderColor: '#CBD5E1',
              color: '#334155',
              padding: '0 12px',
              whiteSpace: 'nowrap',
            }}
          >
            Export Deliveries
          </Button>

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
            Create Delivery Challan
          </Button>
        </div>
      </div>

      {/* 2. FOUR ESSENTIAL HERO CARDS (Each with its own distinct vibrant gradient theme matching ERP style) */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Total Challans (Deep Royal Purple Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #441A87 0%, #311068 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(68, 26, 135, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#441A87',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <Truck size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#D8B4FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Total Challans
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpiMetrics.totalChallans}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#4ADE80', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Active Registry
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E9D5FF',
                flexShrink: 0,
              }}
            >
              <Truck size={20} />
            </div>
          </div>
        </Col>

        {/* Card 2: In-Transit / Dispatched (Clean Ice-Blue Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
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
                <Navigation size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#BAE6FD', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Active Dispatches
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpiMetrics.dispatched + kpiMetrics.partiallyDelivered}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E0F2FE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {kpiMetrics.pendingDispatch} Pending Bay Dispatch
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#BAE6FD',
                flexShrink: 0,
              }}
            >
              <Clock size={20} />
            </div>
          </div>
        </Col>

        {/* Card 3: Delivered & Verified POD (Vibrant Emerald Green Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={24} strokeWidth={2.6} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#A7F3D0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Delivered Orders
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpiMetrics.delivered}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#D1FAE5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Signed Electronic POD
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A7F3D0',
                flexShrink: 0,
              }}
            >
              <CheckCircle size={20} />
            </div>
          </div>
        </Col>

        {/* Card 4: Failed / Exceptions Logged (High-Notice Crimson Red Gradient) */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              borderRadius: 22,
              padding: '18px 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.28)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FECDD3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Delivery Exceptions
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 1 }}>
                  {kpiMetrics.failedDeliveries}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#FFE4E6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  Action / Reattempt Needed
                </div>
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FECDD3',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. CLEAN MINIMALIST SAAS DATA TABLE WITH INTEGRATED TOOLBAR (Linear/Stripe Style) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Sleek Minimalist Toolbar - Exactly matching Quotations Page */}
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
          {/* Left: Section Title & Count Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
              All Challans
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

          {/* Right: Clean Action Filters in a Single Compact Row */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input
              prefix={<Search size={14} color="#94A3B8" />}
              placeholder="Filter by customer, SO #, rep..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 230, borderRadius: 8, height: 34, fontSize: 12 }}
              allowClear
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'Pending Dispatch', label: 'Pending Dispatch' },
                { value: 'Dispatched', label: 'Dispatched' },
                { value: 'Partially Delivered', label: 'Partially Delivered' },
                { value: 'Delivered', label: 'Delivered' },
                { value: 'Failed Deliveries', label: 'Failed Deliveries' },
              ]}
            />
            <Select
              size="small"
              value={branchFilter}
              onChange={setBranchFilter}
              style={{ width: 145, height: 34 }}
              options={[
                { value: 'ALL', label: 'All Depots' },
                ...uniqueBranches.map((b) => ({ value: b, label: b })),
              ]}
            />
            <Button
              size="small"
              icon={<Download size={13} />}
              onClick={() => message.success('Exporting deliveries manifest to CSV...')}
              style={{ borderRadius: 8, height: 34, fontWeight: 600, fontSize: 12, borderColor: '#CBD5E1' }}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Minimalist SaaS Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: '#64748B' }}>
                Showing {range[0]}-{range[1]} of {total} delivery challans
              </span>
            ),
          }}
          size="middle"
        />
      </div>

      {/* 5. VIEW DETAILS RIGHT DRAWER (7 Comprehensive Functional Sections) */}
      <Drawer
        title={
          selectedDelivery ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#EDE7F6', color: ROYAL_PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: TEXT_DARK }}>{selectedDelivery.deliveryId}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    Linked Sales Order: <b style={{ color: ROYAL_PURPLE }}>{selectedDelivery.orderNumber}</b>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {getDeliveryStatusTag(selectedDelivery.deliveryStatus)}
                {getPodStatusTag(selectedDelivery.podStatus)}
              </div>
            </div>
          ) : (
            'Delivery Details'
          )
        }
        placement="right"
        width={720}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '20px 24px', background: '#F8FAFC' } }}
        footer={
          selectedDelivery && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
              <Space>
                {selectedDelivery.deliveryStatus !== 'Delivered' && (
                  <Button
                    type="primary"
                    icon={<FileCheck size={14} />}
                    style={{ background: '#10B981', borderColor: '#10B981' }}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      handleOpenPodModal(selectedDelivery);
                    }}
                  >
                    Record Proof of Delivery (POD)
                  </Button>
                )}
                {selectedDelivery.deliveryStatus !== 'Delivered' && (
                  <Button
                    danger
                    icon={<AlertTriangle size={14} />}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      handleOpenExceptionModal(selectedDelivery);
                    }}
                  >
                    Log Exception
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<Printer size={14} />}
                  style={{ background: ROYAL_PURPLE, borderColor: ROYAL_PURPLE }}
                  onClick={() => message.success(`Printing official Delivery Challan for ${selectedDelivery.deliveryId}...`)}
                >
                  Print Challan
                </Button>
              </Space>
            </div>
          )
        }
      >
        {selectedDelivery && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* A. Customer & Destination Details Card */}
            <Card bordered style={{ borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Building size={16} color={ROYAL_PURPLE} />
                <span style={{ fontWeight: 800, fontSize: 14, color: TEXT_DARK }}>Customer & Destination Information</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12.5 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Client Company</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedDelivery.customerCompany}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Site Contact Person</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.customerContactPerson}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Contact Phone</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.customerPhone}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Email Address</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.customerEmail || 'billing@client.com'}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', background: '#F1F5F9', borderRadius: 8 }}>
                <span style={{ color: '#475569', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} color="#EF4444" /> Physical Delivery Address:
                </span>
                <span style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600, marginTop: 2, display: 'block' }}>
                  {selectedDelivery.deliveryAddress}
                </span>
              </div>
            </Card>

            {/* B. Ordered vs Dispatched vs Delivered Item Quantities Card */}
            <Card bordered style={{ borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={16} color={ROYAL_PURPLE} />
                  <span style={{ fontWeight: 800, fontSize: 14, color: TEXT_DARK }}>Delivery Item Quantities & Verification</span>
                </div>
                <Tag color="purple">{selectedDelivery.itemsCount} pkgs &bull; {selectedDelivery.totalWeightKg} kg</Tag>
              </div>

              <Table
                dataSource={selectedDelivery.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Item Description',
                    key: 'name',
                    render: (_: any, it: DeliveryItemDetail) => (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>{it.itemName}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B' }}>Code: {it.itemCode}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Ordered',
                    dataIndex: 'orderedQty',
                    key: 'orderedQty',
                    width: 75,
                    align: 'center',
                    render: (v: number, it: DeliveryItemDetail) => (
                      <span style={{ fontWeight: 600, color: '#475569' }}>{v} {it.uom}</span>
                    ),
                  },
                  {
                    title: 'Dispatched',
                    dataIndex: 'dispatchedQty',
                    key: 'dispatchedQty',
                    width: 85,
                    align: 'center',
                    render: (v: number, it: DeliveryItemDetail) => (
                      <span style={{ fontWeight: 700, color: '#2563EB' }}>{v} {it.uom}</span>
                    ),
                  },
                  {
                    title: 'Delivered',
                    dataIndex: 'deliveredQty',
                    key: 'deliveredQty',
                    width: 80,
                    align: 'center',
                    render: (v: number, it: DeliveryItemDetail) => (
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>{v} {it.uom}</span>
                    ),
                  },
                  {
                    title: 'Pending',
                    dataIndex: 'pendingQty',
                    key: 'pendingQty',
                    width: 75,
                    align: 'center',
                    render: (v: number, it: DeliveryItemDetail) => (
                      <span style={{ fontWeight: 700, color: v > 0 ? '#DC2626' : '#94A3B8' }}>{v} {it.uom}</span>
                    ),
                  },
                ]}
              />
            </Card>

            {/* C. Fleet, Driver & Transporter Logistics Details */}
            <Card bordered style={{ borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Truck size={16} color={ROYAL_PURPLE} />
                  <span style={{ fontWeight: 800, fontSize: 14, color: TEXT_DARK }}>Vehicle, Driver & Transporter Details</span>
                </div>
                {selectedDelivery.deliveryStatus !== 'Delivered' && (
                  <Button
                    size="small"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      handleOpenFleetModal(selectedDelivery);
                    }}
                    style={{ fontSize: 11, borderColor: '#CBD5E1' }}
                  >
                    Change Assignment
                  </Button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12.5 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Assigned Driver</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedDelivery.assignedDriver}</span>
                  <div style={{ fontSize: 11, color: '#475569' }}>Phone: {selectedDelivery.driverPhone}</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Vehicle Registration</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedDelivery.vehicleNumber}</span>
                  <div style={{ fontSize: 11, color: '#475569' }}>{selectedDelivery.vehicleType}</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Transporter Carrier</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.transporterName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Waybill / Tracking Number</span>
                  <span style={{ fontWeight: 700, color: '#0284C7' }}>{selectedDelivery.trackingNumber}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>E-Way Bill Number</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.ewayBillNumber || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Dispatch Depot</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.branch}</span>
                </div>
              </div>
            </Card>

            {/* D. Electronic Proof of Delivery (POD) Section */}
            <Card bordered style={{ borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={16} color="#16A34A" />
                  <span style={{ fontWeight: 800, fontSize: 14, color: TEXT_DARK }}>Electronic Proof of Delivery (POD)</span>
                </div>
                {getPodStatusTag(selectedDelivery.podStatus)}
              </div>

              {selectedDelivery.pod ? (
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: 10.5 }}>Receiver Name</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedDelivery.pod.receiverName}</span>
                      <div style={{ fontSize: 10.5, color: '#64748B' }}>{selectedDelivery.pod.receiverDesignation}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: 10.5 }}>Actual Delivery Timestamp</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>{selectedDelivery.pod.actualDeliveryDateTime}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: 10.5 }}>Verified By</span>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedDelivery.pod.verifiedBy}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', display: 'block', fontSize: 10.5 }}>POD Verification Status</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>{selectedDelivery.pod.verificationStatus}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <div style={{ flex: 1, padding: 8, background: '#FFFFFF', borderRadius: 6, border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <PenTool size={14} color="#64748B" />
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#334155', marginTop: 2 }}>Receiver Signature</div>
                      <span style={{ fontSize: 9.5, color: '#16A34A' }}>Verified Digital Token</span>
                    </div>
                    <div style={{ flex: 1, padding: 8, background: '#FFFFFF', borderRadius: 6, border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <Camera size={14} color="#64748B" />
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#334155', marginTop: 2 }}>Site Photo Capture</div>
                      <span style={{ fontSize: 9.5, color: '#16A34A' }}>Dock Unload Verified</span>
                    </div>
                    <div style={{ flex: 1, padding: 8, background: '#FFFFFF', borderRadius: 6, border: '1px solid #CBD5E1', textAlign: 'center' }}>
                      <FileText size={14} color="#64748B" />
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#334155', marginTop: 2 }}>POD Document</div>
                      <span style={{ fontSize: 9.5, color: '#2563EB', cursor: 'pointer' }}>View PDF</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: 12.5, color: '#64748B' }}>No electronic POD has been captured yet.</div>
                  <Button
                    size="small"
                    type="primary"
                    icon={<FileCheck size={13} />}
                    style={{ marginTop: 8, background: '#10B981', borderColor: '#10B981' }}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      handleOpenPodModal(selectedDelivery);
                    }}
                  >
                    Record Proof of Delivery Now
                  </Button>
                </div>
              )}
            </Card>

            {/* E. Delivery Exception Management Section */}
            {selectedDelivery.exception && (
              <Card bordered style={{ borderRadius: 14, border: '1px solid #FECACA', background: '#FEF2F2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertTriangle size={16} color="#DC2626" />
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#991B1B' }}>Delivery Exception Recorded</span>
                </div>
                <div style={{ fontSize: 12, color: '#7F1D1D', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><b>Reason:</b> {selectedDelivery.exception.failedReason}</div>
                  {selectedDelivery.exception.damagedOrMissingItems && (
                    <div><b>Damaged / Missing Items:</b> {selectedDelivery.exception.damagedOrMissingItems}</div>
                  )}
                  <div><b>Warehouse Return Status:</b> <Tag color="red">{selectedDelivery.exception.returnToWarehouseStatus}</Tag></div>
                  {selectedDelivery.exception.reattemptDate && (
                    <div><b>Scheduled Re-attempt Date:</b> <span style={{ fontWeight: 700 }}>{selectedDelivery.exception.reattemptDate}</span></div>
                  )}
                  {selectedDelivery.exception.remarks && (
                    <div><b>Notes:</b> {selectedDelivery.exception.remarks}</div>
                  )}
                </div>
              </Card>
            )}

            {/* F. Delivery Activity Timeline */}
            <Card bordered style={{ borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Clock size={16} color={ROYAL_PURPLE} />
                <span style={{ fontWeight: 800, fontSize: 14, color: TEXT_DARK }}>Delivery Activity & Audit Timeline</span>
              </div>
              <Timeline
                items={selectedDelivery.timeline.map((t) => ({
                  color: t.type === 'danger' ? 'red' : t.type === 'done' ? 'green' : 'blue',
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 12.5, color: '#0F172A' }}>{t.title}</span>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{t.time}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>{t.desc}</div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </div>
        )}
      </Drawer>

      {/* 6. CREATE OUTBOUND DELIVERY CHALLAN MODAL */}
      <Modal
        open={isCreateModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: '#EDE7F6',
                color: ROYAL_PURPLE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(68, 26, 135, 0.12)',
              }}
            >
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.01em' }}>
                Generate Outbound Delivery Challan
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
                Book outbound consignment, assign carrier fleet, and print delivery manifesto
              </div>
            </div>
          </div>
        }
        onCancel={() => setIsCreateModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsCreateModalOpen(false)}
            style={{ borderRadius: 8, height: 38, fontWeight: 600, borderColor: '#CBD5E1', color: '#475569' }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => createForm.submit()}
            style={{
              backgroundColor: ROYAL_PURPLE,
              borderColor: ROYAL_PURPLE,
              borderRadius: 8,
              height: 38,
              fontWeight: 700,
              padding: '0 20px',
              boxShadow: '0 2px 8px rgba(68, 26, 135, 0.25)',
            }}
          >
            Generate Challan
          </Button>,
        ]}
        width={760}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateDelivery} style={{ marginTop: 16 }}>
          {/* Section 1: Order & Customer Information */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building size={14} />
              <span>Order & Client Destination</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Form.Item
                name="orderNumber"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Linked Sales Order Ref</span>}
                rules={[{ required: true, message: 'Please enter order reference' }]}
                initialValue="SO-2026-907"
                style={{ marginBottom: 12 }}
              >
                <Input placeholder="e.g. SO-2026-907" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="customerCompany"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Client Company Name</span>}
                rules={[{ required: true, message: 'Please enter company name' }]}
                style={{ marginBottom: 12 }}
              >
                <Input placeholder="e.g. Ashok Leyland Foundry Division" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Form.Item
                name="customerContactPerson"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Site Receiving Contact Person</span>}
                rules={[{ required: true, message: 'Please enter contact person' }]}
                style={{ marginBottom: 12 }}
              >
                <Input placeholder="e.g. Saravanan K (Stores Head)" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="customerPhone"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Contact Mobile Number</span>}
                rules={[{ required: true, message: 'Please enter phone number' }]}
                style={{ marginBottom: 12 }}
              >
                <Input placeholder="e.g. +91 98402 11993" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </div>

            <Form.Item
              name="deliveryAddress"
              label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Delivery Destination Physical Address</span>}
              rules={[{ required: true, message: 'Please provide complete delivery address' }]}
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea
                rows={2}
                placeholder="Complete physical site address, gate entry instructions, dock bay..."
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </div>

          {/* Section 2: Fleet & Driver Assignment */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={14} />
              <span>Fleet & Driver Allocation</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Form.Item
                name="assignedDriver"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Assigned Driver</span>}
                initialValue="Muruganandham V"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="Driver name" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="vehicleNumber"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Vehicle Registration Number</span>}
                initialValue="TN-07-CM-4819"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="e.g. TN-07-CM-4819" style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>
            </div>
          </div>

          {/* Section 3: Package Specifications & Depot */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              padding: '14px 16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: ROYAL_PURPLE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Package size={14} />
              <span>Cargo Specifications & Dispatch Hub</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Form.Item
                name="itemsCount"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Package Count</span>}
                initialValue={4}
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <Input type="number" min={1} style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="totalWeightKg"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Gross Weight (Kg)</span>}
                initialValue={150}
                rules={[{ required: true }]}
                style={{ marginBottom: 0 }}
              >
                <Input type="number" min={1} style={{ height: 38, borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="branch"
                label={<span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Dispatch Hub / Depot</span>}
                initialValue="Chennai HQ Depot"
                style={{ marginBottom: 0 }}
              >
                <Select style={{ height: 38 }}>
                  <Select.Option value="Chennai HQ Depot">Chennai HQ Depot</Select.Option>
                  <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
                  <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>

      {/* 7. RECORD ELECTRONIC PROOF OF DELIVERY (POD) MODAL */}
      <Modal
        open={isPodModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontWeight: 800 }}>
            <FileCheck size={18} />
            <span>Record Electronic Proof of Delivery (POD) - {selectedDelivery?.deliveryId}</span>
          </div>
        }
        onCancel={() => setIsPodModalOpen(false)}
        onOk={() => podForm.submit()}
        okText="Verify & Save POD"
        cancelText="Cancel"
        width={600}
      >
        <Form form={podForm} layout="vertical" onFinish={submitPod}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="receiverName" label="Receiver Full Name" rules={[{ required: true }]}>
              <Input placeholder="Person who received goods" />
            </Form.Item>

            <Form.Item name="receiverPhone" label="Receiver Phone Number" rules={[{ required: true }]}>
              <Input placeholder="+91 98400 00000" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="receiverDesignation" label="Designation / Role" initialValue="Store Officer">
              <Input placeholder="e.g. Warehouse Supervisor" />
            </Form.Item>

            <Form.Item name="actualDeliveryDateTime" label="Delivery Date & Time" rules={[{ required: true }]}>
              <Input placeholder="2026-11-20 14:00" />
            </Form.Item>
          </div>

          <Form.Item name="verificationStatus" label="Verification Status" initialValue="Verified & Approved">
            <Select>
              <Select.Option value="Verified & Approved">Verified & Approved (Signature + Stamp)</Select.Option>
              <Select.Option value="Pending Verification">Pending Depot Verification</Select.Option>
              <Select.Option value="Rejected / Dispute">Rejected / Cargo Dispute</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px dashed #CBD5E1', textAlign: 'center' }}>
            <UploadCloud size={24} color="#64748B" />
            <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginTop: 4 }}>
              Upload Signed Physical POD or Delivery Photo
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>PDF, JPG, PNG up to 10MB</div>
            <Button size="small" style={{ marginTop: 8 }}>Browse Files</Button>
          </div>
        </Form>
      </Modal>

      {/* 8. LOG DELIVERY EXCEPTION MODAL */}
      <Modal
        open={isExceptionModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626', fontWeight: 800 }}>
            <AlertTriangle size={18} />
            <span>Log Delivery Exception - {selectedDelivery?.deliveryId}</span>
          </div>
        }
        onCancel={() => setIsExceptionModalOpen(false)}
        onOk={() => exceptionForm.submit()}
        okText="Log Exception & Update Status"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        width={620}
      >
        <Form form={exceptionForm} layout="vertical" onFinish={submitException}>
          <Form.Item name="failedReason" label="Exception / Failure Reason" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Customer Not Available / Site Closed">Customer Not Available / Site Closed</Select.Option>
              <Select.Option value="Incorrect Delivery Address / Restricted Entry">Incorrect Delivery Address / Restricted Entry</Select.Option>
              <Select.Option value="Damaged Cargo / Packing Dispute">Damaged Cargo / Packing Dispute</Select.Option>
              <Select.Option value="Customer Refused - PO / Quantity Mismatch">Customer Refused - PO / Quantity Mismatch</Select.Option>
              <Select.Option value="Vehicle Breakdown in Transit">Vehicle Breakdown in Transit</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="damagedOrMissingItems" label="Damaged or Missing Items (if any)">
            <Input.TextArea rows={2} placeholder="Detail item codes, package condition..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="returnToWarehouseStatus" label="Return to Warehouse Action" initialValue="Returned to Warehouse">
              <Select>
                <Select.Option value="Returned to Warehouse">Returned to Warehouse</Select.Option>
                <Select.Option value="Pending Return">Pending Return</Select.Option>
                <Select.Option value="Retained in Vehicle for Reattempt">Retained in Vehicle for Reattempt</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="reattemptDate" label="Scheduled Re-attempt Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Additional Internal Notes">
            <Input.TextArea rows={2} placeholder="Notes for dispatch manager & sales rep..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 9. ASSIGN FLEET & DRIVER MODAL */}
      <Modal
        open={isAssignFleetModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ROYAL_PURPLE, fontWeight: 800 }}>
            <Truck size={18} />
            <span>Assign Vehicle & Driver - {selectedDelivery?.deliveryId}</span>
          </div>
        }
        onCancel={() => setIsAssignFleetModalOpen(false)}
        onOk={() => fleetForm.submit()}
        okText="Assign & Dispatch"
        cancelText="Cancel"
        width={580}
      >
        <Form form={fleetForm} layout="vertical" onFinish={submitAssignFleet}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="assignedDriver" label="Driver Full Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Muruganandham V" />
            </Form.Item>

            <Form.Item name="driverPhone" label="Driver Phone Number" rules={[{ required: true }]}>
              <Input placeholder="e.g. +91 97890 44551" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="vehicleNumber" label="Vehicle Registration Number" rules={[{ required: true }]}>
              <Input placeholder="e.g. TN-07-CM-4819" />
            </Form.Item>

            <Form.Item name="vehicleType" label="Vehicle Specification / Body">
              <Input placeholder="e.g. Tata 407 (3.5T Closed Container)" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="transporterName" label="Transporter / Carrier">
              <Input placeholder="e.g. Internal Fleet or VRL Logistics" />
            </Form.Item>

            <Form.Item name="trackingNumber" label="Waybill / Tracking Reference">
              <Input placeholder="e.g. VRL-992104-CHE" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default DeliveryManagementPage;
