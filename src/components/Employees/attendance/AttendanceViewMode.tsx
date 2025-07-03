import React from 'react';

import { formatINR } from './utils/attendence';
import { getAttendenceStatusBadge } from './StatusBadge';
import { AttendanceViewModeProps } from './AttendanceTypes';

// 🔹 Shift label and time map
const shiftMap = {
  SHIFT_1: { label: 'Shift 1', time: '6 AM - 2 PM' },
  SHIFT_2: { label: 'Shift 2', time: '2 PM - 10 PM' },
  SHIFT_3: { label: 'Shift 3', time: '10 PM - 6 AM' },
  ABSENT: { label: 'Absent', time: '--:--' },
};

const AttendanceViewMode: React.FC<AttendanceViewModeProps & { date: string }> = ({
  employees,
  loading
}) => {


  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <div className="text-center py-6 text-gray-500 italic dark:text-gray-400">
          Loading attendance...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-center">T.No</th>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-center">Shift</th>
            <th className="px-4 py-3 text-center">Time</th>
            <th className="px-4 py-3 text-center">Overtime</th>
            <th className="px-4 py-3 text-center">Total Hrs</th>
            <th className="px-4 py-3 text-center">Work Days</th>
            <th className="px-4 py-3 text-center">Wages</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {employees.length > 0 ? (
            employees.map((emp, idx) => {
              const isPresent = emp?.status === 'PRESENT';
              const overtime = emp?.overtime_hours || 0;
              const rawShiftKey = isPresent ? emp?.shift?.toUpperCase() ?? 'MORNING' : 'ABSENT';
              const shift = shiftMap[rawShiftKey as keyof typeof shiftMap] ?? shiftMap['ABSENT'];
              const totalHours = isPresent ? 8 + overtime : 0;
              const workDays = isPresent ? 1 : 0;
              const wageRate = Number(emp.shift_rate) ?? 0;
              const wages = (totalHours / 8) * wageRate;


              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {emp.token_no || <span className="italic text-gray-400">–</span>}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px] truncate"
                    title={emp.name}
                  >
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {shift?.label}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {shift.time}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {overtime.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {totalHours}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {workDays}
                  </td>
                  <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400">
                    {formatINR(wages)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getAttendenceStatusBadge(emp?.status)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={9}
                className="text-center py-6 text-gray-500 italic dark:text-gray-400"
              >
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceViewMode;