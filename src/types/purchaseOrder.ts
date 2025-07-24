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
  id: string;
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
  shadeNo?: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  poNumber: string;
  poDate?: string;
  buyerName: string;
  buyerContactName?: string;
  buyerContactPhone?: string;
  buyerEmail?: string;
  buyerAddress?: string;
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
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  status: string;
  deliveryDate?: string;
  shadeCode: string;
  quantityKg: number;
  items?: PurchaseOrderItem[];
}