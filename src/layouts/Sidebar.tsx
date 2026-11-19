import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  ShoppingBag,
  FileSpreadsheet,
  Undo2,
  Inbox,
  Wrench,
  HardHat,
  Calendar,
  FileCheck,
  History,
  Receipt,
  CreditCard,
  BarChart3,
  SlidersHorizontal,
  TrendingUp,
  Target,
  UserCheck,
  HelpCircle,
  Briefcase,
  Ticket,
  MapPin,
  ShieldAlert,
  Cpu,
  FileText,
  ThumbsUp,
  LifeBuoy,
  MessageSquare,
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
  const props = { size: 17, style: { marginRight: 10 } };
  switch (name) {
    case 'LayoutDashboard': return <LayoutDashboard {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Package': return <Package {...props} />;
    case 'Boxes': return <Boxes {...props} />;
    case 'ShoppingCart': return <ShoppingCart {...props} />;
    case 'Truck': return <Truck {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
    case 'Undo2': return <Undo2 {...props} />;
    case 'Inbox': return <Inbox {...props} />;
    case 'Wrench': return <Wrench {...props} />;
    case 'HardHat': return <HardHat {...props} />;
    case 'Calendar': return <Calendar {...props} />;
    case 'FileCheck': return <FileCheck {...props} />;
    case 'History': return <History {...props} />;
    case 'Receipt': return <Receipt {...props} />;
    case 'CreditCard': return <CreditCard {...props} />;
    case 'BarChart3': return <BarChart3 {...props} />;
    case 'SlidersHorizontal': return <SlidersHorizontal {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'Target': return <Target {...props} />;
    case 'UserCheck': return <UserCheck {...props} />;
    case 'HelpCircle': return <HelpCircle {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'Ticket': return <Ticket {...props} />;
    case 'MapPin': return <MapPin {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'ThumbsUp': return <ThumbsUp {...props} />;
    case 'LifeBuoy': return <LifeBuoy {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    case 'Bell': return <Bell {...props} />;
    case 'Headphones': return <Headphones {...props} />;
    case 'FileBox': return <FileBox {...props} />;
    case 'ClipboardList': return <ClipboardList {...props} />;
    case 'PhoneCall': return <PhoneCall {...props} />;
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
  const { logout, user } = useAuth();

  const menuGroups = getMenuGroupsForPackage(packageType, user?.role);
  const pkgMeta = ERP_PACKAGES[packageType] || ERP_PACKAGES.COMPLETE;

  const buildAntMenuItem = (item: any): any => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.iconName ? renderIcon(item.iconName) : undefined,
        label: <span style={{ fontWeight: 600 }}>{item.label}</span>,
        children: item.children.map(buildAntMenuItem),
      };
    }
    return {
      key: item.path || item.key,
      icon: item.iconName ? renderIcon(item.iconName) : undefined,
      label: item.label,
    };
  };

  const antMenuItems = menuGroups.map((group) => ({
    key: group.key,
    icon: renderIcon(group.iconName),
    label: <span style={{ fontWeight: 600 }}>{group.label}</span>,
    children: group.children.map(buildAntMenuItem),
  }));

  // Recursive search to find active open key
  const findActiveKeys = (): string[] => {
    for (const group of menuGroups) {
      for (const child of group.children) {
        if (child.path === location.pathname) {
          return [group.key];
        }
        if (child.children) {
          for (const sub of child.children) {
            if (sub.path === location.pathname) {
              return [group.key, child.key];
            }
          }
        }
      }
    }
    return [menuGroups[0]?.key];
  };

  const defaultOpenKeys = findActiveKeys();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      className="erp-dark-sidebar"
      style={{
        backgroundColor: '#19153B', // Midnight Deep Purple matching screenshot
        height: '100vh',
        maxHeight: '100vh',
        zIndex: 10,
        position: 'sticky',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
        {/* Brand Title (ERP Enterprise Platform) */}
        <div
          style={{
            padding: collapsed ? '24px 12px' : '28px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            ERP
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#8F8BA8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ENTERPRISE MANAGEMENT
          </div>
        </div>

        {/* Highlighted Primary "Business Overview" & "Notifications" Pill Buttons */}
        {!collapsed && (
          <div style={{ padding: '0 16px 14px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              onClick={() => navigate('/app/dashboard')}
              style={{
                background: location.pathname.includes('/app/dashboard')
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 14,
                padding: '12px 16px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutDashboard size={18} color="#FFFFFF" />
              <span>Dashboard</span>
            </div>

            <div
              onClick={() => navigate('/app/notifications')}
              style={{
                background: location.pathname.includes('/app/notifications')
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 14,
                padding: '12px 16px',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Package size={18} color="#FFFFFF" />
                <span>Notifications</span>
              </div>
              <span
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 10,
                  padding: '1px 7px',
                }}
              >
                3
              </span>
            </div>
          </div>
        )}

        {/* Collapsible Dark Navigation Menu with Card Inside Scrollable Area */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '4px 10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: '1 0 auto' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultOpenKeys={defaultOpenKeys}
              items={antMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{
                backgroundColor: 'transparent',
                fontSize: 13,
                border: 'none',
              }}
            />
          </div>

          {/* Bottom Banner Card: Placed at the very end of scroll so it reveals on scroll down */}
          {!collapsed && (
            <div style={{ padding: '16px 4px 8px', marginTop: 12, flexShrink: 0 }}>

              <div
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  background: 'linear-gradient(145deg, rgba(124, 102, 220, 0.25) 0%, rgba(88, 62, 199, 0.12) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '16px 14px',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle Ambient Glowing Orb */}
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(110, 86, 207, 0.6) 0%, rgba(110, 86, 207, 0) 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={13} color="#C4B5FD" />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {pkgMeta.name} EDITION
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 10,
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    ACTIVE
                  </div>
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                  Enterprise Operations
                </div>
                <div style={{ fontSize: 11, color: '#9B96B5', marginTop: 3, lineHeight: 1.4 }}>
                  Multi-Tenant Sales & Service SLA Priority
                </div>

                {/* Action Button */}
                <div
                  onClick={() => navigate('/app/settings/subscription')}
                  style={{
                    marginTop: 12,
                    background: 'linear-gradient(135deg, #7C66DC 0%, #583EC7 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: 10,
                    fontSize: 11,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(110, 86, 207, 0.35)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(110, 86, 207, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(110, 86, 207, 0.35)';
                  }}
                >
                  <span>Manage Plan</span>
                  <span style={{ fontSize: 12 }}>&rarr;</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Log Out Button (Fixed at Bottom Footer) */}
        <div
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#8F8BA8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8F8BA8')}
        >
          <LogOut size={16} />
          {!collapsed && <span>Log Out</span>}
        </div>
      </div>
    </Sider>
  );
};
