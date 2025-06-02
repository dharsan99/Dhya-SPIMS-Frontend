// src/components/ProductionTabs/allrecords/types.ts
export type { ProductionRecord } from '../../../types/production';


  
  export type SortKey =
    | 'date'
    | 'machine'
    | 'section'
    | 'shift'
    | 'count'
    | 'hank'
    | 'production_kg'
    | 'required_qty'
    | 'status';
  
  export type SortDirection = 'asc' | 'desc';
  
  export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
  }
  
  export interface FilterConfig {
    dateFrom?: string;
    dateTo?: string;
    shift?: string;
    machine?: string;
    section?: string;
    status?: 'draft' | 'final';
  }
  
  export interface PaginationConfig {
    currentPage: number;
    pageSize: number;
  }
  
  export interface KPIData {
    totalRecords: number;
    totalProduction: number;
    totalRequired: number;
    averageEfficiency: number;
  }