import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMailingLists, deleteMailingList } from '../../api/mailingList';
import { getBuyers } from '../../api/buyers';
import { MailingList } from '../../types/mailingList';
import { Buyer } from '../../types/buyer';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CreateMailingListModal from './CreateMailingListModal';
import EditMailingListModal from './EditMailingListModal';

const MailingListPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editList, setEditList] = useState<MailingList | null>(null);

  const { data: lists = [], isLoading } = useQuery<MailingList[]>({
    queryKey: ['mailingLists'],
    queryFn: getMailingLists,
  });

  const { data: buyers = [] } = useQuery<Buyer[]>({
    queryKey: ['buyers'],
    queryFn: getBuyers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMailingList,
    onSuccess: () => {
      toast.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['mailingLists'] });
    },
    onError: () => toast.error('Failed to delete list'),
  });

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Saved Mailing Lists</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Create List
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : lists.length === 0 ? (
        <p className="text-gray-500 italic dark:text-gray-400">No mailing lists found.</p>
      ) : (
        <ul className="space-y-4">
          {lists.map((list) => (
            <li
              key={list.id}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex justify-between items-start hover:shadow-md"
            >
              <div>
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">{list.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {list.mailingListBuyers.map((b) => b.buyer?.name || 'Unknown').join(', ')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditList(list)}
                  className="text-yellow-500 hover:text-yellow-600"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(list.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

<CreateMailingListModal
  isOpen={isCreateModalOpen}
  onClose={() => setCreateModalOpen(false)}
/>

      {editList && (
        <EditMailingListModal
          isOpen={true}
          onClose={() => setEditList(null)}
          listId={editList.id}
          existingName={editList.name}
          existingBuyers={editList.mailingListBuyers.map((mlb) => ({
            id: mlb.buyerId,
            name: mlb.buyer?.name || '',
          }))}
          allBuyers={buyers}
        />
      )}
    </div>
  );
};

export default MailingListPanel;