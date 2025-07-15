// pullable request
import React, { useMemo } from 'react';
import AttendancePagination from './AttendancePagination';
import { getStatusBadge } from './StatusBadge';
import { getEmployeeSummary } from './utils/attendence';


interface Props {  
  attendanceData: any[];
  monthDates: string[];
  page: number;
  pageSize: number;
  total: number; // <- New prop
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading?: boolean; // <-- Add this
}

const AttendanceMonthlyTable: React.FC<Props> = ({
  attendanceData,
  monthDates,
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false, // <-- Add this
}) => {
  
  // Early return if monthDates is not available
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
          Loading month data...
        </div>
      </div>
    );
  }

  if (!monthDates || !Array.isArray(monthDates) || monthDates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
          Loading month dates...
        </div>
      </div>
    );
  }

  const renderHeaderCell = (label: string, className = '') => (
    <th className={`px-4 py-3 text-center ${className}`}>{label}</th>
  );

  // Ensure employees are unique by ID


  // Memoized attendance lookup by date and employee_id for fast access
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




  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <div className="grid grid-cols-[180px_1fr_240px]">
          {/* Left Fixed Columns */}
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  {renderHeaderCell('T.No')}
                  {renderHeaderCell('Employee')}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {attendanceData.length ? attendanceData.map((emp: any) => (
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
                )) : !loading ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                      No employees found.
                    </td>
                  </tr>
                ) : null}
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
                {attendanceData.length ? attendanceData.map((emp: any) => (
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
                )) : !loading ? (
                  <tr>
                    <td colSpan={monthDates.length} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                      No employees found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Right Summary Columns */}
          <div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  {renderHeaderCell('WD')}
                  {renderHeaderCell('OT')}
                  {renderHeaderCell('TH')}
                  {renderHeaderCell('Wages')}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {attendanceData.length ? attendanceData.map((emp: any) => {const { workDays, totalHours, totalOvertime, wages } = getEmployeeSummary(emp, attendanceMap, monthDates);

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
                }) : !loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                      No employees found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AttendancePagination
          page={page}
          total={total} // ← Use the correct total from props
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
    </div>
  );
};

export default AttendanceMonthlyTable;
