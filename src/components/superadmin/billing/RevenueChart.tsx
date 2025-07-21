import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export interface RevenueTrend {
  month: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueChartProps {
  revenueTrends: RevenueTrend[];
  totalRevenue: number;
  averageMonthlyRevenue: number;
  totalInvoices: number;
  changeFromLastMonth: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueTrends, totalRevenue, averageMonthlyRevenue, totalInvoices, changeFromLastMonth }) => {
  const maxRevenue = Math.max(...revenueTrends.map(d => d.revenue));
  const growthRate = changeFromLastMonth;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center md:text-left">
            Revenue Trends
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
            Monthly revenue over the last 6 months
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            ${totalRevenue.toLocaleString()}
          </p>
          <div className={`flex items-center text-sm ${
            growthRate >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {growthRate >= 0 ? (
              <FiTrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <FiTrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(growthRate).toFixed(1)}% from last month
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {revenueTrends.map((data, index) => {
          const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
          const isCurrentMonth = index === revenueTrends.length - 1;
          return (
            <div key={data.month} className="flex items-end space-x-2">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {data.month}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    ${data.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-8">
                  <div
                    className={`absolute bottom-0 left-0 rounded-full transition-all duration-300 ${
                      isCurrentMonth 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400 dark:bg-gray-500'
                    }`}
                    style={{ 
                      width: `${height}%`,
                      height: '100%'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {data.invoiceCount} invoices
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Monthly Revenue</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${averageMonthlyRevenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {totalInvoices}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Previous Months</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Current Month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart; 