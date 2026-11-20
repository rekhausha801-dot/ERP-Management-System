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
  Typography,
  message,
} from 'antd';
import {
  UserCheck,
  PackageCheck,
  Clock,
  AlertCircle,
  Search,
  Plus,
  Download,
  Printer,
  RotateCcw,
  Eye,
  Layers,
} from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';
import { useAssetsDatabase } from './assetsStore';
import { AssetAllocationRecord, CompanyAsset } from './assetsData';

const { Text, Title } = Typography;

export const AssetAllocationPage: React.FC = () => {
  const { allocations, assets, createAllocation, returnAsset } = useAssetsDatabase();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<AssetAllocationRecord | null>(null);

  const [form] = Form.useForm();
  const [returnForm] = Form.useForm();

  // Available assets for allocation
  const availableAssets = useMemo(() => {
    return assets.filter((a) => a.status === 'Available');
  }, [assets]);

  // Filters
  const filteredAllocations = useMemo(() => {
    return allocations.filter((item) => {
      const matchSearch =
        item.allocationId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.allocationStatus === statusFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      const matchDept = departmentFilter === 'ALL' || item.department === departmentFilter;

      return matchSearch && matchStatus && matchBranch && matchDept;
    });
  }, [allocations, searchText, statusFilter, branchFilter, departmentFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalAllocated = allocations.filter((a) => a.allocationStatus === 'Allocated').length;
    const availablePool = availableAssets.length;
    const pendingAllocations = allocations.filter((a) => a.allocationStatus === 'Pending Approval').length;
    const overdueReturns = allocations.filter((a) => a.allocationStatus === 'Overdue').length;

    return {
      totalAllocated,
      availablePool,
      pendingAllocations,
      overdueReturns,
    };
  }, [allocations, availableAssets]);

  const handleSaveAllocation = (values: any) => {
    const asset = assets.find((a) => a.assetId === values.assetId);
    if (!asset) {
      message.error('Please select a valid available asset');
      return;
    }

    createAllocation({
      assetId: asset.assetId,
      assetName: asset.assetName,
      category: asset.category,
      serialNumber: asset.serialNumber,
      allocationType: values.allocationType || 'Employee',
      assignedTo: values.assignedTo,
      employeeId: values.employeeId || 'EMP-' + Math.floor(100 + Math.random() * 900),
      department: values.department || asset.department,
      branch: values.branch || asset.branch,
      location: values.location || asset.room,
      allocationDate: values.allocationDate ? values.allocationDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      expectedReturnDate: values.expectedReturnDate
        ? values.expectedReturnDate.format('YYYY-MM-DD')
        : dayjs().add(1, 'year').format('YYYY-MM-DD'),
      conditionBefore: asset.condition,
      assignedBy: 'Administrator',
      approvedBy: 'Department Head',
      allocationStatus: 'Allocated',
      handoverNotes: values.handoverNotes || 'Handover inspection verified.',
    });

    message.success(`Asset "${asset.assetName}" successfully allocated to ${values.assignedTo}!`);
    form.resetFields();
    setAllocateModalOpen(false);
  };

  const handleSaveReturn = (values: any) => {
    if (!selectedAllocation) return;
    returnAsset(
      selectedAllocation.allocationId,
      values.returnDate ? values.returnDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      values.conditionAtReturn,
      values.remarks || 'Asset returned in acceptable operational condition.'
    );
    message.success(`Asset "${selectedAllocation.assetName}" returned and restored to Available stock!`);
    returnForm.resetFields();
    setReturnModalOpen(false);
    setSelectedAllocation(null);
  };

  const columns = [
    {
      title: 'Allocation ID',
      dataIndex: 'allocationId',
      key: 'allocationId',
      width: 130,
      render: (v: string) => <span style={{ fontWeight: 800, color: '#1E3A8A' }}>{v}</span>,
    },
    {
      title: 'Asset Name & Serial',
      key: 'assetName',
      render: (_: any, r: AssetAllocationRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.assetName}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.category} &bull; <span style={{ fontFamily: 'monospace' }}>{r.serialNumber}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Custodian',
      key: 'assigned',
      render: (_: any, r: AssetAllocationRecord) => (
        <div>
          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 13 }}>{r.assignedTo}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            {r.department} &bull; {r.branch}
          </div>
        </div>
      ),
    },
    {
      title: 'Allocation Date / Due',
      key: 'dates',
      width: 170,
      render: (_: any, r: AssetAllocationRecord) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Allocated: {r.allocationDate}</div>
          <div style={{ color: r.allocationStatus === 'Overdue' ? '#EF4444' : '#64748B', fontWeight: 600 }}>
            Return: {r.expectedReturnDate}
          </div>
        </div>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'conditionBefore',
      key: 'conditionBefore',
      width: 110,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'allocationStatus',
      key: 'allocationStatus',
      width: 130,
      render: (status: string) => {
        const color =
          status === 'Allocated'
            ? 'success'
            : status === 'Overdue'
            ? 'error'
            : status === 'Returned'
            ? 'default'
            : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: AssetAllocationRecord) => (
        <Space size="small">
          {r.allocationStatus !== 'Returned' && (
            <Button
              size="small"
              icon={<RotateCcw size={13} />}
              style={{ fontSize: 11, color: '#0D9488', borderColor: '#99F6E4' }}
              onClick={() => {
                setSelectedAllocation(r);
                setReturnModalOpen(true);
              }}
            >
              Return
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
            Asset Allocation & Custodian Tracking
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Assign company assets to employees, departments, and field branches with handover receipts and condition audits.
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Report
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setAllocateModalOpen(true)}
          >
            Allocate Asset
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
          title="Total Allocated Assets"
          value={summaryMetrics.totalAllocated}
          subtitle="Currently assigned to staff & branches"
          trend={{ value: 'Under active custody', isPositive: true }}
          icon={<UserCheck size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Available in Pool"
          value={summaryMetrics.availablePool}
          subtitle="Ready for immediate assignment"
          trend={{ value: 'In central storage depots', isPositive: true }}
          icon={<PackageCheck size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Pending Allocation Approvals"
          value={summaryMetrics.pendingAllocations}
          subtitle="Awaiting management sign-off"
          trend={{ value: 'Fast-track enabled', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Overdue Returns"
          value={summaryMetrics.overdueReturns}
          subtitle="Passed expected return deadline"
          trend={{ value: 'Automated email alerts sent', isPositive: false }}
          icon={<AlertCircle size={20} color="#EF4444" />}
          iconBgColor="#FEF2F2"
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
            placeholder="Search allocation ID, staff, serial..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Allocation Statuses</Select.Option>
            <Select.Option value="Allocated">Allocated</Select.Option>
            <Select.Option value="Overdue">Overdue</Select.Option>
            <Select.Option value="Returned">Returned</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
          </Select>

          <Select value={departmentFilter} onChange={setDepartmentFilter}>
            <Select.Option value="ALL">All Departments</Select.Option>
            <Select.Option value="Production & Manufacturing">Production</Select.Option>
            <Select.Option value="Sales & Business Dev">Sales</Select.Option>
            <Select.Option value="Field Engineering & Service">Field Engineering</Select.Option>
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
          dataSource={filteredAllocations}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} allocations` }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      {/* New Allocation Form Modal */}
      <Modal
        open={allocateModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Create Asset Allocation Assignment</span>
          </div>
        }
        onCancel={() => setAllocateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Handover & Allocate"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveAllocation}>
          <Form.Item name="assetId" label="Select Available Asset" rules={[{ required: true }]}>
            <Select placeholder="Choose asset from available pool">
              {availableAssets.map((a) => (
                <Select.Option key={a.assetId} value={a.assetId}>
                  {a.assetName} ({a.assetId}) - {a.brand} [SN: {a.serialNumber}]
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="allocationType" label="Allocation Scope" initialValue="Employee">
              <Select>
                <Select.Option value="Employee">Employee Custody</Select.Option>
                <Select.Option value="Department">Department Pool</Select.Option>
                <Select.Option value="Branch">Branch Deployment</Select.Option>
                <Select.Option value="Project">Project Site</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="assignedTo" label="Assignee / Custodian Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Priya Sharma / Service Team" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Select placeholder="Department">
                <Select.Option value="Sales & Business Dev">Sales & Business Dev</Select.Option>
                <Select.Option value="Field Engineering & Service">Field Engineering</Select.Option>
                <Select.Option value="Production & Manufacturing">Production</Select.Option>
                <Select.Option value="IT & Infrastructure">IT & Infrastructure</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="branch" label="Branch Location" rules={[{ required: true }]}>
              <Select placeholder="Branch">
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
                <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="allocationDate" label="Allocation Date" initialValue={dayjs()}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="expectedReturnDate" label="Expected Return Date" initialValue={dayjs().add(1, 'year')}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="handoverNotes" label="Handover Remarks & Accessories">
            <Input.TextArea rows={2} placeholder="Included cables, safety gear, tool manual..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Asset Return Form Modal */}
      <Modal
        open={returnModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <RotateCcw size={18} />
            <span>Process Asset Return & Check-in</span>
          </div>
        }
        onCancel={() => setReturnModalOpen(false)}
        onOk={() => returnForm.submit()}
        okText="Verify & Return to Pool"
        cancelText="Cancel"
      >
        {selectedAllocation && (
          <Form form={returnForm} layout="vertical" onFinish={handleSaveReturn} initialValues={{ conditionAtReturn: 'Good' }}>
            <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{selectedAllocation.assetName}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                Assigned to: {selectedAllocation.assignedTo} &bull; Expected Return: {selectedAllocation.expectedReturnDate}
              </div>
            </div>

            <Form.Item name="returnDate" label="Actual Return Date" initialValue={dayjs()} rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="conditionAtReturn" label="Verified Return Condition" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Good">Good (Normal Wear & Tear)</Select.Option>
                <Select.Option value="Fair">Fair (Needs Minor Cleaning)</Select.Option>
                <Select.Option value="Needs Repair">Needs Repair / Maintenance</Select.Option>
                <Select.Option value="Damaged">Damaged / Missing Parts</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="remarks" label="Check-in Inspection Remarks">
              <Input.TextArea rows={2} placeholder="Condition summary, missing cables if any..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};
