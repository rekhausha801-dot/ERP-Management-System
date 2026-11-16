import React from 'react';
import {
  Layout,
  Menu,
  Select,
  Input,
  Badge,
  Dropdown,
  Avatar,
  Space,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Building2,
  Users,
  HardHat,
  CalendarCheck,
  FolderGit2,
  ListTodo,
  WalletCards,
  Boxes,
  ShoppingCart,
  Receipt,
  FileBarChart,
  Settings,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, selectedCompany, selectCompany, companies } = useAuth();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
    },
    {
      key: '/companies',
      icon: <Building2 size={18} />,
      label: 'Companies',
    },
    {
      key: '/employees',
      icon: <Users size={18} />,
      label: 'Employees',
    },
    {
      key: '/workers',
      icon: <HardHat size={18} />,
      label: 'Workers',
    },
    {
      key: '/attendance',
      icon: <CalendarCheck size={18} />,
      label: 'Attendance',
    },
    {
      key: '/projects',
      icon: <FolderGit2 size={18} />,
      label: 'Projects',
    },
    {
      key: '/works',
      icon: <ListTodo size={18} />,
      label: 'Works',
    },
    {
      key: '/payroll',
      icon: <WalletCards size={18} />,
      label: 'Payroll',
    },
    {
      key: '/inventory',
      icon: <Boxes size={18} />,
      label: 'Inventory',
    },
    {
      key: '/purchases',
      icon: <ShoppingCart size={18} />,
      label: 'Purchases',
    },
    {
      key: '/billing',
      icon: <Receipt size={18} />,
      label: 'Billing',
    },
    {
      key: '/reports',
      icon: <FileBarChart size={18} />,
      label: 'Reports',
    },
    {
      key: '/settings',
      icon: <Settings size={18} />,
      label: 'Settings',
    },
  ];

  const profileMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div>
          <Text strong>{user?.name || 'Administrator'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email}
          </Text>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'System Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogOut size={16} color="#ff4d4f" />,
      label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <Sider
        width={250}
        theme="dark"
        style={{
          backgroundColor: '#0d233a',
          flex: '0 0 250px',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            E
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
              NEXUS ERP
            </div>
            <div style={{ color: '#d4af37', fontSize: 11, fontWeight: 500, letterSpacing: 0.5 }}>
              ENTERPRISE SUITE
            </div>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            backgroundColor: '#0d233a',
            paddingTop: 8,
            borderRight: 'none',
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ minWidth: 0, flex: 1, backgroundColor: '#f4f6f9' }}>
        {/* Top Header */}
        <Header
          style={{
            backgroundColor: '#ffffff',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            width: '100%',
          }}
        >
          {/* Company Selector */}
          <Space size="middle">
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Entity:</span>
            <Select
              value={selectedCompany?.id}
              onChange={selectCompany}
              style={{ width: 280 }}
              options={companies.map((c) => ({
                value: c.id,
                label: (
                  <Space>
                    <Building2 size={15} color="#1890ff" />
                    <span>{c.name}</span>
                  </Space>
                ),
              }))}
            />
          </Space>

          {/* Search bar & Profile */}
          <Space size="large">
            <Input
              placeholder="Search across ERP..."
              prefix={<Search size={16} style={{ color: '#94a3b8' }} />}
              style={{ width: 260, borderRadius: 6 }}
            />

            <Badge count={3} offset={[-2, 5]} size="small">
              <div
                style={{
                  cursor: 'pointer',
                  padding: 8,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Bell size={18} color="#475569" />
              </div>
            </Badge>

            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: '#0d233a', verticalAlign: 'middle' }}
                  icon={<UserIcon size={16} />}
                />
                <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
                  <Text strong style={{ fontSize: 13, display: 'block' }}>
                    {user?.name || 'Administrator'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {user?.role?.toUpperCase() || 'SUPERADMIN'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Dynamic Page Content */}
        <Content
          style={{
            padding: '24px',
            backgroundColor: '#f4f6f9',
            width: '100%',
            flex: '1 0 auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
