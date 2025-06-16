import { useState, useMemo, useEffect, FormEvent, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateOrder } from '../api/orders';
import { getShadeById } from '../api/shades';
import { Order } from '../types/order';
import { ShadeWithBlendDescription, RawCottonComposition } from '../types/shade';

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
  notes?: string;
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

  const { data: shade, isLoading: isLoadingShade } = useQuery<ShadeWithBlendDescription | undefined>({
    queryKey: ['shade', order.shade.id],
    queryFn: () => getShadeById(order.shade.id),
    enabled: !!order.shade.id,
    staleTime: 0,
  });

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
    onError: () => {
      toast.error('❌ Update failed');
    }
  });

  const parsedRealisation = parseFloat(realisation);
  const totalQty = !isNaN(parsedRealisation) && parsedRealisation > 0
    ? (orderQty / (parsedRealisation / 100))
    : 0;

  const calculateFibres = useCallback(() => {
    if (!shade) return [];
    const fibres: CalculatedFibre[] = [];
    for (const fibre of shade.blend_composition || []) {
      const perc = parseFloat(fibre.percentage?.toString() ?? '0');
      const requiredQty = (perc / 100) * totalQty;
      const stock = parseFloat(fibre.fibre?.stock_kg ?? '0');
      fibres.push({
        fibre_code: fibre.fibre?.fibre_code || fibre.fibre?.fibre_name || 'Unknown',
        percentage: perc,
        requiredQty: requiredQty.toFixed(2),
        availableStock: stock.toFixed(2),
        shortage: stock < requiredQty,
        notes: fibre.fibre?.description,
      });
    }
    const rawCottonCompositions = shade.raw_cotton_compositions || [];
    for (const rc of rawCottonCompositions) {
      if (!rc) continue;
      
      const perc = parseFloat(rc.percentage?.toString() ?? '0');
      if (perc <= 0) continue;
      
      const requiredQty = (perc / 100) * totalQty;
      const lot_number = rc.lot_number || '—';
      const grade = rc.grade;
      const source = rc.source;
      const notes = rc.notes;
      const backendStock = parseFloat(rc.stock_kg ?? '0');
      const input = manualRawCottonStocks[rc.id || ''] || {};
      const manualStock = parseFloat(input.stock_kg ?? '0');
      const stock = backendStock > 0 ? backendStock : manualStock;
      
      fibres.push({
        fibre_code: `RAW COTTON (${lot_number})${grade ? `, Grade: ${grade}` : ''}${source ? `, Source: ${source}` : ''}`,
        percentage: perc,
        requiredQty: requiredQty.toFixed(2),
        availableStock: stock.toFixed(2),
        shortage: stock < requiredQty,
        notes,
      });
    }
    return fibres;
  }, [orderQty, realisation, shade, manualRawCottonStocks]);

  const calculatedFibres = useMemo<CalculatedFibre[]>(calculateFibres, [calculateFibres]);

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

    mutation.mutate(payload);
  };

  const hasRawCotton = Array.isArray(shade?.raw_cotton_compositions)
    ? shade.raw_cotton_compositions.length > 0
    : Boolean(shade?.raw_cotton_compositions);

  if (isLoadingShade) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Realisation %</h2>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>Shade:</strong> {shade?.shade_name} <span className="text-gray-500">({shade?.shade_code})</span></p>
            <p><strong>Order Qty:</strong> {orderQty} kg</p>
            {totalQty > 0 && <p className="text-blue-600 font-medium">Total Required: {totalQty.toFixed(2)} kg</p>}
          </div>

          <div className="space-y-2">
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
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Fibre Breakdown</h4>
            <div className="space-y-2">
              {calculatedFibres.length > 0 ? (
                calculatedFibres.map((f, i) => (
                  <div key={i}>
                    <div
                      className={`flex justify-between px-3 py-1.5 rounded border text-sm ${
                        f.shortage ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'
                      }`}
                    >
                      <span>{f.fibre_code} <span className="text-gray-500">({f.percentage}%)</span></span>
                      <span>{f.requiredQty} kg</span>
                      <span className="italic">({f.availableStock} kg)</span>
                    </div>
                    {f.fibre_code.startsWith('RAW COTTON') && f.notes && (
                      <div className="text-xs text-gray-500 pl-4 mt-1">Notes: {f.notes}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No fibres configured for this shade</div>
              )}
            </div>
          </div>

          {hasRawCotton && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Raw Cotton Details</h4>
              <div className="space-y-3">
                {(Array.isArray(shade?.raw_cotton_compositions)
                  ? shade.raw_cotton_compositions
                  : [shade?.raw_cotton_compositions]
                ).filter((rc): rc is RawCottonComposition => Boolean(rc)).map((rc: RawCottonComposition) => {
                  const input = manualRawCottonStocks[rc.id || ''] || {};
                  const showInputs = parseFloat(rc.stock_kg ?? '0') === 0;
                  return (
                    <div key={rc.id} className="border rounded p-3 bg-gray-50 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <strong>RAW COTTON</strong>
                        <span className="text-gray-600">
                          {Number(rc.percentage).toFixed(1)}% ({rc.lot_number ?? '—'})
                        </span>
                      </div>
                      {showInputs && (
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            className="border px-2 py-1 rounded" 
                            placeholder="Lot Number" 
                            value={input.lot_number || ''} 
                            onChange={(e) => setManualRawCottonStocks(prev => ({ 
                              ...prev, 
                              [rc.id || '']: { ...prev[rc.id || ''], lot_number: e.target.value } 
                            }))} 
                          />
                          <input 
                            className="border px-2 py-1 rounded" 
                            placeholder="Stock (kg)" 
                            type="number" 
                            value={input.stock_kg || ''} 
                            onChange={(e) => setManualRawCottonStocks(prev => ({ 
                              ...prev, 
                              [rc.id || '']: { ...prev[rc.id || ''], stock_kg: e.target.value } 
                            }))} 
                          />
                          <input 
                            className="border px-2 py-1 rounded" 
                            placeholder="Grade" 
                            value={input.grade || ''} 
                            onChange={(e) => setManualRawCottonStocks(prev => ({ 
                              ...prev, 
                              [rc.id || '']: { ...prev[rc.id || ''], grade: e.target.value } 
                            }))} 
                          />
                          <input 
                            className="border px-2 py-1 rounded" 
                            placeholder="Source" 
                            value={input.source || ''} 
                            onChange={(e) => setManualRawCottonStocks(prev => ({ 
                              ...prev, 
                              [rc.id || '']: { ...prev[rc.id || ''], source: e.target.value } 
                            }))} 
                          />
                          <textarea 
                            rows={2} 
                            className="col-span-2 border px-2 py-1 rounded" 
                            placeholder="Notes" 
                            value={input.notes || ''} 
                            onChange={(e) => setManualRawCottonStocks(prev => ({ 
                              ...prev, 
                              [rc.id || '']: { ...prev[rc.id || ''], notes: e.target.value } 
                            }))} 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
