import React, { useState } from 'react';
import FibreTransfersTable from '../FibreTransfersTable';
import FibreTransferModal from '../FibreTransferModal';
import { FibreTransfer, CreateFibreTransfer } from '../../types/fibreTransfer';
import { Fiber } from '../../types/fiber';

interface FibreTransfersPanelProps {
  fibres: Fiber[];
  onSave: (data: CreateFibreTransfer | FibreTransfer) => void;
}

const FibreTransfersPanel: React.FC<FibreTransfersPanelProps> = ({ fibres, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferToEdit, setTransferToEdit] = useState<FibreTransfer | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setTransferToEdit(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Transfer
        </button>
      </div>

      <FibreTransfersTable
        onEdit={(transfer: React.SetStateAction<FibreTransfer | null>) => {
          setTransferToEdit(transfer);
          setIsModalOpen(true);
        }}
      />

      <FibreTransferModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTransferToEdit(null);
        }}
        onSave={onSave}
        fibres={fibres}
        initialData={transferToEdit}
      />
    </div>
  );
};

export default FibreTransfersPanel;