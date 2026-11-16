import type { ThemeConfig } from 'antd';
import { colors } from './colors';
import { typography } from './typography';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.danger,
    colorTextBase: colors.primaryText,
    colorTextSecondary: colors.secondaryText,
    colorBgBase: colors.surface,
    colorBgLayout: colors.background,
    colorBorder: colors.border,
    borderRadius: 8,
    fontFamily: typography.fontFamily,
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 6,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      fontWeight: 500,
    },
    Card: {
      borderRadiusLG: 8,
      colorBorderSecondary: colors.border,
    },
    Menu: {
      itemSelectedColor: colors.primary,
      itemSelectedBg: '#F0EAF8',
      itemHoverBg: '#FAF7FC',
      itemBorderRadius: 6,
      itemHeight: 40,
    },
    Table: {
      headerBg: '#FAF7FC',
      headerColor: colors.primaryText,
      borderColor: colors.border,
      rowHoverBg: '#FAF7FC',
    },
    Input: {
      controlHeight: 38,
      borderRadius: 6,
      colorBorder: colors.border,
    },
    Select: {
      controlHeight: 38,
      borderRadius: 6,
      colorBorder: colors.border,
    },
  },
};
