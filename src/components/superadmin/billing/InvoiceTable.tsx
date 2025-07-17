import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiDownload, FiMail, FiDollarSign } from 'react-icons/fi';

interface Invoice {
  id: string;
  tenantName: string;
  tenantEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  plan: string;
  billingCycle: 'monthly' | 'yearly';
  description: string;
}

interface InvoiceTableProps {
  invoices: any[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planClasses = {
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${planClasses[plan.toLowerCase() as keyof typeof planClasses] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
        {plan}
      </span>
    );
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Implement view invoice functionality
    console.log('View invoice:', invoice);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // Implement edit invoice functionality
    console.log('Edit invoice:', invoice);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    // Implement delete invoice functionality
    console.log('Delete invoice:', invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implement download invoice functionality
    console.log('Download invoice:', invoice);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    // Implement send invoice functionality
    console.log('Send invoice:', invoice);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.tenantName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.tenantEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${invoice.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.billingCycle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPlanBadge(invoice.plan)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="View invoice"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Download invoice"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendInvoice(invoice)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                      title="Send invoice"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditInvoice(invoice)}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                      title="Edit invoice"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(invoice)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Delete invoice"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <FiDollarSign className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No invoices found</p>
            <p className="text-sm">Create your first invoice to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable; 