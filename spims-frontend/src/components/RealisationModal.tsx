import { useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '../api/orders';
import toast from 'react-hot-toast';
import { Order } from '../types/order';

interface Props {
  order: Order;
  onClose: () => void;
}

const RealisationModal = ({ order, onClose }: Props) => {
  const [realisation, setRealisation] = useState('');
  const queryClient = useQueryClient();
  const orderQty = parseFloat(order.quantity_kg.toString());

  const mutation = useMutation({
    mutationFn: (value: number) => updateOrder(order.id, { realisation: value }),
    onSuccess: () => {
      toast.success('✅ Realisation updated');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose();
    },
    onError: () => toast.error('❌ Failed to update realisation'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(realisation);
    if (isNaN(value) || value < 0 || value > 100) {
      toast.error('⚠️ Enter a valid percentage between 0 and 100');
      return;
    }
    mutation.mutate(value);
  };

  const parsedRealisation = parseFloat(realisation);
  const totalQty = !isNaN(parsedRealisation) && parsedRealisation > 0
    ? (orderQty / (parsedRealisation / 100))
    : 0;

  const calculatedFibres = useMemo(() => {
    if (!totalQty) return [];
    return order.shade.shade_fibres.map((sf: any) => {
      const perc = parseFloat(sf.percentage);
      const requiredQty = (perc / 100) * totalQty;
      const available = parseFloat(sf.fibre?.stock_kg ?? 0);

      return {
        fibre_code: sf.fibre?.fibre_code ?? 'UNKNOWN',
        percentage: perc,
        requiredQty: requiredQty.toFixed(2),
        availableStock: available.toFixed(2),
        shortage: requiredQty > available,
      };
    });
  }, [realisation, order]);

  return (
<div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center"> 
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Realisation %</h2>

        {/* Shade Info */}
        <div className="mb-4 space-y-1 text-sm text-gray-700">
          <p>
            <strong>Shade:</strong>{' '}
            <span className="text-gray-900 font-semibold">
              {order.shade?.shade_name ?? 'Unnamed'}{' '}
              <span className="text-sm text-gray-500">({order.shade?.shade_code ?? '-'})</span>
            </span>
          </p>
          <p><strong>Order Quantity:</strong> {orderQty} kg</p>
          {totalQty > 0 && (
            <p className="text-blue-600 font-medium">
              Total Required Quantity: {totalQty.toFixed(2)} kg
            </p>
          )}
        </div>

        {/* Fibre Composition */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Fibre Composition</h4>
          <ul className="grid grid-cols-2 gap-1 text-sm text-gray-800">
            {order.shade.shade_fibres.map((sf: any) => (
              <li key={sf.fibre?.id}>
                <span className="font-medium">{sf.fibre?.fibre_code ?? 'UNKNOWN'}</span> — {sf.percentage}%
              </li>
            ))}
          </ul>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Realisation (%)</label>
          <input
            type="number"
            value={realisation}
            onChange={(e) => setRealisation(e.target.value)}
            className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 84.5"
            min="0"
            max="100"
            step="0.1"
          />

          {/* Fibre Breakdown */}
          {calculatedFibres.length > 0 && (
            <div className="mt-5 mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Fibre Requirement Summary</h4>
              <div className="space-y-2 text-sm">
                {calculatedFibres.map((fibre: { shortage: any; fibre_code: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; requiredQty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; availableStock: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
                  <div
                    key={idx}
                    className={`flex justify-between px-3 py-1 rounded border ${
                      fibre.shortage
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    <span className="font-medium">{fibre.fibre_code}</span>
                    <span>{fibre.requiredQty} kg</span>
                    <span className="italic">(Stock: {fibre.availableStock} kg)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealisationModal;