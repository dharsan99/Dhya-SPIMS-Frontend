import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMailingLists, deleteMailingList, getMailingListContacts } from '../../api/mailingList';
import { getBuyers } from '../../api/buyers';
import { MailingList, MailingListContactsResponse } from '../../types/mailingList';
import { Buyer } from '../../types/buyer';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, Users, Eye, Mail } from 'lucide-react';
import CreateMailingListModal from './CreateMailingListModal';
import EditMailingListModal from './EditMailingListModal';

const MailingListPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editList, setEditList] = useState<MailingList | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { data: lists = [], isLoading } = useQuery<MailingList[]>({
    queryKey: ['mailingLists'],
    queryFn: getMailingLists,
  });

  const { data: buyers = [] } = useQuery<Buyer[]>({
    queryKey: ['buyers'],
    queryFn: getBuyers,
  });

  // Query for selected list contacts
  const { data: selectedListContacts } = useQuery<MailingListContactsResponse>({
    queryKey: ['mailingListContacts', selectedListId],
    queryFn: () => getMailingListContacts(selectedListId!),
    enabled: !!selectedListId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMailingList,
    onSuccess: () => {
      toast.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['mailingLists'] });
    },
    onError: () => toast.error('Failed to delete list'),
  });

  // Helper function to get recipient count and display text
  const getRecipientInfo = (list: MailingList) => {
    const buyerCount = list.mailingListBuyers.length;
    const resendCount = list.resendAudience?.contactCount || 0;
    const totalCount = list.totalContactCount || (buyerCount + resendCount);
    
    let displayText = '';
    if (buyerCount > 0 && resendCount > 0) {
      displayText = `${buyerCount} buyers, ${resendCount} from Resend`;
    } else if (buyerCount > 0) {
      displayText = `${buyerCount} buyers`;
    } else if (resendCount > 0) {
      displayText = `${resendCount} contacts`;
    }
    
    return { totalCount, displayText };
  };

  const handleViewContacts = (listId: string) => {
    setSelectedListId(selectedListId === listId ? null : listId);
  };

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
          {lists.map((list) => {
            const { totalCount, displayText } = getRecipientInfo(list);
            const isExpanded = selectedListId === list.id;
            
            return (
              <li
                key={list.id}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">{list.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      <Users className="w-3 h-3" />
                      {totalCount} recipients
                    </div>
                    {list.resendAudienceId && (
                      <div className="flex items-center gap-1 text-xs text-green-500 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                        <Mail className="w-3 h-3" />
                        Resend
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {displayText || 'No recipients'}
                  </p>
                  
                  {/* Contact Details (when expanded) */}
                  {isExpanded && selectedListContacts && (
                    <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded border">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        Contacts ({selectedListContacts.totalCount})
                      </h5>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {selectedListContacts.contacts.map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium">{contact.name}</span>
                              <span className="text-gray-500 ml-2">{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{contact.company}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                contact.source === 'buyer' 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                              }`}>
                                {contact.source}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleViewContacts(list.id)}
                    className={`text-blue-500 hover:text-blue-600 ${
                      isExpanded ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                    } p-1 rounded`}
                    title={isExpanded ? "Hide contacts" : "View contacts"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
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
            );
          })}
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
            name: mlb.buyer.name,
          }))}
          allBuyers={buyers}
        />
      )}
    </div>
  );
};

export default MailingListPanel;