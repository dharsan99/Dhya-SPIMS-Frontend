import { useState } from 'react';
import {
  FiPlus, FiEdit, FiSearch, FiDollarSign,
  FiUsers, FiCheck, FiBriefcase
} from 'react-icons/fi';
import SubscriptionFormModal from '../../components/superadmin/plans/SubscriptionFormModal';
import { getStatusBadge } from '@/components/superadmin/plans/utils/planUtils';
import ChangePlanModal from '../../components/superadmin/plans/ChangePlanModal';
import { toast } from 'sonner';
import { fetchTenantSubscriptions, FetchTenantSubscriptionsResponse } from '../../api/superadminsubscriptions';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/components/Pagination';
import { fetchSuperAdminTenants } from '@/api/superadmintenants';
import { getPlans } from '@/api/plans';
import { useDebounce } from '@/hooks/useDebounce';


function Plans() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 600)
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useQuery<FetchTenantSubscriptionsResponse>({
    queryKey: ['superadmin-subscriptions', searchQuery, statusFilter, planFilter, page, rowsPerPage],
    queryFn: () => fetchTenantSubscriptions({
      search: debouncedSearch,
      status: statusFilter,
      plan: planFilter ? planFilter : undefined,
      page,
      limit: rowsPerPage,
    }),
    retry: false,
  });

  const subscriptions = data?.subscriptions ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: rowsPerPage };

  const filteredSubscriptions: import('../../api/superadminsubscriptions').TenantSubscription[] = subscriptions; // Filtering is now server-side
 

  const formatLimit = (limit: number) => limit === -1 ? 'Unlimited' : limit.toLocaleString();

  const tenantsQuery = useQuery({
    queryKey: ['superadmin-tenants'],
    queryFn: () => fetchSuperAdminTenants({ page: 1, limit: 100 })
  });
  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans
  });

  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [changePlanSub, setChangePlanSub] = useState<any>(null);

  const handleChangePlan = (newPlanId: string, reason?: string) => {
    // Find the new plan
    const newPlan = (Array.isArray(plansQuery.data) ? plansQuery.data : []).find((p: { id: string }) => p.id === newPlanId);
    if (!newPlan || !changePlanSub) return;
    toast.success(`Plan changed to ${newPlan.name}${reason ? ` (Reason: ${reason})` : ''}`);
  };

  // Add modal state and editingSubscription state
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const addOrUpdateSubscription = () => {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Tenant Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center md:text-left">
            Super-admin view of all tenant SaaS plans
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSubscription(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create Subscription
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tenants or plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="sm:w-48">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Filter by Plan</option>
            <option value="Starter (14-day trial)">Starter (14-day trial)</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Growth">Growth</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No subscriptions found matching your criteria.</p>
          </div>
        ) : (
          filteredSubscriptions.map((sub: import('../../api/superadminsubscriptions').TenantSubscription) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {sub.tenantName}
                  </h3>
                  {getStatusBadge(sub.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{sub.description}</p>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  Plan: <strong>{sub.planName}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  ${sub.price} / {sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Users: {formatLimit(sub.maxUsers)}
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  Orders: {formatLimit(sub.maxOrders)}
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  Storage: {sub.maxStorage}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingSubscription(sub);
                    setModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                  title="Edit subscription"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setChangePlanSub(sub);
                    setChangePlanModalOpen(true);
                  }}
                  className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1"
                  title="Change plan"
                >
                  <FiBriefcase className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          page={pagination.currentPage || 1}
          setPage={setPage}
          rowsPerPage={pagination.itemsPerPage || rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={pagination.totalItems || 0}
          options={[5, 10, 20, 50]}
        />
      </div>

      {/* Modal Placeholder */}
      {/* <SubscriptionFormModal 
            // isOpen={isModalOpen} // This state is no longer managed by the store
            // onClose={() => setModalOpen(false)} // This state is no longer managed by the store
            // editingSubscription={editingSubscription} // This state is no longer managed by the store
            // onSave={addOrUpdateSubscription} // This state is no longer managed by the store
            // tenants={tenants}
          />*/}
      {/* Render the SubscriptionFormModal */}
      {!tenantsQuery.isLoading && !plansQuery.isLoading && (
        <SubscriptionFormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={addOrUpdateSubscription}
          editingSubscription={editingSubscription}
          tenants={tenantsQuery.data?.tenants || []}
          plans={Array.isArray(plansQuery.data) ? plansQuery.data : []}
          onSubscriptionCreated={() => setModalOpen(false)}
        />
      )}
      <ChangePlanModal
        isOpen={changePlanModalOpen}
        onClose={() => setChangePlanModalOpen(false)}
        subscription={changePlanSub}
        plans={Array.isArray(plansQuery.data) ? plansQuery.data : []}
        onChangePlan={handleChangePlan}
      />

              </div>
            );
          };

export default Plans;
