import React from 'react';
import { FiUserX } from 'react-icons/fi';

const AttendanceEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FiUserX className="text-4xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Employees Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        You haven't added any employees yet. Once employees are added, you'll be able to mark their shift-wise attendance for the selected date.
      </p>
    </div>
  );
};

export default AttendanceEmptyState;