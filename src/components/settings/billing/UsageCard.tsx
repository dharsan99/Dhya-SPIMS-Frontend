import { 

    ArrowUpIcon,
    ArrowDownIcon
  } from '@heroicons/react/24/outline';

export const UsageCard = ({
    title,
    value,
    icon,
    trend,
    trendColor,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: string;
    trendColor: string;
  }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">{icon}</div>
        <div className="ml-4">
          <p className="text-sm md:text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xs md:text-xl  font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      <div className={`mt-4 flex items-center text-sm ${trendColor}`}>
        {trendColor.includes('red') ? (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        )}
        {trend}
      </div>
    </div>
  );
  