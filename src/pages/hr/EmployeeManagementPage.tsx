import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Modal, Form, Input, Select, Drawer, Tabs, Row, Col, Statistic, Tooltip, message } from 'antd';
import { Plus, Search, Filter, Download, UserPlus, Users, Briefcase, Boxes, MapPin, Eye, Edit, Trash2, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components';

const { Text } = Typography;

interface EmployeeItem {
  key: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  branch: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  joiningDate: string;
  salary: string;
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  { key: '1', id: 'EMP-001', name: 'Janani Ramesh', email: 'janani@abctraders.com', phone: '+91 98401 23456', department: 'Executive Management', designation: 'General Manager', branch: 'Chennai HQ', status: 'Active', joiningDate: '2023-01-10', salary: '₹1,20,000' },
  { key: '2', id: 'EMP-002', name: 'Vikram Seth', email: 'vikram@abctraders.com', phone: '+91 98401 88990', department: 'Enterprise Sales', designation: 'Senior Account Executive', branch: 'Chennai HQ', status: 'Active', joiningDate: '2023-04-15', salary: '₹85,000' },
  { key: '3', id: 'EMP-003', name: 'Murugan K.', email: 'murugan@abctraders.com', phone: '+91 98402 11223', department: 'Field Services', designation: 'Lead Field Engineer', branch: 'Coimbatore Hub', status: 'Active', joiningDate: '2022-08-10', salary: '₹75,000' },
  { key: '4', id: 'EMP-004', name: 'Ananya Sharma', email: 'ananya@abctraders.com', phone: '+91 98403 44556', department: 'Human Resources', designation: 'HR Specialist', branch: 'Chennai HQ', status: 'Active', joiningDate: '2023-11-01', salary: '₹60,000' },
  { key: '5', id: 'EMP-005', name: 'Dinesh V.', email: 'dinesh@abctraders.com', phone: '+91 98404 77889', department: 'Technical Dispatch', designation: 'Hydraulics Specialist', branch: 'Madurai Depot', status: 'On Leave', joiningDate: '2024-01-20', salary: '₹55,000' },
  { key: '6', id: 'EMP-006', name: 'Karthik Raja', email: 'karthik@abctraders.com', phone: '+91 98405 99001', department: 'Accounts & Finance', designation: 'Senior Accountant', branch: 'Chennai HQ', status: 'Inactive', joiningDate: '2022-03-01', salary: '₹70,000' },
];

export const EmployeeManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [drawerEmployee, setDrawerEmployee] = useState<EmployeeItem | null>(null);
  const [form] = Form.useForm();

  // Filtered employees
  const filtered = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' ? true :
      activeTab === 'active' ? emp.status === 'Active' :
      activeTab === 'inactive' ? emp.status === 'Inactive' :
      activeTab === 'onleave' ? emp.status === 'On Leave' : true;

    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesBranch = selectedBranch === 'all' || emp.branch === selectedBranch;

    return matchesSearch && matchesTab && matchesDept && matchesBranch;
  });

  const handleAddEmployee = (values: any) => {
    const newEmp: EmployeeItem = {
      key: String(Date.now()),
      id: `EMP-00${employees.length + 1}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      department: values.department,
      designation: values.designation,
      branch: values.branch,
      status: values.status || 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: values.salary ? `₹${Number(values.salary).toLocaleString()}` : '₹50,000',
    };
    setEmployees([newEmp, ...employees]);
    message.success(`Employee ${values.name} enrolled successfully!`);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text strong style={{ color: '#6E56CF' }}>{text}</Text>,
    },
    {
      title: 'Employee Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, r: EmployeeItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#6E56CF18', color: '#6E56CF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
            {name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#19153B' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#8C89A0' }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (d: string) => <Tag color="blue">{d}</Tag>,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (des: string) => <Text>{des}</Text>,
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (b: string) => <Space orientation="horizontal" size={4}><MapPin size={13} color="#8C89A0" /><span>{b}</span></Space>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const color = st === 'Active' ? 'success' : st === 'On Leave' ? 'warning' : 'default';
        return <Tag color={color}>{st}</Tag>;
      },
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: EmployeeItem) => (
        <Space orientation="horizontal">
          <Tooltip title="View Profile Drawer">
            <Button size="small" type="text" icon={<Eye size={14} color="#6E56CF" />} onClick={() => setDrawerEmployee(record)} />
          </Tooltip>
          <Tooltip title="Edit Employee">
            <Button size="small" type="text" icon={<Edit size={14} color="#1890ff" />} onClick={() => message.info(`Edit profile for ${record.name}`)} />
          </Tooltip>
          <Tooltip title="Deactivate">
            <Button size="small" type="text" danger icon={<Trash2 size={14} />} onClick={() => {
              setEmployees(employees.map(e => e.id === record.id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
              message.success(`Status updated for ${record.name}`);
            }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 0' }}>
      <PageHeader
        title="Employee Management"
        subtitle="Comprehensive employee profiles, organizational hierarchy, branch assignments, and records."
        extra={
          <Space>
            <Button icon={<Download size={15} />} onClick={() => message.success('Employee roster exported as Excel')}>
              Export
            </Button>
            <Button type="primary" icon={<UserPlus size={15} />} style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }} onClick={() => setIsAddModalOpen(true)}>
              Add Employee
            </Button>
          </Space>
        }
      />

      {/* KPI Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <Statistic title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Total Workforce</span>} value={employees.length} prefix={<Users size={16} color="#6E56CF" style={{ marginRight: 6 }} />} valueStyle={{ fontWeight: 700, color: '#19153B' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <Statistic title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Active Personnel</span>} value={employees.filter(e => e.status === 'Active').length} prefix={<CheckCircle size={16} color="#10B981" style={{ marginRight: 6 }} />} valueStyle={{ fontWeight: 700, color: '#10B981' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <Statistic title={<span style={{ fontSize: 13, color: '#8C89A0' }}>On Leave</span>} value={employees.filter(e => e.status === 'On Leave').length} valueStyle={{ fontWeight: 700, color: '#F59E0B' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <Statistic title={<span style={{ fontSize: 13, color: '#8C89A0' }}>Departments</span>} value={4} prefix={<Boxes size={16} color="#3B82F6" style={{ marginRight: 6 }} />} valueStyle={{ fontWeight: 700, color: '#19153B' }} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
        {/* Horizontal Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Employees (${employees.length})` },
            { key: 'active', label: `Active (${employees.filter(e => e.status === 'Active').length})` },
            { key: 'onleave', label: `On Leave (${employees.filter(e => e.status === 'On Leave').length})` },
            { key: 'inactive', label: `Inactive (${employees.filter(e => e.status === 'Inactive').length})` },
            { key: 'departments', label: 'Departments & Hierarchy' },
            { key: 'designations', label: 'Designations' },
          ]}
        />

        {activeTab !== 'departments' && activeTab !== 'designations' ? (
          <>
            {/* Filter Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '16px 0 20px 0', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space wrap size={12}>
                <Input
                  prefix={<Search size={15} color="#8C89A0" />}
                  placeholder="Search by ID, name, email, designation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 280, borderRadius: 8 }}
                />
                <Select
                  value={selectedDept}
                  onChange={setSelectedDept}
                  style={{ width: 180 }}
                  options={[
                    { value: 'all', label: 'All Departments' },
                    { value: 'Executive Management', label: 'Executive Management' },
                    { value: 'Enterprise Sales', label: 'Enterprise Sales' },
                    { value: 'Field Services', label: 'Field Services' },
                    { value: 'Human Resources', label: 'Human Resources' },
                    { value: 'Technical Dispatch', label: 'Technical Dispatch' },
                    { value: 'Accounts & Finance', label: 'Accounts & Finance' },
                  ]}
                />
                <Select
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  style={{ width: 160 }}
                  options={[
                    { value: 'all', label: 'All Branches' },
                    { value: 'Chennai HQ', label: 'Chennai HQ' },
                    { value: 'Coimbatore Hub', label: 'Coimbatore Hub' },
                    { value: 'Madurai Depot', label: 'Madurai Depot' },
                  ]}
                />
              </Space>
              <Text type="secondary" style={{ fontSize: 13 }}>Showing {filtered.length} of {employees.length} personnel</Text>
            </div>

            <Table dataSource={filtered} columns={columns} pagination={{ pageSize: 8 }} />
          </>
        ) : activeTab === 'departments' ? (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={[16, 16]}>
              {[
                { name: 'Executive Management', head: 'Janani Ramesh', staffCount: 4, budget: '₹18.5L / mo' },
                { name: 'Enterprise Sales', head: 'Vikram Seth', staffCount: 12, budget: '₹14.2L / mo' },
                { name: 'Field Services & Engineering', head: 'Murugan K.', staffCount: 16, budget: '₹16.8L / mo' },
                { name: 'Human Resources & Admin', head: 'Ananya Sharma', staffCount: 5, budget: '₹5.5L / mo' },
              ].map((dept, i) => (
                <Col xs={24} sm={12} md={6} key={i}>
                  <Card style={{ borderRadius: 12, border: '1px solid #ECE8F6' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#19153B', marginBottom: 8 }}>{dept.name}</div>
                    <div style={{ fontSize: 12, color: '#8C89A0', marginBottom: 4 }}>Department Head: <strong style={{ color: '#6E56CF' }}>{dept.head}</strong></div>
                    <div style={{ fontSize: 12, color: '#8C89A0', marginBottom: 4 }}>Active Staff: <strong>{dept.staffCount} Members</strong></div>
                    <div style={{ fontSize: 12, color: '#8C89A0' }}>Monthly Payroll: <strong>{dept.budget}</strong></div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div style={{ padding: '16px 0' }}>
            <Table
              dataSource={[
                { key: '1', title: 'General Manager', level: 'Grade L1', minSalary: '₹1,00,000', maxSalary: '₹1,50,000', count: 1 },
                { key: '2', title: 'Senior Account Executive', level: 'Grade L3', minSalary: '₹75,000', maxSalary: '₹1,00,000', count: 4 },
                { key: '3', title: 'Lead Field Engineer', level: 'Grade L3', minSalary: '₹65,000', maxSalary: '₹90,000', count: 6 },
                { key: '4', title: 'Field Technician', level: 'Grade L5', minSalary: '₹35,000', maxSalary: '₹50,000', count: 10 },
              ]}
              columns={[
                { title: 'Designation Title', dataIndex: 'title', key: 'title', render: (t: string) => <strong>{t}</strong> },
                { title: 'Pay Grade Level', dataIndex: 'level', key: 'level' },
                { title: 'Salary Band', render: (_: any, r: any) => `${r.minSalary} - ${r.maxSalary}` },
                { title: 'Allocated Employees', dataIndex: 'count', key: 'count', render: (c: number) => <Tag color="purple">{c} Active</Tag> },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Card>

      {/* Add Employee Modal */}
      <Modal
        title="Add New Employee"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter employee name' }]}>
                <Input placeholder="e.g. Ramesh Sundaram" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Official Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="employee@abctraders.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mobile Number" name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98400 00000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Branch Allocation" name="branch" initialValue="Chennai HQ" rules={[{ required: true }]}>
                <Select options={[{ value: 'Chennai HQ', label: 'Chennai HQ' }, { value: 'Coimbatore Hub', label: 'Coimbatore Hub' }, { value: 'Madurai Depot', label: 'Madurai Depot' }]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Department" name="department" initialValue="Enterprise Sales" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Enterprise Sales', label: 'Enterprise Sales' },
                  { value: 'Field Services', label: 'Field Services' },
                  { value: 'Executive Management', label: 'Executive Management' },
                  { value: 'Accounts & Finance', label: 'Accounts & Finance' },
                  { value: 'Human Resources', label: 'Human Resources' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Designation" name="designation" rules={[{ required: true }]}>
                <Input placeholder="e.g. Senior Specialist" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Basic Monthly Gross (INR)" name="salary" initialValue="65000">
                <Input type="number" placeholder="65000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status" initialValue="Active">
                <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6E56CF', borderColor: '#6E56CF' }}>
              Enroll Employee
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Profile Details Drawer */}
      <Drawer
        title={<span style={{ fontWeight: 700, color: '#19153B' }}>Employee Profile & Records</span>}
        open={!!drawerEmployee}
        onClose={() => setDrawerEmployee(null)}
        width={560}
      >
        {drawerEmployee && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0', borderBottom: '1px solid #F0EEF8' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#6E56CF', color: '#fff', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                {drawerEmployee.name.charAt(0)}
              </div>
              <h3 style={{ margin: 0, color: '#19153B' }}>{drawerEmployee.name}</h3>
              <Text type="secondary">{drawerEmployee.designation} • {drawerEmployee.department}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={drawerEmployee.status === 'Active' ? 'green' : 'orange'}>{drawerEmployee.status}</Tag>
                <Tag color="purple">{drawerEmployee.id}</Tag>
              </div>
            </div>

            <Tabs
              defaultActiveKey="personal"
              items={[
                {
                  key: 'personal',
                  label: 'Personal Details',
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div><Text type="secondary">Official Email:</Text> <div><Text strong>{drawerEmployee.email}</Text></div></div>
                      <div><Text type="secondary">Phone Number:</Text> <div><Text strong>{drawerEmployee.phone}</Text></div></div>
                      <div><Text type="secondary">Assigned Branch:</Text> <div><Text strong>{drawerEmployee.branch}</Text></div></div>
                      <div><Text type="secondary">Joining Date:</Text> <div><Text strong>{drawerEmployee.joiningDate}</Text></div></div>
                      <div><Text type="secondary">Salary Band:</Text> <div><Text strong>{drawerEmployee.salary} / month</Text></div></div>
                    </div>
                  ),
                },
                {
                  key: 'docs',
                  label: 'Documents',
                  children: (
                    <div>
                      {['Aadhaar Card Verification', 'PAN Card ID', 'Offer Letter & Employment Contract', 'Academic Certificates'].map((doc, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EEF8' }}>
                          <span>{doc}</span>
                          <Tag color="success">Verified</Tag>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'activity',
                  label: 'Recent Activity',
                  children: (
                    <div style={{ fontSize: 13, color: '#555' }}>
                      <p>• Logged in from Chennai HQ Terminal today at 09:12 AM</p>
                      <p>• Completed Work Order #WO-2026-904 yesterday</p>
                      <p>• Salary credited for October 2026</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};
