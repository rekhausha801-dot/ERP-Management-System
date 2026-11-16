import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Divider, Select, Tabs } from 'antd';
import { Mail, Lock, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_COMPANIES } from '../../mock/erpData';
import type { ErpPackageType } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, companies, selectCompany } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'superadmin'>('company');
  const [selectedCompId, setSelectedCompId] = useState<string>(SAMPLE_COMPANIES[0].id);

  const onFinish = (values: { email: string; password?: string }) => {
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (activeTab === 'superadmin') {
        if (!values.email.includes('admin')) {
          setErrorMsg('Invalid Super Admin credentials. Hint: use superadmin@universal-erp.io');
          return;
        }
        login(values.email, 'superadmin');
        navigate('/super-admin/dashboard');
      } else {
        selectCompany(selectedCompId);
        login(values.email, 'company_admin', selectedCompId);
        navigate('/app/dashboard');
      }
    }, 600);
  };

  const handleQuickTenantSelect = (comp: typeof SAMPLE_COMPANIES[0]) => {
    setSelectedCompId(comp.id);
    selectCompany(comp.id);
    login(`admin@${comp.code.toLowerCase()}.com`, 'company_admin', comp.id);
    navigate('/app/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F1FA',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 14px',
              borderRadius: 14,
              backgroundColor: '#51258C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(81, 37, 140, 0.25)',
              color: '#FFFFFF',
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1E152A', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Universal ERP
          </Title>
          <Text style={{ color: '#7546B8', fontSize: 14, fontWeight: 600 }}>
            Multi-Tenant Sales & Services Operating Platform
          </Text>
        </div>

        {/* Main Card */}
        <Card
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 12px 30px rgba(81, 37, 140, 0.08)',
            border: '1px solid #E8E0F0',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={(k) => {
              setActiveTab(k as 'company' | 'superadmin');
              setErrorMsg(null);
            }}
            centered
            items={[
              { key: 'company', label: 'Company ERP Portal' },
              { key: 'superadmin', label: 'Super Admin HQ' },
            ]}
          />

          {errorMsg && (
            <Alert
              message={errorMsg}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMsg(null)}
              style={{ marginBottom: 20 }}
            />
          )}

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              email: activeTab === 'superadmin' ? 'superadmin@universal-erp.io' : 'devi.director@abctraders.com',
              password: 'Password123!',
            }}
          >
            {activeTab === 'company' && (
              <Form.Item label="Select Tenant Company" required>
                <Select
                  value={selectedCompId}
                  onChange={(val) => setSelectedCompId(val)}
                  size="large"
                  style={{ width: '100%' }}
                >
                  {companies.map((c) => (
                    <Option key={c.id} value={c.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '1px 6px',
                            borderRadius: 4,
                            backgroundColor: '#EFE7F7',
                            color: '#51258C',
                            fontWeight: 700,
                          }}
                        >
                          {c.packageType}
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="Work Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please input your email address' },
                { type: 'email', message: 'Enter a valid corporate email' },
              ]}
            >
              <Input
                size="large"
                prefix={<Mail size={16} color="#8E849E" style={{ marginRight: 6 }} />}
                placeholder="name@company.com"
              />
            </Form.Item>

            <Form.Item
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>Password</span>
                  <Link to="/forgot-password" style={{ color: '#7546B8', fontSize: 13, fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
              }
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<Lock size={16} color="#8E849E" style={{ marginRight: 6 }} />}
                placeholder="Enter password"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{
                  backgroundColor: '#51258C',
                  borderColor: '#51258C',
                  height: 44,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                }}
              >
                Sign In to {activeTab === 'superadmin' ? 'Super Admin HQ' : 'Tenant Workspace'}
              </Button>
            </Form.Item>
          </Form>

          {/* Quick Demo Switcher */}
          <Divider style={{ margin: '20px 0 12px', fontSize: 12, color: '#8E849E' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={13} color="#7546B8" /> ONE-CLICK DEMO COMPANIES
            </span>
          </Divider>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SAMPLE_COMPANIES.map((comp) => (
              <div
                key={comp.id}
                onClick={() => handleQuickTenantSelect(comp)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #E8E0F0',
                  backgroundColor: '#FAF7FC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7546B8')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E0F0')}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E152A' }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#7546B8' }}>
                    Package: <strong>{comp.packageType}</strong>
                  </div>
                </div>
                <ArrowRight size={15} color="#51258C" />
              </div>
            ))}
          </div>
        </Card>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: '#8E849E' }}>
            Universal Multi-Tenant ERP &bull; Unified Enterprise Architecture &bull; Phase 1
          </Text>
        </div>
      </div>
    </div>
  );
};
