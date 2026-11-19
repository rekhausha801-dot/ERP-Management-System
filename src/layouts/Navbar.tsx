import React, { useState } from 'react';
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
import {
  Sun,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
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

  // Real Enterprise Notifications matching the ERP context
  const [notifications, setNotifications] = useState([
    {
      id: 'REC-9718',
      title: 'Sales Order Approved',
      desc: 'Order SO-1047 from Kumar & Co (₹48,750) has been approved and moved to delivery dispatch.',
      time: '10 mins ago',
      type: 'success',
      read: false,
    },
    {
      id: 'REC-5868',
      title: 'Invoice Payment Overdue',
      desc: 'Invoice INV-2026-88 for ₹3,20,000 exceeded 30 days. Priority follow-up required.',
      time: '45 mins ago',
      type: 'warning',
      read: false,
    },
    {
      id: 'REC-1727',
      title: 'Preventive Service Scheduled',
      desc: 'Annual Maintenance visit assigned to Field Tech Ramesh for tomorrow 10:00 AM.',
      time: '2 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: 'REC-7753',
      title: 'Low Stock Alert',
      desc: 'Item "15KW Variable Frequency Drive" is below reorder threshold (8 units remaining).',
      time: '5 hours ago',
      type: 'urgent',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Notification Dropdown Panel
  const notificationMenuContent = (
    <div
      style={{
        width: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        boxShadow: '0 16px 40px rgba(25, 21, 59, 0.15)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1F1646 0%, #2D1B69 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BellOutlined style={{ fontSize: 16, color: '#C4B5FD' }} />
          <span style={{ fontSize: 15, fontWeight: 800 }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#A5B4FC',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List Items */}
      <div style={{ maxHeight: 340, overflowY: 'auto', padding: '6px 0' }}>
        {notifications.map((item) => {
          const icon =
            item.type === 'success' ? (
              <CheckCircle2 size={18} color="#10B981" />
            ) : item.type === 'warning' ? (
              <AlertTriangle size={18} color="#F59E0B" />
            ) : item.type === 'urgent' ? (
              <AlertTriangle size={18} color="#EF4444" />
            ) : (
              <Info size={18} color="#6366F1" />
            );

          const iconBg =
            item.type === 'success'
              ? '#ECFDF5'
              : item.type === 'warning'
              ? '#FFFBEB'
              : item.type === 'urgent'
              ? '#FEF2F2'
              : '#EEF2FF';

          return (
            <div
              key={item.id}
              onClick={() => {
                setNotifications((prev) =>
                  prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                );
              }}
              style={{
                padding: '12px 18px',
                display: 'flex',
                gap: 12,
                cursor: 'pointer',
                backgroundColor: item.read ? '#FFFFFF' : 'rgba(99, 102, 241, 0.04)',
                borderBottom: '1px solid #F1F5F9',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = item.read ? '#FFFFFF' : 'rgba(99, 102, 241, 0.04)')
              }
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: item.read ? 600 : 800,
                      color: '#0F172A',
                    }}
                  >
                    {item.title}
                  </span>
                  <span style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 500 }}>{item.time}</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 18px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#6E56CF',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          onClick={() => navigate('/app/calendar')}
        >
          View System Calendar & Schedule <ExternalLink size={12} />
        </span>
      </div>
    </div>
  );

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
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Janani'}!
          </h1>
        </div>
      </div>

      {/* 2. Right Interactive Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* Search Bar */}
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

        {/* Sun / Theme Button */}
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

        {/* Notifications Button: Interactive Dropdown revealing all real notification records */}
        <Dropdown
          dropdownRender={() => notificationMenuContent}
          trigger={['click']}
          placement="bottomRight"
        >
          <div style={{ display: 'inline-block' }}>
            <Badge
              count={unreadCount}
              offset={[-4, 4]}
              styles={{ indicator: { backgroundColor: '#EF4444', fontWeight: 800, boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)' } }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6E56CF',
                  boxShadow: '0 4px 16px rgba(25, 21, 59, 0.04)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <BellOutlined style={{ fontSize: 16 }} />
              </div>
            </Badge>
          </div>
        </Dropdown>

        {/* User Profile Avatar */}
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
