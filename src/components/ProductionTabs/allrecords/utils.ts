// src/components/ProductionTabs/allrecords/utils.ts

import { ProductionRecord, SortConfig, FilterConfig } from './types';

/**
 * 🔍 Search by machine, shift, section, remarks
 */
export function applySearch(records: ProductionRecord[], search: string): ProductionRecord[] {
  if (!search.trim()) return records;

  const lower = search.toLowerCase();

  return records.filter((record) =>
    [record.machine, record.shift, record.section, record.remarks]
      .filter(Boolean)
      .some((field) => field?.toLowerCase().includes(lower))
  );
}

/**
 * Filters records based on the filter config
 */
export function applyFilters(records: ProductionRecord[], filters: FilterConfig): ProductionRecord[] {
  return records.filter((record) => {
    const date = new Date(record.date);

    if (filters.dateFrom && new Date(filters.dateFrom) > date) return false;
    if (filters.dateTo && new Date(filters.dateTo) < date) return false;
    if (filters.shift && record.shift !== filters.shift) return false;
    if (filters.machine && record.machine !== filters.machine) return false;
    if (filters.section && record.section !== filters.section) return false;
    if (filters.status && record.status !== filters.status) return false;

    return true;
  });
}

/**
 * Sorts records based on sort config
 */
export function applySorting(records: ProductionRecord[], sortConfig: SortConfig): ProductionRecord[] {
  const { key, direction } = sortConfig;

  return [...records].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });
}

/**
 * Slices records for pagination
 */
export function applyPagination(records: ProductionRecord[], currentPage: number, pageSize: number): ProductionRecord[] {
  const start = (currentPage - 1) * pageSize;
  return records.slice(start, start + pageSize);
}

/**
 * Calculates KPI summary from filtered records
 */
export function calculateKPI(records: ProductionRecord[]) {
  const totalRecords = records.length;
  const totalProduction = records.reduce((sum, r) => sum + r.production_kg, 0);
  const totalRequired = records.reduce((sum, r) => sum + r.required_qty, 0);
  const averageEfficiency = totalRequired > 0 ? (totalProduction / totalRequired) * 100 : 0;

  return {
    totalRecords,
    totalProduction,
    totalRequired,
    avgEfficiency: averageEfficiency,
  };
}

/**
 * Returns highlight class based on record values
 */
export function getRowHighlight(record: ProductionRecord): string {
  if (record.status === 'draft') return 'bg-yellow-50';
  if (record.production_kg < 100) return 'bg-red-50';
  if (!record.remarks) return 'bg-blue-50';
  return '';
}