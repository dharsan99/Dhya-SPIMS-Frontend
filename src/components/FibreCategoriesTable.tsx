import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useOptimizedToast } from '@/hooks/useOptimizedToast';
import FibreCategoryModal from './FibreCategoryModal';
import {
  getFibreCategories,
  createFibreCategory,
  updateFibreCategory,
  deleteFibreCategory,
} from '../api/fibreCategories';
import { FiberCategory } from '../types/fiber';
import toast from 'react-hot-toast';

const FibreCategoriesTable = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FiberCategory | null>(null);
  useOptimizedToast();

  const {
    data: categoriesRaw,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fibreCategories'],
    queryFn: getFibreCategories,
  });

  const categories: FiberCategory[] = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  const createMutation = useMutation({
    mutationFn: createFibreCategory,
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['fibreCategories'] });
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateFibreCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['fibreCategories'] });
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFibreCategory,
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['fibreCategories'] });
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const handleSave = (data: { id?: string; name: string }) => {
    if (data.id) {
      updateMutation.mutate({ id: data.id, data: { name: data.name } });
    } else {
      createMutation.mutate({ name: data.name });
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow mt-10 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Fibre Categories
        </h3>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Category
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading categories...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to fetch categories</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsModalOpen(true);
                      }}
                      className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <FibreCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        categoryToEdit={editingCategory}
      />
    </div>
  );
};

export default FibreCategoriesTable;