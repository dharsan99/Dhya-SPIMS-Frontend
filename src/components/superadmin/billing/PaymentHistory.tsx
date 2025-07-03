import React, { useState } from 'react';
import { FiSearch, FiEye, FiDownload, FiCheckCircle, FiXCircle, FiClock, FiCreditCard } from 'react-icons/fi';

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

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMethodIcon = () => {
    return <FiCreditCard className="w-4 h-4 text-gray-500" />;
  };

  const handleViewPayment = (payment: Payment) => {
    // Implement view payment functionality
    console.log('View payment:', payment);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // Implement download receipt functionality
    console.log('Download receipt:', payment);
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(payment => payment.status === 'completed').length;
  const pendingPayments = filteredPayments.filter(payment => payment.status === 'pending').length;
  const failedPayments = filteredPayments.filter(payment => payment.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${totalAmount.toLocaleString()}</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{completedPayments}</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{pendingPayments}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{failedPayments}</p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments or tenants..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.transactionId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Invoice: {payment.invoiceId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.tenantName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${payment.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodIcon()}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        title="View payment details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                        title="Download receipt"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <FiCreditCard className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No payments found</p>
              <p className="text-sm">No payment transactions match your criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 