import { useEffect, useState } from 'react';
import { ProductionForm } from '../types/production';

interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductionForm, isEdit: boolean) => void;
  initialData?: ProductionForm | null;
  orders: { id: string; order_number: string; buyer_name: string }[];
  tenantId: string;
  userId: string;
}

const ProductionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  orders,
  tenantId,
  userId,
}: ProductionModalProps) => {
  const [form, setForm] = useState<ProductionForm | null>(null);

  useEffect(() => {
    setForm({
      tenant_id: tenantId,
      entered_by: userId,
      date: initialData?.date ?? '',
      section: initialData?.section ?? '',
      shift: initialData?.shift ?? '',
      value: initialData?.value ?? 0,
      linked_order_id: initialData?.linked_order_id ?? '',
    });
  }, [initialData, tenantId, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'value' ? parseFloat(value) : value,
          }
        : null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const finalPayload: ProductionForm = {
      ...form,
      tenant_id: tenantId,
      entered_by: userId,
    };

    console.log('📤 Submitting Production Payload:', finalPayload);
    onSave(finalPayload, !!initialData);
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-blue-600">
          {initialData ? 'Edit Production' : 'Log New Production'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Section</label>
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Section --</option>
              <option value="carding">Carding</option>
              <option value="spinning">Spinning</option>
              <option value="roving">Roving</option>
              <option value="winding">Winding</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Shift</label>
            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Shift --</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Production Value (kg)</label>
            <input
              type="number"
              step="0.01"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Linked Order</label>
            <select
              name="linked_order_id"
              value={form.linked_order_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Order --</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.order_number} - {order.buyer_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {initialData ? 'Update' : 'Log Production'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionModal;