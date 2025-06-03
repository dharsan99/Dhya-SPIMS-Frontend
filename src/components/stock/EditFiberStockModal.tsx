import React, { useState } from 'react';
import Modal from '../Modal';
import Select from 'react-select';
import { StockItem } from '@/types/stock';

interface EditFiberStockModalProps {
  item: StockItem;
  onClose: () => void;
  onUpdate: (updated: StockItem) => void;
  categories: string[];
}

const EditFiberStockModal: React.FC<EditFiberStockModalProps> = ({
  item,
  onClose,
  onUpdate,
  categories,
}) => {
  const [formData, setFormData] = useState({
    fibre_name: item.fibre_name,
    category: item.category,
    stock_kg: item.stock_kg.toString(),
    threshold_kg: item.threshold_kg.toString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selected: { value: string; label: string } | null) => {
    setFormData(prev => ({ ...prev, category: selected ? selected.value : '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StockItem = {
      ...item,
      fibre_name: formData.fibre_name,
      category: formData.category,
      stock_kg: parseFloat(formData.stock_kg),
      threshold_kg: parseFloat(formData.threshold_kg),
      last_updated: new Date().toISOString().split('T')[0],
    };
    onUpdate(updated);
  };

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Edit Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Fibre Name</label>
          <input
            type="text"
            name="fibre_name"
            value={formData.fibre_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <Select
            options={categoryOptions}
            value={{ value: formData.category, label: formData.category }}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Stock (kg)</label>
          <input
            type="number"
            name="stock_kg"
            value={formData.stock_kg}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Threshold (kg)</label>
          <input
            type="number"
            name="threshold_kg"
            value={formData.threshold_kg}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-end pt-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFiberStockModal;
