// Used for creating/updating a production record
export interface ProductionForm {
  tenant_id: string;
  date: string; // ISO format (e.g. 2025-04-18T00:00:00.000Z)
  section: string;
  machine: string;
  shift: string;
  count?: string;
  hank?: number;
  production_kg: number;
  required_qty: number;
  remarks?: string;
  status?: 'draft' | 'final';
  order_id: string;
  user_id: string;
}

// Main production record returned by API (with nested order + user)
export interface ProductionRecord extends ProductionForm {
  id: string;
  created_at: string;
  updated_at: string;

  order: {
    id: string;
    order_number: string;
    quantity_kg: string;
    realisation?: string;
    delivery_date: string;
    buyer: {
      id: string;
      name: string;
      contact?: string;
      email?: string;
      address?: string;
    };
    shade: {
      id: string;
      shade_code: string;
      shade_name: string;
      shade_fibres: {
        id: string;
        percentage: number;
        fibre: {
          id: string;
          fibre_name: string;
          fibre_code: string;
          stock_kg: string;
          category_id?: string;
        };
      }[];
    };
  };

  user: {
    id: string;
    name?: string;
    email: string;
  };
}

// Used for /productions/efficiency/daily
export interface DailyEfficiency {
  date: string; // e.g., "2025-04-18"
  total_produced: number;
  total_required: number;
  efficiency: number; // e.g., 82.5
}

// Used for /productions/efficiency/machine
export interface MachineEfficiency {
  machine: string;
  total_produced: number;
  avg_efficiency: number;
  days: number;
}

// Alias for UI-friendly usage
export type Production = ProductionRecord;

export interface MachineStatus {
  machine_id: string;
  machine_name: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  efficiency: number;
  current_order?: string;
}

