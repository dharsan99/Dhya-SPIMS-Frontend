import React from 'react';

interface SettingsRowProps {
  title: string;
  description: string;
  stat: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, description, stat }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <div className="text-right">
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{stat}</div>
    </div>
  </div>
);

const SuperAdminSettings: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Platform Settings
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Manage global configurations for the entire platform.
      </p>

      {/* Settings Sections */}
      <div className="space-y-8">

        {/* Tenant Management */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Tenant Defaults</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <SettingsRow 
              title="Default Plan" 
              description="The plan assigned to new tenants upon registration." 
              stat="Basic Tier"
            />
            <SettingsRow 
              title="Inactive Account Purge" 
              description="Automatically delete accounts after a period of inactivity." 
              stat="After 180 days"
            />
          </div>
        </div>

        {/* Billing & Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Billing & Plans</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <SettingsRow 
              title="Payment Gateway" 
              description="The primary processor for all subscription payments." 
              stat="Stripe Connected"
            />
            <SettingsRow 
              title="Currency" 
              description="Default currency used for all plans and invoices." 
              stat="USD ($)"
            />
          </div>
        </div>

        {/* System Maintenance */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">System Maintenance</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <SettingsRow 
              title="Maintenance Mode" 
              description="Temporarily restrict access to the platform for updates." 
              stat="Currently Inactive"
            />
            <SettingsRow 
              title="Health Check Alerts" 
              description="Notify admins if system health checks fail." 
              stat="Enabled"
            />
          </div>
        </div>

        {/* Security Policies */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Security Policies</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <SettingsRow 
              title="Global Password Policy" 
              description="Enforce minimum password complexity for all users." 
              stat="8 characters, 1 number"
            />
             <SettingsRow 
              title="Admin 2FA Requirement" 
              description="Require two-factor authentication for all tenant admins." 
              stat="Optional"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminSettings; 