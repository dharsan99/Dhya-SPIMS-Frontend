import api from './axios';

export type ShiftType = 'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3';
export type AttendanceStatus = 'PRESENT' | 'HALF_DAY' | 'ABSENT';

export interface AttendanceRecord {
  employee_id: string;
  shift: ShiftType;
  overtime_hours: number;
  status: AttendanceStatus;
}

interface SingleAttendancePayload {
  date: string;
  employee_id: string;
  in_time: string;
  out_time: string;
  overtime_hours: number;
  status: 'PRESENT' | 'ABSENT';
  shift: ShiftType;
}


export interface MarkAttendancePayload {
  date: string; // Format: yyyy-MM-dd
  records: AttendanceRecord[];
}

/**
 * ✅ Submit attendance data
 */
export const markAttendance = async (payload: MarkAttendancePayload) => {
  const res = await api.post('/attendance/mark', payload);
  return res.data;
};

export const markSingleAttendance = async (payload: SingleAttendancePayload) => {
  const res = await api.post('/attendance', payload);
  return res.data;
};

/**
 * ✅ Optional: Fetch attendance for a specific date
 */


export const fetchAttendanceByDate = async (date: string) => {
    const res = await api.get(`/attendance/by-date?date=${date}`); // ✅ Correct
    return res.data;
  };
  
  export const fetchAttendanceRange = async (start: string, end: string) => {
    const res = await api.get(`/attendance/range?start=${start}&end=${end}`);
    return res.data;
  };