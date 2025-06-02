import React from 'react';
import { format } from 'date-fns';

interface AttendanceHeaderControlsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAutofill: (shift: string) => void;
  onSave: () => void;
}

const shifts = ['Shift 1', 'Shift 2', 'Shift 3'];

const AttendanceHeaderControls: React.FC<AttendanceHeaderControlsProps> = ({
  selectedDate,
  onDateChange,
  onAutofill,
  onSave,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
        <input
          type="date"
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => onDateChange(new Date(e.target.value))}
        />
      </div>

      {/* Autofill Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {shifts.map((shift) => (
          <button
            key={shift}
            onClick={() => onAutofill(shift)}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Autofill {shift}
          </button>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Attendance
      </button>
    </div>
  );
};

export default AttendanceHeaderControls;