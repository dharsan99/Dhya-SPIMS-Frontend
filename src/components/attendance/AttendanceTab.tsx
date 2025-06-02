// src/components/Employees/AttendanceTab.tsx
import { useEffect, useMemo, useState } from 'react';
import { getAllEmployees } from '../../api/employees';
import { Employee } from '../../types/employee';
import format from 'date-fns/format';
import {addDays} from 'date-fns/addDays';
import {parseISO} from 'date-fns/parseISO';
import AttendanceTable from './AttendanceTable';

interface AttendanceRow {
  employee_id: string;
  in_time: string;
  out_time: string;
  total_hours: number;
  overtime_hours: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
}



const ITEMS_PER_PAGE = 10;

const AttendanceTab = () => {
  const [date, setDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [shift, setShift] = useState<'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3'>('SHIFT_1');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRow>>({});
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllEmployees().then((data) => {
      setEmployees(data);
      const initial: Record<string, AttendanceRow> = {};
      data.forEach((emp) => {
        initial[emp.id] = {
          employee_id: emp.id,
          in_time: '',
          out_time: '',
          total_hours: 0,
          overtime_hours: 0,
          status: 'ABSENT',
        };
      });
      setAttendance(initial);
    });
  }, []);

  useEffect(() => {
    const filtered = departmentFilter
      ? employees.filter((e) => e.department === departmentFilter)
      : employees;
    setFilteredEmployees(filtered);
    setPage(1);
  }, [employees, departmentFilter]);

  const departments = useMemo(() => {
    const deptSet = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(deptSet) as string[];
  }, [employees]);

  const handleTimeChange = (id: string, field: 'in_time' | 'out_time', value: string) => {
    setAttendance((prev) => {
      const updated = { ...prev[id], [field]: value };
      let total = 0;
      if (updated.in_time && updated.out_time) {
        const [inH, inM] = updated.in_time.split(':').map(Number);
        const [outH, outM] = updated.out_time.split(':').map(Number);
        total = (outH * 60 + outM - (inH * 60 + inM)) / 60;
        if (total < 0) total = 0;
      }
      updated.total_hours = parseFloat(total.toFixed(2));
      updated.status = total > 0 ? 'PRESENT' : 'ABSENT';
      return { ...prev, [id]: updated };
    });
  };

  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setDate(format(addDays(parseISO(date), -1), 'yyyy-MM-dd'))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
        >
          ← Previous
        </button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={() => setDate(format(addDays(parseISO(date), 1), 'yyyy-MM-dd'))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
        >
          Next →
        </button>
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value as any)}
          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="SHIFT_1">Shift 1</option>
          <option value="SHIFT_2">Shift 2</option>
          <option value="SHIFT_3">Shift 3</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* AttendanceTable moved out */}
      <AttendanceTable
  employees={paginatedEmployees}
  attendance={attendance}
  onTimeChange={handleTimeChange}
  onOvertimeChange={(id, value) =>
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], overtime_hours: value },
    }))
  }
  pageOffset={startIdx}
/>

      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIdx + 1} - {Math.min(startIdx + ITEMS_PER_PAGE, filteredEmployees.length)} of{' '}
          {filteredEmployees.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;