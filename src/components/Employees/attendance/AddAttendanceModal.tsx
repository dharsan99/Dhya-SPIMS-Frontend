import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { ShiftType, shiftTimeMap, AttendanceStatus } from './AttendanceTypes';
import type { ShiftDropdownOption } from './AttendanceTypes';
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

const shiftOptions = (['MORNING', 'EVENING', 'NIGHT', 'ABSENT'] as ShiftDropdownOption[]).map((shift) => ({
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
  const [shift, setShift] = useState<ShiftDropdownOption | null>(null);
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
      queryClient.invalidateQueries({ queryKey: ['attendance-summary', 'day'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to submit attendance');
    },
  });

  // Handle status change
  const handleStatusChange = (newStatus: AttendanceStatus) => {
    setStatus(newStatus);
    if (newStatus === 'ABSENT') {
      setShift('ABSENT');
      setInTime('');
      setOutTime('');
      setOvertimeHours(0);
    } else {
      // Set default shift if not already set
      if (!shift || shift === 'ABSENT') {
        setShift('MORNING');
        setInTime(shiftTimeMap['MORNING'].in_time);
        setOutTime(shiftTimeMap['MORNING'].out_time);
      }
    }
  };

  // Populate times when shift is selected
  useMemo(() => {
    if (shift === 'ABSENT') {
      setStatus('ABSENT');
      setInTime('');
      setOutTime('');
      setOvertimeHours(0);
    } else if (shift) {
      setInTime(shiftTimeMap[shift].in_time);
      setOutTime(shiftTimeMap[shift].out_time);
    }
  }, [shift]);

  const handleSubmit = () => {
    const isAbsent = status === 'ABSENT';
  
    if (isAbsent) {
      // Minimal payload for absent employees
      const payload = {
        employee_id: employeeId,
        date,
        status: 'ABSENT',
      };
      mutate(payload);
      return;
    }
  
    // Build Date objects for time manipulation
    const baseOutTime = new Date(`${date}T${outTime}`);
    const adjustedOutTime = new Date(baseOutTime);
    adjustedOutTime.setHours(adjustedOutTime.getHours() + overtimeHours);
  
    // Format adjusted out time as HH:MM
    const formattedOutTime = adjustedOutTime.toISOString().slice(11, 16);
  
    const payload = {
      employee_id: employeeId,
      date,
      shift: shift || '',
      in_time: `${date}T${inTime}`,
      out_time: `${date}T${formattedOutTime}`,
      overtime_hours: overtimeHours,
      status,
    };
  
    mutate(payload);
  };
  
  
  

  const employeeOptions = employeesOptions.map((emp) => ({
    value: emp.id,
    label: `${emp.token_no} - ${emp.name}`, // Better UX
  }));

  const isAbsent = status === 'ABSENT';

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
          <label className="block text-sm mb-1 dark:text-white">Status</label>
          <Select
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === status)}
            onChange={(opt) => handleStatusChange(opt?.value as AttendanceStatus)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Shift</label>
          <Select
            options={shiftOptions}
            value={shiftOptions.find(opt => opt.value === shift)}
            onChange={(opt) => setShift(opt?.value as ShiftType)}
            isDisabled={isAbsent}
            styles={{
              control: (provided) => ({
                ...provided,
                opacity: isAbsent ? 0.5 : 1,
                backgroundColor: isAbsent ? '#f3f4f6' : provided.backgroundColor,
              }),
            }}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1 dark:text-white">In Time</label>
            <input
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              disabled={isAbsent}
              className={`w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white ${
                isAbsent ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''
              }`}
            />

          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1 dark:text-white">Out Time</label>
            <input
              type="time"
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              disabled={isAbsent}
              className={`w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white ${
                isAbsent ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 dark:text-white">Overtime Hours</label>
          <input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
            disabled={isAbsent}
            className={`w-full border px-2 py-1 rounded dark:bg-gray-700 dark:text-white ${
              isAbsent ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''
            }`}
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
