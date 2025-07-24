import React, { JSX, useState } from 'react';
import MarketingTabs from '../components/Marketing/MarketingTabs';
import { FiMail, FiList, FiFileText, FiUserPlus, FiBarChart, FiRefreshCw } from 'react-icons/fi';

export type TabKey = 'bulk' | 'lists' | 'templates' | 'potential' | 'analytics' | 'recovery';

const tabLabels: { key: TabKey; icon: JSX.Element; label: string }[] = [
    { key: 'bulk', icon: <FiMail className="w-4 h-4" />, label: 'Bulk Email' },
    { key: 'lists', icon: <FiList className="w-4 h-4" />, label: 'Mailing Lists' },
    { key: 'templates', icon: <FiFileText className="w-4 h-4" />, label: 'Templates' },
    { key: 'potential', icon: <FiUserPlus className="w-4 h-4" />, label: 'Potential Buyers' },
    { key: 'analytics', icon: <FiBarChart className="w-4 h-4" />, label: 'Analytics' },
    { key: 'recovery', icon: <FiRefreshCw className="w-4 h-4" />, label: 'Email Recovery' },
  ];

const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('bulk');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Marketing</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage mailing lists, email templates, send targeted emails to buyers, and track email performance.
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {tabLabels.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <MarketingTabs activeTab={activeTab} />
      </div>
    </div>
  );
};

export default MarketingPage;