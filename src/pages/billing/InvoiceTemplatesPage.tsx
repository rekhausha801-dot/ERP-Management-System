import React, { useState } from 'react';
import {
  Row,
  Col,
  Button,
  Tag,
  Input,
  Select,
  Switch,
  Divider,
  message,
  Collapse,
  Modal,
  Space,
  Radio,
  Tooltip,
} from 'antd';
import {
  FileText,
  Printer,
  CheckCircle,
  Eye,
  Download,
  Settings,
  Palette,
  QrCode,
  ShieldCheck,
  Copy,
  RotateCcw,
  Plus,
  ZoomIn,
  ZoomOut,
  History,
  Building,
  CreditCard,
  FileCheck,
  Check,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';

const BRAND_PURPLE = '#441A87';
const BRAND_PURPLE_LIGHT = '#FAF5FF';
const BRAND_PURPLE_BORDER = '#E9D5FF';

export interface InvoiceTemplateConfig {
  id: string;
  name: string;
  documentType: 'Tax Invoice' | 'Bill of Supply' | 'Thermal POS';
  paperSize: 'A4' | 'A5' | '80mm';
  description: string;
  primaryColor: string;
  isDefault: boolean;
  isActive: boolean;
  version: string;
}

export const InvoiceTemplatesPage: React.FC = () => {
  // Available Templates (4 Distinct Professional Templates)
  const [templates, setTemplates] = useState<InvoiceTemplateConfig[]>([
    {
      id: 'tpl-1',
      name: 'Modern Indian Corporate',
      documentType: 'Tax Invoice',
      paperSize: 'A4',
      description: 'Dual-tone corporate format with verified e-invoice IRN QR, GST itemized table & bank mandate.',
      primaryColor: '#441A87',
      isDefault: true,
      isActive: true,
      version: 'v2.4',
    },
    {
      id: 'tpl-2',
      name: 'Classic Enterprise Compact',
      documentType: 'Tax Invoice',
      paperSize: 'A4',
      description: 'Dense structured grid optimized for high-volume items (15+ products) with minimal margins.',
      primaryColor: '#1E3A8A',
      isDefault: false,
      isActive: true,
      version: 'v1.8',
    },
    {
      id: 'tpl-3',
      name: 'Thermal Counter POS (80mm)',
      documentType: 'Thermal POS',
      paperSize: '80mm',
      description: 'High-speed 80mm continuous thermal receipt format with customer UPI payment QR code.',
      primaryColor: '#0F172A',
      isDefault: false,
      isActive: true,
      version: 'v2.1',
    },
    {
      id: 'tpl-4',
      name: 'Bill of Supply (Composition)',
      documentType: 'Bill of Supply',
      paperSize: 'A4',
      description: 'Compliant with Section 31(3)(c) for composition dealers or exempt supply without GST breakup.',
      primaryColor: '#059669',
      isDefault: false,
      isActive: true,
      version: 'v1.5',
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateConfig>(templates[0]);
  const [previewPaperSize, setPreviewPaperSize] = useState<'A4' | 'A5' | '80mm'>(templates[0].paperSize);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Template Customization Settings
  // A. Company Branding
  const [companyName, setCompanyName] = useState('BHARAT INDUSTRIAL DYNAMICS LTD');
  const [companyGstin, setCompanyGstin] = useState('33AABCB1234F1Z0');
  const [companyPan, setCompanyPan] = useState('AABCB1234F');
  const [companyAddress, setCompanyAddress] = useState('Plot 48, Guindy Industrial Estate, Chennai, Tamil Nadu 600032');
  const [companyContact, setCompanyContact] = useState('+91 44 2234 5678 | billing@bharatdynamics.com');
  const [accentColor, setAccentColor] = useState(selectedTemplate.primaryColor);
  const [fontFamily, setFontFamily] = useState('Inter');

  // B. Invoice Configuration
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState('INV-2026-');
  const [showShippingAddress, setShowShippingAddress] = useState(true);
  const [showPlaceOfSupply, setShowPlaceOfSupply] = useState(true);
  const [showHsnColumn, setShowHsnColumn] = useState(true);
  const [showItemDiscount, setShowItemDiscount] = useState(true);
  const [showAmountInWords, setShowAmountInWords] = useState(true);

  // C. GST & Compliance
  const [isReverseCharge, setIsReverseCharge] = useState(false);
  const [showEInvoiceIrnQr, setShowEInvoiceIrnQr] = useState(true);
  const [showPaymentDynamicQr, setShowPaymentDynamicQr] = useState(true);
  const [gstDeclarationText, setGstDeclarationText] = useState(
    'Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged.'
  );

  // D. Bank & Payment Details
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [bankAccountName, setBankAccountName] = useState('Bharat Industrial Dynamics Ltd');
  const [bankAccountNumber, setBankAccountNumber] = useState('50200088192031');
  const [bankIfsc, setBankIfsc] = useState('HDFC0000128');
  const [bankBranch, setBankBranch] = useState('Guindy Corporate Branch, Chennai');
  const [paymentInstructions, setPaymentInstructions] = useState('Please quote Invoice # on NEFT / RTGS remittances.');

  // E. Footer & Authorization
  const [termsText, setTermsText] = useState(
    '1. Goods once inspected and delivered will not be taken back without return approval. 2. Overdue payments attract 18% p.a. interest.'
  );
  const [signatoryDesignation, setSignatoryDesignation] = useState('Authorized Signatory & Chief Accountant');
  const [footerMessage, setFooterMessage] = useState('Thank you for choosing Bharat Dynamics! For support: support@bharatdynamics.com');

  // Modals
  const [isPrintSettingsModalOpen, setIsPrintSettingsModalOpen] = useState(false);
  const [isVersionHistoryModalOpen, setIsVersionHistoryModalOpen] = useState(false);

  // Switch Template selection
  const handleSelectTemplate = (tpl: InvoiceTemplateConfig) => {
    setSelectedTemplate(tpl);
    setPreviewPaperSize(tpl.paperSize);
    setAccentColor(tpl.primaryColor);
  };

  const handleSetDefault = (id: string) => {
    setTemplates(
      templates.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
    message.success('Default template updated successfully.');
  };

  const handleDuplicateTemplate = (tpl: InvoiceTemplateConfig) => {
    const newTpl: InvoiceTemplateConfig = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      isDefault: false,
      version: 'v1.0',
    };
    setTemplates([...templates, newTpl]);
    message.success(`Duplicated template as "${newTpl.name}"`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
      {/* 1. Page Header */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '18px 24px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: BRAND_PURPLE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(68, 26, 135, 0.2)',
            }}
          >
            <Palette size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
              Invoice Templates & Print Formats
            </div>
            <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>
              Configure corporate tax invoices, Section 31 Bill of Supply, 80mm thermal receipts, GST IRN/QR layouts and bank mandates.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            icon={<History size={15} />}
            onClick={() => setIsVersionHistoryModalOpen(true)}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Version History
          </Button>

          <Button
            icon={<Settings size={15} />}
            onClick={() => setIsPrintSettingsModalOpen(true)}
            style={{ height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}
          >
            Print Settings
          </Button>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              const newTpl: InvoiceTemplateConfig = {
                id: `tpl-${Date.now()}`,
                name: 'Custom Corporate Template',
                documentType: 'Tax Invoice',
                paperSize: 'A4',
                description: 'Custom user-designed tax invoice template.',
                primaryColor: BRAND_PURPLE,
                isDefault: false,
                isActive: true,
                version: 'v1.0',
              };
              setTemplates([...templates, newTpl]);
              setSelectedTemplate(newTpl);
              message.success('New template created! Customize branding options below.');
            }}
            style={{
              background: BRAND_PURPLE,
              borderColor: BRAND_PURPLE,
              borderRadius: 8,
              height: 38,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: '0 2px 6px rgba(68, 26, 135, 0.25)',
            }}
          >
            Create Template
          </Button>
        </div>
      </div>

      {/* 2. Summary Section (Four Compact Cards, 100% Width CSS Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Active Templates */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5EEFD 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(68, 26, 135, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: BRAND_PURPLE }}>
              Active Templates
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              {templates.filter((t) => t.isActive).length} Formats
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Publish ready document engines
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9D5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: BRAND_PURPLE,
            }}
          >
            <FileText size={20} />
          </div>
        </div>

        {/* Default Template */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#15803D' }}>
              Default Template
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginTop: 8 }}>
              {templates.find((t) => t.isDefault)?.name || 'Modern Indian'}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Primary billing print engine
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}
          >
            <CheckCircle size={20} />
          </div>
        </div>

        {/* A4 Print Format */}
        <div
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(29, 78, 216, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1D4ED8' }}>
              A4 Print Format
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              Standard 210x297
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Laser / Deskjet ready
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <FileCheck size={20} />
          </div>
        </div>

        {/* Thermal POS Format */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(217, 119, 6, 0.04)',
          }}
        >
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B45309' }}>
              Thermal POS Format
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginTop: 4 }}>
              80mm Roll
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              High speed ESC/POS receipt
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Printer size={20} />
          </div>
        </div>
      </div>

      {/* 3. Available Templates Grid (4 Document Previews with Thumbnail, Type, Paper Size & Actions) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>
            Available Formats & Document Designs
          </div>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Click any template to load into the live editor and preview engine below.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
          {templates.map((tpl) => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                style={{
                  border: isSelected ? `2px solid ${BRAND_PURPLE}` : '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: 14,
                  background: isSelected ? '#FAF8FF' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? '0 4px 14px rgba(68, 26, 135, 0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  {/* Thumbnail Mock Card */}
                  <div
                    style={{
                      height: 80,
                      background: '#F9FAFB',
                      borderRadius: 6,
                      border: '1px solid #E5E7EB',
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ height: 6, width: '45%', background: tpl.primaryColor, borderRadius: 2 }} />
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ height: 4, width: '25%', background: '#CBD5E1', borderRadius: 2 }} />
                      <div style={{ height: 4, width: '35%', background: '#E2E8F0', borderRadius: 2 }} />
                    </div>
                    <div style={{ height: 16, width: '100%', background: '#F1F5F9', borderRadius: 3, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
                      <div style={{ height: 3, width: '80%', background: '#CBD5E1' }} />
                    </div>
                    <div style={{ position: 'absolute', top: 6, right: 6 }}>
                      <Tag
                        style={{
                          margin: 0,
                          fontSize: 10,
                          fontWeight: 700,
                          background: tpl.paperSize === '80mm' ? '#FEF3C7' : '#EFF6FF',
                          color: tpl.paperSize === '80mm' ? '#B45309' : '#1D4ED8',
                          border: 'none',
                        }}
                      >
                        {tpl.paperSize}
                      </Tag>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#111827' }}>{tpl.name}</span>
                    {tpl.isDefault && (
                      <Tag style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: 4, fontSize: 10.5, fontWeight: 700, margin: 0 }}>
                        Default
                      </Tag>
                    )}
                  </div>

                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, minHeight: 32, lineHeight: 1.4 }}>
                    {tpl.description}
                  </div>
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{tpl.documentType}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {!tpl.isDefault && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(tpl.id);
                        }}
                        style={{ fontSize: 10.5, height: 24, padding: '0 6px' }}
                      >
                        Make Default
                      </Button>
                    )}
                    <Tooltip title="Duplicate Template">
                      <Button
                        size="small"
                        icon={<Copy size={12} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(tpl);
                        }}
                        style={{ height: 24, width: 24, padding: 0 }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 & 5. Workspace: Customization Panel on Left, Live Document Preview on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(380px, 1fr) minmax(700px, 1.4fr)', gap: 20, alignItems: 'start' }}>
        {/* LEFT: Template Customization Collapsible Accordion Panel */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px 22px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: BRAND_PURPLE,
                }}
              >
                <Settings size={18} />
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                  Template Customization Engine
                </span>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>Configure company branding, fields & paper sizes</div>
              </div>
            </div>
            <Tag color="purple" style={{ fontWeight: 700, borderRadius: 6, padding: '2px 8px' }}>{selectedTemplate.version}</Tag>
          </div>

          <Collapse
            defaultActiveKey={['1', '2']}
            bordered={false}
            style={{ background: 'transparent' }}
            items={[
              // Section A: Company Branding
              {
                key: '1',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>A. Company Branding & Colors</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5 }}>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Company Legal Name</span>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>GSTIN</span>
                        <Input
                          value={companyGstin}
                          onChange={(e) => setCompanyGstin(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>PAN</span>
                        <Input
                          value={companyPan}
                          onChange={(e) => setCompanyPan(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Registered Address</span>
                      <Input.TextArea
                        rows={2}
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        style={{ marginTop: 4, borderRadius: 8, fontSize: 12 }}
                      />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Contact Info (Phone / Email)</span>
                      <Input
                        value={companyContact}
                        onChange={(e) => setCompanyContact(e.target.value)}
                        style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Primary Brand Color</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            style={{
                              width: 36,
                              height: 36,
                              border: '1px solid #CBD5E1',
                              borderRadius: 8,
                              cursor: 'pointer',
                              padding: 2,
                            }}
                          />
                          <Input
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            style={{ width: 100, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Typography Font</span>
                        <Select
                          value={fontFamily}
                          onChange={setFontFamily}
                          style={{ width: '100%', marginTop: 4, height: 36 }}
                          options={[
                            { value: 'Inter, sans-serif', label: 'Inter Modern' },
                            { value: 'Roboto, sans-serif', label: 'Roboto Clean' },
                            { value: 'monospace', label: 'Thermal Mono' },
                            { value: 'Georgia, serif', label: 'Corporate Serif' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                ),
              },

              // Section B: Invoice Configuration
              {
                key: '2',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>B. Document Fields & Toggles</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Invoice Prefix</span>
                        <Input
                          value={invoiceNumberPrefix}
                          onChange={(e) => setInvoiceNumberPrefix(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                        />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Paper Format</span>
                        <Select
                          value={previewPaperSize}
                          onChange={setPreviewPaperSize}
                          style={{ width: '100%', marginTop: 4, height: 36 }}
                          options={[
                            { value: 'A4', label: 'A4 Standard (210×297 mm)' },
                            { value: 'A5', label: 'A5 Compact (148×210 mm)' },
                            { value: '80mm', label: '80mm Thermal Receipt' },
                          ]}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Include Shipping Address (Dispatch Destination)</span>
                      <Switch size="small" checked={showShippingAddress} onChange={setShowShippingAddress} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Display HSN / SAC Code Column</span>
                      <Switch size="small" checked={showHsnColumn} onChange={setShowHsnColumn} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Show Item-level Discount (Disc %)</span>
                      <Switch size="small" checked={showItemDiscount} onChange={setShowItemDiscount} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Print Amount in Words Note</span>
                      <Switch size="small" checked={showAmountInWords} onChange={setShowAmountInWords} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Display Place of Supply & State Code</span>
                      <Switch size="small" checked={showPlaceOfSupply} onChange={setShowPlaceOfSupply} />
                    </div>
                  </div>
                ),
              },

              // Section C: Statutory & GST Compliance
              {
                key: '3',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>C. GST & E-Invoice Compliance</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Government E-Invoice QR (B2B IRN)</span>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Mandatory for GST turnover above ₹5 Cr</div>
                      </div>
                      <Switch size="small" checked={showEInvoiceIrnQr} onChange={setShowEInvoiceIrnQr} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>UPI / Dynamic Bank Payment QR</span>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Instant UPI QR for client quick payment</div>
                      </div>
                      <Switch size="small" checked={showPaymentDynamicQr} onChange={setShowPaymentDynamicQr} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Reverse Charge Applicable (RCM)</span>
                      <Switch size="small" checked={isReverseCharge} onChange={setIsReverseCharge} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Statutory GST Declaration Note</span>
                      <Input.TextArea
                        rows={2}
                        value={gstDeclarationText}
                        onChange={(e) => setGstDeclarationText(e.target.value)}
                        style={{ marginTop: 4, fontSize: 12, borderRadius: 8 }}
                      />
                    </div>
                  </div>
                ),
              },

              // Section D: Bank & Payment Details
              {
                key: '4',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>D. Bank Mandate & Remittance Details</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Bank Name</span>
                        <Input value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>IFSC Code</span>
                        <Input value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Beneficiary A/C Name</span>
                        <Input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Account Number</span>
                        <Input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Branch Location</span>
                      <Input value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                  </div>
                ),
              },

              // Section E: Footer & Authorization
              {
                key: '5',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>E. Terms, Authorization & Footer</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Terms and Conditions</span>
                      <Input.TextArea rows={2} value={termsText} onChange={(e) => setTermsText(e.target.value)} style={{ marginTop: 4, fontSize: 12, borderRadius: 8 }} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Authorized Signatory Label</span>
                      <Input value={signatoryDesignation} onChange={(e) => setSignatoryDesignation(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Footer Note</span>
                      <Input value={footerMessage} onChange={(e) => setFooterMessage(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                  </div>
                ),
              },
            ]}
          />

          {/* Action Triggers */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingTop: 14, borderTop: '1px solid #F3F4F6' }}>
            <Button size="middle" onClick={() => message.info('Template saved as draft.')} style={{ borderRadius: 8, height: 38, fontWeight: 600 }}>
              Save as Draft
            </Button>
            <Button
              type="primary"
              size="middle"
              onClick={() => message.success(`Template "${selectedTemplate.name}" published successfully!`)}
              style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700, borderRadius: 8, height: 38 }}
            >
              Publish Template
            </Button>
          </div>
        </div>

        {/* RIGHT: Live Document Preview with Paper Size, Zoom & Print Controls */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px 22px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Preview Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Live Document Preview</span>
              <Radio.Group
                size="middle"
                value={previewPaperSize}
                onChange={(e) => setPreviewPaperSize(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="A4">A4</Radio.Button>
                <Radio.Button value="A5">A5</Radio.Button>
                <Radio.Button value="80mm">80mm POS</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: '3px 6px' }}>
                <Button
                  size="small"
                  type="text"
                  icon={<ZoomOut size={14} />}
                  onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                  style={{ height: 26, width: 26, padding: 0 }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, padding: '0 8px', color: '#475569' }}>{zoomLevel}%</span>
                <Button
                  size="small"
                  type="text"
                  icon={<ZoomIn size={14} />}
                  onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                  style={{ height: 26, width: 26, padding: 0 }}
                />
              </div>

              <Button
                size="middle"
                icon={<Printer size={15} />}
                onClick={() => {
                  window.print();
                }}
                style={{ fontSize: 12.5, fontWeight: 600, height: 34, borderRadius: 8 }}
              >
                Print Test
              </Button>

              <Button
                size="middle"
                type="primary"
                icon={<Download size={15} />}
                onClick={() => message.info('Generating PDF sample document...')}
                style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700, fontSize: 12.5, height: 34, borderRadius: 8 }}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Document Sheet Display (Transforms dynamically between A4/A5 and 80mm thermal) */}
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: 12,
              padding: '24px 20px',
              overflowY: 'auto',
              maxHeight: 780,
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Paper Container */}
            <div
              style={{
                width: previewPaperSize === '80mm' ? 360 : previewPaperSize === 'A5' ? 580 : 720,
                maxWidth: '100%',
                background: '#FFFFFF',
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid #E2E8F0',
                padding: previewPaperSize === '80mm' ? '20px 18px' : '36px 36px',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'all 0.2s ease',
                fontFamily,
                color: '#1E293B',
              }}
            >
              {/* 80mm Thermal Receipt Layout */}
              {previewPaperSize === '80mm' ? (
                <div style={{ fontSize: 12, lineHeight: 1.5, fontFamily: 'monospace' }}>
                  <div style={{ textAlign: 'center', borderBottom: '1px dashed #94A3B8', paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: accentColor }}>{companyName}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>GSTIN: {companyGstin}</div>
                    <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>{companyAddress.slice(0, 48)}...</div>
                    <div style={{ marginTop: 8, fontWeight: 800, fontSize: 12, letterSpacing: '0.05em' }}>
                      {selectedTemplate.documentType === 'Bill of Supply' ? 'BILL OF SUPPLY' : 'TAX INVOICE / RETAIL RECEIPT'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                    <span>Inv: <strong>{invoiceNumberPrefix}0042</strong></span>
                    <span>20-Nov-2026</span>
                  </div>
                  <div style={{ fontSize: 11, marginBottom: 10, color: '#475569' }}>
                    Cust: Walk-in Client &bull; Mob: +91 98401 55210
                  </div>

                  <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', borderTop: '1px dashed #94A3B8', borderBottom: '1px dashed #94A3B8', margin: '8px 0' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '6px 0' }}>Item</th>
                        <th style={{ textAlign: 'center', padding: '6px 0' }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '6px 0' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '5px 0' }}>Industrial V-Belt B-68</td>
                        <td style={{ textAlign: 'center', padding: '5px 0' }}>2</td>
                        <td style={{ textAlign: 'right', padding: '5px 0' }}>₹900.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0' }}>Ball Bearing 6205-2RS</td>
                        <td style={{ textAlign: 'center', padding: '5px 0' }}>1</td>
                        <td style={{ textAlign: 'right', padding: '5px 0' }}>₹620.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ textAlign: 'right', fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
                    <div style={{ color: '#64748B' }}>Subtotal: ₹1,520.00</div>
                    {selectedTemplate.documentType !== 'Bill of Supply' && (
                      <>
                        <div style={{ color: '#64748B' }}>CGST (9%): ₹136.80</div>
                        <div style={{ color: '#64748B' }}>SGST (9%): ₹136.80</div>
                      </>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 900, color: accentColor, borderTop: '1px solid #1E293B', marginTop: 6, paddingTop: 4 }}>
                      TOTAL: ₹1,794.00
                    </div>
                  </div>

                  {showPaymentDynamicQr && (
                    <div style={{ textAlign: 'center', marginTop: 12, borderTop: '1px dashed #CBD5E1', paddingTop: 10 }}>
                      <div style={{ display: 'inline-block', padding: 8, background: '#FAF5FF', borderRadius: 6, border: '1px solid #E9D5FF' }}>
                        <QrCode size={42} color={accentColor} />
                        <div style={{ fontSize: 9.5, color: accentColor, fontWeight: 700, marginTop: 2 }}>Scan & Pay UPI</div>
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 12 }}>
                    {footerMessage}
                  </div>
                </div>
              ) : (
                /* A4 / A5 Corporate Document Layout */
                <div>
                  {/* Top Document Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px solid ${accentColor}`, paddingBottom: 16 }}>
                    <div style={{ flex: 1, paddingRight: 24 }}>
                      <h2 style={{ margin: 0, color: accentColor, fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                        {companyName}
                      </h2>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 6, maxWidth: 440, lineHeight: 1.55 }}>
                        <div>{companyAddress}</div>
                        <div style={{ marginTop: 2 }}>
                          <span style={{ fontWeight: 700, color: '#1E293B' }}>GSTIN:</span> {companyGstin} &bull; <span style={{ fontWeight: 700, color: '#1E293B' }}>PAN:</span> {companyPan}
                        </div>
                        <div style={{ color: '#64748B' }}>{companyContact}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: 220 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '0.04em' }}>
                        {selectedTemplate.documentType === 'Bill of Supply' ? 'BILL OF SUPPLY' : 'TAX INVOICE'}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 6, lineHeight: 1.6 }}>
                        <div>Invoice #: <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: 12 }}>{invoiceNumberPrefix}2026-1049</strong></div>
                        <div>Date: <strong style={{ color: '#0F172A' }}>20-Nov-2026</strong> &bull; Due: <strong style={{ color: '#0F172A' }}>05-Dec-2026</strong></div>
                        {showPlaceOfSupply && (
                          <div style={{ color: '#64748B' }}>
                            Place of Supply: <strong style={{ color: '#0F172A' }}>Tamil Nadu (33)</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bill To & QR Code Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', fontSize: 11.5, borderBottom: '1px solid #E2E8F0', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: showShippingAddress ? '1fr 1fr' : '1fr', gap: 24, flex: 1 }}>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
                        <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }}>
                          Billed To (Customer):
                        </div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13, marginTop: 3 }}>Apex Precision Tools Ltd</div>
                        <div style={{ color: '#475569', marginTop: 2, lineHeight: 1.45 }}>SIDCO Industrial Estate, Coimbatore, TN 641021</div>
                        <div style={{ color: '#334155', marginTop: 4 }}>
                          GSTIN: <strong style={{ fontFamily: 'monospace', color: '#0F172A' }}>33AAICA9012B1Z1</strong>
                        </div>
                      </div>

                      {showShippingAddress && (
                        <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
                          <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }}>
                            Shipped To:
                          </div>
                          <div style={{ color: '#334155', marginTop: 4, lineHeight: 1.5 }}>Plant #2, SIDCO Industrial Estate, Coimbatore, TN 641021</div>
                        </div>
                      )}
                    </div>

                    {/* QR Code Container (E-Invoice or UPI Dynamic QR) */}
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                      {showEInvoiceIrnQr && selectedTemplate.documentType !== 'Bill of Supply' && (
                        <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <QrCode size={44} color={accentColor} />
                          <div style={{ fontSize: 9, color: '#64748B', marginTop: 3, fontWeight: 600 }}>E-Invoice IRN</div>
                        </div>
                      )}
                      {showPaymentDynamicQr && (
                        <div style={{ textAlign: 'center', background: '#FAF5FF', padding: '8px 10px', borderRadius: 8, border: '1px solid #E9D5FF' }}>
                          <QrCode size={44} color={BRAND_PURPLE} />
                          <div style={{ fontSize: 9, color: BRAND_PURPLE, fontWeight: 800, marginTop: 3 }}>Pay UPI</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Line Items */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, margin: '16px 0' }}>
                    <thead>
                      <tr style={{ background: accentColor, color: '#FFFFFF' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '4px 0 0 4px' }}>#</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Product & Description</th>
                        {showHsnColumn && <th style={{ padding: '8px 8px', textAlign: 'center' }}>HSN</th>}
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
                        {showItemDiscount && <th style={{ padding: '8px 8px', textAlign: 'right' }}>Disc%</th>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <th style={{ padding: '8px 8px', textAlign: 'right' }}>GST%</th>}
                        <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 4px 4px 0' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 10px', color: '#64748B' }}>1</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12.5 }}>AC Servo Drive Kit 15kW 415V</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>Model: SRV-15K-IND &bull; Warranty: 2 Years</div>
                        </td>
                        {showHsnColumn && <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>8504</td>}
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>2 Nos</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>45,000.00</td>
                        {showItemDiscount && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>0%</td>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>18%</td>}
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>90,000.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 10px', color: '#64748B' }}>2</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12.5 }}>Heavy Duty V-Belt B-68</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>Standard Industrial Pack &bull; ISO 9001 Tested</div>
                        </td>
                        {showHsnColumn && <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>4010</td>}
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>10 Pcs</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>450.00</td>
                        {showItemDiscount && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#16A34A', fontWeight: 600 }}>5%</td>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>18%</td>}
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>4,275.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Totals & GST Summary Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12, gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      {showAmountInWords && (
                        <div style={{ fontSize: 11, color: '#334155', background: '#F8FAFC', padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          <strong style={{ color: '#0F172A' }}>Amount in Words:</strong> One Lakh Eleven Thousand Two Hundred Forty-Five Rupees Only
                        </div>
                      )}
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 8, lineHeight: 1.5 }}>
                        <strong style={{ color: '#475569' }}>Declaration:</strong> {gstDeclarationText}
                      </div>
                    </div>

                    <div style={{ width: 260, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5, background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                        <span>Taxable Amount:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>₹94,275.00</span>
                      </div>
                      {selectedTemplate.documentType !== 'Bill of Supply' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>CGST (9%):</span>
                            <span style={{ fontFamily: 'monospace' }}>₹8,484.75</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>SGST (9%):</span>
                            <span style={{ fontFamily: 'monospace' }}>₹8,484.75</span>
                          </div>
                        </>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 15,
                          fontWeight: 900,
                          color: accentColor,
                          borderTop: `2px solid ${accentColor}`,
                          paddingTop: 8,
                          marginTop: 4,
                        }}
                      >
                        <span>Grand Total:</span>
                        <span style={{ fontFamily: 'monospace' }}>₹1,11,245.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Mandate & Authorization Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid #E2E8F0', fontSize: 11 }}>
                    <div style={{ background: '#FAF5FF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E9D5FF' }}>
                      <div style={{ fontWeight: 800, color: BRAND_PURPLE, textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '0.04em' }}>
                        Bank Mandate for RTGS / NEFT / IMPS
                      </div>
                      <div style={{ color: '#1F2937', marginTop: 4 }}>
                        Bank: <strong>{bankName}</strong> &bull; A/C: <strong>{bankAccountNumber}</strong>
                      </div>
                      <div style={{ color: '#4B5563', marginTop: 2 }}>
                        IFSC: <strong style={{ fontFamily: 'monospace' }}>{bankIfsc}</strong> &bull; Branch: {bankBranch}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>
                        Beneficiary: <strong>{bankAccountName}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 4 }}>
                      <div style={{ height: 32 }} />
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12 }}>For {companyName}</div>
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{signatoryDesignation}</div>
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div style={{ textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 16, borderTop: '1px dashed #E2E8F0', paddingTop: 8 }}>
                    {footerMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        {/* LEFT: Template Customization Collapsible Accordion Panel */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px 22px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: BRAND_PURPLE,
                }}
              >
                <Settings size={18} />
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                  Template Customization Engine
                </span>
                <div style={{ fontSize: 11.5, color: '#6B7280' }}>Configure company branding, fields & paper sizes</div>
              </div>
            </div>
            <Tag color="purple" style={{ fontWeight: 700, borderRadius: 6, padding: '2px 8px' }}>{selectedTemplate.version}</Tag>
          </div>

          <Collapse
            defaultActiveKey={['1', '2']}
            bordered={false}
            style={{ background: 'transparent' }}
            items={[
              // Section A: Company Branding
              {
                key: '1',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>A. Company Branding & Colors</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5 }}>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Company Legal Name</span>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>GSTIN</span>
                        <Input
                          value={companyGstin}
                          onChange={(e) => setCompanyGstin(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>PAN</span>
                        <Input
                          value={companyPan}
                          onChange={(e) => setCompanyPan(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Registered Address</span>
                      <Input.TextArea
                        rows={2}
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        style={{ marginTop: 4, borderRadius: 8, fontSize: 12 }}
                      />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Contact Info (Phone / Email)</span>
                      <Input
                        value={companyContact}
                        onChange={(e) => setCompanyContact(e.target.value)}
                        style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Primary Brand Color</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            style={{
                              width: 36,
                              height: 36,
                              border: '1px solid #CBD5E1',
                              borderRadius: 8,
                              cursor: 'pointer',
                              padding: 2,
                            }}
                          />
                          <Input
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            style={{ width: 100, height: 36, borderRadius: 8, fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Typography Font</span>
                        <Select
                          value={fontFamily}
                          onChange={setFontFamily}
                          style={{ width: '100%', marginTop: 4, height: 36 }}
                          options={[
                            { value: 'Inter, sans-serif', label: 'Inter Modern' },
                            { value: 'Roboto, sans-serif', label: 'Roboto Clean' },
                            { value: 'monospace', label: 'Thermal Mono' },
                            { value: 'Georgia, serif', label: 'Corporate Serif' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                ),
              },

              // Section B: Invoice Configuration
              {
                key: '2',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>B. Document Fields & Toggles</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Invoice Prefix</span>
                        <Input
                          value={invoiceNumberPrefix}
                          onChange={(e) => setInvoiceNumberPrefix(e.target.value)}
                          style={{ marginTop: 4, height: 36, borderRadius: 8 }}
                        />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Paper Format</span>
                        <Select
                          value={previewPaperSize}
                          onChange={setPreviewPaperSize}
                          style={{ width: '100%', marginTop: 4, height: 36 }}
                          options={[
                            { value: 'A4', label: 'A4 Standard (210×297 mm)' },
                            { value: 'A5', label: 'A5 Compact (148×210 mm)' },
                            { value: '80mm', label: '80mm Thermal Receipt' },
                          ]}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Include Shipping Address (Dispatch Destination)</span>
                      <Switch size="small" checked={showShippingAddress} onChange={setShowShippingAddress} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Display HSN / SAC Code Column</span>
                      <Switch size="small" checked={showHsnColumn} onChange={setShowHsnColumn} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Show Item-level Discount (Disc %)</span>
                      <Switch size="small" checked={showItemDiscount} onChange={setShowItemDiscount} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Print Amount in Words Note</span>
                      <Switch size="small" checked={showAmountInWords} onChange={setShowAmountInWords} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Display Place of Supply & State Code</span>
                      <Switch size="small" checked={showPlaceOfSupply} onChange={setShowPlaceOfSupply} />
                    </div>
                  </div>
                ),
              },

              // Section C: Statutory & GST Compliance
              {
                key: '3',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>C. GST & E-Invoice Compliance</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Government E-Invoice QR (B2B IRN)</span>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Mandatory for GST turnover above ₹5 Cr</div>
                      </div>
                      <Switch size="small" checked={showEInvoiceIrnQr} onChange={setShowEInvoiceIrnQr} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>UPI / Dynamic Bank Payment QR</span>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Instant UPI QR for client quick payment</div>
                      </div>
                      <Switch size="small" checked={showPaymentDynamicQr} onChange={setShowPaymentDynamicQr} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ color: '#4B5563', fontWeight: 500 }}>Reverse Charge Applicable (RCM)</span>
                      <Switch size="small" checked={isReverseCharge} onChange={setIsReverseCharge} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Statutory GST Declaration Note</span>
                      <Input.TextArea
                        rows={2}
                        value={gstDeclarationText}
                        onChange={(e) => setGstDeclarationText(e.target.value)}
                        style={{ marginTop: 4, fontSize: 12, borderRadius: 8 }}
                      />
                    </div>
                  </div>
                ),
              },

              // Section D: Bank & Payment Details
              {
                key: '4',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>D. Bank Mandate & Remittance Details</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Bank Name</span>
                        <Input value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>IFSC Code</span>
                        <Input value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Beneficiary A/C Name</span>
                        <Input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                      </div>
                      <div>
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>Account Number</span>
                        <Input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Branch Location</span>
                      <Input value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                  </div>
                ),
              },

              // Section E: Footer & Authorization
              {
                key: '5',
                label: <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>E. Terms, Authorization & Footer</span>,
                children: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Terms and Conditions</span>
                      <Input.TextArea rows={2} value={termsText} onChange={(e) => setTermsText(e.target.value)} style={{ marginTop: 4, fontSize: 12, borderRadius: 8 }} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Authorized Signatory Label</span>
                      <Input value={signatoryDesignation} onChange={(e) => setSignatoryDesignation(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                    <div>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>Footer Note</span>
                      <Input value={footerMessage} onChange={(e) => setFooterMessage(e.target.value)} style={{ marginTop: 4, height: 36, borderRadius: 8 }} />
                    </div>
                  </div>
                ),
              },
            ]}
          />

          {/* Action Triggers */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingTop: 14, borderTop: '1px solid #F3F4F6' }}>
            <Button size="middle" onClick={() => message.info('Template saved as draft.')} style={{ borderRadius: 8, height: 38, fontWeight: 600 }}>
              Save as Draft
            </Button>
            <Button
              type="primary"
              size="middle"
              onClick={() => message.success(`Template "${selectedTemplate.name}" published successfully!`)}
              style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700, borderRadius: 8, height: 38 }}
            >
              Publish Template
            </Button>
          </div>
        </div>

        {/* RIGHT: Live Document Preview with Paper Size, Zoom & Print Controls */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px 22px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Preview Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Live Document Preview</span>
              <Radio.Group
                size="middle"
                value={previewPaperSize}
                onChange={(e) => setPreviewPaperSize(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="A4">A4</Radio.Button>
                <Radio.Button value="A5">A5</Radio.Button>
                <Radio.Button value="80mm">80mm POS</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: '3px 6px' }}>
                <Button
                  size="small"
                  type="text"
                  icon={<ZoomOut size={14} />}
                  onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
                  style={{ height: 26, width: 26, padding: 0 }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, padding: '0 8px', color: '#475569' }}>{zoomLevel}%</span>
                <Button
                  size="small"
                  type="text"
                  icon={<ZoomIn size={14} />}
                  onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                  style={{ height: 26, width: 26, padding: 0 }}
                />
              </div>

              <Button
                size="middle"
                icon={<Printer size={15} />}
                onClick={() => {
                  window.print();
                }}
                style={{ fontSize: 12.5, fontWeight: 600, height: 34, borderRadius: 8 }}
              >
                Print Test
              </Button>

              <Button
                size="middle"
                type="primary"
                icon={<Download size={15} />}
                onClick={() => message.info('Generating PDF sample document...')}
                style={{ background: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700, fontSize: 12.5, height: 34, borderRadius: 8 }}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {/* Document Sheet Display (Transforms dynamically between A4/A5 and 80mm thermal) */}
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: 12,
              padding: '24px 20px',
              overflowY: 'auto',
              maxHeight: 780,
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Paper Container */}
            <div
              style={{
                width: previewPaperSize === '80mm' ? 360 : previewPaperSize === 'A5' ? 580 : 720,
                maxWidth: '100%',
                background: '#FFFFFF',
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                border: '1px solid #E2E8F0',
                padding: previewPaperSize === '80mm' ? '20px 18px' : '36px 36px',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'all 0.2s ease',
                fontFamily,
                color: '#1E293B',
              }}
            >
              {/* 80mm Thermal Receipt Layout */}
              {previewPaperSize === '80mm' ? (
                <div style={{ fontSize: 12, lineHeight: 1.5, fontFamily: 'monospace' }}>
                  <div style={{ textAlign: 'center', borderBottom: '1px dashed #94A3B8', paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: accentColor }}>{companyName}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>GSTIN: {companyGstin}</div>
                    <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>{companyAddress.slice(0, 48)}...</div>
                    <div style={{ marginTop: 8, fontWeight: 800, fontSize: 12, letterSpacing: '0.05em' }}>
                      {selectedTemplate.documentType === 'Bill of Supply' ? 'BILL OF SUPPLY' : 'TAX INVOICE / RETAIL RECEIPT'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                    <span>Inv: <strong>{invoiceNumberPrefix}0042</strong></span>
                    <span>20-Nov-2026</span>
                  </div>
                  <div style={{ fontSize: 11, marginBottom: 10, color: '#475569' }}>
                    Cust: Walk-in Client &bull; Mob: +91 98401 55210
                  </div>

                  <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', borderTop: '1px dashed #94A3B8', borderBottom: '1px dashed #94A3B8', margin: '8px 0' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '6px 0' }}>Item</th>
                        <th style={{ textAlign: 'center', padding: '6px 0' }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '6px 0' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '5px 0' }}>Industrial V-Belt B-68</td>
                        <td style={{ textAlign: 'center', padding: '5px 0' }}>2</td>
                        <td style={{ textAlign: 'right', padding: '5px 0' }}>₹900.00</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 0' }}>Ball Bearing 6205-2RS</td>
                        <td style={{ textAlign: 'center', padding: '5px 0' }}>1</td>
                        <td style={{ textAlign: 'right', padding: '5px 0' }}>₹620.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ textAlign: 'right', fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
                    <div style={{ color: '#64748B' }}>Subtotal: ₹1,520.00</div>
                    {selectedTemplate.documentType !== 'Bill of Supply' && (
                      <>
                        <div style={{ color: '#64748B' }}>CGST (9%): ₹136.80</div>
                        <div style={{ color: '#64748B' }}>SGST (9%): ₹136.80</div>
                      </>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 900, color: accentColor, borderTop: '1px solid #1E293B', marginTop: 6, paddingTop: 4 }}>
                      TOTAL: ₹1,794.00
                    </div>
                  </div>

                  {showPaymentDynamicQr && (
                    <div style={{ textAlign: 'center', marginTop: 12, borderTop: '1px dashed #CBD5E1', paddingTop: 10 }}>
                      <div style={{ display: 'inline-block', padding: 8, background: '#FAF5FF', borderRadius: 6, border: '1px solid #E9D5FF' }}>
                        <QrCode size={42} color={accentColor} />
                        <div style={{ fontSize: 9.5, color: accentColor, fontWeight: 700, marginTop: 2 }}>Scan & Pay UPI</div>
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 12 }}>
                    {footerMessage}
                  </div>
                </div>
              ) : (
                /* A4 / A5 Corporate Document Layout */
                <div>
                  {/* Top Document Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px solid ${accentColor}`, paddingBottom: 16 }}>
                    <div style={{ flex: 1, paddingRight: 24 }}>
                      <h2 style={{ margin: 0, color: accentColor, fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                        {companyName}
                      </h2>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 6, maxWidth: 440, lineHeight: 1.55 }}>
                        <div>{companyAddress}</div>
                        <div style={{ marginTop: 2 }}>
                          <span style={{ fontWeight: 700, color: '#1E293B' }}>GSTIN:</span> {companyGstin} &bull; <span style={{ fontWeight: 700, color: '#1E293B' }}>PAN:</span> {companyPan}
                        </div>
                        <div style={{ color: '#64748B' }}>{companyContact}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: 220 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', letterSpacing: '0.04em' }}>
                        {selectedTemplate.documentType === 'Bill of Supply' ? 'BILL OF SUPPLY' : 'TAX INVOICE'}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#475569', marginTop: 6, lineHeight: 1.6 }}>
                        <div>Invoice #: <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: 12 }}>{invoiceNumberPrefix}2026-1049</strong></div>
                        <div>Date: <strong style={{ color: '#0F172A' }}>20-Nov-2026</strong> &bull; Due: <strong style={{ color: '#0F172A' }}>05-Dec-2026</strong></div>
                        {showPlaceOfSupply && (
                          <div style={{ color: '#64748B' }}>
                            Place of Supply: <strong style={{ color: '#0F172A' }}>Tamil Nadu (33)</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bill To & QR Code Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', fontSize: 11.5, borderBottom: '1px solid #E2E8F0', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: showShippingAddress ? '1fr 1fr' : '1fr', gap: 24, flex: 1 }}>
                      <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
                        <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }}>
                          Billed To (Customer):
                        </div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13, marginTop: 3 }}>Apex Precision Tools Ltd</div>
                        <div style={{ color: '#475569', marginTop: 2, lineHeight: 1.45 }}>SIDCO Industrial Estate, Coimbatore, TN 641021</div>
                        <div style={{ color: '#334155', marginTop: 4 }}>
                          GSTIN: <strong style={{ fontFamily: 'monospace', color: '#0F172A' }}>33AAICA9012B1Z1</strong>
                        </div>
                      </div>

                      {showShippingAddress && (
                        <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, border: '1px solid #EDF2F7' }}>
                          <div style={{ color: '#64748B', textTransform: 'uppercase', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }}>
                            Shipped To:
                          </div>
                          <div style={{ color: '#334155', marginTop: 4, lineHeight: 1.5 }}>Plant #2, SIDCO Industrial Estate, Coimbatore, TN 641021</div>
                        </div>
                      )}
                    </div>

                    {/* QR Code Container (E-Invoice or UPI Dynamic QR) */}
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                      {showEInvoiceIrnQr && selectedTemplate.documentType !== 'Bill of Supply' && (
                        <div style={{ textAlign: 'center', background: '#F8FAFC', padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <QrCode size={44} color={accentColor} />
                          <div style={{ fontSize: 9, color: '#64748B', marginTop: 3, fontWeight: 600 }}>E-Invoice IRN</div>
                        </div>
                      )}
                      {showPaymentDynamicQr && (
                        <div style={{ textAlign: 'center', background: '#FAF5FF', padding: '8px 10px', borderRadius: 8, border: '1px solid #E9D5FF' }}>
                          <QrCode size={44} color={BRAND_PURPLE} />
                          <div style={{ fontSize: 9, color: BRAND_PURPLE, fontWeight: 800, marginTop: 3 }}>Pay UPI</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Table Line Items */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, margin: '16px 0' }}>
                    <thead>
                      <tr style={{ background: accentColor, color: '#FFFFFF' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '4px 0 0 4px' }}>#</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Product & Description</th>
                        {showHsnColumn && <th style={{ padding: '8px 8px', textAlign: 'center' }}>HSN</th>}
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
                        {showItemDiscount && <th style={{ padding: '8px 8px', textAlign: 'right' }}>Disc%</th>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <th style={{ padding: '8px 8px', textAlign: 'right' }}>GST%</th>}
                        <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 4px 4px 0' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 10px', color: '#64748B' }}>1</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12.5 }}>AC Servo Drive Kit 15kW 415V</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>Model: SRV-15K-IND &bull; Warranty: 2 Years</div>
                        </td>
                        {showHsnColumn && <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>8504</td>}
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>2 Nos</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>45,000.00</td>
                        {showItemDiscount && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>0%</td>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>18%</td>}
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>90,000.00</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 10px', color: '#64748B' }}>2</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12.5 }}>Heavy Duty V-Belt B-68</div>
                          <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>Standard Industrial Pack &bull; ISO 9001 Tested</div>
                        </td>
                        {showHsnColumn && <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'monospace', color: '#475569' }}>4010</td>}
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>10 Pcs</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'monospace' }}>450.00</td>
                        {showItemDiscount && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#16A34A', fontWeight: 600 }}>5%</td>}
                        {selectedTemplate.documentType !== 'Bill of Supply' && <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>18%</td>}
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>4,275.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Totals & GST Summary Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12, gap: 24 }}>
                    <div style={{ flex: 1 }}>
                      {showAmountInWords && (
                        <div style={{ fontSize: 11, color: '#334155', background: '#F8FAFC', padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          <strong style={{ color: '#0F172A' }}>Amount in Words:</strong> One Lakh Eleven Thousand Two Hundred Forty-Five Rupees Only
                        </div>
                      )}
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 8, lineHeight: 1.5 }}>
                        <strong style={{ color: '#475569' }}>Declaration:</strong> {gstDeclarationText}
                      </div>
                    </div>

                    <div style={{ width: 260, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5, background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                        <span>Taxable Amount:</span>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>₹94,275.00</span>
                      </div>
                      {selectedTemplate.documentType !== 'Bill of Supply' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>CGST (9%):</span>
                            <span style={{ fontFamily: 'monospace' }}>₹8,484.75</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>SGST (9%):</span>
                            <span style={{ fontFamily: 'monospace' }}>₹8,484.75</span>
                          </div>
                        </>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 15,
                          fontWeight: 900,
                          color: accentColor,
                          borderTop: `2px solid ${accentColor}`,
                          paddingTop: 8,
                          marginTop: 4,
                        }}
                      >
                        <span>Grand Total:</span>
                        <span style={{ fontFamily: 'monospace' }}>₹1,11,245.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Mandate & Authorization Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid #E2E8F0', fontSize: 11 }}>
                    <div style={{ background: '#FAF5FF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E9D5FF' }}>
                      <div style={{ fontWeight: 800, color: BRAND_PURPLE, textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '0.04em' }}>
                        Bank Mandate for RTGS / NEFT / IMPS
                      </div>
                      <div style={{ color: '#1F2937', marginTop: 4 }}>
                        Bank: <strong>{bankName}</strong> &bull; A/C: <strong>{bankAccountNumber}</strong>
                      </div>
                      <div style={{ color: '#4B5563', marginTop: 2 }}>
                        IFSC: <strong style={{ fontFamily: 'monospace' }}>{bankIfsc}</strong> &bull; Branch: {bankBranch}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 10, marginTop: 2 }}>
                        Beneficiary: <strong>{bankAccountName}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 4 }}>
                      <div style={{ height: 32 }} />
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 12 }}>For {companyName}</div>
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{signatoryDesignation}</div>
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div style={{ textAlign: 'center', fontSize: 10, color: '#94A3B8', marginTop: 16, borderTop: '1px dashed #E2E8F0', paddingTop: 8 }}>
                    {footerMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Print Settings Modal */}
      <Modal
        title="Printer & Driver Configuration"
        open={isPrintSettingsModalOpen}
        onCancel={() => setIsPrintSettingsModalOpen(false)}
        onOk={() => {
          message.success('Hardware print settings saved.');
          setIsPrintSettingsModalOpen(false);
        }}
        okText="Save Hardware Config"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Default Laser / Office Printer</span>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              defaultValue="HP LaserJet Pro M404dn (Network)"
              options={[
                { value: 'p1', label: 'HP LaserJet Pro M404dn (Network IP 192.168.1.150)' },
                { value: 'p2', label: 'Canon imageRUNNER 2625i (A3/A4 Heavy Duty)' },
                { value: 'p3', label: 'Microsoft Print to PDF' },
              ]}
            />
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Default Thermal Receipt Printer (80mm)</span>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              defaultValue="Epson TM-T82III USB/Ethernet"
              options={[
                { value: 't1', label: 'Epson TM-T82III (ESC/POS 80mm)' },
                { value: 't2', label: 'TVS RP 3200 Star Plus' },
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Version History Modal */}
      <Modal
        title="Template Version History & Audit Rollback"
        open={isVersionHistoryModalOpen}
        onCancel={() => setIsVersionHistoryModalOpen(false)}
        footer={null}
        width={560}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {[
            { ver: 'v2.4 (Current Active)', date: '2026-11-20', author: 'Karthik Raja', notes: 'Updated statutory GST declaration & dynamic UPI QR.' },
            { ver: 'v2.3', date: '2026-10-15', author: 'Priya Sundaram', notes: 'Changed bank IFSC code & Anna Salai branch account.' },
            { ver: 'v2.0', date: '2026-08-01', author: 'Admin', notes: 'Initial corporate redesign with e-invoice QR compliance.' },
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: BRAND_PURPLE }}>{v.ver}</div>
                <div style={{ fontSize: 11.5, color: '#4B5563' }}>{v.notes}</div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2 }}>Published on {v.date} by {v.author}</div>
              </div>
              {i > 0 && (
                <Button size="small" onClick={() => message.success(`Restored template to ${v.ver}`)}>
                  Restore
                </Button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceTemplatesPage;
