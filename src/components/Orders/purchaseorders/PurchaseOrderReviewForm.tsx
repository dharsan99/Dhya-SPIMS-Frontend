import React from 'react';

export interface PurchaseOrderFormValues {
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
  taxDetails?: Record<string, any>;
  grandTotal: number;
  amountInWords?: string;
  notes?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
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

interface Props {
  data: PurchaseOrderFormValues;
  onChange: (data: PurchaseOrderFormValues) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const safe = (val?: string | number | null) => val ?? 'N/A';

const PurchaseOrderReviewForm: React.FC<Props> = ({ data, onCancel, onConfirm }) => {
  return (
    <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto">
      <h2 className="text-lg font-semibold">📝 Review & Edit Purchase Order</h2>

      {/* PO + Buyer/Supplier Info */}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs text-gray-500">PO Number</label><div className="font-medium">{safe(data.poNumber)}</div></div>
        <div><label className="block text-xs text-gray-500">PO Date</label><div className="font-medium">{safe(data.poDate)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer Name</label><div className="font-medium">{safe(data.buyerName)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer Contact Name</label><div className="font-medium">{safe(data.buyerContactName)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer Phone</label><div className="font-medium">{safe(data.buyerContactPhone)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer Email</label><div className="font-medium">{safe(data.buyerEmail)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer Address</label><div className="font-medium">{safe(data.buyerAddress)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer GST No</label><div className="font-medium">{safe(data.buyerGstNo)}</div></div>
        <div><label className="block text-xs text-gray-500">Buyer PAN No</label><div className="font-medium">{safe(data.buyerPanNo)}</div></div>
        <div><label className="block text-xs text-gray-500">Supplier Name</label><div className="font-medium">{safe(data.supplierName)}</div></div>
        <div><label className="block text-xs text-gray-500">Supplier GST No</label><div className="font-medium">{safe(data.supplierGstNo)}</div></div>
        <div><label className="block text-xs text-gray-500">Payment Terms</label><div className="font-medium">{safe(data.paymentTerms)}</div></div>
        <div><label className="block text-xs text-gray-500">Style Ref No</label><div className="font-medium">{safe(data.styleRefNo)}</div></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500">Delivery Address</label><div className="font-medium">{safe(data.deliveryAddress)}</div></div>
      </div>

      {/* Items Table */}
      <div>
        <label className="block text-sm font-medium mb-2">Items</label>
        <table className="w-full text-xs border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Order Code</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Color</th>
              <th className="border px-2 py-1">Count</th>
              <th className="border px-2 py-1">UOM</th>
              <th className="border px-2 py-1">Bag Count</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">GST %</th>
              <th className="border px-2 py-1">Taxable</th>
              <th className="border px-2 py-1">Shade No</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{safe(item.orderCode)}</td>
                <td className="border px-2 py-1">{safe(item.yarnDescription)}</td>
                <td className="border px-2 py-1">{safe(item.color)}</td>
                <td className="border px-2 py-1 text-right">{safe(item.count)}</td>
                <td className="border px-2 py-1">{safe(item.uom)}</td>
                <td className="border px-2 py-1 text-right">{safe(item.bagCount)}</td>
                <td className="border px-2 py-1 text-right">{safe(item.quantity)}</td>
                <td className="border px-2 py-1 text-right">₹{safe(item.rate)}</td>
                <td className="border px-2 py-1 text-right">{safe(item.gstPercent)}%</td>
                <td className="border px-2 py-1 text-right">₹{safe(item.taxableAmount)}</td>
                <td className="border px-2 py-1">{safe(item.shadeNo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tax Details */}
      {data.taxDetails && (
        <div>
          <label className="block text-xs text-gray-500">Tax Details</label>
          <pre className="bg-gray-100 text-xs p-2 rounded max-h-48 overflow-auto">
            {JSON.stringify(data.taxDetails, null, 2)}
          </pre>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-xs text-gray-500">Notes</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          value={data.notes ?? ''}
          rows={3}
          readOnly
        />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-semibold text-sm text-right">
       <div>Grand Total: ₹{(data.grandTotal ?? 0).toFixed(2)}</div>
      </div>
      <div className="text-right text-xs text-gray-500">{safe(data.amountInWords)}</div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Confirm & Save
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrderReviewForm;