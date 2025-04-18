import React from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { ProductionRecord } from '../../../types/production';

export interface RecordActionsProps {
  record: ProductionRecord;
  onEdit: (record: ProductionRecord) => void;
  onDelete: (id: string) => void;
  onPreview?: (record: ProductionRecord) => void;
}

const RecordActions: React.FC<RecordActionsProps> = ({
  record,
  onEdit,
  onDelete,
  onPreview,
}) => {
  return (
    <div className="flex items-center gap-3">
      {onPreview && (
        <button
          onClick={() => onPreview(record)}
          className="text-blue-600 hover:text-blue-800"
          title="Preview"
        >
          <FiEye size={16} />
        </button>
      )}
      <button
        onClick={() => onEdit(record)}
        className="text-yellow-600 hover:text-yellow-800"
        title="Edit"
      >
        <FiEdit size={16} />
      </button>
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this record?')) {
            onDelete(record.id);
          }
        }}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
};

export default RecordActions;