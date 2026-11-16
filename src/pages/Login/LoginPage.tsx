import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Divider, Select, Alert } from 'antd';
import { Mail, Lock, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_COMPANIES } from '../../mock/erpData';
import { ERP_PACKAGES_METADATA } from '../../config/modules.config';
import type { ErpPackage } from '../../config/modules.config';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, companies, selectCompany } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCompId, setSelectedCompId] = useState<string>(SAMPLE_COMPANIES[0].id);

  const onFinish = (values: { email: string; password?: string; remember?: boolean }) => {
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      selectCompany(selectedCompId);
      login(values.email, 'company_admin', selectedCompId);
      navigate('/app/dashboard');
    }, 600);
  };

  const handleQuickLogin = (comp: typeof SAMPLE_COMPANIES[0]) => {
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
        backgroundColor: '#F8FAFC',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: '0 auto 12px',
              borderRadius: 12,
              backgroundColor: '#172554',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(23, 37, 84, 0.25)',
              color: '#FFFFFF',
            }}
          >
            <ShieldCheck size={30} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#0F172A', fontWeight: 800 }}>
            Universal ERP
          </Title>
          <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: 600 }}>
            Multi-Company Cloud Enterprise Platform
          </Text>
        </div>

        {/* Login Card */}
        <Card
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            borderColor: '#E2E8F0',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {errorMsg && (
            <Alert
              message={errorMsg}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 20 }}
            />
          )}

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              email: 'admin@abctraders.com',
              password: 'Password123!',
              remember: true,
            }}
          >
            {/* Company Selection */}
            <Form.Item label="Select Target Company" required>
              <Select
                value={selectedCompId}
                onChange={(val) => setSelectedCompId(val)}
                size="large"
                style={{ width: '100%' }}
              >
                {companies.map((c) => {
                  const pkg = ERP_PACKAGES_METADATA[c.packageType as ErpPackage] || ERP_PACKAGES_METADATA.BOTH;
                  return (
                    <Select.Option key={c.id} value={c.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 6px',
                            borderRadius: 4,
                            backgroundColor: pkg.badgeBg,
                            color: pkg.badgeColor,
                            fontWeight: 700,
                          }}
                        >
                          {pkg.name}
                        </span>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* Email / Username */}
            <Form.Item
              label="Work Email / Username"
              name="email"
              rules={[{ required: true, message: 'Please input your work email' }]}
            >
              <Input
                size="large"
                prefix={<Mail size={16} color="#94A3B8" style={{ marginRight: 6 }} />}
                placeholder="name@company.com"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                size="large"
                prefix={<Lock size={16} color="#94A3B8" style={{ marginRight: 6 }} />}
                placeholder="Enter password"
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#64748B' }}>Remember Me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#2563EB', fontSize: 13, fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                style={{
                  backgroundColor: '#2563EB',
                  borderColor: '#2563EB',
                  height: 44,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 6,
                }}
              >
                Sign In to Company ERP
              </Button>
            </Form.Item>
          </Form>

          {/* Quick Demo Company Switcher */}
          <Divider style={{ margin: '20px 0 14px', fontSize: 12, color: '#94A3B8' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={13} color="#2563EB" /> INSTANT DEMO ACCESS
            </span>
          </Divider>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SAMPLE_COMPANIES.map((comp) => {
              const meta = ERP_PACKAGES_METADATA[comp.packageType as ErpPackage] || ERP_PACKAGES_METADATA.BOTH;
              return (
                <div
                  key={comp.id}
                  onClick={() => handleQuickLogin(comp)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2563EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: 11, color: meta.badgeColor, fontWeight: 600 }}>
                      Package: {meta.name} ({comp.packageType})
                    </div>
                  </div>
                  <ArrowRight size={15} color="#2563EB" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>
            Universal ERP Platform &bull; Multi-Tenant Enterprise Architecture
          </Text>
        </div>
      </div>
    </div>
  );
};
