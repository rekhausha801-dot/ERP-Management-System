import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Tabs,
  Switch,
  Select,
  InputNumber,
  Table,
  message,
  Tooltip,
} from 'antd';
import {
  Building2,
  Save,
  Shield,
  Sliders,
  Receipt,
  Bell,
  Cpu,
  FileSpreadsheet,
  History,
  CheckCircle,
  MapPin,
  Lock,
  Mail,
  Phone,
  Globe,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';
import { useAuth } from '../../context/AuthContext';

const { Text } = Typography;

export const CompanyProfileSettingsPage: React.FC = () => {
  const { selectedCompany } = useAuth();
  const [activeTab, setActiveTab] = useState('company');

  // Branch management mock state
  const [branches, setBranches] = useState([
    {
      key: '1',
      code: 'HQ-CHN-01',
      name: 'Chennai Corporate Headquarters',
      city: 'Chennai',
      state: 'Tamil Nadu',
      gstin: '33AABCT9988M1Z0',
      isPrimary: true,
      status: 'Active',
    },
    {
      key: '2',
      code: 'BR-BLR-02',
      name: 'Bengaluru Tech & Sales Hub',
      city: 'Bengaluru',
      state: 'Karnataka',
      gstin: '29AABCT9988M1Z8',
      isPrimary: false,
      status: 'Active',
    },
    {
      key: '3',
      code: 'BR-HYD-03',
      name: 'Hyderabad Distribution Depot',
      city: 'Hyderabad',
      state: 'Telangana',
      gstin: '36AABCT9988M1Z4',
      isPrimary: false,
      status: 'Active',
    },
  ]);

  // Integrations state
  const [integrations, setIntegrations] = useState([
    {
      id: 'gstn',
      name: 'Government GSTN & E-Way Portal',
      desc: 'Real-time e-invoicing and automated e-way bill generation via NIC GSP',
      icon: <Receipt size={20} color="#5421A8" />,
      connected: true,
      lastSync: '10 mins ago',
    },
    {
      id: 'email',
      name: 'Enterprise SMTP & Gmail Relay',
      desc: 'Automated quotation dispatch, invoice PDFs and payment reminders',
      icon: <Mail size={20} color="#10B981" />,
      connected: true,
      lastSync: 'Realtime',
    },
    {
      id: 'sms',
      name: 'Transactional SMS & WhatsApp API',
      desc: 'Instant order confirmations and technician dispatch alerts to clients',
      icon: <Phone size={20} color="#0284C7" />,
      connected: true,
      lastSync: 'Realtime',
    },
    {
      id: 'bank',
      name: 'Bank Direct Reconciliation (ICICI / HDFC API)',
      desc: 'Automated bank feed synchronization and virtual account NEFT matching',
      icon: <Building2 size={20} color="#F59E0B" />,
      connected: false,
      lastSync: 'Not Connected',
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar matching Sales Dashboard */}
      <SalesModuleHeader
        title="Settings & System Administration"
        subtitle="Manage business identity, tax configurations, multi-branch operations, security policies, and integrations."
        icon={<Sliders size={20} />}
        primaryActionLabel="Save All Changes"
        onPrimaryAction={() => message.success('Tenant settings saved successfully!')}
      />

      {/* 2. Top 4 High-Impact Metric Cards matching Sales Dashboard Exactly */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'System Uptime',
            value: '99.9%',
            growth: 'SOC-2',
            isDark: true,
            icon: <Shield size={20} color="#5421A8" />,
            pillExtra: 'Encrypted',
          },
          {
            title: 'Branch Hubs',
            value: `${branches.length} Active`,
            growth: 'Pan-India',
            isDark: false,
            icon: <MapPin size={20} color="#10B981" />,
            pillExtra: 'HQ Primary',
          },
          {
            title: 'Live APIs',
            value: `${integrations.filter((i) => i.connected).length} Linked`,
            growth: 'GSTN Live',
            isDark: true,
            icon: <Cpu size={20} color="#F59E0B" />,
            pillExtra: 'Auto Sync',
          },
          {
            title: 'Audit & Access',
            value: 'Protected',
            growth: '2FA On',
            isPositive: true,
            isDark: false,
            icon: <Lock size={20} color="#6D28D9" />,
            pillExtra: 'RBAC Active',
          },
        ]}
      />

      {/* 3. Settings Navigation Tabs Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 18px rgba(84, 33, 168, 0.04)',
          overflow: 'hidden',
          padding: '16px 20px',
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'company',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
                  <Building2 size={15} /> Company Profile
                </span>
              ),
              children: (
                <div style={{ padding: '16px 4px' }}>
                  {/* Tenant Branding Capsule */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #FAF8FE 0%, #F4EEFD 100%)',
                      border: '1px solid #ECE8F6',
                      borderRadius: 16,
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 24,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 16,
                          background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: 22,
                          boxShadow: '0 8px 18px rgba(88, 28, 135, 0.25)',
                        }}
                      >
                        {selectedCompany?.code || 'ERP'}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#1E1B4B' }}>
                          {selectedCompany?.name || 'Apex Precision Tools Ltd'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <Tag
                            style={{
                              background: '#EDE9FE',
                              color: '#5421A8',
                              border: '1px solid #DDD6FE',
                              borderRadius: 12,
                              fontWeight: 700,
                              fontSize: 11,
                              padding: '1px 10px',
                            }}
                          >
                            Package: {selectedCompany?.packageType || 'COMPLETE ERP'}
                          </Tag>
                          <Tag
                            style={{
                              background: '#E0F2FE',
                              color: '#0369A1',
                              border: '1px solid #BAE6FD',
                              borderRadius: 12,
                              fontWeight: 700,
                              fontSize: 11,
                              padding: '1px 10px',
                            }}
                          >
                            Plan: {selectedCompany?.subscriptionPlan || 'Enterprise Multi-Tenant'}
                          </Tag>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      icon={<Save size={15} />}
                      onClick={() => message.success('Company profile updated successfully!')}
                      style={{
                        background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
                        border: 'none',
                        borderRadius: 20,
                        fontWeight: 700,
                        height: 38,
                        padding: '0 20px',
                        boxShadow: '0 4px 14px rgba(88, 28, 135, 0.25)',
                      }}
                    >
                      Save Profile
                    </Button>
                  </div>

                  {/* Form Details */}
                  <Form layout="vertical">
                    <Row gutter={[20, 16]}>
                      <Col xs={24} sm={12}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Registered Legal Entity Name
                        </div>
                        <Input
                          defaultValue={selectedCompany?.name || 'Apex Precision Tools Private Limited'}
                          size="large"
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                      <Col xs={24} sm={6}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Company Code / Prefix
                        </div>
                        <Input
                          defaultValue={selectedCompany?.code || 'APEX'}
                          size="large"
                          disabled
                          style={{ borderRadius: 10, background: '#F8FAFC' }}
                        />
                      </Col>
                      <Col xs={24} sm={6}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Default System Currency
                        </div>
                        <Select
                          defaultValue="INR"
                          size="large"
                          style={{ width: '100%' }}
                          options={[
                            { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                            { value: 'USD', label: 'USD ($) - US Dollar' },
                            { value: 'EUR', label: 'EUR (€) - Euro' },
                            { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
                          ]}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Corporate Billing Email
                        </div>
                        <Input
                          defaultValue={selectedCompany?.email || 'accounts@apexprecision.com'}
                          size="large"
                          prefix={<Mail size={15} color="#94A3B8" />}
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Corporate Telephone / Desk
                        </div>
                        <Input
                          defaultValue={selectedCompany?.phone || '+91 44 2841 9900'}
                          size="large"
                          prefix={<Phone size={15} color="#94A3B8" />}
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          GSTIN / Federal Tax Identification Number
                        </div>
                        <Input
                          defaultValue={(selectedCompany as any)?.taxId || '33AABCT9988M1Z0'}
                          size="large"
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Corporate Identity Number (CIN) / Registration No.
                        </div>
                        <Input
                          defaultValue={(selectedCompany as any)?.registrationNumber || 'U29253TN2018PTC123456'}
                          size="large"
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                      <Col xs={24}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                          Registered Office & Principal Place of Business
                        </div>
                        <Input.TextArea
                          rows={3}
                          defaultValue={
                            selectedCompany?.address ||
                            'Plot No. 44, SIDCO Industrial Estate, Ambattur, Chennai - 600058, Tamil Nadu, India.'
                          }
                          style={{ borderRadius: 10, borderColor: '#ECE8F6' }}
                        />
                      </Col>
                    </Row>
                  </Form>
                </div>
              ),
            },
            {
              key: 'branches',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
                  <MapPin size={15} /> Branch Management
                </span>
              ),
              children: (
                <div style={{ padding: '16px 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E1B4B' }}>
                        Operational Branches & Warehouses
                      </h4>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        Configure regional GSTIN registration, billing dispatch addresses, and warehouse hubs.
                      </div>
                    </div>
                    <Button
                      type="primary"
                      icon={<Plus size={14} />}
                      onClick={() => message.success('Add Branch Drawer opened')}
                      style={{
                        background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
                        border: 'none',
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: 12,
                        padding: '0 16px',
                        height: 36,
                      }}
                    >
                      Add New Branch
                    </Button>
                  </div>

                  <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #ECE8F6' }}>
                    <Table
                      dataSource={branches}
                      pagination={false}
                      size="middle"
                      columns={[
                        {
                          title: 'Branch Code',
                          dataIndex: 'code',
                          key: 'code',
                          render: (code, record) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 800, color: '#5421A8' }}>{code}</span>
                              {record.isPrimary && (
                                <Tag color="purple" style={{ borderRadius: 8, fontSize: 10, fontWeight: 700 }}>
                                  Headquarters
                                </Tag>
                              )}
                            </div>
                          ),
                        },
                        {
                          title: 'Branch Name',
                          dataIndex: 'name',
                          key: 'name',
                          render: (t) => <span style={{ fontWeight: 700, color: '#1E1B4B' }}>{t}</span>,
                        },
                        {
                          title: 'Location',
                          key: 'location',
                          render: (_, r) => (
                            <span style={{ color: '#475569' }}>
                              {r.city}, {r.state}
                            </span>
                          ),
                        },
                        {
                          title: 'State GSTIN',
                          dataIndex: 'gstin',
                          key: 'gstin',
                          render: (gst) => (
                            <Tag style={{ background: '#F8FAFC', borderRadius: 6, fontWeight: 600 }}>{gst}</Tag>
                          ),
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          key: 'status',
                          render: (st) => (
                            <Tag color="success" style={{ borderRadius: 10, fontWeight: 700 }}>
                              {st}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Actions',
                          key: 'actions',
                          render: () => (
                            <Button
                              type="text"
                              size="small"
                              style={{ color: '#5421A8', fontWeight: 700 }}
                              onClick={() => message.info('Edit Branch configuration')}
                            >
                              Edit
                            </Button>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'tax',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
                  <Receipt size={15} /> Tax & GST Configuration
                </span>
              ),
              children: (
                <div style={{ padding: '16px 4px' }}>
                  <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background: '#FAF8FE',
                          borderRadius: 16,
                          padding: 20,
                          border: '1px solid #ECE8F6',
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                          Goods and Services Tax (GST) Defaults
                        </h4>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 }}>
                          Standard statutory rates applied across quotations, sales orders and invoices.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>Auto E-Invoice Generation</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Generate IRN & QR Code for invoices above ₹5 Cr</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <Divider style={{ margin: '6px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>E-Way Bill Generation</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Auto-generate for shipments exceeding ₹50,000</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <Divider style={{ margin: '6px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>Reverse Charge Mechanism (RCM)</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Enable for unregistered vendor transactions</div>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background: '#FAF8FE',
                          borderRadius: 16,
                          padding: 20,
                          border: '1px solid #ECE8F6',
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                          Standard Tax Rates Setup
                        </h4>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 }}>
                          Preset GST tax slabs selectable in line items.
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                          {['0% (Nil / Exempt)', '5% (Essential Commodities)', '12% (Standard Lower)', '18% (Standard Higher / Services)', '28% (Luxury / High Tech)'].map(
                            (rate, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: '#FFFFFF',
                                  padding: '12px 14px',
                                  borderRadius: 12,
                                  border: '1px solid #E2E8F0',
                                  fontWeight: 700,
                                  fontSize: 12,
                                  color: '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span>{rate}</span>
                                <CheckCircle size={14} color="#16A34A" />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'integrations',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
                  <Cpu size={15} /> Integrations & APIs
                </span>
              ),
              children: (
                <div style={{ padding: '16px 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                    {integrations.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: 16,
                          padding: '18px 20px',
                          border: '1px solid #ECE8F6',
                          boxShadow: '0 4px 14px rgba(84, 33, 168, 0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 12,
                                  background: '#FAF8FE',
                                  border: '1px solid #ECE8F6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {item.icon}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#1E1B4B' }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>Sync: {item.lastSync}</div>
                              </div>
                            </div>
                            <Tag
                              color={item.connected ? 'success' : 'default'}
                              style={{ borderRadius: 10, fontWeight: 700, margin: 0 }}
                            >
                              {item.connected ? 'Connected' : 'Disconnected'}
                            </Tag>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                        </div>

                        <div
                          style={{
                            marginTop: 16,
                            paddingTop: 12,
                            borderTop: '1px solid #F1F5F9',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            size="small"
                            type={item.connected ? 'default' : 'primary'}
                            style={{
                              borderRadius: 14,
                              fontWeight: 700,
                              fontSize: 11.5,
                              borderColor: item.connected ? '#E2E8F0' : '#5421A8',
                              background: item.connected ? '#FFFFFF' : '#5421A8',
                              color: item.connected ? '#475569' : '#FFFFFF',
                            }}
                            onClick={() => message.info(`Configured ${item.name}`)}
                          >
                            {item.connected ? 'Configure Keys' : 'Connect API'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              key: 'security',
              label: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
                  <Lock size={15} /> Security & Audit Controls
                </span>
              ),
              children: (
                <div style={{ padding: '16px 4px' }}>
                  <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background: '#FAF8FE',
                          borderRadius: 16,
                          padding: 20,
                          border: '1px solid #ECE8F6',
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                          Tenant Security & Two-Factor Authentication
                        </h4>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 }}>
                          Enforce authentication boundaries for employees and sales managers.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>Enforce 2FA for All Staff</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Require Authenticator App or SMS OTP on login</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <Divider style={{ margin: '6px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>IP Address Whitelisting</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Restrict ERP access to authorized office VPN IPs</div>
                            </div>
                            <Switch />
                          </div>
                          <Divider style={{ margin: '6px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>Session Timeout (Inactivity)</div>
                              <div style={{ fontSize: 11.5, color: '#64748B' }}>Auto logout after 30 minutes of idle time</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div
                        style={{
                          background: '#FAF8FE',
                          borderRadius: 16,
                          padding: 20,
                          border: '1px solid #ECE8F6',
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                          Immutable Audit Trail & Data Backup
                        </h4>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 }}>
                          System integrity logs tracking user transactions and modifications.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div
                            style={{
                              background: '#FFFFFF',
                              padding: '12px 14px',
                              borderRadius: 12,
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#1E1B4B' }}>Daily Automated Database Snapshot</div>
                              <div style={{ fontSize: 11, color: '#64748B' }}>Last snapshot taken at 03:00 AM IST (Cloud Encrypted)</div>
                            </div>
                            <Tag color="success" style={{ fontWeight: 700, borderRadius: 8 }}>Healthy</Tag>
                          </div>
                          <div
                            style={{
                              background: '#FFFFFF',
                              padding: '12px 14px',
                              borderRadius: 12,
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#1E1B4B' }}>Audit Event Retention Period</div>
                              <div style={{ fontSize: 11, color: '#64748B' }}>Preserved for 7 Years (Statutory Tax Compliance)</div>
                            </div>
                            <Tag color="purple" style={{ fontWeight: 700, borderRadius: 8 }}>7 Years</Tag>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export const CompanyGeneralSettingsPage: React.FC = () => {
  return <CompanyProfileSettingsPage />;
};
