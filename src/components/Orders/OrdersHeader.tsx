import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  XMarkIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,

  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface OrdersHeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: OrderFilters) => void;
  onAddOrder: () => void;
  onViewToggle: (view: 'table' | 'cards') => void;
  onExportAll?: () => void;
  currentView: 'table' | 'cards';
  totalOrders: number;
  selectedCount: number;
}

export interface OrderFilters {
  buyer?: string;
  status?: string;
  dateRange?: { start: string; end: string };
  count?: string;
  quantityRange?: { min: string; max: string };
  shade?: string;
  deliveryDateRange?: { start: string; end: string };
  createdBy?: string;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: OrderFilters;
  createdAt: string;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  onSearch,
  onFilterChange,
  onAddOrder,
  onViewToggle,
  onExportAll,
  currentView,
  totalOrders,
  selectedCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<OrderFilters>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedOrderFilters');
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, []);

  // Save filters to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedOrderFilters', JSON.stringify(savedFilters));
  }, [savedFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const saveCurrentFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    
    setSavedFilters([...savedFilters, newFilter]);
    setNewFilterName('');
    setShowSavedFilters(false);
  };

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    onFilterChange(savedFilter.filters);
    setShowSavedFilters(false);
  };

  const deleteSavedFilter = (filterId: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== filterId));
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (typeof value !== 'object' || Object.values(value).some(v => v !== undefined && v !== ''))
  );

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Main Header */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Orders Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {totalOrders} orders • {selectedCount > 0 ? `${selectedCount} selected` : 'No selection'}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => onViewToggle('table')}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === 'table'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <TableCellsIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewToggle('cards')}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === 'cards'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
            </div>

            {/* Export All Button */}
            {onExportAll && (
              <button
                onClick={onExportAll}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export All</span>
                <span className="sm:hidden">Export</span>
              </button>
            )}

            {/* Add Order Button */}
            <button
              onClick={onAddOrder}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Order</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by number, buyer, shade..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Saved Filters Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSavedFilters(!showSavedFilters)}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <BookmarkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Saved Filters</span>
                <span className="sm:hidden">Filters</span>
                <ChevronDownIcon className="w-4 h-4 ml-1 sm:ml-2" />
              </button>

              <AnimatePresence>
                {showSavedFilters && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Saved Filters</h3>
                      
                      {savedFilters.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No saved filters</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {savedFilters.map((filter) => (
                            <div key={filter.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700">
                              <button
                                onClick={() => loadSavedFilter(filter)}
                                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-left flex-1"
                              >
                                {filter.name}
                              </button>
                              <button
                                onClick={() => deleteSavedFilter(filter.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {hasActiveFilters && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Filter name"
                              value={newFilterName}
                              onChange={(e) => setNewFilterName(e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={saveCurrentFilter}
                              disabled={!newFilterName.trim()}
                              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                hasActiveFilters
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <FunnelIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
              {hasActiveFilters && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                  {Object.keys(filters).filter(key => {
                    const value = filters[key as keyof OrderFilters];
                    return value !== undefined && value !== '' && 
                      (typeof value !== 'object' || Object.values(value).some(v => v !== undefined && v !== ''));
                  }).length}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Filters */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Basic Filters</h4>
                  
                  {/* Buyer Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buyer
                    </label>
                    <select
                      value={filters.buyer || ''}
                      onChange={(e) => handleFilterChange({ buyer: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Buyers</option>
                      <option value="buyer1">Buyer 1</option>
                      <option value="buyer2">Buyer 2</option>
                      <option value="buyer3">Buyer 3</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="dispatched">Dispatched</option>
                    </select>
                  </div>

                  {/* Count Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Count
                    </label>
                    <select
                      value={filters.count || ''}
                      onChange={(e) => handleFilterChange({ count: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Counts</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                      <option value="60">60</option>
                    </select>
                  </div>
                </div>

                {/* Date Filters */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Filters</h4>
                  
                  {/* Order Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.dateRange?.start || ''}
                        onChange={(e) => handleFilterChange({ 
                          dateRange: { 
                            start: e.target.value, 
                            end: filters.dateRange?.end || '' 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="date"
                        value={filters.dateRange?.end || ''}
                        onChange={(e) => handleFilterChange({ 
                          dateRange: { 
                            start: filters.dateRange?.start || '', 
                            end: e.target.value 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Delivery Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.deliveryDateRange?.start || ''}
                        onChange={(e) => handleFilterChange({ 
                          deliveryDateRange: { 
                            start: e.target.value, 
                            end: filters.deliveryDateRange?.end || '' 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="date"
                        value={filters.deliveryDateRange?.end || ''}
                        onChange={(e) => handleFilterChange({ 
                          deliveryDateRange: { 
                            start: filters.deliveryDateRange?.start || '', 
                            end: e.target.value 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced Filters</h4>
                  
                  {/* Shade Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Shade
                    </label>
                    <input
                      type="text"
                      placeholder="Enter shade code"
                      value={filters.shade || ''}
                      onChange={(e) => handleFilterChange({ shade: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Quantity Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity Range (kg)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.quantityRange?.min || ''}
                        onChange={(e) => handleFilterChange({ 
                          quantityRange: { 
                            min: e.target.value, 
                            max: filters.quantityRange?.max || '' 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.quantityRange?.max || ''}
                        onChange={(e) => handleFilterChange({ 
                          quantityRange: { 
                            min: filters.quantityRange?.min || '', 
                            max: e.target.value 
                          } 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Created By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created By
                    </label>
                    <select
                      value={filters.createdBy || ''}
                      onChange={(e) => handleFilterChange({ createdBy: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Users</option>
                      <option value="user1">User 1</option>
                      <option value="user2">User 2</option>
                      <option value="user3">User 3</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersHeader; 