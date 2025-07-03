import React from 'react';
import { Employee } from '../../../types/employee';
import { AttendanceRow } from './AttendanceTypes';
import AttendanceTableRow from './AttendanceTableRow';

interface Props {
  employees: Employee[];
  attendance: Record<string, AttendanceRow>;
  onTimeChange: (id: string, field: 'in_time' | 'out_time', value: string) => void;
  onOvertimeChange: (id: string, value: number) => void;
  pageStart: number;
}

const AttendanceTable: React.FC<Props> = ({
  employees,
  attendance,
  onTimeChange,
  onOvertimeChange,
  pageStart,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr className="text-left">
            <th className="px-3 py-2 border text-center">T.No</th>
            <th className="px-3 py-2 border">Employee</th>
            <th className="px-3 py-2 border text-center">In-Time</th>
            <th className="px-3 py-2 border text-center">Out-Time</th>
            <th className="px-3 py-2 border text-center">Over Time</th>
            <th className="px-3 py-2 border text-center">Total Hours</th>
            <th className="px-3 py-2 border text-center">Total Work Days</th>
            <th className="px-3 py-2 border text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, idx) => {
            const data = attendance[emp.id];
            const totalWorkDays = data?.status === 'PRESENT' ? 1 : 0; // Replace with actual logic
            return (
              <AttendanceTableRow
                key={emp.id}
                index={pageStart + idx}
                employee={emp}
                data={data}
                onTimeChange={onTimeChange}
                onOvertimeChange={onOvertimeChange}
                totalWorkDays={totalWorkDays}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;