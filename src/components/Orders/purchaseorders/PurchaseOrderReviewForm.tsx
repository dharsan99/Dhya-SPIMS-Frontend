// Updated editable version of PurchaseOrderReviewForm
import React, { useState, useMemo } from 'react';

import type { ProductionRecord } from '../../../types/production';
import { 
  CheckCircleIcon, 

  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,

  CalculatorIcon,
  CurrencyRupeeIcon,
  CubeIcon,
  TagIcon
} from '@heroicons/react/24/outline';

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
  onEditInFullForm?: () => void; // New prop for editing in full form
  status?: 'uploaded' | 'verified' | 'converted';
  productions: ProductionRecord[];
  mode?: 'view' | 'edit'; // Add mode prop for explicit edit/view control
}

const PurchaseOrderReviewForm: React.FC<Props> = ({
  data,
  onChange,
  onCancel,
  onDelete,
  onVerify,
  onConvert,
  onEditInFullForm,
  status,

  mode = 'edit', // Default to edit mode
}) => {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit'>(mode);
  
  // Make the form editable in Edit Mode regardless of status
  const isReadOnly = currentMode === 'view';



  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalGST = data.items.reduce((sum, item) => {
      const gstAmount = (item.quantity * item.rate * (item.gstPercent || 0)) / 100;
      return sum + gstAmount;
    }, 0);
    const grandTotal = subtotal + totalGST;
    
    return {
      subtotal,
      totalGST,
      grandTotal,
      itemCount: data.items.length
    };
  }, [data.items]);

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      orderCode: '',
      yarnDescription: '',
      color: '',
      count: 0,
      uom: 'KGS',
      bagCount: 0,
      quantity: 0,
      rate: 0,
      gstPercent: 18, // Default GST rate
      taxableAmount: 0,
      shadeNo: ''
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate taxable amount
    if (field === 'quantity' || field === 'rate' || field === 'gstPercent') {
      const item = newItems[index];
      const subtotal = item.quantity * item.rate;
      const gstAmount = (subtotal * (item.gstPercent || 0)) / 100;
      newItems[index].taxableAmount = subtotal + gstAmount;
    }
    
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            status === 'uploaded' ? 'bg-yellow-500' :
            status === 'verified' ? 'bg-green-500' :
            status === 'converted' ? 'bg-blue-500' : 'bg-gray-500'
          }`} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentMode === 'edit' ? 'Edit' : 'View'} Purchase Order
          </h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            currentMode === 'edit' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {currentMode.toUpperCase()} MODE
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'uploaded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
            status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            status === 'converted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-800'
          }`}>
            {status?.toUpperCase() || 'DRAFT'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {/* Edit in Full Form Button */}
          {onEditInFullForm && (
            <button
              onClick={onEditInFullForm}
              className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit in Full Form
            </button>
          )}
          
          {/* Edit/View Toggle */}
          <button
            onClick={() => setCurrentMode(currentMode === 'edit' ? 'view' : 'edit')}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentMode === 'edit' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {currentMode === 'edit' ? (
              <>
                <EyeIcon className="w-4 h-4 mr-2" />
                View Mode
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Mode
              </>
            )}
          </button>
          
          {onVerify && (
            <button
              onClick={onVerify}
              className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Verify
            </button>
          )}
          {onConvert && (
            <button
              onClick={onConvert}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Convert to Sales Order
            </button>
          )}
        </div>
      </div>

      {/* Buyer & Supplier Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-lg mb-4 flex items-center">
            <EyeIcon className="w-5 h-5 mr-2" />
            Buyer Details
          </h3>
          <div className="space-y-4">
            <Field label="Buyer Name" value={data.buyerName} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerName: v })} />
            <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Name" value={data.buyerContactName} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerContactName: v })} />
            <Field label="Contact Phone" value={data.buyerContactPhone} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerContactPhone: v })} />
            </div>
            <Field label="Email" value={data.buyerEmail} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerEmail: v })} />
            <Field label="Address" value={data.buyerAddress} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, buyerAddress: v })} />
            <div className="grid grid-cols-2 gap-4">
            <Field label="GST No" value={data.buyerGstNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerGstNo: v })} />
            <Field label="PAN No" value={data.buyerPanNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, buyerPanNo: v })} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-700 dark:text-green-300 text-lg mb-4 flex items-center">
            <PencilIcon className="w-5 h-5 mr-2" />
            Supplier Details
          </h3>
          <div className="space-y-4">
            <Field label="Supplier Name" value={data.supplierName} readOnly={isReadOnly} onChange={v => onChange({ ...data, supplierName: v })} />
            <Field label="Supplier GST No" value={data.supplierGstNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, supplierGstNo: v })} />
            <Field label="Payment Terms" value={data.paymentTerms} readOnly={isReadOnly} onChange={v => onChange({ ...data, paymentTerms: v })} />
            <Field label="Style Ref No" value={data.styleRefNo} readOnly={isReadOnly} onChange={v => onChange({ ...data, styleRefNo: v })} />
            <Field label="Delivery Address" value={data.deliveryAddress} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, deliveryAddress: v })} />
          </div>
        </div>
      </div>

      {/* Order Info Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-700 dark:text-purple-300 text-lg mb-4">Order Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="PO Number" value={data.poNumber} readOnly={isReadOnly} onChange={v => onChange({ ...data, poNumber: v })} />
          <Field 
            label="PO Date" 
            value={data.poDate ? new Date(data.poDate).toLocaleDateString() : ''} 
            readOnly={isReadOnly} 
            onChange={v => onChange({ ...data, poDate: v })} 
          />
        <Field label="Grand Total" value={`₹${Number(data.grandTotal ?? 0).toFixed(2)}`} readOnly={isReadOnly} onChange={v => onChange({ ...data, grandTotal: v })} />
        </div>
        <div className="mt-4">
        <Field label="Amount in Words" value={data.amountInWords} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, amountInWords: v })} />
        </div>
      </div>

      {/* Enhanced Order Items Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-orange-700 dark:text-orange-300 text-lg">Order Items</h3>
            <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full">
              {totals.itemCount} {totals.itemCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          {!isReadOnly && (
            <button
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </button>
          )}
        </div>

        {/* Items Cards */}
        <div className="space-y-4">
          {data.items.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700">
              <CubeIcon className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Added</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding items to your purchase order</p>
              {!isReadOnly && (
                <button
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add First Item
                </button>
              )}
            </div>
          ) : (
            data.items.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                {/* Item Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <span className="text-orange-700 dark:text-orange-300 font-medium text-sm">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      {!isReadOnly ? (
                        <input
                          className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b-2 border-orange-300 dark:border-orange-600 focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-colors"
                          value={item.yarnDescription || ''}
                          onChange={e => updateItem(idx, 'yarnDescription', e.target.value)}
                          placeholder="Enter item name..."
                        />
                      ) : (
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.yarnDescription || 'Untitled Item'}
                        </h4>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.orderCode ? `Order Code: ${item.orderCode}` : 'No order code'}
                      </p>
                    </div>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-3"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Item Content */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <TagIcon className="w-4 h-4 mr-2" />
                        Basic Information
                      </h5>
                      <div className="space-y-2">
                        <Field 
                          label="Order Code" 
                          value={item.orderCode || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'orderCode', v)} 
                        />
                        <Field 
                          label="Color" 
                          value={item.color || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'color', v)} 
                        />
                        <Field 
                          label="Shade No" 
                          value={item.shadeNo || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'shadeNo', v)} 
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CubeIcon className="w-4 h-4 mr-2" />
                        Specifications
                      </h5>
                      <div className="space-y-2">
                        <Field 
                          label="Count" 
                          value={item.count || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'count', Number(v))} 
                        />
                        <Field 
                          label="UOM" 
                          value={item.uom || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'uom', v)} 
                        />
                        <Field 
                          label="Bag Count" 
                          value={item.bagCount || ''} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'bagCount', Number(v))} 
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
                        Pricing
                      </h5>
                      <div className="space-y-2">
                        <Field 
                          label="Quantity" 
                          value={item.quantity} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'quantity', Number(v))} 
                        />
                        <Field 
                          label="Rate" 
                          value={item.rate} 
                          readOnly={isReadOnly} 
                          onChange={v => updateItem(idx, 'rate', Number(v))} 
                        />
                        <Field 
                          label="GST %" 
                          value={item.gstPercent || ''} 
          readOnly={isReadOnly}
                          onChange={v => updateItem(idx, 'gstPercent', Number(v))} 
                        />
                      </div>
                    </div>

                    {/* Calculations */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CalculatorIcon className="w-4 h-4 mr-2" />
                        Calculations
                      </h5>
                      <div className="space-y-2">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span className="font-medium">₹{((item.quantity || 0) * (item.rate || 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">GST ({(item.gstPercent || 0)}%):</span>
                            <span className="font-medium">₹{(((item.quantity || 0) * (item.rate || 0) * (item.gstPercent || 0)) / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium text-orange-600 dark:text-orange-400 border-t border-gray-200 dark:border-gray-600 pt-1">
                            <span>Total:</span>
                            <span>₹{(Number(item.taxableAmount) || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>

        {/* Order Summary */}
        {data.items.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totals.subtotal.toFixed(2)}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Subtotal</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totals.totalGST.toFixed(2)}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Total GST</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{totals.grandTotal.toFixed(2)}</div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Grand Total</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-4">Additional Details</h3>
        <Field label="Notes" value={data.notes} readOnly={isReadOnly} multiLine onChange={v => onChange({ ...data, notes: v })} />
        </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

// Enhanced Field component
const Field: React.FC<{ label: string; value?: any; readOnly?: boolean; multiLine?: boolean; onChange?: (v: any) => void }> = ({ 
  label, 
  value = '', 
  readOnly, 
  multiLine, 
  onChange 
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    {multiLine ? (
      <textarea 
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" 
        value={value} 
        onChange={e => onChange && onChange(e.target.value)} 
        readOnly={readOnly} 
        rows={3} 
      />
    ) : (
      <input 
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" 
        value={value} 
        onChange={e => onChange && onChange(e.target.value)} 
        readOnly={readOnly} 
      />
    )}
  </div>
);

export default PurchaseOrderReviewForm;