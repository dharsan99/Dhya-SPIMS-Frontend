import React, { useState, useEffect } from 'react';
import { TailwindDialog } from '../../ui/Dialog';
import { toast } from 'react-hot-toast';
import { Buyer } from '../../../types/buyer';
import { Shade } from '../../../types/shade';
import { PurchaseOrder } from '../../../types/purchaseOrder';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'buyer' | 'shade';
  onAdd: (data: any) => Promise<Buyer | Shade>;
  poData?: PurchaseOrder | null;
}

const AddNewModal: React.FC<Props> = ({ isOpen, onClose, type, onAdd, poData }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_name: '',
    contact_phone: '',
    email: '',
    address: '',
    gst_no: '',
    pan_no: '',
  });

  // Prefill form data from PO when modal opens
  useEffect(() => {
    if (isOpen && type === 'buyer' && poData) {
      setFormData({
        name: poData.supplier_name || '',
        code: '',
        contact_name: poData.buyer_contact_name || '',
        contact_phone: poData.buyer_contact_phone || '',
        email: poData.buyer_email || '',
        address: poData.buyer_address || '',
        gst_no: poData.supplier_gst_no || '',
        pan_no: poData.buyer_pan_no || '',
      });
    } else if (isOpen && type === 'shade') {
      // Reset form data for shade
      setFormData({
        name: '',
        code: '',
        contact_name: '',
        contact_phone: '',
        email: '',
        address: '',
        gst_no: '',
        pan_no: '',
      });
    }
  }, [isOpen, type, poData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
      toast.success(`${type === 'buyer' ? 'Buyer' : 'Shade'} added successfully!`);
      onClose();
    } catch (error) {
      console.error(`Failed to add ${type}:`, error);
      toast.error(`Failed to add ${type}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Add New ${type === 'buyer' ? 'Buyer' : 'Shade'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'buyer' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter buyer name"
              />
              {poData?.supplier_name && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO supplier name
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter contact name"
              />
              {poData?.buyer_contact_name && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO contact person
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter contact phone"
              />
              {poData?.buyer_contact_phone && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO contact phone
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter email"
              />
              {poData?.buyer_email && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO email
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter address"
              />
              {poData?.buyer_address && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO buyer address
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GST No
              </label>
              <input
                type="text"
                name="gst_no"
                value={formData.gst_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter GST number"
              />
              {poData?.supplier_gst_no && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO supplier GST
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PAN No
              </label>
              <input
                type="text"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter PAN number"
              />
              {poData?.buyer_pan_no && (
                <p className="text-xs text-gray-500 mt-1">
                  Prefilled from PO buyer PAN
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shade Code *
              </label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter shade code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter shade name"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add {type === 'buyer' ? 'Buyer' : 'Shade'}
          </button>
        </div>
      </form>
    </TailwindDialog>
  );
};

export default AddNewModal; 