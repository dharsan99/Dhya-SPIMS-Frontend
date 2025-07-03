import React, { useState } from 'react';
import Modal from '../Modal';
import Select from 'react-select';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fibre_name: string;
    category: string;
    stock_kg: number;
    threshold_kg: number;
  }) => void;
  categories: string[];
}

const AddFiberStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    fibre_name: '',
    category: '',
    stock_kg: '',
    threshold_kg: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleCategoryChange = (selectedOption: { value: string; label: string } | null) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fibre_name: formData.fibre_name,
      category: formData.category,
      stock_kg: parseFloat(formData.stock_kg),
      threshold_kg: parseFloat(formData.threshold_kg),
    });
    onClose();
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Add Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Fibre Name</label>
          <input
            type="text"
            name="fibre_name"
            value={formData.fibre_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
         <Select
            options={categoryOptions}
            onChange={handleCategoryChange}
            value={
              formData.category
                ? { value: formData.category, label: formData.category }
                : null
            }
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFiberStockModal;