import React from 'react';

interface AttendanceSummary {
  summary_type: 'daily' | 'monthly' | 'custom';
  range: {
    start: string;
    end: string;
  };
  total_employees: number;
  present: number;
  absent: number;
  total_overtime: number;
  average_hours: number;
}

interface Props {
  summary?: AttendanceSummary | null;
  loadingSummary?: boolean;
  department?: string;
}

const AttendanceHeaderStats: React.FC<Props> = ({ summary, loadingSummary }) => {



  console.log('summary', summary)
  if (loadingSummary || !summary) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    present,
    absent,
    total_overtime,
    average_hours,
  } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Present</p>
        <p className="text-2xl font-semibold">{present} </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-green-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Total OT</p>
        <p className="text-2xl font-semibold">{total_overtime.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-purple-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Avg. Shift</p>
        <p className="text-2xl font-semibold">{average_hours.toFixed(2)} <span className="text-sm">hrs</span></p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-red-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Absent</p>
        <p className="text-2xl font-semibold">{absent}</p>
      </div>
    </div>
  );
};

export default AttendanceHeaderStats;
