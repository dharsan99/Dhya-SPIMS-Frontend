// src/components/PendingSuppliersCard.tsx

import { FibreTransfer } from '../types/fibreTransfer';

interface Props {
  data: FibreTransfer[];
  onUpdate: (id: string) => void;
}

const PendingSuppliersCard = ({ data, onUpdate }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-4">
        Pending Supplier Returns
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No pending transfers</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {data
            .filter((t) => t.supplier && t.fibre)
            .map((t) => (
              <li key={t.id} className="flex justify-between items-center">
                <div>
                  <strong>{t.supplier!.name}</strong> – {t.fibre!.fibre_name} ({t.sent_kg}kg sent)
                </div>
                <button
                  onClick={() => onUpdate(t.id)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark Received
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PendingSuppliersCard;