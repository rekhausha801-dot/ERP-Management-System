import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.danger,
    colorTextBase: colors.primaryText,
    colorTextSecondary: colors.secondaryText,
    colorBgBase: colors.cardBg,
    colorBgLayout: colors.canvasBg,
    colorBorder: 'rgba(110, 86, 207, 0.08)',
    borderRadius: 14,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif`,
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 10,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 20,
      colorBorderSecondary: 'transparent',
      boxShadowTertiary: '0 8px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(255, 255, 255, 0.16)',
      darkItemColor: '#8F8BA8',
      darkItemSelectedColor: '#FFFFFF',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      itemBorderRadius: 12,
      itemHeight: 42,
    },
    Table: {
      headerBg: '#FAF8FC',
      headerColor: '#181433',
      rowHoverBg: '#F7F4FB',
      borderRadius: 16,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
      colorBgContainer: '#FFFFFF',
      colorBorder: '#E2E8F0',
      hoverBorderColor: '#CBD5E1',
      activeBorderColor: '#6D28D9',
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
      colorBgContainer: '#FFFFFF',
      colorBorder: '#E2E8F0',
      colorPrimaryHover: '#CBD5E1',
      colorPrimary: '#6D28D9',
    },
  },
};
