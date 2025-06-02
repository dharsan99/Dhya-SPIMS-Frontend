import React, { useState } from 'react';
import format from 'date-fns/format';
import {
  addDays,
  addWeeks,
  startOfWeek,
  startOfMonth,
  addMonths as addMonthsFn,
} from 'date-fns';
import { AttendanceFiltersProps } from './AttendanceTypes';
import { Download } from 'lucide-react';
import AttendanceExportModal from './AttendanceExportModal';

const generateWeekRanges = () => {
  const today = new Date();
  const weeks = [];
  for (let i = -6; i <= 6; i++) {
    const start = startOfWeek(addWeeks(today, i), { weekStartsOn: 1 });
    const end = addDays(start, 6);
    weeks.push({
      label: `${format(start, 'dd MMM')} - ${format(end, 'dd MMM')}`,
      value: format(start, 'yyyy-MM-dd'),
    });
  }
  return weeks;
};

const generateMonthRanges = () => {
  const today = new Date();
  const months = [];
  for (let i = -6; i <= 6; i++) {
    const start = startOfMonth(addMonthsFn(today, i));
    months.push({
      label: format(start, 'MMMM yyyy'),
      value: format(start, 'yyyy-MM-dd'),
    });
  }
  return months;
};

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  date,
  department,
  departments,
  onDateChange,
  onDepartmentChange,
  searchQuery,
  onSearchChange,
  rangeMode,
  employees,
  dates,
}) => {
  const [exportType, setExportType] = useState<'xlsx' | 'pdf' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExport = (type: 'xlsx' | 'pdf') => {
    setExportType(type);
    setShowModal(true);
    setDropdownOpen(false);
  };


  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex gap-4 flex-wrap">
        {/* 📅 Date Selector */}
        {rangeMode === 'day' ? (
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          />
        ) : rangeMode === 'week' ? (
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          >
            {generateWeekRanges().map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        ) : (
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          >
            {generateMonthRanges().map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        )}

        {/* 🏢 Department Selector */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search employee..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border px-3 py-1 rounded dark:bg-gray-800 dark:text-white w-64"
        />
      </div>

      {/* 📤 Export Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow z-50">
            <button
              onClick={() => handleExport('xlsx')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Export as XLSX
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Export as PDF
            </button>
          </div>
        )}
      </div>

      {/* 📦 Export Modal */}
      {showModal && exportType && (
        <AttendanceExportModal
          isOpen={showModal}
          exportType={exportType}
          onClose={() => {
            setShowModal(false);
            setExportType(null);
          }}
          employees={employees}
          dates={dates}
            departmentName={department}
  dateRange={date}         // ✅ must pass
  rangeMode={rangeMode}    // ✅ must pass
        />
      )}
    </div>
  );
};

export default AttendanceFilters;