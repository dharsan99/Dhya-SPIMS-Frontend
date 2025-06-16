import React from 'react';
import { TailwindDialog } from './Dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <TailwindDialog isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="mb-4 text-gray-700 dark:text-gray-200">{description}</div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </TailwindDialog>
  );
};

export default ConfirmDialog; 