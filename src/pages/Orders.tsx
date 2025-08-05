import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getAllOrders } from '../api/orders';
import { getBuyers } from '../api/buyers';
import { getAllPurchaseOrders } from '../api/purchaseOrders';
import { Order } from '../types/order';
import { Buyer } from '../types/buyer';
import { exportOrdersToExcel } from '../utils/exportToExcel';

import PurchaseOrdersTab from '../components/Orders/PurchaseOrdersTab';
import TabHeader from '../components/Shared/TabHeader';
import OrdersHeader, { OrderFilters } from '../components/Orders/OrdersHeader';
import EnhancedOrdersTable from '../components/Orders/EnhancedOrdersTable';
import OrdersCardView from '../components/Orders/OrdersCardView';
import OrdersAnalytics from '../components/Orders/OrdersAnalytics';
import OrderFormModal, { OrderFormData } from '../components/OrderFormModal';
import { createOrder } from '../api/orders';

const Orders = () => {
  const [tab, setTab] = useState<'Purchase Order' | 'Sales Order' | 'Buyer' | 'Analytics'>('Purchase Order');
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setBuyers] = useState<Buyer[]>([]);
  const [, setLoading] = useState(true);
  
  // New state for enhanced features
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // New state for analytics
  const [analyticsType, setAnalyticsType] = useState<'purchase' | 'sales'>('purchase');
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);

  // New state for Order Form Modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [, setOrderModalLoading] = useState(false);

  // Responsive: detect if mobile (sm and below)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    }
  };

  const fetchBuyers = async () => {
    try {
      const data = await getBuyers();
      setBuyers(data);
    } catch (err) {
      toast.error('Failed to fetch buyers');
      console.error('Error fetching buyers:', err);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const data = await getAllPurchaseOrders();
      setPurchaseOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchBuyers(), fetchPurchaseOrders()]).finally(() => setLoading(false));
  }, []);

  // Refresh data on tab change
  useEffect(() => {
    if (tab === 'Sales Order') {
      fetchOrders();
    } else if (tab === 'Buyer') {
      fetchBuyers();
    } else if (tab === 'Analytics') {
      // Fetch both types of orders for analytics
      fetchOrders();
      fetchPurchaseOrders();
    }
  }, [tab]);

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.order_number.toLowerCase().includes(searchLower) ||
        order.buyer?.name?.toLowerCase().includes(searchLower) ||
        order.shade?.shade_code?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Buyer filter
    if (filters.buyer && order.buyer?.name !== filters.buyer) {
      return false;
    }

    // Status filter
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    // Count filter
    if (filters.count && String(order.count) !== filters.count) {
      return false;
    }

    // Shade filter
    if (filters.shade && order.shade?.shade_code && !order.shade.shade_code.toLowerCase().includes(filters.shade.toLowerCase())) {
      return false;
    }

    // Quantity range filter
    if (filters.quantityRange?.min || filters.quantityRange?.max) {
      const quantity = order.quantity_kg || 0;
      const min = filters.quantityRange?.min ? parseFloat(filters.quantityRange.min) : 0;
      const max = filters.quantityRange?.max ? parseFloat(filters.quantityRange.max) : Infinity;
      
      if (quantity < min || quantity > max) {
        return false;
      }
    }

    // Created by filter
    if (filters.createdBy && order.created_by !== filters.createdBy) {
      return false;
    }

    // Date range filter (Order date)
    if (filters.dateRange?.start || filters.dateRange?.end) {
      const orderDate = new Date(order.created_at);
      const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

      if (startDate && orderDate < startDate) return false;
      if (endDate && orderDate > endDate) return false;
    }

    // Delivery date range filter
    if (filters.deliveryDateRange?.start || filters.deliveryDateRange?.end) {
      const deliveryDate = order.delivery_date ? new Date(order.delivery_date) : null;
      const startDate = filters.deliveryDateRange?.start ? new Date(filters.deliveryDateRange.start) : null;
      const endDate = filters.deliveryDateRange?.end ? new Date(filters.deliveryDateRange.end) : null;
      
      if (deliveryDate) {
        if (startDate && deliveryDate < startDate) return false;
        if (endDate && deliveryDate > endDate) return false;
      }
    }

    return true;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const handleViewToggle = (view: 'table' | 'cards') => {
    setViewMode(view);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedOrders(selectedIds);
  };

  const handleBulkAction = async (action: 'delete' | 'status', orderIds: string[]) => {
    try {
      if (action === 'delete') {
        // Implement bulk delete
        toast.success(`Deleted ${orderIds.length} orders`);
        await fetchOrders();
      } else if (action === 'status') {
        // Implement bulk status update
        toast.success(`Updated status for ${orderIds.length} orders`);
        await fetchOrders();
      }
      setSelectedOrders([]);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const handleExportAll = () => {
    exportOrdersToExcel(filteredOrders, 'all-sales-orders.xlsx');
    toast.success(`Exported ${filteredOrders.length} orders to Excel`);
  };

  const handleAddOrder = () => {
    setIsOrderModalOpen(true);
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
  };

  const handleOrderSubmit = async (data: Omit<OrderFormData, 'order_number' | 'order_date'>) => {
    setOrderModalLoading(true);
    try {
      // Map status 'dispatched' to 'pending' for createOrder
      const status = data.status === 'dispatched' ? 'pending' : data.status;
      await createOrder({ ...data, status });
      toast.success('Order created successfully!');
      setIsOrderModalOpen(false);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to create order');
    } finally {
      setOrderModalLoading(false);
    }
  };

  // Remove global loading spinner
  // if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Special case for orders staff */}
      {false ? ( // Temporarily disabled for redesign
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Welcome to SPIMS
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You are logged in as an <strong>Order Staff</strong>
              </p>
            </div>
            <p className="mb-8 text-gray-500 dark:text-gray-400">
              Click below to manage orders and track production progress.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Proceed to Orders
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <div className="space-y-0">
          {/* Tab Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4">
              <TabHeader
                tabs={['Purchase Order', 'Sales Order', 'Buyer', 'Analytics'] as const}
                activeTab={tab}
                setActiveTab={setTab}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {tab === 'Purchase Order' ? (
              <PurchaseOrdersTab />
            ) : tab === 'Sales Order' ? (
              <div className="space-y-6">
                {/* Modern Header */}
                <OrdersHeader
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  onAddOrder={handleAddOrder}
                  onViewToggle={handleViewToggle}
                  onExportAll={handleExportAll}
                  currentView={viewMode}
                  totalOrders={filteredOrders.length}
                  selectedCount={selectedOrders.length}
                />
                {/* Order Modal */}
                <OrderFormModal
                  isOpen={isOrderModalOpen}
                  onClose={handleOrderModalClose}
                  onSubmit={handleOrderSubmit}
                />
                {/* Enhanced Table/Card View */}
                <AnimatePresence mode="wait">
                  {isMobile ? (
                    <OrdersCardView
                      orders={filteredOrders}
                      onEdit={() => {
                        toast('Edit functionality will be implemented');
                      }}
                      onDelete={() => {
                        toast('Delete functionality will be implemented');
                      }}
                      onView={() => {
                        toast('View functionality will be implemented');
                      }}
                      selectedOrders={selectedOrders}
                      onSelectionChange={handleSelectionChange}
                    />
                  ) : viewMode === 'table' ? (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EnhancedOrdersTable
                        orders={filteredOrders}
                        onEdit={() => {
                          toast('Edit functionality will be implemented');
                        }}
                        onDelete={() => {
                          toast('Delete functionality will be implemented');
                        }}
                        onView={() => {
                          toast('View functionality will be implemented');
                        }}
                        selectedOrders={selectedOrders}
                        onSelectionChange={handleSelectionChange}
                        onBulkAction={handleBulkAction}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cards"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <OrdersCardView
                        orders={filteredOrders}
                        onEdit={() => {
                          toast('Edit functionality will be implemented');
                        }}
                        onDelete={() => {
                          toast('Delete functionality will be implemented');
                        }}
                        onView={() => {
                          toast('View functionality will be implemented');
                        }}
                        selectedOrders={selectedOrders}
                        onSelectionChange={handleSelectionChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : tab === 'Buyer' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Buyers Management
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your buyers and their information
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Buyers Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      This feature is coming soon. You'll be able to manage buyers, view their details, and track their orders.
                    </p>
                    <button
                      onClick={() => toast('Buyers management feature coming soon!')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            ) : tab === 'Analytics' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Orders Analytics
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Comprehensive insights and trends for your order data
                    </p>
                  </div>
                </div>

                {/* Analytics Tabs */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6">
                      <button
                        onClick={() => setAnalyticsType('purchase')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          analyticsType === 'purchase'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Purchase Orders
                      </button>
                      <button
                        onClick={() => setAnalyticsType('sales')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          analyticsType === 'sales'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Sales Orders
                      </button>
                    </nav>
                  </div>
                  <div className="p-6">
                    <OrdersAnalytics
                      orders={analyticsType === 'purchase' ? purchaseOrders : filteredOrders}
                      type={analyticsType}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;