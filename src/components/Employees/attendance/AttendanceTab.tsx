// src/components/Employees/attendance/AttendanceTab.tsx
import { useEffect, useMemo, useState } from 'react';
import { getAllEmployees } from '../../../api/employees';
import { Employee } from '../../../types/employee';
import format from 'date-fns/format';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';

import AttendanceHeaderStats from './AttendanceHeaderStats';
import AttendanceFilters from './AttendanceFilters';
import AttendanceEditMode from './AttendanceEditMode';
import AttendanceViewMode from './AttendanceViewMode';
import AttendanceModeTabs from './AttendanceModeTabs';
import AttendanceWeeklyTable from './AttendanceWeeklyTable';
import AttendanceMonthlyTable from './AttendanceMonthlyTable';
import AttendancePagination from './AttendancePagination';
import { ShiftType, shiftTimeMap, AttendanceRow } from './AttendanceTypes';




const AttendanceTab = () => {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [shift, setShift] = useState<ShiftType>('SHIFT_1');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRow>>({});
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [rangeMode, setRangeMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

useEffect(() => {
  getAllEmployees().then((data) => {
    setEmployees(data);

    const initial: Record<string, AttendanceRow> = {};

    data.forEach((emp) => {
      initial[emp.id] = {
        employee_id: emp.id,
        in_time: '',
        out_time: '',
        total_hours: 0,
        overtime_hours: 0,
        hours: 0,       // ✅ Added: required by AttendanceRow
        overtime: 0,    // ✅ Added: required by AttendanceRow
        status: 'ABSENT',
        shift: 'ABSENT',
        department: emp.department || '', // ✅ Add this line

      };
    });

    setAttendance(initial);
  });
}, []);

  const departments = useMemo(() => {
    const deptSet = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(deptSet) as string[];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (departmentFilter) {
      list = list.filter((e) => e.department === departmentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          (e.token_no && e.token_no.toLowerCase().includes(q))
      );
    }
    return list;
  }, [employees, departmentFilter, searchQuery]);

  const handleTimeChange = (
    id: string,
    field: 'in_time' | 'out_time' | 'shift',
    value: string | undefined
  ) => {
    setAttendance((prev) => {
      const updated = { ...prev[id], [field]: value };
  
      // Shift logic
      if (field === 'shift') {
        if (value === 'ABSENT') {
          updated.in_time = '';
          updated.out_time = '';
          updated.total_hours = 0;
          updated.status = 'ABSENT';
        } else {
          const { in_time, out_time } = shiftTimeMap[value as ShiftType];
          updated.in_time = in_time;
          updated.out_time = out_time;
          updated.total_hours = 8 + (updated.overtime_hours || 0);
          updated.status = 'PRESENT';
        }
      }
  
      // In/Out logic
      if (field === 'in_time' || field === 'out_time') {
        const inTime = field === 'in_time' ? value : updated.in_time;
        const outTime = field === 'out_time' ? value : updated.out_time;
  
        let total = 0;
        if (inTime && outTime) {
          const [inH, inM] = inTime.split(':').map(Number);
          const [outH, outM] = outTime.split(':').map(Number);
          total = (outH * 60 + outM - (inH * 60 + inM)) / 60;
          if (total < 0) total = 0;
        }
  
        updated.total_hours = parseFloat(total.toFixed(2));
        updated.status = total > 0 ? 'PRESENT' : 'ABSENT';
      }
  
      return { ...prev, [id]: updated };
    });
  };

  const handleOvertimeChange = (id: string, value: number) => {
    setAttendance((prev) => {
      const updated = { ...prev[id] };
  
      updated.overtime_hours = value;
      updated.total_hours = parseFloat((8 + value).toFixed(2));
      updated.status = updated.total_hours > 0 ? 'PRESENT' : 'ABSENT';
  
      return { ...prev, [id]: updated };
    });
  };

  const startIdx = (page - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);
  const currentDate = parseISO(date);
  const rawWeekDates = eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) });
  const weekDates = rawWeekDates.map((d) => format(d, 'yyyy-MM-dd'));
  const monthDates = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  const monthDateStrings = monthDates.map((d) => format(d, 'yyyy-MM-dd'));

  const weeklyAttendanceMap: Record<string, Record<string, AttendanceRow>> = {};
  weekDates.forEach((date) => {
    weeklyAttendanceMap[date] = {};
    filteredEmployees.forEach((emp) => {
      weeklyAttendanceMap[date][emp.id] = attendance[emp.id] || {
        employee_id: emp.id,
        in_time: '',
        out_time: '',
        total_hours: 0,
        overtime_hours: 0,
        status: 'ABSENT',
      };
    });
  });

  const monthlyAttendanceMap: Record<string, Record<string, AttendanceRow>> = {};
  monthDateStrings.forEach((date) => {
    monthlyAttendanceMap[date] = {};
    filteredEmployees.forEach((emp) => {
      monthlyAttendanceMap[date][emp.id] = attendance[emp.id] || {
        employee_id: emp.id,
        in_time: '',
        out_time: '',
        total_hours: 0,
        overtime_hours: 0,
        status: 'ABSENT',
      };
    });
  });
const dates = useMemo(() => {
  if (rangeMode === 'week') return weekDates;
  if (rangeMode === 'month') return monthDateStrings;
  return [date]; // single day
}, [rangeMode, weekDates, monthDateStrings, date]);

const attendanceMap: Record<string, Record<string, AttendanceRow>> = {};

dates.forEach((d) => {
  attendanceMap[d] = {};
  filteredEmployees.forEach((emp) => {
    attendanceMap[d][emp.id] = attendance[emp.id] || {
      employee_id: emp.id,
      in_time: '',
      out_time: '',
      total_hours: 0,
      overtime_hours: 0,
      status: 'ABSENT',
      shift: 'ABSENT',
    };
  });
});
  return (
    <div className="space-y-4">
<AttendanceHeaderStats
  employees={employees}
  attendance={attendance} // ✅ Fix: pass this prop
  date={date}
  department={departmentFilter}
/>
      <AttendanceModeTabs
        mode={viewMode}
        onModeChange={setViewMode}
        range={rangeMode}
        onRangeChange={setRangeMode}
      />

     <AttendanceFilters
  date={date}
  onDateChange={setDate}
  departments={departments}
  department={departmentFilter}
  onDepartmentChange={setDepartmentFilter}
  shift={shift}
  onShiftChange={(s: string) => setShift(s as ShiftType)}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  rangeMode={rangeMode}
  onRangeChange={setRangeMode}
  employees={employees}
  attendanceMap={attendanceMap}
  dates={dates}
/>

      {rangeMode === 'day' ? (
        viewMode === 'edit' ? (
            <AttendanceEditMode
            employees={paginatedEmployees}
            attendance={attendance}
            onTimeChange={handleTimeChange} // ✅ Now supports "shift"
            onOvertimeChange={handleOvertimeChange}
            pageStart={startIdx}
            shift={shift}
            date={date}
          />
        ) : (
            <AttendanceViewMode
  employees={paginatedEmployees}
  pageStart={startIdx}
  date={date}
/>
        )
      ) : rangeMode === 'week' ? (
        <AttendanceWeeklyTable
  employees={filteredEmployees}
  weekDates={weekDates}
  page={page}
  pageSize={itemsPerPage}
  onPageChange={setPage}
  onPageSizeChange={setItemsPerPage}
/>
      ) : (
        <AttendanceMonthlyTable
  employees={filteredEmployees}
  monthDates={monthDateStrings}
  page={page}
  pageSize={itemsPerPage}
  onPageChange={setPage}
  onPageSizeChange={setItemsPerPage}
/>
      )}

      {rangeMode === 'day' && (
        <AttendancePagination
          page={page}
          total={filteredEmployees.length}
          pageSize={itemsPerPage}
          onPageChange={setPage}
          onPageSizeChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default AttendanceTab;