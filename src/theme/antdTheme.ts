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
      borderRadius: 12,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 20,
      colorBorderSecondary: 'transparent',
      boxShadowTertiary: '0 8px 24px rgba(25, 21, 59, 0.03)',
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
      controlHeight: 42,
      borderRadius: 24,
      colorBgContainer: '#FFFFFF',
      colorBorder: 'transparent',
      hoverBorderColor: colors.primary,
    },
  },
};
