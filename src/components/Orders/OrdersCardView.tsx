import React from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  CubeIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { Order } from '../../types/order';
import { ShadeWithBlendDescription } from '../../types/shade';
import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { HapticFeedback } from '../../utils/hapticFeedback';

interface OrdersCardViewProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onView: (order: Order) => void;
  selectedOrders: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const SWIPE_THRESHOLD = 100; // px

const OrdersCardView: React.FC<OrdersCardViewProps> = ({
  orders,
  onEdit,
  onDelete,
  onView,
  selectedOrders,
  onSelectionChange
}) => {
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

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedOrders, orderId]);
    } else {
      onSelectionChange(selectedOrders.filter(id => id !== orderId));
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.length > 0 ? (
        orders.map((order, index) => {
          // For swipe gesture state
          const dragX = useRef(0);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 ${
                selectedOrders.includes(order.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              drag={isMobile ? 'x' : false}
              dragConstraints={isMobile ? { left: -160, right: 160 } : undefined}
              dragElastic={0.2}
              onDrag={(_e, info) => {
                dragX.current = info.offset.x;
                // Light haptic feedback during swipe
                if (Math.abs(info.offset.x) > 20) {
                  HapticFeedback.swipe();
                }
              }}
              onDragEnd={(_e, info) => {
                if (!isMobile) return;
                if (info.offset.x < -SWIPE_THRESHOLD) {
                  HapticFeedback.delete();
                  onDelete(order.id);
                } else if (info.offset.x > SWIPE_THRESHOLD) {
                  HapticFeedback.edit();
                  onEdit(order);
                }
              }}
              style={isMobile ? {
                x: 0,
                background:
                  dragX.current < -20
                    ? 'linear-gradient(90deg, #fee2e2 60%, #fff 100%)'
                    : dragX.current > 20
                    ? 'linear-gradient(270deg, #fef9c3 60%, #fff 100%)'
                    : undefined,
              } : undefined}
            >
              {/* Swipe Action Visuals (Mobile Only) */}
              {isMobile && (
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center pl-4" style={{ opacity: dragX.current > 20 ? Math.min(dragX.current / 80, 1) : 0 }}>
                    <PencilIcon className="w-6 h-6 text-yellow-500" />
                    <span className="ml-2 text-yellow-700 font-semibold">Edit</span>
                  </div>
                  <div className="flex items-center pr-4" style={{ opacity: dragX.current < -20 ? Math.min(-dragX.current / 80, 1) : 0 }}>
                    <span className="mr-2 text-red-700 font-semibold">Delete</span>
                    <TrashIcon className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              )}
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative z-20 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.buyer?.name || 'No buyer assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onView(order)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className="p-1.5 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors rounded"
                      title="Edit Order"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
                      title="Delete Order"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Shade Information */}
                <div className="flex items-center space-x-2">
                  <CubeIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getShadeDisplay(order.shade)}
                  </span>
                </div>

                {/* Quantity and Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <ScaleIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {Number(order.quantity_kg).toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Count</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.count || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Order Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(order.delivery_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                    {statusBadge(order.status)}
                  </div>
                </div>
              </div>

              {/* Card Footer - Quick Actions */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created {formatDate(order.created_at)}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(order)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => onEdit(order)}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="col-span-full py-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-lg font-medium mb-2">No orders found</div>
            <div className="text-sm">Try adjusting your search or filters</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCardView; 