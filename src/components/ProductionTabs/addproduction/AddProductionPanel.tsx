// src/components/ProductionTabs/addproduction/AddProductionPanel.tsx

import React from 'react';
import AddProductionForm from './AddProductionForm';
import { toast } from 'react-hot-toast';
import { createProduction } from '../../../api/production';
import useAuthStore from '../../../hooks/auth';
import { Order } from '../../../types/order';

interface AddProductionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  loadingOrders: boolean;
}

const AddProductionPanel: React.FC<AddProductionPanelProps> = ({
  isOpen,
  onClose,
  orders,
  loadingOrders,
}) => {
  const { user } = useAuthStore();

  const handleFormSubmit = async (formData: any) => {
    try {
      if (!user?.id || !user?.tenantId) {
        toast.error('Missing user or tenant info');
        return;
      }

      const payload = {
        ...formData,
        user_id: user.id,
        tenant_id: user.tenantId,
      };

      await createProduction(payload);
      toast.success('✅ Production record saved successfully!');
      onClose();
    } catch (err: any) {
      toast.error('❌ Failed to save production');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
          title="Close"
        >
          ✖
        </button>

        <AddProductionForm
          onSubmit={handleFormSubmit}
          orders={orders}
          loadingOrders={loadingOrders}
        />
      </div>
    </div>
  );
};

export default AddProductionPanel;