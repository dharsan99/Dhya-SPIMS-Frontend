import React from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../../types/purchaseOrder';
import { TailwindDialog } from '../../ui/Dialog';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { 
  TrashIcon, 
  DocumentArrowUpIcon, 
  PencilIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import ShadeModal from '../../ShadeModal';
import BuyerFormModal from '../../BuyerFormModal';
import { BuyerFormData } from '../../BuyerFormModal';

import UploadPurchaseOrderModal from './UploadPurchaseOrderModal';

interface Props {
  isOpen: boolean;
  order: PurchaseOrder | null;
  onClose: () => void;
  mode: 'view' | 'edit' | 'verify' | 'authorize';
  onSave: (data: PurchaseOrderFormValues, id: string) => void;
  onVerify?: (id: string) => void;
  onConvertToSalesOrder?: (order: PurchaseOrder) => void;
  status?: string;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd for input
};



const defaultPurchaseOrder: PurchaseOrder = {
  id: '',
  tenantId: '',
  poNumber: '',
  poDate: '',
  buyerName: '',
  buyerContactName: '',
  buyerContactPhone: '',
  buyerEmail: '',
  buyerAddress: '',
  buyerGstNo: '',
  buyerPanNo: '',
  supplierName: '',
  supplierGstNo: '',
  paymentTerms: '',
  styleRefNo: '',
  deliveryAddress: '',
  taxDetails: { cgst: 0, sgst: 0, igst: 0 },
  grandTotal: 0,
  amountInWords: '',
  notes: '',
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  status: 'pending',
  deliveryDate: '',
  shadeCode: '',
  quantityKg: 0,
  items: [],
};

const PurchaseOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  mode,
  onSave,
  onVerify,
  onConvertToSalesOrder,
  status,
}) => {
  console.log('PurchaseOrderModal opened with:', {
    isOpen,
    orderId: order?.id,
    mode,
    hasOrder: !!order,
    orderStatus: order?.status
  });
  
  const [formData, setFormData] = React.useState<PurchaseOrder | null>(order ?? defaultPurchaseOrder);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showBuyerModal, setShowBuyerModal] = React.useState(false);
  const [showShadeModal, setShowShadeModal] = React.useState(false);

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
  

  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<'flow-selection' | 'form' | 'review'>('flow-selection');

  const queryClient = useQueryClient();


  React.useEffect(() => {
    setFormData(order ?? defaultPurchaseOrder);
    setModalMode(mode);
    
    console.log('Setting currentStep:', {
      orderId: order?.id,
      hasOrder: !!order,
      mode,
      willSetStep: order && order.id ? 'form' : 'flow-selection'
    });
    
    // If editing an existing order, go directly to form
    if (order && order.id) {
      setCurrentStep('form');
    } else {
      // For new orders, show flow selection
      setCurrentStep('flow-selection');
    }
  }, [order, mode]);

  // Set delivery date to 45 days after PO date by default
  React.useEffect(() => {
    if (formData && formData.poDate && !formData.deliveryDate) {
      const poDate = new Date(formData.poDate);
      const deliveryDate = new Date(poDate);
      deliveryDate.setDate(poDate.getDate() + 45);
      setFormData(prev => prev ? { ...prev, deliveryDate: deliveryDate.toISOString().split('T')[0] } : prev);
    }
  }, [formData?.poDate]);

  React.useEffect(() => {
    if (formData?.items) {
      setItems(formData.items.map(item => ({
        order_code: item.orderCode || '',
        yarn_description: item.yarnDescription || '',
        color: item.color || '',
        count: item.count || 0,
        uom: item.uom || 'KGS',
        bag_count: item.bagCount || 0,
        quantity: item.quantity || 0,
        rate: item.rate || 0,
        gst_percent: item.gstPercent || 0,
        taxable_amount: item.taxableAmount || 0,
        shade_id: item.shadeNo || '',
      })));
    }
  }, [formData]);

  // Normalize status to lowercase for all logic
  const normalizedStatus = (status || formData?.status || '').toLowerCase();
  const hasValidId = !!(formData && formData.id);
  
  // Status checks for workflow actions
  const isPending = normalizedStatus === 'pending' || normalizedStatus === 'uploaded' || normalizedStatus === 'draft' || !normalizedStatus;
  const isVerified = normalizedStatus === 'verified';


  // Debug action buttons
  React.useEffect(() => {
    console.log('Debug Action Buttons:', {
      modalMode,
      status: normalizedStatus,
      formDataId: formData?.id,
      onVerify: !!onVerify,
      onConvertToSalesOrder: !!onConvertToSalesOrder,
      shouldShowVerify: modalMode === 'edit' && isPending && onVerify && hasValidId,
      shouldShowConvert: modalMode === 'edit' && isVerified && onConvertToSalesOrder && hasValidId,
      currentStep,
      orderId: order?.id
    });
  }, [modalMode, normalizedStatus, formData?.id, onVerify, onConvertToSalesOrder, isPending, isVerified, hasValidId, currentStep, order?.id]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof PurchaseOrder, value: any) => {
    // If PO date changes, update delivery date unless user has set it
    if (field === 'poDate') {
      const poDate = new Date(value);
      const deliveryDate = new Date(poDate);
      deliveryDate.setDate(poDate.getDate() + 45);
      setFormData({ ...formData!, poDate: value, deliveryDate: deliveryDate.toISOString().split('T')[0] });
    } else {
      setFormData({ ...formData!, [field]: value });
    }
  };

  const handleFlowSelection = (flow: 'ai' | 'manual') => {
    if (flow === 'ai') {
      setShowUploadModal(true);
    } else {
      setCurrentStep('form');
    }
  };

  const handleUploadSuccess = (createdOrder?: PurchaseOrder) => {
    setShowUploadModal(false);
    
    // If we have a created order, populate the form with it for editing
    if (createdOrder) {
      setFormData(createdOrder);
      setModalMode('edit');
      setCurrentStep('form');
    } else {
      // Just close and refresh if no order data
      onClose();
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
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

  const handleConvertToSalesOrder = async () => {
    if (!formData || !onConvertToSalesOrder) return;
    
    // First save any changes if in edit mode
    if (modalMode === 'edit' && isFormValid()) {
      try {
        const totals = calculateOrderTotals();
        const formValues: PurchaseOrderFormValues = {
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
          grandTotal: totals.grandTotal,
          amountInWords: formData.amountInWords,
          notes: formData.notes,
          items: items.map(item => ({
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
            shadeNo: item.shade_id,
          })),
        };
        await onSave(formValues, formData.id || '');
      } catch (error) {
        toast.error('Failed to save changes before conversion');
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      await onConvertToSalesOrder(formData);
      toast.success('Purchase Order converted to Sales Order successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to convert Purchase Order to Sales Order');
    } finally {
      setIsSubmitting(false);
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



  // Validation helpers
  const isItemValid = (item: any) =>
    item.yarn_description && item.quantity && item.rate;

  const isFormValid = () => {
    return (
      formData.poNumber &&
      formData.buyerName &&
      formData.poDate &&
      items.length > 0 &&
      items.every(isItemValid)
    );
  };

  const getFieldError = (item: any, field: string) => {
    if ((field === 'yarn_description' || field === 'quantity' || field === 'rate') && !item[field]) {
      return 'Required';
    }
    return '';
  };

  // Calculate totals for the entire order
  const calculateOrderTotals = () => {
    let subtotal = 0;
    let totalGST = 0;
    
    items.forEach(item => {
      const itemSubtotal = (item.quantity || 0) * (item.rate || 0);
      const itemGST = itemSubtotal * ((item.gst_percent || 0) / 100);
      subtotal += itemSubtotal;
      totalGST += itemGST;
    });
    
    return {
      subtotal,
      totalGST,
      grandTotal: subtotal + totalGST
    };
  };

  // Update item with automatic calculation
  const updateItemWithCalculation = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    // Auto-calculate taxable amount when quantity, rate, or GST changes
    if (field === 'quantity' || field === 'rate' || field === 'gst_percent') {
      const item = updatedItems[index];
      const subtotal = (item.quantity || 0) * (item.rate || 0);
      const gstAmount = subtotal * ((item.gst_percent || 0) / 100);
      updatedItems[index].taxable_amount = subtotal + gstAmount;
    }
    
    setItems(updatedItems);
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const totals = calculateOrderTotals();
      const formValues: PurchaseOrderFormValues = {
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
        grandTotal: totals.grandTotal,
        amountInWords: formData.amountInWords,
        notes: formData.notes,
        items: items.map(item => ({
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
          shadeNo: item.shade_id,
        })),
      };

      await onSave(formValues, formData.id || '');
      toast.success('Purchase Order saved successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to save Purchase Order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flow Selection UI
  if (currentStep === 'flow-selection') {
    return (
      <>
        <TailwindDialog
          isOpen={isOpen}
          onClose={onClose}
          title="Create New Purchase Order"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Creation Method
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select how you'd like to create your purchase order
              </p>
            </div>

            {/* Flow Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI-Assisted Upload */}
              <div 
                className="relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleFlowSelection('ai')}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  AI-Assisted Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  Upload a PDF or image of your purchase order and let AI extract all the details automatically
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Automatic data extraction</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Instant form population</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Review and edit as needed</span>
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div 
                className="relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-400 cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleFlowSelection('manual')}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <PencilIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  Manual Entry
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  Fill out the purchase order form manually with all the required details
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Complete control over data</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Step-by-step guidance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    <span>Real-time validation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </TailwindDialog>

        {/* Upload Modal - Always rendered */}
        <UploadPurchaseOrderModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onParsed={handleUploadSuccess}
        />
      </>
    );
  }

  // Manual Form UI
  return (
    <>
      <TailwindDialog
        isOpen={isOpen}
        onClose={onClose}
        title={`${modalMode === 'view' ? 'View' : modalMode === 'edit' ? 'Edit' : modalMode === 'verify' ? 'Verify' : 'Authorize'} Purchase Order - ${formData.poNumber ? `PO-${formData.poNumber}` : 'New Order'}`}
        maxWidth="max-w-6xl"
      >
        <div className="space-y-6">
          {/* Debug Button - Always show to verify modal is rendering */}
          {modalMode === 'edit' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span>Debug: Modal is in edit mode</span>
                <button
                  onClick={() => {
                    console.log('Modal Debug:', {
                      modalMode,
                      currentStep,
                      orderId: order?.id,
                      formDataId: formData?.id,
                      status: formData?.status
                    });
                    toast.success(`Modal Mode: ${modalMode}, Step: ${currentStep}, Order ID: ${order?.id}`);
                  }}
                  className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                >
                  Debug Modal
                </button>
              </div>
            </div>
          )}
          
          {/* Status Banner */}
          {hasValidId && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    normalizedStatus === 'pending' ? 'bg-yellow-500' :
                    normalizedStatus === 'verified' ? 'bg-green-500' :
                    normalizedStatus === 'converted' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Purchase Order Status
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {normalizedStatus === 'pending' ? 'Pending verification' :
                       normalizedStatus === 'verified' ? 'Verified - Ready for conversion' :
                       normalizedStatus === 'converted' ? 'Converted to Sales Order' :
                       'Draft - In progress'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    normalizedStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    normalizedStatus === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    normalizedStatus === 'converted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    normalizedStatus === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {normalizedStatus?.toUpperCase() || 'DRAFT'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    modalMode === 'edit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    modalMode === 'view' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}>
                    {modalMode.toUpperCase()} MODE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Progress Indicator */}
          {hasValidId && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Workflow Progress</h4>
              <div className="flex items-center justify-between">
                {/* Step 1: Draft */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    normalizedStatus === 'pending' || normalizedStatus === 'verified' || normalizedStatus === 'converted' 
                      ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    ✓
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Draft</span>
                </div>
                
                {/* Connector */}
                <div className={`flex-1 h-0.5 ${
                  normalizedStatus === 'pending' || normalizedStatus === 'verified' || normalizedStatus === 'converted' 
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                
                {/* Step 2: Pending */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    normalizedStatus === 'pending' || normalizedStatus === 'verified' || normalizedStatus === 'converted' 
                      ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {normalizedStatus === 'pending' ? '!' : '✓'}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pending</span>
                </div>
                
                {/* Connector */}
                <div className={`flex-1 h-0.5 ${
                  normalizedStatus === 'verified' || normalizedStatus === 'converted' 
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                
                {/* Step 3: Verified */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    normalizedStatus === 'verified' || normalizedStatus === 'converted' 
                      ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    ✓
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Verified</span>
                </div>
                
                {/* Connector */}
                <div className={`flex-1 h-0.5 ${
                  normalizedStatus === 'converted' 
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                
                {/* Step 4: Converted */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    normalizedStatus === 'converted' 
                      ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {normalizedStatus === 'converted' ? '✓' : '4'}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sales Order</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Basic Details</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Items</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Review</span>
            </div>
          </div>

          {/* Buyer & Supplier Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Details */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-lg">Buyer Details</h3>
                <button
                  onClick={() => setShowBuyerModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                >
                  + Add New Buyer
                </button>
              </div>
              <div className="space-y-4">
                <Field 
                  label="Buyer Name *" 
                  value={formData.buyerName} 
                  onChange={v => handleChange('buyerName', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field 
                    label="Contact Person" 
                    value={formData.buyerContactName} 
                    onChange={v => handleChange('buyerContactName', v)} 
                    readOnly={modalMode === 'view'} 
                  />
                  <Field 
                    label="Contact Phone" 
                    value={formData.buyerContactPhone} 
                    onChange={v => handleChange('buyerContactPhone', v)} 
                    readOnly={modalMode === 'view'} 
                  />
                </div>
                <Field 
                  label="Email" 
                  value={formData.buyerEmail} 
                  onChange={v => handleChange('buyerEmail', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <Field 
                  label="Address" 
                  value={formData.buyerAddress} 
                  onChange={v => handleChange('buyerAddress', v)} 
                  readOnly={modalMode === 'view'} 
                  multiLine 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field 
                    label="GST No" 
                    value={formData.buyerGstNo} 
                    onChange={v => handleChange('buyerGstNo', v)} 
                    readOnly={modalMode === 'view'} 
                  />
                  <Field 
                    label="PAN No" 
                    value={formData.buyerPanNo} 
                    onChange={v => handleChange('buyerPanNo', v)} 
                    readOnly={modalMode === 'view'} 
                  />
                </div>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-300 text-lg mb-4">Supplier Details</h3>
              <div className="space-y-4">
                <Field 
                  label="Supplier Name" 
                  value={formData.supplierName} 
                  onChange={v => handleChange('supplierName', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <Field 
                  label="Supplier GST No" 
                  value={formData.supplierGstNo} 
                  onChange={v => handleChange('supplierGstNo', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <Field 
                  label="Payment Terms" 
                  value={formData.paymentTerms} 
                  onChange={v => handleChange('paymentTerms', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <Field 
                  label="Style Ref No" 
                  value={formData.styleRefNo} 
                  onChange={v => handleChange('styleRefNo', v)} 
                  readOnly={modalMode === 'view'} 
                />
                <Field 
                  label="Delivery Address" 
                  value={formData.deliveryAddress} 
                  onChange={v => handleChange('deliveryAddress', v)} 
                  readOnly={modalMode === 'view'} 
                  multiLine 
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 text-lg mb-4">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field 
                label="PO Number *" 
                value={formData.poNumber} 
                onChange={v => handleChange('poNumber', v)} 
                readOnly={modalMode === 'view'} 
              />
              <Field 
                label="PO Date *" 
                value={formatDate(formData.poDate)} 
                onChange={v => handleChange('poDate', v)} 
                readOnly={modalMode === 'view'} 
                type="date" 
              />
              <Field 
                label="Delivery Date" 
                value={formatDate(formData.deliveryDate)} 
                onChange={v => handleChange('deliveryDate', v)} 
                readOnly={modalMode === 'view'} 
                type="date" 
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-orange-700 dark:text-orange-300 text-lg">Order Items</h3>
              <button
                onClick={addNewItem}
                className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <DocumentArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No items added yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Item {index + 1}</h4>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Field 
                        label="Order Code" 
                        value={item.order_code} 
                        onChange={v => updateItemWithCalculation(index, 'order_code', v)} 
                        readOnly={modalMode === 'view'} 
                      />
                      <Field 
                        label="Yarn Description *" 
                        value={item.yarn_description} 
                        onChange={v => updateItemWithCalculation(index, 'yarn_description', v)} 
                        readOnly={modalMode === 'view'} 
                      />
                      <Field 
                        label="Color" 
                        value={item.color} 
                        onChange={v => updateItemWithCalculation(index, 'color', v)} 
                        readOnly={modalMode === 'view'} 
                      />
                      <Field 
                        label="Count" 
                        value={item.count} 
                        onChange={v => updateItemWithCalculation(index, 'count', v)} 
                        readOnly={modalMode === 'view'} 
                        type="number" 
                      />
                      <Field 
                        label="UOM" 
                        value={item.uom} 
                        onChange={v => updateItemWithCalculation(index, 'uom', v)} 
                        readOnly={modalMode === 'view'} 
                      />
                      <Field 
                        label="Bag Count" 
                        value={item.bag_count} 
                        onChange={v => updateItemWithCalculation(index, 'bag_count', v)} 
                        readOnly={modalMode === 'view'} 
                        type="number" 
                      />
                      <Field 
                        label="Shade No" 
                        value={item.shade_id} 
                        onChange={v => updateItemWithCalculation(index, 'shade_id', v)} 
                        readOnly={modalMode === 'view'} 
                      />
                      <Field 
                        label="Quantity (KGS) *" 
                        value={item.quantity} 
                        onChange={v => updateItemWithCalculation(index, 'quantity', v)} 
                        readOnly={modalMode === 'view'} 
                        type="number" 
                        step="0.01"
                      />
                      <Field 
                        label="Rate *" 
                        value={item.rate} 
                        onChange={v => updateItemWithCalculation(index, 'rate', v)} 
                        readOnly={modalMode === 'view'} 
                        type="number" 
                        step="0.01"
                      />
                      <Field 
                        label="GST %" 
                        value={item.gst_percent} 
                        onChange={v => updateItemWithCalculation(index, 'gst_percent', v)} 
                        readOnly={modalMode === 'view'} 
                        type="number" 
                      />
                    </div>
                    
                    {/* Item Calculations */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                          <span className="ml-2 font-medium">₹{((item.quantity || 0) * (item.rate || 0)).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">GST ({(item.gst_percent || 0)}%):</span>
                          <span className="ml-2 font-medium">₹{(((item.quantity || 0) * (item.rate || 0) * (item.gst_percent || 0)) / 100).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Total:</span>
                          <span className="ml-2 font-medium text-green-600">₹{(Number(item.taxable_amount) || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {getFieldError(item, 'yarn_description') && (
                      <p className="text-red-600 text-sm mt-1">{getFieldError(item, 'yarn_description')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-4">Additional Details</h3>
            <div className="space-y-4">
              <Field 
                label="Notes" 
                value={formData.notes} 
                onChange={v => handleChange('notes', v)} 
                readOnly={modalMode === 'view'} 
                multiLine 
              />
            </div>
          </div>

          {/* Order Totals */}
          {items.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-300 text-lg mb-4">Order Summary</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{calculateOrderTotals().subtotal.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Subtotal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹{calculateOrderTotals().totalGST.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total GST</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{calculateOrderTotals().grandTotal.toFixed(2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Grand Total</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {currentStep === 'form' && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Left side - Status and mode indicators */}
              <div className="flex items-center space-x-3">
                {hasValidId && (
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      normalizedStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      normalizedStatus === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      normalizedStatus === 'converted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      normalizedStatus === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {normalizedStatus?.toUpperCase() || 'DRAFT'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      modalMode === 'edit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      modalMode === 'view' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {modalMode.toUpperCase()} MODE
                    </span>
                  </div>
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                
                {/* Debug Button - Temporary for testing */}
                {modalMode === 'edit' && hasValidId && currentStep === 'form' && (
                  <button
                    onClick={() => {
                      console.log('Debug Info:', {
                        modalMode,
                        status: normalizedStatus,
                        formDataId: formData.id,
                        onVerify: !!onVerify,
                        onConvertToSalesOrder: !!onConvertToSalesOrder,
                        isPending,
                        isVerified,
                        hasValidId,
                        currentStep
                      });
                      toast.success(`Status: ${normalizedStatus}, Mode: ${modalMode}, isPending: ${isPending}, isVerified: ${isVerified}, Step: ${currentStep}`);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                  >
                    Debug Info
                  </button>
                )}
                
                {/* Test Button - Always show to verify layout */}
                {modalMode === 'edit' && currentStep === 'form' && (
                  <button
                    onClick={() => toast.success('Test button works!')}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Test Button
                  </button>
                )}
                
                {/* Verify Button - Show only for pending orders in edit mode */}
                {modalMode === 'edit' && isPending && onVerify && hasValidId && currentStep === 'form' && (
                  <button
                    onClick={handleVerify}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Verify Order
                      </>
                    )}
                  </button>
                )}
                
                {/* Convert to Sales Order Button - Show for verified orders in edit mode */}
                {modalMode === 'edit' && isVerified && onConvertToSalesOrder && hasValidId && (
                  <button
                    onClick={handleConvertToSalesOrder}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <ArrowRightIcon className="w-4 h-4 mr-2" />
                        Convert to Sales Order
                      </>
                    )}
                  </button>
                )}
                
                {/* Save Button - Show for edit mode or new orders */}
                {(modalMode === 'edit' || !hasValidId) && (
                  <button
                    onClick={handleSave}
                    disabled={!isFormValid() || isSubmitting}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        {hasValidId ? 'Update Purchase Order' : 'Save Purchase Order'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </TailwindDialog>

      {/* Modals */}
      <BuyerFormModal
        isOpen={showBuyerModal}
        onClose={() => setShowBuyerModal(false)}
        initialData={undefined}
        onSubmit={(buyer: BuyerFormData) => {
          setFormData(prev => prev ? { ...prev, buyerName: buyer.name } : prev);
          setShowBuyerModal(false);
        }}
      />
      <ShadeModal
        isOpen={showShadeModal}
        onClose={() => setShowShadeModal(false)}
        onCreate={() => {}}
        onUpdate={() => {}}
        shadeToEdit={null}
        fibres={[]}
      />
    </>
  );
};

// Helper Field component for consistent display
const Field: React.FC<{ label: string; value?: any; onChange?: (v: any) => void; readOnly?: boolean; multiLine?: boolean; type?: string; step?: string }> = ({ label, value = '', onChange, readOnly, multiLine, type, step }) => (
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
        step={step}
      />
    )}
  </div>
);

export default PurchaseOrderModal;