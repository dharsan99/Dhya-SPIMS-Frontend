import api from './axios';
import { Employee } from '../types/employee';

const endpoint = '/employees';

/**
 * ✅ Get all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  const res = await api.get(endpoint);
  return res.data;
};

/**
 * ✅ Get a single employee by ID
 */
export const getEmployeeById = async (id: string): Promise<Employee> => {
  const res = await api.get(`${endpoint}/${id}`);
  return res.data;
};

/**
 * ✅ Create new employee
 */
export const createEmployee = (data: Omit<Employee, 'id'>) => {
  return api.post(endpoint, data);
};

/**
 * ✅ Update existing employee
 */
export const updateEmployee = (id: string, data: Partial<Omit<Employee, 'id'>>) => {
  return api.put(`${endpoint}/${id}`, data);
};

/**
 * ✅ Delete employee
 */
export const deleteEmployee = (id: string) => {
  return api.delete(`${endpoint}/${id}`);
};