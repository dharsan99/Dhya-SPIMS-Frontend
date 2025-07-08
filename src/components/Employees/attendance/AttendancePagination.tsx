import React from 'react';

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AttendancePagination: React.FC<Props> = ({
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageOptions = [5, 10, 20, 50, 100];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-gray-700 mt-4">
      {/* Left Info */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{total}</span> employees
      </div>

      {/* Right Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            {pageOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
         
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
          >
            Next
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default AttendancePagination;