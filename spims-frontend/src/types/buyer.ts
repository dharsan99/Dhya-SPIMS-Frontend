// src/types/buyer.ts

export interface Buyer {
    contact: string;
    id: string;
    name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    tenant_id: string;
    created_by: string;
  }
  
  export interface BuyerFormData {
    name: string;
    contact?: string;
    email?: string;
    phone?: string;
    address?: string;
    tenant_id: string;
    created_by: string;
  }