export interface Shade {
    id: string;
    shade_code: string;
    shade_name: string;
    brand_id: string;
    blend_id: string;
    percentage: string;
    available_stock_kg: number;
  }
  
  export type ShadeFormData = Omit<Shade, 'id'>;