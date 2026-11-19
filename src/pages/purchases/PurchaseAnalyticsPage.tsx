import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Tabs,
  Card,
  Row,
  Col,
  Select,
  Progress,
  message,
} from 'antd';
import {
  TrendingUp,
  BarChart3,
  Building,
  Users,
  Award,
  Package,
  Layers,
  DollarSign,
  FileSpreadsheet,
  Download,
  Percent,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export const PurchaseAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dept-comp');

  // Tab 1: Department Comparison
  const deptComparison = [
    { key: '1', dept: 'Manufacturing & Production', head: 'Rajesh Khanna', orders: 58, qty: 1420, spend: 2450000, avgPrice: 1725, util: 81.6 },
    { key: '2', dept: 'R&D and Engineering', head: 'Dr. S. Ramanathan', orders: 32, qty: 380, spend: 1120000, avgPrice: 2947, util: 74.6 },
    { key: '3', dept: 'Operations & Maintenance', head: 'Gokul Chandran', orders: 28, qty: 890, spend: 780000, avgPrice: 876, util: 78.0 },
    { key: '4', dept: 'IT & Infrastructure', head: 'Kavitha Murugan', orders: 16, qty: 120, spend: 380000, avgPrice: 3166, util: 63.3 },
  ];

  // Tab 2: Department Head Performance
  const headPerformance = [
    { key: '1', head: 'Rajesh Khanna', dept: 'Manufacturing', orders: 58, qty: 1420, spend: 2450000, lowPrice: 12500, highPrice: 14200, savings: 184000 },
    { key: '2', head: 'Dr. S. Ramanathan', dept: 'R&D', orders: 32, qty: 380, spend: 1120000, lowPrice: 180000, highPrice: 195000, savings: 92000 },
    { key: '3', head: 'Gokul Chandran', dept: 'Operations', orders: 28, qty: 890, spend: 780000, lowPrice: 4500, highPrice: 5200, savings: 54000 },
  ];

  // Tab 3: Employee-Wise Purchases
  const employeePurchases = [
    { key: '1', emp: 'Suresh Varma', dept: 'Manufacturing', head: 'Rajesh Khanna', supplier: 'Lakshmi Precision', brand: 'Lakshmi Pro', product: 'Pump Housing Casings', qty: 40, unitPrice: 12500, total: 500000 },
    { key: '2', emp: 'Karthik Raja', dept: 'R&D', head: 'Dr. S. Ramanathan', supplier: 'Bharat Hydraulic', brand: 'BharatDrive', product: 'Piston Pump 75kW', qty: 4, unitPrice: 180000, total: 720000 },
    { key: '3', emp: 'Deepa Natarajan', dept: 'Operations', head: 'Gokul Chandran', supplier: 'Delta Pneumatics', brand: 'DeltaPure', product: 'Air Valves 1/2"', qty: 60, unitPrice: 4500, total: 270000 },
  ];

  // Tab 4: Brand-Wise Analysis
  const brandAnalysis = [
    { key: '1', brand: 'BharatDrive', products: 12, qty: 140, totalVal: 1850000, avgPrice: 13214 },
    { key: '2', brand: 'Lakshmi Pro', products: 8, qty: 520, totalVal: 1420000, avgPrice: 2730 },
    { key: '3', brand: 'DeltaPure', products: 15, qty: 680, totalVal: 980000, avgPrice: 1441 },
    { key: '4', brand: 'ApexSteel', products: 6, qty: 850, totalVal: 600000, avgPrice: 705 },
  ];

  // Tab 5: Product-Wise Analysis
  const productAnalysis = [
    { key: '1', product: 'Ductile Iron Pump Housing Casings', sku: 'CAS-DIP-84', brand: 'Lakshmi Pro', dept: 'Manufacturing', qty: 520, low: 12500, high: 14200, avgUnitCost: 12950 },
    { key: '2', product: 'High Pressure Variable Piston Pump 75kW', sku: 'PMP-PST-75K', brand: 'BharatDrive', dept: 'R&D', qty: 14, low: 180000, high: 195000, avgUnitCost: 183500 },
    { key: '3', product: 'Solenoid Directional Air Valves (1/2")', sku: 'VLV-SLN-050', brand: 'DeltaPure', dept: 'Operations', qty: 680, low: 4500, high: 5200, avgUnitCost: 4720 },
  ];

  // Tab 6: Supplier Comparison
  const supplierComparison = [
    { key: '1', supplier: 'Bharat Hydraulic Drives', location: 'Chennai', products: 12, brands: 2, orders: 26, totalVal: 5820000, avgPrice: 14200 },
    { key: '2', supplier: 'Lakshmi Precision Castings', location: 'Bangalore', products: 8, brands: 2, orders: 18, totalVal: 3450000, avgPrice: 3200 },
    { key: '3', supplier: 'Delta Pneumatic Systems', location: 'Pune', products: 15, brands: 2, orders: 14, totalVal: 1980000, avgPrice: 1850 },
  ];

  // Tab 7: Purchase Price Comparison
  const priceComparison = [
    { key: '1', product: 'Pump Housing Casings', brand: 'Lakshmi Pro', sku: 'CAS-DIP-84', dept: 'Manufacturing', head: 'Rajesh Khanna', supplier: 'Lakshmi Castings', loc: 'Bangalore', date: '2026-11-12', qty: 40, origPrice: 14000, negPrice: 12500, finalCost: 14750 },
    { key: '2', product: 'Piston Pump 75kW', brand: 'BharatDrive', sku: 'PMP-PST-75K', dept: 'R&D', head: 'Dr. Ramanathan', supplier: 'Bharat Hydraulics', loc: 'Chennai', date: '2026-11-14', qty: 4, origPrice: 195000, negPrice: 180000, finalCost: 212400 },
  ];

  // Tab 8: Savings & Cost Variance
  const savingsVariance = [
    { key: '1', benchmark: 14000, actual: 12500, diff: -1500, variancePercent: '-10.7%', actualSavings: 60000, potentialSavings: 84000 },
    { key: '2', benchmark: 195000, actual: 180000, diff: -15000, variancePercent: '-7.7%', actualSavings: 60000, potentialSavings: 92000 },
    { key: '3', benchmark: 5000, actual: 4500, diff: -500, variancePercent: '-10.0%', actualSavings: 30000, potentialSavings: 42000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Purchase & Procurement Analytics"
        subtitle="Comprehensive business intelligence across departments, department heads, employee negotiators, suppliers, price trends, and actual vs potential savings."
        icon={<TrendingUp size={20} />}
        searchPlaceholder="Filter analytics matrix..."
        primaryActionLabel="Export Analytics Sheet"
        onPrimaryAction={() => message.success('Exporting Procurement BI Workbook (Excel)...')}
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Actual Cost Savings',
            value: '₹3.30 Lakhs',
            growth: '9.2% Variance',
            isDark: true,
            icon: <Award size={20} color="#5421A8" />,
          },
          {
            title: 'Monitored Divisions',
            value: '4 Divisions',
            growth: 'Budget Tracked',
            isDark: false,
            icon: <Building size={20} color="#10B981" />,
          },
          {
            title: 'Suppliers Benchmarked',
            value: '28 Vendors',
            growth: 'Pan-India Comp',
            isDark: true,
            icon: <Users size={20} color="#F59E0B" />,
          },
          {
            title: 'Potential Unlocked',
            value: '₹1.80 Lakhs',
            growth: 'Volume Rebates',
            isPositive: true,
            isDark: false,
            icon: <Percent size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* Tabs Container */}
      <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #ECE8F6', padding: '16px 20px', overflow: 'hidden' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'dept-comp',
              label: '1. Department Comparison',
              children: (
                <Table
                  dataSource={deptComparison}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Department Name', dataIndex: 'dept', key: 'dept', render: (t) => <strong>{t}</strong> },
                    { title: 'Department Head', dataIndex: 'head', key: 'head' },
                    { title: 'Total Orders', dataIndex: 'orders', key: 'orders', align: 'center', render: (o) => <Tag color="purple">{o} POs</Tag> },
                    { title: 'Total Qty', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Total Purchase Amount', dataIndex: 'spend', key: 'spend', render: (s) => <strong style={{ color: '#5421A8' }}>₹{s.toLocaleString()}</strong> },
                    { title: 'Avg Price / Unit', dataIndex: 'avgPrice', key: 'avgPrice', render: (p) => `₹${p.toLocaleString()}` },
                    { title: 'Budget Utilization', dataIndex: 'util', key: 'util', render: (u) => <Progress percent={u} size="small" strokeColor="#7544D6" /> },
                  ]}
                />
              ),
            },
            {
              key: 'dept-head',
              label: '2. Department Head Performance',
              children: (
                <Table
                  dataSource={headPerformance}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Department Head Name', dataIndex: 'head', key: 'head', render: (t) => <strong>{t}</strong> },
                    { title: 'Department', dataIndex: 'dept', key: 'dept' },
                    { title: 'Total POs', dataIndex: 'orders', key: 'orders', align: 'center' },
                    { title: 'Quantity Purchased', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Total Spending', dataIndex: 'spend', key: 'spend', render: (s) => <strong>₹{s.toLocaleString()}</strong> },
                    { title: 'Lowest Price', dataIndex: 'lowPrice', key: 'lowPrice', render: (p) => <span style={{ color: '#16A34A' }}>₹{p.toLocaleString()}</span> },
                    { title: 'Highest Price', dataIndex: 'highPrice', key: 'highPrice', render: (p) => <span style={{ color: '#EF4444' }}>₹{p.toLocaleString()}</span> },
                    { title: 'Actual Savings', dataIndex: 'savings', key: 'savings', render: (s) => <Tag color="success" style={{ fontWeight: 800 }}>+₹{s.toLocaleString()}</Tag> },
                  ]}
                />
              ),
            },
            {
              key: 'emp-purchases',
              label: '3. Employee-Wise Purchases',
              children: (
                <Table
                  dataSource={employeePurchases}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Employee Name', dataIndex: 'emp', key: 'emp', render: (t) => <strong>{t}</strong> },
                    { title: 'Department', dataIndex: 'dept', key: 'dept' },
                    { title: 'Dept Head', dataIndex: 'head', key: 'head' },
                    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
                    { title: 'Brand & Product', key: 'prod', render: (_, r) => `${r.brand} - ${r.product}` },
                    { title: 'Qty Purchased', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice', render: (p) => `₹${p.toLocaleString()}` },
                    { title: 'Total Amount', dataIndex: 'total', key: 'total', render: (t) => <strong style={{ color: '#5421A8' }}>₹{t.toLocaleString()}</strong> },
                  ]}
                />
              ),
            },
            {
              key: 'brand-analysis',
              label: '4. Brand-Wise Analysis',
              children: (
                <Table
                  dataSource={brandAnalysis}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Brand Name', dataIndex: 'brand', key: 'brand', render: (b) => <strong style={{ color: '#5421A8' }}>{b}</strong> },
                    { title: 'Total Products', dataIndex: 'products', key: 'products', align: 'center' },
                    { title: 'Total Qty Purchased', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Total Purchase Value', dataIndex: 'totalVal', key: 'totalVal', render: (v) => <strong>₹{v.toLocaleString()}</strong> },
                    { title: 'Average Purchase Price', dataIndex: 'avgPrice', key: 'avgPrice', render: (a) => `₹${a.toLocaleString()}` },
                  ]}
                />
              ),
            },
            {
              key: 'product-analysis',
              label: '5. Product-Wise Analysis',
              children: (
                <Table
                  dataSource={productAnalysis}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Product Name', dataIndex: 'product', key: 'product', render: (p) => <strong>{p}</strong> },
                    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
                    { title: 'Brand', dataIndex: 'brand', key: 'brand' },
                    { title: 'Department', dataIndex: 'dept', key: 'dept' },
                    { title: 'Total Qty', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Lowest Price', dataIndex: 'low', key: 'low', render: (p) => `₹${p.toLocaleString()}` },
                    { title: 'Highest Price', dataIndex: 'high', key: 'high', render: (p) => `₹${p.toLocaleString()}` },
                    { title: 'Avg Effective Unit Cost', dataIndex: 'avgUnitCost', key: 'avgUnitCost', render: (c) => <strong style={{ color: '#16A34A' }}>₹{c.toLocaleString()}</strong> },
                  ]}
                />
              ),
            },
            {
              key: 'supplier-comp',
              label: '6. Supplier Comparison',
              children: (
                <Table
                  dataSource={supplierComparison}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Supplier Name', dataIndex: 'supplier', key: 'supplier', render: (s) => <strong>{s}</strong> },
                    { title: 'Location', dataIndex: 'location', key: 'location' },
                    { title: 'Products Supplied', dataIndex: 'products', key: 'products', align: 'center' },
                    { title: 'Brands Supplied', dataIndex: 'brands', key: 'brands', align: 'center' },
                    { title: 'Total Orders', dataIndex: 'orders', key: 'orders', align: 'center' },
                    { title: 'Total Purchase Value', dataIndex: 'totalVal', key: 'totalVal', render: (v) => <strong style={{ color: '#5421A8' }}>₹{v.toLocaleString()}</strong> },
                    { title: 'Avg Effective Price', dataIndex: 'avgPrice', key: 'avgPrice', render: (p) => `₹${p.toLocaleString()}` },
                  ]}
                />
              ),
            },
            {
              key: 'price-comp',
              label: '7. Purchase Price Comparison',
              children: (
                <Table
                  dataSource={priceComparison}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Product & Brand', key: 'p', render: (_, r) => <div><strong>{r.product}</strong><div style={{ fontSize: 11, color: '#64748B' }}>{r.brand} &bull; {r.sku}</div></div> },
                    { title: 'Department & Head', key: 'dh', render: (_, r) => <div>{r.dept}<div style={{ fontSize: 11, color: '#64748B' }}>Head: {r.head}</div></div> },
                    { title: 'Supplier & Location', key: 'sl', render: (_, r) => <div>{r.supplier}<div style={{ fontSize: 11, color: '#64748B' }}>{r.loc} &bull; {r.date}</div></div> },
                    { title: 'Qty', dataIndex: 'qty', key: 'qty', align: 'center' },
                    { title: 'Original Quoted Price', dataIndex: 'origPrice', key: 'origPrice', render: (p) => <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>₹{p.toLocaleString()}</span> },
                    { title: 'Negotiated Price', dataIndex: 'negPrice', key: 'negPrice', render: (p) => <strong style={{ color: '#16A34A' }}>₹{p.toLocaleString()}</strong> },
                    { title: 'Final Effective Unit Cost', dataIndex: 'finalCost', key: 'finalCost', render: (c) => <strong style={{ color: '#5421A8' }}>₹{c.toLocaleString()}</strong> },
                  ]}
                />
              ),
            },
            {
              key: 'savings',
              label: '8. Savings & Cost Variance',
              children: (
                <Table
                  dataSource={savingsVariance}
                  pagination={false}
                  size="middle"
                  columns={[
                    { title: 'Benchmark Price', dataIndex: 'benchmark', key: 'benchmark', render: (p) => `₹${p.toLocaleString()}` },
                    { title: 'Actual Purchase Price', dataIndex: 'actual', key: 'actual', render: (p) => <strong>₹{p.toLocaleString()}</strong> },
                    { title: 'Price Difference', dataIndex: 'diff', key: 'diff', render: (d) => <span style={{ color: '#16A34A' }}>-₹{Math.abs(d).toLocaleString()}</span> },
                    { title: 'Price Variance %', dataIndex: 'variancePercent', key: 'variancePercent', render: (v) => <Tag color="green">{v}</Tag> },
                    { title: 'Actual Savings', dataIndex: 'actualSavings', key: 'actualSavings', render: (s) => <Tag color="success" style={{ fontWeight: 800 }}>+₹{s.toLocaleString()} Saved</Tag> },
                    { title: 'Potential Savings', dataIndex: 'potentialSavings', key: 'potentialSavings', render: (p) => <span style={{ color: '#7544D6', fontWeight: 700 }}>₹{p.toLocaleString()}</span> },
                  ]}
                />
              ),
            },
            {
              key: 'reports',
              label: '9. Purchase Reports',
              children: (
                <div style={{ padding: '20px', textAlign: 'center', background: '#FAF9FE', borderRadius: 12 }}>
                  <FileSpreadsheet size={36} color="#7544D6" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>Consolidated Procurement Ledger Reports</div>
                  <div style={{ fontSize: 12, color: '#64748B', maxWidth: 480, margin: '6px auto 16px' }}>
                    Download multi-tenant procurement compliance summaries, audited purchase records, and supplier debit schedules.
                  </div>
                  <Button type="primary" style={{ background: '#5421A8', borderColor: '#5421A8', borderRadius: 20 }} onClick={() => message.success('Exporting Procurement Ledger PDF & Excel...')}>
                    Download Complete Procurement Report
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
