// src/components/Fibers/FibreActionsPanel.tsx

import React from 'react';
import { Fiber } from '../../types/fiber';

interface FibreActionsPanelProps {
  fibre: Fiber;
  onEdit: (fiber: Fiber) => void;
  onStockUpdate: (fiber: Fiber) => void;
  onDelete: (fiberId: string) => void;
}

const FibreActionsPanel: React.FC<FibreActionsPanelProps> = ({
  fibre,
  onEdit,
  onStockUpdate,
  onDelete,
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onEdit(fibre)}
        className="px-3 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow-sm"
        title="Edit Fibre"
      >
        Edit
      </button>
      <button
        onClick={() => onStockUpdate(fibre)}
        className="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded shadow-sm"
        title="Update Stock"
      >
        Stock
      </button>
      <button
        onClick={() => onDelete(fibre.id)}
        className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded shadow-sm"
        title="Delete Fibre"
      >
        Delete
      </button>
    </div>
  );
};

export default FibreActionsPanel;