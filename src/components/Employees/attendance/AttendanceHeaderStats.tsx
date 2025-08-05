import React from 'react';
import { motion } from 'framer-motion';

// Skeleton component for AttendanceHeaderStats
const AttendanceHeaderStatsSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8"
  >
    {[1, 2, 3, 4].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-gray-300 dark:border-gray-600 animate-pulse"
      >
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </motion.div>
    ))}
  </motion.div>
);

interface AttendanceSummary {
  totalEmployees: number;
  present: number;
  absent: number;
  halfDay: number;
  totalOvertime: number;
  totalHours: number;
  averageHours: number;
}

interface Props {
  summary?: AttendanceSummary | null;
  loadingSummary?: boolean;
  department?: string;
}

const AttendanceHeaderStats: React.FC<Props> = ({ summary, loadingSummary }) => {
  console.log('summary', summary)

  if (loadingSummary || !summary) {
    return <AttendanceHeaderStatsSkeleton />;
  }

  const {
    present,
    absent,
    totalOvertime,
    averageHours,
  } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Present</p>
        <p className="text-2xl font-semibold">{present} </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-green-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Total OT</p>
        <p className="text-2xl font-semibold">{totalOvertime.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-purple-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Avg. Shift</p>
        <p className="text-2xl font-semibold">{averageHours.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-red-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Absent</p>
        <p className="text-2xl font-semibold">{absent}</p>
      </div>
    </div>
  );
};

export default AttendanceHeaderStats;
