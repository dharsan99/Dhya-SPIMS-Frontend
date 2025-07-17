import React, { useState } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiDownload, 
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import BillingStats from '../../components/superadmin/billing/BillingStats';

import CreateInvoiceModal from '../../components/superadmin/billing/CreateInvoiceModal';
import RevenueChart from '@/components/superadmin/billing/RevenueChart';
import PaymentHistory from '@/components/superadmin/billing/PaymentHistory';
import InvoiceTable from '@/components/superadmin/billing/InvoiceTable';
import Pagination from '../../components/Pagination';
import { useQuery } from '@tanstack/react-query';
import { fetchBillingStats, fetchAdminInvoices, InvoicesResponse } from '../../api/billing';

interface Payment {
  id: string;
  invoiceId: string;
  tenantName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  date: string;
}

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch billing stats from API
  const { data: billingStats, isLoading: isBillingStatsLoading, isError: isBillingStatsError } = useQuery({
    queryKey: ['billing-stats'],
    queryFn: fetchBillingStats,
  });

  // Fetch invoices from API for Invoices tab
  const { data: invoicesData, isLoading: isInvoicesLoading, isError: isInvoicesError } = useQuery<InvoicesResponse>({
    queryKey: ['admin-invoices', searchQuery, statusFilter, page, rowsPerPage],
    queryFn: () => fetchAdminInvoices({
      search: searchQuery,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit: rowsPerPage,
    }),
  });

  // Mock data - replace with actual API calls
  const invoices: any[] = [
    {
      id: '1',
      tenantName: 'ABC Spinning Mills',
      tenantEmail: 'admin@abcspinning.com',
      invoiceNumber: 'INV-2024-001',
      amount: 299,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01',
      paidDate: '2024-01-10',
      plan: 'Premium',
      billingCycle: 'monthly',
      description: 'Premium Plan - January 2024'
    },
    {
      id: '2',
      tenantName: 'XYZ Textiles',
      tenantEmail: 'admin@xyztextiles.com',
      invoiceNumber: 'INV-2024-002',
      amount: 799,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-01-20',
      issueDate: '2024-01-05',
      paidDate: '2024-01-15',
      plan: 'Enterprise',
      billingCycle: 'monthly',
      description: 'Enterprise Plan - January 2024'
    },
    {
      id: '3',
      tenantName: 'DEF Yarn Co.',
      tenantEmail: 'admin@defyarn.com',
      invoiceNumber: 'INV-2024-003',
      amount: 99,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-01-10',
      issueDate: '2023-12-15',
      paidDate: '2023-12-20',
      plan: 'Basic',
      billingCycle: 'monthly',
      description: 'Basic Plan - December 2023'
    },
    {
      id: '4',
      tenantName: 'Millennium Spinners',
      tenantEmail: 'admin@millennium.com',
      invoiceNumber: 'INV-2024-004',
      amount: 299,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-01-25',
      issueDate: '2024-01-10',
      paidDate: '2024-01-18',
      plan: 'Premium',
      billingCycle: 'monthly',
      description: 'Premium Plan - January 2024'
    },
    {
      id: '5',
      tenantName: 'Cotton Weave Industries',
      tenantEmail: 'admin@cottonweave.com',
      invoiceNumber: 'INV-2024-005',
      amount: 599,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-02-15',
      issueDate: '2024-02-01',
      paidDate: '2024-02-10',
      plan: 'Premium',
      billingCycle: 'monthly',
      description: 'Premium Plan - February 2024'
    },
    {
      id: '6',
      tenantName: 'Silk Spinners Ltd',
      tenantEmail: 'admin@silk.com',
      invoiceNumber: 'INV-2024-006',
      amount: 399,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-02-20',
      issueDate: '2024-02-05',
      paidDate: '2024-02-12',
      plan: 'Premium',
      billingCycle: 'monthly',
      description: 'Premium Plan - February 2024'
    },
    {
      id: '7',
      tenantName: 'Wool Masters',
      tenantEmail: 'admin@wool.com',
      invoiceNumber: 'INV-2024-007',
      amount: 199,
      currency: 'USD',
      status: 'pending',
      dueDate: '2024-03-15',
      issueDate: '2024-03-01',
      plan: 'Basic',
      billingCycle: 'monthly',
      description: 'Basic Plan - March 2024'
    },
    {
      id: '8',
      tenantName: 'Fiber Tech Solutions',
      tenantEmail: 'admin@fibertech.com',
      invoiceNumber: 'INV-2024-008',
      amount: 899,
      currency: 'USD',
      status: 'paid',
      dueDate: '2024-03-20',
      issueDate: '2024-03-05',
      paidDate: '2024-03-15',
      plan: 'Enterprise',
      billingCycle: 'monthly',
      description: 'Enterprise Plan - March 2024'
    }
  ];

  const payments: Payment[] = [
    {
      id: '1',
      invoiceId: '1',
      tenantName: 'ABC Spinning Mills',
      amount: 299,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN-001',
      date: '2024-01-10'
    },
    {
      id: '2',
      invoiceId: '4',
      tenantName: 'Millennium Spinners',
      amount: 299,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      transactionId: 'TXN-002',
      date: '2024-01-18'
    },
    {
      id: '3',
      invoiceId: '2',
      tenantName: 'XYZ Textiles',
      amount: 799,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'pending',
      transactionId: 'TXN-003',
      date: '2024-01-19'
    }
  ];



  

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'invoices', label: 'Invoices', icon: FiDollarSign },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Billing & Revenue Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center md:text-left">
            Manage invoices, track payments, and monitor revenue across all tenants
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      {isBillingStatsLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading billing stats...</div>
      ) : isBillingStatsError ? (
        <div className="text-center py-8 text-red-500 dark:text-red-400">Failed to load billing stats.</div>
      ) : billingStats ? (
        <BillingStats stats={billingStats.stats} />
      ) : null}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
        <nav
            className="flex space-x-8 px-6 overflow-x-auto hide-scrollbar"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart invoices={invoices} />
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.tenantName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {payment.paymentMethod} • {payment.transactionId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${payment.amount}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search invoices or tenants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isInvoicesLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading invoices...</div>
              ) : isInvoicesError ? (
                <div className="text-center py-8 text-red-500 dark:text-red-400">Failed to load invoices.</div>
              ) : (
                <>
                  <InvoiceTable invoices={invoicesData?.invoices || []} />
                  <Pagination
                    page={invoicesData?.pagination.currentPage || 1}
                    setPage={setPage}
                    rowsPerPage={invoicesData?.pagination.itemsPerPage || rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    total={invoicesData?.pagination.totalItems || 0}
                    options={[5, 10, 20, 50]}
                  />
                </>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <PaymentHistory payments={payments} />
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Revenue</p>
                      <p className="text-2xl font-bold">$149,600</p>
                      <p className="text-blue-100 text-sm">+12% from last month</p>
                    </div>
                    <FiTrendingUp className="w-8 h-8" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Paid Invoices</p>
                      <p className="text-2xl font-bold">89%</p>
                      <p className="text-green-100 text-sm">+5% from last month</p>
                    </div>
                    <FiCheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Average Payment Time</p>
                      <p className="text-2xl font-bold">3.2 days</p>
                      <p className="text-orange-100 text-sm">-0.5 days from last month</p>
                    </div>
                    <FiClock className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              <RevenueChart invoices={invoices} />
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <CreateInvoiceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Billing; 