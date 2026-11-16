export const MOCK_SALES_DATA = {
  kpis: {
    totalRevenue: 4850000,
    totalOrders: 142,
    pendingOrders: 18,
    totalCustomers: 86,
    conversionRate: '28.4%',
  },
  monthlyRevenueChart: [
    { month: 'Jan', revenue: 3200000, target: 3000000 },
    { month: 'Feb', revenue: 3800000, target: 3500000 },
    { month: 'Mar', revenue: 4100000, target: 4000000 },
    { month: 'Apr', revenue: 4500000, target: 4200000 },
    { month: 'May', revenue: 4850000, target: 4500000 },
  ],
  topProducts: [
    { name: '15KW Variable Frequency Drive', sales: 48, revenue: 3120000 },
    { name: 'AC Servo Motor 750W', sales: 64, revenue: 1792000 },
    { name: 'Compact Modular PLC 16DI/16DO', sales: 32, revenue: 1344000 },
  ],
  recentOrders: [
    { id: 'SO-101', customer: 'Apex Precision Tools', amount: 472000, status: 'Processing', date: '2026-11-15' },
    { id: 'SO-102', customer: 'Southern Automation Works', amount: 944000, status: 'Shipped', date: '2026-11-14' },
    { id: 'SO-103', customer: 'Omni Infra Ventures', amount: 320000, status: 'Delivered', date: '2026-11-12' },
  ],
};
