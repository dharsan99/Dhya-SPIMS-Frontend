import React, { useState } from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../types/purchaseOrder';
import PurchaseOrderModal from './purchaseorders/PurchaseOrderModal';
import { updatePurchaseOrder, deletePurchaseOrder } from '../../api/purchaseOrders';
import { verifyPurchaseOrder, convertPurchaseOrder } from '../../api/purchaseOrders';
import { toast } from 'react-hot-toast'; // or your notification system
import Pagination from '../Pagination';
import TruncatedText from '../ui/TruncatedText';

interface Props {
  orders?: PurchaseOrder[];
  onRefresh: () => void;
}

const PurchaseOrderTable: React.FC<Props> = ({ orders = [], onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'verify' | 'authorize'>('view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // default 5 rows

  // Reset page when orders change
  React.useEffect(() => {
    setPage(1);
  }, [orders.length]);

  // Paginate orders
  const paginatedOrders = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return orders.slice(start, start + rowsPerPage);
  }, [orders, page, rowsPerPage]);

  const openModal = (order: PurchaseOrder, mode: 'view' | 'edit' | 'verify' | 'authorize') => {
    setSelectedOrder(order);
    setModalMode(mode);
    setIsReviewOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedOrder(null);
    setIsReviewOpen(false);
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
const handleVerify = (order: PurchaseOrder) => {
  setSelectedOrder(order);
  setModalMode('verify'); // Changed from 'edit' to 'verify'
  setIsReviewOpen(true);
};

const handleAuthorize = (order: PurchaseOrder) => {
  setSelectedOrder(order);
  setModalMode('authorize'); // New mode for authorization
  setIsReviewOpen(true);
};

const handleConvert = async (id: string, authorizationData: {
  buyer_id: string;
  shade_id: string;
  quantity_kg: number;
  delivery_date: string;
  count?: number;
  realisation?: number;
  items: Array<{
    order_code: string;
    yarn_description: string;
    color: string;
    count: number;
    uom: string;
    bag_count: number;
    quantity: number;
    rate: number;
    gst_percent: number;
    taxable_amount: number;
    shade_id: string;
  }>;
}) => {
  try {
    await convertPurchaseOrder(id, authorizationData);
    toast.success('Sales Order created successfully!');
    onRefresh();
    closeReviewModal();
  } catch (err: any) {
    console.error('[PurchaseOrderTable] Error converting PO:', err);
    console.error('[PurchaseOrderTable] Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    toast.error('Failed to convert PO to Sales Order');
  }
};

const handleDelete = async (id: string) => {
  setDeleteId(id);
  setShowDeleteConfirm(true);
};

const confirmDelete = async () => {
  if (!deleteId) return;
  try {
    await deletePurchaseOrder(deleteId);
    toast.success('Purchase Order deleted successfully!');
    onRefresh();
  } catch (err) {
    toast.error('Failed to delete Purchase Order');
  } finally {
    setShowDeleteConfirm(false);
    setDeleteId(null);
    closeReviewModal();
  }
};

  const isEmpty = !orders.length;

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO NO
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shade
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isEmpty ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No purchase orders available.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order, idx) => {
                // Minimal PO date
                const poDate = order.po_date ? new Date(order.po_date) : null;
                const poDateStr = poDate ? poDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-';
                // Delivery = PO date + 45 days
                let deliveryStr = '-';
                if (poDate) {
                  const deliveryDate = new Date(poDate);
                  deliveryDate.setDate(poDate.getDate() + 45);
                  deliveryStr = deliveryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                }
                // First item fields
                const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
                const shadeNo = firstItem && firstItem.shade_no ? firstItem.shade_no : '-';
                const count = firstItem && firstItem.count ? firstItem.count : '-';
                const qty = firstItem && firstItem.quantity ? firstItem.quantity : '-';

                return (
                  <tr key={order.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline truncate max-w-[140px]" title={order.po_number ?? 'N/A'} onClick={() => openModal(order, 'view')}>
                        {order.po_number ?? '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{poDateStr}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{deliveryStr}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <TruncatedText text={order.buyer_name || ''} maxLength={6} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{shadeNo}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{count}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">{qty}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
  {order.status === 'uploaded' && (
    <button
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      onClick={() => handleVerify(order)}
    >
      Verify
    </button>
  )}
  {order.status === 'verified' && (
    <button
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={() => handleAuthorize(order)}
    >
      Authorize
    </button>
  )}
                        <button 
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </button>
                      </div>
</td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={orders.length}
          options={[5, 10, 20, 50]}
        />
      </div>

     <PurchaseOrderModal
  isOpen={isReviewOpen}
  order={selectedOrder}
  onClose={closeReviewModal}
  mode={modalMode}
  onSave={handleSave}
  onVerify={async (id) => {
    await verifyPurchaseOrder(id);
    toast.success('Purchase Order marked as verified!');
    onRefresh();
    closeReviewModal();
  }}
  onConvert={handleConvert}
  status={selectedOrder?.status}
/>
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
    </>
  );
};

export default PurchaseOrderTable;