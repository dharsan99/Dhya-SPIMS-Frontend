import React from 'react';
import Select from 'react-select';

interface FibersToolbarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;

  placeholder?: string; // Optional custom placeholder
  buttonText?: string;  // Optional custom button label

   filter?: string;
   setFilter?: React.Dispatch<React.SetStateAction<string>>;
   filterOptions?: string[];
  }

const FibersToolbar: React.FC<FibersToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  onSearchChange,
  onAddClick,
  placeholder = 'Search fibres...',
  buttonText = '+ Add Fiber',
  filter,
  setFilter,
  filterOptions = [],
}) => {

  const categoryOptions = filterOptions.map((cat) => ({
    label: cat,
    value: cat,
  }));
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearchChange(e.target.value);
        }}
        value={searchTerm}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
      />
      <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
        {setFilter && (
          <div className="min-w-[150px]">
            <Select
              options={[{ label: 'All Categories', value: '' }, ...categoryOptions]}
              value={
                filter
                  ? categoryOptions.find((o) => o.value === filter)
                  : { label: 'All Categories', value: '' }
              }
              onChange={(selected) => setFilter(selected?.value || '')}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable
              placeholder="Filter by category"
            />
          </div>
        )}
        <button
          onClick={onAddClick}
          className="px-1 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs lg:text-sm"
        >
          {buttonText}
        </button>
      </div>

    </div>
  );
};


export default FibersToolbar;
