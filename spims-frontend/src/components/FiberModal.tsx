import { useEffect, useRef, useState } from 'react';
import { Fiber, FiberCategory } from '../types/fiber';

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
  const [categoryId, setCategoryId] = useState<string>('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (fibreToEdit) {
        setFibreName(fibreToEdit.fibre_name);
        setFibreCode(fibreToEdit.fibre_code);
        setStockKg(String(fibreToEdit.stock_kg));
        setCategoryId(fibreToEdit.category_id || '');
      } else {
        setFibreName('');
        setFibreCode('');
        setStockKg('');
        setCategoryId('');
      }

      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [isOpen, fibreToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fibre_name: fibreName.trim(),
      fibre_code: fibreCode.trim(),
      stock_kg: parseFloat(stockKg),
      category_id: categoryId || null,
    };

    if (fibreToEdit && onUpdate) {
      onUpdate({ ...fibreToEdit, ...payload });
    } else {
      onCreate(payload);
    }

    onClose();
  };

  const handleStockUpdate = () => {
    if (fibreToEdit && onStockUpdate) {
      const newStock = parseFloat(stockKg);
      if (!isNaN(newStock)) {
        onStockUpdate(fibreToEdit.id, newStock);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {fibreToEdit ? '✏️ Edit Fibre' : '➕ Add Fibre'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Fibre Name</label>
            <input
              ref={nameRef}
              type="text"
              className="w-full border p-2 rounded"
              value={fibreName}
              onChange={(e) => setFibreName(e.target.value)}
              required
              disabled={!!fibreToEdit && !!onStockUpdate}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Fibre Code</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={fibreCode}
              onChange={(e) => setFibreCode(e.target.value)}
              required
              disabled={!!fibreToEdit && !!onStockUpdate}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Stock (in kg)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border p-2 rounded"
              value={stockKg}
              onChange={(e) => setStockKg(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Category</label>
            <select
              className="w-full border p-2 rounded"
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
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          {fibreToEdit && onStockUpdate ? (
            <button
              type="button"
              onClick={handleStockUpdate}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              Update Stock
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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