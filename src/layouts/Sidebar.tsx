import React from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  ShoppingCart,
  FileCheck,
  Users,
  Undo2,
  Boxes,
  Layers,
  Truck,
  SlidersHorizontal,
  ShieldAlert,
  Building2,
  Package,
  Award,
  Receipt,
  TrendingUp,
  ShoppingBag,
  FileText,
  Target,
  UserCheck,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  Briefcase,
  MapPin,
  MessageSquare,
  History,
  LogOut,
  Sparkles,
  Bell,
  Headphones,
  LifeBuoy,
  FileBox,
  FolderLock,
  Landmark,
  Scale,
  Percent,
  QrCode,
  Archive,
  BarChart3,
  HelpCircle,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { getFilteredNavigation, NavSectionConfig, NavItemConfig } from '../config/navigation';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
import { useAuth } from '../context/AuthContext';
import type { ErpPackageId } from '../config/erpPackageConfig';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  packageType: ErpPackageId;
  companyName: string;
  companyCode: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const renderIcon = (name?: string) => {
  const props = { size: 16, style: { marginRight: 8 } };
  switch (name) {
    case 'LayoutDashboard': return <LayoutDashboard {...props} />;
    case 'Calendar': return <Calendar {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'ShoppingCart': return <ShoppingCart {...props} />;
    case 'FileCheck': return <FileCheck {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Undo2': return <Undo2 {...props} />;
    case 'Boxes': return <Boxes {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Truck': return <Truck {...props} />;
    case 'SlidersHorizontal': return <SlidersHorizontal {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'Building2': return <Building2 {...props} />;
    case 'Package': return <Package {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Receipt': return <Receipt {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'Target': return <Target {...props} />;
    case 'UserCheck': return <UserCheck {...props} />;
    case 'CreditCard': return <CreditCard {...props} />;
    case 'CheckCircle': return <CheckCircle {...props} />;
    case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'MapPin': return <MapPin {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    case 'History': return <History {...props} />;
    case 'Headphones': return <Headphones {...props} />;
    case 'FolderLock': return <FolderLock {...props} />;
    case 'Landmark': return <Landmark {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'Percent': return <Percent {...props} />;
    case 'QrCode': return <QrCode {...props} />;
    case 'Archive': return <Archive {...props} />;
    case 'BarChart3': return <BarChart3 {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Bell': return <Bell {...props} />;
    default: return <Package {...props} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  packageType,
  companyName,
  companyCode,
  mobileOpen = false,
  onMobileClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationSections = getFilteredNavigation(user?.role);
  const pkgMeta = ERP_PACKAGES[packageType] || ERP_PACKAGES.COMPLETE;

  // Map navigation items to Ant Design Menu items using unique key (item.key) to prevent React key collisions
  const keyToRouteMap = React.useMemo(() => {
    const map = new Map<string, string>();
    const register = (item: NavItemConfig) => {
      if (item.route) {
        map.set(item.key, item.route);
      }
      if (item.children) {
        item.children.forEach(register);
      }
    };
    navigationSections.forEach((section) => {
      if (section.route) {
        map.set(section.key, section.route);
      }
      if (section.children) {
        section.children.forEach(register);
      }
    });
    return map;
  }, [navigationSections]);

  const buildAntMenuItem = (item: NavItemConfig): any => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon ? React.createElement(item.icon, { size: 15, style: { marginRight: 8 } }) : undefined,
        label: item.label,
        children: item.children.map(buildAntMenuItem),
      };
    }
    return {
      key: item.key,
      icon: item.icon ? React.createElement(item.icon, { size: 15, style: { marginRight: 8 } }) : undefined,
      label: item.label,
    };
  };

  const antMenuItems = navigationSections.map((section) => {
    if (section.route || !section.children || section.children.length === 0) {
      return {
        key: section.key,
        icon: React.createElement(section.icon, { size: 16, style: { marginRight: 8 } }),
        label: section.label,
      };
    }
    return {
      key: section.key,
      icon: React.createElement(section.icon, { size: 16, style: { marginRight: 8 } }),
      label: section.label,
      children: section.children.map(buildAntMenuItem),
    };
  });

  // Find active selected key based on location.pathname
  const selectedMenuKey = React.useMemo(() => {
    for (const section of navigationSections) {
      if (section.route === location.pathname) {
        return section.key;
      }
      if (section.children) {
        for (const child of section.children) {
          if (child.route === location.pathname) {
            return child.key;
          }
          if (child.children) {
            for (const sub of child.children) {
              if (sub.route === location.pathname) {
                return sub.key;
              }
            }
          }
        }
      }
    }
    return '';
  }, [location.pathname, navigationSections]);

  // Find active open group key based on location.pathname
  const findActiveGroupKey = (): string => {
    for (const section of navigationSections) {
      if (section.route === location.pathname) {
        return section.key;
      }
      if (section.children) {
        for (const child of section.children) {
          if (child.route === location.pathname) {
            return section.key;
          }
        }
      }
    }
    return navigationSections[0]?.key || 'dashboard';
  };

  const [openKeys, setOpenKeys] = React.useState<string[]>([findActiveGroupKey()]);

  React.useEffect(() => {
    const activeKey = findActiveGroupKey();
    if (activeKey && !openKeys.includes(activeKey)) {
      setOpenKeys((prev) => [...prev, activeKey]);
    }
  }, [location.pathname]);

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const targetRoute = keyToRouteMap.get(key) || (key.startsWith('/') ? key : undefined);
    if (targetRoute) {
      navigate(targetRoute);
      if (mobileOpen && onMobileClose) {
        onMobileClose();
      }
    }
  };

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Atmosphere Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: 'radial-gradient(ellipse at bottom, rgba(117, 68, 214, 0.3) 0%, rgba(84, 33, 168, 0.15) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '22px 8px' : '22px 20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.12)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(84, 33, 168, 0.4)',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Sparkles size={18} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '-0.2px',
              }}
            >
              {companyName || 'Enterprise ERP'}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#A78BFA',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 2,
              }}
            >
              <span>{companyCode || 'GST COMPLIANT'}</span>
              <span style={{ color: '#4B3F72' }}>•</span>
              <span style={{ color: '#34D399' }}>{pkgMeta.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 8px',
          zIndex: 2,
        }}
        className="custom-scrollbar"
      >
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedMenuKey ? [selectedMenuKey] : [location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick}
          items={antMenuItems}
          inlineCollapsed={collapsed}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </div>

      {/* Footer Profile / Logout */}
      <div
        style={{
          padding: collapsed ? '12px 8px' : '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          zIndex: 2,
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#7544D6',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || 'Super Administrator'}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'capitalize' }}>
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={logout}
            title="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        className="erp-dark-sidebar desktop-sider"
        style={{
          backgroundColor: '#211044',
          background: 'linear-gradient(180deg, #211044 0%, #2A1454 45%, #1D0E3D 80%, #301761 100%)',
          height: '100vh',
          maxHeight: '100vh',
          zIndex: 100,
          position: 'sticky',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '4px 0 24px rgba(33, 16, 68, 0.45)',
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={onMobileClose}
        open={mobileOpen}
        styles={{
          body: { padding: 0, backgroundColor: '#211044', height: '100%' },
        }}
        width={260}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
