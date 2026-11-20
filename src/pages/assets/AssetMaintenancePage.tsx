import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Typography,
  message,
} from 'antd';
import {
  Wrench,
  Clock,
  CheckCircle,
  Coins,
  Search,
  Plus,
  Printer,
  Check,
  AlertTriangle,
} from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetMaintenanceRecord } from './assetsData';

const { Text, Title } = Typography;

export const AssetMaintenancePage: React.FC = () => {
  const { maintenanceRecords, assets, createMaintenance, completeMaintenance } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AssetMaintenanceRecord | null>(null);

  const [form] = Form.useForm();
  const [completeForm] = Form.useForm();

  // Filters
  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter((item) => {
      const matchSearch =
        item.maintenanceId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serviceProvider.toLowerCase().includes(searchText.toLowerCase()) ||
        item.issueDescription.toLowerCase().includes(searchText.toLowerCase());

      const matchType = typeFilter === 'ALL' || item.maintenanceType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || item.maintenanceStatus === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

      return matchSearch && matchType && matchStatus && matchPriority;
    });
  }, [maintenanceRecords, searchText, typeFilter, statusFilter, priorityFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalRequests = maintenanceRecords.length;
    const pendingMaintenance = maintenanceRecords.filter(
      (m) => m.maintenanceStatus === 'Requested' || m.maintenanceStatus === 'Pending Approval' || m.maintenanceStatus === 'Scheduled'
    ).length;
    const inProgress = maintenanceRecords.filter((m) => m.maintenanceStatus === 'In Progress').length;
    const totalExpenses = maintenanceRecords.reduce(
      (acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : curr.estimatedCost),
      0
    );

    return {
      totalRequests,
      pendingMaintenance,
      inProgress,
      totalExpenses,
    };
  }, [maintenanceRecords]);

  const handleSaveMaintenance = (values: any) => {
    const asset = assets.find((a) => a.assetId === values.assetId);
    if (!asset) {
      message.error('Please select an asset');
      return;
    }

    createMaintenance({
      assetId: asset.assetId,
      assetName: asset.assetName,
      category: asset.category,
      maintenanceType: values.maintenanceType || 'Preventive',
      issueDescription: values.issueDescription,
      priority: values.priority || 'Medium',
      requestDate: dayjs().format('YYYY-MM-DD'),
      scheduledDate: values.scheduledDate ? values.scheduledDate.format('YYYY-MM-DD') : dayjs().add(3, 'day').format('YYYY-MM-DD'),
      serviceProviderType: values.serviceProviderType || 'Internal Technician',
      serviceProvider: values.serviceProvider || 'In-House Service Depot',
      technicianName: values.technicianName || 'Specialist Technician',
      contactNumber: values.contactNumber || '+91 98400 00000',
      estimatedCost: values.estimatedCost || 0,
      actualCost: 0,
      maintenanceStatus: 'Scheduled',
    });

    message.success(`Maintenance job logged for "${asset.assetName}"!`);
    form.resetFields();
    setCreateModalOpen(false);
  };

  const handleSaveCompletion = (values: any) => {
    if (!selectedRecord) return;
    completeMaintenance(
      selectedRecord.maintenanceId,
      values.actualCost || selectedRecord.estimatedCost,
      values.partsReplaced || 'OEM components cleaned & serviced'
    );
    message.success(`Job ${selectedRecord.maintenanceId} successfully completed and cleared!`);
    completeForm.resetFields();
    setCompleteModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: 'Job ID & Type',
      key: 'jobId',
      width: 140,
      render: (_: any, r: AssetMaintenanceRecord) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.maintenanceId}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.maintenanceType} Service</div>
        </div>
      ),
    },
    {
      title: 'Asset Name & ID',
      key: 'assetName',
      render: (_: any, r: AssetMaintenanceRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            ID: {r.assetId} &bull; {r.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Issue / Work Scope',
      dataIndex: 'issueDescription',
      key: 'issueDescription',
      render: (v: string) => (
        <span style={{ fontSize: 12, color: '#334155', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Service Provider & Tech',
      key: 'tech',
      render: (_: any, r: AssetMaintenanceRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.serviceProvider}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.technicianName} ({r.serviceProviderType})</div>
        </div>
      ),
    },
    {
      title: 'Est / Act Cost (₹)',
      key: 'cost',
      align: 'right' as const,
      render: (_: any, r: AssetMaintenanceRecord) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>
            ₹{(r.actualCost > 0 ? r.actualCost : r.estimatedCost).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>
            {r.actualCost > 0 ? 'Actual Billed' : 'Estimated'}
          </div>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: string) => {
        const color = p === 'Critical' ? 'red' : p === 'High' ? 'volcano' : p === 'Medium' ? 'gold' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'maintenanceStatus',
      key: 'maintenanceStatus',
      width: 120,
      render: (status: string) => {
        const color =
          status === 'Completed'
            ? 'success'
            : status === 'In Progress'
            ? 'processing'
            : status === 'Scheduled'
            ? 'gold'
            : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: AssetMaintenanceRecord) => (
        <Space size="small">
          {r.maintenanceStatus !== 'Completed' && (
            <Button
              size="small"
              type="primary"
              style={{ background: '#10B981', border: 'none', fontSize: 11 }}
              onClick={() => {
                setSelectedRecord(r);
                completeForm.setFieldsValue({ actualCost: r.estimatedCost });
                setCompleteModalOpen(true);
              }}
            >
              Mark Done
            </Button>
          )}
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
            Asset Maintenance & Service Schedules
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Preventive inspections, corrective breakdown overhauls, technician allocations, and equipment service cost tracking.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Schedule
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setCreateModalOpen(true)}
          >
            Log Maintenance Request
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
          title="Total Maintenance Jobs"
          value={summaryMetrics.totalRequests}
          subtitle="All recorded service requests"
          trend={{ value: 'Multi-category equipment', isPositive: true }}
          icon={<Wrench size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Pending / Scheduled Jobs"
          value={summaryMetrics.pendingMaintenance}
          subtitle="Upcoming inspection dates"
          trend={{ value: 'Preventive schedules active', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Active In-Progress Repairs"
          value={summaryMetrics.inProgress}
          subtitle="Under technician handling"
          trend={{ value: 'OEM and internal teams', isPositive: false }}
          icon={<AlertTriangle size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
        />
        <KpiCard
          title="Total Maintenance Spend"
          value={`₹${summaryMetrics.totalExpenses.toLocaleString('en-IN')}`}
          subtitle="Spares, lubricants & labor charges"
          trend={{ value: 'Within annual OPEX budget', isPositive: true }}
          icon={<Coins size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
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
            placeholder="Search job ID, asset, issue..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={typeFilter} onChange={setTypeFilter}>
            <Select.Option value="ALL">All Maintenance Types</Select.Option>
            <Select.Option value="Preventive">Preventive Maintenance</Select.Option>
            <Select.Option value="Corrective">Corrective Repair</Select.Option>
            <Select.Option value="Emergency">Emergency Breakdown</Select.Option>
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Job Statuses</Select.Option>
            <Select.Option value="Scheduled">Scheduled</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
          </Select>

          <Select value={priorityFilter} onChange={setPriorityFilter}>
            <Select.Option value="ALL">All Priorities</Select.Option>
            <Select.Option value="Critical">Critical</Select.Option>
            <Select.Option value="High">High</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Low">Low</Select.Option>
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
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} maintenance records` }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Log Maintenance Modal */}
      <Modal
        open={createModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create Maintenance / Service Ticket</span>
          </div>
        }
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Schedule Service"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveMaintenance}>
          <Form.Item name="assetId" label="Target Company Asset" rules={[{ required: true }]}>
            <Select placeholder="Select asset">
              {assets.map((a) => (
                <Select.Option key={a.assetId} value={a.assetId}>
                  {a.assetName} ({a.assetId}) - {a.branch}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="maintenanceType" label="Maintenance Category" initialValue="Preventive">
              <Select>
                <Select.Option value="Preventive">Preventive Maintenance</Select.Option>
                <Select.Option value="Corrective">Corrective Breakdown</Select.Option>
                <Select.Option value="Emergency">Emergency Breakdown</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Priority Level" initialValue="Medium">
              <Select>
                <Select.Option value="Critical">Critical (Immediate Shut)</Select.Option>
                <Select.Option value="High">High</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="Low">Low (Scheduled Inspection)</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="issueDescription" label="Issue Description / Scope of Work" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Detail fault codes, leaks, vibration, parts needing replacement..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="serviceProviderType" label="Service Entity" initialValue="Internal Technician">
              <Select>
                <Select.Option value="Internal Technician">In-House Engineering Team</Select.Option>
                <Select.Option value="External Vendor">External OEM / Authorized Agency</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="serviceProvider" label="Service Provider Name" initialValue="In-House Maintenance Team">
              <Input placeholder="e.g. Siemens Support / In-House" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="technicianName" label="Technician Name" initialValue="Karthik Raja">
              <Input />
            </Form.Item>

            <Form.Item name="scheduledDate" label="Scheduled Service Date" initialValue={dayjs().add(2, 'day')}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="estimatedCost" label="Est. Cost (₹)" initialValue={5000}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Mark Completed Modal */}
      <Modal
        open={completeModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10B981', fontWeight: 800 }}>
            <CheckCircle size={18} />
            <span>Complete & Certify Maintenance Job</span>
          </div>
        }
        onCancel={() => setCompleteModalOpen(false)}
        onOk={() => completeForm.submit()}
        okText="Certify Job Completed"
        cancelText="Cancel"
      >
        {selectedRecord && (
          <Form form={completeForm} layout="vertical" onFinish={handleSaveCompletion}>
            <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{selectedRecord.assetName}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Job ID: {selectedRecord.maintenanceId}</div>
            </div>

            <Form.Item name="actualCost" label="Actual Realized Invoiced Cost (₹)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item name="partsReplaced" label="Parts Replaced / Overhauled" initialValue="OEM Lubricants & Filters">
              <Input placeholder="e.g. Hydraulic filter, new gaskets" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};
