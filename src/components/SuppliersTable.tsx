// src/components/SupplierTable.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSuppliers, deleteSupplier } from '../api/suppliers';
import { useOptimizedToast } from '@/hooks/useOptimizedToast';
import { Supplier } from '../types/supplier';
import useAuthStore from '@/hooks/auth';

const SupplierTable = ({ onEdit }: { onEdit: (supplier: Supplier) => void }) => {
  const queryClient = useQueryClient();
  const { success, error } = useOptimizedToast();

  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canEdit = hasPermission('Suppliers', 'Update Supplier');
  const canDelete = hasPermission('Suppliers', 'Delete Supplier');
  const showActions = canEdit || canDelete;

  const { data: suppliers = [], isLoading, isError } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
  });

  const mutationDelete = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      success('Supplier deleted');
    },
    onError: () => error('Failed to delete supplier'),
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow mt-10 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Suppliers</h3>
        {/* Add button handled in parent via prop/modal trigger */}
      </div>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading suppliers...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to fetch suppliers</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Contact</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Email</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">Address</th>
                {showActions && (
                  <th className="p-3 border-b border-gray-200 dark:border-gray-700 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.contact || '-'}</td>
                  <td className="p-3">{s.email || '-'}</td>
                  <td className="p-3">{s.address || '-'}</td>
                  {showActions && (
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        {canEdit && (
                          <button
                            onClick={() => onEdit(s)}
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => mutationDelete.mutate(s.id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplierTable;