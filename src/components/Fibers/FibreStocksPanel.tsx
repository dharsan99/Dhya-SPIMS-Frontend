import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import FibersToolbar from './FibersToolbar';
import StockTable from '../stock/FiberStockTable';
import { mockStockData } from '@/mock/stockData';
import Pagination from '../Pagination';

const FiberStocksPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
    setPage(1); // reset page when searching
  }, 300);

  const handleAddStock = () => {
    console.log('Add Stock clicked');
  };

  const filteredStock = useMemo(() => {
    return mockStockData.filter((item) =>
      item.fibre_name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginatedStock = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStock.slice(start, end);
  }, [filteredStock, page, rowsPerPage]);

  return (
    <div className="p-4 text-gray-700 dark:text-gray-200">
      <FibersToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={handleAddStock}
        placeholder="Search stock..."
        buttonText="+ Add Stock"
      />

      <StockTable stock={paginatedStock} />

      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={filteredStock.length}
        options={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default FiberStocksPanel;