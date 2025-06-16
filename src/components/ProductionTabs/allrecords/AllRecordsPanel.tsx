// src/components/ProductionTabs/allrecords/AllRecordsPanel.tsx

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProduction } from '../../../api/production';
import { ProductionRecord } from '../../../types/production';
import Loader from '../../Loader';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';
import RecordTable from './RecordTable';
import KPISummary from './KPISummary';
import PaginationControls from './PaginationControls';
import BulkActions from './BulkActions';
import ExportControls from './ExportControls';
import {
  applyFilters,
  applySorting,
  applyPagination,
  applySearch,
  calculateKPI,
} from './utils';
import { FilterConfig, SortConfig } from './types';

const AllRecordsPanel = () => {
  const { data: allRecords = [], isLoading } = useQuery<ProductionRecord[]>({
    queryKey: ['productions'],
    queryFn: getProduction,
  });

  const [filters, setFilters] = useState<FilterConfig>({});
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Step-by-step transformation
  const searched = useMemo(
    () => applySearch(allRecords, search),
    [allRecords, search]
  );

  const filtered = useMemo(
    () => applyFilters(searched, filters),
    [searched, filters]
  );

  const sorted = useMemo(
    () => applySorting(filtered, sortConfig),
    [filtered, sortConfig]
  );

  const paginated = useMemo(
    () => applyPagination(sorted, currentPage, pageSize),
    [sorted, currentPage, pageSize]
  );

  const kpis = useMemo(() => calculateKPI(filtered), [filtered]);

  const handleEdit = () => {
    // Open modal or navigate
  };

  const handleDelete = () => {
    // Confirm and call delete API
  };

  const handleBulkAction = (_action: string, _selectedIds: string[]) => {
    // Handle delete/export/finalize
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* 🔍 Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel
  filters={filters}
  onChange={setFilters}
  onClear={() => setFilters({})}
/>
      </div>

      {/* 📊 KPI Summary */}
      <KPISummary
        totalRecords={filtered.length}
        totalProduction={kpis.totalProduction}
        totalRequired={kpis.totalRequired}
        avgEfficiency={kpis.avgEfficiency}
      />

      {/* 🧩 Bulk Actions */}
      <BulkActions records={paginated} onAction={handleBulkAction} />

      {/* 🧾 Table */}
      <RecordTable
        records={paginated}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      {/* 📄 Pagination + Export */}
      <div className="flex justify-between items-center">
      <PaginationControls
  currentPage={currentPage}
  totalPages={Math.ceil(filtered.length / pageSize)}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
        <ExportControls
          data={filtered}
          fileName="production-records"
        />
      </div>
    </div>
  );
};

export default AllRecordsPanel;