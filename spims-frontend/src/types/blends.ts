export interface Blend {
  id: string;
  blend_code: string;
  description?: string;
  blend_fibres: BlendFibre[];
}

export interface BlendFibre {
  percentage: number;
  fibres: {
    stock_kg: string;
    fibre_name: string;
    fibre_code?: string;
  };
}