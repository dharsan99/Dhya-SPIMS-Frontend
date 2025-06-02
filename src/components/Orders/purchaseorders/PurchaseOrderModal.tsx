import React from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../../types/purchaseOrder';
import { TailwindDialog } from '../../ui/Dialog';

interface Props {
  isOpen: boolean;
  order?: PurchaseOrder | null;
  onClose: () => void;
  mode: 'view' | 'edit';
  onSave?: (data: PurchaseOrderFormValues, orderId: string) => void;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd for input
};

const PurchaseOrderModal: React.FC<Props> = ({ isOpen, onClose, order, mode, onSave }) => {
  const [formData, setFormData] = React.useState<PurchaseOrder | null>(order ?? null);
React.useEffect(() => {
  setFormData(order ?? null); // ✅ always PurchaseOrder or null
}, [order]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof PurchaseOrder, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleItemChange = (index: number, key: string, value: any) => {
    const updatedItems = [...(formData.items || [])];
    (updatedItems[index] as any)[key] = value;
    setFormData({ ...formData, items: updatedItems });
  };

const handleSubmit = () => {
  if (!formData || !onSave || !formData.id) return;

  const {
    po_number,
    po_date,
    buyer_name,
    buyer_contact_name,
    buyer_contact_phone,
    buyer_email,
    buyer_address,
    buyer_gst_no,
    buyer_pan_no,
    supplier_name,
    supplier_gst_no,
    payment_terms,
    style_ref_no,
    delivery_address,
    tax_details,
    grand_total,
    amount_in_words,
    notes,
    items,
  } = formData;

  const formValues: PurchaseOrderFormValues = {
    poNumber: po_number,
    poDate: po_date,
    buyerName: buyer_name,
    buyerContactName: buyer_contact_name,
    buyerContactPhone: buyer_contact_phone,
    buyerEmail: buyer_email,
    buyerAddress: buyer_address,
    buyerGstNo: buyer_gst_no,
    buyerPanNo: buyer_pan_no,
    supplierName: supplier_name,
    supplierGstNo: supplier_gst_no,
    paymentTerms: payment_terms,
    styleRefNo: style_ref_no,
    deliveryAddress: delivery_address,
    taxDetails: tax_details,
    grandTotal: grand_total,
    amountInWords: amount_in_words,
    notes,
    items: items?.map((item) => ({
      orderCode: item.order_code || 'N/A',
      yarnDescription: item.yarn_description || '—',
      color: item.color || '',
      uom: item.uom || 'KGS',
      bagCount: item.bag_count ?? 0,
      quantity: item.quantity ?? 0,
      rate: item.rate ?? 0,
      gstPercent: item.gst_percent ?? 0,
      taxableAmount: item.taxable_amount ?? 0,
      shadeNo: item.shade_no || 'N/A',
    })) || [],
  };

  onSave(formValues, formData.id);
};

  const isView = mode === 'view';

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${isView ? 'PO Review' : 'Edit PO'} - PO-${formData.po_number}`}
      maxWidth="max-w-5xl"
    >
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 dark:text-white">
        {[
          ['po_number', 'PO Number'],
          ['buyer_name', 'Buyer Name'],
          ['buyer_contact_name', 'Contact Person'],
          ['buyer_contact_phone', 'Contact Phone'],
          ['buyer_email', 'Email'],
          ['buyer_address', 'Buyer Address'],
          ['buyer_gst_no', 'Buyer GST'],
          ['buyer_pan_no', 'Buyer PAN'],
          ['supplier_name', 'Supplier Name'],
          ['supplier_gst_no', 'Supplier GST'],
          ['payment_terms', 'Payment Terms'],
          ['style_ref_no', 'Style Ref No'],
          ['delivery_address', 'Delivery Address'],
          ['grand_total', 'Grand Total'],
          ['amount_in_words', 'Amount in Words'],
        ].map(([key, label]) => (
          <p key={key}>
            <strong>{label}:</strong>{' '}
            {isView ? (formData as any)[key] ?? '—' : (
              <input
                className="w-full border px-2 py-1 rounded"
                value={(formData as any)[key] || ''}
                onChange={(e) => handleChange(key as keyof PurchaseOrder, e.target.value)}
              />
            )}
          </p>
        ))}

        <p>
          <strong>PO Date:</strong>{' '}
          {isView ? formatDate(formData.po_date) : (
            <input
              type="date"
              className="w-full border px-2 py-1 rounded"
              value={formatDate(formData.po_date)}
              onChange={(e) => handleChange('po_date', e.target.value)}
            />
          )}
        </p>

        <p>
          <strong>Delivery Date:</strong>{' '}
          {isView ? formatDate(formData.delivery_date) : (
            <input
              type="date"
              className="w-full border px-2 py-1 rounded"
              value={formatDate(formData.delivery_date)}
              onChange={(e) => handleChange('delivery_date', e.target.value)}
            />
          )}
        </p>

        <p className="col-span-2">
          <strong>Notes:</strong>{' '}
          {isView ? formData.notes ?? '—' : (
            <textarea
              className="w-full border px-2 py-1 rounded"
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          )}
        </p>

        <p className="col-span-2">
          <strong>Status:</strong>{' '}
          {isView ? formData.status : (
            <select
              className="w-full border px-2 py-1 rounded"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </p>
      </div>

      {formData.items && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2">Order Code</th>
                <th className="p-2">Description</th>
                <th className="p-2">Color</th>
                <th className="p-2">Shade No</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Rate</th>
                <th className="p-2">GST %</th>
                <th className="p-2">Taxable</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={idx} className="border-t dark:border-gray-700">
                  {[
                    ['order_code', 'text'],
                    ['yarn_description', 'text'],
                    ['color', 'text'],
                    ['shade_no', 'text'],
                    ['quantity', 'number'],
                    ['rate', 'number'],
                    ['gst_percent', 'number'],
                    ['taxable_amount', 'number'],
                  ].map(([field, type]) => (
                    <td key={field} className="p-2">
                      {isView ? (item as any)[field] ?? '—' : (
                        <input
                          type={type}
                          className="w-full border px-2 py-1 rounded"
                          value={(item as any)[field] || ''}
                          onChange={(e) =>
                            handleItemChange(idx, field, e.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isView && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      )}
    </TailwindDialog>
  );
};

export default PurchaseOrderModal;