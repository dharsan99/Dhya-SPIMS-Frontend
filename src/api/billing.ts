import axios from 'axios';
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

export interface Payment {
  id: string;
  billingId: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
  txnId?: string | null;
}

export interface PaymentsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaymentsResponse {
  totalAmount: number;
  Completed: number;
  Pending: number;
  Failed: number;
  payments: Payment[];
  pagination: PaymentsPagination;
}

export interface FetchPaymentsParams {
  tenantId?: string;
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchPayments = async (params: FetchPaymentsParams = {}): Promise<PaymentsResponse> => {
  const response = await api.get<PaymentsResponse>('/billing/payments', { params });
  return response.data;
};

export interface RevenueTrend {
  month: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueTrendsResponse {
  revenueTrends: RevenueTrend[];
  totalRevenue: number;
  averageMonthlyRevenue: number;
  totalInvoices: number;
  changeFromLastMonth: number;
}

export const fetchRevenueTrends = async (): Promise<RevenueTrendsResponse> => {
  const response = await api.get<RevenueTrendsResponse>('/billing/revenue-trends');
  return response.data;
}; 


export const downloadInvoice = async ({
  invoice_number,
  tenant_id,
  token,
}: { invoice_number: string; tenant_id: string; token: string }) => {
  const response = await axios.get('http://192.168.0.2:5001/billing/admin/invoice/download', {
    params: { invoice_number },
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf',
      'x-tenant-id': tenant_id,
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};
export const sendInvoiceEmail = async (invoiceNumber: string) => {
  const response = await api.post('/billing/admin/invoice/send-email', {
    invoice_number: invoiceNumber,
  });
  return response.data;
};

export interface RecentPayment {
  name: string;
  method: string;
  txn_id: string | null;
  amount: number;
  date: string;
}

export const fetchRecentPayments = async (): Promise<RecentPayment[]> => {
  const response = await api.get('/billing/recent-activity');
  return response.data;
};