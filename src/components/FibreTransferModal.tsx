import React, { useEffect, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { FibreTransfer, CreateFibreTransfer } from '../types/fibreTransfer';
import { Fiber, FiberCategory } from '../types/fiber';
import { getAllSuppliers } from '../api/suppliers';
import { Supplier } from '../types/supplier';
import { getFibreCategories } from '../api/fibreCategories';

interface FibreTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateFibreTransfer | FibreTransfer) => void;
  fibres: Fiber[];
  initialData?: FibreTransfer | null;
}

type OptionType = {
  label: string;
  value: string;
};

type FibreOption = OptionType & {
  searchableText: string;
};

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#1f2937',
    borderColor: state.isFocused ? '#3b82f6' : '#4b5563',
    color: '#fff',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1f2937',
    color: '#fff',
    zIndex: 999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? '#3b82f6'
      : state.isSelected
      ? '#2563eb'
      : 'transparent',
    color: '#fff',
    '&:active': {
      backgroundColor: '#2563eb',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#fff',
  }),
  input: (base: any) => ({
    ...base,
    color: '#fff',
  }),
};

const FibreTransferModal: React.FC<FibreTransferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fibres,
  initialData,
}) => {
  const [supplierId, setSupplierId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [fibreId, setFibreId] = useState('');
  const [sentKg, setSentKg] = useState('');

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
    enabled: isOpen,
  });

  const { data: categories = [] } = useQuery<FiberCategory[]>({
    queryKey: ['fibreCategories'],
    queryFn: getFibreCategories,
    enabled: isOpen,
  });

  const filteredFibres = useMemo(() => {
    if (!selectedCategoryId) return fibres;
    return fibres.filter(
      (f) =>
        f.category_id === selectedCategoryId ||
        f.category?.id === selectedCategoryId
    );
  }, [fibres, selectedCategoryId]);

  const fibreOptions: FibreOption[] = useMemo(() => {
    return filteredFibres.map((f) => ({
      label: `${f.fibre_code} – ${f.fibre_name}`,
      value: f.id,
      searchableText: `${f.fibre_code} ${f.fibre_name}`.toLowerCase(),
    }));
  }, [filteredFibres]);

  useEffect(() => {
    if (initialData) {
      setSupplierId(initialData.supplier_id || '');
      setFibreId(initialData.fibre_id || '');
      setSentKg(initialData.sent_kg?.toString() || '');

      const matchedFibre = fibres.find((f) => f.id === initialData.fibre_id);
      if (matchedFibre?.category_id || matchedFibre?.category?.id) {
        setSelectedCategoryId(matchedFibre.category_id || matchedFibre.category?.id || '');
      }
    } else {
      setSupplierId('');
      setFibreId('');
      setSentKg('');
      setSelectedCategoryId('');
    }
  }, [initialData, fibres]);

  const handleSubmit = () => {
    if (!supplierId || !fibreId || !sentKg) return;

    onSave({
      ...(initialData || {}),
      supplier_id: supplierId,
      fibre_id: fibreId,
      sent_kg: parseFloat(sentKg),
    });
  };

  const getSelectedSupplier = (): OptionType | null => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? { label: supplier.name, value: supplier.id } : null;
  };

  const getSelectedCategory = (): OptionType | null => {
    const cat = categories.find((c) => c.id === selectedCategoryId);
    return cat ? { label: cat.name, value: cat.id } : null;
  };

  const getSelectedFibre = (): FibreOption | null => {
    const f = filteredFibres.find((f) => f.id === fibreId);
    return f
      ? {
          label: `${f.fibre_code} – ${f.fibre_name}`,
          value: f.id,
          searchableText: `${f.fibre_code} ${f.fibre_name}`.toLowerCase(),
        }
      : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">
          {initialData ? 'Edit Fibre Transfer' : 'New Fibre Transfer'}
        </h2>

        {/* Supplier */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <Select
            styles={customSelectStyles}
            options={suppliers.map((s) => ({ label: s.name, value: s.id }))}
            value={getSelectedSupplier()}
            onChange={(opt: SingleValue<OptionType>) => setSupplierId(opt?.value || '')}
            placeholder="Select supplier..."
            classNamePrefix="react-select"
          />
        </div>

        {/* Fibre Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fibre Category</label>
          <Select
            styles={customSelectStyles}
            options={categories.map((c) => ({ label: c.name, value: c.id }))}
            value={getSelectedCategory()}
            onChange={(opt: SingleValue<OptionType>) => {
              setSelectedCategoryId(opt?.value || '');
              setFibreId('');
            }}
            placeholder="Select category..."
            classNamePrefix="react-select"
          />
        </div>

        {/* Fibre */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fibre</label>
          <Select<FibreOption>
            styles={customSelectStyles}
            isDisabled={!selectedCategoryId}
            options={fibreOptions}
            value={getSelectedFibre()}
            onChange={(opt: SingleValue<FibreOption>) => setFibreId(opt?.value || '')}
            placeholder="Search fibre by code or name..."
            classNamePrefix="react-select"
            filterOption={(option, input) =>
              option.data.searchableText.includes(input.toLowerCase())
            }
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Sent Quantity (kg)</label>
          <input
            type="number"
            min={0}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900"
            value={sentKg}
            onChange={(e) => setSentKg(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FibreTransferModal;