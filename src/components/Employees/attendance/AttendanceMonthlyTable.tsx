import React, { useMemo } from 'react';
import AttendancePagination from './AttendancePagination';
import { AttendanceRecord } from '@/types/attendance';


interface Props {
  employees: any[];
  attendanceData: any[]; // Changed from AttendanceRecord[] to any[] to handle the actual data structure
  monthDates: string[]; // format: YYYY-MM-DD
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AttendanceMonthlyTable: React.FC<Props> = ({
  employees,
  attendanceData,
  monthDates,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  console.log('attendanceData', attendanceData);
  console.log('monthDates', monthDates);
  
  // Early return if monthDates is not available
  if (!monthDates || !Array.isArray(monthDates) || monthDates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
          Loading month dates...
        </div>
      </div>
    );
  }

  // Ensure employees are unique by ID
  const uniqueEmployees = attendanceData;

  const startIdx = (page - 1) * pageSize;
  const paginatedEmployees = uniqueEmployees.slice(startIdx, startIdx + pageSize);

  // Convert attendance data to a map for fast lookup
  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    
    // Process each employee's attendance data
    attendanceData.forEach((row) => {
      if (!row.attendance) return;
      
      // Iterate through the dates in the attendance object
      Object.entries(row.attendance).forEach(([date, attendanceData]: [string, any]) => {
        if (!monthDates.includes(date)) return;
        
        if (!map[date]) map[date] = {};
        map[date][row.employee_id] = {
          ...attendanceData,
          employee_id: row.employee_id,
          employee: row.employee
        };
      });
    });
    
    return map;
  }, [attendanceData, monthDates]);

  console.log('attendanceMap', attendanceMap);

  const getStatusBadge = (status?: string) => {
    const normalized = status?.toUpperCase();
    switch (normalized) {
      case 'PRESENT':
        return <span className="text-green-600 dark:text-green-400">✅</span>;
      case 'HALF_DAY':
        return <span className="text-yellow-500 dark:text-yellow-400">½</span>;
      case 'LEAVE':
        return <span className="text-blue-500 dark:text-blue-400">📘</span>;
      default:
        return <span className="text-red-500 dark:text-red-400">❌</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <div className="grid grid-cols-[180px_1fr_240px]">
          {/* Left Fixed Columns */}
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center">T.No</th>
                  <th className="px-4 py-3 text-left">Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {emp.employee.token_no || <span className="italic text-gray-400">–</span>}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-900 dark:text-white max-w-[180px] truncate"
                      title={emp.employee.name}
                    >
                      {emp.employee.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Center: Daily Attendance */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  {monthDates.map((date) => (
                    <th key={date} title={date} className="px-4 py-3 text-center whitespace-nowrap">
                      {date.slice(8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {monthDates.map((date) => {
                      const att = attendanceMap[date]?.[emp.employee_id];
                      return (
                        <td key={date} className="px-4 py-3 text-center">
                          {getStatusBadge(att?.status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Summary Columns */}
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center">WD</th>
                  <th className="px-4 py-3 text-center">OT</th>
                  <th className="px-4 py-3 text-center">TH</th>
                  <th className="px-4 py-3 text-center">Wages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedEmployees.map((emp) => {
                  let workDays = 0;
                  let totalHours = 0;
                  let totalOvertime = 0;

                  monthDates.forEach((date) => {
                    const att = attendanceMap[date]?.[emp.employee_id];
                    if (att && ['PRESENT', 'HALF_DAY'].includes(att.status)) {
                      totalHours += att.total_hours;
                      totalOvertime += att.overtime_hours;
                      workDays += att.status === 'PRESENT' ? 1 : 0.5;
                    }
                  });

                  const hourlyRate = Number(emp.employee.shift_rate || 0) / 8;
                  const wages = parseFloat((hourlyRate * totalHours).toFixed(2));

                  return (
                    <tr key={emp.employee_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{workDays}</td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{totalOvertime.toFixed(3)}</td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{totalHours.toFixed(3)}</td>
                      <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400 font-semibold">
                        ₹{wages.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AttendancePagination
        page={page}
        total={uniqueEmployees.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default AttendanceMonthlyTable;
