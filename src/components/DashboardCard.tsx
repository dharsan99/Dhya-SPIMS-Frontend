import { motion } from 'framer-motion';
import { Sparkline } from './ui/Sparkline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardCardProps {
  title: string;
  value: number | string;
  trend?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  onClick?: () => void;
  loading?: boolean;
}

export const DashboardCard = ({
  title,
  value,
  trend,
  sparklineData,
  icon,
  color = 'blue',
  onClick,
  loading = false,
}: DashboardCardProps) => {
  const colorClasses: Record<'blue' | 'green' | 'yellow' | 'red', string> = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 ${colorClasses[color]} cursor-pointer transition-all duration-200`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 dark:text-gray-300 text-sm">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              {trend > 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        
        {sparklineData && (
          <div className="w-24 h-12">
            <Sparkline data={sparklineData} color={color} />
          </div>
        )}
      </div>
    </motion.div>
  );
};