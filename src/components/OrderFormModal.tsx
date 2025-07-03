import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBuyers } from '../api/buyers';
import { getAllShades } from '../api/shades';
import useAuthStore from '../hooks/auth';
import { Buyer } from '../types/buyer';
import { Shade } from '../types/shade';
import SearchableDropdown from './SearchableDropdown';

export interface OrderFormData {
  id?: string;
  order_number?: string;
  buyer_id: string;
  shade_id: string;
  tenant_id: string;
  quantity_kg: number;
  delivery_date: string;
  order_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dispatched';
  created_by: string;
  count?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<OrderFormData, 'order_number' | 'order_date'>) => void;
  initialData?: OrderFormData;
}

const OrderFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const auth = useAuthStore((state) => state.user);

  const [form, setForm] = useState<OrderFormData>({
    buyer_id: '',
    shade_id: '',
    tenant_id: auth?.tenant_id || '',
    quantity_kg: 0,
    delivery_date: '',
    order_date: '',
    status: 'pending',
    created_by: auth?.id || '',
    count: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: buyers = [] } = useQuery<Buyer[]>({ queryKey: ['buyers'], queryFn: getBuyers });
  const { data: shades = [] } = useQuery<Shade[]>({ queryKey: ['shades'], queryFn: getAllShades });

  useEffect(() => {
    const today = new Date();
    const defaultOrderDate = today.toISOString().split('T')[0];
    const defaultDeliveryDate = new Date(today.setDate(today.getDate() + 25)).toISOString().split('T')[0];

    setForm(
      initialData ?? {
        buyer_id: '',
        shade_id: '',
        tenant_id: auth?.tenant_id || '',
        quantity_kg: 0,
        order_date: defaultOrderDate,
        delivery_date: defaultDeliveryDate,
        status: 'pending',
        created_by: auth?.id || '',
        count: undefined,
      }
    );
  }, [initialData, isOpen, auth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'order_date') {
      const newOrderDate = new Date(value);
      const newDeliveryDate = new Date(newOrderDate);
      newDeliveryDate.setDate(newOrderDate.getDate() + 25);

      setForm((prev) => ({
        ...prev,
        order_date: value,
        delivery_date: newDeliveryDate.toISOString().split('T')[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'quantity_kg' || name === 'count' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenant_id || !form.created_by) {
      alert('Missing tenant ID or creator ID');
      return;
    }
    if (form.quantity_kg <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    setIsSubmitting(true);
    try {
      const { order_date, ...sanitizedForm } = form;
      await onSubmit(sanitizedForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {initialData ? 'Edit Order' : 'Create New Order'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <SearchableDropdown
            label="Buyer"
            name="buyer_id"
            value={form.buyer_id}
            options={buyers.map((b) => ({ label: b.name, value: b.id }))}
            onChange={(val) => setForm((prev) => ({ ...prev, buyer_id: val }))}
          />

          <SearchableDropdown
            label="Shade"
            name="shade_id"
            value={form.shade_id}
            options={shades.map((s) => ({ label: s.shade_code, value: s.id }))}
            onChange={(val) => setForm((prev) => ({ ...prev, shade_id: val }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity (kg)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity_kg"
              value={form.quantity_kg}
              onChange={handleChange}
              required
              min={0.01}
              step="0.01"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Count (optional)
            </label>
            <input
              type="number"
              name="count"
              value={form.count || ''}
              onChange={handleChange}
              min={0}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter count"
            />
          </div>

          {initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="dispatched">Dispatched</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="order_date"
              value={form.order_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Delivery Date (auto-calculated)
            </label>
            <input
              type="date"
              value={form.delivery_date}
              readOnly
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFormModal;