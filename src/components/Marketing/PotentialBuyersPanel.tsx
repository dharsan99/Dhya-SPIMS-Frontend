import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPotentialBuyers, uploadPotentialBuyers } from '../../api/potentialBuyers';
import { PotentialBuyer } from '../../types/potentialBuyer';
import CreatePotentialMailingListModal from './CreatePotentialMailingListModal';

const PotentialBuyersPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: potentialBuyers = [], isLoading } = useQuery<PotentialBuyer[]>({
    queryKey: ['potentialBuyers'],
    queryFn: getPotentialBuyers,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadPotentialBuyers,
    onSuccess: () => {
      toast.success('Uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['potentialBuyers'] });
    },
    onError: () => toast.error('Upload failed'),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return potentialBuyers.filter(
      (b) =>
        b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [potentialBuyers, searchTerm]);

  const toggleBuyer = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(filtered.map((b) => b.id));
  };

  const clearAll = () => {
    setSelected([]);
  };

  const handleMailingListCreate = (
    ids: string[],
    uploadedBuyers?: Omit<PotentialBuyer, 'id'>[]
  ) => {
    const fromDB = potentialBuyers.filter((b) => ids.includes(b.id));
    const fromUpload = uploadedBuyers?.filter((_, index) => ids.includes(`xl_${index}`)) || [];

    if (fromUpload.length > 0) {
      uploadMutation.mutate(fromUpload);
    } else {
      toast.success(`Mailing list created with ${fromDB.length} buyers`);
      console.log('✅ Final mailing list buyers:', fromDB);
    }
  };

  const handleExport = () => {
    if (selected.length === 0) {
      toast.error('Please select at least one buyer to export');
      return;
    }
    const selectedBuyers = potentialBuyers.filter((b) => selected.includes(b.id));
    console.log('Exporting:', selectedBuyers);
    toast.success(`Exported ${selectedBuyers.length} buyers`);
  };

  if (isLoading) {
    return <div className="text-center p-6 text-gray-500">Loading potential buyers...</div>;
  }

  if (potentialBuyers.length === 0) {
    return (
      <div className="text-center p-10 space-y-4 text-gray-500 dark:text-gray-400">
        <p className="italic">No potential buyers available.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => toast.error('Nothing to export')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Mailing List
          </button>
        </div>
        <CreatePotentialMailingListModal
          buyers={[]}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(ids, uploaded) => handleMailingListCreate(ids, uploaded)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search by company, person, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Selected: {selected.length} / {potentialBuyers.length}
        </span>
        <div className="space-x-4">
          <button onClick={selectAll} className="text-blue-600 hover:underline">Select All</button>
          <button onClick={clearAll} className="text-blue-600 hover:underline">Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {filtered.map((b) => (
          <label key={b.id} className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200">
            <input
              type="checkbox"
              checked={selected.includes(b.id)}
              onChange={() => toggleBuyer(b.id)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">{b.company}</div>
              <div className="text-xs text-gray-500">{b.person}</div>
              <div className="text-xs text-gray-500">{b.email}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Mailing List
        </button>
      </div>

      <CreatePotentialMailingListModal
        buyers={potentialBuyers}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(ids: string[], uploaded: Omit<PotentialBuyer, "id">[] | undefined) => handleMailingListCreate(ids, uploaded)}
      />
    </div>
  );
};

export default PotentialBuyersPanel;