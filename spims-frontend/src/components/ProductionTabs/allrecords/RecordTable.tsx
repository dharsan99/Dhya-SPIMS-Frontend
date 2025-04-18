// src/components/ProductionTabs/allrecords/RecordTable.tsx
import React from 'react';
import { ProductionRecord } from '../../../types/production';
import RecordActions from './RecordActions';
import { SortConfig } from './types';


interface RecordTableProps {
    records: ProductionRecord[];
    onEdit: (record: ProductionRecord) => void;
    onDelete: (id: string) => void;
    sortConfig: SortConfig;
    onSortChange: (config: SortConfig) => void;
  }

const RecordTable: React.FC<RecordTableProps> = ({ records, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Section</th>
            <th className="p-2">Machine</th>
            <th className="p-2">Shift</th>
            <th className="p-2">Count</th>
            <th className="p-2">Hank</th>
            <th className="p-2">Produced (kg)</th>
            <th className="p-2">Required (kg)</th>
            <th className="p-2">Status</th>
            <th className="p-2">Remarks</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{new Date(record.date).toLocaleDateString('en-GB')}</td>
              <td className="p-2">{record.section}</td>
              <td className="p-2">{record.machine}</td>
              <td className="p-2">{record.shift}</td>
              <td className="p-2">{record.count}</td>
              <td className="p-2">{record.hank}</td>
              <td className="p-2">{Number(record.production_kg || 0).toFixed(2)}</td>
              <td className="p-2">{Number(record.required_qty || 0).toFixed(2)}</td>
              <td className="p-2">{record.status}</td>
              <td className="p-2 text-gray-500 italic">{record.remarks || '—'}</td>
              <td className="p-2">
              <RecordActions record={record} onEdit={onEdit} onDelete={onDelete} />             </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={11} className="p-4 text-center text-gray-400">
                No production records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;