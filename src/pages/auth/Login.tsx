import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Divider, Select, Alert } from 'antd';
import { Mail, Lock, Building, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_COMPANIES } from '../../mocks/companies.mock';
import { ERP_PACKAGES } from '../../config/erpPackageConfig';
import type { ErpPackageId } from '../../config/erpPackageConfig';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
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
      
      const isStaff = values.email.toLowerCase().includes('staff');
      const role = isStaff ? 'office_staff' : 'company_admin';

      login(values.email, role as any, selectedCompId);

      if (isStaff) {
        navigate('/app/portal/office-staff');
      } else {
        navigate('/app/dashboard');
      }
    }, 600);
  };

  const handleQuickLogin = (comp: typeof SAMPLE_COMPANIES[0]) => {
    setSelectedCompId(comp.id);
    selectCompany(comp.id);
    login(`admin@${comp.code.toLowerCase()}.com`, 'company_admin', comp.id);
    navigate('/app/dashboard');
  };

  const handleQuickStaffLogin = () => {
    const serviceComp = SAMPLE_COMPANIES.find(c => c.packageType === 'SERVICE') || SAMPLE_COMPANIES[0];
    setSelectedCompId(serviceComp.id);
    selectCompany(serviceComp.id);
    login('staff@pqrsolutions.com', 'office_staff', serviceComp.id);
    navigate('/app/portal/office-staff');
  };

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            width: 52,
            height: 52,
            margin: '0 auto 12px',
            borderRadius: 12,
            backgroundColor: '#51258C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(81, 37, 140, 0.25)',
            color: '#FFFFFF',
          }}
        >
          <ShieldCheck size={30} />
        </div>
        <Title level={2} style={{ margin: 0, color: '#242033', fontWeight: 800 }}>
          Universal ERP
        </Title>
        <Text style={{ color: '#7546B8', fontSize: 14, fontWeight: 600 }}>
          Multi-Tenant Sales & Services Platform
        </Text>
      </div>

      {/* Main Login Card */}
      <Card
        bordered
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(81, 37, 140, 0.06)',
          borderColor: '#E7E0F0',
        }}
        styles={{ body: { padding: '28px 32px' } }}
      >
        {/* Package Tabs for Dedicated Login Experiences */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#7E7A9B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, textAlign: 'center' }}>
            Choose ERP Subscription Gateway
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, backgroundColor: '#F3F0F9', padding: 4, borderRadius: 12 }}>
            {[
              { id: 'COMPLETE', label: 'Complete ERP', sub: 'Sales + Service' },
              { id: 'SALES', label: 'Sales ERP', sub: 'Sales Only' },
              { id: 'SERVICE', label: 'Service ERP', sub: 'Services Only' },
            ].map((pkg) => {
              const active = selectedCompId ? SAMPLE_COMPANIES.find(c => c.id === selectedCompId)?.packageType === pkg.id : pkg.id === 'COMPLETE';
              const targetComp = SAMPLE_COMPANIES.find(c => c.packageType === pkg.id) || SAMPLE_COMPANIES[0];
              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setSelectedCompId(targetComp.id);
                    selectCompany(targetComp.id);
                  }}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 9,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: active ? '#FFFFFF' : 'transparent',
                    boxShadow: active ? '0 3px 10px rgba(110, 86, 207, 0.15)' : 'none',
                    border: active ? '1px solid rgba(110, 86, 207, 0.2)' : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: active ? '#6E56CF' : '#181433' }}>
                    {pkg.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#7E7A9B' }}>{pkg.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: 'admin@abctraders.com',
            password: 'Password123!',
            remember: true,
          }}
        >
          {/* Company Login Selection */}
          <Form.Item label="Select Tenant Company" required>
            <Select
              value={selectedCompId}
              onChange={(val) => setSelectedCompId(val)}
              size="large"
              style={{ width: '100%' }}
            >
              {companies.map((c) => {
                const pkg = ERP_PACKAGES[c.packageType as ErpPackageId] || ERP_PACKAGES.COMPLETE;
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
              prefix={<Mail size={16} color="#9E98AD" style={{ marginRight: 6 }} />}
              placeholder="name@company.com"
            />
          </Form.Item>

          {/* Password with Show/Hide toggle */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              size="large"
              prefix={<Lock size={16} color="#9E98AD" style={{ marginRight: 6 }} />}
              placeholder="Enter password"
            />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#77718A' }}>Remember Me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: '#7546B8', fontSize: 13, fontWeight: 500 }}>
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
                backgroundColor: '#51258C',
                borderColor: '#51258C',
                height: 44,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 6,
              }}
            >
              Sign In to Workspace
            </Button>
          </Form.Item>
        </Form>

        {/* Demo Switcher */}
        <Divider style={{ margin: '20px 0 14px', fontSize: 12, color: '#9E98AD' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={13} color="#7546B8" /> ONE-CLICK TEST COMPANIES
          </span>
        </Divider>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Quick Office Staff Service Desk Login */}
          <div
            onClick={handleQuickStaffLogin}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1.5px solid #7C3AED',
              backgroundColor: '#F5F3FF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6' }}>
                Office Staff (Service Request Intake)
              </div>
              <div style={{ fontSize: 11, color: '#6D28D9' }}>
                Restricted portal: Phone intake, status tracking & submissions only
              </div>
            </div>
            <ArrowRight size={15} color="#7C3AED" />
          </div>

          {SAMPLE_COMPANIES.map((comp) => {
            const meta = ERP_PACKAGES[comp.packageType as ErpPackageId] || ERP_PACKAGES.COMPLETE;
            return (
              <div
                key={comp.id}
                onClick={() => handleQuickLogin(comp)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #E7E0F0',
                  backgroundColor: '#FAF7FC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7546B8')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E7E0F0')}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#242033' }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: 11, color: meta.badgeColor, fontWeight: 600 }}>
                    Package: {meta.name} ({comp.packageType})
                  </div>
                </div>
                <ArrowRight size={15} color="#51258C" />
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <Text style={{ fontSize: 12, color: '#9E98AD' }}>
          Universal Multi-Tenant ERP &bull; Unified Enterprise Architecture
        </Text>
      </div>
    </div>
  );
};
