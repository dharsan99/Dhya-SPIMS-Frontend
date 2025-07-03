import { useQuery } from '@tanstack/react-query';
import { getAllFibreTransfers } from '../api/fibreTransfers';
import { FibreTransfer } from '../types/fibreTransfer';

interface FibreTransfersTableProps {
  onEdit?: (transfer: FibreTransfer) => void;
}

const FibreTransfersTable: React.FC<FibreTransfersTableProps> = ({ onEdit }) => {
  const { data: transfers = [], isLoading, error } = useQuery<FibreTransfer[]>({
    queryKey: ['fibreTransfers'],
    queryFn: getAllFibreTransfers,
  });

  if (isLoading) return <p className="text-gray-600 dark:text-gray-300">Loading transfers...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">Failed to load transfers.</p>;

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded shadow border border-gray-200 dark:border-gray-700 mt-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="p-3 border-b">Fibre</th>
            <th className="p-3 border-b">Supplier</th>
            <th className="p-3 border-b text-right">Sent (kg)</th>
            <th className="p-3 border-b">Sent Date</th>
            <th className="p-3 border-b text-right">Returned (kg)</th>
            <th className="p-3 border-b">Return Date</th>
            <th className="p-3 border-b">Notes</th>
            {onEdit && <th className="p-3 border-b text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="p-3">{t.fibre?.fibre_name || '-'}</td>
              <td className="p-3">{t.supplier?.name || '-'}</td>
              <td className="p-3 text-right">{Number(t.sent_kg).toFixed(2)}</td>
              <td className="p-3">{new Date(t.sent_date).toLocaleDateString()}</td>
              <td className="p-3 text-right">{t.returned_kg ? Number(t.returned_kg).toFixed(2) : '-'}</td>
              <td className="p-3">{t.return_date ? new Date(t.return_date).toLocaleDateString() : '-'}</td>
              <td className="p-3">{t.notes || '-'}</td>
              {onEdit && (
                <td className="p-3 text-center">
                  <button
                    onClick={() => onEdit(t)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    ✏️ Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FibreTransfersTable;