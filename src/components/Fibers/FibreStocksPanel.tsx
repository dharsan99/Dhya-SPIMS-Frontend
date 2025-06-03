import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import FibersToolbar from './FibersToolbar';
import StockTable from '../stock/FiberStockTable';
import Pagination from '../Pagination';
import AddFiberStockModal from '../stock/AddFiberStockModal';
import { StockItem } from '@/types/stock';
import { v4 as uuidv4 } from 'uuid';
import { mockStockData as initialMockData } from '@/mock/stockData';
import EditFiberStockModal from '../stock/EditFiberStockModal';
import toast from 'react-hot-toast';

const FiberStocksPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [stockData, setStockData] = useState<StockItem[]>(initialMockData);
  const [categoryFilter, setCategoryFilter] = useState('');


  const categories = useMemo(() => {
    const set = new Set<string>();
    initialMockData.forEach(item => set.add(item.category));
    return Array.from(set);
  }, []);

  const handleModalSubmit = (data: {
    fibre_name: string;
    category: string;
    stock_kg: number;
    threshold_kg: number;
  }) => {
    const newStock: StockItem = {
      id: uuidv4(),
      fibre_name: data.fibre_name,
      category: data.category,
      stock_kg: data.stock_kg,
      threshold_kg: data.threshold_kg,
      last_updated: new Date().toISOString().split('T')[0], // format: YYYY-MM-DD
    };
    setStockData(prev => [newStock, ...prev]);
    setShowModal(false);
    toast.success('Stock added successfully!', {
      style: {
        background: '#22c55e', // Tailwind green-500
        color: 'white',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#22c55e',
      },
    })
  };

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
    setPage(1); // reset page when searching
  }, 300);


  const handleAddStock = () => {
     setShowModal(true);
  };

  const handleUpdateStock = (updatedItem: StockItem) => {
  setStockData(prev =>
    prev.map(item => (item.id === updatedItem.id ? updatedItem : item))
  );
  setEditingStock(null); // close modal
  toast.success('Stock updated successfully!', {
  style: {
    background: '#22c55e', // Tailwind green-500
    color: 'white',
  },
  iconTheme: {
    primary: 'white',
    secondary: '#22c55e',
  },
});
};

   const filteredStock = useMemo(() => {
  return stockData.filter((item) => {
    const matchesSearch =
      item.fibre_name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      !categoryFilter || item.category === categoryFilter;

    return matchesSearch && matchesFilter;
  });
}, [search, categoryFilter, stockData]);


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
      filter={categoryFilter}
      setFilter={setCategoryFilter}
      filterOptions={categories}
    />

      <StockTable stock={paginatedStock} onEditClick={setEditingStock} />

      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={filteredStock.length}
        options={[5, 10, 20, 50]}
      />

      <AddFiberStockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        categories={categories}
      />

      {editingStock && (
        <EditFiberStockModal
          item={editingStock}
          onClose={() => setEditingStock(null)}
          onUpdate={handleUpdateStock}
          categories={categories}
        />
      )}
    </div>
  );
};

export default FiberStocksPanel;