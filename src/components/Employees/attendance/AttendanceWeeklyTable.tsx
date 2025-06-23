// pullable request
import React, { useMemo } from 'react';
import AttendancePagination from './AttendancePagination';
import { getStatusBadge } from './StatusBadge';
import { calculateWeeklyTotals } from './utils/attendence';
import { formatINR } from './utils/attendence';


interface Props {
  attendanceData: any[]; // Changed from AttendanceRecord[] to any[] to handle the actual data structure
  weekDates: string[]; // Dates in 'YYYY-MM-DD' format
  page: number;
  pageSize: number;
  total: number; 
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const AttendanceWeeklyTable: React.FC<Props> = ({
  attendanceData,
  weekDates,
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  
  
  // Early return if weekDates is not available
  if (!weekDates || !Array.isArray(weekDates) || weekDates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
          Loading week dates...
        </div>
      </div>
    );
  }
  
  const rows = Array.isArray(attendanceData) ? attendanceData : [];

  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    
    // Process each employee's attendance data
    rows.forEach((row) => {
      if (!row.attendance) return;
      
      // Iterate through the dates in the attendance object
      Object.entries(row.attendance).forEach(([date, attendanceData]: [string, any]) => {
        if (!weekDates.includes(date)) return;
        
        if (!map[date]) map[date] = {};
        map[date][row.employee_id] = {
          ...attendanceData,
          employee_id: row.employee_id,
          employee: row.employee
        };
      });
    });
    
    return map;
  }, [rows, weekDates]);


  const weeklyTotals = useMemo(() => {
    const totals: Record<string, ReturnType<typeof calculateWeeklyTotals>> = {};
    
    attendanceData.forEach((emp) => {
      // The attendance data already comes with the correct structure
      const employeeWithAttendance = {
        employee_id: emp.employee_id,
        employee: { shift_rate: emp.employee?.shift_rate?.toString() || '0' },
        attendance: emp.attendance || {}
      };
      totals[emp.employee_id] = calculateWeeklyTotals(employeeWithAttendance, weekDates);
    });
    return totals;
  }, [attendanceData, weekDates]);

  console.log('weeklyTotals', weeklyTotals);
  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center">T.No</th>
              <th className="px-4 py-3 text-left">Employee</th>
              {weekDates.map((date) => (
                <th key={date} className="px-4 py-3 text-center whitespace-nowrap" title={date}>
                  {date.slice(5)}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Total Hrs</th>
              <th className="px-4 py-3 text-center">Days</th>
              <th className="px-4 py-3 text-center">Overtime</th>
              <th className="px-4 py-3 text-center">Wages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {attendanceData.length > 0 ? (
              attendanceData.map((emp, idx) => {
                const { totalHours, totalDays, totalOvertime, wages } = weeklyTotals[emp.employee_id];

                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {emp.employee.token_no || <span className="italic text-gray-400">–</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px] truncate" title={emp.employee.name}>
                      {emp.employee.name}
                    </td>
                    {weekDates.map((date) => {
                      const att = attendanceMap[date]?.[emp.employee_id];
                      return (
                        <td key={date} className="px-4 py-3 text-center">
                          {getStatusBadge(att?.status)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalHours.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalDays}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalOvertime.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400">
                      {formatINR(wages)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7 + weekDates.length} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AttendancePagination
        page={page}
        total={total} 
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default AttendanceWeeklyTable;
