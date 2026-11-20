import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Drawer,
  Tabs,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Divider,
  message,
} from 'antd';
import {
  Users,
  Plus,
  FileSpreadsheet,
  Search,
  MapPin,
  Phone,
  Mail,
  Building,
  CreditCard,
  Package,
  Award,
  History,
  FileText,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export interface SupplierRecord {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gstin: string;
  locationCategory: 'Domestic (Intrastate)' | 'Interstate' | 'Import / International';
  suppliedBrands: string[];
  suppliedProducts: string[];
  totalPurchaseValue: number;
  totalOrders: number;
  outstandingBalance: number;
}

const INITIAL_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'sup-1',
    code: 'SUP-2026-001',
    companyName: 'Lakshmi Precision Castings Private Limited',
    contactPerson: 'M. S. Lakshmanan',
    phone: '+91 98450 11223',
    email: 'orders@lakshmicastings.com',
    address: 'Plot 12, Peenya 2nd Phase, Industrial Estate',
    city: 'Bangalore',
    state: 'Karnataka',
    gstin: '29AABCL9981K1Z3',
    locationCategory: 'Interstate',
    suppliedBrands: ['Lakshmi Pro', 'FoundryCore'],
    suppliedProducts: ['Pump Housing Casings', 'Flange Hubs', 'Cast Iron Bases'],
    totalPurchaseValue: 3450000,
    totalOrders: 18,
    outstandingBalance: 290000,
  },
  {
    id: 'sup-2',
    code: 'SUP-2026-002',
    companyName: 'Bharat Hydraulic Components Ltd',
    contactPerson: 'K. Parthasarathy',
    phone: '+91 94440 22334',
    email: 'sales@bharathydraulics.in',
    address: '44 Industrial Estate, Ambattur',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gstin: '33AABCB5512L1Z9',
    locationCategory: 'Domestic (Intrastate)',
    suppliedBrands: ['BharatDrive', 'HydroMax'],
    suppliedProducts: ['Piston Pumps', 'Hydraulic Motor Units', 'High Pressure Hoses'],
    totalPurchaseValue: 5820000,
    totalOrders: 26,
    outstandingBalance: 0,
  },
  {
    id: 'sup-3',
    code: 'SUP-2026-003',
    companyName: 'Delta Pneumatic Systems Ltd',
    contactPerson: 'Nitin Deshmukh',
    phone: '+91 98220 77881',
    email: 'info@deltapneumatics.com',
    address: 'Sector 10, PCMC Industrial Zone',
    city: 'Pune',
    state: 'Maharashtra',
    gstin: '27AABCD3311P1Z1',
    locationCategory: 'Interstate',
    suppliedBrands: ['DeltaPure', 'AirTech'],
    suppliedProducts: ['Solenoid Directional Air Valves', 'Pneumatic Cylinders'],
    totalPurchaseValue: 1980000,
    totalOrders: 14,
    outstandingBalance: 120000,
  },
  {
    id: 'sup-4',
    code: 'SUP-2026-004',
    companyName: 'Apex Industrial Steels Pvt Ltd',
    contactPerson: 'S. Shanmugam',
    phone: '+91 97880 11990',
    email: 'sales@apexsteels.com',
    address: 'SIDCO Foundry Complex, Kurichi',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    gstin: '33AABCA9911N1Z0',
    locationCategory: 'Domestic (Intrastate)',
    suppliedBrands: ['ApexSteel'],
    suppliedProducts: ['Seamless Carbon Steel Pipes', 'SS Structural Angles'],
    totalPurchaseValue: 2450000,
    totalOrders: 12,
    outstandingBalance: 396480,
  },
];

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = suppliers.filter((s) => {
    return (
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOpenDrawer = (record: SupplierRecord) => {
    setSelectedSupplier(record);
    setIsDrawerOpen(true);
  };

  const handleCreateSupplier = (values: any) => {
    const newSup: SupplierRecord = {
      id: `sup-${Date.now()}`,
      code: `SUP-2026-0${10 + suppliers.length + 1}`,
      companyName: values.companyName,
      contactPerson: values.contactPerson,
      phone: values.phone,
      email: values.email,
      address: values.address || 'Vendor registered office address',
      city: values.city,
      state: values.state || 'Tamil Nadu',
      gstin: values.gstin || '33AABCX1234F1Z0',
      locationCategory: values.locationCategory || 'Domestic (Intrastate)',
      suppliedBrands: [values.brand || 'Enterprise Supplier'],
      suppliedProducts: [values.product || 'Standard Supply'],
      totalPurchaseValue: 0,
      totalOrders: 0,
      outstandingBalance: 0,
    };

    setSuppliers([newSup, ...suppliers]);
    message.success(`Supplier account ${newSup.companyName} registered!`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Supplier Code',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (code: string, r: SupplierRecord) => (
        <span
          onClick={() => handleOpenDrawer(r)}
          style={{
            fontWeight: 800,
            color: '#5421A8',
            backgroundColor: '#F3EEFF',
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: 'Supplier Company & Contact',
      key: 'company',
      render: (_: any, r: SupplierRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13.5 }}>{r.companyName}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span>Contact: <strong>{r.contactPerson}</strong></span> &bull; <span>{r.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Location & GSTIN',
      key: 'loc',
      render: (_: any, r: SupplierRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>{r.city}, {r.state}</div>
          <Tag style={{ fontSize: 10.5, fontWeight: 700, borderRadius: 6, marginTop: 2 }}>{r.gstin}</Tag>
        </div>
      ),
    },
    {
      title: 'Supplied Brands & Items',
      key: 'products',
      render: (_: any, r: SupplierRecord) => (
        <div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {r.suppliedBrands.map((b, i) => (
              <Tag key={i} color="purple" style={{ borderRadius: 6, fontSize: 10.5, fontWeight: 700 }}>
                {b}
              </Tag>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
            {r.suppliedProducts.slice(0, 2).join(', ')}
          </div>
        </div>
      ),
    },
    {
      title: 'Total Spend (₹)',
      dataIndex: 'totalPurchaseValue',
      key: 'totalPurchaseValue',
      render: (v: number, r: SupplierRecord) => (
        <div>
          <strong style={{ color: '#1E1B4B', fontSize: 13.5 }}>₹{v.toLocaleString()}</strong>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>{r.totalOrders} Purchase Orders</div>
        </div>
      ),
    },
    {
      title: 'Outstanding Payable',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      render: (bal: number) => (
        <span style={{ fontWeight: 800, color: bal > 0 ? '#EF4444' : '#16A34A', fontSize: 13 }}>
          {bal > 0 ? `₹${bal.toLocaleString()}` : 'Cleared'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: SupplierRecord) => (
        <Button size="small" type="link" style={{ color: '#5421A8', fontWeight: 700 }} onClick={() => handleOpenDrawer(r)}>
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SalesModuleHeader
        title="Supplier & Vendor Directory"
        subtitle="Manage supplier master contracts, regional branches, supplied product categories, pricing agreements, and accounts payable."
        icon={<Users size={20} />}
        searchPlaceholder="Search supplier company, code, city..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add Supplier"
        onPrimaryAction={() => {
          form.resetFields();
          setIsModalOpen(true);
        }}
        extraActions={
          <Button icon={<FileSpreadsheet size={14} />} onClick={() => message.success('Exporting Supplier Directory...')} style={{ borderRadius: 20 }}>
            Export Directory
          </Button>
        }
      />

      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Suppliers',
            value: `${suppliers.length} Vendors`,
            growth: 'Pan-India',
            isDark: true,
            icon: <Users size={20} color="#5421A8" />,
          },
          {
            title: 'Procurement Billed',
            value: `₹${(suppliers.reduce((s, u) => s + u.totalPurchaseValue, 0) / 100000).toFixed(1)}L`,
            growth: 'Total Volume',
            isDark: false,
            icon: <CreditCard size={20} color="#10B981" />,
          },
          {
            title: 'Vendor Dues Payable',
            value: `₹${(suppliers.reduce((s, u) => s + u.outstandingBalance, 0) / 100000).toFixed(1)}L`,
            growth: 'Active Bills',
            isPositive: false,
            isDark: true,
            icon: <CreditCard size={20} color="#F59E0B" />,
          },
          {
            title: 'Zero Balance Accounts',
            value: `${suppliers.filter((s) => s.outstandingBalance === 0).length} Cleared`,
            growth: 'Healthy Credit',
            isPositive: true,
            isDark: false,
            icon: <Award size={20} color="#6D28D9" />,
          },
        ]}
      />

      <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #ECE8F6', overflow: 'hidden' }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={false} size="middle" />
      </div>

      {/* Supplier Profile Detail Drawer with Internal Tabs */}
      <Drawer
        title={selectedSupplier ? `${selectedSupplier.companyName} (${selectedSupplier.code})` : 'Supplier Details'}
        placement="right"
        width={700}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {selectedSupplier && (
          <Tabs
            defaultActiveKey="overview"
            items={[
              {
                key: 'overview',
                label: 'Overview',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: '#FAF8FE', padding: 16, borderRadius: 12, border: '1px solid #ECE8F6' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B' }}>{selectedSupplier.companyName}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{selectedSupplier.address}, {selectedSupplier.city}, {selectedSupplier.state}</div>
                      <div style={{ fontSize: 12, color: '#5421A8', fontWeight: 700, marginTop: 4 }}>GSTIN: {selectedSupplier.gstin}</div>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10 }}>
                          <span style={{ fontSize: 11, color: '#64748B' }}>Total Lifetime Orders:</span>
                          <div style={{ fontSize: 18, fontWeight: 900, color: '#1E1B4B' }}>{selectedSupplier.totalOrders} POs</div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10 }}>
                          <span style={{ fontSize: 11, color: '#64748B' }}>Total Procured Value:</span>
                          <div style={{ fontSize: 18, fontWeight: 900, color: '#5421A8' }}>₹{selectedSupplier.totalPurchaseValue.toLocaleString()}</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: 'contacts',
                label: 'Contacts & Locations',
                children: (
                  <div style={{ fontSize: 12.5, lineHeight: 1.8 }}>
                    <div>Contact Person: <strong>{selectedSupplier.contactPerson}</strong></div>
                    <div>Phone: <strong>{selectedSupplier.phone}</strong></div>
                    <div>Email: <strong>{selectedSupplier.email}</strong></div>
                    <div>Jurisdiction Category: <strong>{selectedSupplier.locationCategory}</strong></div>
                  </div>
                ),
              },
              {
                key: 'brands',
                label: 'Brands & Products',
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <strong>Supplied Brands:</strong>
                      <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                        {selectedSupplier.suppliedBrands.map((b, i) => (
                          <Tag key={i} color="purple">{b}</Tag>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Catalog Items:</strong>
                      <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                        {selectedSupplier.suppliedProducts.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                key: 'history',
                label: 'Purchase History',
                children: (
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Showing recent executed purchase orders:
                    <div style={{ marginTop: 8, background: '#FAF8FE', padding: 10, borderRadius: 8 }}>
                      PO-2026-101 &bull; Ductile Iron Pump Housing Casings &bull; ₹5,90,000 (Approved)
                    </div>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Drawer>

      <Modal title="Register New Supplier" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={620}>
        <Form form={form} layout="vertical" onFinish={handleCreateSupplier} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="companyName" label="Supplier Company Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Lakshmi Precision Castings Private Limited" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Primary Contact Person" rules={[{ required: true }]}>
                <Input placeholder="e.g. M. S. Lakshmanan" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Official Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98000 00000" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Official Email" rules={[{ required: true }]}>
                <Input placeholder="orders@supplier.com" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input placeholder="e.g. Chennai, Bangalore" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gstin" label="GSTIN">
                <Input placeholder="33AABCX1234F1Z0" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brand" label="Supplied Brand">
                <Input placeholder="e.g. Siemens, Bosch" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Create Supplier Account
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
