import React, { useState } from 'react';
import { FiUsers, FiFileText, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { TenantParseUsage } from '../../../types/usage';

interface TenantUsageBreakdownProps {
  tenantUsage: TenantParseUsage[];
}

const TenantUsageBreakdown: React.FC<TenantUsageBreakdownProps> = ({ tenantUsage }) => {
  const [sortBy, setSortBy] = useState<'usage' | 'name' | 'last_parsed'>('usage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedTenants = [...tenantUsage].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'usage':
        comparison = a.usage_percentage - b.usage_percentage;
        break;
      case 'name':
        comparison = a.tenant_name.localeCompare(b.tenant_name);
        break;
      case 'last_parsed':
        comparison = new Date(a.last_parsed_at).getTime() - new Date(b.last_parsed_at).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'usage' | 'name' | 'last_parsed') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: FiAlertTriangle };
    if (percentage >= 75) return { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: FiTrendingUp };
    return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', icon: FiFileText };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tenant Usage Breakdown
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as ['usage' | 'name' | 'last_parsed', 'asc' | 'desc'];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="usage-desc">Usage (High to Low)</option>
              <option value="usage-asc">Usage (Low to High)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="last_parsed-desc">Last Parsed (Recent)</option>
              <option value="last_parsed-asc">Last Parsed (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tenant
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('usage')}
              >
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Orders Parsed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Limit
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('last_parsed')}
              >
                Last Parsed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTenants.map((tenant) => {
              const status = getUsageStatus(tenant.usage_percentage);
              const StatusIcon = status.icon;
              
              return (
                <tr key={tenant.tenant_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.tenant_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {tenant.tenant_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.usage_percentage}%
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 w-20">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              tenant.usage_percentage >= 90 
                                ? 'bg-red-500' 
                                : tenant.usage_percentage >= 75 
                                ? 'bg-orange-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(tenant.usage_percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {tenant.orders_parsed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {tenant.parsing_limit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(tenant.last_parsed_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {tenant.usage_percentage >= 90 ? 'Critical' : tenant.usage_percentage >= 75 ? 'Warning' : 'Normal'}
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
            No tenant parsing data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default TenantUsageBreakdown; 