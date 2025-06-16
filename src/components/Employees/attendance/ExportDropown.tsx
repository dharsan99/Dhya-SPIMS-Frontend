import React from 'react';
import { Download } from 'lucide-react';

interface ExportDropdownProps {
  onExport: (type: 'xlsx' | 'pdf') => void;
  isOpen: boolean;
  toggleDropdown: () => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, isOpen, toggleDropdown }) => {
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow z-50">
          <button
            onClick={() => onExport('xlsx')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export as XLSX
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;