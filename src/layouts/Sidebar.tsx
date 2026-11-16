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
} from 'lucide-react';
import { MENU_ITEMS } from '../config/menuConfig';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
import type { ErpPackageId } from '../config/erpPackageConfig';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  packageType: ErpPackageId;
  companyName: string;
  companyCode: string;
}

const getIcon = (iconName: string) => {
  const props = { size: 17, style: { marginRight: 8 } };
  switch (iconName) {
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

  // Filter modules permitted for the logged-in company's package
  const allowedMenuItems = MENU_ITEMS.filter((item) =>
    item.allowedPackages.includes(packageType)
  );

  const pkgMeta = ERP_PACKAGES[packageType] || ERP_PACKAGES.COMPLETE;

  const menuItems = allowedMenuItems.map((mod) => ({
    key: mod.path,
    icon: getIcon(mod.iconName),
    label: mod.label,
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      theme="light"
      style={{
        borderRight: '1px solid #E7E0F0',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Company Branding */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px 18px',
            borderBottom: '1px solid #E7E0F0',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 64,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#51258C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            {companyCode.substring(0, 2) || 'EP'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#242033',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {companyName}
              </div>
              <div style={{ marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    backgroundColor: pkgMeta.badgeBg,
                    color: pkgMeta.badgeColor,
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {pkgMeta.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Sidebar Items without inner scrollbar */}
        <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              borderRight: 'none',
              backgroundColor: 'transparent',
              fontSize: 13,
            }}
          />
        </div>
      </div>
    </Sider>
  );
};
