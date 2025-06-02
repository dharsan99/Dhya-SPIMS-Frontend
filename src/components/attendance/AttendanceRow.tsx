import React from 'react';
import { Employee } from '../../types/employee';

interface AttendanceRecord {
  inTime: string;
  outTime: string;
  shift: string;
}

interface AttendanceRowProps {
  employee: Employee;
  data: AttendanceRecord;
  onChange: (employeeId: string, field: keyof AttendanceRecord, value: string) => void;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ employee, data, onChange }) => {
  return (
    <tr className="border-b dark:border-gray-700">
      <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{employee.name}</td>

      {/* Shift Selection */}
      <td className="px-4 py-2">
        <select
          className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={data.shift}
          onChange={(e) => onChange(employee.id, 'shift', e.target.value)}
        >
          <option value="">--</option>
          <option value="Shift 1">Shift 1</option>
          <option value="Shift 2">Shift 2</option>
          <option value="Shift 3">Shift 3</option>
        </select>
      </td>

      {/* In Time */}
      <td className="px-4 py-2">
        <input
          type="time"
          className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={data.inTime}
          onChange={(e) => onChange(employee.id, 'inTime', e.target.value)}
        />
      </td>

      {/* Out Time */}
      <td className="px-4 py-2">
        <input
          type="time"
          className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={data.outTime}
          onChange={(e) => onChange(employee.id, 'outTime', e.target.value)}
        />
      </td>
    </tr>
  );
};

export default AttendanceRow;