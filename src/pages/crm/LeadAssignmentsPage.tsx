import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Select,
  Modal,
  Form,
  message,
  Input,
  Tabs,
} from 'antd';
import {
  UserCheck,
  Search,
  ArrowRight,
  History,
  CheckCircle,
  Users,
  Bell,
  ChevronDown,
  Layers,
  Award,
} from 'lucide-react';
import {
  INITIAL_EXTENDED_LEADS,
  LeadAssignmentRecord,
  ExtendedLead,
} from '../../mock/crmCustomerStore';

const INITIAL_ASSIGNMENT_HISTORY: LeadAssignmentRecord[] = [
  { id: 'asgn-1', leadId: 'lead-1', leadCode: 'LD-2026-001', companyName: 'Apex Precision Tools Ltd', assignedFrom: 'Unassigned Queue', assignedTo: 'Vikram Seth', assignedDate: '2026-11-12', assignedBy: 'Sales Director', reason: 'Strategic key account allocation', status: 'Active' },
  { id: 'asgn-2', leadId: 'lead-2', leadCode: 'LD-2026-002', companyName: 'Omni Infra Ventures', assignedFrom: 'Unassigned Queue', assignedTo: 'Ananya Sharma', assignedDate: '2026-11-14', assignedBy: 'Sales Director', reason: 'Regional alignment (Karnataka territory)', status: 'Active' },
  { id: 'asgn-3', leadId: 'lead-3', leadCode: 'LD-2026-003', companyName: 'Southern Automation Works', assignedFrom: 'Unassigned Queue', assignedTo: 'Vikram Seth', assignedDate: '2026-11-10', assignedBy: 'Admin Team', reason: 'Automation domain expertise', status: 'Active' },
  { id: 'asgn-4', leadId: 'lead-5', leadCode: 'LD-2026-005', companyName: 'Verma Fabricators & Co', assignedFrom: 'Marketing Team', assignedTo: 'Vikram Seth', assignedDate: '2026-11-15', assignedBy: 'Sales Manager', reason: 'Initial qualification passed', status: 'Active' },
];

export const LeadAssignmentsPage: React.FC = () => {
  const [leads, setLeads] = useState<ExtendedLead[]>(INITIAL_EXTENDED_LEADS);
  const [history, setHistory] = useState<LeadAssignmentRecord[]>(INITIAL_ASSIGNMENT_HISTORY);
  const [selectedLeadKeys, setSelectedLeadKeys] = useState<React.Key[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState<string>('Vikram Seth');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const employees = ['Vikram Seth', 'Ananya Sharma', 'Murugan Selvam', 'Rajesh Kannan'];

  const filteredLeads = leads.filter(
    l =>
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase()) ||
      l.leadNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleBulkAssign = () => {
    if (selectedLeadKeys.length === 0) {
      message.warning('Please select at least one lead from the table to reassign.');
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handleConfirmBulkAssign = () => {
    const updatedLeads = leads.map(l => {
      if (selectedLeadKeys.includes(l.id)) {
        return { ...l, assignedTo: targetEmployee };
      }
      return l;
    });

    const newLogs: LeadAssignmentRecord[] = selectedLeadKeys.map(key => {
      const targetLead = leads.find(l => l.id === key);
      return {
        id: `asgn-${Date.now()}-${Math.random()}`,
        leadId: String(key),
        leadCode: targetLead?.leadNumber || 'LD',
        companyName: targetLead?.companyName || 'Company',
        assignedFrom: targetLead?.assignedTo || 'Unassigned',
        assignedTo: targetEmployee,
        assignedDate: new Date().toISOString().slice(0, 10),
        assignedBy: 'Current User',
        reason: 'Bulk reassignment optimization',
        status: 'Active',
      };
    });

    setLeads(updatedLeads);
    setHistory([...newLogs, ...history]);
    setSelectedLeadKeys([]);
    setIsBulkModalOpen(false);
    message.success(`Successfully reassigned selected leads to ${targetEmployee}!`);
  };

  const kpiCards = [
    {
      title: 'Total Active Leads',
      value: leads.length.toString(),
      growth: '+12%',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #3A1078 0%, #5421A8 50%, #43148F 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <Users size={20} color="#5421A8" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(58, 16, 120, 0.22)',
    },
    {
      title: 'Assignment Transfers',
      value: history.length.toString(),
      growth: '+4 today',
      isDark: false,
      cardBg: '#FFFFFF',
      titleColor: '#6B7280',
      valueColor: '#111827',
      growthColor: '#10B981',
      icon: <History size={18} color="#FFFFFF" />,
      iconBg: '#0284C7',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
    },
    {
      title: 'Active Sales Reps',
      value: employees.length.toString(),
      growth: '100% capacity',
      isDark: true,
      cardBg: 'linear-gradient(135deg, #2A0D5C 0%, #4C1D95 50%, #3B0764 100%)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
      valueColor: '#FFFFFF',
      growthColor: '#4ADE80',
      icon: <UserCheck size={20} color="#4C1D95" />,
      iconBg: '#FFFFFF',
      boxShadow: '0 8px 20px rgba(42, 13, 92, 0.22)',
    },
  ];

  const columns = [
    {
      title: 'Lead ID',
      dataIndex: 'leadNumber',
      key: 'leadNumber',
      width: 140,
      render: (t: string) => <span style={{ fontWeight: 800, color: '#5421A8' }}>{t}</span>,
    },
    {
      title: 'Company & Contact',
      key: 'company',
      render: (_: any, r: ExtendedLead) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E1B4B', fontSize: 13.5 }}>{r.companyName}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>👤 {r.contactName} &bull; {r.email}</div>
        </div>
      ),
    },
    {
      title: 'Estimated Deal',
      dataIndex: 'expectedRevenue',
      key: 'expectedRevenue',
      width: 150,
      render: (v: number) => <span style={{ fontWeight: 800, color: '#10B981' }}>₹{v?.toLocaleString() || '0'}</span>,
    },
    {
      title: 'Current Owner',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 170,
      render: (o: string) => (
        <span
          style={{
            backgroundColor: '#F3EEFF',
            color: '#7544D6',
            fontWeight: 700,
            fontSize: 11.5,
            padding: '4px 10px',
            borderRadius: 14,
            display: 'inline-block',
          }}
        >
          {o}
        </span>
      ),
    },
    {
      title: 'Reassign Directly',
      key: 'reassign',
      width: 200,
      render: (_: any, r: ExtendedLead) => (
        <Select
          value={r.assignedTo}
          size="small"
          style={{ width: 160 }}
          onChange={newRep => {
            setLeads(prev => prev.map(l => (l.id === r.id ? { ...l, assignedTo: newRep } : l)));
            setHistory([
              {
                id: `asgn-${Date.now()}`,
                leadId: r.id,
                leadCode: r.leadNumber,
                companyName: r.companyName,
                assignedFrom: r.assignedTo,
                assignedTo: newRep,
                assignedDate: new Date().toISOString().slice(0, 10),
                assignedBy: 'Current User',
                reason: 'Individual inline reassignment',
                status: 'Active',
              },
              ...history,
            ]);
            message.success(`Lead ${r.leadNumber} assigned to ${newRep}`);
          }}
          options={employees.map(e => ({ label: e, value: e }))}
        />
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
            <UserCheck size={18} color="#FFFFFF" />
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
              Lead Assignment & Ownership
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
              Allocate incoming prospects to sales reps, perform bulk transfers, and track assignment history.
            </p>
          </div>
        </div>

        {/* Right Search, Notification, User Pill, and Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Input
            prefix={<Search size={14} color="#7544D6" style={{ marginRight: 4 }} />}
            placeholder="Search leads..."
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
            disabled={selectedLeadKeys.length === 0}
            onClick={handleBulkAssign}
            style={{
              background: selectedLeadKeys.length > 0 ? 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)' : undefined,
              border: 'none',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: selectedLeadKeys.length > 0 ? '0 3px 10px rgba(84, 33, 168, 0.25)' : 'none',
              padding: '0 14px',
              height: 34,
            }}
          >
            Bulk Reassign ({selectedLeadKeys.length})
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
        <div style={{ marginBottom: 14 }}>
          <Space>
            <Button
              type={activeTab === 'current' ? 'primary' : 'default'}
              onClick={() => setActiveTab('current')}
              style={activeTab === 'current' ? { background: '#5421A8', borderColor: '#5421A8', borderRadius: 20 } : { borderRadius: 20 }}
            >
              Current Active Leads
            </Button>
            <Button
              type={activeTab === 'history' ? 'primary' : 'default'}
              onClick={() => setActiveTab('history')}
              style={activeTab === 'history' ? { background: '#5421A8', borderColor: '#5421A8', borderRadius: 20 } : { borderRadius: 20 }}
            >
              Assignment Audit Logs ({history.length})
            </Button>
          </Space>
        </div>

        {activeTab === 'current' ? (
          <Table
            rowSelection={{
              selectedRowKeys: selectedLeadKeys,
              onChange: setSelectedLeadKeys,
            }}
            dataSource={filteredLeads}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        ) : (
          <Table
            dataSource={history}
            rowKey="id"
            columns={[
              { title: 'Date', dataIndex: 'assignedDate', key: 'assignedDate', width: 120 },
              { title: 'Lead ID', dataIndex: 'leadCode', key: 'leadCode', render: c => <Tag color="purple">{c}</Tag> },
              { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
              { title: 'Transferred From', dataIndex: 'assignedFrom', key: 'assignedFrom' },
              { title: 'Transferred To', dataIndex: 'assignedTo', key: 'assignedTo', render: t => <Tag color="green">{t}</Tag> },
              { title: 'Reason', dataIndex: 'reason', key: 'reason' },
            ]}
            pagination={{ pageSize: 8 }}
          />
        )}
      </div>

      {/* Bulk Assign Modal */}
      <Modal
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        title={`Bulk Reassign ${selectedLeadKeys.length} Selected Leads`}
        onOk={handleConfirmBulkAssign}
        okText="Confirm Reassignment"
        okButtonProps={{ style: { background: '#5421A8', borderColor: '#5421A8' } }}
      >
        <p style={{ color: '#4B5563', fontSize: 13 }}>
          Select the sales representative who will assume ownership and pipeline follow-up responsibility:
        </p>
        <Select
          style={{ width: '100%', marginTop: 10 }}
          value={targetEmployee}
          onChange={setTargetEmployee}
          options={employees.map(e => ({ label: e, value: e }))}
        />
      </Modal>
    </div>
  );
};
