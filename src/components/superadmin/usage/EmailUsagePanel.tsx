import React from 'react';
import { FiMail, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface EmailUsageStats {
  total_emails_sent: number;
  email_limit: number;
  usage_percentage: number;
  successful_emails: number;
  failed_emails: number;
  success_rate: number;
  average_processing_time: number;
  last_sent_at: string;
  monthly_emails: {
    month: string;
    successful_emails: number;
    failed_emails: number;
    total_emails: number;
  }[];
}

interface EmailUsagePanelProps {
  stats: EmailUsageStats;
}

const EmailUsagePanel: React.FC<EmailUsagePanelProps> = ({ stats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Usage
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track email sending statistics and usage
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FiClock className="w-4 h-4" />
          <span>Last updated: {formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Emails Sent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Emails Sent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total_emails_sent.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <FiMail className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Usage</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.usage_percentage}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.usage_percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.success_rate}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <FiCheckCircle className="w-4 h-4" />
              <span>{stats.successful_emails}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <FiXCircle className="w-4 h-4" />
              <span>{stats.failed_emails}</span>
            </div>
          </div>
        </div>

        {/* Average Processing Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Processing Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatTime(stats.average_processing_time)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500 text-white">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Last sent: {formatDate(stats.last_sent_at)}
          </div>
        </div>

        {/* Email Limit */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Limit
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.email_limit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-500 text-white">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Monthly limit
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Email Trends
        </h3>
        <div className="space-y-3">
          {stats.monthly_emails.slice(-6).map((monthData, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900 dark:text-white min-w-[80px]">
                  {monthData.month}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    ✓ {monthData.successful_emails}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ {monthData.failed_emails}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {monthData.total_emails}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailUsagePanel; 