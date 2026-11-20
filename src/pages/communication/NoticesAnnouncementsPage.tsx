import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Modal, Form, Input, Select, DatePicker, message, Row, Col } from 'antd';
import {
  Bell,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
  Settings,
  Star,
  Megaphone,
  Shield,
  Calendar,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

export interface AnnouncementNoticeItem {
  id: string;
  sNo: number;
  title: string;
  category: 'Technical Update' | 'Product Update' | 'General Notice' | 'Security';
  status: 'Published' | 'Pending';
  publishedOn: string;
}

const INITIAL_NOTICES: AnnouncementNoticeItem[] = [
  {
    id: '1',
    sNo: 1,
    title: 'System Maintenance Scheduled',
    category: 'Technical Update',
    status: 'Published',
    publishedOn: '2026-11-16',
  },
  {
    id: '2',
    sNo: 2,
    title: 'New Feature Release - v2.0',
    category: 'Product Update',
    status: 'Published',
    publishedOn: '2026-11-15',
  },
  {
    id: '3',
    sNo: 3,
    title: 'Holiday Notice - November 17',
    category: 'General Notice',
    status: 'Pending',
    publishedOn: '2026-11-14',
  },
  {
    id: '4',
    sNo: 4,
    title: 'Security Guidelines Update',
    category: 'Security',
    status: 'Published',
    publishedOn: '2026-11-13',
  },
];

export const NoticesAnnouncementsPage: React.FC = () => {
  const [notices, setNotices] = useState<AnnouncementNoticeItem[]>(INITIAL_NOTICES);
  const [selectedNotice, setSelectedNotice] = useState<AnnouncementNoticeItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateNotice = (values: any) => {
    const newNotice: AnnouncementNoticeItem = {
      id: String(Date.now()),
      sNo: notices.length + 1,
      title: values.title,
      category: values.category,
      status: values.status,
      publishedOn: values.publishedOn ? values.publishedOn.format('YYYY-MM-DD') : '2026-11-20',
    };
    setNotices([...notices, newNotice]);
    message.success('New notice published successfully!');
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case 'Technical Update':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Settings size={14} color="#2563EB" />
            Technical Update
          </span>
        );
      case 'Product Update':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#FAF5FF',
              color: '#9333EA',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Star size={14} color="#9333EA" />
            Product Update
          </span>
        );
      case 'General Notice':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#FFFBEB',
              color: '#D97706',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Megaphone size={14} color="#D97706" />
            General Notice
          </span>
        );
      case 'Security':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#ECFDF5',
              color: '#059669',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Shield size={14} color="#059669" />
            Security
          </span>
        );
      default:
        return <span>{category}</span>;
    }
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      key: 'sNo',
      width: 70,
      render: (num: number) => (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#F3E8FF',
            color: '#6D28D9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 12.5,
          }}
        >
          {num}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>
          {title}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => renderCategoryBadge(cat),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Published' | 'Pending') => {
        const isPub = status === 'Published';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: isPub ? '#ECFDF5' : '#FFFBEB',
              color: isPub ? '#059669' : '#D97706',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: isPub ? '#10B981' : '#F59E0B',
                display: 'inline-block',
              }}
            />
            {status}
          </span>
        );
      },
    },
    {
      title: 'Published On',
      dataIndex: 'publishedOn',
      key: 'publishedOn',
      render: (date: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontSize: 13, fontWeight: 500 }}>
          <Calendar size={15} color="#64748B" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AnnouncementNoticeItem) => (
        <Button
          type="text"
          icon={<Eye size={15} color="#6D28D9" />}
          onClick={() => {
            setSelectedNotice(record);
            setIsViewModalOpen(true);
          }}
          style={{
            backgroundColor: '#F3E8FF',
            color: '#6D28D9',
            fontWeight: 700,
            borderRadius: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 14px',
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title="Notices & Announcements"
        subtitle="Stay updated with enterprise broadcasts, company releases, and system updates."
        actions={
          <Button
            type="primary"
            icon={<Plus size={15} />}
            style={{
              backgroundColor: '#4C1D95',
              borderColor: '#4C1D95',
              borderRadius: 10,
              fontWeight: 600,
            }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Notice
          </Button>
        }
      />

      {/* Table Content */}
      <Table
        dataSource={notices}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered={false}
        size="middle"
        className="user-management-table"
      />

      {/* Bottom Pagination Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 8px 4px 8px',
          borderTop: '1px solid #F1F5F9',
          marginTop: 10,
        }}
      >
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          Showing 1 – {notices.length} of {notices.length} notices
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            disabled
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed',
              color: '#94A3B8',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#6D28D9',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            1
          </button>
          <button
            disabled
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed',
              color: '#94A3B8',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* View Notice Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#6D28D9" />
            <span style={{ fontWeight: 700 }}>Notice Details</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={<Button onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {selectedNotice && (
          <div style={{ paddingTop: 12 }}>
            <h3 style={{ margin: 0, color: '#0F172A', fontSize: 16, fontWeight: 700 }}>
              {selectedNotice.title}
            </h3>
            <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
              {renderCategoryBadge(selectedNotice.category)}
              <Tag color={selectedNotice.status === 'Published' ? 'green' : 'orange'}>
                {selectedNotice.status}
              </Tag>
            </div>
            <p style={{ color: '#64748B', fontSize: 13 }}>
              Published Date: <strong>{selectedNotice.publishedOn}</strong>
            </p>
            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, fontSize: 13, color: '#334155' }}>
              This is an official system announcement broadcasted across all platform tenants.
            </div>
          </div>
        )}
      </Modal>

      {/* Create Notice Modal */}
      <Modal
        title="Create New Announcement"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateNotice}>
          <Form.Item label="Notice Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Annual Company Offsite" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Category" name="category" initialValue="General Notice" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Technical Update">Technical Update</Select.Option>
                  <Select.Option value="Product Update">Product Update</Select.Option>
                  <Select.Option value="General Notice">General Notice</Select.Option>
                  <Select.Option value="Security">Security</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status" initialValue="Published" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Published">Published</Select.Option>
                  <Select.Option value="Pending">Pending</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }}>
              Publish Notice
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
