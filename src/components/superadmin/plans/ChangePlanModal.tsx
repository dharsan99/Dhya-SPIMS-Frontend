import React, { useState } from 'react';
import Modal from '../../SuperAdminModal';
import Select from 'react-select';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: any;
  plans: { id: string; name: string; price: number; billingCycle: string }[];
  onChangePlan: (newPlanId: string, reason?: string) => void;
}

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({ isOpen, onClose, subscription, plans, onChangePlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [reason, setReason] = useState('');

  if (!isOpen || !subscription) return null;

  const planOptions = plans.map(plan => ({
    value: plan.id,
    label: `${plan.name} ($${plan.price}/${plan.billingCycle === 'monthly' ? 'mo' : 'yr'})`,
  }));

  const currentPlan = plans.find(p => p.name === subscription.planName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    onChangePlan(selectedPlan.value, reason);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2 text-center">Change Plan</h2>
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current Plan</div>
          <div className="font-semibold text-lg text-gray-900 dark:text-white">
            {currentPlan ? `${currentPlan.name} ($${currentPlan.price}/${currentPlan.billingCycle === 'monthly' ? 'mo' : 'yr'})` : subscription.planName}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Select New Plan</label>
          <Select
            options={planOptions}
            value={selectedPlan}
            onChange={setSelectedPlan}
            placeholder="Choose a new plan"
            className="text-black dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason for plan change"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!selectedPlan}
          >
            Confirm Change
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePlanModal; 