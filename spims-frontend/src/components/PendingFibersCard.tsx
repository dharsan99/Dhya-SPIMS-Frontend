import { useState } from 'react';
import Table from './Table';
import Pagination from './Pagination';
import { PendingFiberEntry } from '../types/fiber';

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
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pending Fibres</h3>
        <div className="text-sm text-gray-500">
          {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
      </div>

      <Table
        headers={['Fibre Name', 'Fibre Code', 'Available Stock', 'Required Qty', 'Shortfall', 'Category']}
        rows={paginated.map((f) => [
          f.fibre_name,
          f.fibre_code,
          `${f.available.toFixed(2)} kg`,
          `${f.required.toFixed(2)} kg`,
          `${f.shortfall.toFixed(2)} kg`,
          f.category ?? 'NA',
        ])}
      />

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