import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

interface ExportDropdownProps {
  onExport: (format: 'xlsx' | 'pdf') => void;
  exportCurrentPageOnly: boolean;
  setExportCurrentPageOnly: (val: boolean) => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  exportCurrentPageOnly,
  setExportCurrentPageOnly
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow z-50 p-2 space-y-1">
          <div className="flex items-center px-2">
            <input
              type="checkbox"
              checked={exportCurrentPageOnly}
              onChange={(e) => setExportCurrentPageOnly(e.target.checked)}
              className="form-checkbox text-blue-600 mr-2"
            />
            <label className="text-xs">Export current page only</label>
          </div>
          <button
            onClick={() => {
              onExport('xlsx');
              setDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ml-4"
          >
            Export as XLSX
          </button>
          <button
            onClick={() => {
              onExport('pdf');
              setDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ml-4"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
