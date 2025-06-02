export interface BlendFibre {
    id: string;
    blend_id: string;
    fibre_id: string;
    percentage: number;
    fibres: {
      id: string;
      fibre_name: string;
      fibre_code: string;
      stock_kg: number;
      description?: string | null;
      created_at: string;
      updated_at: string;
    };
    blends: {
      id: string;
      blend_code: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
  }