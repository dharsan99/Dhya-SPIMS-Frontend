import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HapticFeedback } from '../utils/hapticFeedback';

export type SwipeableColumn<T> = {
  key: keyof T | 'actions';
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  mobilePriority?: boolean; // Show on mobile card view
};

interface SwipeableTableProps<T> {
  data: T[];
  columns: SwipeableColumn<T>[];
  searchKeys?: (keyof T)[];
  itemsPerPage?: number;
  emptyMessage?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  getRowId: (row: T) => string;
}

const SWIPE_THRESHOLD = 100;

const SwipeableTable = <T extends object>({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 5,
  emptyMessage = 'No data found.',
  onEdit,
  onDelete,
  onView,
  getRowId,
}: SwipeableTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search && searchKeys.length) {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) =>
          String(item[key] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

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

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Mobile card view
  const MobileCardView = ({ row }: { row: T }) => {
    const dragX = useRef(0);
    const priorityColumns = columns.filter(col => col.mobilePriority !== false);

    return (
      <motion.div
        key={getRowId(row)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        drag={isMobile ? 'x' : false}
        dragConstraints={isMobile ? { left: -160, right: 160 } : undefined}
        dragElastic={0.2}
        onDrag={(_e, info) => {
          dragX.current = info.offset.x;
          if (Math.abs(info.offset.x) > 20) {
            HapticFeedback.swipe();
          }
        }}
        onDragEnd={(_e, info) => {
          if (!isMobile) return;
          if (info.offset.x < -SWIPE_THRESHOLD && onDelete) {
            HapticFeedback.delete();
            onDelete(row);
          } else if (info.offset.x > SWIPE_THRESHOLD && onEdit) {
            HapticFeedback.edit();
            onEdit(row);
          }
        }}
        style={isMobile ? {
          x: 0,
          background:
            dragX.current < -20
              ? 'linear-gradient(90deg, #fee2e2 60%, #fff 100%)'
              : dragX.current > 20
              ? 'linear-gradient(270deg, #fef9c3 60%, #fff 100%)'
              : undefined,
        } : undefined}
      >
        {/* Swipe Action Visuals */}
        {isMobile && (
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center pl-4" style={{ opacity: dragX.current > 20 ? Math.min(dragX.current / 80, 1) : 0 }}>
              <PencilIcon className="w-6 h-6 text-yellow-500" />
              <span className="ml-2 text-yellow-700 font-semibold">Edit</span>
            </div>
            <div className="flex items-center pr-4" style={{ opacity: dragX.current < -20 ? Math.min(-dragX.current / 80, 1) : 0 }}>
              <span className="mr-2 text-red-700 font-semibold">Delete</span>
              <TrashIcon className="w-6 h-6 text-red-500" />
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-4 relative z-20 bg-white dark:bg-gray-800">
          <div className="space-y-3">
            {priorityColumns.map((col) => (
              <div key={String(col.key)} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {col.label}:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {col.render ? col.render(row) : String(col.key === 'actions' ? '' : (row[col.key as keyof T] ?? ''))}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            {onView && (
              <button
                onClick={() => onView(row)}
                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="View Details"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(row)}
                className="p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row)}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
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

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-3">
          {paginated.length > 0 ? (
            paginated.map((row) => <MobileCardView key={getRowId(row)} row={row} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              {emptyMessage}
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
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
                paginated.map((row) => (
                  <tr key={getRowId(row)} className="border-t hover:bg-gray-50">
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
      )}

      {/* Pagination */}
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

export default SwipeableTable; 