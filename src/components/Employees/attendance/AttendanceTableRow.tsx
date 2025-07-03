import React from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';

interface Props {
  index: number;
  employee: Employee;
  data: AttendanceRow;
  onTimeChange: (id: string, field: 'in_time' | 'out_time', value: string) => void;
  onOvertimeChange: (id: string, value: number) => void;
  totalWorkDays?: number; // ← You can pass this dynamically from the parent later
}

const AttendanceTableRow: React.FC<Props> = ({
  index,
  employee,
  data,
  onTimeChange,
  onOvertimeChange,
  totalWorkDays = 1, // Placeholder for now
}) => {
  return (
    <tr className="border-t dark:border-gray-700 text-sm">
      <td className="px-3 py-2 text-center font-medium">{index + 1}</td>
      <td className="px-3 py-2 whitespace-nowrap font-medium">{employee.name}</td>
      
      <td className="px-3 py-2 text-center">
        <input
          type="time"
          value={data?.in_time || ''}
          onChange={(e) => onTimeChange(employee.id, 'in_time', e.target.value)}
          className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
        />
      </td>

      <td className="px-3 py-2 text-center">
        <input
          type="time"
          value={data?.out_time || ''}
          onChange={(e) => onTimeChange(employee.id, 'out_time', e.target.value)}
          className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
        />
      </td>

      <td className="px-3 py-2 text-center">
        <input
          type="number"
          value={data?.overtime_hours ?? 0}
          onChange={(e) => onOvertimeChange(employee.id, Number(e.target.value))}
          className="w-20 px-2 py-1 rounded border text-sm text-center dark:bg-gray-800 dark:text-white"
        />
      </td>

      <td className="px-3 py-2 text-center">{data?.total_hours ?? 0}</td>

      <td className="px-3 py-2 text-center">{totalWorkDays}</td>

      <td className="px-3 py-2 text-center">
        {data?.status === 'PRESENT' ? (
          <span className="text-green-600 font-bold">✔</span>
        ) : data?.status === 'HALF_DAY' ? (
          <span className="text-yellow-500 font-bold">⚠</span>
        ) : (
          <span className="text-red-600 font-bold">✖</span>
        )}
      </td>
    </tr>
  );
};

export default AttendanceTableRow;