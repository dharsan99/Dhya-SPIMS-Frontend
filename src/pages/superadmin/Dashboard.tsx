import React from 'react';
import { FiUsers, FiHome, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { DashboardStat, fetchSuperAdminDashboard, fetchSuperAdminSummary, SuperAdminSummary } from '../../api/superadmin';

const iconMap: Record<string, any> = {
  total_tenants: FiHome,
  active_users: FiUsers,
  total_orders: FiActivity,
  revenue: FiTrendingUp,
};

const colorMap: Record<string, string> = {
  total_tenants: 'bg-blue-500',
  active_users: 'bg-green-500',
  total_orders: 'bg-purple-500',
  revenue: 'bg-orange-500',
};

const SuperAdminDashboard: React.FC = () => {
  const { data: stats = [], isLoading } = useQuery<DashboardStat[]>({
    queryKey: ['superadmin-dashboard'],
    queryFn: fetchSuperAdminDashboard,
  });

  const { data: summary, isLoading: isSummaryLoading } = useQuery<SuperAdminSummary>({
    queryKey: ['superadmin-summary'],
    queryFn: fetchSuperAdminSummary,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all tenants and system-wide operations
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-4 text-center py-8 text-gray-500 dark:text-gray-400">Loading stats...</div>
        ) : (
          stats.map((stat: any, index: number) => {
            const Icon = iconMap[stat.key] || FiHome;
            const color = colorMap[stat.key] || 'bg-gray-400';
            const isPositive = (stat.changeType || stat.change_type) === 'positive';
            const changeValue =
              (isPositive ? '+' : '-') + Math.abs(stat.change ?? stat.change_type ?? 0);
            return (
              <div
                key={stat.id || index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-md font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {changeValue}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    from last month
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {isSummaryLoading ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">Loading activity...</div>
            ) : summary?.recentActivities && summary.recentActivities.length > 0 ? (
              summary.recentActivities.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.details || `${activity.type} ${activity.action}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.type}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">No recent activity found</div>
            )}
          </div>
        </div>
      </div>

      {/* Parsing Usage Panel */}
    </div>
  );
};

export default SuperAdminDashboard; 