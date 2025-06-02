// src/types/attendance.ts

export interface Attendance {
    id: string;
    employeeId: string;
    date: string; // ISO date string (e.g., '2025-05-18')
    checkIn: string; // 'HH:mm:ss' format (e.g., '09:00:00')
    checkOut: string; // 'HH:mm:ss' format (e.g., '18:00:00')
    totalHours: number; // auto-calculated
    overtimeHours?: number; // optional if you plan to support overtime
    shift?: 'Shift 1' | 'Shift 2' | 'Shift 3'; // optional enum-style shift
    employee?: {
      id: string;
      name: string;
      department?: string;
    };
  }
  
  export interface AttendanceCreateDto {
    employeeId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    shift?: 'Shift 1' | 'Shift 2' | 'Shift 3';
  }
  
  export interface AttendanceUpdateDto extends AttendanceCreateDto {
    id: string;
  }
  
  export interface AttendanceStats {
    totalPresent: number;
    totalAbsent: number;
    totalEmployees: number;
    averageHours: number;
    totalOvertime: number;
  }

  // src/types/attendance.ts
