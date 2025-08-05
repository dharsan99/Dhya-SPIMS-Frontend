export interface Employee {
  id: string;
  name: string;
  tokenNo: string;
  shiftRate: number | string;
  aadharNo: string;
  bankAcc1: string;
  bankAcc2?: string;
  department?: string;
  joinDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeInput {
  name: string;
  aadharNo: string;
  bankAcc1: string;
  bankAcc2?: string;
  department?: string;
  joinDate?: string;
  shiftRate: number;
}

export interface EmployeeAttendanceInput {
  working_days: number;
  total_hours: number;
  overtime_hours: number;
}

export interface EmployeeSalarySummary {
  employee_id: string;
  name: string;
  role: string;
  base_salary: number;
  working_days: number;
  total_hours: number;
  overtime_hours: number;
  salary_computed: number;
}

export interface EmployeeWithSalary extends Employee {
  working_days: number;
  total_hours: number;
  overtime_hours: number;
  salary_computed: number;
}