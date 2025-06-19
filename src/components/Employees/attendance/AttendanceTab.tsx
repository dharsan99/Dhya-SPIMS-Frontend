// pullable request
import { useEffect, useMemo, useState } from 'react';

import format from 'date-fns/format';
import AttendanceFilters from './AttendanceFilters';
import AttendanceEditMode from './AttendanceEditMode';
import AttendanceViewMode from './AttendanceViewMode';
import AttendanceModeTabs from './AttendanceModeTabs';
import AttendanceWeeklyTable from './AttendanceWeeklyTable';
import AttendanceMonthlyTable from './AttendanceMonthlyTable';
import AttendancePagination from './AttendancePagination';
import { ShiftType, shiftTimeMap, AttendanceRow, AttendanceStatus } from './AttendanceTypes';
import { useQuery } from '@tanstack/react-query';
import { buildAttendanceMap } from '@/components/Employees/attendance/utils/attendence';
import { useAttendanceDates } from './hooks/useAttendanceDates';
import { getAllAttendances, getAttendanceInRange, getAttendanceSummary } from '@/api/attendance';
import { AttendanceRecord } from '@/types/attendance';
import AttendanceHeaderStats from './AttendanceHeaderStats';




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

  const { dates, weekDates, monthDates } = useAttendanceDates(rangeMode, date);

  const rangeStart = dates[0];
  const rangeEnd = dates[dates.length - 1];

  const { data: attendancesData, isLoading } = useQuery({
    queryKey: ['attendance', rangeMode, rangeStart, rangeEnd, page, itemsPerPage],
    queryFn: () => {
      if (rangeMode === 'day') {
        return getAllAttendances(date, { page, limit: itemsPerPage });
      } else if (rangeMode === 'week' || rangeMode === 'month') {
        return getAttendanceInRange(rangeStart, rangeEnd, { page, limit: itemsPerPage });
      }
      return Promise.resolve({ data: [], total: 0, page: 1, limit: 10 });
    },
  });


  console.log('attendancesdata for range', attendancesData)




  const attendances = attendancesData?.data ?? [];

  useEffect(() => {
    if (!attendancesData) return;
  
    const allowedStatuses = ['PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'] as const;
  
    const initialAttendance: Record<string, AttendanceRow> = {};
    attendancesData?.data?.forEach((record: AttendanceRecord) => {
      const {
        employee_id,
        in_time,
        out_time,
        shift,
        overtime_hours,
        status,
        total_hours,
        department,
      } = record;
  
      console.log('record', record)
      const normalizedStatus = typeof status === 'string'
        ? status.toUpperCase()
        : 'ABSENT';
  
      initialAttendance[employee_id] = {
        in_time: in_time ? new Date(in_time).toISOString().slice(11, 16) : '',
        out_time: out_time ? new Date(out_time).toISOString().slice(11, 16) : '',
        shift: (shift?.toUpperCase() as ShiftType) ?? 'MORNING',
        overtime_hours: overtime_hours || 0,
        total_hours: total_hours || 0,
        status: allowedStatuses.includes(normalizedStatus as AttendanceStatus)
          ? (normalizedStatus as AttendanceStatus)
          : 'ABSENT',
        department: department ?? '', // Add this field based on AttendanceRow
        overtime: overtime_hours || 0, // assuming `overtime` duplicates `overtime_hours`
        hours: total_hours || 0,       // assuming `hours` duplicates `total_hours`
        employee_id,
      };
    });
  
    setAttendance(initialAttendance);
  }, [attendancesData]);

  console.log('date', date)

  const { data: summaryData } = useQuery({
    queryKey: ['attendance-summary', rangeMode, date, rangeStart, rangeEnd],
    queryFn: () => {
      if (rangeMode === 'day') {
        return getAttendanceSummary({ date });
      } else if (rangeMode === 'week') {
        return getAttendanceSummary({ startDate: rangeStart, endDate: rangeEnd });
      } else if (rangeMode === 'month') {
        const d = new Date(date);
        return getAttendanceSummary({ month: d.getMonth() + 1, year: d.getFullYear() });
      }
      return Promise.resolve(null);
    },
    enabled: !!date, // only run if date is available
  });

  console.log('summaryData', summaryData)
  const departments = useMemo(() => {
    return [...new Set(attendances.map((a: AttendanceRecord) => a.employee?.department).filter(Boolean))] as string[];
  }, [attendances]);

  const filteredAttendances = useMemo(() => {
    return attendances.filter((emp: AttendanceRecord) => {
      const matchesDept = departmentFilter
        ? emp.employee?.department === departmentFilter
        : true;
  
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        emp.employee?.name?.toLowerCase().includes(q) ||
        emp.employee_id?.toLowerCase().includes(q);
  
      return matchesDept && matchesSearch;
    });
  }, [attendances, departmentFilter, searchQuery]);


 

  const attendanceMap = useMemo(() => {
    return buildAttendanceMap(dates, filteredAttendances, attendance);
  }, [dates, filteredAttendances, attendance]);

  const startIdx = (page - 1) * itemsPerPage;
  const paginatedAttendances = filteredAttendances;

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

  const normalizedDate = useMemo(() => {
    if (rangeMode === 'month') {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    }
    return date;
  }, [rangeMode, date]);

  return (
    <div className="space-y-4">
     <AttendanceHeaderStats
          summary={summaryData}
          loadingSummary={!summaryData}
          department={departmentFilter}
        />
      <AttendanceModeTabs
        mode={viewMode}
        onModeChange={setViewMode}
        range={rangeMode}
        onRangeChange={setRangeMode}
      />
      <AttendanceFilters
        date={normalizedDate}
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
            rangeMode={rangeMode}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
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
        attendanceData={filteredAttendances} 
          weekDates={weekDates}
          page={page}
          pageSize={itemsPerPage}
          total={attendancesData?.total ?? 0} 
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setPage(1); // reset to first page
          }}
        />
      ) : (
        <AttendanceMonthlyTable
        attendanceData={filteredAttendances}
        monthDates={monthDates}
        page={page}
        pageSize={itemsPerPage}
        total={attendancesData?.total ?? 0} // <- Pass total count
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setPage(1); // reset to first page
        }}
      />
      
      )}
      {rangeMode === 'day' && (
       <AttendancePagination
       page={page}
       total={attendancesData?.total ?? 0}
       pageSize={itemsPerPage}
       onPageChange={setPage}
       onPageSizeChange={(size) => {
         setItemsPerPage(size);
         setPage(1); // reset to first page
       }}
     />
      )}
    </div>
  );
};

export default AttendanceTab;