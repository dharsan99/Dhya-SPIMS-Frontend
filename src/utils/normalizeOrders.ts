import { Order } from '../types/order';
import { FibreComposition } from '../types/shade';

export function normalizeOrders(orders: any[]): Order[] {
  return orders.map((order: any) => {
    const shade = order.shade || {};

    // Transform shade_fibres into blend_composition
    const blend_composition: FibreComposition[] = (shade.shade_fibres ?? []).map((sf: any) => ({
      fibre_id: sf.fibre_id,
      percentage: parseFloat(sf.percentage),
      fibre: sf.fibre,
    }));

    return {
      ...order,
      quantity_kg: parseFloat(order.quantity_kg),
      shade: {
        ...shade,
        blend_composition,
        // Keep raw_cotton_composition if present
        raw_cotton_composition: shade.raw_cotton_composition ?? null,
      },
    };
  });
}