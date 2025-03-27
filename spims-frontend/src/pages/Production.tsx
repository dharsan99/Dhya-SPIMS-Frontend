import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProduction,
  deleteProduction,
  createProduction,
  updateProduction,
} from '../api/production';
import { getAllOrders } from '../api/orders';
import Loader from '../components/Loader';
import ProductionModal from '../components/ProductionModal';
import { ProductionForm, ProductionRecord } from '../types/production';
import { Order } from '../types/order';
import useAuthStore from '../hooks/auth';

const Production = () => {
  const queryClient = useQueryClient();
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <div className="p-6">🔄 Loading authentication...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">⛔ Not authenticated</div>;
  }

  const tenantId = user.tenant_id;
  const userId = user.id;

  console.log("✅ Zustand user loaded:", user);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionRecord | null>(null);
  if (!user) return <Loader />; // or any fallback UI

  const { data: productionData, isLoading, isError } = useQuery({
    queryKey: ['production'],
    queryFn: getProduction,
  });

  const { data: ordersResponse } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      data,
      isEdit,
      id,
    }: {
      data: ProductionForm;
      isEdit: boolean;
      id?: string;
    }) => {
      console.log('📤 Sending production payload:', data);
      return isEdit && id ? updateProduction(id, data) : createProduction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] });
    },
  });

  const handleEdit = (record: ProductionRecord) => {
    setEditingProduction(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this production record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (data: ProductionForm, isEdit: boolean) => {
    const finalPayload: ProductionForm = {
      ...data,
      tenant_id: tenantId,     // ⬅️ always fresh from Zustand store
      entered_by: userId,      // ⬅️ always fresh from Zustand store
    };
  
    console.log("📤 Final Production Payload (validated):", finalPayload);
  
    saveMutation.mutate({
      data: finalPayload,
      isEdit,
      id: editingProduction?.id,
    });
  
    setIsModalOpen(false);
    setEditingProduction(null);
  };

  // ✅ Filter orders not already linked to production, unless it's being edited
  const usedOrderIds = productionData?.map((prod: ProductionRecord) => prod.linked_order_id) || [];  const allOrders: Order[] = ordersResponse?.data || [];

  const availableOrders = editingProduction
    ? allOrders.filter(
        (order) =>
          !usedOrderIds.includes(order.id) || order.id === editingProduction.linked_order_id
      )
    : allOrders.filter((order) => !usedOrderIds.includes(order.id));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Production</h1>
        <button
          onClick={() => {
            setEditingProduction(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Production
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="text-red-500">Failed to load production records.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-left">Shift</th>
                <th className="px-4 py-2 text-left">Value</th>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productionData?.map((prod: ProductionRecord) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(prod.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{prod.section}</td>
                  <td className="px-4 py-2">{prod.shift}</td>
                  <td className="px-4 py-2">{prod.value}</td>
                  <td className="px-4 py-2">{prod.orders?.order_number || '—'}</td>
                  <td className="px-4 py-2">{prod.orders?.buyer_name || '—'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
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

<ProductionModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingProduction(null);
  }}
  initialData={editingProduction || undefined}
  onSave={handleSave}
  orders={availableOrders}
  tenantId={tenantId}      // ✅ Add this
  userId={userId}          // ✅ And this
/>
    </div>
  );
};

export default Production;