import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Select,
  Tabs,
  Space,
  Tooltip,
  message,
} from 'antd';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  FileCheck,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
} from 'lucide-react';

const BRAND_PURPLE = '#5421A8';

export const GstReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [activeReportTab, setActiveReportTab] = useState<'gstr1' | 'gstr3b' | 'gstr2b' | 'hsn'>('gstr1');

  // GSTR-1 Outward Supplies Mock Data
  const gstr1Data = [
    {
      key: 'b2b',
      tableNo: '4A, 4B, 6B, 6C',
      description: 'B2B Invoices (Taxable Outward Supplies)',
      count: 42,
      taxableValue: 4520000,
      igst: 420000,
      cgst: 196800,
      sgst: 196800,
      cess: 0,
      totalTax: 813600,
    },
    {
      key: 'b2cl',
      tableNo: '5A, 5B',
      description: 'B2C (Large) Invoices (Inter-State > ₹2.5 Lakhs)',
      count: 6,
      taxableValue: 1850000,
      igst: 333000,
      cgst: 0,
      sgst: 0,
      cess: 0,
      totalTax: 333000,
    },
    {
      key: 'b2cs',
      tableNo: '7',
      description: 'B2C (Small) Invoices (Intra-State / Net of Cr/Dr)',
      count: 128,
      taxableValue: 980000,
      igst: 0,
      cgst: 88200,
      sgst: 88200,
      cess: 0,
      totalTax: 176400,
    },
    {
      key: 'cdnr',
      tableNo: '9B',
      description: 'Credit / Debit Notes (Registered)',
      count: 5,
      taxableValue: -150000,
      igst: -12000,
      cgst: -7500,
      sgst: -7500,
      cess: 0,
      totalTax: -27000,
    },
    {
      key: 'exp',
      tableNo: '6A',
      description: 'Exports (With / Without Payment of Tax)',
      count: 2,
      taxableValue: 850000,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
      totalTax: 0,
    },
  ];

  // GSTR-3B Summary Data
  const gstr3bData = [
    {
      key: '3.1.a',
      natureOfSupply: 'Outward taxable supplies (other than zero rated, nil and exempted)',
      taxableValue: 7200000,
      igst: 741000,
      cgst: 277500,
      sgst: 277500,
      cess: 0,
    },
    {
      key: '3.1.b',
      natureOfSupply: 'Outward taxable supplies (zero rated)',
      taxableValue: 850000,
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
    },
    {
      key: '3.1.d',
      natureOfSupply: 'Inward supplies liable to reverse charge (RCM)',
      taxableValue: 120000,
      igst: 0,
      cgst: 10800,
      sgst: 10800,
      cess: 0,
    },
    {
      key: '4.a',
      natureOfSupply: 'Eligible ITC - Inward supplies from ISD & Registered Suppliers',
      taxableValue: 4890000,
      igst: 520000,
      cgst: 180000,
      sgst: 180000,
      cess: 0,
    },
  ];

  // GSTR-2B Inward ITC Reconciliation Data
  const gstr2bData = [
    {
      key: '1',
      supplierGstin: '27AABCV8910Q1ZZ',
      supplierName: 'V-Trans Logistics Ltd',
      invoiceNo: 'VT-88910',
      invoiceDate: '2026-11-04',
      taxableValue: 145000,
      itcAvailable: 'Yes',
      cgst: 13050,
      sgst: 13050,
      igst: 0,
      matchStatus: 'Matched',
    },
    {
      key: '2',
      supplierGstin: '27AAACS1092P1ZT',
      supplierName: 'Safexpress Private Ltd',
      invoiceNo: 'EXP-10928',
      invoiceDate: '2026-11-08',
      taxableValue: 320000,
      itcAvailable: 'Yes',
      cgst: 28800,
      sgst: 28800,
      igst: 0,
      matchStatus: 'Matched',
    },
    {
      key: '3',
      supplierGstin: '29AAACL0204P1Z4',
      supplierName: 'L&T Infotech Spares',
      invoiceNo: 'LT-00291',
      invoiceDate: '2026-11-12',
      taxableValue: 560000,
      itcAvailable: 'Yes',
      cgst: 0,
      sgst: 0,
      igst: 100800,
      matchStatus: 'Matched',
    },
    {
      key: '4',
      supplierGstin: '06AAACJ8819P1ZU',
      supplierName: 'Jindal Steel & Alloys',
      invoiceNo: 'JSA-8821',
      invoiceDate: '2026-11-15',
      taxableValue: 780000,
      itcAvailable: 'Pending 2B Push',
      cgst: 0,
      sgst: 0,
      igst: 140400,
      matchStatus: 'In Books Only',
    },
  ];

  // HSN Summary
  const hsnSummaryData = [
    {
      key: '1',
      hsnCode: '84713010',
      description: 'Portable Digital Automatic Data Processing Machines',
      uqc: 'NOS',
      qty: 120,
      taxableValue: 4800000,
      rate: '18%',
      igst: 540000,
      cgst: 162000,
      sgst: 162000,
    },
    {
      key: '2',
      hsnCode: '85044090',
      description: 'Static Converters and Inverter Assemblies',
      uqc: 'SET',
      qty: 85,
      taxableValue: 2450000,
      rate: '18%',
      igst: 245000,
      cgst: 98000,
      sgst: 98000,
    },
    {
      key: '3',
      hsnCode: '998313',
      description: 'IT Network Infrastructure and Maintenance Services',
      uqc: 'OTH',
      qty: 15,
      taxableValue: 800000,
      rate: '18%',
      igst: 72000,
      cgst: 36000,
      sgst: 36000,
    },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">GST Reports & Tax Filing Returns</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reconcile outward supplies (GSTR-1), monthly tax liability (GSTR-3B), and auto-drafted ITC (GSTR-2B)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="w-48"
            options={[
              { value: '2026-11', label: 'November 2026' },
              { value: '2026-10', label: 'October 2026' },
              { value: '2026-09', label: 'September 2026' },
            ]}
          />
          <Button
            type="primary"
            icon={<Download size={14} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE }}
            onClick={() => message.success(`Exporting GSTR-1 & 3B JSON files for ${selectedMonth}`)}
          >
            Export GST JSON
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total Taxable Turnover</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">₹80.50 L</h3>
              <p className="text-xs text-slate-500 mt-1">For November 2026</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <TrendingUp size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Outward Tax (Liability)</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">₹12.96 L</h3>
              <p className="text-xs text-rose-700 font-semibold mt-1">GSTR-1 Outward Supplies</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Percent size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Eligible ITC (GSTR-2B)</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">₹8.80 L</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Available for tax set-off</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle size={24} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Net Tax Payable (Cash)</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">₹4.16 L</h3>
              <p className="text-xs text-blue-700 font-semibold mt-1">PMT-06 Challan payment</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileCheck size={24} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Tabbed Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <Tabs
          activeKey={activeReportTab}
          onChange={(key) => setActiveReportTab(key as any)}
          items={[
            {
              key: 'gstr1',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <FileText size={16} /> GSTR-1 (Outward Supplies)
                </span>
              ),
            },
            {
              key: 'gstr3b',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <FileCheck size={16} /> GSTR-3B (Monthly Summary)
                </span>
              ),
            },
            {
              key: 'gstr2b',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <Layers size={16} /> GSTR-2B (ITC Matching)
                </span>
              ),
            },
            {
              key: 'hsn',
              label: (
                <span className="flex items-center gap-2 font-semibold">
                  <Calendar size={16} /> HSN / SAC Summary
                </span>
              ),
            },
          ]}
        />

        {activeReportTab === 'gstr1' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Table-wise Outward Supplies Summary (GSTR-1 Format)
              </span>
              <Button
                size="small"
                icon={<Download size={13} />}
                onClick={() => message.success('Exporting GSTR-1 Excel Report...')}
              >
                Export Excel
              </Button>
            </div>
            <Table
              dataSource={gstr1Data}
              rowKey="key"
              pagination={false}
              columns={[
                { title: 'Table #', dataIndex: 'tableNo', key: 'tableNo', render: (t) => <Tag color="purple">{t}</Tag> },
                { title: 'Description', dataIndex: 'description', key: 'description' },
                { title: 'Count', dataIndex: 'count', key: 'count', align: 'center' },
                {
                  title: 'Taxable Value',
                  dataIndex: 'taxableValue',
                  key: 'taxableValue',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'IGST',
                  dataIndex: 'igst',
                  key: 'igst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'CGST',
                  dataIndex: 'cgst',
                  key: 'cgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'SGST',
                  dataIndex: 'sgst',
                  key: 'sgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'Total Tax',
                  dataIndex: 'totalTax',
                  key: 'totalTax',
                  align: 'right',
                  render: (v) => (
                    <span className="font-bold text-slate-900">₹{v.toLocaleString('en-IN')}</span>
                  ),
                },
              ]}
            />
          </div>
        )}

        {activeReportTab === 'gstr3b' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">
                GSTR-3B Self-Assessed Tax Liability & Input Tax Credit
              </span>
              <Button
                size="small"
                icon={<Download size={13} />}
                onClick={() => message.success('Exporting GSTR-3B PDF Report...')}
              >
                Export 3B PDF
              </Button>
            </div>
            <Table
              dataSource={gstr3bData}
              rowKey="key"
              pagination={false}
              columns={[
                { title: 'Section', dataIndex: 'key', key: 'key', render: (k) => <Tag color="blue">{k}</Tag> },
                { title: 'Nature of Supplies', dataIndex: 'natureOfSupply', key: 'natureOfSupply' },
                {
                  title: 'Taxable Value',
                  dataIndex: 'taxableValue',
                  key: 'taxableValue',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'Integrated Tax (IGST)',
                  dataIndex: 'igst',
                  key: 'igst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'Central Tax (CGST)',
                  dataIndex: 'cgst',
                  key: 'cgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'State/UT Tax (SGST)',
                  dataIndex: 'sgst',
                  key: 'sgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
              ]}
            />
          </div>
        )}

        {activeReportTab === 'gstr2b' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">
                GSTR-2B Auto-Drafted ITC vs Inward Purchase Register Matching
              </span>
              <Button
                size="small"
                icon={<Download size={13} />}
                onClick={() => message.success('Exporting ITC Reconciliation...')}
              >
                Export Reconciliation
              </Button>
            </div>
            <Table
              dataSource={gstr2bData}
              rowKey="key"
              pagination={false}
              columns={[
                { title: 'Supplier GSTIN', dataIndex: 'supplierGstin', key: 'supplierGstin', render: (g) => <span className="font-mono text-purple-800 text-xs">{g}</span> },
                { title: 'Supplier Trade Name', dataIndex: 'supplierName', key: 'supplierName' },
                { title: 'Invoice #', dataIndex: 'invoiceNo', key: 'invoiceNo' },
                { title: 'Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
                {
                  title: 'Taxable Value',
                  dataIndex: 'taxableValue',
                  key: 'taxableValue',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'ITC Status',
                  dataIndex: 'itcAvailable',
                  key: 'itcAvailable',
                  render: (st) => (
                    <Tag color={st === 'Yes' ? 'success' : 'warning'}>{st}</Tag>
                  ),
                },
                {
                  title: 'Recon Match',
                  dataIndex: 'matchStatus',
                  key: 'matchStatus',
                  render: (m) => (
                    <Tag color={m === 'Matched' ? 'blue' : 'orange'}>{m}</Tag>
                  ),
                },
              ]}
            />
          </div>
        )}

        {activeReportTab === 'hsn' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">
                HSN / SAC Summary of Outward Supplies
              </span>
              <Button
                size="small"
                icon={<Download size={13} />}
                onClick={() => message.success('Exporting HSN Summary...')}
              >
                Export HSN Summary
              </Button>
            </div>
            <Table
              dataSource={hsnSummaryData}
              rowKey="key"
              pagination={false}
              columns={[
                { title: 'HSN / SAC Code', dataIndex: 'hsnCode', key: 'hsnCode', render: (c) => <span className="font-mono font-bold text-slate-900">{c}</span> },
                { title: 'Description', dataIndex: 'description', key: 'description' },
                { title: 'UQC', dataIndex: 'uqc', key: 'uqc', align: 'center' },
                { title: 'Total Qty', dataIndex: 'qty', key: 'qty', align: 'right' },
                {
                  title: 'Taxable Value',
                  dataIndex: 'taxableValue',
                  key: 'taxableValue',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                { title: 'Rate', dataIndex: 'rate', key: 'rate', align: 'center' },
                {
                  title: 'IGST',
                  dataIndex: 'igst',
                  key: 'igst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'CGST',
                  dataIndex: 'cgst',
                  key: 'cgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
                {
                  title: 'SGST',
                  dataIndex: 'sgst',
                  key: 'sgst',
                  align: 'right',
                  render: (v) => `₹${v.toLocaleString('en-IN')}`,
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
