import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Tag, message, Modal } from 'antd';
import {
  Building2,
  Save,
  Edit3,
  Mail,
  Phone,
  Globe,
  Headphones,
  Scale,
  FileText,
  CreditCard,
  Briefcase,
  Settings,
  DollarSign,
  Clock,
  Calendar,
  Info,
} from 'lucide-react';
import { IoLocationSharp, IoLocationOutline } from 'react-icons/io5';
import { MdLocationOn, MdPhone, MdEmail, MdLanguage, MdGavel, MdSettings, MdBusiness } from 'react-icons/md';
import { PageHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export const CompanyProfileSettingsPage: React.FC = () => {
  const { selectedCompany, updateCompanyProfile } = useAuth() as any;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const comp = selectedCompany || {
    name: 'PQR Solutions & Services',
    code: 'PQR',
    packageType: 'SERVICE',
    subscriptionPlan: 'Professional',
    businessType: 'IT & Service Solutions',
    email: 'support@pqrsolutions.com',
    phone: '+91 98200 11223',
    website: 'www.pqrsolutions.com',
    helpEmail: 'help@pqrsolutions.com',
    registrationNumber: 'REG-2024-9988',
    taxId: 'GSTIN33AABCT9988M1Z0',
    panNumber: 'AAABCT9988M',
    companyType: 'Private Limited',
    address: '12 Tech Park Avenue,\nAndheri East,\nMumbai – 400069, India',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400069',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)',
    workingHours: 'Mon – Sat: 9:00 AM – 6:00 PM',
    businessSupport: '24/7 Support',
  };

  const handleEditSave = (values: any) => {
    if (updateCompanyProfile) {
      updateCompanyProfile(values);
    }
    message.success('Company profile updated successfully!');
    setIsEditModalOpen(false);
  };

  const headerCardStyle: React.CSSProperties = {
    backgroundColor: '#4C1D95',
    color: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 700,
  };

  const bodyCardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '0 0 12px 12px',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
    padding: '16px 20px',
    boxShadow: '0 4px 16px rgba(15, 39, 68, 0.04)',
    height: 'calc(100% - 42px)',
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      <PageHeader
        title="Company Profile"
        subtitle="Manage business credentials, address, and legal registrations."
      />

      {/* TOP ROW: Brand Hero Card (Left) & Company Information (Right) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* 1. Left Brand Hero Card */}
        <Col xs={24} lg={9}>
          <div
            style={{
              borderRadius: 16,
              background: 'linear-gradient(180deg, #3B0764 0%, #4C1D95 60%, #EAD8B1 60%, #F5E7CA 100%)',
              border: '1px solid #CBD5E1',
              boxShadow: '0 8px 24px rgba(76, 29, 149, 0.12)',
              height: '100%',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  backgroundColor: '#4C1D95',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  boxShadow: '0 4px 12px rgba(76, 29, 149, 0.3)',
                  border: '2px solid #FFFFFF',
                  flexShrink: 0,
                }}
              >
                {comp.code || 'PQR'}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: 16, fontWeight: 800 }}>
                  {comp.name || 'PQR Solutions & Services'}
                </h3>
                <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#0D233A',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    Package: {comp.packageType || 'SERVICE'}
                  </span>
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    Plan: {comp.subscriptionPlan || 'Professional'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Motto on Golden Cream Section */}
            <div style={{ textAlign: 'center', paddingTop: 30, paddingBottom: 4 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: '#0F2744',
                  letterSpacing: '0.02em',
                }}
              >
                Delivering Smart Solutions
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: '#0F2744',
                  letterSpacing: '0.02em',
                }}
              >
                for a Better Tomorrow
              </div>
            </div>
          </div>
        </Col>

        {/* 2. Right: Company Information */}
        <Col xs={24} lg={15}>
          <div style={{ height: '100%' }}>
            <div style={{ ...headerCardStyle, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ backgroundColor: '#F59E0B', color: '#000', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>i</span>
                <span>Company Information</span>
              </div>
              <Button
                size="small"
                icon={<Edit3 size={13} />}
                style={{
                  backgroundColor: '#F59E0B',
                  borderColor: '#F59E0B',
                  color: '#000',
                  fontWeight: 700,
                  borderRadius: 16,
                  fontSize: 11,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onClick={() => {
                  form.setFieldsValue(comp);
                  setIsEditModalOpen(true);
                }}
              >
                Edit Profile
              </Button>
            </div>
            <div style={bodyCardStyle}>
              <Row gutter={[20, 16]}>
                <Col span={14}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Company Name</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{comp.name || 'PQR Solutions & Services'}</div>
                </Col>
                <Col span={10}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Company Short Code</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{comp.code || 'PQR'}</div>
                </Col>
                <Col span={14}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Business Category</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{comp.businessType || 'IT & Service Solutions'}</div>
                </Col>
                <Col span={10}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Package</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{comp.packageType || 'SERVICE'}</div>
                </Col>
                <Col span={14}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Company Logo</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#4C1D95', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                      {comp.code || 'PQR'}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>Logo</div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>(Visible in Reports)</div>
                    </div>
                  </div>
                </Col>
                <Col span={10}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Plan</div>
                  <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{comp.subscriptionPlan || 'Professional'}</div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* MIDDLE ROW: Contact Information & Legal / Tax Information */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {/* Contact Information */}
        <Col xs={24} lg={12}>
          <div>
            <div style={headerCardStyle}>
              <Phone size={16} color="#F59E0B" />
              <span>Contact Information</span>
            </div>
            <div style={bodyCardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Mail size={16} color="#0F2744" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Official Business Email</div>
                    <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{comp.email || 'support@pqrsolutions.com'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Phone size={16} color="#0F2744" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Official Phone</div>
                    <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{comp.phone || '+91 98200 11223'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Globe size={16} color="#0F2744" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Website</div>
                    <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{comp.website || 'www.pqrsolutions.com'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Headphones size={16} color="#0F2744" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Support Email</div>
                    <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{comp.helpEmail || 'help@pqrsolutions.com'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Legal & Tax Information */}
        <Col xs={24} lg={12}>
          <div>
            <div style={headerCardStyle}>
              <Scale size={16} color="#F59E0B" />
              <span>Legal & Tax Information</span>
            </div>
            <div style={bodyCardStyle}>
              <Row gutter={[16, 12]}>
                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Registration Number</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {(comp as any).registrationNumber || 'REG-2024-9988'}
                  </span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Tax ID / GSTIN</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {(comp as any).taxId || 'GSTIN33AABCT9988M1Z0'}
                  </span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>PAN Number</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {(comp as any).panNumber || 'AAABCT9988M'}
                  </span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Briefcase size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Business Type</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    {(comp as any).companyType || 'Private Limited'}
                  </span>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* BOTTOM ROW: Address Information & Business Settings */}
      <Row gutter={[16, 16]}>
        {/* Address Information */}
        <Col xs={24} lg={12}>
          <div>
            <div style={headerCardStyle}>
              <IoLocationOutline size={18} color="#F59E0B" />
              <span>Address Information</span>
            </div>
            <div style={bodyCardStyle}>
              <Row gutter={[16, 14]}>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <IoLocationSharp size={18} color="#4C1D95" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Registered Address</div>
                      <div style={{ fontSize: 12, color: '#0F172A', fontWeight: 600, lineHeight: 1.5, marginTop: 2 }}>
                        {comp.address || '12 Tech Park Avenue,\nAndheri East,\nMumbai – 400069, India'}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <Row gutter={[8, 8]}>
                    <Col span={10} style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>City</Col>
                    <Col span={14} style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{comp.city || 'Mumbai'}</Col>
                    <Col span={10} style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>State</Col>
                    <Col span={14} style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{comp.state || 'Maharashtra'}</Col>
                    <Col span={10} style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Country</Col>
                    <Col span={14} style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{comp.country || 'India'}</Col>
                    <Col span={10} style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Postal Code</Col>
                    <Col span={14} style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{(comp as any).postalCode || '400069'}</Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Business Settings */}
        <Col xs={24} lg={12}>
          <div>
            <div style={headerCardStyle}>
              <Settings size={16} color="#F59E0B" />
              <span>Business Settings</span>
            </div>
            <div style={bodyCardStyle}>
              <Row gutter={[16, 12]}>
                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarSign size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Currency</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>INR (₹)</span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Timezone</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Asia/Kolkata (IST)</span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Working Hours</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Mon – Sat: 9:00 AM – 6:00 PM</span>
                </Col>

                <Col span={10} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Headphones size={15} color="#0F2744" />
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>Business Support</span>
                </Col>
                <Col span={14}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>24/7 Support</span>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Company Profile"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Company Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Company Short Code" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Business Email" name="email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website" name="website">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tax ID / GSTIN" name="taxId">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Registered Address" name="address">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }}>
              Save Profile
            </Button>
          </div>
        </Form>
      </Modal>
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
