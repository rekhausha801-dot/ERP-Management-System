import React, { useState, useMemo } from 'react';
import {
  Dropdown,
  Avatar,
  Badge,
  Input,
  Select,
  Tooltip,
  AutoComplete,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Sun, Building2, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';
import { SIDEBAR_MENU_GROUPS } from '../config/menuConfig';

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, selectedCompany, companies, selectCompany, updateCompanyPackage, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const searchableItems = useMemo(() => {
    const list: { label: string; path: string; group: string }[] = [];
    SIDEBAR_MENU_GROUPS.forEach(grp => {
      grp.children.forEach(c => {
        if (c.path) {
          list.push({ label: c.label, path: c.path, group: grp.label });
        }
        if (c.children) {
          c.children.forEach(sub => {
            if (sub.path) {
              list.push({ label: sub.label, path: sub.path, group: `${grp.label} > ${c.label}` });
            }
          });
        }
      });
    });
    return list;
  }, []);

  const searchOptions = useMemo(() => {
    if (!searchText.trim()) return [];
    const q = searchText.toLowerCase();
    return searchableItems
      .filter(item => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q))
      .slice(0, 8)
      .map(item => ({
        value: item.path,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <span style={{ fontWeight: 600, color: '#181433' }}>{item.label}</span>
            <span style={{ fontSize: 11, color: '#8F8BA8' }}>{item.group}</span>
          </div>
        ),
      }));
  }, [searchText, searchableItems]);

  const currentPkg: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || 'COMPLETE';
  const pkgMeta = ERP_PACKAGES[currentPkg] || ERP_PACKAGES.COMPLETE;

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div style={{ padding: '8px 6px' }}>
          <div style={{ fontWeight: 800, color: '#181433', fontSize: 14 }}>{user?.name || 'Administrator'}</div>
          <div style={{ fontSize: 12, color: '#7E7A9B' }}>{user?.email}</div>
          <div style={{ marginTop: 6 }}>
            <span
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: 20,
                backgroundColor: 'rgba(110, 86, 207, 0.12)',
                color: '#6E56CF',
                fontWeight: 800,
                letterSpacing: '0.04em',
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
          label: <span style={{ color: '#6E56CF', fontWeight: 700 }}>Super Admin HQ</span>,
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
    <div
      style={{
        padding: '16px 28px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F0F9',
        flexWrap: 'nowrap',
        width: '100%',
        boxSizing: 'border-box',
        gap: 16,
      }}
    >
      {/* 1. Left Greeting Area with Elegant Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div
          onClick={onToggleCollapse}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(25, 21, 59, 0.05)',
            color: '#6E56CF',
            fontSize: 16,
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>

        <div style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: '#181433',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            Welcome, {user?.name ? user.name.replace(/\s*\(.*?\)\s*/g, '').split('@')[0].split(' ')[0] : 'Janani'}!
          </h1>
        </div>
      </div>

      {/* 2. Right Interactive Controls: Matching the Reference Image Clean Pill Aesthetic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Search Bar: White Pill with instant global navigation */}
        <div style={{ position: 'relative' }}>
          <AutoComplete
            options={searchOptions}
            value={searchText}
            onChange={(val) => setSearchText(val)}
            onSelect={(path: string) => {
              navigate(path);
              setSearchText('');
            }}
            popupMatchSelectWidth={320}
            style={{ width: 180 }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: '#A5A1BE', fontSize: 14, marginRight: 4 }} />}
              placeholder="Search anything..."
              allowClear
              onPressEnter={() => {
                if (searchOptions.length > 0) {
                  navigate(searchOptions[0].value);
                  setSearchText('');
                }
              }}
              style={{
                width: '100%',
                borderRadius: 30,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(25, 21, 59, 0.04)',
                height: 40,
                border: 'none',
                fontSize: 12,
                fontWeight: 500,
                paddingLeft: 14,
              }}
            />
          </AutoComplete>
        </div>

        {/* Company Switcher Pill */}
        <div
          style={{
            height: 40,
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(25, 21, 59, 0.04)',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          }}
        >
          <Building2 size={14} color="#6E56CF" />
          <Select
            value={selectedCompany?.id}
            onChange={(val) => selectCompany(val)}
            variant="borderless"
            style={{
              minWidth: 120,
              maxWidth: 150,
              fontWeight: 700,
              color: '#181433',
              fontSize: 12,
            }}
            popupMatchSelectWidth={false}
          >
            {companies.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                <span style={{ fontWeight: 700 }}>{c.name}</span>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* ERP Package Switcher Pill */}
        <Tooltip title="Switch Active Package Subscription">
          <div
            style={{
              height: 40,
              borderRadius: 30,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(25, 21, 59, 0.04)',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Sparkles size={14} color="#6E56CF" />
            <Select
              value={currentPkg}
              size="middle"
              variant="borderless"
              onChange={(val) => {
                if (selectedCompany) updateCompanyPackage(selectedCompany.id, val as any);
              }}
              style={{
                width: 90,
                fontWeight: 800,
                color: '#6E56CF',
                fontSize: 12,
              }}
              popupMatchSelectWidth={false}
            >
              <Select.Option value="COMPLETE">COMPLETE</Select.Option>
              <Select.Option value="SALES">SALES</Select.Option>
              <Select.Option value="SERVICE">SERVICE</Select.Option>
            </Select>
          </div>
        </Tooltip>

        {/* Sun / Theme Button: Glowing Soft Purple Circle */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #7C66DC 0%, #583EC7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(110, 86, 207, 0.35)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sun size={16} />
        </div>

        {/* User Profile Avatar with Soft Violet Ring Shadow */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: 22,
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Avatar
              size={40}
              style={{
                background: 'linear-gradient(135deg, #7C66DC 0%, #583EC7 100%)',
                fontWeight: 800,
                fontSize: 15,
                boxShadow: '0 6px 18px rgba(110, 86, 207, 0.35)',
                color: '#FFFFFF',
              }}
            >
              {user?.name?.charAt(0) || 'J'}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
