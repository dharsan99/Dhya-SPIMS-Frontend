// src/components/ProductionTabs/addproduction/AddProductionForm.tsx

import React, { useState } from 'react';
import { Order } from '../../../types/order';

interface AddProductionFormProps {
  onSubmit: (data: FormData) => void;
  orders: Order[];
  loadingOrders: boolean;
}

interface FormData {
  date: string;
  machine: string;
  section: string;
  shift: string;
  count: string;
  hank: string;
  production_kg: number;
  required_qty: number;
  remarks?: string;
  status: 'draft' | 'final';
  order_id?: string;
}

const AddProductionForm: React.FC<AddProductionFormProps> = ({ onSubmit, orders, loadingOrders }) => {
  const [form, setForm] = useState<FormData>({
    date: new Date().toISOString().slice(0, 10),
    machine: '',
    section: '',
    shift: '1',
    count: '',
    hank: '',
    production_kg: 0,
    required_qty: 0,
    remarks: '',
    status: 'draft',
    order_id: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'production_kg' || name === 'required_qty' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4 max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-blue-700">➕ Add Production Entry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">📅 Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🧾 Select Order</label>
          <select
            name="order_id"
            value={form.order_id}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          >
            <option value="">{loadingOrders ? 'Loading orders...' : 'Select an order'}</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.order_number} - {order.buyer?.buyer_name || 'Unnamed Buyer'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🛠 Machine</label>
          <input
            type="text"
            name="machine"
            value={form.machine}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🏭 Section</label>
          <input
            type="text"
            name="section"
            value={form.section}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">⏱ Shift</label>
          <select
            name="shift"
            value={form.shift}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          >
            <option value="1">Shift 1</option>
            <option value="2">Shift 2</option>
            <option value="3">Shift 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🔢 Count</label>
          <input
            type="text"
            name="count"
            value={form.count}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🧵 Hank</label>
          <input
            type="text"
            name="hank"
            value={form.hank}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">📦 Production (kg)</label>
          <input
            type="number"
            name="production_kg"
            value={form.production_kg}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            min={0}
            step={0.01}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">📈 Required (kg)</label>
          <input
            type="number"
            name="required_qty"
            value={form.required_qty}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            min={0}
            step={0.01}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">📝 Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">📌 Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
          >
            <option value="draft">Draft</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Save Production
        </button>
      </div>
    </form>
  );
};

export default AddProductionForm;