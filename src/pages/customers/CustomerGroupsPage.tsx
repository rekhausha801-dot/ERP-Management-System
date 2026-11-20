import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Modal, Form, Input, Select, message, Row, Col } from 'antd';
import {
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  FolderTree,
} from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

export interface CustomerGroupItem {
  id: string;
  sNo: number;
  groupCode: string;
  groupName: string;
  description: string;
  customerCount: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_GROUPS: CustomerGroupItem[] = [
  {
    id: '1',
    sNo: 1,
    groupCode: 'CG-001',
    groupName: 'Corporate Customers',
    description: 'Enterprise companies',
    customerCount: 25,
    status: 'Active',
  },
  {
    id: '2',
    sNo: 2,
    groupCode: 'CG-002',
    groupName: 'Retail Customers',
    description: 'Individual customers',
    customerCount: 120,
    status: 'Active',
  },
  {
    id: '3',
    sNo: 3,
    groupCode: 'CG-003',
    groupName: 'VIP Customers',
    description: 'Priority service customers',
    customerCount: 15,
    status: 'Active',
  },
  {
    id: '4',
    sNo: 4,
    groupCode: 'CG-004',
    groupName: 'Dealers',
    description: 'Business partners',
    customerCount: 30,
    status: 'Active',
  },
];

export const CustomerGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<CustomerGroupItem[]>(INITIAL_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroupItem | null>(null);
  const [form] = Form.useForm();

  const filteredGroups = groups.filter(
    (g) =>
      g.groupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (record?: CustomerGroupItem) => {
    if (record) {
      setEditingGroup(record);
      form.setFieldsValue(record);
    } else {
      setEditingGroup(null);
      form.resetFields();
      form.setFieldsValue({
        groupCode: `CG-00${groups.length + 1}`,
        customerCount: 0,
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingGroup) {
        setGroups((prev) =>
          prev.map((g) => (g.id === editingGroup.id ? { ...g, ...values } : g))
        );
        message.success(`Group ${values.groupName} updated successfully.`);
      } else {
        const newGroup: CustomerGroupItem = {
          id: String(Date.now()),
          sNo: groups.length + 1,
          ...values,
        };
        setGroups((prev) => [...prev, newGroup]);
        message.success(`Group ${values.groupName} created successfully.`);
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'sNo',
      key: 'sNo',
      width: 48,
      align: 'center' as const,
      render: (num: number) => (
        <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 13 }}>
          {num}
        </span>
      ),
    },
    {
      title: 'Group Code',
      dataIndex: 'groupCode',
      key: 'groupCode',
      render: (code: string) => (
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#F3E8FF',
            color: '#6D28D9',
            padding: '3px 12px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: '#1E293B', fontSize: 13.5 }}>
          {name}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <span style={{ color: '#475569', fontSize: 13 }}>
          {desc}
        </span>
      ),
    },
    {
      title: 'Customer Count',
      dataIndex: 'customerCount',
      key: 'customerCount',
      align: 'center' as const,
      render: (count: number) => (
        <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>
          {count}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: 'Active' | 'Inactive') => {
        const isActive = status === 'Active';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: isActive ? '#DCFCE7' : '#F1F5F9',
              color: isActive ? '#15803D' : '#64748B',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isActive ? '#16A34A' : '#94A3B8',
                display: 'inline-block',
              }}
            />
            {status}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: CustomerGroupItem) => (
        <button
          onClick={() => handleOpenModal(record)}
          style={{
            backgroundColor: '#F3E8FF',
            color: '#6D28D9',
            border: 'none',
            fontWeight: 700,
            borderRadius: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 30,
            padding: '0 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <Eye size={13} color="#6D28D9" />
          <span>View / Edit</span>
        </button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Customer Groups"
        subtitle="Segment and manage client categories, service levels, dealer networks, and pricing tiers."
        actions={
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              borderRadius: 10,
              fontWeight: 600,
            }}
            onClick={() => handleOpenModal()}
          >
            Create Customer Group
          </Button>
        }
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          prefix={<Search size={15} color="#A5A1BE" />}
          placeholder="Search customer groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: 300,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        />
      </div>

      <div
        className="service-portal-card"
        style={{
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
          padding: '4px 8px 16px 8px',
        }}
      >
        <Table
          dataSource={filteredGroups}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="user-management-table"
        />

        {/* Bottom Pagination Bar matching Image */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 4px 16px',
            borderTop: '1px solid #F1F5F9',
            marginTop: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4C1D95', fontWeight: 600 }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              i
            </span>
            <span style={{ color: '#4C1D95' }}>
              Showing 1 to {filteredGroups.length} of {filteredGroups.length} entries
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94A3B8',
              }}
            >
              <ChevronLeft size={15} />
            </button>
            <button
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                color: '#94A3B8',
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Customer Group Modal */}
      <Modal
        title={editingGroup ? `Edit Group - ${editingGroup.groupCode}` : 'Create Customer Group'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingGroup ? 'Save Changes' : 'Create Group'}
        okButtonProps={{
          style: {
            backgroundColor: '#4C1D95',
            borderColor: '#4C1D95',
            borderRadius: 8,
          },
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="groupCode"
                label="Group Code"
                rules={[{ required: true, message: 'Please enter group code' }]}
              >
                <Input placeholder="e.g. CG-005" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder="e.g. Government Agencies" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input placeholder="e.g. Public sector departments" />
          </Form.Item>

          <Form.Item
            name="customerCount"
            label="Customer Count"
            initialValue={0}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
