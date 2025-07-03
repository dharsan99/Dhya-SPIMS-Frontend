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

// Used when creating or updating raw cotton entry
export interface RawCottonCompositionInput {
  lot_number?: string;
  percentage?: number;
  grade?: string;
  source?: string;
  notes?: string;
  stock_kg?: string;
}

// Used when fetching raw cotton entries from backend
export interface RawCottonComposition extends RawCottonCompositionInput {
  id?: string;
  created_at?: string;
}

// Base shade interface shared across system
export interface Shade {
  id: string;
  shade_code: string;
  shade_name: string;
  percentage: string;
  available_stock_kg?: number;
  blend_composition: FibreComposition[];
  raw_cotton_compositions?: RawCottonComposition[];
}

// ✅ Used in create and update API payloads
export interface ShadeCreateInput {
  shade_code: string;
  shade_name: string;
  percentage: string;
  available_stock_kg?: number;
  blend_composition: {
    fibre_id: string;
    percentage: number;
  }[];
  raw_cotton_compositions?: RawCottonCompositionInput[];
}

// ✅ Used in frontend display views (with metadata & optional helpers)
export interface ShadeWithBlendDescription extends Shade {
  raw_cotton_compositions?: RawCottonComposition[]; // updated to array
  blend_composition: FibreComposition[];

  // Optional helpers for UI display (e.g. table)
  blend_code?: string; // e.g. "COT + VIS"
  blend_description?: string; // e.g. "Cotton - 50%, Viscose - 50%"
}