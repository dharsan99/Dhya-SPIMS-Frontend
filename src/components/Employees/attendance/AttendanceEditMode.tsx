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

  const handleShiftChange = (empId: string, shift: string) => {
    onTimeChange(empId, 'shift', shift as ShiftType | 'ABSENT');

    if (shift === 'ABSENT') {
      onTimeChange(empId, 'in_time', '');
      onTimeChange(empId, 'out_time', '');
    } else {
      const { in_time, out_time } = shiftTimeMap[shift as ShiftType];
      onTimeChange(empId, 'in_time', in_time);
      onTimeChange(empId, 'out_time', out_time);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        date,
        records: employees.map((emp) => {
          const att = attendance[emp.employee_id];
          const isPresent = att?.shift !== 'ABSENT';
  
          if (!att) {
            throw new Error(`Missing attendance data for employee ${emp.employee.name}`);
          }
  
          if (isPresent) {
            const inTimeString = `${date}T${att.in_time || '00:00'}:00`;
            const outTimeString = `${date}T${att.out_time || '00:00'}:00`;
  
            return {
              employee_id: emp.employee_id,
              shift: att.shift,
              status: 'PRESENT',
              in_time: new Date(inTimeString).toISOString(),
              out_time: new Date(outTimeString).toISOString(),
              overtime_hours: att.overtime_hours || 0,
            };
          } else {
            // For ABSENT employees
            const fallbackTime = new Date(`${date}T00:00:00.001Z`).toISOString();
            return {
              employee_id: emp.employee_id,
              shift: 'N/A',
              status: 'ABSENT',
              in_time: fallbackTime,
              out_time: fallbackTime,
              overtime_hours: 0,
            };
          }
        }),
      };
  
      console.log('📤 Submitting attendance payload:', payload);
  
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

  return (
    <div className="space-y-4">

     <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
     <table className="min-w-full text-sm border dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-center">
            <tr className="text-xs text-gray-700 dark:text-gray-200">
              <th className="px-3 py-2 border">T.No</th>
              <th className="px-3 py-2 border text-left">Employees</th>
              <th className="px-3 py-2 border">Shift</th>
              <th className="px-3 py-2 border">Overtime</th>
              <th className="px-3 py-2 border">Total Hours</th>
              <th className="px-3 py-2 border">Work Days</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">Action</th> 
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const att = attendance[emp.employee_id];
              const shiftValue = att?.shift || 'ABSENT';
              const isPresent = shiftValue !== 'ABSENT';
              const overtime = att?.overtime_hours ?? 0;
              const totalHours = isPresent ? 8 + overtime : 0;

              return (
                <tr key={idx} className="border-t dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900">
                  <td className="px-3 py-2 text-center">{pageStart + idx + 1}</td>
                  <td className="px-3 py-2 text-left truncate max-w-[160px]">{emp.employee.name}</td>
                  <td className="px-3 py-2 text-center">
                  <select
                      value={shiftValue}
                      onChange={(e) => handleShiftChange(emp.employee_id, e.target.value)}
                      className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="ABSENT">Absent</option>
                      <option value="MORNING">Morning</option>
                      <option value="EVENING">Evening</option>
                      <option value="NIGHT">Night</option>
                    </select>

                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={overtime || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : +e.target.value;
                        onOvertimeChange(emp.employee_id, value);
                      }}
                      className="w-20 px-2 py-1 rounded border text-center dark:bg-gray-800 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">{totalHours}</td>
                  <td className="px-3 py-2 text-center">{isPresent ? 1 : 0}</td>
                  <td className="px-3 py-2 text-center">{isPresent ? '✅' : '❌'}</td>
                  <td className="px-3 py-2 text-center">
                      <button
                        className="px-2 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                        onClick={async () => {

                          const att = attendance[emp.employee_id];
                          console.log('att', att)
                          if (!att || att.shift === 'ABSENT') {
                            alert('Cannot update attendance for absent employees.');
                            return;
                          }
                          
                        
                          try {
                            if (!att.in_time || !att.out_time) {
                              alert('In time or out time is missing or invalid.');
                              return;
                            }
                        
                            const inTimeString = `${date}T${att.in_time}:00`;
                            const outTimeString = `${date}T${att.out_time}:00`;
                        
                            const inDateTime = new Date(inTimeString);
                            const outDateTime = new Date(outTimeString);
                        
                            if (isNaN(inDateTime.getTime()) || isNaN(outDateTime.getTime())) {
                              throw new Error('Invalid date/time format');
                            }
                        
                            const payload = {
                              employee_id: emp.employee_id,
                              in_time: inDateTime.toISOString(),
                              out_time: outDateTime.toISOString(),
                              overtime_hours: att.overtime_hours || 0,
                              status: 'PRESENT' as const,
                              shift: att.shift,
                            };

                            console.log('payload', payload)
                        
                            await markSingleAttendance(payload);
                            showSuccess(`Attendance updated for ${emp.employee.name}`);
                            queryClient.invalidateQueries({ queryKey: ['attendance', rangeMode, rangeStart, rangeEnd] });
                            queryClient.invalidateQueries({ queryKey: ['attendance-summary', rangeMode, date, rangeStart, rangeEnd] });
                          } catch (error) {
                            console.error('❌ Failed to update single attendance:', error);
                            alert('Failed to update attendance. Please check time fields.');
                          }
                        }}
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