import { JSX, useMemo, useState } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => JSX.Element | string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchKeys?: (keyof T)[];
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  itemsPerPage = 5,
  searchKeys = [],
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, search, searchKeys, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginated = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded shadow-sm w-full sm:w-64"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className={`p-3 border ${col.sortable ? 'cursor-pointer' : ''}`}
                  onClick={() => col.sortable && toggleSort(col.accessor)}
                >
                  {col.header}{' '}
                  {col.sortable && sortKey === col.accessor && (sortOrder === 'asc' ? '⬆️' : '⬇️')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="p-3">
                    {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}