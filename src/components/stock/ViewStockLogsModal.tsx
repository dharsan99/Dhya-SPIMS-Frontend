import React from 'react';
import Modal from '../Modal'; // Adjust import path as needed

export interface StockLogEntry {
  date: string;
  action: string;
  details: string;
}

interface ViewLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: StockLogEntry[];
}

const ViewLogsModal: React.FC<ViewLogsModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-5">Stock Update Logs</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">No logs available for this item.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {logs.map((log, idx) => (
            <li key={idx} className="border-b pb-2">
              <div className="font-medium text-gray-800 dark:text-gray-200">{new Date(log.date).toLocaleString()}</div>
              <div className="text-gray-600 dark:text-gray-300">
                {log.action} — {log.details}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 text-right">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewLogsModal;
