// Form data used when creating or editing a production record
export interface ProductionForm {
    tenant_id: string;
    date: string; // Format: YYYY-MM-DD
    section: string;
    shift: string;
    value: number;
    linked_order_id: string;
    entered_by: string;
  }
  export type Production = ProductionRecord;
  // Production record returned by the API (includes nested order details)
  export interface ProductionRecord extends ProductionForm {
    id: string;
    created_at: string;
    orders?: {
      id: string;
      order_number: string;
      buyer_name: string;
    };
  }