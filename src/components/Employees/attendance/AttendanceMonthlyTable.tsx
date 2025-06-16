import React, { useEffect, useState } from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';
import AttendancePagination from './AttendancePagination';
import { fetchAttendanceByDate } from '../../../api/attendance';

interface Props {
  employees: Employee[];
  monthDates: string[]; // format: YYYY-MM-DD
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AttendanceMonthlyTable: React.FC<Props> = ({
  employees,
  monthDates,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Record<string, AttendanceRow>>>({});
  const [loading, setLoading] = useState(true);

  const startIdx = (page - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const map: Record<string, Record<string, AttendanceRow>> = {};

      for (const date of monthDates) {
        try {
          const rows = await fetchAttendanceByDate(date);
          map[date] = {};
          rows.forEach((row: AttendanceRow) => {
            map[date][row.employee_id] = row;
          });
        } catch (err) {
          map[date] = {};
        }
      }

      setAttendanceMap(map);
      setLoading(false);
    };

    fetchData();
  }, [monthDates]);

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

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <div className="text-center py-6 text-gray-500 italic dark:text-gray-400">
          Loading monthly attendance...
        </div>
      </div>
    );
  }

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
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {emp.token_no || <span className="italic text-gray-400">–</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[180px] truncate" title={emp.name}>
                      {emp.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scrollable Dates Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
                <tr>
                  {monthDates.map((date) => (
                    <th
                      key={date}
                      title={date}
                      className="px-4 py-3 text-center whitespace-nowrap"
                    >
                      {date.slice(8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {monthDates.map((date) => {
                      const att = attendanceMap[date]?.[emp.id];
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
                    const att = attendanceMap[date]?.[emp.id];
                    if (att && ['PRESENT', 'HALF_DAY'].includes(att.status)) {
                      totalHours += att.total_hours;
                      totalOvertime += att.overtime_hours;
                      workDays += att.status === 'PRESENT' ? 1 : 0.5;
                    }
                  });

                  const hourlyRate = parseFloat(emp.shift_rate.toString()) / 8;
                  const wages = parseFloat((hourlyRate * totalHours).toFixed(2));

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{workDays}</td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{totalOvertime}</td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{totalHours}</td>
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
        total={employees.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default AttendanceMonthlyTable;