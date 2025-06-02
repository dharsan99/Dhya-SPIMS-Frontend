import React from 'react';

interface FibersToolbarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  onSearchChange: (value: string) => void;
  onAddClick: () => void; // ✅ Add this line
}

const FibersToolbar: React.FC<FibersToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <input
        type="text"
        placeholder="Search fibres..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearchChange(e.target.value);
        }}
        value={searchTerm}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
      />
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Add Fiber
      </button>
    </div>
  );
};

export default FibersToolbar;
