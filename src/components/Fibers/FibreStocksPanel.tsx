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
import StockSummaryCard from '../stock/StockSummaryCard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExportDropdown from '../stock/ExportDropdown';
import ViewLogsModal, { StockLogEntry } from '../stock/ViewStockLogsModal';
import useAuthStore from '@/hooks/auth';

const FiberStocksPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [stockData, setStockData] = useState<StockItem[]>(initialMockData);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [exportCurrentPageOnly, setExportCurrentPageOnly] = useState(false);
  const [stockLogs, setStockLogs] = useState<Record<string, StockLogEntry[]>>(() => {
  const logs: Record<string, StockLogEntry[]> = {};
  initialMockData.forEach(item => {
    logs[item.id] = [
      {
        date: new Date(item.created_at).toISOString(),
        action: 'Created',
        details: `Initial stock: ${item.stock_kg}kg, threshold: ${item.threshold_kg}kg`,
      }
    ];
  });
  return logs;
});
  const [viewingLogsId, setViewingLogsId] = useState<string | null>(null);

  const currentUser = useAuthStore.getState().user

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
      created_at: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0], // format: YYYY-MM-DD
    };
    setStockData(prev => [newStock, ...prev]);
    setStockLogs(prev => ({
  ...prev,
  [newStock.id]: [
    {
      date: new Date().toISOString(),
      action: 'Added',
      details: `Initial stock: ${newStock.stock_kg}kg, threshold: ${newStock.threshold_kg}kg`,
    },
  ],
}));
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
  setStockLogs(prev => ({
  ...prev,
  [updatedItem.id]: [
    ...(prev[updatedItem.id] || []),
    {
      date: new Date().toISOString(),
      action: 'Stock updated',
      details: `Stock: ${updatedItem.stock_kg}kg, Threshold: ${updatedItem.threshold_kg}kg`,
    },
  ],
}));
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


 const handleExport = (format: 'xlsx' | 'pdf') => {
  const exportData = (exportCurrentPageOnly ? paginatedStock : filteredStock).map(item => ({
    Fibre: item.fibre_name,
    Category: item.category,
    'Stock (kg)': item.stock_kg,
    'Threshold (kg)': item.threshold_kg,
    'Last Updated': item.last_updated,
  }));

  if (format === 'xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fiber Stock');
    XLSX.writeFile(workbook, 'fiber-stock.xlsx');
  }

  if (format === 'pdf') {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Fibre', 'Category', 'Stock (kg)', 'Threshold (kg)', 'Last Updated']],
      body: exportData.map(item => Object.values(item)),
    });
    doc.save('fiber-stock.pdf');
  }
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

      <StockSummaryCard stock={stockData} />
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

    <div className="flex justify-end lg:justify-end mb-4">
      <ExportDropdown
        onExport={handleExport}
        exportCurrentPageOnly={exportCurrentPageOnly}
        setExportCurrentPageOnly={setExportCurrentPageOnly}
      />
    </div>



      <StockTable
        stock={paginatedStock}
        onEditClick={setEditingStock}
        onViewLogsClick={(id) => setViewingLogsId(id)}
        currentUser={currentUser ? { role: currentUser.role.name } : null}
      />
      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={filteredStock.length}
        options={[5, 10, 20, 50]}
      />

      <AddFiberStockModal
        key={showModal ? 'open' : 'closed'} // 👈 this resets the modal when closed
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

      {viewingLogsId && (
        <ViewLogsModal
          isOpen={!!viewingLogsId}
          onClose={() => setViewingLogsId(null)}
          logs={stockLogs[viewingLogsId] || []}
        />
      )}

      
    </div>
  );
};

export default FiberStocksPanel;