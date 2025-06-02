
export interface FibreTransfer {
    sent_kg: string;
    id: string;
    fibre_id: string;
    supplier_id: string;
    sent_qty_kg: number;
    sent_date: string;
    expected_return?: string;
    returned_kg?: number;
    return_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  
    fibre?: {
      id: string;
      fibre_name: string;
    };
  
    supplier?: {
      id: string;
      name: string;
    };
  }
  export interface CreateFibreTransfer {
    fibre_id: string;
    supplier_id: string;
    sent_kg: number;
  }