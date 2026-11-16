import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Badge,
  Typography,
  Space,
  Button,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  CreditCard,
  Users,
  ShieldAlert,
  FileSpreadsheet,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const SuperAdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const superAdminMenuItems = [
    {
      key: '/superadmin',
      icon: <LayoutDashboard size={18} />,
      label: 'HQ Dashboard',
    },
    {
      key: '/superadmin/companies',
      icon: <Building2 size={18} />,
      label: 'Tenant Companies',
    },
    {
      key: '/superadmin/packages',
      icon: <Layers size={18} />,
      label: 'ERP Package Matrix',
    },
    {
      key: '/superadmin/subscriptions',
      icon: <CreditCard size={18} />,
      label: 'Subscriptions & Billing',
    },
    {
      key: '/superadmin/users',
      icon: <Users size={18} />,
      label: 'System Administrators',
    },
    {
      key: '/superadmin/roles',
      icon: <ShieldCheck size={18} />,
      label: 'Roles & Privileges',
    },
    {
      key: '/superadmin/reports',
      icon: <FileSpreadsheet size={18} />,
      label: 'Global Analytics & Reports',
    },
    {
      key: '/superadmin/audit-logs',
      icon: <Activity size={18} />,
      label: 'Audit & Access Logs',
    },
    {
      key: '/superadmin/settings',
      icon: <SlidersHorizontal size={18} />,
      label: 'Platform Settings',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F5F1FA' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        theme="light"
        style={{
          borderRight: '1px solid #E8E0F0',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 10,
        }}
      >
        {/* Super Admin Branding */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '20px 20px',
            borderBottom: '1px solid #E8E0F0',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: '#1E152A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            HQ
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E152A' }}>
                SUPER ADMIN
              </div>
              <div style={{ fontSize: 11, color: '#7546B8', fontWeight: 600 }}>
                Universal Multi-Tenant Core
              </div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={superAdminMenuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            borderRight: 'none',
            padding: '12px 6px',
            backgroundColor: '#FFFFFF',
          }}
        />

        {/* Back to Tenant workspace button */}
        {!collapsed && (
          <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
            <Button
              type="dashed"
              block
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              style={{
                borderColor: '#7546B8',
                color: '#51258C',
                fontWeight: 600,
              }}
            >
              Switch to Tenant Portal
            </Button>
          </div>
        )}
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E8E0F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}
        >
          <Space size="large">
            <span
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                cursor: 'pointer',
                color: '#51258C',
                padding: '6px',
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GlobalOutlined style={{ color: '#51258C' }} />
              <span style={{ fontWeight: 700, color: '#1E152A', fontSize: 14 }}>
                Platform Multi-Tenant HQ Orchestration
              </span>
            </div>
          </Space>

          <Space size="middle">
            <Button
              type="primary"
              ghost
              style={{ borderColor: '#51258C', color: '#51258C' }}
              onClick={() => navigate('/dashboard')}
            >
              Enter Tenant View
            </Button>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    danger: true,
                    label: 'Sign Out HQ',
                    onClick: () => {
                      logout();
                      navigate('/login');
                    },
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar style={{ backgroundColor: '#1E152A', cursor: 'pointer', fontWeight: 700 }}>
                SA
              </Avatar>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '20px 24px', minHeight: 'calc(100vh - 104px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
