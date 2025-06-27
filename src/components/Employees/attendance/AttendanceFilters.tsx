import React, { useMemo, useState } from 'react';
import { AttendanceFiltersProps } from './AttendanceTypes';
import AttendanceExportModal from './AttendanceExportModal';
import { generateMonthRanges, generateWeekRanges } from '@/components/Employees/attendance/utils/attendence';
import AttendanceFiltersForm from './AttendanceFiltersForm';
import ExportDropdown from './ExportDropown';


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

  const weekRanges = useMemo(() => generateWeekRanges(), []);
  const monthRanges = useMemo(() => generateMonthRanges(), []);

  const handleExport = (type: 'xlsx' | 'pdf') => {
    setExportType(type);
    setShowModal(true);
    setDropdownOpen(false);
  };


  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
      <AttendanceFiltersForm
          date={date}
          department={department}
          departments={departments}
          searchQuery={searchQuery}
          rangeMode={rangeMode}
          onDateChange={onDateChange}
          onDepartmentChange={onDepartmentChange}
          onSearchChange={onSearchChange}
          weekRanges={weekRanges}
          monthRanges={monthRanges}
        />

      {/* 📤 Export Dropdown */}
     <ExportDropdown
        isOpen={dropdownOpen}
        toggleDropdown={() => setDropdownOpen(prev => !prev)}
        onExport={handleExport}
      />

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