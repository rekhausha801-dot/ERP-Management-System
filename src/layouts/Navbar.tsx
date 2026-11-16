import React from 'react';
import {
  Layout,
  Dropdown,
  Avatar,
  Badge,
  Input,
  Space,
  Select,
  Tooltip,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  SwapOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';

const { Header } = Layout;

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, selectedCompany, companies, selectCompany, updateCompanyPackage, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const pkgMeta = ERP_PACKAGES[currentPkg] || ERP_PACKAGES.COMPLETE;

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: '#242033' }}>{user?.name || 'Administrator'}</div>
          <div style={{ fontSize: 12, color: '#77718A' }}>{user?.email}</div>
          <div style={{ marginTop: 4 }}>
            <span
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: pkgMeta.badgeBg,
                color: pkgMeta.badgeColor,
                fontWeight: 700,
              }}
            >
              {user?.role} &bull; {pkgMeta.name}
            </span>
          </div>
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Company Settings',
      onClick: () => navigate('/app/settings'),
    },
    ...(isSuperAdmin
      ? [
          {
            key: 'superadmin',
            icon: <SafetyCertificateOutlined />,
            label: <span style={{ color: '#51258C', fontWeight: 600 }}>Super Admin HQ</span>,
            onClick: () => navigate('/super-admin/dashboard'),
          },
        ]
      : []),
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Sign Out',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E7E0F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 64,
        height: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 9,
      }}
    >
      {/* Left Area: Toggle & Multi-Tenant Company Selector */}
      <Space size="middle" wrap={false} style={{ alignItems: 'center', flexShrink: 0 }}>
        <span
          onClick={onToggleCollapse}
          style={{
            fontSize: 18,
            cursor: 'pointer',
            color: '#51258C',
            padding: '6px',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>

        {/* Company Quick-Switcher */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Building size={16} color="#51258C" />
          <Select
            value={selectedCompany?.id}
            onChange={(val) => selectCompany(val)}
            style={{ width: 220 }}
            size="middle"
          >
            {companies.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>{' '}
                <span style={{ fontSize: 11, color: '#77718A' }}>({c.packageType})</span>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Live ERP Package Simulation Switcher */}
        <Tooltip title="Test how this company operates under another ERP package">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              gap: 4,
              padding: '0 8px',
              borderRadius: 6,
              backgroundColor: '#F5F1FA',
              border: '1px dashed #7546B8',
              fontSize: 12,
              height: 32,
              flexShrink: 0,
            }}
          >
            <SwapOutlined style={{ color: '#51258C', fontSize: 13, display: 'inline-flex' }} />
            <span style={{ color: '#51258C', fontWeight: 600, fontSize: 12 }}>Package:</span>
            <Select
              value={currentPkg}
              size="small"
              variant="borderless"
              onChange={(val) => {
                if (selectedCompany) {
                  updateCompanyPackage(selectedCompany.id, val as any);
                }
              }}
              style={{
                width: 105,
                fontWeight: 700,
                color: '#51258C',
              }}
              popupMatchSelectWidth={false}
            >
              <Select.Option value="COMPLETE">COMPLETE</Select.Option>
              <Select.Option value="SALES">SALES</Select.Option>
              <Select.Option value="SERVICE">SERVICE</Select.Option>
            </Select>
          </div>
        </Tooltip>
      </Space>

      {/* Right Area: Search, Notifications & Profile */}
      <Space size="middle" wrap={false} style={{ alignItems: 'center', flexShrink: 0 }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#9E98AD' }} />}
          placeholder="Search ERP modules, orders..."
          style={{ width: 200, borderRadius: 20, backgroundColor: '#FAF7FC' }}
        />

        <Tooltip title="Notifications">
          <Badge count={3} offset={[-2, 4]} color="#51258C">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FAF7FC',
                cursor: 'pointer',
                color: '#51258C',
              }}
            >
              <BellOutlined style={{ fontSize: 16 }} />
            </div>
          </Badge>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            <Avatar style={{ backgroundColor: '#51258C', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <div style={{ lineHeight: 1.2, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#242033' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: '#7546B8' }}>
                {selectedCompany?.code}
              </div>
            </div>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};
