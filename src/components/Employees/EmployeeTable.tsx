import React from 'react';
import { Employee } from '../../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Token No</th>
            <th className="px-4 py-3 text-right">Shift Rate</th>
            <th className="px-4 py-3">Aadhar</th>
            <th className="px-4 py-3">Bank Acc 1</th>
            <th className="px-4 py-3">Bank Acc 2</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Join Date</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp, index) => (
              <tr
                key={emp.id}
                className={`transition hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950'
                }`}
              >
                <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-100">{emp.name}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{emp.token_no}</td>
                <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-semibold">
                  ₹{emp.shift_rate.toLocaleString()}
                </td>
                <td className="px-4 py-2">{emp.aadhar_no}</td>
                <td className="px-4 py-2">{emp.bank_acc_1}</td>
                <td className="px-4 py-2">
                  {emp.bank_acc_2 || <span className="italic text-gray-400">—</span>}
                </td>
                <td className="px-4 py-2">
                  {emp.department || <span className="italic text-gray-400">—</span>}
                </td>
                <td className="px-4 py-2">
                  {emp.join_date ? (
                    new Date(emp.join_date).toLocaleDateString('en-GB')
                  ) : (
                    <span className="italic text-gray-400">Not Provided</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(emp)}
                      className="px-3 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(emp.id)}
                      className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;