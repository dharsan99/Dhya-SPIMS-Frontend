// src/components/ProductionTabs/allrecords/SearchBar.tsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center border rounded px-3 py-2 bg-white shadow-sm w-full sm:max-w-xs">
      <FiSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        className="w-full outline-none text-sm text-gray-700"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;