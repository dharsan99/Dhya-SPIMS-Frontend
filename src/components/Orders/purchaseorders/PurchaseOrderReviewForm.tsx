// Updated editable version of PurchaseOrderReviewForm
import React from 'react';
import { aggregateSectionProgress } from '../../../utils/sectionProgress';
import type { ProductionRecord } from '../../../types/production';

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
  onDelete: () => void;
  onVerify?: () => void;
  onConvert?: () => void;
  status?: 'uploaded' | 'verified' | 'converted';
  productions: ProductionRecord[];
}

const PurchaseOrderReviewForm: React.FC<Props> = ({
  data,
  onChange,
  onCancel,
  onDelete,
  onVerify,
  onConvert,
  status,
  productions,
}) => {
  const isReadOnly = status !== 'uploaded';
  const orderId = data.poNumber;
  const sectionProgress = aggregateSectionProgress(productions, orderId);

  return (
    <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Review Purchase Order</h2>

      {/* Buyer & Supplier Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4 border">
        <div>
          <h3 className="font-semibold text-blue-700 mb-2">Buyer Details</h3>
          <div className="space-y-2">
            <Field label="Buyer Name" value={data.buyerName} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerName: v })} />
            <Field label="Contact Name" value={data.buyerContactName} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerContactName: v })} />
            <Field label="Contact Phone" value={data.buyerContactPhone} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerContactPhone: v })} />
            <Field label="Email" value={data.buyerEmail} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerEmail: v })} />
            <Field label="Address" value={data.buyerAddress} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, buyerAddress: v })} />
            <Field label="GST No" value={data.buyerGstNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerGstNo: v })} />
            <Field label="PAN No" value={data.buyerPanNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerPanNo: v })} />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-indigo-700 mb-2">Supplier Details</h3>
          <div className="space-y-2">
            <Field label="Supplier Name" value={data.supplierName} readOnly={isReadOnly} onChange={v => onChange({ ...data, supplierName: v })} />
            <Field label="Supplier GST No" value={data.supplierGstNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, supplierGstNo: v })} />
            <Field label="Payment Terms" value={data.paymentTerms} readOnly={isReadOnly} onChange={v => onChange({ ...data, paymentTerms: v })} />
            <Field label="Style Ref No" value={data.styleRefNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, styleRefNo: v })} />
            <Field label="Delivery Address" value={data.deliveryAddress} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, deliveryAddress: v })} />
          </div>
        </div>
      </div>

      {/* Order Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-4 border">
        <Field label="PO Number" value={data.poNumber} readOnly={isReadOnly} onChange={v => onChange({ ...data, poNumber: v })} />
        <Field label="PO Date" value={data.poDate} readOnly={isReadOnly} onChange={v => onChange({ ...data, poDate: v })} />
        <Field label="Grand Total" value={`₹${Number(data.grandTotal ?? 0).toFixed(2)}`} readOnly={isReadOnly} onChange={v => onChange({ ...data, grandTotal: v })} />
        <Field label="Amount in Words" value={data.amountInWords} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, amountInWords: v })} />
      </div>

      {/* Items Table Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Items</label>
        <div className="overflow-x-auto rounded border">
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
                <tr key={idx} className="bg-white hover:bg-gray-50">
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.orderCode} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].orderCode = e.target.value;
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.yarnDescription} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].yarnDescription = e.target.value;
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.color} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].color = e.target.value;
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.count} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].count = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.uom} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].uom = e.target.value;
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.bagCount} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].bagCount = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.quantity} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].quantity = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.rate} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].rate = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.gstPercent} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].gstPercent = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.taxableAmount} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].taxableAmount = Number(e.target.value);
                      onChange({ ...data, items });
                    }} />
                  </td>
                  <td className="border px-2 py-1">
                    <input className="w-full border rounded px-2 py-1 bg-gray-50" value={item.shadeNo} readOnly={isReadOnly} onChange={e => {
                      const items = [...data.items];
                      items[idx].shadeNo = e.target.value;
                      onChange({ ...data, items });
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Details Section */}
      {data.taxDetails && Object.keys(data.taxDetails).length > 0 && (
        <div>
          <label className="block text-xs text-gray-500">Tax Details</label>
          <pre className="bg-gray-100 text-xs p-2 rounded max-h-48 overflow-auto">
            {JSON.stringify(data.taxDetails, null, 2)}
          </pre>
        </div>
      )}

      {/* Notes Section */}
      <div>
        <label className="block text-xs text-gray-500">Notes</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
          value={data.notes ?? ''}
          rows={3}
          readOnly={isReadOnly}
          onChange={e => onChange({ ...data, notes: e.target.value })}
        />
      </div>

      {/* Section-wise Progress */}
      <section>
        <h3 className="font-semibold mb-2">Section-wise Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionProgress.map((sp) => (
            <div key={sp.section} className="bg-white p-3 rounded shadow border">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{sp.section}</span>
                <span>{sp.percent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${sp.percent}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sp.produced.toFixed(2)} kg / {sp.required.toFixed(2)} kg
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white py-3 flex justify-end gap-2 border-t z-10">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        {status === 'uploaded' && onVerify && (
          <button
            onClick={onVerify}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            Mark as Verified
          </button>
        )}
        {status === 'verified' && onConvert && (
          <button
            onClick={onConvert}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Convert to Sales Order
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Helper Field component for consistent display
const Field: React.FC<{ label: string; value?: any; readOnly?: boolean; multiLine?: boolean; onChange?: (v: any) => void }> = ({ label, value, readOnly, multiLine, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    {multiLine ? (
      <textarea className="w-full border rounded px-2 py-1 bg-gray-50" value={value || ''} readOnly={readOnly} rows={2} onChange={e => onChange && onChange(e.target.value)} />
    ) : (
      <input className="w-full border rounded px-2 py-1 bg-gray-50" value={value || ''} readOnly={readOnly} onChange={e => onChange && onChange(e.target.value)} />
    )}
  </div>
);

export default PurchaseOrderReviewForm;