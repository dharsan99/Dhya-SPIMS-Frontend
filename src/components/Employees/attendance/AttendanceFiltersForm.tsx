import React from 'react';
import Select from 'react-select';

interface WeekOrMonthRange {
  label: string;
  value: string;
}

interface AttendanceFiltersFormProps {
  date: string;
  department: string;
  departments: string[];
  searchQuery: string;
  rangeMode: 'day' | 'week' | 'month';
  onDateChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  weekRanges: WeekOrMonthRange[];
  monthRanges: WeekOrMonthRange[];
}

const AttendanceFiltersForm: React.FC<AttendanceFiltersFormProps> = ({
  date,
  department,
  departments,
  searchQuery,
  rangeMode,
  onDateChange,
  onDepartmentChange,
  onSearchChange,
  weekRanges,
  monthRanges,
}) => {

  console.log('Selected date:', date);
console.log('Month ranges:', monthRanges);
  const renderDateSelector = () => {
    switch (rangeMode) {
      case 'day':
        return (
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          />
        );
      case 'week':
        return (
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          >
            {weekRanges.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        );
      case 'month':
        return (
          <select
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
          >
            {monthRanges.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

   const departmentOptions = [
    { label: 'All Departments', value: '' },
    ...departments.map((dept) => ({ label: dept, value: dept })),
  ];

  const selectedDepartment = departmentOptions.find(opt => opt.value === department);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
        <div className='flex flex-row gap-4'>
      {renderDateSelector()}
     
      <div className="min-w-[200px]">
          <Select
            options={departmentOptions}
            value={selectedDepartment}
            onChange={(selectedOption) => onDepartmentChange(selectedOption?.value || '')}
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Search employee..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-3 py-1 rounded dark:bg-gray-800 dark:text-white w-full lg:w-54"
      />
    </div>
  );
};

export default AttendanceFiltersForm;