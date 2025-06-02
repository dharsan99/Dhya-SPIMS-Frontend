import { useState, useMemo, useEffect, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateOrder } from '../api/orders';
import { Order } from '../types/order';

interface Props {
  order: Order;
  onClose: () => void;
}

interface CalculatedFibre {
  fibre_code: string;
  percentage: number;
  requiredQty: string;
  availableStock: string;
  shortage: boolean;
}

interface RawCottonExtraInputs {
  stock_kg?: string;
  lot_number?: string;
  grade?: string;
  source?: string;
  notes?: string;
}

const RealisationModal = ({ order, onClose }: Props) => {
  const [realisation, setRealisation] = useState('');
  const [manualRawCottonStocks, setManualRawCottonStocks] = useState<{ [id: string]: RawCottonExtraInputs }>({});
  const queryClient = useQueryClient();
  const orderQty = parseFloat(order.quantity_kg.toString());

  useEffect(() => {
    if (order.realisation) {
      setRealisation(order.realisation.toString());
    }
  }, [order.realisation]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateOrder(order.id, data),
    onSuccess: () => {
      toast.success('✅ Realisation and RAW cotton updated');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose();
    },
    onError: (err) => {
      console.error('❌ Failed update:', err);
      toast.error('❌ Update failed');
    }
  });

  const parsedRealisation = parseFloat(realisation);
  const totalQty = !isNaN(parsedRealisation) && parsedRealisation > 0
    ? (orderQty / (parsedRealisation / 100))
    : 0;

  const calculatedFibres = useMemo<CalculatedFibre[]>(() => {
    if (!totalQty) return [];
    const results: CalculatedFibre[] = order.shade.shade_fibres.map((sf: any) => {
      const perc = parseFloat(sf.percentage?.toString() ?? '0');
      const requiredQty = (perc / 100) * totalQty;
      const available = parseFloat(sf.fibre?.stock_kg ?? '0');
      return {
        fibre_code: sf.fibre?.fibre_code ?? 'UNKNOWN',
        percentage: perc,
        requiredQty: requiredQty.toFixed(2),
        availableStock: available.toFixed(2),
        shortage: requiredQty > available,
      };
    });

    const rawCottons = Array.isArray(order.shade.raw_cotton_composition)
      ? order.shade.raw_cotton_composition
      : order.shade.raw_cotton_composition
      ? [order.shade.raw_cotton_composition]
      : [];

    for (const rc of rawCottons) {
      const perc = parseFloat(rc.percentage?.toString() ?? '0');
      const requiredQty = (perc / 100) * totalQty;
      const input = manualRawCottonStocks[rc.id] || {};
      const backendStock = parseFloat(rc.stock_kg ?? '0');
      const manualStock = parseFloat(input.stock_kg ?? '0');
      const stock = backendStock > 0 ? backendStock : manualStock;
      results.push({
        fibre_code: `RAW COTTON (${rc.lot_number ?? '—'})`,
        percentage: perc,
        requiredQty: requiredQty.toFixed(2),
        availableStock: stock.toFixed(2),
        shortage: stock < requiredQty,
      });
    }
    return results;
  }, [totalQty, order, manualRawCottonStocks]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const real = parseFloat(realisation);
    if (isNaN(real) || real < 0 || real > 100) {
      toast.error('⚠️ Enter a valid realisation %');
      return;
    }

    const rawCottonUpdates = Object.entries(manualRawCottonStocks).map(([id, details]) => ({
      id,
      ...details
    }));

    const payload = {
      realisation: real,
      raw_cotton_updates: rawCottonUpdates,
    };

    console.log('📤 Submitting payload:', payload);
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Realisation %</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>Shade:</strong> {order.shade.shade_name} <span className="text-gray-500">({order.shade.shade_code})</span></p>
            <p><strong>Order Qty:</strong> {orderQty} kg</p>
            {totalQty > 0 && <p className="text-blue-600 font-medium">Total Required: {totalQty.toFixed(2)} kg</p>}
          </div>

          <label className="text-sm font-medium">Realisation (%)</label>
          <input
            type="number"
            value={realisation}
            onChange={(e) => setRealisation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 84.5"
            min="0"
            max="100"
            step="0.1"
          />

          <div>
            <h4 className="text-sm font-semibold mb-2">Fibre Breakdown</h4>
            <div className="space-y-1">
              {calculatedFibres.map((f, i) => (
                <div
                  key={i}
                  className={`flex justify-between px-3 py-1 rounded border text-sm ${
                    f.shortage ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'
                  }`}
                >
                  <span>{f.fibre_code}</span>
                  <span>{f.requiredQty} kg</span>
                  <span className="italic">({f.availableStock} kg)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {(Array.isArray(order.shade.raw_cotton_composition)
              ? order.shade.raw_cotton_composition
              : [order.shade.raw_cotton_composition]
            ).filter(Boolean).map((rc: any) => {
              const input = manualRawCottonStocks[rc.id] || {};
              const showInputs = parseFloat(rc.stock_kg ?? '0') === 0;
              return (
                <div key={rc.id} className="border rounded p-3 bg-gray-50 text-xs space-y-2">
                  <strong>RAW COTTON</strong> — {rc.percentage}% ({rc.lot_number ?? '—'})
                  {showInputs && (
                    <div className="grid grid-cols-2 gap-2">
                      <input className="border px-2 py-1 rounded" placeholder="Lot Number" value={input.lot_number || ''} onChange={(e) => setManualRawCottonStocks(prev => ({ ...prev, [rc.id]: { ...prev[rc.id], lot_number: e.target.value } }))} />
                      <input className="border px-2 py-1 rounded" placeholder="Stock (kg)" type="number" value={input.stock_kg || ''} onChange={(e) => setManualRawCottonStocks(prev => ({ ...prev, [rc.id]: { ...prev[rc.id], stock_kg: e.target.value } }))} />
                      <input className="border px-2 py-1 rounded" placeholder="Grade" value={input.grade || ''} onChange={(e) => setManualRawCottonStocks(prev => ({ ...prev, [rc.id]: { ...prev[rc.id], grade: e.target.value } }))} />
                      <input className="border px-2 py-1 rounded" placeholder="Source" value={input.source || ''} onChange={(e) => setManualRawCottonStocks(prev => ({ ...prev, [rc.id]: { ...prev[rc.id], source: e.target.value } }))} />
                      <textarea rows={2} className="col-span-2 border px-2 py-1 rounded" placeholder="Notes" value={input.notes || ''} onChange={(e) => setManualRawCottonStocks(prev => ({ ...prev, [rc.id]: { ...prev[rc.id], notes: e.target.value } }))} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">{mutation.isPending ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealisationModal;
