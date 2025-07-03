import { useState } from 'react';
import { PendingFiberEntry } from '../types/fiber';
import Pagination from './Pagination';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

// Custom Tooltip component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <span className="relative group">
    {children}
    <span className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none shadow-lg">
      {text}
    </span>
  </span>
);

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

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-lg mb-8 transition-all w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </span>
          Pending Fibres
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalItems === 0 ? '0' : `${startIndex + 1}–${Math.min(endIndex, totalItems)} of ${totalItems}`}
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
          <img src="/empty-fibers.svg" alt="No Pending Fibres" className="w-24 h-24 mb-4 opacity-70" onError={e => (e.currentTarget.style.display = 'none')} />
          <span className="text-lg font-semibold">No pending fibres</span>
          <span className="text-sm mt-1">All fibres are sufficiently stocked! </span>
        </div>
      ) : (
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
                <th className="text-left px-2">Actions</th>
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
                const shortfallColor = f.shortfall > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
                const categoryColor = f.category && f.category !== 'NA' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full';
                return (
                  <tr key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition">
                    <td className="px-2 py-2 font-medium max-w-[120px] truncate" title={f.fibre_name}>{f.fibre_name}</td>
                    <td className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400">{f.fibre_code}</td>
                    <td className="px-2 py-2">
                      <Tooltip text={`Available: ${f.available.toFixed(2)}kg`}>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${stockColor}`} aria-label={`Stock: ${f.available.toFixed(2)} kg`}>
                          {f.available.toFixed(2)} kg
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <Tooltip text={`Required: ${f.required.toFixed(2)}kg | Available: ${f.available.toFixed(2)}kg | Balance: ${(f.available - f.required).toFixed(2)}kg`}>
                          <span className="font-semibold text-blue-700 dark:text-blue-300">{f.required.toFixed(2)} kg</span>
                        </Tooltip>
                        <Tooltip text="Details">
                          <InformationCircleIcon
                            className="w-4 h-4 text-blue-500 cursor-pointer"
                            aria-label="More info"
                          />
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${shortfallColor}`} aria-label={`Shortfall: ${f.shortfall.toFixed(2)} kg`}>
                        {f.shortfall.toFixed(2)} kg
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span className={categoryColor}>{f.category || 'NA'}</span>
                    </td>
                    <td className="px-2 py-2">
                      {/* Placeholder for quick actions */}
                      <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition" aria-label="View Fibre Details">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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