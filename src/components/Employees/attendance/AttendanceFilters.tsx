import React, { useMemo, useState } from 'react';
import { AttendanceFiltersProps } from './AttendanceTypes';
import AttendanceExportModal from './AttendanceExportModal';
import { generateMonthRanges, generateWeekRanges } from '@/components/Employees/attendance/utils/attendence';
import AttendanceFiltersForm from './AttendanceFiltersForm';
import ExportDropdown from './ExportDropown';
import AddAttendanceModal from './AddAttendanceModal';


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
  const [addModalOpen, setAddModalOpen] = useState(false);


  const weekRanges = useMemo(() => generateWeekRanges(new Date(date)), [date]);
const monthRanges = useMemo(() => generateMonthRanges(new Date(date)), [date]);

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
<div className='flex flex-col md:flex-row gap-2 items-center'>
<button
  onClick={() => setAddModalOpen(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Add Attendance
</button>

      {/* 📤 Export Dropdown */}
     <ExportDropdown
        isOpen={dropdownOpen}
        toggleDropdown={() => setDropdownOpen(prev => !prev)}
        onExport={handleExport}
      />
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

{addModalOpen && (
  <AddAttendanceModal
    onClose={() => setAddModalOpen(false)}
    defaultDate={date}
  />
)}
    </div>
  );
};

export default AttendanceFilters;