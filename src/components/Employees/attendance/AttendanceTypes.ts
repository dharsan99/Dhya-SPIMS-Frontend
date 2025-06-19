
import { AttendanceRecord } from '@/types/attendance';

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT';
// Add this near the top, after ShiftType
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY';

// Add a separate type if needed for dropdown values
export type ShiftDropdownOption = ShiftType | 'ABSENT';
export type RangeMode = 'day' | 'week' | 'month';
// AttendanceTypes.ts
export const shiftTimeMap: Record<ShiftType, { in_time: string; out_time: string }> = {
  MORNING: { in_time: '06:00', out_time: '14:00' },
  EVENING: { in_time: '14:00', out_time: '22:00' },
  NIGHT: { in_time: '22:00', out_time: '06:00' },
};
export interface AttendanceFiltersProps {
  date: string;
  department: string;
  departments: string[];
  onDateChange: (date: string) => void;
  onDepartmentChange: (dept: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  rangeMode: 'day' | 'week' | 'month';
  onRangeChange: (range: 'day' | 'week' | 'month') => void;
  shift: string; // or ShiftType if it's a custom type
  onShiftChange: (shift: string) => void; // or (shift: ShiftType) => void
  employees: AttendanceRecord[];
  attendanceMap: Record<string, Record<string, AttendanceRow>>;
  dates: string[];
}

export interface AttendanceRow {
    department: string;
    overtime: number;
    hours: number;
    employee_id: string;
    in_time: string;
    out_time: string;
    total_hours: number;
    overtime_hours: number;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
    shift: ShiftType | 'ABSENT'; // ✅ make it non-optional and union with "ABSENT"
}

// Props for edit mode table
export interface AttendanceEditModeProps {
    employees: AttendanceRecord[];
    attendance: Record<string, AttendanceRow>;
    onTimeChange: (id: string, field: 'in_time' | 'out_time' | 'shift', value: string | undefined) => void;
    onOvertimeChange: (id: string, value: number) => void;
    pageStart: number;
    shift: ShiftType;
  }

// Props for view mode table
// AttendanceTypes.ts
export interface AttendanceViewModeProps {
    employees: AttendanceRecord[]
    pageStart: number;
    loading: boolean;
  }

export interface AttendanceHeaderStatsProps {
  employees: AttendanceRecord[];
  attendance: Record<string, AttendanceRow>;
}