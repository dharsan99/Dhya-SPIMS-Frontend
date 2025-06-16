import { AttendanceRecord, MarkAttendancePayload, SingleAttendancePayload } from '@/types/attendance';
import api from './axios';

export type ShiftType = 'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3';
export type AttendanceStatus = 'PRESENT' | 'HALF_DAY' | 'ABSENT';



export const getAllAttendances = async (date?: string): Promise<AttendanceRecord[]> => {
  const url = date ? `/attendance/by-date?date=${date}` : '/attendance';
  const res = await api.get(url);
  console.log('res', res)
  return res.data;
};


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