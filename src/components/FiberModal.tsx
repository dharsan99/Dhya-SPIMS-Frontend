import { useEffect, useRef, useState } from 'react';
import { Fiber, FiberCategory } from '../types/fiber';
import { toast } from 'react-hot-toast';

interface FibreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Fiber, 'id'>) => void;
  onUpdate?: (data: Fiber) => void;
  onStockUpdate?: (id: string, newStock: number) => void;
  fibreToEdit?: Fiber | null;
  categories: FiberCategory[];
}

const FibreModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  onStockUpdate,
  fibreToEdit,
  categories,
}: FibreModalProps) => {
  const [fibreName, setFibreName] = useState('');
  const [fibreCode, setFibreCode] = useState('');
  const [stockKg, setStockKg] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isRawCotton = selectedCategory?.name.toLowerCase() === 'raw cotton';

  useEffect(() => {
    if (isOpen) {
      if (fibreToEdit) {
        setFibreName(fibreToEdit.fibre_name);
        setFibreCode(fibreToEdit.fibre_code);
        setStockKg(String(fibreToEdit.stock_kg));
        setDescription(fibreToEdit.description || '');
        setCategoryId(fibreToEdit.category_id || '');
      } else {
        setFibreName('');
        setFibreCode('');
        setStockKg('');
        setDescription('');
        setCategoryId('');
      }

      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [isOpen, fibreToEdit]);

  const autoGenerateFibreCode = () => {
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `FC-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRawCotton) {
      toast.error('RAW Cotton fibres are added during realisation only.');
      return;
    }

    const stock = parseFloat(stockKg);
    if (isNaN(stock) || stock < 0) {
      toast.error('Invalid stock value');
      return;
    }

    const payload = {
      fibre_name: fibreName.trim(),
      fibre_code: fibreCode.trim() || autoGenerateFibreCode(),
      stock_kg: stock,
      closing_stock: stock.toString(),
      inward_stock: "0",
      outward_stock: "0",
      consumed_stock: "0",
      description: description.trim(),
      category_id: categoryId || null,
      is_dynamic: false, // ✅ Set to false for manually created fibres
    };

    if (fibreToEdit && onUpdate) {
      onUpdate({ ...fibreToEdit, ...payload });
      toast.success('Fibre updated successfully');
    } else {
      onCreate(payload);
      toast.success('Fibre created successfully');
    }

    onClose();
  };

  const handleStockUpdate = () => {
    if (fibreToEdit && onStockUpdate) {
      const newStock = parseFloat(stockKg);
      if (!isNaN(newStock)) {
        onStockUpdate(fibreToEdit.id, newStock);
        onClose();
      } else {
        alert('Invalid stock value');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {fibreToEdit ? 'Edit Fibre' : 'Add New Fibre'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Fibre Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={fibreName}
              onChange={(e) => setFibreName(e.target.value)}
              required={!isRawCotton}
              disabled={!!fibreToEdit && !!onStockUpdate || isRawCotton}
              placeholder={isRawCotton ? 'Auto-generated during realisation' : 'Enter fibre name'}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Fibre Code</label>
            <input
              type="text"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={fibreCode}
              onChange={(e) => setFibreCode(e.target.value)}
              placeholder={isRawCotton ? 'Auto-generated during realisation' : 'Auto generated if empty'}
              disabled={!!fibreToEdit && !!onStockUpdate || isRawCotton}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Stock (kg)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={stockKg}
              onChange={(e) => setStockKg(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Description</label>
            <input
              type="text"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 block mb-1">Category</label>
            <select
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={!!fibreToEdit && !!onStockUpdate}
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 dark:bg-gray-700 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          {fibreToEdit && onStockUpdate ? (
            <button
              type="button"
              onClick={handleStockUpdate}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
            >
              Update Stock
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {fibreToEdit ? 'Update' : 'Save'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FibreModal;