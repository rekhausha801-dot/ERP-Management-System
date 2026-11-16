import React from 'react';
import { Layout, Menu, Typography, Tooltip } from 'antd';
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
  Paperclip,
  Wallet,
  TrendingDown,
  Percent,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  ShieldCheck,
  Building,
  Network,
  Shield,
  Bell,
  ArrowUpDown,
  Sliders,
  CheckCircle,
  CheckSquare,
  Navigation,
  Scale,
  FolderTree,
  Folder,
  Layers,
  ArrowRightLeft,
  AlertTriangle,
  FileMinus,
  FilePlus,
  Send,
  Map,
  RefreshCw,
  Star,
  AlertCircle,
  Mail,
  Megaphone,
  GitBranch,
  Activity,
  Award,
  Clock,
  UserPlus,
  ArrowRightCircle,
} from 'lucide-react';
import { getMenuGroupsForPackage } from '../config/menuConfig';
import { ERP_PACKAGES } from '../config/erpPackageConfig';
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
    case 'Paperclip': return <Paperclip {...props} />;
    case 'Wallet': return <Wallet {...props} />;
    case 'TrendingDown': return <TrendingDown {...props} />;
    case 'Percent': return <Percent {...props} />;
    case 'ArrowDownLeft': return <ArrowDownLeft {...props} />;
    case 'ArrowUpRight': return <ArrowUpRight {...props} />;
    case 'DollarSign': return <DollarSign {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Building': return <Building {...props} />;
    case 'Network': return <Network {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Bell': return <Bell {...props} />;
    case 'ArrowUpDown': return <ArrowUpDown {...props} />;
    case 'Sliders': return <Sliders {...props} />;
    case 'CheckCircle': return <CheckCircle {...props} />;
    case 'CheckSquare': return <CheckSquare {...props} />;
    case 'Navigation': return <Navigation {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'FolderTree': return <FolderTree {...props} />;
    case 'Folder': return <Folder {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'ArrowRightLeft': return <ArrowRightLeft {...props} />;
    case 'AlertTriangle': return <AlertTriangle {...props} />;
    case 'FileMinus': return <FileMinus {...props} />;
    case 'FilePlus': return <FilePlus {...props} />;
    case 'Send': return <Send {...props} />;
    case 'Map': return <Map {...props} />;
    case 'RefreshCw': return <RefreshCw {...props} />;
    case 'Star': return <Star {...props} />;
    case 'AlertCircle': return <AlertCircle {...props} />;
    case 'Mail': return <Mail {...props} />;
    case 'Megaphone': return <Megaphone {...props} />;
    case 'GitBranch': return <GitBranch {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'UserPlus': return <UserPlus {...props} />;
    case 'ArrowRightCircle': return <ArrowRightCircle {...props} />;
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

  // Dynamic menu groups filtered by authorized ERP package
  const menuGroups = getMenuGroupsForPackage(packageType);
  const pkgMeta = ERP_PACKAGES[packageType] || ERP_PACKAGES.COMPLETE;

  // Build Ant Design collapsible submenu structure
  const antMenuItems = menuGroups.map((group) => {
    // If single child or group with children
    return {
      key: group.key,
      icon: renderIcon(group.iconName),
      label: <span style={{ fontWeight: 600 }}>{group.label}</span>,
      children: group.children.map((child) => ({
        key: child.path,
        icon: child.iconName ? renderIcon(child.iconName) : undefined,
        label: child.label,
      })),
    };
  });

  // Calculate default opened group keys based on current pathname
  const activeGroup = menuGroups.find((g) =>
    g.children.some((c) => c.path === location.pathname)
  );
  const defaultOpenKeys = activeGroup ? [activeGroup.key] : [menuGroups[0]?.key];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={270}
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
        {/* Company Branding / Header */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px 20px',
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
                    fontWeight: 700,
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

        {/* Collapsible Nested Sidebar Menu with clean scroll */}
        <div
          style={{
            flex: 1,
            padding: '8px 4px',
            overflowY: 'auto',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={defaultOpenKeys}
            items={antMenuItems}
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
