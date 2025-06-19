import React, { useMemo, useState } from 'react';

export type Column<T> = {
  key: keyof T | 'actions'; // Allow special 'actions' key
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

interface AdvancedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

const AdvancedTable = <T extends object>({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 5,
  emptyMessage = 'No data found.',
}: AdvancedTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filter + Sort
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (search && searchKeys.length) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) =>
          String(item[key] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    // Sort logic
    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, searchKeys, sortKey, sortOrder]);

  // 📄 Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const paged = filteredData.slice(start, start + itemsPerPage);
    return paged;
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 🔁 Sorting handler
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded shadow-sm w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table Block */}
      <div className="overflow-x-auto border rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="p-3 border cursor-pointer select-none"
                  onClick={() => {
                    if (col.sortable && typeof col.key !== 'string') {
                      handleSort(col.key);
                    }
                  }}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (sortOrder === 'asc' ? ' ⬆️' : ' ⬇️')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-3 border">
                      {col.render
                        ? col.render(row)
                        : typeof col.key !== 'string'
                        ? String(row[col.key] ?? '')
                        : ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedTable;