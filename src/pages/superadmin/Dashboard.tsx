import React from 'react';
import { FiUsers, FiHome, FiActivity, FiTrendingUp } from 'react-icons/fi';

const SuperAdminDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Tenants',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: FiHome,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FiUsers,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: '5,678',
      change: '+8%',
      changeType: 'positive',
      icon: FiActivity,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue',
      value: '₹2.5M',
      change: '+15%',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
    },
  ];

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
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
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
            {[
              {
                action: 'New tenant registered',
                tenant: 'ABC Spinning Mills',
                time: '2 hours ago',
              },
              {
                action: 'System maintenance completed',
                tenant: 'System',
                time: '4 hours ago',
              },
              {
                action: 'User permissions updated',
                tenant: 'XYZ Textiles',
                time: '6 hours ago',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.tenant}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 