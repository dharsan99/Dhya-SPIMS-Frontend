export interface Employee {
  id: string;
  name: string;
  token_no: string;
  shift_rate: number;
  aadhar_no: string;
  bank_acc_1: string;
  bank_acc_2?: string;
  department?: string;
  join_date?: string;
}

export interface CreateEmployeeInput {
  name: string;
  token_no: string;
  shift_rate: number;
  aadhar_no: string;
  bank_acc_1: string;
  bank_acc_2?: string;
  department?: string;
  join_date?: string;
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