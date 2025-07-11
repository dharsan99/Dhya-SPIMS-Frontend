export interface OrderFormData {
  tenant_id: string;
  order_number: string;
  buyer_name: string;
  quantity_kg: number;
  delivery_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dispatched'; 
  created_by: string;
  count?: number;
}

export interface Order extends OrderFormData {
  realisation?: string | number;
  shade_id: string;
  buyer_id: string;
  shade: any;
  buyer: any;
  id: string;
  created_at: string;
  updated_at: string;
  count?: number;
}

