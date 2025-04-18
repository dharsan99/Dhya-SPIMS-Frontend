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
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'completed' }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('✅ Order marked as In Progress');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose();
    },
    onError: () => toast.error('❌ Failed to update order status'),
  });

  const ordersWithRealisation = orders.filter((order) => {
    const real = parseFloat(order.realisation as any);
    return order.status === 'pending' && !isNaN(real) && real > 0;
  });

  const selected = ordersWithRealisation.find((o) => o.id === selectedOrderId);
  const realisation = parseFloat(selected?.realisation as any);
  const orderQty = Number(selected?.quantity_kg ?? 0);
  const totalQty = realisation ? orderQty / (realisation / 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Move Order to Production</h2>

        <select
          value={selectedOrderId ?? ''}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="" disabled>Select an order with realisation</option>
          {ordersWithRealisation.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_number} – {order.shade?.shade_code}
            </option>
          ))}
        </select>

        {selected && (
          <div className="text-sm bg-gray-50 p-4 rounded border mb-4">
            <p><strong>Order Qty:</strong> {orderQty} kg</p>
            <p><strong>Realisation:</strong> {realisation.toFixed(1)}%</p>
            <p><strong>Total Required Qty:</strong> {totalQty.toFixed(2)} kg</p>

            <div className="mt-3">
              <h4 className="font-semibold mb-1">Fibre Breakdown:</h4>
              <ul className="space-y-1">
                {selected.shade?.shade_fibres.map((sf: { fibre: any; percentage: any; }) => {
                  const fibre = sf.fibre;
                  const percentage = parseFloat(sf.percentage as any);
                  const requiredQty = (percentage / 100) * totalQty;
                  const availableStock = parseFloat(fibre.stock_kg);
                  const shortage = availableStock < requiredQty;
                  return (
                    <li key={fibre.id} className="flex justify-between">
                      <span>{fibre.fibre_code} ({percentage}%):</span>
                      <span className={shortage ? 'text-red-600' : 'text-green-700'}>
                        {requiredQty.toFixed(2)} kg / Available: {availableStock.toFixed(2)} kg
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 px-3 py-1 hover:underline"
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() =>
              selected &&
              updateStatus.mutate({ id: selected.id, status: 'in_progress' })
            }
            className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Confirm Production
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;