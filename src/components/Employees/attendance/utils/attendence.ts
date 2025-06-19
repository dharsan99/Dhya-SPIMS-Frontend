import { AttendanceRow } from "@/components/Employees/attendance/AttendanceTypes";
import { AttendanceRecord } from "@/types/attendance";
import { format, addDays, addWeeks, startOfWeek, startOfMonth, addMonths } from 'date-fns';

export const buildEmptyRow = (emp: AttendanceRecord): AttendanceRow => ({
    employee_id: emp.employee_id,
    in_time: '',
    out_time: '',
    total_hours: 0,
    overtime_hours: 0,
    hours: 0,
    overtime: 0,
    status: 'ABSENT',
    shift: 'ABSENT',
    department: emp.department || '',
});

export const buildAttendanceMap = (
  dates: string[],
  employees: AttendanceRecord[],
  attendance: Record<string, AttendanceRow>
) => {
  const map: Record<string, Record<string, AttendanceRow>> = {};
  dates.forEach((d) => {
    map[d] = {};
    employees.forEach((emp) => {
      map[d][emp.employee_id] = attendance[emp.employee_id] || buildEmptyRow(emp);
    });
  });
  return map;
};


export const generateWeekRanges = (baseDate: Date) => {
  return Array.from({ length: 13 }, (_, i) => {
    const offset = i - 6;
    const start = startOfWeek(addWeeks(baseDate, offset), { weekStartsOn: 1 });
    const end = addDays(start, 6);
    return {
      label: `${format(start, 'dd MMM')} - ${format(end, 'dd MMM')}`,
      value: format(start, 'yyyy-MM-dd'),
    };
  });
};

export const generateMonthRanges = (baseDate: Date) => {
  return Array.from({ length: 13 }, (_, i) => {
    const offset = i - 6;
    const start = startOfMonth(addMonths(baseDate, offset));
    return {
      label: format(start, 'MMMM yyyy'),
      value: format(start, 'yyyy-MM-dd'),
    };
  });
};

export const calculateWeeklyTotals = (
  emp: {
    employee_id: string;
    employee: { shift_rate: string };
    attendance: Record<string, { status: string; total_hours: number; overtime_hours: number }>;
  },
  weekDates: string[]
) => {
  // Safety check for weekDates
  if (!weekDates || !Array.isArray(weekDates) || weekDates.length === 0) {
    return {
      totalHours: 0,
      totalDays: 0,
      totalOvertime: 0,
      wages: 0,
    };
  }

  let totalHours = 0;
  let totalDays = 0;
  let totalOvertime = 0;

  weekDates.forEach((date) => {
    const att = emp.attendance?.[date];
    if (att && att.status !== 'ABSENT') {
      totalHours += att.total_hours || 0;
      totalOvertime += att.overtime_hours || 0;
      totalDays += att.status === 'PRESENT' ? 1 : att.status === 'HALF_DAY' ? 0.5 : 0;
    }
  });

  const shiftRate = parseFloat(emp.employee?.shift_rate || '0');
  const hourlyRate = shiftRate / 8;
  const wages = parseFloat((totalHours * hourlyRate).toFixed(2));

  return {
    totalHours,
    totalDays,
    totalOvertime,
    wages,
  };
};


export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);


