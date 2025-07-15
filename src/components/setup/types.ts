import { ShiftType } from '@/components/Employees/attendance/AttendanceTypes';

export interface ShiftTiming {
  shift: ShiftType;
  in_time: string;
  out_time: string;
  label: string;
}

export interface OrgDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  industry: string;
  employeeCount: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  capacity: number;
  department: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
}

export interface SetupWizardData {
  orgDetails: OrgDetails;
  shiftTimings: ShiftTiming[];
  departments: Department[];
  machineList: Machine[];
  employees: Employee[];
} 