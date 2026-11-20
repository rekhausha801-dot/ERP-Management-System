import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Descriptions, Card } from 'antd';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Wrench,
  Cog,
  Zap,
  Shield,
  AlertCircle,
  ListFilter,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../../components';

export interface ServiceOrderItem {
  key: string;
  orderNo: string;
  customerName: string;
  serviceType: string;
  assignedEmployee: string;
  scheduledDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Assigned' | 'Scheduled' | 'Completed';
}

const INITIAL_SERVICE_ORDERS: ServiceOrderItem[] = [
  {
    key: '1',
    orderNo: 'SO-1001',
    customerName: 'Apex Tools',
    serviceType: 'Machine Repair',
    assignedEmployee: 'Murugan',
    scheduledDate: '20-11-2026',
    priority: 'High',
    status: 'In Progress',
  },
  {
    key: '2',
    orderNo: 'SO-1002',
    customerName: 'ABC Industries',
    serviceType: 'IT Maintenance',
    assignedEmployee: 'Dinesh',
    scheduledDate: '20-11-2026',
    priority: 'Medium',
    status: 'Assigned',
  },
  {
    key: '3',
    orderNo: 'SO-1003',
    customerName: 'Sri Traders',
    serviceType: 'Electrical Repair',
    assignedEmployee: 'Suresh',
    scheduledDate: '21-11-2026',
    priority: 'High',
    status: 'Scheduled',
  },
  {
    key: '4',
    orderNo: 'SO-1004',
    customerName: 'Global Tech',
    serviceType: 'AC Maintenance',
    assignedEmployee: 'Kumar',
    scheduledDate: '19-11-2026',
    priority: 'Low',
    status: 'Completed',
  },
];

export const ServiceOrdersPage: React.FC = () => {
  const [data, setData] = useState<ServiceOrderItem[]>(INITIAL_SERVICE_ORDERS);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrderItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const filtered = data.filter(
    (item) =>
      item.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedEmployee.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Service order removed successfully');
  };

  const columns = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (val: string) => (
        <span style={{ fontWeight: 700, color: '#4C1D95' }}>{val}</span>
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string) => (
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13.5 }}>{name}</span>
      ),
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (t: string) => {
        let icon = <Wrench size={13} color="#2563EB" />;
        if (t === 'Machine Repair') icon = <Cog size={13} color="#2563EB" />;
        else if (t === 'Electrical Repair') icon = <Zap size={13} color="#2563EB" />;
        else if (t === 'AC Maintenance') icon = <Shield size={13} color="#2563EB" />;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <span style={{ color: '#1E293B', fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap' }}>
              {t}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Assigned Employee',
      dataIndex: 'assignedEmployee',
      key: 'assignedEmployee',
      render: (emp: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1E293B', fontWeight: 500, fontSize: 13 }}>
          <User size={14} color="#2563EB" />
          <span>{emp}</span>
        </div>
      ),
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (d: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 12.5, fontWeight: 500 }}>
          <Calendar size={14} color="#6D28D9" />
          <span>{d}</span>
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center' as const,
      render: (p: string) => {
        if (p === 'High') {
          return (
            <span
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: 11.5,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <AlertCircle size={12} color="#DC2626" />
              High
            </span>
          );
        }
        if (p === 'Medium') {
          return (
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                fontWeight: 700,
                fontSize: 11.5,
                padding: '4px 12px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 900 }}>📶</span>
              Medium
            </span>
          );
        }
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              fontWeight: 700,
              fontSize: 11.5,
              padding: '4px 12px',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ fontSize: 12 }}>↓</span>
            Low
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (st: string) => {
        let bg = '#F3E8FF';
        let text = '#6D28D9';
        let dot = '#6D28D9';
        if (st === 'In Progress') {
          bg = '#DBEAFE';
          text = '#1D4ED8';
          dot = '#2563EB';
        } else if (st === 'Completed') {
          bg = '#DCFCE7';
          text = '#15803D';
          dot = '#16A34A';
        } else if (st === 'Assigned') {
          bg = '#FEF3C7';
          text = '#B45309';
          dot = '#D97706';
        }
        return (
          <span
            style={{
              backgroundColor: bg,
              color: text,
              fontWeight: 700,
              fontSize: 12,
              padding: '4px 14px',
              whiteSpace: 'nowrap',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 9, color: dot }}>●</span> {st}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: ServiceOrderItem) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            onClick={() => {
              setSelectedOrder(record);
              setViewModalOpen(true);
            }}
            title="View Details"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              border: 'none',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => {
              setSelectedOrder(record);
              editForm.setFieldsValue({
                customerName: record.customerName,
                serviceType: record.serviceType,
                assignedEmployee: record.assignedEmployee,
                priority: record.priority,
                status: record.status,
              });
              setEditModalOpen(true);
            }}
            title="Edit Order"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#EFF6FF',
              border: 'none',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Edit size={13} />
          </button>
          <button
            onClick={() => handleDelete(record.key)}
            title="Delete Order"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#FEE2E2',
              border: 'none',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  const handleCreateSubmit = (values: any) => {
    const newRecord: ServiceOrderItem = {
      key: String(Date.now()),
      orderNo: `SO-100${data.length + 1}`,
      customerName: values.customerName,
      serviceType: values.serviceType,
      assignedEmployee: values.assignedEmployee,
      scheduledDate: values.scheduledDate ? values.scheduledDate.format('DD-MM-YYYY') : '20-11-2026',
      priority: values.priority || 'Medium',
      status: values.status || 'Scheduled',
    };
    setData([...data, newRecord]);
    message.success('New service order created successfully!');
    setCreateModalOpen(false);
    form.resetFields();
  };

  const handleEditSubmit = (values: any) => {
    if (!selectedOrder) return;
    setData((prev) =>
      prev.map((item) =>
        item.key === selectedOrder.key
          ? {
              ...item,
              customerName: values.customerName,
              serviceType: values.serviceType,
              assignedEmployee: values.assignedEmployee,
              priority: values.priority,
              status: values.status,
            }
          : item
      )
    );
    message.success('Service order updated successfully!');
    setEditModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Service Orders"
        subtitle="Manage and track scheduled customer service orders, field assignments, and work progress."
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
            onClick={() => setCreateModalOpen(true)}
          >
            Create Service Order
          </Button>
        }
      />

      {/* Scheduled Services Container with Image Card Style */}
      <Card
        bordered={false}
        className="service-portal-card"
        style={{
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          overflow: 'hidden',
          marginTop: 16,
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Title with List icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#181433' }}>
            <ListFilter size={18} color="#6E56CF" />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#181433' }}>
              Service Orders
            </span>
          </div>

          {/* Controls: Search, Filter, Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '6px 14px',
                width: 240,
                border: '1.5px solid #7C3AED',
              }}
            >
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  width: '100%',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => message.info('Filter options')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <ListFilter size={13} color="#6E56CF" />
              <span>Filter</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => message.success('Exporting service orders to CSV/Excel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#4B5563',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <Download size={13} color="#4C1D95" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="middle"
          className="service-scheduling-table"
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}
        />

        {/* Footer Bar matching screenshot: Showing entries + pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4C1D95', fontWeight: 600 }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              i
            </span>
            <span style={{ color: '#4C1D95' }}>
              Showing 1 to {filtered.length} of {filtered.length} entries
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#4C1D95',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                fontSize: 12,
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* View Detail Modal */}
      <Modal
        title={selectedOrder ? `Service Order - ${selectedOrder.orderNo}` : 'Service Order Details'}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={<Button onClick={() => setViewModalOpen(false)}>Close</Button>}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="small" style={{ marginTop: 12 }}>
            <Descriptions.Item label="Order No">{selectedOrder.orderNo}</Descriptions.Item>
            <Descriptions.Item label="Customer Name">{selectedOrder.customerName}</Descriptions.Item>
            <Descriptions.Item label="Service Type">{selectedOrder.serviceType}</Descriptions.Item>
            <Descriptions.Item label="Assigned Employee">{selectedOrder.assignedEmployee}</Descriptions.Item>
            <Descriptions.Item label="Scheduled Date">{selectedOrder.scheduledDate}</Descriptions.Item>
            <Descriptions.Item label="Priority">{selectedOrder.priority}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedOrder.status}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={selectedOrder ? `Edit Service Order - ${selectedOrder.orderNo}` : 'Edit Order'}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} style={{ marginTop: 12 }}>
          <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Service Type" name="serviceType" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Assigned Employee" name="assignedEmployee" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Assigned">Assigned</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Create Service Order"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit} style={{ marginTop: 12 }}>
          <Form.Item label="Customer Name" name="customerName" rules={[{ required: true }]}>
            <Input placeholder="Customer Name" />
          </Form.Item>
          <Form.Item label="Service Type" name="serviceType" rules={[{ required: true }]}>
            <Input placeholder="e.g. Machine Repair" />
          </Form.Item>
          <Form.Item label="Assigned Employee" name="assignedEmployee" rules={[{ required: true }]}>
            <Input placeholder="Employee name" />
          </Form.Item>
          <Form.Item label="Scheduled Date" name="scheduledDate">
            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="Priority" name="priority" initialValue="Medium">
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="Scheduled">
            <Select>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Assigned">Assigned</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#4C1D95', borderColor: '#4C1D95' }}>
              Create Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceOrdersPage;
