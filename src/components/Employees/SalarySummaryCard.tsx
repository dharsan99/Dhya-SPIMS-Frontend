import React from 'react';
import { EmployeeSalarySummary } from '../../types/employee';

interface SalarySummaryCardProps {
  employees: EmployeeSalarySummary[];
}

const SalarySummaryCard: React.FC<SalarySummaryCardProps> = ({ employees }) => {
  const totalSalary = employees.reduce((sum, e) => sum + e.salary_computed, 0);
  const totalHours = employees.reduce((sum, e) => sum + e.total_hours, 0);
  const averageOvertime =
    employees.length > 0
      ? employees.reduce((sum, e) => sum + e.overtime_hours, 0) / employees.length
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Total Salary Payout</p>
        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
          ₹{totalSalary.toLocaleString()}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-indigo-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Total Work Hours</p>
        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
          {totalHours} hrs
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-yellow-500">
        <p className="text-gray-500 dark:text-gray-300 text-sm">Avg. Overtime</p>
        <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
          {averageOvertime.toFixed(1)} hrs
        </p>
      </div>
    </div>
  );
};

export default SalarySummaryCard;