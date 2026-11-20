import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, Form, DatePicker, Typography, message } from 'antd';
import { Truck, CheckCircle2, Clock, AlertTriangle, Search, Plus, Printer, Download, MapPin, Eye, FileSpreadsheet } from 'lucide-react';
import dayjs from 'dayjs';
import { KpiCard } from '../../components/KpiCard';

const { Text, Title } = Typography;

export interface DeliveryItem {
  id: string;
  deliveryId: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  assignedDriver: string;
  vehicleNumber: string;
  dispatchDate: string;
  expectedDate: string;
  deliveryStatus: 'Pending Dispatch' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned' | 'Failed';
  itemsCount: number;
  totalWeightKg: number;
  branch: string;
  proofOfDelivery?: string;
}

export const INITIAL_DELIVERIES: DeliveryItem[] = [
  {
    id: 'DEL-01',
    deliveryId: 'DO-2026-081',
    orderNumber: 'SO-1048',
    customerName: 'Tata Steel Processing Ltd',
    deliveryAddress: 'Plot 44, SIPCOT Industrial Park, Sriperumbudur, TN',
    assignedDriver: 'Muruganandham V',
    vehicleNumber: 'TN-07-CM-4819 (Tata EV)',
    dispatchDate: '2026-11-18',
    expectedDate: '2026-11-19',
    deliveryStatus: 'Delivered',
    itemsCount: 4,
    totalWeightKg: 420,
    branch: 'Chennai HQ',
    proofOfDelivery: 'SIGNED_CHALLAN_POD_8819.pdf',
  },
  {
    id: 'DEL-02',
    deliveryId: 'DO-2026-082',
    orderNumber: 'SO-1047',
    customerName: 'Ashok Leyland Foundry Div',
    deliveryAddress: 'Gate 2, Heavy Vehicle Factory Road, Ennore, Chennai',
    assignedDriver: 'Saravanan K',
    vehicleNumber: 'TN-04-E-9011 (Ashok Leyland 4T)',
    dispatchDate: '2026-11-19',
    expectedDate: '2026-11-19',
    deliveryStatus: 'In Transit',
    itemsCount: 8,
    totalWeightKg: 180,
    branch: 'Chennai HQ',
  },
  {
    id: 'DEL-03',
    deliveryId: 'DO-2026-083',
    orderNumber: 'SO-1046',
    customerName: 'Lucas TVS Components Ltd',
    deliveryAddress: 'Industrial Suburb, Thudiyalur, Coimbatore, TN',
    assignedDriver: 'Karthik Raja',
    vehicleNumber: 'TN-38-BY-2210',
    dispatchDate: '2026-11-19',
    expectedDate: '2026-11-20',
    deliveryStatus: 'Out for Delivery',
    itemsCount: 5,
    totalWeightKg: 95,
    branch: 'Coimbatore Plant',
  },
  {
    id: 'DEL-04',
    deliveryId: 'DO-2026-084',
    orderNumber: 'SO-1045',
    customerName: 'Sundaram Fasteners Ltd',
    deliveryAddress: 'Padi Industrial Complex, Chennai',
    assignedDriver: 'Unassigned',
    vehicleNumber: 'Awaiting Vehicle',
    dispatchDate: '2026-11-20',
    expectedDate: '2026-11-21',
    deliveryStatus: 'Pending Dispatch',
    itemsCount: 2,
    totalWeightKg: 60,
    branch: 'Chennai HQ',
  },
];

export const DeliveryManagementPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(() => {
    const raw = localStorage.getItem('erp_deliveries_list');
    return raw ? JSON.parse(raw) : INITIAL_DELIVERIES;
  });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredData = useMemo(() => {
    return deliveries.filter((item) => {
      const matchSearch =
        item.deliveryId.toLowerCase().includes(searchText.toLowerCase()) ||
        item.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.assignedDriver.toLowerCase().includes(searchText.toLowerCase()) ||
        item.vehicleNumber.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.deliveryStatus === statusFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;

      return matchSearch && matchStatus && matchBranch;
    });
  }, [deliveries, searchText, statusFilter, branchFilter]);

  // Exactly 4 Summary Cards Metrics
  const summaryMetrics = useMemo(() => {
    const totalDeliveries = deliveries.length;
    const inTransit = deliveries.filter((d) => d.deliveryStatus === 'In Transit' || d.deliveryStatus === 'Out for Delivery').length;
    const delivered = deliveries.filter((d) => d.deliveryStatus === 'Delivered').length;
    const pendingDispatch = deliveries.filter((d) => d.deliveryStatus === 'Pending Dispatch').length;

    return {
      totalDeliveries,
      inTransit,
      delivered,
      pendingDispatch,
    };
  }, [deliveries]);

  const handleSaveDelivery = (values: any) => {
    const newItem: DeliveryItem = {
      id: 'DEL-' + Date.now(),
      deliveryId: 'DO-2026-' + Math.floor(100 + Math.random() * 900),
      orderNumber: values.orderNumber,
      customerName: values.customerName,
      deliveryAddress: values.deliveryAddress,
      assignedDriver: values.assignedDriver || 'Depot Fleet Driver',
      vehicleNumber: values.vehicleNumber || 'TN-07-CM-4819 (Tata EV)',
      dispatchDate: values.dispatchDate ? values.dispatchDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      expectedDate: values.expectedDate ? values.expectedDate.format('YYYY-MM-DD') : dayjs().add(1, 'day').format('YYYY-MM-DD'),
      deliveryStatus: 'Pending Dispatch',
      itemsCount: values.itemsCount || 1,
      totalWeightKg: values.totalWeightKg || 50,
      branch: values.branch || 'Chennai HQ',
    };
    const updated = [newItem, ...deliveries];
    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list', JSON.stringify(updated));
    message.success(`Delivery Order ${newItem.deliveryId} created and queued for dispatch!`);
    form.resetFields();
    setAddModalOpen(false);
  };

  const handleMarkDelivered = (id: string) => {
    const updated = deliveries.map((d) =>
      d.id === id ? { ...d, deliveryStatus: 'Delivered' as const, proofOfDelivery: 'DIGITAL_SIGNATURE_POD.pdf' } : d
    );
    setDeliveries(updated);
    localStorage.setItem('erp_deliveries_list', JSON.stringify(updated));
    message.success('Delivery marked as Delivered with Proof of Delivery!');
  };

  const columns = [
    {
      title: 'Challan / Order Ref',
      key: 'delOrder',
      width: 150,
      render: (_: any, r: DeliveryItem) => (
        <div>
          <div style={{ fontWeight: 800, color: '#1E3A8A' }}>{r.deliveryId}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>Order: {r.orderNumber}</div>
        </div>
      ),
    },
    {
      title: 'Customer & Destination',
      key: 'custDest',
      render: (_: any, r: DeliveryItem) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{r.customerName}</div>
          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <MapPin size={11} color="#EF4444" /> {r.deliveryAddress}
          </div>
        </div>
      ),
    },
    {
      title: 'Fleet & Driver',
      key: 'fleet',
      render: (_: any, r: DeliveryItem) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: '#1E293B' }}>{r.assignedDriver}</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{r.vehicleNumber}</div>
        </div>
      ),
    },
    {
      title: 'Dispatch / Expected',
      key: 'dates',
      width: 150,
      render: (_: any, r: DeliveryItem) => (
        <div style={{ fontSize: 11.5 }}>
          <div>Disp: {r.dispatchDate}</div>
          <div style={{ color: '#0F766E', fontWeight: 600 }}>Exp: {r.expectedDate}</div>
        </div>
      ),
    },
    {
      title: 'Items & Weight',
      key: 'itemsWt',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: DeliveryItem) => (
        <div style={{ fontSize: 12 }}>
          <span style={{ fontWeight: 700 }}>{r.itemsCount} pkgs</span> &bull; {r.totalWeightKg} kg
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 140,
      render: (status: string) => {
        const color =
          status === 'Delivered'
            ? 'success'
            : status === 'In Transit' || status === 'Out for Delivery'
            ? 'processing'
            : status === 'Pending Dispatch'
            ? 'warning'
            : 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, r: DeliveryItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye size={15} color="#4F46E5" />}
            title="View Delivery Details & POD"
            onClick={() => {
              setSelectedDelivery(r);
              setDetailModalOpen(true);
            }}
          />
          {r.deliveryStatus !== 'Delivered' && (
            <Button
              size="small"
              type="primary"
              style={{ background: '#10B981', border: 'none', fontSize: 11 }}
              onClick={() => handleMarkDelivered(r.id)}
            >
              POD Done
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
            Delivery & Dispatch Management
          </Title>
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            Manage delivery challans, vehicle dispatch schedules, courier consignments, and electronic Proof of Delivery (POD).
          </Text>
        </div>

        <Space wrap>
          <Button icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Manifest
          </Button>
          <Button icon={<Download size={14} />} onClick={() => message.success('Exporting Delivery log...')}>
            Export Excel
          </Button>
          <Button
            type="primary"
            icon={<Plus size={14} />}
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', border: 'none' }}
            onClick={() => setAddModalOpen(true)}
          >
            Create Delivery Challan
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
          title="Total Delivery Orders"
          value={summaryMetrics.totalDeliveries}
          subtitle="Cumulative shipment consignments"
          trend={{ value: 'Multi-branch fleet dispatch', isPositive: true }}
          icon={<Truck size={20} color="#1E3A8A" />}
          iconBgColor="#EEF2FF"
        />
        <KpiCard
          title="Active In-Transit Shipments"
          value={summaryMetrics.inTransit}
          subtitle="Vehicles currently on route"
          trend={{ value: 'Live GPS monitored', isPositive: true }}
          icon={<Clock size={20} color="#0D9488" />}
          iconBgColor="#F0FDFA"
        />
        <KpiCard
          title="Delivered with POD"
          value={summaryMetrics.delivered}
          subtitle="Successfully signed & closed"
          trend={{ value: '98% on-time delivery rate', isPositive: true }}
          icon={<CheckCircle2 size={20} color="#10B981" />}
          iconBgColor="#ECFDF5"
        />
        <KpiCard
          title="Pending Warehouse Dispatch"
          value={summaryMetrics.pendingDispatch}
          subtitle="Packed & ready for fleet loading"
          trend={{ value: 'Staged in outbound bays', isPositive: false }}
          icon={<AlertTriangle size={20} color="#EA580C" />}
          iconBgColor="#FFF7ED"
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
            placeholder="Search DO #, order, customer, vehicle..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="ALL">All Delivery Statuses</Select.Option>
            <Select.Option value="Pending Dispatch">Pending Dispatch</Select.Option>
            <Select.Option value="In Transit">In Transit</Select.Option>
            <Select.Option value="Out for Delivery">Out for Delivery</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
          </Select>

          <Select value={branchFilter} onChange={setBranchFilter}>
            <Select.Option value="ALL">All Depots / Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
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
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} deliveries` }}
          scroll={{ x: 1150 }}
          size="middle"
        />
      </Card>

      {/* Create Delivery Modal */}
      <Modal
        open={addModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Plus size={18} />
            <span>Generate Outbound Delivery Challan</span>
          </div>
        }
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="Generate Challan"
        cancelText="Cancel"
        width={680}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveDelivery}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="orderNumber" label="Sales Order Reference" rules={[{ required: true }]} initialValue="SO-1049">
              <Input placeholder="e.g. SO-1049" />
            </Form.Item>

            <Form.Item name="customerName" label="Recipient Customer Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. TVS Motor Company Ltd" />
            </Form.Item>
          </div>

          <Form.Item name="deliveryAddress" label="Delivery Destination Address" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Complete physical site address & gate entry instructions" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="assignedDriver" label="Assigned Driver / Fleet Lead" initialValue="Muruganandham V">
              <Input />
            </Form.Item>

            <Form.Item name="vehicleNumber" label="Vehicle Registration / Carrier" initialValue="TN-07-CM-4819 (Tata EV)">
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="itemsCount" label="Package Count" initialValue={4}>
              <Input type="number" min={1} />
            </Form.Item>

            <Form.Item name="totalWeightKg" label="Weight (Kg)" initialValue={120}>
              <Input type="number" min={1} />
            </Form.Item>

            <Form.Item name="branch" label="Dispatch Branch" initialValue="Chennai HQ">
              <Select>
                <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
                <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
                <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Detail / POD Modal */}
      <Modal
        open={detailModalOpen}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
            <Truck size={18} />
            <span>Delivery Challan & Electronic POD - {selectedDelivery?.deliveryId}</span>
          </div>
        }
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            style={{ background: '#1E3A8A' }}
            onClick={() => {
              message.success('Printing Official Delivery Challan...');
              setDetailModalOpen(false);
            }}
          >
            Print Delivery Challan
          </Button>,
        ]}
        width={650}
      >
        {selectedDelivery && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15 }}>{selectedDelivery.customerName}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                Address: {selectedDelivery.deliveryAddress}
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Order Reference:</span>
                <span style={{ fontWeight: 700 }}>{selectedDelivery.orderNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Assigned Driver & Vehicle:</span>
                <span style={{ fontWeight: 600 }}>{selectedDelivery.assignedDriver} ({selectedDelivery.vehicleNumber})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B' }}>Cargo Specifications:</span>
                <span style={{ fontWeight: 600 }}>{selectedDelivery.itemsCount} pkgs &bull; {selectedDelivery.totalWeightKg} Kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#64748B' }}>Proof of Delivery (POD):</span>
                <span style={{ fontWeight: 700, color: selectedDelivery.proofOfDelivery ? '#10B981' : '#EF4444' }}>
                  {selectedDelivery.proofOfDelivery ? 'Verified with Receiver Signature' : 'Pending Physical Delivery'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Tag color="blue">Status: {selectedDelivery.deliveryStatus}</Tag>
              <Tag color="purple">Branch: {selectedDelivery.branch}</Tag>
              <Tag color="cyan">Dispatch: {selectedDelivery.dispatchDate}</Tag>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
