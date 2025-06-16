import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from './DashboardCard';

interface DashboardHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  summaryData: {
    totalOrders: number;
    productionToday: number;
    pendingDeliveries: number;
    lowStockItems: number;
  };
  loading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onSearch,
  onFilterChange,
  summaryData,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: 'orders', label: 'Orders' },
    { id: 'production', label: 'Production' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'stock', label: 'Low Stock' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm pb-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 py-2">
        <div className="relative flex-1 min-w-0 w-full">
          <input
            type="text"
            placeholder="Search orders, production, deliveries..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex flex-nowrap gap-3 items-center min-h-[40px]">
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${activeFilters.includes(filter.id)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-center py-2">
        <DashboardCard
          title="Total Orders"
          value={summaryData.totalOrders}
          loading={loading}
          color="blue"
        />
        <DashboardCard
          title="Production Today"
          value={`${summaryData.productionToday} kg`}
          loading={loading}
          color="green"
        />
        <DashboardCard
          title="Pending Deliveries"
          value={summaryData.pendingDeliveries}
          loading={loading}
          color="yellow"
        />
        <DashboardCard
          title="Low Stock Items"
          value={summaryData.lowStockItems}
          loading={loading}
          color="red"
        />
      </div>
    </div>
  );
}; 