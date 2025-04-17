import { Order } from '../types/order';
import { PendingFiberSummary, PendingFiberEntry } from '../types/fiber';

/**
 * Computes fiber shortages based on all pending orders with realisation.
 */
export const computePendingFibres = (orders: Order[]): PendingFiberSummary[] => {
  const fibreMap: Record<string, PendingFiberSummary> = {};

  orders
    .filter((order) => order.status === 'pending' && !isNaN(Number(order.realisation)))
    .forEach((order) => {
      const realisation = parseFloat(order.realisation as any);
      const orderQty = Number(order.quantity_kg);
      const totalQty = orderQty / (realisation / 100); // Realised production requirement

      order.shade?.shade_fibres?.forEach((sf: { fibre: any; percentage: string }) => {
        const fibre = sf.fibre;
        if (!fibre?.id) return;

        const percentage = parseFloat(sf.percentage);
        const requiredQty = (percentage / 100) * totalQty;
        const availableQty = parseFloat(fibre.stock_kg ?? 0);

        if (!fibreMap[fibre.id]) {
          fibreMap[fibre.id] = {
            fibre_id: fibre.id,
            fibre_code: fibre.fibre_code,
            fibre_name: fibre.fibre_name,
            category_name: fibre.category?.name,
            available_kg: availableQty,
            required_kg: 0,
            shortage_kg: 0,
          };
        }

        fibreMap[fibre.id].required_kg += requiredQty;
        fibreMap[fibre.id].shortage_kg = Math.max(
          fibreMap[fibre.id].required_kg - fibreMap[fibre.id].available_kg,
          0
        );
      });
    });

  return Object.values(fibreMap).filter((f) => f.shortage_kg > 0);
};

/**
 * Converts summary format to PendingFiberEntry format for UI display.
 */
export const convertSummaryToEntries = (
  summaries: PendingFiberSummary[]
): PendingFiberEntry[] => {
  return summaries.map((summary) => ({
    fibre_code: summary.fibre_code,
    fibre_name: summary.fibre_name,
    category: summary.category_name ?? 'NA',
    available: parseFloat(summary.available_kg.toFixed(2)),
    required: parseFloat(summary.required_kg.toFixed(2)),
    shortfall: parseFloat(summary.shortage_kg.toFixed(2)),
  }));
};