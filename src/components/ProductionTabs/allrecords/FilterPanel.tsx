import React from 'react';
import { FilterConfig } from './types';

type FilterState = FilterConfig;

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterConfig) => void;
  onClear: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onClear }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
      
        const updatedFilters = {
          ...filters,
          [name]: name === 'status'
            ? (value === 'draft' || value === 'final' ? value : undefined)
            : value,
        };
      
        onChange(updatedFilters as typeof filters); // ✅ safely cast as FilterConfig
      };
  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-blue-700 font-semibold text-lg">🔍 Filter Records</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
          placeholder="To Date"
        />
        <input
          type="text"
          name="machine"
          value={filters.machine || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
          placeholder="Machine"
        />
        <input
          type="text"
          name="section"
          value={filters.section || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
          placeholder="Section"
        />
        <select
          name="shift"
          value={filters.shift || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All Shifts</option>
          <option value="1">Shift 1</option>
          <option value="2">Shift 2</option>
          <option value="3">Shift 3</option>
        </select>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
        </select>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClear}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;