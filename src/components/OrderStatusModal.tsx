import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../api/orders';
import { Order } from '../types/order';
import toast from 'react-hot-toast';

interface Props {
  orders: Order[];
  onClose: () => void;
}

const OrderStatusModal = ({ orders, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'completed' | 'dispatched' }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, { status }) => {
      toast.success(
        status === 'dispatched'
          ? '✅ Order marked as Dispatched'
          : status === 'completed'
          ? '✅ Order marked as Completed'
          : '✅ Order marked as In Progress'
      );
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose();
    },
    onError: () => toast.error('❌ Failed to update order status'),
  });

  const selectableOrders = orders;
  const selected = selectableOrders.find((o) => o.id === selectedOrderId);
  const realisation = parseFloat(selected?.realisation as any);
  const orderQty = Number(selected?.quantity_kg ?? 0);
  const totalQty = realisation ? orderQty / (realisation / 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <h2 className="text-lg font-bold mb-4">Update Order Status</h2>

        <select
          value={selectedOrderId ?? ''}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 p-2 rounded mb-4"
        >
          <option value="" disabled>
            Select an order
          </option>
          {selectableOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_number} – {order.shade?.shade_code} ({order.status})
            </option>
          ))}
        </select>

        {selected && (
          <div className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 mb-4">
            <p><strong>Order Qty:</strong> {orderQty.toFixed(2)} kg</p>
            <p><strong>Realisation:</strong> {realisation ? realisation.toFixed(1) : '-'}%</p>
            <p><strong>Total Required Qty:</strong> {totalQty ? totalQty.toFixed(2) : '-'} kg</p>
            <p><strong>Current Status:</strong> <span className="capitalize font-semibold">{selected.status.replace('_', ' ')}</span></p>
            <div className="mt-3">
              <h4 className="font-semibold mb-1">Fibre Breakdown:</h4>
              <ul className="space-y-1">
                {selected.shade?.shade_fibres?.map((sf: { fibre: any; percentage: any; }, i: any) => {
                  const fibre = sf.fibre;
                  const percentage = parseFloat(sf.percentage as any) || 0;
                  const requiredQty = (percentage / 100) * totalQty;
                  const availableStock = parseFloat(fibre?.stock_kg ?? '0');
                  const shortage = availableStock < requiredQty;
                  return (
                    <li key={fibre?.id || i} className="flex justify-between">
                      <span>{fibre?.fibre_code ?? 'Unknown'} ({percentage}%):</span>
                      <span className={shortage ? 'text-red-500' : 'text-green-500'}>
                        {requiredQty.toFixed(2)} kg / Available: {availableStock.toFixed(2)} kg
                      </span>
                    </li>
                  );
                })}
                {selected.shade?.raw_cotton_composition && (
                  <li className="flex justify-between text-purple-600 dark:text-purple-300 font-semibold">
                    <span>RAW COTTON ({selected.shade.raw_cotton_composition.percentage}%):</span>
                    <span>{((selected.shade.raw_cotton_composition.percentage / 100) * totalQty).toFixed(2)} kg</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1 hover:underline"
          >
            Cancel
          </button>
          {selected && selected.status === 'pending' && (
            <button
              onClick={() => updateStatus.mutate({ id: selected.id, status: 'in_progress' })}
              className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Move to Production
            </button>
          )}
          {selected && selected.status === 'in_progress' && (
            <button
              onClick={() => updateStatus.mutate({ id: selected.id, status: 'completed' })}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Mark as Completed
            </button>
          )}
          {selected && selected.status === 'completed' && (
            <button
              onClick={() => updateStatus.mutate({ id: selected.id, status: 'dispatched' })}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Mark as Dispatched
            </button>
          )}
          {selected && selected.status === 'dispatched' && (
            <span className="text-green-700 font-semibold px-4 py-2">Dispatched</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;