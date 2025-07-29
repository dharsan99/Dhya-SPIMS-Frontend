import { downloadInvoice, sendInvoiceEmail } from '@/api/billing';
import useAuthStore from '@/hooks/auth';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { FiDownload, FiMail, FiDollarSign } from 'react-icons/fi';

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
  const { user } = useAuthStore();
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  const sendEmailMutation = useMutation({
    mutationFn: (invoiceNumber: string) => sendInvoiceEmail(invoiceNumber),
    onSuccess: () => {
      toast.success('Invoice email sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send invoice email.');
    },
  });

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

 /* const handleViewInvoice = (invoice: Invoice) => {
    // Implement view invoice functionality
    console.log('View invoice:', invoice);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // Implement edit invoice functionality
    console.log('Edit invoice:', invoice);
  }
  const handleDeleteInvoice = (invoice: Invoice) => {
    // Implement delete invoice functionality
    console.log('Delete invoice:', invoice);
  };*/


  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      setDownloadingId(invoice.id);
      // Get the token and tenantId from your auth context or storage
      const token = useAuthStore.getState().token ?? '';
      const tenantId = user?.tenantId || ''// adjust as per your data
  
      const blob = await downloadInvoice({
        invoice_number: invoice.invoiceNumber,
        tenant_id: tenantId,
        token,
      });
  
      // Create a link and trigger download
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice Downloaded Sucessfully')
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendInvoice = (invoice: Invoice) => {
    sendEmailMutation.mutate(invoice.invoiceNumber);
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
                    {/*<button
                      onClick={() => handleViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="View invoice"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>*/}
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Download invoice"
                      disabled={downloadingId === invoice.id}
                    >
                      {downloadingId === invoice.id ? (
                        <svg className="animate-spin h-4 w-4 text-green-600" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      ) : (
                        <FiDownload className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSendInvoice(invoice)}
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                      title="Send invoice"
                      disabled={sendEmailMutation.isPending && sendEmailMutation.variables === invoice.invoiceNumber}
                    >
                      {sendEmailMutation.isPending && sendEmailMutation.variables === invoice.invoiceNumber ? (
                        <svg className="animate-spin h-4 w-4 text-purple-600" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      ) : (
                        <FiMail className="w-4 h-4" />
                      )}
                    </button>
                   {/*<button
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
                    </button>*/}
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