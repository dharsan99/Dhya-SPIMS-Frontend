// src/components/ProductionTabs/addproduction/validation.ts

import { z } from 'zod';

export const AddProductionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  section: z.string().min(1, 'Section is required'),
  machine: z.string().min(1, 'Machine is required'),
  shift: z.enum(['1', '2', '3'], {
    required_error: 'Shift is required',
  }),
  count: z.string().min(1, 'Count is required'),
  hank: z.string().min(1, 'Hank is required'),
  production_kg: z
    .number({ invalid_type_error: 'Production must be a number' })
    .min(0, 'Production must be at least 0'),
  required_qty: z
    .number({ invalid_type_error: 'Required Qty must be a number' })
    .min(0, 'Required Qty must be at least 0'),
  remarks: z.string().optional(),
  status: z.enum(['draft', 'final'], {
    required_error: 'Status is required',
  }),
});

// TypeScript type inferred from schema
export type AddProductionSchemaType = z.infer<typeof AddProductionSchema>;