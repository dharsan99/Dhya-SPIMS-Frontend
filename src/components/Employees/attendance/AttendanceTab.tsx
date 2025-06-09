// src/components/Employees/attendance/AttendanceTab.tsx
import { useEffect, useMemo, useState } from 'react';
import { getAllEmployees } from '../../../api/employees';
import format from 'date-fns/format';
import AttendanceHeaderStats from './AttendanceHeaderStats';
import AttendanceFilters from './AttendanceFilters';
import AttendanceEditMode from './AttendanceEditMode';
import AttendanceViewMode from './AttendanceViewMode';
import AttendanceModeTabs from './AttendanceModeTabs';
import AttendanceWeeklyTable from './AttendanceWeeklyTable';
import AttendanceMonthlyTable from './AttendanceMonthlyTable';
import AttendancePagination from './AttendancePagination';
import { ShiftType, shiftTimeMap, AttendanceRow } from './AttendanceTypes';
import { useQuery } from '@tanstack/react-query';
import { buildAttendanceMap, buildEmptyRow } from '@/components/Employees/attendance/utils/attendence';
import { useAttendanceDates } from './hooks/useAttendanceDates';


const AttendanceTab = () => {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [shift, setShift] = useState<ShiftType>('SHIFT_1');
  const [attendance, setAttendance] = useState<Record<string, AttendanceRow>>({});
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [rangeMode, setRangeMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  });

  const initialAttendance = useMemo(() => {
    return employees.reduce((acc, emp) => {
      acc[emp.id] = buildEmptyRow(emp);
      return acc;
    }, {} as Record<string, AttendanceRow>);
  }, [employees]);

  useEffect(() => {
    if (employees.length) {
      setAttendance(initialAttendance);
    }
  }, [employees, initialAttendance]);

  const departments = useMemo(() => {
    return [...new Set(employees.map((e) => e.department).filter(Boolean))] as string[];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesDept = departmentFilter ? e.department === departmentFilter : true;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.token_no?.toLowerCase().includes(q) ?? false);
      return matchesDept && matchesSearch;
    });
  }, [employees, departmentFilter, searchQuery]);

  // ---------- Dates ----------
const { dates, weekDates, monthDates } = useAttendanceDates(rangeMode, date);

  const attendanceMap = useMemo(() => buildAttendanceMap(dates, filteredEmployees, attendance), [dates, filteredEmployees, attendance]);

  // ---------- Pagination ----------
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  // ---------- Handlers ----------
  const handleTimeChange = (
    id: string,
    field: 'in_time' | 'out_time' | 'shift',
    value: string | undefined
  ) => {
    setAttendance((prev) => {
      const updated = { ...prev[id], [field]: value };

      if (field === 'shift') {
        if (value === 'ABSENT') {
          Object.assign(updated, {
            in_time: '',
            out_time: '',
            total_hours: 0,
            status: 'ABSENT',
          });
        } else {
          const { in_time, out_time } = shiftTimeMap[value as ShiftType];
          updated.in_time = in_time;
          updated.out_time = out_time;
          updated.total_hours = 8 + (updated.overtime_hours || 0);
          updated.status = 'PRESENT';
        }
      }

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
  monthDates={monthDates}
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