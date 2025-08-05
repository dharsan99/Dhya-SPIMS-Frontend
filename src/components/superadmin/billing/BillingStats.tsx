import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { BillingStat } from '../../../api/billing';

interface BillingStatsProps {
  stats: BillingStat[];
}

const colorMap: Record<string, string> = {
  'positive': 'text-green-600 dark:text-green-400',
  'negative': 'text-red-600 dark:text-red-400',
  'neutral': 'text-gray-600 dark:text-gray-400',
};

const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {typeof stat.value === 'number' ? `$${stat.value.toLocaleString()}` : stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>
            {/* Optionally add an icon here if your API provides it */}
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium flex items-center gap-1 ${colorMap[stat.changeType] || colorMap['neutral']}`}
            >
              {stat.changeType === 'positive' && <FiTrendingUp className="w-3 h-3" />}
              {stat.changeType === 'negative' && <FiTrendingDown className="w-3 h-3" />}
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillingStats; 