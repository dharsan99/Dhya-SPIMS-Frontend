import React, { useEffect, useState } from 'react';
import { AttendanceEditModeProps, ShiftType, shiftTimeMap } from './AttendanceTypes';
import { markAttendance, fetchAttendanceByDate, MarkAttendancePayload } from '../../../api/attendance';
import { TailwindDialog } from '../../ui/Dialog';

const AttendanceEditMode: React.FC<
  AttendanceEditModeProps & {
    date: string;
    onSubmitSuccess?: () => void;
  }
> = ({ employees, attendance, onTimeChange, onOvertimeChange, pageStart, date, onSubmitSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const prefillAttendance = async () => {
      try {
        const records = await fetchAttendanceByDate(date);
        records.forEach((rec: any) => {
          onTimeChange(rec.employee_id, 'shift', rec.shift);
          onTimeChange(rec.employee_id, 'in_time', shiftTimeMap[rec.shift as ShiftType]?.in_time || '');
          onTimeChange(rec.employee_id, 'out_time', shiftTimeMap[rec.shift as ShiftType]?.out_time || '');
          onOvertimeChange(rec.employee_id, rec.overtime_hours || 0);
        });
      } catch (err) {
        console.error('❌ Failed to prefill attendance:', err);
      }
    };

    prefillAttendance();
  }, [date, onTimeChange, onOvertimeChange]);

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
      const payload: MarkAttendancePayload = {
        date,
        records: employees.map((emp) => {
          const att = attendance[emp.id];
          const overtime = att?.overtime_hours || 0;
          const isPresent = att?.shift !== 'ABSENT';

          return {
            employee_id: emp.id,
            in_time: att?.in_time || '',
            out_time: att?.out_time || '',
            total_hours: isPresent ? 8 + overtime : 0,
            overtime_hours: overtime,
            status: isPresent ? 'PRESENT' : 'ABSENT',
            shift: att?.shift as ShiftType,
          };
        }),
      };

      await markAttendance(payload);
      setIsModalOpen(false);
      onSubmitSuccess?.();
    } catch (err) {
      console.error('❌ Error submitting attendance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded shadow"
        >
          Update Attendance
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10 text-center">
            <tr className="text-xs text-gray-700 dark:text-gray-200">
              <th className="px-3 py-2 border">T.No</th>
              <th className="px-3 py-2 border text-left">Employee</th>
              <th className="px-3 py-2 border">Shift</th>
              <th className="px-3 py-2 border">Overtime</th>
              <th className="px-3 py-2 border">Total Hours</th>
              <th className="px-3 py-2 border">Work Days</th>
              <th className="px-3 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const att = attendance[emp.id];
              const shiftValue = att?.shift || 'ABSENT';
              const isPresent = shiftValue !== 'ABSENT';
              const overtime = att?.overtime_hours ?? 0;
              const totalHours = isPresent ? 8 + overtime : 0;

              return (
                <tr key={emp.id} className="border-t dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900">
                  <td className="px-3 py-2 text-center">{emp.token_no || pageStart + idx + 1}</td>
                  <td className="px-3 py-2 text-left truncate max-w-[160px]">{emp.name}</td>
                  <td className="px-3 py-2 text-center">
                    <select
                      value={shiftValue}
                      onChange={(e) => handleShiftChange(emp.id, e.target.value)}
                      className="w-28 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="ABSENT">Absent</option>
                      <option value="SHIFT_1">Shift 1</option>
                      <option value="SHIFT_2">Shift 2</option>
                      <option value="SHIFT_3">Shift 3</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      value={overtime}
                      onChange={(e) => onOvertimeChange(emp.id, Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded border text-center dark:bg-gray-800 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">{totalHours}</td>
                  <td className="px-3 py-2 text-center">{isPresent ? 1 : 0}</td>
                  <td className="px-3 py-2 text-center">{isPresent ? '✅' : '❌'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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