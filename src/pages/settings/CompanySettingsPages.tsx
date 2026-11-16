import React from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Divider, Tag, message } from 'antd';
import { Building2, Save, Shield } from 'lucide-react';
import { PageHeader, PackageBadge } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export const CompanyProfileSettingsPage: React.FC = () => {
  const { selectedCompany } = useAuth();

  return (
    <div>
      <PageHeader
        title="Company Profile & Tenant Setup"
        subtitle="Manage business credentials, address, and legal registrations."
      />

      <Card style={{ borderRadius: 8, maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              backgroundColor: '#51258C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            {selectedCompany?.code || 'ERP'}
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>{selectedCompany?.name}</Title>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="purple">Package: {selectedCompany?.packageType}</Tag>
              <Tag color="blue">Plan: {selectedCompany?.subscriptionPlan || 'Enterprise'}</Tag>
            </div>
          </div>
        </div>

        <Form layout="vertical" initialValues={selectedCompany || {}}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Company Name">
                <Input defaultValue={selectedCompany?.name} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Company Short Code">
                <Input defaultValue={selectedCompany?.code} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Official Business Email">
                <Input defaultValue={selectedCompany?.email} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Official Phone">
                <Input defaultValue={selectedCompany?.phone} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Registration Number">
                <Input defaultValue={(selectedCompany as any)?.registrationNumber || 'REG-2024-9988'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tax ID / GSTIN">
                <Input defaultValue={(selectedCompany as any)?.taxId || 'GSTIN33AABCT9988M1Z0'} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Registered Address">
                <Input.TextArea rows={2} defaultValue={selectedCompany?.address} />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            icon={<Save size={16} />}
            style={{ backgroundColor: '#51258C', borderColor: '#51258C' }}
            onClick={() => message.success('Company profile updated successfully!')}
          >
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export const CompanyGeneralSettingsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Tenant System Settings"
        subtitle="Configure currency, invoice prefixes, notification preferences, and working hours."
      />
      <Card style={{ borderRadius: 8, maxWidth: 800 }}>
        <p style={{ color: '#5C526A' }}>
          Configured Currency: <strong>INR (₹)</strong> &bull; Date Format: <strong>DD/MM/YYYY</strong> &bull; Timezone: <strong>Asia/Kolkata (IST)</strong>
        </p>
      </Card>
    </div>
  );
};
