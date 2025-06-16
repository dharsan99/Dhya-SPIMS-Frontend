import { Employee } from '@/types/employee';
import { create } from 'zustand';



interface EmployeeStore {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
}));