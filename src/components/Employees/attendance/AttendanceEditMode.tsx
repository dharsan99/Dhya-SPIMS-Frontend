// pullable request
import React, { useState } from 'react';
import { AttendanceEditModeProps, ShiftType, shiftTimeMap } from './AttendanceTypes';
import {  markAttendanceBulk,  markSingleAttendance } from '../../../api/attendance';
import { TailwindDialog } from '../../ui/Dialog';
import { useQueryClient } from '@tanstack/react-query';
import { showError, showSuccess } from './utils/toastutils';


const AttendanceEditMode: React.FC<
  AttendanceEditModeProps & {
    date: string;
    rangeMode?: 'day' | 'week' | 'month';
    rangeStart?: string;
    rangeEnd?: string;
    onSubmitSuccess?: () => void;
  }
> = ({ employees, attendance, onTimeChange, onOvertimeChange, pageStart, date, rangeMode, rangeStart, rangeEnd, onSubmitSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  console.log('employees', employees)
  console.log('attendance', attendance)
  
  // Debug: Check if employees have valid employeeId
  employees.forEach((emp, index) => {
    console.log(`Employee ${index}:`, {
      employeeId: emp.employeeId,
      name: emp.employee?.name,
      hasAttendance: !!attendance[emp.employeeId]
    });
  });

  const handleShiftChange = (empId: string, shift: string) => {
    onTimeChange(empId, 'shift', shift as ShiftType | 'ABSENT');

    if (shift === 'ABSENT') {
      onTimeChange(empId, 'in_time', '');
      onTimeChange(empId, 'out_time', '');
      onTimeChange(empId, 'status', 'ABSENT');
    } else {
      const { in_time, out_time } = shiftTimeMap[shift as ShiftType];
      onTimeChange(empId, 'in_time', in_time);
      onTimeChange(empId, 'out_time', out_time);
      onTimeChange(empId, 'status', 'PRESENT');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedDate = new Date(date).toISOString().slice(0, 10);
      const payload = {
        date: formattedDate,
        records: employees.map((emp) => {
          const att = attendance[emp.employeeId];

          if (!att) {
            throw new Error(`Missing attendance data for employee ${emp.employee?.name}`);
          }

          // If status is ABSENT, send shift as null
          if (att.status === 'ABSENT') {
            return {
              employeeId: emp.employeeId,
              shift: null,
              status: 'ABSENT',
              overtimeHours: 0,
            };
          } else {
            return {
              employeeId: emp.employeeId,
              shift: att.shift,
              status: att.status,
              overtimeHours: att.overtime_hours || 0,
            };
          }
        }),
      };

      await markAttendanceBulk(payload);

      queryClient.invalidateQueries({ 
        queryKey: ['attendance-summary', rangeMode, date, rangeStart, rangeEnd],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['attendance', rangeMode, rangeStart, rangeEnd],
        refetchType: 'all'
      });

      setIsModalOpen(false);
      onSubmitSuccess?.();
    } catch (err) {
      console.error('❌ Error submitting attendance:', err);
      showError('Something went wrong while submitting attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSingleUpdate = async (empId: string) => {
    const att = attendance[empId];
    if (!att || att.status === 'ABSENT') {
      alert('Cannot update attendance for absent employees.');
      return;
    }

    try {
      const formattedDate = new Date(date).toISOString().slice(0, 10);
      const payload = {
        employeeId: empId,
        shift: att.shift === 'ABSENT' ? 'SHIFT_1' : att.shift,
        status: att.status,
        overtimeHours: att.overtime_hours || 0,
        date: formattedDate,
      };

      await markSingleAttendance(payload);
      showSuccess(`Attendance updated for employee.`);
      queryClient.invalidateQueries({ queryKey: ['attendance', rangeMode, rangeStart, rangeEnd] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary', rangeMode, date, rangeStart, rangeEnd] });
    } catch (error) {
      console.error('❌ Failed to update single attendance:', error);
      alert('Failed to update attendance. Please check time fields.');
    }
  };



  return (
    <div className="space-y-4">

     <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
     <table className="min-w-full text-sm border dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-center">
            <tr className="text-xs text-gray-700 dark:text-gray-200">
              <th className="px-3 py-2 border">T.No</th>
              <th className="px-3 py-2 border text-left">Employees</th>
              <th className="px-3 py-2 border">Shift</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Overtime</th>
              <th className="px-3 py-2 border">Total Hours</th>
              <th className="px-3 py-2 border">Work Days</th>
              <th className="px-3 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const att = attendance[emp.employeeId];
              const rawShift = att?.shift;
              const shiftValue = ['SHIFT_1', 'SHIFT_2', 'SHIFT_3'].includes(rawShift || '') ? rawShift : 'ABSENT';
              const statusValue = att?.status || 'ABSENT';
              const overtime = att?.overtime_hours ?? 0;
              
              // Calculate total hours based on status
              const baseHours = statusValue === 'PRESENT' ? 8 : statusValue === 'HALF_DAY' ? 4 : 0;
              const totalHours = baseHours + overtime;
              const workDays = statusValue === 'PRESENT' ? 1 : statusValue === 'HALF_DAY' ? 0.5 : 0;

              return (
                <tr key={idx} className="border-t dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900">
                  <td className="px-3 py-2 text-center">{pageStart + idx + 1}</td>
                  <td className="px-3 py-2 text-left truncate max-w-[160px]">{emp?.employee?.name}</td>
                  <td className="px-3 py-2 text-center">
                    <select
                      value={shiftValue}
                      onChange={(e) => handleShiftChange(emp.employeeId, e.target.value)}
                      className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="ABSENT">Absent</option>
                      <option value="SHIFT_1">Shift 1</option>
                      <option value="SHIFT_2">Shift 2</option>
                      <option value="SHIFT_3">Shift 3</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <select
                      value={statusValue}
                      onChange={(e) => onTimeChange(emp.employeeId, 'status', e.target.value as 'PRESENT' | 'ABSENT' | 'HALF_DAY')}
                      disabled={shiftValue === 'ABSENT'}
                      className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {shiftValue === 'ABSENT' ? (
                        <option value="ABSENT">Absent</option>
                      ) : (
                        <>
                          <option value="PRESENT">Present</option>
                          <option value="HALF_DAY">Half Day</option>
                        </>
                      )}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={overtime || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : +e.target.value;
                        onOvertimeChange(emp.employeeId, value);
                      }}
                      disabled={shiftValue === 'ABSENT'}
                      className="w-20 px-2 py-1 rounded border text-center dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">{totalHours}</td>
                  <td className="px-3 py-2 text-center">{workDays}</td>
                  <td className="px-3 py-2 text-center">
                    {statusValue === 'PRESENT' ? '✅' : statusValue === 'HALF_DAY' ? '🌓' : '❌'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      className="px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleSingleUpdate(emp.employeeId)}
                      
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Submit Attendance
        </button>
      </div>

      <TailwindDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Attendance Submission"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to submit attendance for <strong>{employees.length}</strong> employees on{' '}
          <strong>{date}</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm border rounded text-gray-700 dark:text-white dark:border-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
      </TailwindDialog>
    </div>
  );
};

export default AttendanceEditMode;