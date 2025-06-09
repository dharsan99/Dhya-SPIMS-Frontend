import React from 'react';

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

  return (
    <div className="flex flex-col lg:flex-row gap-4">
        <div className='flex flex-row gap-4'>
      {renderDateSelector()}
     
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