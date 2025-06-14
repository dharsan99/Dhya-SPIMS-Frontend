import React from 'react';
import Select from 'react-select';
import useAuthStore from '../../hooks/auth';

interface FibersToolbarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;

  placeholder?: string;
  buttonText?: string;

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
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const categoryOptions = filterOptions.map((cat) => ({
    label: cat,
    value: cat,
  }));

  // Extract permission logic based on buttonText
  let canShowButton = false;

  if (buttonText.includes('Fiber')) {
    canShowButton = hasPermission('Fibres', 'Add Fibre');
  } else if (buttonText.includes('Stock')) {
    canShowButton = true;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearchChange(e.target.value);
        }}
        value={searchTerm}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-full lg:w-72"
      />
      <div className="flex flex-row items-center justify-between gap-2 w-full sm:w-full lg:w-auto">
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
        {canShowButton && (
          <button
            onClick={onAddClick}
            className="px-1 sm:px-4 py-2.5 sm:py-2.5 sm:py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs lg:text-sm"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FibersToolbar;
