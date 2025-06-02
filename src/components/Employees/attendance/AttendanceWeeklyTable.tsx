import React, { useEffect, useState } from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';
import AttendancePagination from './AttendancePagination';
import { fetchAttendanceByDate } from '../../../api/attendance';

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

  const startIndex = (page - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      setLoading(true);
      const newMap: Record<string, Record<string, AttendanceRow>> = {};

      for (const date of weekDates) {
        try {
          const rows = await fetchAttendanceByDate(date);
          newMap[date] = {};

          rows.forEach((row: AttendanceRow) => {
            newMap[date][row.employee_id] = row;
          });
        } catch (err) {
          console.error(`❌ Error fetching attendance for ${date}:`, err);
          newMap[date] = {};
        }
      }

      setAttendanceMap(newMap);
      setLoading(false);
    };

    fetchAllAttendance();
  }, [weekDates]);

  const getStatusBadge = (status?: string) => {
    const normalized = status?.toUpperCase?.();

    switch (normalized) {
      case 'PRESENT':
        return <span className="text-green-600">✅</span>;
      case 'HALF_DAY':
        return <span className="text-yellow-500">½</span>;
      case 'LEAVE':
        return <span className="text-blue-500">📘</span>;
      case 'ABSENT':
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-400">–</span>;
    }
  };

const calculateWeeklyTotals = (emp: Employee) => {
  let totalHours = 0;
  let totalDays = 0;
  let totalOvertime = 0;

  weekDates.forEach((date) => {
    const att = attendanceMap[date]?.[emp.id];

    if (att && att.status !== 'ABSENT') {
      totalHours += att.total_hours;
      totalOvertime += att.overtime_hours;

      if (att.status === 'PRESENT') {
        totalDays += 1;
      } else if (att.status === 'HALF_DAY') {
        totalDays += 0.5;
      }
    }
  });

  const dailyRate = parseFloat(emp.shift_rate.toString());
  const hourlyRate = dailyRate / 8;
  const wages = parseFloat((totalHours * hourlyRate).toFixed(2));

  return { totalHours, totalDays, totalOvertime, wages };
};

  if (loading) {
    return <div className="text-center py-6 text-sm text-gray-500">Loading weekly attendance...</div>;
  }

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
                  className="px-3 py-2 border dark:border-gray-700 text-center whitespace-nowrap"
                  title={date}
                >
                  {date.slice(5)} {/* shows MM-DD */}
                </th>
              ))}
              <th className="px-3 py-2 border dark:border-gray-700 text-center">Total Hrs</th>
              <th className="px-3 py-2 border dark:border-gray-700 text-center">Days</th>
              <th className="px-3 py-2 border dark:border-gray-700 text-center">Overtime</th>
              <th className="px-3 py-2 border dark:border-gray-700 text-center">Wages</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp, i) => {
              const { totalHours, totalDays, totalOvertime, wages } = calculateWeeklyTotals(emp);

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
                      <td key={date} className="px-2 py-2 text-center">
                        {getStatusBadge(att?.status)}
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 text-center">{totalHours}</td>
                  <td className="px-2 py-2 text-center">{totalDays}</td>
                  <td className="px-2 py-2 text-center">{totalOvertime}</td>
                  <td className="px-2 py-2 text-center font-semibold text-green-600 dark:text-green-400">
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