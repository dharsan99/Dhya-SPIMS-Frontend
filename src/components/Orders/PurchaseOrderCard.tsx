import React from 'react';
import { PurchaseOrder } from '../../types/purchaseOrder';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  order: PurchaseOrder;
  onEdit: (order: PurchaseOrder) => void;
  onView: (order: PurchaseOrder) => void;
  onDelete: (id: string) => void;
}

const PurchaseOrderCard: React.FC<Props> = ({ order, onEdit, onView, onDelete }) => {
  const poDate = order.poDate ? new Date(order.poDate).toLocaleDateString() : '-';
  const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-';
  const firstItem = order.items && order.items[0] ? order.items[0] : null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-blue-700 dark:text-blue-300 text-lg truncate">{order.poNumber}</div>
        <div className="flex gap-2">
          <button onClick={() => onView(order)} className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800" title="View">
            <EyeIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </button>
          <button onClick={() => onEdit(order)} className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-800" title="Edit">
            <PencilIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
          </button>
          <button onClick={() => onDelete(order.id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-800" title="Delete">
            <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
        <span className="font-medium">Buyer:</span> {order.buyerName || '-'}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div><span className="font-medium">PO Date:</span> {poDate}</div>
        <div><span className="font-medium">Delivery:</span> {deliveryDate}</div>
        <div><span className="font-medium">Qty:</span> {firstItem?.quantity ?? '-'}</div>
        <div><span className="font-medium">Count:</span> {firstItem?.count ?? '-'}</div>
        <div><span className="font-medium">Shade:</span> {firstItem?.shadeNo ?? '-'}</div>
        <div><span className="font-medium">Status:</span> {order.status}</div>
      </div>
    </div>
  );
};

export default PurchaseOrderCard; 