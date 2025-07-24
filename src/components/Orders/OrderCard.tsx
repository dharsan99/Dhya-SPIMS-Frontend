import React from 'react';
import { PurchaseOrder } from '../../types/purchaseOrder';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: PurchaseOrder;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (id: string) => void;
  onView: (order: PurchaseOrder) => void;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onConvert?: (order: PurchaseOrder) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  default: 'bg-gray-100 text-gray-800',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onDelete, onView, selected, onSelect, onConvert }) => {
  const status = order.status || 'default';
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={e => onSelect(order.id, e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-semibold text-gray-900 dark:text-white text-base">{order.poNumber}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.default}`}>{status.replace('_', ' ').replace(/^./, s => s.toUpperCase())}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
        <div><span className="font-medium">Buyer:</span> {order.buyerName || '—'}</div>
        <div><span className="font-medium">Shade:</span> {order.shadeCode || '—'}</div>
        <div><span className="font-medium">Qty:</span> {order.items?.[0]?.quantity || '—'} kg</div>
        <div><span className="font-medium">Count:</span> {order.items?.[0]?.count || '—'}</div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <div><span className="font-medium">Order Date:</span> {order.poDate ? new Date(order.poDate).toLocaleDateString() : '—'}</div>
        <div><span className="font-medium">Delivery:</span> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '—'}</div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => onView(order)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" title="View"><EyeIcon className="w-5 h-5" /></button>
        <button onClick={() => onEdit(order)} className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600" title="Edit"><PencilIcon className="w-5 h-5" /></button>
        <button onClick={() => onDelete(order.id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600" title="Delete"><TrashIcon className="w-5 h-5" /></button>
        {onConvert && (
          <button
            onClick={() => onConvert(order)}
            className="p-2 rounded bg-green-600 text-white hover:bg-green-700 text-xs font-medium ml-auto"
            title="Convert to Sales Order"
          >
            Convert to Sales Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard; 