import React, { useState } from 'react';
import {
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Tooltip,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  Receipt,
  Plus,
  Search,
  FileSpreadsheet,
  Download,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  Trash2,
  Shield,
  Layers,
  Sparkles,
  ArrowUpRight,
  Info,
  Check,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

export interface TaxRateItem {
  key: string;
  code: string;
  taxName: string;
  category: 'GST' | 'TCS' | 'TDS' | 'CESS' | 'EXEMPT';
  hsnSacRange: string;
  rate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate?: number;
  appliesTo: 'Products & Services' | 'Only Goods' | 'Only Services' | 'Contracts';
  reverseCharge: boolean;
  status: 'Active' | 'Inactive';
}

const DEFAULT_TAX_RATES: TaxRateItem[] = [
  {
    key: '1',
    code: 'GST-18',
    taxName: 'Standard GST 18% (Industrial & Tech Services)',
    category: 'GST',
    hsnSacRange: '84000000 - 85999999 / 998300',
    rate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    appliesTo: 'Products & Services',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '2',
    code: 'GST-12',
    taxName: 'Standard Lower GST 12% (Machinery & Parts)',
    category: 'GST',
    hsnSacRange: '84140000 - 84879000',
    rate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 12,
    appliesTo: 'Only Goods',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '3',
    code: 'GST-05',
    taxName: 'Concessional GST 5% (Essential Commodities)',
    category: 'GST',
    hsnSacRange: '25010000 - 38240000',
    rate: 5,
    cgstRate: 2.5,
    sgstRate: 2.5,
    igstRate: 5,
    appliesTo: 'Only Goods',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '4',
    code: 'GST-28',
    taxName: 'Luxury / High Tech Equipment GST 28%',
    category: 'GST',
    hsnSacRange: '87080000 - 89030000',
    rate: 28,
    cgstRate: 14,
    sgstRate: 14,
    igstRate: 28,
    appliesTo: 'Only Goods',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '5',
    code: 'GST-NIL',
    taxName: 'Exempt / Nil Rated (Zero Statutory Tax)',
    category: 'EXEMPT',
    hsnSacRange: '00000000 - 99999999',
    rate: 0,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 0,
    appliesTo: 'Products & Services',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '6',
    code: 'TCS-0.1',
    taxName: 'Tax Collected at Source (Sec 206C 1H)',
    category: 'TCS',
    hsnSacRange: 'Aggregate Sales > ₹50 Lakhs',
    rate: 0.1,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 0.1,
    appliesTo: 'Contracts',
    reverseCharge: false,
    status: 'Active',
  },
  {
    key: '7',
    code: 'TDS-194C',
    taxName: 'Contractor TDS Deduction (194C - 2%)',
    category: 'TDS',
    hsnSacRange: 'Labour & Engineering Contracts',
    rate: 2,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 2,
    appliesTo: 'Only Services',
    reverseCharge: true,
    status: 'Active',
  },
];

export const TaxConfigurationPage: React.FC = () => {
  const [taxRates, setTaxRates] = useState<TaxRateItem[]>(DEFAULT_TAX_RATES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredRates = taxRates.filter((item) => {
    const matchesSearch =
      item.taxName.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.hsnSacRange.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddTax = (values: any) => {
    const rateVal = Number(values.rate || 0);
    const isGst = values.category === 'GST';
    const halfRate = isGst ? rateVal / 2 : 0;

    const newItem: TaxRateItem = {
      key: `${taxRates.length + 1}`,
      code: values.code.toUpperCase(),
      taxName: values.taxName,
      category: values.category,
      hsnSacRange: values.hsnSacRange || 'Universal Applicability',
      rate: rateVal,
      cgstRate: halfRate,
      sgstRate: halfRate,
      igstRate: rateVal,
      appliesTo: values.appliesTo || 'Products & Services',
      reverseCharge: !!values.reverseCharge,
      status: 'Active',
    };

    setTaxRates([newItem, ...taxRates]);
    setIsModalOpen(false);
    form.resetFields();
    message.success(`New Tax Configuration ${newItem.code} saved successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header Bar matching Sales Dashboard Exactly */}
      <SalesModuleHeader
        title="Tax Configuration & Statutory Slabs"
        subtitle="Manage GST tax slabs, HSN/SAC mappings, reverse charge mechanisms, and GSTR compliance presets."
        icon={<Receipt size={20} />}
        searchPlaceholder="Search tax code, nomenclature, HSN/SAC..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="New Tax Slab"
        onPrimaryAction={() => setIsModalOpen(true)}
        extraActions={
          <Button
            icon={<FileSpreadsheet size={14} />}
            onClick={() => message.success('Exporting GST Statutory Tariff Schedule...')}
            style={{
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 12,
              borderColor: '#ECE8F6',
              color: '#4B5563',
              height: 36,
              padding: '0 14px',
              backgroundColor: '#FFFFFF',
            }}
          >
            Export Tariff Sheet
          </Button>
        }
      />

      {/* 2. Top 4 High-Impact Metric Cards matching Sales Dashboard Exactly */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Active Tax Slabs',
            value: `${taxRates.filter((t) => t.status === 'Active').length} Slabs`,
            growth: 'GST Compliant',
            isDark: true,
            icon: <Receipt size={20} color="#5421A8" />,
          },
          {
            title: 'Primary Standard Rate',
            value: '18% GST',
            growth: 'Industrial Std',
            isDark: false,
            icon: <Percent size={20} color="#10B981" />,
          },
          {
            title: 'Mapped HSN Categories',
            value: '14,200+ Codes',
            growth: 'NIC Synced',
            isDark: true,
            icon: <Layers size={20} color="#F59E0B" />,
          },
          {
            title: 'Reverse Charge (RCM)',
            value: 'Configured',
            growth: 'Automated',
            isPositive: true,
            isDark: false,
            icon: <Shield size={20} color="#6D28D9" />,
          },
        ]}
      />

      {/* 3. Ultra-Premium Table Container Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #ECE8F6',
          boxShadow: '0 8px 24px rgba(84, 33, 168, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Table Top Header and Filter Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #F3F0FA',
            flexWrap: 'wrap',
            gap: 12,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8FE 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(117, 68, 214, 0.12)',
                flexShrink: 0,
              }}
            >
              <Receipt size={18} color="#7544D6" />
            </div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.2px' }}>
                Statutory Tax Classification Schedule
              </span>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
                Central GST, State GST, Integrated IGST, and Withholding Tax Slabs
              </div>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'GST', 'TCS', 'TDS', 'EXEMPT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: 16,
                  fontWeight: 700,
                  fontSize: 11,
                  height: 28,
                  padding: '0 12px',
                  transition: 'all 0.15s ease',
                  background: categoryFilter === cat ? '#5421A8' : '#F1EDF9',
                  color: categoryFilter === cat ? '#FFFFFF' : '#5C5470',
                  boxShadow: categoryFilter === cat ? '0 2px 8px rgba(84, 33, 168, 0.25)' : 'none',
                }}
              >
                {cat === 'ALL' ? 'All Slabs' : `${cat}`}
              </button>
            ))}
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 700, marginLeft: 6 }}>
              Total: <strong style={{ color: '#5421A8' }}>{filteredRates.length}</strong>
            </div>
          </div>
        </div>

        {/* Custom Ultra-Clean Premium HTML Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF9FE' }}>
                <th
                  style={{
                    padding: '12px 18px',
                    fontSize: 11,
                    color: '#6B7280',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    width: 160,
                  }}
                >
                  Tax Code & Rate
                </th>
                <th
                  style={{
                    padding: '12px 18px',
                    fontSize: 11,
                    color: '#6B7280',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    minWidth: 280,
                  }}
                >
                  Statutory Description
                </th>
                <th
                  style={{
                    padding: '12px 18px',
                    fontSize: 11,
                    color: '#6B7280',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    minWidth: 240,
                  }}
                >
                  Jurisdiction Breakdown
                </th>
                <th
                  style={{
                    padding: '12px 18px',
                    fontSize: 11,
                    color: '#6B7280',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    width: 140,
                    textAlign: 'center',
                  }}
                >
                  RCM Status
                </th>
                <th
                  style={{
                    padding: '12px 18px',
                    fontSize: 11,
                    color: '#6B7280',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    width: 130,
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                    No statutory tax rates match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredRates.map((t, idx) => (
                  <tr
                    key={t.key}
                    style={{
                      transition: 'background-color 0.15s ease',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F2FD')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FCFBFE')
                    }
                  >
                    {/* 1. Tax Code & Rate */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #F3EEFF 0%, #E9DEFF 100%)',
                            border: '1px solid #DDD3F5',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(117, 68, 214, 0.08)',
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#5421A8', lineHeight: 1 }}>
                            {t.rate}%
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#7544D6', textTransform: 'uppercase', marginTop: 2 }}>
                            {t.category}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13.5 }}>{t.code}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#16A34A' }}>Active</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Statutory Description */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA' }}>
                      <div style={{ fontWeight: 800, color: '#1E1B4B', fontSize: 13.5, lineHeight: 1.3 }}>
                        {t.taxName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <span
                          style={{
                            backgroundColor: '#F3EEFF',
                            color: '#7544D6',
                            fontWeight: 700,
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 6,
                          }}
                        >
                          HSN/SAC: {t.hsnSacRange}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          Scope: <strong style={{ color: '#334155' }}>{t.appliesTo}</strong>
                        </span>
                      </div>
                    </td>

                    {/* 3. Jurisdiction Breakdown */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: 8,
                            padding: '3px 8px',
                            fontSize: 11,
                          }}
                        >
                          <span style={{ color: '#64748B', fontWeight: 700 }}>CGST</span>{' '}
                          <strong style={{ color: '#1E1B4B' }}>{t.cgstRate}%</strong>
                        </div>
                        <div
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: 8,
                            padding: '3px 8px',
                            fontSize: 11,
                          }}
                        >
                          <span style={{ color: '#64748B', fontWeight: 700 }}>SGST</span>{' '}
                          <strong style={{ color: '#1E1B4B' }}>{t.sgstRate}%</strong>
                        </div>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                            border: '1px solid #DDD6FE',
                            borderRadius: 8,
                            padding: '3px 10px',
                            fontSize: 11,
                          }}
                        >
                          <span style={{ color: '#6D28D9', fontWeight: 700 }}>IGST</span>{' '}
                          <strong style={{ color: '#4C1D95' }}>{t.igstRate}%</strong>
                        </div>
                      </div>
                    </td>

                    {/* 4. RCM Status */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'center' }}>
                      {t.reverseCharge ? (
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                            fontWeight: 700,
                            fontSize: 11,
                            padding: '3px 10px',
                            borderRadius: 12,
                            display: 'inline-block',
                            border: '1px solid #FDE68A',
                          }}
                        >
                          RCM Active
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600 }}>Standard</span>
                      )}
                    </td>

                    {/* 5. Actions */}
                    <td style={{ padding: '14px 18px', borderBottom: '1px solid #F3F0FA', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => message.info(`Configuring rules for ${t.code}`)}
                          style={{
                            background: '#F3EEFF',
                            border: '1px solid #DDD6FE',
                            color: '#5421A8',
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: '4px 10px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => message.warning(`Tax code ${t.code} is system protected`)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontWeight: 700,
                            fontSize: 11.5,
                            padding: '4px 6px',
                            cursor: 'pointer',
                          }}
                        >
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD TAX MODAL */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={680}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#FFFFFF' }}>
          {/* Modal Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2D1065 0%, #4C1D95 60%, #6D28D9 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Percent size={22} color="#FFFFFF" strokeWidth={2.4} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>
                  Create Statutory Tax Slabs
                </h3>
                <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 }}>
                  Central Goods & Services Tax (CGST), SGST, IGST or Withholding TDS/TCS
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            <Form form={form} layout="vertical" onFinish={handleAddTax} initialValues={{ category: 'GST', rate: 18, appliesTo: 'Products & Services' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="code" label="Tax Code Identifier" rules={[{ required: true, message: 'Code required (e.g. GST-18)' }]}>
                    <Input placeholder="e.g. GST-18, TCS-0.1" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="category" label="Tax Classification" rules={[{ required: true }]}>
                    <Select
                      size="large"
                      options={[
                        { value: 'GST', label: 'GST (Goods and Services Tax)' },
                        { value: 'TCS', label: 'TCS (Tax Collected at Source)' },
                        { value: 'TDS', label: 'TDS (Tax Deducted at Source)' },
                        { value: 'EXEMPT', label: 'Exempt / Zero Rated' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="taxName" label="Official Tax Nomenclature" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Industrial Machinery and Spare Parts" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="rate" label="Applicable Tax Rate (%)" rules={[{ required: true }]}>
                    <InputNumber min={0} max={100} step={0.1} size="large" style={{ width: '100%', borderRadius: 10 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="appliesTo" label="Application Boundary">
                    <Select
                      size="large"
                      options={[
                        { value: 'Products & Services', label: 'Products & Services' },
                        { value: 'Only Goods', label: 'Only Goods' },
                        { value: 'Only Services', label: 'Only Services' },
                        { value: 'Contracts', label: 'Contracts' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="hsnSacRange" label="Associated HSN / SAC Code Pattern">
                    <Input placeholder="e.g. 84000000 - 84999999" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>Reverse Charge Mechanism (RCM)</div>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>Enable if tax liability rests on the recipient instead of supplier</div>
                    </div>
                    <Form.Item name="reverseCharge" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <Button onClick={() => setIsModalOpen(false)} style={{ borderRadius: 20, height: 38, padding: '0 20px', fontWeight: 600 }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3B1678 0%, #581C87 50%, #6D28D9 100%)',
                    border: 'none',
                    borderRadius: 20,
                    height: 38,
                    padding: '0 24px',
                    fontWeight: 800,
                  }}
                >
                  Save Tax Slab
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
