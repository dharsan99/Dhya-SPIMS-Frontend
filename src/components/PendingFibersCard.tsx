import { useEffect, useState } from 'react';
import { PendingFiberEntry } from '../types/fiber';
import Pagination from './Pagination';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

interface PendingFibersCardProps {
  data: PendingFiberEntry[];
}

const PendingFibersCard = ({ data }: PendingFibersCardProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const totalItems = data.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginated = data.slice(startIndex, endIndex);

  useEffect(() => {
    console.log('📦 All Pending Fibre Entries:', data);
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg mb-8 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pending Fibres</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide">
              <th className="text-left px-2">Fibre</th>
              <th className="text-left px-2">Fibre Code</th>
              <th className="text-left px-2">Stock</th>
              <th className="text-left px-2">Required</th>
              <th className="text-left px-2">Shortfall</th>
              <th className="text-left px-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((f, index) => {
              const stockColor =
                f.available <= 0
                  ? 'bg-red-500 text-white'
                  : f.available < 20
                  ? 'bg-yellow-400 text-black'
                  : 'bg-green-500 text-white';

              return (
                <tr key={index} className="bg-gray-100 dark:bg-gray-800 rounded">
                  <td className="px-2 py-2 font-medium">{f.fibre_name}</td>
                  <td className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400">
                    {f.fibre_code}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${stockColor}`}
                    >
                      {f.available.toFixed(2)} kg
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      {f.required.toFixed(2)} kg
                      <InformationCircleIcon
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                        title={`Required: ${f.required.toFixed(
                          2
                        )}kg | Available: ${f.available.toFixed(2)}kg | Balance: ${(
                          f.available - f.required
                        ).toFixed(2)}kg`}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 text-red-500 font-semibold">
                    {f.shortfall.toFixed(2)} kg
                  </td>
                  <td className="px-2 py-2">{f.category || 'NA'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={totalItems}
        options={[3, 5, 10]}
      />
    </div>
  );
};

export default PendingFibersCard;