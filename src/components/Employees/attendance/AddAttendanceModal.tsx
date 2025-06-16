
import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { ShiftType, shiftTimeMap, AttendanceStatus } from './AttendanceTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Employee } from '@/types/employee';
import { getAllEmployees } from '@/api/employees';
import { markAttendance } from '@/api/attendance';
import toast from 'react-hot-toast';

interface AddAttendanceModalProps {
  onClose: () => void;
  defaultDate: string;
}

const statusOptions = ['PRESENT', 'ABSENT', 'HALF_DAY'].map((s) => ({
  value: s,
  label: s,
}));

const shiftOptions = (['MORNING', 'EVENING', 'NIGHT'] as ShiftType[]).map((shift) => ({
  value: shift,
  label: shift,
}));

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  onClose,
  defaultDate,
}) => {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState<string>('');
  const [date, setDate] = useState(defaultDate);
  const [shift, setShift] = useState<ShiftType | null>(null);
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  

  const { data: employeesOptions = []} = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  });

  const { mutate } = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      toast.success('Attendance submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['attendance', 'day'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to submit attendance');
    },
  });

  


  // Populate times when shift is selected
  useMemo(() => {
    if (shift) {
      setInTime(shiftTimeMap[shift].in_time);
      setOutTime(shiftTimeMap[shift].out_time);
    }
  }, [shift]);

  const handleSubmit = () => {
    const payload: any = {
      employee_id: employeeId,
      date,
      shift: shift || '',
      in_time: `${date}T${inTime}`,
      out_time: `${date}T${outTime}`,
      overtime_hours: overtimeHours,
      status,
    };
  
    mutate(payload); // Trigger mutation
  };
  

  const employeeOptions = employeesOptions.map((emp) => ({
    value: emp.id,
    label: `${emp.token_no} - ${emp.name}`, // Better UX
  }));

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Add Attendance</h2>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Employee</label>
          <Select
            options={employeeOptions}
            onChange={(opt) => setEmployeeId(opt?.value || '')}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Shift</label>
          <Select
            options={shiftOptions}
            onChange={(opt) => setShift(opt?.value as ShiftType)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1 dark:text-white">In Time</label>
            <input
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              className="w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1 dark:text-white">Out Time</label>
            <input
              type="time"
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              className="w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Overtime Hours</label>
          <input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
            className="w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Status</label>
          <Select
            options={statusOptions}
            onChange={(opt) => setStatus(opt?.value as AttendanceStatus)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAttendanceModal;
