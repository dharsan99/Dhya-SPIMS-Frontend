// src/types/dashboard.ts

import { FinanceRow } from './finance';
import { Order } from './order'; // ✅ Reuse the existing Order interface
import { Production } from './production';
import { MachineStatus } from './production';

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

export interface ProductionSummaryCardProps {
  data: Production[]; // Define ProductionRow type and import here if needed
}

export interface ReceivablesPayablesCardProps {
  data: FinanceRow[]; // Define FinanceRow type and import here if needed
}

export interface DashboardSummary {
  orders: {
    totalOrders: number;
    statusBreakdown: {
      pending: number;
      in_progress: number;
      completed: number;
      dispatched: number;
    };
    pendingOrders: number;
    overdueOrders: number;
    topBuyers: Array<{
      buyer_id: string;
      name: string;
      order_count: number;
      total_quantity: number;
    }>;
  };
  purchaseOrders: {
    totalPOs: number;
    statusBreakdown: {
      uploaded: number;
      converted: number;
      verified: number;
    };
    totalValue: number;
    conversionRate: number;
    convertedPOs: number;
  };
  production: ProductionSummary;
  inventory?: {
    totalItems: number;
    lowStockItems: number;
    pendingFiberShortages: number;
  };
  workforce?: {
    totalEmployees: number;
    attendanceRateToday: number;
    attendanceOvertimeToday: number;
  };
  machines?: {
    totalMachines: number;
    runningMachines: number;
    idleMachines: number;
    maintenanceMachines: number;
    offlineMachines: number;
    machineStatuses: MachineStatus[];
  };
  financial: {
    receivables?: {
      total: number;
      overdue: number;
    };
    payables?: {
      total: number;
      overdue: number;
    };
  };
}

export interface ProductionSummary {
  totalProduction: number;
  avgDailyProduction: number;
  sectionProduction: {
    blow_room: number;
    carding: number;
    drawing: number;
    framing: number;
    simplex: number;
    spinning: number;
    autoconer: number;
  };
  sectionQuality: {
    [key: string]: {
      totalIssues: number;
      issueRate: number;
    };
  };
  sectionDowntime: {
    [key: string]: {
      totalIncidents: number;
      downtimeRate: number;
    };
  };
  machineMetrics: Array<{
    machine: string;
    total_production: number;
    avg_daily_production: number;
    production_days: number;
    shifts_operated: number;
    efficiency: {
      overall: number;
      average: number;
    };
    downtime_incidents: number;
    quality_issues: number;
  }>;
  productionTrend: Array<{
    date: string;
    production: number;
  }>;
  productionDays: number;
}