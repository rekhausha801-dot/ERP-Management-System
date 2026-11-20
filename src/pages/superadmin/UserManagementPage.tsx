import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Space, Card, Modal, Form, Input, Select, message, Pagination } from 'antd';
import {
  UserCheck,
  Plus,
  Shield,
  Mail,
  User,
  Building,
  Clock,
  Settings,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Wrench,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { Option } = Select;

interface SystemUserItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  role: string;
  roleType: 'superadmin' | 'admin' | 'sales_manager' | 'service_manager' | string;
  assignedTenant: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const INITIAL_USERS: SystemUserItem[] = [
  {
    id: 'u-1',
    name: 'Devi SuperAdmin',
    email: 'superadmin@universal-erp.io',
    initials: 'DS',
    avatarBg: '#EDE9FE',
    avatarColor: '#6D28D9',
    role: 'SUPERADMIN',
    roleType: 'superadmin',
    assignedTenant: 'GLOBAL (HQ Platform)',
    status: 'active',
    lastLogin: '2026-11-16 13:45',
  },
  {
    id: 'u-2',
    name: 'Ramesh Sundaram (Admin)',
    email: 'admin@abctraders.com',
    initials: 'RS',
    avatarBg: '#F3E8FF',
    avatarColor: '#7E22CE',
    role: 'ADMIN',
    roleType: 'admin',
    assignedTenant: 'ABC Traders Ltd',
    status: 'active',
    lastLogin: '2026-11-16 11:20',
  },
  {
    id: 'u-3',
    name: 'Karthik Raja (Sales Lead)',
    email: 'sales@xyzagencies.com',
    initials: 'KR',
    avatarBg: '#DCFCE7',
    avatarColor: '#15803D',
    role: 'SALES_MANAGER',
    roleType: 'sales_manager',
    assignedTenant: 'XYZ Agencies Pvt Ltd',
    status: 'active',
    lastLogin: '2026-11-15 16:30',
  },
  {
    id: 'u-4',
    name: 'Murugan Selvam (Service Lead)',
    email: 'support@pqrsolutions.com',
    initials: 'MS',
    avatarBg: '#FFEDD5',
    avatarColor: '#C2410C',
    role: 'SERVICE_MANAGER',
    roleType: 'service_manager',
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
  const [currentPage, setCurrentPage] = useState(1);
  const { companies } = useAuth();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.assignedTenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (values: any) => {
    const names = values.name.trim().split(' ');
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();

    const newUser: SystemUserItem = {
      id: 'u-' + Date.now(),
      name: values.name,
      email: values.email,
      initials,
      avatarBg: '#EDE9FE',
      avatarColor: '#6D28D9',
      role: values.role.toUpperCase(),
      roleType: values.role,
      assignedTenant: values.assignedTenant,
      status: 'active',
      lastLogin: '2026-11-20 11:50',
    };
    setUsers((prev) => [...prev, newUser]);
    message.success(`User ${values.name} provisioned!`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const renderRoleBadge = (roleType: string, roleText: string) => {
    switch (roleType.toLowerCase()) {
      case 'superadmin':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.4px',
            }}
          >
            <Shield size={13} fill="#DC2626" color="#DC2626" />
            {roleText}
          </span>
        );
      case 'admin':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#E0F2FE',
              color: '#0284C7',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.4px',
            }}
          >
            <Shield size={13} color="#0284C7" />
            {roleText}
          </span>
        );
      case 'sales_manager':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#F3E8FF',
              color: '#9333EA',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.4px',
            }}
          >
            <TrendingUp size={13} color="#9333EA" />
            {roleText}
          </span>
        );
      case 'service_manager':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#F3E8FF',
              color: '#9333EA',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.4px',
            }}
          >
            <Wrench size={13} color="#9333EA" />
            {roleText}
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#F1F5F9',
              color: '#475569',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {roleText}
          </span>
        );
    }
  };

  const columns = [
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <User size={15} color="#3B0764" />
          User Name & Email
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: SystemUserItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar Initials Circle */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: record.avatarBg,
              color: record.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {record.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Shield size={15} color="#3B0764" />
          Role
        </span>
      ),
      dataIndex: 'role',
      key: 'role',
      render: (_: string, record: SystemUserItem) => renderRoleBadge(record.roleType, record.role),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Building size={15} color="#3B0764" />
          Assigned Tenant
        </span>
      ),
      dataIndex: 'assignedTenant',
      key: 'assignedTenant',
      render: (tenant: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building size={14} color="#0284C7" />
          <span style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>{tenant}</span>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Clock size={15} color="#3B0764" />
          Last Login
        </span>
      ),
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (login: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={14} color="#64748B" />
          <span style={{ color: '#334155', fontSize: 13, fontWeight: 500 }}>{login}</span>
        </div>
      ),
    },
    {
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B0764', fontWeight: 700 }}>
          <Settings size={15} color="#3B0764" />
          Status
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#DCFCE7',
            color: '#15803D',
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
              backgroundColor: '#16A34A',
              display: 'inline-block',
            }}
          />
          Active
        </span>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Enterprise User & Access Management"
        subtitle="Manage operators, administrators, and tenant assignments across the ERP platform."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              borderRadius: 10,
              fontWeight: 600,
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Provision User
          </Button>
        }
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          prefix={<Search size={15} color="#A5A1BE" />}
          placeholder="Search users by name, email or tenant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: 320,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        />
      </div>

      <div
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
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="user-management-table"
          rowClassName={() => 'user-management-row'}
        />

        {/* Bottom Pagination Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px 4px 20px',
            borderTop: '1px solid #F1F5F9',
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Showing 1 – {filteredUsers.length} of {filteredUsers.length} users
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 32,
                height: 32,
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
              <ChevronLeft size={16} />
            </button>
            <button
              style={{
                width: 32,
                height: 32,
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
                width: 32,
                height: 32,
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
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

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
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95', borderRadius: 8 }}
            >
              Create User
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
