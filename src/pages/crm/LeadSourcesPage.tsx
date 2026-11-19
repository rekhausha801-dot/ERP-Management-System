import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Modal,
  Form,
  Switch,
  message,
} from 'antd';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  Share2,
  Bell,
  ChevronDown,
  Layers,
  Award,
  CheckCircle,
} from 'lucide-react';
import {
  INITIAL_LEAD_SOURCES,
  LeadSource,
} from '../../mock/crmCustomerStore';

export const LeadSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<LeadSource[]>(INITIAL_LEAD_SOURCES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [form] = Form.useForm();

  const filtered = sources.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalLeadsGenerated = sources.reduce((sum, s) => sum + s.totalLeads, 0);
  const activeSourcesCount = sources.filter(s => s.isActive).length;
  const avgConversion = sources.length > 0 ? (sources.reduce((sum, s) => sum + s.conversionRate, 0) / sources.length).toFixed(1) : '0';

  const handleOpenAdd = () => {
    setEditingSource(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (src: LeadSource) => {
    setEditingSource(src);
    form.setFieldsValue({ ...src });
    setIsModalOpen(true);
  };

  const handleSave = (values: any) => {
    if (!editingSource) {
      const newS: LeadSource = {
        id: `src-${Date.now()}`,
        name: values.name,
        code: values.code.toUpperCase(),
        description: values.description || '',
        totalLeads: 0,
        conversionRate: 0,
        isActive: values.isActive ?? true,
        createdDate: new Date().toISOString().slice(0, 10),
      };
      setSources([...sources, newS]);
      message.success('New lead source channel added!');
    } else {
      setSources(prev =>
        prev.map(s => (s.id === editingSource.id ? { ...s, ...values, code: values.code.toUpperCase() } : s))
      );
      message.success('Lead source channel updated.');
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setSources(prev => prev.map(s => (s.id === id ? { ...s, isActive: active } : s)));
    message.success(`Lead source ${active ? 'activated' : 'deactivated'}.`);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Lead Source',
      content: 'Are you sure you want to remove this source channel?',
      okType: 'danger',
      onOk: () => {
        setSources(prev => prev.filter(s => s.id !== id));
        message.success('Lead source deleted.');
      },
    });
  };

  const kpiCards = [
    {
      title: 'Total Active Channels',
      value: activeSourcesCount.toString(),
      growth: '+100%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Share2 size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Total Inbound Leads',
      value: totalLeadsGenerated.toString(),
      growth: '+28%',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <Layers size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Avg Channel Conversion',
      value: `${avgConversion}%`,
      growth: '+4.5%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Award size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
  ];

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 110,
      render: (c: string) => (
        <span
          style={{
            backgroundColor: '#F3EEFF',
            color: '#7544D6',
            fontWeight: 800,
            fontSize: 12,
            padding: '3px 8px',
            borderRadius: 6,
            display: 'inline-block',
          }}
        >
          {c}
        </span>
      ),
    },
    {
      title: 'Source Channel Name',
      dataIndex: 'name',
      key: 'name',
      render: (n: string, r: LeadSource) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 13.5 }}>{n}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{r.description}</div>
        </div>
      ),
    },
    {
      title: 'Total Inbound Leads',
      dataIndex: 'totalLeads',
      key: 'totalLeads',
      width: 180,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#211044', fontSize: 13 }}>
          {v} Leads
        </span>
      ),
    },
    {
      title: 'Win Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 180,
      render: (v: number) => (
        <span style={{ fontWeight: 800, color: '#10B981', fontSize: 13 }}>
          {v}%
        </span>
      ),
    },
    {
      title: 'Channel Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (active: boolean, r: LeadSource) => (
        <Switch
          checked={active}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={checked => handleToggleActive(r.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'right' as const,
      render: (_: any, r: LeadSource) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<Edit size={14} color="#7544D6" />}
            onClick={() => handleOpenEdit(r)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(r.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        minHeight: '100%',
        paddingBottom: 24,
      }}
    >
      {/* 1. Cohesive Single-Line Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 20,
          padding: '12px 20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 254, 0.9) 100%)',
          borderRadius: 18,
          border: '1px solid #EAE4F5',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
          backdropFilter: 'blur(8px)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 auto' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(84, 33, 168, 0.25)',
              flexShrink: 0,
            }}
          >
            <Share2 size={18} color="#FFFFFF" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#211044',
                margin: 0,
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              Lead Acquisition Sources
            </h1>
            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '2px 0 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Configure marketing channels, track channel acquisition ROI, and manage inbound lead attribution.
            </p>
          </div>
        </div>

        {/* Right Search, Notification, User Pill, and Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Input
            prefix={<Search size={14} color="#7544D6" style={{ marginRight: 4 }} />}
            placeholder="Search channels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 180,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              borderColor: '#ECE8F6',
              padding: '5px 12px',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.04)',
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={handleOpenAdd}
            style={{
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              border: 'none',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: '0 3px 10px rgba(84, 33, 168, 0.25)',
              padding: '0 14px',
              height: 34,
            }}
          >
            Add Source
          </Button>

          {/* Notification Bell */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Bell size={15} color="#5421A8" />
            <span
              style={{
                position: 'absolute',
                top: -1,
                right: -1,
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: 8.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              3
            </span>
          </div>

          {/* User Profile Capsule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 8px 2px 3px',
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECE8F6',
              boxShadow: '0 2px 8px rgba(84, 33, 168, 0.05)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3A1078 0%, #5421A8 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              JD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#211044', lineHeight: 1.1 }}>
                Janani D
              </span>
              <span style={{ fontSize: 8.5, color: '#7544D6', fontWeight: 600 }}>
                VP of Sales
              </span>
            </div>
            <ChevronDown size={11} color="#7544D6" />
          </div>
        </div>
      </div>

      {/* 2. Top 3 Compact Premium KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: '100%',
        }}
      >
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: kpi.cardBg,
              borderRadius: 16,
              padding: '16px 18px',
              border: kpi.isDark ? 'none' : '1px solid #ECE8F6',
              boxShadow: kpi.boxShadow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 114,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: kpi.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: kpi.isDark ? '0 4px 10px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                {kpi.icon}
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, color: kpi.titleColor, fontWeight: 600 }}>
                {kpi.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: kpi.valueColor,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                  }}
                >
                  {kpi.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: kpi.growthColor,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ↑ {kpi.growth}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Enterprise Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: '20px 24px',
          border: '1px solid #ECE8F6',
          boxShadow: '0 4px 20px rgba(84, 33, 168, 0.04)',
        }}
      >
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Modal Add/Edit */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={editingSource ? 'Edit Lead Acquisition Channel' : 'Add New Lead Acquisition Channel'}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Source Name" rules={[{ required: true, message: 'Please enter channel name' }]}>
            <Input placeholder="e.g. Google Ads, Trade Expo, Cold Outreach" />
          </Form.Item>
          <Form.Item name="code" label="Channel Code" rules={[{ required: true, message: 'Enter 2-5 letter code' }]}>
            <Input placeholder="e.g. GGL, EXPO, OUTR" />
          </Form.Item>
          <Form.Item name="description" label="Channel Details / Attribution Strategy">
            <Input.TextArea rows={2} placeholder="Description of this inbound lead channel..." />
          </Form.Item>
          <Form.Item name="isActive" label="Channel Active Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: '#5421A8', borderColor: '#5421A8' }}>
              Save Channel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
