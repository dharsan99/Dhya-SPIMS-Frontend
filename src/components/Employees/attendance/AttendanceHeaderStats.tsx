import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AttendanceRow, AttendanceHeaderStatsProps } from './AttendanceTypes';
import { fetchAttendanceByDate } from '../../../api/attendance';

interface Props extends AttendanceHeaderStatsProps {
  date: string;
  department?: string;
}

const AttendanceHeaderStats: React.FC<Props> = ({
  employees,
  date,
  department,
}) => {
  const { data = [], isLoading } = useQuery<AttendanceRow[]>({
    queryKey: ['attendance', date],
    queryFn: () => fetchAttendanceByDate(date),
    enabled: !!date,
  });

  const attendanceMap: Record<string, AttendanceRow> = React.useMemo(() => {
    const filtered = department
      ? data.filter((row) => row.department === department)
      : data;
    const map: Record<string, AttendanceRow> = {};
    filtered.forEach((row) => {
      map[row.employee_id] = row;
    });
    return map;
  }, [data, department]);

  const total = employees.length;
  let presentCount = 0;
  let absentCount = 0;
  let totalOT = 0;
  let totalHours = 0;

  employees
    .filter((e) => !department || e.department === department)
    .forEach((emp) => {
      const record = attendanceMap[emp.id];
      const status = record?.status?.toUpperCase();

      if (status === 'PRESENT') {
        presentCount += 1;
      } else if (status === 'HALF_DAY') {
        presentCount += 0.5;
      } else {
        absentCount += 1;
      }

      totalHours += record?.total_hours || 0;
      totalOT += record?.overtime_hours || 0;
    });

  const avgHours = presentCount > 0 ? totalHours / presentCount : 0;

  if (isLoading) {
    return <div className="text-gray-500 text-sm">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Present</p>
        <p className="text-2xl font-semibold">{presentCount} / {total}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-green-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Total OT</p>
        <p className="text-2xl font-semibold">{totalOT.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-purple-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Avg. Shift</p>
        <p className="text-2xl font-semibold">{avgHours.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-red-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Absent</p>
        <p className="text-2xl font-semibold">{absentCount}</p>
      </div>
    </div>
  );
};

export default AttendanceHeaderStats;