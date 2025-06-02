import React, { useState } from 'react';
import SupplierTable from '../SuppliersTable';
import SupplierModal from '../SupplierModal';
import { Supplier } from '../../types/supplier';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupplier, updateSupplier } from '../../api/suppliers';

const FibreSuppliersPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created');
      setIsSupplierModalOpen(false);
      setSupplierToEdit(null);
    },
    onError: () => toast.error('Failed to create supplier'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier updated');
      setIsSupplierModalOpen(false);
      setSupplierToEdit(null);
    },
    onError: () => toast.error('Failed to update supplier'),
  });

  const handleSupplierSaved = (data: Supplier | Omit<Supplier, 'id'>) => {
    if ('id' in data && data.id) {
      updateMutation.mutate({ id: data.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setIsSupplierModalOpen(true);
            setSupplierToEdit(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Supplier
        </button>
      </div>
      <SupplierTable
        onEdit={(supplier) => {
          setSupplierToEdit(supplier);
          setIsSupplierModalOpen(true);
        }}
      />
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setSupplierToEdit(null);
        }}
        onSaved={handleSupplierSaved}
        supplierToEdit={supplierToEdit}
        initialData={null}
      />
    </>
  );
};

export default FibreSuppliersPanel;