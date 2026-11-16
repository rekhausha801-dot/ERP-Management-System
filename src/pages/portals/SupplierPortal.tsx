import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Row, Col, Space, Tabs, Progress, Modal, Form, DatePicker, message } from 'antd';
import {
  Truck,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Download,
  Upload,
  CreditCard,
  Plus,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { PageHeader } from '../../components';

export const SupplierPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Supplier & Vendor Collaboration Portal"
        subtitle="Manage received Purchase Orders (PO), submit Goods Received confirmation, and track invoice disbursements."
        actions={
          <Button
            type="primary"
            icon={<Upload size={14} />}
            style={{ backgroundColor: '#6E56CF', borderRadius: 10, fontWeight: 700 }}
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            Submit Commercial Invoice
          </Button>
        }
      />

      {/* Supplier Performance Metrics */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Active Purchase Orders</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>4 POs</div>
            <Tag color="blue" style={{ marginTop: 6, borderRadius: 8 }}>Total Value ₹34.4L</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Goods Received (GRN) Rate</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>99.2%</div>
            <Tag color="green" style={{ marginTop: 6, borderRadius: 8 }}>Zero QC Rejections</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Pending Disbursements</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>₹8,40,000</div>
            <Tag color="orange" style={{ marginTop: 6, borderRadius: 8 }}>Scheduled for Friday</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Vendor Rating</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>Tier 1 Gold</div>
            <Tag color="purple" style={{ marginTop: 6, borderRadius: 8 }}>Verified Partner</Tag>
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{ borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}
        styles={{ body: { padding: '16px 20px 24px' } }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'pos',
              label: 'Purchase Orders & GRN Acknowledgements',
              children: (
                <Table
                  dataSource={[
                    { key: '1', po: 'PO-2026-801', date: '2026-11-10', items: 'Heavy Industrial Drives (x4)', amount: '₹18,50,000', status: 'Accepted & Dispatched', grn: 'GRN-4401 (Passed)' },
                    { key: '2', po: 'PO-2026-802', date: '2026-11-12', items: 'Servo Valves & Hydraulic Parts', amount: '₹8,40,000', status: 'In Production', grn: 'Awaiting Delivery' },
                    { key: '3', po: 'PO-2026-803', date: '2026-11-14', items: 'High Precision Bearing Sets', amount: '₹4,90,000', status: 'Accepted', grn: 'Shipment Scheduled' },
                  ]}
                  columns={[
                    { title: 'PO Number', dataIndex: 'po', key: 'po', render: (p) => <span style={{ fontWeight: 700, color: '#6E56CF' }}>{p}</span> },
                    { title: 'Release Date', dataIndex: 'date', key: 'date' },
                    { title: 'Procured Items', dataIndex: 'items', key: 'items', render: (i) => <span style={{ fontWeight: 600 }}>{i}</span> },
                    { title: 'Order Amount', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ fontWeight: 700 }}>{a}</span> },
                    { title: 'Supplier Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="blue">{s}</Tag> },
                    { title: 'Warehouse GRN Status', dataIndex: 'grn', key: 'grn', render: (g) => <Tag color="green">{g}</Tag> },
                    {
                      title: 'Action',
                      key: 'act',
                      render: () => (
                        <Button size="small" type="primary" ghost style={{ borderRadius: 8 }} onClick={() => message.success('PO Acknowledgement confirmed')}>
                          Acknowledge
                        </Button>
                      ),
                    },
                  ]}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Invoice Submission Modal */}
      <Modal
        title="Submit Supplier Tax Invoice for Processing"
        open={isInvoiceModalOpen}
        onCancel={() => setIsInvoiceModalOpen(false)}
        onOk={() => {
          message.success('Invoice uploaded and queued for accounts verification!');
          setIsInvoiceModalOpen(false);
        }}
        okText="Submit for Payment Approval"
        okButtonProps={{ style: { backgroundColor: '#6E56CF', borderRadius: 10 } }}
      >
        <Form layout="vertical" style={{ marginTop: 14 }}>
          <Form.Item label="Referenced Purchase Order #" required>
            <Input placeholder="e.g. PO-2026-801" />
          </Form.Item>
          <Form.Item label="Vendor Invoice Reference Code" required>
            <Input placeholder="e.g. INV-BHEL-889" />
          </Form.Item>
          <Form.Item label="Billed Amount (Including GST)" required>
            <Input placeholder="e.g. ₹18,50,000" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
