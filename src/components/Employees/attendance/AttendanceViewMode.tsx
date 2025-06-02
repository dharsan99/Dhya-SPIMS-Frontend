import React, { useEffect, useState } from 'react';
import { AttendanceViewModeProps } from './AttendanceTypes';
import { fetchAttendanceByDate } from '../../../api/attendance';

const shiftMap = {
  SHIFT_1: { label: 'Shift 1', time: '6 AM - 2 PM' },
  SHIFT_2: { label: 'Shift 2', time: '2 PM - 10 PM' },
  SHIFT_3: { label: 'Shift 3', time: '10 PM - 6 AM' },
  ABSENT: { label: 'Absent', time: '--:--' },
};

// 💰 Format INR currency
const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);

const AttendanceViewMode: React.FC<AttendanceViewModeProps & { date: string }> = ({
  employees,
  pageStart,
  date,
}) => {
  const [attendance, setAttendance] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {

    try {
      const records = await fetchAttendanceByDate(date);

      const map: Record<string, any> = {};
      records.forEach((rec: any) => {
        map[rec.employee_id] = rec;
      });

      setAttendance(map);
    } catch (err) {
      console.error('❌ Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [date]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PRESENT':
        return <span className="text-green-600 font-semibold">✅ Present</span>;
      case 'HALF_DAY':
        return <span className="text-yellow-500 font-semibold">⚠️ Half Day</span>;
      default:
        return <span className="text-red-500 font-semibold">❌ Absent</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-sm text-gray-600">Loading attendance...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
      <table className="min-w-full text-sm table-auto">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-gray-800 dark:text-gray-100 text-center">
          <tr className="text-xs">
            <th className="px-3 py-2 border">T.No</th>
            <th className="px-3 py-2 border text-left">Employee</th>
            <th className="px-3 py-2 border">Shift</th>
            <th className="px-3 py-2 border">Time</th>
            <th className="px-3 py-2 border">Overtime</th>
            <th className="px-3 py-2 border">Total Hrs</th>
            <th className="px-3 py-2 border">Work Days</th>
            <th className="px-3 py-2 border">Wages</th>
            <th className="px-3 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, idx) => {
  const att = attendance[emp.id];
  const isPresent = att?.status === 'PRESENT';
  const overtime = att?.overtime_hours || 0;
  const shiftKey = isPresent ? att.shift || 'SHIFT_1' : 'ABSENT';
  const shift = shiftMap[shiftKey as keyof typeof shiftMap];
  const totalHours = isPresent ? 8 + overtime : 0;
  const workDays = isPresent ? 1 : 0;
  const wageRate = emp.shift_rate ?? 0;
  const wages = (totalHours / 8) * wageRate;


            return (
              <tr
                key={emp.id}
                className={`border-t dark:border-gray-700 ${
                  idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <td className="px-3 py-2 text-center text-xs text-gray-700 dark:text-gray-200">
                  {emp.token_no || pageStart + idx + 1}
                </td>
                <td
                  className="px-3 py-2 font-medium text-gray-900 dark:text-white max-w-[200px] truncate"
                  title={emp.name}
                >
                  {emp.name}
                </td>
                <td className="px-3 py-2 text-center">{shift.label}</td>
                <td className="px-3 py-2 text-center">{shift.time}</td>
                <td className="px-3 py-2 text-center">{overtime}</td>
                <td className="px-3 py-2 text-center">{totalHours}</td>
                <td className="px-3 py-2 text-center">{workDays}</td>
                <td className="px-3 py-2 text-center">{formatINR(wages)}</td>
                <td className="px-3 py-2 text-center">{getStatusBadge(att?.status)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceViewMode;