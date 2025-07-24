import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Order } from '../../types/order';
import { ShadeWithBlendDescription } from '../../types/shade';
import { exportOrdersToExcel } from '../../utils/exportToExcel';

interface EnhancedOrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onView: (order: Order) => void;
  selectedOrders: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: 'delete' | 'status', orderIds: string[]) => void;
}

type SortField = 'order_number' | 'buyer' | 'quantity_kg' | 'created_at' | 'delivery_date' | 'status';
type SortDirection = 'asc' | 'desc';

const EnhancedOrdersTable: React.FC<EnhancedOrdersTableProps> = ({
  orders,
  onEdit,
  onDelete,
  onView,
  selectedOrders,
  onSelectionChange,
  onBulkAction
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'order_number':
          aValue = a.order_number;
          bValue = b.order_number;
          break;
        case 'buyer':
          aValue = a.buyer?.name || '';
          bValue = b.buyer?.name || '';
          break;
        case 'quantity_kg':
          aValue = Number(a.quantity_kg);
          bValue = Number(b.quantity_kg);
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'delivery_date':
          aValue = new Date(a.delivery_date);
          bValue = new Date(b.delivery_date);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(sortedOrders.map(order => order.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedOrders, orderId]);
    } else {
      onSelectionChange(selectedOrders.filter(id => id !== orderId));
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-blue-600" />
    );
  };

  const statusBadge = (status: string) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300`}>Pending</span>;
      case 'in_progress':
        return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}>In Progress</span>;
      case 'completed':
        return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`}>Completed</span>;
      case 'dispatched':
        return <span className={`${base} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300`}>Dispatched</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300`}>{status}</span>;
    }
  };

  const getShadeDisplay = (shade: ShadeWithBlendDescription | null) => {
    if (!shade) return <span className="text-gray-400 italic">—</span>;
    
    const hasRawCotton = (shade.raw_cotton_compositions?.length ?? 0) > 0;
    const rawCottonText = hasRawCotton && shade.raw_cotton_compositions?.[0]?.percentage
      ? ` + RAW (${shade.raw_cotton_compositions[0].percentage}%)`
      : '';
    
    return `${shade.shade_code}${rawCottonText}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkAction('status', selectedOrders)}
                className="px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Update Status
              </button>
              <button
                onClick={() => onBulkAction('delete', selectedOrders)}
                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Delete Selected
              </button>
              <button
                onClick={() => {
                  const selected = sortedOrders.filter(order => selectedOrders.includes(order.id));
                  exportOrdersToExcel(selected, 'selected-orders.xlsx');
                }}
                className="px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 border border-green-200 dark:border-green-700 rounded"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === sortedOrders.length && sortedOrders.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('order_number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Order No</span>
                  {getSortIcon('order_number')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('buyer')}
              >
                <div className="flex items-center space-x-1">
                  <span>Buyer</span>
                  {getSortIcon('buyer')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Shade
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('quantity_kg')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Qty (kg)</span>
                  {getSortIcon('quantity_kg')}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Count
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1">
                  <span>Order Date</span>
                  {getSortIcon('created_at')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('delivery_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Delivery</span>
                  {getSortIcon('delivery_date')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onHoverStart={() => setHoveredRow(order.id)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className={`transition-colors ${
                    hoveredRow === order.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                  } ${selectedOrders.includes(order.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {order.buyer?.name || <span className="text-gray-400 italic">—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getShadeDisplay(order.shade)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Number(order.quantity_kg).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {order.count || <span className="text-gray-400 italic">—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(order.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(order.delivery_date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {statusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onView(order)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(order)}
                        className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                        title="Edit Order"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Order"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="text-lg font-medium mb-2">No orders found</div>
                    <div className="text-sm">Try adjusting your search or filters</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedOrdersTable; 