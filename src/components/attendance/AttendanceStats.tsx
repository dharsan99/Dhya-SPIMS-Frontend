import React from 'react';

interface AttendanceStatsProps {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  averageHours: number;
  totalOvertime: number;
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  totalEmployees,
  presentCount,
  absentCount,
  averageHours,
  totalOvertime,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <StatCard label="Total Employees" value={totalEmployees} />
      <StatCard label="Present Today" value={presentCount} />
      <StatCard label="Absent" value={absentCount} />
      <StatCard label="Avg Shift Hours" value={averageHours.toFixed(1)} />
      <StatCard label="Total OT Hours" value={totalOvertime.toFixed(1)} />
    </div>
  );
};

export default AttendanceStats;