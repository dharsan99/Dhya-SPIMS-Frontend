import { useMemo, useState } from 'react';

import format from 'date-fns/format';
import AttendanceFilters from './AttendanceFilters';
import AttendanceEditMode from './AttendanceEditMode';
import AttendanceViewMode from './AttendanceViewMode';
import AttendanceModeTabs from './AttendanceModeTabs';
import AttendanceWeeklyTable from './AttendanceWeeklyTable';
import AttendanceMonthlyTable from './AttendanceMonthlyTable';
import AttendancePagination from './AttendancePagination';
import { ShiftType, shiftTimeMap, AttendanceRow } from './AttendanceTypes';
import { useQuery } from '@tanstack/react-query';
import { buildAttendanceMap } from '@/components/Employees/attendance/utils/attendence';
import { useAttendanceDates } from './hooks/useAttendanceDates';
import { getAllAttendances } from '@/api/attendance';
import { AttendanceRecord } from '@/types/attendance';


const AttendanceTab = () => {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [shift, setShift] = useState<ShiftType>('MORNING');
  const [attendance, setAttendance] = useState<Record<string, AttendanceRow>>({});
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [rangeMode, setRangeMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: attendancesData, isLoading } = useQuery({
    queryKey: ['attendance', date],
    queryFn: () => getAllAttendances(date),
  });


  const attendances = attendancesData ?? [];

  const departments = useMemo(() => {
    return [...new Set(attendances.map((a: AttendanceRecord) => a.department).filter(Boolean))] as string[];
  }, [attendances]);

  const filteredAttendances = useMemo(() => {
    return attendances.filter((emp: AttendanceRecord) => {
      const matchesDept = departmentFilter
        ? emp.department === departmentFilter
        : true;
  
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        emp.name?.toLowerCase().includes(q) ||
        emp.employee_id?.toLowerCase().includes(q);
  
      return matchesDept && matchesSearch;
    });
  }, [attendances, departmentFilter, searchQuery]);

  console.log('filteredAttendances', filteredAttendances)

  const { dates, weekDates, monthDates } = useAttendanceDates(rangeMode, date);

  const attendanceMap = useMemo(() => {
    return buildAttendanceMap(dates, filteredAttendances, attendance);
  }, [dates, filteredAttendances, attendance]);

  const startIdx = (page - 1) * itemsPerPage;
  const paginatedAttendances = filteredAttendances.slice(startIdx, startIdx + itemsPerPage);
  console.log('filteredAttendances', filteredAttendances)

  console.log('paginatedAttendances', paginatedAttendances)
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
        } else if (value && shiftTimeMap[value as ShiftType]) {
          const { in_time, out_time } = shiftTimeMap[value as ShiftType];
          updated.in_time = in_time;
          updated.out_time = out_time;
          updated.total_hours = 8 + (updated.overtime_hours || 0);
          updated.status = 'PRESENT';
        } else {
          console.warn(`Invalid shift value: ${value}`);
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
     {/*<AttendanceHeaderStats
        employees={filteredAttendances}
        attendance={attendance}
        date={date}
        department={departmentFilter}
      />*/}
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
        employees={filteredAttendances}
        attendanceMap={attendanceMap}
        dates={dates}
      /> 
      {rangeMode === 'day' ? (
        viewMode === 'edit' ? (
          <AttendanceEditMode
            employees={paginatedAttendances}
            attendance={attendance}
            onTimeChange={handleTimeChange}
            onOvertimeChange={handleOvertimeChange}
            pageStart={startIdx}
            shift={shift}
            date={date}
          />
        ) : (
          <AttendanceViewMode
            employees={paginatedAttendances}
            pageStart={startIdx}
            date={date}
            loading={isLoading}
          />
        )
      ) : rangeMode === 'week' ? (
        <AttendanceWeeklyTable
          employees={filteredAttendances}
          weekDates={weekDates}
          page={page}
          pageSize={itemsPerPage}
          onPageChange={setPage}
          onPageSizeChange={setItemsPerPage}
        />
      ) : (
        <AttendanceMonthlyTable
          employees={filteredAttendances}
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
          total={filteredAttendances.length}
          pageSize={itemsPerPage}
          onPageChange={setPage}
          onPageSizeChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default AttendanceTab;