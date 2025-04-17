import { useEffect, useState } from 'react';
import { FiberCategory } from '../types/fiber';

interface FibreCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string }) => void;
  onDelete?: (id: string) => void;
  categoryToEdit?: FiberCategory | null;
}

const FibreCategoryModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  categoryToEdit
}: FibreCategoryModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(categoryToEdit?.name || '');
    }
  }, [isOpen, categoryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: categoryToEdit?.id, name: name.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {categoryToEdit ? '✏️ Edit Fibre Category' : '➕ Add Fibre Category'}
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">Category Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          {categoryToEdit && onDelete && (
            <button
              type="button"
              className="text-red-600 text-sm underline"
              onClick={() => {
                if (confirm('Are you sure you want to delete this category?')) {
                  onDelete(categoryToEdit.id);
                  onClose();
                }
              }}
            >
              Delete
            </button>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FibreCategoryModal;