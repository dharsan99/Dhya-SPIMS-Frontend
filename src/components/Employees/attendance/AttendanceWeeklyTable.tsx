import React, { useEffect, useMemo, useState } from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';
import AttendancePagination from './AttendancePagination';
import { fetchAttendanceByDate } from '../../../api/attendance';
import { getStatusBadge } from './StatusBadge';
import { calculateWeeklyTotals } from './utils/attendence';
import { formatINR } from './utils/attendence';

interface Props {
  employees: Employee[];
  weekDates: string[]; // Dates in 'YYYY-MM-DD' format
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const AttendanceWeeklyTable: React.FC<Props> = ({
  employees,
  weekDates,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Record<string, AttendanceRow>>>({});
  const [loading, setLoading] = useState(true);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return employees.slice(startIndex, startIndex + pageSize);
  }, [employees, page, pageSize]);

  const weeklyTotals = useMemo(() => {
    const totals: Record<string, ReturnType<typeof calculateWeeklyTotals>> = {};
    employees.forEach((emp) => {
      totals[emp.id] = calculateWeeklyTotals(emp, attendanceMap, weekDates);
    });
    return totals;
  }, [employees, attendanceMap, weekDates]);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      setLoading(true);

      const results = await Promise.all(
        weekDates.map((date) =>
          fetchAttendanceByDate(date)
            .then((rows) => ({ date, rows }))
            .catch((err) => {
              console.error(`❌ Error fetching attendance for ${date}:`, err);
              return { date, rows: [] };
            })
        )
      );

      const newMap: Record<string, Record<string, AttendanceRow>> = {};
      results.forEach(({ date, rows }) => {
        newMap[date] = {};
        rows.forEach((row: any) => {
          newMap[date][row.employee_id] = row;
        });
      });

      setAttendanceMap(newMap);
      setLoading(false);
    };

    fetchAllAttendance();
  }, [weekDates]);

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <div className="text-center py-6 text-gray-500 italic dark:text-gray-400">
          Loading weekly attendance...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center">T.No</th>
              <th className="px-4 py-3 text-left">Employee</th>
              {weekDates.map((date) => (
                <th
                  key={date}
                  className="px-4 py-3 text-center whitespace-nowrap"
                  title={date}
                >
                  {date.slice(5)} {/* shows MM-DD */}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Total Hrs</th>
              <th className="px-4 py-3 text-center">Days</th>
              <th className="px-4 py-3 text-center">Overtime</th>
              <th className="px-4 py-3 text-center">Wages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp, idx) => {
                const { totalHours, totalDays, totalOvertime, wages } = weeklyTotals[emp.id];

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {emp.token_no || (page - 1) * pageSize + idx + 1}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px] truncate"
                      title={emp.name}
                    >
                      {emp.name}
                    </td>
                    {weekDates.map((date) => {
                      const att = attendanceMap[date]?.[emp.id];
                      return (
                        <td key={date} className="px-4 py-3 text-center">
                          {getStatusBadge(att?.status)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalHours}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalDays}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totalOvertime}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400">
                      {formatINR(wages)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7 + weekDates.length}
                  className="text-center py-6 text-gray-500 italic dark:text-gray-400"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AttendancePagination
        page={page}
        total={employees.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default AttendanceWeeklyTable;