import { AttendanceRow } from './AttendanceTypes';
import { generateAttendancePDF } from '../../../utils/pdf/attendanceExport';
import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { fetchAttendanceByDate } from '../../../api/attendance';
import { AttendanceRecord } from '@/types/attendance';

interface AttendanceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'xlsx' | 'pdf';
  employees: AttendanceRecord[];
  dates: string[];
  departmentName?: string;
  dateRange?: string;
    rangeMode?: 'day' | 'week' | 'month'; // ✅ ADD THIS

}

const AttendanceExportModal: React.FC<AttendanceExportModalProps> = ({
  isOpen,
  onClose,
  exportType,
  employees,
  dates,
  departmentName,
  dateRange,
  rangeMode,
}) => {
  const [displayMode, setDisplayMode] = useState<'short' | 'full'>('short');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Record<string, AttendanceRow>>>({});
  const [loading, setLoading] = useState(true);

  const fetchAttendanceMap = async () => {
    setLoading(true);
    const map: Record<string, Record<string, AttendanceRow>> = {};
  
    for (const date of dates) {
      try {
        const response = await fetchAttendanceByDate(date);
        const rows: AttendanceRow[] = Array.isArray(response.data) ? response.data : [];
        map[date] = {};
        rows.forEach((row: AttendanceRow) => {
          map[date][row.employee_id] = row;
        });
      } catch (error) {
        console.error(`Error fetching attendance for ${date}`, error);
        map[date] = {};
      }
    }
  
    setAttendanceMap(map);
    setLoading(false);
  };


  useEffect(() => {
    if (isOpen) fetchAttendanceMap();
  }, [isOpen]);

  const getStatusLabel = (status: string | undefined) => {
    const s = status?.toUpperCase?.();
    return displayMode === 'full'
      ? s === 'PRESENT' ? 'Present' : s === 'HALF_DAY' ? 'Half Day' : s === 'LEAVE' ? 'Leave' : 'Absent'
      : s === 'PRESENT' ? 'P' : s === 'HALF_DAY' ? '½' : s === 'LEAVE' ? 'L' : 'A';
  };

  const summaryStats = useMemo(() => {
    let present = 0, halfDay = 0, leave = 0, absent = 0;
    for (const d of dates) {
      const map = attendanceMap[d] || {};
      for (const emp of employees) {
        const row = map[emp.employeeId];
        switch (row?.status) {
          case 'PRESENT': present++; break;
          case 'HALF_DAY': halfDay++; break;
          default: absent++; break;
        }
      }
    }
    return { present, halfDay, leave, absent };
  }, [attendanceMap, dates, employees]);


  const handleExport = () => {
    if (exportType === 'pdf') {
      generateAttendancePDF({
        employees,
        attendanceMap,
        dates,
        departmentName,
        dateRange,
        displayMode,
        rangeMode,
      });
    } else {
      handleXLSXExport();
    }
    onClose();
  };

  const handleXLSXExport = () => {
    const header = ['T.No', 'Employee', ...dates.map(d => d)];
    const data = employees.map(emp => [
      emp?.employee?.tokenNo || emp.tokenNo,
      emp.employee?.name || emp.name,
      ...dates.map(d => getStatusLabel(attendanceMap[d]?.[emp.employeeId]?.status))
    ]);


    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `Attendance_Report_${dateRange || 'summary'}.xlsx`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-6xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Export Attendance Preview ({exportType.toUpperCase()})
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Fetching latest attendance...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-4 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">✅ Present: {summaryStats.present}</div>
              <div className="bg-yellow-100 dark:bg-yellow-700 p-2 rounded">🌓 Half Day: {summaryStats.halfDay}</div>
              <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded">🛌 Leave: {summaryStats.leave}</div>
              <div className="bg-red-100 dark:bg-red-700 p-2 rounded">❌ Absent: {summaryStats.absent}</div>
            </div>

            <div className="mb-3 flex justify-end items-center text-sm gap-2">
              <span className="text-gray-600 dark:text-gray-300">View:</span>
              <select
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as 'short' | 'full')}
                className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="short">Status Code (P/A/½)</option>
                <option value="full">Full Text (Present/Absent)</option>
              </select>
            </div>

            <div className="overflow-auto max-h-[60vh] border rounded mb-4">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                  <tr>
                    <th className="px-3 py-2 border">T.No</th>
                    <th className="px-3 py-2 border">Employee</th>
                    {dates.map((d) => (
                      <th key={d} className="px-3 py-2 border text-center">{d.slice(8)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp.employeeId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border text-center">{emp.employee?.tokenNo || emp.tokenNo}</td>
                      <td className="px-3 py-2 border truncate max-w-[200px]">{emp.employee?.name || emp.name}</td>
                      {dates.map((d) => {
                        const att = attendanceMap[d]?.[emp.employeeId];
                        return (
                          <td key={d} className="px-3 py-2 border text-center">
                            {getStatusLabel(att?.status)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleExport} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                Download
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceExportModal;