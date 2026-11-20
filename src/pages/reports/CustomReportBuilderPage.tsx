import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Card,
  Checkbox,
  Space,
  message,
  Divider,
} from 'antd';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Play,
  Save,
  CheckCircle,
  Database,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_PURPLE = '#5421A8';

const DATA_SOURCES = [
  { value: 'sales_orders', label: 'Sales Orders & Invoices (GST Compliant)' },
  { value: 'purchase_bills', label: 'Purchase Invoices, GRN & Vendors' },
  { value: 'inventory_ledger', label: 'Inventory Stock, Batches & Warehouses' },
  { value: 'customers_receivables', label: 'Customers, Aging & Receivables' },
  { value: 'hr_payroll', label: 'HR Attendance, Salaries & Statutory Dues' },
];

const AVAILABLE_FIELDS: Record<string, string[]> = {
  sales_orders: ['Order Number', 'Invoice Number', 'Customer Name', 'GSTIN', 'Order Date', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Gross Amount', 'Payment Status', 'Dispatch City'],
  purchase_bills: ['PO Number', 'Bill Number', 'Supplier Name', 'Supplier GSTIN', 'Bill Date', 'GRN Ref', 'Taxable Amount', 'Input GST (ITC)', 'Gross Total', 'Payment Status'],
  inventory_ledger: ['SKU Code', 'Product Name', 'Category', 'Warehouse', 'Batch/Serial #', 'Qty on Hand', 'Unit Valuation', 'Total Asset Value', 'Reorder Level'],
  customers_receivables: ['Customer Name', 'Customer Code', 'Credit Limit', 'Total Invoiced', 'Total Paid', 'Outstanding Balance', 'Aging Bucket (0-30/30-60/90+)', 'State Code'],
  hr_payroll: ['Employee Code', 'Employee Name', 'Department', 'Designation', 'Gross Salary', 'Basic', 'HRA', 'PF Contribution', 'ESI', 'Professional Tax', 'Net Disbursed'],
};

export const CustomReportBuilderPage: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState('sales_orders');
  const [selectedFields, setSelectedFields] = useState<string[]>(['Order Number', 'Customer Name', 'Order Date', 'Gross Amount', 'Payment Status']);
  const [dateRange, setDateRange] = useState('CURRENT_QUARTER');
  const [generatedData, setGeneratedData] = useState<any[]>([]);

  const handleRunReport = () => {
    // Generate realistic dynamic rows matching chosen fields
    const mockRows = [
      {
        key: '1',
        'Order Number': 'SO-2026-901',
        'Invoice Number': 'INV-2026-0881',
        'Customer Name': 'Apex Industrial Hydraulics',
        GSTIN: '33AAACA9922M1Z2',
        'Order Date': '2026-11-18',
        'Taxable Value': '₹3,50,000',
        CGST: '₹31,500',
        SGST: '₹31,500',
        IGST: '₹0',
        'Gross Amount': '₹4,13,000',
        'Payment Status': 'Paid (NEFT)',
        'Dispatch City': 'Chennai',
      },
      {
        key: '2',
        'Order Number': 'SO-2026-902',
        'Invoice Number': 'INV-2026-0882',
        'Customer Name': 'Deccan Electro-Mechanicals Ltd',
        GSTIN: '33AABCD4455E1Z7',
        'Order Date': '2026-11-19',
        'Taxable Value': '₹1,80,000',
        CGST: '₹16,200',
        SGST: '₹16,200',
        IGST: '₹0',
        'Gross Amount': '₹2,12,400',
        'Payment Status': 'Pending (Due 30d)',
        'Dispatch City': 'Coimbatore',
      },
      {
        key: '3',
        'Order Number': 'SO-2026-903',
        'Invoice Number': 'INV-2026-0883',
        'Customer Name': 'Southern Precision Foundries',
        GSTIN: '33AABCS8899F1Z1',
        'Order Date': '2026-11-19',
        'Taxable Value': '₹5,20,000',
        CGST: '₹0',
        SGST: '₹0',
        IGST: '₹93,600',
        'Gross Amount': '₹6,13,600',
        'Payment Status': 'Partially Paid',
        'Dispatch City': 'Bengaluru',
      },
    ];
    setGeneratedData(mockRows);
    message.success('Custom ad-hoc query compiled and executed successfully!');
  };

  const dynamicColumns = selectedFields.map((field) => ({
    title: field,
    dataIndex: field,
    key: field,
    render: (val: any) => {
      if (typeof val === 'string' && val.includes('₹')) {
        return <span style={{ fontWeight: 800, color: '#0F172A' }}>{val}</span>;
      }
      if (val === 'Paid (NEFT)') return <Tag color="green">{val}</Tag>;
      if (val === 'Pending (Due 30d)') return <Tag color="gold">{val}</Tag>;
      return val || '-';
    },
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Custom Report Builder & Query Studio"
        subtitle="Design ad-hoc operational reports, multi-table cross queries, custom column aggregations, and automated Excel/PDF scheduling."
        icon={<FileSpreadsheet size={20} />}
        primaryActionLabel="Export to Excel (.xlsx)"
        primaryActionIcon={<Download size={15} />}
        onPrimaryAction={() => message.success('Custom report exported to Excel!')}
      />

      {/* 2. 4 Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Report Datasets',
            value: '5 Unified Stores',
            growth: 'Real-time ERP Data',
            isDark: true,
            icon: <Database size={20} color={BRAND_PURPLE} />,
            pillExtra: 'GST & Statutory',
          },
          {
            title: 'Columns Selected',
            value: `${selectedFields.length} Fields`,
            growth: 'Custom Dimension',
            isDark: false,
            icon: <BarChart3 size={20} color="#3B82F6" />,
            pillExtra: 'Active Schema',
          },
          {
            title: 'Query Speed',
            value: '18 ms',
            growth: 'Indexed Memory Store',
            isDark: true,
            icon: <Play size={20} color="#10B981" />,
            pillExtra: 'Instant Generation',
          },
          {
            title: 'Saved Templates',
            value: '14 Saved',
            growth: 'Scheduled to Email',
            isDark: false,
            icon: <Save size={20} color="#F59E0B" />,
            pillExtra: 'Weekly Automation',
          },
        ]}
      />

      {/* 3. Query Studio Controls */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Primary ERP Dataset:
            </span>
            <Select
              value={selectedSource}
              onChange={(val) => {
                setSelectedSource(val);
                setSelectedFields(AVAILABLE_FIELDS[val].slice(0, 5));
              }}
              style={{ width: '100%' }}
              options={DATA_SOURCES}
            />
          </Col>
          <Col xs={24} md={8}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Reporting Time Window:
            </span>
            <Select
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              options={[
                { value: 'CURRENT_QUARTER', label: 'Current Financial Quarter (Q3 2026-27)' },
                { value: 'CURRENT_MONTH', label: 'Current Month (November 2026)' },
                { value: 'YEAR_TO_DATE', label: 'Financial Year to Date (FY 2026-27)' },
                { value: 'LAST_MONTH', label: 'Previous Month (October 2026)' },
              ]}
            />
          </Col>
          <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              type="primary"
              icon={<Play size={15} />}
              onClick={handleRunReport}
              style={{
                width: '100%',
                height: 38,
                backgroundColor: BRAND_PURPLE,
                borderColor: BRAND_PURPLE,
                fontWeight: 700,
                borderRadius: 12,
              }}
            >
              Execute Query & Generate Data
            </Button>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0' }} />

        {/* Checkbox fields selection */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8 }}>
            Choose Output Columns ({selectedFields.length} selected):
          </span>
          <Checkbox.Group
            value={selectedFields}
            onChange={(checkedValues) => setSelectedFields(checkedValues as string[])}
            style={{ width: '100%' }}
          >
            <Row gutter={[12, 10]}>
              {AVAILABLE_FIELDS[selectedSource]?.map((field) => (
                <Col xs={12} sm={8} md={6} key={field}>
                  <Checkbox value={field}>
                    <span style={{ fontSize: 12.5 }}>{field}</span>
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </div>

      {/* 4. Table Result */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
            Query Results Preview ({generatedData.length > 0 ? generatedData.length : 'Click Execute Query to load'})
          </span>
          <Space>
            <Button size="small" onClick={() => message.success('Report schema saved as template!')}>
              Save Query Template
            </Button>
          </Space>
        </div>

        <Table
          columns={dynamicColumns}
          dataSource={generatedData.length > 0 ? generatedData : []}
          pagination={{ pageSize: 5 }}
          size="middle"
          locale={{ emptyText: 'Configure columns above and click "Execute Query & Generate Data"' }}
        />
      </div>
    </div>
  );
};

export default CustomReportBuilderPage;
