import React, { useMemo } from 'react';
import AttendancePagination from './AttendancePagination';
import { getStatusBadge } from './StatusBadge';
import { calculateWeeklyTotals, formatINR } from './utils/attendence';

interface Props {
  attendanceData: any[];
  weekDates: string[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  loading?: boolean; // <-- Add this
}

const AttendanceWeeklyTable: React.FC<Props> = ({
  attendanceData = [],
  weekDates = [],
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false, // <-- Add this
}) => {
  const rows = Array.isArray(attendanceData) ? attendanceData : [];

  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    rows.forEach(({ employeeId, employee, attendance }) => {
      if (!attendance) return;
      Object.entries(attendance).forEach(([date, data]) => {
        if (!weekDates.includes(date)) return;
        map[date] ??= {};
        map[date][employeeId] =
          typeof data === 'object' && data !== null
            ? { ...data, employeeId, employee }
            : { employeeId, employee };
      });
    });
    return map;
  }, [rows, weekDates]);

  const weeklyTotals = useMemo(() => {
    return rows.reduce((totals, emp) => {
      totals[emp.employeeId] = calculateWeeklyTotals({
        employeeId: emp.employeeId,
        employee: { shiftRate: emp.employee?.shiftRate?.toString() || '0' },
        attendance: emp.attendance || {},
      }, weekDates);
      return totals;
    }, {} as Record<string, ReturnType<typeof calculateWeeklyTotals>>);
  }, [rows, weekDates]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
        Loading week data...
      </div>
    );
  }

  if (weekDates.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
        Loading week dates...
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
                <th key={date} className="px-4 py-3 text-center" title={date}>
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
            {rows.length ? (
              rows.map((emp, idx) => {
                const empId = emp.employeeId;
                const { tokenNo, name } = emp.employee || {};
                const totals = weeklyTotals[empId] || { totalHours: 0, totalDays: 0, totalOvertime: 0, wages: 0 };

                return (
                  <tr key={empId || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {tokenNo || <span className="italic text-gray-400">–</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px] truncate" title={name}>
                      {name}
                    </td>
                    {weekDates.map((date) => {
                      const status = attendanceMap[date]?.[empId]?.status;
                      return (
                        <td key={date} className="px-4 py-3 text-center">
                          {getStatusBadge(status)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totals.totalHours.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totals.totalDays}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {totals.totalOvertime.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400">
                      {formatINR(totals.wages)}
                    </td>
                  </tr>
                );
              })
            ) : !loading ? (
              <tr>
                <td colSpan={weekDates.length + 7} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                  No employees found.
                </td>
              </tr>
            ) : null}
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

