import { FC, useState, useEffect } from 'react';
import { ProductionRecord, ProductionForm } from '../types/production';
import { createProduction, updateProduction } from '../api/production';
import toast from 'react-hot-toast';

export interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductionRecord;
  onSaved: () => void;
}

const ProductionModal: FC<ProductionModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSaved,
}) => {
  const [form, setForm] = useState<Omit<ProductionForm, 'tenant_id' | 'user_id' | 'order_id'>>({
    date: '',
    section: '',
    machine: '',
    shift: '',
    count: '',
    hank: undefined,
    production_kg: 0,
    required_qty: 0,
    remarks: '',
    status: 'draft',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date.slice(0, 10),
        section: initialData.section,
        machine: initialData.machine,
        shift: initialData.shift,
        count: initialData.count || '',
        hank: initialData.hank,
        production_kg: Number(initialData.production_kg),
        required_qty: Number(initialData.required_qty),
        remarks: initialData.remarks || '',
        status: initialData.status || 'draft',
      });
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        section: '',
        machine: '',
        shift: '',
        count: '',
        hank: undefined,
        production_kg: 0,
        required_qty: 0,
        remarks: '',
        status: 'draft',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (['production_kg', 'required_qty', 'hank'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!initialData?.tenant_id || !initialData?.user_id || !initialData?.order_id) {
      toast.error('Missing tenant, user, or order ID');
      return;
    }

    const payload: ProductionForm = {
      ...form,
      tenant_id: initialData.tenant_id,
      user_id: initialData.user_id,
      order_id: initialData.order_id,
    };

    try {
      if (initialData?.id) {
        await updateProduction(initialData.id, payload);
        toast.success('Production updated!');
      } else {
        await createProduction(payload);
        toast.success('Production created!');
      }
      onClose();
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? 'Edit Production' : 'New Production'}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="section"
            value={form.section}
            onChange={handleChange}
            placeholder="Section"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="machine"
            value={form.machine}
            onChange={handleChange}
            placeholder="Machine"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="shift"
            value={form.shift}
            onChange={handleChange}
            placeholder="Shift"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="count"
            value={form.count}
            onChange={handleChange}
            placeholder="Count"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="hank"
            value={form.hank ?? ''}
            onChange={handleChange}
            placeholder="Hank"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="production_kg"
            value={form.production_kg}
            onChange={handleChange}
            placeholder="Production (kg)"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="required_qty"
            value={form.required_qty}
            onChange={handleChange}
            placeholder="Required (kg)"
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          >
            <option value="draft">Draft</option>
            <option value="final">Final</option>
          </select>

          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="col-span-2 border p-2 rounded"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionModal;