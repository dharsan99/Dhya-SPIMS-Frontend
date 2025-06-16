export interface PurchaseOrderItemFormValues {
  orderCode?: string;
  yarnDescription: string;
  color?: string;
  count?: number;
  uom?: string;
  bagCount?: number;
  quantity: number;
  rate: number;
  gstPercent?: number;
  taxableAmount: number;
  shade_id?: string;
}
export interface PurchaseOrderFormValues {
  poNumber: string;
  poDate?: string;
  buyerName: string;
  buyerContactName?: string;
  buyerContactPhone?: string;
  buyerEmail?: string;
  buyerAddress?: string;
  buyerPhone?: string;
  buyerGstNo?: string;
  buyerPanNo?: string;
  supplierName?: string;
  supplierGstNo?: string;
  paymentTerms?: string;
  styleRefNo?: string;
  deliveryAddress?: string;
  taxDetails?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
  };
  grandTotal: number;
  amountInWords?: string;
  notes?: string;
  items: PurchaseOrderItemFormValues[];
}

export interface PurchaseOrderItem {
  shade_no: any;
  id: string;
  order_code?: string;
  yarn_description: string;
  color?: string;
  count?: number;
  uom?: string;
  bag_count?: number;
  quantity: number;
  rate: number;
  gst_percent?: number;
  taxable_amount: number;
  shade_id?: string;
}

export interface PurchaseOrder {
  id: string;
  tenant_id: string;
  po_number: string;
  po_date?: string;
  buyer_name: string;
  buyer_contact_name?: string;
  buyer_contact_phone?: string;
  buyer_email?: string;
  buyer_address?: string;
  buyer_gst_no?: string;
  buyer_pan_no?: string;
  supplier_name?: string;
  supplier_gst_no?: string;
  payment_terms?: string;
  style_ref_no?: string;
  delivery_address?: string;
  tax_details?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
  };
  grand_total: number;
  amount_in_words?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  status: string;
  delivery_date?: string;
  shade_code: string;
  quantity_kg: number;
  items?: PurchaseOrderItem[];
}