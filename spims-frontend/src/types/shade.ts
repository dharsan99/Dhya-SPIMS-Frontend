// Used when creating or updating a shade (input type)
export interface FibreCompositionInput {
  fibre_id: string;
  percentage: number;
}

// Used when fetching shades from the backend (includes fibre metadata)
export interface FibreComposition extends FibreCompositionInput {
  fibre?: {
    fibre_code?: string;
    fibre_name?: string;
    stock_kg?: string;
    description?: string;
  };
}

// Base shade interface shared across system
export interface Shade {
  id: string;
  shade_code: string;
  shade_name: string;
  percentage?: string;
  available_stock_kg?: number;

  // ✅ fibre composition (renamed blend_composition for backward compatibility)
  blend_composition: FibreComposition[];
}

// ✅ Used in create and update API payloads
export interface ShadeCreateInput {
  shade_code: string;
  shade_name: string;
  percentage?: string;
  available_stock_kg?: number;

  // ✅ payload key kept as blend_composition for now
  blend_composition: FibreCompositionInput[];
}

// ✅ Used in frontend display views (with metadata & optional helpers)
export interface ShadeWithBlendDescription extends Shade {
  blend_composition: FibreComposition[];

  // Optional helpers for UI display (e.g. table)
  blend_code?: string; // e.g. "COT + VIS"
  blend_description?: string; // e.g. "Cotton - 50%, Viscose - 50%"
}