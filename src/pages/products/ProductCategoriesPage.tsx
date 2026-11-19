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
  InputNumber,
  Drawer,
  Popconfirm,
} from 'antd';
import {
  Boxes,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Layers,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './productMockData';
import type { CategoryItem } from './productData';

export const ProductCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Exact 4 Summary Cards as requested
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce((a, b) => a + b.totalSubcategories, 0);
  const activeCategories = categories.filter((c) => c.status === 'Active').length;
  const unassignedProductsCount = INITIAL_PRODUCTS.filter((p) => !p.category).length;

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveAdd = (values: any) => {
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: values.name,
      code: values.code ? values.code.toUpperCase() : `CAT-${Math.floor(100 + Math.random() * 900)}`,
      parentCategory: values.parentCategory || null,
      description: values.description || '',
      categoryType: values.categoryType || 'Standard',
      displayOrder: Number(values.displayOrder) || categories.length + 1,
      totalSubcategories: 0,
      totalProducts: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCategories([newCat, ...categories]);
    setIsAddModalOpen(false);
    addForm.resetFields();
    message.success(`Category ${newCat.name} created successfully!`);
  };

  const handleSaveEdit = (values: any) => {
    if (!selectedCategory) return;
    const updated = categories.map((c) => {
      if (c.id === selectedCategory.id) {
        return {
          ...c,
          name: values.name,
          description: values.description,
          displayOrder: Number(values.displayOrder),
          status: values.status,
        };
      }
      return c;
    });

    setCategories(updated);
    setIsEditModalOpen(false);
    message.success(`Category ${selectedCategory.name} updated!`);
  };

  const handleToggleStatus = (id: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          message.info(`Category status changed to ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    message.success('Category deleted from taxonomy.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar */}
      <SalesModuleHeader
        title="Product Classification & Hierarchy Taxonomies"
        subtitle="Manage product category trees, subcategories, nesting levels, item groupings, and statutory HSN tax alignments."
        icon={<Boxes size={20} />}
        searchPlaceholder="Search category name, code, taxonomy..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Add Category"
        onPrimaryAction={() => setIsAddModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting Product Category Hierarchy...')}
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
            Export Categories
          </Button>
        }
      />

      {/* 2. Top 4 Summary Cards (Exact required 4) */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Categories',
            value: `${totalCategories} Categories`,
            growth: 'Main Taxonomy Nodes',
            isDark: true,
            icon: <Boxes size={20} color="#5421A8" />,
          },
          {
            title: 'Total Subcategories',
            value: `${totalSubcategories} Subnodes`,
            growth: 'Nested Segments',
            isPositive: true,
            isDark: false,
            icon: <FolderTree size={20} color="#0284C7" />,
          },
          {
            title: 'Active Categories',
            value: `${activeCategories} Active`,
            growth: `${((activeCategories / totalCategories) * 100).toFixed(0)}% Tree Active`,
            isDark: true,
            icon: <CheckCircle2 size={20} color="#10B981" />,
          },
          {
            title: 'Unassigned Products',
            value: `${unassignedProductsCount} Items`,
            growth: 'Zero Unmapped SKUs',
            isPositive: true,
            isDark: false,
            icon: <Layers size={20} color="#6D28D9" />,
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
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
            />
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            Showing <strong style={{ color: '#5421A8' }}>{filteredCategories.length}</strong> Categories
          </div>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', width: 250 }}>
                  Category Name / Code
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Parent Node
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Subcategories
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Total Products
                </th>
                <th style={{ padding: '12px 18px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6' }}>
                  Created Date
                </th>
                <th style={{ padding: '12px 14px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #ECE8F6', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c, idx) => (
                <tr
                  key={c.id}
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
                    <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Code: <strong style={{ color: '#5421A8' }}>{c.code}</strong></div>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#475569' }}>
                    {c.parentCategory ? <strong>{c.parentCategory}</strong> : <span style={{ color: '#94A3B8' }}>Root Node</span>}
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700 }}>{c.totalSubcategories} Subnodes</Tag>
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{c.totalProducts} SKUs</Tag>
                  </td>

                  <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', fontSize: 12, color: '#64748B' }}>
                    {c.createdAt}
                  </td>

                  <td style={{ padding: '14px 14px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                    <span
                      onClick={() => handleToggleStatus(c.id)}
                      title="Toggle"
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: c.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                        color: c.status === 'Active' ? '#059669' : '#D97706',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <Button
                        size="small"
                        type="text"
                        icon={<Eye size={14} color="#5421A8" />}
                        onClick={() => {
                          setSelectedCategory(c);
                          setIsDetailDrawerOpen(true);
                        }}
                      />
                      <Button
                        size="small"
                        type="text"
                        icon={<Edit size={14} color="#0284C7" />}
                        onClick={() => {
                          setSelectedCategory(c);
                          editForm.setFieldsValue(c);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <Popconfirm title="Delete category?" onConfirm={() => handleDelete(c.id)}>
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

      {/* 4. Add Category Modal */}
      <Modal
        title="Add Product Category Hierarchy"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form form={addForm} layout="vertical" onFinish={handleSaveAdd} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Switchgear & Protection" />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="code" label="Category Code">
              <Input placeholder="CAT-SWG" />
            </Form.Item>
            <Form.Item name="parentCategory" label="Parent Category">
              <Select
                allowClear
                options={categories.map((c) => ({ label: c.name, value: c.name }))}
                placeholder="Root Node (None)"
              />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Confirm Category
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 5. Edit Category Modal */}
      <Modal
        title={`Edit Category: ${selectedCategory?.name}`}
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Updates
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 6. Details Drawer */}
      <Drawer
        title={`Category Hierarchy: ${selectedCategory?.name}`}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={460}
      >
        {selectedCategory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>Code: <strong>{selectedCategory.code}</strong></div>
            <div>Parent Level: <strong>{selectedCategory.parentCategory || 'Primary Root Node'}</strong></div>
            <div>Category Type: <Tag color="purple">{selectedCategory.categoryType}</Tag></div>
            <div>Subcategory Count: <strong>{selectedCategory.totalSubcategories} Subnodes</strong></div>
            <div>Products Mapped: <strong>{selectedCategory.totalProducts} Active Products</strong></div>
            <div style={{ marginTop: 10, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              {selectedCategory.description}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
