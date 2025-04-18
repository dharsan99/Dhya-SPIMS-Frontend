import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('📦 All Pending Fibre Entries:', data);
    console.log('📄 Showing Page:', page);
    console.log('🔢 Rows per Page:', rowsPerPage);
    console.log('🧾 Paginated Fibres:', paginated);
  }, [data, page, rowsPerPage]);

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
        rows={paginated.map((f) => {
          const balance = f.available - f.required;
          console.log(`🔍 Fibre ${f.fibre_code} → Required: ${f.required}, Available: ${f.available}, Balance: ${balance}`);

          return [
            f.fibre_name,
            f.fibre_code,
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${f.available < 0 ? 'bg-red-100 text-red-800' : ''}`}>
              {f.available.toFixed(2)} kg
            </span>,
            <span
              title={`Required: ${f.required.toFixed(2)} kg\nAvailable: ${f.available.toFixed(2)} kg\nBalance: ${balance.toFixed(2)} kg`}
              className="cursor-help"
            >
              {f.required.toFixed(2)} kg
            </span>,
            <span className="text-red-500 font-medium">
              {f.shortfall.toFixed(2)} kg
            </span>,
            f.category ?? 'NA',
          ];
        })}
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