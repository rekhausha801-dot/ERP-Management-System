import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Space, Card, Modal, Form, Input, Select, message } from 'antd';
import { UserCheck, Plus, Shield, Mail } from 'lucide-react';
import { PageHeader, StatusBadge, GenericCrudToolbar } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

interface SystemUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedTenant: string;
  status: string;
  lastLogin: string;
}

const INITIAL_USERS: SystemUserItem[] = [
  {
    id: 'u-1',
    name: 'Devi SuperAdmin',
    email: 'superadmin@universal-erp.io',
    role: 'superadmin',
    assignedTenant: 'GLOBAL (HQ Platform)',
    status: 'active',
    lastLogin: '2026-11-16 13:45',
  },
  {
    id: 'u-2',
    name: 'Ramesh Sundaram (Admin)',
    email: 'admin@abctraders.com',
    role: 'admin',
    assignedTenant: 'ABC Traders Ltd',
    status: 'active',
    lastLogin: '2026-11-16 11:20',
  },
  {
    id: 'u-3',
    name: 'Karthik Raja (Sales Lead)',
    email: 'sales@xyzagencies.com',
    role: 'sales_manager',
    assignedTenant: 'XYZ Agencies Pvt Ltd',
    status: 'active',
    lastLogin: '2026-11-15 16:30',
  },
  {
    id: 'u-4',
    name: 'Murugan Selvam (Service Lead)',
    email: 'support@pqrsolutions.com',
    role: 'service_manager',
    assignedTenant: 'PQR Solutions & Services',
    status: 'active',
    lastLogin: '2026-11-16 09:15',
  },
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<SystemUserItem[]>(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const { companies } = useAuth();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.assignedTenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (values: any) => {
    const newUser: SystemUserItem = {
      id: 'u-' + Date.now(),
      name: values.name,
      email: values.email,
      role: values.role,
      assignedTenant: values.assignedTenant,
      status: 'active',
      lastLogin: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
    message.success(`User ${values.name} provisioned!`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'User Name & Email',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: SystemUserItem) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E152A' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'superadmin' ? 'red' : role.includes('manager') ? 'purple' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Assigned Tenant',
      dataIndex: 'assignedTenant',
      key: 'assignedTenant',
      render: (tenant: string) => <span style={{ fontWeight: 500 }}>{tenant}</span>,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Enterprise User & Access Management"
        subtitle="Manage operators, administrators, and tenant assignments across the ERP platform."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => setIsModalOpen(true)}
          >
            Provision User
          </Button>
        }
      />

      <GenericCrudToolbar
        searchPlaceholder="Search users by name, email or tenant..."
        onSearch={setSearchTerm}
        onCreateNew={() => setIsModalOpen(true)}
        createButtonText="Add User"
      />

      <Card style={{ borderRadius: 8 }}>
        <Table dataSource={filteredUsers} columns={columns} rowKey="id" bordered />
      </Card>

      <Modal
        title="Provision New Enterprise User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser} initialValues={{ role: 'admin' }}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Anand Kumar" />
          </Form.Item>
          <Form.Item label="Corporate Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="anand@company.com" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              <Option value="superadmin">Super Admin (HQ Platform Access)</Option>
              <Option value="admin">Company Administrator</Option>
              <Option value="sales_manager">Sales Department Manager</Option>
              <Option value="service_manager">Service Department Manager</Option>
              <Option value="technician">Field Technician</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Assigned Tenant Organization" name="assignedTenant" rules={[{ required: true }]}>
            <Select>
              <Option value="GLOBAL (HQ Platform)">GLOBAL (HQ Platform)</Option>
              {companies.map((c) => (
                <Option key={c.id} value={c.name}>
                  {c.name} ({c.code})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}>
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
