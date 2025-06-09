import React, { useEffect, useMemo, useState } from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';
import AttendancePagination from './AttendancePagination';
import { fetchAttendanceByDate } from '../../../api/attendance';
import { getStatusBadge } from './StatusBadge';
import { calculateWeeklyTotals } from './utils/attendence';

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
    return <div className="text-center py-6 text-sm text-gray-500">Loading weekly attendance...</div>;
  }

  const cellClass = "px-2 py-2 text-center";

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded border dark:border-gray-700 shadow-sm">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 z-10">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-700">T.No</th>
              <th className="px-4 py-2 border dark:border-gray-700">Employee</th>
              {weekDates.map((date) => (
                <th
                  key={date}
                  className={`${cellClass} border dark:border-gray-700 whitespace-nowrap`}
                  title={date}
                >
                  {date.slice(5)} {/* shows MM-DD */}
                </th>
              ))}
              <th className={`${cellClass} border dark:border-gray-700`}>Total Hrs</th>
              <th className={`${cellClass} border dark:border-gray-700`}>Days</th>
              <th className={`${cellClass} border dark:border-gray-700`}>Overtime</th>
              <th className={`${cellClass} border dark:border-gray-700`}>Wages</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp, i) => {
              const { totalHours, totalDays, totalOvertime, wages } = weeklyTotals[emp.id];

              return (
                <tr
                  key={emp.id}
                  className={`border-t dark:border-gray-700 ${
                    i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <td className="px-4 py-2 text-center">{emp.token_no || '-'}</td>
                  <td className="px-4 py-2 max-w-[120px] truncate">{emp.name}</td>
                  {weekDates.map((date) => {
                    const att = attendanceMap[date]?.[emp.id];
                    return (
                      <td key={date} className={cellClass}>
                        {getStatusBadge(att?.status)}
                      </td>
                    );
                  })}
                  <td className={cellClass}>{totalHours}</td>
                  <td className={cellClass}>{totalDays}</td>
                  <td className={cellClass}>{totalOvertime}</td>
                  <td className={`${cellClass} font-semibold text-green-600 dark:text-green-400`}>
                    ₹{wages.toFixed(2)}
                  </td>
                </tr>
              );
            })}
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