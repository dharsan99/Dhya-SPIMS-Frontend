import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Search, UploadCloud } from 'lucide-react';
import { TailwindDialog } from '../ui/Dialog';
import { PotentialBuyer } from '../../types/potentialBuyer';

interface Props {
  buyers: PotentialBuyer[];
  onSelect: (ids: string[], uploaded?: Omit<PotentialBuyer, 'id'>[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

const CreatePotentialMailingListModal: React.FC<Props> = ({ buyers, onSelect, onClose, isOpen }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<PotentialBuyer[]>(buyers);
  const [uploaded, setUploaded] = useState<PotentialBuyer[]>([]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const all = [...buyers, ...uploaded];
    setFiltered(
      all.filter(
        (b) =>
          b.company.toLowerCase().includes(term) ||
          b.person.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, buyers, uploaded]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(filtered.map((b) => b.id));
  const clearAll = () => setSelected([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const parsed: PotentialBuyer[] = (json as any[])
        .map((row, index) => {
          const company = (row['COMPANY NAME'] || '').toString().trim();
          const person = (row['CONTACT PERSON'] || '').toString().trim();
          const email = (row['EMAIL ID'] || '').toString().trim();

          if (!email || !company) return null;

          return {
            id: `xl_${index}`,
            company,
            person,
            email,
          };
        })
        .filter(Boolean) as PotentialBuyer[];

      setUploaded(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirm = () => {
    const allBuyers = [...buyers, ...uploaded];
    const selectedBuyers = allBuyers.filter((b) => selected.includes(b.id));

    if (selectedBuyers.length === 0) return;

    const uploadedSubset = uploaded.filter((b) => selected.includes(b.id));
    onSelect(selected, uploadedSubset);
    onClose();
  };

  return (
    <TailwindDialog isOpen={isOpen} onClose={onClose} title="Create Potential Buyer Mailing List">
      <div className="max-w-4xl w-full space-y-6 mx-auto">
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search buyers..."
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Upload */}
        <div className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-2">
          <UploadCloud className="w-4 h-4" />
          <label className="cursor-pointer">
            Upload Excel
            <input type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        {/* Controls */}
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Selected: {selected.length} / {[...buyers, ...uploaded].length}
          </span>
          <div className="space-x-4">
            <button onClick={selectAll} className="text-blue-600 hover:underline">Select All</button>
            <button onClick={clearAll} className="text-blue-600 hover:underline">Clear</button>
          </div>
        </div>

        {/* Buyer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((b) => (
            <label
              key={b.id}
              className="flex items-start gap-2 text-sm text-gray-800 dark:text-gray-200 p-2 border rounded shadow-sm bg-white dark:bg-gray-900"
            >
              <input
                type="checkbox"
                checked={selected.includes(b.id)}
                onChange={() => toggle(b.id)}
                className="mt-1"
              />
              <div className="overflow-hidden">
                <div className="font-semibold truncate w-full max-w-[220px]">{b.company}</div>
                <div className="text-xs text-gray-500 truncate w-full max-w-[220px]">{b.person}</div>
                <div className="text-xs text-gray-500 italic truncate w-full max-w-[220px]">{b.email}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm & Create
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default CreatePotentialMailingListModal;