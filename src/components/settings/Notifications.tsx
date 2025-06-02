import { useState } from 'react';

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [productionReminders, setProductionReminders] = useState(true);

  const NotificationToggle = ({
    label,
    description,
    value,
    onChange,
  }: {
    label: string;
    description: string;
    value: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded shadow border dark:border-gray-700 transition-colors">
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-700 rounded-full peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:dark:bg-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
        Notifications & Alerts
      </h2>

      <NotificationToggle
        label="Email Notifications"
        description="Receive important alerts and updates via email."
        value={emailNotifications}
        onChange={setEmailNotifications}
      />

      <NotificationToggle
        label="SMS Alerts"
        description="Enable SMS notifications for production milestones."
        value={smsAlerts}
        onChange={setSmsAlerts}
      />

      <NotificationToggle
        label="Production Reminders"
        description="Get reminders for scheduled production tasks or delays."
        value={productionReminders}
        onChange={setProductionReminders}
      />
    </div>
  );
};

export default Notifications;