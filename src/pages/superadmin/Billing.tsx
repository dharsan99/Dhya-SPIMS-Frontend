import React, { useState } from 'react';
import { 

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
import { fetchBillingStats, fetchAdminInvoices, InvoicesResponse, fetchPayments, PaymentsResponse, fetchRevenueTrends, RevenueTrendsResponse, fetchRecentPayments, RecentPayment } from '../../api/billing';
import { useDebounce } from '../../hooks/useDebounce';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 600);
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsRowsPerPage, setPaymentsRowsPerPage] = useState(20);
  const [paymentsSearch, setPaymentsSearch] = useState('');
  const debouncedPaymentsSearch = useDebounce(paymentsSearch, 600);
  const [paymentsStatus, setPaymentsStatus] = useState('all');
  const [paymentsMethod, setPaymentsMethod] = useState('all');

  // Fetch billing stats from API
  const { data: billingStats, isLoading: isBillingStatsLoading, isError: isBillingStatsError } = useQuery({
    queryKey: ['billing-stats'],
    queryFn: fetchBillingStats,
  });

  // Fetch invoices from API for Invoices tab
  const { data: invoicesData, isLoading: isInvoicesLoading, isError: isInvoicesError } = useQuery<InvoicesResponse>({
    queryKey: ['admin-invoices', debouncedSearchQuery, statusFilter, page, rowsPerPage],
    queryFn: () => fetchAdminInvoices({
      search: debouncedSearchQuery,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit: rowsPerPage,
    }),
  });

  console.log('data', invoicesData)

  const { data: revenueTrendsData, isLoading: isRevenueTrendsLoading, isError: isRevenueTrendsError } = useQuery<RevenueTrendsResponse>({
    queryKey: ['revenue-trends'],
    queryFn: fetchRevenueTrends,
  });

  

  const { data: paymentsData, isLoading: isPaymentsLoading, isError: isPaymentsError } = useQuery<PaymentsResponse>({
    queryKey: ['payments', debouncedPaymentsSearch, paymentsStatus, paymentsMethod, paymentsPage, paymentsRowsPerPage],
    queryFn: () => fetchPayments({
      search: debouncedPaymentsSearch || undefined,
      status: paymentsStatus === 'all' ? undefined : paymentsStatus,
      page: paymentsPage,
      limit: paymentsRowsPerPage,
    }),
  });

  const { data: recentPayments, isLoading: isRecentPaymentsLoading, isError: isRecentPaymentsError } = useQuery<RecentPayment[]>({
    queryKey: ['recent-payments'],
    queryFn: fetchRecentPayments,
  });

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
        {/*<button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create Invoice
        </button>*/}
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
                {isRevenueTrendsLoading ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading revenue trends...</div>
                ) : isRevenueTrendsError ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">Failed to load revenue trends.</div>
                ) : revenueTrendsData ? (
                  <RevenueChart revenueTrends={revenueTrendsData.revenueTrends} totalRevenue={revenueTrendsData.totalRevenue} averageMonthlyRevenue={revenueTrendsData.averageMonthlyRevenue} totalInvoices={revenueTrendsData.totalInvoices} changeFromLastMonth={revenueTrendsData.changeFromLastMonth} />
                ) : null}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {isRecentPaymentsLoading ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading recent activity...</div>
                    ) : isRecentPaymentsError ? (
                      <div className="text-center py-8 text-red-500 dark:text-red-400">Failed to load recent activity.</div>
                    ) : recentPayments && recentPayments.length > 0 ? (
                      recentPayments.map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.method} {payment.txn_id ? `• ${payment.txn_id}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{payment.amount}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activity found.</div>
                    )}
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
            isPaymentsLoading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading payments...</div>
            ) : isPaymentsError ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400">Failed to load payments.</div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${paymentsData?.totalAmount?.toLocaleString() ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{paymentsData?.Completed ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{paymentsData?.Pending ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">{paymentsData?.Failed ?? 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search payments or tenants..."
                      value={paymentsSearch}
                      onChange={e => setPaymentsSearch(e.target.value)}
                      className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={paymentsStatus}
                      onChange={e => setPaymentsStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <select
                      value={paymentsMethod}
                      onChange={e => setPaymentsMethod(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Methods</option>
                      <option value="creditcard">Credit Card</option>
                      <option value="creadit card">Creadit Card</option>
                      <option value="bank transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                {/* Payments Table */}
                <PaymentHistory payments={paymentsData?.payments || []} />
                <Pagination
                  page={paymentsData?.pagination.currentPage || 1}
                  setPage={setPaymentsPage}
                  rowsPerPage={paymentsData?.pagination.itemsPerPage || paymentsRowsPerPage}
                  setRowsPerPage={setPaymentsRowsPerPage}
                  total={paymentsData?.pagination.totalItems || 0}
                  options={[10, 20, 50]}
                />
              </>
            )
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