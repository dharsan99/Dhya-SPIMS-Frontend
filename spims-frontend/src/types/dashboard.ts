// src/types/dashboard.ts

import { FiberStock } from './fiber';
import { FinanceRow } from './finance';
import { Order } from './order'; // ✅ Reuse the existing Order interface
import { Production } from './production';

export interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Card Props
export interface OrderCreationCardProps extends PaginationProps {
  orders: Order[];
}

export interface PendingOrdersCardProps {
  data: Order[]; // Changed to 'data' to match your PendingOrdersCard implementation
}

export interface PendingFibersCardProps {
  fibers: FiberStock[]; // Make sure this is defined somewhere properly
}

export interface ProductionSummaryCardProps {
  data: Production[]; // Define ProductionRow type and import here if needed
}

export interface ReceivablesPayablesCardProps {
  data: FinanceRow[]; // Define FinanceRow type and import here if needed
}