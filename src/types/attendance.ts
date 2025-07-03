// pullable request
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

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT' | 'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3';
export type ShiftDropdownOption = ShiftType | 'ABSENT';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';

export interface AttendanceRow {
department: string;
overtime: number;
hours: number;
employee_id: string;
in_time: string;
out_time: string;
total_hours: number;
overtime_hours: number;
status: AttendanceStatus;
shift: ShiftType;
}

export interface NestedAttendanceRecord {
  employee_id: string;
  employee: {
    token_no: string;
    name: string;
    shift_rate: string;
    department: string; // ← Added this line
  };
  attendance: Record<
    string, // date string e.g., '2025-06-20'
    {
      status: string;
      in_time: string;
      out_time: string;
      total_hours: number;
      overtime_hours: number;
    }
  >;
}

export interface AttendanceRecord {
token_no?: string;
employee_id: string;
name: string;
in_time: string;
out_time: string;
department: string;
employee: { name: string; department: string , token_no: string, shift_rate: number};
date: string; // ISO date string like "2025-06-15T00:00:00.000Z"
shift: string;
status: AttendanceStatus | string;
total_hours: number;
overtime_hours: number;
shift_rate?: number;
}

export interface MarkAttendancePayload {
date: string;
records: {
  employee_id: string;
  in_time: string;
  out_time: string;
  total_hours: number;
  overtime_hours: number;
  status: AttendanceStatus;
  shift: ShiftType;
}[];
}

export interface SingleAttendancePayload {
date?: string;
employee_id: string;
in_time: string;
out_time: string;
overtime_hours: number;
status: AttendanceStatus;
shift: ShiftType;
}

export const shiftTimeMap: Record<ShiftType, { in_time: string; out_time: string }> = {
MORNING: { in_time: '06:00', out_time: '14:00' },
EVENING: { in_time: '14:00', out_time: '22:00' },
NIGHT: { in_time: '22:00', out_time: '06:00' },
SHIFT_1: { in_time: '06:00', out_time: '14:00' },
SHIFT_2: { in_time: '14:00', out_time: '22:00' },
SHIFT_3: { in_time: '22:00', out_time: '06:00' }
};


// src/types/attendance.ts


  // src/types/attendance.ts
