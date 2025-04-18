// ✅ src/components/ProductionTabs/allrecords/BulkActions.tsx
import React, { useState, useEffect } from 'react';
import { ProductionRecord } from '../../../types/production';

interface BulkActionsProps {
  records: ProductionRecord[];
  onAction: (action: string, selectedIds: string[]) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ records, onAction }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Automatically reset if records change
  useEffect(() => {
    setSelectedIds([]);
  }, [records]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  if (records.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center">
        <div>
          <label className="text-sm font-medium text-gray-700">Select Records:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {records.map((r) => (
              <label key={r.id} className="flex items-center text-sm text-gray-600 gap-1">
                <input
                  type="checkbox"
                  checked={isSelected(r.id)}
                  onChange={() => toggleSelect(r.id)}
                />
                {new Date(r.date).toLocaleDateString('en-GB')} ({r.machine})
              </label>
            ))}
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
              onClick={() => onAction('delete', selectedIds)}
            >
              🗑 Delete
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded"
              onClick={() => onAction('final', selectedIds)}
            >
              ✅ Mark as Final
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
              onClick={() => onAction('export', selectedIds)}
            >
              📤 Export
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;