// src/types/order.ts

export interface YarnDetails {
  count_range: string;
  base_shade: string;
  blend_id: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  order_number: string;
  buyer_name: string;
  yarn_id: string;
  quantity_kg: number;
  delivery_date: string;
  status: 'pending' | 'in_progress' | 'dispatched';
  created_by: string;
  created_at: string;
  yarns: YarnDetails;
}