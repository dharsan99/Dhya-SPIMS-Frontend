import api from './axios';
import { PurchaseOrder } from '../types/purchaseOrder';
import { PurchaseOrderFormValues } from '../components/Orders/purchaseorders/PurchaseOrderReviewForm';

const endpoint = '/api/purchase-orders';


export const uploadAndParsePurchaseOrder = async (file: File): Promise<PurchaseOrder> => {
  const formData = new FormData();
  formData.append('file', file); // The key 'file' must match the backend's upload.single('file')

  try {
    // Note the use of { headers: { 'Content-Type': 'multipart/form-data' } }
    // Axios usually sets this automatically with FormData, but it's good practice.
    const res = await api.post(`${endpoint}/upload-and-parse`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * 📦 Fetch all purchase orders
 */
export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * 🔍 Get purchase order by ID
 */
export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder> => {
  try {
    const res = await api.get(`${endpoint}/${id}`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * ✍️ Create a new purchase order
 */
export const createPurchaseOrder = async (data: PurchaseOrderFormValues) => {
  if (!data.poDate) {
    throw new Error('❌ PO Date is required');
  }

  const payload = {
    po_number: data.poNumber,
    po_date: new Date(data.poDate),
    buyer_name: data.buyerName,
    buyer_contact_name: data.buyerContactName,
    buyer_contact_phone: data.buyerContactPhone,
    buyer_email: data.buyerEmail,
    buyer_address: data.buyerAddress,
    buyer_gst_no: data.buyerGstNo,
    buyer_pan_no: data.buyerPanNo,
    supplier_name: data.supplierName,
    supplier_gst_no: data.supplierGstNo,
    payment_terms: data.paymentTerms,
    style_ref_no: data.styleRefNo,
    delivery_address: data.deliveryAddress,
    tax_details: data.taxDetails,
    grand_total: data.grandTotal,
    amount_in_words: data.amountInWords,
    notes: data.notes,
    items: data.items.map((item) => ({
      order_code: item.orderCode,
      yarn_description: item.yarnDescription,
      color: item.color,
      uom: item.uom,
      bag_count: item.bagCount,
      quantity: item.quantity,
      rate: item.rate,
      gst_percent: item.gstPercent,
      taxable_amount: item.taxableAmount,
      shade_no: item.shadeNo,
    })),
  };

  try {
    const response = await api.post(endpoint, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * 🛠️ Update purchase order
 */
export const updatePurchaseOrder = async (id: string, data: PurchaseOrderFormValues) => {
  try {
    const payload = {
      po_number: data.poNumber,
      po_date: data.poDate ? new Date(data.poDate) : undefined,
      buyer_name: data.buyerName,
      buyer_contact_name: data.buyerContactName,
      buyer_contact_phone: data.buyerContactPhone,
      buyer_email: data.buyerEmail,
      buyer_address: data.buyerAddress,
      buyer_gst_no: data.buyerGstNo,
      buyer_pan_no: data.buyerPanNo,
      supplier_name: data.supplierName,
      supplier_gst_no: data.supplierGstNo,
      payment_terms: data.paymentTerms,
      style_ref_no: data.styleRefNo,
      delivery_address: data.deliveryAddress,
      tax_details: data.taxDetails,
      grand_total: data.grandTotal,
      amount_in_words: data.amountInWords,
      notes: data.notes,
      items: data.items.map((item) => ({
        order_code: item.orderCode,
        yarn_description: item.yarnDescription,
        color: item.color,
        count: item.count,
        uom: item.uom,
        bag_count: item.bagCount,
        quantity: item.quantity,
        rate: item.rate,
        gst_percent: item.gstPercent,
        taxable_amount: item.taxableAmount,
        shade_no: item.shadeNo,
      })),
    };

    const res = await api.put(`${endpoint}/${id}`, payload);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * 🗑️ Delete purchase order
 */
export const deletePurchaseOrder = async (id: string) => {
  try {
    const res = await api.delete(`${endpoint}/${id}`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * 🧠 Parse PO text via AI and return mapped form values
 */
export const parsePurchaseOrder = async (rawText: string): Promise<PurchaseOrderFormValues> => {
  try {
    const res = await api.post('/parse-purchase-order', { text: rawText });
    if (!res.data || typeof res.data !== 'object') {
      throw new Error('❌ Invalid response format from AI parser');
    }
    return mapParsedAIResponseToFormValues(res.data);
  } catch (err: any) {
    throw err;
  }
};

/**
 * 🔁 Map AI-parsed response to form-compatible structure
 */
export const mapParsedAIResponseToFormValues = (raw: any): PurchaseOrderFormValues => {
  const safeNumber = (val: any): number => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  return {
    poNumber: raw.purchase_order_number ?? 'N/A',
    poDate: raw.po_date ?? '',
    buyerName: raw.buyer_name ?? 'N/A',
    buyerContactName: '', // not available
    buyerContactPhone: raw.buyer_contact ?? '',
    buyerEmail: raw.email ?? '',
    buyerAddress: raw.buyer_address ?? '',
    buyerGstNo: raw.buyer_gst_no ?? '',
    buyerPanNo: raw.buyer_pan_no ?? '',

    supplierName: raw.vendor_name ?? '',
    supplierGstNo: raw.vendor_gst_no ?? '',
    paymentTerms: raw.payment_terms ?? '',
    styleRefNo: raw.style_ref_no ?? '',
    deliveryAddress: raw.delivery_address ?? '',

    taxDetails: {
      cgst: safeNumber(raw.cgst),
      sgst: safeNumber(raw.sgst),
      igst: safeNumber(raw.igst),
      round_off: safeNumber(raw.roundoff),
    },

    grandTotal: safeNumber(raw.net_amount ?? raw.total_amount),
    amountInWords: raw.amount_in_words ?? '',
    notes: raw.remarks ?? '',

    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          orderCode: item.order_buyer_no ?? '',
          yarnDescription: item.yarn_description ?? 'N/A',
          color: item.color ?? '',
          count: null,
          uom: item.uom ?? 'KGS',
          bagCount: safeNumber(item.bag),
          quantity: safeNumber(item.qty),
          rate: safeNumber(item.unit_rate),
          gstPercent: item.gst_percent
            ? safeNumber(item.gst_percent.toString().replace('%', ''))
            : null,
          taxableAmount: safeNumber(item.taxable_amount),
          shadeNo: raw.shade_no ?? '',
        }))
      : [],
  };
};

/**
 * ✅ Verify a purchase order
 */
export const verifyPurchaseOrder = async (id: string) => {
  try {
    const res = await api.post(`${endpoint}/${id}/verify`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

/**
 * 🔁 Convert a verified purchase order to a sales order
 */
export const convertPurchaseOrder = async (
  id: string,
  authorizationData: {
    buyer_id: string;
    shade_id: string;
    quantity_kg: number;
    delivery_date: string;
    count?: number;
    realisation?: number;
    items: Array<{
      order_code: string;
      yarn_description: string;
      color: string;
      count: number;
      uom: string;
      bag_count: number;
      quantity: number;
      rate: number;
      gst_percent: number;
      taxable_amount: number;
      shade_id: string;
    }>;
  }
) => {
  try {
    const res = await api.post(`${endpoint}/${id}/convert`, authorizationData);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};