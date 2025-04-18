// src/components/ProductionTabs/allrecords/RowHighlighter.tsx
import { ProductionRecord } from '../../../types/production';

export const getRowHighlightClass = (record: ProductionRecord): string => {
  const lowProductionThreshold = 50; // in kg, adjust as needed
  const hasLowProduction = record.production_kg < lowProductionThreshold;
  const isDraft = record.status === 'draft';
  const hasMissingRemarks = !record.remarks || record.remarks.trim() === '';

  if (isDraft) return 'bg-yellow-50';
  if (hasLowProduction) return 'bg-red-50';
  if (hasMissingRemarks) return 'bg-blue-50';

  return '';
};