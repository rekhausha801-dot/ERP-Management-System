import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Space, Typography, Modal, Form, Select, DatePicker, message, Tooltip, Row, Col, Descriptions } from 'antd';
import { Plus, Search, Filter, Download, FileSpreadsheet, FileText, ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../components';

const { Text } = Typography;

// Generates dynamic professional enterprise records matching the module name
export function getMockRecordsForModule(moduleName: string) {
  const norm = moduleName.toLowerCase();

  if (norm.includes('employee') || norm.includes('department') || norm.includes('attendance') || norm.includes('leave')) {
    return [
      { key: '1', code: 'EMP-1001', name: 'Vikram Seth', department: 'Enterprise Sales', designation: 'Senior Account Executive', status: 'Active', joiningDate: '2023-04-15', attendance: 'Present (98%)', email: 'vikram@enterprise.com' },
      { key: '2', code: 'EMP-1002', name: 'Murugan K.', department: 'Field Services', designation: 'Lead Field Engineer', status: 'Active', joiningDate: '2022-08-10', attendance: 'On Field (99%)', email: 'murugan@enterprise.com' },
      { key: '3', code: 'EMP-1003', name: 'Ananya Sharma', department: 'Commercial Accounts', designation: 'Product Specialist', status: 'Active', joiningDate: '2023-11-01', attendance: 'Present (95%)', email: 'ananya@enterprise.com' },
      { key: '4', code: 'EMP-1004', name: 'Dinesh V.', department: 'Technical Dispatch', designation: 'Hydraulics Specialist', status: 'On Leave', joiningDate: '2024-01-20', attendance: 'Annual Leave', email: 'dinesh@enterprise.com' },
    ];
  }

  if (norm.includes('purchase') || norm.includes('procurement') || norm.includes('grn') || norm.includes('supplier')) {
    return [
      { key: '1', code: 'PO-2026-801', supplier: 'Bharat Heavy Electricals', category: 'Heavy Industrial Drives', amount: '₹18,50,000', status: 'Approved', grnStatus: 'GRN Received', createdDate: '2026-11-10', approvedBy: 'Finance HQ' },
      { key: '2', code: 'PO-2026-802', supplier: 'L&T Precision Hydraulics', category: 'Servo Valves & Actuators', amount: '₹8,40,000', status: 'Pending Approval', grnStatus: 'Awaiting Delivery', createdDate: '2026-11-12', approvedBy: 'Procurement Head' },
      { key: '3', code: 'PO-2026-803', supplier: 'Apex Tooling Consortium', category: 'Spindle Bearing Units', amount: '₹4,90,000', status: 'Approved', grnStatus: 'Partial GRN', createdDate: '2026-11-14', approvedBy: 'Operations GM' },
      { key: '4', code: 'PO-2026-804', supplier: 'Rotary Fluidics Corp', category: 'Industrial Lubricants', amount: '₹2,65,000', status: 'Completed', grnStatus: 'Inspected & Passed', createdDate: '2026-11-08', approvedBy: 'Finance HQ' },
    ];
  }

  if (norm.includes('warehouse') || norm.includes('stock') || norm.includes('batch') || norm.includes('serial') || norm.includes('inventory')) {
    return [
      { key: '1', code: 'SKU-DRV-001', name: '3-Phase Frequency Inverter 15kW', warehouse: 'Central Warehouse WH-A', batch: 'BT-2026-90', qtyOnHand: '142 Units', reorderLevel: '20 Units', valuation: '₹42,60,000', status: 'Sufficient' },
      { key: '2', code: 'SKU-HYD-042', name: 'High-Pressure Hydraulic Seal Kit', warehouse: 'Chennai Hub WH-B', batch: 'BT-2026-94', qtyOnHand: '8 Kits', reorderLevel: '25 Kits', valuation: '₹1,92,000', status: 'Low Stock' },
      { key: '3', code: 'SKU-BRG-108', name: 'Precision Double Row Bearing 6204', warehouse: 'Central Warehouse WH-A', batch: 'BT-2026-88', qtyOnHand: '840 Pcs', reorderLevel: '100 Pcs', valuation: '₹10,50,000', status: 'Sufficient' },
      { key: '4', code: 'SKU-CMP-302', name: 'Synthetic Rotary Oil Can 20L', warehouse: 'Coimbatore Depot WH-C', batch: 'BT-2026-72', qtyOnHand: '4 Cans', reorderLevel: '30 Cans', valuation: '₹76,000', status: 'Critical Reorder' },
    ];
  }

  if (norm.includes('maintenance') || norm.includes('equipment') || norm.includes('asset') || norm.includes('route') || norm.includes('preventive')) {
    return [
      { key: '1', code: 'AST-CNC-004', name: '5-Axis High Precision CNC Mill', client: 'Apex Precision Works', scheduleType: 'Preventive Bi-Monthly', nextDueDate: '2026-11-25', assignedTech: 'Murugan K.', route: 'Chennai Industrial Corridor', status: 'Scheduled' },
      { key: '2', code: 'AST-HYD-012', name: 'Hydraulic Stamping Press 50T', client: 'Southern Automation Ltd', scheduleType: 'Breakdown Overhaul', nextDueDate: '2026-11-18', assignedTech: 'Dinesh V.', route: 'Ambattur Cluster', status: 'In Progress' },
      { key: '3', code: 'AST-ROT-008', name: 'Rotary Screw Compressor 75HP', client: 'Metro Rail Workshop', scheduleType: 'Annual Comprehensive AMC', nextDueDate: '2026-12-05', assignedTech: 'Suresh R.', route: 'Tambaram Central', status: 'Under Contract' },
      { key: '4', code: 'AST-MOT-099', name: 'Dual Speed Variable Motor', client: 'Dynamic Motors Corp', scheduleType: 'Warranty Inspection', nextDueDate: '2026-11-19', assignedTech: 'Balaji M.', route: 'Sriperumbudur Hub', status: 'Assigned' },
    ];
  }

  if (norm.includes('credit') || norm.includes('debit') || norm.includes('bank') || norm.includes('tax') || norm.includes('ledger') || norm.includes('reconciliation') || norm.includes('financial')) {
    return [
      { key: '1', code: 'TXN-9021', refNumber: 'CN-2026-041', account: 'HDFC Corporate Account', type: 'Credit Note', amount: '₹45,000', taxImpact: '₹8,100 (GST 18%)', status: 'Reconciled', date: '2026-11-15' },
      { key: '2', code: 'TXN-9022', refNumber: 'RCP-2026-904', account: 'ICICI Bank Current', type: 'Payment Receipt', amount: '₹12,40,000', taxImpact: 'TDS Deducted', status: 'Verified', date: '2026-11-16' },
      { key: '3', code: 'TXN-9023', refNumber: 'DN-2026-018', account: 'SBI Commercial Escrow', type: 'Debit Note', amount: '₹84,000', taxImpact: 'Input Tax Credit', status: 'Pending Review', date: '2026-11-14' },
      { key: '4', code: 'TXN-9024', refNumber: 'TAX-GST-3B', account: 'Government Tax Treasury', type: 'Monthly GST Filing', amount: '₹3,45,000', taxImpact: 'Eligible ITC Adjusted', status: 'Filed', date: '2026-11-12' },
    ];
  }

  // Default dynamic commercial/service enterprise data
  return [
    { key: '1', code: `REC-${Math.floor(1000 + Math.random() * 9000)}`, name: `${moduleName} Standard Entry 1`, category: 'Enterprise Core', ...(norm.includes('pricing') ? { amount: '₹4,50,000' } : {}), status: 'Active / Approved', date: '2026-11-16', updatedBy: 'Admin Team' },
    { key: '2', code: `REC-${Math.floor(1000 + Math.random() * 9000)}`, name: `${moduleName} Verified Record 2`, category: 'Enterprise Core', ...(norm.includes('pricing') ? { amount: '₹12,80,000' } : {}), status: 'Pending Review', date: '2026-11-15', updatedBy: 'Compliance HQ' },
    { key: '3', code: `REC-${Math.floor(1000 + Math.random() * 9000)}`, name: `${moduleName} Scheduled Execution 3`, category: 'Operational Unit', ...(norm.includes('pricing') ? { amount: '₹1,95,000' } : {}), status: 'Processing', date: '2026-11-14', updatedBy: 'Operations GM' },
    { key: '4', code: `REC-${Math.floor(1000 + Math.random() * 9000)}`, name: `${moduleName} Archived Summary 4`, category: 'Audited Ledger', ...(norm.includes('pricing') ? { amount: '₹8,20,000' } : {}), status: 'Completed', date: '2026-11-12', updatedBy: 'Finance Lead' },
  ];
}

export const GenericModuleView: React.FC<{
  title?: string;
  category?: string;
  description?: string;
}> = ({ title, category = 'Module', description }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const autoTitle = title || location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'Module View';
  const [dataRecords, setDataRecords] = useState<any[]>(() => getMockRecordsForModule(autoTitle));

  const handleAcceptRecord = (rec: any) => {
    setDataRecords(prev => prev.map(r => r.key === rec.key ? { ...r, status: 'Active / Approved' } : r));
    if (selectedRecord && selectedRecord.key === rec.key) {
      setSelectedRecord({ ...selectedRecord, status: 'Active / Approved' });
    }
    message.success(`Record ${rec.code || rec.name} has been APPROVED / ACCEPTED.`);
    setViewModalOpen(false);
  };

  const handleRejectRecord = (rec: any) => {
    setDataRecords(prev => prev.map(r => r.key === rec.key ? { ...r, status: 'Rejected' } : r));
    if (selectedRecord && selectedRecord.key === rec.key) {
      setSelectedRecord({ ...selectedRecord, status: 'Rejected' });
    }
    message.error(`Record ${rec.code || rec.name} has been REJECTED.`);
    setViewModalOpen(false);
  };

  // Dynamic columns generated from records
  const sample = dataRecords[0] || {};
  const columns = Object.keys(sample)
    .filter((k) => k !== 'key')
    .map((key) => {
      const header = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      return {
        title: header,
        dataIndex: key,
        key: key,
        render: (val: any) => {
          if (typeof val === 'string' && (val.includes('Active') || val.includes('Approved') || val.includes('Completed') || val.includes('Passed') || val.includes('Sufficient') || val.includes('Present'))) {
            return <Tag color="green" style={{ borderRadius: 10, fontWeight: 600 }}>{val}</Tag>;
          }
          if (typeof val === 'string' && (val.includes('Pending') || val.includes('Progress') || val.includes('Low') || val.includes('Scheduled'))) {
            return <Tag color="orange" style={{ borderRadius: 10, fontWeight: 600 }}>{val}</Tag>;
          }
          if (typeof val === 'string' && (val.includes('Critical') || val.includes('Leave') || val.includes('Breach') || val.includes('Alert'))) {
            return <Tag color="red" style={{ borderRadius: 10, fontWeight: 600 }}>{val}</Tag>;
          }
          if (typeof val === 'string' && (val.startsWith('EMP-') || val.startsWith('PO-') || val.startsWith('SKU-') || val.startsWith('AST-') || val.startsWith('TXN-') || val.startsWith('REC-'))) {
            return <span style={{ fontWeight: 700, color: '#6E56CF' }}>{val}</span>;
          }
          if (typeof val === 'string' && val.startsWith('₹')) {
            return <span style={{ fontWeight: 700, color: '#181433' }}>{val}</span>;
          }
          return <span>{val}</span>;
        },
      };
    });

  // Action column
  const allColumns: any[] = [...columns, {
    title: 'Actions',
    key: 'actions',
    dataIndex: 'actions',
    render: (_: any, record: any) => (
      <span
        style={{
          cursor: 'pointer',
          fontWeight: 700,
          color: '#2563EB',
          fontSize: 13,
          display: 'inline-block',
        }}
        onClick={() => {
          setSelectedRecord(record);
          setViewModalOpen(true);
        }}
      >
        View
      </span>
    ),
  }];

  const filteredData = dataRecords.filter((r) =>
    Object.values(r).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        title={autoTitle}
        subtitle={description || `Enterprise multi-tenant data records, operational auditing, and real-time processing for ${autoTitle}.`}
        actions={
          <Space>
            <Button icon={<FileSpreadsheet size={15} color="#10B981" />} onClick={() => message.success(`Exporting ${autoTitle} to Excel...`)}>
              Export Excel
            </Button>
            <Button icon={<FileText size={15} color="#EF4444" />} onClick={() => message.success(`Generating ${autoTitle} PDF Report...`)}>
              Export PDF
            </Button>
            <Button
              type="primary"
              icon={<Plus size={15} />}
              style={{ backgroundColor: '#6E56CF', borderRadius: 12, fontWeight: 600 }}
              onClick={() => setIsModalOpen(true)}
            >
              Add New Record
            </Button>
          </Space>
        }
      />

      {/* Control / Filter Bar */}
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          marginBottom: 16,
        }}
        styles={{ body: { padding: '14px 20px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Input
              prefix={<Search size={15} color="#A5A1BE" />}
              placeholder={`Search ${autoTitle}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 280,
                borderRadius: 24,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            />
            <Button
              icon={<Filter size={14} />}
              style={{
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              Advanced Filters
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#7E7A9B' }}>Showing {filteredData.length} live records</span>
            <Tag color="purple" style={{ borderRadius: 10, fontWeight: 700 }}>VERIFIED TENANT ISOLATION</Tag>
          </div>
        </div>
      </Card>

      {/* Main Data Table */}
      <Table
        dataSource={filteredData}
        columns={allColumns}
        pagination={{ pageSize: 8, showSizeChanger: true }}
        bordered={false}
        size="middle"
      />

      {/* Add New Record Modal */}
      <Modal
        title={`Create New ${autoTitle} Record`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          message.success(`New entry created in ${autoTitle}!`);
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Submit & Save"
        okButtonProps={{ style: { backgroundColor: '#6E56CF', borderRadius: 10 } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Record Code / Reference #" required>
            <Input placeholder="Auto-generated e.g. REC-2026-X" />
          </Form.Item>
          <Form.Item label="Primary Name / Subject" required>
            <Input placeholder={`Enter description for this ${autoTitle}`} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Operational Status" required>
                <Select defaultValue="Active">
                  <Select.Option value="Active">Active / Approved</Select.Option>
                  <Select.Option value="Pending">Pending Review</Select.Option>
                  <Select.Option value="Processing">In Processing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Effective Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Details Modal with Accept and Reject Options */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#181433' }}>
              {autoTitle} – Record Details
            </span>
            {selectedRecord && selectedRecord.code && (
              <span style={{ color: '#6E56CF', fontWeight: 600, fontSize: 13 }}>
                ({selectedRecord.code})
              </span>
            )}
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={680}
        footer={
          selectedRecord ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
              <Space>
                <Button
                  danger
                  icon={<XCircle size={15} />}
                  onClick={() => handleRejectRecord(selectedRecord)}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  Reject
                </Button>
                <Button
                  type="primary"
                  icon={<CheckCircle size={15} />}
                  onClick={() => handleAcceptRecord(selectedRecord)}
                  style={{
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Accept
                </Button>
              </Space>
            </div>
          ) : null
        }
      >
        {selectedRecord && (
          <div style={{ paddingTop: 8 }}>
            <Descriptions bordered column={2} size="middle">
              {Object.entries(selectedRecord)
                .filter(([k]) => k !== 'key')
                .map(([key, val]: [string, any]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                  return (
                    <Descriptions.Item
                      key={key}
                      label={label}
                      span={key === 'name' || key === 'description' || key === 'issueDescription' || key === 'serviceName' ? 2 : 1}
                    >
                      {key === 'status' ? (
                        <Tag
                          color={
                            String(val).includes('Active') || String(val).includes('Approved') || String(val).includes('Completed')
                              ? 'green'
                              : String(val).includes('Pending') || String(val).includes('Processing')
                              ? 'orange'
                              : String(val).includes('Rejected')
                              ? 'red'
                              : 'blue'
                          }
                          style={{ borderRadius: 8, fontWeight: 600 }}
                        >
                          {String(val)}
                        </Tag>
                      ) : key === 'amount' || key === 'baseAmount' || key === 'finalAmount' ? (
                        <span style={{ fontWeight: 700, color: '#181433', fontSize: 14 }}>{String(val)}</span>
                      ) : key === 'code' ? (
                        <span style={{ fontWeight: 700, color: '#6E56CF' }}>{String(val)}</span>
                      ) : (
                        <span>{String(val)}</span>
                      )}
                    </Descriptions.Item>
                  );
                })}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};
