import React, { useState, useEffect } from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../types/purchaseOrder';
import PurchaseOrderReviewForm from './purchaseorders/PurchaseOrderReviewForm';
import { updatePurchaseOrder, deletePurchaseOrder } from '../../api/purchaseOrders';
import { verifyPurchaseOrder } from '../../api/purchaseOrders';
import { toast } from 'react-hot-toast'; // or your notification system
import Pagination from '../Pagination';
import TruncatedText from '../ui/TruncatedText';
import OrderFormModal, { OrderFormData } from '../OrderFormModal';
import { createOrder } from '../../api/orders';
import { getBuyers } from '../../api/buyers';
import { Buyer } from '../../types/buyer';
import { TailwindDialog } from '../ui/Dialog';

import PurchaseOrderCard from './PurchaseOrderCard';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to map PurchaseOrder to PurchaseOrderFormValues
const mapPurchaseOrderToFormValues = (order: PurchaseOrder): PurchaseOrderFormValues => {
  console.log('Mapping order:', order); // Debug log
  
  const mappedData = {
    poNumber: order.poNumber || '',
    poDate: order.poDate,
    buyerName: order.buyerName || '',
    buyerContactName: order.buyerContactName,
    buyerContactPhone: order.buyerContactPhone,
    buyerEmail: order.buyerEmail,
    buyerAddress: order.buyerAddress,
    buyerGstNo: order.buyerGstNo,
    buyerPanNo: order.buyerPanNo,
    supplierName: order.supplierName,
    supplierGstNo: order.supplierGstNo,
    paymentTerms: order.paymentTerms,
    styleRefNo: order.styleRefNo,
    deliveryAddress: order.deliveryAddress,
    taxDetails: order.taxDetails,
    grandTotal: order.grandTotal || 0,
    amountInWords: order.amountInWords,
    notes: order.notes,
    items: (order.items || []).map(item => ({
      orderCode: item.orderCode,
      yarnDescription: item.yarnDescription || '',
      color: item.color,
      count: item.count,
      uom: item.uom,
      bagCount: item.bagCount,
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      gstPercent: item.gstPercent,
      taxableAmount: item.taxableAmount || 0,
      shadeNo: item.shadeNo,
    })),
  };
  
  console.log('Mapped data:', mappedData); // Debug log
  return mappedData;
};

interface Props {
  orders?: PurchaseOrder[];
  onRefresh: () => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  isLoading?: boolean;
}

// Add a hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// Helper to always return a valid backgroundColor for row animation
function getRowBgColor(isSelected: boolean, hover: boolean = false): string {
  if (isSelected) {
    return hover ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
  } else {
    return hover ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0,0,0,0)';
  }
}

const PurchaseOrderTable: React.FC<Props> = ({ 
  orders = [], 
  onRefresh, 
  pagination,
  onPageChange,
  onRowsPerPageChange,
  isLoading = false
}) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'verify' | 'authorize'>('view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertInitialData, setConvertInitialData] = useState<OrderFormData | undefined>(undefined);

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  // Add local state for editing form data
  const [editFormData, setEditFormData] = useState<PurchaseOrderFormValues | null>(null);
  
  // Sorting state

  // Multi-column sorting state
  const [sortColumns, setSortColumns] = useState<Array<{field: string, direction: 'asc' | 'desc'}>>([
    { field: 'poDate', direction: 'desc' }
  ]);
  // Row selection state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // Bulk action state
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Specific loading states
  const [loadingStates, setLoadingStates] = useState<{
    table: boolean;
    rowActions: { [key: string]: 'edit' | 'delete' | 'verify' | null };
    bulkActions: boolean;
    modal: boolean;
  }>({
    table: false,
    rowActions: {},
    bulkActions: false,
    modal: false
  });

  // Loading state helpers
  const setRowLoading = (orderId: string, action: 'edit' | 'delete' | 'verify' | null) => {
    setLoadingStates(prev => ({
      ...prev,
      rowActions: { ...prev.rowActions, [orderId]: action }
    }));
  };

  const setBulkLoading = (loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, bulkActions: loading }));
  };

  const setModalLoading = (loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, modal: loading }));
  };



  const openModal = (order: PurchaseOrder, mode: 'view' | 'edit' | 'verify' | 'authorize') => {
    console.log('openModal called with:', { orderId: order.id, mode });
    setSelectedOrder(order);
    setModalMode(mode);
    setIsReviewOpen(true);
    if (mode === 'edit') {
      setEditFormData(mapPurchaseOrderToFormValues(order));
    } else {
      setEditFormData(null);
    }
  };

  const closeReviewModal = () => {
    setSelectedOrder(null);
    setIsReviewOpen(false);
    setEditFormData(null);
  };

  // 🔧 Add this function to handle saving updated order

const handleSave = async (data: PurchaseOrderFormValues, orderId: string) => {
  try {
    await updatePurchaseOrder(orderId, data);
    onRefresh();
    setIsReviewOpen(false);
    setSelectedOrder(null);
  } catch (error) {
    console.error('❌ Failed to update order:', error);
  }
};




const handleDelete = async (id: string) => {
  console.log('handleDelete called with id:', id);
  setDeleteId(id);
  setShowDeleteConfirm(true);
};

const confirmDelete = async () => {
  if (!deleteId) return;
  try {
    setRowLoading(deleteId, 'delete');
    await deletePurchaseOrder(deleteId);
    toast.success('Purchase Order deleted successfully!');
    onRefresh();
  } catch (err) {
    toast.error('Failed to delete Purchase Order');
  } finally {
    setShowDeleteConfirm(false);
    setDeleteId(null);
    closeReviewModal();
    setRowLoading(deleteId, null);
  }
};

  const handleConvertToSalesOrder = (order: PurchaseOrder) => {
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
  };

  const handleConvertModalClose = () => {
    setIsConvertModalOpen(false);
    setConvertInitialData(undefined);
  };

  const handleConvertSubmit = async (data: Omit<OrderFormData, 'order_number' | 'order_date'>) => {
    try {
      // Map status 'dispatched' to 'pending' for createOrder
      const status = data.status === 'dispatched' ? 'pending' : data.status;
      await createOrder({ ...data, status });
      toast.success('Sales Order created and linked!');
      setIsConvertModalOpen(false);
      setConvertInitialData(undefined);
      onRefresh();
    } catch (err) {
      toast.error('Failed to create sales order');
    }
  };

  // Save handler for Save Changes button
  const handleSaveClick = async () => {
    if (!selectedOrder || !editFormData) return;
    try {
      setModalLoading(true);
      await handleSave(editFormData, selectedOrder.id);
      toast.success('Purchase Order updated successfully!');
      closeReviewModal();
    } catch (error) {
      toast.error('Failed to update Purchase Order');
    } finally {
      setModalLoading(false);
    }
  };

  const isEmpty = !orders.length;

  useEffect(() => {
    getBuyers().then(setBuyers);
  }, []);

  // Reset page when orders change
  React.useEffect(() => {
    // setPage(1); // Removed local pagination state
  }, [orders.length]);

  // Enhanced sorting logic with multi-column support
  const sortedOrders = React.useMemo(() => {
    const sorted = [...orders];
    sorted.sort((a, b) => {
      for (const { field, direction } of sortColumns) {
        let aVal: string | number = '';
        let bVal: string | number = '';
        
        // Safe field access with type checking
        const aField = a[field as keyof PurchaseOrder];
        const bField = b[field as keyof PurchaseOrder];
        
        if (field === 'poDate') {
          aVal = a.poDate ? new Date(a.poDate).getTime() : 0;
          bVal = b.poDate ? new Date(b.poDate).getTime() : 0;
        } else {
          // Convert to string safely
          aVal = String(aField || '').toLowerCase();
          bVal = String(bField || '').toLowerCase();
        }
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [orders, sortColumns]);

  // Use sorted orders directly - no client-side pagination needed
  const displayOrders = sortedOrders;

  // Bulk selection logic
  const allSelected = displayOrders.length > 0 && displayOrders.every(o => selectedRows.includes(o.id));
  const toggleAll = () => {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(displayOrders.map(o => o.id));
  };
  const toggleRow = (id: string) => {
    setSelectedRows(rows => rows.includes(id) ? rows.filter(r => r !== id) : [...rows, id]);
  };
  const handleBulkDelete = async () => {
    try {
      setBulkLoading(true);
      for (const id of selectedRows) {
        await deletePurchaseOrder(id);
      }
      toast.success('Selected orders deleted');
      setSelectedRows([]);
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete some orders');
    } finally {
      setBulkLoading(false);
    }
  };

  // Enhanced bulk actions
  const handleBulkExport = () => {
    try {
      setBulkLoading(true);
      const selectedOrders = displayOrders.filter(order => selectedRows.includes(order.id));
      const csvContent = [
        ['PO Number', 'Date', 'Buyer', 'Status', 'Quantity'],
        ...selectedOrders.map(order => [
          order.poNumber || '',
          order.poDate ? new Date(order.poDate).toLocaleDateString() : '',
          order.buyerName || '',
          order.status || '',
          order.items?.[0]?.quantity || ''
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase_orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Selected orders exported');
    } catch (error) {
      toast.error('Failed to export orders');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkStatusChange = async (_newStatus: string) => {
    try {
      setBulkLoading(true);
      // This would need backend support for bulk status updates
      toast.success('Bulk status update feature coming soon');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDuplicate = () => {
    try {
      setBulkLoading(true);
      // This would need backend support for bulk duplication
      toast.success('Bulk duplicate feature coming soon');
    } catch (error) {
      toast.error('Failed to duplicate orders');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle column sorting with shift+click for multi-column
  const handleColumnSort = (field: string, event: React.MouseEvent) => {
    const isShiftClick = event.shiftKey;
    
    if (isShiftClick) {
      // Add to existing sort columns
      setSortColumns(prev => {
        const existing = prev.find(col => col.field === field);
        if (existing) {
          // Toggle direction if already exists
          return prev.map(col => 
            col.field === field 
              ? { ...col, direction: col.direction === 'asc' ? 'desc' : 'asc' }
              : col
          );
        } else {
          // Add new column
          return [...prev, { field, direction: 'asc' }];
        }
      });
    } else {
      // Single column sort (replace all)
      setSortColumns([{ field, direction: 'asc' }]);
    }
  };

  // Get sort indicator for a column
  const getSortIndicator = (field: string) => {
    const column = sortColumns.find(col => col.field === field);
    if (!column) return '';
    return column.direction === 'asc' ? '▲' : '▼';
  };

  // Clear all selections when changing pages
  React.useEffect(() => {
    setSelectedRows([]);
  }, [pagination?.page]);

  // Show bulk actions when selections change
  React.useEffect(() => {
    setShowBulkActions(selectedRows.length > 0);
  }, [selectedRows.length]);

  const isMobile = useIsMobile();

  return (
    <>
      <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg">
        {isMobile ? (
          <div className="p-2">
            {displayOrders.map((order: PurchaseOrder) => (
              <PurchaseOrderCard
                key={order.id}
                order={order}
                onEdit={() => openModal(order, 'edit')}
                onView={() => openModal(order, 'view')}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Enhanced bulk actions bar */}
            {showBulkActions && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {selectedRows.length} order{selectedRows.length !== 1 ? 's' : ''} selected
                  </span>
                  <button 
                    onClick={() => setSelectedRows([])} 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button 
                    onClick={handleBulkExport}
                    disabled={loadingStates.bulkActions}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export selected orders to CSV"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingStates.bulkActions ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Exporting...
                      </div>
                    ) : (
                      'Export'
                    )}
                  </motion.button>
                  <motion.button 
                    onClick={() => handleBulkStatusChange('verified')}
                    disabled={loadingStates.bulkActions}
                    className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mark selected as verified"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingStates.bulkActions ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Updating...
                      </div>
                    ) : (
                      'Mark Verified'
                    )}
                  </motion.button>
                  <motion.button 
                    onClick={handleBulkDuplicate}
                    disabled={loadingStates.bulkActions}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Duplicate selected orders"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingStates.bulkActions ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Duplicating...
                      </div>
                    ) : (
                      'Duplicate'
                    )}
                  </motion.button>
                  <motion.button 
                    onClick={handleBulkDelete}
                    disabled={loadingStates.bulkActions}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete selected orders"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loadingStates.bulkActions ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Deleting...
                      </div>
                    ) : (
                      'Delete'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-3 py-2 w-8">
                    <input 
                      type="checkbox" 
                      checked={allSelected} 
                      onChange={toggleAll} 
                      className="accent-blue-600 rounded" 
                    />
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={(e) => handleColumnSort('poNumber', e)}
                    title="Click to sort, Shift+Click for multi-column sort"
                  >
                    PO NO {getSortIndicator('poNumber')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={(e) => handleColumnSort('poDate', e)}
                    title="Click to sort, Shift+Click for multi-column sort"
                  >
                    PO Date {getSortIndicator('poDate')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-3 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={(e) => handleColumnSort('buyerName', e)}
                    title="Click to sort, Shift+Click for multi-column sort"
                  >
                    Buyer {getSortIndicator('buyerName')}
                  </th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden md:table-cell">Shade</th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider hidden md:table-cell">Count</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Qty</th>
                  <th 
                    scope="col" 
                    className="px-3 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={(e) => handleColumnSort('status', e)}
                    title="Click to sort, Shift+Click for multi-column sort"
                  >
                    Status {getSortIndicator('status')}
                  </th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <AnimatePresence initial={false}>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {isEmpty ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">No purchase orders available.</td>
                    </motion.tr>
                  ) : (
                    displayOrders.map((order: PurchaseOrder, idx: number) => {
                      const poDate = order.poDate ? new Date(order.poDate) : null;
                      const poDateStr = poDate ? poDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-';

                      const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
                      const shadeNo = firstItem && firstItem.shadeNo ? firstItem.shadeNo : '-';
                      const count = firstItem && firstItem.count ? firstItem.count : '-';
                      const qty = firstItem && firstItem.quantity ? firstItem.quantity : '-';
                      const isSelected = selectedRows.includes(order.id);
                      const rowLoading = loadingStates.rowActions[order.id];
                      
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            backgroundColor: getRowBgColor(!!isSelected)
                          }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: idx * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: getRowBgColor(!!isSelected, true)
                          }}
                          className={
                            `${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} transition-all duration-200 border-b border-gray-100 dark:border-gray-800 text-sm` +
                            (isSelected ? ' ring-2 ring-blue-300 dark:ring-blue-600 shadow-lg' : '') +
                            (rowLoading ? ' opacity-75' : '')
                          }
                        >
                          <td className="px-3 py-2 w-8 text-center">
                            <motion.input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => toggleRow(order.id)} 
                              className="accent-blue-600 rounded" 
                              whileTap={{ scale: 0.9 }}
                              disabled={rowLoading !== null}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium text-blue-700 dark:text-blue-300 whitespace-nowrap">{order.poNumber ?? '-'}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900 dark:text-gray-100">{poDateStr}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-gray-900 dark:text-gray-100"><TruncatedText text={order.buyerName || ''} maxLength={12} /></td>
                          <td className="px-3 py-2 whitespace-nowrap text-center hidden md:table-cell text-gray-900 dark:text-gray-100">{shadeNo}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center hidden md:table-cell text-gray-900 dark:text-gray-100">{count}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-right text-gray-900 dark:text-gray-100">{qty}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <motion.span 
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'uploaded' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'verified' ? 'bg-green-100 text-green-800' :
                                order.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {order.status}
                            </motion.span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <motion.button 
                                onClick={() => {
                                  console.log('View button clicked for order:', order.id);
                                  openModal(order, 'view');
                                }} 
                                className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="View"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                // disabled={rowLoading !== null}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </motion.button>
                              <motion.button 
                                onClick={() => {
                                  console.log('Edit button clicked for order:', order.id);
                                  openModal(order, 'edit');
                                }} 
                                className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Edit"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                // disabled={rowLoading !== null}
                              >
                                {rowLoading === 'edit' ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                                  />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
                                  </svg>
                                )}
                              </motion.button>
                              <motion.button 
                                onClick={() => {
                                  console.log('Delete button clicked for order:', order.id);
                                  handleDelete(order.id);
                                }} 
                                className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Delete"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                // disabled={rowLoading !== null}
                              >
                                {rowLoading === 'delete' ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                                  />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </AnimatePresence>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={pagination?.page || 1}
          setPage={onPageChange || (() => {})}
          rowsPerPage={pagination?.limit || 5}
          setRowsPerPage={onRowsPerPageChange || (() => {})}
          total={pagination?.total || 0}
          options={[5, 10, 20, 50, 100]}
          isLoading={loadingStates.table || isLoading}
        />
      </div>

     <TailwindDialog
       isOpen={isReviewOpen}
       onClose={closeReviewModal}
       title={`${modalMode === 'view' ? 'View' : modalMode === 'edit' ? 'Edit' : modalMode === 'verify' ? 'Verify' : 'Authorize'} Purchase Order`}
       maxWidth="max-w-7xl"
     >
       {selectedOrder ? (
         <div className="space-y-4">
           <PurchaseOrderReviewForm
             data={modalMode === 'edit' && editFormData ? editFormData : mapPurchaseOrderToFormValues(selectedOrder)}
             onChange={modalMode === 'edit' ? (data => setEditFormData(data)) : () => {}}
             onCancel={closeReviewModal}
             onDelete={() => handleDelete(selectedOrder.id)}
             onVerify={modalMode === 'verify' ? async () => {
               await verifyPurchaseOrder(selectedOrder.id);
               toast.success('Purchase Order marked as verified!');
               onRefresh();
               closeReviewModal();
             } : undefined}
             onConvert={modalMode === 'authorize' ? () => handleConvertToSalesOrder(selectedOrder) : undefined}
             status={selectedOrder.status as 'uploaded' | 'verified' | 'converted'}
             productions={[]}
             mode={modalMode === 'view' ? 'view' : 'edit'}
           />
           <div className="flex justify-end space-x-2">
             <button
               onClick={closeReviewModal}
               className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
             >
               Close
             </button>
             {modalMode === 'edit' && (
               <button
                 onClick={handleSaveClick}
                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                 disabled={!editFormData}
               >
                 Save Changes
               </button>
             )}
           </div>
         </div>
       ) : (
         <div className="text-center py-8">
           <p className="text-gray-500">No order selected</p>
         </div>
       )}
     </TailwindDialog>
{showDeleteConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
      <p>Are you sure you want to delete this purchase order? This action cannot be undone.</p>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  </div>
)}
      <OrderFormModal
        isOpen={isConvertModalOpen}
        onClose={handleConvertModalClose}
        onSubmit={handleConvertSubmit}
        initialData={convertInitialData}
      />
    </>
  );
};

export default PurchaseOrderTable;