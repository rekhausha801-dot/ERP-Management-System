// Comprehensive Types for Universal Payroll Management ERP Module

export type SalaryFrequency =
  | 'Daily Wage'
  | 'Weekly Salary'
  | 'Bi-Weekly Salary'
  | 'Monthly Salary'
  | 'Hourly Wage'
  | 'Contract-Based Salary'
  | 'Commission-Based Salary';

export type PayrollPaymentStatus = 'Pending' | 'Approved' | 'Processing' | 'Paid' | 'Failed' | 'On Hold';

export interface SalaryStructureItem {
  id: string;
  structureId: string;
  structureName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  branch: string;
  employmentType: 'Full Time' | 'Contract' | 'Daily Wage' | 'Apprentice';
  salaryType: SalaryFrequency;
  basicSalary: number; // monthly or base
  dailyRate?: number;
  hourlyRate?: number;
  weeklyRate?: number;
  // Allowances
  hra: number;
  da: number;
  travelAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  // Deductions
  pfRate: number; // % e.g. 12%
  esiRate: number; // % e.g. 0.75%
  professionalTax: number;
  tdsMonthly: number;
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface PayrollTransactionRecord {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  branch: string;
  salaryType: SalaryFrequency;
  payrollPeriod: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  overtimeAmount: number;
  basicSalary: number;
  allowances: number;
  bonusIncentives: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  professionalTax: number;
  tdsDeduction: number;
  advanceRecovery: number;
  loanRecovery: number;
  totalDeductions: number;
  netSalary: number;
  paymentMethod: 'Bank Transfer' | 'NEFT' | 'UPI' | 'Cheque' | 'Cash';
  bankAccount: string;
  transactionRef?: string;
  paymentDate?: string;
  approvalStatus: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  paymentStatus: PayrollPaymentStatus;
}

export interface WeeklyPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  weekStartDate: string;
  weekEndDate: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  weeklyBasicSalary: number;
  overtimeHours: number;
  overtimeAmount: number;
  allowances: number;
  advanceRecovery: number;
  deductions: number;
  netSalary: number;
  paymentStatus: PayrollPaymentStatus;
}

export interface DailyWageRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  wageType: 'Daily Wage' | 'Hourly Wage';
  rate: number; // per day or per hour
  workingDays: number;
  workingHours: number;
  overtimeHours: number;
  grossWage: number;
  deductions: number;
  advanceRecovery: number;
  netWage: number;
  paymentStatus: PayrollPaymentStatus;
  dateRange: string;
}

export interface SalaryAdvanceRecord {
  id: string;
  advanceId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestDate: string;
  requestedAmount: number;
  approvedAmount: number;
  recoveryMethod: 'Single Deduction' | 'Monthly Installments' | 'Weekly Installments';
  installmentAmount: number;
  recoveredAmount: number;
  remainingBalance: number;
  status: 'Pending Approval' | 'Approved' | 'Disbursed' | 'Partially Recovered' | 'Fully Recovered' | 'Rejected';
  reason: string;
}

export interface EmployeeLoanRecord {
  id: string;
  loanId: string;
  employeeId: string;
  employeeName: string;
  loanType: 'Personal Loan' | 'Emergency Loan' | 'Medical Loan' | 'Education Loan';
  loanDate: string;
  loanAmount: number;
  interestRate: number; // e.g. 0% or 4%
  tenureMonths: number;
  installmentAmount: number;
  totalRepaid: number;
  outstandingBalance: number;
  nextDueDate: string;
  status: 'Pending Approval' | 'Active' | 'Closed' | 'Defaulted';
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  overtimeDate: string;
  regularHours: number;
  overtimeHours: number;
  overtimeRate: number;
  totalAmount: number;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  paymentStatus: 'Pending Payroll' | 'Included in Payroll' | 'Paid';
}

export interface BonusIncentiveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  bonusType: 'Sales Incentive' | 'Performance Bonus' | 'Festival Bonus' | 'Target Achievement Bonus';
  performancePeriod: string;
  baseAmount: number;
  bonusAmount: number;
  incentiveAmount: number;
  totalBonus: number;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  paymentStatus: 'Pending' | 'Included in Payroll' | 'Paid';
}
