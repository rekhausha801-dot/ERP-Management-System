import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, Typography, message, Upload } from 'antd';
import { FileText, Download, Eye, Plus, Search, Printer, Folder, ShieldCheck, Clock, FileUp } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface EnterpriseDocument {
  id: string;
  docId: string;
  docTitle: string;
  category: 'Legal & Compliance' | 'Customer Contracts' | 'Supplier Invoices' | 'Service Handover' | 'HR & Policy' | 'Technical Specs';
  referenceNumber: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX' | 'SCAN';
  fileSizeMb: number;
  uploadedBy: string;
  uploadDate: string;
  expiryDate?: string;
  version: string;
  securityClassification: 'Confidential' | 'Internal' | 'Public';
}

export const INITIAL_DOCUMENTS: EnterpriseDocument[] = [
  {
    id: 'DOC-01',
    docId: 'EDM-2026-001',
    docTitle: 'Tata Steel Annual Enterprise Supply Agreement',
    category: 'Customer Contracts',
    referenceNumber: 'SO-1048-CTR',
    fileFormat: 'PDF',
    fileSizeMb: 4.2,
    uploadedBy: 'Priya Sharma',
    uploadDate: '2026-11-10',
    expiryDate: '2027-11-09',
    version: 'v2.1 (Signed)',
    securityClassification: 'Confidential',
  },
  {
    id: 'DOC-02',
    docId: 'EDM-2026-002',
    docTitle: 'Siemens Industrial Automation OEM Calibration Certificate',
    category: 'Technical Specs',
    referenceNumber: 'AST-2026-001',
    fileFormat: 'PDF',
    fileSizeMb: 2.8,
    uploadedBy: 'Karthik Raja',
    uploadDate: '2026-10-15',
    expiryDate: '2027-10-14',
    version: 'v1.0 (OEM Certified)',
    securityClassification: 'Internal',
  },
  {
    id: 'DOC-03',
    docId: 'EDM-2026-003',
    docTitle: 'Company GST Registration & State Trade Licenses',
    category: 'Legal & Compliance',
    referenceNumber: 'GST-33AAACE2026Q1',
    fileFormat: 'PDF',
    fileSizeMb: 1.5,
    uploadedBy: 'Chief Financial Officer',
    uploadDate: '2026-04-01',
    expiryDate: '2030-03-31',
    version: 'v3.0',
    securityClassification: 'Internal',
  },
  {
    id: 'DOC-04',
    docId: 'EDM-2026-004',
    docTitle: 'BHEL Siemens Heavy Motors Procurement Master Bill',
    category: 'Supplier Invoices',
    referenceNumber: 'PO-2026-061',
    fileFormat: 'SCAN',
    fileSizeMb: 3.1,
    uploadedBy: 'Muruganandham V',
    uploadDate: '2026-11-16',
    version: 'v1.0 (GRN Attached)',
    securityClassification: 'Confidential',
  },
];

export const DocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<EnterpriseDocument[]>(() => {
    const raw = localStorage.getItem('erp_enterprise_documents');
    return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS;
  });
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredDocs = useMemo(() => {
    return documents.filter((item) => {
      const matchSearch =
        item.docId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.docTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchText.toLowerCase());

      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchClass = classificationFilter === 'ALL' || item.securityClassification === classificationFilter;

      return matchSearch && matchCat && matchClass;
    });
  }, [documents, searchText, categoryFilter, classificationFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalDocs = documents.length;
    const contracts = documents.filter((d) => d.category === 'Customer Contracts').length;
    const confidentialDocs = documents.filter((d) => d.securityClassification === 'Confidential').length;
    const totalStorageMb = Math.round(documents.reduce((acc, curr) => acc + curr.fileSizeMb, 0) * 10) / 10;

    return {
      totalDocs,
      contracts,
      confidentialDocs,
      totalStorageMb,
    };
  }, [documents]);

  const handleUploadDoc = (values: any) => {
    const newDoc: EnterpriseDocument = {
      id: 'DOC-' + Date.now(),
      docId: 'EDM-2026-' + Math.floor(100 + Math.random() * 900),
      docTitle: values.docTitle,
      category: values.category,
      referenceNumber: values.referenceNumber || 'REF-GEN-' + Math.floor(100 + Math.random() * 900),
      fileFormat: values.fileFormat || 'PDF',
      fileSizeMb: 2.4,
      uploadedBy: values.uploadedBy || 'Active User',
      uploadDate: dayjs().format('YYYY-MM-DD'),
      expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : '2028-01-01',
      version: 'v1.0',
      securityClassification: values.securityClassification || 'Internal',
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem('erp_enterprise_documents', JSON.stringify(updated));
    message.success(`Document "${newDoc.docTitle}" indexed & stored securely!`);
    form.resetFields();
    setAddModalOpen(false);
  };

  const columns = [
    {
      title: 'Doc ID & Format',
      key: 'docId',
      width: 140,
      render: (_: any, r: EnterpriseDocument) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.docId}</div>
          <Tag color="geekblue" style={{ marginTop: 2, fontSize: 10 }}>{r.fileFormat} &bull; {r.fileSizeMb} MB</Tag>
        </div>
      ),
    },
    {
      title: 'Document Title & Category',
      key: 'titleCat',
      render: (_: any, r: EnterpriseDocument) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.docTitle}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.category} &bull; Ref: <span style={{ fontWeight: 600 }}>{r.referenceNumber}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Classification',
      dataIndex: 'securityClassification',
      key: 'securityClassification',
      width: 120,
      render: (v: string) => {
        const color = v === 'Confidential' ? 'red' : v === 'Internal' ? 'blue' : 'green';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: 'Version & Uploader',
      key: 'version',
      render: (_: any, r: EnterpriseDocument) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.version}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.uploadedBy} &bull; {r.uploadDate}</div>
        </div>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: (v: string) => (
        <span style={{ fontSize: 12, color: v ? '#0F766E' : '#64748B', fontWeight: 600 }}>
          {v || 'Never Expires'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: EnterpriseDocument) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={15} color="#4F46E5" />}
            title="Preview Document Securely"
            onClick={() => message.info(`Rendering secure preview of ${r.docTitle}...`)}
          />
          <Button
            type="text"
            icon={<Download size={15} color="#0D9488" />}
            title="Download Encrypted File"
            onClick={() => message.success(`Downloading ${r.docTitle} (${r.fileFormat})...`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Title & Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#1E3A8A', fontWeight: 800 }}>
            Enterprise Document Management (EDM)
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Central repository for customer contracts, statutory compliance filings, supplier invoices, and technical blueprints.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Index
          </Button>
          <Button
            type="primary"
            icon={<FileUp size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setAddModalOpen(true)}
          >
            Upload Document
          </Button>
        </Space>
      </div>

      {/* Exactly 4 Meaningful Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Total Managed Documents"
          value={summaryMetrics.totalDocs}
          subtitle="Indexed across business categories"
          trend={{ value: 'AES-256 cloud encrypted', isPositive: true }}
          icon={<FileText size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Customer Contracts Active"
          value={summaryMetrics.contracts}
          subtitle="Executed sales & AMC pacts"
          trend={{ value: 'Expiry alerts enabled', isPositive: true }}
          icon={<Folder size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Confidential Class Files"
          value={summaryMetrics.confidentialDocs}
          subtitle="Role-based access strictly gated"
          trend={{ value: 'Audited download trails', isPositive: true }}
          icon={<ShieldCheck size={20} color="#7C3AED" />}
          iconBgColor="#F5F3FF"
        />
        <KpiCard
          title="Vault Storage Allocated"
          value={`${summaryMetrics.totalStorageMb} MB`}
          subtitle="Optimized vector/blob repository"
          trend={{ value: 'High redundancy storage', isPositive: true }}
          icon={<Clock size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
      </div>

      {/* Filter Toolbar */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          marginBottom: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
        styles={{ body: { padding: '14px 18px' } }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Input
            prefix={<Search size={14} color="#64748B" />}
            placeholder="Search doc ID, title, reference #..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={categoryFilter} onChange={setCategoryFilter}>
            <Select.Option value="ALL">All Categories</Select.Option>
            <Select.Option value="Customer Contracts">Customer Contracts</Select.Option>
            <Select.Option value="Technical Specs">Technical Specs</Select.Option>
            <Select.Option value="Legal & Compliance">Legal & Compliance</Select.Option>
            <Select.Option value="Supplier Invoices">Supplier Invoices</Select.Option>
          </Select>

          <Select value={classificationFilter} onChange={setClassificationFilter}>
            <Select.Option value="ALL">All Classifications</Select.Option>
            <Select.Option value="Confidential">Confidential</Select.Option>
            <Select.Option value="Internal">Internal</Select.Option>
            <Select.Option value="Public">Public</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card
        bordered
        style={{
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={filteredDocs}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} documents` }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* Upload Document Modal */}
      <Modal
        open={addModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <FileUp size={18} />
            <span>Store & Index Enterprise Document</span>
          </div>
        }
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Upload & Index"
        cancelText="Cancel"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleUploadDoc}>
          <Form.Item name="docTitle" label="Document Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Ashok Leyland Master Supply Agreement 2026" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="Document Category" rules={[{ required: true }]} initialValue="Customer Contracts">
              <Select>
                <Select.Option value="Customer Contracts">Customer Contracts</Select.Option>
                <Select.Option value="Technical Specs">Technical Specs & Manuals</Select.Option>
                <Select.Option value="Legal & Compliance">Legal & Compliance</Select.Option>
                <Select.Option value="Supplier Invoices">Supplier Invoices</Select.Option>
                <Select.Option value="HR & Policy">HR & Corporate Policy</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="securityClassification" label="Security Classification" initialValue="Internal">
              <Select>
                <Select.Option value="Confidential">Confidential (Executive Only)</Select.Option>
                <Select.Option value="Internal">Internal Company Wide</Select.Option>
                <Select.Option value="Public">Public</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="referenceNumber" label="Linked ERP Reference #" initialValue="SO-1049">
              <Input placeholder="e.g. SO-1049, AST-2026-001" />
            </Form.Item>

            <Form.Item name="fileFormat" label="File Format" initialValue="PDF">
              <Select>
                <Select.Option value="PDF">PDF Document (.pdf)</Select.Option>
                <Select.Option value="DOCX">Word Document (.docx)</Select.Option>
                <Select.Option value="XLSX">Spreadsheet (.xlsx)</Select.Option>
                <Select.Option value="SCAN">Scanned Image (.jpg / .png)</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="uploadedBy" label="Uploader Full Name" initialValue="Ramesh Sundaram">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
