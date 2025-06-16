// src/utils/sectionProgress.ts
import { ProductionRecord } from '../types/production';
import { useOrderProductions } from '../hooks/useOrderProductions';

export const SECTIONS = [
  'Blow Room',
  'Carding',
  'Drawing',
  'Framing',
  'Simplex',
  'Spinning',
  'Autoconer',
];

export interface SectionProgress {
  section: string;
  produced: number;
  required: number;
  percent: number; // 0-100
}

export function aggregateSectionProgress(
  records: ProductionRecord[],
  orderId: string
): SectionProgress[] {
  console.log('[aggregateSectionProgress] called with orderId:', orderId);
  console.log('[aggregateSectionProgress] input records:', records);
  const bySection: Record<string, { produced: number; required: number }> = {};

  SECTIONS.forEach((section) => {
    bySection[section] = { produced: 0, required: 0 };
  });

  records
    .filter((rec) => rec.order_id === orderId)
    .forEach((rec) => {
      if (bySection[rec.section]) {
        bySection[rec.section].produced += rec.production_kg;
        bySection[rec.section].required += rec.required_qty;
      }
    });

  console.log('[aggregateSectionProgress] bySection:', bySection);
  const result = SECTIONS.map((section) => {
    const { produced, required } = bySection[section];
    return {
      section,
      produced,
      required,
      percent: required > 0 ? Math.min((produced / required) * 100, 100) : 0,
    };
  });
  console.log('[aggregateSectionProgress] result:', result);
  return result;
}

export function useSectionProgress(orderId: string) {
  const { data: productions = [], isLoading, error } = useOrderProductions(orderId);
  
  const sectionProgress = aggregateSectionProgress(productions, orderId);
  const totalProduced = sectionProgress.reduce((sum, sp) => sum + sp.produced, 0);
  
  return {
    sectionProgress,
    totalProduced,
    isLoading,
    error
  };
}