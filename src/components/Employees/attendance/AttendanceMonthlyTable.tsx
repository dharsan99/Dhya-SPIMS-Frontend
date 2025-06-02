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
          console.error(`❌ Error fetching attendance for ${date}`, err);
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
        return <span className="text-green-600">✅</span>;
      case 'HALF_DAY':
        return <span className="text-yellow-500">½</span>;
      case 'LEAVE':
        return <span className="text-blue-500">📘</span>;
      default:
        return <span className="text-red-500">❌</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Loading monthly attendance...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg shadow-sm dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-[180px_1fr_240px]">
          {/* Left Fixed Columns */}
          <div>
            <table className="text-sm w-full border-separate border-spacing-0">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-gray-800 dark:text-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 dark:border-gray-700">T.No</th>
                  <th className="border-b px-3 py-2 dark:border-gray-700">Employee</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, i) => (
                  <tr
                    key={emp.id}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                  >
                    <td className="px-3 py-2 text-center border-b dark:border-gray-700">
                      {emp.token_no || '-'}
                    </td>
                    <td className="px-3 py-2 border-b dark:border-gray-700 max-w-[180px] truncate" title={emp.name}>
                      {emp.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scrollable Dates Table */}
          <div className="overflow-x-auto">
            <table className="text-sm w-full border-separate border-spacing-0">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-gray-800 dark:text-gray-100">
                <tr>
                  {monthDates.map((date) => (
                    <th
                      key={date}
                      title={date}
                      className="px-3 py-2 border-b text-center whitespace-nowrap dark:border-gray-700"
                    >
                      {date.slice(8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, i) => (
                  <tr
                    key={emp.id}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                  >
                    {monthDates.map((date) => {
                      const att = attendanceMap[date]?.[emp.id];
                      return (
                        <td key={date} className="px-3 py-2 text-center border-b dark:border-gray-700">
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
            <table className="text-sm w-full border-separate border-spacing-0">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-gray-800 dark:text-gray-100">
                <tr>
                  <th className="border-b px-3 py-2 dark:border-gray-700">WD</th>
                  <th className="border-b px-3 py-2 dark:border-gray-700">OT</th>
                  <th className="border-b px-3 py-2 dark:border-gray-700">TH</th>
                  <th className="border-b px-3 py-2 dark:border-gray-700">Wages</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, i) => {
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
                      className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                    >
                      <td className="px-3 py-2 text-center border-b dark:border-gray-700">{workDays}</td>
                      <td className="px-3 py-2 text-center border-b dark:border-gray-700">{totalOvertime}</td>
                      <td className="px-3 py-2 text-center border-b dark:border-gray-700">{totalHours}</td>
                      <td className="px-3 py-2 text-center border-b dark:border-gray-700">₹{wages.toFixed(2)}</td>
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