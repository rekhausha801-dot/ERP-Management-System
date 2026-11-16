export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'accountant' | 'staff';
  avatar?: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  registrationNumber: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  logo?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated';
  companyId: string;
}

export interface Worker {
  id: string;
  workerCode: string;
  name: string;
  phone: string;
  skillCategory: string; // e.g. Electrician, Mason, Carpenter
  dailyWage: number;
  currentSiteId?: string;
  status: 'active' | 'inactive';
  companyId: string;
}

export interface Attendance {
  id: string;
  date: string;
  personType: 'employee' | 'worker';
  personId: string;
  personName: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  companyId: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed';
  progress: number;
  companyId: string;
}

export interface WorkTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  minStockLevel: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  companyId: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  orderDate: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'received' | 'cancelled';
  companyId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  companyId: string;
}

export interface PayrollRecord {
  id: string;
  month: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  companyId: string;
}
