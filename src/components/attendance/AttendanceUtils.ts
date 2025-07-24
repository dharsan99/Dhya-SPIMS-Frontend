import { Attendance } from '../../types/attendance';

/**
 * 🔢 Total overtime hours from attendance records
 */
export const calcTotalOvertime = (records: Attendance[]): number => {
  return records.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);
};

/**
 * 📊 Average shift hours across all attendance entries
 */
export const calcAverageShiftHours = (records: Attendance[]): number => {
  if (!records.length) return 0;
  const total = records.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  return Number((total / records.length).toFixed(2));
};

/**
 * ✅ Count present employees (those who have attendance recorded)
 */
export const calcPresentCount = (records: Attendance[]): number => {
  return records.length;
};

/**
 * ❌ Count of absent employees
 */
export const calcAbsentCount = (
  allEmployees: { id: string }[],
  attendanceRecords: Attendance[]
): number => {
  const presentIds = new Set(attendanceRecords.map((r) => r.employeeId));
  return allEmployees.filter((e) => !presentIds.has(e.id)).length;
};

/**
 * 📅 Returns today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};