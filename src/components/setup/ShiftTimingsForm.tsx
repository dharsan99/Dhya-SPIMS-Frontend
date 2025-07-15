import React, { useState, useEffect } from 'react';
import { ShiftType } from '@/components/Employees/attendance/AttendanceTypes';

interface ShiftTiming {
  shift: ShiftType;
  in_time: string;
  out_time: string;
  label: string;
}

interface ShiftTimingsFormProps {
  onDataChange?: (data: ShiftTiming[]) => void;
}

const ShiftTimingsForm: React.FC<ShiftTimingsFormProps> = ({
  onDataChange,
}) => {
  const [shiftTimings, setShiftTimings] = useState<ShiftTiming[]>([
    { shift: 'SHIFT_1', in_time: '06:00', out_time: '14:00', label: 'Morning Shift' },
    { shift: 'SHIFT_2', in_time: '14:00', out_time: '22:00', label: 'Evening Shift' },
    { shift: 'SHIFT_3', in_time: '22:00', out_time: '06:00', label: 'Night Shift' },
  ]);



  useEffect(() => {
    if (onDataChange) {
      onDataChange(shiftTimings);
    }
  }, [shiftTimings, onDataChange]);

  const handleTimeChange = (shift: ShiftType, field: 'in_time' | 'out_time', value: string) => {
    setShiftTimings(prev =>
      prev.map(timing =>
        timing.shift === shift ? { ...timing, [field]: value } : timing
      )
    );
  };

  const handleLabelChange = (shift: ShiftType, value: string) => {
    setShiftTimings(prev =>
      prev.map(timing =>
        timing.shift === shift ? { ...timing, label: value } : timing
      )
    );
  };

  const getShiftIcon = (shift: ShiftType) => {
    switch (shift) {
      case 'SHIFT_1':
        return '🌅';
      case 'SHIFT_2':
        return '🌆';
      case 'SHIFT_3':
        return '🌙';
      default:
        return '⏰';
    }
  };

  const getShiftColor = (shift: ShiftType) => {
    switch (shift) {
      case 'SHIFT_1':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'SHIFT_2':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
      case 'SHIFT_3':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className="h-full max-h-[80vh] overflow-y-auto px-2 space-y-6">
      {/* Scrollable content starts here */}
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Configure your organization's shift timings. These will be used for attendance tracking and production scheduling.
        </p>
      </div>

      <div className="space-y-4">
        {shiftTimings.map((timing) => (
          <div
            key={timing.shift}
            className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${getShiftColor(timing.shift)}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getShiftIcon(timing.shift)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {timing.shift.replace('_', ' ')}
                </h3>
                <input
                  type="text"
                  value={timing.label}
                  onChange={(e) => handleLabelChange(timing.shift, e.target.value)}
                  placeholder="Enter shift label (e.g., Morning Shift)"
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={timing.in_time}
                  onChange={(e) => handleTimeChange(timing.shift, 'in_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={timing.out_time}
                  onChange={(e) => handleTimeChange(timing.shift, 'out_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Duration: {(() => {
                const [inH, inM] = timing.in_time.split(':').map(Number);
                const [outH, outM] = timing.out_time.split(':').map(Number);
                let start = inH * 60 + inM;
                let end = outH * 60 + outM;
                if (end <= start) end += 24 * 60; // Handle overnight shifts
                const duration = (end - start) / 60;
                return `${duration.toFixed(1)} hours`;
              })()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Shift Configuration Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Night shifts that cross midnight are automatically handled</li>
              <li>• Standard shift duration is typically 8 hours</li>
              <li>• These timings will be used for attendance tracking</li>
              <li>• You can customize shift labels for better identification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftTimingsForm;
