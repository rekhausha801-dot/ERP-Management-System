import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Drawer,
  Form,
  Space,
  Tooltip,
  message,
  Typography,
  Divider,
  InputNumber,
  Popconfirm,
} from 'antd';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  User,
  ArrowRight,
  Printer,
  Calendar,
  CreditCard,
  Percent,
} from 'lucide-react';
import dayjs from 'dayjs';

const { Text } = Typography;

export interface ProformaItem {
  id: string;
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  gstRate: number; // e.g. 18%
}

export interface ProformaRecord {
  id: string;
  proformaNumber: string;
  orderReference: string;
  orderDate: string;
  customerName: string;
  customerGst: string;
  billingAddress: string;
  shippingAddress: string;
  isInterState: boolean; // false = CGST+SGST, true = IGST
  piDate: string;
  validUntil: string;
  paymentTerms: string;
  advancePercentage: number;
  items: ProformaItem[];
  advancePaid: number;
  paymentMode?: string;
  paymentDate?: string;
  paymentRef?: string;
  status: 'Draft' | 'Issued' | 'Partially Paid' | 'Advance Cleared' | 'Converted' | 'Cancelled' | 'Expired';
  paymentStatus: 'Pending' | 'Partially Paid' | 'Fully Paid';
  convertedInvoiceNumber?: string;
  convertedDate?: string;
  salesExecutive: string;
  termsAndNotes: string;
}

const INITIAL_PROFORMAS: ProformaRecord[] = [
  {
    id: 'pi-1',
    proformaNumber: 'PI-2026-301',
    orderReference: 'SO-2026-398',
    orderDate: '2026-11-12',
    customerName: 'Bharat Bio Labs Ltd',
    customerGst: '33AABCB1234F1Z8',
    billingAddress: 'Plot 42, Guindy Industrial Estate, Chennai, TN 600032',
    shippingAddress: 'Plot 42, Guindy Industrial Estate, Chennai, TN 600032',
    isInterState: false,
    piDate: '2026-11-14',
    validUntil: '2026-12-14',
    paymentTerms: '50% Advance, Balance on Dispatch',
    advancePercentage: 50,
    advancePaid: 365800,
    paymentMode: 'NEFT / RTGS',
    paymentDate: '2026-11-18',
    paymentRef: 'CMS-UTR-9921041',
    status: 'Advance Cleared',
    paymentStatus: 'Partially Paid',
    salesExecutive: 'Vikram Seth',
    termsAndNotes: 'Preliminary billing. Tax liability is finalized upon formal Tax Invoice generation.',
    items: [
      {
        id: 'item-1',
        productName: 'Cleanroom Environmental HVAC System 20TR',
        sku: 'HVAC-CR-20TR',
        qty: 1,
        unitPrice: 620000,
        discountPercent: 0,
        gstRate: 18,
      },
    ],
  },
  {
    id: 'pi-2',
    proformaNumber: 'PI-2026-302',
    orderReference: 'SO-2026-402',
    orderDate: '2026-11-15',
    customerName: 'Southern Automation Works',
    customerGst: '29AAECS4591K1ZY',
    billingAddress: 'Peenya Industrial Area 2nd Phase, Bengaluru, KA 560058',
    shippingAddress: 'Peenya Industrial Area 2nd Phase, Bengaluru, KA 560058',
    isInterState: true,
    piDate: '2026-11-16',
    validUntil: '2026-12-16',
    paymentTerms: '100% Advance Prior to Dispatch',
    advancePercentage: 100,
    advancePaid: 1003000,
    paymentMode: 'RTGS',
    paymentDate: '2026-11-19',
    paymentRef: 'HDFC-RTGS-882194',
    status: 'Converted',
    paymentStatus: 'Fully Paid',
    convertedInvoiceNumber: 'INV-2026-1052',
    convertedDate: '2026-11-19',
    salesExecutive: 'Ananya Sharma',
    termsAndNotes: 'Goods manufactured to customer spec. Advance received and converted to Tax Invoice.',
    items: [
      {
        id: 'item-2',
        productName: 'Factory Packaging Line PLC Retrofit & Drive Cabinet',
        sku: 'PLC-CAB-RET-01',
        qty: 1,
        unitPrice: 850000,
        discountPercent: 0,
        gstRate: 18,
      },
    ],
  },
  {
    id: 'pi-3',
    proformaNumber: 'PI-2026-303',
    orderReference: 'SO-2026-410',
    orderDate: '2026-11-18',
    customerName: 'Omni Infra Ventures',
    customerGst: '33AABCO8892D1Z4',
    billingAddress: 'Ambattur Industrial Estate, Chennai, TN 600058',
    shippingAddress: 'Ambattur Industrial Estate, Chennai, TN 600058',
    isInterState: false,
    piDate: '2026-11-18',
    validUntil: '2026-12-05',
    paymentTerms: '30% Advance, 70% Net 30',
    advancePercentage: 30,
    advancePaid: 0,
    status: 'Issued',
    paymentStatus: 'Pending',
    salesExecutive: 'Ananya Sharma',
    termsAndNotes: 'Proforma for bank letter of credit clearance and advance release.',
    items: [
      {
        id: 'item-3',
        productName: 'Warehouse Automated Stacker Actuators (Heavy Duty)',
        sku: 'ACT-HVY-STK-04',
        qty: 4,
        unitPrice: 300000,
        discountPercent: 0,
        gstRate: 18,
      },
    ],
  },
  {
    id: 'pi-4',
    proformaNumber: 'PI-2026-304',
    orderReference: 'SO-2026-415',
    orderDate: '2026-11-19',
    customerName: 'Apex Precision Tools Ltd',
    customerGst: '33AAICA9012B1Z1',
    billingAddress: 'SIDCO Industrial Estate, Coimbatore, TN 641021',
    shippingAddress: 'SIDCO Industrial Estate, Coimbatore, TN 641021',
    isInterState: false,
    piDate: '2026-11-19',
    validUntil: '2026-12-10',
    paymentTerms: '50% Advance with Order',
    advancePercentage: 50,
    advancePaid: 150000,
    paymentMode: 'Cheque Clearance',
    paymentDate: '2026-11-20',
    paymentRef: 'CHQ-AXIS-002194',
    status: 'Partially Paid',
    paymentStatus: 'Partially Paid',
    salesExecutive: 'Vikram Seth',
    termsAndNotes: 'Part-advance received. Balance advance awaiting confirmation prior to assembly stage.',
    items: [
      {
        id: 'item-4',
        productName: 'Assembly Line 15kW VFD Overhaul & Servo Kit',
        sku: 'VFD-SRV-KIT-15K',
        qty: 1,
        unitPrice: 450000,
        discountPercent: 0,
        gstRate: 18,
      },
    ],
  },
  {
    id: 'pi-5',
    proformaNumber: 'PI-2026-305',
    orderReference: 'SO-2026-422',
    orderDate: '2026-11-20',
    customerName: 'Kaveri Heavy Engineering Works',
    customerGst: '33AABCK3314L1Z2',
    billingAddress: 'Thuvakudi Industrial Complex, Tiruchirappalli, TN 620015',
    shippingAddress: 'Thuvakudi Industrial Complex, Tiruchirappalli, TN 620015',
    isInterState: false,
    piDate: '2026-11-20',
    validUntil: '2026-12-20',
    paymentTerms: '100% Advance Prior to Dispatch',
    advancePercentage: 100,
    advancePaid: 0,
    status: 'Draft',
    paymentStatus: 'Pending',
    salesExecutive: 'Priya Sundaram',
    termsAndNotes: 'Draft proforma awaiting purchase manager review before issuing.',
    items: [
      {
        id: 'item-5',
        productName: '3-Phase Induction Motor 22kW Premium Eff IE3',
        sku: 'MOT-3PH-022KW',
        qty: 2,
        unitPrice: 140000,
        discountPercent: 5,
        gstRate: 18,
      },
    ],
  },
  {
    id: 'pi-6',
    proformaNumber: 'PI-2026-306',
    orderReference: 'SO-2026-360',
    orderDate: '2026-10-15',
    customerName: 'Delta Robotics & Mechatronics',
    customerGst: '36AABCD9012R1ZZ',
    billingAddress: 'HITEC City, Madhapur, Hyderabad, TS 500081',
    shippingAddress: 'HITEC City, Madhapur, Hyderabad, TS 500081',
    isInterState: true,
    piDate: '2026-10-18',
    validUntil: '2026-11-15',
    paymentTerms: '50% Advance against PI',
    advancePercentage: 50,
    advancePaid: 0,
    status: 'Expired',
    paymentStatus: 'Pending',
    salesExecutive: 'Vikram Seth',
    termsAndNotes: 'Validity expired without advance realization. Re-quote required if client re-initiates.',
    items: [
      {
        id: 'item-6',
        productName: 'Pneumatic Gripper Actuator Modules 40mm',
        sku: 'PN-GRIP-040M',
        qty: 5,
        unitPrice: 32000,
        discountPercent: 0,
        gstRate: 18,
      },
    ],
  },
];

// Helper calculations for PI records
const calculateItemTotals = (item: ProformaItem) => {
  const lineGross = item.qty * item.unitPrice;
  const lineDiscount = lineGross * (item.discountPercent / 100);
  const taxable = lineGross - lineDiscount;
  const tax = taxable * (item.gstRate / 100);
  return {
    lineGross,
    lineDiscount,
    taxable,
    tax,
    total: taxable + tax,
  };
};

const calculatePITotals = (pi: ProformaRecord) => {
  let taxable = 0;
  let totalTax = 0;
  pi.items.forEach((item) => {
    const calc = calculateItemTotals(item);
    taxable += calc.taxable;
    totalTax += calc.tax;
  });
  const grandTotal = Math.round(taxable + totalTax);
  const advanceRequired = Math.round(grandTotal * (pi.advancePercentage / 100));
  const balanceAmount = Math.max(0, grandTotal - (pi.advancePaid || 0));

  const cgst = pi.isInterState ? 0 : totalTax / 2;
  const sgst = pi.isInterState ? 0 : totalTax / 2;
  const igst = pi.isInterState ? totalTax : 0;

  return {
    taxable: Math.round(taxable),
    totalTax: Math.round(totalTax),
    cgst: Math.round(cgst),
    sgst: Math.round(sgst),
    igst: Math.round(igst),
    grandTotal,
    advanceRequired,
    balanceAmount,
  };
};

export const SalesProformaInvoicesPage: React.FC = () => {
  const [data, setData] = useState<ProformaRecord[]>(INITIAL_PROFORMAS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [customerFilter, setCustomerFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPI, setSelectedPI] = useState<ProformaRecord | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [piToConvert, setPiToConvert] = useState<ProformaRecord | null>(null);

  const [form] = Form.useForm();
  const [editingItemRecord, setEditingItemRecord] = useState<ProformaRecord | null>(null);

  // Dynamic calculations for the 4 summary cards
  const summaryMetrics = useMemo(() => {
    const totalIssued = data.length;
    const convertedCount = data.filter((d) => d.status === 'Converted').length;
    // Pending Advance: Awaiting full advance clearance (Draft, Issued, Partially Paid, Expired)
    const pendingAdvanceCount = data.filter((d) => d.paymentStatus !== 'Fully Paid' && d.status !== 'Converted' && d.status !== 'Cancelled').length;
    // Outstanding amount = sum of balanceAmount across active non-converted non-cancelled invoices
    const totalOutstanding = data
      .filter((d) => d.status !== 'Cancelled')
      .reduce((acc, curr) => {
        const { balanceAmount } = calculatePITotals(curr);
        return acc + balanceAmount;
      }, 0);

    return {
      totalIssued,
      convertedCount,
      pendingAdvanceCount,
      totalOutstanding,
    };
  }, [data]);

  // Unique customers for dropdown filter
  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.customerName)));
  }, [data]);

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search
      const matchesSearch =
        !search ||
        item.proformaNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderReference.toLowerCase().includes(search.toLowerCase()) ||
        item.customerGst.toLowerCase().includes(search.toLowerCase());

      // Invoice Status
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      // Payment Status
      const matchesPayment = paymentFilter === 'All' || item.paymentStatus === paymentFilter;

      // Customer
      const matchesCustomer = customerFilter === 'All' || item.customerName === customerFilter;

      // Date Range
      let matchesDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const piD = dayjs(item.piDate);
        matchesDate = (piD.isAfter(dateRange[0], 'day') || piD.isSame(dateRange[0], 'day')) &&
                      (piD.isBefore(dateRange[1], 'day') || piD.isSame(dateRange[1], 'day'));
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesCustomer && matchesDate;
    });
  }, [data, search, statusFilter, paymentFilter, customerFilter, dateRange]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPaymentFilter('All');
    setCustomerFilter('All');
    setDateRange(null);
  };

  // Convert to Tax Invoice
  const handleOpenConvert = (record: ProformaRecord) => {
    setPiToConvert(record);
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = () => {
    if (!piToConvert) return;
    const nextTaxNumber = `INV-2026-${1050 + data.filter((d) => d.status === 'Converted').length + 1}`;
    const today = dayjs().format('YYYY-MM-DD');

    setData((prev) =>
      prev.map((item) => {
        if (item.id === piToConvert.id) {
          return {
            ...item,
            status: 'Converted',
            convertedInvoiceNumber: nextTaxNumber,
            convertedDate: today,
          };
        }
        return item;
      })
    );

    message.success(`Proforma ${piToConvert.proformaNumber} converted to Final Tax Invoice: ${nextTaxNumber}`);
    setConvertModalOpen(false);
    setPiToConvert(null);
  };

  // Create new PI
  const handleCreateSubmit = (actionType: 'draft' | 'issue') => {
    form.validateFields().then((values) => {
      const nextNum = `PI-2026-${300 + data.length + 1}`;
      const newItems: ProformaItem[] = values.items && values.items.length > 0
        ? values.items.map((it: any, idx: number) => ({
            id: `item-${Date.now()}-${idx}`,
            productName: it.productName || 'Industrial Component Unit',
            sku: it.sku || `SKU-${idx + 100}`,
            qty: Number(it.qty) || 1,
            unitPrice: Number(it.unitPrice) || 10000,
            discountPercent: Number(it.discountPercent) || 0,
            gstRate: Number(it.gstRate) || 18,
          }))
        : [
            {
              id: `item-${Date.now()}-0`,
              productName: values.sampleProduct || 'Precision Industrial Assembly Pack',
              sku: 'SKU-IND-990',
              qty: Number(values.sampleQty) || 1,
              unitPrice: Number(values.samplePrice) || 150000,
              discountPercent: 0,
              gstRate: 18,
            },
          ];

      const newRecord: ProformaRecord = {
        id: `pi-${Date.now()}`,
        proformaNumber: editingItemRecord ? editingItemRecord.proformaNumber : nextNum,
        orderReference: values.orderReference || 'SO-2026-DIRECT',
        orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        customerName: values.customerName,
        customerGst: values.customerGst || '33AABCT0000K1ZP',
        billingAddress: values.billingAddress || 'Industrial Area Phase 1',
        shippingAddress: values.shippingAddress || values.billingAddress || 'Industrial Area Phase 1',
        isInterState: !!values.isInterState,
        piDate: values.piDate ? values.piDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : dayjs().add(30, 'day').format('YYYY-MM-DD'),
        paymentTerms: values.paymentTerms || '50% Advance with Order',
        advancePercentage: Number(values.advancePercentage) || 50,
        advancePaid: Number(values.advancePaid) || 0,
        status: actionType === 'draft' ? 'Draft' : 'Issued',
        paymentStatus: Number(values.advancePaid) > 0 ? 'Partially Paid' : 'Pending',
        salesExecutive: values.salesExecutive || 'Vikram Seth',
        termsAndNotes: values.termsAndNotes || 'Preliminary proforma invoice. Statutory GST is reported upon final tax invoice.',
        items: newItems,
      };

      if (editingItemRecord) {
        setData((prev) => prev.map((p) => (p.id === editingItemRecord.id ? { ...newRecord, id: editingItemRecord.id } : p)));
        message.success(`Proforma ${newRecord.proformaNumber} updated successfully!`);
      } else {
        setData([newRecord, ...data]);
        message.success(`Proforma Invoice ${newRecord.proformaNumber} ${actionType === 'draft' ? 'saved as Draft' : 'issued successfully'}!`);
      }

      setCreateModalOpen(false);
      setEditingItemRecord(null);
      form.resetFields();
    });
  };

  const handleOpenEdit = (record: ProformaRecord) => {
    setEditingItemRecord(record);
    form.setFieldsValue({
      customerName: record.customerName,
      customerGst: record.customerGst,
      orderReference: record.orderReference,
      orderDate: dayjs(record.orderDate),
      piDate: dayjs(record.piDate),
      validUntil: dayjs(record.validUntil),
      billingAddress: record.billingAddress,
      shippingAddress: record.shippingAddress,
      isInterState: record.isInterState,
      paymentTerms: record.paymentTerms,
      advancePercentage: record.advancePercentage,
      advancePaid: record.advancePaid,
      salesExecutive: record.salesExecutive,
      termsAndNotes: record.termsAndNotes,
      sampleProduct: record.items[0]?.productName,
      samplePrice: record.items[0]?.unitPrice,
      sampleQty: record.items[0]?.qty,
    });
    setCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    message.success('Proforma record removed successfully.');
  };

  // Status color tag badge helper
  const renderStatusBadge = (status: ProformaRecord['status'], record: ProformaRecord) => {
    switch (status) {
      case 'Draft':
        return (
          <Tag style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Draft
          </Tag>
        );
      case 'Issued':
        return (
          <Tag style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Issued
          </Tag>
        );
      case 'Partially Paid':
        return (
          <Tag style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Partially Paid
          </Tag>
        );
      case 'Advance Cleared':
        return (
          <Tag style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Advance Cleared
          </Tag>
        );
      case 'Converted':
        return (
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
            <Tag style={{ background: '#FAF5FF', color: '#6B21A8', border: '1px solid #E9D5FF', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
              Converted
            </Tag>
            {record.convertedInvoiceNumber && (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#441A87', background: '#F3EEFF', padding: '1px 5px', borderRadius: 4 }}>
                {record.convertedInvoiceNumber}
              </span>
            )}
          </div>
        );
      case 'Cancelled':
        return (
          <Tag style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Cancelled
          </Tag>
        );
      case 'Expired':
        return (
          <Tag style={{ background: '#FDF2F8', color: '#9D174D', border: '1px solid #FBCFE8', borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Expired
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Proforma #',
      dataIndex: 'proformaNumber',
      key: 'proformaNumber',
      width: 140,
      render: (text: string) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: '#441A87',
            backgroundColor: '#F3EEFF',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 12,
            border: '1px solid #E9D5FF',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Sales Order',
      dataIndex: 'orderReference',
      key: 'orderReference',
      width: 130,
      render: (so: string) => (
        <span style={{ fontWeight: 600, color: '#4B5563', fontSize: 12 }}>
          {so}
        </span>
      ),
    },
    {
      title: 'Customer Details',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 220,
      render: (name: string, record: ProformaRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: 3, fontWeight: 600 }}>GSTIN:</span>
            <span style={{ fontFamily: 'monospace' }}>{record.customerGst || 'Unregistered'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'PI Date',
      dataIndex: 'piDate',
      key: 'piDate',
      width: 110,
      render: (d: string) => <span style={{ fontSize: 12, color: '#4B5563' }}>{d}</span>,
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 180,
      render: (terms: string, record: ProformaRecord) => (
        <div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#374151' }}>{terms}</span>
          <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 1 }}>
            {record.advancePercentage}% Adv Req ({record.isInterState ? 'IGST' : 'CGST+SGST'})
          </div>
        </div>
      ),
    },
    {
      title: 'Grand Total',
      key: 'grandTotal',
      width: 130,
      align: 'right' as const,
      render: (_: any, record: ProformaRecord) => {
        const { grandTotal } = calculatePITotals(record);
        return (
          <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      title: 'Advance Paid',
      key: 'advancePaid',
      width: 130,
      align: 'right' as const,
      render: (_: any, record: ProformaRecord) => {
        return (
          <div>
            <span style={{ fontWeight: 700, color: record.advancePaid > 0 ? '#0D9488' : '#9CA3AF', fontSize: 12.5 }}>
              ₹{(record.advancePaid || 0).toLocaleString('en-IN')}
            </span>
            {record.paymentMode && (
              <div style={{ fontSize: 10, color: '#6B7280' }}>{record.paymentMode}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Balance Amount',
      key: 'balanceAmount',
      width: 130,
      align: 'right' as const,
      render: (_: any, record: ProformaRecord) => {
        const { balanceAmount } = calculatePITotals(record);
        return (
          <span
            style={{
              fontWeight: 800,
              color: balanceAmount > 0 ? '#E11D48' : '#6B7280',
              fontSize: 12.5,
            }}
          >
            ₹{balanceAmount.toLocaleString('en-IN')}
          </span>
        );
      },
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 110,
      render: (v: string, record: ProformaRecord) => {
        const isPast = dayjs(v).isBefore(dayjs(), 'day');
        return (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: isPast && record.status !== 'Converted' ? '#DC2626' : '#4B5563',
            }}
          >
            {v}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_: any, record: ProformaRecord) => renderStatusBadge(record.status, record),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      fixed: 'right' as const,
      render: (_: any, record: ProformaRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* View Details */}
          <Tooltip title="View Proforma Details">
            <button
              onClick={() => {
                setSelectedPI(record);
                setViewDrawerOpen(true);
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#441A87';
                e.currentTarget.style.color = '#441A87';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Eye size={14} />
            </button>
          </Tooltip>

          {/* Edit (only if not converted) */}
          {record.status !== 'Converted' && (
            <Tooltip title="Edit Proforma">
              <button
                onClick={() => handleOpenEdit(record)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6B7280',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#441A87';
                  e.currentTarget.style.color = '#441A87';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.color = '#6B7280';
                }}
              >
                <Edit2 size={14} />
              </button>
            </Tooltip>
          )}

          {/* Download PDF simulation */}
          <Tooltip title="Download Proforma PDF">
            <button
              onClick={() => message.info(`Downloading PDF for Proforma: ${record.proformaNumber}`)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0D9488',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0D9488';
                e.currentTarget.style.background = '#F0FDFA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <Download size={14} />
            </button>
          </Tooltip>

          {/* Convert to Tax Invoice (If not yet converted) */}
          {record.status !== 'Converted' ? (
            <Tooltip title="Convert to Final Tax Invoice">
              <button
                onClick={() => handleOpenConvert(record)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid #BBF7D0',
                  background: '#F0FDF4',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#16A34A',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#16A34A';
                  e.currentTarget.style.background = '#DCFCE7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#BBF7D0';
                  e.currentTarget.style.background = '#F0FDF4';
                }}
              >
                <ArrowRight size={14} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip title={`Converted: ${record.convertedInvoiceNumber}`}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid #E9D5FF',
                  background: '#FAF5FF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B21A8',
                }}
              >
                <CheckCircle2 size={14} />
              </span>
            </Tooltip>
          )}

          {/* Delete Draft only */}
          {record.status === 'Draft' && (
            <Popconfirm
              title="Delete Proforma"
              description="Are you sure you want to delete this draft proforma?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <button
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1px solid #FEE2E2',
                  background: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#EF4444',
                }}
              >
                <Trash2 size={13} />
              </button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* 1. Page Header */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: '#441A87',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(68, 26, 135, 0.2)',
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Proforma Invoices
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Manage preliminary invoices, advance payment requests, GST calculations and conversion to final tax invoices.
            </div>
          </div>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingItemRecord(null);
            form.resetFields();
            setCreateModalOpen(true);
          }}
          style={{
            background: '#441A87',
            borderColor: '#441A87',
            borderRadius: 8,
            height: 38,
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 18px',
            boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
          }}
        >
          + Create Proforma Invoice
        </Button>
      </div>

      {/* 2. Summary Cards (Exact 4 Cards, Full Width 100% CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Card 1: Proformas Issued */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(68, 26, 135, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#441A87', textTransform: 'capitalize' }}>
              Proformas Issued
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {summaryMetrics.totalIssued}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Total preliminary invoices
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#441A87',
            }}
          >
            <FileText size={20} />
          </div>
        </div>

        {/* Card 2: Converted to Tax Invoice */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#15803D', textTransform: 'capitalize' }}>
              Converted to Tax Invoice
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {summaryMetrics.convertedCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Converted to final billing
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <FileCheck size={20} />
          </div>
        </div>

        {/* Card 3: Pending Advance */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(217, 119, 6, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309', textTransform: 'capitalize' }}>
              Pending Advance
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {summaryMetrics.pendingAdvanceCount}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Awaiting advance payment
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Clock size={20} />
          </div>
        </div>

        {/* Card 4: Outstanding Amount */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BAE6FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0369A1', textTransform: 'capitalize' }}>
              Outstanding Amount
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              ₹{(summaryMetrics.totalOutstanding / 100000).toFixed(2)}L
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Total pending balance
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284C7',
            }}
          >
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters (Single non-wrapping row) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', minWidth: 200 }}>
          <Input
            prefix={<Search size={15} style={{ color: '#9CA3AF' }} />}
            placeholder="Search by PI # / Customer / Order"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ borderRadius: 8, height: 36, fontSize: 12.5 }}
          />
        </div>

        {/* Invoice Status Filter */}
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150, height: 36 }}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Issued', value: 'Issued' },
            { label: 'Partially Paid', value: 'Partially Paid' },
            { label: 'Advance Cleared', value: 'Advance Cleared' },
            { label: 'Converted', value: 'Converted' },
            { label: 'Cancelled', value: 'Cancelled' },
            { label: 'Expired', value: 'Expired' },
          ]}
        />

        {/* Payment Status Filter */}
        <Select
          value={paymentFilter}
          onChange={setPaymentFilter}
          style={{ width: 145, height: 36 }}
          options={[
            { label: 'All Payments', value: 'All' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Partially Paid', value: 'Partially Paid' },
            { label: 'Fully Paid', value: 'Fully Paid' },
          ]}
        />

        {/* Customer Filter */}
        <Select
          value={customerFilter}
          onChange={setCustomerFilter}
          style={{ width: 180, height: 36 }}
          options={[
            { label: 'All Customers', value: 'All' },
            ...uniqueCustomers.map((c) => ({ label: c, value: c })),
          ]}
        />

        {/* Date Range Filter */}
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as any)}
          style={{ height: 36, borderRadius: 8, minWidth: 220 }}
          placeholder={['Start Date', 'End Date']}
        />

        {/* Reset Filter Button */}
        {(search || statusFilter !== 'All' || paymentFilter !== 'All' || customerFilter !== 'All' || dateRange) && (
          <Button
            icon={<RotateCcw size={14} />}
            onClick={handleResetFilters}
            style={{
              height: 36,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#6B7280',
              borderColor: '#D1D5DB',
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* 4. Proforma Invoice Management Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
            Proforma Invoices ({filteredData.length})
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Preliminary invoices do not constitute statutory tax liability until converted.
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `Total ${t} Proformas` }}
          scroll={{ x: 1480 }}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      {/* 5. Create / Edit Proforma Invoice Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 6 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#441A87',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <FileText size={17} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              {editingItemRecord ? `Edit Proforma: ${editingItemRecord.proformaNumber}` : 'Create Proforma Invoice'}
            </span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setEditingItemRecord(null);
        }}
        width={780}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setCreateModalOpen(false);
              setEditingItemRecord(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="draft"
            onClick={() => handleCreateSubmit('draft')}
            style={{ borderColor: '#6B7280', color: '#374151' }}
          >
            Save as Draft
          </Button>,
          <Button
            key="issue"
            type="primary"
            onClick={() => handleCreateSubmit('issue')}
            style={{ background: '#441A87', borderColor: '#441A87', fontWeight: 700 }}
          >
            {editingItemRecord ? 'Update Proforma' : 'Issue Proforma'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          {/* Section 1: Customer & Order Details */}
          <div style={{ fontSize: 13, fontWeight: 700, color: '#441A87', marginBottom: 12, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            1. Customer & Sales Order Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: 'Please enter customer name' }]}>
              <Input placeholder="e.g. Bharat Bio Labs Ltd" />
            </Form.Item>
            <Form.Item name="customerGst" label="Customer GSTIN" rules={[{ required: true, message: 'Please enter GSTIN' }]}>
              <Input placeholder="e.g. 33AABCB1234F1Z8" />
            </Form.Item>
            <Form.Item name="orderReference" label="Sales Order Reference">
              <Input placeholder="e.g. SO-2026-398" />
            </Form.Item>
            <Form.Item name="orderDate" label="Order Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="billingAddress" label="Billing Address" style={{ gridColumn: 'span 2' }}>
              <Input.TextArea rows={2} placeholder="Complete billing address" />
            </Form.Item>
          </div>

          {/* Section 2: Product & Commercial Item */}
          <div style={{ fontSize: 13, fontWeight: 700, color: '#441A87', marginBottom: 12, marginTop: 8, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            2. Product / Service Item & Taxation
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="sampleProduct" label="Product / Description" rules={[{ required: true, message: 'Item required' }]}>
              <Input placeholder="e.g. Cleanroom HVAC System 20TR" />
            </Form.Item>
            <Form.Item name="sampleQty" label="Quantity" initialValue={1}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="samplePrice" label="Unit Price (Excl. Tax)" initialValue={100000}>
              <InputNumber min={0} prefix="₹" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
            <Form.Item name="isInterState" label="GST Supply Type" initialValue={false}>
              <Select
                options={[
                  { label: 'Intra-State Supply (CGST 9% + SGST 9%)', value: false },
                  { label: 'Inter-State Supply (IGST 18%)', value: true },
                ]}
              />
            </Form.Item>
            <Form.Item name="salesExecutive" label="Sales Executive" initialValue="Vikram Seth">
              <Input />
            </Form.Item>
          </div>

          {/* Section 3: Payment & Advance Tracking */}
          <div style={{ fontSize: 13, fontWeight: 700, color: '#441A87', marginBottom: 12, marginTop: 8, borderBottom: '1px solid #F3F4F6', paddingBottom: 6 }}>
            3. Payment Terms & Advance Tracking
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 16px' }}>
            <Form.Item name="paymentTerms" label="Payment Terms" initialValue="50% Advance with Order">
              <Select
                options={[
                  { label: '100% Advance Clearance', value: '100% Advance Prior to Dispatch' },
                  { label: '50% Advance, Balance on Dispatch', value: '50% Advance, Balance on Dispatch' },
                  { label: '30% Advance, 70% Net 30', value: '30% Advance, 70% Net 30' },
                  { label: 'Letter of Credit (LC)', value: 'Letter of Credit 60 Days' },
                ]}
              />
            </Form.Item>
            <Form.Item name="advancePercentage" label="Advance Req (%)" initialValue={50}>
              <InputNumber min={0} max={100} addonAfter="%" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="advancePaid" label="Initial Advance Paid (₹)" initialValue={0}>
              <InputNumber min={0} prefix="₹" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="piDate" label="PI Issue Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="validUntil" label="Valid Until" initialValue={dayjs().add(30, 'day')}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="termsAndNotes" label="Terms & Notes">
            <Input.TextArea
              rows={2}
              placeholder="Terms of supply, freight charges, warranty conditions, payment bank details"
              defaultValue="This proforma invoice is issued for advance payment authorization. Final statutory Tax Invoice will be issued upon dispatch."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 6. Proforma Details Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={18} color="#441A87" />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                Proforma: {selectedPI?.proformaNumber}
              </span>
            </div>
            {selectedPI && renderStatusBadge(selectedPI.status, selectedPI)}
          </div>
        }
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        width={620}
      >
        {selectedPI && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Actions Header */}
            <div style={{ display: 'flex', gap: 10, paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
              <Button
                icon={<Printer size={15} />}
                onClick={() => message.info(`Printing Proforma ${selectedPI.proformaNumber}`)}
              >
                Print
              </Button>
              <Button
                icon={<Download size={15} />}
                onClick={() => message.info(`Downloading Proforma PDF`)}
              >
                Download PDF
              </Button>
              {selectedPI.status !== 'Converted' && (
                <Button
                  type="primary"
                  icon={<ArrowRight size={15} />}
                  onClick={() => {
                    setViewDrawerOpen(false);
                    handleOpenConvert(selectedPI);
                  }}
                  style={{ background: '#16A34A', borderColor: '#16A34A', fontWeight: 700 }}
                >
                  Convert to Tax Invoice
                </Button>
              )}
            </div>

            {/* Customer Info Card */}
            <div style={{ background: '#FAF5FF', padding: '14px 18px', borderRadius: 10, border: '1px solid #E9D5FF' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#441A87', textTransform: 'uppercase' }}>
                Customer & GST Information
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1F2937', marginTop: 4 }}>
                {selectedPI.customerName}
              </div>
              <div style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>
                GSTIN: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedPI.customerGst}</span>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                Billing Address: {selectedPI.billingAddress}
              </div>
            </div>

            {/* Sales Order & Timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Sales Order Ref</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>{selectedPI.orderReference}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Date: {selectedPI.orderDate}</div>
              </div>
              <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Validity Period</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>Valid until {selectedPI.validUntil}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Issued on: {selectedPI.piDate}</div>
              </div>
            </div>

            {/* Items Breakdown */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginBottom: 10 }}>
                Products & Line Items
              </div>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#4B5563' }}>
                      <th style={{ padding: '8px 12px' }}>Item</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Rate</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPI.items.map((it) => {
                      const itemCalc = calculateItemTotals(it);
                      return (
                        <tr key={it.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '8px 12px' }}>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{it.productName}</div>
                            <div style={{ fontSize: 10.5, color: '#6B7280' }}>SKU: {it.sku} | GST {it.gstRate}%</div>
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>{it.qty}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{it.unitPrice.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                            ₹{itemCalc.taxable.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GST & Totals Summary */}
            {(() => {
              const totals = calculatePITotals(selectedPI);
              return (
                <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                    <span>Taxable Value:</span>
                    <span style={{ fontWeight: 600 }}>₹{totals.taxable.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedPI.isInterState ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                      <span>Integrated GST (IGST 18%):</span>
                      <span style={{ fontWeight: 600 }}>₹{totals.igst.toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                        <span>Central GST (CGST 9%):</span>
                        <span style={{ fontWeight: 600 }}>₹{totals.cgst.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 6 }}>
                        <span>State GST (SGST 9%):</span>
                        <span style={{ fontWeight: 600 }}>₹{totals.sgst.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#111827' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: '#10B981' }}>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ margin: '14px 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    Advance & Payment Status
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 4 }}>
                    <span>Advance Required ({selectedPI.advancePercentage}%):</span>
                    <span style={{ fontWeight: 700, color: '#441A87' }}>₹{totals.advanceRequired.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4B5563', marginBottom: 4 }}>
                    <span>Advance Received to Date:</span>
                    <span style={{ fontWeight: 700, color: '#0D9488' }}>₹{(selectedPI.advancePaid || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#E11D48', marginTop: 4 }}>
                    <span>Pending Outstanding Amount:</span>
                    <span>₹{totals.balanceAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })()}

            {/* Notes & Conversions */}
            {selectedPI.convertedInvoiceNumber && (
              <div style={{ background: '#ECFDF5', padding: '12px 16px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>
                  Converted to Tax Invoice: {selectedPI.convertedInvoiceNumber}
                </div>
                <div style={{ fontSize: 11.5, color: '#047857', marginTop: 2 }}>
                  Conversion finalized on {selectedPI.convertedDate}. Final tax invoice is enforceable in statutory books.
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 7. Convert to Final Tax Invoice Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <FileCheck size={18} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
              Convert to Final Tax Invoice
            </span>
          </div>
        }
        open={convertModalOpen}
        onCancel={() => {
          setConvertModalOpen(false);
          setPiToConvert(null);
        }}
        onOk={handleConfirmConvert}
        okText="Confirm & Convert"
        okButtonProps={{ style: { background: '#16A34A', borderColor: '#16A34A', fontWeight: 700 } }}
        width={520}
      >
        {piToConvert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5 }}>
              Are you sure you want to convert Proforma Invoice <strong>{piToConvert.proformaNumber}</strong> into an official statutory <strong>Tax Invoice</strong>?
            </p>
            <div style={{ background: '#F9FAFB', padding: 14, borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Customer: <strong>{piToConvert.customerName}</strong></div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                Grand Total: <strong style={{ color: '#10B981' }}>₹{calculatePITotals(piToConvert).grandTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                Advance Paid: <strong style={{ color: '#0D9488' }}>₹{(piToConvert.advancePaid || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                Generated Tax Invoice #: <strong>{`INV-2026-${1050 + data.filter((d) => d.status === 'Converted').length + 1}`}</strong>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>
              Note: Once converted, the proforma status will change to Converted and cannot be converted again.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
