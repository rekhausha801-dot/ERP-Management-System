import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Card,
  Space,
  Badge,
  Switch,
  message,
  Modal,
  Form,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  MessageSquare,
  Mail,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_PURPLE = '#5421A8';

interface NotificationItem {
  id: string;
  title: string;
  category: 'Approval Required' | 'Low Stock Alert' | 'Payment Due' | 'Delivery In-Transit' | 'Compliance';
  severity: 'Urgent' | 'High' | 'Normal' | 'Info';
  timestamp: string;
  recipientRole: string;
  read: boolean;
  actionUrl: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'PO-2026-104 requires General Manager authorization (Value ₹3,96,480)',
    category: 'Approval Required',
    severity: 'High',
    timestamp: '10 mins ago',
    recipientRole: 'Admin / Finance Head',
    read: false,
    actionUrl: '/app/sales/purchase-orders',
  },
  {
    id: 'notif-2',
    title: 'Critical Stock Depletion: Double Row Bearing 6204 at Central WH-A (8 Pcs remaining)',
    category: 'Low Stock Alert',
    severity: 'Urgent',
    timestamp: '42 mins ago',
    recipientRole: 'Warehouse Lead / Purchase',
    read: false,
    actionUrl: '/app/sales/low-stock-alerts',
  },
  {
    id: 'notif-3',
    title: 'Payment Reminder: Deccan Electro-Mechanicals ₹6,10,000 overdue by 23 days',
    category: 'Payment Due',
    severity: 'High',
    timestamp: '2 hours ago',
    recipientRole: 'Accounts & Recovery',
    read: true,
    actionUrl: '/app/finance/payment-reminders',
  },
  {
    id: 'notif-4',
    title: 'GSTR-3B Return Filing for October 2026 due in 3 days',
    category: 'Compliance',
    severity: 'Normal',
    timestamp: '5 hours ago',
    recipientRole: 'Taxation Compliance',
    read: true,
    actionUrl: '/app/finance/gst/reports',
  },
  {
    id: 'notif-5',
    title: 'Inbound In-Transit Consignment TR-902 arriving today from Coimbatore Foundry',
    category: 'Delivery In-Transit',
    severity: 'Info',
    timestamp: 'Yesterday',
    recipientRole: 'Stores Inward',
    read: true,
    actionUrl: '/app/sales/grn',
  },
];

export const NotificationsRemindersPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.severity === 'Urgent').length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    message.success('All notifications marked as read.');
  };

  const filtered = notifications.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || n.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const columns: ColumnsType<NotificationItem> = [
    {
      title: 'Alert / Notification',
      key: 'title',
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!r.read && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: BRAND_PURPLE, flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: r.read ? 600 : 800, color: '#0F172A', fontSize: 13 }}>{r.title}</div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
              Role: <b>{r.recipientRole}</b> • {r.timestamp}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 170,
      render: (cat: string) => <Tag color="purple" style={{ fontWeight: 700 }}>{cat}</Tag>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (sev: string) => {
        const color = sev === 'Urgent' ? 'red' : sev === 'High' ? 'orange' : sev === 'Normal' ? 'blue' : 'default';
        return <Tag color={color} style={{ fontWeight: 700 }}>{sev}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      align: 'right',
      render: (_, r) => (
        <Button
          size="small"
          type="primary"
          style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
          onClick={() => {
            message.info(`Navigating to ${r.actionUrl}`);
          }}
        >
          View Record
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Notifications & Reminders Command Centre"
        subtitle="Centralized event stream for pending authorization workflows, threshold triggers, statutory tax deadlines, and warehouse movements."
        icon={<Bell size={20} />}
        searchPlaceholder="Search notifications..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Mark All as Read"
        onPrimaryAction={handleMarkAllRead}
      />

      {/* 2. 4 Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Unread Alerts',
            value: `${unreadCount} Unread`,
            growth: 'Needs Review',
            isDark: true,
            icon: <Bell size={20} color={BRAND_PURPLE} />,
            pillExtra: 'Real-time Feed',
          },
          {
            title: 'Urgent Escalations',
            value: `${urgentCount} Urgent`,
            growth: 'Stock & Approval',
            isDark: false,
            icon: <AlertTriangle size={20} color="#EF4444" />,
            pillExtra: 'High Priority',
          },
          {
            title: 'WhatsApp / SMS Queue',
            value: '42 Sent Today',
            growth: 'Gateway Live',
            isDark: true,
            icon: <MessageSquare size={20} color="#10B981" />,
            pillExtra: 'Dunning & Invoices',
          },
          {
            title: 'System Uptime',
            value: '99.98%',
            growth: 'All Services Normal',
            isDark: false,
            icon: <CheckCircle size={20} color="#3B82F6" />,
            pillExtra: 'Monitoring Active',
          },
        ]}
      />

      {/* 3. Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '20px 24px',
          border: '1px solid #ECE6F8',
          boxShadow: '0 6px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 200 }}
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'Approval Required', label: 'Approval Required' },
              { value: 'Low Stock Alert', label: 'Low Stock Alert' },
              { value: 'Payment Due', label: 'Payment Due' },
              { value: 'Compliance', label: 'Compliance' },
              { value: 'Delivery In-Transit', label: 'Delivery In-Transit' },
            ]}
          />
        </div>

        <Table<NotificationItem>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small' }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default NotificationsRemindersPage;
