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
    <header
      style={{
        height: 64,
        padding: '0 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.75)',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        flexWrap: 'nowrap',
        width: '100%',
        boxSizing: 'border-box',
        gap: 16,
      }}
    >
      {/* 1. Left Greeting Area with Elegant Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button
          onClick={onToggleCollapse}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            color: '#475569',
            fontSize: 15,
            flexShrink: 0,
            outline: 'none',
            padding: 0,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EEF2FF';
            e.currentTarget.style.borderColor = '#C7D2FE';
            e.currentTarget.style.color = '#4F46E5';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        <div style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Welcome,</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
              }}
            >
              {user?.name ? user.name.replace(/\s*\(.*?\)\s*/g, '').split('@')[0].split(' ')[0] : 'Ramesh'}!
            </span>
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
            popupMatchSelectWidth={340}
            style={{ width: 230 }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: '#94A3B8', fontSize: 14, marginRight: 8 }} />}
              placeholder="Search features, modules... (⌘K)"
              allowClear
              onPressEnter={() => {
                if (searchOptions.length > 0) {
                  navigate(searchOptions[0].value);
                  setSearchText('');
                }
              }}
              style={{
                width: '100%',
                borderRadius: 10,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                height: 38,
                fontSize: 12.5,
                fontWeight: 500,
                paddingLeft: 12,
                color: '#1E293B',
                boxShadow: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#6366F1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </AutoComplete>
        </div>

        {/* Company Switcher Pill */}
        <div
          style={{
            height: 38,
            borderRadius: 10,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4F46E5',
            }}
          >
            <Building2 size={13} />
          </div>
          <Select
            value={selectedCompany?.id}
            onChange={(val) => selectCompany(val)}
            variant="borderless"
            style={{
              minWidth: 120,
              maxWidth: 155,
              fontWeight: 600,
              color: '#1E293B',
              fontSize: 12.5,
            }}
            popupMatchSelectWidth={false}
          >
            {companies.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</span>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* ERP Package Switcher Pill */}
        <Tooltip title="Switch Active Package Subscription">
          <div
            style={{
              height: 38,
              borderRadius: 10,
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#818CF8';
              e.currentTarget.style.backgroundColor = '#E0E7FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#C7D2FE';
              e.currentTarget.style.backgroundColor = '#EEF2FF';
            }}
          >
            <Sparkles size={13} color="#4F46E5" />
            <Select
              value={currentPkg}
              size="middle"
              variant="borderless"
              onChange={(val) => {
                if (selectedCompany) updateCompanyPackage(selectedCompany.id, val as any);
              }}
              style={{
                width: 98,
                fontWeight: 700,
                color: '#4338CA',
                fontSize: 12,
                letterSpacing: '0.02em',
              }}
              popupMatchSelectWidth={false}
            >
              <Select.Option value="COMPLETE">COMPLETE</Select.Option>
              <Select.Option value="SALES">SALES</Select.Option>
              <Select.Option value="SERVICE">SERVICE</Select.Option>
            </Select>
          </div>
        </Tooltip>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: '#E2E8F0', margin: '0 2px' }} />

        {/* Theme Button */}
        <button
          type="button"
          title="Toggle Ambient Theme"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = '#F59E0B';
            e.currentTarget.style.borderColor = '#FCD34D';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sun size={16} />
        </button>

        {/* Notifications Button */}
        <Dropdown
          dropdownRender={() => notificationMenuContent}
          trigger={['click']}
          placement="bottomRight"
        >
          <div style={{ display: 'inline-block' }}>
            <Badge
              count={unreadCount}
              offset={[-2, 4]}
              styles={{
                indicator: {
                  backgroundColor: '#EF4444',
                  fontWeight: 700,
                  fontSize: 10,
                  boxShadow: '0 0 0 2px #FFFFFF',
                },
              }}
            >
              <button
                type="button"
                title="System Notifications"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: 0,
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <BellOutlined style={{ fontSize: 16 }} />
              </button>
            </Badge>
          </div>
        </Dropdown>

        {/* User Profile Avatar */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <div
            title={`${user?.name || 'Ramesh'} (Profile & Settings)`}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Avatar
              size={36}
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                color: '#FFFFFF',
              }}
            >
              {user?.name?.charAt(0) || 'J'}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
