import { AttendanceRow } from "@/components/Employees/attendance/AttendanceTypes";
import { Employee } from "@/types/employee";
import { format, addDays, addWeeks, startOfWeek, startOfMonth, addMonths as addMonthsFn } from 'date-fns';




export const buildEmptyRow = (emp: Employee): AttendanceRow => ({
    employee_id: emp.id,
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
  employees: Employee[],
  attendance: Record<string, AttendanceRow>
) => {
  const map: Record<string, Record<string, AttendanceRow>> = {};
  dates.forEach((d) => {
    map[d] = {};
    employees.forEach((emp) => {
      map[d][emp.id] = attendance[emp.id] || buildEmptyRow(emp);
    });
  });
  return map;
};

export const generateWeekRanges = (baseDate: Date = new Date()) => {
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

export const generateMonthRanges = (baseDate: Date = new Date()) => {
  return Array.from({ length: 13 }, (_, i) => {
    const offset = i - 6;
    const start = startOfMonth(addMonthsFn(baseDate, offset));
    return {
      label: format(start, 'MMMM yyyy'),
      value: format(start, 'yyyy-MM-dd'),
    };
  });
};

export const calculateWeeklyTotals = (
  emp: Employee,
  attendanceMap: Record<string, Record<string, AttendanceRow>>,
  weekDates: string[]
) => {
  let totalHours = 0;
  let totalDays = 0;
  let totalOvertime = 0;

  weekDates.forEach((date) => {
    const att = attendanceMap[date]?.[emp.id];
    if (att && att.status !== 'ABSENT') {
      totalHours += att.total_hours;
      totalOvertime += att.overtime_hours;
      totalDays += att.status === 'PRESENT' ? 1 : att.status === 'HALF_DAY' ? 0.5 : 0;
    }
  });

  const dailyRate = parseFloat(emp.shift_rate.toString());
  const hourlyRate = dailyRate / 8;
  const wages = parseFloat((totalHours * hourlyRate).toFixed(2));

  return { totalHours, totalDays, totalOvertime, wages };
};
