import React, { useState } from 'react';
import { FiUsers, FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export interface TenantEmailUsage {
  tenantId: string;
  tenantName: string;
  emailsSent: number;
  emailLimit: number;
  usagePercentage: number;
  lastSentAt: string;
}

interface EmailUsageBreakdownProps {
  tenantEmailUsage: TenantEmailUsage[];
}

const EmailUsageBreakdown: React.FC<EmailUsageBreakdownProps> = ({ tenantEmailUsage }) => {
  const [sortField, setSortField] = useState<'usage' | 'name' | 'lastSent'>('usage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSort = (field: 'usage' | 'name' | 'lastSent') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) {
      return {
        icon: FiAlertTriangle,
        bg: 'bg-red-100 dark:bg-red-900',
        color: 'text-red-800 dark:text-red-300'
      };
    } else if (percentage >= 75) {
      return {
        icon: FiAlertCircle,
        bg: 'bg-orange-100 dark:bg-orange-900',
        color: 'text-orange-800 dark:text-orange-300'
      };
    } else {
      return {
        icon: FiCheckCircle,
        bg: 'bg-green-100 dark:bg-green-900',
        color: 'text-green-800 dark:text-green-300'
      };
    }
  };

  const sortedTenants = [...tenantEmailUsage].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'usage':
        aValue = a.usagePercentage;
        bValue = b.usagePercentage;
        break;
      case 'name':
        aValue = a.tenantName.toLowerCase();
        bValue = b.tenantName.toLowerCase();
        break;
      case 'lastSent':
        aValue = new Date(a.lastSentAt).getTime();
        bValue = new Date(b.lastSentAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tenant
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('usage')}
              >
                Emails Sent / Limit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usage %
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('lastSent')}
              >
                Last Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTenants.map((tenant) => {
              const status = getUsageStatus(tenant.usagePercentage);
              const StatusIcon = status.icon;
              return (
                <tr key={tenant.tenantId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.tenantName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {tenant.tenantId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {tenant.emailsSent.toLocaleString()} / {tenant.emailLimit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tenant.usagePercentage}%
                      </span>
                      <div className="ml-2 flex-shrink-0 w-20">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              tenant.usagePercentage >= 90
                                ? 'bg-red-500'
                                : tenant.usagePercentage >= 75
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(tenant.usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(tenant.lastSentAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {tenant.usagePercentage >= 90 ? 'Critical' : tenant.usagePercentage >= 75 ? 'Warning' : 'Normal'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedTenants.length === 0 && (
        <div className="text-center py-8">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No tenant email usage data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailUsageBreakdown; 