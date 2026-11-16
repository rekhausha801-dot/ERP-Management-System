import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Tag,
  message,
} from 'antd';
import { Plus } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { ERP_PACKAGES } from '../../config/erpPackageConfig';
import type { Company } from '../../mocks/companies.mock';
import type { ErpPackageId } from '../../config/erpPackageConfig';

const { Option } = Select;

export const CompanyList: React.FC = () => {
  const { companies, addCompany, updateCompanyPackage, selectCompany } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');

  const filtered = companies.filter(
    (c: Company) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = (values: any) => {
    addCompany({
      name: values.name,
      code: values.code.toUpperCase(),
      businessType: values.businessType,
      contactPerson: values.contactPerson,
      email: values.email,
      phone: values.phone,
      address: values.address,
      country: 'India',
      state: values.state || 'Tamil Nadu',
      city: values.city || 'Chennai',
      packageType: values.packageType,
      subscriptionPlan: values.subscriptionPlan,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-12-31',
      status: 'active',
      usersCount: 5,
    });
    message.success(`Company ${values.name} registered and provisioned!`);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Company & Code',
      dataIndex: 'name',
      key: 'name',
      render: (t: string, r: Company) => (
        <div>
          <div style={{ fontWeight: 600, color: '#242033' }}>{t}</div>
          <div style={{ fontSize: 12, color: '#77718A' }}>
            Code: <strong>{r.code}</strong> &bull; {r.contactPerson}
          </div>
        </div>
      ),
    },
    {
      title: 'ERP Package',
      dataIndex: 'packageType',
      key: 'packageType',
      render: (pkg: ErpPackageId, record: Company) => (
        <Select
          value={pkg}
          onChange={(newVal) => {
            updateCompanyPackage(record.id, newVal);
            message.success(`Updated ${record.name} to package: ${newVal}`);
          }}
          style={{ width: 140 }}
        >
          <Option value="COMPLETE">COMPLETE</Option>
          <Option value="SALES">SALES</Option>
          <Option value="SERVICE">SERVICE</Option>
        </Select>
      ),
    },
    {
      title: 'Plan Tier',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      render: (plan: string) => <Tag color="purple">{plan}</Tag>,
    },
    {
      title: 'City & Contact',
      key: 'contact',
      render: (_: any, r: Company) => (
        <div>
          <div>{r.city}, {r.state}</div>
          <div style={{ fontSize: 12, color: '#77718A' }}>{r.phone}</div>
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
      render: (_: any, r: Company) => (
        <Button
          size="small"
          type="primary"
          style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
          onClick={() => {
            selectCompany(r.id);
            message.info(`Switched active tenant to ${r.name}`);
          }}
        >
          Open Portal
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Company & Tenant Management"
        subtitle="Provision legal entities, assign ERP tiers, and manage multi-tenant lifecycle."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => setModalOpen(true)}
          >
            Register New Company
          </Button>
        }
      />

      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search companies by name, code, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
        />
      </div>

      <Table dataSource={filtered} columns={columns} rowKey="id" bordered />

      {/* Register Company Modal */}
      <Modal
        title="Register New Enterprise Tenant"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          initialValues={{ packageType: 'COMPLETE', subscriptionPlan: 'Enterprise' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Company Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Acme Tools Pvt Ltd" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Unique Company Code" name="code" rules={[{ required: true }]}>
                <Input placeholder="ACME" maxLength={6} style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Business Type" name="businessType" rules={[{ required: true }]}>
                <Input placeholder="Manufacturing & Distribution" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true }]}>
                <Input placeholder="Rajesh Kumar" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Official Business Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="info@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Telephone" name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98000 00000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Input placeholder="Chennai" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="State" name="state" rules={[{ required: true }]}>
                <Input placeholder="Tamil Nadu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Assign ERP Package" name="packageType" rules={[{ required: true }]}>
                <Select>
                  <Option value="COMPLETE">Complete ERP (Sales + Services)</Option>
                  <Option value="SALES">Sales ERP (Sales Only)</Option>
                  <Option value="SERVICE">Service ERP (Services Only)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Subscription Tier" name="subscriptionPlan" rules={[{ required: true }]}>
                <Select>
                  <Option value="Startup">Startup Tier</Option>
                  <Option value="Professional">Professional Tier</Option>
                  <Option value="Enterprise">Enterprise Tier</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Headquarters Address" name="address" rules={[{ required: true }]}>
                <Input.TextArea rows={2} placeholder="Building, Street, Area" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}>
              Register & Provision
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
