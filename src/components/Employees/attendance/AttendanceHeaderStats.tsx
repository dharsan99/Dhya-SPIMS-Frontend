import React, { useEffect, useState } from 'react';
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
  const [attendance, setAttendance] = useState<Record<string, AttendanceRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

         // ⏳ Wait for 2 seconds before fetching
      await new Promise(resolve => setTimeout(resolve, 2000));

        const rows: AttendanceRow[] = await fetchAttendanceByDate(date);
        const filtered = rows.filter(row =>
          !department || row.department === department
        );
        const map: Record<string, AttendanceRow> = {};
        filtered.forEach(row => {
          map[row.employee_id] = row;
        });
        setAttendance(map);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (date) fetchData();
  }, [date, department]);

  const total = employees.length;
  let presentCount = 0;
  let absentCount = 0;
  let totalOT = 0;
  let totalHours = 0;

  Object.entries(attendance).forEach(([_empId, record]) => {
    const status = record.status?.toUpperCase();

    if (status === 'PRESENT') {
      presentCount += 1;
    } else if (status === 'HALF_DAY') {
      presentCount += 0.5;
    } else {
      absentCount += 1;
    }

    totalHours += record.total_hours || 0;
    totalOT += record.overtime_hours || 0;
  });

  const avgHours = presentCount > 0 ? totalHours / presentCount : 0;

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
      <div className="p-3 rounded bg-blue-100 dark:bg-blue-900 dark:text-white">
        <div className="font-medium text-blue-700 dark:text-blue-300">Present</div>
        <div className="text-lg font-semibold">{presentCount} / {total}</div>
      </div>
      <div className="p-3 rounded bg-green-100 dark:bg-green-900 dark:text-white">
        <div className="font-medium text-green-700 dark:text-green-300">Total OT</div>
        <div className="text-lg font-semibold">{totalOT.toFixed(2)} hrs</div>
      </div>
      <div className="p-3 rounded bg-purple-100 dark:bg-purple-900 dark:text-white">
        <div className="font-medium text-purple-700 dark:text-purple-300">Avg. Shift</div>
        <div className="text-lg font-semibold">{avgHours.toFixed(2)} hrs</div>
      </div>
      <div className="p-3 rounded bg-red-100 dark:bg-red-900 dark:text-white">
        <div className="font-medium text-red-700 dark:text-red-300">Absent</div>
        <div className="text-lg font-semibold">{absentCount}</div>
      </div>
    </div>
  );
};

export default AttendanceHeaderStats;