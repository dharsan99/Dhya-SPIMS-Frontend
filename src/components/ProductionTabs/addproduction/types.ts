// src/components/ProductionTabs/addproduction/types.ts

export type Shift = '1' | '2' | '3';
export type Status = 'draft' | 'final';

export interface AddProductionFormData {
  id?: string; // Optional if used for edit
  date: string;
  section: string;
  machine: string;
  shift: Shift;
  count: string;
  hank: string;
  production_kg: number;
  required_qty: number;
  remarks?: string;
  status: Status;
}