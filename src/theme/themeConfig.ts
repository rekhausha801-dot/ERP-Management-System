import type { ThemeConfig } from 'antd';

export const enterpriseTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2563EB',      // Primary Blue
    colorInfo: '#2563EB',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorTextBase: '#0F172A',
    colorTextSecondary: '#64748B',
    colorBgBase: '#FFFFFF',
    colorBgLayout: '#F8FAFC',     // Clean slate background
    colorBorder: '#E2E8F0',
    borderRadius: 8,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 6,
      fontWeight: 500,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Menu: {
      itemSelectedColor: '#2563EB',
      itemSelectedBg: '#EFF6FF',
      itemHoverBg: '#F1F5F9',
      itemBorderRadius: 6,
      itemHeight: 44,
      itemMarginInline: 12,
    },
    Table: {
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      borderColor: '#E2E8F0',
    },
  },
};
