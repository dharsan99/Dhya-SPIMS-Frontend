// src/components/BlendModal.tsx

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlend, updateBlend } from '../api/blends';

interface BlendModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    blend_code: string;
    description?: string;
  };
}

const BlendModal = ({ isOpen, onClose, initialData }: BlendModalProps) => {
  const [blendCode, setBlendCode] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      setBlendCode(initialData.blend_code);
      setDescription(initialData.description || '');
    } else {
      setBlendCode('');
      setDescription('');
    }
  }, [initialData]);

  const isEdit = !!initialData;

  const mutation = useMutation({
    mutationFn: (data: { blend_code: string; description?: string }) =>
      isEdit && initialData
        ? updateBlend(initialData.id, data)
        : createBlend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ blend_code: blendCode, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? 'Edit Blend' : 'Add New Blend'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Blend Code</label>
            <input
              type="text"
              value={blendCode}
              onChange={(e) => setBlendCode(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlendModal;