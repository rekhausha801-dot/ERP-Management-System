export const MOCK_SERVICES_DATA = {
  kpis: {
    totalRequests: 218,
    openTickets: 31,
    activeJobs: 14,
    completedJobs: 173,
    pendingJobs: 9,
    firstTimeFixRate: '92.6%',
    csat: '4.8 / 5.0',
  },
  monthlyJobsChart: [
    { month: 'Jan', completed: 34, incoming: 38 },
    { month: 'Feb', completed: 42, incoming: 45 },
    { month: 'Mar', completed: 48, incoming: 50 },
    { month: 'Apr', completed: 54, incoming: 56 },
    { month: 'May', completed: 58, incoming: 60 },
  ],
  technicianPerformance: [
    { name: 'Murugan Selvam', rating: 4.9, jobs: 42, specialization: 'CNC & Drives' },
    { name: 'Rajesh Kannan', rating: 4.8, jobs: 38, specialization: 'Transformers & Switchgear' },
    { name: 'Deepak Varma', rating: 4.7, jobs: 35, specialization: 'HVAC & Chillers' },
  ],
  recentTickets: [
    { id: 'TCK-701', customer: 'Apex Precision Tools', asset: 'CNC Milling Drive Unit 4', priority: 'High', stage: 'In Progress', technician: 'Murugan Selvam' },
    { id: 'TCK-702', customer: 'Standard Textiles Mill', asset: 'Main Cooling Fan', priority: 'Emergency', stage: 'Assigned', technician: 'Rajesh Kannan' },
    { id: 'TCK-703', customer: 'Omni Infra Ventures', asset: 'Chiller Pump System', priority: 'Medium', stage: 'Resolved', technician: 'Deepak Varma' },
  ],
};
