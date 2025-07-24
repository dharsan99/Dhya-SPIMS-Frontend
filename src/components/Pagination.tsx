import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  setPage: (p: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (r: number) => void;
  total: number;
  options?: number[];
  isLoading?: boolean;
}

const Pagination = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
  options = [5, 10, 20, 50],
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 text-sm text-gray-700 dark:text-gray-300">
      {/* Rows Per Page */}
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1); // reset to first page
          }}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((p, i) =>
  typeof p === 'string' ? (
    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
  ) : (
    <button
      key={`page-${p}`}
      onClick={() => setPage(p)}
      className={`px-3 py-1 rounded-full font-medium ${
        p === page
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {p}
    </button>
  )
)}

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;