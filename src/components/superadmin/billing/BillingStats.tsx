import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface BillingStatsProps {
  invoices: Invoice[];
  payments: Payment[];
}

const BillingStats: React.FC<BillingStatsProps> = ({ invoices }) => {
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const overdueAmount = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const totalInvoices = invoices.length;
  const paidPercentage = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;


  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FiDollarSign,
      color: 'bg-blue-500',
      description: 'Total revenue collected'
    },
    {
      title: 'Pending Amount',
      value: `$${pendingAmount.toLocaleString()}`,
      change: '+5%',
      changeType: 'neutral' as const,
      icon: FiClock,
      color: 'bg-yellow-500',
      description: 'Amount awaiting payment'
    },
    {
      title: 'Overdue Amount',
      value: `$${overdueAmount.toLocaleString()}`,
      change: '-8%',
      changeType: 'negative' as const,
      icon: FiXCircle,
      color: 'bg-red-500',
      description: 'Amount past due date'
    },
    {
      title: 'Payment Rate',
      value: `${paidPercentage}%`,
      change: '+3%',
      changeType: 'positive' as const,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      description: 'Percentage of paid invoices'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                stat.changeType === 'positive'
                  ? 'text-green-600 dark:text-green-400'
                  : stat.changeType === 'negative'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {stat.changeType === 'positive' && <FiTrendingUp className="w-3 h-3" />}
              {stat.changeType === 'negative' && <FiTrendingDown className="w-3 h-3" />}
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillingStats; 