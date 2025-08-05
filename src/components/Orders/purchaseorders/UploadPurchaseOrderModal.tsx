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
import { 
  DocumentArrowUpIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,

  EyeIcon,

  TrashIcon
} from '@heroicons/react/24/outline';

// --- Helper Function ---
const mapAPIResponseToFormValues = (
  po: PurchaseOrder
): PurchaseOrderFormValues => {
  return {
    poNumber: po.poNumber,
    poDate: po.poDate,
    buyerName: po.buyerName,
    buyerContactName: po.buyerContactName,
    buyerContactPhone: po.buyerContactPhone,
    buyerEmail: po.buyerEmail,
    buyerAddress: po.buyerAddress,
    buyerGstNo: po.buyerGstNo,
    buyerPanNo: po.buyerPanNo,
    supplierName: po.supplierName,
    supplierGstNo: po.supplierGstNo,
    paymentTerms: po.paymentTerms,
    styleRefNo: po.styleRefNo,
    deliveryAddress: po.deliveryAddress,
    taxDetails: po.taxDetails,
    grandTotal: po.grandTotal,
    amountInWords: po.amountInWords,
    notes: po.notes,
    items: (po.items || []).map((item) => ({
      orderCode: item.orderCode,
      yarnDescription: item.yarnDescription,
      color: item.color,
      count: item.count,
      uom: item.uom,
      bagCount: item.bagCount,
      quantity: item.quantity,
      rate: item.rate,
      gstPercent: item.gstPercent,
      taxableAmount: item.taxableAmount,
      shadeNo: item.shadeNo,
    })),
  };
};

// --- Component ---
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

type UploadStep = 'upload' | 'processing' | 'review' | 'complete';

const UploadPurchaseOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onParsed,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PurchaseOrderFormValues | null>(null);
  const [status, setStatus] = useState<'uploaded' | 'verified' | 'converted'>('uploaded');
  const [poId, setPoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [processingProgress, setProcessingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleParseAndCreate = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setFormData(null);
    setCurrentStep('processing');
    setProcessingProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const createdPO = await uploadAndParsePurchaseOrder(file);
      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!createdPO || !createdPO.id) {
        throw new Error('Parsing succeeded, but failed to create a PO record.');
      }

      const formValues = mapAPIResponseToFormValues(createdPO);
      setFormData(formValues);
      setPoId(createdPO.id);
      setStatus('uploaded');
      setCurrentStep('review');
      toast.success('✅ Document parsed successfully!');
      
      // Pass the created purchase order back to parent for editing
      onParsed(createdPO);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('❌ Error in handleParseAndCreate:', err);
      setError('❌ Failed to process the purchase order. ' + (err.message || ''));
      setCurrentStep('upload');
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

  const handleEditInFullForm = () => {
    // Pass the created purchase order back to parent for editing in full form
    if (formData && poId) {
      // Create a PurchaseOrder object from the form data
      const purchaseOrder: PurchaseOrder = {
        id: poId,
        tenantId: '',
        poNumber: formData.poNumber,
        poDate: formData.poDate,
        buyerName: formData.buyerName,
        buyerContactName: formData.buyerContactName,
        buyerContactPhone: formData.buyerContactPhone,
        buyerEmail: formData.buyerEmail,
        buyerAddress: formData.buyerAddress,
        buyerGstNo: formData.buyerGstNo,
        buyerPanNo: formData.buyerPanNo,
        supplierName: formData.supplierName,
        supplierGstNo: formData.supplierGstNo,
        paymentTerms: formData.paymentTerms,
        styleRefNo: formData.styleRefNo,
        deliveryAddress: formData.deliveryAddress,
        taxDetails: formData.taxDetails,
        grandTotal: formData.grandTotal,
        amountInWords: formData.amountInWords,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '',
        status: status || 'uploaded',
        deliveryDate: '',
        shadeCode: '',
        quantityKg: formData.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        items: formData.items.map(item => ({
          id: '',
          orderCode: item.orderCode,
          yarnDescription: item.yarnDescription,
          color: item.color,
          count: item.count,
          uom: item.uom,
          bagCount: item.bagCount,
          quantity: item.quantity,
          rate: item.rate,
          gstPercent: item.gstPercent,
          taxableAmount: item.taxableAmount,
          shadeNo: item.shadeNo,
        })),
      };
      onParsed(purchaseOrder);
    }
  };

  const resetState = () => {
    setFile(null);
    setFormData(null);
    setError('');
    setPoId(null);
    setStatus('uploaded');
    setCurrentStep('upload');
    setProcessingProgress(0);
    onClose();
  };

  const getStepIcon = (step: UploadStep, currentStep: UploadStep) => {
    const isActive = step === currentStep;
    const isCompleted = currentStep === 'review' || currentStep === 'complete';
    
    switch (step) {
      case 'upload':
        return (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive ? 'bg-blue-600 text-white' : 
            isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <DocumentArrowUpIcon className="w-4 h-4" />
          </div>
        );
      case 'processing':
        return (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive ? 'bg-blue-600 text-white' : 
            isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {isActive ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
          </div>
        );
      case 'review':
        return (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive ? 'bg-blue-600 text-white' : 
            isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <EyeIcon className="w-4 h-4" />
          </div>
        );
      case 'complete':
        return (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={resetState}
      title="AI-Powered Purchase Order Upload"
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          {(['upload', 'processing', 'review', 'complete'] as UploadStep[]).map((step, index) => (
            <div key={step} className="flex items-center">
              {getStepIcon(step, currentStep)}
              <span className={`ml-2 text-sm font-medium ${
                step === currentStep ? 'text-blue-600' : 
                (currentStep === 'review' || currentStep === 'complete') ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step === 'upload' ? 'Upload' : 
                 step === 'processing' ? 'Processing' : 
                 step === 'review' ? 'Review' : 'Complete'}
              </span>
              {index < 3 && (
                <div className={`w-16 h-1 mx-4 rounded ${
                  (currentStep === 'review' || currentStep === 'complete') ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Processing Progress */}
        {currentStep === 'processing' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI Processing Your Document
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {processingProgress}%
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Extracting data from your document...
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          <div className="flex-1">
            {currentStep === 'upload' && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    AI-Powered Document Processing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload your purchase order document and let our AI extract all the details automatically
                  </p>
                </div>
                
                <FileUploadPanel
                  file={file}
                  loading={loading}
                  error={error}
                  onFileChange={setFile}
                  onCancel={resetState}
                  onParse={handleParseAndCreate}
                />
              </div>
            )}

            {currentStep === 'review' && formData && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Review Extracted Data
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <PurchaseOrderReviewForm
                  data={formData}
                  onChange={setFormData}
                  onCancel={resetState}
                  onDelete={() => setShowDeleteConfirm(true)}
                  onVerify={handleVerify}
                  onConvert={handleConvert}
                  onEditInFullForm={handleEditInFullForm}
                  status={status}
                  productions={[]}
                />
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="w-80">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Document Preview
                </h4>
              </div>
              <div className="p-4">
                {file ? (
                  <FilePreview
                    file={file}
                    canvasRef={canvasRef}
                    onLoaded={setPdfDoc}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <DocumentArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm">Upload a PDF or Image to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </TailwindDialog>
  );
};

export default UploadPurchaseOrderModal;