export interface OrderFormData {
  tenant_id: string;
  order_number: string;
  buyer_name: string;
  quantity_kg: number;
  delivery_date: string;
  status: 'pending' | 'in_progress' | 'completed'; 
  created_by: string;
}

export interface Order extends OrderFormData {
  realisation?: string | number;
  shade_id: string;
  buyer_id: string;
  shade: any;
  buyer: any;
  id: string;
  created_at: string;
}