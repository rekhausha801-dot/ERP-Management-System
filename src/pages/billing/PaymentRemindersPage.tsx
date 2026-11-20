import React, { useState } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Tooltip,
  Badge,
  message,
  Card,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Users,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { SalesModuleHeader } from '../sales/SalesPages';
import { SalesKpiCardsRow } from '../../components/dashboard/SalesKpiCardsRow';

const BRAND_PURPLE = '#5421A8';

interface PaymentReminderItem {
  id: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  overdueDays: number;
  invoiceAmount: number;
  outstandingBalance: number;
  contactPerson: string;
  phone: string;
  email: string;
  lastReminderSent?: string;
  reminderCount: number;
  status: 'Pending Due' | '1st Notice Sent' | 'Final Notice Sent' | 'Escalated to Legal';
}

const INITIAL_REMINDERS: PaymentReminderItem[] = [
  {
    id: 'rem-1',
    customerName: 'Kaveri Heavy Engineering Works',
    invoiceNumber: 'INV-2026-0742',
    invoiceDate: '2026-10-15',
    dueDate: '2026-11-14',
    overdueDays: 6,
    invoiceAmount: 485000,
    outstandingBalance: 485000,
    contactPerson: 'S. Ramanathan',
    phone: '+91 98401 22334',
    email: 'accounts@kaveriheavy.com',
    lastReminderSent: '2026-11-15',
    reminderCount: 1,
    status: '1st Notice Sent',
  },
  {
    id: 'rem-2',
    customerName: 'Deccan Electro-Mechanicals Ltd',
    invoiceNumber: 'INV-2026-0688',
    invoiceDate: '2026-09-28',
    dueDate: '2026-10-28',
    overdueDays: 23,
    invoiceAmount: 920000,
    outstandingBalance: 610000,
    contactPerson: 'K. Balaji',
    phone: '+91 97890 55441',
    email: 'finance@deccanelectro.com',
    lastReminderSent: '2026-11-10',
    reminderCount: 2,
    status: 'Final Notice Sent',
  },
  {
    id: 'rem-3',
    customerName: 'Southern Automation Systems',
    invoiceNumber: 'INV-2026-0810',
    invoiceDate: '2026-11-05',
    dueDate: '2026-11-20',
    overdueDays: 0,
    invoiceAmount: 265000,
    outstandingBalance: 265000,
    contactPerson: 'Murugan V.',
    phone: '+91 94441 88772',
    email: 'billing@southernauto.in',
    reminderCount: 0,
    status: 'Pending Due',
  },
  {
    id: 'rem-4',
    customerName: 'Apex Precision Infrastructure',
    invoiceNumber: 'INV-2026-0512',
    invoiceDate: '2026-08-10',
    dueDate: '2026-09-09',
    overdueDays: 72,
    invoiceAmount: 1450000,
    outstandingBalance: 1100000,
    contactPerson: 'Vikram Seth',
    phone: '+91 99620 44321',
    email: 'vseth@apexinfra.com',
    lastReminderSent: '2026-11-02',
    reminderCount: 4,
    status: 'Escalated to Legal',
  },
];

export const PaymentRemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<PaymentReminderItem[]>(INITIAL_REMINDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<PaymentReminderItem | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [form] = Form.useForm();

  const metrics = {
    totalOverdue: reminders.reduce((a, b) => a + b.outstandingBalance, 0),
    totalAccounts: reminders.length,
    noticesSentToday: reminders.filter((r) => r.reminderCount > 0).length,
    criticalOverdue: reminders.filter((r) => r.overdueDays > 30).length,
  };

  const filtered = reminders.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSendReminder = (values: any) => {
    if (!selectedItem) return;
    const updated = reminders.map((r) => {
      if (r.id === selectedItem.id) {
        return {
          ...r,
          reminderCount: r.reminderCount + 1,
          lastReminderSent: new Date().toISOString().slice(0, 10),
          status: (r.reminderCount >= 2 ? 'Final Notice Sent' : '1st Notice Sent') as PaymentReminderItem['status'],
        };
      }
      return r;
    });
    setReminders(updated);
    message.success(`${values.channel} reminder dispatched to ${selectedItem.customerName}!`);
    setIsSendModalOpen(false);
  };

  const columns: ColumnsType<PaymentReminderItem> = [
    {
      title: 'Customer & Contact',
      key: 'customer',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{r.customerName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.contactPerson} • {r.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (t: string) => <Tag color="purple" style={{ fontWeight: 700 }}>{t}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (d: string, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{d}</div>
          {r.overdueDays > 0 ? (
            <Tag color="error" style={{ fontSize: 10, marginTop: 2 }}>{r.overdueDays} Days Overdue</Tag>
          ) : (
            <Tag color="success" style={{ fontSize: 10, marginTop: 2 }}>Due Today</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Outstanding (₹)',
      dataIndex: 'outstandingBalance',
      key: 'outstandingBalance',
      align: 'right',
      render: (val: number) => (
        <span style={{ fontWeight: 800, color: '#0F172A' }}>₹{val.toLocaleString('en-IN')}</span>
      ),
    },
    {
      title: 'Reminders Sent',
      dataIndex: 'reminderCount',
      key: 'reminderCount',
      align: 'center',
      render: (count: number, r) => (
        <div>
          <Badge count={count} overflowCount={99} style={{ backgroundColor: count > 2 ? '#EF4444' : BRAND_PURPLE }} />
          {r.lastReminderSent && (
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>Last: {r.lastReminderSent}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Dunning Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color =
          st === 'Escalated to Legal' ? 'magenta' : st === 'Final Notice Sent' ? 'red' : st === '1st Notice Sent' ? 'orange' : 'blue';
        return <Tag color={color} style={{ fontWeight: 700 }}>{st}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            icon={<Send size={12} />}
            style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}
            onClick={() => {
              setSelectedItem(r);
              form.setFieldsValue({
                channel: 'WhatsApp + Email',
                messageTemplate: `Dear Customer, Payment of ₹${r.outstandingBalance.toLocaleString('en-IN')} towards Invoice ${r.invoiceNumber} is overdue by ${r.overdueDays} days. Kindly clear at earliest.`,
              });
              setIsSendModalOpen(true);
            }}
          >
            Send Notice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Header */}
      <SalesModuleHeader
        title="Payment Reminders & Debt Collection Hub"
        subtitle="Automated payment reminders, multi-tier dunning notices (WhatsApp, SMS, Email), customer ledger aging escalation."
        icon={<Bell size={20} />}
        searchPlaceholder="Search customer, invoice, contact..."
        searchValue={search}
        onSearchChange={setSearch}
        primaryActionLabel="Send Bulk Reminders"
        onPrimaryAction={() => message.success('Dispatched bulk WhatsApp & Email payment reminders to all overdue accounts!')}
      />

      {/* 2. 4 Summary Cards */}
      <SalesKpiCardsRow
        cards={[
          {
            title: 'Total Overdue Balance',
            value: `₹${(metrics.totalOverdue / 100000).toFixed(2)} L`,
            growth: 'Needs Recovery',
            isDark: true,
            icon: <IndianRupee size={20} color={BRAND_PURPLE} />,
            pillExtra: 'Unpaid Debts',
          },
          {
            title: 'Overdue Invoices',
            value: `${metrics.totalAccounts} Accounts`,
            growth: `${metrics.criticalOverdue} Over 30 Days`,
            isDark: false,
            icon: <AlertTriangle size={20} color="#EF4444" />,
            pillExtra: 'Dunning List',
          },
          {
            title: 'Notices Sent Today',
            value: `${metrics.noticesSentToday} Notices`,
            growth: 'WhatsApp & Email',
            isDark: true,
            icon: <Send size={20} color="#10B981" />,
            pillExtra: 'Automated Dunning',
          },
          {
            title: 'Avg Collection Delay',
            value: '18 Days',
            growth: 'DSO Tracking',
            isDark: false,
            icon: <Clock size={20} color="#F59E0B" />,
            pillExtra: 'Turnaround Time',
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
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            options={[
              { value: 'ALL', label: 'All Dunning Stages' },
              { value: 'Pending Due', label: 'Pending Due' },
              { value: '1st Notice Sent', label: '1st Notice Sent' },
              { value: 'Final Notice Sent', label: 'Final Notice Sent' },
              { value: 'Escalated to Legal', label: 'Escalated to Legal' },
            ]}
          />
        </div>

        <Table<PaymentReminderItem>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 6, size: 'small' }}
          size="middle"
        />
      </div>

      {/* 4. Send Notice Modal */}
      <Modal
        title={`Send Dunning Notice: ${selectedItem?.customerName}`}
        open={isSendModalOpen}
        onCancel={() => setIsSendModalOpen(false)}
        footer={null}
        width={540}
      >
        <Form form={form} layout="vertical" onFinish={handleSendReminder}>
          <Form.Item label="Dispatch Channel" name="channel" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'WhatsApp + Email', label: 'WhatsApp & Email Dual Dispatch (Recommended)' },
                { value: 'WhatsApp Only', label: 'WhatsApp Instant Text & PDF' },
                { value: 'Email Only', label: 'Formal Email Notice with Bank Mandate' },
                { value: 'SMS Only', label: 'SMS Gateway Broadcast' },
              ]}
            />
          </Form.Item>

          <Form.Item label="Message Content Preview" name="messageTemplate" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setIsSendModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: BRAND_PURPLE, borderColor: BRAND_PURPLE, fontWeight: 700 }}>
              Dispatch Notice Now
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentRemindersPage;
