import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Select,
  message,
  Modal,
  Form,
  Input,
  Drawer,
  Popconfirm,
} from 'antd';
import {
  Award,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Layers,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  Package,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_BRANDS, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './productMockData';
import type { BrandItem } from './productData';

export const BrandManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Summary Metrics
  const totalBrands = brands.length;
  const activeBrands = brands.filter((b) => b.status === 'Active').length;
  const inactiveBrands = brands.filter((b) => b.status === 'Inactive').length;
  const totalBrandProducts = INITIAL_PRODUCTS.length;

  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      search === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveAdd = (values: any) => {
    const newBrand: BrandItem = {
      id: `b-${Date.now()}`,
      name: values.name,
      code: values.code ? values.code.toUpperCase() : values.name.substring(0, 3).toUpperCase(),
      logoText: values.name.substring(0, 3).toUpperCase(),
      description: values.description || '',
      website: values.website || 'https://brand.com',
      country: values.country || 'India',
      manufacturer: values.manufacturer || values.name,
      contactPerson: values.contactPerson || 'Authorized Representative',
      phone: values.phone || '+91 98...',
      email: values.email || 'support@brand.com',
      address: values.address || 'Industrial Zone',
      categories: values.categories || ['Industrial Equipment'],
      totalProducts: 0,
      activeProducts: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBrands([newBrand, ...brands]);
    setIsAddModalOpen(false);
    addForm.resetFields();
    message.success(`Brand ${newBrand.name} registered successfully!`);
  };

  const handleSaveEdit = (values: any) => {
    if (!selectedBrand) return;
    const updated = brands.map((b) => {
      if (b.id === selectedBrand.id) {
        return {
          ...b,
          name: values.name,
          manufacturer: values.manufacturer,
          contactPerson: values.contactPerson,
          phone: values.phone,
          email: values.email,
          status: values.status,
          website: values.website,
        };
      }
      return b;
    });

    setBrands(updated);
    setIsEditModalOpen(false);
    message.success(`Brand ${selectedBrand.name} updated successfully!`);
  };

  const handleToggleStatus = (id: string) => {
    setBrands(
      brands.map((b) => {
        if (b.id === id) {
          const nextStatus = b.status === 'Active' ? 'Inactive' : 'Active';
          message.info(`Brand status changed to ${nextStatus}`);
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const handleDelete = (id: string) => {
    setBrands(brands.filter((b) => b.id !== id));
    message.success('Brand deleted successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="OEM Brand Portfolio & Manufacturers"
        subtitle="Manage certified manufacturer partnerships, authorized brand agreements, contact directories, and mapped product lines."
        icon={<Award size={20} />}
        searchPlaceholder="Search brand name, code, manufacturer..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Register New Brand"
        onPrimaryAction={() => setIsAddModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting OEM Brand Directory...')}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 12,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 36,
              padding: '0 14px',
              backgroundColor: '#FFFFFF',
            }}
          >
            Export Brands
          </Button>
        }
      />

      {/* 2. Top 4 Summary Cards (Exact required 4) */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Brands',
            value: `${totalBrands} Brands`,
            growth: 'OEM Manufacturers',
            isDark: true,
            icon: <Award size={20} color="#5421A8" />,
          },
          {
            title: 'Active Brands',
            value: `${activeBrands} Active`,
            growth: `${((activeBrands / totalBrands) * 100).toFixed(0)}% Portfolio Active`,
            isPositive: true,
            isDark: false,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Inactive Brands',
            value: `${inactiveBrands} Inactive`,
            growth: 'Partnerships on hold',
            isPositive: false,
            isDark: true,
            icon: <Clock size={20} color="#F59E0B" />,
          },
          {
            title: 'Total Brand Products',
            value: `${totalBrandProducts} SKUs`,
            growth: 'Across all active brands',
            isPositive: true,
            isDark: false,
            icon: <Package size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Main Data Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #EAE5F5',
          boxShadow: '0 8px 30px rgba(84, 33, 168, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Filters */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #F1EDF9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 170, height: 34 }}
              options={[
                { label: 'All Brand Status', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filteredBrands.length}</strong> Brands
          </div>
        </div>

        {/* Clean Enterprise Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 250 }}>
                  Brand Details
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Manufacturer Entity
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Catalog SKUs
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Key Representative
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Contact Email
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Brand Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((b, idx) => (
                <tr
                  key={b.id}
                  style={{
                    transition: 'background-color 0.15s ease',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                  }
                >
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        {b.logoText}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          Code: <strong style={{ color: '#5421A8' }}>{b.code}</strong> • {b.country}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    {b.manufacturer}
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>
                      {b.totalProducts} Products
                    </Tag>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{b.contactPerson}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{b.phone}</div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                    {b.email}
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <span
                      onClick={() => handleToggleStatus(b.id)}
                      title="Click to toggle"
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: b.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                        color: b.status === 'Active' ? '#059669' : '#D97706',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Button
                        size="small"
                        type="text"
                        icon={<Eye size={14} color="#5421A8" />}
                        onClick={() => {
                          setSelectedBrand(b);
                          setIsDetailDrawerOpen(true);
                        }}
                      />
                      <Button
                        size="small"
                        type="text"
                        icon={<Edit size={14} color="#0284C7" />}
                        onClick={() => {
                          setSelectedBrand(b);
                          editForm.setFieldsValue(b);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <Popconfirm
                        title="Delete brand?"
                        onConfirm={() => handleDelete(b.id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <Button size="small" type="text" danger icon={<Trash2 size={14} />} />
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add Brand Modal */}
      <Modal
        title="Register OEM Brand Partnership"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={580}
      >
        <Form form={addForm} layout="vertical" onFinish={handleSaveAdd} style={{ marginTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="name" label="Brand Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. ABB Power & Drives" />
            </Form.Item>
            <Form.Item name="code" label="Brand Code">
              <Input placeholder="e.g. ABB-IND" />
            </Form.Item>
          </div>

          <Form.Item name="manufacturer" label="Manufacturer / Corporate Entity" rules={[{ required: true }]}>
            <Input placeholder="e.g. ABB India Ltd" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="contactPerson" label="Contact Person">
              <Input placeholder="Representative Name" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="+91 ..." />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Email Address">
              <Input placeholder="support@abb.com" />
            </Form.Item>
            <Form.Item name="country" label="Country of Origin" initialValue="India">
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Brand Description & Portfolio Scope">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Brand
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Edit Brand Modal */}
      <Modal
        title={`Edit Brand: ${selectedBrand?.name}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Brand Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer">
            <Input />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="contactPerson" label="Contact Person">
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Updates
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Brand Details Drawer */}
      <Drawer
        title={`Brand Profile: ${selectedBrand?.name}`}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={480}
      >
        {selectedBrand && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Corporate Entity: <strong>{selectedBrand.manufacturer}</strong></div>
            <div>Code: <strong>{selectedBrand.code}</strong></div>
            <div>Country: <strong>{selectedBrand.country}</strong></div>
            <div>Official Website: <a href={selectedBrand.website} target="_blank" rel="noreferrer">{selectedBrand.website}</a></div>
            <div>Contact Person: <strong>{selectedBrand.contactPerson}</strong> ({selectedBrand.phone})</div>
            <div>Email: <strong>{selectedBrand.email}</strong></div>
            <div>Address: <strong>{selectedBrand.address}</strong></div>
            <div>Registered Products: <Tag color="purple">{selectedBrand.totalProducts} Items</Tag></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              {selectedBrand.description}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
