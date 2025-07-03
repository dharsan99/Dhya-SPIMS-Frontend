import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { returned_kg: number; return_date: string; remarks?: string }) => void;
  initialReturnedKg?: number;
}

const ReceiveTransferModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialReturnedKg = 0,
}) => {
  const [returnedKg, setReturnedKg] = useState(initialReturnedKg.toString());
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReturnDate(new Date().toISOString().split('T')[0]); // yyyy-mm-dd
      setReturnedKg(initialReturnedKg.toString());
      setRemarks('');
    }
  }, [isOpen, initialReturnedKg]);

  const handleSubmit = () => {
    const returned_kg = parseFloat(returnedKg);
    if (isNaN(returned_kg) || returned_kg <= 0) {
      alert('Please enter a valid return quantity');
      return;
    }

    onSubmit({
      returned_kg,
      return_date: returnDate,
      remarks: remarks || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-300">
          Mark as Received
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Returned Quantity (kg)</label>
          <input
            type="number"
            min={0}
            value={returnedKg}
            onChange={(e) => setReturnedKg(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveTransferModal;