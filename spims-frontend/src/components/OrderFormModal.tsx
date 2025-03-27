import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../hooks/auth';

export interface OrderFormData {
  tenant_id: string;
  order_number: string;
  buyer_name: string;
  yarn_id: string;
  quantity_kg: number;
  delivery_date: string;
  status: 'pending' | 'in_progress' | 'dispatched';
  created_by: string;
}

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: OrderFormData) => void;
  initialData?: OrderFormData;
}

const OrderFormModal = ({ isOpen, onClose, onSubmit, initialData }: OrderFormModalProps) => {
  const auth = useAuthStore(); // ✅ Access Zustand auth store
  const [formData, setFormData] = useState<OrderFormData>({
    tenant_id: '',
    order_number: '',
    buyer_name: '',
    yarn_id: '',
    quantity_kg: 0,
    delivery_date: '',
    status: 'pending',
    created_by: '',
    ...(initialData || {})
  });

  const [yarnOptions, setYarnOptions] = useState<{ id: string; name: string }[]>([]);
  const [buyers] = useState(['TexWorld Exports', 'Classic Spinners', 'Global Threads']);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = auth.token;
        const user = auth.user;

        if (!token || !user) throw new Error('No auth token or user found');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [tenantRes, yarnRes] = await Promise.all([
          axios.get('http://localhost:5001/tenants', config),
          axios.get('http://localhost:5001/yarns', config),
        ]);

        const tenant_id = user.tenant_id; // Prefer getting from logged-in user
        const yarnOptions = yarnRes.data.map((y: any) => ({
          id: y.id,
          name: `${y.count_range} - ${y.base_shade}`,
        }));

        const nextOrderNum = 'SO-' + (1000 + Math.floor(Math.random() * 9000)).toString();

        setFormData((prev) => ({
          ...prev,
          tenant_id,
          yarn_id: yarnOptions[0]?.id || '',
          order_number: nextOrderNum,
          created_by: user.id,
        }));

        setYarnOptions(yarnOptions);
      } catch (error) {
        console.error('Error loading initial form data:', error);
      }
    };

    if (!initialData) {
      fetchInitialData();
    }
  }, [initialData, auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity_kg' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Order' : 'Create Order'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer Dropdown */}
          <select name="buyer_name" value={formData.buyer_name} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Buyer</option>
            {buyers.map((buyer) => (
              <option key={buyer} value={buyer}>{buyer}</option>
            ))}
          </select>

          {/* Yarn Dropdown */}
          <select name="yarn_id" value={formData.yarn_id} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select Yarn</option>
            {yarnOptions.map((yarn) => (
              <option key={yarn.id} value={yarn.id}>{yarn.name}</option>
            ))}
          </select>

          <input
            name="quantity_kg"
            type="number"
            value={formData.quantity_kg}
            onChange={handleChange}
            placeholder="Quantity (kg)"
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="delivery_date"
            type="date"
            value={formData.delivery_date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="dispatched">Dispatched</option>
          </select>

          {/* Hidden Fields */}
          <input type="hidden" name="tenant_id" value={formData.tenant_id} />
          <input type="hidden" name="order_number" value={formData.order_number} />
          <input type="hidden" name="created_by" value={formData.created_by} />

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;