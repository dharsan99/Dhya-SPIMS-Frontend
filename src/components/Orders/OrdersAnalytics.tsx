import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,

  UserGroupIcon,

} from '@heroicons/react/24/outline';
import { Order } from '../../types/order';
import { PurchaseOrder } from '../../types/purchaseOrder';

interface OrdersAnalyticsProps {
  orders: (Order | PurchaseOrder)[];
  type: 'purchase' | 'sales';
}

interface AnalyticsData {
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  dispatchedOrders: number;
  topBuyers: Array<{ name: string; count: number; quantity: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; count: number; quantity: number }>;
  quantityDistribution: Array<{ range: string; count: number }>;
  recentActivity: Array<{ id: string; number: string; buyer: string; status: string; date: string }>;
}

const OrdersAnalytics: React.FC<OrdersAnalyticsProps> = ({ orders, type }) => {
  const analyticsData = useMemo((): AnalyticsData => {
    if (!orders.length) {
      return {
        totalOrders: 0,
        totalQuantity: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        inProgressOrders: 0,
        dispatchedOrders: 0,
        topBuyers: [],
        statusDistribution: [],
        monthlyTrend: [],
        quantityDistribution: [],
        recentActivity: []
      };
    }

    // Calculate basic metrics
    const totalOrders = orders.length;
    const totalQuantity = orders.reduce((sum, order) => {
      const quantity = type === 'purchase' 
        ? (order as PurchaseOrder).items?.[0]?.quantity || 0
        : (order as Order).quantity_kg || 0;
      return sum + quantity;
    }, 0);

    const averageOrderValue = totalQuantity / totalOrders;

    // Status distribution
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / totalOrders) * 100
    }));

    const pendingOrders = statusCounts.pending || 0;
    const completedOrders = statusCounts.completed || 0;
    const inProgressOrders = statusCounts.in_progress || 0;
    const dispatchedOrders = statusCounts.dispatched || 0;

    // Top buyers
    const buyerStats = orders.reduce((acc, order) => {
      const buyerName = type === 'purchase' 
        ? (order as PurchaseOrder).buyerName
        : (order as Order).buyer?.name;
      
      if (buyerName) {
        if (!acc[buyerName]) {
          acc[buyerName] = { count: 0, quantity: 0 };
        }
        acc[buyerName].count++;
        const quantity = type === 'purchase' 
          ? (order as PurchaseOrder).items?.[0]?.quantity || 0
          : (order as Order).quantity_kg || 0;
        acc[buyerName].quantity += quantity;
      }
      return acc;
    }, {} as Record<string, { count: number; quantity: number }>);

    const topBuyers = Object.entries(buyerStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Monthly trend
    const monthlyData = orders.reduce((acc, order) => {
      const date = new Date(type === 'purchase' 
        ? (order as PurchaseOrder).poDate || (order as PurchaseOrder).createdAt
        : (order as Order).created_at
      );
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, quantity: 0 };
      }
      acc[monthKey].count++;
      const quantity = type === 'purchase' 
        ? (order as PurchaseOrder).items?.[0]?.quantity || 0
        : (order as Order).quantity_kg || 0;
      acc[monthKey].quantity += quantity;
      return acc;
    }, {} as Record<string, { count: number; quantity: number }>);

    const monthlyTrend = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Quantity distribution
    const quantityRanges = [
      { min: 0, max: 1000, label: '0-1K kg' },
      { min: 1000, max: 5000, label: '1K-5K kg' },
      { min: 5000, max: 10000, label: '5K-10K kg' },
      { min: 10000, max: Infinity, label: '10K+ kg' }
    ];

    const quantityDistribution = quantityRanges.map(range => {
      const count = orders.filter(order => {
        const quantity = type === 'purchase' 
          ? (order as PurchaseOrder).items?.[0]?.quantity || 0
          : (order as Order).quantity_kg || 0;
        return quantity >= range.min && quantity < range.max;
      }).length;
      return { range: range.label, count };
    });

    // Recent activity
    const recentActivity = orders
      .sort((a, b) => {
        const aDate = type === 'purchase' 
          ? new Date((a as PurchaseOrder).createdAt).getTime()
          : new Date((a as Order).created_at).getTime();
        const bDate = type === 'purchase' 
          ? new Date((b as PurchaseOrder).createdAt).getTime()
          : new Date((b as Order).created_at).getTime();
        return bDate - aDate;
      })
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        number: type === 'purchase' 
          ? (order as PurchaseOrder).poNumber || 'N/A'
          : (order as Order).order_number,
        buyer: type === 'purchase' 
          ? (order as PurchaseOrder).buyerName || 'N/A'
          : (order as Order).buyer?.name || 'N/A',
        status: order.status || 'unknown',
        date: type === 'purchase'
          ? new Date((order as PurchaseOrder).createdAt).toLocaleDateString()
          : new Date((order as Order).created_at).toLocaleDateString()
      }));

    return {
      totalOrders,
      totalQuantity,
      averageOrderValue,
      pendingOrders,
      completedOrders,
      inProgressOrders,
      dispatchedOrders,
      topBuyers,
      statusDistribution,
      monthlyTrend,
      quantityDistribution,
      recentActivity
    };
  }, [orders, type]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'dispatched': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'dispatched': return 'Dispatched';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {type === 'purchase' ? 'Purchase Orders' : 'Sales Orders'} Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Insights and trends for your order data
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <ChartBarIcon className="w-5 h-5" />
          <span>Real-time data</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalQuantity.toLocaleString()} kg
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.pendingOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Buyers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.topBuyers.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {analyticsData.statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).split(' ')[0]}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.count}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Buyers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Buyers</h3>
          <div className="space-y-3">
            {analyticsData.topBuyers.map((buyer, index) => (
              <div key={buyer.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{buyer.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{buyer.count} orders</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {buyer.quantity.toLocaleString()} kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h3>
          <div className="space-y-3">
            {analyticsData.monthlyTrend.slice(-6).map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.count} orders</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity.toLocaleString()} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.number}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{activity.buyer}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quantity Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quantity Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analyticsData.quantityDistribution.map((item) => (
            <div key={item.range} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{item.range}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersAnalytics; 