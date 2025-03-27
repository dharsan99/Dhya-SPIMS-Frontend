// src/pages/Blends.tsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlends, deleteBlend } from '../api/blends';
import Loader from '../components/Loader';
import BlendModal from '../components/BlendModal';

const Blends = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blends'],
    queryFn: getBlends,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBlend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlend, setEditingBlend] = useState<null | {
    id: string;
    blend_code: string;
    description?: string;
  }>(null);

  const handleEdit = (blend: any) => {
    setEditingBlend(blend);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blend?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Blends</h1>
        <button
          onClick={() => {
            setEditingBlend(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Blend
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="text-red-500">Failed to load blends.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Blend Code</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.map((blend: any) => (
                <tr key={blend.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{blend.blend_code}</td>
                  <td className="px-4 py-2">{blend.description}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(blend)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blend.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BlendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingBlend || undefined}
      />
    </div>
  );
};

export default Blends;