import React, { useEffect, useState } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiSearch, FiDollarSign,
  FiUsers, FiCheck, FiBriefcase
} from 'react-icons/fi';
import SubscriptionFormModal from '../../components/superadmin/plans/SubscriptionFormModal';
import { useSubscriptionStore } from '@/stores/admin/useSubscriptionStore';
import { getStatusBadge } from '@/components/superadmin/plans/utils/planUtils';


const Plans: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const {
    subscriptions,
    isModalOpen,
    setModalOpen,
    editingSubscription,
    setEditingSubscription,
    addOrUpdateSubscription,
    setSubscriptions,
  } = useSubscriptionStore();
  
  useEffect(() => {
    setSubscriptions([
      {
        id: 'sub1',
        tenantName: 'Millennium Spinners Pvt Ltd',
        planName: 'Professional',
        description: 'Mid-sized spinning unit with growing digital needs',
        price: 299,
        billingCycle: 'monthly',
        maxUsers: 50,
        maxOrders: 10000,
        maxStorage: '25GB',
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-06-10',
      },
      {
        id: 'sub2',
        tenantName: 'CottonWeave Industries',
        planName: 'Enterprise',
        description: 'Large-scale mill with automation integrations',
        price: 799,
        billingCycle: 'monthly',
        maxUsers: -1,
        maxOrders: -1,
        maxStorage: 'Unlimited',
        status: 'active',
        createdAt: '2023-11-01',
        updatedAt: '2024-06-01',
      },
      {
        id: 'sub3',
        tenantName: 'Shree Textiles',
        planName: 'Basic',
        description: 'Small mill using standard tracking features',
        price: 99,
        billingCycle: 'monthly',
        maxUsers: 10,
        maxOrders: 1000,
        maxStorage: '5GB',
        status: 'inactive',
        createdAt: '2024-02-20',
        updatedAt: '2024-05-15',
      },
    ]);
  }, [setSubscriptions]);
 

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.planName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

 
  const formatLimit = (limit: number) => limit === -1 ? 'Unlimited' : limit.toLocaleString();

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
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((sub) => (
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
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                title="Delete subscription"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No subscriptions found matching your criteria.</p>
        </div>
      )}

      {/* Modal Placeholder */}
      <SubscriptionFormModal 
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            editingSubscription={editingSubscription}
            onSave={addOrUpdateSubscription}
          />

              </div>
            );
          };

export default Plans;
