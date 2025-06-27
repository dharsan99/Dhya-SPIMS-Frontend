import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMailingList } from '../../api/mailingList';
import { getBuyers } from '../../api/buyers';
import { getPotentialBuyers } from '../../api/potentialBuyers';
import { Buyer } from '../../types/buyer';
import { PotentialBuyer } from '../../types/potentialBuyer';
import toast from 'react-hot-toast';
import { TailwindDialog } from '../ui/Dialog';
import { CreateMailingListDto } from '@/types/mailingList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMailingListModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [usePotential, setUsePotential] = useState(false);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: buyers = [] } = useQuery<Buyer[]>({
    queryKey: ['buyers'],
    queryFn: getBuyers,
    enabled: !usePotential,
  });

  const { data: potentialBuyers = [] } = useQuery<PotentialBuyer[]>({
    queryKey: ['potentialBuyers'],
    queryFn: getPotentialBuyers,
    enabled: usePotential,
  });

  const createMutation = useMutation({
    mutationFn: createMailingList,
    onSuccess: () => {
      toast.success('Mailing list created');
      queryClient.invalidateQueries({ queryKey: ['mailingLists'] });
      onClose();
      setName('');
      setSelected([]);
      setSearchTerm('');
    },
    onError: () => toast.error('Failed to create mailing list'),
  });

  const dataList = usePotential ? potentialBuyers : buyers;

  const filtered = useMemo(() => {
    return dataList.filter((b) => {
      const nameField = usePotential ? (b as PotentialBuyer).company : (b as Buyer).name;
      return nameField.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [dataList, searchTerm, usePotential]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(filtered.map((b) => b.id));
  };

  const clearAll = () => {
    setSelected([]);
  };

 
  const handleSubmit = () => {
    if (!name.trim() || selected.length === 0) {
      toast.error('List name and selection are required');
      return;
    }
  
    if (usePotential) {
      const recipients = potentialBuyers
        .filter((b) => selected.includes(b.id))
        .map((b) => ({
          name: b.person,
          email: b.email,
          company: b.company,
          source: 'potential' as const,
        }));
  
      const payload: CreateMailingListDto = {
        name: name.trim(),
        recipients,
      };
  
      console.log('📨 Creating list from Potential Buyers');
      console.log('📝 Payload:', payload);
  
      createMutation.mutate(payload);
    } else {
      const payload: CreateMailingListDto = {
        name: name.trim(),
        buyerIds: selected,
      };
  
      console.log('📨 Creating list from Registered Buyers');
      console.log('📝 Payload:', payload);
  
      createMutation.mutate(payload);
    }
  };

  return (
    <TailwindDialog isOpen={isOpen} onClose={onClose} title="Create Mailing List">
      <div>
        {/* Source Toggle */}
        <div className="mb-4">
          <label className="mr-3 font-medium text-sm text-gray-700 dark:text-gray-300">Source:</label>
          <label className="mr-4 text-sm">
            <input
              type="radio"
              name="source"
              value="buyers"
              checked={!usePotential}
              onChange={() => setUsePotential(false)}
              className="mr-1"
            />
            Buyers
          </label>
          <label className="text-sm">
            <input
              type="radio"
              name="source"
              value="potential"
              checked={usePotential}
              onChange={() => setUsePotential(true)}
              className="mr-1"
            />
            Potential Buyers
          </label>
        </div>

        {/* List Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List name"
          className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        {/* Search */}
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full"
          />
        </div>

        {/* Selection Controls */}
        <div className="mb-3 text-sm flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Selected: {selected.length} / {dataList.length}
          </span>
          <div className="space-x-3">
            <button onClick={selectAll} className="text-blue-600 hover:underline">
              Select All
            </button>
            <button onClick={clearAll} className="text-blue-600 hover:underline">
              Clear
            </button>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          {filtered.map((b) => (
            <label key={b.id} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                checked={selected.includes(b.id)}
                onChange={() => toggle(b.id)}
                className="mt-1"
              />
              <span className="break-words whitespace-normal">
                {'name' in b ? (b as Buyer).name : (b as PotentialBuyer).company}
              </span>
            </label>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create List
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default CreateMailingListModal;