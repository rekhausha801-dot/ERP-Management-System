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
      if (grp.children) {
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
      } else if (grp.path) {
        list.push({ label: grp.label, path: grp.path, group: grp.label });
      }
    });
    return list;
  }, []);

  const searchOptions = useMemo(() => {
    if (!searchText.trim()) return [];
    const q = searchText.toLowerCase();
    return searchableItems
      .filter((item: { label: string; path: string; group: string }) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q))
      .slice(0, 8)
      .map((item: { label: string; path: string; group: string }) => ({
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
        zIndex: 50,
      }}
    >
      {/* 1. Left Greeting Area with Elegant Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
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

      {/* 2. Right Interactive Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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
            gap: 6,
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
              gap: 6,
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
        >
          <Sun size={16} />
        </button>

        {/* Notifications Button */}
        <Dropdown
          popupRender={() => notificationMenuContent}
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
                border: '2px solid #FFFFFF',
              }}
            >
              {user?.name?.charAt(0) || 'R'}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
