import React from 'react';
import { Layout, Menu } from 'antd';
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
  FileBox,
  ClipboardList,
  PhoneCall,
} from 'lucide-react';
import { getMenuGroupsForPackage } from '../config/menuConfig';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
import { useAuth } from '../context/AuthContext';
import type { ErpPackageId } from '../config/erpPackageConfig';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  packageType: ErpPackageId;
  companyName: string;
  companyCode: string;
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
    default: return <Package {...props} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  packageType,
  companyName,
  companyCode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, selectedCompany } = useAuth();
  const effectivePackage: ErpPackageId = (selectedCompany?.packageType as ErpPackageId) || packageType || 'COMPLETE';

  const menuGroups = getMenuGroupsForPackage(effectivePackage, user?.role);
  const pkgMeta = ERP_PACKAGES[effectivePackage] || ERP_PACKAGES.COMPLETE;

  const buildAntMenuItem = (item: any): any => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.iconName ? renderIcon(item.iconName) : undefined,
        label: item.label,
        children: item.children.map(buildAntMenuItem),
      };
    }
    return {
      key: item.path || item.key,
      icon: item.iconName ? renderIcon(item.iconName) : undefined,
      label: item.label,
    };
  };

  const antMenuItems = menuGroups.map((group) => {
    if (group.path || !group.children || group.children.length === 0) {
      return {
        key: group.path || group.key,
        icon: renderIcon(group.iconName),
        label: group.label,
      };
    }
    return {
      key: group.key,
      icon: renderIcon(group.iconName),
      label: group.label,
      children: group.children.map(buildAntMenuItem),
    };
  });

  // Find active open group key based on location.pathname
  const findActiveGroupKey = (): string => {
    for (const group of menuGroups) {
      if (group.path === location.pathname) {
        return group.key;
      }
      if (group.children) {
        for (const child of group.children) {
          if (child.path === location.pathname) {
            return group.key;
          }
          if (child.children) {
            for (const sub of child.children) {
              if (sub.path === location.pathname) {
                return group.key;
              }
            }
          }
        }
      }
    }
    return menuGroups[0]?.key;
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      className="erp-dark-sidebar"
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
        {/* Soft Purple Glow Atmosphere */}
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

        {/* Ambient Wave SVG at Bottom */}
        <svg
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 80,
            opacity: 0.35,
            pointerEvents: 'none',
            zIndex: 1,
          }}
          viewBox="0 0 260 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 Q65,15 130,40 T260,20 L260,80 L0,80 Z"
            fill="url(#sidebarWaveGradDark)"
          />
          <defs>
            <linearGradient id="sidebarWaveGradDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7544D6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5421A8" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Brand Header */}
        <div
          style={{
            padding: collapsed ? '22px 8px' : '22px 20px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7544D6 0%, #5421A8 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 16,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(84, 33, 168, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {companyCode?.slice(0, 2) || (effectivePackage === 'SERVICE' ? 'SV' : effectivePackage === 'SALES' ? 'SL' : 'SE')}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.2px',
                  lineHeight: 1.2,
                }}
              >
                {pkgMeta?.name || (effectivePackage === 'SERVICE' ? 'Service ERP' : effectivePackage === 'SALES' ? 'Sales ERP' : 'Complete ERP')}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#C4B5FD',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                {pkgMeta?.tagline || 'Enterprise System'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu List */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 8px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={collapsed ? undefined : openKeys}
            onOpenChange={onOpenChange}
            items={antMenuItems}
            onClick={({ key }) => {
              if (key && key.startsWith('/')) {
                navigate(key);
              }
            }}
            style={{
              backgroundColor: 'transparent',
              fontSize: 12.5,
              fontWeight: 500,
              border: 'none',
            }}
          />
        </div>

        {/* Bottom User / Logout Footer */}
        <div
          style={{
            padding: collapsed ? '12px 8px' : '14px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            background: 'rgba(20, 8, 44, 0.65)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {!collapsed && (
            <div style={{ overflow: 'hidden', minWidth: 0, paddingRight: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || companyName || 'Admin User'}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#C4B5FD',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {user?.role || 'Enterprise Admin'}
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#A78BFA',
              padding: 6,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A78BFA';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </Sider>
  );
};
