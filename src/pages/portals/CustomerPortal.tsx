import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Row, Col, Space, Tabs, Progress, Modal, Form, DatePicker, Select, message } from 'antd';
import {
  FileText,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  Plus,
  Search,
  Download,
  AlertCircle,
  MessageSquare,
  Wrench,
  ShieldAlert,
  HardHat,
  MapPin,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components';

export const CustomerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Client Self-Service Portal"
        subtitle="Track active sales orders, commercial quotations, equipment warranty, and dispatch tickets."
        actions={
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ backgroundColor: '#6E56CF', borderRadius: 10, fontWeight: 700 }}
            onClick={() => setIsTicketModalOpen(true)}
          >
            Create Service Request
          </Button>
        }
      />

      {/* Top 4 Client Quick Stats */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Active Sales Orders</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>3 In-Flight</div>
            <Tag color="blue" style={{ marginTop: 6, borderRadius: 8 }}>1 Dispatched Today</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Open Support Tickets</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>1 Ticket</div>
            <Tag color="orange" style={{ marginTop: 6, borderRadius: 8 }}>Technician On Route</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Registered Assets under AMC</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>12 Machines</div>
            <Tag color="green" style={{ marginTop: 6, borderRadius: 8 }}>AMC Active Till Nov 2027</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Invoices & Payables</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>₹4,50,000</div>
            <Tag color="purple" style={{ marginTop: 6, borderRadius: 8 }}>Due in 15 Days</Tag>
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
              key: 'orders',
              label: 'Sales Orders & Shipments',
              children: (
                <Table
                  dataSource={[
                    { key: '1', so: 'SO-9041', date: '2026-11-14', items: '3-Phase Inverter Units (x10)', amount: '₹4,50,000', status: 'Delivered', tracking: 'TRK-IND-9901' },
                    { key: '2', so: 'SO-9040', date: '2026-11-16', items: 'Hydraulic Seals & Bearings', amount: '₹12,00,000', status: 'In Transit', tracking: 'TRK-IND-9944' },
                    { key: '3', so: 'SO-9039', date: '2026-11-10', items: 'Custom Drive Assembly', amount: '₹8,50,000', status: 'Confirmed', tracking: 'Packing at Warehouse' },
                  ]}
                  columns={[
                    { title: 'Order #', dataIndex: 'so', key: 'so', render: (t) => <span style={{ fontWeight: 700, color: '#6E56CF' }}>{t}</span> },
                    { title: 'Order Date', dataIndex: 'date', key: 'date' },
                    { title: 'Item Summary', dataIndex: 'items', key: 'items', render: (i) => <span style={{ fontWeight: 600 }}>{i}</span> },
                    { title: 'Order Amount', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ fontWeight: 700 }}>{a}</span> },
                    { title: 'Fulfillment Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Delivered' ? 'green' : s === 'In Transit' ? 'blue' : 'orange'}>{s}</Tag> },
                    { title: 'Shipment Tracking', dataIndex: 'tracking', key: 'tracking' },
                    {
                      title: 'Invoice',
                      key: 'inv',
                      render: () => (
                        <Button size="small" icon={<Download size={13} />} onClick={() => message.success('Downloading official Tax Invoice...')}>
                          PDF
                        </Button>
                      ),
                    },
                  ]}
                  pagination={false}
                />
              ),
            },
            {
              key: 'tickets',
              label: 'Service Tickets & AMC Coverage',
              children: (
                <Table
                  dataSource={[
                    { key: '1', ticket: 'TKT-104', asset: 'CNC Spindle Unit 04', type: 'Breakdown Repair', tech: 'Murugan K.', status: 'Technician Assigned', sla: 'Within 2 Hours' },
                    { key: '2', ticket: 'TKT-098', asset: 'Hydraulic Press 50T', type: 'Bi-Monthly Preventive', tech: 'Dinesh V.', status: 'Completed', sla: 'Resolved On-Time' },
                  ]}
                  columns={[
                    { title: 'Ticket #', dataIndex: 'ticket', key: 'ticket', render: (t) => <span style={{ fontWeight: 700, color: '#10B981' }}>{t}</span> },
                    { title: 'Asset / Machine', dataIndex: 'asset', key: 'asset', render: (a) => <span style={{ fontWeight: 600 }}>{a}</span> },
                    { title: 'Service Type', dataIndex: 'type', key: 'type' },
                    { title: 'Field Engineer', dataIndex: 'tech', key: 'tech' },
                    { title: 'Resolution Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Completed' ? 'green' : 'blue'}>{s}</Tag> },
                    { title: 'SLA Commitment', dataIndex: 'sla', key: 'sla', render: (l) => <span style={{ fontWeight: 600, color: '#6E56CF' }}>{l}</span> },
                  ]}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Ticket Modal */}
      <Modal
        title="Raise Breakdown or Service Request"
        open={isTicketModalOpen}
        onCancel={() => setIsTicketModalOpen(false)}
        onOk={() => {
          message.success('Service Request TKT-2026-X dispatched to engineering console!');
          setIsTicketModalOpen(false);
        }}
        okText="Confirm & Dispatch Ticket"
        okButtonProps={{ style: { backgroundColor: '#6E56CF', borderRadius: 10 } }}
      >
        <Form layout="vertical" style={{ marginTop: 14 }}>
          <Form.Item label="Select Covered Asset / Machine" required>
            <Select placeholder="Choose your registered equipment">
              <Select.Option value="cnc">CNC Spindle Unit 04 (Under AMC)</Select.Option>
              <Select.Option value="hyd">Hydraulic Press 50T (Warranty Coverage)</Select.Option>
              <Select.Option value="comp">Rotary Screw Compressor (Comprehensive Care)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Issue Category & Severity" required>
            <Select placeholder="Select severity level">
              <Select.Option value="high">Critical Breakdown (Line Stoppage)</Select.Option>
              <Select.Option value="med">Degraded Performance</Select.Option>
              <Select.Option value="low">Scheduled Preventive Maintenance</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Describe Problem Symptoms" required>
            <Input.TextArea rows={3} placeholder="Provide details, error codes or strange vibration symptoms..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
