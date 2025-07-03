import React from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../../types/purchaseOrder';
import { TailwindDialog } from '../../ui/Dialog';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBuyers, createBuyer } from '../../../api/buyers';
import { getAllShades, createShade, getShadeById } from '../../../api/shades';
import SearchableDropdown from '../../SearchableDropdown';
import { TrashIcon } from '@heroicons/react/24/outline';
import ShadeModal from '../../ShadeModal';
import BuyerFormModal from '../../BuyerFormModal';
import { BuyerFormData } from '../../BuyerFormModal';
import { getAllFibers } from '../../../api/fibers';

interface Props {
  isOpen: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
  mode: 'view' | 'edit' | 'verify' | 'authorize';
  onSave: (data: PurchaseOrderFormValues, id: string) => void;
  onVerify?: (id: string) => void;
  onConvert?: (id: string, authorizationData: {
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
  }) => void;
  status?: string;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd for input
};

const PurchaseOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  mode,
  onVerify,
  onConvert,
}) => {
  const [formData, setFormData] = React.useState<PurchaseOrder | null>(order ?? null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authorizationData, setAuthorizationData] = React.useState({
    buyer_id: '',
    shade_id: '',
    count: undefined as number | undefined,
    realisation: undefined as number | undefined,
  });
  const [showBuyerModal, setShowBuyerModal] = React.useState(false);
  const [showShadeModal, setShowShadeModal] = React.useState(false);
  const [buyerInitialData, setBuyerInitialData] = React.useState<BuyerFormData | undefined>(undefined);
  const [items, setItems] = React.useState<Array<{
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
  }>>([]);
  const [modalMode, setModalMode] = React.useState<'view' | 'edit' | 'verify' | 'authorize'>(mode);

  const queryClient = useQueryClient();
  const { data: buyers = [] } = useQuery({ queryKey: ['buyers'], queryFn: getBuyers });
  const { data: shades = [] } = useQuery({ queryKey: ['shades'], queryFn: getAllShades });
  const { data: fibres = [], isLoading: fibresLoading } = useQuery({ queryKey: ['fibres'], queryFn: getAllFibers });

  React.useEffect(() => {
    setFormData(order ?? null);
    setModalMode(mode);
  }, [order, mode]);

  // Set delivery date to 45 days after PO date by default
  React.useEffect(() => {
    if (formData && formData.po_date && !formData.delivery_date) {
      const poDate = new Date(formData.po_date);
      const deliveryDate = new Date(poDate);
      deliveryDate.setDate(poDate.getDate() + 45);
      setFormData(prev => prev ? { ...prev, delivery_date: deliveryDate.toISOString().split('T')[0] } : prev);
    }
  }, [formData?.po_date]);

  React.useEffect(() => {
    if (formData?.items) {
      setItems(formData.items.map(item => ({
        order_code: item.order_code || '',
        yarn_description: item.yarn_description || '',
        color: item.color || '',
        count: item.count || 0,
        uom: item.uom || 'KGS',
        bag_count: item.bag_count || 0,
        quantity: item.quantity || 0,
        rate: item.rate || 0,
        gst_percent: item.gst_percent || 0,
        taxable_amount: item.taxable_amount || 0,
        shade_id: item.shade_id || '',
      })));
    }
  }, [formData]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof PurchaseOrder, value: any) => {
    // If PO date changes, update delivery date unless user has set it
    if (field === 'po_date') {
      const poDate = new Date(value);
      const deliveryDate = new Date(poDate);
      deliveryDate.setDate(poDate.getDate() + 45);
      setFormData({ ...formData!, po_date: value, delivery_date: deliveryDate.toISOString().split('T')[0] });
    } else {
      setFormData({ ...formData!, [field]: value });
    }
  };

  const handleVerify = async () => {
    if (!formData.id || !onVerify) return;
    setIsSubmitting(true);
    try {
      await onVerify(formData.id);
      toast.success('Purchase Order verified successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to verify Purchase Order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthorize = async () => {
    if (!formData?.id || !onConvert) return;
    
    // Validate required fields
    if (!authorizationData.buyer_id) {
      toast.error('Please select a buyer');
      return;
    }
    if (!authorizationData.shade_id) {
      toast.error('Please select a shade');
      return;
    }

    // Validate items
    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    // Validate that all items have a shade selected
    const itemsWithoutShade = items.filter(item => !item.shade_id);
    if (itemsWithoutShade.length > 0) {
      toast.error('Please select a shade for all items');
      return;
    }

    // Calculate total quantity from items
    const quantity_kg = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (quantity_kg <= 0) {
      toast.error('Total quantity must be greater than 0');
      return;
    }

    try {
      const dataToSend = {
        buyer_id: authorizationData.buyer_id,
        shade_id: authorizationData.shade_id,
        quantity_kg,
        delivery_date: formData.delivery_date || new Date().toISOString(),
        count: authorizationData.count,
        realisation: authorizationData.realisation,
        items: items.map(item => ({
          order_code: item.order_code,
          yarn_description: item.yarn_description,
          color: item.color,
          count: item.count,
          uom: item.uom,
          bag_count: item.bag_count,
          quantity: item.quantity,
          rate: item.rate,
          gst_percent: item.gst_percent,
          taxable_amount: item.taxable_amount,
          shade_id: item.shade_id
        }))
      };

      await onConvert(formData.id, dataToSend);
      toast.success('Purchase Order authorized successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to authorize Purchase Order');
    }
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        order_code: '',
        yarn_description: '',
        color: '',
        count: 0,
        uom: 'KGS',
        bag_count: 0,
        quantity: 0,
        rate: 0,
        gst_percent: 0,
        taxable_amount: 0,
        shade_id: '',
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };

  // Validation helpers
  const isItemValid = (item: any) =>
    item.yarn_description && item.quantity && item.rate && item.shade_id;
  const isFormValid = () => {
    // Calculate total percentage for selected shade
    let totalPercentage = 0;
    const selectedShade = shades.find(s => s.id === authorizationData.shade_id);
    if (selectedShade) {
      const blend = Array.isArray((selectedShade as any).blend_composition)
        ? (selectedShade as any).blend_composition.reduce((sum: number, c: any) => sum + (Number(c.percentage) || 0), 0)
        : 0;
      let raw = 0;
      if ((selectedShade as any).raw_cotton_compositions) {
        if (Array.isArray((selectedShade as any).raw_cotton_compositions)) {
          raw = (selectedShade as any).raw_cotton_compositions.reduce((sum: number, c: any) => sum + (Number(c.percentage) || 0), 0);
        } else if (typeof (selectedShade as any).raw_cotton_compositions === 'object') {
          raw = Number((selectedShade as any).raw_cotton_compositions.percentage) || 0;
        }
      }
      totalPercentage = blend + raw;
    }
    // Debug log for validation
    console.log('[AuthorizePO] Validation:', {
      buyer: authorizationData.buyer_id,
      shade: authorizationData.shade_id,
      items,
      itemsValid: items.every(isItemValid),
      totalPercentage
    });
    return (
      authorizationData.buyer_id &&
      authorizationData.shade_id &&
      items.length > 0 &&
      items.every(isItemValid) &&
      totalPercentage > 0
    );
  };
  const getFieldError = (item: any, field: string) => {
    if ((field === 'yarn_description' || field === 'quantity' || field === 'rate' || field === 'shade_id') && !item[field]) {
      return 'Required';
    }
    return '';
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${modalMode === 'verify' ? 'Verify Purchase Order' : modalMode === 'authorize' ? 'Authorize Purchase Order' : 'Edit Purchase Order'} - PO-${formData.po_number}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Buyer & Supplier Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Details */}
          <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
            <h3 className="font-semibold text-blue-700 mb-3 text-lg">Buyer Details</h3>
            <div className="space-y-2">
              <Field label="Buyer Name" value={formData.buyer_name} onChange={v => handleChange('buyer_name', v)} readOnly={modalMode === 'view'} />
              <Field label="Contact Person" value={formData.buyer_contact_name} onChange={v => handleChange('buyer_contact_name', v)} readOnly={modalMode === 'view'} />
              <Field label="Contact Phone" value={formData.buyer_contact_phone} onChange={v => handleChange('buyer_contact_phone', v)} readOnly={modalMode === 'view'} />
              <Field label="Email" value={formData.buyer_email} onChange={v => handleChange('buyer_email', v)} readOnly={modalMode === 'view'} />
              <Field label="Address" value={formData.buyer_address} onChange={v => handleChange('buyer_address', v)} readOnly={modalMode === 'view'} multiLine />
              <Field label="GST No" value={formData.buyer_gst_no} onChange={v => handleChange('buyer_gst_no', v)} readOnly={modalMode === 'view'} />
              <Field label="PAN No" value={formData.buyer_pan_no} onChange={v => handleChange('buyer_pan_no', v)} readOnly={modalMode === 'view'} />
            </div>
          </div>
          {/* Supplier Details */}
          <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
            <h3 className="font-semibold text-indigo-700 mb-3 text-lg">Supplier Details</h3>
            <div className="space-y-2">
              <Field label="Supplier Name" value={formData.supplier_name} onChange={v => handleChange('supplier_name', v)} readOnly={modalMode === 'view'} />
              <Field label="Supplier GST No" value={formData.supplier_gst_no} onChange={v => handleChange('supplier_gst_no', v)} readOnly={modalMode === 'view'} />
              <Field label="Payment Terms" value={formData.payment_terms} onChange={v => handleChange('payment_terms', v)} readOnly={modalMode === 'view'} />
              <Field label="Style Ref No" value={formData.style_ref_no} onChange={v => handleChange('style_ref_no', v)} readOnly={modalMode === 'view'} />
              <Field label="Delivery Address" value={formData.delivery_address} onChange={v => handleChange('delivery_address', v)} readOnly={modalMode === 'view'} multiLine />
            </div>
          </div>
        </div>
        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Field label="PO Number" value={formData.po_number} onChange={v => handleChange('po_number', v)} readOnly={modalMode === 'view'} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="PO Date" value={formatDate(formData.po_date)} onChange={v => handleChange('po_date', v)} readOnly={modalMode === 'view'} type="date" />
              <Field label="Delivery Date" value={formatDate(formData.delivery_date)} onChange={v => handleChange('delivery_date', v)} readOnly={modalMode === 'view'} type="date" />
            </div>
            <Field label="Grand Total" value={formData.grand_total} onChange={v => handleChange('grand_total', v)} readOnly={modalMode === 'view'} type="number" />
            <div className="text-xs text-gray-500 mb-2">Amount in Words: <span className="font-medium text-gray-700">{formData.amount_in_words}</span></div>
          </div>
          <div className="space-y-2">
            <Field label="Notes" value={formData.notes} onChange={v => handleChange('notes', v)} readOnly={modalMode === 'view'} multiLine />
      </div>
        </div>


        {/* Sales Order Details Section */}
        {modalMode !== 'view' && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Sales Order Details</h3>
            {/* Buyer & Shade selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Buyer <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <SearchableDropdown
                    label="Buyer"
                    name="buyer_id"
                    value={authorizationData.buyer_id}
                    options={buyers.map((b) => ({ label: b.name, value: b.id }))}
                    onChange={(val) => setAuthorizationData((prev) => ({ ...prev, buyer_id: val }))}
                    required
                  />
                  <button
                    onClick={() => {
                      setBuyerInitialData({ name: formData.buyer_name || '' });
                      setShowBuyerModal(true);
                    }}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + New
                  </button>
                </div>
                {!authorizationData.buyer_id && <div className="text-xs text-red-500 mt-1">Buyer is required</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Shade <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <SearchableDropdown
                    label="Shade"
                    name="shade_id"
                    value={authorizationData.shade_id}
                    options={shades.map((s) => ({ label: s.shade_code, value: s.id }))}
                    onChange={(val) => setAuthorizationData((prev) => ({ ...prev, shade_id: val }))}
                    required
                  />
                  <button
                    onClick={() => setShowShadeModal(true)}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + New
                  </button>
                </div>
                {!authorizationData.shade_id && <div className="text-xs text-red-500 mt-1">Shade is required</div>}
              </div>
            </div>
          {/* Items Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Items</h4>
              <button
                type="button"
                onClick={addNewItem}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="p-2 border">Order Code</th>
                      <th className="p-2 border">Description <span className="text-red-500">*</span></th>
                    <th className="p-2 border">Color</th>
                    <th className="p-2 border">Count</th>
                    <th className="p-2 border">UOM</th>
                    <th className="p-2 border">Bag Count</th>
                      <th className="p-2 border">Quantity <span className="text-red-500">*</span></th>
                      <th className="p-2 border">Rate <span className="text-red-500">*</span></th>
                    <th className="p-2 border">GST %</th>
                    <th className="p-2 border">Taxable</th>
                      <th className="p-2 border">Shade <span className="text-red-500">*</span></th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t dark:border-gray-700">
                        <td className="p-2 border align-middle">
                        <input
                          type="text"
                          value={item.order_code}
                          onChange={(e) => updateItem(index, 'order_code', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="text"
                          value={item.yarn_description}
                          onChange={(e) => updateItem(index, 'yarn_description', e.target.value)}
                            className={`w-full px-2 py-1 border rounded ${!item.yarn_description ? 'border-red-500' : ''}`}
                        />
                          {getFieldError(item, 'yarn_description') && <div className="text-xs text-red-500">Required</div>}
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) => updateItem(index, 'color', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) => updateItem(index, 'count', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="text"
                          value={item.uom}
                          onChange={(e) => updateItem(index, 'uom', e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.bag_count}
                          onChange={(e) => updateItem(index, 'bag_count', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                            className={`w-full px-2 py-1 border rounded ${!item.quantity ? 'border-red-500' : ''}`}
                        />
                          {getFieldError(item, 'quantity') && <div className="text-xs text-red-500">Required</div>}
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                            className={`w-full px-2 py-1 border rounded ${!item.rate ? 'border-red-500' : ''}`}
                        />
                          {getFieldError(item, 'rate') && <div className="text-xs text-red-500">Required</div>}
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.gst_percent}
                          onChange={(e) => updateItem(index, 'gst_percent', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <input
                          type="number"
                          value={item.taxable_amount}
                          onChange={(e) => updateItem(index, 'taxable_amount', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                        <td className="p-2 border align-middle">
                        <select
                          value={item.shade_id}
                          onChange={(e) => updateItem(index, 'shade_id', e.target.value)}
                            className={`w-full px-2 py-1 border rounded ${!item.shade_id ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Shade</option>
                          {shades.map((shade) => (
                            <option key={shade.id} value={shade.id}>
                              {shade.shade_code} - {shade.shade_name}
                            </option>
                          ))}
                        </select>
                          {getFieldError(item, 'shade_id') && <div className="text-xs text-red-500">Required</div>}
                      </td>
                        <td className="p-2 border align-middle">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            {/* Count and Realisation fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
                <label className="block text-sm font-medium mb-1">Count (optional)</label>
              <input
                type="number"
                value={authorizationData.count || ''}
                  onChange={(e) => setAuthorizationData((prev) => ({ ...prev, count: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter count"
              />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Realisation % (optional)</label>
              <input
                type="number"
                value={authorizationData.realisation || ''}
                  onChange={(e) => setAuthorizationData((prev) => ({ ...prev, realisation: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter realisation percentage"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-white py-3 flex justify-end gap-2 border-t z-10">
          {modalMode === 'verify' && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              onClick={handleVerify}
              disabled={isSubmitting || !isFormValid()}
            >
              Verify Purchase Order
            </button>
          )}
          {modalMode === 'authorize' && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              onClick={handleAuthorize}
              disabled={isSubmitting || !isFormValid()}
            >
              Authorize & Convert to SO
            </button>
          )}
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Close
          </button>
          {modalMode === 'view' && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setModalMode('edit')}
              disabled={isSubmitting}
            >
              Edit
            </button>
          )}
        </div>

        <BuyerFormModal
          isOpen={showBuyerModal}
          onClose={() => setShowBuyerModal(false)}
          onSubmit={async (data) => {
            const newBuyer = await createBuyer(data);
            queryClient.invalidateQueries({ queryKey: ['buyers'] });
            setAuthorizationData((prev) => ({ ...prev, buyer_id: newBuyer.id }));
            setShowBuyerModal(false);
          }}
          initialData={buyerInitialData}
        />
        {showShadeModal && (
          <>
            {fibresLoading ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p>Loading fibres...</p>
                </div>
              </div>
            ) : (
              <ShadeModal
                isOpen={showShadeModal}
                onClose={() => setShowShadeModal(false)}
                onCreate={async (shade) => {
                  try {
                    // Replicate ShadeModal logic for blend and raw cotton composition
                    const blend_composition = Array.isArray(shade.blend_composition)
                      ? shade.blend_composition.filter((c: any) => c.fibre_id)
                          .map((c: any) => ({
                            fibre_id: c.fibre_id,
                            percentage: Number(c.percentage) || 0,
                          }))
                      : [];

                    // Always send raw_cotton_compositions as an array
                    const rawCottonArray = shade.raw_cotton_compositions
                      ? (Array.isArray(shade.raw_cotton_compositions)
                          ? shade.raw_cotton_compositions
                          : [shade.raw_cotton_compositions])
                      : [];

                    const shadeData = {
                      shade_code: shade.shade_code || '',
                      shade_name: shade.shade_name || '',
                      percentage: shade.percentage || '100%',
                      available_stock_kg: shade.available_stock_kg || 0,
                      blend_composition,
                      raw_cotton_compositions: rawCottonArray,
                    };

                    // Create the shade and fetch the full object from backend
                    const newShade = await createShade(shadeData);

                    if (!newShade || !newShade.id) {
                      throw new Error('Invalid response from server. Shade was not created.');
                    }

                    const fullShade = await getShadeById(newShade.id);
                    queryClient.invalidateQueries({ queryKey: ['shades'] });
                    setAuthorizationData((prev) => ({ ...prev, shade_id: fullShade.id }));
                    setShowShadeModal(false);
                    toast.success('Shade created successfully');
                  } catch (error: any) {
                    const message =
                      error?.response?.data?.error ||
                      error?.message ||
                      'Failed to create shade. Please try again.';
                    toast.error(message);
                  }
                }}
                onUpdate={() => {}}
                fibres={fibres || []}
      />
            )}
          </>
        )}
      </div>
    </TailwindDialog>
  );
};

// Helper Field component for consistent display
const Field: React.FC<{ label: string; value?: any; onChange?: (v: any) => void; readOnly?: boolean; multiLine?: boolean; type?: string }> = ({ label, value = '', onChange, readOnly, multiLine, type }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    {multiLine ? (
      <textarea 
        className="w-full max-w-md border rounded px-2 py-1 bg-gray-50" 
        value={value} 
        onChange={e => onChange && onChange(e.target.value)} 
        readOnly={readOnly} 
        rows={2} 
      />
    ) : (
      <input 
        className="w-full max-w-md border rounded px-2 py-1 bg-gray-50" 
        value={value} 
        onChange={e => onChange && onChange(type === 'number' ? Number(e.target.value) : e.target.value)} 
        readOnly={readOnly} 
        type={type || 'text'} 
      />
    )}
  </div>
);

export default PurchaseOrderModal;