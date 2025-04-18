import React, { useEffect, useState } from 'react';
import useAuthStore from '../hooks/auth';
import { getBuyers } from '../api/buyers';
import { getAllShades } from '../api/shades';
import { Buyer } from '../types/buyer';
import { Shade } from '../types/shade';

export interface OrderFormData {
  id?: string;
  created_at?: string | number | Date;
  tenant_id: string;
  buyer_id: string;
  shade_id: string;
  quantity_kg: number;
  delivery_date: string;
  status: 'pending' | 'in_progress' | 'dispatched';
  created_by: string;
  order_number?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<OrderFormData, 'order_number'>) => void;
  initialData?: OrderFormData;
}

const OrderFormModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const auth = useAuthStore();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [shades, setShades] = useState<Shade[]>([]);
  const [orderDate, setOrderDate] = useState<string>('');

  const [formData, setFormData] = useState<Omit<OrderFormData, 'order_number'>>({
    tenant_id: '',
    buyer_id: '',
    shade_id: '',
    quantity_kg: 0,
    delivery_date: '',
    status: 'pending',
    created_by: '',
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [buyerList, shadeList] = await Promise.all([getBuyers(), getAllShades()]);
        setBuyers(buyerList);
        setShades(shadeList);
      } catch (err) {
        console.error('Error loading dropdowns:', err);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const user = auth.user;
    if (!user) return;

    if (initialData) {
      setFormData({
        ...initialData,
        tenant_id: initialData.tenant_id || user.tenant_id,
        created_by: initialData.created_by || user.id,
      });

      if (initialData.delivery_date) {
        const orderDateEstimate = new Date(initialData.delivery_date);
        orderDateEstimate.setDate(orderDateEstimate.getDate() - 25);
        setOrderDate(orderDateEstimate.toISOString().split('T')[0]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        tenant_id: user.tenant_id,
        created_by: user.id,
      }));
    }
  }, [auth, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'order_date') {
      setOrderDate(value);
      const delivery = new Date(value);
      delivery.setDate(delivery.getDate() + 25);
      const deliveryDateStr = delivery.toISOString().split('T')[0];

      setFormData((prev) => ({
        ...prev,
        delivery_date: deliveryDateStr,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'quantity_kg' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? `✏️ Edit Order: ${initialData.order_number}` : '➕ New Order Entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm block text-gray-600 mb-1">Buyer</label>
            <select
              name="buyer_id"
              value={formData.buyer_id}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Buyer</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block text-gray-600 mb-1">Shade</label>
            <select
              name="shade_id"
              value={formData.shade_id}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Shade</option>
              {shades.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shade_code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block text-gray-600 mb-1">Quantity (kg)</label>
            <input
              name="quantity_kg"
              type="number"
              value={formData.quantity_kg}
              onChange={handleChange}
              placeholder="e.g. 500"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm block text-gray-600 mb-1">Order Date</label>
            <input
              name="order_date"
              type="date"
              value={orderDate}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <p className="text-gray-500 text-sm mt-1">
              Delivery Date: <strong>{formData.delivery_date || '-'}</strong>
            </p>
          </div>

          <div>
            <label className="text-sm block text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="dispatched">Dispatched</option>
            </select>
          </div>

          <input type="hidden" name="tenant_id" value={formData.tenant_id} />
          <input type="hidden" name="created_by" value={formData.created_by} />

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {initialData ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;