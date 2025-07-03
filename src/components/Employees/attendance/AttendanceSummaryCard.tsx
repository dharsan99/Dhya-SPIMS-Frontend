import React from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';

interface Props {
  employees: Employee[];
  attendance: Record<string, AttendanceRow>;
}

const AttendanceSummaryCard: React.FC<Props> = ({ employees, attendance }) => {
  const totalEmployees = employees.length;
  const presentCount = Object.values(attendance).filter(
    (a) => a.status === 'PRESENT' || a.status === 'HALF_DAY'
  ).length;
  const absentCount = totalEmployees - presentCount;

  const totalHours = Object.values(attendance)
    .reduce((sum, a) => sum + (a.total_hours || 0), 0)
    .toFixed(2);

  const totalOvertime = Object.values(attendance)
    .reduce((sum, a) => sum + (a.overtime_hours || 0), 0)
    .toFixed(2);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Employees</p>
        <p className="text-lg font-bold text-gray-800 dark:text-white">{totalEmployees}</p>
      </div>
      <div className="bg-green-100 dark:bg-green-900 shadow rounded-lg p-4">
        <p className="text-sm text-green-700 dark:text-green-300">Present</p>
        <p className="text-lg font-bold text-green-800 dark:text-green-100">{presentCount}</p>
      </div>
      <div className="bg-red-100 dark:bg-red-900 shadow rounded-lg p-4">
        <p className="text-sm text-red-700 dark:text-red-300">Absent</p>
        <p className="text-lg font-bold text-red-800 dark:text-red-100">{absentCount}</p>
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 shadow rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">Total Hours</p>
        <p className="text-lg font-bold text-blue-800 dark:text-blue-100">
          {totalHours} hrs / OT: {totalOvertime} hrs
        </p>
      </div>
    </div>
  );
};

export default AttendanceSummaryCard;