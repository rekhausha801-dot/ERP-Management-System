import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Row, Col, Space, Tabs, Progress, Modal, Form, DatePicker, message, Avatar } from 'antd';
import {
  UserCheck,
  Calendar,
  Clock,
  HardHat,
  MapPin,
  CheckSquare,
  FileCheck,
  Camera,
  Signature,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components';

export const EmployeePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [isCheckInDone, setIsCheckInDone] = useState(false);

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Employee & Field Technician Workspace"
        subtitle="Manage daily dispatched service tickets, site check-in/out, GPS route logs, and parts usage."
        actions={
          <Button
            type="primary"
            icon={<MapPin size={14} />}
            style={{ backgroundColor: isCheckInDone ? '#10B981' : '#6E56CF', borderRadius: 10, fontWeight: 700 }}
            onClick={() => {
              setIsCheckInDone(!isCheckInDone);
              message.success(isCheckInDone ? 'Checked out from field location.' : 'GPS Verified Check-in at Client Site recorded!');
            }}
          >
            {isCheckInDone ? 'Site Check-Out' : 'Live GPS Site Check-In'}
          </Button>
        }
      />

      {/* Engineer Daily Status Strip */}
      <Row gutter={[14, 14]} style={{ marginBottom: 18 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Assigned Jobs Today</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>3 Work Orders</div>
            <Tag color="blue" style={{ marginTop: 6, borderRadius: 8 }}>2 Urgent Breakdown</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>On-Field Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', marginTop: 4 }}>99.2%</div>
            <Tag color="green" style={{ marginTop: 6, borderRadius: 8 }}>Punctual Dispatch</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>SLA First-Time Fix</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>96.5%</div>
            <Tag color="purple" style={{ marginTop: 6, borderRadius: 8 }}>Rated 4.95 ⭐</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(25, 21, 59, 0.04)' }}>
            <div style={{ fontSize: 11, color: '#7E7A9B', fontWeight: 600 }}>Travel & Field Expenses</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#181433', marginTop: 4 }}>₹2,450</div>
            <Tag color="orange" style={{ marginTop: 6, borderRadius: 8 }}>Pending Reimbursement</Tag>
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
              key: 'jobs',
              label: 'Assigned Work Orders & Mobile Checklists',
              children: (
                <Table
                  dataSource={[
                    { key: '1', ticket: 'TKT-104', client: 'Apex Precision Tools', location: 'Guindy Industrial Area', asset: 'CNC Spindle Unit 04', stage: 'In Progress', priority: 'High', parts: '2 Bearing Kits Utilized' },
                    { key: '2', ticket: 'TKT-103', client: 'Metro Rail Workshop', location: 'Tambaram Central Hub', asset: 'Hydraulic Press 50T', stage: 'Assigned', priority: 'Urgent', parts: 'Awaiting Diagnostic' },
                    { key: '3', ticket: 'TKT-102', client: 'Apex Motors Ltd', location: 'Ambattur Cluster', asset: 'Compressor Sys-B', stage: 'Completed', priority: 'Normal', parts: 'Synthetic Oil Replaced' },
                  ]}
                  columns={[
                    { title: 'Ticket #', dataIndex: 'ticket', key: 'ticket', render: (t) => <span style={{ fontWeight: 700, color: '#10B981' }}>{t}</span> },
                    { title: 'Client & Site Location', dataIndex: 'client', key: 'client', render: (c, r) => <div><div style={{ fontWeight: 600 }}>{c}</div><div style={{ fontSize: 11, color: '#7E7A9B' }}>{r.location}</div></div> },
                    { title: 'Target Machine', dataIndex: 'asset', key: 'asset' },
                    { title: 'Stage', dataIndex: 'stage', key: 'stage', render: (st) => <Tag color={st === 'Completed' ? 'green' : st === 'In Progress' ? 'blue' : 'orange'}>{st}</Tag> },
                    { title: 'Parts Consumed', dataIndex: 'parts', key: 'parts', render: (p) => <span style={{ fontWeight: 600, color: '#6E56CF' }}>{p}</span> },
                    {
                      title: 'Work Action',
                      key: 'act',
                      render: (_, r) => (
                        <Space>
                          <Button size="small" type="primary" style={{ backgroundColor: '#6E56CF', borderRadius: 8 }} onClick={() => message.success(`Opened Mobile Checklist for ${r.ticket}`)}>
                            Checklist
                          </Button>
                          <Button size="small" style={{ borderRadius: 8 }} onClick={() => message.info(`Digital Customer Signature captured for ${r.ticket}`)}>
                            Sign-off
                          </Button>
                        </Space>
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
    </div>
  );
};
