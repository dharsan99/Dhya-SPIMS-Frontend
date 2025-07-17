import api from './axios';

export interface BillingStat {
  title: string;
  value: number;
  change: string;
  changeType: string;
  description: string;
}

export interface BillingStatsResponse {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidInvoices: number;
  totalInvoices: number;
  paidPercentage: number;
  stats: BillingStat[];
}

export const fetchBillingStats = async (): Promise<BillingStatsResponse> => {
  const response = await api.get<BillingStatsResponse>('/billing/stats');
  return response.data;
};

export interface Invoice {
  id: string;
  tenantName: string;
  tenantEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | string;
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  plan: string;
  billingCycle: string;
  description: string;
}

export interface InvoicesPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  pagination: InvoicesPagination;
}

export interface FetchAdminInvoicesParams {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchAdminInvoices = async (params: FetchAdminInvoicesParams = {}): Promise<InvoicesResponse> => {
  const response = await api.get('/billing/admin/invoices', { params });
  return response.data;
}; 