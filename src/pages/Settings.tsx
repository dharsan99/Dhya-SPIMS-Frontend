import { useState } from 'react';
import OrgSettings from '../components/settings/OrgSettings';
import UserAccess from '../components/settings/UserAccess';
import AppPreferences from '../components/settings/AppPreferences';
import Notifications from '../components/settings/Notifications';
import Billing from '../components/settings/Billing';
import Integrations from '../components/settings/Integrations';

const Settings = () => {
  const [tab, setTab] = useState('organization');

  const tabList = [
    { key: 'organization', label: 'Organization' },
    { key: 'userAccess', label: 'User Access' },
    { key: 'preferences', label: 'Preferences' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'billing', label: 'Billing' },
    { key: 'integrations', label: 'Integrations' },
  ];

  const renderTabContent = () => {
    switch (tab) {
      case 'organization':
        return <OrgSettings />;
      case 'userAccess':
        return <UserAccess />;
      case 'preferences':
        return <AppPreferences />;
      case 'notifications':
        return <Notifications />;
      case 'billing':
        return <Billing />;
      case 'integrations':
        return <Integrations />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabList.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 border-b-2 transition-colors duration-300 ${
              tab === key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow transition-colors duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;