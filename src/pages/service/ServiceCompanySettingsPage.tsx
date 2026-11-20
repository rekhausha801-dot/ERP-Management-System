import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Tag, message, Modal } from 'antd';
import {
  Save,
  Phone,
  FileText,
  CreditCard,
  Briefcase,
  Settings,
  DollarSign,
  Clock,
  Calendar,
  Info,
  Headphones,
} from 'lucide-react';
import { IoLocationSharp, IoLocationOutline } from 'react-icons/io5';
import { MdLocationOn, MdPhone, MdEmail, MdLanguage, MdGavel, MdSettings, MdBusiness } from 'react-icons/md';
import { PageHeader } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export const ServiceCompanySettingsPage: React.FC = () => {
  const { selectedCompany, updateCompanyProfile } = useAuth() as any;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const comp = selectedCompany || {
    name: 'PQR Solutions & Services',
    code: 'PQR',
    packageType: 'SERVICE',
    subscriptionPlan: 'Professional',
    businessType: 'Technical Maintenance & Field Engineering',
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
    message.success('Service Company profile updated successfully!');
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
    padding: '16px 20px',
    border: '1px solid #E2E8F0',
    borderTop: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    display: 'block',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: '#0F172A',
  };

  return (
    <div>
      <PageHeader
        title="Service Company Settings"
        subtitle="Manage Service ERP business identity, technical registration, address, service currency and operational parameters."
        actions={
          <Button
            type="primary"
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              borderRadius: 8,
              fontWeight: 600,
            }}
            onClick={() => {
              form.setFieldsValue({
                name: comp.name || 'PQR Solutions & Services',
                code: comp.code || 'PQR',
                email: comp.email || 'support@pqrsolutions.com',
                phone: comp.phone || '+91 98200 11223',
                website: comp.website || 'www.pqrsolutions.com',
                taxId: comp.taxId || 'GSTIN33AABCT9988M1Z0',
                address: comp.address || '12 Tech Park Avenue, Andheri East, Mumbai – 400069, India',
              });
              setIsEditModalOpen(true);
            }}
          >
            Edit Service Profile
          </Button>
        }
      />

      <Row gutter={[20, 20]}>
        {/* Top-Left Banner Card */}
        <Col xs={24} lg={8}>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
              border: '1px solid #E2E8F0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top Navy Section */}
            <div
              style={{
                backgroundColor: '#0F2537',
                padding: '24px 20px',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    backgroundColor: '#4C1D95',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: 20,
                    borderRadius: 12,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  PQR
                </div>
                <div>
                  <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: 16, fontWeight: 700 }}>
                    {comp.name || 'PQR Solutions & Services'}
                  </h3>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0F2537',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                      }}
                    >
                      Package: {comp.packageType || 'SERVICE'}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 12,
                      }}
                    >
                      Plan: {comp.subscriptionPlan || 'Professional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Warm Cream Section */}
            <div
              style={{
                backgroundColor: '#E8D5B5',
                padding: '30px 20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontStyle: 'italic',
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#181433',
                  lineHeight: 1.4,
                  zIndex: 2,
                }}
              >
                Delivering Smart Solutions
                <br />
                for a Better Tomorrow
              </div>
            </div>
          </div>
        </Col>

        {/* Top-Right: Company Information */}
        <Col xs={24} lg={16}>
          <div style={{ boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)', borderRadius: 12 }}>
            <div style={{ ...headerCardStyle, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#0F2537',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  i
                </span>
                <span>Company Information</span>
              </div>
              <Button
                size="small"
                style={{
                  backgroundColor: '#F59E0B',
                  borderColor: '#F59E0B',
                  color: '#000000',
                  fontWeight: 700,
                  borderRadius: 6,
                  fontSize: 12,
                }}
                onClick={() => {
                  form.setFieldsValue({
                    name: comp.name || 'PQR Solutions & Services',
                    code: comp.code || 'PQR',
                    email: comp.email || 'support@pqrsolutions.com',
                    phone: comp.phone || '+91 98200 11223',
                    website: comp.website || 'www.pqrsolutions.com',
                    taxId: comp.taxId || 'GSTIN33AABCT9988M1Z0',
                    address: comp.address || '12 Tech Park Avenue, Andheri East, Mumbai – 400069, India',
                  });
                  setIsEditModalOpen(true);
                }}
              >
                Edit Profile
              </Button>
            </div>
            <div style={bodyCardStyle}>
              <Row gutter={[16, 20]}>
                <Col span={12}>
                  <span style={labelStyle}>Company Name</span>
                  <div style={valueStyle}>{comp.name || 'PQR Solutions & Services'}</div>
                </Col>
                <Col span={12}>
                  <span style={labelStyle}>Company Short Code</span>
                  <div style={valueStyle}>{comp.code || 'PQR'}</div>
                </Col>
                <Col span={12}>
                  <span style={labelStyle}>Business Category</span>
                  <div style={valueStyle}>{comp.businessType || 'Technical Maintenance & Field Engineering'}</div>
                </Col>
                <Col span={12}>
                  <span style={labelStyle}>Package</span>
                  <div style={valueStyle}>{comp.packageType || 'SERVICE'}</div>
                </Col>
                <Col span={12}>
                  <span style={labelStyle}>Company Logo</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <div
                      style={{
                        backgroundColor: '#4C1D95',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 12,
                        borderRadius: 6,
                        padding: '4px 8px',
                      }}
                    >
                      PQR
                    </div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Logo<br />(Visible in Reports & Invoices)</span>
                  </div>
                </Col>
                <Col span={12}>
                  <span style={labelStyle}>Plan</span>
                  <div style={valueStyle}>{comp.subscriptionPlan || 'Professional'}</div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Row 2, Left: Contact Information */}
        <Col xs={24} md={12}>
          <div style={{ boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)', borderRadius: 12, height: '100%' }}>
            <div style={headerCardStyle}>
              <MdPhone size={18} color="#F59E0B" />
              <span>Contact Information</span>
            </div>
            <div style={{ ...bodyCardStyle, minHeight: 180 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MdEmail size={16} color="#64748B" />
                    <span style={labelStyle}>Official Business Email</span>
                  </div>
                  <div style={{ ...valueStyle, marginLeft: 24 }}>{comp.email || 'support@pqrsolutions.com'}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MdPhone size={16} color="#64748B" />
                    <span style={labelStyle}>Official Phone</span>
                  </div>
                  <div style={{ ...valueStyle, marginLeft: 24 }}>{comp.phone || '+91 98200 11223'}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MdLanguage size={16} color="#64748B" />
                    <span style={labelStyle}>Website</span>
                  </div>
                  <div style={{ ...valueStyle, marginLeft: 24 }}>{comp.website || 'www.pqrsolutions.com'}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Headphones size={16} color="#64748B" />
                    <span style={labelStyle}>Support Email</span>
                  </div>
                  <div style={{ ...valueStyle, marginLeft: 24 }}>{comp.helpEmail || 'help@pqrsolutions.com'}</div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* Row 2, Right: Legal & Tax Information */}
        <Col xs={24} md={12}>
          <div style={{ boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)', borderRadius: 12, height: '100%' }}>
            <div style={headerCardStyle}>
              <MdGavel size={18} color="#F59E0B" />
              <span>Legal & Tax Information</span>
            </div>
            <div style={{ ...bodyCardStyle, minHeight: 180 }}>
              <Row gutter={[16, 16]}>
                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={16} color="#64748B" />
                    <span style={labelStyle}>Registration Number</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.registrationNumber || 'REG-2024-9988'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CreditCard size={16} color="#64748B" />
                    <span style={labelStyle}>Tax ID / GSTIN</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.taxId || 'GSTIN33AABCT9988M1Z0'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MdBusiness size={16} color="#64748B" />
                    <span style={labelStyle}>PAN Number</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.panNumber || 'AAABCT9988M'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={16} color="#64748B" />
                    <span style={labelStyle}>Business Type</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.companyType || 'Private Limited'}</div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Row 3, Left: Address Information */}
        <Col xs={24} md={12}>
          <div style={{ boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)', borderRadius: 12, height: '100%' }}>
            <div style={headerCardStyle}>
              <IoLocationSharp size={20} color="#F59E0B" />
              <span>Address Information</span>
            </div>
            <div style={{ ...bodyCardStyle, minHeight: 180 }}>
              <Row gutter={[16, 14]}>
                <Col span={12}>
                  <span style={labelStyle}>Registered Address</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <IoLocationSharp size={20} color="#0F172A" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ ...valueStyle, fontSize: 13, lineHeight: 1.5 }}>
                      12 Tech Park Avenue,<br />
                      Andheri East,<br />
                      Mumbai – 400069, India
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <span style={labelStyle}>City</span>
                      <div style={valueStyle}>{comp.city || 'Mumbai'}</div>
                    </div>
                    <div>
                      <span style={labelStyle}>State</span>
                      <div style={valueStyle}>{comp.state || 'Maharashtra'}</div>
                    </div>
                    <div>
                      <span style={labelStyle}>Country</span>
                      <div style={valueStyle}>{comp.country || 'India'}</div>
                    </div>
                    <div>
                      <span style={labelStyle}>Postal Code</span>
                      <div style={valueStyle}>{comp.postalCode || '400069'}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        {/* Row 3, Right: Business Settings */}
        <Col xs={24} md={12}>
          <div style={{ boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)', borderRadius: 12, height: '100%' }}>
            <div style={headerCardStyle}>
              <MdSettings size={18} color="#F59E0B" />
              <span>Business Settings</span>
            </div>
            <div style={{ ...bodyCardStyle, minHeight: 180 }}>
              <Row gutter={[16, 16]}>
                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarSign size={16} color="#64748B" />
                    <span style={labelStyle}>Currency</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.currency || 'INR (₹)'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="#64748B" />
                    <span style={labelStyle}>Timezone</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.timezone || 'Asia/Kolkata (IST)'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color="#64748B" />
                    <span style={labelStyle}>Working Hours</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.workingHours || 'Mon – Sat: 9:00 AM – 6:00 PM'}</div>
                </Col>

                <Col span={10}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color="#64748B" />
                    <span style={labelStyle}>Business Support</span>
                  </div>
                </Col>
                <Col span={14}>
                  <div style={valueStyle}>{comp.businessSupport || '24/7 Support'}</div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Service Company Profile"
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
              Save Service Profile
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
