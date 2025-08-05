import React, { useState, useEffect, useMemo } from 'react';
import { Buyer } from '../../types/buyer';
import Pagination from '../Pagination';
import SwipeableTable, { SwipeableColumn } from '../SwipeableTable';
import { useMediaQuery } from 'react-responsive';

interface BuyersTableProps {
  buyers: Buyer[];
  onEdit: (buyer: Buyer) => void;
  onDelete: (id: string) => void;
}

const BuyersTable: React.FC<BuyersTableProps> = ({ buyers, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    setPage(1);
  }, [buyers.length]);

  const paginatedBuyers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return buyers.slice(start, start + rowsPerPage);
  }, [buyers, page, rowsPerPage]);

  // Define columns for SwipeableTable
  const columns: SwipeableColumn<Buyer>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      mobilePriority: true,
      render: (buyer) => (
        <span className="font-medium text-blue-700 dark:text-blue-400">
          {buyer.name}
        </span>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      mobilePriority: true,
      render: (buyer) => buyer.contact || <span className="italic text-gray-400">—</span>,
    },
    {
      key: 'email',
      label: 'Email',
      mobilePriority: true,
      render: (buyer) => buyer.email || <span className="italic text-gray-400">—</span>,
    },
    {
      key: 'address',
      label: 'Address',
      mobilePriority: false,
      render: (buyer) => buyer.address || <span className="italic text-gray-400">—</span>,
    },
  ];

  // Use SwipeableTable for mobile, regular table for desktop
  if (isMobile) {
    return (
      <div className="space-y-4">
        <SwipeableTable
          data={paginatedBuyers}
          columns={columns}
          searchKeys={['name', 'contact', 'email']}
          itemsPerPage={rowsPerPage}
          emptyMessage="No buyers found."
          onEdit={onEdit}
          onDelete={(buyer) => onDelete(buyer.id)}
          getRowId={(buyer) => buyer.id}
        />
        
        {buyers.length > rowsPerPage && (
          <Pagination
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            total={buyers.length}
            options={[5, 10, 20, 50]}
          />
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedBuyers.length > 0 ? (
              paginatedBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-2 font-medium text-blue-700 dark:text-blue-400">{buyer.name}</td>
                  <td className="px-4 py-2">
                    {buyer.contact || <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    {buyer.email || <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    {buyer.address || <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(buyer)}
                        className="px-3 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(buyer.id)}
                        className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 italic dark:text-gray-400"
                >
                  No buyers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {buyers.length > rowsPerPage && (
        <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={buyers.length}
          options={[5, 10, 20, 50]}
        />
      )}
    </div>
  );
};

export default BuyersTable;