// src/components/Employees/attendance/AttendanceTable.tsx
import React from 'react';
import { Employee } from '../../types/employee';

interface AttendanceRow {
  employee_id: string;
  in_time: string;
  out_time: string;
  total_hours: number;
  overtime_hours: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
}

interface Props {
  employees: Employee[];
  attendance: Record<string, AttendanceRow>;
  onTimeChange: (id: string, field: 'in_time' | 'out_time', value: string) => void;
  onOvertimeChange: (id: string, value: number) => void;
  pageOffset: number; // <- ✅ Corrected here
}

const AttendanceTable: React.FC<Props> = ({
  employees,
  attendance,
  onTimeChange,
  onOvertimeChange,
  pageOffset,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-3 py-2 border">#</th>
            <th className="px-3 py-2 border">Employee</th>
            <th className="px-3 py-2 border">In-Time</th>
            <th className="px-3 py-2 border">Out-Time</th>
            <th className="px-3 py-2 border">Total</th>
            <th className="px-3 py-2 border">Overtime</th>
            <th className="px-3 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, idx) => {
            const att = attendance[emp.id];
            return (
              <tr key={emp.id} className="border-t dark:border-gray-700">
                <td className="px-3 py-2">{pageOffset + idx + 1}</td>
                <td className="px-3 py-2">{emp.name}</td>
                <td className="px-3 py-2">
                  <input
                    type="time"
                    value={att?.in_time || ''}
                    onChange={(e) => onTimeChange(emp.id, 'in_time', e.target.value)}
                    className="w-28 px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="time"
                    value={att?.out_time || ''}
                    onChange={(e) => onTimeChange(emp.id, 'out_time', e.target.value)}
                    className="w-28 px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 text-center">{att?.total_hours ?? 0}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={att?.overtime_hours ?? 0}
                    onChange={(e) => onOvertimeChange(emp.id, Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  {att?.status === 'PRESENT' ? '✅' : att?.status === 'HALF_DAY' ? '⚠️' : '❌'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;