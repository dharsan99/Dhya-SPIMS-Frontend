// Fiber category interface
export interface FiberCategory {
  id: string;
  name: string;
  description?: string;
}

// Fiber entity
export interface Fiber {
  id: string;
  fibre_name: string;
  fibre_code: string;
  stock_kg: number;
  category_id?: string | null;
  category?: FiberCategory | null;
}

// For dashboard internal computation
export interface PendingFiberSummary {
  fibre_id: string;
  fibre_code: string;
  fibre_name: string;
  category_name?: string;
  available_kg: number;
  required_kg: number;
  shortage_kg: number;
}

// For final UI-ready output
export interface PendingFiberEntry {
  fibre_code: string;
  fibre_name: string;
  category: string;
  available: number;
  required: number;
  shortfall: number;
}