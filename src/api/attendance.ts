// pullable request
import { AttendanceRecord, SingleAttendancePayload } from '@/types/attendance';
import api from './axios';

export type ShiftType = 'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3';
export type AttendanceStatus = 'PRESENT' | 'HALF_DAY' | 'ABSENT';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getAllAttendances = async (date?: string, pagination?: PaginationParams): Promise<PaginatedResponse<AttendanceRecord>> => {
  const url = date ? `/attendance/by-date?date=${date}` : '/attendance';
  const params = {
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
  };
  const res = await api.get(url, { params });
  return res.data;
};

export const getAttendanceInRange = async (
  start: string, 
  end: string, 
  pagination?: PaginationParams
): Promise<PaginatedResponse<AttendanceRecord>> => {
  const params = {
    start,
    end,
    page: pagination?.page || 1,
    limit: pagination?.limit || 10,
  };
  const response = await api.get('/attendance/range', { params });
  return response.data;
};

/**
 * ✅ Submit attendance data
 */
export const markAttendance = async (payload: any) => {
  const res = await api.post('/attendance', payload);
  return res.data;
};

export const markAttendanceBulk = (payload: any) => {
  return api.post('/attendance/mark-bulk', payload);
};




export const markSingleAttendance = async (payload: Omit<SingleAttendancePayload, 'employee_id'> & { employee_id: string }) => {
  const { employee_id, ...rest } = payload;

  const res = await api.put(`/attendance/${employee_id}`, rest);
  return res.data;
};

/**
 * ✅ Optional: Fetch attendance for a specific date
 */


export const getAttendanceSummary = async (params: {
  date?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}) => {
  return  await api.get('/attendance/summary-range', { params }).then((res) => res.data);
};

export const fetchAttendanceByDate = async (date: string) => {
    const res = await api.get(`/attendance/by-date?date=${date}`); // ✅ Correct
    return res.data;
  };
  
  export const fetchAttendanceRange = async (start: string, end: string) => {
    const res = await api.get(`/attendance/range?start=${start}&end=${end}`);
    return res.data;
  };

export const getDepartments = async (): Promise<string[]> => {
  const res = await api.get('/employees/departments/all');
  return res.data;
};

  