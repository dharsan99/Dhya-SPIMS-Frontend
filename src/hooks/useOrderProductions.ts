import { useQuery } from '@tanstack/react-query';
import { getProduction } from '../api/production';
import { ProductionRecord } from '../types/production';

export function useOrderProductions(orderId: string) {
  return useQuery<ProductionRecord[]>({
    queryKey: ['productions', orderId],
    queryFn: () => getProduction({ order_id: orderId }),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
} 