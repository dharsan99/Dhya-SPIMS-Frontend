import { useState } from 'react';

const Billing = () => {
  const [plan] = useState('Pro Plan');
  const [renewalDate] = useState('2025-05-15');
  const [usage] = useState({
    orders: 184,
    apiCalls: 13500,
    users: 12,
  });

  return (
    <div className="space-y-8 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
        Billing & Subscription
      </h2>

      {/* Current Plan */}
      <section className="border rounded p-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
        <h3 className="text-xl font-medium text-gray-800 dark:text-white">{plan}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your subscription renews on{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-200">{renewalDate}</span>.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
          Change Plan
        </button>
      </section>

      {/* Usage Summary */}
      <section className="border rounded p-6 bg-white dark:bg-gray-900 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Usage Summary</p>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li>
            Orders Placed:{' '}
            <span className="font-semibold text-gray-800 dark:text-white">{usage.orders}</span>
          </li>
          <li>
            API Calls:{' '}
            <span className="font-semibold text-gray-800 dark:text-white">{usage.apiCalls}</span>
          </li>
          <li>
            Users Active:{' '}
            <span className="font-semibold text-gray-800 dark:text-white">{usage.users}</span>
          </li>
        </ul>
      </section>

      {/* Billing History */}
      <section className="border rounded p-6 bg-white dark:bg-gray-900 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Billing History</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Billing history integration coming soon.
        </p>
      </section>
    </div>
  );
};

export default Billing;