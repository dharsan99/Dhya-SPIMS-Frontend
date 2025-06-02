// src/types/supplier.ts
export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  }