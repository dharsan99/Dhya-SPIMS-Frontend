import React, { useRef, useState } from 'react';
import {
  uploadAndParsePurchaseOrder,
  verifyPurchaseOrder,
  convertPurchaseOrder,
  deletePurchaseOrder,
} from '../../../api/purchaseOrders';
import { TailwindDialog } from '../../ui/Dialog';
import PurchaseOrderReviewForm, {
  PurchaseOrderFormValues,
} from './PurchaseOrderReviewForm';
import FileUploadPanel from './FileUploadPanel';
import FilePreview from './FilePreview';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { toast } from 'react-hot-toast';
import { PurchaseOrder } from '../../../types/purchaseOrder';

// --- Helper Function ---
// ✅ CORRECTED: This function now properly maps the snake_case properties
// of the API response to the camelCase properties expected by the form.
const mapAPIResponseToFormValues = (
  po: PurchaseOrder
): PurchaseOrderFormValues => {
  return {
    poNumber: po.po_number,
    poDate: po.po_date,
    buyerName: po.buyer_name,
    buyerContactName: po.buyer_contact_name,
    buyerContactPhone: po.buyer_contact_phone,
    buyerEmail: po.buyer_email,
    buyerAddress: po.buyer_address,
    buyerGstNo: po.buyer_gst_no,
    buyerPanNo: po.buyer_pan_no,
    supplierName: po.supplier_name,
    supplierGstNo: po.supplier_gst_no,
    paymentTerms: po.payment_terms,
    styleRefNo: po.style_ref_no,
    deliveryAddress: po.delivery_address,
    taxDetails: po.tax_details,
    grandTotal: po.grand_total,
    amountInWords: po.amount_in_words,
    notes: po.notes,
    // 👇 This is the critical fix. We are now mapping each item.
    items: (po.items || []).map((item) => ({
      orderCode: item.order_code,
      yarnDescription: item.yarn_description,
      color: item.color,
      count: item.count,
      uom: item.uom,
      bagCount: item.bag_count,
      quantity: item.quantity,
      rate: item.rate,
      gstPercent: item.gst_percent,
      taxableAmount: item.taxable_amount,
      shadeNo: item.shade_no,
    })),
  };
};

// --- Component ---
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const UploadPurchaseOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onParsed,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PurchaseOrderFormValues | null>(
    null
  );
  const [status, setStatus] = useState<'uploaded' | 'verified' | 'converted'>(
    'uploaded'
  );
  const [poId, setPoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleParseAndCreate = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setFormData(null);



    try {
      const createdPO = await uploadAndParsePurchaseOrder(file);

      if (!createdPO || !createdPO.id) {
        throw new Error('Parsing succeeded, but failed to create a PO record.');
      }

      const formValues = mapAPIResponseToFormValues(createdPO);

      setFormData(formValues);
      setPoId(createdPO.id);
      setStatus('uploaded');
      toast.success('✅ Document parsed successfully!');
    } catch (err: any) {
      console.error('❌ Error in handleParseAndCreate:', err);
      setError(
        '❌ Failed to process the purchase order. ' + (err.message || '')
      );
    } finally {
      setLoading(false);
    }
  };


  const handleVerify = async () => {
    if (!poId) return;
    try {
      setLoading(true);
      await verifyPurchaseOrder(poId);
      toast.success('✅ Purchase Order verified');
      setStatus('verified');
      onParsed({});
      resetState();
    } catch (err) {
      toast.error('❌ Failed to verify PO');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!poId) return;
    try {
      setLoading(true);
      if (!formData) {
        throw new Error('No form data available');
      }
      const result = await convertPurchaseOrder(poId, {
        buyer_id: formData.buyerName,
        shade_id: formData.items[0]?.shadeNo || '',
        quantity_kg: formData.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        delivery_date: new Date().toISOString(),
        items: formData.items.map(item => ({
          order_code: item.orderCode || '',
          yarn_description: item.yarnDescription,
          color: item.color || '',
          count: item.count || 0,
          uom: item.uom || 'KGS',
          bag_count: item.bagCount || 0,
          quantity: item.quantity || 0,
          rate: item.rate || 0,
          gst_percent: item.gstPercent || 0,
          taxable_amount: item.taxableAmount || 0,
          shade_id: item.shadeNo || ''
        }))
      });
      toast.success('✅ Converted to Sales Order');
      setStatus('converted');
      onParsed(result);
      resetState();
    } catch (err) {
      toast.error('❌ Failed to convert PO');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!poId) return;
    setLoading(true);
    try {
      await deletePurchaseOrder(poId);
      toast.success('✅ Purchase Order deleted');
      resetState();
    } catch (err) {
      toast.error('❌ Failed to delete PO');
      console.error(err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setFormData(null);
    setError('');
    setPoId(null);
    setStatus('uploaded');
    onClose();
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={resetState}
      title="AI-Powered Purchase Order Upload"
      maxWidth="max-w-6xl"
    >
      <div className="flex gap-6">
        <div className="flex-1">
          {!formData ? (
            <FileUploadPanel
              file={file}
              loading={loading}
              error={error}
              onFileChange={setFile}
              onCancel={resetState}
              onParse={handleParseAndCreate}
            />
          ) : (
            <PurchaseOrderReviewForm
              data={formData}
              onChange={setFormData}
              onCancel={resetState}
              onDelete={() => setShowDeleteConfirm(true)}
              onVerify={handleVerify}
              onConvert={handleConvert}
              status={status}
              productions={[]}
            />
          )}
        </div>

        <div className="w-80 border rounded shadow p-2 bg-white">
          <h4 className="text-sm font-medium mb-2">PDF Preview</h4>
          {file ? (
            <FilePreview
              file={file}
              canvasRef={canvasRef}
              onLoaded={setPdfDoc}
            />
          ) : (
            <p className="text-gray-500 text-sm">
              Upload a PDF or Image to preview.
            </p>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this purchase order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </TailwindDialog>
  );
};

export default UploadPurchaseOrderModal;