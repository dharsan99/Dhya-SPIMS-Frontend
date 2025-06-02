import api from './axios';
import { PurchaseOrder } from '../types/purchaseOrder';
import { PurchaseOrderFormValues } from '../components/Orders/purchaseorders/PurchaseOrderReviewForm';

const endpoint = '/purchase-orders';

/**
 * 📦 Fetch all purchase orders
 */
export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  console.log('📤 [API] GET', endpoint, '- Fetching all purchase orders...');
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (err: any) {
    console.error('❌ [API] Failed to fetch purchase orders:', err.response?.data || err.message);
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
    console.error(`❌ [API] Failed to fetch PO ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * ✍️ Create a new purchase order
 */
export const createPurchaseOrder = async (data: PurchaseOrderFormValues) => {
  console.log('📤 [API] POST', endpoint, '- Creating PO with:', data);
if (!data.poDate) {
  throw new Error("❌ PO Date is required");
}
  const payload = {
    po_number: data.poNumber,
    po_date: new Date(data.poDate), // ✅ convert string to Date
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
    console.log('✅ [API] Purchase order created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [API] Failed to create purchase order:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🛠️ Update purchase order
 */
export const updatePurchaseOrder = async (id: string, data: PurchaseOrderFormValues) => {
  console.log(`🛠️ [API] PUT ${endpoint}/${id} - Updating PO`);
  try {
    const res = await api.put(`${endpoint}/${id}`, data);
    return res.data;
  } catch (err: any) {
    console.error(`❌ [API] Failed to update PO ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * 🗑️ Delete purchase order
 */
export const deletePurchaseOrder = async (id: string) => {
  console.log(`🗑️ [API] DELETE ${endpoint}/${id}`);
  try {
    const res = await api.delete(`${endpoint}/${id}`);
    return res.data;
  } catch (err: any) {
    console.error(`❌ [API] Failed to delete PO ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * 🧠 Parse PO text via AI
 */
export const parsePurchaseOrder = async (rawText: string) => {
  console.log('🧠 [API] POST /parse-purchase-order - Parsing raw text');
  try {
    const res = await api.post('/parse-purchase-order', { text: rawText });
    return res.data;
  } catch (err: any) {
    console.error('❌ [API] Failed to parse PO:', err.response?.data || err.message);
    throw err;
  }
};