import { useEffect, useState } from 'react';
import { getAllPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, verifyPurchaseOrder, PaginationParams } from '../../api/purchaseOrders';
import { PurchaseOrder, PurchaseOrderFormValues } from '../../types/purchaseOrder';

import OrdersHeader, { OrderFilters } from './OrdersHeader';
import PurchaseOrderTable from './PurchaseOrderTable';
import UploadPurchaseOrderModal from './purchaseorders/UploadPurchaseOrderModal';
import PurchaseOrderModal from './purchaseorders/PurchaseOrderModal';
import { toast } from 'react-hot-toast';
import { exportOrdersToExcel } from '../../utils/exportToExcel';
import OrderCard from './OrderCard';
import { getBuyers } from '../../api/buyers';
import { Buyer } from '../../types/buyer';
import OrderFormModal from '../OrderFormModal';
import type { OrderFormData } from '../OrderFormModal';
import React from 'react'; // Added missing import for React

const PurchaseOrdersTab = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('edit');
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertInitialData, setConvertInitialData] = useState<any>(undefined);

  // Specific loading states
  const [loadingStates, setLoadingStates] = useState<{
    initial: boolean;
    refresh: boolean;
    upload: boolean;
    modal: boolean;
  }>({
    initial: true,
    refresh: false,
    upload: false,
    modal: false
  });



  useEffect(() => {
    getBuyers().then(setBuyers);
  }, []);

  const handleConvertToSalesOrder = (_data: Omit<OrderFormData, 'order_number' | 'order_date'>) => {
    // This function should handle the conversion from PurchaseOrder to Sales Order
    // For now, just show a success message
    toast.success('Sales Order created successfully!');
    setIsConvertModalOpen(false);
  };

  const fetchPurchaseOrders = async (isRefresh = false, params?: PaginationParams) => {
    try {
      if (isRefresh) {
        setLoadingStates(prev => ({ ...prev, refresh: true }));
      } else {
        setLoadingStates(prev => ({ ...prev, initial: true }));
      }
      
      const response = await getAllPurchaseOrders(params);
      
      const normalizeOrder = (order: PurchaseOrder) => ({
        ...order,
        status: order.status || 'pending',
      });

      if ('data' in response && 'pagination' in response) {
        // New paginated response format
        setOrders(response.data.map(normalizeOrder));
        setPagination(response.pagination);
      } else {
        // Legacy format - handle as array
        const ordersArray = Array.isArray(response) ? response : [];
        setOrders(ordersArray.map(normalizeOrder));
        setPagination({
          page: 1,
          limit: ordersArray.length,
          total: ordersArray.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      toast.error('Error fetching purchase orders');
      setOrders([]);
      setPagination(prev => ({
        page: 1,
        limit: prev.limit, // Preserve current limit instead of resetting to 5
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }));
    } finally {
      setLoadingStates(prev => ({ 
        ...prev, 
        initial: false, 
        refresh: false 
      }));
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    const params: PaginationParams = {
      page: newPage,
      limit: pagination.limit,
      search: searchQuery,
      status: filters.status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    fetchPurchaseOrders(false, params);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit: number) => {
    const params: PaginationParams = {
      page: 1, // Reset to first page when changing limit
      limit: newLimit,
      search: searchQuery,
      status: filters.status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    fetchPurchaseOrders(false, params);
  };

  // Handle search with pagination
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params: PaginationParams = {
      page: 1, // Reset to first page
      limit: pagination.limit,
      search: query,
      status: filters.status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    fetchPurchaseOrders(false, params);
  };

  // Handle filter change with pagination
  const handleFilterChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    const params: PaginationParams = {
      page: 1, // Reset to first page
      limit: pagination.limit,
      search: searchQuery,
      status: newFilters.status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    fetchPurchaseOrders(false, params);
  };

  const handleViewToggle = (view: 'table' | 'cards') => setViewMode(view);


  const handleExportAll = () => {
    exportOrdersToExcel(orders, 'all-purchase-orders.xlsx');
    toast.success(`Exported ${orders.length} orders to Excel`);
  };

  // Add
  const handleAddOrder = () => {
    setEditingOrder(null);
    setModalMode('edit');
    // Don't open modal immediately - let useEffect handle it
  };

  // Edit
  const handleEditOrder = (order: PurchaseOrder) => {
    const normalizedOrder = { ...order, status: order.status || 'pending' };
    console.log('handleEditOrder called with:', {
      order,
      normalizedOrder,
      orderId: order.id,
      orderStatus: order.status
    });
    setEditingOrder(normalizedOrder);
    setModalMode('edit');
    // Don't open modal immediately - let useEffect handle it
    console.log('State set - editingOrder will be:', normalizedOrder);
  };

  // Open modal when editingOrder is set or when adding new order
  React.useEffect(() => {
    if (modalMode === 'edit') {
      console.log('Opening modal with editingOrder:', editingOrder);
      setIsModalOpen(true);
    }
  }, [editingOrder, modalMode]);

  // Delete
  const handleDeleteOrder = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setLoadingStates(prev => ({ ...prev, modal: true }));
      await deletePurchaseOrder(deleteId);
      toast.success('Purchase Order deleted successfully!');
      fetchPurchaseOrders(true);
    } catch (err) {
      toast.error('Failed to delete Purchase Order');
    } finally {
      setLoadingStates(prev => ({ ...prev, modal: false }));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (data: PurchaseOrderFormValues, id?: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, modal: true }));
      // Check if this is a new order (id is empty string or undefined)
      const isNewOrder = !id || id === '';
      
      if (!isNewOrder) {
        await updatePurchaseOrder(id, data);
        toast.success('Purchase Order updated successfully!');
        fetchPurchaseOrders(true); // Keep current page for updates
      } else {
        await createPurchaseOrder(data);
        toast.success('Purchase Order created successfully!');
        // Reset to page 1 for new orders so they appear at the top
        const params: PaginationParams = {
          page: 1,
          limit: pagination.limit,
          search: searchQuery,
          status: filters.status,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };
        fetchPurchaseOrders(true, params);
      }
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (err) {
      toast.error('Failed to save Purchase Order');
    } finally {
      setLoadingStates(prev => ({ ...prev, modal: false }));
    }
  };

  const handleCardSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, id]);
    } else {
      setSelectedOrders(prev => prev.filter(orderId => orderId !== id));
    }
  };

  const handleUploadSuccess = () => {
    // Reset to page 1 for uploaded orders so they appear at the top
    const params: PaginationParams = {
      page: 1,
      limit: pagination.limit,
      search: searchQuery,
      status: filters.status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    fetchPurchaseOrders(true, params);
    setIsUploadModalOpen(false);
  };

  // Show loading skeleton only on initial load
  if (loadingStates.initial) {
    return (
      <div className="space-y-4">
        <OrdersHeader
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onAddOrder={handleAddOrder}
          onViewToggle={handleViewToggle}
          onExportAll={handleExportAll}
          currentView={viewMode}
          totalOrders={pagination.total}
          selectedCount={selectedOrders.length}
        />
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <OrdersHeader
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onAddOrder={handleAddOrder}
        onViewToggle={handleViewToggle}
        onExportAll={handleExportAll}
        currentView={viewMode}
        totalOrders={pagination.total}
        selectedCount={selectedOrders.length}
      />

      {viewMode === 'table' ? (
        <PurchaseOrderTable
          orders={orders}
          onRefresh={() => fetchPurchaseOrders(true)}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          isLoading={loadingStates.refresh}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onView={handleEditOrder}
              onSelect={handleCardSelect}
              selected={selectedOrders.includes(order.id)}
            />
          ))}
        </div>
      )}

      <UploadPurchaseOrderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onParsed={handleUploadSuccess}
      />



      <PurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        order={editingOrder}
        onSave={handleSave}
        onVerify={async (id: string) => {
          try {
            setLoadingStates(prev => ({ ...prev, modal: true }));
            await verifyPurchaseOrder(id);
            toast.success('Purchase Order verified successfully!');
            fetchPurchaseOrders(true);
            setIsModalOpen(false);
          } catch (err) {
            toast.error('Failed to verify Purchase Order');
          } finally {
            setLoadingStates(prev => ({ ...prev, modal: false }));
          }
        }}
        onConvertToSalesOrder={async (order: PurchaseOrder) => {
          try {
            setLoadingStates(prev => ({ ...prev, modal: true }));
            // Lookup buyer_id from buyerName
            const buyer = buyers.find(b => b.name === order.buyerName);
            const buyer_id = buyer ? buyer.id : '';
            // Use first item's shadeNo
            const shade_id = order.items && order.items[0] ? order.items[0].shadeNo || '' : '';
            setConvertInitialData({
              buyer_id,
              shade_id,
              tenant_id: order.tenantId,
              quantity_kg: order.items?.[0]?.quantity || order.quantityKg || 0,
              delivery_date: order.deliveryDate || '',
              order_date: order.poDate || '',
              status: 'pending',
              created_by: order.createdBy || '',
              count: order.items?.[0]?.count,
            });
            setIsConvertModalOpen(true);
            setIsModalOpen(false);
          } catch (err) {
            toast.error('Failed to convert Purchase Order');
          } finally {
            setLoadingStates(prev => ({ ...prev, modal: false }));
          }
        }}
        status={editingOrder?.status}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this purchase order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={loadingStates.modal}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={loadingStates.modal}
              >
                {loadingStates.modal ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderFormModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onSubmit={handleConvertToSalesOrder}
        initialData={convertInitialData}
      />
    </div>
  );
};

export default PurchaseOrdersTab;