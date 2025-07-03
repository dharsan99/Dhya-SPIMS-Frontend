import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMailingList } from '../../api/mailingList';
import { Buyer } from '../../types/buyer';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { TailwindDialog } from '../ui/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  existingName: string;
  existingBuyers: { id: string; name: string }[];
  allBuyers: Buyer[];
}

const EditMailingListModal: React.FC<Props> = ({
  isOpen,
  onClose,
  listId,
  existingName,
  existingBuyers,
  allBuyers,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(existingName);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const updateMutation = useMutation({
    mutationFn: ({ id, name, buyerIds }: { id: string; name: string; buyerIds: string[] }) =>
      updateMailingList(id, { name, buyerIds }),
    onSuccess: () => {
      toast.success('Mailing list updated');
      queryClient.invalidateQueries({ queryKey: ['mailingLists'] });
      onClose();
    },
    onError: () => toast.error('Update failed'),
  });

  useEffect(() => {
    setName(existingName);
    setSelected(existingBuyers.map((b) => b.id));
  }, [existingName, existingBuyers]);

  const toggleBuyer = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const saveChanges = () => {
    if (!name.trim() || selected.length === 0) {
      toast.error('List name and at least one buyer required');
      return;
    }
    updateMutation.mutate({ id: listId, name: name.trim(), buyerIds: selected });
  };

  const filteredBuyers = allBuyers.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TailwindDialog isOpen={isOpen} onClose={onClose} title="Edit Mailing List">
      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">List Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name"
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Search Buyers</label>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Buyer Select Pills */}
        <div className="max-h-48 overflow-y-auto border rounded p-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {filteredBuyers.map((b) => {
              const isSelected = selected.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBuyer(b.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {selected.length} of {allBuyers.length} buyers selected
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default EditMailingListModal;