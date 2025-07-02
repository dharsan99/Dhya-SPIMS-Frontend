import React, { useState } from 'react';
import { FiX, FiDollarSign, FiUsers, FiFileText } from 'react-icons/fi';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any; // For editing existing invoice
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  const [formData, setFormData] = useState({
    tenantName: invoice?.tenantName || '',
    tenantEmail: invoice?.tenantEmail || '',
    plan: invoice?.plan || 'Premium',
    billingCycle: invoice?.billingCycle || 'monthly',
    amount: invoice?.amount || '',
    description: invoice?.description || '',
    issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    currency: invoice?.currency || 'USD'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const plans = [
    { value: 'Basic', label: 'Basic Plan', price: 99 },
    { value: 'Premium', label: 'Premium Plan', price: 299 },
    { value: 'Enterprise', label: 'Enterprise Plan', price: 799 }
  ];

  const billingCycles = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'INR', label: 'INR (₹)' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-fill amount when plan changes
    if (field === 'plan') {
      const selectedPlan = plans.find(p => p.value === value);
      if (selectedPlan) {
        setFormData(prev => ({ ...prev, amount: selectedPlan.price.toString() }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tenant name is required';
    }

    if (!formData.tenantEmail.trim()) {
      newErrors.tenantEmail = 'Tenant email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = 'Please enter a valid email address';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically make an API call to create/update the invoice
      
      // Simulate API call
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData({
          tenantName: '',
          tenantEmail: '',
          plan: 'Premium',
          billingCycle: 'monthly',
          amount: '',
          description: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          currency: 'USD'
        });
        setErrors({});
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tenant Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2" />
              Tenant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenant Name *
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.tenantName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter tenant name"
                />
                {errors.tenantName && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenant Email *
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => handleInputChange('tenantEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.tenantEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter tenant email"
                />
                {errors.tenantEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenantEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiDollarSign className="w-5 h-5 mr-2" />
              Billing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => handleInputChange('plan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {plans.map(plan => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label} - ${plan.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Billing Cycle
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {billingCycles.map(cycle => (
                    <option key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiFileText className="w-5 h-5 mr-2" />
              Invoice Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter invoice description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {invoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal; 