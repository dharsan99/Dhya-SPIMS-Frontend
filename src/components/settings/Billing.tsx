import { 
  ChartBarIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { UsageCard } from './billing/UsageCard';
import useAuthStore from '@/hooks/auth';
import { useQuery } from '@tanstack/react-query';
import { fetchSubscription, fetchUsage, fetchBillingHistory } from '@/api/subscription';

const Billing = () => {
  const auth = useAuthStore();
  const tenantId = auth.user?.tenant_id || '';

  const { data, isLoading } = useQuery({
    queryKey: ['subscription', tenantId],
    queryFn: () => fetchSubscription(tenantId),
    enabled: !!tenantId,
  });

  const subscription = data?.[0]; // assuming array response
  const plan = subscription?.plan ?? 'N/A';
  const renewalDate = subscription?.renewalDate ?? '';
  const amount = subscription?.amount ?? 0;
  const billingCycle = subscription?.billingCycle ?? '';

  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ['usage'],
    queryFn: fetchUsage,
  });
  const usage = usageData?.usage;

  const { data: billingHistory, isLoading: billingLoading } = useQuery({
    queryKey: ['billing-history', tenantId],
    queryFn: () => fetchBillingHistory(tenantId),
    enabled: !!tenantId,
  });

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        <ExclamationTriangleIcon className="h-4 w-4 mr-1" /> Pending
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2.5 md:gap-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Billing & Subscription
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-center md:text-left">
            Manage your subscription and view billing history
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
          💳 Update Payment Method
        </button>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 min-h-[150px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-24">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : subscription ? (
          <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-2.5 md:gap-0 w-full">
            <div className="flex flex-col items-center md:items-start justify-center md:justify-start w-full md:w-auto">
              <div className="flex flex-col gap-2 mb-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">💳 Current Plan</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                📅 Renews on {renewalDate ? formatDate(renewalDate) : 'N/A'}
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Change Plan
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  Cancel Subscription
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center md:items-end w-full md:w-auto">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {amount === 0 ? 'Free' : `$${amount}`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {billingCycle === 'trial' ? 'Trial period' : `per ${billingCycle}`}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center w-full text-gray-500 dark:text-gray-400">No subscription data found.</div>
        )}
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {usageLoading ? (
          <div className="col-span-4 flex justify-center items-center h-24">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <UsageCard
              title="Orders"
              value={usage?.orders?.count ?? 0}
              icon={<ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />}
              trend={usage?.orders?.trend ?? '0%'}
              trendColor="text-green-600 dark:text-green-400"
            />
            <UsageCard
              title="API Calls"
              value={usage?.apiCalls?.count?.toLocaleString() ?? '0'}
              icon={<DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              trend={usage?.apiCalls?.trend ?? '0%'}
              trendColor="text-green-600 dark:text-green-400"
            />
            <UsageCard
              title="Active Users"
              value={usage?.users?.count ?? 0}
              icon={<UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
              trend={usage?.users?.trend ?? ''}
              trendColor="text-green-600 dark:text-green-400"
            />
            <UsageCard
              title="Storage Used"
              value={usage?.storage?.used ?? '0 GB'}
              icon={<CloudIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
              trend={usage?.storage?.trend ?? '0%'}
              trendColor="text-red-600 dark:text-red-400"
            />
          </>
        )}
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View and download your past invoices
          </p>
        </div>
        
        <div className="overflow-x-auto">
          {billingLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : billingHistory && billingHistory.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {billingHistory.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invoice.invoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No billing history found.
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {billingHistory?.length} of {billingHistory?.length} invoices
            </p>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200">
              View All Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing; 