import React, { useState } from 'react';
import { Buyer } from '../../types/buyer';
import { deleteBuyer, createBuyer, updateBuyer } from '../../api/buyers';
import useAuthStore from '../../hooks/auth';
import BuyerFormModal from '../BuyerFormModal';
import BuyersTable from '../Buyers/BuyersTable';
interface BuyersTabProps {
    buyers: Buyer[];
    onRefresh: () => Promise<void>;
  }
  
  const BuyersTab: React.FC<BuyersTabProps> = ({ buyers, onRefresh }) => {
    const auth = useAuthStore();
    const [buyerModalOpen, setBuyerModalOpen] = useState(false);
    const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
    const [confirmDeleteBuyerId, setConfirmDeleteBuyerId] = useState<string | null>(null);
  
    const handleEditBuyer = (buyer: Buyer) => {
      setEditingBuyer(buyer);
      setBuyerModalOpen(true);
    };
  
    const handleDeleteBuyer = async (id: string) => {
      try {
        await deleteBuyer(id);
        await onRefresh();
      } catch (error) {
        console.error('Error deleting buyer:', error);
      }
    };
  
    return (
      <>
        {confirmDeleteBuyerId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Confirm Buyer Deletion
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this buyer? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteBuyerId(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleDeleteBuyer(confirmDeleteBuyerId!);
                    setConfirmDeleteBuyerId(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
  
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">Buyers</h2>
          <button
            onClick={() => {
              setEditingBuyer(null);
              setBuyerModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Buyer
          </button>
        </div>
  
        <BuyersTable
          buyers={buyers}
          onEdit={handleEditBuyer}
          onDelete={(id) => setConfirmDeleteBuyerId(id)}
        />
  
        <BuyerFormModal
          isOpen={buyerModalOpen}
          onClose={() => setBuyerModalOpen(false)}
          onSubmit={(formData) => {
            if (!auth.user) return;
            const payload = {
              ...formData,
              tenant_id: auth.user.tenantId,
              created_by: auth.user.id,
            };
            if (editingBuyer?.id) {
              updateBuyer(editingBuyer.id, payload).then(() => {
                setBuyerModalOpen(false);
                onRefresh();
              });
            } else {
              createBuyer(payload).then(() => {
                setBuyerModalOpen(false);
                onRefresh();
              });
            }
          }}
          initialData={editingBuyer || undefined}
        />
      </>
    );
  };
  
  export default BuyersTab;