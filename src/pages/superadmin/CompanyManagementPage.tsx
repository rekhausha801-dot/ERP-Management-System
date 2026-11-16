import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
  Tag,
} from 'antd';
import { Plus, Edit3, Trash2, CheckCircle2, Building2 } from 'lucide-react';
import { PageHeader, StatusBadge, PackageBadge, GenericCrudToolbar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import type { Company, ErpPackageType } from '../../types';

const { Option } = Select;
const { Text } = Typography;

export const CompanyManagementPage: React.FC = () => {
  const { companies, addCompany, updateCompanyPackage, selectCompany } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(
    (c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.packageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterCompany = (values: any) => {
    addCompany({
      name: values.name,
      code: values.code.toUpperCase(),
      businessType: 'General Commercial',
      contactPerson: values.name,
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31',
      packageType: values.packageType,
      email: values.email,
      phone: values.phone,
      address: values.address,
      status: 'active',
      subscriptionPlan: values.subscriptionPlan || 'Enterprise',
      usersCount: 5,
    });
    message.success(`Company ${values.name} registered and provisioned!`);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1E152A' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            Code: <strong>{record.code}</strong> &bull; {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'ERP Package Assigned',
      dataIndex: 'packageType',
      key: 'packageType',
      render: (pkg: any, record: any) => (
        <Select
          value={pkg}
          onChange={(newVal) => {
            updateCompanyPackage(record.id, newVal);
            message.success(`Updated ${record.name} to package: ${newVal}`);
          }}
          style={{ width: 150 }}
        >
          <Option value="COMPLETE">COMPLETE (Both)</Option>
          <Option value="SALES">SALES Only</Option>
          <Option value="SERVICE">SERVICE Only</Option>
        </Select>
      ),
    },
    {
      title: 'Plan Tier',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      render: (plan: string) => <Tag color="purple">{plan || 'Enterprise'}</Tag>,
    },
    {
      title: 'City & Contact',
      key: 'contact',
      render: (_: any, record: any) => (
        <div>
          <div>{record.phone}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>{record.address?.split(',')[0]}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            type="primary"
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => {
              selectCompany(record.id);
              message.info(`Switched active context to ${record.name}`);
            }}
          >
            Open Workspace
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Company & Tenant Management"
        subtitle="Provision, register, and assign ERP packages to corporate tenant organizations."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => setIsModalOpen(true)}
          >
            Register New Company
          </Button>
        }
      />

      <GenericCrudToolbar
        searchPlaceholder="Search by name, code or package..."
        onSearch={setSearchTerm}
        onCreateNew={() => setIsModalOpen(true)}
        createButtonText="Register Company"
      />

      <Table
        dataSource={filteredCompanies}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
      />

      {/* Registration Modal */}
      <Modal
        title="Register New Tenant Organization"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegisterCompany}
          initialValues={{ packageType: 'BOTH', subscriptionPlan: 'Enterprise' }}
        >
          <Form.Item
            label="Legal Company Name"
            name="name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="e.g. Acme Precision Tools Ltd" />
          </Form.Item>

          <Form.Item
            label="Tenant Code (Unique Short Identifier)"
            name="code"
            rules={[{ required: true, message: 'Please enter company code' }]}
          >
            <Input placeholder="e.g. ACME" maxLength={6} style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item
            label="Assign ERP Package"
            name="packageType"
            rules={[{ required: true }]}
            help="Determines accessible modules in the unified frontend"
          >
            <Select>
              <Option value="BOTH">Complete ERP (Sales + Services)</Option>
              <Option value="SALES">Sales ERP (Sales Only)</Option>
              <Option value="SERVICE">Service ERP (Services Only)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Official Business Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="admin@company.com" />
          </Form.Item>

          <Form.Item label="Contact Telephone" name="phone" rules={[{ required: true }]}>
            <Input placeholder="+91 98000 00000" />
          </Form.Item>

          <Form.Item label="Headquarters Address" name="address" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Building, Street, City, State" />
          </Form.Item>

          <Form.Item label="Subscription Tier" name="subscriptionPlan">
            <Select>
              <Option value="Startup">Startup Tier</Option>
              <Option value="Professional">Professional Tier</Option>
              <Option value="Enterprise">Enterprise Unlimited Tier</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            >
              Provision Tenant
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
