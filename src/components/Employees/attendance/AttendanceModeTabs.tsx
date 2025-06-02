import React from 'react';

export type AttendanceViewMode = 'edit' | 'view';
export type AttendanceRangeMode = 'day' | 'week' | 'month';

interface AttendanceModeTabsProps {
  mode: AttendanceViewMode;
  onModeChange: (mode: AttendanceViewMode) => void;
  range: AttendanceRangeMode;
  onRangeChange: (range: AttendanceRangeMode) => void;
}

const AttendanceModeTabs: React.FC<AttendanceModeTabsProps> = ({
  mode,
  onModeChange,
  range,
  onRangeChange,
}) => {
  const isEditDisabled = range !== 'day';

  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      {/* 👇 Range Tabs */}
      <div className="flex border rounded overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        {(['day', 'week', 'month'] as AttendanceRangeMode[]).map((r) => (
          <button
            key={r}
            onClick={() => onRangeChange(r)}
            className={`px-4 py-2 text-sm font-medium capitalize transition ${
              range === r
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {r === 'day' && 'Day-Wise'}
            {r === 'week' && 'Weekly'}
            {r === 'month' && 'Monthly'}
          </button>
        ))}
      </div>

      {/* 👇 Mode Tabs */}
      <div className="flex border rounded overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <button
          onClick={() => onModeChange('view')}
          className={`px-4 py-2 text-sm font-medium transition ${
            mode === 'view'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          View Mode
        </button>
        <button
          onClick={() => {
            if (!isEditDisabled) onModeChange('edit');
          }}
          disabled={isEditDisabled}
          className={`px-4 py-2 text-sm font-medium transition ${
            mode === 'edit'
              ? 'bg-blue-600 text-white'
              : isEditDisabled
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Edit Mode
        </button>
      </div>
    </div>
  );
};

export default AttendanceModeTabs;