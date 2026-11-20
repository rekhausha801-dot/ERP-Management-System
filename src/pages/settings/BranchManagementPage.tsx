import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Modal, Form, Select, Typography, message, Row, Col } from 'antd';
import { Plus, Search, Filter, Download, Edit2, Eye, Building2, MapPin, Phone, UserCheck, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

export interface BranchRecord {
  key: string;
  branchCode: string;
  branchName: string;
  branchManager: string;
  phone: string;
  city: string;
  status: 'Active' | 'Inactive';
}

const initialBranches: BranchRecord[] = [
  {
    key: '1',
    branchCode: 'BR-001',
    branchName: 'Chennai Main Branch',
    branchManager: 'Kumar',
    phone: '9876543210',
    city: 'Chennai',
    status: 'Active',
  },
  {
    key: '2',
    branchCode: 'BR-002',
    branchName: 'Pondicherry Branch',
    branchManager: 'Priya',
    phone: '9876543211',
    city: 'Pondicherry',
    status: 'Active',
  },
  {
    key: '3',
    branchCode: 'BR-003',
    branchName: 'Coimbatore Branch',
    branchManager: 'Suresh',
    phone: '9876543212',
    city: 'Coimbatore',
    status: 'Inactive',
  },
];

export const BranchManagementPage: React.FC = () => {
  const [branches, setBranches] = useState<BranchRecord[]>(initialBranches);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchRecord | null>(null);
  const [form] = Form.useForm();

  const filteredData = branches.filter(
    (item) =>
      item.branchCode.toLowerCase().includes(search.toLowerCase()) ||
      item.branchName.toLowerCase().includes(search.toLowerCase()) ||
      item.branchManager.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search)
  );

  const handleOpenModal = (record?: BranchRecord) => {
    if (record) {
      setEditingBranch(record);
      form.setFieldsValue(record);
    } else {
      setEditingBranch(null);
      form.resetFields();
      form.setFieldsValue({
        branchCode: `BR-00${branches.length + 1}`,
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingBranch) {
        setBranches((prev) =>
          prev.map((b) => (b.key === editingBranch.key ? { ...b, ...values } : b))
        );
        message.success(`Branch ${values.branchName} updated successfully.`);
      } else {
        const newBranch: BranchRecord = {
          key: String(Date.now()),
          ...values,
        };
        setBranches((prev) => [...prev, newBranch]);
        message.success(`Branch ${values.branchName} created successfully.`);
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: 'Branch Code',
      dataIndex: 'branchCode',
      key: 'branchCode',
      render: (code: string) => (
        <span style={{ fontWeight: 600, color: '#181433' }}>
          {code}
        </span>
      ),
    },
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (name: string) => (
        <span style={{ fontWeight: 500, color: '#181433' }}>
          {name}
        </span>
      ),
    },
    {
      title: 'Branch Manager',
      dataIndex: 'branchManager',
      key: 'branchManager',
      render: (manager: string) => (
        <span style={{ color: '#4A4660' }}>
          {manager}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <span style={{ color: '#4A4660', fontFamily: 'monospace' }}>
          {phone}
        </span>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (city: string) => (
        <span style={{ color: '#4A4660' }}>
          {city}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Active' | 'Inactive') => {
        const isActive = status === 'Active';
        return (
          <span
            style={{
              fontWeight: 500,
              color: isActive ? '#16A34A' : '#6B7280',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isActive ? '#16A34A' : '#9CA3AF',
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
      render: (_: any, record: BranchRecord) => (
        <span
          onClick={() => handleOpenModal(record)}
          style={{
            color: '#181433',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 13,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#4C1D95')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#181433')}
        >
          View / Edit
        </span>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Branch Management"
        subtitle="Manage company operating branches, regional hubs, service centers, and branch leadership."
        actions={
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              borderRadius: 12,
              fontWeight: 600,
            }}
            onClick={() => handleOpenModal()}
          >
            Add Branch
          </Button>
        }
      />

      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#181433' }}>
              1. Branch Management – Table Content
            </h3>
            <span style={{ fontSize: 13, color: '#7E7A9B' }}>
              Real-time regional operational hubs & branch contacts
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input
              prefix={<Search size={15} color="#A5A1BE" />}
              placeholder="Search branch code, name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 280,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            />
          </div>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          bordered={false}
          size="middle"
          rowClassName={() => 'branch-table-row'}
        />
      </Card>

      {/* Add / Edit Branch Modal */}
      <Modal
        title={editingBranch ? `Edit Branch - ${editingBranch.branchCode}` : 'Create New Branch'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingBranch ? 'Save Changes' : 'Create Branch'}
        okButtonProps={{
          style: {
            backgroundColor: '#4C1D95',
            borderColor: '#4C1D95',
            borderRadius: 10,
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="branchCode"
                label="Branch Code"
                rules={[{ required: true, message: 'Please enter branch code' }]}
              >
                <Input placeholder="e.g. BR-004" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Select status' }]}
              >
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="branchName"
            label="Branch Name"
            rules={[{ required: true, message: 'Please enter branch name' }]}
          >
            <Input placeholder="e.g. Madurai Branch" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="branchManager"
                label="Branch Manager"
                rules={[{ required: true, message: 'Please enter manager name' }]}
              >
                <Input placeholder="e.g. Ramesh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter contact phone' }]}
              >
                <Input placeholder="e.g. 9876543213" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter city' }]}
          >
            <Input placeholder="e.g. Madurai" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
